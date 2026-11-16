var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var changelist


changelist = (function ()
{
    function changelist ()
    {
        this.max = 100
        this.distance = 79
        this.entries = []
        this.index = this.entries.length
    }

    changelist.prototype["tooClose"] = function (a, b)
    {
        if (!!_k_.empty(a) || !!_k_.empty(b))
        {
            return false
        }
        return a[1] === b[1] && Math.abs(a[0] - b[0]) < this.distance
    }

    changelist.prototype["record"] = function (pos)
    {
        var previous

        if (!!_k_.empty(pos))
        {
            return false
        }
        previous = this.entries.slice(-1)[0]
        if (this.tooClose(previous,pos))
        {
            previous[0] = pos[0]
            previous[1] = pos[1]
        }
        else
        {
            this.entries.push([pos[0],pos[1]])
            if (this.entries.length > this.max)
            {
                this.entries.splice(0,this.entries.length - this.max)
            }
        }
        this.index = this.entries.length
        return true
    }

    changelist.prototype["older"] = function ()
    {
        if (this.index <= 0)
        {
            return null
        }
        this.index -= 1
        return this.entries[this.index]
    }

    changelist.prototype["newer"] = function ()
    {
        if (this.index >= this.entries.length - 1)
        {
            return null
        }
        this.index += 1
        return this.entries[this.index]
    }

    changelist.prototype["reset"] = function ()
    {
        this.entries = []
        this.index = 0
        return true
    }

    return changelist
})()

export default changelist;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlbGlzdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2NoYW5nZWxpc3Qua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQyxjQUFEOzthQVFJOztRQUVJLEtBQUMsTUFBVztRQUNaLEtBQUMsV0FBVztRQUNaLEtBQUM7UUFDRCxLQUFDLFFBQVcsS0FBQyxRQUFROzs7MEJBRXpCLHVCQUFVLEdBQUU7O3dCQUVhLGtCQUFlOzttQkFBbEM7O2VBRUYsRUFBRSxPQUFNLEVBQUUsZUFBVyxFQUFFLEtBQUcsRUFBRSxNQUFNLEtBQUM7OzswQkFFdkMscUJBQVE7Ozs7d0JBRWlCOzttQkFBbkI7O1FBRUYsV0FBVyxLQUFDO1lBRVQsS0FBQyxTQUFTLFNBQVM7O1lBQ2xCLFNBQVMsS0FBSyxJQUFJO1lBQ2xCLFNBQVMsS0FBSyxJQUFJOzs7O1lBRWxCLEtBQUMsUUFBUSxNQUFNLElBQUksR0FBRyxJQUFJO2dCQUNnQixLQUFDLFFBQVEsU0FBUyxLQUFDOztnQkFBN0QsS0FBQyxRQUFRLE9BQU8sRUFBRSxLQUFDLFFBQVEsU0FBTyxLQUFDOzs7UUFFdkMsS0FBQyxRQUFRLEtBQUMsUUFBUTtlQUVsQjs7OzBCQUVKOztZQUVjLEtBQUMsU0FBUzs7bUJBQWxCOztRQUVGLEtBQUMsU0FBUztlQUVWLEtBQUMsUUFBUSxLQUFDOzs7MEJBRWQ7O1lBRWMsS0FBQyxTQUFTLEtBQUMsUUFBUSxTQUFPOzttQkFBbEM7O1FBRUYsS0FBQyxTQUFTO2VBRVYsS0FBQyxRQUFRLEtBQUM7OzswQkFFZDs7UUFFSSxLQUFDO1FBQ0QsS0FBQyxRQUFVO2VBRVg7OztXQTNEUDs7O2VBNkRNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/changelist.kode
