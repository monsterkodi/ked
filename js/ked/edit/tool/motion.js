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
        return _k_.in(spec.kind,['line','lineDown','lineUp','lineFirst','lineFirstDown','lineFirstUp','windowTop','windowMiddle','windowBottom'])
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
        var count, x, y, _74_34_

        if (_k_.empty(lines))
        {
            return
        }
        ;[x,y] = pos
        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,kseg.width(lines[y]),x)
        count = _k_.max(1,(((_74_34_=spec.count) != null ? _74_34_ : 1)))
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

            case 'sentence':
                return this.rangeForSentence(lines,x,y,count)

            case 'sentenceBack':
                return this.rangeForSentenceBack(lines,x,y,count)

            case 'paragraph':
                return this.rangeForParagraph(lines,x,y,count)

            case 'paragraphBack':
                return this.rangeForParagraphBack(lines,x,y,count)

            case 'lineFirstDown':
                return this.rangeForLineFirstDown(lines,y,count)

            case 'lineFirstUp':
                return this.rangeForLineFirstUp(lines,y,count)

            case 'lineFirst':
                return this.rangeForLineFirst(lines,y,count)

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

    motion["rangeForLineFirstDown"] = function (lines, y, count)
    {
        return this.rangeForLines(lines,y,y + count)
    }

    motion["rangeForLineFirstUp"] = function (lines, y, count)
    {
        return this.rangeForLines(lines,y - count,y)
    }

    motion["rangeForLineFirst"] = function (lines, y, count)
    {
        return this.rangeForLines(lines,y,y + count - 1)
    }

    motion["eofPosition"] = function (lines)
    {
        return [kseg.width(lines[lines.length - 1]),lines.length - 1]
    }

    motion["isSpaceSeg"] = function (seg)
    {
        return /\s+/.test(seg)
    }

    motion["firstNonBlankIndex"] = function (segs)
    {
        var i

        i = 0
        while (i < segs.length && this.isSpaceSeg(segs[i]))
        {
            i += 1
        }
        return i
    }

    motion["sentenceClosers"] = [')',']','"',"'"]
    motion["isSentenceEnd"] = function (segs, i)
    {
        var j

        if (!(_k_.in(segs[i],['.','!','?'])))
        {
            return false
        }
        j = i + 1
        while (j < segs.length && _k_.in(segs[j],this.sentenceClosers))
        {
            j += 1
        }
        if (j >= segs.length)
        {
            return true
        }
        return this.isSpaceSeg(segs[j])
    }

    motion["uniqueStarts"] = function (starts)
    {
        var pos, uniq

        starts.sort(function (a, b)
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
        uniq = []
        var list = _k_.list(starts)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (uniq.length && pos[0] === uniq.slice(-1)[0][0] && pos[1] === uniq.slice(-1)[0][1])
            {
                continue
            }
            uniq.push(pos)
        }
        return uniq
    }

    motion["sentenceStarts"] = function (lines)
    {
        var i, j, next, segs, starts, y

        starts = []
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            segs = list[y]
            if (_k_.empty(segs))
            {
                starts.push([0,y])
                continue
            }
            if (y === 0)
            {
                starts.push([0,0])
            }
            else if (_k_.empty(lines[y - 1]))
            {
                starts.push([kseg.widthAtSegi(segs,this.firstNonBlankIndex(segs)),y])
            }
            for (i = 0; i < segs.length; i++)
            {
                if (!this.isSentenceEnd(segs,i))
                {
                    continue
                }
                j = i + 1
                while (j < segs.length && _k_.in(segs[j],this.sentenceClosers))
                {
                    j += 1
                }
                if (j < segs.length)
                {
                    while (j < segs.length && this.isSpaceSeg(segs[j]))
                    {
                        j += 1
                    }
                    if (j < segs.length)
                    {
                        starts.push([kseg.widthAtSegi(segs,j),y])
                        continue
                    }
                }
                if (y + 1 < lines.length)
                {
                    next = lines[y + 1]
                    if (_k_.empty(next))
                    {
                        starts.push([0,y + 1])
                    }
                    else
                    {
                        starts.push([kseg.widthAtSegi(next,this.firstNonBlankIndex(next)),y + 1])
                    }
                }
            }
        }
        return this.uniqueStarts(starts)
    }

    motion["startAfter"] = function (starts, pos)
    {
        var i, start

        var list = _k_.list(starts)
        for (i = 0; i < list.length; i++)
        {
            start = list[i]
            if (start[1] > pos[1] || (start[1] === pos[1] && start[0] > pos[0]))
            {
                return i
            }
        }
        return -1
    }

    motion["startBefore"] = function (starts, pos)
    {
        var i, idx, start

        idx = -1
        var list = _k_.list(starts)
        for (i = 0; i < list.length; i++)
        {
            start = list[i]
            if (start[1] > pos[1] || (start[1] === pos[1] && start[0] >= pos[0]))
            {
                break
            }
            idx = i
        }
        return idx
    }

    motion["sentencePositionAfter"] = function (lines, pos, count)
    {
        var idx, starts

        starts = this.sentenceStarts(lines)
        idx = this.startAfter(starts,pos)
        if (idx < 0)
        {
            return this.eofPosition(lines)
        }
        return starts[_k_.min(starts.length - 1,idx + count - 1)]
    }

    motion["sentencePositionBefore"] = function (lines, pos, count)
    {
        var idx, starts

        starts = this.sentenceStarts(lines)
        idx = this.startBefore(starts,pos)
        if (idx < 0)
        {
            return [0,0]
        }
        return starts[_k_.max(0,idx - count + 1)]
    }

    motion["rangeForSentence"] = function (lines, x, y, count)
    {
        var target

        target = this.sentencePositionAfter(lines,[x,y],count)
        return [x,y,target[0],target[1]]
    }

    motion["rangeForSentenceBack"] = function (lines, x, y, count)
    {
        var target

        target = this.sentencePositionBefore(lines,[x,y],count)
        return [target[0],target[1],x,y]
    }

    motion["paragraphEndAfter"] = function (lines, y)
    {
        var yy, z

        if (_k_.empty(lines[y]))
        {
            yy = y + 1
            while (yy < lines.length && _k_.empty(lines[yy]))
            {
                yy += 1
            }
            if (yy >= lines.length)
            {
                return this.eofPosition(lines)
            }
            for (z = yy; z < lines.length; z++)
            {
                if (_k_.empty(lines[z]))
                {
                    return [0,z]
                }
            }
            return this.eofPosition(lines)
        }
        for (z = (y + 1); z < lines.length; z++)
        {
            if (_k_.empty(lines[z]))
            {
                return [0,z]
            }
        }
        return this.eofPosition(lines)
    }

    motion["paragraphPositionAfter"] = function (lines, pos, count)
    {
        var n, p, x, y

        ;[x,y] = pos
        for (n = 0; n < count; n++)
        {
            p = this.paragraphEndAfter(lines,y)
            x = p[0]
            y = p[1]
        }
        return [x,y]
    }

    motion["paragraphStartBefore"] = function (lines, y)
    {
        var yy, z

        if (_k_.empty(lines[y]))
        {
            yy = y - 1
            while (yy >= 0 && _k_.empty(lines[yy]))
            {
                yy -= 1
            }
            if (yy < 0)
            {
                return [0,0]
            }
            z = yy
            while (z > 0 && !_k_.empty(lines[z - 1]))
            {
                z -= 1
            }
            return [0,z]
        }
        z = y - 1
        while (z >= 0 && !_k_.empty(lines[z]))
        {
            z -= 1
        }
        if (z < 0)
        {
            return [0,0]
        }
        return [0,z]
    }

    motion["paragraphPositionBefore"] = function (lines, pos, count)
    {
        var n, p, x, y

        ;[x,y] = pos
        for (n = 0; n < count; n++)
        {
            p = this.paragraphStartBefore(lines,y)
            x = p[0]
            y = p[1]
        }
        return [x,y]
    }

    motion["rangeForParagraph"] = function (lines, x, y, count)
    {
        var target

        target = this.paragraphPositionAfter(lines,[x,y],count)
        if (x > 0 && target[1] > 0 && _k_.empty(lines[target[1]]))
        {
            return [x,y,kseg.width(lines[target[1] - 1]),target[1] - 1]
        }
        return [x,y,target[0],target[1]]
    }

    motion["rangeForParagraphBack"] = function (lines, x, y, count)
    {
        var target

        target = this.paragraphPositionBefore(lines,[x,y],count)
        return [target[0],target[1],x,y]
    }

    motion["rangeForWord"] = function (lines, x, y, count, big, cursors)
    {
        var eol, n, pos

        pos = [x,y]
        for (n = 0; n < count; n++)
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
        for (n = 0; n < count; n++)
        {
            pos = this.wordEndAfter(lines,pos,big)
        }
        return [x,y,pos[0],pos[1]]
    }

    motion["rangeForWordBack"] = function (lines, x, y, count, big = false)
    {
        var n, pos

        pos = [x,y]
        for (n = 0; n < count; n++)
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

        ;[x,y] = pos
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
                return
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

        ;[x,y] = pos
        found = []
        var list = _k_.list(this.charFindMatches(lines,target))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
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
            return
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
        var count, forward, mi, msegs, pos, target, till, _392_36_

        target = spec.target
        count = _k_.max(1,(((_392_36_=spec.count) != null ? _392_36_ : 1)))
        till = spec.till
        forward = spec.forward !== false
        pos = this.charFindPosition(lines,[x,y],target,count,till,forward)
        if (pos === null)
        {
            return
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

        ;[x,y] = pos
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
        for (yy = (y + 1); yy < lines.length; yy++)
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

        ;[x,y] = pos
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

        ;[x,y] = pos
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
        var area, count, _542_34_, _543_26_

        count = _k_.max(1,(((_542_34_=spec.count) != null ? _542_34_ : 1)))
        area = ((_543_26_=spec.area) != null ? _543_26_ : 'inner')
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
                ;[s,e] = this.wordBoundsAt(segs,i,big)
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
            ;[wy,ws,we] = next
            return this.rangeForWords(lines,wy,ws,we,count,true,big)
        }
        ;[s,e] = this.wordBoundsAt(segs,i,big)
        return this.rangeForWords(lines,y,s,e,count,(!inner),big)
    }

    motion["rangeForWords"] = function (lines, y, s, e, count, around, big = false)
    {
        var firstLine, firstSegs, firstStart, lastEnd, lastLine, lastSegs, lStart, n, ne, next, nl, ns, tEnd

        firstLine = y
        firstStart = s
        lastLine = y
        lastEnd = e
        for (n = 1; n < count; n++)
        {
            next = this.nextWordAfterIndex(lines,lastLine,lastEnd,big)
            if (!next)
            {
                break
            }
            ;[nl,ns,ne] = next
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
        var closes, open, opens, _668_30_

        opens = {')':'(',']':'[','}':'{','b':'(','B':'{'}
        closes = {'(':')','[':']','{':'}'}
        open = ((_668_30_=opens[target]) != null ? _668_30_ : target)
        if (open === '"' || open === "'")
        {
            return this.rangeForQuoteObject(lines,x,y,open,inner)
        }
        if (!closes[open])
        {
            return
        }
        return this.rangeForBracketObject(lines,x,y,open,inner)
    }

    motion["rangeForQuoteObject"] = function (lines, x, y, quote, inner)
    {
        var c, chosen, i, lStart, o, open, pair, pairs, seg, segs, tEnd, xi

        segs = lines[y]
        if (_k_.empty(segs))
        {
            return
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
            return
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
            return
        }
        ;[o,c] = chosen
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
            ;[c,li,w] = ch
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
            return
        }
        ;[osp,csp] = spans
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O09BQ0EsV0FBQTs7O0FBRWxCLFVBQUQ7Ozs7O0lBOEJJLFFBQUMseUJBQVk7O3NCQUFRLEtBQUssTUFBUyxPQUFPLFdBQVcsU0FBUyxZQUFZLGdCQUFnQixjQUFjLFlBQVksZUFBZTs7O0lBRW5JLFFBQUMsMEJBQWE7Ozs7c0JBRUk7Ozs7UUFFZCxLQUFLLGVBQU0sR0FBRTs7Z0JBQVMsRUFBRSxPQUFNLEVBQUU7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7UUFFOUQ7NEJBRVc7OztZQUFQOzBCQUVTOztnQkFDTCxPQUFPLEtBQUs7Z0JBQ1o7O1lBRUosT0FBTztZQUVQLFdBQVcsSUFBSSxPQUFNLEtBQUs7WUFDMUIsV0FBVyxJQUFJLEtBQUssS0FBSyxPQUFPLFlBQWEsSUFBSSxLQUFLLEtBQUs7WUFDM0QsVUFBVyxZQUFhLElBQUksT0FBTSxLQUFLO2dCQUVwQyxZQUFZOztvQkFDUixJQUFJLEtBQUssS0FBSyxPQUFPLElBQUksT0FBTSxLQUFLLE1BQU8sSUFBSSxLQUFLLEtBQUs7O29CQUN4RCxLQUFLLEtBQUssSUFBSTtvQkFDZCxLQUFLLEtBQUssSUFBSTs7Ozs7Z0JBRWxCLE9BQU8sS0FBSzs7O2VBRXBCOzs7SUFFSixRQUFDLG9CQUFPLE9BQU0sS0FBSTs7OztzQkFFSDs7OztVQUVWLEVBQUUsS0FBSztRQUVSLGNBQWMsRUFBRSxNQUFNLFNBQU8sRUFBRTtRQUMvQixjQUFjLEVBQUUsS0FBSyxNQUFNLE1BQU0sSUFBSTtRQUNyQyxnQkFBWSxhQUFHLEtBQUssMkJBQVE7Z0JBRXJCLEtBQUs7O2lCQUNSO3VCQUFrQixLQUFDLGNBQXFCLE1BQU0sRUFBRSxFQUFFOztpQkFDbEQ7dUJBQWtCLEtBQUMsa0JBQXFCLE1BQU0sRUFBRSxFQUFF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
//# sourceURL=../../../../kode/ked/edit/tool/motion.kode
