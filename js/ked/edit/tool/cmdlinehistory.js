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
            return null
        }
        if (!!_k_.empty(session.get))
        {
            return null
        }
        if (!!_k_.empty(session.set))
        {
            return null
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
            return null
        }
        if (!this.active)
        {
            this.draft = (text != null ? text : '')
            this.index = entries.length
            this.active = true
        }
        if (this.index <= 0)
        {
            return null
        }
        this.index -= 1
        return entries[this.index]
    }

    cmdlinehistory.prototype["next"] = function (text)
    {
        var entries

        if (!this.active)
        {
            return null
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kbGluZWhpc3RvcnkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvdG9vbC9jbWRsaW5laGlzdG9yeS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFDLGtCQUFEOzthQU9JLGdCQUFHOztRQUVDLEtBQUMsT0FBUTtRQUNULEtBQUMsdUJBQXlCO1FBQzFCLEtBQUMsUUFBUTtRQUNULEtBQUMsUUFBUTtRQUNULEtBQUMsUUFBUTtRQUNULEtBQUMsU0FBUzs7OzhCQUVkOzs7O1FBRUksVUFBVSxPQUFPO3dCQUVHOzttQkFBbEI7O3dCQUNrQixRQUFROzttQkFBMUI7O3dCQUNrQixRQUFROzttQkFBMUI7O2VBRUY7Ozs4QkFFSjs7OztRQUVJLFVBQVUsS0FBQzthQUVDOzs7O1FBRVosVUFBVSxRQUFRLElBQUksS0FBQzt3QkFFTDs7OzthQUNOLE1BQU0sUUFBUTs7OztlQUUxQjs7OzhCQUVKLG9CQUFPOzs7O1FBRUgsVUFBVSxLQUFDO2FBRUk7O21CQUFiOztRQUVGLFFBQVEsSUFBSSxLQUFDLElBQUk7ZUFFakI7Ozs4QkFFSixrQkFBSzs7Ozt3QkFFb0I7O21CQUFuQjs7UUFFRixVQUFVLEtBQUM7UUFFWCxNQUFNLFFBQVEsUUFBUTtZQUVFLE9BQU87O1lBQS9CLFFBQVEsT0FBTyxJQUFJOztRQUVuQixRQUFRLEtBQUs7WUFFNkIsUUFBUSxTQUFTLEtBQUM7O1lBQTVELFFBQVEsT0FBTyxFQUFFLFFBQVEsU0FBTyxLQUFDOztRQUVqQyxTQUFTLEtBQUMsTUFBTTtRQUVoQixLQUFDO2VBRUQ7Ozs4QkFFSjs7UUFFSSxLQUFDLFNBQVM7UUFDVixLQUFDLFFBQVM7UUFDVixLQUFDLFFBQVMsS0FBQyxPQUFPO2VBRWxCOzs7OEJBRUosbUJBQU07Ozs7UUFFRixVQUFVLEtBQUM7c0JBRUs7O21CQUFkOzthQUVLLEtBQUM7O1lBQ0osS0FBQyxTQUFTLGVBQUEsT0FBTztZQUNqQixLQUFDLFFBQVMsUUFBUTtZQUNsQixLQUFDLFNBQVM7O1lBRUosS0FBQyxTQUFTOzttQkFBbEI7O1FBRUYsS0FBQyxTQUFTO2VBRVYsUUFBUSxLQUFDOzs7OEJBRWIsbUJBQU07Ozs7YUFFWSxLQUFDOzttQkFBYjs7UUFFRixVQUFVLEtBQUM7WUFFSSxLQUFDLFFBQVEsUUFBUTs7WUFBaEMsS0FBQyxTQUFTOztZQUVFLEtBQUMsVUFBUyxRQUFROzttQkFBNUIsS0FBQzs7ZUFFSCxRQUFRLEtBQUM7OztXQXhHaEI7OztlQTBHTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/cmdlinehistory.kode
