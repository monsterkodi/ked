var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var addFlags, BG_COLOR, CLOSE, collect, DIGIT, digits, escape, FG_BG_COLOR, FG_COLOR, fromString, hex4, HI, isMark, isTag, LEN, LINE_SCALE, LO, MAGIC, MAX, payloadTotal, plainOf, SCALE, splitTags, STYLE, sue, TAG, tagOf, textOf

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

isMark = function (value)
{
    return _k_.in(value[0],[LINE_SCALE,SCALE,CLOSE])
}
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
            return [values[1],values[0]]
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
            add.push({x:rng[0],y:rng[1],value:[STYLE,w,h].concat(values)})
        }
        next = keep.concat(styles)
        return next.concat(add)
    }

    sue["runsForLine"] = function (areas, lines, y)
    {
        var area, code, data, mark, marks, open, runs, scale, width, _276_26_, _286_38_, _290_48_, _295_48_

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
        width = (((_276_26_=lines[y]) != null ? _276_26_ : [])).length
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
            data = this.dataOf(((_286_38_=mark.value) != null ? _286_38_ : []))
            if (!_k_.empty(data[0]) && data[0] !== SCALE)
            {
                continue
            }
            if (!(open != null))
            {
                continue
            }
            scale = _k_.clamp(1,7,parseInt(((_290_48_=open.value[3]) != null ? _290_48_ : 2)))
            if (mark.x > open.x && scale > 1)
            {
                runs.push([open.x,mark.x,scale])
            }
            open = null
        }
        if ((open != null))
        {
            scale = _k_.clamp(1,7,parseInt(((_295_48_=open.value[3]) != null ? _295_48_ : 2)))
            if (width > open.x && scale > 1)
            {
                runs.push([open.x,width,scale])
            }
        }
        return runs
    }

    sue["cellPositionsForLine"] = function (lines, y, runs)
    {
        var cell, cells, cw, gi, line, ri, scale, _305_25_

        line = ((_305_25_=lines[y]) != null ? _305_25_ : [])
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

    sue["dataOf"] = function (value)
    {
        return value.slice(3)
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
        var areas, span, _368_31_, _371_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_368_31_=colors.fg) != null ? _368_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[FG_COLOR,(span[2] - span[0]),1,span[3]]})
        }
        var list1 = _k_.list((((_371_31_=colors.bg) != null ? _371_31_ : [])))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            areas.push({x:span[0],y:span[1],value:[BG_COLOR,(span[2] - span[0]),1,span[3]]})
        }
        return areas
    }

    sue["adjust"] = function (areas, oldLines, newLines)
    {
        var adj, area, map, newLine, ny, oldLine, result, x, _387_39_, _388_35_

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
            oldLine = ((_387_39_=oldLines[area.y]) != null ? _387_39_ : [])
            newLine = ((_388_35_=newLines[ny]) != null ? _388_35_ : [])
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
        var cols, h, line, open, value, w, _419_24_, _422_33_

        value = area.value
        if (!(_k_.isArr(value)))
        {
            return null
        }
        if (value.length < 3)
        {
            return null
        }
        if (!(_k_.isNum(value[1])))
        {
            return null
        }
        if (isMark(value))
        {
            return null
        }
        cols = value[1]
        h = ((_419_24_=value[2]) != null ? _419_24_ : 1)
        if (cols < 0)
        {
            line = ((_422_33_=lines[area.y]) != null ? _422_33_ : [])
            w = _k_.max(0,(line.length - area.x))
            open = true
        }
        else
        {
            w = cols
            open = false
        }
        return {x:area.x,y:area.y,w:w,h:h,values:this.dataOf(value),open:open}
    }

    sue["areaWithBoxGeometry"] = function (area, box)
    {
        var cols

        cols = (box.open ? -1 : box.w)
        return {x:box.x,y:box.y,value:[area.value[0],cols,box.h].concat(box.values)}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvc3VlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O09BQ2IsaUJBQUE7OztBQStCTixxQkFBWSxNQUFLOzs7O0lBRWIsUUFBQSxlQUFBLE9BQVE7SUFDUixPQUFBLGNBQUEsTUFBUTt3QkFFRSxNQUFNLEtBQUs7OztRQUFqQjthQUNrQixLQUFLLFNBQVM7O1lBQWhDLFFBQVE7OztXQUVaOztBQU1KLFdBQWM7QUFDZCxXQUFjO0FBQ2QsY0FBYztBQUNkLFFBQWM7QUFDZCxhQUFjO0FBQ2QsUUFBYztBQUNkLFFBQWM7O0FBS2QsbUJBQVU7O2tCQUNOLE1BQU0sSUFBTyxXQUFXLE1BQU07O0FBRWxDLE1BQVE7QUFDUixRQUFRO0FBQ1IsUUFBUTtBQUNSLEtBQVE7QUFDUixLQUFRO0FBQ1IsTUFBUTtBQUNSLE1BQVE7O0FBRVIsa0JBQVM7Ozs7SUFDTCxLQUFLLEdBQUcsWUFBWTtXQUNwQixNQUFNLE1BQU8sTUFBTTs7O0FBRXZCLGtCQUFTOztXQUFPLE9BQU8sY0FBYyxNQUFNLEdBQUcsWUFBWTs7O0FBRTFELG9CQUFXOztXQUFPLE9BQU8sY0FBYyxHQUFHLFlBQVksS0FBSzs7O0FBRTNELG1CQUFVOzs7O0lBQ04sTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sUUFBUTs7V0FDbkI7OztBQUVKLHVCQUFjOzs7O0lBQ1YsTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sTUFBTTs7V0FDakI7OztBQUVKLGlCQUFROzs7O0lBQ0osSUFBSSxFQUFFLFNBQVM7V0FDVCxFQUFFLFNBQVM7O1FBQ2IsSUFBSSxNQUFNOztXQUNkOzs7QUFLSixtQkFBVTs7OztJQUNOLE1BQU07bUJBQ0YsSUFBSyxTQUFJLEtBQUssMEJBQUwsS0FBSyxhQUFMLEtBQUs7O1FBQ2QsSUFBSSxLQUFLLFdBQVc7WUFDakIsSUFBSSxRQUFTLElB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/sue.kode
