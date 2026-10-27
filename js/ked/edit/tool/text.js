var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var text

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg

import color from "../../theme/color.js"


text = (function ()
{
    function text ()
    {}

    text["linesForText"] = function (text)
    {
        return kstr.lines(text)
    }

    text["joinLines"] = function (lines, join = '\n')
    {
        if (_k_.isStr(lines))
        {
            lines = kstr.lines(lines)
        }
        return lines.join(join)
    }

    text["seglsForText"] = function (text)
    {
        return kseg.segls(text.replace(/\x1b/g,'�'))
    }

    text["colorSeglsForText"] = function (text)
    {
        var ansisub, clr, colors, idx, lcl, li, line, noansi, pattern, removed, segls, _74_29_, _84_29_

        colors = []
        segls = []
        pattern = /\x1b\[((?:\d{1,3};?)+)m/gu
        var list = _k_.list(this.linesForText(text))
        for (li = 0; li < list.length; li++)
        {
            line = list[li]
            ansisub = function (m, c, x)
            {
                var cs, l, _42_35_, _48_35_, _54_35_, _57_35_

                cs = c.split(';').map(function (c)
                {
                    return parseInt(c)
                })
                l = m.length
                switch (cs[0])
                {
                    case 38:
                        colors[li] = ((_42_35_=colors[li]) != null ? _42_35_ : [])
                        if (cs.length === 5)
                        {
                            colors[li].push({x:x,l:l,fg:cs.slice(2, 5)})
                        }
                        else
                        {
                            colors[li].push({x:x,l:l,fg:color.ansi256[cs[2]]})
                        }
                        break
                    case 48:
                        colors[li] = ((_48_35_=colors[li]) != null ? _48_35_ : [])
                        if (cs.length === 5)
                        {
                            colors[li].push({x:x,l:l,bg:cs.slice(2, 5)})
                        }
                        else
                        {
                            colors[li].push({x:x,l:l,bg:color.ansi256[cs[2]]})
                        }
                        break
                    case 39:
                        colors[li] = ((_54_35_=colors[li]) != null ? _54_35_ : [])
                        colors[li].push({x:x,l:l,fg:-1})
                        break
                    case 49:
                        colors[li] = ((_57_35_=colors[li]) != null ? _57_35_ : [])
                        colors[li].push({x:x,l:l,bg:-1})
                        break
                }

                return ''
            }
            pattern.lastIndex = 0
            noansi = line.replaceAll(pattern,ansisub)
            if (!_k_.empty(colors[li]))
            {
                lcl = colors[li]
                removed = 0
                idx = 0
                while (idx < lcl.length)
                {
                    clr = lcl[idx]
                    clr.x -= removed
                    removed += clr.l
                    delete clr.l
                    if ((clr.fg != null))
                    {
                        if (idx > 0 && lcl[idx - 1].fg)
                        {
                            lcl[idx - 1].w = clr.x - lcl[idx - 1].x
                        }
                        else if (idx > 1 && lcl[idx - 2].fg)
                        {
                            lcl[idx - 2].w = clr.x - lcl[idx - 2].x
                        }
                        if (clr.fg === -1)
                        {
                            lcl.splice(idx,1)
                            continue
                        }
                    }
                    if ((clr.bg != null))
                    {
                        if (idx > 0 && lcl[idx - 1].bg)
                        {
                            lcl[idx - 1].w = clr.x - lcl[idx - 1].x
                        }
                        else if (idx > 1 && lcl[idx - 2].bg)
                        {
                            lcl[idx - 2].w = clr.x - lcl[idx - 2].x
                        }
                        if (clr.bg === -1)
                        {
                            lcl.splice(idx,1)
                            continue
                        }
                    }
                    idx += 1
                }
            }
            segls.push(kseg(noansi))
        }
        return [colors,segls]
    }

    text["seglsForLineRange"] = function (lines, rng)
    {
        var l, y

        if (_k_.empty(lines) || _k_.empty(rng))
        {
            return ''
        }
        l = []
        for (var _a_ = y = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? y <= rng[3] : y >= rng[3]); (_a_ <= _b_ ? ++y : --y))
        {
            if (this.isInvalidLineIndex(lines,y))
            {
                continue
            }
            if (y === rng[1])
            {
                if (y === rng[3])
                {
                    l.push(lines[y].slice(rng[0], typeof rng[2] === 'number' ? rng[2] : -1))
                }
                else
                {
                    l.push(lines[y].slice(rng[0]))
                }
            }
            else if (y === rng[3])
            {
                l.push(lines[y].slice(0, typeof rng[2] === 'number' ? rng[2] : -1))
            }
            else
            {
                l.push(lines[y])
            }
            if (y < rng[3])
            {
                l.push('\n')
            }
        }
        return l
    }

    text["segsForLineSpan"] = function (lines, span)
    {
        var l, y

        l = []
        if (_k_.empty(lines) || _k_.empty(span))
        {
            return l
        }
        y = span[1]
        if (this.isInvalidLineIndex(lines,y))
        {
            return l
        }
        return lines[y].slice(span[0], typeof span[2] === 'number' ? span[2] : -1)
    }

    text["segsForPositions"] = function (lines, posl)
    {
        var l, pos, segi

        l = []
        if (_k_.empty(lines) || _k_.empty(posl))
        {
            return l
        }
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (this.isInvalidLineIndex(lines,pos[1]))
            {
                return l
            }
            segi = kseg.segiAtWidth(lines[pos[1]],pos[0])
            l.push(lines[pos[1]][segi])
        }
        return l
    }

    text["textForLineRange"] = function (lines, rng)
    {
        var l, s, y

        if (_k_.empty(lines) || _k_.empty(rng))
        {
            return ''
        }
        l = []
        for (var _a_ = y = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? y <= rng[3] : y >= rng[3]); (_a_ <= _b_ ? ++y : --y))
        {
            if (this.isInvalidLineIndex(lines,y))
            {
                continue
            }
            if (y === rng[1])
            {
                if (y === rng[3])
                {
                    l.push(lines[y].slice(rng[0], typeof rng[2] === 'number' ? rng[2] : -1))
                }
                else
                {
                    l.push(lines[y].slice(rng[0]))
                }
            }
            else if (y === rng[3])
            {
                l.push(lines[y].slice(0, typeof rng[2] === 'number' ? rng[2] : -1))
            }
            else
            {
                l.push(lines[y])
            }
        }
        s = kseg.str(l)
        return s
    }

    text["textForLineRanges"] = function (lines, rngs)
    {
        var rng, text

        if (_k_.empty(lines))
        {
            return ''
        }
        text = ''
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            text += this.textForLineRange(lines,rng)
            text += '\n'
        }
        return text.slice(0, -1)
    }

    text["textForSpans"] = function (lines, spans)
    {
        return this.textForLineRanges(lines,this.rangesForSpans(spans))
    }

    text["lineSpansForText"] = function (lines, text)
    {
        var line, spans, x1, x2, y

        spans = []
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            line = list[y]
            line = kseg.str(line)
            x2 = 0
            while (true)
            {
                x1 = line.indexOf(text,x2)
                if (x1 < 0)
                {
                    break
                }
                x2 = x1 + text.length
                spans.push([x1,y,x2])
            }
        }
        return spans
    }

    text["textFromBolToPos"] = function (lines, pos)
    {
        return lines[pos[1]].slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
    }

    text["textFromPosToEol"] = function (lines, pos)
    {
        return lines[pos[1]].slice(pos[0])
    }

    text["isOnlyWhitespace"] = function (text)
    {
        return /^\s+$/.test(kseg.str(text))
    }

    text["numIndent"] = function (segs)
    {
        return kseg.numIndent(segs)
    }

    text["splitLineIndent"] = function (str)
    {
        return kseg.splitAtIndent(str)
    }

    text["reindent"] = function (oldIndent, newIndent, str)
    {
        var indent, rest

        var _a_ = this.splitLineIndent(str); indent = _a_[0]; rest = _a_[1]

        return _k_.lpad(parseInt(indent.length * newIndent / oldIndent)) + rest
    }

    text["numIndentOfLines"] = function (lines)
    {
        var line

        var list = _k_.list(lines)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            line = list[_a_]
            if (_k_.empty(_k_.trim(line)))
            {
                continue
            }
            return this.numIndent(line)
        }
        return 0
    }

    text["lineIndentAtPos"] = function (lines, pos)
    {
        return this.numIndent(lines[pos[1]])
    }

    text["indentLines"] = function (lines, num = 4)
    {
        return lines.map(function (l)
        {
            return _k_.lpad(num).split('').concat(l)
        })
    }

    text["seglRangeAtPos"] = function (segls, pos)
    {
        return [0,pos[1],segls[pos[1]].length,pos[1]]
    }

    text["lineRangeAtPos"] = function (lines, pos)
    {
        return [0,pos[1],kseg.width(lines[pos[1]]),pos[1]]
    }

    text["lineRangesForPositions"] = function (lines, posl, append)
    {
        var rngs

        rngs = this.lineIndicesForPositions(posl).map(function (y)
        {
            return (lines[y].length ? [0,y,lines[y].length,y] : [0,y,0,y + 1])
        })
        if (!_k_.empty(rngs) && append)
        {
            rngs.slice(-1)[0][2] = 0
            rngs.slice(-1)[0][3] += 1
        }
        return rngs
    }

    text["numFullLinesInRange"] = function (lines, rng)
    {
        var d, n

        d = rng[3] - rng[1]
        if (d === 0)
        {
            return rng[0] === 0 && (rng[2] === lines[rng[1]].length ? 1 : 0)
        }
        n = 0
        if (rng[0] === 0)
        {
            n += 1
        }
        if (d > 1)
        {
            n += d - 2
        }
        if (rng[2] === lines[rng[3]].length)
        {
            n += 1
        }
        return n
    }

    text["numLinesInRange"] = function (rng)
    {
        return rng[3] - rng[1] + 1
    }

    text["isEmptyLineAtPos"] = function (lines, pos)
    {
        return lines[pos[1]].length <= 0
    }

    text["lineRangesInRange"] = function (lines, rng)
    {
        var ln, rngs

        rngs = []
        for (var _a_ = ln = 0, _b_ = this.numLinesInRange(rng); (_a_ <= _b_ ? ln < this.numLinesInRange(rng) : ln > this.numLinesInRange(rng)); (_a_ <= _b_ ? ++ln : --ln))
        {
            rngs.push(this.lineRangeAtPos(lines,[0,rng[1] + ln]))
        }
        return rngs
    }

    text["seglsForRange"] = function (lines, rng)
    {
        var bos, eos, firstLineIndex, lastLineIndex, lns, nl, segi

        nl = this.numLinesInRange(rng)
        if (nl === 1)
        {
            bos = kseg.segiAtWidth(lines[rng[1]],rng[0])
            eos = kseg.segiAtWidth(lines[rng[1]],rng[2])
            return [lines[rng[1]].slice(bos, typeof eos === 'number' ? eos : -1)]
        }
        firstLineIndex = _k_.min(rng[1],lines.length - 1)
        lastLineIndex = _k_.min(rng[3],lines.length - 1)
        segi = kseg.segiAtWidth(lines[firstLineIndex],rng[0])
        lns = [lines[firstLineIndex].slice(segi)]
        if (nl > 2)
        {
            lns = lns.concat(lines.slice(firstLineIndex + 1, typeof lastLineIndex === 'number' ? lastLineIndex : -1))
        }
        segi = kseg.indexAtWidth(lines[lastLineIndex],rng[2])
        return lns = lns.concat([lines[lastLineIndex].slice(0, typeof segi === 'number' ? segi : -1)])
    }

    text["indexOfLongestLine"] = function (lines)
    {
        var index, line, maxIndex, maxLength, w

        maxIndex = 0
        maxLength = 0
        var list = _k_.list(lines)
        for (index = 0; index < list.length; index++)
        {
            line = list[index]
            w = kseg.width(line)
            if (w > maxLength)
            {
                maxLength = w
                maxIndex = index
            }
        }
        return maxIndex
    }

    text["widthOfLines"] = function (lines)
    {
        return kseg.width(lines[this.indexOfLongestLine(lines)])
    }

    text["widthOfLinesIncludingColorBubbles"] = function (lines)
    {
        var line, maxWidth, w

        maxWidth = 0
        var list = _k_.list(lines)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            line = list[_a_]
            w = kseg.width(line)
            if (line.indexOf('#') >= 0)
            {
                w += 4
            }
            if (w > maxWidth)
            {
                maxWidth = w
            }
        }
        return maxWidth
    }

    text["diffLines"] = function (oldLines, newLines)
    {
        var changes, deletes, inserts, ni, nl, oi, ol

        changes = []
        inserts = []
        deletes = []
        oi = 0
        ni = 0
        if (oldLines !== newLines)
        {
            ol = oldLines[oi]
            nl = newLines[ni]
            while (oi < oldLines.length)
            {
                if (!(nl != null))
                {
                    deletes.push(oi)
                    oi += 1
                }
                else if (ol === nl)
                {
                    oi += 1
                    ni += 1
                    ol = oldLines[oi]
                    nl = newLines[ni]
                }
                else
                {
                    if (nl === oldLines[oi + 1] && ol === newLines[ni + 1])
                    {
                        changes.push(ni)
                        oi += 1
                        ni += 1
                        changes.push(ni)
                        oi += 1
                        ni += 1
                        ol = oldLines[oi]
                        nl = newLines[ni]
                    }
                    else if (nl === oldLines[oi + 1] && oldLines[oi + 1] !== newLines[ni + 1])
                    {
                        deletes.push(oi)
                        oi += 1
                        ol = oldLines[oi]
                    }
                    else if (ol === newLines[ni + 1] && oldLines[oi + 1] !== newLines[ni + 1])
                    {
                        inserts.push(ni)
                        ni += 1
                        nl = newLines[ni]
                    }
                    else
                    {
                        changes.push(ni)
                        oi += 1
                        ol = oldLines[oi]
                        ni += 1
                        nl = newLines[ni]
                    }
                }
            }
            while (ni < newLines.length)
            {
                inserts.push(ni)
                ni += 1
                nl = newLines[ni]
            }
        }
        return {chg:changes,ins:inserts,del:deletes}
    }

    text["beforeAndAfterForPos"] = function (lines, pos)
    {
        var after, before, line

        line = lines[pos[1]]
        before = line.slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
        after = line.slice(pos[0])
        return [before,after]
    }

    text["joinLineColumns"] = function (lineCols)
    {
        var cidx, i, lidx, line, lines, numCols, numLines

        for (var _a_ = i = 0, _b_ = lineCols.length - 1; (_a_ <= _b_ ? i < lineCols.length - 1 : i > lineCols.length - 1); (_a_ <= _b_ ? ++i : --i))
        {
            _k_.assert("/home/kodi/s/ked/kode/ked/edit/tool/text.kode", 402, 8, "assert failed!" + " lineCols[i].length === lineCols[i + 1].length", lineCols[i].length === lineCols[i + 1].length)
        }
        numLines = lineCols[0].length
        numCols = lineCols.length
        lines = []
        for (var _c_ = lidx = 0, _d_ = numLines; (_c_ <= _d_ ? lidx < numLines : lidx > numLines); (_c_ <= _d_ ? ++lidx : --lidx))
        {
            line = ''
            for (var _e_ = cidx = 0, _f_ = numCols; (_e_ <= _f_ ? cidx < numCols : cidx > numCols); (_e_ <= _f_ ? ++cidx : --cidx))
            {
                line += lineCols[cidx][lidx]
            }
            lines.push(line)
        }
        return lines
    }

    text["splitTextAtCols"] = function (text, cols)
    {
        var col, idx, prv, spans

        spans = []
        var list = _k_.list(cols)
        for (idx = 0; idx < list.length; idx++)
        {
            col = list[idx]
            prv = (idx > 0 ? cols[idx - 1] : 0)
            spans.push(text.slice(prv, typeof col === 'number' ? col : -1))
        }
        spans.push(text.slice(col))
        return spans
    }

    text["splitLinesAtCols"] = function (lines, cols)
    {
        var cls, i, idx, line, span, spans

        cls = []
        for (var _a_ = i = 0, _b_ = cols.length; (_a_ <= _b_ ? i <= cols.length : i >= cols.length); (_a_ <= _b_ ? ++i : --i))
        {
            cls.push([])
        }
        var list = _k_.list(lines)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            line = list[_c_]
            spans = this.splitTextAtCols(line,cols)
            var list1 = _k_.list(spans)
            for (idx = 0; idx < list1.length; idx++)
            {
                span = list1[idx]
                cls[idx].push(span)
            }
        }
        return cls
    }

    text["splitLineRange"] = function (lines, rng, includeEmpty = true)
    {
        var i, nl, split

        nl = this.numLinesInRange(rng)
        if (nl === 1)
        {
            return [rng]
        }
        split = []
        split.push([rng[0],rng[1],kseg.width(lines[rng[1]]),rng[1]])
        if (nl > 2)
        {
            for (var _a_ = i = 1, _b_ = nl - 2; (_a_ <= _b_ ? i <= nl - 2 : i >= nl - 2); (_a_ <= _b_ ? ++i : --i))
            {
                split.push([0,rng[1] + i,kseg.width(lines[rng[1] + i]),rng[1] + i])
            }
        }
        if (includeEmpty || rng[2] > 0)
        {
            split.push([0,rng[3],rng[2],rng[3]])
        }
        return split
    }

    text["splitLineRanges"] = function (lines, rngs, includeEmpty = true)
    {
        var rng, split

        split = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            split = split.concat(this.splitLineRange(lines,rng,includeEmpty))
        }
        return split
    }

    text["isLinesPosInside"] = function (lines, pos)
    {
        return pos[1] < lines.length && (0 <= pos[0] && pos[0] <= kseg.width(lines[pos[1]]))
    }

    text["isLinesPosOutside"] = function (lines, pos)
    {
        return !this.isLinesPosInside(lines,pos)
    }

    text["isValidLineIndex"] = function (lines, li)
    {
        return (0 <= li && li < lines.length)
    }

    text["isInvalidLineIndex"] = function (lines, li)
    {
        return !this.isValidLineIndex(lines,li)
    }

    text["isMultiLineRange"] = function (lines, rng)
    {
        return rng[1] !== rng[3]
    }

    text["isFullLineRange"] = function (lines, rng)
    {
        return ((0 <= rng[1] && (rng[1] <= rng[3] && rng[3] < lines.length))) && (rng[0] === 0) && (rng[2] >= lines[rng[3]].length || rng[2] === 0 && rng[1] < rng[3])
    }

    text["isSpanLineRange"] = function (lines, rng)
    {
        return ((0 <= rng[1] && (rng[1] === rng[3] && rng[3] < lines.length))) && (rng[0] > 0 || rng[2] < lines[rng[1]].length)
    }

    text["rangeOfLine"] = function (lines, y)
    {
        return [0,y,kseg.width(lines[y]),y]
    }

    text["rangeOfClosestChunkToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestChunk(lines[y],x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
    }

    text["rangeOfClosestChunkLeftToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestChunk(lines[y].slice(0, typeof x === 'number' ? x : -1),x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
    }

    text["rangeOfClosestChunkRightToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestChunk(lines[y].slice(x),x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
    }

    text["wordAtPos"] = function (lines, pos)
    {
        var rng

        if (rng = this.rangeOfClosestWordToPos(lines,pos))
        {
            return kseg.str(this.segsForLineSpan(lines,rng))
        }
        return ''
    }

    text["chunkBeforePos"] = function (lines, pos)
    {
        var before, tcc

        before = lines[pos[1]].slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
        if (tcc = kseg.tailCountChunk(before))
        {
            return kseg.str(before.slice(before.length - tcc))
        }
        return ''
    }

    text["chunkAfterPos"] = function (lines, pos)
    {
        var after, hcc

        after = lines[pos[1]].slice(pos[0])
        if (hcc = kseg.headCountChunk(after))
        {
            return kseg.str(after.slice(0, typeof hcc === 'number' ? hcc : -1))
        }
        return ''
    }

    text["rangeOfClosestWordToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kseg.spanForClosestWordAtColumn(lines[y],x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
    }

    text["rangeOfWhitespaceLeftToPos"] = function (lines, pos)
    {
        var left, segi, tc, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,lines[y].length,x)
        if (x <= 0)
        {
            return [x,y,x,y]
        }
        segi = kseg.indexAtWidth(lines[y],x)
        left = lines[y].slice(0, typeof segi === 'number' ? segi : -1)
        if (tc = kseg.tailCount(left,' '))
        {
            return [segi - tc,y,segi,y]
        }
        return [x,y,x,y]
    }

    text["rangeOfWordOrWhitespaceLeftToPos"] = function (lines, pos)
    {
        var left, segi, tc, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (x <= 0 || this.isInvalidLineIndex(lines,y))
        {
            return
        }
        segi = kseg.indexAtWidth(lines[y],x)
        left = lines[y].slice(0, typeof segi === 'number' ? segi : -1)
        if (tc = kseg.tailCount(left,' '))
        {
            return [segi - tc,y,segi,y]
        }
        if (tc = kseg.tailCountWord(left))
        {
            return [segi - tc,y,segi,y]
        }
        return [segi - 1,y,segi,y]
    }

    text["rangeOfWordOrWhitespaceRightToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (x < 0 || this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestWord(lines[y].slice(x),0))
        {
            if ((0 === r[0] && r[0] < r[1]))
            {
                return [x,y,r[1] + x,y]
            }
            if (r[0] > 0)
            {
                return [x,y,r[0] + x,y]
            }
        }
        return [x,y,lines[y].length,y]
    }

    text["lineChar"] = function (line, x)
    {
        if ((0 <= x && x < line.length))
        {
            return line[x]
        }
    }

    text["categoryForChar"] = function (char)
    {
        if (_k_.empty(char))
        {
            return 'empty'
        }
        else if (/\s+/.test(char))
        {
            return 'ws'
        }
        else if (/\w+/.test(char))
        {
            return 'word'
        }
        return 'punct'
    }

    text["jumpDelta"] = function (line, px, dx, jump)
    {
        var cat, ci, nc

        if (dx > 0)
        {
            ci = px
            if (nc = cat = this.categoryForChar(this.lineChar(line,ci)))
            {
                if (!(_k_.in(cat,jump)))
                {
                    return dx
                }
                while (true)
                {
                    ci += dx
                    nc = this.categoryForChar(this.lineChar(line,ci))
                    if (nc !== cat)
                    {
                        break
                    }
                    if (ci <= 0)
                    {
                        break
                    }
                    if (nc === 'empty')
                    {
                        return 1
                    }
                }
            }
            return ci - px
        }
        else
        {
            ci = px - 1
            if (ci < 0)
            {
                return 0
            }
            if (ci >= line.length && _k_.in('empty',jump))
            {
                return line.length - ci - 1
            }
            cat = this.categoryForChar(this.lineChar(line,ci))
            if (!(_k_.in(cat,jump)))
            {
                return dx
            }
            while ((0 <= ci && ci < line.length) && this.categoryForChar(this.lineChar(line,ci)) === cat)
            {
                ci += dx
            }
            return _k_.min(dx,ci - px + 1)
        }
    }

    text["numCharsFromPosToWordOrPunctInDirection"] = function (lines, pos, dir, opt)
    {
        var dx

        dx = (dir === 'left' ? -1 : 1)
        if ((opt != null ? opt.jump : undefined))
        {
            return this.jumpDelta(lines[pos[1]],pos[0],dx,opt.jump)
        }
        if (pos[0] + dx < 0)
        {
            return 0
        }
        return dx
    }

    return text
})()

