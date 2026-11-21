var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var jumplist


jumplist = (function ()
{
    function jumplist ()
    {
        this.max = 100
        this.entries = []
        this.index = this.entries.length
    }

    jumplist.prototype["sameLine"] = function (a, b)
    {
        if (!!_k_.empty(a) || !!_k_.empty(b))
        {
            return false
        }
        return a.file === b.file && a.y === b.y
    }

    jumplist.prototype["removeLine"] = function (entry)
    {
        var e, i

        var list = _k_.list(this.entries)
        for (i = 0; i < list.length; i++)
        {
            e = list[i]
            if (this.sameLine(e,entry))
            {
                this.entries.splice(i,1)
                return i
            }
        }
        return -1
    }

    jumplist.prototype["trim"] = function ()
    {
        if (this.entries.length > this.max)
        {
            return this.entries.splice(0,this.entries.length - this.max)
        }
    }

    jumplist.prototype["record"] = function (entry)
    {
        if (!!_k_.empty(entry))
        {
            return false
        }
        if (this.index < this.entries.length)
        {
            this.entries = this.entries.slice(0, typeof this.index === 'number' ? this.index+1 : Infinity)
        }
        this.removeLine(entry)
        this.entries.push(entry)
        this.trim()
        this.index = this.entries.length
        return true
    }

    jumplist.prototype["older"] = function (current)
    {
        if (_k_.empty(this.entries))
        {
            return
        }
        if (this.index >= this.entries.length)
        {
            this.removeLine(current)
            this.entries.push(current)
            this.trim()
            this.index = this.entries.length - 2
            if (this.index < 0)
            {
                return
            }
            return this.entries[this.index]
        }
        if (this.index <= 0)
        {
            return
        }
        this.index -= 1
        return this.entries[this.index]
    }

    jumplist.prototype["newer"] = function ()
    {
        if (this.index >= this.entries.length - 1)
        {
            return
        }
        this.index += 1
        return this.entries[this.index]
    }

    return jumplist
})()

export default jumplist;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVtcGxpc3QuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvdG9vbC9qdW1wbGlzdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFDLFlBQUQ7O2FBSUk7O1FBRUksS0FBQyxNQUFVO1FBQ1gsS0FBQztRQUNELEtBQUMsUUFBVSxLQUFDLFFBQVE7Ozt3QkFFeEIsdUJBQVUsR0FBRTs7d0JBRWEsa0JBQWU7O21CQUFsQzs7ZUFFRixFQUFFLFNBQVEsRUFBRSxRQUFTLEVBQUUsTUFBSyxFQUFFOzs7d0JBRWxDLHlCQUFZOzs7OzRCQUVHLEtBQUM7YUFBTjs7WUFBRjtnQkFDRyxLQUFDLFNBQVMsRUFBRTs7Z0JBQ1gsS0FBQyxRQUFRLE9BQU8sRUFBRTt1QkFDaEI7OztlQUVWOzs7d0JBRUo7O1lBRU8sS0FBQyxRQUFRLFNBQVMsS0FBQzs7bUJBQ2xCLEtBQUMsUUFBUSxPQUFPLEVBQUUsS0FBQyxRQUFRLFNBQU8sS0FBQzs7Ozt3QkFFM0MscUJBQVE7O3dCQUVpQjs7bUJBQW5COztZQUVnQyxLQUFDLFFBQVEsS0FBQyxRQUFROztZQUFwRCxLQUFDLFVBQVUsS0FBQyxjQUFRLFVBQUcsS0FBQyxxQkFBRCxLQUFDOztRQUV4QixLQUFDLFdBQVc7UUFFWixLQUFDLFFBQVEsS0FBSztRQUNkLEtBQUM7UUFFRCxLQUFDLFFBQVEsS0FBQyxRQUFRO2VBRWxCOzs7d0JBRUosb0JBQU87O3NCQUVRLEtBQUM7Ozs7WUFFVCxLQUFDLFNBQVMsS0FBQyxRQUFROztZQUNsQixLQUFDLFdBQVc7WUFDWixLQUFDLFFBQVEsS0FBSztZQUNkLEtBQUM7WUFDRCxLQUFDLFFBQVEsS0FBQyxRQUFRLFNBQVM7Z0JBQ3RCLEtBQUMsUUFBUTs7OzttQkFDWixLQUFDLFFBQVEsS0FBQzs7WUFFWCxLQUFDLFNBQVM7Ozs7UUFFZixLQUFDLFNBQVM7ZUFFVixLQUFDLFFBQVEsS0FBQzs7O3dCQUVkOztZQUVTLEtBQUMsU0FBUyxLQUFDLFFBQVEsU0FBTzs7OztRQUUvQixLQUFDLFNBQVM7ZUFFVixLQUFDLFFBQVEsS0FBQzs7O1dBckVqQjs7O2VBdUVNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/jumplist.kode
