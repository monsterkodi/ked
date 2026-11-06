var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var watcher

import slash from "./slash.js"
import post from "./post.js"
import nfs from "./nfs.js"

import fs from "fs"


watcher = (function ()
{
    function watcher ()
    {}

    watcher["watchers"] = {}
    watcher["recurse"] = {}
    watcher["known"] = {}
    watcher["pending"] = {}
    watcher["rescans"] = {}
    watcher["quietTimer"] = null
    watcher["maxTimer"] = null
    watcher["debounce"] = 75
    watcher["maxDelay"] = 250
    watcher["ignoreDirs"] = ['node_modules','.git']
    watcher["ignoreFiles"] = ['.DS_Store','.localized','ked.log']
    watcher["ignoredWatchErrors"] = ['EACCES','EPERM','ENOENT','ENOSPC']
    watcher["watch"] = async function (path, opt)
    {
        var isDir, prjPath, _32_22_

        if (_k_.empty(path))
        {
            console.error("watcher.watch - can't watch empty path!")
            return
        }
        path = slash.untilde(path)
        opt = (opt != null ? opt : {})
        opt.recursive = ((_32_22_=opt.recursive) != null ? _32_22_ : true)
        isDir = await nfs.isDir(path)
        if (isDir)
        {
            this.watchDir(path,opt.recursive)
            return
        }
        prjPath = await nfs.prj(path)
        if (prjPath && !(_k_.in(prjPath,['/',slash.untilde('~')])))
        {
            return this.watchDir(prjPath,opt.recursive)
        }
        else
        {
            return this.watchDir(slash.dir(path),false)
        }
    }

    watcher["snapshot"] = async function (file)
    {
        var info

        if (info = this.statPath(file))
        {
            return this.known[file] = info
        }
        else
        {
            return delete this.known[file]
        }
    }

    watcher["onRaw"] = function (dir, change, name)
    {
        var path

        if (_k_.empty(name) || !(_k_.isStr(name)))
        {
            this.rescans[dir] = true
            this.scheduleFlush()
            return
        }
        path = slash.path(dir,name)
        if (this.ignoredPath(path))
        {
            return
        }
        return this.markPending(path)
    }

    watcher["close"] = function ()
    {
        var dir, wtch

        for (dir in this.watchers)
        {
            wtch = this.watchers[dir]
            wtch.close()
        }
        this.watchers = {}
        this.recurse = {}
        this.known = {}
        this.pending = {}
        this.rescans = {}
        if (this.quietTimer)
        {
            clearTimeout(this.quietTimer)
        }
        if (this.maxTimer)
        {
            clearTimeout(this.maxTimer)
        }
        delete this.quietTimer
        return delete this.maxTimer
    }

    watcher["openWatch"] = function (path)
    {
        try
        {
            return fs.watch(path)
        }
        catch (err)
        {
            if (_k_.in(err.code,this.ignoredWatchErrors))
            {
                return null
            }
            console.error(`watch:'${path}' error: ${err}`)
            return null
        }
    }

    watcher["onWatchError"] = function (path, err)
    {
        if (_k_.in(err.code,this.ignoredWatchErrors))
        {
            return
        }
        console.error(`watch:'${path}' error: ${err}`)
    }

    watcher["watchDir"] = function (dir, recursive)
    {
        var w

        if (_k_.empty(dir))
        {
            return
        }
        if (_k_.in(slash.file(dir),this.ignoreDirs))
        {
            return
        }
        if (this.watchers[dir])
        {
            if (recursive && !this.recurse[dir])
            {
                this.recurse[dir] = true
                this.watchChildren(dir)
            }
            return
        }
        w = this.openWatch(dir)
        if (!w)
        {
            return
        }
        this.watchers[dir] = w
        this.recurse[dir] = recursive
        w.on('error',(function (err)
        {
            return this.onWatchError(dir,err)
        }).bind(this))
        w.on('change',((function (d)
        {
            return (function (change, name)
            {
                return this.onRaw(d,change,name)
            }).bind(this)
        }).bind(this))(dir))
        this.seedDir(dir)
        if (recursive)
        {
            return this.watchChildren(dir)
        }
    }

    watcher["watchChildren"] = function (dir)
    {
        var dirent

        var list = _k_.list(this.readdir(dir))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dirent = list[_a_]
            if (!dirent.isDirectory())
            {
                continue
            }
            if (_k_.in(dirent.name,this.ignoreDirs))
            {
                continue
            }
            this.watchDir(slash.path(dir,dirent.name),true)
        }
    }

    watcher["readdir"] = function (dir)
    {
        try
        {
            return fs.readdirSync(dir,{withFileTypes:true})
        }
        catch (err)
        {
            return []
        }
    }

    watcher["statPath"] = function (p)
    {
        var stat

        try
        {
            stat = fs.statSync(p)
            return {dev:stat.dev,ino:stat.ino,type:(stat.isDirectory() ? 'dir' : 'file'),size:stat.size,mtimeMs:stat.mtimeMs,ctimeMs:stat.ctimeMs}
        }
        catch (err)
        {
            return null
        }
    }

    watcher["seedDir"] = function (dir)
    {
        var dirent, info, p

        var list = _k_.list(this.readdir(dir))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dirent = list[_a_]
            if (_k_.in(dirent.name,this.ignoreFiles))
            {
                continue
            }
            if (_k_.in(dirent.name,this.ignoreDirs))
            {
                continue
            }
            p = slash.path(dir,dirent.name)
            if (info = this.statPath(p))
            {
                this.known[p] = info
            }
        }
    }

    watcher["ignoredPath"] = function (p)
    {
        var file

        file = slash.file(p)
        return _k_.in(file,this.ignoreFiles) || _k_.in(file,this.ignoreDirs)
    }

    watcher["markPending"] = function (path)
    {
        var now

        now = Date.now()
        if (this.pending[path])
        {
            this.pending[path].last = now
        }
        else
        {
            this.pending[path] = {first:now,last:now}
        }
        return this.scheduleFlush()
    }

    watcher["scheduleFlush"] = function ()
    {
        if (this.quietTimer)
        {
            clearTimeout(this.quietTimer)
        }
        delete this.quietTimer
        this.quietTimer = setTimeout(((function ()
        {
            return this.flush()
        }).bind(this)),this.debounce)
        if (!this.maxTimer)
        {
            return this.maxTimer = setTimeout(((function ()
            {
                return this.flush()
            }).bind(this)),this.maxDelay)
        }
    }

    watcher["flush"] = function ()
    {
        var cre, creates, del, deleted, deletes, dir, info, modifies, parent, path, pending, prev, ren, renamedNew, renamedOld, renames

        if (this.quietTimer)
        {
            clearTimeout(this.quietTimer)
        }
        if (this.maxTimer)
        {
            clearTimeout(this.maxTimer)
        }
        delete this.quietTimer
        delete this.maxTimer
        pending = this.pending
        this.pending = {}
        if (!_k_.empty(this.rescans))
        {
            for (dir in this.rescans)
            {
                this.collectPaths(dir,pending)
            }
            this.rescans = {}
        }
        if (_k_.empty(pending))
        {
            return
        }
        deletes = []
        creates = []
        modifies = []
        for (path in pending)
        {
            if (this.ignoredPath(path))
            {
                continue
            }
            info = this.statPath(path)
            prev = this.known[path]
            if (info)
            {
                if (!prev)
                {
                    creates.push({path:path,stat:info})
                    this.known[path] = info
                }
                else if (info.dev !== prev.dev || info.ino !== prev.ino)
                {
                    modifies.push(path)
                    this.known[path] = info
                }
                else if (info.size !== prev.size || info.mtimeMs !== prev.mtimeMs || info.ctimeMs !== prev.ctimeMs)
                {
                    modifies.push(path)
                    this.known[path] = info
                }
            }
            else if (prev)
            {
                deletes.push({path:path,stat:prev})
            }
        }
        renames = []
        var list = _k_.list(deletes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            del = list[_a_]
            var list1 = _k_.list(creates)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                cre = list1[_b_]
                if (del.used || cre.used)
                {
                    continue
                }
                if (del.stat.dev === cre.stat.dev && del.stat.ino === cre.stat.ino)
                {
                    del.used = true
                    cre.used = true
                    renames.push({old:del.path,new:cre.path,stat:del.stat})
                    break
                }
            }
        }
        renamedOld = []
        renamedNew = []
        var list2 = _k_.list(renames)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            ren = list2[_c_]
            renamedOld.push(ren.old)
            renamedNew.push(ren.new)
            if (ren.stat.type === 'dir')
            {
                parent = slash.dir(ren.old)
                this.closeWatchedUnder(ren.old)
                this.pruneKnownUnder(ren.old)
                if (this.recurse[parent])
                {
                    this.watchDir(ren.new,true)
                }
            }
            else
            {
                delete this.known[ren.old]
                this.known[ren.new] = this.statPath(ren.new)
            }
            this.emitChange('rename',ren.new,{oldPath:ren.old})
        }
        deleted = []
        deletes.sort(function (a, b)
        {
            return a.path.length - b.path.length
        })
        var list3 = _k_.list(deletes)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            del = list3[_d_]
            if (del.used)
            {
                continue
            }
            if (this.underAny(del.path,renamedOld))
            {
                continue
            }
            if (this.underAny(del.path,deleted))
            {
                continue
            }
            info = this.known[del.path]
            this.emitChange('delete',del.path)
            deleted.push(del.path)
            if ((info != null ? info.type : undefined) === 'dir')
            {
                this.closeWatchedUnder(del.path)
                this.pruneKnownUnder(del.path)
            }
            else
            {
                delete this.known[del.path]
            }
        }
        creates.sort(function (a, b)
        {
            return a.path.length - b.path.length
        })
        var list4 = _k_.list(creates)
        for (var _e_ = 0; _e_ < list4.length; _e_++)
        {
            cre = list4[_e_]
            if (cre.used)
            {
                continue
            }
            if (this.underAny(cre.path,renamedNew))
            {
                continue
            }
            if (this.underAny(cre.path,deleted))
            {
                continue
            }
            if (cre.stat.type === 'dir')
            {
                if (this.recurse[slash.dir(cre.path)])
                {
                    this.watchDir(cre.path,true)
                }
            }
            this.emitChange('create',cre.path)
        }
        var list5 = _k_.list(modifies)
        for (var _f_ = 0; _f_ < list5.length; _f_++)
        {
            path = list5[_f_]
            if (this.underAny(path,renamedOld))
            {
                continue
            }
            if (this.underAny(path,renamedNew))
            {
                continue
            }
            if (this.underAny(path,deleted))
            {
                continue
            }
            if (_k_.in(path,renamedNew))
            {
                continue
            }
            info = this.known[path]
            if ((info != null ? info.type : undefined) !== 'file')
            {
                continue
            }
            this.emitChange('modify',path)
        }
    }

    watcher["underAny"] = function (path, roots)
    {
        var root

        var list = _k_.list(roots)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            root = list[_a_]
            if (path === root || path.startsWith(root + '/'))
            {
                return true
            }
        }
        return false
    }

    watcher["closeWatchedUnder"] = function (path)
    {
        var dir

        var list = _k_.list(Object.keys(this.watchers))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dir = list[_a_]
            if (dir === path || dir.startsWith(path + '/'))
            {
                this.watchers[dir].close()
                delete this.watchers[dir]
                delete this.recurse[dir]
            }
        }
    }

    watcher["pruneKnownUnder"] = function (path)
    {
        var p

        for (p in Object.keys(this.known))
        {
            if (p === path || p.startsWith(path + '/'))
            {
                delete this.known[p]
            }
        }
    }

    watcher["collectPaths"] = function (dir, into)
    {
        var p, _336_43_

        for (p in this.known)
        {
            if (p === dir || p.startsWith(dir + '/'))
            {
                into[p] = {first:0,last:0}
            }
        }
        return this.walkPaths(dir,into,(((_336_43_=this.recurse[dir]) != null ? _336_43_ : true)))
    }

    watcher["walkPaths"] = function (dir, into, recursive)
    {
        var dirent, p

        var list = _k_.list(this.readdir(dir))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dirent = list[_a_]
            if (_k_.in(dirent.name,this.ignoreFiles))
            {
                continue
            }
            if (_k_.in(dirent.name,this.ignoreDirs))
            {
                continue
            }
            p = slash.path(dir,dirent.name)
            into[p] = {first:0,last:0}
            if (recursive && dirent.isDirectory())
            {
                this.walkPaths(p,into,true)
            }
        }
    }

    watcher["emitChange"] = function (change, path, opt)
    {
        var info, _356_49_

        opt = (opt != null ? opt : {})
        info = {path:path,change:change,watcher:this}
        if ((opt.oldPath != null))
        {
            info.oldPath = opt.oldPath
        }
        return post.emit('file.change',info)
    }

    return watcher
})()

