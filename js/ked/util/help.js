var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var help

import color from "../theme/color.js"

import belt from "../edit/tool/belt.js"


help = (function ()
{
    function help ()
    {}

    help["header"] = function ()
    {
        return '\n' + color.linesForCells(this.headerCells()).join('\n') + '\n'
    }

    help["headerCells"] = function (f = 1)
    {
        var c, cells, color1, color2, color3, dcells, ecells, fc1, fc2, fc3, h, kcells

        h = `


╭───╮                ╭───╮                ╭───╮     
│○○○│                │○○○│                │○○○│     
│○○○│                ╰───╯                │○○○│     
│○○○│     ╭───╮    ╭───────╮       ╭──────╯○○○│     
│○○○│   ╭─╯○○○│  ╭─╯○○○○○○○╰─╮   ╭─╯○○○○○○○○○○│     
│○○○│ ╭─╯○○╭──╯ ╭╯○○╭─────╮○○╰╮ ╭╯○○╭─────╮○○○│     
│○○○╰─╯○○╭─╯    │○○○│     │○○○│ │○○○│     │○○○│     
│○○○○○○○○│      │○○○╰─────╯○○○│ │○○○│     │○○○│     
│○○○╭─╮○○╰─╮    │○○○╭─────────╯ │○○○│     │○○○│     
│○○○│ ╰─╮○○╰─╮  │○○○│     ╭───╮ │○○○│     │○○○│     
│○○○│   ╰─╮○○╰╮ ╰╮○○╰─────╯○○╭╯ ╰╮○○╰─────╯○○╭╯     
│○○○│     │○○○│  ╰─╮○○○○○○○╭─╯   ╰─╮○○○○○○○╭─╯      
╰───╯     ╰───╯    ╰───────╯       ╰───────╯        


`
        cells = belt.cellsForLines(belt.indentLines(belt.seglsForText(h),5))
        color1 = [0,255,0]
        color2 = [120,120,255]
        color3 = [255,160,0]
        fc1 = color1.map(function (v)
        {
            return parseInt(v * f)
        })
        fc2 = color2.map(function (v)
        {
            return parseInt(v * f)
        })
        fc3 = color3.map(function (v)
        {
            return parseInt(v * f)
        })
        kcells = belt.cellsInRect(cells,0,0,20,cells.length - 1)
        var list = _k_.list(kcells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            switch (c.cell.char)
            {
                case ' ':
                    c.cell.fg = [0,0,0]
                    break
                default:
                    c.cell.fg = fc1
            }

        }
        ecells = belt.cellsInRect(cells,20,0,35,cells.length - 1)
        var list1 = _k_.list(ecells)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            c = list1[_b_]
            switch (c.cell.char)
            {
                case ' ':
                    c.cell.fg = [0,0,0]
                    break
                default:
                    c.cell.fg = fc2
            }

        }
        dcells = belt.cellsInRect(cells,36,0,cells[0].length - 1,cells.length - 1)
        var list2 = _k_.list(dcells)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            c = list2[_c_]
            switch (c.cell.char)
            {
                case ' ':
                    c.cell.fg = [0,0,0]
                    break
                default:
                    c.cell.fg = fc3
            }

        }
        color.glowEffect(cells)
        color.dimCellsColor(belt.cellsWithChar(cells,'○'),'fg',0.26)
        color.variateCellsColor(belt.cellsWithChar(cells,'○'),'fg',0.15)
        fc1 = color1.map(function (v)
        {
            return parseInt(v * (0.5 + 0.5 * f))
        })
        fc2 = color2.map(function (v)
        {
            return parseInt(v * (0.5 + 0.5 * f))
        })
        fc3 = color3.map(function (v)
        {
            return parseInt(v * (0.5 + 0.5 * f))
        })
        var list3 = _k_.list(kcells)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            c = list3[_d_]
            switch (c.cell.char)
            {
                case ' ':
                case '○':
                    break
                default:
                    c.cell.fg = fc1
            }

        }
        var list4 = _k_.list(ecells)
        for (var _e_ = 0; _e_ < list4.length; _e_++)
        {
            c = list4[_e_]
            switch (c.cell.char)
            {
                case ' ':
                case '○':
                    break
                default:
                    c.cell.fg = fc2
            }

        }
        var list5 = _k_.list(dcells)
        for (var _f_ = 0; _f_ < list5.length; _f_++)
        {
            c = list5[_f_]
            switch (c.cell.char)
            {
                case ' ':
                case '○':
                    break
                default:
                    c.cell.fg = fc3
            }

        }
        return cells
    }

    return help
})()

