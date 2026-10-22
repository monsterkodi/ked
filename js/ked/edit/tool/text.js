var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var text

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kutil = kxk.kutil
let kseg = kxk.kseg

import color from "../../theme/color.js"

import belt from "./belt.js"


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
        var ansisub, clr, colors, idx, lcl, li, line, noansi, pattern, removed, segls, _75_29_, _85_29_

        colors = []
        segls = []
        pattern = /\x1b\[((?:\d{1,3};?)+)m/gu
        var list = _k_.list(this.linesForText(text))
        for (li = 0; li < list.length; li++)
        {
            line = list[li]
            ansisub = function (m, c, x)
            {
                var cs, l, _43_35_, _49_35_, _55_35_, _58_35_

                cs = c.split(';').map(function (c)
                {
                    return parseInt(c)
                })
                l = m.length
                switch (cs[0])
                {
                    case 38:
                        colors[li] = ((_43_35_=colors[li]) != null ? _43_35_ : [])
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
                        colors[li] = ((_49_35_=colors[li]) != null ? _49_35_ : [])
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
                        colors[li] = ((_55_35_=colors[li]) != null ? _55_35_ : [])
                        colors[li].push({x:x,l:l,fg:-1})
                        break
                    case 49:
                        colors[li] = ((_58_35_=colors[li]) != null ? _58_35_ : [])
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
            _k_.assert("/home/kodi/s/ked/kode/ked/edit/tool/text.kode", 403, 8, "assert failed!" + " lineCols[i].length === lineCols[i + 1].length", lineCols[i].length === lineCols[i + 1].length)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3RleHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsWUFBVDs7T0FDUyxXQUFBOzs7QUFFVixRQUFUOzs7OztJQUVJLE1BQUMsMkJBQWM7O2VBQVEsS0FBSyxNQUFNOzs7SUFFbEMsTUFBQyx3QkFBVyxPQUFNLE9BQUs7O1lBRVAsVUFBVDs7WUFDQyxRQUFRLEtBQUssTUFBTTs7ZUFDdkIsTUFBTSxLQUFLOzs7SUFFZixNQUFDLDJCQUFjOztlQUVYLEtBQUssTUFBTSxLQUFLLFFBQVEsUUFBUTs7O0lBRXBDLE1BQUMsZ0NBQW1COzs7O1FBRWhCO1FBQ0E7UUFFQSxVQUFVOzRCQUVLLEtBQUMsYUFBYTthQUFwQjs7WUFBTDtZQUVBLG9CQUFVLEdBQUUsR0FBRTs7OztnQkFFVixLQUFLLEVBQUUsTUFBTSxLQUFLLGNBQUs7O29DQUFVOztnQkFFakMsSUFBSSxFQUFFO3dCQUNDLEdBQUc7O3lCQUNOO3dCQUNJLE9BQU8sZ0JBQVAsT0FBTzs0QkFDSixHQUFHLFdBQVU7OzRCQUNaLE9BQU8sSUFBSSxNQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxTQUFHOzs7OzRCQUU5QixPQUFPLElBQUksTUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsTUFBTSxRQUFRLEdBQUc7Ozt5QkFDcEQ7d0JBQ0ksT0FBTyxnQkFBUCxPQUFPOzRCQUNKLEdBQUcsV0FBVTs7NEJBQ1osT0FBTyxJQUFJLE1BQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLFNBQUc7Ozs7NEJBRTlCLE9BQU8sSUFBSSxNQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxNQUFNLFFBQVEsR0FBRzs7O3lCQUNwRDt3QkFDSSxPQUFPLGdCQUFQLE9BQU87d0JBQ1AsT0FBTyxJQUFJLE1BQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHOzt5QkFDL0I7d0JB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/text.kode
