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
        console.log(`onConfigToggle ${path}`,config.data)
        sds.set(config.data,path,!(sds.get(config.data,path)))
        console.log("onConfigToggle",config.data)
        return post.emit('config.loaded',config.data)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2NvbmZpZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQUs7SUFBTTtJQUFLO0lBQVE7OztBQUN2QyxVQUFEOzs7Ozs7OztJQUtJLFFBQUMsZ0JBQWE7SUFFZCxRQUFDOzs7O1FBRUcsS0FBQyxhQUFhLG1CQUFTOzttQkFBWSxLQUFDLGdCQUFnQjs7UUFDcEQsS0FBQyxpQkFBRCxLQUFDLDBCQUFRLE1BQU0sS0FBTSxVQUFJO2NBSXZCLFFBQVEsTUFBTSxLQUFDLE1BQUssVUFBVTtjQUM5QixLQUFDO1FBR0gsS0FBSyxLQUFLLGdCQUFnQixPQUFPO1FBQ2pDLEtBQUssR0FBRyxnQkFBZ0IsT0FBTztlQUUvQixLQUFDOzs7SUFFTCxRQUFDLDZCQUFnQjs7UUFDYiw4QkFBc0IsT0FBTyxPQUFPO1FBQ3BDLElBQUksSUFBSSxPQUFPLEtBQUssT0FBUyxJQUFJLElBQUksT0FBTyxLQUFLO1FBQ2pELFlBQUksaUJBQWlCLE9BQU87ZUFDNUIsS0FBSyxLQUFLLGdCQUFnQixPQUFPOzs7SUFLckMsUUFBQzs7Y0FFSyxRQUFRLFNBQVMsS0FBQztlQUNwQixLQUFDLGFBQVEsS0FBSyxLQUFLLEtBQUM7OztJQUV4QixRQUFDLDJCQUFjOztZQUVOLE1BQU0sU0FBUSxLQUFDOzs7O3FCQUNmLE1BQU0sUUFBZSxTQUFTOzs7O1lBRU4sS0FBQzs7WUFBOUIsYUFBYSxLQUFDOztlQUNkLEtBQUMsY0FBYzs7bUJBQWUsS0FBQzt1QkFBVTs7O0lBRTdDLFFBQUM7O1FBSUcsS0FBQyxhQUFhLG1CQUFTOzttQkFBWSxLQUFDLGdCQUFnQjs7OztrQkFHOUMsS0FBQztZQUNILEtBQUssS0FBSyxnQkFBZ0IsT0FBTzs7ZUFDL0I7O1lBQ0YsWUFBSSx1QkFBdUI7O2VBRS9CLEtBQUM7OztXQXpEUjs7O0FBMkRELEtBQUssR0FBRyx5QkFBZTs7V0FBVSxPQUFPLGFBQWE7O2VBRTlDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/config.kode
