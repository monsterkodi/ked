var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var config

import kxk from "../../kxk.js"
let noon = kxk.noon
let slash = kxk.slash
let post = kxk.post
let watcher = kxk.watcher


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
        return this.resolveLoaded()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2NvbmZpZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQUs7SUFBTTtJQUFLOzs7QUFDL0IsVUFBRDs7Ozs7Ozs7SUFLSSxRQUFDLGdCQUFhO0lBRWQsUUFBQzs7OztRQUVHLEtBQUMsYUFBYSxtQkFBUzs7bUJBQVksS0FBQyxnQkFBZ0I7O1FBQ3BELEtBQUMsaUJBQUQsS0FBQywwQkFBUSxNQUFNLEtBQU0sVUFBSTtjQUl2QixRQUFRLE1BQU0sS0FBQyxNQUFLLFVBQVU7Y0FDOUIsS0FBQztRQUdILEtBQUssS0FBSyxnQkFBZ0IsT0FBTztlQUVqQyxLQUFDOzs7SUFLTCxRQUFDOztjQUVLLFFBQVEsU0FBUyxLQUFDO2VBQ3BCLEtBQUMsYUFBUSxLQUFLLEtBQUssS0FBQzs7O0lBRXhCLFFBQUMsMkJBQWM7O1lBRU4sTUFBTSxTQUFRLEtBQUM7Ozs7cUJBQ2YsTUFBTSxRQUFlLFNBQVM7Ozs7WUFFTixLQUFDOztZQUE5QixhQUFhLEtBQUM7O2VBQ2QsS0FBQyxjQUFjOzttQkFBZSxLQUFDO3VCQUFVOzs7SUFFN0MsUUFBQzs7UUFJRyxLQUFDLGFBQWEsbUJBQVM7O21CQUFZLEtBQUMsZ0JBQWdCOzs7O2tCQUc5QyxLQUFDO1lBQ0gsS0FBSyxLQUFLLGdCQUFnQixPQUFPOztlQUMvQjs7WUFDRixZQUFJLHVCQUF1Qjs7ZUFFL0IsS0FBQzs7O1dBbERSOzs7QUFvREQsS0FBSyxHQUFHLHlCQUFlOztXQUFVLE9BQU8sYUFBYTs7ZUFFOUMifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/config.kode