export default text;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3RleHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFlBQVQ7OztBQUVELFFBQVQ7Ozs7O0lBRUksTUFBQywyQkFBYzs7ZUFBUSxLQUFLLE1BQU07OztJQUVsQyxNQUFDLHdCQUFXLE9BQU0sT0FBSzs7WUFFUCxVQUFUOztZQUNDLFFBQVEsS0FBSyxNQUFNOztlQUN2QixNQUFNLEtBQUs7OztJQUVmLE1BQUMsMkJBQWM7O2VBRVgsS0FBSyxNQUFNLEtBQUssUUFBUSxRQUFROzs7SUFFcEMsTUFBQyxnQ0FBbUI7Ozs7UUFFaEI7UUFDQTtRQUVBLFVBQVU7NEJBRUssS0FBQyxhQUFhO2FBQXBCOztZQUFMO1lBRUEsb0JBQVUsR0FBRSxHQUFFOzs7O2dCQUVWLEtBQUssRUFBRSxNQUFNLEtBQUssY0FBSzs7b0NBQVU7O2dCQUVqQyxJQUFJLEVBQUU7d0JBQ0MsR0FBRzs7eUJBQ047d0JBQ0ksT0FBTyxnQkFBUCxPQUFPOzRCQUNKLEdBQUcsV0FBVTs7NEJBQ1osT0FBTyxJQUFJLE1BQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLFNBQUc7Ozs7NEJBRTlCLE9BQU8sSUFBSSxNQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxNQUFNLFFBQVEsR0FBRzs7O3lCQUNwRDt3QkFDSSxPQUFPLGdCQUFQLE9BQU87NEJBQ0osR0FBRyxXQUFVOzs0QkFDWixPQUFPLElBQUksTUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsU0FBRzs7Ozs0QkFFOUIsT0FBTyxJQUFJLE1BQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLE1BQU0sUUFBUSxHQUFHOzs7eUJBQ3BEO3dCQUNJLE9BQU8sZ0JBQVAsT0FBTzt3QkFDUCxPQUFPLElBQUksTUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUc7O3lCQUMvQjt3QkFDSSxPQUFPLGdCQUFQLE9B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/text.kode
