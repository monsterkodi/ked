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
            _k_.assert("kode/ked/edit/tool/text.kode", 406, 8, "assert failed!" + " lineCols[i].length === lineCols[i + 1].length", lineCols[i].length === lineCols[i + 1].length)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3RleHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBYzJCLEtBQUssTUFBTTs7Ozs7c0JBSTNCOztZQUNDLFFBQVEsS0FBSyxNQUFNOztlQUN2QixNQUFNLEtBQUs7Ozs7O2VBSVgsS0FBSyxNQUFNLEtBQUssUUFBUSxRQUFROzs7Ozs7O1FBSWhDO1FBQ0E7UUFFQSxVQUFVOzRCQUVLLEtBQUMsYUFBYTs7OztZQUV6Qjs7OztnQkFFSSxLQUFLLEVBQUUsTUFBTSxLQUFLOztvQ0FBZTs7Z0JBRWpDLElBQUksRUFBRTt3QkFDQyxHQUFHOzt5QkFDTjt3QkFDSSxPQUFPLGdCQUFQLE9BQU87NEJBQ0osR0FBRyxXQUFVOzs0QkFDWixPQUFPLElBQUksTUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsU0FBRzs7Ozs0QkFFOUIsT0FBTyxJQUFJLE1BQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLE1BQU0sUUFBUSxHQUFHOzs7eUJBQ3BEO3dCQUNJLE9BQU8sZ0JBQVAsT0FBTzs0QkFDSixHQUFHLFdBQVU7OzRCQUNaLE9BQU8sSUFBSSxNQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxTQUFHOzs7OzRCQUU5QixPQUFPLElBQUksTUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsTUFBTSxRQUFRLEdBQUc7Ozt5QkFDcEQ7d0JBQ0ksT0FBTyxnQkFBUCxPQUFPO3dCQUNQLE9BQU8sSUFBSSxNQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRzs7eUJBQy9CO3dCQUNJLE9BQU8sZ0JBQVAsT0FBTzt3QkFDUCxPQUFPLElBQUksTUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUc7Ozs7dUJBQ25DOztZQUVKLFFBQVEsWUFBWTtZQUNwQixTQUFTLEtBQUssV0FBVyxRQUFROzJCQUV4QixPQUFPOztnQkFDWixNQUFNLE9BQU87Z0JBQ2Is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
//# sourceURL=file://kode/ked/edit/tool/text.kode
