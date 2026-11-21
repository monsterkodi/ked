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
        var area, areas, attr, bg, block, box, cells, code, fg, have, hul, key, last, lines, r, row, runs, scale, seen, ul, view, x, x1, x2, y, _30_29_

        areas = ((_30_29_=this.state.s.sue) != null ? _30_29_ : [])
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
            seen = {}
            for (var _c_ = r = row, _d_ = _k_.min(this.cells.rows,row + box.h * scale); (_c_ <= _d_ ? r < _k_.min(this.cells.rows,row + box.h * scale) : r > _k_.min(this.cells.rows,row + box.h * scale)); (_c_ <= _d_ ? ++r : --r))
            {
                for (var _e_ = x = x1, _f_ = x2; (_e_ <= _f_ ? x < x2 : x > x2); (_e_ <= _f_ ? ++x : --x))
                {
                    block = this.cells.blockAt(x,r)
                    if ((block != null))
                    {
                        if (block[4] !== y)
                        {
                            continue
                        }
                        key = `${block[0]},${block[1]}`
                        if (seen[key])
                        {
                            continue
                        }
                        seen[key] = true
                        if ((bg != null))
                        {
                            this.cells.bg_block(block,bg)
                        }
                        if ((fg != null))
                        {
                            this.cells.set_fg(block[0],block[1],fg)
                        }
                        if ((attr != null) || (ul != null))
                        {
                            var _10_ = this.cells.get_attr(block[0],block[1]); have = _10_[0]; hul = _10_[1]

                            this.cells.set_attr(block[0],block[1],(sue.addFlags(have,attr)),((ul != null ? ul : hul)))
                        }
                        continue
                    }
                    if ((bg != null))
                    {
                        this.cells.set_bg(x,r,bg)
                    }
                    if ((fg != null))
                    {
                        this.cells.set_fg(x,r,fg)
                    }
                    if ((attr != null) || (ul != null))
                    {
                        var _11_ = this.cells.get_attr(x,r); have = _11_[0]; hul = _11_[1]

                        this.cells.set_attr(x,r,(sue.addFlags(have,attr)),((ul != null ? ul : hul)))
                    }
                }
            }
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFlLFlBQVI7O09BQ08sVUFBUjs7O0FBRUwsU0FBRDs7SUFPSSxPQUFDLGFBQWEsSUFBSTtJQUNsQixPQUFDLGFBQWEsSUFBSTtJQUNsQixPQUFDLGdCQUFhLElBQUk7SUFDbEIsT0FBQyxVQUFhLElBQUk7SUFDbEIsT0FBQyxlQUFhLElBQUk7cUJBSWxCLDBCQUFhOzthQUVHLEtBQUMsTUFBTSxPQUFPLEVBQUU7Ozs7WUFDcEIsS0FBQyxNQUFNLFdBQVcsT0FBTTs7OztlQUVoQyxLQUFDLE1BQU0saUJBQWlCOzs7YUFFNUIsT0FBSSxPQUFPOztRQUFSO1FBQU87Ozs7OztxQkFFVjs7OztRQUVJLGtCQUFRLEtBQUMsTUFBTSxFQUFFO3NCQUNOOzs7O1FBRVgsT0FBUSxLQUFDLE1BQU0sRUFBRTtRQUNqQixRQUFRLEtBQUMsTUFBTSxFQUFFOzRCQUVMOzs7WUFBUjtZQUVBLE1BQU0sSUFBSSxtQkFBbUIsS0FBSztrQkFDbEI7O2dCQUFoQjs7WUFFQSxJQUFJLElBQUk7Z0JBQ0ksSUFBSSxLQUFLLEtBQUssTUFBTTs7Z0JBQWhDOztZQUVBLE1BQU0sS0FBQyxNQUFNLFVBQVU7Z0JBQ1gsTUFBTTs7Z0JBQWxCOztZQUVBLFFBQVEsS0FBQyxNQUFNLFdBQVc7Z0JBQ2QsTUFBTSxRQUFRLEtBQUMsTUFBTTs7Z0JBQWpDOztZQUVBLE9BQU8sS0FBSyxNQUFNO1lBRWxCLEtBQU87WUFDUCxLQUFPO1lBQ1AsT0FBTztZQUNQLEtBQU87Z0JBRUosU0FBUSxJQUFJOztnQkFDWCxLQUFLLElBQUksT0FBTzs7cUJBQ1osU0FBUSxJQUFJOztnQkFDaEIsS0FBSyxJQUFJLE9BQU87O3FCQUNaLFNBQVEsSUFBSTs7Z0JBQ2hCLEtBQUssSUFBSSxPQUFPO2dCQUNoQixLQUFLLElBQUksT0FBTzs7cUJBQ1osU0FBUSxJQUFJOzswQkFDSixJQUFJLGNBQWMsSUFBSSxTQUFqQyxlQUFLOzs7OztnQkFFTjs7WUFFSixPQUFRLEtBQUMsWUFBWTtZQUNyQixRQUFRLElBQUkscUJBQXFCLE1BQU0sRUFBRTtZQUN6QyxPQUFRLE1BQU0sU0FBTztZQUVyQixhQUFTLEdBQUcsY0FBVSxJQUFJLEVBQUUsU0FBTyxRQUFRLEtBQUs7WUFDaEQsYUFBUyxLQUFDLE1BQU0sTUFBTSxjQUFVLElBQUksSUFBSSxJQUFJLEVBQUUsU0FBTyxRQUFRLEtBQUs7Z0JBQ3RELE1BQU07O2dCQUFsQjs7aUJBRXdCOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O2lCQUNNOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O2lCQUNNOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O1lBRWxCOzJCQUVJLElBQUssbUJBQVUsS0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLElBQUUsa0NBQXhCLEtBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxJQUFFLHFCQUF4QixLQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksSUFBRTs7K0JBRW5DLElBQUssVUFBSyxzQkFBQSxTQUFBOztvQkFFVixRQUFRLEtBQUMsTUFBTSxRQUFRLEVBQUU7eUJBRXRCOzs0QkFDYSxNQUFNLE9BQU07OzRCQUF4Qjs7d0JBQ0EsU0FBUyxNQUFNLE1BQU0sTUFBTTs0QkFDZixLQUFLOzs0QkFBakI7O3dCQUNBLEtBQUssT0FBTzs2QkFDZ0I7OzRCQUE1QixLQUFDLE1BQU0sU0FBUyxNQUFNOzs2QkFDZ0I7OzRCQUF0QyxLQUFDLE1BQU0sT0FBTyxNQUFNLEdBQUcsTUFBTSxHQUFHOzs2QkFDN0Isa0JBQVM7O3VDQUNLLEtBQUMsTUFBTSxTQUFTLE1BQU0sR0FBRyxNQUFNLEtBQTNDLGdCQUFLOzs0QkFDTixLQUFDLE1BQU0sU0FBUyxNQUFNLEdBQUcsTUFBTSxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVEsYUFBQSxLQUFLOzt3QkFDdEU7O3lCQUVvQjs7d0JBQXhCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRTs7eUJBQ007O3dCQUF4QixLQUFDLE1BQU0sT0FBTyxFQUFFLEVBQUU7O3lCQUNmLGtCQUFTOzttQ0FDSyxLQUFDLE1BQU0sU0FBUyxFQUFFLElBQTlCLGdCQUFLOzt3QkFDTixLQUFDLE1BQU0sU0FBUyxFQUFFLEdBQUcsSUFBSSxTQUFTLEtBQUssU0FBUSxhQUFBLEtBQUs7Ozs7Ozs7V0FyRzNFOzs7ZUF1R00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/susan.kode