export default watcher;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvd2F0Y2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sWUFBQTtPQUFNLFdBQUE7T0FBSyxVQUFBOztPQUNiLFNBQUE7OztBQUVILFdBQUQ7Ozs7O0lBS0ksU0FBQztJQUNELFNBQUM7SUFDRCxTQUFDO0lBQ0QsU0FBQztJQUNELFNBQUM7SUFDRCxTQUFDLGVBQVk7SUFDYixTQUFDLGFBQVU7SUFDWCxTQUFDLGFBQVU7SUFDWCxTQUFDLGFBQVU7SUFDWCxTQUFDLGdCQUFhLGVBQWU7SUFDN0IsU0FBQyxpQkFBYyxZQUFZLGFBQWE7SUFDeEMsU0FBQyx3QkFBcUIsU0FBUyxRQUFRLFNBQVM7SUFFaEQsU0FBQywwQkFBTyxNQUFLOzs7O3NCQUVBOztZQUNMLGNBQU07OztRQUdWLE9BQU8sTUFBTSxRQUFRO1FBRXJCLE9BQUEsY0FBQTtRQUNBLElBQUksc0JBQUosSUFBSSwrQkFBYTtRQUVqQixjQUFTLElBQUksTUFBTTtZQUVoQjs7WUFDQyxLQUFDLFNBQVMsS0FBSyxJQUFJOzs7UUFHdkIsZ0JBQVcsSUFBSSxJQUFJO1lBRWhCLG9CQUFZLFNBQWdCLElBQUksTUFBTSxRQUFROzttQkFDN0MsS0FBQyxTQUFTLFFBQVEsSUFBSTs7OzttQkFFdEIsS0FBQyxTQUFTLE1BQU0sSUFBSSxNQUFNOzs7O0lBR2xDLFNBQUMsNkJBQVU7Ozs7WUFFSixPQUFPLEtBQUMsU0FBUzs7bUJBQ2hCLEtBQUMsTUFBTSxRQUFROzs7OzBCQUVSLEtBQUMsTUFBTTs7OztJQUV0QixTQUFDLG9CQUFPLEtBQUksUUFBTzs7OztzQkFFTixXQUFvQixVQUFSOztZQUNqQixLQUFDLFFBQVEsT0FBTztZQUNoQixLQUFDOzs7UUFHTCxPQUFPLE1BQU0sS0FBSyxJQUFJO1lBRWpCLEtBQUMsWUFBWTs7OztlQUVsQixLQUFDLFlBQVk7OztJQUVqQixTQUFDOzs7O2FBRU8sT0FBWSxLQUFDOztZQUFULE9BQVEsS0FBQztZQUNi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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/watcher.kode
