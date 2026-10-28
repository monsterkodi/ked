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
        return _k_.in(spec.kind,['line','lineDown','lineUp','lineFirst','lineFirstDown','lineFirstUp'])
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
        var count, x, y, _76_34_

        if (_k_.empty(lines))
        {
            return null
        }
        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,kseg.width(lines[y]),x)
        count = _k_.max(1,(((_76_34_=spec.count) != null ? _76_34_ : 1)))
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
            for (var _b_ = i = 0, _c_ = segs.length; (_b_ <= _c_ ? i < segs.length : i > segs.length); (_b_ <= _c_ ? ++i : --i))
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
            for (var _a_ = z = yy, _b_ = lines.length; (_a_ <= _b_ ? z < lines.length : z > lines.length); (_a_ <= _b_ ? ++z : --z))
            {
                if (_k_.empty(lines[z]))
                {
                    return [0,z]
                }
            }
            return this.eofPosition(lines)
        }
        for (var _c_ = z = (y + 1), _d_ = lines.length; (_c_ <= _d_ ? z < lines.length : z > lines.length); (_c_ <= _d_ ? ++z : --z))
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

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        for (var _b_ = n = 0, _c_ = count; (_b_ <= _c_ ? n < count : n > count); (_b_ <= _c_ ? ++n : --n))
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

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        for (var _b_ = n = 0, _c_ = count; (_b_ <= _c_ ? n < count : n > count); (_b_ <= _c_ ? ++n : --n))
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
        var count, forward, mi, msegs, pos, target, till, _394_36_

        target = spec.target
        count = _k_.max(1,(((_394_36_=spec.count) != null ? _394_36_ : 1)))
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
        var area, count, _544_34_, _545_26_

        count = _k_.max(1,(((_544_34_=spec.count) != null ? _544_34_ : 1)))
        area = ((_545_26_=spec.area) != null ? _545_26_ : 'inner')
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
        var closes, open, opens, _670_30_

        opens = {')':'(',']':'[','}':'{','b':'(','B':'{'}
        closes = {'(':')','[':']','{':'}'}
        open = ((_670_30_=opens[target]) != null ? _670_30_ : target)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0ErQmEsVUFBQTtJQUFNOztPQUNBLFdBQUE7OztBQUVWLFVBQVQ7Ozs7O0lBRUksUUFBQyx5QkFBWTs7c0JBQVEsS0FBSyxNQUFTLE9BQU8sV0FBVyxTQUFTLFlBQVksZ0JBQWdCOzs7SUFFMUYsUUFBQywwQkFBYTs7OztzQkFFSzs7OztRQUVmLEtBQUssZUFBTSxHQUFFOztnQkFBUyxFQUFFLE9BQU0sRUFBRTs7dUJBQVEsRUFBRSxLQUFHLEVBQUU7Ozs7dUJBQVEsRUFBRSxLQUFHLEVBQUU7OztRQUU5RDs0QkFFVzs7O1lBQVA7MEJBRVM7O2dCQUNMLE9BQU8sS0FBSztnQkFDWjs7WUFFSixPQUFPO1lBRVAsV0FBVyxJQUFJLE9BQU0sS0FBSztZQUMxQixXQUFXLElBQUksS0FBSyxLQUFLLE9BQU8sWUFBYSxJQUFJLEtBQUssS0FBSztZQUMzRCxVQUFXLFlBQWEsSUFBSSxPQUFNLEtBQUs7Z0JBRXBDLFlBQVk7O29CQUNSLElBQUksS0FBSyxLQUFLLE9BQU8sSUFBSSxPQUFNLEtBQUssTUFBTyxJQUFJLEtBQUssS0FBSzs7b0JBQ3hELEtBQUssS0FBSyxJQUFJO29CQUNkLEtBQUssS0FBSyxJQUFJOzs7OztnQkFFbEIsT0FBTyxLQUFLOzs7ZUFFcEI7OztJQUVKLFFBQUMsb0JBQU8sT0FBTSxLQUFJOzs7O3NCQUVHOzttQkFBZDs7a0JBRUssS0FBUCxZQUFFOztRQUVILGNBQWMsRUFBRSxNQUFNLFNBQU8sRUFBRTtRQUMvQixjQUFjLEVBQUUsS0FBSyxNQUFNLE1BQU0sSUFBSTtRQUNyQyxnQkFBWSxhQUFHLEtBQUssMkJBQVE7Z0JBRXJCLEtBQUs7O2lCQUNSO3VCQUFrQixLQUFDLGNBQXFCLE1BQU0sRUFBRSxFQUFFOztpQkFDbEQ7dUJBQWtCLEtBQUMsa0JBQXFCLE1BQU0sRUFBRSxFQUFFOztpQkFDbEQ7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/motion.kode
