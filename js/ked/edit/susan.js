var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var susan

import color from "../theme/color.js"

import sue from "./tool/sue.js"


susan = (function ()
{
    susan["FG_COLOR"] = sue.FG_COLOR
    susan["BG_COLOR"] = sue.BG_COLOR
    susan["FG_BG_COLOR"] = sue.FG_BG_COLOR
    susan["STYLE"] = sue.STYLE
    susan["LINE_SCALE"] = sue.LINE_SCALE
    susan["fromColors"] = function (colors)
    {
        var areas, span, _39_31_, _42_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_39_31_=colors.fg) != null ? _39_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[sue.FG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        var list1 = _k_.list((((_42_31_=colors.bg) != null ? _42_31_ : [])))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            areas.push({x:span[0],y:span[1],value:[sue.BG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        return areas
    }

    susan.prototype["runsForLine"] = function (y)
    {
        if (!this.cells.screen.t.textSizing)
        {
            return []
        }
        if (this.state.lineHeight(y) !== 1)
        {
            return []
        }
        return this.state.scaleRunsForLine(y)
    }

    function susan (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["runsForLine"] = this["runsForLine"].bind(this)
    }

    susan.prototype["draw"] = function ()
    {
        var area, areas, attr, bg, box, cells, code, fg, have, hul, last, lines, r, row, runs, scale, ul, view, x, x1, x2, y, _60_29_

        areas = ((_60_29_=this.state.s.sue) != null ? _60_29_ : [])
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
            box = sue.boxForAreaAndLines(area,lines)
            if (!(box != null))
            {
                continue
            }
            y = box.y
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
            code = area.value[0]
            fg = null
            bg = null
            attr = null
            ul = null
            if (code === sue.FG_COLOR)
            {
                fg = box.values[0]
            }
            else if (code === sue.BG_COLOR)
            {
                bg = box.values[0]
            }
            else if (code === sue.FG_BG_COLOR)
            {
                fg = box.values[0]
                bg = box.values[1]
            }
            else if (code === sue.STYLE)
            {
                var _b_ = sue.styleOfValues(box.values); attr = _b_[0]; ul = _b_[1]

            }
            else
            {
                continue
            }
            runs = this.runsForLine(y)
            cells = sue.cellPositionsForLine(lines,y,runs)
            last = cells.length - 1
            x1 = _k_.max(0,(cells[_k_.min(box.x,last)] * scale - view[0]))
            x2 = _k_.min(this.cells.cols,(cells[_k_.min(box.x + box.w,last)] * scale - view[0]))
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
            if ((ul != null))
            {
                ul = color.values(ul)
            }
            for (var _c_ = r = row, _d_ = _k_.min(this.cells.rows,row + box.h * scale); (_c_ <= _d_ ? r < _k_.min(this.cells.rows,row + box.h * scale) : r > _k_.min(this.cells.rows,row + box.h * scale)); (_c_ <= _d_ ? ++r : --r))
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
                if ((attr != null) || (ul != null))
                {
                    for (var _10_ = x = x1, _11_ = x2; (_10_ <= _11_ ? x < x2 : x > x2); (_10_ <= _11_ ? ++x : --x))
                    {
                        var _12_ = this.cells.get_attr(x,r); have = _12_[0]; hul = _12_[1]

                        this.cells.set_attr(x,r,(sue.addFlags(have,attr)),((ul != null ? ul : hul)))
                    }
                }
            }
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFlLFlBQVI7O09BQ08sVUFBUjs7O0FBRUwsU0FBRDs7SUFxQkksT0FBQyxhQUFhLElBQUk7SUFDbEIsT0FBQyxhQUFhLElBQUk7SUFDbEIsT0FBQyxnQkFBYSxJQUFJO0lBQ2xCLE9BQUMsVUFBYSxJQUFJO0lBQ2xCLE9BQUMsZUFBYSxJQUFJO0lBSWxCLE9BQUMseUJBQVk7Ozs7UUFFVDtjQUVlOzttQkFBYjs7dUNBRVcsT0FBTzs7O1lBQWhCO1lBQ0EsTUFBTSxNQUFNLEVBQUcsS0FBSyxHQUFHLEVBQUcsS0FBSyxHQUFHLE9BQVEsSUFBSSxVQUFVLEtBQUssR0FBRyxLQUFLLEtBQUcsS0FBSyxHQUFHOzt3Q0FFdkUsT0FBTzs7O1lBQWhCO1lBQ0EsTUFBTSxNQUFNLEVBQUcsS0FBSyxHQUFHLEVBQUcsS0FBSyxHQUFHLE9BQVEsSUFBSSxVQUFVLEtBQUssR0FBRyxLQUFLLEtBQUcsS0FBSyxHQUFHOztlQUVwRjs7O3FCQUlKLDBCQUFhOzthQUVHLEtBQUMsTUFBTSxPQUFPLEVBQUU7Ozs7WUFDcEIsS0FBQyxNQUFNLFdBQVcsT0FBTTs7OztlQUVoQyxLQUFDLE1BQU0saUJBQWlCOzs7YUFFNUIsT0FBSSxPQUFPOztRQUFSO1FBQU87Ozs7OztxQkFFVjs7OztRQUVJLGtCQUFRLEtBQUMsTUFBTSxFQUFFO3NCQUNOOzs7O1FBRVgsT0FBUSxLQUFDLE1BQU0sRUFBRTtRQUNqQixRQUFRLEtBQUMsTUFBTSxFQUFFOzRCQUVMOzs7WUFBUjtZQUVBLE1BQU0sSUFBSSxtQkFBbUIsS0FBSztrQkFDbEI7O2dCQUFoQjs7WUFFQSxJQUFJLElBQUk7Z0JBQ0ksSUFBSSxLQUFLLEtBQUssTUFBTTs7Z0JBQWhDOztZQUVBLE1BQU0sS0FBQyxNQUFNLFVBQVU7Z0JBQ1gsTUFBTTs7Z0JBQWxCOztZQUVBLFFBQVEsS0FBQyxNQUFNLFdBQVc7Z0JBQ2QsTUFBTSxRQUFRLEtBQUMsTUFBTTs7Z0JBQWpDOztZQUVBLE9BQU8sS0FBSyxNQUFNO1lBRWxCLEtBQU87WUFDUCxLQUFPO1lBQ1AsT0FBTztZQUNQLEtBQU87Z0JBRUosU0FBUSxJQUFJOztnQkFDWCxLQUFLLElBQUksT0FBTzs7cUJBQ1osU0FBUSxJQUFJOztnQkFDaEIsS0FBSyxJQUFJLE9BQU87O3FCQUNaLFNBQVEsSUFBSTs7Z0JBQ2hCLEtBQUssSUFBSSxPQUFPO2dCQUNoQixLQUFLLElBQUksT0FBTzs7cUJBQ1osU0FBUSxJQUFJOzswQkFDSixJQUFJLGNBQWMsSUFBSSxTQUFqQyxlQUFLOzs7OztnQkFFTjs7WUFFSixPQUFRLEtBQUMsWUFBWTtZQUNyQixRQUFRLElBQUkscUJBQXFCLE1BQU0sRUFBRTtZQUN6QyxPQUFRLE1BQU0sU0FBTztZQUVyQixhQUFTLEdBQUcsY0FBVSxJQUFJLEVBQUUsU0FBTyxRQUFRLEtBQUs7WUFDaEQsYUFBUyxLQUFDLE1BQU0sTUFBTSxjQUFVLElBQUksSUFBSSxJQUFJLEVBQUUsU0FBTyxRQUFRLEtBQUs7Z0JBQ3RELE1BQU07O2dCQUFsQjs7aUJBRXdCOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O2lCQUNNOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O2lCQUNNOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87OzJCQUVkLElBQUssbUJBQVUsS0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLElBQUUsa0NBQXhCLEtBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxJQUFFLHFCQUF4QixLQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksSUFBRTs7cUJBQ0o7O29CQUFuQyxLQUFDLE1BQU0sUUFBUSxHQUFHLEdBQUcsS0FBRyxHQUFHLEVBQUU7O3FCQUMxQjs7bUNBQ0ssSUFBSyxVQUFLLHNCQUFBLFNBQUE7O3dCQUNWLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRTs7O3FCQUN2QixrQkFBUzs7b0NBQ0osSUFBSyxXQUFLLHdCQUFBLFNBQUE7O21DQUNHLEtBQUMsTUFBTSxTQUFTLEVBQUUsSUFBOUIsZ0JBQUs7O3dCQUNOLEtBQUMsTUFBTSxTQUFTLEVBQUUsR0FBRyxJQUFJLFNBQVMsS0FBSyxTQUFRLGFBQUEsS0FBSzs7Ozs7OztXQW5IM0U7OztlQXFITSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/susan.kode
