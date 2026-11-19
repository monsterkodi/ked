var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var fill


fill = (function ()
{
    function fill ()
    {}

    fill["pattern"] = function (conf, region)
    {
        var cells, i, n, out, rng, row, width, _18_40_, _21_20_

        cells = Array.from(((_18_40_=conf.pattern) != null ? _18_40_ : ''))
        if (_k_.empty(cells))
        {
            return this.blanks(region)
        }
        if ((conf.type != null) && conf.type !== 'repeat')
        {
            throw new Error(`fill: pattern type ${conf.type} is not known`)
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
        var cells, i, k, lineY, out, rng, row, scale, width, y, _53_37_, _54_37_

        cells = Array.from(((_53_37_=conf.text) != null ? _53_37_ : ''))
        scale = _k_.max(1,parseInt(((_54_37_=conf.scale) != null ? _54_37_ : 1)))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvcG9wby9maWxsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsUUFBRDs7Ozs7SUFlSSxNQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLE1BQU0sZUFBSyxLQUFLLDZCQUFVO3NCQUNQOzttQkFBekIsS0FBQyxPQUFPOzthQUVQLEtBQUssaUJBQVUsS0FBSyxTQUFROztZQUMzQixVQUFVLDRCQUE0QixLQUFLOztRQUUvQyxJQUFNLE1BQU07UUFDWjs0QkFFVzs7O1lBQVA7WUFFQSxRQUFRLElBQUksS0FBSyxJQUFJO2dCQUVsQixTQUFTOztnQkFDUixJQUFJLEtBQUs7Z0JBQ1Q7O1lBRUosTUFBTTsyQkFDRixJQUFLLFNBQUkseUJBQUEsWUFBQTs7Z0JBQ1QsT0FBTyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksS0FBSzs7WUFFMUMsSUFBSSxLQUFLOztlQUViOzs7SUFVSixNQUFDLG1CQUFNLE1BQUs7Ozs7UUFFUixRQUFRLE1BQU0sZUFBSyxLQUFLLDBCQUFPO1FBQy9CLGdCQUFZLHFCQUFNLEtBQUssMkJBQVE7UUFDL0I7UUFDQSxJQUFRO1FBQ1IsUUFBUTs0QkFFRzs7O1lBQVA7WUFFQSxRQUFRLElBQUksS0FBSyxJQUFJO2dCQUVsQixTQUFTOztnQkFDUixJQUFJLEtBQUs7Z0JBQ1Q7O1lBRUosSUFBSSxJQUFJOzJCQUlDLFVBQVUsSUFBSSxTQUFVLElBQUksUUFBUTs7Z0JBQ3pDLElBQUksS0FBSyxLQUFDLE1BQU07Z0JBQ2hCOztZQUVKLFFBQVE7WUFDUjttQkFFTSxJQUFJLFNBQVMsU0FBUyxTQUFVLElBQUksTUFBTTs7b0JBRXpDLE1BQU0sT0FBTTs7b0JBQ1gsS0FBSztvQkFDTDs7Z0JBRUosSUFBSSxLQUFLLE1BQU07Z0JBQ2YsS0FBSzsrQkFFRCxJQUFLLFNBQUkseUJBQUEsWUFBQTs7b0JBQ1QsSUFBSSxLQUFLOzs7bUJBRVgsSUFBSSxTQUFTOztnQkFDZixJQUFJLEtBQUs7O1lBRWIsSUFBSSxLQUFLLElBQUksS0FBSzs7ZUFFdEI7OztJQUVKLE1BQUMsb0JBQU87Ozs7UUFFSjtlQUNNLElBQUksU0FBUzs7WUFDZixJQUFJLEtBQUs7O2VBQ2IsSUFBSSxLQUFLOzs7SUFFYixNQUFDLHFCQUFROzs7O1FBRUw7NEJBQ1c7OztZQUFQO1lBQ0EsSUFBSSxLQUFLOztlQUNiOzs7V0E1R1A7OztlQThHTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/fill.kode
