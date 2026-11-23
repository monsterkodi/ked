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
    function susan (editor)
    {
        this.editor = editor
    
        this["draw"] = this["draw"].bind(this)
        this.state = this.editor.state
    }

    susan.prototype["draw"] = function ()
    {
        var area, areas, attr, bg, block, box, code, cpos, fg, have, hul, key, lastIndex, lines, r, row, runs, scale, seen, ul, view, x, x1, x2, y, _21_29_

        areas = ((_21_29_=this.state.s.sue) != null ? _21_29_ : [])
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
            if (row + scale > this.editor.cells.rows)
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
                ;[attr,ul] = sue.styleOfValues(box.values)
            }
            else
            {
                continue
            }
            runs = this.editor.runsForLine(y)
            cpos = sue.cellPositionsForLine(lines,y,runs)
            lastIndex = cpos.length - 1
            x1 = _k_.max(0,(cpos[_k_.min(box.x,lastIndex)] * scale - view[0]))
            x2 = _k_.min(this.editor.cells.cols,(cpos[_k_.min(box.x + box.w,lastIndex)] * scale - view[0]))
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
            for (r = row; r < _k_.min(this.editor.cells.rows,row + box.h * scale); r++)
            {
                for (x = x1; x < x2; x++)
                {
                    block = this.editor.cells.blockAt(x,r)
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
                            this.editor.cells.bg_block(block,bg)
                        }
                        if ((fg != null))
                        {
                            this.editor.cells.set_fg(block[0],block[1],fg)
                        }
                        if ((attr != null) || (ul != null))
                        {
                            ;[have,hul] = this.editor.cells.get_attr(block[0],block[1])
                            this.editor.cells.set_attr(block[0],block[1],(sue.addFlags(have,attr)),((ul != null ? ul : hul)))
                        }
                        continue
                    }
                    if ((bg != null))
                    {
                        this.editor.cells.set_bg(x,r,bg)
                    }
                    if ((fg != null))
                    {
                        this.editor.cells.set_fg(x,r,fg)
                    }
                    if ((attr != null) || (ul != null))
                    {
                        ;[have,hul] = this.editor.cells.get_attr(x,r)
                        this.editor.cells.set_attr(x,r,(sue.addFlags(have,attr)),((ul != null ? ul : hul)))
                    }
                }
            }
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFlLFlBQVI7O09BQ08sVUFBUjs7O0FBRUwsU0FBRDs7SUFPSSxPQUFDLGFBQWEsSUFBSTtJQUNsQixPQUFDLGFBQWEsSUFBSTtJQUNsQixPQUFDLGdCQUFhLElBQUk7SUFDbEIsT0FBQyxVQUFhLElBQUk7SUFDbEIsT0FBQyxlQUFhLElBQUk7YUFFbEIsT0FBSTs7UUFBRDs7O1FBQVcsS0FBQyxRQUFRLEtBQUMsT0FBTzs7O3FCQUUvQjs7OztRQUVJLGtCQUFRLEtBQUMsTUFBTSxFQUFFO3NCQUNOOzs7O1FBRVgsT0FBUSxLQUFDLE1BQU0sRUFBRTtRQUNqQixRQUFRLEtBQUMsTUFBTSxFQUFFOzRCQUVMOzs7WUFBUjtZQUVBLE1BQU0sSUFBSSxtQkFBbUIsS0FBSztrQkFDbEI7O2dCQUFoQjs7WUFFQSxJQUFJLElBQUk7Z0JBQ0ksSUFBSSxLQUFLLEtBQUssTUFBTTs7Z0JBQWhDOztZQUVBLE1BQU0sS0FBQyxNQUFNLFVBQVU7Z0JBQ1gsTUFBTTs7Z0JBQWxCOztZQUVBLFFBQVEsS0FBQyxNQUFNLFdBQVc7Z0JBQ2QsTUFBTSxRQUFRLEtBQUMsT0FBTyxNQUFNOztnQkFBeEM7O1lBRUEsT0FBTyxLQUFLLE1BQU07WUFFbEIsS0FBTztZQUNQLEtBQU87WUFDUCxPQUFPO1lBQ1AsS0FBTztnQkFFSixTQUFRLElBQUk7O2dCQUNYLEtBQUssSUFBSSxPQUFPOztxQkFDWixTQUFRLElBQUk7O2dCQUNoQixLQUFLLElBQUksT0FBTzs7cUJBQ1osU0FBUSxJQUFJOztnQkFDaEIsS0FBSyxJQUFJLE9BQU87Z0JBQ2hCLEtBQUssSUFBSSxPQUFPOztxQkFDWixTQUFRLElBQUk7O2tCQUNmLEtBQUssTUFBTSxJQUFJLGNBQWMsSUFBSTs7OztnQkFFbEM7O1lBRUosT0FBTyxLQUFDLE9BQU8sWUFBWTtZQUMzQixPQUFPLElBQUkscUJBQXFCLE1BQU0sRUFBRTtZQUN4QyxZQUFZLEtBQUssU0FBTztZQUV4QixhQUFTLEdBQUcsYUFBUyxJQUFJLEVBQUUsY0FBWSxRQUFRLEtBQUs7WUFDcEQsYUFBUyxLQUFDLE9BQU8sTUFBTSxNQUFNLGFBQVMsSUFBSSxJQUFJLElBQUksRUFBRSxjQUFZLFFBQVEsS0FBSztnQkFDakUsTUFBTTs7Z0JBQWxCOztpQkFFd0I7O2dCQUF4QixLQUFLLE1BQU0sT0FBTzs7aUJBQ007O2dCQUF4QixLQUFLLE1BQU0sT0FBTzs7aUJBQ007O2dCQUF4QixLQUFLLE1BQU0sT0FBTzs7WUFFbEI7aUJBRUksSUFBSyxpQkFBVSxLQUFDLE9BQU8sTUFBTSxLQUFLLE1BQU0sSUFBSSxJQUFFOztxQkFFMUMsSUFBSyxRQUFLOztvQkFFVixRQUFRLEtBQUMsT0FBTyxNQUFNLFFBQVEsRUFBRTt5QkFFN0I7OzRCQUNhLE1BQU0sT0FBTTs7NEJBQXhCOzt3QkFDQSxTQUFTLE1BQU0sTUFBTSxNQUFNOzRCQUNmLEtBQUs7OzRCQUFqQjs7d0JBQ0EsS0FBSyxPQUFPOzZCQUN1Qjs7NEJBQW5DLEtBQUMsT0FBTyxNQUFNLFNBQVMsTUFBTTs7NkJBQ2dCOzs0QkFBN0MsS0FBQyxPQUFPLE1BQU0sT0FBTyxNQUFNLEdBQUcsTUFBTSxHQUFHOzs2QkFDcEMsa0JBQVM7OzhCQUNQLEtBQUssT0FBTyxLQUFDLE9BQU8sTUFBTSxTQUFTLE1BQU0sR0FBRyxNQUFNOzRCQUNuRCxLQUFDLE9BQU8sTUFBTSxTQUFTLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBSSxTQUFTLEtBQUssU0FBUSxhQUFBLEtBQUs7O3dCQUM3RTs7eUJBRTJCOzt3QkFBL0IsS0FBQyxPQUFPLE1BQU0sT0FBTyxFQUFFLEVBQUU7O3lCQUNNOzt3QkFBL0IsS0FBQyxPQUFPLE1BQU0sT0FBTyxFQUFFLEVBQUU7O3lCQUN0QixrQkFBUzs7MEJBQ1AsS0FBSyxPQUFPLEtBQUMsT0FBTyxNQUFNLFNBQVMsRUFBRTt3QkFDdEMsS0FBQyxPQUFPLE1BQU0sU0FBUyxFQUFFLEdBQUcsSUFBSSxTQUFTLEtBQUssU0FBUSxhQUFBLEtBQUs7Ozs7Ozs7V0E1RmxGOzs7ZUE4Rk0ifQ==
//# sourceURL=../../../kode/ked/edit/susan.kode
