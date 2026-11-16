var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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

    sue["boxForAreaAndLines"] = function (area, lines)
    {
        var data, h, line, n, open, w, _194_29_, _203_22_, _206_33_

        data = ((_194_29_=area.value[1]) != null ? _194_29_ : [])
        n = 0
        while (n < data.length && !(_k_.isNum(data[n])) && data[n] !== null)
        {
            n += 1
        }
        if (n === 0 && !_k_.empty(data))
        {
            return null
        }
        w = data[n]
        h = ((_203_22_=data[n + 1]) != null ? _203_22_ : 1)
        if (!!_k_.empty(w))
        {
            line = ((_206_33_=lines[area.y]) != null ? _206_33_ : [])
            w = _k_.max(0,(kseg.width(line) - area.x))
            open = true
        }
        else
        {
            open = false
        }
        return {x:area.x,y:area.y,w:w,h:h,values:data.slice(0, typeof n === 'number' ? n : -1),open:open}
    }

    sue["areaWithBoxGeometry"] = function (area, box)
    {
        var w

        w = (box.open ? null : box.w)
        return {x:box.x,y:box.y,value:[area.value[0],box.values.concat([w,box.h])]}
    }

    sue["boxMinusRange"] = function (box, rng)
    {
        var mh, my1, my2, parts, rx1, rx2, ry1, ry2, x1, x2, y1, y2

        var _a_ = rng; rx1 = _a_[0]; ry1 = _a_[1]; rx2 = _a_[2]; ry2 = _a_[3]

        x1 = box.x
        x2 = box.x + box.w
        y1 = box.y
        y2 = box.y + box.h - 1
        if (rx2 <= x1 || rx1 >= x2 || ry2 < y1 || ry1 > y2)
        {
            return [box]
        }
        parts = []
        if (ry1 > y1)
        {
            parts.push({x:x1,y:y1,w:box.w,h:ry1 - y1,values:box.values,open:box.open})
        }
        if (ry2 < y2)
        {
            parts.push({x:x1,y:ry2 + 1,w:box.w,h:y2 - ry2,values:box.values,open:box.open})
        }
        my1 = _k_.max(y1,ry1)
        my2 = _k_.min(y2,ry2)
        if (my2 >= my1)
        {
            mh = my2 - my1 + 1
            if (rx1 > x1)
            {
                parts.push({x:x1,y:my1,w:rx1 - x1,h:mh,values:box.values,open:false})
            }
            if (rx2 < x2)
            {
                parts.push({x:rx2,y:my1,w:x2 - rx2,h:mh,values:box.values,open:box.open})
            }
        }
        return parts
    }

    sue["rangesCutFromAreasInLines"] = function (ranges, areas, lines)
    {
        var area, box, next, part, parts, result, rng

        result = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            box = this.boxForAreaAndLines(area,lines)
            if (!(box != null))
            {
                result.push(area)
                continue
            }
            parts = [box]
            var list1 = _k_.list(ranges)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                rng = list1[_b_]
                next = []
                var list2 = _k_.list(parts)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    part = list2[_c_]
                    next = next.concat(this.boxMinusRange(part,rng))
                }
                parts = next
                if (_k_.empty(parts))
                {
                    break
                }
            }
            var list3 = _k_.list(parts)
            for (var _d_ = 0; _d_ < list3.length; _d_++)
            {
                part = list3[_d_]
                result.push(this.areaWithBoxGeometry(area,part))
            }
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
