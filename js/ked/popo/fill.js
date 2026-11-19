var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var fill


fill = (function ()
{
    function fill ()
    {}

    fill["pattern"] = function (conf, region)
    {
        var cells, i, n, out, rng, row, width, _5_40_

        cells = Array.from(((_5_40_=conf.pattern) != null ? _5_40_ : ''))
        if (_k_.empty(cells))
        {
            return this.blanks(region)
        }
        n = cells.length
        out = []
        var list = _k_.list(region)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            width = rng[2] - rng[0]
            if (width <= 0)
            {
                out.push('')
                continue
            }
            row = ''
            for (var _b_ = i = 0, _c_ = width; (_b_ <= _c_ ? i < width : i > width); (_b_ <= _c_ ? ++i : --i))
            {
                row += cells[((rng[0] + i) % n + n) % n]
            }
            out.push(row)
        }
        return out
    }

    fill["text"] = function (conf, region)
    {
        var cells, i, k, lineY, out, rng, row, scale, width, y, _29_37_, _30_37_

        cells = Array.from(((_29_37_=conf.text) != null ? _29_37_ : ''))
        scale = _k_.max(1,parseInt(((_30_37_=conf.scale) != null ? _30_37_ : 1)))
        out = []
        i = 0
        lineY = null
        var list = _k_.list(region)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            width = rng[2] - rng[0]
            if (width <= 0)
            {
                out.push('')
                continue
            }
            y = rng[1]
            if (!_k_.empty(lineY) && y > lineY && y < lineY + scale)
            {
                out.push(this.blank(width))
                continue
            }
            lineY = y
            row = []
            while (row.length + scale <= width && i < cells.length)
            {
                if (cells[i] === '\n')
                {
                    i += 1
                    break
                }
                row.push(cells[i])
                i += 1
                for (var _b_ = k = 1, _c_ = scale; (_b_ <= _c_ ? k < scale : k > scale); (_b_ <= _c_ ? ++k : --k))
                {
                    row.push(' ')
                }
            }
            while (row.length < width)
            {
                row.push(' ')
            }
            out.push(row.join(''))
        }
        return out
    }

    fill["blank"] = function (width)
    {
        var row

        row = []
        while (row.length < width)
        {
            row.push(' ')
        }
        return row.join('')
    }

    fill["blanks"] = function (region)
    {
        var out, rng

        out = []
        var list = _k_.list(region)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            out.push('')
        }
        return out
    }

    return fill
})()

export default fill;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvcG9wby9maWxsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsUUFBRDs7Ozs7SUFFSSxNQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLE1BQU0sY0FBSyxLQUFLLDRCQUFVO3NCQUNQOzttQkFBekIsS0FBQyxPQUFPOztRQUVWLElBQUksTUFBTTtRQUNWOzRCQUVXOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSixNQUFNOzJCQUNGLElBQUssU0FBSSx5QkFBQSxZQUFBOztnQkFDVCxPQUFPLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLOztZQUUxQyxJQUFJLEtBQUs7O2VBRWI7OztJQUVKLE1BQUMsbUJBQU0sTUFBSzs7OztRQUVSLFFBQVEsTUFBTSxlQUFLLEtBQUssMEJBQU87UUFDL0IsZ0JBQVkscUJBQU0sS0FBSywyQkFBUTtRQUMvQjtRQUNBLElBQVE7UUFDUixRQUFROzRCQUVHOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSixJQUFJLElBQUk7MkJBRUMsVUFBVSxJQUFJLFNBQVUsSUFBSSxRQUFROztnQkFDekMsSUFBSSxLQUFLLEtBQUMsTUFBTTtnQkFDaEI7O1lBRUosUUFBUTtZQUNSO21CQUVNLElBQUksU0FBUyxTQUFTLFNBQVUsSUFBSSxNQUFNOztvQkFFekMsTUFBTSxPQUFNOztvQkFDWCxLQUFLO29CQUNMOztnQkFFSixJQUFJLEtBQUssTUFBTTtnQkFDZixLQUFLOytCQUVELElBQUssU0FBSSx5QkFBQSxZQUFBOztvQkFDVCxJQUFJLEtBQUs7OzttQkFFWCxJQUFJLFNBQVM7O2dCQUNmLElBQUksS0FBSzs7WUFFYixJQUFJLEtBQUssSUFBSSxLQUFLOztlQUV0Qjs7O0lBRUosTUFBQyxvQkFBTzs7OztRQUVKO2VBQ00sSUFBSSxTQUFTOztZQUNmLElBQUksS0FBSzs7ZUFDYixJQUFJLEtBQUs7OztJQUViLE1BQUMscUJBQVE7Ozs7UUFFTDs0QkFDVzs7O1lBQVA7WUFDQSxJQUFJLEtBQUs7O2VBQ2I7OztXQWxGUDs7O2VBb0ZNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/fill.kode
