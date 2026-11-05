var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var git

import kxk from "../../kxk.js"
let slash = kxk.slash
let post = kxk.post
let kermit = kxk.kermit
let nfs = kxk.nfs
let watcher = kxk.watcher

import child_process from "child_process"


git = (function ()
{
    git["statusRequests"] = {}
    git["statusCache"] = {}
    git["statusTimers"] = {}
    git["statusDelay"] = 150
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
        var gitDir, root

        if (slash.file(info.path) === 'ked.log')
        {
            return
        }
        var list = _k_.list(this.gitDirs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            gitDir = list[_a_]
            root = slash.dir(gitDir)
            if (root === '/' || info.path.startsWith(root + '/'))
            {
                git.scheduleStatus(root)
            }
        }
    }

    git["scheduleStatus"] = function (root)
    {
        if (git.statusTimers[root])
        {
            clearTimeout(git.statusTimers[root])
        }
        return git.statusTimers[root] = setTimeout(((function ()
        {
            return git.runStatus(root)
        }).bind(this)),git.statusDelay)
    }

    git["runStatus"] = async function (root)
    {
        delete git.statusTimers[root]
        return await git.status(root)
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
                        if (_k_.in('pager diff',args))
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
        var after, afterSplit, before, change, diff, gitDir, i, line, lines, newLines, numNew, numOld, oldLines, status, x, _150_55_, _151_48_

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
                numOld = parseInt(((_150_55_=before.split(',')[1]) != null ? _150_55_ : 1))
                numNew = parseInt(((_151_48_=afterSplit[1]) != null ? _151_48_ : 1))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2dpdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQU07SUFBSztJQUFPO0lBQUk7O09BRWxDLG9CQUFBOzs7QUFDSCxPQUFEOztJQUVJLEtBQUM7SUFDRCxLQUFDO0lBQ0QsS0FBQztJQUNELEtBQUMsZ0JBQWE7YUFFZDs7OztRQUVJLEtBQUM7UUFFRCxLQUFLLEdBQUcsa0JBQWtCLEtBQUM7UUFDM0IsS0FBSyxHQUFHLGNBQWtCLEtBQUM7OzttQkFFL0IscUNBQWtCOzs7O1FBRWQsZUFBVSxJQUFJLElBQUk7dUJBRVQsb0JBQVcsT0FBYyxLQUFDOzttQkFDL0IsS0FBQyxRQUFRLEtBQUssTUFBTSxLQUFLLE9BQU87Ozs7bUJBSXhDLDJCQUFjOzs7O1lBQ0wsTUFBTSxLQUFLLEtBQUssVUFBUzs7Ozs0QkFFaEIsS0FBQzs7O1lBQVg7WUFFQSxPQUFPLE1BQU0sSUFBSTtnQkFFZCxTQUFRLE9BQU8sS0FBSyxLQUFLLFdBQVcsT0FBTzs7Z0JBQzFDLElBQUksZUFBZTs7Ozs7SUFFL0IsS0FBQyw2QkFBZ0I7O1lBRTBCLElBQUksYUFBYTs7WUFBeEQsYUFBYSxJQUFJLGFBQWE7O2VBRTlCLElBQUksYUFBYSxRQUFROzttQkFBZSxJQUFJLFVBQVU7dUJBQU0sSUFBSTs7O0lBRXBFLEtBQUMsOEJBQVc7O2VBRUQsSUFBSSxhQUFhO3FCQUV0QixJQUFJLE9BQU87OztJQUVqQixLQUFDLHdCQUFLOztxQkFBVyxJQUFJLElBQUk7OztJQUV6QixLQUFDLHlCQUFNLE1BQUs7O21CQUVKLGtCQUFTLFNBQVE7Ozs7OztnQkFHYixNQUFNLGtCQUFrQjt1QkFDeEIsY0FBYyxLQUFLLElBQUksY0FBSyxLQUFJLFFBQU87O2tDQUUxQjs7K0JBQ0wsUUFBUTs7OzttQ0FFSCxhQUFnQjs7Ozt3QkFDckIsY0FBTTt3QkFDTixjQUFNO3dCQUNOLGNBQU07Ozs7bUJBRVo7O2dCQUNGLGNB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/git.kode
