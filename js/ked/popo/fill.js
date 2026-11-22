var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

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
        var ch, chars, out, rng, row, x, y, ys, _42_47_

        if (_k_.empty(region))
        {
            return []
        }
        ys = region.map(function (rng)
        {
            return rng[1]
        })
        chars = {}
        var list = _k_.list(this.flow(conf,region,{y:_k_.min(ys),h:_k_.max(ys) - _k_.min(ys) + 1}))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            x = list[_a_][0]
            y = list[_a_][1]
            ch = list[_a_][2]
            if ((ch != null))
            {
                chars[`${x},${y}`] = ch
            }
        }
        out = []
        var list1 = _k_.list(region)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            rng = list1[_b_]
            row = ''
            for (var _c_ = x = rng[0], _d_ = rng[2]; (_c_ <= _d_ ? x < rng[2] : x > rng[2]); (_c_ <= _d_ ? ++x : --x))
            {
                row += ((_42_47_=chars[`${x},${rng[1]}`]) != null ? _42_47_ : ' ')
            }
            out.push(row)
        }
        return out
    }

    fill["scaled"] = function (conf, region, rect)
    {
        var ch, out, x, y

        out = []
        var list = _k_.list(this.flow(conf,region,rect))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            x = list[_a_][0]
            y = list[_a_][1]
            ch = list[_a_][2]
            if ((ch != null))
            {
                out.push([x,y,ch])
            }
        }
        return out
    }

    fill["flow"] = function (conf, region, rect)
    {
        var b, cells, i, k, nl, out, rng, rows, scale, spans, tail, x, x1, x2, y, _60_37_, _61_37_, _77_28_, _80_52_

        cells = Array.from(((_60_37_=conf.text) != null ? _60_37_ : ''))
        scale = _k_.max(1,parseInt(((_61_37_=conf.scale) != null ? _61_37_ : 1)))
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
        tail = false
        for (var _b_ = b = 0, _c_ = Math.floor(rect.h / scale); (_b_ <= _c_ ? b < Math.floor(rect.h / scale) : b > Math.floor(rect.h / scale)); (_b_ <= _c_ ? ++b : --b))
        {
            if (tail)
            {
                break
            }
            y = rect.y + b * scale
            spans = ((_77_28_=rows[y]) != null ? _77_28_ : [])
            for (var _d_ = k = 1, _e_ = scale; (_d_ <= _e_ ? k < scale : k > scale); (_d_ <= _e_ ? ++k : --k))
            {
                spans = this.intersect(spans,(((_80_52_=rows[y + k]) != null ? _80_52_ : [])))
            }
            var list1 = _k_.list(spans)
            for (var _f_ = 0; _f_ < list1.length; _f_++)
            {
                x1 = list1[_f_][0]
                x2 = list1[_f_][1]
                if (x2 - x1 < scale)
                {
                    continue
                }
                x = x1
                nl = false
                while (x + scale <= x2 && i < cells.length)
                {
                    if (cells[i] === '\n')
                    {
                        nl = true
                        break
                    }
                    out.push([x,y,cells[i],i])
                    i += 1
                    x += scale
                }
                out.push([x,y,null,i])
                if (nl)
                {
                    i += 1
                }
                else if (i >= cells.length)
                {
                    tail = true
                    break
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvcG9wby9maWxsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsUUFBRDs7Ozs7SUFFSSxNQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLE1BQU0sY0FBSyxLQUFLLDRCQUFVO3NCQUNQOzttQkFBekIsS0FBQyxPQUFPOztRQUVWLElBQUksTUFBTTtRQUNWOzRCQUVXOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSixNQUFNOzJCQUNGLElBQUssU0FBSSx5QkFBQSxZQUFBOztnQkFDVCxPQUFPLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLOztZQUUxQyxJQUFJLEtBQUs7O2VBRWI7OztJQUVKLE1BQUMsbUJBQU0sTUFBSzs7OztzQkFFTTs7OztRQUVkLEtBQVEsT0FBTyxjQUFLOzttQkFBUSxJQUFJOztRQUNoQzs0QkFFZ0IsS0FBQyxLQUFLLEtBQUssUUFBUSxVQUFNLElBQUksVUFBTSxjQUFRLE1BQUk7OztZQUExRDtZQUFFO1lBQUU7aUJBQ3NCOztnQkFBM0IsU0FBUyxLQUFLLE9BQU87OztRQUV6Qjs2QkFFVzs7O1lBQVA7WUFDQSxNQUFNOzJCQUNGLElBQUssSUFBSSxVQUFLLElBQUksc0JBQUosSUFBSSxTQUFKLElBQUk7O2dCQUNsQixpQkFBTyxTQUFTLEtBQUssSUFBSSwyQkFBUTs7WUFDckMsSUFBSSxLQUFLOztlQUViOzs7SUFFSixNQUFDLHFCQUFRLE1BQUssUUFBTzs7OztRQUVqQjs0QkFFZ0IsS0FBQyxLQUFLLEtBQUssT0FBTzs7O1lBQTdCO1lBQUU7WUFBRTtpQkFDZ0I7O2dCQUFyQixJQUFJLE1BQU0sRUFBRSxFQUFFOzs7ZUFFbEI7OztJQUlKLE1BQUMsbUJBQU0sTUFBSyxRQUFPOzs7O1FBRWYsUUFBUSxNQUFNLGVBQUssS0FBSywwQkFBTztRQUMvQixnQkFBWSxxQkFBTSxLQUFLLDJCQUFRO1FBQy9COzRCQUVXOzs7WUFBUDtrQkFDeUIsS0FBSyxJQUFJOztnQkFBbEMsS0FBSyxJQUFJOztZQUNULEtBQUssSUFBSSxJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUk7O1FBRWxDO1FBQ0EsSUFBTztRQUNQLE9BQU87dUJBRUgsSUFBSyxvQkFBVSxLQUFLLElBQUkscUNBQVQsS0FBSyxJQUFJLHdCQUFULEtBQUssSUFBSTs7Z0JBRWY7O2dCQUFUOztZQUVBLElBQVEsS0FBSyxJQUFJLElBQUU7WUFDbkIsa0JBQVEsS0FBSzsyQkFFVCxJQUFLLFNBQUkseUJBQUEsWUFBQTs7Z0JBQ1QsUUFBUSxLQUFDLFVBQVUsaUJBQU8sS0FBSyxJQUFFOztpQ0FFdEI7OztnQkFBVjtnQkFBRztvQkFFUSxLQUFLLEtBQUs7O29CQUF0Qjs7Z0JBRUEsSUFBSztnQkFDTCxLQUFLO3VCQUVDLElBQUksU0FBUyxNQUFPLElBQUksTUFBTTs7d0JBRTdCLE1BQU0sT0FBTTs7d0JBQ1gsS0FBSzt3QkFDTDs7b0JBRUosSUFBSSxNQUFNLEVBQUUsRUFBRSxNQUFNLEdBQUc7b0JBQ3ZCLEtBQUs7b0JBQ0wsS0FBSzs7Z0JBRVQsSUFBSSxNQUFNLEVBQUUsRUFBRSxLQUFLO29CQUVoQjs7b0JBQ0MsS0FBSzs7eUJBQ0QsS0FBSyxNQUFNOztvQkFDZixPQUFPO29CQUNQOzs7O2VBRVo7OztJQUVKLE1BQUMsd0JBQVcsR0FBRTs7OztRQUVWOzRCQUVlOzs7WUFBVjtZQUFHO2lDQUNXOzs7Z0JBQVY7Z0JBQUc7Z0JBQ0osYUFBUyxHQUFHO2dCQUNaLGFBQVMsR0FBRztvQkFDUSxLQUFLOztvQkFBekIsSUFBSSxNQUFNLEdBQUc7Ozs7ZUFFckIsSUFBSSxlQUFNLEdBQUU7O21CQUFNLEVBQUUsS0FBSyxFQUFFOzs7O0lBRS9CLE1BQUMsb0JBQU87Ozs7UUFFSjtlQUNNLElBQUksU0FBUzs7WUFDZixJQUFJLEtBQUs7O2VBQ2IsSUFBSSxLQUFLOzs7SUFFYixNQUFDLHFCQUFROzs7O1FBRUw7NEJBQ1c7OztZQUFQO1lBQ0EsSUFBSSxLQUFLOztlQUNiOzs7V0FwSVA7OztlQXNJTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/fill.kode
