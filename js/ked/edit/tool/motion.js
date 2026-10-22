var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var motion

import kxk from "../../../kxk.js"
let kseg = kxk.kseg


motion = (function ()
{
    function motion ()
    {}

    motion["isLinewise"] = function (spec)
    {
        return _k_.in(spec.kind,['line','lineDown','lineUp'])
    }

    motion["mergeRanges"] = function (rngs)
    {
        var merged, overlaps, rng, sameLine, tail, touches

        if (_k_.empty(rngs))
        {
            return []
        }
        rngs.sort(function (a, b)
        {
            if (a[1] === b[1])
            {
                return a[0] - b[0]
            }
            else
            {
                return a[1] - b[1]
            }
        })
        merged = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (_k_.empty(merged))
            {
                merged.push(rng)
                continue
            }
            tail = merged.slice(-1)[0]
            sameLine = rng[1] === tail[3]
            overlaps = rng[1] < tail[3] || (sameLine && rng[0] < tail[2])
            touches = sameLine && rng[0] === tail[2]
            if (overlaps || touches)
            {
                if (rng[3] > tail[3] || (rng[3] === tail[3] && rng[2] > tail[2]))
                {
                    tail[2] = rng[2]
                    tail[3] = rng[3]
                }
            }
            else
            {
                merged.push(rng)
            }
        }
        return merged
    }

    motion["range"] = function (lines, pos, spec)
    {
        var count, x, y, _67_34_

        if (_k_.empty(lines))
        {
            return null
        }
        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,kseg.width(lines[y]),x)
        count = _k_.max(1,(((_67_34_=spec.count) != null ? _67_34_ : 1)))
        switch (spec.kind)
        {
            case 'char':
                return this.rangeForChars(lines,x,y,count)

            case 'charBack':
                return this.rangeForCharsBack(lines,x,y,count)

            case 'word':
                return this.rangeForWord(lines,x,y,count)

            case 'wordEnd':
                return this.rangeForWordEnd(lines,x,y,count)

            case 'wordBack':
                return this.rangeForWordBack(lines,x,y,count)

            case 'bol':
                return this.rangeForBol(lines,x,y)

            case 'eol':
                return this.rangeForEol(lines,x,y)

            case 'line':
                return this.rangeForLines(lines,y,y + count - 1)

            case 'lineDown':
                return this.rangeForLines(lines,y,y + count)

            case 'lineUp':
                return this.rangeForLines(lines,y - count,y)

            case 'textObject':
                return this.rangeForTextObject(lines,x,y,spec)

        }

    }

    motion["rangeForChars"] = function (lines, x, y, count)
    {
        var width

        width = kseg.width(lines[y])
        x = _k_.min(x,width)
        return [x,y,_k_.min(x + count,width),y]
    }

    motion["rangeForCharsBack"] = function (lines, x, y, count)
    {
        x = _k_.min(x,kseg.width(lines[y]))
        return [_k_.max(0,x - count),y,x,y]
    }

    motion["rangeForBol"] = function (lines, x, y)
    {
        return [0,y,_k_.min(x,kseg.width(lines[y])),y]
    }

    motion["rangeForEol"] = function (lines, x, y)
    {
        var width

        width = kseg.width(lines[y])
        return [_k_.min(x,width),y,width,y]
    }

    motion["rangeForLines"] = function (lines, startLine, endLine)
    {
        startLine = _k_.clamp(0,lines.length - 1,startLine)
        endLine = _k_.clamp(0,lines.length - 1,endLine)
        return [0,startLine,kseg.width(lines[endLine]),endLine]
    }

    motion["rangeForWord"] = function (lines, x, y, count)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordStartAfter(lines,pos,(n === count - 1))
        }
        if (pos[0] === 0 && pos[1] > y)
        {
            pos = [kseg.width(lines[pos[1] - 1]),pos[1] - 1]
        }
        return [x,y,pos[0],pos[1]]
    }

    motion["rangeForWordEnd"] = function (lines, x, y, count)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordEndAfter(lines,pos)
        }
        return [x,y,pos[0],pos[1]]
    }

    motion["rangeForWordBack"] = function (lines, x, y, count)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordStartBefore(lines,pos)
        }
        return [pos[0],pos[1],x,y]
    }

    motion["category"] = function (seg)
    {
        if (_k_.empty(seg))
        {
            return 'empty'
        }
        if (/\s+/.test(seg))
        {
            return 'ws'
        }
        if (/\w+/.test(seg))
        {
            return 'word'
        }
        return 'punct'
    }

    motion["widthAt"] = function (segs, i)
    {
        return kseg.widthAtSegi(segs,i)
    }

    motion["wordStartAfter"] = function (lines, pos, eol = false)
    {
        var cat, i, j, line, segs, x, y, yy

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        if (i < segs.length)
        {
            cat = this.category(segs[i])
            if (cat !== 'ws')
            {
                while (i < segs.length && this.category(segs[i]) === cat)
                {
                    i += 1
                }
            }
            while (i < segs.length && this.category(segs[i]) === 'ws')
            {
                i += 1
            }
            if (i < segs.length)
            {
                return [this.widthAt(segs,i),y]
            }
        }
        if (eol)
        {
            return [kseg.width(segs),y]
        }
        for (var _b_ = yy = (y + 1), _c_ = lines.length; (_b_ <= _c_ ? yy < lines.length : yy > lines.length); (_b_ <= _c_ ? ++yy : --yy))
        {
            line = lines[yy]
            j = 0
            while (j < line.length && this.category(line[j]) === 'ws')
            {
                j += 1
            }
            if (j < line.length)
            {
                return [this.widthAt(line,j),yy]
            }
        }
        return [kseg.width(segs),y]
    }

    motion["wordEndAfter"] = function (lines, pos)
    {
        var cat, i, j, segs, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        while (true)
        {
            if (i >= segs.length)
            {
                if (y + 1 >= lines.length)
                {
                    return [kseg.width(segs),y]
                }
                y += 1
                segs = lines[y]
                i = 0
                continue
            }
            cat = this.category(segs[i])
            if (cat === 'ws')
            {
                i += 1
                continue
            }
            j = i
            while (j + 1 < segs.length && this.category(segs[j + 1]) === cat)
            {
                j += 1
            }
            if (j > i)
            {
                return [this.widthAt(segs,j + 1),y]
            }
            i = j + 1
        }
    }

    motion["wordStartBefore"] = function (lines, pos)
    {
        var cat, i, segs, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        while (true)
        {
            if (i <= 0)
            {
                if (y <= 0)
                {
                    return [0,0]
                }
                y -= 1
                segs = lines[y]
                i = segs.length
                continue
            }
            i -= 1
            cat = this.category(segs[i])
            if (cat === 'ws')
            {
                continue
            }
            while (i > 0 && this.category(segs[i - 1]) === cat)
            {
                i -= 1
            }
            return [this.widthAt(segs,i),y]
        }
    }

    motion["objectX"] = function (lines, y, x)
    {
        var segs, width

        segs = lines[y]
        width = kseg.width(segs)
        if (width > 0 && x >= width)
        {
            return this.widthAt(segs,segs.length - 1)
        }
        return _k_.clamp(0,width,x)
    }

    motion["widthAtOrEnd"] = function (segs, i)
    {
        if (i >= segs.length)
        {
            return kseg.width(segs)
        }
        return this.widthAt(segs,i)
    }

    motion["isEscaped"] = function (segs, i)
    {
        var j, n

        n = 0
        j = i - 1
        while (j >= 0 && segs[j] === '\\')
        {
            n += 1
            j -= 1
        }
        return n % 2 === 1
    }

    motion["rangeForTextObject"] = function (lines, x, y, spec)
    {
        var area, count, _280_34_, _281_26_

        count = _k_.max(1,(((_280_34_=spec.count) != null ? _280_34_ : 1)))
        area = ((_281_26_=spec.area) != null ? _281_26_ : 'inner')
        x = this.objectX(lines,y,x)
        switch (spec.target)
        {
            case 'word':
                return this.rangeForWordObject(lines,x,y,count,(area === 'inner'))

            default:
                return this.rangeForPairObject(lines,x,y,spec.target,(area === 'inner'))
        }

    }

    motion["wordBoundsAt"] = function (segs, i)
    {
        var cat, e, s

        cat = this.category(segs[i])
        s = i
        e = i
        while (s > 0 && this.category(segs[s - 1]) === cat)
        {
            s -= 1
        }
        while (e + 1 < segs.length && this.category(segs[e + 1]) === cat)
        {
            e += 1
        }
        return [s,e + 1]
    }

    motion["trailingWsEnd"] = function (segs, i)
    {
        var e

        e = i
        while (e < segs.length && this.category(segs[e]) === 'ws')
        {
            e += 1
        }
        return e
    }

    motion["leadingWsStart"] = function (segs, i)
    {
        var s

        s = i
        while (s > 0 && this.category(segs[s - 1]) === 'ws')
        {
            s -= 1
        }
        return s
    }

    motion["nextWordAfterIndex"] = function (lines, y, i)
    {
        var e, s, segs

        while (true)
        {
            segs = lines[y]
            while (i < segs.length && this.category(segs[i]) === 'ws')
            {
                i += 1
            }
            if (i < segs.length)
            {
                var _a_ = this.wordBoundsAt(segs,i); s = _a_[0]; e = _a_[1]

                return [y,s,e]
            }
            if (y + 1 >= lines.length)
            {
                return null
            }
            y += 1
            i = 0
        }
    }

    motion["rangeForWordObject"] = function (lines, x, y, count, inner)
    {
        var e, i, next, s, segs, we, ws, wy

        segs = lines[y]
        if (_k_.empty(segs))
        {
            return
        }
        i = kseg.indexAtWidth(segs,x)
        if (i >= segs.length)
        {
            i = segs.length - 1
        }
        if (this.category(segs[i]) === 'ws')
        {
            if (inner)
            {
                s = this.leadingWsStart(segs,i)
                e = this.trailingWsEnd(segs,i)
                return [this.widthAt(segs,s),y,this.widthAtOrEnd(segs,e),y]
            }
            next = this.nextWordAfterIndex(lines,y,i)
            if (!next)
            {
                s = this.leadingWsStart(segs,i)
                e = this.trailingWsEnd(segs,i)
                return [this.widthAt(segs,s),y,this.widthAtOrEnd(segs,e),y]
            }
            var _a_ = next; wy = _a_[0]; ws = _a_[1]; we = _a_[2]

            return this.rangeForWords(lines,wy,ws,we,count,true)
        }
        var _b_ = this.wordBoundsAt(segs,i); s = _b_[0]; e = _b_[1]

        return this.rangeForWords(lines,y,s,e,count,(!inner))
    }

    motion["rangeForWords"] = function (lines, y, s, e, count, around)
    {
        var firstLine, firstSegs, firstStart, lastEnd, lastLine, lastSegs, lStart, n, ne, next, nl, ns, tEnd

        firstLine = y
        firstStart = s
        lastLine = y
        lastEnd = e
        for (var _a_ = n = 1, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            next = this.nextWordAfterIndex(lines,lastLine,lastEnd)
            if (!next)
            {
                break
            }
            var _c_ = next; nl = _c_[0]; ns = _c_[1]; ne = _c_[2]

            lastLine = nl
            lastEnd = ne
        }
        if (!around)
        {
            return [this.widthAt(lines[firstLine],firstStart),firstLine,this.widthAt(lines[lastLine],lastEnd),lastLine]
        }
        lastSegs = lines[lastLine]
        tEnd = this.trailingWsEnd(lastSegs,lastEnd)
        if (tEnd > lastEnd)
        {
            return [this.widthAt(lines[firstLine],firstStart),firstLine,this.widthAtOrEnd(lastSegs,tEnd),lastLine]
        }
        firstSegs = lines[firstLine]
        lStart = this.leadingWsStart(firstSegs,firstStart)
        return [this.widthAt(firstSegs,lStart),firstLine,this.widthAtOrEnd(lastSegs,lastEnd),lastLine]
    }

    motion["rangeForPairObject"] = function (lines, x, y, target, inner)
    {
        var close, closes, open, opens, _415_30_

        opens = {')':'(',']':'[','}':'{','b':'(','B':'{'}
        closes = {'(':')','[':']','{':'}'}
        open = ((_415_30_=opens[target]) != null ? _415_30_ : target)
        if (open === '"' || open === "'")
        {
            return this.rangeForQuoteObject(lines,x,y,open,inner)
        }
        close = closes[open]
        if (!close)
        {
            return null
        }
        return this.rangeForBracketObject(lines,x,y,open,close,inner)
    }

    motion["rangeForQuoteObject"] = function (lines, x, y, quote, inner)
    {
        var c, chosen, i, lStart, o, open, pair, pairs, seg, segs, tEnd, xi

        segs = lines[y]
        if (_k_.empty(segs))
        {
            return null
        }
        xi = kseg.indexAtWidth(segs,x)
        if (xi >= segs.length)
        {
            xi = segs.length - 1
        }
        pairs = []
        open = -1
        var list = _k_.list(segs)
        for (i = 0; i < list.length; i++)
        {
            seg = list[i]
            if (seg !== quote)
            {
                continue
            }
            if (this.isEscaped(segs,i))
            {
                continue
            }
            if (open < 0)
            {
                open = i
            }
            else
            {
                pairs.push([open,i])
                open = -1
            }
        }
        if (_k_.empty(pairs))
        {
            return null
        }
        chosen = null
        var list1 = _k_.list(pairs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            pair = list1[_b_]
            if (pair[0] <= xi && xi <= pair[1])
            {
                chosen = pair
                break
            }
        }
        if (!chosen)
        {
            var list2 = _k_.list(pairs)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                pair = list2[_c_]
                if (pair[0] > xi)
                {
                    chosen = pair
                    break
                }
            }
        }
        if (!chosen)
        {
            return null
        }
        var _d_ = chosen; o = _d_[0]; c = _d_[1]

        if (inner)
        {
            return [this.widthAt(segs,o + 1),y,this.widthAt(segs,c),y]
        }
        tEnd = this.trailingWsEnd(segs,c + 1)
        if (tEnd > c + 1)
        {
            return [this.widthAt(segs,o),y,this.widthAtOrEnd(segs,tEnd),y]
        }
        lStart = this.leadingWsStart(segs,o)
        return [this.widthAt(segs,lStart),y,this.widthAtOrEnd(segs,c + 1),y]
    }

    motion["flatChars"] = function (lines)
    {
        var chars, li, line, seg, w

        chars = []
        var list = _k_.list(lines)
        for (li = 0; li < list.length; li++)
        {
            line = list[li]
            w = 0
            var list1 = _k_.list(line)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                seg = list1[_b_]
                chars.push([seg,li,w])
                w += kseg.segWidth(seg)
            }
        }
        return chars
    }

    motion["flatIndexForPos"] = function (lines, x, y)
    {
        var i, li, segs, si

        i = 0
        for (var _a_ = li = 0, _b_ = y; (_a_ <= _b_ ? li < y : li > y); (_a_ <= _b_ ? ++li : --li))
        {
            i += lines[li].length
        }
        segs = lines[y]
        if (!_k_.empty(segs))
        {
            si = kseg.indexAtWidth(segs,x)
            i += _k_.min(si,segs.length - 1)
        }
        return i
    }

    motion["rangeForBracketObject"] = function (lines, x, y, open, close, inner)
    {
        var c, chars, ci, depth, ei, el, ew, ewEnd, i, oi, ol, ow, owEnd

        chars = this.flatChars(lines)
        if (_k_.empty(chars))
        {
            return null
        }
        ci = this.flatIndexForPos(lines,x,y)
        if (ci >= chars.length)
        {
            ci = chars.length - 1
        }
        if (ci < 0)
        {
            return null
        }
        oi = -1
        if (chars[ci][0] === open)
        {
            oi = ci
        }
        else
        {
            depth = 0
            i = ci
            if (chars[ci][0] === close)
            {
                i -= 1
            }
            while (i >= 0)
            {
                c = chars[i][0]
                if (c === close)
                {
                    depth += 1
                }
                else if (c === open)
                {
                    if (depth > 0)
                    {
                        depth -= 1
                    }
                    else
                    {
                        oi = i
                        break
                    }
                }
                i -= 1
            }
        }
        if (oi < 0)
        {
            i = ci
            while (i < chars.length)
            {
                if (chars[i][0] === open)
                {
                    oi = i
                    break
                }
                i += 1
            }
        }
        if (oi < 0)
        {
            return null
        }
        depth = 0
        ei = -1
        i = oi + 1
        while (i < chars.length)
        {
            c = chars[i][0]
            if (c === open)
            {
                depth += 1
            }
            else if (c === close)
            {
                if (depth === 0)
                {
                    ei = i
                    break
                }
                depth -= 1
            }
            i += 1
        }
        if (ei < 0)
        {
            return null
        }
        ol = chars[oi][1]
        ow = chars[oi][2]
        el = chars[ei][1]
        ew = chars[ei][2]
        owEnd = ow + kseg.segWidth(chars[oi][0])
        ewEnd = ew + kseg.segWidth(chars[ei][0])
        if (inner)
        {
            return [owEnd,ol,ew,el]
        }
        else
        {
            return [ow,ol,ewEnd,el]
        }
    }

    return motion
})()

