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
                        console.log(`git.onFileChange + ${gitDir} ${info.path}`)
                        console.log(`git.onFileChange + ${slash.dir(gitDir)}`)
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
                        console.error('reject1',err)
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
        console.log(`git.status --- post ${gitDir} ${path}`,status)
        post.emit('git.status',status)
        this.statusCache[gitDir] = status
        return status
    }

    git["diff"] = async function (file)
    {
        var after, afterSplit, before, change, diff, gitDir, i, line, lines, newLines, numNew, numOld, oldLines, status, x, _169_55_, _170_48_

        gitDir = await git.dir(file)
        console.log(`git.diff --- ${gitDir} ${file}`)
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
                numOld = parseInt(((_169_55_=before.split(',')[1]) != null ? _169_55_ : 1))
                numNew = parseInt(((_170_48_=afterSplit[1]) != null ? _170_48_ : 1))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2dpdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW9CUSxLQUFDO1FBRUQsS0FBSyxHQUFHLGtCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxjQUFrQixLQUFDOzs7Ozs7O1FBSTNCLGVBQVUsSUFBSSxJQUFJO3VCQUVULG9CQUFXLE9BQWMsS0FBQzs7bUJBQy9CLEtBQUMsUUFBUSxLQUFLLE1BQU0sS0FBSyxPQUFPOzs7Ozs7OztZQVcvQixNQUFNLEtBQUssS0FBSyxVQUFTOzs7OzRCQUVoQixLQUFDOzs7O2dCQUVSLEtBQUssS0FBSyxXQUFXOztvQkFDakIsTUFBTSxJQUFJLEtBQUssTUFBTSxTQUFTOzsrQkFDMUIsTUFBTSxLQUFLLEtBQUssT0FBVSxTQUFTOzt3QkFDbEMsa0NBQTBCLFVBQVUsS0FBSzt3QkFDekMsa0NBQTBCLE1BQU0sSUFBSTt3QkFDcEMsSUFBSSxPQUFPLE1BQU0sSUFBSTs7Ozs7Ozs7OztxQkFHeEIsSUFBSSxJQUFJOzs7OzttQkFVakI7Ozs7OztnQkFJSSxNQUFNLGtCQUFrQjt1QkFDeEIsY0FBYyxLQUFLLElBQUk7O2tDQUVWOzsrQkFDTCxRQUFROzs7O3dCQUVSLGNBQU0sVUFBVTs7OzttQkFFdEI7O2dCQUNGLGNBQU0sVUFBVTs7Ozs7Ozs7O1FBY3hCLGVBQVUsSUFBSSxJQUFJO1FBR2xCLFVBQ0ksT0FBUyxPQUNULFdBQ0EsV0FDQSxTQUNBO3NCQUVlOzttQkFBaEI7O1lBQ1UsS0FBQyxlQUFlOzttQkFBMUI7O1FBRUgsS0FBQyxlQUFlLFVBQVU7UUFFMUIsa0JBQWEsSUFBSSxLQUFLLHNCQUFxQixJQUFJO2VBRXhDLEtBQUMsZUFBZTtZQUVWLFVBQVUsV0FBVzs7bUJBQS9COztRQUVILFFBQVEsVUFBVSxNQUFNO1FBRXhCLGFBQWE7ZUFFUCxPQUFPLE1BQU07O1lBQ2YsTUFBUyxLQUFLLE1BQU07WUFDcEIsT0FBUyxN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
//# sourceURL=file://kode/ked/util/git.kode
