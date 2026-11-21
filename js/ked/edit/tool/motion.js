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
        var _a_ = pos; x = _a_[0]; y = _a_[1]

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
            return
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07O09BQ0EsV0FBQTs7O0FBRWxCLFVBQUQ7Ozs7O0lBOEJJLFFBQUMseUJBQVk7O3NCQUFRLEtBQUssTUFBUyxPQUFPLFdBQVcsU0FBUyxZQUFZLGdCQUFnQixjQUFjLFlBQVksZUFBZTs7O0lBRW5JLFFBQUMsMEJBQWE7Ozs7c0JBRUk7Ozs7UUFFZCxLQUFLLGVBQU0sR0FBRTs7Z0JBQVMsRUFBRSxPQUFNLEVBQUU7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7O3VCQUFRLEVBQUUsS0FBRyxFQUFFOzs7UUFFOUQ7NEJBRVc7OztZQUFQOzBCQUVTOztnQkFDTCxPQUFPLEtBQUs7Z0JBQ1o7O1lBRUosT0FBTztZQUVQLFdBQVcsSUFBSSxPQUFNLEtBQUs7WUFDMUIsV0FBVyxJQUFJLEtBQUssS0FBSyxPQUFPLFlBQWEsSUFBSSxLQUFLLEtBQUs7WUFDM0QsVUFBVyxZQUFhLElBQUksT0FBTSxLQUFLO2dCQUVwQyxZQUFZOztvQkFDUixJQUFJLEtBQUssS0FBSyxPQUFPLElBQUksT0FBTSxLQUFLLE1BQU8sSUFBSSxLQUFLLEtBQUs7O29CQUN4RCxLQUFLLEtBQUssSUFBSTtvQkFDZCxLQUFLLEtBQUssSUFBSTs7Ozs7Z0JBRWxCLE9BQU8sS0FBSzs7O2VBRXBCOzs7SUFFSixRQUFDLG9CQUFPLE9BQU0sS0FBSTs7OztzQkFFSDs7OztrQkFFSCxLQUFQLFlBQUU7O1FBRUgsY0FBYyxFQUFFLE1BQU0sU0FBTyxFQUFFO1FBQy9CLGNBQWMsRUFBRSxLQUFLLE1BQU0sTUFBTSxJQUFJO1FBQ3JDLGdCQUFZLGFBQUcsS0FBSywyQkFBUTtnQkFFckIsS0FBSzs7aUJBQ1I7dUJBQWtCLEtBQUMsY0FBcUIsTUFBTSxFQUFFLEVBQUU7O2lCQUNsRDt1QkFBa0IsS0FBQyxrQkFBcUIsTUFBTSxFQUFFLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/motion.kode
