var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var edit

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg

import prof from "../../util/prof.js"


edit = (function ()
{
    function edit ()
    {}

    edit["insertTextAtPositions"] = function (lines, text, posl)
    {
        var after, before, idx, indent, insertLineIndex, insl, lidx, line, newls, newpl, nextLineIndent, pos, posLineIndent, rng, rngs, txtls, x, y

        if (_k_.empty(text))
        {
            return [lines,posl]
        }
        if (text === '\t')
        {
            pos = posl[0]
            text = _k_.lpad(4 - pos[0] % 4,' ')
        }
        text = kstr.detab(text)
        txtls = this.seglsForText(text)
        newls = []
        newpl = []
        rngs = this.rangesForLinesSplitAtPositions(lines,posl)
        before = []
        var list = _k_.list(rngs)
        for (idx = 0; idx < list.length; idx++)
        {
            rng = list[idx]
            after = this.seglsForRange(lines,rng)
            if (_k_.empty(after) || _k_.empty(after[0]))
            {
                if (posl.slice(-1)[0][1] >= lines.length)
                {
                    before.push([])
                }
            }
            if (idx > 0)
            {
                ;[x,y] = posl[idx - 1]
                if (!_k_.empty(before))
                {
                    line = before.pop()
                }
                else
                {
                    line = newls.pop()
                }
                if (x > kseg.width(line) && text !== '\n')
                {
                    line = line.concat(_k_.lpad(x - line.length).split(''))
                }
                if (txtls.length > 1)
                {
                    if (posl.length > 1 && text !== '\n')
                    {
                        insertLineIndex = (idx - 1) % txtls.length
                        before.push(line.concat(txtls[insertLineIndex]))
                        newpl.push([kseg.width(_k_.last(before)),newls.length + before.length - 1])
                        before.push(before.pop().concat(after.shift()))
                    }
                    else
                    {
                        posLineIndent = this.numIndent(line)
                        if (posl.length === 1 && text === '\n' && posl[0][0] > posLineIndent)
                        {
                            nextLineIndent = this.numIndentBelowPos(lines,posl[0])
                            if (nextLineIndent > posLineIndent)
                            {
                                posLineIndent = nextLineIndent
                            }
                        }
                        indent = kseg(_k_.lpad(posLineIndent))
                        before.push(line.concat(txtls[0]))
                        var list1 = _k_.list(txtls.slice(1))
                        for (lidx = 0; lidx < list1.length; lidx++)
                        {
                            insl = list1[lidx]
                            if (lidx < txtls.length - 2 || !_k_.empty(insl) || text === '\n')
                            {
                                before.push(indent.concat(insl))
                            }
                        }
                        if (x > posLineIndent)
                        {
                            newpl.push([kseg.width(_k_.last(before)),newls.length + before.length - 1])
                            before.push(before.pop().concat(after.shift()))
                        }
                        else
                        {
                            after.unshift(indent.concat(after.shift()))
                            if (text === '\n')
                            {
                                before.pop()
                            }
                            newpl.push([kseg.width(indent),newls.length + before.length])
                        }
                    }
                    newls = newls.concat(before)
                }
                else
                {
                    newpl.push([kseg.width(line) + kseg.width(txtls[0]),newls.length + before.length])
                    line = line.concat(txtls[0])
                    line = line.concat(after.shift())
                    newls = newls.concat(before)
                    newls.push(line)
                }
            }
            before = after
        }
        if (posl.slice(-1)[0][1] < lines.length)
        {
            newls = newls.concat(before)
        }
        return [newls,newpl]
    }

    edit["insertSurroundAtRanges"] = function (lines, rngs, trigger, pair)
    {
        var begl, endl, idx, pos

        begl = this.startPositionsOfRanges(rngs)
        ;[lines,begl] = this.insertTextAtPositions(lines,pair[0],begl)
        endl = []
        var list = _k_.list(begl)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            endl.push([pos[0] + rngs[idx][2] - rngs[idx][0],pos[1]])
        }
        ;[lines,endl] = this.insertTextAtPositions(lines,pair[1],endl)
        if (pair[0][0] === trigger && pair[0] !== pair[1])
        {
            return [lines,begl]
        }
        else
        {
            return [lines,endl]
        }
    }

    edit["deleteLineRangesAndAdjustPositions"] = function (lines, rngs, posl, linewise = true)
    {
        var partialLast, ri, rng

        lines = lines.map(function (l)
        {
            return l
        })
        posl = _k_.clone(posl)
        if (_k_.empty(rngs))
        {
            return [lines,posl]
        }
        for (var _a_ = ri = rngs.length - 1, _b_ = 0; (_a_ <= _b_ ? ri <= 0 : ri >= 0); (_a_ <= _b_ ? ++ri : --ri))
        {
            rng = rngs[ri]
            if (rng[1] >= lines.length || rng[3] >= lines.length)
            {
                console.warn("range out of bounds?",rng)
                continue
            }
            posl = this.adjustPositionsForDeletedLineRange(posl,lines,rng)
            if (rng[1] === rng[3])
            {
                if (linewise && rng[0] === 0 && rng[2] === lines[rng[1]].length)
                {
                    lines.splice(rng[1],1)
                }
                else
                {
                    lines.splice(rng[1],1,lines[rng[1]].slice(0, typeof rng[0] === 'number' ? rng[0] : -1).concat(lines[rng[1]].slice(rng[2])))
                }
            }
            else
            {
                if (rng[2] === lines[rng[3]].length)
                {
                    lines.splice(rng[3],1)
                }
                else
                {
                    lines.splice(rng[3],1,lines[rng[3]].slice(rng[2]))
                    partialLast = true
                }
                if (rng[3] - rng[1] >= 2)
                {
                    lines.splice(rng[1] + 1,rng[3] - rng[1] - 1)
                }
                if (rng[0] === 0)
                {
                    lines.splice(rng[1],1)
                }
                else
                {
                    lines.splice(rng[1],1,lines[rng[1]].slice(0, typeof rng[0] === 'number' ? rng[0] : -1))
                    if (partialLast)
                    {
                        lines.splice(rng[1],2,lines[rng[1]].concat(lines[rng[1] + 1]))
                    }
                }
            }
        }
        return [lines,posl]
    }

    edit["adjustPositionsForDeletedLineRange"] = function (posl, lines, rng)
    {
        var pi, pos

        if (_k_.empty(posl))
        {
            return posl
        }
        for (var _a_ = pi = posl.length - 1, _b_ = 0; (_a_ <= _b_ ? pi <= 0 : pi >= 0); (_a_ <= _b_ ? ++pi : --pi))
        {
            pos = posl[pi]
            if (this.isPosTouchingRange(pos,rng))
            {
                pos[0] = rng[0]
                pos[1] = rng[1]
            }
            else if (this.isPosAfterRange(pos,rng))
            {
                if (pos[1] === rng[3])
                {
                    pos[0] -= rng[2] - rng[0]
                    if (rng[1] < rng[3])
                    {
                        pos[1] -= rng[3] - rng[1]
                    }
                }
                else
                {
                    pos[1] -= this.numFullLinesInRange(lines,rng)
                }
            }
            else
            {
                break
            }
        }
        return this.removeDuplicatePositions(posl)
    }

    edit["moveCursorsInSameLineBy"] = function (cursors, cursor, delta)
    {
        var ci

        ci = cursors.indexOf(cursor)
        while (true)
        {
            cursors[ci][0] += delta
            ci++
            if (ci >= cursors.length)
            {
                return
            }
            if (cursors[ci][1] > cursor[1])
            {
                return
            }
        }
    }

    edit["addLinesBelowPositionsToRanges"] = function (lines, posl, rngs)
    {
        var addLineAtIndex, c, newp, newr

        newp = []
        newr = rngs.asMutable()
        addLineAtIndex = (function (c, i)
        {
            var range

            range = this.rangeOfLine(lines,i)
            if (this.isEmptyRange(range))
            {
                range[1] += 1
            }
            newr.push(range)
            return newp.push(this.endOfRange(range))
        }).bind(this)
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (!this.rangesContainLine(rngs,c[1]))
            {
                addLineAtIndex(c,c[1])
            }
            else if (c[1] < lines.length - 1)
            {
                addLineAtIndex(c,c[1] + 1)
            }
        }
        if (_k_.empty(newp))
        {
            return [posl,rngs]
        }
        return [newp,newr]
    }

    edit["removeLinesAtPositionsFromRanges"] = function (lines, posl, rngs)
    {
        var idx, newp, newr, pos, rng

        newp = []
        newr = this.splitLineRanges(lines,rngs)
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (rng = this.rangeInRangesTouchingPos(newr,pos))
            {
                idx = newr.indexOf(rng)
                if (idx > 0)
                {
                    newp.push(this.endOfRange(newr[idx - 1]))
                }
                else
                {
                    newp.push(this.endOfRange(newr[idx]))
                }
                newr.splice(idx,1)
            }
            else
            {
                newp.push(pos)
            }
        }
        return [newp,newr]
    }

    edit["rangeForJoiningLine"] = function (lines, idx)
    {
        return [lines[idx].length,idx,0,idx + 1]
    }

    edit["rangesForJoiningLines"] = function (lines, idxs)
    {
        return idxs.map((function (idx)
        {
            return this.rangeForJoiningLine(lines,idx)
        }).bind(this))
    }

    edit["moveLineRangesAndPositionsAtIndicesInDirection"] = function (lines, rngs, posl, indices, dir)
    {
        var d, ii, index, newLines, newPosl, newRngs, pos, re, rng, rs

        if (_k_.empty(indices) || dir === 'down' && indices.slice(-1)[0] >= lines.length - 1 || dir === 'up' && indices[0] <= 0)
        {
            return [lines,rngs,posl]
        }
        newLines = lines.map(function (l)
        {
            return l
        })
        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        ;[rs,re] = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return [indices.length - 1,0]

                case 'up':
                    return [0,indices.length - 1]

            }

        }).bind(this))()
        d = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return 1

                case 'up':
                    return -1

            }

        }).bind(this))()
        for (var _a_ = ii = rs, _b_ = re; (_a_ <= _b_ ? ii <= re : ii >= re); (_a_ <= _b_ ? ++ii : --ii))
        {
            index = indices[ii]
            switch (dir)
            {
                case 'down':
                    newLines.splice(index,2,newLines[index + 1],newLines[index])
                    break
                case 'up':
                    newLines.splice(index - 1,2,newLines[index],newLines[index - 1])
                    break
            }

            var list = _k_.list(newPosl)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                pos = list[_c_]
                if (pos[1] === index)
                {
                    pos[1] += d
                }
            }
            var list1 = _k_.list(newRngs)
            for (var _d_ = 0; _d_ < list1.length; _d_++)
            {
                rng = list1[_d_]
                if (rng[1] === index)
                {
                    rng[1] += d
                    rng[3] += d
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    edit["cloneLineBlockRangesAndMoveRangesAndPositionsInDirection"] = function (lines, blocks, rngs, posl, dir)
    {
        var bi, block, d, insidx, newLines, newPosl, newRngs, pos, re, rng, rs, text

        if (_k_.empty(blocks) || dir === 'down' && blocks.slice(-1)[0][3] > lines.length - 1 || dir === 'up' && blocks[0][1] < 0)
        {
            return [lines,rngs,posl]
        }
        newLines = lines.asMutable()
        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        ;[rs,re] = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return [blocks.length - 1,0]

                case 'up':
                    return [0,blocks.length - 1]

            }

        }).bind(this))()
        d = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return 1

                case 'up':
                    return -1

            }

        }).bind(this))()
        for (var _a_ = bi = rs, _b_ = re; (_a_ <= _b_ ? bi <= re : bi >= re); (_a_ <= _b_ ? ++bi : --bi))
        {
            block = blocks[bi]
            text = this.textForLineRange(newLines,block)
            text += '\n'
            insidx = (dir === 'up' ? block[1] : block[3] + 1)
            ;[newLines,posl] = this.insertTextAtPositions(newLines,text,[[0,insidx]])
            if (dir === 'down')
            {
                d = block[3] - block[1] + 1
                var list = _k_.list(newPosl)
                for (var _c_ = 0; _c_ < list.length; _c_++)
                {
                    pos = list[_c_]
                    if (this.rangeContainsPos(block,pos))
                    {
                        pos[1] += d
                    }
                }
                var list1 = _k_.list(newRngs)
                for (var _d_ = 0; _d_ < list1.length; _d_++)
                {
                    rng = list1[_d_]
                    if (this.rangeContainsRange(block,rng))
                    {
                        rng[1] += d
                        rng[3] += d
                    }
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    edit["toggleCommentsInLineRangesAtIndices"] = function (lines, rngs, posl, indices)
    {
        var comIndent, comment, comStart, d, indent, index, line, minIndent, newLine, newLines, newPosl, newRngs

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = lines.asMutable()
        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        comStart = '#'
        minIndent = Infinity
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            ;[indent,line] = this.splitLineIndent(newLines[index])
            if (!kseg.startsWith(line,comStart))
            {
                comment = comStart
                minIndent = _k_.min(indent.length,minIndent)
            }
        }
        if (comment)
        {
            comIndent = kseg.repeat(minIndent)
        }
        var list1 = _k_.list(indices)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            index = list1[_b_]
            ;[indent,line] = this.splitLineIndent(newLines[index])
            if (comment)
            {
                indent = kseg.repeat(indent.length - minIndent)
                newLine = kseg.join(comIndent,comment,indent,' ',line)
            }
            else
            {
                d = (line[comStart.length] === ' ' ? 1 : 0)
                newLine = kseg.join(indent,line.slice(comStart.length + d))
            }
            newLines.splice(index,1,newLine)
        }
        return [newLines,newRngs,newPosl]
    }

    edit["toggleCommentTypesInLineRangesAtIndices"] = function (lines, rngs, posl, indices)
    {
        var newLines, newPosl, newRngs

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = lines.map(function (l)
        {
            return l
        })
        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        console.log(`todo: toggleCommentTypes ${indices}`)
        return [newLines,newRngs,newPosl]
    }

    edit["deindentLineRangesAndPositionsAtIndices"] = function (lines, rngs, posl, indices)
    {
        var indent, index, line, newLines, newPosl, newRngs, pos, rng, sc

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = lines.map(function (l)
        {
            return l
        })
        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            ;[indent,line] = this.splitLineIndent(newLines[index])
            if (indent.length)
            {
                sc = _k_.min(4,indent.length)
                newLines.splice(index,1,kseg.join(indent.slice(sc),line))
                var list1 = _k_.list(newPosl)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    pos = list1[_b_]
                    if (pos[1] === index)
                    {
                        pos[0] = _k_.max(0,pos[0] - sc)
                    }
                }
                var list2 = _k_.list(newRngs)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    rng = list2[_c_]
                    if (rng[1] === index)
                    {
                        rng[0] = _k_.max(0,rng[0] - sc)
                        rng[2] = _k_.max(0,rng[2] - sc)
                    }
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    edit["indentLineRangesAndPositionsAtIndices"] = function (lines, rngs, posl, indices)
    {
        var indent, index, line, newLines, newPosl, newRngs, pos, rng

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = lines.map(function (l)
        {
            return l
        })
        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            ;[indent,line] = this.splitLineIndent(newLines[index])
            newLines[index] = kseg.join(kseg.repeat(4),newLines[index])
            var list1 = _k_.list(newPosl)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                pos = list1[_b_]
                if (pos[1] === index)
                {
                    pos[0] += 4
                }
            }
            var list2 = _k_.list(newRngs)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                rng = list2[_c_]
                if (rng[1] === index)
                {
                    rng[0] += 4
                    rng[2] += 4
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    edit["extendLineRangesFromPositionToPosition"] = function (lines, rngs, start, pos)
    {
        var newRngs, rng

        if (_k_.empty(rngs))
        {
            return [this.rangeFromStartToEnd(start,pos)]
        }
        newRngs = rngs.asMutable()
        if (rng = this.rangeInRangesTouchingPos(newRngs,start))
        {
            if (this.isPosAfterRange(pos,rng))
            {
                rng[2] = pos[0]
                rng[3] = pos[1]
            }
            else if (this.isPosBeforeRange(pos,rng))
            {
                rng[0] = pos[0]
                rng[1] = pos[1]
            }
        }
        else
        {
            newRngs.push(this.rangeFromStartToEnd(start,pos))
        }
        return newRngs
    }

    edit["extendLineRangesByMovingPositionsInDirection"] = function (lines, rngs, posl, dir, opt, anchors)
    {
        var anch, backtrack, idx, ind, line, nc, newPosl, newRngs, pos, rng

        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        var list = _k_.list(newPosl)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            anch = anchors[idx]
            if (_k_.in(dir,['left','ind_bol','bol','bof']) && (pos[0] > anch[0] || pos[1] > anch[1]))
            {
                backtrack = _k_.copy(pos)
            }
            else if (_k_.in(dir,['right','ind_eol','eol','eof']) && (pos[0] < anch[0] || pos[1] < anch[1]))
            {
                backtrack = _k_.copy(pos)
            }
            else if (_k_.in(dir,['up','bof']) && pos[1] > anch[1])
            {
                backtrack = _k_.copy(pos)
            }
            else if (_k_.in(dir,['down','eof']) && pos[1] < anch[1])
            {
                backtrack = _k_.copy(pos)
            }
            line = lines[pos[1]]
            rng = [pos[0],pos[1],pos[0],pos[1]]
            newRngs.push(rng)
            switch (dir)
            {
                case 'left':
                case 'right':
                    nc = this.numCharsFromPosToWordOrPunctInDirection(lines,pos,dir,opt)
                    pos[0] += nc
                    break
                case 'up':
                    pos[1] -= 1
                    break
                case 'down':
                    pos[1] += 1
                    break
                case 'eol':
                    pos[0] = line.length
                    break
                case 'bol':
                    pos[0] = 0
                    break
                case 'bof':
                    pos[0] = 0
                    pos[1] = 0
                    break
                case 'eof':
                    pos[1] = lines.length - 1
                    pos[0] = lines[lines.length - 1].length
                    break
                case 'ind_bol':
                    ind = this.numIndent(line)
                    pos[0] = (pos[0] > ind ? ind : 0)
                    break
                case 'ind_eol':
                    ind = this.numIndent(line)
                    pos[0] = (pos[0] < ind ? ind : line.length)
                    break
            }

            if (backtrack)
            {
                newRngs = this.removeFromLineRangesBetweenPositions(newRngs,backtrack,pos)
                rng[0] = anch[0]
                rng[1] = anch[1]
                rng[2] = pos[0]
                rng[3] = pos[1]
                this.normalizeRanges([rng])
            }
            else
            {
                switch (dir)
                {
                    case 'left':
                        rng[0] = rng[0] + nc
                        break
                    case 'right':
                        rng[2] = rng[2] + nc
                        break
                    case 'up':
                        rng[1] = _k_.max(0,rng[1] - 1)
                        break
                    case 'down':
                        rng[3] = _k_.min(lines.length - 1,rng[3] + 1)
                        break
                    case 'eol':
                        rng[2] = Infinity
                        break
                    case 'bol':
                        rng[0] = 0
                        break
                    case 'bof':
                        rng[1] = rng[0] = 0
                        break
                    case 'eof':
                        rng[3] = lines.length - 1
                        rng[2] = lines[lines.length - 1].length
                        break
                    case 'ind_bol':
                        ind = this.numIndent(line)
                        rng[0] = (rng[0] > ind ? ind : 0)
                        break
                    case 'ind_eol':
                        ind = this.numIndent(line)
                        rng[2] = (rng[2] < ind ? ind : line.length)
                        break
                }

            }
        }
        newRngs = this.clampLineRanges(lines,newRngs)
        return [newRngs,newPosl]
    }

    edit["clampLineRanges"] = function (lines, rngs)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            rng[1] = _k_.clamp(0,lines.length - 1,rng[1])
            rng[3] = _k_.clamp(0,lines.length - 1,rng[3])
            rng[0] = _k_.clamp(0,lines[rng[1]].length,rng[0])
            rng[2] = _k_.clamp(0,lines[rng[3]].length,rng[2])
        }
        return rngs
    }

    edit["removeFromLineRangesBetweenPositions"] = function (rngs, pos1, pos2)
    {
        var end, newRanges, rng, start

        if (_k_.empty(rngs) || this.samePos(pos1,pos2))
        {
            return rngs
        }
        if (pos1[1] > pos2[1] || pos1[1] === pos2[1] && pos1[0] > pos2[0])
        {
            ;[pos1,pos2] = [pos2,pos1]
        }
        newRanges = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            start = this.startOfRange(rng)
            end = this.endOfRange(rng)
            if (end[1] < pos1[1] || end[1] === pos1[1] && end[0] <= pos1[0])
            {
                newRanges.push(rng)
            }
            else if (start[1] > pos2[1] || start[1] === pos2[1] && start[0] >= pos2[0])
            {
                newRanges.push(rng)
            }
            else
            {
                if (start[1] < pos1[1] || start[1] === pos1[1] && start[0] < pos1[0])
                {
                    newRanges.push([start[0],start[1],pos1[0],pos1[1]])
                }
                if (end[1] > pos2[1] || end[1] === pos2[1] && end[0] > pos2[0])
                {
                    newRanges.push([pos2[0],pos2[1],end[0],end[1]])
                }
            }
        }
        return newRanges
    }

    return edit
})()

