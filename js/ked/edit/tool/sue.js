var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var collect, DIGIT, digits, escape, fromString, hex4, HI, isTag, LEN, LO, MAGIC, MAX, payloadTotal, plainOf, splitTags, sue, TAG, tagOf, textOf

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

TAG = 0xE0000
MAGIC = 0x21
DIGIT = 0x30
LO = 0xE0021
HI = 0xE007E
LEN = 4
MAX = 9999

isTag = function (ch)
{
    var cp

    cp = ch.codePointAt(0)
    return LO <= cp && cp <= HI
}

tagOf = function (ch)
{
    return String.fromCodePoint(TAG + ch.codePointAt(0))
}

plainOf = function (ch)
{
    return String.fromCodePoint(ch.codePointAt(0) - TAG)
}

textOf = function (symbols)
{
    var ch, out

    out = ''
    var list = _k_.list(Array.from(symbols))
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        ch = list[_a_]
        out += plainOf(ch)
    }
    return out
}

fromString = function (text)
{
    var ch, out

    out = ''
    var list = _k_.list(Array.from(text))
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        ch = list[_b_]
        out += tagOf(ch)
    }
    return out
}

hex4 = function (n)
{
    var s

    s = n.toString(16)
    while (s.length < 4)
    {
        s = '0' + s
    }
    return s
}

escape = function (body)
{
    var c, i, out

    out = ''
    for (var _c_ = i = 0, _d_ = body.length; (_c_ <= _d_ ? i < body.length : i > body.length); (_c_ <= _d_ ? ++i : --i))
    {
        c = body.charCodeAt(i)
        if (c > 0x20 && c < 0x7F)
        {
            out += body[i]
        }
        else
        {
            out += '\\u' + hex4(c)
        }
    }
    return out
}

digits = function (n)
{
    var k, out

    n = _k_.clamp(0,MAX,n)
    out = ''
    for (var _e_ = k = 0, _f_ = LEN; (_e_ <= _f_ ? k < LEN : k > LEN); (_e_ <= _f_ ? ++k : --k))
    {
        out = String.fromCharCode(DIGIT + n % 10) + out
        n = Math.floor(n / 10)
    }
    return out
}

payloadTotal = function (arr, i)
{
    var d, k, n

    if (i + 1 + LEN > arr.length)
    {
        return 0
    }
    if (arr[i].codePointAt(0) - TAG !== MAGIC)
    {
        return 0
    }
    n = 0
    for (var _10_ = k = 1, _11_ = LEN; (_10_ <= _11_ ? k <= LEN : k >= LEN); (_10_ <= _11_ ? ++k : --k))
    {
        d = arr[i + k].codePointAt(0) - TAG - DIGIT
        if (d < 0 || d > 9)
        {
            return 0
        }
        n = n * 10 + d
    }
    return 1 + LEN + n
}

splitTags = function (seg)
{
    var cps, i

    cps = Array.from(seg)
    i = cps.length
    while (i > 0 && isTag(cps[i - 1]))
    {
        i -= 1
    }
    return [cps.slice(0, typeof i === 'number' ? i : -1).join(''),cps.slice(i, typeof cps.length === 'number' ? cps.length : -1).join('')]
}

collect = function (pending, y, x, areas)
{
    var arr, body, i, total, value

    arr = Array.from(pending)
    i = 0
    while (i < arr.length)
    {
        total = payloadTotal(arr,i)
        if (total === 0)
        {
            i += 1
            continue
        }
        if (i + total > arr.length)
        {
            break
        }
        body = textOf(arr.slice(i + 1 + LEN, i + total))
        value = null
        try
        {
            value = JSON.parse(body)
        }
        catch (err)
        {
            value = null
        }
        if (value !== null)
        {
            areas.push({x:x,y:y,value:value})
        }
        i += total
    }
}

