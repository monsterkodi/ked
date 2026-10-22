var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var session

import noon from "../../kxk/noon.js"
import events from "../../kxk/events.js"
import slash from "../../kxk/slash.js"
import post from "../../kxk/post.js"
import nfs from "../../kxk/nfs.js"
import sds from "../../kxk/sds.js"

import util from "../../kxk/util.js"
let isEqual = util.isEqual
let defaults = util.defaults
let sessionId = util.sessionId

import frecent from "./frecent.js"


session = (function ()
{
    _k_.extend(session, events)
    function session (opt)
    {
        var _30_31_, _32_30_

        this["cleanSessions"] = this["cleanSessions"].bind(this)
        this["listSessions"] = this["listSessions"].bind(this)
        this["newestSessionFile"] = this["newestSessionFile"].bind(this)
        this["loadAndMerge"] = this["loadAndMerge"].bind(this)
        this["save"] = this["save"].bind(this)
        this["load"] = this["load"].bind(this)
        this["reload"] = this["reload"].bind(this)
        this["recentFiles"] = this["recentFiles"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["delayedSave"] = this["delayedSave"].bind(this)
        this["del"] = this["del"].bind(this)
        this["set"] = this["set"].bind(this)
        this["get"] = this["get"].bind(this)
        this["keypath"] = this["keypath"].bind(this)
        this.name = sessionId()
        opt = (opt != null ? opt : {})
        this.timeout = ((_30_31_=opt.timeout) != null ? _30_31_ : 1000)
        this.sep = ((_32_30_=opt.separator) != null ? _32_30_ : '▸')
        this.dir = slash.absolute("~/.config/ked/sessions/")
        this.file = slash.path(this.dir,`${this.name}.noon`)
        if (!opt.fresh)
        {
            this.loadAndMerge()
            this.cleanSessions()
        }
        return session.__super__.constructor.apply(this, arguments)
    }

    session.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    session.prototype["get"] = function (key, value)
    {
        var _51_41_

        if (!((key != null ? key.split : undefined) != null))
        {
            return _k_.clone((value))
        }
        return _k_.clone(sds.get(this.data,this.keypath(key),value))
    }

    session.prototype["set"] = function (key, value)
    {
        var _67_14_

        if (!(_k_.isStr(key)))
        {
            return
        }
        if (_k_.eql(this.get(key), value))
        {
            return
        }
        if (this.get(key) === value)
        {
            return
        }
        if (_k_.empty(value))
        {
            return this.del(key)
        }
        this.data = ((_67_14_=this.data) != null ? _67_14_ : {})
        sds.set(this.data,this.keypath(key),value)
        return this.delayedSave()
    }

    session.prototype["del"] = function (key)
    {
        if (!this.data)
        {
            return
        }
        sds.del(this.data,this.keypath(key))
        return this.delayedSave()
    }

    session.prototype["delayedSave"] = function ()
    {
        clearTimeout(this.timer)
        return this.timer = setTimeout(((function ()
        {
            return this.save()
        }).bind(this)),this.timeout)
    }

    session.prototype["clear"] = function ()
    {
        this.data = {}
        return clearTimeout(this.timer)
    }

    session.prototype["recentFiles"] = function ()
    {
        return Object.keys(this.get('files▸recent',{}))
    }

    session.prototype["reload"] = function ()
    {
        return this.load()
    }

    session.prototype["load"] = async function ()
    {
        try
        {
            return this.data = await noon.load(this.file)
        }
        catch (err)
        {
            console.error(`session -- can't load '${this.file}':`,err)
            return {}
        }
    }

    session.prototype["save"] = async function ()
    {
        var result, text

        if (!this.file)
        {
            return
        }
        if (_k_.empty(this.data))
        {
            return
        }
        clearTimeout(this.timer)
        this.timer = null
        try
        {
            text = noon.stringify(this.data,{indent:4,maxalign:8}) + '\n'
            result = await nfs.write(this.file,text)
            if (result.error)
            {
                console.log('session.save failed!',this.file,result)
            }
        }
        catch (err)
        {
            console.log(`session -- can't save to '${this.file}':`,err)
        }
    }

    session.prototype["loadAndMerge"] = async function ()
    {
        var file, recent

        file = await this.newestSessionFile()
        if (!_k_.empty(file))
        {
            recent = await noon.read(file)
            post.emit('session.merge',recent)
            this.set('files',recent.files)
            this.set('editor',recent.editor)
        }
        return this.emit('loaded')
    }

    session.prototype["newestSessionFile"] = async function ()
    {
        var files

        files = await this.listSessions()
        return files.slice(-1)[0]
    }

    session.prototype["listSessions"] = async function ()
    {
        var f, files

        files = await nfs.list(this.dir)
        return (function () { var r_a_ = []; var list = _k_.list(files); for (var _b_ = 0; _b_ < list.length; _b_++)  { f = list[_b_];r_a_.push(f.path)  } return r_a_ }).bind(this)()
    }

    session.prototype["cleanSessions"] = async function ()
    {
        var file, files, maxFiles

        maxFiles = 100
        files = await this.listSessions()
        var list = _k_.list(files.slice(0, files.length - maxFiles))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            await nfs.remove(file)
        }
    }

    return session
})()

