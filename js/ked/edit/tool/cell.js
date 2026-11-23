var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var cell


cell = (function ()
{
    function cell ()
    {}

    cell["cells"] = function (cols, rows)
    {
        return this.matrix(cols,rows,(function ()
        {
            return {char:' ',fg:[],bg:[],attr:null,ul:null,block:null}
        }))
    }

    cell["metas"] = function (cols, rows)
    {
        return this.matrix(cols,rows,(function ()
        {
            return {pre:[],pst:[]}
        }))
    }

    cell["matrix"] = function (cols, rows, cb)
    {
        var c, cells, l, lines

        lines = []
        for (l = 0; l < rows; l++)
        {
            cells = []
            for (c = 0; c < cols; c++)
            {
                cells.push(cb())
            }
            lines.push(cells)
        }
        return lines
    }

    cell["cellsForLines"] = function (lines)
    {
        var cells, width

        width = this.widthOfLines(lines)
        cells = this.cells(width,lines.length)
        this.stampLines(cells,lines)
        return cells
    }

    cell["cellSize"] = function (cells)
    {
        return [cells[0].length,cells.length]
    }

    cell["stampLines"] = function (cells, lines, x = 0, y = 0)
    {
        var char, ci, li, line

        if (_k_.empty(lines))
        {
            return
        }
        ;[x,y] = this.pos(x,y)
        var list = _k_.list(lines)
        for (li = 0; li < list.length; li++)
        {
            line = list[li]
            var list1 = _k_.list(line)
            for (ci = 0; ci < list1.length; ci++)
            {
                char = list1[ci]
                cells[li][ci].char = char
            }
        }
    }

    cell["wrapCellRect"] = function (cells, x1, y1, x2, y2)
    {
        var cols, rows

        ;[cols,rows] = this.cellSize(cells)
        if (x1 < 0)
        {
            x1 = cols + x1
        }
        if (x2 < 0)
        {
            x2 = cols + x2
        }
        if (y1 < 0)
        {
            y1 = rows + y1
        }
        if (y2 < 0)
        {
            y2 = rows + y2
        }
        return [x1,y1,x2,y2]
    }

    cell["clampCellRect"] = function (cells, x1, y1, x2, y2)
    {
        var cols, rows

        ;[cols,rows] = this.cellSize(cells)
        x1 = _k_.clamp(0,cols - 1,x1)
        x2 = _k_.clamp(0,cols - 1,x2)
        y1 = _k_.clamp(0,rows - 1,y1)
        y2 = _k_.clamp(0,rows - 1,y2)
        return [x1,y1,x2,y2]
    }

    cell["cellsWithChar"] = function (cells, char)
    {
        var cell, res, row, x, y

        res = []
        var list = _k_.list(cells)
        for (y = 0; y < list.length; y++)
        {
            row = list[y]
            var list1 = _k_.list(row)
            for (x = 0; x < list1.length; x++)
            {
                cell = list1[x]
                if (cell.char === char)
                {
                    res.push({pos:[x,y],cell:cells[y][x]})
                }
            }
        }
        return res
    }

    cell["cellsInRect"] = function (cells, x1, y1, x2, y2)
    {
        var res, x, y

        ;[x1,y1,x2,y2] = this.clampCellRect(cells,x1,y1,x2,y2)
        res = []
        for (y = y1; y <= y2; y++)
        {
            for (x = x1; x <= x2; x++)
            {
                res.push({pos:[x,y],cell:cells[y][x]})
            }
        }
        return res
    }

    cell["cellNeighborsAtPos"] = function (cells, x, y, xd = 1, yd = 1)
    {
        var x1, x2, y1, y2

        ;[x1,y1,x2,y2] = this.clampCellRect(cells,x - xd,y - yd,x + xd,y + yd)
        return this.cellsInRect(cells,x1,y1,x2,y2)
    }

    return cell
})()

