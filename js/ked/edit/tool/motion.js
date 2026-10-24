var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var motion

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import belt from "./belt.js"


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
        var count, x, y, _68_34_

        if (_k_.empty(lines))
        {
            return null
        }
        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,kseg.width(lines[y]),x)
        count = _k_.max(1,(((_68_34_=spec.count) != null ? _68_34_ : 1)))
        switch (spec.kind)
        {
            case 'char':
                return this.rangeForChars(lines,x,y,count)

            case 'charBack':
                return this.rangeForCharsBack(lines,x,y,count)

            case 'word':
                return this.rangeForWord(lines,x,y,count)

            case 'wend':
                return this.rangeForWordEnd(lines,x,y,count)

            case 'drow':
                return this.rangeForWordBack(lines,x,y,count)

            case 'WORD':
                return this.rangeForWord(lines,x,y,count,true)

            case 'WEND':
                return this.rangeForWordEnd(lines,x,y,count,true)

            case 'DROW':
                return this.rangeForWordBack(lines,x,y,count,true)

            case 'charFind':
                return this.rangeForCharFind(lines,x,y,spec)

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

    motion["rangeForWord"] = function (lines, x, y, count, big = false)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordStartAfter(lines,pos,(n === count - 1),big)
        }
        if (pos[0] === 0 && pos[1] > y)
        {
            pos = [kseg.width(lines[pos[1] - 1]),pos[1] - 1]
        }
        return [x,y,pos[0],pos[1]]
    }

    motion["rangeForWordEnd"] = function (lines, x, y, count, big = false)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordEndAfter(lines,pos,big)
        }
        return [x,y,pos[0],pos[1]]
    }

    motion["rangeForWordBack"] = function (lines, x, y, count, big = false)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordStartBefore(lines,pos,big)
        }
        return [pos[0],pos[1],x,y]
    }

    motion["charFindMatches"] = function (lines, target)
    {
        var i, matches, seg, segs, y

        matches = []
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            segs = list[y]
            var list1 = _k_.list(segs)
            for (i = 0; i < list1.length; i++)
            {
                seg = list1[i]
                if (seg === target)
                {
                    matches.push([this.widthAt(segs,i),y])
                }
            }
        }
        return matches
    }

    motion["charFindLanding"] = function (lines, pos, till, forward)
    {
        var i, segs, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (!till)
        {
            return [x,y]
        }
        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        if (forward)
        {
            if (i <= 0)
            {
                return null
            }
            return [kseg.widthAtSegi(segs,i - 1),y]
        }
        else
        {
            return [kseg.widthAtSegi(segs,i + 1),y]
        }
    }

    motion["charFindLandings"] = function (lines, target, till, forward)
    {
        var landings, m, p

        landings = []
        var list = _k_.list(this.charFindMatches(lines,target))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            p = this.charFindLanding(lines,m,till,forward)
            if (p)
            {
                landings.push(p)
            }
        }
        return landings
    }

    motion["charFindPosition"] = function (lines, pos, target, count, till, forward = true)
    {
        var found, m, p, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        found = []
        var list = _k_.list(this.charFindMatches(lines,target))
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            m = list[_b_]
            if (forward)
            {
                if (m[1] < y || (m[1] === y && m[0] <= x))
                {
                    continue
                }
            }
            else
            {
                if (m[1] > y || (m[1] === y && m[0] >= x))
                {
                    continue
                }
            }
            p = this.charFindLanding(lines,m,till,forward)
            if (p)
            {
                found.push(p)
            }
        }
        if (found.length < count)
        {
            return null
        }
        if (forward)
        {
            return found[count - 1]
        }
        else
        {
            return found[found.length - count]
        }
    }

    motion["rangeForCharFind"] = function (lines, x, y, spec)
    {
        var count, forward, mi, msegs, pos, target, till, _214_36_

        target = spec.target
        count = _k_.max(1,(((_214_36_=spec.count) != null ? _214_36_ : 1)))
        till = spec.till
        forward = spec.forward !== false
        pos = this.charFindPosition(lines,[x,y],target,count,till,forward)
        if (pos === null)
        {
            return null
        }
        msegs = lines[pos[1]]
        mi = kseg.indexAtWidth(msegs,pos[0])
        if (forward && till)
        {
            mi += 1
        }
        if (!forward && till)
        {
            mi -= 1
        }
        if (forward)
        {
            if (till)
            {
                return [x,y,kseg.widthAtSegi(msegs,mi),pos[1]]
            }
            else
            {
                return [x,y,kseg.widthAtSegi(msegs,mi + 1),pos[1]]
            }
        }
        else
        {
            if (till)
            {
                return [kseg.widthAtSegi(msegs,mi + 1),pos[1],x,y]
            }
            else
            {
                return [kseg.widthAtSegi(msegs,mi),pos[1],x,y]
            }
        }
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

    motion["wordCategory"] = function (seg, big)
    {
        if (_k_.empty(seg))
        {
            return 'empty'
        }
        if (/\s+/.test(seg))
        {
            return 'ws'
        }
        if (big)
        {
            return 'word'
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

    motion["wordStartAfter"] = function (lines, pos, eol = false, big = false)
    {
        var cat, i, j, line, segs, x, y, yy

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        if (i < segs.length)
        {
            cat = this.wordCategory(segs[i],big)
            if (cat !== 'ws')
            {
                while (i < segs.length && this.wordCategory(segs[i],big) === cat)
                {
                    i += 1
                }
            }
            while (i < segs.length && this.wordCategory(segs[i],big) === 'ws')
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
            while (j < line.length && this.wordCategory(line[j],big) === 'ws')
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

    motion["wordEndAfter"] = function (lines, pos, big = false)
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
            cat = this.wordCategory(segs[i],big)
            if (cat === 'ws')
            {
                i += 1
                continue
            }
            j = i
            while (j + 1 < segs.length && this.wordCategory(segs[j + 1],big) === cat)
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

    motion["wordStartBefore"] = function (lines, pos, big = false)
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
            cat = this.wordCategory(segs[i],big)
            if (cat === 'ws')
            {
                continue
            }
            while (i > 0 && this.wordCategory(segs[i - 1],big) === cat)
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
        var area, count, _376_34_, _377_26_

        count = _k_.max(1,(((_376_34_=spec.count) != null ? _376_34_ : 1)))
        area = ((_377_26_=spec.area) != null ? _377_26_ : 'inner')
        x = this.objectX(lines,y,x)
        switch (spec.target)
        {
            case 'word':
                return this.rangeForWordObject(lines,x,y,count,(area === 'inner'),false)

            case 'WORD':
                return this.rangeForWordObject(lines,x,y,count,(area === 'inner'),true)

            default:
                return this.rangeForPairObject(lines,x,y,spec.target,(area === 'inner'))
        }

    }

    motion["wordBoundsAt"] = function (segs, i, big = false)
    {
        var cat, e, s

        cat = this.wordCategory(segs[i],big)
        s = i
        e = i
        while (s > 0 && this.wordCategory(segs[s - 1],big) === cat)
        {
            s -= 1
        }
        while (e + 1 < segs.length && this.wordCategory(segs[e + 1],big) === cat)
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

    motion["nextWordAfterIndex"] = function (lines, y, i, big = false)
    {
        var e, s, segs

        while (true)
        {
            segs = lines[y]
            while (i < segs.length && this.wordCategory(segs[i],big) === 'ws')
            {
                i += 1
            }
            if (i < segs.length)
            {
                var _a_ = this.wordBoundsAt(segs,i,big); s = _a_[0]; e = _a_[1]

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

    motion["rangeForWordObject"] = function (lines, x, y, count, inner, big = false)
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
        if (this.wordCategory(segs[i],big) === 'ws')
        {
            if (inner)
            {
                s = this.leadingWsStart(segs,i)
                e = this.trailingWsEnd(segs,i)
                return [this.widthAt(segs,s),y,this.widthAtOrEnd(segs,e),y]
            }
            next = this.nextWordAfterIndex(lines,y,i,big)
            if (!next)
            {
                s = this.leadingWsStart(segs,i)
                e = this.trailingWsEnd(segs,i)
                return [this.widthAt(segs,s),y,this.widthAtOrEnd(segs,e),y]
            }
            var _a_ = next; wy = _a_[0]; ws = _a_[1]; we = _a_[2]

            return this.rangeForWords(lines,wy,ws,we,count,true,big)
        }
        var _b_ = this.wordBoundsAt(segs,i,big); s = _b_[0]; e = _b_[1]

        return this.rangeForWords(lines,y,s,e,count,(!inner),big)
    }

    motion["rangeForWords"] = function (lines, y, s, e, count, around, big = false)
    {
        var firstLine, firstSegs, firstStart, lastEnd, lastLine, lastSegs, lStart, n, ne, next, nl, ns, tEnd

        firstLine = y
        firstStart = s
        lastLine = y
        lastEnd = e
        for (var _a_ = n = 1, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            next = this.nextWordAfterIndex(lines,lastLine,lastEnd,big)
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
        var closes, open, opens, _512_30_

        opens = {')':'(',']':'[','}':'{','b':'(','B':'{'}
        closes = {'(':')','[':']','{':'}'}
        open = ((_512_30_=opens[target]) != null ? _512_30_ : target)
        if (open === '"' || open === "'")
        {
            return this.rangeForQuoteObject(lines,x,y,open,inner)
        }
        if (!closes[open])
        {
            return null
        }
        return this.rangeForBracketObject(lines,x,y,open,inner)
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

    motion["pairSpansForPosition"] = function (lines, x, y, open)
    {
        var c, ch, li, spans, w

        spans = belt.pairSpansAtPosition(lines,[x,y],open)
        if (spans)
        {
            return spans
        }
        var list = _k_.list(this.flatChars(lines))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ch = list[_a_]
            var _b_ = ch; c = _b_[0]; li = _b_[1]; w = _b_[2]

            if (li < y || (li === y && w < x))
            {
                continue
            }
            if (c !== open)
            {
                continue
            }
            if (belt.isRangeInString(lines,[w,li,w + 1,li]))
            {
                continue
            }
            spans = belt.pairSpansAtPosition(lines,[w,li],open)
            if (spans && spans[0][0] === w && spans[0][1] === li)
            {
                return spans
            }
        }
        return null
    }

    motion["rangeForBracketObject"] = function (lines, x, y, open, inner)
    {
        var csp, osp, spans

        spans = this.pairSpansForPosition(lines,x,y,open)
        if (!spans)
        {
            return null
        }
        var _a_ = spans; osp = _a_[0]; csp = _a_[1]

        if (inner)
        {
            return [osp[2],osp[1],csp[0],csp[1]]
        }
        else
        {
            return [osp[0],osp[1],csp[2],csp[1]]
        }
    }

    return motion
})()

export default motion;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0F3QmEsVUFBQTtJQUFNOztPQUNBLFdBQUE7OztBQUVWLFVBQVQ7Ozs7O0lBRUksUUFBQyx5QkFBWTs7c0JBQVEsS0FBSyxNQUFTLE9BQU8sV0FBVzs7O0lBRXJELFFBQUMsMEJBQWE7Ozs7c0JBRUs7Ozs7UUFFZixLQUFLLGVBQU0sR0FBRTs7Z0JBQVMsRUFBRSxPQUFNLEVBQUU7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7UUFFOUQ7NEJBRVc7OztZQUFQOzBCQUVTOztnQkFDTCxPQUFPLEtBQUs7Z0JBQ1o7O1lBRUosT0FBTztZQUVQLFdBQVcsSUFBSSxPQUFNLEtBQUs7WUFDMUIsV0FBVyxJQUFJLEtBQUssS0FBSyxPQUFPLFlBQWEsSUFBSSxLQUFLLEtBQUs7WUFDM0QsVUFBVyxZQUFhLElBQUksT0FBTSxLQUFLO2dCQUVwQyxZQUFZOztvQkFDUixJQUFJLEtBQUssS0FBSyxPQUFPLElBQUksT0FBTSxLQUFLLE1BQU8sSUFBSSxLQUFLLEtBQUs7O29CQUN4RCxLQUFLLEtBQUssSUFBSTtvQkFDZCxLQUFLLEtBQUssSUFBSTs7Ozs7Z0JBRWxCLE9BQU8sS0FBSzs7O2VBRXBCOzs7SUFFSixRQUFDLG9CQUFPLE9BQU0sS0FBSTs7OztzQkFDRzs7bUJBQWQ7O2tCQUVLLEtBQVAsWUFBRTs7UUFFSCxjQUFjLEVBQUUsTUFBTSxTQUFPLEVBQUU7UUFDL0IsY0FBYyxFQUFFLEtBQUssTUFBTSxNQUFNLElBQUk7UUFDckMsZ0JBQVksYUFBRyxLQUFLLDJCQUFRO2dCQUVyQixLQUFLOztpQkFDUjt1QkFBa0IsS0FBQyxjQUFxQixNQUFNLEVBQUUsRUFBRTs7aUJBQ2xEO3VCQUFrQixLQUFDLGtCQUFxQixNQUFNLEVBQUUsRUFBRTs7aUJBQ2xEO3VCQUFrQixLQUFDLGFBQXFC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/motion.kode
