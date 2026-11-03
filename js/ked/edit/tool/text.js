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
            return [0,y,lines[y].length,y]
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
