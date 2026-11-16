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
        var areas, span, _36_31_, _39_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_36_31_=colors.fg) != null ? _36_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[sue.FG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        var list1 = _k_.list((((_39_31_=colors.bg) != null ? _39_31_ : [])))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            areas.push({x:span[0],y:span[1],value:[sue.BG_COLOR,[span[3],span[2] - span[0],1]]})
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
        var area, areas, attr, bg, box, code, fg, lines, r, row, scale, ul, values, view, x, x1, x2, y, _48_29_

        areas = ((_48_29_=this.state.s.sue) != null ? _48_29_ : [])
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
            values = box.values
            fg = null
            bg = null
            attr = null
            ul = null
            if (code === sue.FG_COLOR)
            {
                fg = values[0]
            }
            else if (code === sue.BG_COLOR)
            {
                bg = values[0]
            }
            else if (code === sue.FG_BG_COLOR)
            {
                fg = values[0]
                bg = values[1]
            }
            else if (code === sue.STYLE)
            {
                if (values.length > 1)
                {
                    ul = values[0]
                    attr = values[1]
                }
                else
                {
                    attr = values[0]
                }
            }
            else
            {
                continue
            }
            x1 = _k_.max(0,(box.x * scale - view[0]))
            x2 = _k_.min(this.cells.cols,((box.x + box.w) * scale - view[0]))
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
            for (var _b_ = r = row, _c_ = _k_.min(this.cells.rows,row + box.h * scale); (_b_ <= _c_ ? r < _k_.min(this.cells.rows,row + box.h * scale) : r > _k_.min(this.cells.rows,row + box.h * scale)); (_b_ <= _c_ ? ++r : --r))
            {
                if ((bg != null))
                {
                    this.cells.bg_rect(x1,r,(x2 - 1),r,bg)
                }
                if ((fg != null))
                {
                    for (var _d_ = x = x1, _e_ = x2; (_d_ <= _e_ ? x < x2 : x > x2); (_d_ <= _e_ ? ++x : --x))
                    {
                        this.cells.set_fg(x,r,fg)
                    }
                }
                if ((attr != null) || (ul != null))
                {
                    for (var _f_ = x = x1, _10_ = x2; (_f_ <= _10_ ? x < x2 : x > x2); (_f_ <= _10_ ? ++x : --x))
                    {
                        this.cells.set_attr(x,r,attr,ul)
                    }
                }
            }
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFlLFlBQVI7O09BQ08sVUFBUjs7O0FBRUwsU0FBRDs7SUFrQkksT0FBQyxhQUFhLElBQUk7SUFDbEIsT0FBQyxhQUFhLElBQUk7SUFDbEIsT0FBQyxnQkFBYSxJQUFJO0lBQ2xCLE9BQUMsVUFBYSxJQUFJO0lBQ2xCLE9BQUMsZUFBYSxJQUFJO0lBSWxCLE9BQUMseUJBQVk7Ozs7UUFFVDtjQUVlOzttQkFBYjs7dUNBRVcsT0FBTzs7O1lBQWhCO1lBQ0EsTUFBTSxNQUFNLEVBQUcsS0FBSyxHQUFHLEVBQUcsS0FBSyxHQUFHLE9BQVEsSUFBSSxVQUFVLEtBQUssR0FBRyxLQUFLLEtBQUcsS0FBSyxHQUFHOzt3Q0FFdkUsT0FBTzs7O1lBQWhCO1lBQ0EsTUFBTSxNQUFNLEVBQUcsS0FBSyxHQUFHLEVBQUcsS0FBSyxHQUFHLE9BQVEsSUFBSSxVQUFVLEtBQUssR0FBRyxLQUFLLEtBQUcsS0FBSyxHQUFHOztlQUVwRjs7O2FBRUosT0FBSSxPQUFPOztRQUFSO1FBQU87Ozs7O3FCQUVWOzs7O1FBRUksa0JBQVEsS0FBQyxNQUFNLEVBQUU7c0JBQ047Ozs7UUFFWCxPQUFRLEtBQUMsTUFBTSxFQUFFO1FBQ2pCLFFBQVEsS0FBQyxNQUFNLEVBQUU7NEJBRUw7OztZQUFSO1lBRUEsTUFBTSxJQUFJLG1CQUFtQixLQUFLO2tCQUNsQjs7Z0JBQWhCOztZQUVBLElBQUksSUFBSTtnQkFDSSxJQUFJLEtBQUssS0FBSyxNQUFNOztnQkFBaEM7O1lBRUEsTUFBTSxLQUFDLE1BQU0sVUFBVTtnQkFDWCxNQUFNOztnQkFBbEI7O1lBRUEsUUFBUSxLQUFDLE1BQU0sV0FBVztnQkFDZCxNQUFNLFFBQVEsS0FBQyxNQUFNOztnQkFBakM7O1lBRUEsT0FBUyxLQUFLLE1BQU07WUFDcEIsU0FBUyxJQUFJO1lBRWIsS0FBTztZQUNQLEtBQU87WUFDUCxPQUFPO1lBQ1AsS0FBTztnQkFFSixTQUFRLElBQUk7O2dCQUNYLEtBQUssT0FBTzs7cUJBQ1IsU0FBUSxJQUFJOztnQkFDaEIsS0FBSyxPQUFPOztxQkFDUixTQUFRLElBQUk7O2dCQUNoQixLQUFLLE9BQU87Z0JBQ1osS0FBSyxPQUFPOztxQkFDUixTQUFRLElBQUk7O29CQUNiLE9BQU8sU0FBUzs7b0JBQ2YsS0FBTyxPQUFPO29CQUNkLE9BQU8sT0FBTzs7OztvQkFFZCxPQUFPLE9BQU87Ozs7O2dCQUVsQjs7WUFFSixhQUFTLEdBQUcsSUFBSSxJQUFFLFFBQVEsS0FBSztZQUMvQixhQUFTLEtBQUMsTUFBTSxPQUFPLElBQUksSUFBSSxJQUFJLEtBQUcsUUFBUSxLQUFLO2dCQUN2QyxNQUFNOztnQkFBbEI7O2lCQUV3Qjs7Z0JBQXhCLEtBQUssTUFBTSxPQUFPOztpQkFDTTs7Z0JBQXhCLEtBQUssTUFBTSxPQUFPOztpQkFDTTs7Z0JBQXhCLEtBQUssTUFBTSxPQUFPOzsyQkFFZCxJQUFLLG1CQUFVLEtBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxJQUFFLGtDQUF4QixLQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksSUFBRSxxQkFBeEIsS0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLElBQUU7O3FCQUNKOztvQkFBbkMsS0FBQyxNQUFNLFFBQVEsR0FBRyxHQUFHLEtBQUcsR0FBRyxFQUFFOztxQkFDMUI7O21DQUNLLElBQUssVUFBSyxzQkFBQSxTQUFBOzt3QkFDVixLQUFDLE1BQU0sT0FBTyxFQUFFLEVBQUU7OztxQkFDdkIsa0JBQVM7O21DQUNKLElBQUssV0FBSyx1QkFBQSxTQUFBOzt3QkFDVixLQUFDLE1BQU0sU0FBUyxFQUFFLEVBQUUsS0FBSzs7Ozs7OztXQXZHaEQ7OztlQXlHTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/susan.kode
