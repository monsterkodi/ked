var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var susan


susan = (function ()
{
    function susan (screen, state)
    {
        this.screen = screen
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["sync"] = this["sync"].bind(this)
        this.rects = []
    }

    susan.prototype["sync"] = function ()
    {
        var _20_30_

        return this.rects = ((_20_30_=this.state.s.sue) != null ? _20_30_ : [])
    }

    susan.prototype["draw"] = function ()
    {
        if (_k_.empty(this.rects))
        {
            return
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQyxTQUFEOzthQWFJLE9BQUksUUFBUTs7UUFBVDtRQUFROzs7O1FBRVAsS0FBQzs7O3FCQUVMOzs7O2VBRUksS0FBQyxrQkFBUSxLQUFDLE1BQU0sRUFBRTs7O3FCQUV0Qjs7c0JBRWUsS0FBQzs7Ozs7O1dBdkJuQjs7O2VBNEJNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/susan.kode
