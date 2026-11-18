var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var layout


layout = (function ()
{
    function layout ()
    {}

    layout["absolutize"] = function (cells, rectree)
    {
        var box

        box = {x:0,y:0,w:cells.cols,h:cells.rows}
        return this.inBox(box,rectree)
    }

    layout["inBox"] = function (box, node)
    {
        var child, h, inner, out, w, x, y, _30_17_, _30_29_, _33_17_, _33_29_, _49_24_

        if (!(node != null))
        {
            return node
        }
        if ((node.w != null) && (node.r != null))
        {
            throw new Error("layout: w and r are both given")
        }
        if ((node.h != null) && (node.b != null))
        {
            throw new Error("layout: h and b are both given")
        }
        x = _k_.clamp(0,box.w,(this.offset(box.w,node.x)))
        y = _k_.clamp(0,box.h,(this.offset(box.h,node.y)))
        w = _k_.clamp(0,(box.w - x),(this.extent(box.w,x,node.w,node.r)))
        h = _k_.clamp(0,(box.h - y),(this.extent(box.h,y,node.h,node.b)))
        out = this.withoutGeometry(node)
        out.x = box.x + x
        out.y = box.y + y
        out.w = w
        out.h = h
        if ((node.children != null))
        {
            inner = {x:out.x,y:out.y,w:w,h:h}
            out.children = []
            var list = _k_.list(node.children)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                child = list[_a_]
                out.children.push(this.inBox(inner,child))
            }
        }
        return out
    }

    layout["offset"] = function (extent, value)
    {
        if (!!_k_.empty(value))
        {
            return 0
        }
        if (_k_.isStr(value))
        {
            if (value.endsWith('%'))
            {
                return parseInt(extent * parseInt(value.slice(0, -1)) / 100)
            }
            return parseInt(value)
        }
        return value
    }

    layout["extent"] = function (total, start, w, r)
    {
        if (!_k_.empty(w))
        {
            return this.offset(total,w)
        }
        if (!_k_.empty(r))
        {
            return total - start - (this.offset(total,r))
        }
        return total - start
    }

    layout["withoutGeometry"] = function (node)
    {
        var key, out, value

        out = {}
        for (key in node)
        {
            value = node[key]
            if (_k_.in(key,['x','y','w','h','r','b','children']))
            {
                continue
            }
            out[key] = value
        }
        return out
    }

    return layout
})()

export default layout;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFDLFVBQUQ7Ozs7O0lBaUJJLFFBQUMseUJBQVksT0FBTTs7OztRQUVmLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sS0FBSyxFQUFFLE1BQU07ZUFFcEMsS0FBQyxNQUFNLElBQUk7OztJQUlmLFFBQUMsb0JBQU8sS0FBSTs7OztjQUVNOzttQkFBWjs7YUFFQyxLQUFLLGVBQU8sS0FBSzs7WUFDaEIsVUFBVSxNQUFNOzthQUVqQixLQUFLLGVBQU8sS0FBSzs7WUFDaEIsVUFBVSxNQUFNOztRQUVwQixjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUN0QyxjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUV0QyxjQUFVLEdBQUcsSUFBSSxJQUFFLElBQUksS0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ25ELGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFFbkQsTUFBTSxLQUFDLGdCQUFnQjtRQUV2QixJQUFJLElBQUksSUFBSSxJQUFJO1FBQ2hCLElBQUksSUFBSSxJQUFJLElBQUk7UUFDaEIsSUFBSSxJQUFJO1FBQ1IsSUFBSSxJQUFJO2FBRUwsS0FBSzs7WUFDSixTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQy9CLElBQUk7Z0NBQ1MsS0FBSzs7O2dCQUFkO2dCQUNBLElBQUksU0FBUyxLQUFLLEtBQUMsTUFBTSxNQUFNOzs7ZUFFdkM7OztJQUlKLFFBQUMscUJBQVEsUUFBTzs7d0JBRUs7O21CQUFmOztZQUVVLFVBQVQ7O2dCQUNJLE1BQU0sU0FBUzs7Z0NBQ1Isa0JBQWEsWUFBTSxVQUFXOzs0QkFDbEM7O2VBRVY7OztJQUlKLFFBQUMscUJBQVEsT0FBTSxPQUFNLEdBQUU7O3VCQUVTOzttQkFBMUIsS0FBQyxPQUFPLE1BQU07O3VCQUU4Qjs7bUJBQTVDLFFBQVEsU0FBUyxLQUFDLE9BQU8sTUFBTTs7ZUFFakMsUUFBUTs7O0lBSVosUUFBQyw4QkFBaUI7Ozs7UUFFZDthQUVJLE9BQWE7O1lBQVQsUUFBUzt1QkFDRCxLQUFRLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJOztnQkFBNUM7O1lBQ0EsSUFBSSxPQUFPOztlQUVmOzs7V0F6RlA7OztlQTJGTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/layout.kode
