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
        var area, areas, attr, bg, box, code, cpos, fg, lastIndex, lines, r, row, runs, scale, style, ul, view, x, x1, x2, y, _21_29_

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
            scale = this.state.lineScale(y)
            if (!this.isBoxWrapped(box))
            {
                if (row < 0)
                {
                    continue
                }
                if (row + this.state.lineHeight(y) > this.editor.cells.rows)
                {
                    continue
                }
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
            style = {y:y,fg:fg,bg:bg,attr:attr,ul:ul,seen:{}}
            if (this.isBoxWrapped(box))
            {
                this.drawWrappedBox(box,style)
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
            for (r = row; r < _k_.min(this.editor.cells.rows,row + box.h * scale); r++)
            {
                for (x = x1; x < x2; x++)
                {
                    this.styleCell(x,r,style)
                }
            }
        }
    }

    susan.prototype["isBoxWrapped"] = function (box)
    {
        var li

        for (li = box.y; li < box.y + box.h; li++)
        {
            if (this.state.isWrapped(li))
            {
                return true
            }
        }
        return false
    }

    susan.prototype["drawWrappedBox"] = function (box, style)
    {
        var cells, cols, cr, cx, gx, li, lines, r, scale, x

        lines = this.state.s.lines
        cols = this.editor.cells.cols
        for (li = box.y; li < _k_.min(box.y + box.h,lines.length); li++)
        {
            if (!this.editor.lineFits(li))
            {
                continue
            }
            scale = this.state.lineScale(li)
            cells = this.editor.cellsForLine(li)
            style.y = li
            for (gx = box.x; gx < _k_.min(box.x + box.w,lines[li].length); gx++)
            {
                ;[cx,cr] = this.editor.posCell(gx,li,cells)
                if (!this.editor.rowFits(cr,scale))
                {
                    continue
                }
                for (r = cr; r < cr + scale; r++)
                {
                    for (x = _k_.max(0,cx); x < _k_.min(cols,cx + scale); x++)
                    {
                        this.styleCell(x,r,style)
                    }
                }
            }
        }
    }

    susan.prototype["styleCell"] = function (x, r, style)
    {
        var attr, bg, block, fg, have, hul, key, seen, ul, y

        ;({y, fg, bg, attr, ul, seen} = style)
        block = this.editor.cells.blockAt(x,r)
        if ((block != null))
        {
            if (block[4] !== y)
            {
                return
            }
            key = `${block[0]},${block[1]}`
            if (seen[key])
            {
                return
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
            return
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
            return this.editor.cells.set_attr(x,r,(sue.addFlags(have,attr)),((ul != null ? ul : hul)))
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFlLFlBQVI7O09BQ08sVUFBUjs7O0FBRUwsU0FBRDs7SUFPSSxPQUFDLGFBQWEsSUFBSTtJQUNsQixPQUFDLGFBQWEsSUFBSTtJQUNsQixPQUFDLGdCQUFhLElBQUk7SUFDbEIsT0FBQyxVQUFhLElBQUk7SUFDbEIsT0FBQyxlQUFhLElBQUk7YUFFbEIsT0FBSTs7UUFBRDs7O1FBQVcsS0FBQyxRQUFRLEtBQUMsT0FBTzs7O3FCQUUvQjs7OztRQUVJLGtCQUFRLEtBQUMsTUFBTSxFQUFFO3NCQUNOOzs7O1FBRVgsT0FBUSxLQUFDLE1BQU0sRUFBRTtRQUNqQixRQUFRLEtBQUMsTUFBTSxFQUFFOzRCQUVMOzs7WUFBUjtZQUVBLE1BQU0sSUFBSSxtQkFBbUIsS0FBSztrQkFDbEI7O2dCQUFoQjs7WUFFQSxJQUFJLElBQUk7Z0JBQ0ksSUFBSSxLQUFLLEtBQUssTUFBTTs7Z0JBQWhDOztZQUVBLE1BQVEsS0FBQyxNQUFNLFVBQVU7WUFDekIsUUFBUSxLQUFDLE1BQU0sVUFBVTtpQkFFbEIsS0FBQyxhQUFhOztvQkFDTCxNQUFNOztvQkFBbEI7O29CQUNZLE1BQU0sS0FBQyxNQUFNLFdBQVcsS0FBSyxLQUFDLE9BQU8sTUFBTTs7b0JBQXZEOzs7WUFFSixPQUFPLEtBQUssTUFBTTtZQUVsQixLQUFPO1lBQ1AsS0FBTztZQUNQLE9BQU87WUFDUCxLQUFPO2dCQUVKLFNBQVEsSUFBSTs7Z0JBQ1gsS0FBSyxJQUFJLE9BQU87O3FCQUNaLFNBQVEsSUFBSTs7Z0JBQ2hCLEtBQUssSUFBSSxPQUFPOztxQkFDWixTQUFRLElBQUk7O2dCQUNoQixLQUFLLElBQUksT0FBTztnQkFDaEIsS0FBSyxJQUFJLE9BQU87O3FCQUNaLFNBQVEsSUFBSTs7a0JBQ2YsS0FBSyxNQUFNLElBQUksY0FBYyxJQUFJOzs7O2dCQUVsQzs7aUJBRW9COztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O2lCQUNNOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O2lCQUNNOztnQkFBeEIsS0FBSyxNQUFNLE9BQU87O1lBRWxCLFNBQVMsRUFBRSxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSyxLQUFLLEdBQUcsR0FBRztnQkFFdEMsS0FBQyxhQUFhOztnQkFDYixLQUFDLGVBQWUsSUFBSTtnQkFDcEI7O1lBRUosT0FBTyxLQUFDLE9BQU8sWUFBWTtZQUMzQixPQUFPLElBQUkscUJBQXFCLE1BQU0sRUFBRTtZQUN4QyxZQUFZLEtBQUssU0FBTztZQUV4QixhQUFTLEdBQUcsYUFBUyxJQUFJLEVBQUUsY0FBWSxRQUFRLEtBQUs7WUFDcEQsYUFBUyxLQUFDLE9BQU8sTUFBTSxNQUFNLGFBQVMsSUFBSSxJQUFJLElBQUksRUFBRSxjQUFZLFFBQVEsS0FBSztnQkFDakUsTUFBTTs7Z0JBQWxCOztpQkFFSSxJQUFLLGlCQUFVLEtBQUMsT0FBTyxNQUFNLEtBQUssTUFBTSxJQUFJLElBQUU7O3FCQUMxQyxJQUFLLFFBQUs7O29CQUNWLEtBQUMsVUFBVSxFQUFFLEVBQUU7Ozs7OztxQkFFL0IsMkJBQWM7Ozs7YUFFTixLQUFNLElBQUksUUFBSSxJQUFJLElBQUUsSUFBSTs7Z0JBQ2QsS0FBQyxNQUFNLFVBQVU7O3VCQUF6Qjs7O2VBQ047OztxQkFJSiw2QkFBaUIsS0FBSTs7OztRQUVqQixRQUFRLEtBQUMsTUFBTSxFQUFFO1FBQ2pCLE9BQVEsS0FBQyxPQUFPLE1BQU07YUFFbEIsS0FBTSxJQUFJLGdCQUFRLElBQUksSUFBRSxJQUFJLEVBQUUsTUFBTTs7aUJBRXBCLEtBQUMsT0FBTyxTQUFTOztnQkFBakM7O1lBRUEsUUFBUSxLQUFDLE1BQU0sVUFBVTtZQUN6QixRQUFRLEtBQUMsT0FBTyxhQUFhO1lBQzdCLE1BQU0sSUFBSTtpQkFFTixLQUFNLElBQUksZ0JBQVEsSUFBSSxJQUFFLElBQUksRUFBRSxNQUFNLElBQUk7O2tCQUN2QyxHQUFHLE1BQU0sS0FBQyxPQUFPLFFBQVEsR0FBRyxHQUFHO3FCQUNoQixLQUFDLE9BQU8sUUFBUSxHQUFHOztvQkFBbkM7O3FCQUNJLElBQUssUUFBSyxLQUFHOzt5QkFDVCxZQUFTLEVBQUUsaUJBQVUsS0FBSyxLQUFHOzt3QkFDN0IsS0FBQyxVQUFVLEVBQUUsRUFBRTs7Ozs7OztxQkFFbkMsd0JBQVksR0FBRSxHQUFFOzs7O1dBRVgsR0FBRSxJQUFHLElBQUcsTUFBSyxJQUFHLFFBQVE7UUFFekIsUUFBUSxLQUFDLE9BQU8sTUFBTSxRQUFRLEVBQUU7YUFFN0I7O2dCQUNNLE1BQU0sT0FBTTs7OztZQUNqQixTQUFTLE1BQU0sTUFBTSxNQUFNO2dCQUN0QixLQUFLOzs7O1lBQ1YsS0FBSyxPQUFPO2lCQUN1Qjs7Z0JBQW5DLEtBQUMsT0FBTyxNQUFNLFNBQVMsTUFBTTs7aUJBQ2dCOztnQkFBN0MsS0FBQyxPQUFPLE1BQU0sT0FBTyxNQUFNLEdBQUcsTUFBTSxHQUFHOztpQkFDcEMsa0JBQVM7O2tCQUNQLEtBQUssT0FBTyxLQUFDLE9BQU8sTUFBTSxTQUFTLE1BQU0sR0FBRyxNQUFNO2dCQUNuRCxLQUFDLE9BQU8sTUFBTSxTQUFTLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBSSxTQUFTLEtBQUssU0FBUSxhQUFBLEtBQUs7Ozs7YUFHbEQ7O1lBQS9CLEtBQUMsT0FBTyxNQUFNLE9BQU8sRUFBRSxFQUFFOzthQUNNOztZQUEvQixLQUFDLE9BQU8sTUFBTSxPQUFPLEVBQUUsRUFBRTs7YUFDdEIsa0JBQVM7O2NBQ1AsS0FBSyxPQUFPLEtBQUMsT0FBTyxNQUFNLFNBQVMsRUFBRTttQkFDdEMsS0FBQyxPQUFPLE1BQU0sU0FBUyxFQUFFLEdBQUcsSUFBSSxTQUFTLEtBQUssU0FBUSxhQUFBLEtBQUs7Ozs7V0FqSXRFOzs7ZUFtSU0ifQ==
//# sourceURL=../../../kode/ked/edit/susan.kode
