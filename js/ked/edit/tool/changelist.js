var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

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
        return a[2] === b[2] && a[1] === b[1] && Math.abs(a[0] - b[0]) < this.distance
    }

    changelist.prototype["record"] = function (pos)
    {
        var entry, previous

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
            entry = [pos[0],pos[1]]
            if ((pos[2] != null))
            {
                entry.push(pos[2])
            }
            this.entries.push(entry)
            if (this.entries.length > this.max)
            {
                this.entries.splice(0,this.entries.length - this.max)
            }
        }
        this.index = this.entries.length
        return true
    }

    changelist.prototype["retain"] = function (fn)
    {
        var before

        before = this.entries.filter((function (e, i)
        {
            return i < this.index && !fn(e)
        }).bind(this)).length
        this.entries = this.entries.filter(fn)
        return this.index = _k_.max(0,this.index - before)
    }

    changelist.prototype["older"] = function ()
    {
        if (this.index <= 0)
        {
            return
        }
        this.index -= 1
        return this.entries[this.index]
    }

    changelist.prototype["newer"] = function ()
    {
        if (this.index >= this.entries.length - 1)
        {
            return
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlbGlzdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2NoYW5nZWxpc3Qua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQyxjQUFEOzthQVNJOztRQUVJLEtBQUMsTUFBVztRQUNaLEtBQUMsV0FBVztRQUNaLEtBQUM7UUFDRCxLQUFDLFFBQVcsS0FBQyxRQUFROzs7MEJBRXpCLHVCQUFVLEdBQUU7O3dCQUVhLGtCQUFlOzttQkFBbEM7O2VBRUYsRUFBRSxPQUFNLEVBQUUsTUFBTyxFQUFFLE9BQU0sRUFBRSxlQUFXLEVBQUUsS0FBRyxFQUFFLE1BQU0sS0FBQzs7OzBCQUV4RCxxQkFBUTs7Ozt3QkFFaUI7O21CQUFuQjs7UUFFRixXQUFXLEtBQUM7WUFFVCxLQUFDLFNBQVMsU0FBUzs7WUFDbEIsU0FBUyxLQUFLLElBQUk7WUFDbEIsU0FBUyxLQUFLLElBQUk7Ozs7WUFFbEIsU0FBUyxJQUFJLEdBQUcsSUFBSTtpQkFDQyxJQUFJOztnQkFBekIsTUFBTSxLQUFLLElBQUk7O1lBQ2YsS0FBQyxRQUFRLEtBQUs7Z0JBQzRCLEtBQUMsUUFBUSxTQUFTLEtBQUM7O2dCQUE3RCxLQUFDLFFBQVEsT0FBTyxFQUFFLEtBQUMsUUFBUSxTQUFPLEtBQUM7OztRQUV2QyxLQUFDLFFBQVEsS0FBQyxRQUFRO2VBRWxCOzs7MEJBSUoscUJBQVE7Ozs7UUFFSixTQUFTLEtBQUMsUUFBUSxrQkFBUSxHQUFFOzttQkFBTSxJQUFJLEtBQUMsVUFBYyxHQUFHO3VCQUFJO1FBQzVELEtBQUMsVUFBVSxLQUFDLFFBQVEsT0FBTztlQUMzQixLQUFDLGdCQUFZLEVBQUUsS0FBQyxRQUFNOzs7MEJBRTFCOztZQUVTLEtBQUMsU0FBUzs7OztRQUVmLEtBQUMsU0FBUztlQUVWLEtBQUMsUUFBUSxLQUFDOzs7MEJBRWQ7O1lBRVMsS0FBQyxTQUFTLEtBQUMsUUFBUSxTQUFPOzs7O1FBRS9CLEtBQUMsU0FBUztlQUVWLEtBQUMsUUFBUSxLQUFDOzs7MEJBRWQ7O1FBRUksS0FBQztRQUNELEtBQUMsUUFBVTtlQUVYOzs7V0F0RVA7OztlQXdFTSJ9
//# sourceURL=../../../../kode/ked/edit/tool/changelist.kode