sue = (function ()
{
    function sue ()
    {}

    sue["sueAscii"] = function (symbols)
    {
        var ch, out

        out = ''
        var list = _k_.list(Array.from(symbols))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ch = list[_a_]
            if (isTag(ch))
            {
                out += plainOf(ch)
            }
            else
            {
                out += ch
            }
        }
        return out
    }

    sue["sueEncode"] = function (value)
    {
        var body

        body = escape(JSON.stringify(value))
        return fromString('!' + digits(body.length) + body)
    }

    sue["sueDecode"] = function (symbols)
    {
        var arr, total

        arr = Array.from(symbols)
        if (_k_.empty(arr))
        {
            return null
        }
        total = payloadTotal(arr,0)
        if (total === 0 || total !== arr.length)
        {
            return null
        }
        try
        {
            return JSON.parse(textOf(arr.slice(1 + LEN, typeof total === 'number' ? total : -1)))
        }
        catch (err)
        {
            return null
        }
    }

    sue["desue"] = function (text)
    {
        var areas, clean, line, lines, pending, seg, tags, visible, y

        lines = text.split('\n')
        clean = []
        areas = []
        for (var _a_ = y = 0, _b_ = lines.length; (_a_ <= _b_ ? y < lines.length : y > lines.length); (_a_ <= _b_ ? ++y : --y))
        {
            line = []
            pending = ''
            var list = _k_.list(kseg(lines[y]))
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                seg = list[_c_]
                var _d_ = splitTags(seg); visible = _d_[0]; tags = _d_[1]

                if (!_k_.empty(visible))
                {
                    if (!_k_.empty(pending))
                    {
                        collect(pending,y,line.length,areas)
                    }
                    pending = ''
                    line.push(visible)
                }
                pending += tags
            }
            if (!_k_.empty(pending))
            {
                collect(pending,y,line.length,areas)
            }
            clean.push(line.join(''))
        }
        return {text:clean.join('\n'),sue:areas}
    }

    sue["ensue"] = function (text, sue)
    {
        var area, i, lines, mine, out, segs, x, y

        if (_k_.empty(sue))
        {
            return text
        }
        lines = text.split('\n')
        for (var _a_ = y = 0, _b_ = lines.length; (_a_ <= _b_ ? y < lines.length : y > lines.length); (_a_ <= _b_ ? ++y : --y))
        {
            mine = []
            var list = _k_.list(sue)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                area = list[_c_]
                if (area.y === y)
                {
                    mine.push(area)
                }
            }
            if (_k_.empty(mine))
            {
                continue
            }
            mine.sort(function (a, b)
            {
                return a.x - b.x
            })
            segs = kseg(lines[y])
            out = ''
            i = 0
            for (var _d_ = x = 0, _e_ = segs.length; (_d_ <= _e_ ? x <= segs.length : x >= segs.length); (_d_ <= _e_ ? ++x : --x))
            {
                while (i < mine.length && mine[i].x <= x)
                {
                    out += this.sueEncode(mine[i].value)
                    i += 1
                }
                if (x < segs.length)
                {
                    out += segs[x]
                }
            }
            while (i < mine.length)
            {
                out += this.sueEncode(mine[i].value)
                i += 1
            }
            lines[y] = out
        }
        return lines.join('\n')
    }

    return sue
})()

export default sue;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvc3VlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O0FBMEJuQixNQUFRO0FBQ1IsUUFBUTtBQUNSLFFBQVE7QUFDUixLQUFRO0FBQ1IsS0FBUTtBQUNSLE1BQVE7QUFDUixNQUFROztBQUVSLGtCQUFTOzs7O0lBQ0wsS0FBSyxHQUFHLFlBQVk7V0FDcEIsTUFBTSxNQUFPLE1BQU07OztBQUV2QixrQkFBUzs7V0FBTyxPQUFPLGNBQWMsTUFBTSxHQUFHLFlBQVk7OztBQUUxRCxvQkFBVzs7V0FBTyxPQUFPLGNBQWMsR0FBRyxZQUFZLEtBQUs7OztBQUUzRCxtQkFBVTs7OztJQUNOLE1BQU07d0JBQ0ksTUFBTSxLQUFLOzs7UUFBakI7UUFDQSxPQUFPLFFBQVE7O1dBQ25COzs7QUFFSix1QkFBYzs7OztJQUNWLE1BQU07d0JBQ0ksTUFBTSxLQUFLOzs7UUFBakI7UUFDQSxPQUFPLE1BQU07O1dBQ2pCOzs7QUFFSixpQkFBUTs7OztJQUNKLElBQUksRUFBRSxTQUFTO1dBQ1QsRUFBRSxTQUFTOztRQUNiLElBQUksTUFBTTs7V0FDZDs7O0FBS0osbUJBQVU7Ozs7SUFDTixNQUFNO21CQUNGLElBQUssU0FBSSxLQUFLLDBCQUFMLEtBQUssYUFBTCxLQUFLOztRQUNkLElBQUksS0FBSyxXQUFXO1lBQ2pCLElBQUksUUFBUyxJQUFJOztZQUNoQixPQUFPLEtBQUs7Ozs7WUFFWixPQUFPLFFBQVEsS0FBSzs7O1dBQzVCOzs7QUFFSixtQkFBVTs7OztJQUNOLGNBQVUsRUFBRSxJQUFJO0lBQ2hCLE1BQU07bUJBQ0YsSUFBSyxTQUFJLHVCQUFBLFVBQUE7O1FBQ1QsTUFBTSxPQUFPLGFBQWEsUUFBUSxJQUFJLE1BQU07UUFDNUMsZUFBVSxJQUFJOztXQUNsQjs7O0FBS0oseUJBQWdCLEtBQUk7Ozs7UUFDVCxJQUFJLElBQUksTUFBTSxJQUFJOztlQUF2Qjs7UUFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/sue.kode
