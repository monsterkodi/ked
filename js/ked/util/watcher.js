var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.y6=_k_.k.F256(_k_.k.y(6))

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
    watcher["snapshot"] = async function (file)
    {
        var stat

        if (stat = await nfs.fileExists(file))
        {
            return this.fileStats[file] = stat
        }
    }

    watcher["watch"] = async function (path, opt)
    {
        var dir, isDir, item, items, prjPath, w, _45_22_

        if (_k_.empty(path))
        {
            console.error("watcher.watch - can't watch empty path!")
            return
        }
        path = slash.untilde(path)
        isDir = await nfs.isDir(path)
        opt = (opt != null ? opt : {})
        opt.recursive = ((_45_22_=opt.recursive) != null ? _45_22_ : true)
        if (isDir)
        {
            dir = path
        }
        else
        {
            prjPath = await nfs.prj(path)
            if (_k_.empty(watcher.watchers[path]))
            {
                w = fs.watch(path)
                w.on('error',(function (err)
                {
                    console.error(`watch file:'${path}' error: ${err}`)
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
            w = fs.watch(dir)
            w.on('error',(function (err)
            {
                console.error(`watch dir:'${dir}' error: ${err}`)
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
            items = await nfs.list(dir)
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

        if (path !== "ked.log")
        {
            console.log(`watcher.onChange ○ ${_k_.y6(dir)} ${_k_.b5(path)}`)
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC93YXRjaGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFhUyxXQUFUOzs7Ozs7OzthQWFJLDZCQUFXOzs7O1lBRUosYUFBUSxJQUFJLFdBQVc7O21CQUN0QixLQUFDLFVBQVUsUUFBUTs7OzthQUUzQiwwQkFBUSxNQUFLOzs7O3NCQUVBOztZQUNMLGNBQU07OztRQUtWLE9BQU8sTUFBTSxRQUFRO1FBRXJCLGNBQVMsSUFBSSxNQUFNO1FBRW5CLE9BQUEsY0FBQTtRQUNBLElBQUksc0JBQUosSUFBSSwrQkFBYTtZQUVkOztZQUNDLE1BQU07Ozs7WUFFTixnQkFBVyxJQUFJLElBQUk7MEJBRVYsUUFBUSxTQUFTOztnQkFFdEIsSUFBSSxHQUFHLE1BQU07Z0JBQ2IsRUFBRSxHQUFHLG1CQUFTOztvQkFBUSw2QkFBcUIsZ0JBQWdCOztnQkFDM0QsRUFBRSxHQUFHLHFCQUFXOztzQ0FBUyxRQUFPOzsrQkFBUyxLQUFDLFNBQVMsT0FBTyxLQUFLOzsrQkFBTSxNQUFNLElBQUk7Z0JBQy9FLFFBQVEsU0FBUyxRQUFROzswQkFFcEI7O2dCQUNMLHdCQUFZOzs7Z0JBR2IsWUFBVzs7Z0JBQ1YsTUFBTTs7OztnQkFFTixNQUFNLE1BQU0sSUFBSTs7O3NCQUVmLFFBQVEsU0FBUzs7Z0JBRUcsUUFBTyxPQUFPLFFBQU8sTUFBTSxRQUFROztnQkFBNUQsSUFBSSxZQUFZOztZQUloQixJQUFJLEdBQUcsTUFBTTtZQUNiLEVBQUUsR0FBRyxtQkFBUzs7Z0JBQVEsNEJBQW9CLGVBQWU7O1lBQ3pELEVBQUUsR0FBRyxxQkFBVzs7a0NBQVMsUUFBTzs7MkJBQVMsS0FBQyxTQUFTLE9BQU8sS0FBSzs7MkJBQU07WUFDckUsUUFBUSxTQUFTLE9BQU87aUJBRWQsSUFBSTs7OztZQUVkLGNBQVMsSUFBSSxLQUFLO2dDQUNOOzs7Z0JBQVI7b0JBQ0csS0FBSyxTQUFROzsrQkFDVCxLQUFLLE1BQVMsZUFBZTs7d0JBQzVCOztvQkFDSixRQUFRLE1BQU0sS0FBSzs7Ozs7O2FBRW5DLDZCQUFXLFFBQU8sTUFBSzs7OztZQUVnQyxTQUFROztZQUEzRCx5Q0FBNkIsZUFBVzs7UUFFeEMsT0FBTyxNQUFNLEtBQUssSUFBSTtRQUV0QixlQUFVLElBQUksT0FBTztZQUVsQjs7Z0JBQ0ksV0FBVTs7b0JBRU4sS0FBQyxZQUFZOztvQkFDWixhQUFhLEtBQUMsWUFBWTsyQkFDbkIsS0FBQyxZQUFZOzs7O29CQUVwQixLQUFDLFlBQVksUUFBUSx1QkFBYTs7OzttQ0FBUyxLQUFDLFdBQVc7O21DQUFHLE1BQU07Ozs7Z0JBR3JFLFdBQVU7O3FCQUNOLEtBQUMsVUFBVTs7d0JBQ1AsS0FBQyxVQUFVLE1BQU0sU0FBUSxPQUFPLFFBQVMsS0FBQyxVQUFVLE1BQU0sWUFBVyxPQUFPOzs7Ozs7bUJBR3ZGLEtBQUssS0FBSyxlQUFjLEtBQUssS0FBSyxPQUFPLE9BQVMsUUFBUTs7OzttQkFFMUQsS0FBSyxLQUFLLGVBQWMsS0FBSyxLQUFLLE9BQU8sU0FBUyxRQUFROzs7O2FBRWxFLHlCQUFhOztRQUVULGFBQWEsS0FBQyxZQUFZO2VBQ25CLEtBQUMsWUFBWTtlQUNwQixLQUFLLEtBQUssZUFBYyxLQUFLLEtBQUssT0FBTyxTQUFTLFFBQVE7OztXQXpHekQ7OztlQTJHRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/watcher.kode
