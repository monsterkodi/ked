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

    fill["bands"] = function (conf, region, rect)
    {
        var b, k, out, rng, rows, scale, spans, x1, x2, y, _60_37_, _72_28_, _75_52_

        scale = _k_.max(1,parseInt(((_60_37_=conf.scale) != null ? _60_37_ : 1)))
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
        for (var _b_ = b = 0, _c_ = Math.floor(rect.h / scale); (_b_ <= _c_ ? b < Math.floor(rect.h / scale) : b > Math.floor(rect.h / scale)); (_b_ <= _c_ ? ++b : --b))
        {
            y = rect.y + b * scale
            spans = ((_72_28_=rows[y]) != null ? _72_28_ : [])
            for (var _d_ = k = 1, _e_ = scale; (_d_ <= _e_ ? k < scale : k > scale); (_d_ <= _e_ ? ++k : --k))
            {
                spans = this.intersect(spans,(((_75_52_=rows[y + k]) != null ? _75_52_ : [])))
            }
            var list1 = _k_.list(spans)
            for (var _f_ = 0; _f_ < list1.length; _f_++)
            {
                x1 = list1[_f_][0]
                x2 = list1[_f_][1]
                if (x2 - x1 >= scale)
                {
                    out.push([y,x1,x2])
                }
            }
        }
        return out
    }

    fill["flow"] = function (conf, region, rect)
    {
        var cells, i, nl, out, scale, wrap, x, x1, x2, y, _84_37_, _85_37_

        cells = Array.from(((_84_37_=conf.text) != null ? _84_37_ : ''))
        scale = _k_.max(1,parseInt(((_85_37_=conf.scale) != null ? _85_37_ : 1)))
        out = []
        i = 0
        wrap = false
        var list = _k_.list(this.bands(conf,region,rect))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            y = list[_a_][0]
            x1 = list[_a_][1]
            x2 = list[_a_][2]
            if (wrap)
            {
                out.push([x1,y,null,i])
                break
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
                if (x + scale <= x2)
                {
                    break
                }
                wrap = true
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvcG9wby9maWxsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsUUFBRDs7Ozs7SUFFSSxNQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLE1BQU0sY0FBSyxLQUFLLDRCQUFVO3NCQUNQOzttQkFBekIsS0FBQyxPQUFPOztRQUVWLElBQUksTUFBTTtRQUNWOzRCQUVXOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSixNQUFNOzJCQUNGLElBQUssU0FBSSx5QkFBQSxZQUFBOztnQkFDVCxPQUFPLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLOztZQUUxQyxJQUFJLEtBQUs7O2VBRWI7OztJQUVKLE1BQUMsbUJBQU0sTUFBSzs7OztzQkFFTTs7OztRQUVkLEtBQVEsT0FBTyxjQUFLOzttQkFBUSxJQUFJOztRQUNoQzs0QkFFZ0IsS0FBQyxLQUFLLEtBQUssUUFBUSxVQUFNLElBQUksVUFBTSxjQUFRLE1BQUk7OztZQUExRDtZQUFFO1lBQUU7aUJBQ3NCOztnQkFBM0IsU0FBUyxLQUFLLE9BQU87OztRQUV6Qjs2QkFFVzs7O1lBQVA7WUFDQSxNQUFNOzJCQUNGLElBQUssSUFBSSxVQUFLLElBQUksc0JBQUosSUFBSSxTQUFKLElBQUk7O2dCQUNsQixpQkFBTyxTQUFTLEtBQUssSUFBSSwyQkFBUTs7WUFDckMsSUFBSSxLQUFLOztlQUViOzs7SUFFSixNQUFDLHFCQUFRLE1BQUssUUFBTzs7OztRQUVqQjs0QkFFZ0IsS0FBQyxLQUFLLEtBQUssT0FBTzs7O1lBQTdCO1lBQUU7WUFBRTtpQkFDZ0I7O2dCQUFyQixJQUFJLE1BQU0sRUFBRSxFQUFFOzs7ZUFFbEI7OztJQUlKLE1BQUMsb0JBQU8sTUFBSyxRQUFPOzs7O1FBRWhCLGdCQUFZLHFCQUFNLEtBQUssMkJBQVE7UUFDL0I7NEJBRVc7OztZQUFQO2tCQUN5QixLQUFLLElBQUk7O2dCQUFsQyxLQUFLLElBQUk7O1lBQ1QsS0FBSyxJQUFJLElBQUksTUFBTSxJQUFJLEdBQUcsSUFBSTs7UUFFbEM7dUJBRUksSUFBSyxvQkFBVSxLQUFLLElBQUkscUNBQVQsS0FBSyxJQUFJLHdCQUFULEtBQUssSUFBSTs7WUFFeEIsSUFBUSxLQUFLLElBQUksSUFBRTtZQUNuQixrQkFBUSxLQUFLOzJCQUVULElBQUssU0FBSSx5QkFBQSxZQUFBOztnQkFDVCxRQUFRLEtBQUMsVUFBVSxpQkFBTyxLQUFLLElBQUU7O2lDQUV0Qjs7O2dCQUFWO2dCQUFHO29CQUNrQixLQUFLLE1BQU07O29CQUFqQyxJQUFJLE1BQU0sRUFBRSxHQUFHOzs7O2VBRXZCOzs7SUFFSixNQUFDLG1CQUFNLE1BQUssUUFBTzs7OztRQUVmLFFBQVEsTUFBTSxlQUFLLEtBQUssMEJBQU87UUFDL0IsZ0JBQVkscUJBQU0sS0FBSywyQkFBUTtRQUMvQjtRQUNBLElBQVE7UUFDUixPQUFROzRCQUVTLEtBQUMsTUFBTSxLQUFLLE9BQU87OztZQUEvQjtZQUFFO1lBQUc7Z0JBRUg7O2dCQUNDLElBQUksTUFBTSxHQUFHLEVBQUUsS0FBSztnQkFDcEI7O1lBRUosSUFBSztZQUNMLEtBQUs7bUJBRUMsSUFBSSxTQUFTLE1BQU8sSUFBSSxNQUFNOztvQkFFN0IsTUFBTSxPQUFNOztvQkFDWCxLQUFLO29CQUNMOztnQkFFSixJQUFJLE1BQU0sRUFBRSxFQUFFLE1BQU0sR0FBRztnQkFDdkIsS0FBSztnQkFDTCxLQUFLOztZQUVULElBQUksTUFBTSxFQUFFLEVBQUUsS0FBSztnQkFFaEI7O2dCQUNDLEtBQUs7O3FCQUNELEtBQUssTUFBTTs7b0JBQ04sSUFBSSxTQUFTOztvQkFBdEI7O2dCQUNBLE9BQU87OztlQUVmOzs7SUFFSixNQUFDLHdCQUFXLEdBQUU7Ozs7UUFFVjs0QkFFZTs7O1lBQVY7WUFBRztpQ0FDVzs7O2dCQUFWO2dCQUFHO2dCQUNKLGFBQVMsR0FBRztnQkFDWixhQUFTLEdBQUc7b0JBQ1EsS0FBSzs7b0JBQXpCLElBQUksTUFBTSxHQUFHOzs7O2VBRXJCLElBQUksZUFBTSxHQUFFOzttQkFBTSxFQUFFLEtBQUssRUFBRTs7OztJQUUvQixNQUFDLG9CQUFPOzs7O1FBRUo7ZUFDTSxJQUFJLFNBQVM7O1lBQ2YsSUFBSSxLQUFLOztlQUNiLElBQUksS0FBSzs7O0lBRWIsTUFBQyxxQkFBUTs7OztRQUVMOzRCQUNXOzs7WUFBUDtZQUNBLElBQUksS0FBSzs7ZUFDYjs7O1dBOUlQOzs7ZUFnSk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/fill.kode