export default motion;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FxQmEsVUFBQTtJQUFNOzs7QUFFVixVQUFUOzs7OztJQUVJLFFBQUMseUJBQVk7O3NCQUFRLEtBQUssTUFBUyxPQUFPLFdBQVc7OztJQUlyRCxRQUFDLDBCQUFhOzs7O3NCQUVLOzs7O1FBRWYsS0FBSyxlQUFNLEdBQUU7O2dCQUFTLEVBQUUsT0FBTSxFQUFFOzt1QkFBUSxFQUFFLEtBQUcsRUFBRTs7Ozt1QkFBUSxFQUFFLEtBQUcsRUFBRTs7O1FBRTlEOzRCQUVXOzs7WUFBUDswQkFFUzs7Z0JBQ0wsT0FBTyxLQUFLO2dCQUNaOztZQUVKLE9BQU87WUFFUCxXQUFXLElBQUksT0FBTSxLQUFLO1lBQzFCLFdBQVcsSUFBSSxLQUFLLEtBQUssT0FBTyxZQUFhLElBQUksS0FBSyxLQUFLO1lBQzNELFVBQVcsWUFBYSxJQUFJLE9BQU0sS0FBSztnQkFFcEMsWUFBWTs7b0JBQ1IsSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFJLE9BQU0sS0FBSyxNQUFPLElBQUksS0FBSyxLQUFLOztvQkFDeEQsS0FBSyxLQUFLLElBQUk7b0JBQ2QsS0FBSyxLQUFLLElBQUk7Ozs7O2dCQUVsQixPQUFPLEtBQUs7OztlQUVwQjs7O0lBRUosUUFBQyxvQkFBTyxPQUFNLEtBQUk7Ozs7c0JBRUc7O21CQUFkOztrQkFFSyxLQUFQLFlBQUU7O1FBRUgsY0FBYyxFQUFFLE1BQU0sU0FBTyxFQUFFO1FBQy9CLGNBQWMsRUFBRSxLQUFLLE1BQU0sTUFBTSxJQUFJO1FBQ3JDLGdCQUFZLGFBQUcsS0FBSywyQkFBUTtnQkFFckIsS0FBSzs7aUJBQ1I7dUJBQWEsS0FBQyxjQUFpQixNQUFNLEVBQUUsRUFBRTs7aUJBQ3pDO3VCQUFhLEtBQUMsa0JBQWtCLE1BQU0sRUFBRSxFQUFFOztpQkFDMUM7dUJBQWEsS0FBQyxhQUFpQixNQUFNLEVBQUUsRUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/motion.kode
