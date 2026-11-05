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
    watcher["watch"] = async function (path, opt)
    {
        var isDir, prjPath, _33_22_

        if (_k_.empty(path))
        {
            console.error("watcher.watch - can't watch empty path!")
            return
        }
        path = slash.untilde(path)
        opt = (opt != null ? opt : {})
        opt.recursive = ((_33_22_=opt.recursive) != null ? _33_22_ : true)
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
        var p, _341_43_

        for (p in this.known)
        {
            if (p === dir || p.startsWith(dir + '/'))
            {
                into[p] = {first:0,last:0}
            }
        }
        return this.walkPaths(dir,into,(((_341_43_=this.recurse[dir]) != null ? _341_43_ : true)))
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
        var info, _361_49_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvd2F0Y2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sWUFBQTtPQUFNLFdBQUE7T0FBSyxVQUFBOztPQUNiLFNBQUE7OztBQUVILFdBQUQ7Ozs7O0lBS0ksU0FBQztJQUNELFNBQUM7SUFDRCxTQUFDO0lBQ0QsU0FBQztJQUNELFNBQUM7SUFDRCxTQUFDO0lBQ0QsU0FBQyxlQUFZO0lBQ2IsU0FBQyxhQUFVO0lBQ1gsU0FBQyxhQUFVO0lBQ1gsU0FBQyxhQUFVO0lBQ1gsU0FBQyxnQkFBYSxlQUFlO0lBQzdCLFNBQUMsaUJBQWMsWUFBWSxhQUFhO0lBQ3hDLFNBQUMsd0JBQXFCLFNBQVMsUUFBUSxTQUFTO0lBRWhELFNBQUMsMEJBQU8sTUFBSzs7OztzQkFFQTs7WUFDTCxjQUFNOzs7UUFHVixPQUFPLE1BQU0sUUFBUTtRQUVyQixPQUFBLGNBQUE7UUFDQSxJQUFJLHNCQUFKLElBQUksK0JBQWE7UUFFakIsY0FBUyxJQUFJLE1BQU07WUFFaEI7O1lBQ0MsS0FBQyxTQUFTLEtBQUssSUFBSTs7O1FBR3ZCLGdCQUFXLElBQUksSUFBSTtZQUVoQixvQkFBWSxTQUFnQixJQUFJLE1BQU0sUUFBUTs7bUJBQzdDLEtBQUMsU0FBUyxRQUFRLElBQUk7Ozs7bUJBRXRCLEtBQUMsU0FBUyxNQUFNLElBQUksTUFBTTs7OztJQUdsQyxTQUFDLDZCQUFVOzs7O1lBRUosT0FBTyxLQUFDLFNBQVM7O21CQUNoQixLQUFDLE1BQU0sUUFBUTs7OzswQkFFUixLQUFDLE1BQU07Ozs7SUFFdEIsU0FBQyxvQkFBTyxLQUFJLFFBQU87Ozs7c0JBRU4sV0FBb0IsVUFBUjs7WUFDakIsS0FBQyxRQUFRLE9BQU87WUFDaEIsS0FBQzs7O1FBR0wsT0FBTyxNQUFNLEtBQUssSUFBSTtZQUVqQixLQUFDLFlBQVk7Ozs7WUFFZixVQUFVLEtBQUMsUUFBUTs7eUJBQ2IsS0FBWTs7Ozs7ZUFFckIsS0FBQyxZQUFZOzs7SUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/watcher.kode
