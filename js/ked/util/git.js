var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var git

import kxk from "../../kxk.js"
let slash = kxk.slash
let post = kxk.post
let kermit = kxk.kermit
let nfs = kxk.nfs

import watcher from "./watcher.js"

import child_process from "child_process"


git = (function ()
{
    git["statusRequests"] = {}
    git["statusCache"] = {}
    function git ()
    {
        this["onFileChange"] = this["onFileChange"].bind(this)
        this["onProjectIndexed"] = this["onProjectIndexed"].bind(this)
        this.gitDirs = []
        post.on('project.indexed',this.onProjectIndexed)
        post.on('file.change',this.onFileChange)
    }

    git.prototype["onProjectIndexed"] = async function (prjPath)
    {
        var gitDir

        gitDir = await git.dir(prjPath)
        if (!_k_.empty(gitDir) && !(_k_.in(gitDir,this.gitDirs)))
        {
            return this.gitDirs.push(slash.path(gitDir,'.git'))
        }
    }

    git.prototype["onFileChange"] = function (info)
    {
        var gitDir

        if (slash.file(info.path) === 'ked.log')
        {
            return
        }
        var list = _k_.list(this.gitDirs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            gitDir = list[_a_]
            if (info.path.startsWith(gitDir))
            {
                if (slash.dir(info.path).endsWith('.git/refs/heads'))
                {
                    if (_k_.in(slash.name(info.path),['master','main']))
                    {
                        git.status(slash.dir(gitDir))
                        return
                    }
                }
            }
        }
    }

    git["dir"] = async function (path)
    {
        return await nfs.git(path)
    }

    git["exec"] = async function (args, opt)
    {
        return new Promise(function (resolve, reject)
        {
            var cmd

            try
            {
                cmd = '/usr/bin/git ' + args
                return child_process.exec(cmd,opt,function (err, stdout, stderr)
                {
                    if (_k_.empty(err))
                    {
                        return resolve(stdout)
                    }
                    else
                    {
                        if (err.code === 128 && _k_.in("is outside repository",stderr))
                        {
                            return
                        }
                        if (err.code === 'ENOENT' && _k_.in('diff',args))
                        {
                            return
                        }
                        console.error(err)
                        console.error(stdout)
                        console.error(stderr)
                    }
                })
            }
            catch (err)
            {
                console.error('reject2',err)
            }
        })
    }

    git["status"] = async function (path)
    {
        var dirSet, file, gitDir, gitStatus, header, key, line, lines, rel, status

        gitDir = await git.dir(path)
        status = {gitDir:gitDir,changed:[],deleted:[],added:[],files:{}}
        if (_k_.empty(gitDir))
        {
            return status
        }
        if (this.statusRequests[gitDir])
        {
            return status
        }
        this.statusRequests[gitDir] = true
        gitStatus = await git.exec('status --porcelain',{cwd:gitDir})
        delete this.statusRequests[gitDir]
        if (gitStatus.startsWith('fatal:'))
        {
            return status
        }
        lines = gitStatus.split('\n')
        dirSet = new Set
        while (line = lines.shift())
        {
            rel = line.slice(3)
            file = slash.path(gitDir,rel)
            while ((rel = slash.dir(rel)) !== '')
            {
                dirSet.add(rel)
            }
            header = line.slice(0,2)
            switch (header)
            {
                case ' D':
                    status.deleted.push(file)
                    break
                case 'MM':
                case 'M ':
                case ' M':
                    status.changed.push(file)
                    break
                case '??':
                    status.added.push(file)
                    break
            }

        }
        status.dirs = Array.from(dirSet).map(function (d)
        {
            return slash.path(gitDir,d)
        })
        var list = ['changed','added','deleted']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            key = list[_a_]
            var list1 = _k_.list(status[key])
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                file = list1[_b_]
                status.files[file] = key
            }
        }
        post.emit('git.status',status)
        this.statusCache[gitDir] = status
        return status
    }

    git["diff"] = async function (file)
    {
        var after, afterSplit, before, change, diff, gitDir, i, line, lines, newLines, numNew, numOld, oldLines, status, x, _173_55_, _174_48_

        gitDir = await git.dir(file)
        await watcher.snapshot(file)
        diff = await git.exec(`--no-pager diff --no-color -U0 --ignore-blank-lines ${file}`,{cwd:gitDir})
        diff += await git.exec(`--no-pager diff --staged --no-color -U0 --ignore-blank-lines ${file}`,{cwd:gitDir})
        status = {file:file,changes:[]}
        lines = diff.split('\n')
        while (line = lines.shift())
        {
            if (line.startsWith('@@'))
            {
                var _a_ = line.split(' '); x = _a_[0]; before = _a_[1]; after = _a_[2]

                afterSplit = after.split(',')
                numOld = parseInt(((_173_55_=before.split(',')[1]) != null ? _173_55_ : 1))
                numNew = parseInt(((_174_48_=afterSplit[1]) != null ? _174_48_ : 1))
                change = {line:parseInt(afterSplit[0])}
                oldLines = []
                for (var _b_ = i = 0, _c_ = numOld; (_b_ <= _c_ ? i < numOld : i > numOld); (_b_ <= _c_ ? ++i : --i))
                {
                    oldLines.push(lines.shift().slice(1))
                }
                while (_k_.first(lines)[0] === '\\')
                {
                    lines.shift()
                }
                newLines = []
                for (var _d_ = i = 0, _e_ = numNew; (_d_ <= _e_ ? i < numNew : i > numNew); (_d_ <= _e_ ? ++i : --i))
                {
                    newLines.push(lines.shift().slice(1))
                }
                while (_k_.first(lines)[0] === '\\')
                {
                    lines.shift()
                }
                if (oldLines.length)
                {
                    change.old = oldLines
                }
                if (newLines.length)
                {
                    change.new = newLines
                }
                if (numOld && numNew)
                {
                    change.mod = []
                    for (var _f_ = i = 0, _10_ = _k_.min(numOld,numNew); (_f_ <= _10_ ? i < _k_.min(numOld,numNew) : i > _k_.min(numOld,numNew)); (_f_ <= _10_ ? ++i : --i))
                    {
                        change.mod.push({old:change.old[i],new:change.new[i]})
                    }
                }
                if (numOld > numNew)
                {
                    change.del = []
                    for (var _11_ = i = numNew, _12_ = numOld; (_11_ <= _12_ ? i < numOld : i > numOld); (_11_ <= _12_ ? ++i : --i))
                    {
                        change.del.push({old:change.old[i]})
                    }
                }
                else if (numNew > numOld)
                {
                    change.add = []
                    for (var _13_ = i = numOld, _14_ = numNew; (_13_ <= _14_ ? i < numNew : i > numNew); (_13_ <= _14_ ? ++i : --i))
                    {
                        change.add.push({new:change.new[i]})
                    }
                }
                status.changes.push(change)
            }
        }
        post.emit('git.diff',status)
        return status
    }

    git["patch"] = async function (rev)
    {
        var currentFile, diffgit, gitDir, patch, patches, r

        currentFile = ked_session.get('editor▸file')
        gitDir = await git.dir(currentFile)
        patch = await git.exec(`--no-pager diff ${rev}^..${rev} --no-color -U0 --ignore-blank-lines`,{cwd:gitDir})
        patch = '\n' + patch
        patches = []
        var list = _k_.list(patch.split('\ndiff --git '))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            diffgit = list[_a_]
            if (_k_.empty(diffgit))
            {
                continue
            }
            try
            {
                r = kermit(`diff --git ●path
index ●refs
--- ●srcfile
+++ ●tgtfile
■changes
    @@ ●lineinfo @@
    ■changedlines
        ●type ○line`,'diff --git ' + diffgit)
                patches = patches.concat(r)
            }
            catch (err)
            {
                true
            }
        }
        return patches
    }

    git["history"] = async function (path)
    {
        var args, currentFile, cwd, history

        args = ["--no-pager","log","--name-status","--no-color",'.']
        if (path)
        {
            args.push(path)
            cwd = slash.dir(path)
        }
        else
        {
            currentFile = ked_session.get('editor▸file')
            cwd = await git.dir(currentFile)
        }
        history = await git.exec(args.join(' '),{cwd:cwd})
        return kermit(`commit  ●commit
Author: ●author
Date:   ●date
●msg
■files
    ●type ●path`,history)
    }

    return git
})()

