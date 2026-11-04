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
    
        var _13_34_, _16_32_, _20_61_

        this["save"] = this["save"].bind(this)
        if (!this.name)
        {
            return console.error('stash.constructor -- no name?')
        }
        this.sep = ((_13_34_=(opt != null ? opt.separator : undefined)) != null ? _13_34_ : '|')
        this.timer = null
        this.file = slash.path(kakao.bundle.path,`/.stash/${this.name}.noon`)
        this.timeout = ((_16_32_=(opt != null ? opt.timeout : undefined)) != null ? _16_32_ : 500)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Rhc2guanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL3N0YXNoLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxXQUFBO09BQUssV0FBQTtPQUFLLFlBQUE7T0FBTSxVQUFBO09BQUksV0FBQTtPQUFLLFVBQUE7O09BQ2hDLFdBQUE7SUFBTztJQUFTOzs7QUFDckIsU0FBRDs7YUFLSSxPQUFJLE1BQUs7O1FBQU47Ozs7O2FBRWdELEtBQUM7O21CQUE5QyxjQUFNOztRQUVSLEtBQUMsaUJBQVUsY0FBQSxJQUFLLDRDQUFZO1FBQzVCLEtBQUMsUUFBVTtRQUNYLEtBQUMsT0FBVSxNQUFNLEtBQUssTUFBTSxPQUFPLGdCQUFpQixLQUFDO1FBQ3JELEtBQUMscUJBQVUsY0FBQSxJQUFLLDBDQUFVO1FBQzFCLEtBQUM7UUFFRCxLQUFDO2NBQ3VDLGNBQUEsSUFBSzs7WUFBN0MsS0FBQyxPQUFPLFNBQVMsS0FBQyxLQUFNLElBQUk7O1FBQzVCLEtBQUM7OztxQkFFTCxzQkFBUzs7ZUFBTyxJQUFJLE1BQU0sS0FBQzs7O3FCQUUzQixrQkFBSyxLQUFJOztjQUU4QyxVQUFQOztZQUE1QyxjQUFNLDJCQUEyQjs7Y0FDWCxVQUFQOzttQkFBYjs7ZUFDRixJQUFJLElBQUksS0FBQyxLQUFNLEtBQUMsUUFBUSxLQUFNOzs7cUJBRWxDLGtCQUFLLEtBQUk7O2NBRWdELFVBQVA7O21CQUE1QyxjQUFNLDJCQUEyQjs7YUFFNUIsUUFBUSxNQUFPLElBQUksSUFBSSxLQUFDLEtBQU0sS0FBQyxRQUFROztZQUUxQyxJQUFJLElBQUksS0FBQyxLQUFNLEtBQUMsUUFBUSxLQUFNO2lCQUV2QixRQUFRLE1BQU8sSUFBSSxJQUFJLEtBQUMsS0FBTSxLQUFDLFFBQVE7O2dCQUMxQyxhQUFLLGdCQUFnQixJQUFLLE1BQU8sS0FBQzs7Z0JBRWYsS0FBQzs7Z0JBQXhCLGFBQWEsS0FBQzs7bUJBQ2QsS0FBQyxRQUFRLFdBQVcsS0FBQyxLQUFNLEtBQUM7Ozs7cUJBRXBDLGtCQUFLOztlQUFPLEtBQUMsSUFBSTs7O3FCQUVqQjs7eUJBQWtCLEtBQUM7OztxQkFFbkI7O1FBRUksS0FBQztRQUNELGFBQWEsS0FBQztRQUNkLEtBQUMsUUFBUTtlQUNULElBQUksT0FBTyxLQUFDOzs7cUJBRWhCLHlCQUFNOzs7O1FBRUYsUUFBQSxlQUFBLE9BQVEsS0FBQztRQUNULGFBQVEsS0FBSyxLQUFLO3VCQUVUOztZQUNMLEtBQUMsT0FBTztZQUNSLEtBQUssS0FBSzs7OztZQUVWLEtBQUssS0FBSzs7ZUFFZCxLQUFDOzs7cUJBRUw7Ozs7UUFFSSxhQUFhLEtBQUM7UUFDZCxLQUFDLFFBQVE7YUFFQSxLQUFDOzs7Ozs7WUFHTixPQUFPLEtBQUssVUFBVSxLQUFDO1lBQ3ZCLElBQUksTUFBTSxLQUFDLEtBQU0sTUFBTSxlQUFNOzs7ZUFFM0I7O1lBQ0YsOENBQXNDLEtBQUMsVUFBVTs7ZUFDckQ7OztXQTlFUDs7O2VBZ0ZNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/stash.kode
