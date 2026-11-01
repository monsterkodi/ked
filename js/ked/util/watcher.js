var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r6=_k_.k.F256(_k_.k.r(6))

var watcher

import kxk from "../../kxk.js"
let watch = kxk.watch
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs

import fs from "fs"


watcher = (function ()
{
    function watcher ()
    {}

    watcher["watchers"] = {}
    watcher["renameTimer"] = {}
    watcher["fileStats"] = {}
    watcher["ignoredWatchErrors"] = ['EACCES','EPERM','ENOENT']
    watcher["snapshot"] = async function (file)
    {
        var stat

        if (stat = await nfs.fileExists(file))
        {
            return this.fileStats[file] = stat
        }
    }

    watcher["close"] = function ()
    {
        var path, wtch

        for (path in watcher.watchers)
        {
            wtch = watcher.watchers[path]
            wtch.close()
        }
        return watcher.watchers = {}
    }

    watcher["openWatch"] = function (path)
    {
        try
        {
            return fs.watch(path)
        }
        catch (err)
        {
            if (_k_.in(err.code,watcher.ignoredWatchErrors))
            {
                return null
            }
            console.error(`watch:'${path}' error: ${err}`)
            return null
        }
    }

    watcher["onWatchError"] = function (path, err)
    {
        if (_k_.in(err.code,watcher.ignoredWatchErrors))
        {
            return
        }
        console.error(`watch:'${path}' error: ${err}`)
    }

    watcher["watch"] = async function (path, opt)
    {
        var dir, isDir, item, items, prjPath, w, _67_22_

        if (_k_.empty(path))
        {
            console.error("watcher.watch - can't watch empty path!")
            return
        }
        path = slash.untilde(path)
        isDir = await nfs.isDir(path)
        opt = (opt != null ? opt : {})
        opt.recursive = ((_67_22_=opt.recursive) != null ? _67_22_ : true)
        if (isDir)
        {
            dir = path
        }
        else
        {
            prjPath = await nfs.prj(path)
            if (_k_.empty(watcher.watchers[path]))
            {
                w = watcher.openWatch(path)
                if (!_k_.empty(w))
                {
                    w.on('error',(function (err)
                    {
                        return watcher.onWatchError(path,err)
                    }).bind(this))
                    w.on('change',((function (dir)
                    {
                        return (function (change, path)
                        {
                            return this.onChange(change,path,dir)
                        }).bind(this)
                    }).bind(this))(slash.dir(path)))
                    watcher.watchers[path] = w
                }
            }
            if (_k_.empty(prjPath))
            {
                console.log(`✘ ${_k_.r6(path)}`)
                return
            }
            if (prjPath !== '/')
            {
                dir = prjPath
            }
            else
            {
                dir = slash.dir(path)
            }
        }
        if (_k_.empty(watcher.watchers[dir]))
        {
            if (dir === '/' || dir === slash.untilde('~'))
            {
                opt.recursive = false
            }
            w = watcher.openWatch(dir)
            if (!w)
            {
                return
            }
            w.on('error',(function (err)
            {
                return watcher.onWatchError(dir,err)
            }).bind(this))
            w.on('change',((function (dir)
            {
                return (function (change, path)
                {
                    return this.onChange(change,path,dir)
                }).bind(this)
            }).bind(this))(dir))
            watcher.watchers[dir] = w
            if (!opt.recursive)
            {
                return
            }
            items = await nfs.list(dir,{recursive:false})
            var list = _k_.list(items)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                if (item.type === 'dir')
                {
                    if (_k_.in(item.file,['node_modules','.git']))
                    {
                        continue
                    }
                    watcher.watch(item.path)
                }
            }
        }
    }

    watcher["onChange"] = async function (change, path, dir)
    {
        var exists

        path = slash.path(dir,path)
        exists = await nfs.exists(path)
        if (exists)
        {
            if (change === 'rename')
            {
                if (this.renameTimer[path])
                {
                    clearTimeout(this.renameTimer[path])
                    delete this.renameTimer[path]
                }
                else
                {
                    this.renameTimer[path] = setTimeout(((function (p)
                    {
                        return (function ()
                        {
                            return this.postRename(p)
                        }).bind(this)
                    }).bind(this))(path),100)
                    return
                }
            }
            if (change === 'change')
            {
                if ((this.fileStats[path] != null))
                {
                    if (this.fileStats[path].size === exists.size && this.fileStats[path].mtimeMs === exists.mtimeMs)
                    {
                        return
                    }
                }
            }
            if (slash.file(path) === 'ked.log')
            {
                return
            }
            return post.emit('file.change',{path:path,change:change,watcher:this})
        }
        else
        {
            return post.emit('file.change',{path:path,change:'remove',watcher:this})
        }
    }

    watcher["postRename"] = function (path)
    {
        clearTimeout(this.renameTimer[path])
        delete this.renameTimer[path]
        return post.emit('file.change',{path:path,change:'rename',watcher:this})
    }

    return watcher
})()

