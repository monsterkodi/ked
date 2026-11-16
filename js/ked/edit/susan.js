var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var BG_COLOR, FG_BG_COLOR, FG_COLOR, susan

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import color from "../theme/color.js"

FG_COLOR = 31
BG_COLOR = 32
FG_BG_COLOR = 33

susan = (function ()
{
    susan["FG_COLOR"] = FG_COLOR
    susan["BG_COLOR"] = BG_COLOR
    susan["FG_BG_COLOR"] = FG_BG_COLOR
    susan["fromColors"] = function (colors)
    {
        var areas, span, _38_31_, _41_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_38_31_=colors.fg) != null ? _38_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[FG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        var list1 = _k_.list((((_41_31_=colors.bg) != null ? _41_31_ : [])))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            areas.push({x:span[0],y:span[1],value:[BG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        return areas
    }

    function susan (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
    }

    susan.prototype["draw"] = function ()
    {
        var area, areas, bg, code, data, fg, h, lines, r, row, scale, view, w, x, x1, x2, y, _50_29_

        areas = ((_50_29_=this.state.s.sue) != null ? _50_29_ : [])
        if (_k_.empty(areas))
        {
            return
        }
        view = this.state.s.view
        lines = this.state.s.lines
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            y = area.y
            if (y < 0 || y >= lines.length)
            {
                continue
            }
            row = this.state.rowOfLine(y)
            if (row < 0)
            {
                continue
            }
            scale = this.state.lineHeight(y)
            if (row + scale > this.cells.rows)
            {
                continue
            }
            var _b_ = area.value; code = _b_[0]; data = _b_[1]

            data = (data != null ? data : [])
            fg = null
            bg = null
            w = null
            h = null
            if (code === FG_COLOR)
            {
                fg = data[0]
                w = data[1]
                h = data[2]
            }
            else if (code === BG_COLOR)
            {
                bg = data[0]
                w = data[1]
                h = data[2]
            }
            else if (code === FG_BG_COLOR)
            {
                fg = data[0]
                bg = data[1]
                w = data[2]
                h = data[3]
            }
            else
            {
                continue
            }
            if (!!_k_.empty(w))
            {
                w = _k_.max(0,(kseg.width(lines[y]) - area.x))
            }
            h = (h != null ? h : 1)
            x1 = _k_.max(0,(area.x * scale - view[0]))
            x2 = _k_.min(this.cells.cols,((area.x + w) * scale - view[0]))
            if (x1 >= x2)
            {
                continue
            }
            if ((fg != null))
            {
                fg = color.values(fg)
            }
            if ((bg != null))
            {
                bg = color.values(bg)
            }
            for (var _c_ = r = row, _d_ = _k_.min(this.cells.rows,row + h * scale); (_c_ <= _d_ ? r < _k_.min(this.cells.rows,row + h * scale) : r > _k_.min(this.cells.rows,row + h * scale)); (_c_ <= _d_ ? ++r : --r))
            {
                if ((bg != null))
                {
                    this.cells.bg_rect(x1,r,(x2 - 1),r,bg)
                }
                if ((fg != null))
                {
                    for (var _e_ = x = x1, _f_ = x2; (_e_ <= _f_ ? x < x2 : x > x2); (_e_ <= _f_ ? ++x : --x))
                    {
                        this.cells.set_fg(x,r,fg)
                    }
                }
            }
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFVLFVBQUE7SUFBTTs7T0FDRyxZQUFaOztBQUVQLFdBQWM7QUFDZCxXQUFjO0FBQ2QsY0FBYzs7QUFFYixTQUFEOztJQWtCSSxPQUFDLGFBQWE7SUFDZCxPQUFDLGFBQWE7SUFDZCxPQUFDLGdCQUFhO0lBSWQsT0FBQyx5QkFBWTs7OztRQUVUO2NBRWU7O21CQUFiOzt1Q0FFVyxPQUFPOzs7WUFBaEI7WUFDQSxNQUFNLE1BQU0sRUFBRyxLQUFLLEdBQUcsRUFBRyxLQUFLLEdBQUcsT0FBUSxVQUFVLEtBQUssR0FBRyxLQUFLLEtBQUcsS0FBSyxHQUFHOzt3Q0FFbkUsT0FBTzs7O1lBQWhCO1lBQ0EsTUFBTSxNQUFNLEVBQUcsS0FBSyxHQUFHLEVBQUcsS0FBSyxHQUFHLE9BQVEsVUFBVSxLQUFLLEdBQUcsS0FBSyxLQUFHLEtBQUssR0FBRzs7ZUFFaEY7OzthQUVKLE9BQUksT0FBTzs7UUFBUjtRQUFPOzs7OztxQkFFVjs7OztRQUVJLGtCQUFRLEtBQUMsTUFBTSxFQUFFO3NCQUNOOzs7O1FBRVgsT0FBUSxLQUFDLE1BQU0sRUFBRTtRQUNqQixRQUFRLEtBQUMsTUFBTSxFQUFFOzRCQUVMOzs7WUFBUjtZQUVBLElBQUksS0FBSztnQkFDRyxJQUFJLEtBQUssS0FBSyxNQUFNOztnQkFBaEM7O1lBRUEsTUFBTSxLQUFDLE1BQU0sVUFBVTtnQkFDWCxNQUFNOztnQkFBbEI7O1lBRUEsUUFBUSxLQUFDLE1BQU0sV0FBVztnQkFDZCxNQUFNLFFBQVEsS0FBQyxNQUFNOztnQkFBakM7O3NCQUVjLEtBQUssT0FBbEIsZUFBSzs7WUFDTixRQUFBLGVBQUE7WUFFQSxLQUFLO1lBQ0wsS0FBSztZQUNMLElBQUs7WUFDTCxJQUFLO2dCQUVGLFNBQVE7O2dCQUNQLEtBQUssS0FBSztnQkFDVixJQUFLLEtBQUs7Z0JBQ1YsSUFBSyxLQUFLOztxQkFDTixTQUFROztnQkFDWixLQUFLLEtBQUs7Z0JBQ1YsSUFBSyxLQUFLO2dCQUNWLElBQUssS0FBSzs7cUJBQ04sU0FBUTs7Z0JBQ1osS0FBSyxLQUFLO2dCQUNWLEtBQUssS0FBSztnQkFDVixJQUFLLEtBQUs7Z0JBQ1YsSUFBSyxLQUFLOzs7O2dCQUVWOzs0QkFFUzs7Z0JBQ1QsWUFBUSxHQUFHLEtBQUssTUFBTSxNQUFNLE1BQU0sS0FBSzs7WUFFM0MsS0FBQSxZQUFBLElBQUs7WUFFTCxhQUFTLEdBQUcsS0FBSyxJQUFFLFFBQVEsS0FBSztZQUNoQyxhQUFTLEtBQUMsTUFBTSxPQUFPLEtBQUssSUFBSSxLQUFHLFFBQVEsS0FBSztnQkFDcEMsTUFBTTs7Z0JBQWxCOztpQkFFd0I7O2dCQUF4QixLQUFLLE1BQU0sT0FBTzs7aUJBQ007O2dCQUF4QixLQUFLLE1BQU0sT0FBTzs7MkJBRWQsSUFBSyxtQkFBVSxLQUFDLE1BQU0sS0FBSyxNQUFNLElBQUUsa0NBQXBCLEtBQUMsTUFBTSxLQUFLLE1BQU0sSUFBRSxxQkFBcEIsS0FBQyxNQUFNLEtBQUssTUFBTSxJQUFFOztxQkFDQTs7b0JBQW5DLEtBQUMsTUFBTSxRQUFRLEdBQUcsR0FBRyxLQUFHLEdBQUcsRUFBRTs7cUJBQzFCOzttQ0FDSyxJQUFLLFVBQUssc0JBQUEsU0FBQTs7d0JBQ1YsS0FBQyxNQUFNLE9BQU8sRUFBRSxFQUFFOzs7Ozs7O1dBbkd6Qzs7O2VBcUdNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/susan.kode
