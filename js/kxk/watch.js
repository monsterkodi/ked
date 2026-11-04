var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.b5=_k_.k.F256(_k_.k.b(5))

var Watch

import slash from "./slash.js"
import nfs from "./nfs.js"
import events from "./events.js"

import fs from "fs"


Watch = (function ()
{
    _k_.extend(Watch, events)
    function Watch (path, opt)
    {
        this["onChange"] = this["onChange"].bind(this)
        Watch.__super__.constructor.call(this)
        this.dir = slash.path(path)
        this.opt = (opt != null ? opt : {})
        this.last = {}
        this.init()
    }

    Watch.prototype["init"] = async function ()
    {
        if (await nfs.exists(this.dir))
        {
            return this.watchDir()
        }
    }

    Watch["dir"] = function (path, opt)
    {
        return new Watch(path,opt)
    }

    Watch["watch"] = async function (path, opt)
    {
        var isDir

        isDir = await nfs.isDir(path)
        if (opt.cb)
        {
            if (isDir)
            {
                return opt.cb(Watch.dir(path,opt))
            }
            else
            {
                return opt.cb(Watch.file(path,opt))
            }
        }
        else
        {
            if (isDir)
            {
                return Watch.dir(path,opt)
            }
            else
            {
                return Watch.file(path,opt)
            }
        }
    }

    Watch["file"] = function (path, opt)
    {
        var w

        w = Watch.dir(slash.dir(path),opt)
        w.file = slash.path(path)
        return w
    }

    Watch.prototype["watchDir"] = async function ()
    {
        var change, item, items, watch

        if (!this.dir)
        {
            return
        }
        this.watch = fs.watch(this.dir)
        this.watch.on('error',(function (err)
        {
            console.error(`watch dir:'${this.dir}' error: ${err}`)
        }).bind(this))
        this.watch.on('change',this.onChange)
        if (this.opt.recursive)
        {
            items = await nfs.list(this.dir)
            this.watchers = []
            var list = _k_.list(items)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                if (item.type === 'dir')
                {
                    if (_k_.in(item.file,['node_modules','.git']))
                    {
                        console.log(_k_.b5(item.file))
                        continue
                    }
                    watch = fs.watch(item.path)
                    this.watchers.push(watch)
                    change = (function (dir)
                    {
                        return (function (chg, pth)
                        {
                            return this.onChange(chg,pth,dir)
                        }).bind(this)
                    }).bind(this)
                    watch.on('error',function (err)
                    {
                        console.error(`watch subdir:'${item.path}' error: ${err}`)
                    })
                    watch.on('change',change(item.path))
                }
            }
        }
    }

    Watch.prototype["ignore"] = function (path)
    {
        var regex

        if (this.opt.ignore)
        {
            var list = _k_.list(this.opt.ignore)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                regex = list[_a_]
                if (new RegExp(regex).test(path))
                {
                    return true
                }
            }
        }
    }

    Watch.prototype["close"] = function ()
    {
        var watch, _79_14_

        ;(this.watch != null ? this.watch.close() : undefined)
        delete this.watch
        delete this.dir
        if (this.opt.recursive)
        {
            var list = _k_.list(this.watchers)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                watch = list[_a_]
                watch.close()
            }
            return delete this.watchers
        }
    }

    Watch["stat"] = function (p)
    {
        var stat

        try
        {
            p = slash.path(slash.removeLinePos(p))
            stat = fs.statSync(p)
            fs.accessSync(p,fs.R_OK)
            return stat
        }
        catch (err)
        {
            return null
        }
    }

    Watch.prototype["onChange"] = function (change, path, dir = this.dir)
    {
        var clearRemove, stat, _116_48_, _122_28_, _122_68_, _122_75_

        if (this.ignore(path))
        {
            return
        }
        path = slash.path(dir,path)
        if (this.file && this.file !== path)
        {
            return
        }
        stat = Watch.stat(path)
        if (stat && stat.isDirectory())
        {
            if (this.file)
            {
                console.log('ignore dir',path)
                return
            }
        }
        if (stat)
        {
            if (this.opt.skipSave && path === (this.remove != null ? this.remove.path : undefined))
            {
                clearTimeout(this.remove.timer)
                clearRemove = (function ()
                {
                    return delete this.remove
                }).bind(this)
                setTimeout(clearRemove,100)
                return
            }
            if (path === (this.last != null ? this.last.path : undefined) && stat.mtime.getTime() === ((_122_68_=this.last) != null ? (_122_75_=_122_68_.mtime) != null ? _122_75_.getTime() : undefined : undefined))
            {
                return
            }
            this.last = {mtime:stat.mtime,path:path}
            return this.emit('change',{dir:dir,path:path,change:change,watch:this})
        }
        else
        {
            if (this.opt.skipSave)
            {
                return this.remove = {path:path,timer:setTimeout((function (d, p, w)
                {
                    return function ()
                    {
                        delete w.remove
                        return w.emit('change',{dir:d,path:p,change:'remove',watch:w})
                    }
                })(dir,path,this),100)}
            }
            else if (this.opt.emitRemove)
            {
                return this.emit('change',{dir:dir,path:path,change:'remove',watch:this})
            }
        }
    }

    return Watch
})()

