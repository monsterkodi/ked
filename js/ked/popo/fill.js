var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
        var cells, i, out, rng, row, width, _29_37_

        cells = Array.from(((_29_37_=conf.text) != null ? _29_37_ : ''))
        out = []
        i = 0
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
            row = []
            while (row.length < width && i < cells.length)
            {
                if (cells[i] === '\n')
                {
                    i += 1
                    break
                }
                row.push(cells[i])
                i += 1
            }
            while (row.length < width)
            {
                row.push(' ')
            }
            out.push(row.join(''))
        }
        return out
    }

    fill["scaled"] = function (conf, region, rect)
    {
        var b, cells, i, k, out, rng, rows, scale, spans, x, x1, x2, y, _66_37_, _67_37_, _80_28_, _83_52_

        cells = Array.from(((_66_37_=conf.text) != null ? _66_37_ : ''))
        scale = _k_.max(1,parseInt(((_67_37_=conf.scale) != null ? _67_37_ : 1)))
        rows = {}
        var list = _k_.list(region)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (!(rows[rng[1]] != null))
            {
                rows[rng[1]] = []
            }
            rows[rng[1]].push([rng[0],rng[2]])
        }
        out = []
        i = 0
        for (var _b_ = b = 0, _c_ = Math.floor(rect.h / scale); (_b_ <= _c_ ? b < Math.floor(rect.h / scale) : b > Math.floor(rect.h / scale)); (_b_ <= _c_ ? ++b : --b))
        {
            y = rect.y + b * scale
            spans = ((_80_28_=rows[y]) != null ? _80_28_ : [])
            for (var _d_ = k = 1, _e_ = scale; (_d_ <= _e_ ? k < scale : k > scale); (_d_ <= _e_ ? ++k : --k))
            {
                spans = this.intersect(spans,(((_83_52_=rows[y + k]) != null ? _83_52_ : [])))
            }
            var list1 = _k_.list(spans)
            for (var _f_ = 0; _f_ < list1.length; _f_++)
            {
                x1 = list1[_f_][0]
                x2 = list1[_f_][1]
                x = x1
                while (x + scale <= x2 && i < cells.length)
                {
                    if (cells[i] === '\n')
                    {
                        i += 1
                        break
                    }
                    out.push([x,y,cells[i]])
                    i += 1
                    x += scale
                }
            }
        }
        return out
    }

    fill["intersect"] = function (a, b)
    {
        var a1, a2, b1, b2, out, x1, x2

        out = []
        var list = _k_.list(a)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            a1 = list[_a_][0]
            a2 = list[_a_][1]
            var list1 = _k_.list(b)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                b1 = list1[_b_][0]
                b2 = list1[_b_][1]
                x1 = _k_.max(a1,b1)
                x2 = _k_.min(a2,b2)
                if (x1 < x2)
                {
                    out.push([x1,x2])
                }
            }
        }
        return out.sort(function (p, q)
        {
            return p[0] - q[0]
        })
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvcG9wby9maWxsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsUUFBRDs7Ozs7SUFFSSxNQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLE1BQU0sY0FBSyxLQUFLLDRCQUFVO3NCQUNQOzttQkFBekIsS0FBQyxPQUFPOztRQUVWLElBQUksTUFBTTtRQUNWOzRCQUVXOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSixNQUFNOzJCQUNGLElBQUssU0FBSSx5QkFBQSxZQUFBOztnQkFDVCxPQUFPLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLOztZQUUxQyxJQUFJLEtBQUs7O2VBRWI7OztJQUVKLE1BQUMsbUJBQU0sTUFBSzs7OztRQUVSLFFBQVEsTUFBTSxlQUFLLEtBQUssMEJBQU87UUFDL0I7UUFDQSxJQUFROzRCQUVHOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSjttQkFFTSxJQUFJLFNBQVMsU0FBVSxJQUFJLE1BQU07O29CQUVoQyxNQUFNLE9BQU07O29CQUNYLEtBQUs7b0JBQ0w7O2dCQUVKLElBQUksS0FBSyxNQUFNO2dCQUNmLEtBQUs7O21CQUVILElBQUksU0FBUzs7Z0JBQ2YsSUFBSSxLQUFLOztZQUViLElBQUksS0FBSyxJQUFJLEtBQUs7O2VBRXRCOzs7SUFPSixNQUFDLHFCQUFRLE1BQUssUUFBTzs7OztRQUVqQixRQUFRLE1BQU0sZUFBSyxLQUFLLDBCQUFPO1FBQy9CLGdCQUFZLHFCQUFNLEtBQUssMkJBQVE7UUFDL0I7NEJBRVc7OztZQUFQO2tCQUN5QixLQUFLLElBQUk7O2dCQUFsQyxLQUFLLElBQUk7O1lBQ1QsS0FBSyxJQUFJLElBQUksTUFBTSxJQUFJLEdBQUcsSUFBSTs7UUFFbEM7UUFDQSxJQUFNO3VCQUVGLElBQUssb0JBQVUsS0FBSyxJQUFJLHFDQUFULEtBQUssSUFBSSx3QkFBVCxLQUFLLElBQUk7O1lBRXhCLElBQVEsS0FBSyxJQUFJLElBQUU7WUFDbkIsa0JBQVEsS0FBSzsyQkFFVCxJQUFLLFNBQUkseUJBQUEsWUFBQTs7Z0JBQ1QsUUFBUSxLQUFDLFVBQVUsaUJBQU8sS0FBSyxJQUFFOztpQ0FFdEI7OztnQkFBVjtnQkFBRztnQkFFSixJQUFJO3VCQUVFLElBQUksU0FBUyxNQUFPLElBQUksTUFBTTs7d0JBRTdCLE1BQU0sT0FBTTs7d0JBQ1gsS0FBSzt3QkFDTDs7b0JBRUosSUFBSSxNQUFNLEVBQUUsRUFBRSxNQUFNO29CQUNwQixLQUFLO29CQUNMLEtBQUs7Ozs7ZUFFakI7OztJQUVKLE1BQUMsd0JBQVcsR0FBRTs7OztRQUVWOzRCQUVlOzs7WUFBVjtZQUFHO2lDQUNXOzs7Z0JBQVY7Z0JBQUc7Z0JBQ0osYUFBUyxHQUFHO2dCQUNaLGFBQVMsR0FBRztvQkFDUSxLQUFLOztvQkFBekIsSUFBSSxNQUFNLEdBQUc7Ozs7ZUFFckIsSUFBSSxlQUFNLEdBQUU7O21CQUFNLEVBQUUsS0FBSyxFQUFFOzs7O0lBRS9CLE1BQUMsb0JBQU87Ozs7UUFFSjtlQUNNLElBQUksU0FBUzs7WUFDZixJQUFJLEtBQUs7O2VBQ2IsSUFBSSxLQUFLOzs7SUFFYixNQUFDLHFCQUFROzs7O1FBRUw7NEJBQ1c7OztZQUFQO1lBQ0EsSUFBSSxLQUFLOztlQUNiOzs7V0E1SFA7OztlQThITSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/fill.kode
