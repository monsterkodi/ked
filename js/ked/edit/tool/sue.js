var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var addFlags, BG_COLOR, CLOSE, collect, DIGIT, digits, escape, FG_BG_COLOR, FG_COLOR, fromString, hex4, HI, insertionIndex, isMark, isTag, LEN, LINE_SCALE, LO, MAGIC, MAX, payloadTotal, plainOf, SCALE, splitTags, STYLE, sue, TAG, tagOf, textOf

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

insertionIndex = function (oldLine, newLine)
{
    var newLen, oldLen, p, s

    oldLen = oldLine.length
    newLen = newLine.length
    if (newLen <= oldLen)
    {
        return -1
    }
    p = 0
    while (p < oldLen && oldLine[p] === newLine[p])
    {
        p += 1
    }
    s = 0
    while (s < oldLen - p && newLine[newLen - 1 - s] === oldLine[oldLen - 1 - s])
    {
        s += 1
    }
    if (oldLen - s !== p)
    {
        return -1
    }
    return p
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
            ;[f,u] = this.styleOfValues(box.values)
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
            ;[flags,ul] = this.styleFlagsAt(areas,lines,rng[0],rng[1])
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
        var area, code, data, mark, marks, open, runs, scale, width, _263_26_, _273_38_, _277_48_, _282_48_

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
        width = (((_263_26_=lines[y]) != null ? _263_26_ : [])).length
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
            data = this.dataOf(((_273_38_=mark.value) != null ? _273_38_ : []))
            if (!_k_.empty(data[0]) && data[0] !== SCALE)
            {
                continue
            }
            if (!(open != null))
            {
                continue
            }
            scale = _k_.clamp(1,7,parseInt(((_277_48_=open.value[3]) != null ? _277_48_ : 2)))
            if (mark.x > open.x && scale > 1)
            {
                runs.push([open.x,mark.x,scale])
            }
            open = null
        }
        if ((open != null))
        {
            scale = _k_.clamp(1,7,parseInt(((_282_48_=open.value[3]) != null ? _282_48_ : 2)))
            if (width > open.x && scale > 1)
            {
                runs.push([open.x,width,scale])
            }
        }
        return runs
    }

    sue["cellPositionsForLine"] = function (lines, y, runs)
    {
        var cell, cells, cw, gi, line, ri, scale, _289_25_

        line = ((_289_25_=lines[y]) != null ? _289_25_ : [])
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
            return
        }
        total = payloadTotal(arr,0)
        if (total === 0 || total !== arr.length)
        {
            return
        }
        try
        {
            return JSON.parse(textOf(arr.slice(1 + LEN, typeof total === 'number' ? total : -1)))
        }
        catch (err)
        {
            return
        }
    }

    sue["adjust"] = function (areas, oldLines, newLines)
    {
        var adj, area, map, newLine, ny, oldLine, result, x, _349_39_, _350_35_

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
            oldLine = ((_349_39_=oldLines[area.y]) != null ? _349_39_ : [])
            newLine = ((_350_35_=newLines[ny]) != null ? _350_35_ : [])
            x = area.x
            if (!(_k_.eql(oldLine, newLine)))
            {
                if (area.value[0] === SCALE && insertionIndex(oldLine,newLine) === area.x)
                {
                    result.push({x:x,y:ny,value:area.value})
                    continue
                }
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
        var cols, h, line, open, value, w, _376_24_, _379_33_

        value = area.value
        if (!(_k_.isArr(value)))
        {
            return
        }
        if (value.length < 3)
        {
            return
        }
        if (!(_k_.isNum(value[1])))
        {
            return
        }
        if (isMark(value))
        {
            return
        }
        cols = value[1]
        h = ((_376_24_=value[2]) != null ? _376_24_ : 1)
        if (cols < 0)
        {
            line = ((_379_33_=lines[area.y]) != null ? _379_33_ : [])
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

    sue["boxMinusRange"] = function (box, rng)
    {
        var mh, my1, my2, parts, rx1, rx2, ry1, ry2, x1, x2, y1, y2

        ;[rx1,ry1,rx2,ry2] = rng
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

    sue["areaWithBoxGeometry"] = function (area, box)
    {
        var cols

        cols = (box.open ? -1 : box.w)
        return {x:box.x,y:box.y,value:[area.value[0],cols,box.h].concat(box.values)}
    }

    sue["areasWithoutLineScales"] = function (areas, indices)
    {
        var area, keep

        keep = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (_k_.in(area.y,indices) && area.value[0] === sue.LINE_SCALE)
            {
                continue
            }
            keep.push(area)
        }
        return keep
    }

    sue["areasForColors"] = function (colors)
    {
        var areas, span, _466_31_, _469_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_466_31_=colors.fg) != null ? _466_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[FG_COLOR,(span[2] - span[0]),1,span[3]]})
        }
        var list1 = _k_.list((((_469_31_=colors.bg) != null ? _469_31_ : [])))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            areas.push({x:span[0],y:span[1],value:[BG_COLOR,(span[2] - span[0]),1,span[3]]})
        }
        return areas
    }

    sue["areasWithRun"] = function (areas, y, x1, x2, scale)
    {
        var close, open

        open = {x:x1,y:y,value:[sue.SCALE,-1,1,scale]}
        close = {x:x2,y:y,value:[sue.CLOSE,-1,1,sue.SCALE]}
        return areas.concat([open,close])
    }

    sue["areasWithRunScale"] = function (areas, y, x1, scale)
    {
        var area, out

        out = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === y && area.x === x1 && area.value[0] === sue.SCALE)
            {
                out.push({x:area.x,y:area.y,value:[sue.SCALE,-1,1,scale]})
            }
            else
            {
                out.push(area)
            }
        }
        return out
    }

    sue["areasWithoutRun"] = function (areas, y, x1, x2)
    {
        var area, data, out

        out = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === y && area.x === x1 && area.value[0] === sue.SCALE)
            {
                continue
            }
            if (area.y === y && area.x === x2 && area.value[0] === sue.CLOSE)
            {
                data = sue.dataOf(area.value)
                if (_k_.empty(data) || data[0] === sue.SCALE)
                {
                    continue
                }
            }
            out.push(area)
        }
        return out
    }

    sue["areasWithSteppedRunsInLines"] = function (areas, pieces, delta, lines)
    {
        var piece, r, run, scale, x1, x2, y

        var list = _k_.list(pieces)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            piece = list[_a_]
            ;[x1,y,x2] = piece
            if (x1 >= x2)
            {
                continue
            }
            run = null
            var list1 = _k_.list(sue.runsForLine(areas,lines,y))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                r = list1[_b_]
                if (r[0] <= x1 && x2 <= r[1])
                {
                    run = r
                    break
                }
            }
            if ((run != null))
            {
                scale = _k_.clamp(1,7,(run[2] + delta))
                if (scale <= 1)
                {
                    areas = sue.areasWithoutRun(areas,y,run[0],run[1])
                }
                else
                {
                    areas = sue.areasWithRunScale(areas,y,run[0],scale)
                }
            }
            else if (delta > 0)
            {
                scale = _k_.clamp(1,7,(1 + delta))
                if (scale > 1)
                {
                    areas = sue.areasWithRun(areas,y,x1,x2,scale)
                }
            }
        }
        return areas
    }

    sue["areasWithSteppedLineScales"] = function (areas, indices, delta, lineHeight)
    {
        var i, keep, scales, y

        if (_k_.empty(indices))
        {
            return areas
        }
        scales = []
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            y = list[_a_]
            scales.push(_k_.clamp(1,7,(lineHeight(y) + delta)))
        }
        keep = sue.areasWithoutLineScales(areas,indices)
        var list1 = _k_.list(indices)
        for (i = 0; i < list1.length; i++)
        {
            y = list1[i]
            if (scales[i] > 1)
            {
                keep.push({x:0,y:y,value:[sue.LINE_SCALE,-1,1,scales[i]]})
            }
        }
        return keep
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
                ;[visible,tags] = splitTags(seg)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvc3VlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O09BQ2IsaUJBQUE7OztBQStCTixxQkFBWSxNQUFLOzs7O0lBRWIsUUFBQSxlQUFBLE9BQVE7SUFDUixPQUFBLGNBQUEsTUFBUTt3QkFFRSxNQUFNLEtBQUs7OztRQUFqQjthQUNrQixLQUFLLFNBQVM7O1lBQWhDLFFBQVE7OztXQUVaOztBQUVKLFdBQWM7QUFDZCxXQUFjO0FBQ2QsY0FBYztBQUNkLFFBQWM7QUFDZCxhQUFjO0FBQ2QsUUFBYztBQUNkLFFBQWM7O0FBRWQsbUJBQVU7O2tCQUFVLE1BQU0sSUFBTyxXQUFXLE1BQU07O0FBRWxELE1BQVE7QUFDUixRQUFRO0FBQ1IsUUFBUTtBQUNSLEtBQVE7QUFDUixLQUFRO0FBQ1IsTUFBUTtBQUNSLE1BQVE7O0FBRVIsa0JBQVM7Ozs7SUFDTCxLQUFLLEdBQUcsWUFBWTtXQUNwQixNQUFNLE1BQU8sTUFBTTs7O0FBRXZCLGtCQUFTOztXQUFPLE9BQU8sY0FBYyxNQUFNLEdBQUcsWUFBWTs7O0FBRTFELG9CQUFXOztXQUFPLE9BQU8sY0FBYyxHQUFHLFlBQVksS0FBSzs7O0FBRTNELG1CQUFVOzs7O0lBQ04sTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sUUFBUTs7V0FDbkI7OztBQUVKLHVCQUFjOzs7O0lBQ1YsTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sTUFBTTs7V0FDakI7OztBQUVKLGlCQUFROzs7O0lBQ0osSUFBSSxFQUFFLFNBQVM7V0FDVCxFQUFFLFNBQVM7O1FBQ2IsSUFBSSxNQUFNOztXQUNkOzs7QUFFSixtQkFBVTs7OztJQUNOLE1BQU07bUJBQ0YsSUFBSyxTQUFJLEtBQUssMEJBQUwsS0FBSyxhQUFMLEtBQUs7O1FBQ2QsSUFBSSxLQUFLLFdBQVc7WUFDakIsSUFBSSxRQUFTLElB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
//# sourceURL=../../../../kode/ked/edit/tool/sue.kode
