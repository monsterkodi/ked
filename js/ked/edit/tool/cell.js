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
            return {bg:[],fg:[],char:' '}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2NlbGwua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRUyxRQUFUOzs7OztJQVFJLE1BQUMsb0JBQU8sTUFBSzs7ZUFBUSxLQUFDLE9BQU8sS0FBTTs7b0JBQWMsTUFBTSxNQUFNLEtBQUs7Ozs7SUFDbEUsTUFBQyxvQkFBTyxNQUFLOztlQUFRLEtBQUMsT0FBTyxLQUFNOztvQkFBYyxPQUFPOzs7O0lBRXhELE1BQUMscUJBQVEsTUFBSyxNQUFLOzs7O1FBRWY7dUJBQ0ksSUFBSyxTQUFJLHdCQUFBLFdBQUE7O1lBQ1Q7MkJBQ0ksSUFBSyxTQUFJLHdCQUFBLFdBQUE7O2dCQUNULE1BQU0sS0FBSzs7WUFDZixNQUFNLEtBQUs7O2VBQ2Y7OztJQVFKLE1BQUMsNEJBQWU7Ozs7UUFFWixRQUFRLEtBQUMsYUFBYTtRQUN0QixRQUFRLEtBQUMsTUFBTSxNQUFNLE1BQU07UUFFM0IsS0FBQyxXQUFXLE1BQU07ZUFFbEI7OztJQVFKLE1BQUMsdUJBQVU7O2dCQUFVLE1BQU0sR0FBRyxPQUFPLE1BQU07OztJQVEzQyxNQUFDLHlCQUFZLE9BQU0sT0FBTSxJQUFFLEdBQUUsSUFBRTs7OztzQkFFaEI7Ozs7a0JBRUgsS0FBQyxJQUFJLEVBQUUsSUFBZCxZQUFFOzs0QkFFWTthQUFOOztZQUFMO2lDQUNlO2lCQUFOOztnQkFBTDtnQkFDQSxNQUFNLElBQUksSUFBSSxPQUFPOzs7OztJQVFqQyxNQUFDLDJCQUFjLE9BQU0sSUFBRyxJQUFHLElBQUc7Ozs7a0JBRVosS0FBQyxTQUFTLFFBQXZCLGVBQUs7O1lBRVksS0FBSzs7WUFBdkIsS0FBSyxPQUFPOztZQUNNLEtBQUs7O1lBQXZCLEtBQUssT0FBTzs7WUFFTSxLQUFLOztZQUF2QixLQUFLLE9BQU87O1lBQ00sS0FBSzs7WUFBdkIsS0FBSyxPQUFPOztnQkFFWCxHQUFHLEdBQUcsR0FBRzs7O0lBUWQsTUFBQyw0QkFBZSxPQUFNLElBQUcsSUFBRyxJQUFHOzs7O2tCQUViLEtBQUMsU0FBUyxRQUF2QixlQUFLOztRQUVOLGVBQVcsRUFBRSxPQUFLLEVBQUU7UUFDcEIsZUFBVyxFQUFFLE9BQUssRUFBRTtRQUVwQixlQUFXLEVBQUUsT0FBSyxFQUFFO1FBQ3BCLGVBQVcsRUFBRSxPQUFLLEVBQUU7Z0JBRW5CLEdBQUcsR0FBRyxHQUFHOzs7SUFRZCxNQUFDLDRCQUFlLE9BQU07Ozs7UUFFbEI7NEJBQ2E7YUFBTDs7WUFBSjtpQ0FDYztpQkFBTDs7Z0JBQUw7b0JBQ0csS0FBSyxTQUFROztvQkFDWixJQUFJLE1BQUssS0FBSyxFQUFFLEdBQUcsS0FBSyxNQUFNLEdBQUc7Ozs7ZUFDN0M7OztJQVFKLE1BQUMsMEJBQWEsT0FBTSxJQUFHLElBQUcsSUFBRzs7OztrQkFFVCxLQUFDLGNBQWMsTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUE3QyxhQUFHLGFBQUcsYUFBRzs7UUFFVjt1QkFDSSxJQUFLLFVBQUksdUJBQUEsVUFBQTs7MkJBQ0wsSUFBSyxVQUFJLHVCQUFBLFVBQUE7O2dCQUNULElBQUksTUFBSyxLQUFLLEVBQUUsR0FBRyxLQUFLLE1BQU0sR0FBRzs7O2VBQ3pDOzs7SUFRSixNQUFDLGlDQUFvQixPQUFNLEdBQUUsR0FBRSxLQUFHLEdBQUUsS0FBRzs7OztrQkFFbkIsS0FBQyxjQUFjLE1BQU0sSUFBRSxHQUFHLElBQUUsR0FBRyxJQUFFLEdBQUcsSUFBRSxLQUFyRCxhQUFHLGFBQUcsYUFBRzs7ZUFFVixLQUFDLFlBQVksTUFBTSxHQUFHLEdBQUcsR0FBRzs7O1dBekkzQjs7O2VBMklGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/cell.kode