export default watcher;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC93YXRjaGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVVSxVQUFBO0lBQU07SUFBTTtJQUFNO0lBQUs7O09BQzdCLFNBQUE7OztBQUVLLFdBQVQ7Ozs7O0lBRUksU0FBQztJQUNELFNBQUM7SUFDRCxTQUFDO0lBQ0QsU0FBQyx3QkFBcUIsU0FBUyxRQUFRO0lBUXZDLFNBQUMsNkJBQVU7Ozs7WUFFSixhQUFRLElBQUksV0FBVzs7bUJBQ3RCLEtBQUMsVUFBVSxRQUFROzs7O0lBRTNCLFNBQUM7Ozs7YUFFTyxRQUFhLFFBQVE7O1lBQWhCLE9BQVEsUUFBUTtZQUNyQixLQUFLOztlQUNULFFBQVE7OztJQUVaLFNBQUMsd0JBQVc7Ozs7bUJBR0YsR0FBRyxNQUFNOztlQUNUOzt1QkFDQyxJQUFJLEtBQVEsUUFBUTs7dUJBQ2pCOztZQUNOLHdCQUFnQixnQkFBZ0I7bUJBQzlCOzs7O0lBRVYsU0FBQywyQkFBYyxNQUFLOzttQkFFYixJQUFJLEtBQVEsUUFBUTs7OztRQUV2Qix3QkFBZ0IsZ0JBQWdCOzs7SUFFcEMsU0FBQywwQkFBTyxNQUFLOzs7O3NCQUVBOztZQUNMLGNBQU07OztRQUtWLE9BQU8sTUFBTSxRQUFRO1FBRXJCLGNBQVMsSUFBSSxNQUFNO1FBRW5CLE9BQUEsY0FBQTtRQUNBLElBQUksc0JBQUosSUFBSSwrQkFBYTtZQUVkOztZQUNDLE1BQU07Ozs7WUFFTixnQkFBVyxJQUFJLElBQUk7MEJBRVYsUUFBUSxTQUFTOztnQkFFdEIsSUFBSSxRQUFRLFVBQVU7K0JBQ2I7O29CQUNMLEVBQUUsR0FBRyxtQkFBUzs7K0JBQVEsUUFBUSxhQUFhLEtBQUs7O29CQUNoRCxFQUFFLEdBQUcscUJBQVc7OzBDQUFTLFFBQU87O21DQUFTLEtBQUMsU0FBUyxPQUFPLEtBQUs7O21DQUFNLE1BQU0sSUFBSTtvQkFDL0UsUUFBUSxTQUFTLFFBQVE7OzswQkFFeEI7O2dCQUNMLGlCQUFTLE9BQUc7OztnQkFHYixZQUFXOztnQkFDVixNQUFNOzs7O2dCQUVOLE1BQU0sTUFBTSxJQUFJOzs7c0JBRWYsUUFBUSxTQUFTOztnQkFFRyxRQUFPLE9BQU8sUUFBTyxNQUFNLFFBQVE7O2dCQUE1RCxJQUFJLFlBQVk7O1lBSWhCLElBQUksUUFBUSxVQUFVO2lCQUNiOzs7O1lBQ1QsRUFBRSxHQUFHLG1CQUFTOzt1QkFBUSxRQUFRLGFBQWEsSUFBSTs7WUFDL0MsRUFBRSxHQUFHLHFCQUFXOztrQ0FBUyxRQUFPOzsyQkFBUyxLQUFDLFNBQVMsT0FBTyxLQUFLOzsyQkFBTTtZQUNyRSxRQUFRLFNBQVMsT0FBTztpQkFFZCxJQUFJOzs7O1lBRWQsY0FBUyxJQUFJLEtBQUssS0FBSSxVQUFVO2dDQUNwQjs7O2dCQUFSO29CQUNHLEtBQUssU0FBUTs7K0JBQ1QsS0FBSyxNQUFTLGVBQWU7O3dCQUM1Qjs7b0JBQ0osUUFBUSxNQUFNLEtBQUs7Ozs7OztJQUVuQyxTQUFDLDZCQUFVLFFBQU8sTUFBSzs7OztRQUluQixPQUFPLE1BQU0sS0FBSyxJQUFJO1FBRXRCLGVBQVUsSUFBSSxPQUFPO1lBRWxCOztnQkFDSSxXQUFVOztvQkFFTixLQUFDLFlBQVk7O29CQUNaLGFBQWEsS0FBQyxZQUFZOzJCQUNuQixLQUFDLFlBQVk7Ozs7b0JBRXBCLEtBQUMsWUFBWSxRQUFRLHVCQUFhOzs7O21DQUFTLEtBQUMsV0FBVzs7bUNBQUcsTUFBTTs7OztnQkFHckUsV0FBVTs7cUJBQ04sS0FBQyxVQUFVOzt3QkFDUCxLQUFDLFVBQVUsTUFBTSxTQUFRLE9BQU8sUUFBUyxLQUFDLFVBQVUsTUFBTSxZQUFXLE9BQU87Ozs7OztnQkFFbEYsTUFBTSxLQUFLLFVBQVM7Ozs7bUJBQ3pCLEtBQUssS0FBSyxlQUFjLEtBQUssS0FBSyxPQUFPLE9BQVMsUUFBUTs7OzttQkFFMUQsS0FBSyxLQUFLLGVBQWMsS0FBSyxLQUFLLE9BQU8sU0FBUyxRQUFROzs7O0lBRWxFLFNBQUMseUJBQVk7O1FBRVQsYUFBYSxLQUFDLFlBQVk7ZUFDbkIsS0FBQyxZQUFZO2VBQ3BCLEtBQUssS0FBSyxlQUFjLEtBQUssS0FBSyxPQUFPLFNBQVMsUUFBUTs7O1dBakl6RDs7O2VBbUlGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/watcher.kode