export default edit;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2VkaXQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFdBQVI7OztBQUVWLFFBQUQ7Ozs7O0lBSUksTUFBQyxvQ0FBdUIsT0FBTSxNQUFLOzs7O3NCQUlQOztvQkFBckIsTUFBTTs7WUFFTixTQUFROztZQUNQLE1BQU8sS0FBSztZQUNaLGdCQUFZLElBQUUsSUFBSSxLQUFHLEVBQUU7O1FBSTNCLE9BQVMsS0FBSyxNQUFNO1FBQ3BCLFFBQVMsS0FBQyxhQUFhO1FBQ3ZCO1FBQ0E7UUFDQSxPQUFTLEtBQUMsK0JBQStCLE1BQU07UUFDL0M7NEJBSWU7YUFBUDs7WUFBSjtZQUVBLFFBQVEsS0FBQyxjQUFjLE1BQU07MEJBSXBCLG9CQUFlLE1BQU07O29CQUNSLGtCQUFTLE1BQU0sTUFBTTs7b0JBQXZDLE9BQU87OztnQkFFUixNQUFNOztrQkFFSixFQUFFLEtBQUssS0FBSyxNQUFJOytCQUVSOztvQkFBUyxPQUFPLE9BQU87Ozs7b0JBQ2QsT0FBTyxNQUFNOztvQkFFNUIsSUFBSSxLQUFLLE1BQU0sU0FBVSxTQUFROztvQkFDaEMsT0FBTyxLQUFLLGdCQUFZLElBQUUsS0FBSyxRQUFRLE1BQU07O29CQUk5QyxNQUFNLFNBQVM7O3dCQUVYLEtBQUssU0FBUyxLQUFNLFNBQVE7O3dCQUUzQixtQkFBbUIsTUFBSSxLQUFLLE1BQU07d0JBQ2xDLE9BQU8sS0FBSyxLQUFLLE9BQU8sTUFBTTt3QkFDOUIsTUFBTSxNQUFNLEtBQUssZUFBVyxTQUFTLE1BQU0sU0FBTyxPQUFPLFNBQU87d0JBQ2hFLE9BQU8sS0FBSyxPQUFPLE1BQU0sT0FBTyxNQUFNOzs7O3dCQUd0QyxnQkFBZ0IsS0FBQyxVQUFVOzRCQUV4QixLQUFLLFdBQVUsS0FBTSxTQUFRLFFBQVMsS0FBSyxHQUFHLEtBQUs7OzRCQUNsRCxpQkFBaUIsS0FBQyxrQkFBa0IsTUFBTSxLQUFLO2dDQUM1QyxpQkFBaUI7O2dDQUNoQixnQkFBZ0I7Ozt3QkFFeEIsU0FBUyxjQUFVO3dCQUNuQixPQUFPLEtBQUssS0FBSyxPQUFPLE1BQU07NkNBRWIsWUFBTTs2QkFBZDs7NEJBQUw7Z0NBQ0csT0FBTyxNQUFNLFNBQU8sZ0JBQVcsU0FBUSxTQUFROztnQ0FFOUMsT0FBTyxLQUFLLE9BQU8sT0FBTzs7OzRCQUUvQixJQUFJOzs0QkFDSCxNQUFNLE1BQU0sS0FBSyxlQUFXLFNBQVMsTUFBTSxTQUFPLE9BQU8sU0FBTzs0QkFDaEUsT0FBTyxLQUFLLE9BQU8sTUFBTSxPQUFPLE1BQU07Ozs7NEJBRXRDLE1BQU0sUUFBUSxPQUFPLE9BQU8sTUFBTTtnQ0FDbEIsU0FBUTs7Z0NBQXhCLE9BQU87OzRCQUNQLE1BQU0sTUFBTSxLQUFLLE1BQU0sUUFBUSxNQUFNLFNBQU8sT0FBTzs7O29CQUUzRCxRQUFRLE1BQU0sT0FBTzs7OztvQkFHckIsTUFBTSxNQUFNLEtBQUssTUFBTSxRQUFNLEtBQUssTUFBTSxNQUFNLElBQUksTUFBTSxTQUFPLE9BQU87b0JBQ3RFLE9BQVEsS0FBSyxPQUFPLE1BQU07b0JBQzFCLE9BQVEsS0FBSyxPQUFPLE1BQU07b0JBQzFCLFFBQVEsTUFBTSxPQUFPO29CQUNyQixNQUFNLEtBQUs7OztZQUVuQixTQUFTOztZQUVrQixrQkFBUyxLQUFLLE1BQU07O1lBQW5ELFFBQVEsTUFBTSxPQUFPOztnQkFJcEIsTUFBTTs7O0lBSVgsTUFBQyxxQ0FBd0IsT0FBTSxNQUFLLFNBQVE7Ozs7UUFFeEMsT0FBTyxLQUFDLHVCQUF1QjtVQUU5QixNQUFNLFFBQVEsS0FBQyxzQkFBc0IsTUFBTSxLQUFLLEdBQUc7UUFFcEQ7NEJBQ2U7YUFBUDs7WUFBSjtZQUNBLEtBQUssTUFBTSxJQUFJLEtBQUcsS0FBSyxLQUFLLEtBQUcsS0FBSyxLQUFLLEdBQUcsSUFBSTs7VUFFbkQsTUFBTSxRQUFRLEtBQUMsc0JBQXNCLE1BQU0sS0FBSyxHQUFHO1lBRWpELEtBQUssR0FBRyxPQUFNLFdBQVksS0FBSyxPQUFNLEtBQUs7O29CQUN4QyxNQUFNOzs7O29CQUVOLE1BQU07Ozs7SUFJZixNQUFDLGlEQUFvQyxPQUFNLE1BQUssTUFBSyxXQUFTOzs7O1FBRTFELFFBQVEsTUFBTSxjQUFLOzttQkFBTTs7UUFDekIsaUJBQWM7c0JBRVU7O29CQUFyQixNQUFNOzt1QkFFTCxLQUFNLEtBQUssU0FBTyxTQUFHLHVCQUFBLFVBQUE7O1lBRXJCLE1BQU0sS0FBSztnQkFFUixJQUFJLE1BQU0sTUFBTSxVQUFVLElBQUksTUFBTSxNQUFNOztnQkFDekMsYUFBSyx1QkFBdUI7Z0JBQzVCOztZQUVKLE9BQU8sS0FBQyxtQ0FBbUMsS0FBSyxNQUFNO2dCQUVuRCxJQUFJLE9BQU0sSUFBSTs7b0JBRVYsWUFBYSxJQUFJLE9BQU0sS0FBTSxJQUFJLE9BQU0sTUFBTSxJQUFJLElBQUk7O29CQUNwRCxNQUFNLE9BQU8sSUFBSSxHQUFHOzs7O29CQUVwQixNQUFNLE9BQU8sSUFBSSxHQUFHLEVBQUUsTUFBTSxJQUFJLFVBQUksVUFBSSxJQUFJLGtCQUFKLElBQUksU0FBSSxPQUFPLE1BQU0sSUFBSSxVQUFJLElBQUk7Ozs7O29CQUkxRSxJQUFJLE9BQU0sTUFBTSxJQUFJLElBQUk7O29CQUN2QixNQUFNLE9BQU8sSUFBSSxHQUFHOzs7O29CQUVwQixNQUFNLE9BQU8sSUFBSSxHQUFHLEVBQUUsTUFBTSxJQUFJLFVBQUksSUFBSTtvQkFDeEMsY0FBYzs7b0JBRWYsSUFBSSxLQUFHLElBQUksTUFBTTs7b0JBQ2hCLE1BQU0sT0FBTyxJQUFJLEtBQUcsRUFBRSxJQUFJLEtBQUcsSUFBSSxLQUFHOztvQkFFckMsSUFBSSxPQUFNOztvQkFDVCxNQUFNLE9BQU8sSUFBSSxHQUFHOzs7O29CQUVwQixNQUFNLE9BQU8sSUFBSSxHQUFHLEVBQUUsTUFBTSxJQUFJLFVBQUksVUFBSSxJQUFJLGtCQUFKLElBQUk7d0JBRXpDOzt3QkFDQyxNQUFNLE9BQU8sSUFBSSxHQUFHLEVBQUUsTUFBTSxJQUFJLElBQUksT0FBTyxNQUFNLElBQUksS0FBRzs7Ozs7Z0JBRXZFLE1BQU07OztJQUVYLE1BQUMsaURBQW9DLE1BQUssT0FBTTs7OztzQkFFNUI7O21CQUFkOzt1QkFFRSxLQUFNLEtBQUssU0FBTyxTQUFHLHVCQUFBLFVBQUE7O1lBQ3JCLE1BQU0sS0FBSztnQkFFUixLQUFDLG1CQUFtQixJQUFJOztnQkFDdkIsSUFBSSxLQUFLLElBQUk7Z0JBQ2IsSUFBSSxLQUFLLElBQUk7O3FCQUNULEtBQUMsZ0JBQWdCLElBQUk7O29CQUN0QixJQUFJLE9BQU0sSUFBSTs7b0JBQ2IsSUFBSSxNQUFNLElBQUksS0FBSyxJQUFJO3dCQUNwQixJQUFJLEtBQUssSUFBSTs7d0JBQ1osSUFBSSxNQUFNLElBQUksS0FBSyxJQUFJOzs7OztvQkFFM0IsSUFBSSxNQUFNLEtBQUMsb0JBQW9CLE1BQU07Ozs7O2dCQUV6Qzs7O2VBRVIsS0FBQyx5QkFBeUI7OztJQUU5QixNQUFDLHNDQUF5QixTQUFRLFFBQU87Ozs7UUFFckMsS0FBSyxRQUFRLFFBQVE7ZUFFZjs7WUFFRixRQUFRLElBQUksTUFBTTtZQUNsQjtnQkFFSyxNQUFNLFFBQVE7Ozs7Z0JBQ2QsUUFBUSxJQUFJLEtBQUssT0FBTzs7Ozs7OztJQUlyQyxNQUFDLDZDQUFnQyxPQUFNLE1BQUs7Ozs7UUFFeEM7UUFDQSxPQUFPLEtBQUs7UUFFWiw0QkFBaUIsR0FBRTs7OztZQUVmLFFBQVEsS0FBQyxZQUFZLE1BQU07Z0JBQ1YsS0FBQyxhQUFhOztnQkFBL0IsTUFBTSxNQUFNOztZQUNaLEtBQUssS0FBSzttQkFDVixLQUFLLEtBQUssS0FBQyxXQUFXOzs0QkFFakI7OztZQUFMO2lCQUNPLEtBQUMsa0JBQWtCLEtBQUssRUFBRTs7Z0JBQzdCLGVBQWUsRUFBRSxFQUFFOztxQkFDZixFQUFFLEtBQUssTUFBTSxTQUFPOztnQkFDeEIsZUFBZSxFQUFFLEVBQUUsS0FBRzs7O3NCQUVQOztvQkFBcEIsS0FBSzs7Z0JBRVAsS0FBSzs7O0lBSVYsTUFBQywrQ0FBa0MsT0FBTSxNQUFLOzs7O1FBRTFDO1FBQ0EsT0FBTyxLQUFDLGdCQUFnQixNQUFNOzRCQUVuQjs7O1lBQVA7Z0JBQ0csTUFBTSxLQUFDLHlCQUF5QixLQUFLOztnQkFDcEMsTUFBTSxLQUFLLFFBQVE7b0JBQ2hCLE1BQU07O29CQUNMLEtBQUssS0FBSyxLQUFDLFdBQVcsS0FBSyxNQUFJOzs7O29CQUUvQixLQUFLLEtBQUssS0FBQyxXQUFXLEtBQUs7O2dCQUMvQixLQUFLLE9BQU8sSUFBSTs7OztnQkFFaEIsS0FBSyxLQUFLOzs7Z0JBQ2pCLEtBQUs7OztJQUVWLE1BQUMsa0NBQXFCLE9BQU07O2dCQUFRLE1BQU0sS0FBSyxPQUFPLElBQUksRUFBRSxNQUFJOzs7SUFFaEUsTUFBQyxvQ0FBdUIsT0FBTTs7ZUFBUSxLQUFLLGVBQUs7O21CQUFRLEtBQUMsb0JBQW9CLE1BQU07Ozs7SUFJbkYsTUFBQyw2REFBZ0QsT0FBTSxNQUFLLE1BQUssU0FBUTs7OztzQkFFNUQsWUFBVyxRQUFPLFVBQVcsd0JBQWUsTUFBTSxTQUFPLEtBQUssUUFBTyxRQUFTLFFBQVEsTUFBTTs7b0JBQzlGLE1BQU0sS0FBSzs7UUFFbEIsV0FBVyxNQUFNLGNBQUs7O21CQUFNOztRQUM1QixVQUFXLEtBQUs7UUFDaEIsVUFBVyxLQUFLO1VBRWYsR0FBRzs7b0JBQWE7O3FCQUNiOzRCQUFVLFFBQVEsU0FBTyxFQUFFOztxQkFDM0I7NEJBQVUsRUFBRSxRQUFRLFNBQU87Ozs7O1FBRS9COztvQkFBVzs7cUJBQ1A7MkJBQVM7O3FCQUNUOzJCQUFTOzs7Ozt1QkFFVCxLQUFNLFVBQUksd0JBQUEsV0FBQTs7WUFDVixRQUFRLFFBQVE7b0JBRVQ7O3FCQUNIO29CQUFTLFNBQVMsT0FBTyxNQUFRLEVBQUUsU0FBUyxRQUFNLEdBQUcsU0FBUzs7cUJBQzlEO29CQUFTLFNBQVMsT0FBTyxRQUFNLEVBQUUsRUFBRSxTQUFTLE9BQVMsU0FBUyxRQUFNOzs7O2dDQUU3RDs7O2dCQUFQO29CQUNHLElBQUksT0FBTTs7b0JBQ1QsSUFBSSxNQUFNOzs7aUNBRVA7OztnQkFBUDtvQkFDRyxJQUFJLE9BQU07O29CQUNULElBQUksTUFBTTtvQkFDVixJQUFJLE1BQU07Ozs7Z0JBRXJCLFNBQVMsUUFBUTs7O0lBSXRCLE1BQUMsdUVBQTBELE9BQU0sUUFBTyxNQUFLLE1BQUs7Ozs7c0JBRXJFLFdBQVUsUUFBTyxVQUFXLG9CQUFXLEtBQUssTUFBTSxTQUFPLEtBQUssUUFBTyxRQUFTLE9BQU8sR0FBRyxLQUFLOztvQkFDL0YsTUFBTSxLQUFLOztRQUVsQixXQUFXLE1BQU07UUFDakIsVUFBVyxLQUFLO1FBQ2hCLFVBQVcsS0FBSztVQUVmLEdBQUc7O29CQUFhOztxQkFDYjs0QkFBVSxPQUFPLFNBQU8sRUFBRTs7cUJBQzFCOzRCQUFVLEVBQUUsT0FBTyxTQUFPOzs7OztRQUU5Qjs7b0JBQVc7O3FCQUNQOzJCQUFTOztxQkFDVDsyQkFBUzs7Ozs7dUJBRVQsS0FBTSxVQUFJLHdCQUFBLFdBQUE7O1lBQ1YsUUFBUSxPQUFPO1lBRWYsT0FBTyxLQUFDLGlCQUFpQixTQUFTO1lBQ2xDLFFBQVE7WUFFUixVQUFTLFFBQU8sT0FBTyxNQUFNLEtBQUssTUFBTSxLQUFHO2NBRTFDLFNBQVMsUUFBUSxLQUFDLHNCQUFzQixTQUFTLE9BQU8sRUFBRTtnQkFFeEQsUUFBTzs7Z0JBQ04sSUFBSSxNQUFNLEtBQUcsTUFBTSxLQUFHO29DQUVYOzs7b0JBQVA7d0JBQ0csS0FBQyxpQkFBaUIsTUFBTTs7d0JBQ3ZCLElBQUksTUFBTTs7O3FDQUVQOzs7b0JBQVA7d0JBQ0csS0FBQyxtQkFBbUIsTUFBTTs7d0JBQ3pCLElBQUksTUFBTTt3QkFDVixJQUFJLE1BQU07Ozs7O2dCQUV6QixTQUFTLFFBQVE7OztJQUl0QixNQUFDLGtEQUFxQyxPQUFNLE1BQUssTUFBSzs7OztzQkFFckI7O29CQUExQixNQUFNLEtBQUs7O1FBRWQsV0FBVyxNQUFNO1FBQ2pCLFVBQVcsS0FBSztRQUNoQixVQUFXLEtBQUs7UUFFaEIsV0FBVztRQUNYLFlBQVk7NEJBRUM7OztZQUFUO2NBRUMsT0FBTyxRQUFRLEtBQUMsZ0JBQWdCLFNBQVM7aUJBQ25DLEtBQUssV0FBVyxLQUFLOztnQkFDeEIsVUFBVTtnQkFDVixvQkFBZ0IsT0FBTyxPQUFPOzs7WUFFQTs7WUFBdEMsWUFBWSxLQUFLLE9BQU87OzZCQUVYOzs7WUFBVDtjQUVDLE9BQU8sUUFBUSxLQUFDLGdCQUFnQixTQUFTO2dCQUN2Qzs7Z0JBQ0MsU0FBVSxLQUFLLE9BQU8sT0FBTyxTQUFPO2dCQUNwQyxVQUFVLEtBQUssS0FBSyxVQUFVLFFBQVEsT0FBTyxJQUFJOzs7O2dCQUVqRCxLQUFJLEtBQUssU0FBUyxZQUFXLE1BQU0sSUFBSTtnQkFDdkMsVUFBVSxLQUFLLEtBQUssT0FBTyxXQUFLLFNBQVMsU0FBTzs7WUFDcEQsU0FBUyxPQUFPLE1BQU0sRUFBRTs7Z0JBRTNCLFNBQVMsUUFBUTs7O0lBRXRCLE1BQUMsc0RBQXlDLE9BQU0sTUFBSyxNQUFLOzs7O3NCQUV6Qjs7b0JBQTFCLE1BQU0sS0FBSzs7UUFFZCxXQUFXLE1BQU0sY0FBSzs7bUJBQU07O1FBQzVCLFVBQVcsS0FBSztRQUNoQixVQUFXLEtBQUs7UUFFaEIsd0NBQWdDO2dCQUUvQixTQUFTLFFBQVE7OztJQUl0QixNQUFDLHNEQUF5QyxPQUFNLE1BQUssTUFBSzs7OztzQkFFekI7O29CQUExQixNQUFNLEtBQUs7O1FBRWQsV0FBVyxNQUFNLGNBQUs7O21CQUFNOztRQUM1QixVQUFXLEtBQUs7UUFDaEIsVUFBVyxLQUFLOzRCQUVIOzs7WUFBVDtjQUVDLE9BQU8sUUFBUSxLQUFDLGdCQUFnQixTQUFTO2dCQUV2QyxPQUFPOztnQkFFTixhQUFTLEVBQUUsT0FBTztnQkFDbEIsU0FBUyxPQUFPLE1BQU0sRUFBRSxLQUFLLEtBQUssYUFBTyxJQUFNO3FDQUVwQzs7O29CQUFQO3dCQUNHLElBQUksT0FBTTs7d0JBQ1QsSUFBSSxhQUFTLEVBQUUsSUFBSSxLQUFLOzs7cUNBRXJCOzs7b0JBQVA7d0JBQ0csSUFBSSxPQUFNOzt3QkFDVCxJQUFJLGFBQVMsRUFBRSxJQUFJLEtBQUs7d0JBQ3hCLElBQUksYUFBUyxFQUFFLElBQUksS0FBSzs7Ozs7Z0JBRXZDLFNBQVMsUUFBUTs7O0lBSXRCLE1BQUMsb0RBQXVDLE9BQU0sTUFBSyxNQUFLOzs7O3NCQUV2Qjs7b0JBQTFCLE1BQU0sS0FBSzs7UUFFZCxXQUFXLE1BQU0sY0FBSzs7bUJBQU07O1FBQzVCLFVBQVcsS0FBSztRQUNoQixVQUFXLEtBQUs7NEJBRUg7OztZQUFUO2NBRUMsT0FBTyxRQUFRLEtBQUMsZ0JBQWdCLFNBQVM7WUFFMUMsU0FBUyxTQUFTLEtBQUssS0FBSyxLQUFLLE9BQU8sR0FBRyxTQUFTO2lDQUV6Qzs7O2dCQUFQO29CQUNHLElBQUksT0FBTTs7b0JBQ1QsSUFBSSxNQUFNOzs7aUNBRVA7OztnQkFBUDtvQkFDRyxJQUFJLE9BQU07O29CQUNULElBQUksTUFBTTtvQkFDVixJQUFJLE1BQU07Ozs7Z0JBRXJCLFNBQVMsUUFBUTs7O0lBSXRCLE1BQUMscURBQXdDLE9BQU0sTUFBSyxPQUFNOzs7O3NCQUU3Qzs7b0JBQVUsS0FBQyxvQkFBb0IsTUFBTTs7UUFFOUMsVUFBVSxLQUFLO1lBRVosTUFBTSxLQUFDLHlCQUF5QixRQUFROztnQkFDcEMsS0FBQyxnQkFBZ0IsSUFBSTs7Z0JBQ3BCLElBQUksS0FBSyxJQUFJO2dCQUNiLElBQUksS0FBSyxJQUFJOztxQkFDVCxLQUFDLGlCQUFpQixJQUFJOztnQkFDMUIsSUFBSSxLQUFLLElBQUk7Z0JBQ2IsSUFBSSxLQUFLLElBQUk7Ozs7O1lBRWpCLFFBQVEsS0FBSyxLQUFDLG9CQUFvQixNQUFNOztlQUU1Qzs7O0lBRUosTUFBQywyREFBOEMsT0FBTSxNQUFLLE1BQUssS0FBSSxLQUFJOzs7O1FBRW5FLFVBQVUsS0FBSztRQUNmLFVBQVUsS0FBSzs0QkFFQTthQUFQOztZQUFKO1lBRUEsT0FBTyxRQUFRO3VCQUVYLEtBQVEsT0FBTyxVQUFVLE1BQU0sWUFBYyxJQUFJLEtBQUssS0FBSyxNQUFNLElBQUksS0FBSyxLQUFLOztnQkFBTSxxQkFBaUI7OzRCQUN0RyxLQUFRLFFBQVEsVUFBVSxNQUFNLFlBQWEsSUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSzs7Z0JBQU0scUJBQWlCOzs0QkFDdEcsS0FBUSxLQUFLLFdBQStCLElBQUksS0FBSyxLQUFLOztnQkFBSyxxQkFBaUI7OzRCQUNoRixLQUFRLE9BQU8sV0FBNkIsSUFBSSxLQUFLLEtBQUs7O2dCQUFLLHFCQUFpQjs7WUFFcEYsT0FBTyxNQUFNLElBQUk7WUFDakIsT0FBTyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJO1lBQ2hDLFFBQVEsS0FBSztvQkFFTjs7cUJBQ0g7cUJBQ0E7b0JBQWMsS0FBSyxLQUFDLHdDQUF3QyxNQUFNLElBQUksSUFBSTtvQkFBTSxJQUFJLE1BQU07O3FCQUMxRjtvQkFBYyxJQUFJLE1BQU07O3FCQUN4QjtvQkFBYyxJQUFJLE1BQU07O3FCQUN4QjtvQkFBYyxJQUFJLEtBQUssS0FBSzs7cUJBQzVCO29CQUFjLElBQUksS0FBSzs7cUJBQ3ZCO29CQUFjLElBQUksS0FBSztvQkFBRyxJQUFJLEtBQUs7O3FCQUNuQztvQkFBYyxJQUFJLEtBQUssTUFBTSxTQUFPO29CQUFHLElBQUksS0FBSyxNQUFNLE1BQU0sU0FBTyxHQUFHOztxQkFFdEU7b0JBQWMsTUFBTSxLQUFDLFVBQVU7b0JBQU8sSUFBSSxNQUFLLElBQUksS0FBSyxNQUFNLE1BQU07O3FCQUNwRTtvQkFBYyxNQUFNLEtBQUMsVUFBVTtvQkFBTyxJQUFJLE1BQUssSUFBSSxLQUFLLE1BQU0sTUFBTSxLQUFLOzs7O2dCQUUxRTs7Z0JBQ0MsVUFBVSxLQUFDLHFDQUFxQyxRQUFRLFVBQVU7Z0JBQ2xFLElBQUksS0FBSyxLQUFLO2dCQUNkLElBQUksS0FBSyxLQUFLO2dCQUNkLElBQUksS0FBSyxJQUFJO2dCQUNiLElBQUksS0FBSyxJQUFJO2dCQUNiLEtBQUMsaUJBQWlCOzs7O3dCQUVYOzt5QkFDSDt3QkFBYyxJQUFJLEtBQUssSUFBSSxLQUFHOzt5QkFDOUI7d0JBQWMsSUFBSSxLQUFLLElBQUksS0FBRzs7eUJBQzlCO3dCQUFjLElBQUksYUFBUyxFQUFFLElBQUksS0FBRzs7eUJBQ3BDO3dCQUFjLElBQUksYUFBUyxNQUFNLFNBQU8sRUFBRSxJQUFJLEtBQUc7O3lCQUNqRDt3QkFBYyxJQUFJLEtBQUs7O3lCQUN2Qjt3QkFBYyxJQUFJLEtBQUs7O3lCQUN2Qjt3QkFBYyxJQUFJLEtBQUssSUFBSSxLQUFLOzt5QkFDaEM7d0JBQWMsSUFBSSxLQUFLLE1BQU0sU0FBTzt3QkFBRyxJQUFJLEtBQUssTUFBTSxNQUFNLFNBQU8sR0FBRzs7eUJBRXRFO3dCQUFjLE1BQU0sS0FBQyxVQUFVO3dCQUFPLElBQUksTUFBSyxJQUFJLEtBQUssTUFBTSxNQUFNOzt5QkFDcEU7d0JBQWMsTUFBTSxLQUFDLFVBQVU7d0JBQU8sSUFBSSxNQUFLLElBQUksS0FBSyxNQUFNLE1BQU0sS0FBSzs7Ozs7O1FBRXJGLFVBQVUsS0FBQyxnQkFBZ0IsTUFBTTtnQkFFaEMsUUFBUTs7O0lBRWIsTUFBQyw4QkFBaUIsT0FBTTs7Ozs0QkFFVDs7O1lBQVA7WUFDQSxJQUFJLGVBQVcsRUFBRSxNQUFNLFNBQU8sRUFBRSxJQUFJO1lBQ3BDLElBQUksZUFBVyxFQUFFLE1BQU0sU0FBTyxFQUFFLElBQUk7WUFDcEMsSUFBSSxlQUFXLEVBQUUsTUFBTSxJQUFJLElBQUksT0FBTyxJQUFJO1lBQzFDLElBQUksZUFBVyxFQUFFLE1BQU0sSUFBSSxJQUFJLE9BQU8sSUFBSTs7ZUFFOUM7OztJQUVKLE1BQUMsbURBQXNDLE1BQUssTUFBSzs7OztzQkFFN0IsU0FBUSxLQUFDLFFBQVEsS0FBSzs7bUJBQXBDOztZQUVDLEtBQUssS0FBSyxLQUFLLE1BQU0sS0FBSyxPQUFNLEtBQUssTUFBTyxLQUFLLEtBQUssS0FBSzs7Y0FDekQsS0FBSyxTQUFTLEtBQUs7O1FBRXhCOzRCQUVXOzs7WUFBUDtZQUVBLFFBQVEsS0FBQyxhQUFhO1lBQ3RCLE1BQVEsS0FBQyxXQUFXO2dCQUVqQixJQUFJLEtBQUssS0FBSyxNQUFNLElBQUksT0FBTSxLQUFLLE1BQU8sSUFBSSxNQUFNLEtBQUs7O2dCQUN4RCxVQUFVLEtBQUs7O3FCQUNYLE1BQU0sS0FBSyxLQUFLLE1BQU0sTUFBTSxPQUFNLEtBQUssTUFBTyxNQUFNLE1BQU0sS0FBSzs7Z0JBQ25FLFVBQVUsS0FBSzs7OztvQkFFWixNQUFNLEtBQUssS0FBSyxNQUFNLE1BQU0sT0FBTSxLQUFLLE1BQU8sTUFBTSxLQUFLLEtBQUs7O29CQUM3RCxVQUFVLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsS0FBSzs7b0JBQ2hELElBQUksS0FBSyxLQUFLLE1BQU0sSUFBSSxPQUFNLEtBQUssTUFBTyxJQUFJLEtBQUssS0FBSzs7b0JBQ3ZELFVBQVUsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJOzs7O2VBRXZEOzs7V0F6aEJQOzs7ZUEwaEJNIn0=
//# sourceURL=../../../../kode/ked/edit/tool/edit.kode
