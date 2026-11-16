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
            return {char:' ',fg:[],bg:[],attr:null,ul:null}
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
        for (var _a_ = l = 0, _b_ = rows; (_a_ <= _b_ ? l < rows : l > rows); (_a_ <= _b_ ? ++l : --l))
        {
            cells = []
            for (var _c_ = c = 0, _d_ = cols; (_c_ <= _d_ ? c < cols : c > cols); (_c_ <= _d_ ? ++c : --c))
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
        var _a_ = this.pos(x,y); x = _a_[0]; y = _a_[1]

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

        var _a_ = this.cellSize(cells); cols = _a_[0]; rows = _a_[1]

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

        var _a_ = this.cellSize(cells); cols = _a_[0]; rows = _a_[1]

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

        var _a_ = this.clampCellRect(cells,x1,y1,x2,y2); x1 = _a_[0]; y1 = _a_[1]; x2 = _a_[2]; y2 = _a_[3]

        res = []
        for (var _b_ = y = y1, _c_ = y2; (_b_ <= _c_ ? y <= y2 : y >= y2); (_b_ <= _c_ ? ++y : --y))
        {
            for (var _d_ = x = x1, _e_ = x2; (_d_ <= _e_ ? x <= x2 : x >= x2); (_d_ <= _e_ ? ++x : --x))
            {
                res.push({pos:[x,y],cell:cells[y][x]})
            }
        }
        return res
    }

    cell["cellNeighborsAtPos"] = function (cells, x, y, xd = 1, yd = 1)
    {
        var x1, x2, y1, y2

        var _a_ = this.clampCellRect(cells,x - xd,y - yd,x + xd,y + yd); x1 = _a_[0]; y1 = _a_[1]; x2 = _a_[2]; y2 = _a_[3]

        return this.cellsInRect(cells,x1,y1,x2,y2)
    }

    return cell
})()

export default cell;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2NlbGwua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQyxRQUFEOzs7OztJQUVJLE1BQUMsb0JBQU8sTUFBSzs7ZUFBUSxLQUFDLE9BQU8sS0FBTTs7b0JBQWMsS0FBSyxJQUFJLE1BQU0sTUFBTSxLQUFLLEtBQUssR0FBRzs7OztJQUNuRixNQUFDLG9CQUFPLE1BQUs7O2VBQVEsS0FBQyxPQUFPLEtBQU07O29CQUFjLE9BQU87Ozs7SUFFeEQsTUFBQyxxQkFBUSxNQUFLLE1BQUs7Ozs7UUFFZjt1QkFDSSxJQUFLLFNBQUksd0JBQUEsV0FBQTs7WUFDVDsyQkFDSSxJQUFLLFNBQUksd0JBQUEsV0FBQTs7Z0JBQ1QsTUFBTSxLQUFLOztZQUNmLE1BQU0sS0FBSzs7ZUFDZjs7O0lBRUosTUFBQyw0QkFBZTs7OztRQUVaLFFBQVEsS0FBQyxhQUFhO1FBQ3RCLFFBQVEsS0FBQyxNQUFNLE1BQU0sTUFBTTtRQUUzQixLQUFDLFdBQVcsTUFBTTtlQUVsQjs7O0lBRUosTUFBQyx1QkFBVTs7Z0JBQVUsTUFBTSxHQUFHLE9BQU8sTUFBTTs7O0lBRTNDLE1BQUMseUJBQVksT0FBTSxPQUFNLElBQUUsR0FBRSxJQUFFOzs7O3NCQUVoQjs7OztrQkFFSCxLQUFDLElBQUksRUFBRSxJQUFkLFlBQUU7OzRCQUVZO2FBQU47O1lBQUw7aUNBQ2U7aUJBQU47O2dCQUFMO2dCQUNBLE1BQU0sSUFBSSxJQUFJLE9BQU87Ozs7O0lBRWpDLE1BQUMsMkJBQWMsT0FBTSxJQUFHLElBQUcsSUFBRzs7OztrQkFFWixLQUFDLFNBQVMsUUFBdkIsZUFBSzs7WUFFWSxLQUFLOztZQUF2QixLQUFLLE9BQU87O1lBQ00sS0FBSzs7WUFBdkIsS0FBSyxPQUFPOztZQUVNLEtBQUs7O1lBQXZCLEtBQUssT0FBTzs7WUFDTSxLQUFLOztZQUF2QixLQUFLLE9BQU87O2dCQUVYLEdBQUcsR0FBRyxHQUFHOzs7SUFFZCxNQUFDLDRCQUFlLE9BQU0sSUFBRyxJQUFHLElBQUc7Ozs7a0JBRWIsS0FBQyxTQUFTLFFBQXZCLGVBQUs7O1FBRU4sZUFBVyxFQUFFLE9BQUssRUFBRTtRQUNwQixlQUFXLEVBQUUsT0FBSyxFQUFFO1FBRXBCLGVBQVcsRUFBRSxPQUFLLEVBQUU7UUFDcEIsZUFBVyxFQUFFLE9BQUssRUFBRTtnQkFFbkIsR0FBRyxHQUFHLEdBQUc7OztJQUVkLE1BQUMsNEJBQWUsT0FBTTs7OztRQUVsQjs0QkFDYTthQUFMOztZQUFKO2lDQUNjO2lCQUFMOztnQkFBTDtvQkFDRyxLQUFLLFNBQVE7O29CQUNaLElBQUksTUFBSyxLQUFLLEVBQUUsR0FBRyxLQUFLLE1BQU0sR0FBRzs7OztlQUM3Qzs7O0lBRUosTUFBQywwQkFBYSxPQUFNLElBQUcsSUFBRyxJQUFHOzs7O2tCQUVULEtBQUMsY0FBYyxNQUFNLEdBQUcsR0FBRyxHQUFHLEtBQTdDLGFBQUcsYUFBRyxhQUFHOztRQUVWO3VCQUNJLElBQUssVUFBSSx1QkFBQSxVQUFBOzsyQkFDTCxJQUFLLFVBQUksdUJBQUEsVUFBQTs7Z0JBQ1QsSUFBSSxNQUFLLEtBQUssRUFBRSxHQUFHLEtBQUssTUFBTSxHQUFHOzs7ZUFDekM7OztJQUVKLE1BQUMsaUNBQW9CLE9BQU0sR0FBRSxHQUFFLEtBQUcsR0FBRSxLQUFHOzs7O2tCQUVuQixLQUFDLGNBQWMsTUFBTSxJQUFFLEdBQUcsSUFBRSxHQUFHLElBQUUsR0FBRyxJQUFFLEtBQXJELGFBQUcsYUFBRyxhQUFHOztlQUVWLEtBQUMsWUFBWSxNQUFNLEdBQUcsR0FBRyxHQUFHOzs7V0FuRm5DOzs7ZUFxRk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/cell.kode
