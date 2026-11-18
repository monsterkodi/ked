var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var config

import kxk from "../../kxk.js"
let noon = kxk.noon
let slash = kxk.slash
let post = kxk.post
let watcher = kxk.watcher
let sds = kxk.sds


config = (function ()
{
    function config ()
    {}




    config["reloadTimer"] = null
    config["load"] = async function ()
    {
        var _13_14_

        this.loaded = new Promise((function (resolve)
        {
            return this.resolveLoaded = resolve
        }).bind(this))
        this.file = ((_13_14_=this.file) != null ? _13_14_ : slash.path(_k_.dir(),'../../../config'))
        await watcher.watch(this.file,{recursive:false})
        await this.read()
        post.emit('config.loaded',config.data)
        post.on('config.toggle',config.onConfigToggle)
        return this.resolveLoaded()
    }

    config["onConfigToggle"] = function (path)
    {
        sds.set(config.data,path,!(sds.get(config.data,path)))
        return noon.save(config.file,config.data)
    }

    config["read"] = async function ()
    {
        await watcher.snapshot(this.file)
        return this.data = await noon.load(this.file)
    }

    config["onFileChange"] = function (event)
    {
        if (event.path !== this.file)
        {
            return
        }
        if (!(_k_.in(event.change,['modify','rename'])))
        {
            return
        }
        if (this.reloadTimer)
        {
            clearTimeout(this.reloadTimer)
        }
        return this.reloadTimer = setTimeout(((function ()
        {
            return this.reload()
        }).bind(this)),100)
    }

    config["reload"] = async function ()
    {
        this.loaded = new Promise((function (resolve)
        {
            return this.resolveLoaded = resolve
        }).bind(this))
        try
        {
            await this.read()
            console.log("emit config.loaded")
            post.emit('config.loaded',config.data)
        }
        catch (err)
        {
            console.log('config reload failed',err)
        }
        return this.resolveLoaded()
    }

    return config
})()

post.on('file.change',(function (event)
{
    return config.onFileChange(event)
}).bind(this))
export default config;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2NvbmZpZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQUs7SUFBTTtJQUFLO0lBQVE7OztBQUN2QyxVQUFEOzs7Ozs7OztJQUtJLFFBQUMsZ0JBQWE7SUFFZCxRQUFDOzs7O1FBRUcsS0FBQyxhQUFhLG1CQUFTOzttQkFBWSxLQUFDLGdCQUFnQjs7UUFDcEQsS0FBQyxpQkFBRCxLQUFDLDBCQUFRLE1BQU0sS0FBTSxVQUFJO2NBRXZCLFFBQVEsTUFBTSxLQUFDLE1BQUssVUFBVTtjQUM5QixLQUFDO1FBRUgsS0FBSyxLQUFLLGdCQUFnQixPQUFPO1FBQ2pDLEtBQUssR0FBRyxnQkFBZ0IsT0FBTztlQUUvQixLQUFDOzs7SUFFTCxRQUFDLDZCQUFnQjs7UUFFYixJQUFJLElBQUksT0FBTyxLQUFLLE9BQVMsSUFBSSxJQUFJLE9BQU8sS0FBSztlQUNqRCxLQUFLLEtBQUssT0FBTyxLQUFLLE9BQU87OztJQUVqQyxRQUFDOztjQUVLLFFBQVEsU0FBUyxLQUFDO2VBQ3BCLEtBQUMsYUFBUSxLQUFLLEtBQUssS0FBQzs7O0lBRXhCLFFBQUMsMkJBQWM7O1lBRU4sTUFBTSxTQUFRLEtBQUM7Ozs7cUJBQ2YsTUFBTSxRQUFlLFNBQVM7Ozs7WUFFTixLQUFDOztZQUE5QixhQUFhLEtBQUM7O2VBQ2QsS0FBQyxjQUFjOzttQkFBZSxLQUFDO3VCQUFVOzs7SUFFN0MsUUFBQzs7UUFFRyxLQUFDLGFBQWEsbUJBQVM7O21CQUFZLEtBQUMsZ0JBQWdCOzs7O2tCQUc5QyxLQUFDO1lBQ0gsWUFBSTtZQUNKLEtBQUssS0FBSyxnQkFBZ0IsT0FBTzs7ZUFDL0I7O1lBQ0YsWUFBSSx1QkFBdUI7O2VBRS9CLEtBQUM7OztXQWpEUjs7O0FBbURELEtBQUssR0FBRyx5QkFBZTs7V0FBVSxPQUFPLGFBQWE7O2VBRTlDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/config.kode
