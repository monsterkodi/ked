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
        for (var _a_ = y = y1, _b_ = y2; (_a_ <= _b_ ? y <= y2 : y >= y2); (_a_ <= _b_ ? ++y : --y))
        {
            for (var _c_ = x = x1, _d_ = x2; (_c_ <= _d_ ? x <= x2 : x >= x2); (_c_ <= _d_ ? ++x : --x))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2NlbGwua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQyxRQUFEOzs7OztJQUVJLE1BQUMsb0JBQU8sTUFBSzs7ZUFBUSxLQUFDLE9BQU8sS0FBTTs7b0JBQWMsS0FBSyxJQUFJLE1BQU0sTUFBTSxLQUFLLEtBQUssR0FBRyxLQUFLLE1BQU07Ozs7SUFDOUYsTUFBQyxvQkFBTyxNQUFLOztlQUFRLEtBQUMsT0FBTyxLQUFNOztvQkFBYyxPQUFPOzs7O0lBRXhELE1BQUMscUJBQVEsTUFBSyxNQUFLOzs7O1FBRWY7dUJBQ0ksSUFBSyxTQUFJLHdCQUFBLFdBQUE7O1lBQ1Q7MkJBQ0ksSUFBSyxTQUFJLHdCQUFBLFdBQUE7O2dCQUNULE1BQU0sS0FBSzs7WUFDZixNQUFNLEtBQUs7O2VBQ2Y7OztJQUVKLE1BQUMsNEJBQWU7Ozs7UUFFWixRQUFRLEtBQUMsYUFBYTtRQUN0QixRQUFRLEtBQUMsTUFBTSxNQUFNLE1BQU07UUFFM0IsS0FBQyxXQUFXLE1BQU07ZUFFbEI7OztJQUVKLE1BQUMsdUJBQVU7O2dCQUFVLE1BQU0sR0FBRyxPQUFPLE1BQU07OztJQUUzQyxNQUFDLHlCQUFZLE9BQU0sT0FBTSxJQUFFLEdBQUUsSUFBRTs7OztzQkFFaEI7Ozs7VUFFVixFQUFFLEtBQUssS0FBQyxJQUFJLEVBQUU7NEJBRUE7YUFBTjs7WUFBTDtpQ0FDZTtpQkFBTjs7Z0JBQUw7Z0JBQ0EsTUFBTSxJQUFJLElBQUksT0FBTzs7Ozs7SUFFakMsTUFBQywyQkFBYyxPQUFNLElBQUcsSUFBRyxJQUFHOzs7O1VBRXpCLEtBQUssUUFBUSxLQUFDLFNBQVM7WUFFTixLQUFLOztZQUF2QixLQUFLLE9BQU87O1lBQ00sS0FBSzs7WUFBdkIsS0FBSyxPQUFPOztZQUVNLEtBQUs7O1lBQXZCLEtBQUssT0FBTzs7WUFDTSxLQUFLOztZQUF2QixLQUFLLE9BQU87O2dCQUVYLEdBQUcsR0FBRyxHQUFHOzs7SUFFZCxNQUFDLDRCQUFlLE9BQU0sSUFBRyxJQUFHLElBQUc7Ozs7VUFFMUIsS0FBSyxRQUFRLEtBQUMsU0FBUztRQUV4QixlQUFXLEVBQUUsT0FBSyxFQUFFO1FBQ3BCLGVBQVcsRUFBRSxPQUFLLEVBQUU7UUFFcEIsZUFBVyxFQUFFLE9BQUssRUFBRTtRQUNwQixlQUFXLEVBQUUsT0FBSyxFQUFFO2dCQUVuQixHQUFHLEdBQUcsR0FBRzs7O0lBRWQsTUFBQyw0QkFBZSxPQUFNOzs7O1FBRWxCOzRCQUNhO2FBQUw7O1lBQUo7aUNBQ2M7aUJBQUw7O2dCQUFMO29CQUNHLEtBQUssU0FBUTs7b0JBQ1osSUFBSSxNQUFLLEtBQUssRUFBRSxHQUFHLEtBQUssTUFBTSxHQUFHOzs7O2VBQzdDOzs7SUFFSixNQUFDLDBCQUFhLE9BQU0sSUFBRyxJQUFHLElBQUc7Ozs7VUFFeEIsR0FBRyxHQUFHLEdBQUcsTUFBTSxLQUFDLGNBQWMsTUFBTSxHQUFHLEdBQUcsR0FBRztRQUU5Qzt1QkFDSSxJQUFLLFVBQUksdUJBQUEsVUFBQTs7MkJBQ0wsSUFBSyxVQUFJLHVCQUFBLFVBQUE7O2dCQUNULElBQUksTUFBSyxLQUFLLEVBQUUsR0FBRyxLQUFLLE1BQU0sR0FBRzs7O2VBQ3pDOzs7SUFFSixNQUFDLGlDQUFvQixPQUFNLEdBQUUsR0FBRSxLQUFHLEdBQUUsS0FBRzs7OztVQUVsQyxHQUFHLEdBQUcsR0FBRyxNQUFNLEtBQUMsY0FBYyxNQUFNLElBQUUsR0FBRyxJQUFFLEdBQUcsSUFBRSxHQUFHLElBQUU7ZUFFdEQsS0FBQyxZQUFZLE1BQU0sR0FBRyxHQUFHLEdBQUc7OztXQW5GbkM7OztlQXFGTSJ9
//# sourceURL=../../../../kode/ked/edit/tool/cell.kode
