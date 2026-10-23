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
        var count, x, y, _70_34_

        if (_k_.empty(lines))
        {
            return null
        }
        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,kseg.width(lines[y]),x)
        count = _k_.max(1,(((_70_34_=spec.count) != null ? _70_34_ : 1)))
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

            case 'wordBig':
                return this.rangeForWord(lines,x,y,count,true)

            case 'wordEndBig':
                return this.rangeForWordEnd(lines,x,y,count,true)

            case 'wordBackBig':
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

    motion["indexOfCharAfter"] = function (segs, x, target, count)
    {
        var found, i, j

        i = kseg.indexAtWidth(segs,x)
        found = 0
        for (var _a_ = j = i + 1, _b_ = segs.length; (_a_ <= _b_ ? j < segs.length : j > segs.length); (_a_ <= _b_ ? ++j : --j))
        {
            if (segs[j] === target)
            {
                found += 1
                if (found === count)
                {
                    return j
                }
            }
        }
        return null
    }

    motion["charFindPosition"] = function (lines, pos, target, count, till)
    {
        var j, segs, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        j = this.indexOfCharAfter(segs,x,target,count)
        if (j === null)
        {
            return null
        }
        if (till)
        {
            j = _k_.max(0,j - 1)
        }
        return [kseg.widthAtSegi(segs,j),y]
    }

    motion["rangeForCharFind"] = function (lines, x, y, spec)
    {
        var count, j, segs, target, _180_35_

        segs = lines[y]
        target = spec.target
        count = _k_.max(1,(((_180_35_=spec.count) != null ? _180_35_ : 1)))
        j = this.indexOfCharAfter(segs,x,target,count)
        if (j === null)
        {
            return null
        }
        if (spec.till)
        {
            return [x,y,kseg.widthAtSegi(segs,j),y]
        }
        else
        {
            return [x,y,kseg.widthAtSegi(segs,j + 1),y]
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
        var area, count, _337_34_, _338_26_

        count = _k_.max(1,(((_337_34_=spec.count) != null ? _337_34_ : 1)))
        area = ((_338_26_=spec.area) != null ? _338_26_ : 'inner')
        x = this.objectX(lines,y,x)
        switch (spec.target)
        {
            case 'word':
                return this.rangeForWordObject(lines,x,y,count,(area === 'inner'),false)

            case 'wordBig':
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
        var closes, open, opens, _473_30_

        opens = {')':'(',']':'[','}':'{','b':'(','B':'{'}
        closes = {'(':')','[':']','{':'}'}
        open = ((_473_30_=opens[target]) != null ? _473_30_ : target)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0F1QmEsVUFBQTtJQUFNOztPQUNBLFdBQUE7OztBQUVWLFVBQVQ7Ozs7O0lBRUksUUFBQyx5QkFBWTs7c0JBQVEsS0FBSyxNQUFTLE9BQU8sV0FBVzs7O0lBSXJELFFBQUMsMEJBQWE7Ozs7c0JBRUs7Ozs7UUFFZixLQUFLLGVBQU0sR0FBRTs7Z0JBQVMsRUFBRSxPQUFNLEVBQUU7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7UUFFOUQ7NEJBRVc7OztZQUFQOzBCQUVTOztnQkFDTCxPQUFPLEtBQUs7Z0JBQ1o7O1lBRUosT0FBTztZQUVQLFdBQVcsSUFBSSxPQUFNLEtBQUs7WUFDMUIsV0FBVyxJQUFJLEtBQUssS0FBSyxPQUFPLFlBQWEsSUFBSSxLQUFLLEtBQUs7WUFDM0QsVUFBVyxZQUFhLElBQUksT0FBTSxLQUFLO2dCQUVwQyxZQUFZOztvQkFDUixJQUFJLEtBQUssS0FBSyxPQUFPLElBQUksT0FBTSxLQUFLLE1BQU8sSUFBSSxLQUFLLEtBQUs7O29CQUN4RCxLQUFLLEtBQUssSUFBSTtvQkFDZCxLQUFLLEtBQUssSUFBSTs7Ozs7Z0JBRWxCLE9BQU8sS0FBSzs7O2VBRXBCOzs7SUFFSixRQUFDLG9CQUFPLE9BQU0sS0FBSTs7OztzQkFFRzs7bUJBQWQ7O2tCQUVLLEtBQVAsWUFBRTs7UUFFSCxjQUFjLEVBQUUsTUFBTSxTQUFPLEVBQUU7UUFDL0IsY0FBYyxFQUFFLEtBQUssTUFBTSxNQUFNLElBQUk7UUFDckMsZ0JBQVksYUFBRyxLQUFLLDJCQUFRO2dCQUVyQixLQUFLOztpQkFDUjt1QkFBYSxLQUFDLGNBQWlCLE1BQU0sRUFBRSxFQUFFOztpQkFDekM7dUJBQWEsS0FBQyxrQkFBa0IsTUFBTSxFQUFFLEVBQUU7O2lCQUMxQzt1QkFBYSxLQUFDLGFBQWlCLE1B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/motion.kode
