var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
        var area, areas, attr, ax, ay, bg, block, box, cells, code, fg, have, hul, last, lines, r, row, runs, scale, ul, view, x, x1, x2, y, _42_29_

        areas = ((_42_29_=this.state.s.sue) != null ? _42_29_ : [])
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
                for (var _e_ = x = x1, _f_ = x2; (_e_ <= _f_ ? x < x2 : x > x2); (_e_ <= _f_ ? ++x : --x))
                {
                    ax = x
                    ay = r
                    block = this.cells.blockAt(x,r)
                    if ((block != null))
                    {
                        if (block[4] !== y)
                        {
                            continue
                        }
                        ax = block[0]
                        ay = block[1]
                    }
                    if ((bg != null))
                    {
                        this.cells.set_bg(ax,ay,bg)
                    }
                    if ((fg != null))
                    {
                        this.cells.set_fg(ax,ay,fg)
                    }
                    if ((attr != null) || (ul != null))
                    {
                        var _10_ = this.cells.get_attr(ax,ay); have = _10_[0]; hul = _10_[1]

                        this.cells.set_attr(ax,ay,(sue.addFlags(have,attr)),((ul != null ? ul : hul)))
                    }
                }
            }
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFlLFlBQVI7O09BQ08sVUFBUjs7O0FBRUwsU0FBRDs7SUFtQkksT0FBQyxhQUFhLElBQUk7SUFDbEIsT0FBQyxhQUFhLElBQUk7SUFDbEIsT0FBQyxnQkFBYSxJQUFJO0lBQ2xCLE9BQUMsVUFBYSxJQUFJO0lBQ2xCLE9BQUMsZUFBYSxJQUFJO3FCQUlsQiwwQkFBYTs7YUFFRyxLQUFDLE1BQU0sT0FBTyxFQUFFOzs7O1lBQ3BCLEtBQUMsTUFBTSxXQUFXLE9BQU07Ozs7ZUFFaEMsS0FBQyxNQUFNLGlCQUFpQjs7O2FBRTVCLE9BQUksT0FBTzs7UUFBUjtRQUFPOzs7Ozs7cUJBRVY7Ozs7UUFFSSxrQkFBUSxLQUFDLE1BQU0sRUFBRTtzQkFDTjs7OztRQUVYLE9BQVEsS0FBQyxNQUFNLEVBQUU7UUFDakIsUUFBUSxLQUFDLE1BQU0sRUFBRTs0QkFFTDs7O1lBQVI7WUFFQSxNQUFNLElBQUksbUJBQW1CLEtBQUs7a0JBQ2xCOztnQkFBaEI7O1lBRUEsSUFBSSxJQUFJO2dCQUNJLElBQUksS0FBSyxLQUFLLE1BQU07O2dCQUFoQzs7WUFFQSxNQUFNLEtBQUMsTUFBTSxVQUFVO2dCQUNYLE1BQU07O2dCQUFsQjs7WUFFQSxRQUFRLEtBQUMsTUFBTSxXQUFXO2dCQUNkLE1BQU0sUUFBUSxLQUFDLE1BQU07O2dCQUFqQzs7WUFFQSxPQUFPLEtBQUssTUFBTTtZQUVsQixLQUFPO1lBQ1AsS0FBTztZQUNQLE9BQU87WUFDUCxLQUFPO2dCQUVKLFNBQVEsSUFBSTs7Z0JBQ1gsS0FBSyxJQUFJLE9BQU87O3FCQUNaLFNBQVEsSUFBSTs7Z0JBQ2hCLEtBQUssSUFBSSxPQUFPOztxQkFDWixTQUFRLElBQUk7O2dCQUNoQixLQUFLLElBQUksT0FBTztnQkFDaEIsS0FBSyxJQUFJLE9BQU87O3FCQUNaLFNBQVEsSUFBSTs7MEJBQ0osSUFBSSxjQUFjLElBQUksU0FBakMsZUFBSzs7Ozs7Z0JBRU47O1lBRUosT0FBUSxLQUFDLFlBQVk7WUFDckIsUUFBUSxJQUFJLHFCQUFxQixNQUFNLEVBQUU7WUFDekMsT0FBUSxNQUFNLFNBQU87WUFFckIsYUFBUyxHQUFHLGNBQVUsSUFBSSxFQUFFLFNBQU8sUUFBUSxLQUFLO1lBQ2hELGFBQVMsS0FBQyxNQUFNLE1BQU0sY0FBVSxJQUFJLElBQUksSUFBSSxFQUFFLFNBQU8sUUFBUSxLQUFLO2dCQUN0RCxNQUFNOztnQkFBbEI7O2lCQUV3Qjs7Z0JBQXhCLEtBQUssTUFBTSxPQUFPOztpQkFDTTs7Z0JBQXhCLEtBQUssTUFBTSxPQUFPOztpQkFDTTs7Z0JBQXhCLEtBQUssTUFBTSxPQUFPOzsyQkFFZCxJQUFLLG1CQUFVLEtBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxJQUFFLGtDQUF4QixLQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksSUFBRSxxQkFBeEIsS0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLElBQUU7OytCQUNuQyxJQUFLLFVBQUssc0JBQUEsU0FBQTs7b0JBTVYsS0FBSztvQkFDTCxLQUFLO29CQUVMLFFBQVEsS0FBQyxNQUFNLFFBQVEsRUFBRTt5QkFFdEI7OzRCQUNhLE1BQU0sT0FBTTs7NEJBQXhCOzt3QkFDQSxLQUFLLE1BQU07d0JBQ1gsS0FBSyxNQUFNOzt5QkFFVzs7d0JBQTFCLEtBQUMsTUFBTSxPQUFPLEdBQUcsR0FBRzs7eUJBQ007O3dCQUExQixLQUFDLE1BQU0sT0FBTyxHQUFHLEdBQUc7O3lCQUNqQixrQkFBUzs7bUNBQ0ssS0FBQyxNQUFNLFNBQVMsR0FBRyxLQUEvQixnQkFBSzs7d0JBQ04sS0FBQyxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVEsYUFBQSxLQUFLOzs7Ozs7O1dBOUc3RTs7O2VBZ0hNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/susan.kode