export default help;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9oZWxwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRbUIsWUFBWjs7T0FDWSxXQUFQOzs7QUFFSCxRQUFUOzs7OztJQUVJLE1BQUM7O2VBQVcsT0FBTyxNQUFNLGNBQWMsS0FBQyxlQUFlLEtBQUssUUFBUTs7O0lBRXBFLE1BQUMsMEJBQWEsSUFBRTs7OztRQUVaLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFzQkosUUFBUSxLQUFLLGNBQWMsS0FBSyxZQUFZLEtBQUssYUFBYSxHQUFHO1FBRWpFLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFVBQVUsSUFBSSxJQUFJO1FBQ2xCLFVBQVUsSUFBSSxJQUFJO1FBRWxCLE1BQU0sT0FBTyxjQUFLOzs0QkFBVSxJQUFFOztRQUM5QixNQUFNLE9BQU8sY0FBSzs7NEJBQVUsSUFBRTs7UUFDOUIsTUFBTSxPQUFPLGNBQUs7OzRCQUFVLElBQUU7O1FBRTlCLFNBQVMsS0FBSyxZQUFZLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxTQUFPOzRCQUMzQzs7O1lBQUw7b0JBQ08sRUFBRSxLQUFLOztxQkFDVjtvQkFBTSxFQUFFLEtBQUssTUFBTSxFQUFFLEVBQUU7OztvQkFDakIsRUFBRSxLQUFLLEtBQUs7Ozs7UUFFMUIsU0FBUyxLQUFLLFlBQVksTUFBTSxHQUFHLEVBQUUsR0FBRyxNQUFNLFNBQU87NkJBQzVDOzs7WUFBTDtvQkFDTyxFQUFFLEtBQUs7O3FCQUNWO29CQUFNLEVBQUUsS0FBSyxNQUFNLEVBQUUsRUFBRTs7O29CQUNqQixFQUFFLEtBQUssS0FBSzs7OztRQUUxQixTQUFTLEtBQUssWUFBWSxNQUFNLEdBQUcsRUFBRSxNQUFNLEdBQUcsU0FBTyxFQUFFLE1BQU0sU0FBTzs2QkFDM0Q7OztZQUFMO29CQUNPLEVBQUUsS0FBSzs7cUJBQ1Y7b0JBQU0sRUFBRSxLQUFLLE1BQU0sRUFBRSxFQUFFOzs7b0JBQ2pCLEVBQUUsS0FBSyxLQUFLOzs7O1FBRTFCLE1BQU0sV0FBVztRQUNqQixNQUFNLGNBQWtCLEtBQUssY0FBYyxNQUFNLEtBQUssS0FBSztRQUMzRCxNQUFNLGtCQUFrQixLQUFLLGNBQWMsTUFBTSxLQUFLLEtBQUs7UUFFM0QsTUFBTSxPQUFPLGNBQUs7OzRCQUFVLEtBQUcsTUFBSSxNQUFJOztRQUN2QyxNQUFNLE9BQU8sY0FBSzs7NEJBQVUsS0FBRyxNQUFJLE1BQUk7O1FBQ3ZDLE1BQU0sT0FBTyxjQUFLOzs0QkFBVSxLQUFHLE1BQUksTUFBSTs7NkJBRTlCOzs7WUFBTDtvQkFDTyxFQUFFLEtBQUs7O3FCQUNWO3FCQUNBOzs7b0JBQ00sRUFBRSxLQUFLLEtBQUs7Ozs7NkJBRWpCOzs7WUFBTDtvQkFDTyxFQUFFLEtBQUs7O3FCQUNWO3FCQUNBOzs7b0JBQ00sRUFBRSxLQUFLLEtBQUs7Ozs7NkJBRWpCOzs7WUFBTDtvQkFDTyxFQUFFLEtBQUs7O3FCQUNWO3FCQUNBOzs7b0JBQ00sRUFBRSxLQUFLLEtBQUs7Ozs7ZUFFMUI7OztXQWxGQzs7O2VBdUhGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/help.kode
