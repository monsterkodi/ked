var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var config

import kxk from "../../kxk.js"
let noon = kxk.noon
let slash = kxk.slash
let post = kxk.post

import watcher from "./watcher.js"


config = (function ()
{
    function config ()
    {}




    config["reloadTimer"] = null
    config["load"] = async function ()
    {
        var _14_14_

        this.loaded = new Promise((function (resolve)
        {
            return this.resolveLoaded = resolve
        }).bind(this))
        this.file = ((_14_14_=this.file) != null ? _14_14_ : slash.path(_k_.dir(),'../../../config'))
        console.log('load config file',this.file)
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
        if (!(_k_.in(event.change,['change','rename'])))
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
        console.log('reload config file',this.file)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2NvbmZpZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQUs7SUFBTTs7T0FDWCxjQUFBOzs7QUFDZixVQUFEOzs7Ozs7OztJQUtJLFFBQUMsZ0JBQWE7SUFFZCxRQUFDOzs7O1FBRUcsS0FBQyxhQUFhLG1CQUFTOzttQkFBWSxLQUFDLGdCQUFnQjs7UUFDcEQsS0FBQyxpQkFBRCxLQUFDLDBCQUFRLE1BQU0sS0FBTSxVQUFJO1FBRXpCLFlBQUksbUJBQW1CLEtBQUM7Y0FHdEIsUUFBUSxNQUFNLEtBQUMsTUFBSyxVQUFVO2NBQzlCLEtBQUM7UUFHSCxLQUFLLEtBQUssZ0JBQWdCLE9BQU87ZUFFakMsS0FBQzs7O0lBS0wsUUFBQzs7Y0FFSyxRQUFRLFNBQVMsS0FBQztlQUNwQixLQUFDLGFBQVEsS0FBSyxLQUFLLEtBQUM7OztJQUV4QixRQUFDLDJCQUFjOztZQUVOLE1BQU0sU0FBUSxLQUFDOzs7O3FCQUNmLE1BQU0sUUFBZSxTQUFTOzs7O1lBRU4sS0FBQzs7WUFBOUIsYUFBYSxLQUFDOztlQUNkLEtBQUMsY0FBYzs7bUJBQWUsS0FBQzt1QkFBVTs7O0lBRTdDLFFBQUM7O1FBRUcsWUFBSSxxQkFBcUIsS0FBQztRQUUxQixLQUFDLGFBQWEsbUJBQVM7O21CQUFZLEtBQUMsZ0JBQWdCOzs7O2tCQUc5QyxLQUFDO1lBQ0gsS0FBSyxLQUFLLGdCQUFnQixPQUFPOztlQUMvQjs7WUFDRixZQUFJLHVCQUF1Qjs7ZUFFL0IsS0FBQzs7O1dBbkRSOzs7QUFxREQsS0FBSyxHQUFHLHlCQUFlOztXQUFVLE9BQU8sYUFBYTs7ZUFFOUMifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/config.kode
