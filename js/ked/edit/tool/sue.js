var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isFunc: function (o) {return typeof o === 'function'}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var addFlags, BG_COLOR, CLOSE, collect, DIGIT, digits, escape, FG_BG_COLOR, FG_COLOR, fromString, hex4, HI, insertionIndex, isMark, isTag, LEN, LINE_SCALE, LO, MAGIC, MAX, payloadTotal, plainOf, SCALE, splitTags, STYLE, sue, TAG, tagOf, textOf, WRAP, wrapLineIndex

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
WRAP = 42
CLOSE = 99

isMark = function (value)
{
    return _k_.in(value[0],[LINE_SCALE,SCALE,WRAP,CLOSE])
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
    for (i = 0; i < body.length; i++)
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
    for (k = 0; k < LEN; k++)
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
    for (k = 1; k <= LEN; k++)
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

wrapLineIndex = function (map, y, oldLines, newLines)
{
    var newLen, ny, oldLen, pre, suf

    ny = map[y]
    if ((ny != null) && ny >= 0)
    {
        return ny
    }
    oldLen = oldLines.length
    newLen = newLines.length
    pre = 0
    while (pre < oldLen && pre < newLen && _k_.eql(oldLines[pre], newLines[pre]))
    {
        pre += 1
    }
    suf = 0
    while (suf < oldLen - pre && suf < newLen - pre && _k_.eql(oldLines[oldLen - 1 - suf], newLines[newLen - 1 - suf]))
    {
        suf += 1
    }
    if (pre <= y && y < newLen - suf)
    {
        return y
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
    sue["WRAP"] = WRAP
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
        var area, code, data, mark, marks, open, runs, scale, width, _286_26_, _296_38_, _300_48_, _305_48_

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
        width = (((_286_26_=lines[y]) != null ? _286_26_ : [])).length
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
            data = this.dataOf(((_296_38_=mark.value) != null ? _296_38_ : []))
            if (!_k_.empty(data[0]) && data[0] !== SCALE)
            {
                continue
            }
            if (!(open != null))
            {
                continue
            }
            scale = _k_.clamp(1,7,parseInt(((_300_48_=open.value[3]) != null ? _300_48_ : 2)))
            if (mark.x > open.x && scale > 1)
            {
                runs.push([open.x,mark.x,scale])
            }
            open = null
        }
        if ((open != null))
        {
            scale = _k_.clamp(1,7,parseInt(((_305_48_=open.value[3]) != null ? _305_48_ : 2)))
            if (width > open.x && scale > 1)
            {
                runs.push([open.x,width,scale])
            }
        }
        return runs
    }

    sue["cellPositionsForLine"] = function (lines, y, runs)
    {
        var cell, cells, cw, gi, line, ri, scale, _312_25_

        line = ((_312_25_=lines[y]) != null ? _312_25_ : [])
        cells = [0]
        cell = 0
        scale = 1
        ri = 0
        for (gi = 0; gi < line.length; gi++)
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
        var adj, area, map, newLine, ny, oldLine, result, x, _377_39_, _378_35_

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
            if (area.value[0] === WRAP)
            {
                ny = wrapLineIndex(map,area.y,oldLines,newLines)
                if ((ny != null))
                {
                    result.push({x:0,y:ny,value:area.value})
                }
                continue
            }
            ny = map[area.y]
            if (!!_k_.empty(ny) || ny < 0)
            {
                continue
            }
            oldLine = ((_377_39_=oldLines[area.y]) != null ? _377_39_ : [])
            newLine = ((_378_35_=newLines[ny]) != null ? _378_35_ : [])
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
        var cols, h, line, open, value, w, _404_24_, _407_33_

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
        h = ((_404_24_=value[2]) != null ? _404_24_ : 1)
        if (cols < 0)
        {
            line = ((_407_33_=lines[area.y]) != null ? _407_33_ : [])
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
        var areas, span, _494_31_, _497_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_494_31_=colors.fg) != null ? _494_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[FG_COLOR,(span[2] - span[0]),1,span[3]]})
        }
        var list1 = _k_.list((((_497_31_=colors.bg) != null ? _497_31_ : [])))
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

    sue["isWrapLine"] = function (areas, y)
    {
        var area

        var list = _k_.list(((areas != null ? areas : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === y && area.value[0] === WRAP)
            {
                return true
            }
        }
        return false
    }

    sue["areasWithWraps"] = function (areas, indices, wrap)
    {
        var area, keep, y

        keep = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (_k_.in(area.y,indices) && area.value[0] === WRAP)
            {
                continue
            }
            keep.push(area)
        }
        if (wrap)
        {
            var list1 = _k_.list(indices)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                y = list1[_b_]
                keep.push({x:0,y:y,value:[WRAP,-1,1]})
            }
        }
        return keep
    }

    sue["wrapStarts"] = function (line, cols, word, indent = 0)
    {
        var brk, cw, gi, i, limit, rowWidth, start, starts, width

        rowWidth = (_k_.isFunc(cols) ? cols : function (k)
        {
            return (k === 0 ? cols : _k_.max(1,cols - indent))
        })
        starts = [0]
        width = 0
        brk = -1
        limit = rowWidth(0)
        for (gi = 0; gi < line.length; gi++)
        {
            cw = _k_.max(1,kseg.segWidth(line[gi]))
            if (width + cw > limit && gi > starts.slice(-1)[0])
            {
                limit = rowWidth(starts.length)
                start = gi
                if (word && brk > starts.slice(-1)[0])
                {
                    start = brk
                }
                width = 0
                for (i = start; i < gi; i++)
                {
                    width += _k_.max(1,kseg.segWidth(line[i]))
                }
                if (width + cw > limit && gi > start)
                {
                    start = gi
                    width = 0
                }
                starts.push(start)
                brk = -1
            }
            width += cw
            if (word && _k_.in(line[gi],[' ','\t']))
            {
                brk = gi + 1
            }
        }
        return starts
    }

    sue["wrapIndent"] = function (line, cols, clss, md)
    {
        var gi, i, indent, n

        gi = this.skipBlanks(line,0)
        if (clss)
        {
            while (true)
            {
                n = this.markerLength(line,gi,clss,md)
                if (n === 0)
                {
                    break
                }
                gi = this.skipBlanks(line,gi + n)
            }
        }
        indent = 0
        for (i = 0; i < gi; i++)
        {
            indent += _k_.max(1,kseg.segWidth(line[i]))
        }
        if (!(cols != null))
        {
            return indent
        }
        return _k_.min(indent,parseInt(cols / 2))
    }

    sue["skipBlanks"] = function (line, gi)
    {
        while (gi < line.length && _k_.in(line[gi],[' ','\t']))
        {
            gi += 1
        }
        return gi
    }

    sue["markerLength"] = function (line, gi, clss, md)
    {
        var c, n, words, _676_21_, _695_53_

        if (gi >= line.length)
        {
            return 0
        }
        c = ((_676_21_=clss(gi)) != null ? _676_21_ : '')
        words = c.split(' ')
        if (_k_.in('punct',words) && words.some(function (w)
            {
                return w === 'comment' || /^(li|h)\d$/.test(w)
            }))
        {
            n = 1
            while (gi + n < line.length && clss(gi + n) === c)
            {
                n += 1
            }
            return n
        }
        if (_k_.in('comment',words) && line[gi] === '*')
        {
            return 1
        }
        if (!md)
        {
            return 0
        }
        if (line[gi] === '>' && _k_.in('punct',words))
        {
            return 1
        }
        if (_k_.in(line[gi],['-','*','+']) && line[gi + 1] === ' ')
        {
            return 1
        }
        if (line[gi] === '[' && _k_.in(line[gi + 1],[' ','x','X']) && line[gi + 2] === ']')
        {
            return 3
        }
        if (_k_.in('number',words))
        {
            n = 1
            while (gi + n < line.length && (((_695_53_=clss(gi + n)) != null ? _695_53_ : '')).split(' ').includes('number'))
            {
                n += 1
            }
            if (_k_.in(line[gi + n],['.',')']) && line[gi + n + 1] === ' ')
            {
                return n + 1
            }
        }
        return 0
    }

    sue["desue"] = function (text)
    {
        var areas, clean, line, lines, pending, seg, tags, visible, y

        lines = text.split('\n')
        clean = []
        areas = []
        for (y = 0; y < lines.length; y++)
        {
            line = []
            pending = ''
            var list = _k_.list(kseg(lines[y]))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                seg = list[_a_]
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
        for (y = 0; y < lines.length; y++)
        {
            mine = []
            var list = _k_.list(sue)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                area = list[_a_]
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
            for (x = 0; x <= segs.length; x++)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvc3VlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O09BQ2IsaUJBQUE7OztBQStCTixxQkFBWSxNQUFLOzs7O0lBRWIsUUFBQSxlQUFBLE9BQVE7SUFDUixPQUFBLGNBQUEsTUFBUTt3QkFFRSxNQUFNLEtBQUs7OztRQUFqQjthQUNrQixLQUFLLFNBQVM7O1lBQWhDLFFBQVE7OztXQUVaOztBQUVKLFdBQWM7QUFDZCxXQUFjO0FBQ2QsY0FBYztBQUNkLFFBQWM7QUFDZCxhQUFjO0FBQ2QsUUFBYztBQUNkLE9BQWM7QUFDZCxRQUFjOztBQUVkLG1CQUFVOztrQkFBVSxNQUFNLElBQU8sV0FBVyxNQUFNLEtBQUs7O0FBRXZELE1BQVE7QUFDUixRQUFRO0FBQ1IsUUFBUTtBQUNSLEtBQVE7QUFDUixLQUFRO0FBQ1IsTUFBUTtBQUNSLE1BQVE7O0FBRVIsa0JBQVM7Ozs7SUFDTCxLQUFLLEdBQUcsWUFBWTtXQUNwQixNQUFNLE1BQU8sTUFBTTs7O0FBRXZCLGtCQUFTOztXQUFPLE9BQU8sY0FBYyxNQUFNLEdBQUcsWUFBWTs7O0FBRTFELG9CQUFXOztXQUFPLE9BQU8sY0FBYyxHQUFHLFlBQVksS0FBSzs7O0FBRTNELG1CQUFVOzs7O0lBQ04sTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sUUFBUTs7V0FDbkI7OztBQUVKLHVCQUFjOzs7O0lBQ1YsTUFBTTt3QkFDSSxNQUFNLEtBQUs7OztRQUFqQjtRQUNBLE9BQU8sTUFBTTs7V0FDakI7OztBQUVKLGlCQUFROzs7O0lBQ0osSUFBSSxFQUFFLFNBQVM7V0FDVCxFQUFFLFNBQVM7O1FBQ2IsSUFBSSxNQUFNOztXQUNkOzs7QUFFSixtQkFBVTs7OztJQUNOLE1BQU07U0FDRixJQUFLLE9BQUksS0FBSzs7UUFDZCxJQUFJLEtBQUssV0FBVztZQUNqQixJQUFJLFFBQVMsSUFBSTs7WUFD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
//# sourceURL=../../../../kode/ked/edit/tool/sue.kode
