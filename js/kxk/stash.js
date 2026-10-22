var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Stash

import noon from "./noon.js"
import post from "./post.js"
import slash from "./slash.js"
import sds from "./sds.js"
import kstr from "./kstr.js"
import nfs from "./nfs.js"

import util from "./util.js"
let defaults = util.defaults
let isEqual = util.isEqual


Stash = (function ()
{
    function Stash (name, opt)
    {
        this.name = name
    
        var _22_34_, _25_32_, _29_61_

        this["save"] = this["save"].bind(this)
        if (!this.name)
        {
            return console.error('stash.constructor -- no name?')
        }
        this.sep = ((_22_34_=(opt != null ? opt.separator : undefined)) != null ? _22_34_ : '|')
        this.timer = null
        this.file = slash.path(kakao.bundle.path,`/.stash/${this.name}.noon`)
        this.timeout = ((_25_32_=(opt != null ? opt.timeout : undefined)) != null ? _25_32_ : 500)
        this.changes = []
        this.data = {}
        if (((opt != null ? opt.defaults : undefined) != null))
        {
            this.data = defaults(this.data,opt.defaults)
        }
        this.load()
    }

    Stash.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    Stash.prototype["get"] = function (key, value)
    {
        if (!(_k_.isStr(key)))
        {
            console.error('stash.get -- invalid key',key)
        }
        if (!(_k_.isStr(key)))
        {
            return value
        }
        return sds.get(this.data,this.keypath(key),value)
    }

    Stash.prototype["set"] = function (key, value)
    {
        if (!(_k_.isStr(key)))
        {
            return console.error('stash.set -- invalid key',key)
        }
        if (!isEqual(value,sds.get(this.data,this.keypath(key))))
        {
            sds.set(this.data,this.keypath(key),value)
            if (!isEqual(value,sds.get(this.data,this.keypath(key))))
            {
                console.warn('sds.set fail?',key,value,this.data)
            }
            if (this.timer)
            {
                clearTimeout(this.timer)
            }
            return this.timer = setTimeout(this.save,this.timeout)
        }
    }

    Stash.prototype["del"] = function (key)
    {
        return this.set(key)
    }

    Stash.prototype["isEmpty"] = function ()
    {
        return _k_.empty(this.data)
    }

    Stash.prototype["clear"] = function ()
    {
        this.data = {}
        clearTimeout(this.timer)
        this.timer = null
        return nfs.remove(this.file)
    }

    Stash.prototype["load"] = async function (file)
    {
        var data

        file = (file != null ? file : this.file)
        data = await noon.load(file)
        if (!_k_.empty(data))
        {
            this.data = data
            post.emit('stashLoaded')
        }
        else
        {
            post.emit('stashMissing')
        }
        return this.data
    }

    Stash.prototype["save"] = function ()
    {
        var text

        clearTimeout(this.timer)
        this.timer = null
        if (!this.file)
        {
            return
        }
        try
        {
            text = noon.stringify(this.data)
            nfs.write(this.file,text).then(function (file)
            {})
        }
        catch (err)
        {
            console.error(`stash.save -- can't save to '${this.file}': ${err}`)
        }
        return true
    }

    return Stash
})()

export default Stash;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Rhc2guanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL3N0YXNoLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FZYSxXQUFBO09BQUssV0FBQTtPQUFLLFlBQUE7T0FBTSxVQUFBO09BQUksV0FBQTtPQUFLLFVBQUE7O09BQ2hDLFdBQUE7SUFBTztJQUFTOzs7QUFFYixTQUFUOzthQUVJLE9BQUksTUFBSzs7UUFBTjs7Ozs7YUFFZ0QsS0FBQzs7bUJBQTlDLGNBQU07O1FBRVIsS0FBQyxpQkFBVSxjQUFBLElBQUssNENBQVk7UUFDNUIsS0FBQyxRQUFVO1FBQ1gsS0FBQyxPQUFVLE1BQU0sS0FBSyxNQUFNLE9BQU8sZ0JBQWlCLEtBQUM7UUFDckQsS0FBQyxxQkFBVSxjQUFBLElBQUssMENBQVU7UUFDMUIsS0FBQztRQUVELEtBQUM7Y0FDdUMsY0FBQSxJQUFLOztZQUE3QyxLQUFDLE9BQU8sU0FBUyxLQUFDLEtBQU0sSUFBSTs7UUFDNUIsS0FBQzs7O3FCQUVMLHNCQUFTOztlQUFPLElBQUksTUFBTSxLQUFDOzs7cUJBUTNCLGtCQUFLLEtBQUk7O2NBRThDLFVBQVA7O1lBQTVDLGNBQU0sMkJBQTJCOztjQUNYLFVBQVA7O21CQUFiOztlQUNGLElBQUksSUFBSSxLQUFDLEtBQU0sS0FBQyxRQUFRLEtBQU07OztxQkFRbEMsa0JBQUssS0FBSTs7Y0FFZ0QsVUFBUDs7bUJBQTVDLGNBQU0sMkJBQTJCOzthQUU1QixRQUFRLE1BQU8sSUFBSSxJQUFJLEtBQUMsS0FBTSxLQUFDLFFBQVE7O1lBRTFDLElBQUksSUFBSSxLQUFDLEtBQU0sS0FBQyxRQUFRLEtBQU07aUJBRXZCLFFBQVEsTUFBTyxJQUFJLElBQUksS0FBQyxLQUFNLEtBQUMsUUFBUTs7Z0JBQzFDLGFBQUssZ0JBQWdCLElBQUssTUFBTyxLQUFDOztnQkFFZixLQUFDOztnQkFBeEIsYUFBYSxLQUFDOzttQkFDZCxLQUFDLFFBQVEsV0FBVyxLQUFDLEtBQU0sS0FBQzs7OztxQkFFcEMsa0JBQUs7O2VBQU8sS0FBQyxJQUFJOzs7cUJBRWpCOzt5QkFBa0IsS0FBQzs7O3FCQUVuQjs7UUFFSSxLQUFDO1FBQ0QsYUFBYSxLQUFDO1FBQ2QsS0FBQyxRQUFRO2VBQ1QsSUFBSSxPQUFPLEtBQUM7OztxQkFRaEIseUJBQU07Ozs7UUFFRixRQUFBLGVBQUEsT0FBUSxLQUFDO1FBQ1QsYUFBUSxLQUFLLEtBQUs7dUJBRVQ7O1lBQ0wsS0FBQyxPQUFPO1lBQ1IsS0FBSyxLQUFLOzs7O1lBRVYsS0FBSyxLQUFLOztlQUVkLEtBQUM7OztxQkFRTDs7OztRQUVJLGFBQWEsS0FBQztRQUNkLEtBQUMsUUFBUTthQUVBLEtBQUM7Ozs7OztZQUdOLE9BQU8sS0FBSyxVQUFVLEtBQUM7WUFDdkIsSUFBSSxNQUFNLEtBQUMsS0FBTSxNQUFNLGVBQU07OztlQUUzQjs7WUFDRiw4Q0FBc0MsS0FBQyxVQUFVOztlQUNyRDs7O1dBbkdDOzs7ZUFxR0YifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/stash.kode
