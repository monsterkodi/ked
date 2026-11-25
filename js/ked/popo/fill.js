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
            for (i = 0; i < width; i++)
            {
                row += cells[((rng[0] + i) % n + n) % n]
            }
            out.push(row)
        }
        return out
    }

    fill["bands"] = function (conf, region, rect)
    {
        var b, k, out, rng, rows, scale, spans, x1, x2, y, _31_37_, _43_28_, _46_52_

        scale = _k_.max(1,parseInt(((_31_37_=conf.scale) != null ? _31_37_ : 1)))
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
        for (b = 0; b < Math.floor(rect.h / scale); b++)
        {
            y = rect.y + b * scale
            spans = ((_43_28_=rows[y]) != null ? _43_28_ : [])
            for (k = 1; k < scale; k++)
            {
                spans = this.intersect(spans,(((_46_52_=rows[y + k]) != null ? _46_52_ : [])))
            }
            var list1 = _k_.list(spans)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                x1 = list1[_b_][0]
                x2 = list1[_b_][1]
                if (x2 - x1 >= scale)
                {
                    out.push([y,x1,x2])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvcG9wby9maWxsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsUUFBRDs7Ozs7SUFFSSxNQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLE1BQU0sY0FBSyxLQUFLLDRCQUFVO3NCQUNQOzttQkFBekIsS0FBQyxPQUFPOztRQUVWLElBQUksTUFBTTtRQUNWOzRCQUVXOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSixNQUFNO2lCQUNGLElBQUssT0FBSTs7Z0JBQ1QsT0FBTyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksS0FBSzs7WUFFMUMsSUFBSSxLQUFLOztlQUViOzs7SUFJSixNQUFDLG9CQUFPLE1BQUssUUFBTzs7OztRQUVoQixnQkFBWSxxQkFBTSxLQUFLLDJCQUFRO1FBQy9COzRCQUVXOzs7WUFBUDtrQkFDeUIsS0FBSyxJQUFJOztnQkFBbEMsS0FBSyxJQUFJOztZQUNULEtBQUssSUFBSSxJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUk7O1FBRWxDO2FBRUksSUFBSyxrQkFBVSxLQUFLLElBQUk7O1lBRXhCLElBQVEsS0FBSyxJQUFJLElBQUU7WUFDbkIsa0JBQVEsS0FBSztpQkFFVCxJQUFLLE9BQUk7O2dCQUNULFFBQVEsS0FBQyxVQUFVLGlCQUFPLEtBQUssSUFBRTs7aUNBRXRCOzs7Z0JBQVY7Z0JBQUc7b0JBQ2tCLEtBQUssTUFBTTs7b0JBQWpDLElBQUksTUFBTSxFQUFFLEdBQUc7Ozs7ZUFFdkI7OztJQUdKLE1BQUMsd0JBQVcsR0FBRTs7OztRQUVWOzRCQUVlOzs7WUFBVjtZQUFHO2lDQUNXOzs7Z0JBQVY7Z0JBQUc7Z0JBQ0osYUFBUyxHQUFHO2dCQUNaLGFBQVMsR0FBRztvQkFDUSxLQUFLOztvQkFBekIsSUFBSSxNQUFNLEdBQUc7Ozs7ZUFFckIsSUFBSSxlQUFNLEdBQUU7O21CQUFNLEVBQUUsS0FBSyxFQUFFOzs7O0lBRS9CLE1BQUMsb0JBQU87Ozs7UUFFSjtlQUNNLElBQUksU0FBUzs7WUFDZixJQUFJLEtBQUs7O2VBQ2IsSUFBSSxLQUFLOzs7SUFFYixNQUFDLHFCQUFROzs7O1FBRUw7NEJBQ1c7OztZQUFQO1lBQ0EsSUFBSSxLQUFLOztlQUNiOzs7V0E3RVA7OztlQStFTSJ9
//# sourceURL=../../../kode/ked/popo/fill.kode
