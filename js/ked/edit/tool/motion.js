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
        var count, x, y, _69_34_

        if (_k_.empty(lines))
        {
            return null
        }
        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,kseg.width(lines[y]),x)
        count = _k_.max(1,(((_69_34_=spec.count) != null ? _69_34_ : 1)))
        switch (spec.kind)
        {
            case 'char':
                return this.rangeForChars(lines,x,y,count)

            case 'charBack':
                return this.rangeForCharsBack(lines,x,y,count)

            case 'word':
                return this.rangeForWord(lines,x,y,count,false,spec.cursors)

            case 'wend':
                return this.rangeForWordEnd(lines,x,y,count)

            case 'drow':
                return this.rangeForWordBack(lines,x,y,count)

            case 'WORD':
                return this.rangeForWord(lines,x,y,count,true,spec.cursors)

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

    motion["rangeForWord"] = function (lines, x, y, count, big, cursors)
    {
        var eol, n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            eol = cursors > 1
            pos = this.wordStartAfter(lines,pos,eol,big)
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
        var count, forward, mi, msegs, pos, target, till, _201_36_

        target = spec.target
        count = _k_.max(1,(((_201_36_=spec.count) != null ? _201_36_ : 1)))
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
        var area, count, _351_34_, _352_26_

        count = _k_.max(1,(((_351_34_=spec.count) != null ? _351_34_ : 1)))
        area = ((_352_26_=spec.area) != null ? _352_26_ : 'inner')
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
        while (e < segs.length && belt.categoryForChar(segs[e]) === 'ws')
        {
            e += 1
        }
        return e
    }

    motion["leadingWsStart"] = function (segs, i)
    {
        var s

        s = i
        while (s > 0 && belt.categoryForChar(segs[s - 1]) === 'ws')
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
        var closes, open, opens, _477_30_

        opens = {')':'(',']':'[','}':'{','b':'(','B':'{'}
        closes = {'(':')','[':']','{':'}'}
        open = ((_477_30_=opens[target]) != null ? _477_30_ : target)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0F3QmEsVUFBQTtJQUFNOztPQUNBLFdBQUE7OztBQUVWLFVBQVQ7Ozs7O0lBRUksUUFBQyx5QkFBWTs7c0JBQVEsS0FBSyxNQUFTLE9BQU8sV0FBVzs7O0lBRXJELFFBQUMsMEJBQWE7Ozs7c0JBRUs7Ozs7UUFFZixLQUFLLGVBQU0sR0FBRTs7Z0JBQVMsRUFBRSxPQUFNLEVBQUU7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7UUFFOUQ7NEJBRVc7OztZQUFQOzBCQUVTOztnQkFDTCxPQUFPLEtBQUs7Z0JBQ1o7O1lBRUosT0FBTztZQUVQLFdBQVcsSUFBSSxPQUFNLEtBQUs7WUFDMUIsV0FBVyxJQUFJLEtBQUssS0FBSyxPQUFPLFlBQWEsSUFBSSxLQUFLLEtBQUs7WUFDM0QsVUFBVyxZQUFhLElBQUksT0FBTSxLQUFLO2dCQUVwQyxZQUFZOztvQkFDUixJQUFJLEtBQUssS0FBSyxPQUFPLElBQUksT0FBTSxLQUFLLE1BQU8sSUFBSSxLQUFLLEtBQUs7O29CQUN4RCxLQUFLLEtBQUssSUFBSTtvQkFDZCxLQUFLLEtBQUssSUFBSTs7Ozs7Z0JBRWxCLE9BQU8sS0FBSzs7O2VBRXBCOzs7SUFFSixRQUFDLG9CQUFPLE9BQU0sS0FBSTs7OztzQkFFRzs7bUJBQWQ7O2tCQUVLLEtBQVAsWUFBRTs7UUFFSCxjQUFjLEVBQUUsTUFBTSxTQUFPLEVBQUU7UUFDL0IsY0FBYyxFQUFFLEtBQUssTUFBTSxNQUFNLElBQUk7UUFDckMsZ0JBQVksYUFBRyxLQUFLLDJCQUFRO2dCQUVyQixLQUFLOztpQkFDUjt1QkFBa0IsS0FBQyxjQUFxQixNQUFNLEVBQUUsRUFBRTs7aUJBQ2xEO3VCQUFrQixLQUFDLGtCQUFxQixNQUFNLEVBQUUsRUFBRTs7aUJBQ2xEO3VCQUFrQixLQUFDLGFBQXFC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/motion.kode