export default cell;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2NlbGwua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQyxRQUFEOzs7OztJQUVJLE1BQUMsb0JBQU8sTUFBSzs7ZUFBUSxLQUFDLE9BQU8sS0FBTTs7b0JBQWMsS0FBSyxJQUFJLE1BQU0sTUFBTSxLQUFLLEtBQUssR0FBRyxLQUFLLE1BQU07Ozs7SUFDOUYsTUFBQyxvQkFBTyxNQUFLOztlQUFRLEtBQUMsT0FBTyxLQUFNOztvQkFBYyxPQUFPOzs7O0lBRXhELE1BQUMscUJBQVEsTUFBSyxNQUFLOzs7O1FBRWY7YUFDSSxJQUFLLE9BQUk7O1lBQ1Q7aUJBQ0ksSUFBSyxPQUFJOztnQkFDVCxNQUFNLEtBQUs7O1lBQ2YsTUFBTSxLQUFLOztlQUNmOzs7SUFFSixNQUFDLDRCQUFlOzs7O1FBRVosUUFBUSxLQUFDLGFBQWE7UUFDdEIsUUFBUSxLQUFDLE1BQU0sTUFBTSxNQUFNO1FBRTNCLEtBQUMsV0FBVyxNQUFNO2VBRWxCOzs7SUFFSixNQUFDLHVCQUFVOztnQkFBVSxNQUFNLEdBQUcsT0FBTyxNQUFNOzs7SUFFM0MsTUFBQyx5QkFBWSxPQUFNLE9BQU0sSUFBRSxHQUFFLElBQUU7Ozs7c0JBRWhCOzs7O1VBRVYsRUFBRSxLQUFLLEtBQUMsSUFBSSxFQUFFOzRCQUVBO2FBQU47O1lBQUw7aUNBQ2U7aUJBQU47O2dCQUFMO2dCQUNBLE1BQU0sSUFBSSxJQUFJLE9BQU87Ozs7O0lBRWpDLE1BQUMsMkJBQWMsT0FBTSxJQUFHLElBQUcsSUFBRzs7OztVQUV6QixLQUFLLFFBQVEsS0FBQyxTQUFTO1lBRU4sS0FBSzs7WUFBdkIsS0FBSyxPQUFPOztZQUNNLEtBQUs7O1lBQXZCLEtBQUssT0FBTzs7WUFFTSxLQUFLOztZQUF2QixLQUFLLE9BQU87O1lBQ00sS0FBSzs7WUFBdkIsS0FBSyxPQUFPOztnQkFFWCxHQUFHLEdBQUcsR0FBRzs7O0lBRWQsTUFBQyw0QkFBZSxPQUFNLElBQUcsSUFBRyxJQUFHOzs7O1VBRTFCLEtBQUssUUFBUSxLQUFDLFNBQVM7UUFFeEIsZUFBVyxFQUFFLE9BQUssRUFBRTtRQUNwQixlQUFXLEVBQUUsT0FBSyxFQUFFO1FBRXBCLGVBQVcsRUFBRSxPQUFLLEVBQUU7UUFDcEIsZUFBVyxFQUFFLE9BQUssRUFBRTtnQkFFbkIsR0FBRyxHQUFHLEdBQUc7OztJQUVkLE1BQUMsNEJBQWUsT0FBTTs7OztRQUVsQjs0QkFDYTthQUFMOztZQUFKO2lDQUNjO2lCQUFMOztnQkFBTDtvQkFDRyxLQUFLLFNBQVE7O29CQUNaLElBQUksTUFBSyxLQUFLLEVBQUUsR0FBRyxLQUFLLE1BQU0sR0FBRzs7OztlQUM3Qzs7O0lBRUosTUFBQywwQkFBYSxPQUFNLElBQUcsSUFBRyxJQUFHOzs7O1VBRXhCLEdBQUcsR0FBRyxHQUFHLE1BQU0sS0FBQyxjQUFjLE1BQU0sR0FBRyxHQUFHLEdBQUc7UUFFOUM7YUFDSSxJQUFLLFNBQUk7O2lCQUNMLElBQUssU0FBSTs7Z0JBQ1QsSUFBSSxNQUFLLEtBQUssRUFBRSxHQUFHLEtBQUssTUFBTSxHQUFHOzs7ZUFDekM7OztJQUVKLE1BQUMsaUNBQW9CLE9BQU0sR0FBRSxHQUFFLEtBQUcsR0FBRSxLQUFHOzs7O1VBRWxDLEdBQUcsR0FBRyxHQUFHLE1BQU0sS0FBQyxjQUFjLE1BQU0sSUFBRSxHQUFHLElBQUUsR0FBRyxJQUFFLEdBQUcsSUFBRTtlQUV0RCxLQUFDLFlBQVksTUFBTSxHQUFHLEdBQUcsR0FBRzs7O1dBbkZuQzs7O2VBcUZNIn0=
//# sourceURL=../../../../kode/ked/edit/tool/cell.kode