export default git;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2dpdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW9CUSxLQUFDO1FBRUQsS0FBSyxHQUFHLGtCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxjQUFrQixLQUFDOzs7Ozs7O1FBSTNCLGVBQVUsSUFBSSxJQUFJO3VCQUVULG9CQUFXLE9BQWMsS0FBQzs7bUJBQy9CLEtBQUMsUUFBUSxLQUFLLE1BQU0sS0FBSyxPQUFPOzs7Ozs7OztZQVcvQixNQUFNLEtBQUssS0FBSyxVQUFTOzs7OzRCQUVoQixLQUFDOzs7O2dCQUVSLEtBQUssS0FBSyxXQUFXOztvQkFDakIsTUFBTSxJQUFJLEtBQUssTUFBTSxTQUFTOzsrQkFDMUIsTUFBTSxLQUFLLEtBQUssT0FBVSxTQUFTOzt3QkFFbEMsSUFBSSxPQUFPLE1BQU0sSUFBSTs7Ozs7Ozs7OztxQkFHeEIsSUFBSSxJQUFJOzs7OzttQkFVakI7Ozs7OztnQkFJSSxNQUFNLGtCQUFrQjt1QkFDeEIsY0FBYyxLQUFLLElBQUk7O2tDQUVWOzsrQkFDTCxRQUFROzs7OzRCQUdILElBQUksU0FBUSxjQUFRLHdCQUEyQjs7Ozs0QkFFL0MsSUFBSSxTQUFRLG1CQUFhLE9BQVU7Ozs7d0JBQ3hDLGNBQU07d0JBQ04sY0FBTTt3QkFDTixjQUFNOzs7O21CQUVaOztnQkFDRixjQUFNLFVBQVU7Ozs7Ozs7OztRQWN4QixlQUFVLElBQUksSUFBSTtRQUVsQixVQUNJLE9BQVMsT0FDVCxXQUNBLFdBQ0EsU0FDQTtzQkFFZTs7bUJBQWhCOztZQUNVLEtBQUMsZUFBZTs7bUJBQTFCOztRQUVILEtBQUMsZUFBZSxVQUFVO1FBRTFCLGtCQUFhLElBQUksS0FBSyxzQkFBcUIsSUFBSTtlQUV4QyxLQUFDLGVBQWU7WUFFVixVQUFVLFdBQVc7O21CQUEvQjs7UUFFSCxRQUFRLFVBQVUsTUFBTTtRQUV4QixhQUFhO2VBRVAsT0FBTyxNQUFNOztZ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/git.kode
