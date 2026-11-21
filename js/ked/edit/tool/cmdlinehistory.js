var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var cmdlinehistory


cmdlinehistory = (function ()
{
    function cmdlinehistory (kind)
    {
        this.kind = kind
        this.key = `novim▸history▸${kind}`
        this.limit = 100
        this.index = 0
        this.draft = ''
        this.active = false
    }

    cmdlinehistory.prototype["session"] = function ()
    {
        var session

        session = global.ked_session
        if (!!_k_.empty(session))
        {
            return
        }
        if (!!_k_.empty(session.get))
        {
            return
        }
        if (!!_k_.empty(session.set))
        {
            return
        }
        return session
    }

    cmdlinehistory.prototype["list"] = function ()
    {
        var entries, session

        session = this.session()
        if (!session)
        {
            return []
        }
        entries = session.get(this.key)
        if (!!_k_.empty(entries))
        {
            return []
        }
        if (!Array.isArray(entries))
        {
            return []
        }
        return entries
    }

    cmdlinehistory.prototype["store"] = function (entries)
    {
        var session

        session = this.session()
        if (!session)
        {
            return false
        }
        session.set(this.key,entries)
        return true
    }

    cmdlinehistory.prototype["add"] = function (text)
    {
        var entries, old, stored

        if (!!_k_.empty(text))
        {
            return false
        }
        entries = this.list()
        old = entries.indexOf(text)
        if (old >= 0)
        {
            entries.splice(old,1)
        }
        entries.push(text)
        if (entries.length > this.limit)
        {
            entries.splice(0,entries.length - this.limit)
        }
        stored = this.store(entries)
        this.reset()
        return stored
    }

    cmdlinehistory.prototype["reset"] = function ()
    {
        this.active = false
        this.draft = ''
        this.index = this.list().length
        return true
    }

    cmdlinehistory.prototype["prev"] = function (text)
    {
        var entries

        entries = this.list()
        if (_k_.empty(entries))
        {
            return
        }
        if (!this.active)
        {
            this.draft = (text != null ? text : '')
            this.index = entries.length
            this.active = true
        }
        if (this.index <= 0)
        {
            return
        }
        this.index -= 1
        return entries[this.index]
    }

    cmdlinehistory.prototype["next"] = function (text)
    {
        var entries

        if (!this.active)
        {
            return
        }
        entries = this.list()
        if (this.index < entries.length)
        {
            this.index += 1
        }
        if (this.index === entries.length)
        {
            return this.draft
        }
        return entries[this.index]
    }

    return cmdlinehistory
})()

export default cmdlinehistory;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kbGluZWhpc3RvcnkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvdG9vbC9jbWRsaW5laGlzdG9yeS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFDLGtCQUFEOzthQU9JLGdCQUFHOztRQUVDLEtBQUMsT0FBUTtRQUNULEtBQUMsdUJBQXlCO1FBQzFCLEtBQUMsUUFBUTtRQUNULEtBQUMsUUFBUTtRQUNULEtBQUMsUUFBUTtRQUNULEtBQUMsU0FBUzs7OzhCQUVkOzs7O1FBRUksVUFBVSxPQUFPO3dCQUVGOzs7O3dCQUNBLFFBQVE7Ozs7d0JBQ1IsUUFBUTs7OztlQUV2Qjs7OzhCQUVKOzs7O1FBRUksVUFBVSxLQUFDO2FBRUM7Ozs7UUFFWixVQUFVLFFBQVEsSUFBSSxLQUFDO3dCQUVMOzs7O2FBQ04sTUFBTSxRQUFROzs7O2VBRTFCOzs7OEJBRUosb0JBQU87Ozs7UUFFSCxVQUFVLEtBQUM7YUFFSTs7bUJBQWI7O1FBRUYsUUFBUSxJQUFJLEtBQUMsSUFBSTtlQUVqQjs7OzhCQUVKLGtCQUFLOzs7O3dCQUVvQjs7bUJBQW5COztRQUVGLFVBQVUsS0FBQztRQUVYLE1BQU0sUUFBUSxRQUFRO1lBRUUsT0FBTzs7WUFBL0IsUUFBUSxPQUFPLElBQUk7O1FBRW5CLFFBQVEsS0FBSztZQUU2QixRQUFRLFNBQVMsS0FBQzs7WUFBNUQsUUFBUSxPQUFPLEVBQUUsUUFBUSxTQUFPLEtBQUM7O1FBRWpDLFNBQVMsS0FBQyxNQUFNO1FBRWhCLEtBQUM7ZUFFRDs7OzhCQUVKOztRQUVJLEtBQUMsU0FBUztRQUNWLEtBQUMsUUFBUztRQUNWLEtBQUMsUUFBUyxLQUFDLE9BQU87ZUFFbEI7Ozs4QkFFSixtQkFBTTs7OztRQUVGLFVBQVUsS0FBQztzQkFFQTs7OzthQUVKLEtBQUM7O1lBQ0osS0FBQyxTQUFTLGVBQUEsT0FBTztZQUNqQixLQUFDLFFBQVMsUUFBUTtZQUNsQixLQUFDLFNBQVM7O1lBRVQsS0FBQyxTQUFTOzs7O1FBRWYsS0FBQyxTQUFTO2VBRVYsUUFBUSxLQUFDOzs7OEJBRWIsbUJBQU07Ozs7YUFFTyxLQUFDOzs7O1FBRVYsVUFBVSxLQUFDO1lBRUksS0FBQyxRQUFRLFFBQVE7O1lBQWhDLEtBQUMsU0FBUzs7WUFFRSxLQUFDLFVBQVMsUUFBUTs7bUJBQTVCLEtBQUM7O2VBRUgsUUFBUSxLQUFDOzs7V0F4R2hCOzs7ZUEwR00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/cmdlinehistory.kode
