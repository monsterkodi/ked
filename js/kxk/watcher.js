var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
    watcher["filters"] = {}
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
        this.filters = {}
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

    watcher["watch"] = async function (path, opt)
    {
        var isDir, prjPath, _74_22_

        if (_k_.empty(path))
        {
            console.error("watcher.watch - can't watch empty path!")
            return
        }
        path = slash.untilde(path)
        opt = (opt != null ? opt : {})
        opt.recursive = ((_74_22_=opt.recursive) != null ? _74_22_ : true)
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
            return this.watchFileDir(path)
        }
    }

    watcher["watchFileDir"] = function (path)
    {
        var dir

        dir = slash.dir(path)
        if (this.filters[dir])
        {
            if (!(_k_.in(path,this.filters[dir])))
            {
                return this.filters[dir].push(path)
            }
        }
        else if (_k_.empty(this.watchers[dir]))
        {
            this.watchDir(dir,false)
            return this.filters[dir] = [path]
        }
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

    watcher["onRaw"] = function (dir, change, name)
    {
        var filters, path

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
        if (filters = this.filters[dir])
        {
            if (!(_k_.in(path,filters)))
            {
                return
            }
        }
        return this.markPending(path)
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
        var p, _351_43_

        for (p in this.known)
        {
            if (p === dir || p.startsWith(dir + '/'))
            {
                into[p] = {first:0,last:0}
            }
        }
        return this.walkPaths(dir,into,(((_351_43_=this.recurse[dir]) != null ? _351_43_ : true)))
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
        var info, _371_49_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvd2F0Y2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sWUFBQTtPQUFNLFdBQUE7T0FBSyxVQUFBOztPQUNiLFNBQUE7OztBQUVILFdBQUQ7Ozs7O0lBS0ksU0FBQztJQUNELFNBQUM7SUFDRCxTQUFDO0lBQ0QsU0FBQztJQUNELFNBQUM7SUFDRCxTQUFDO0lBQ0QsU0FBQyxlQUFZO0lBQ2IsU0FBQyxhQUFVO0lBQ1gsU0FBQyxhQUFVO0lBQ1gsU0FBQyxhQUFVO0lBQ1gsU0FBQyxnQkFBYSxlQUFlO0lBQzdCLFNBQUMsaUJBQWMsWUFBWSxhQUFhO0lBQ3hDLFNBQUMsd0JBQXFCLFNBQVMsUUFBUSxTQUFTO0lBR2hELFNBQUMsNkJBQVU7Ozs7WUFFSixPQUFPLEtBQUMsU0FBUzs7bUJBQ2hCLEtBQUMsTUFBTSxRQUFROzs7OzBCQUVSLEtBQUMsTUFBTTs7OztJQUV0QixTQUFDOzs7O2FBRU8sT0FBWSxLQUFDOztZQUFULE9BQVEsS0FBQztZQUNiLEtBQUs7O1FBRVQsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1lBRTJCLEtBQUM7O1lBQTdCLGFBQWEsS0FBQzs7WUFDYyxLQUFDOztZQUE3QixhQUFhLEtBQUM7O2VBQ1AsS0FBQztzQkFDRCxLQUFDOzs7SUFFWixTQUFDLHdCQUFXOzs7O21CQUdGLEdBQUcsTUFBTTs7ZUFDVDs7dUJBQ0MsSUFBSSxLQUFRLEtBQUM7O3VCQUNWOztZQUNOLHdCQUFnQixnQkFBZ0I7bUJBQzlCOzs7O0lBRVYsU0FBQywyQkFBYyxNQUFLOzttQkFFYixJQUFJLEtBQVEsS0FBQzs7OztRQUVoQix3QkFBZ0IsZ0JBQWdCOzs7SUFFcEMsU0FBQywwQkFBTyxNQUFLOzs7O3NCQUVBOztZQUNMLGNBQU07OztRQUdWLE9BQU8sTUFBTSxRQUFRO1FBRXJCLE9BQUEsY0FBQTtRQUNBLElBQUksc0JBQUosSUFBSSwr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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/watcher.kode