export default session;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9zZXNzaW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQlMsV0FBVDs7d0JBQXlCO2FBRXJCLFNBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLEtBQUMsT0FBTztRQUVSLE9BQUEsY0FBQTtRQUVBLEtBQUMsb0JBQVUsSUFBSSw2QkFBVTtRQUV6QixLQUFDLGdCQUFPLElBQUksK0JBQVk7UUFFeEIsS0FBQyxNQUFPLE1BQU0sU0FBUztRQUN2QixLQUFDLE9BQU8sTUFBTSxLQUFLLEtBQUMsT0FBTyxLQUFDO2FBRXJCLElBQUk7O1lBQ1AsS0FBQztZQUNELEtBQUM7Ozs7O3VCQUVULHNCQUFTOztlQUFPLElBQUksTUFBTSxLQUFDOzs7dUJBUTNCLGtCQUFLLEtBQUk7Ozs7ZUFFa0IsY0FBQSxJQUFLOzs4QkFBbkI7O3lCQUNILElBQUksSUFBSSxLQUFDLEtBQUssS0FBQyxRQUFRLEtBQUs7Ozt1QkFRdEMsa0JBQUssS0FBSTs7Ozt3QkFFSzs7OztvQkFDSixLQUFDLElBQUksTUFBUzs7OztZQUNkLEtBQUMsSUFBSSxTQUFROzs7O3NCQUNHOzttQkFBbkIsS0FBQyxJQUFJOztRQUVSLEtBQUMsaUJBQUQsS0FBQztRQUNELElBQUksSUFBSSxLQUFDLEtBQUssS0FBQyxRQUFRLEtBQUs7ZUFDNUIsS0FBQzs7O3VCQUVMLGtCQUFLOzthQUVTLEtBQUM7Ozs7UUFDWCxJQUFJLElBQUksS0FBQyxLQUFLLEtBQUMsUUFBUTtlQUN2QixLQUFDOzs7dUJBRUw7O1FBRUksYUFBYSxLQUFDO2VBQ2QsS0FBQyxRQUFROzttQkFBZSxLQUFDO3VCQUFRLEtBQUM7Ozt1QkFFdEM7O1FBRUksS0FBQztlQUVELGFBQWEsS0FBQzs7O3VCQUVsQjs7ZUFBZ0IsT0FBTyxLQUFLLEtBQUMsSUFBSTs7O3VCQVFqQzs7ZUFBVyxLQUFDOzs7dUJBRVo7Ozs7bUJBR1EsS0FBQyxhQUFRLEtBQUssS0FBSyxLQUFDOztlQUNsQjs7WUFDRix3Q0FBZ0MsS0FBQyxTQUFTOzs7Ozt1QkFTbEQ7Ozs7YUFFYyxLQUFDOzs7O3NCQUNDLEtBQUM7Ozs7UUFFYixhQUFhLEtBQUM7UUFDZCxLQUFDLFFBQVE7OztZQUdMLE9BQU8sS0FBSyxVQUFVLEtBQUMsTUFBTSxPQUFPLEVBQUUsU0FBUyxNQUFJO1lBRW5ELGVBQVUsSUFBSSxNQUFNLEtBQUMsS0FBSztnQkFDdkIsT0FBTzs7Z0JBQ04sWUFBSSx1QkFBdUIsS0FBQyxLQUFLOzs7ZUFJbkM7O1lBQ0YseUNBQWlDLEtBQUMsU0FBUzs7Ozt1QkFRbkQ7Ozs7UUFFSSxhQUFRLEtBQUM7dUJBRUE7O1lBRUwsZUFBVSxLQUFLLEtBQUs7WUFFcEIsS0FBSyxLQUFLLGdCQUFnQjtZQUUxQixLQUFDLElBQUksUUFBUyxPQUFPO1lBQ3JCLEtBQUMsSUFBSSxTQUFTLE9BQU87O2VBRXpCLEtBQUMsS0FBSzs7O3VCQVFWOzs7O1FBRUksY0FBUyxLQUFDO2VBQ1Y7Ozt1QkFFSjs7OztRQUVJLGNBQVMsSUFBSSxLQUFLLEtBQUM7aUVBQ0YsdURBQUwsd0JBQVgsRUFBRTs7O3VCQUVQOzs7O1FBRUksV0FBVztRQUNYLGNBQVMsS0FBQzs0QkFDRSxZQUFNLEdBQUksTUFBTSxTQUFPOzs7WUFBL0I7a0JBQ0UsSUFBSSxPQUFPOzs7O1dBeEpoQjs7O2VBMEpGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/session.kode
