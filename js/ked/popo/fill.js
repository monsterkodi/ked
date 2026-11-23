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
            for (i = 0; i < width; i++)
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
            for (x = rng[0]; x < rng[2]; x++)
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
        for (b = 0; b < Math.floor(rect.h / scale); b++)
        {
            y = rect.y + b * scale
            spans = ((_72_28_=rows[y]) != null ? _72_28_ : [])
            for (k = 1; k < scale; k++)
            {
                spans = this.intersect(spans,(((_75_52_=rows[y + k]) != null ? _75_52_ : [])))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvcG9wby9maWxsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsUUFBRDs7Ozs7SUFFSSxNQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLE1BQU0sY0FBSyxLQUFLLDRCQUFVO3NCQUNQOzttQkFBekIsS0FBQyxPQUFPOztRQUVWLElBQUksTUFBTTtRQUNWOzRCQUVXOzs7WUFBUDtZQUVBLFFBQVEsSUFBSSxLQUFLLElBQUk7Z0JBRWxCLFNBQVM7O2dCQUNSLElBQUksS0FBSztnQkFDVDs7WUFFSixNQUFNO2lCQUNGLElBQUssT0FBSTs7Z0JBQ1QsT0FBTyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksS0FBSzs7WUFFMUMsSUFBSSxLQUFLOztlQUViOzs7SUFFSixNQUFDLG1CQUFNLE1BQUs7Ozs7c0JBRU07Ozs7UUFFZCxLQUFRLE9BQU8sY0FBSzs7bUJBQVEsSUFBSTs7UUFDaEM7NEJBRWdCLEtBQUMsS0FBSyxLQUFLLFFBQVEsVUFBTSxJQUFJLFVBQU0sY0FBUSxNQUFJOzs7WUFBMUQ7WUFBRTtZQUFFO2lCQUNzQjs7Z0JBQTNCLFNBQVMsS0FBSyxPQUFPOzs7UUFFekI7NkJBRVc7OztZQUFQO1lBQ0EsTUFBTTtpQkFDRixJQUFLLElBQUksUUFBSyxJQUFJOztnQkFDbEIsaUJBQU8sU0FBUyxLQUFLLElBQUksMkJBQVE7O1lBQ3JDLElBQUksS0FBSzs7ZUFFYjs7O0lBRUosTUFBQyxxQkFBUSxNQUFLLFFBQU87Ozs7UUFFakI7NEJBRWdCLEtBQUMsS0FBSyxLQUFLLE9BQU87OztZQUE3QjtZQUFFO1lBQUU7aUJBQ2dCOztnQkFBckIsSUFBSSxNQUFNLEVBQUUsRUFBRTs7O2VBRWxCOzs7SUFJSixNQUFDLG9CQUFPLE1BQUssUUFBTzs7OztRQUVoQixnQkFBWSxxQkFBTSxLQUFLLDJCQUFRO1FBQy9COzRCQUVXOzs7WUFBUDtrQkFDeUIsS0FBSyxJQUFJOztnQkFBbEMsS0FBSyxJQUFJOztZQUNULEtBQUssSUFBSSxJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUk7O1FBRWxDO2FBRUksSUFBSyxrQkFBVSxLQUFLLElBQUk7O1lBRXhCLElBQVEsS0FBSyxJQUFJLElBQUU7WUFDbkIsa0JBQVEsS0FBSztpQkFFVCxJQUFLLE9BQUk7O2dCQUNULFFBQVEsS0FBQyxVQUFVLGlCQUFPLEtBQUssSUFBRTs7aUNBRXRCOzs7Z0JBQVY7Z0JBQUc7b0JBQ2tCLEtBQUssTUFBTTs7b0JBQWpDLElBQUksTUFBTSxFQUFFLEdBQUc7Ozs7ZUFFdkI7OztJQUVKLE1BQUMsbUJBQU0sTUFBSyxRQUFPOzs7O1FBRWYsUUFBUSxNQUFNLGVBQUssS0FBSywwQkFBTztRQUMvQixnQkFBWSxxQkFBTSxLQUFLLDJCQUFRO1FBQy9CO1FBQ0EsSUFBUTtRQUNSLE9BQVE7NEJBRVMsS0FBQyxNQUFNLEtBQUssT0FBTzs7O1lBQS9CO1lBQUU7WUFBRztnQkFFSDs7Z0JBQ0MsSUFBSSxNQUFNLEdBQUcsRUFBRSxLQUFLO2dCQUNwQjs7WUFFSixJQUFLO1lBQ0wsS0FBSzttQkFFQyxJQUFJLFNBQVMsTUFBTyxJQUFJLE1BQU07O29CQUU3QixNQUFNLE9BQU07O29CQUNYLEtBQUs7b0JBQ0w7O2dCQUVKLElBQUksTUFBTSxFQUFFLEVBQUUsTUFBTSxHQUFHO2dCQUN2QixLQUFLO2dCQUNMLEtBQUs7O1lBRVQsSUFBSSxNQUFNLEVBQUUsRUFBRSxLQUFLO2dCQUVoQjs7Z0JBQ0MsS0FBSzs7cUJBQ0QsS0FBSyxNQUFNOztvQkFDTixJQUFJLFNBQVM7O29CQUF0Qjs7Z0JBQ0EsT0FBTzs7O2VBRWY7OztJQUVKLE1BQUMsd0JBQVcsR0FBRTs7OztRQUVWOzRCQUVlOzs7WUFBVjtZQUFHO2lDQUNXOzs7Z0JBQVY7Z0JBQUc7Z0JBQ0osYUFBUyxHQUFHO2dCQUNaLGFBQVMsR0FBRztvQkFDUSxLQUFLOztvQkFBekIsSUFBSSxNQUFNLEdBQUc7Ozs7ZUFFckIsSUFBSSxlQUFNLEdBQUU7O21CQUFNLEVBQUUsS0FBSyxFQUFFOzs7O0lBRS9CLE1BQUMsb0JBQU87Ozs7UUFFSjtlQUNNLElBQUksU0FBUzs7WUFDZixJQUFJLEtBQUs7O2VBQ2IsSUFBSSxLQUFLOzs7SUFFYixNQUFDLHFCQUFROzs7O1FBRUw7NEJBQ1c7OztZQUFQO1lBQ0EsSUFBSSxLQUFLOztlQUNiOzs7V0E5SVA7OztlQWdKTSJ9
//# sourceURL=../../../kode/ked/popo/fill.kode
