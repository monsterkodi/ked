var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var addFlags, BG_COLOR, CLOSE, collect, DIGIT, digits, escape, FG_BG_COLOR, FG_COLOR, fromString, hex4, HI, isTag, LEN, LINE_SCALE, LO, MAGIC, MAX, payloadTotal, plainOf, SCALE, splitTags, STYLE, sue, TAG, tagOf, textOf

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import colorspans from "./colorspans.js"


addFlags = function (have, add)
{
    var ch

    have = (have != null ? have : '')
    add = (add != null ? add : '')
    var list = _k_.list(Array.from(add))
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        ch = list[_a_]
        if (!have.includes(ch))
        {
            have += ch
        }
    }
    return have
}
FG_COLOR = 31
BG_COLOR = 32
FG_BG_COLOR = 33
STYLE = 34
LINE_SCALE = 40
SCALE = 41
CLOSE = 99
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
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        ch = list[_b_]
        out += plainOf(ch)
    }
    return out
}

fromString = function (text)
{
    var ch, out

    out = ''
    var list = _k_.list(Array.from(text))
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        ch = list[_c_]
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
    for (var _d_ = i = 0, _e_ = body.length; (_d_ <= _e_ ? i < body.length : i > body.length); (_d_ <= _e_ ? ++i : --i))
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
    for (var _f_ = k = 0, _10_ = LEN; (_f_ <= _10_ ? k < LEN : k > LEN); (_f_ <= _10_ ? ++k : --k))
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
    for (var _11_ = k = 1, _12_ = LEN; (_11_ <= _12_ ? k <= LEN : k >= LEN); (_11_ <= _12_ ? ++k : --k))
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

    sue["FG_COLOR"] = FG_COLOR
    sue["BG_COLOR"] = BG_COLOR
    sue["FG_BG_COLOR"] = FG_BG_COLOR
    sue["STYLE"] = STYLE
    sue["LINE_SCALE"] = LINE_SCALE
    sue["SCALE"] = SCALE
    sue["CLOSE"] = CLOSE
    sue["addFlags"] = function (have, add)
    {
        return addFlags(have,add)
    }

    sue["styleOfValues"] = function (values)
    {
        values = (values != null ? values : [])
        if (values.length > 1)
        {
            return [values[0],values[1]]
        }
        else
        {
            return [values[0],null]
        }
    }

    sue["styleFlagsAt"] = function (areas, lines, x, y)
    {
        var area, box, f, flags, u, ul

        flags = ''
        ul = null
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.value[0] !== STYLE)
            {
                continue
            }
            box = this.boxForAreaAndLines(area,lines)
            if (!(box != null))
            {
                continue
            }
            if (y < box.y || y >= box.y + box.h)
            {
                continue
            }
            if (x < box.x || x >= box.x + box.w)
            {
                continue
            }
            var _b_ = this.styleOfValues(box.values); f = _b_[0]; u = _b_[1]

            flags = addFlags(flags,f)
            if ((u != null))
            {
                ul = u
            }
        }
        return [flags,ul]
    }

    sue["rangesWithToggledFlag"] = function (ranges, areas, lines, flag)
    {
        var add, area, flags, h, keep, next, rng, styles, ul, values, w

        styles = []
        keep = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.value[0] === STYLE)
            {
                styles.push(area)
            }
            else
            {
                keep.push(area)
            }
        }
        styles = this.rangesCutFromAreasInLines(ranges,styles,lines)
        add = []
        var list1 = _k_.list(ranges)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            rng = list1[_b_]
            var _c_ = this.styleFlagsAt(areas,lines,rng[0],rng[1]); flags = _c_[0]; ul = _c_[1]

            if (flags.includes(flag))
            {
                flags = flags.replace(flag,'')
            }
            else
            {
                flags += flag
            }
            if (_k_.empty(flags))
            {
                continue
            }
            w = _k_.max(1,(rng[2] - rng[0]))
            h = rng[3] - rng[1] + 1
            values = [flags]
            if ((ul != null))
            {
                values = [ul,flags]
            }
            add.push({x:rng[0],y:rng[1],value:[STYLE,values.concat([w,h])]})
        }
        next = keep.concat(styles)
        return next.concat(add)
    }

    sue["runsForLine"] = function (areas, lines, y)
    {
        var area, code, data, mark, marks, open, runs, scale, width, _265_26_, _275_33_, _279_49_, _279_58_, _284_49_, _284_58_

        if (y < 0 || y >= lines.length)
        {
            return []
        }
        marks = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y !== y)
            {
                continue
            }
            code = area.value[0]
            if (code !== SCALE && code !== CLOSE)
            {
                continue
            }
            marks.push(area)
        }
        if (_k_.empty(marks))
        {
            return []
        }
        marks.sort(function (a, b)
        {
            return a.x - b.x
        })
        width = (((_265_26_=lines[y]) != null ? _265_26_ : [])).length
        runs = []
        open = null
        var list1 = _k_.list(marks)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            mark = list1[_b_]
            if (mark.value[0] === SCALE)
            {
                if (!(open != null))
                {
                    open = mark
                }
                continue
            }
            data = ((_275_33_=mark.value[1]) != null ? _275_33_ : [])
            if (!_k_.empty(data[0]) && data[0] !== SCALE)
            {
                continue
            }
            if (!(open != null))
            {
                continue
            }
            scale = _k_.clamp(1,7,parseInt(((_279_58_=(((_279_49_=open.value[1]) != null ? _279_49_ : []))[0]) != null ? _279_58_ : 2)))
            if (mark.x > open.x && scale > 1)
            {
                runs.push([open.x,mark.x,scale])
            }
            open = null
        }
        if ((open != null))
        {
            scale = _k_.clamp(1,7,parseInt(((_284_58_=(((_284_49_=open.value[1]) != null ? _284_49_ : []))[0]) != null ? _284_58_ : 2)))
            if (width > open.x && scale > 1)
            {
                runs.push([open.x,width,scale])
            }
        }
        return runs
    }

    sue["cellPositionsForLine"] = function (lines, y, runs)
    {
        var cell, cells, cw, gi, line, ri, scale, _294_25_

        line = ((_294_25_=lines[y]) != null ? _294_25_ : [])
        cells = [0]
        cell = 0
        scale = 1
        ri = 0
        for (var _a_ = gi = 0, _b_ = line.length; (_a_ <= _b_ ? gi < line.length : gi > line.length); (_a_ <= _b_ ? ++gi : --gi))
        {
            if (ri < runs.length && gi === runs[ri][0])
            {
                scale = runs[ri][2]
            }
            cw = kseg.segWidth(line[gi])
            cw = _k_.max(1,cw)
            cell += cw * scale
            cells.push(cell)
            if (ri < runs.length && gi + 1 === runs[ri][1])
            {
                scale = 1
                ri += 1
            }
        }
        return cells
    }

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

    sue["areasForColors"] = function (colors)
    {
        var areas, span, _352_31_, _355_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_352_31_=colors.fg) != null ? _352_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[FG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        var list1 = _k_.list((((_355_31_=colors.bg) != null ? _355_31_ : [])))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            areas.push({x:span[0],y:span[1],value:[BG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        return areas
    }

    sue["adjust"] = function (areas, oldLines, newLines)
    {
        var adj, area, map, newLine, ny, oldLine, result, x, _371_39_, _372_35_

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
            oldLine = ((_371_39_=oldLines[area.y]) != null ? _371_39_ : [])
            newLine = ((_372_35_=newLines[ny]) != null ? _372_35_ : [])
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
        var data, h, line, n, open, w, _396_29_, _405_22_, _408_33_

        data = ((_396_29_=area.value[1]) != null ? _396_29_ : [])
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
        h = ((_405_22_=data[n + 1]) != null ? _405_22_ : 1)
        if (!!_k_.empty(w))
        {
            line = ((_408_33_=lines[area.y]) != null ? _408_33_ : [])
            w = _k_.max(0,(line.length - area.x))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvc3VlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O09BQ2IsaUJBQUE7OztBQTZCTixxQkFBWSxNQUFLOzs7O0lBRWIsUUFBQSxlQUFBLE9BQVE7SUFDUixPQUFBLGNBQUEsTUFBUTt3QkFFRSxNQUFNLEtBQUs7OztRQUFqQjthQUNrQixLQUFLLFNBQVM7O1lBQWhDLFFBQVE7OztXQUVaOztBQUtKLFdBQWM7QUFDZCxXQUFjO0FBQ2QsY0FBYztBQUNkLFFBQWM7QUFDZCxhQUFjO0FBQ2QsUUFBYztBQUNkLFFBQWM7QUFFZCxNQUFRO0FBQ1IsUUFBUTtBQUNSLFFBQVE7QUFDUixLQUFRO0FBQ1IsS0FBUTtBQUNSLE1BQVE7QUFDUixNQUFROztBQUVSLGtCQUFTOzs7O0lBQ0wsS0FBSyxHQUFHLFlBQVk7V0FDcEIsTUFBTSxNQUFPLE1BQU07OztBQUV2QixrQkFBUzs7V0FBTyxPQUFPLGNBQWMsTUFBTSxHQUFHLFlBQVk7OztBQUUxRCxvQkFBVzs7V0FBTyxPQUFPLGNBQWMsR0FBRyxZQUFZLEtBQUs7OztBQUUzRCxtQkFBVTs7OztJQUNOLE1BQU07d0JBQ0ksTUFBTSxLQUFLOzs7UUFBakI7UUFDQSxPQUFPLFFBQVE7O1dBQ25COzs7QUFFSix1QkFBYzs7OztJQUNWLE1BQU07d0JBQ0ksTUFBTSxLQUFLOzs7UUFBakI7UUFDQSxPQUFPLE1BQU07O1dBQ2pCOzs7QUFFSixpQkFBUTs7OztJQUNKLElBQUksRUFBRSxTQUFTO1dBQ1QsRUFBRSxTQUFTOztRQUNiLElBQUksTUFBTTs7V0FDZDs7O0FBS0osbUJBQVU7Ozs7SUFDTixNQUFNO21CQUNGLElBQUssU0FBSSxLQUFLLDBCQUFMLEtBQUssYUFBTCxLQUFLOztRQUNkLElBQUksS0FBSyxXQUFXO1lBQ2pCLElBQUksUUFBUyxJQUFJOztZQUNoQixPQUFPLEtBQUs7Ozs7WUFFWixPQUFPLFFBQVEsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/sue.kode
