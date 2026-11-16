var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var collect, DIGIT, digits, escape, fromString, hex4, HI, isTag, LEN, LO, MAGIC, MAX, payloadTotal, plainOf, splitTags, sue, TAG, tagOf, textOf

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import colorspans from "./colorspans.js"

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

    sue["adjust"] = function (areas, oldLines, newLines)
    {
        var adj, area, map, newLine, ny, oldLine, result, x, _169_39_, _170_35_

        if (_k_.empty(areas))
        {
            return areas
        }
        map = colorspans.lineMap(oldLines,newLines)
        result = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            ny = map[area.y]
            if (!!_k_.empty(ny) || ny < 0)
            {
                continue
            }
            oldLine = ((_169_39_=oldLines[area.y]) != null ? _169_39_ : [])
            newLine = ((_170_35_=newLines[ny]) != null ? _170_35_ : [])
            x = area.x
            if (!(_k_.eql(oldLine, newLine)))
            {
                adj = colorspans.adjustSegment([area.x,area.y,area.x + 1,area],oldLine,newLine)
                if (!(adj != null))
                {
                    continue
                }
                x = adj[0]
            }
            result.push({x:x,y:ny,value:area.value})
        }
        return result
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvc3VlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O09BQ2IsaUJBQUE7O0FBMEJOLE1BQVE7QUFDUixRQUFRO0FBQ1IsUUFBUTtBQUNSLEtBQVE7QUFDUixLQUFRO0FBQ1IsTUFBUTtBQUNSLE1BQVE7O0FBRVIsa0JBQVM7Ozs7SUFDTCxLQUFLLEdBQUcsWUFBWTtXQUNwQixNQUFNLE1BQU8sTUFBTTs7O0FBRXZCLGtCQUFTOztXQUFPLE9BQU8sY0FBYyxNQUFNLEdBQUcsWUFBWTs7O0FBRTFELG9CQUFXOztXQUFPLE9BQU8sY0FBYyxHQUFHLFlBQVksS0FBSzs7O0FBRTNELG1CQUFVOzs7O0lBQ04sTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sUUFBUTs7V0FDbkI7OztBQUVKLHVCQUFjOzs7O0lBQ1YsTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sTUFBTTs7V0FDakI7OztBQUVKLGlCQUFROzs7O0lBQ0osSUFBSSxFQUFFLFNBQVM7V0FDVCxFQUFFLFNBQVM7O1FBQ2IsSUFBSSxNQUFNOztXQUNkOzs7QUFLSixtQkFBVTs7OztJQUNOLE1BQU07bUJBQ0YsSUFBSyxTQUFJLEtBQUssMEJBQUwsS0FBSyxhQUFMLEtBQUs7O1FBQ2QsSUFBSSxLQUFLLFdBQVc7WUFDakIsSUFBSSxRQUFTLElBQUk7O1lBQ2hCLE9BQU8sS0FBSzs7OztZQUVaLE9BQU8sUUFBUSxLQUFLOzs7V0FDNUI7OztBQUVKLG1CQUFVOzs7O0lBQ04sY0FBVSxFQUFFLElBQUk7SUFDaEIsTUFBTTttQkFDRixJQUFLLFNBQUksdUJBQUEsVUFBQTs7UUFDVCxNQUFNLE9BQU8sYUFBYSxRQUFRLElBQUksTUFBTTtRQUM1QyxlQUFVLElBQUk7O1dBQ2xCOzs7QUFLSix5QkFBZ0IsS0FBSTs7OztRQUNULElBQUksSUFBSSxNQUFNLElBQUk7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/sue.kode