export default Watch;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL3dhdGNoLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FHTSxZQUFBO09BQU0sVUFBQTtPQUFJLGFBQUE7O09BQ1osU0FBQTs7O0FBRUgsU0FBRDs7c0JBQWU7YUFFWCxPQUFJLE1BQU07Ozs7UUFJTixLQUFDLE1BQU8sTUFBTSxLQUFLO1FBQ25CLEtBQUMsT0FBTyxjQUFBO1FBQ1IsS0FBQztRQUVELEtBQUM7OztxQkFHTDs7a0JBRVMsSUFBSSxPQUFPLEtBQUM7O21CQUFTLEtBQUM7Ozs7SUFFL0IsT0FBQyxrQkFBTSxNQUFNOzttQkFBWSxNQUFNLEtBQU07OztJQUVyQyxPQUFDLDBCQUFRLE1BQU07Ozs7UUFFWCxjQUFVLElBQUksTUFBTTtZQUVqQixJQUFJOztnQkFDQTs7dUJBQVcsSUFBSSxHQUFHLE1BQU0sSUFBSSxLQUFNOzs7O3VCQUFVLElBQUksR0FBRyxNQUFNLEtBQUssS0FBTTs7Ozs7Z0JBRXBFOzt1QkFBVyxNQUFNLElBQUssS0FBTTs7Ozt1QkFDbEIsTUFBTSxLQUFLLEtBQU07Ozs7O0lBRXRDLE9BQUMsbUJBQU8sTUFBTTs7OztRQUVWLElBQUksTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFPO1FBQy9CLEVBQUUsT0FBTyxNQUFNLEtBQUs7ZUFDcEI7OztxQkFFSjs7OzthQUVrQixLQUFDOzs7O1FBRWYsS0FBQyxRQUFRLEdBQUcsTUFBTSxLQUFDO1FBQ25CLEtBQUMsTUFBTSxHQUFHLG1CQUFTOztZQUFRLDRCQUFvQixLQUFDLGVBQWU7O1FBQy9ELEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztZQUVqQixLQUFDLElBQUk7O1lBRUosY0FBUyxJQUFJLEtBQUssS0FBQztZQUVuQixLQUFDO2dDQUVXOzs7Z0JBQVI7b0JBQ0csS0FBSyxTQUFROzsrQkFDVCxLQUFLLE1BQVMsZUFBZTs7d0JBQzVCLFlBQUksT0FBRyxLQUFLO3dCQUNaOztvQkFHSixRQUFRLEdBQUcsTUFBTSxLQUFLO29CQUN0QixLQUFDLFNBQVMsS0FBSztvQkFFZixvQkFBVTs7MENBQVMsS0FBSzs7bUNBQVEsS0FBQyxTQUFTLElBQUssSUFBSzs7O29CQUNwRCxNQUFNLEdBQUcsa0JBQVM7O3dCQUFRLCtCQUF1QixLQUFLLGdCQUFnQjs7b0JBQ3RFLE1BQU0sR0FBRyxTQUFTLE9BQU8sS0FBSzs7Ozs7O3FCQUU5QyxxQkFBUzs7OztZQUVGLEtBQUMsSUFBSTs7Z0NBQ1MsS0FBQyxJQUFJOzs7Z0JBQWQ7d0JBQ08sT0FBTyxPQUFPLEtBQUs7OzJCQUNmOzs7Ozs7cUJBRXZCOzs7O1VBRUksS0FBQyxnQkFBRCxLQUFDLE1BQU87ZUFDRCxLQUFDO2VBQ0QsS0FBQztZQUNMLEtBQUMsSUFBSTs7Z0NBQ1MsS0FBQzs7O2dCQUFWO2dCQUNBLE1BQU07OzBCQUNILEtBQUM7Ozs7SUFHaEIsT0FBQyxtQkFBTTs7Ozs7O1lBR0MsSUFBSSxNQUFNLEtBQUssTUFBTSxjQUFjO1lBQ25DLE9BQU8sR0FBRyxTQUFTO1lBQ25CLEdBQUcsV0FBVyxFQUFHLEdBQUc7bUJBQ2xCOztlQUNBOzttQkFDRjs7OztxQkFFUix1QkFBVyxRQUFRLE1BQU0sTUFBSSxLQUFDOzs7O1lBRWhCLEtBQUMsT0FBTzs7OztRQUVsQixPQUFPLE1BQU0sS0FBSyxJQUFLO1lBRXBCLEtBQUMsUUFBUyxLQUFDLFNBQVE7Ozs7UUFHdEIsT0FBTyxNQUFNLEtBQUs7WUFFZixRQUFTLEtBQUs7O2dCQUNWLEtBQUM7O2dCQUNBLFlBQUksYUFBYTs7OztZQUd0Qjs7Z0JBRUksS0FBQyxJQUFJLFlBQWEsVUFBUSxLQUFDLGlCQUFELEtBQUMsT0FBUTs7Z0JBQ2xDLGFBQWEsS0FBQyxPQUFPO2dCQUNyQjs7a0NBQXdCLEtBQUM7O2dCQUN6QixXQUFXLFlBQWE7OztnQkFHekIsVUFBUSxLQUFDLGVBQUQsS0FBQyxLQUFNLHFCQUFTLEtBQUssTUFBTSx5QkFBYSxLQUFDLG1DQUFNLDBCQUFPOzs7O1lBR2pFLEtBQUMsUUFBTyxNQUFNLEtBQUssTUFBTyxLQUFLO21CQUMvQixLQUFDLEtBQUssVUFBUyxJQUFJLElBQUssS0FBSyxLQUFNLE9BQU8sT0FBUSxNQUFNOzs7O2dCQUlyRCxLQUFDLElBQUk7O3VCQUNKLEtBQUMsVUFDRyxLQUFPLEtBQ1AsTUFBTyxzQkFBYSxHQUFFLEdBQUU7Ozs7K0JBQ2IsRUFBRTsrQkFDVCxFQUFFLEtBQUssVUFBUyxJQUFJLEVBQUcsS0FBSyxFQUFHLE9BQU8sU0FBVSxNQUFNOzttQkFBRyxJQUFJLEtBQUssTUFBSTs7cUJBQzFFLEtBQUMsSUFBSTs7dUJBQ1QsS0FBQyxLQUFLLFVBQVMsSUFBSSxJQUFLLEtBQUssS0FBTSxPQUFPLFNBQVUsTUFBTTs7Ozs7V0FsSXpFOzs7ZUFvSU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/watch.kode
