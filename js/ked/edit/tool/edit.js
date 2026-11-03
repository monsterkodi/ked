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
                var _b_ = posl[idx - 1]; x = _b_[0]; y = _b_[1]

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
        var _a_ = this.insertTextAtPositions(lines,pair[0],begl); lines = _a_[0]; begl = _a_[1]

        endl = []
        var list = _k_.list(begl)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            endl.push([pos[0] + rngs[idx][2] - rngs[idx][0],pos[1]])
        }
        var _c_ = this.insertTextAtPositions(lines,pair[1],endl); lines = _c_[0]; endl = _c_[1]

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
        var _a_ = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return [indices.length - 1,0]

                case 'up':
                    return [0,indices.length - 1]

            }

        }).bind(this))(); rs = _a_[0]; re = _a_[1]

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
        for (var _b_ = ii = rs, _c_ = re; (_b_ <= _c_ ? ii <= re : ii >= re); (_b_ <= _c_ ? ++ii : --ii))
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
            for (var _d_ = 0; _d_ < list.length; _d_++)
            {
                pos = list[_d_]
                if (pos[1] === index)
                {
                    pos[1] += d
                }
            }
            var list1 = _k_.list(newRngs)
            for (var _e_ = 0; _e_ < list1.length; _e_++)
            {
                rng = list1[_e_]
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
        var _a_ = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return [blocks.length - 1,0]

                case 'up':
                    return [0,blocks.length - 1]

            }

        }).bind(this))(); rs = _a_[0]; re = _a_[1]

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
        for (var _b_ = bi = rs, _c_ = re; (_b_ <= _c_ ? bi <= re : bi >= re); (_b_ <= _c_ ? ++bi : --bi))
        {
            block = blocks[bi]
            text = this.textForLineRange(newLines,block)
            text += '\n'
            insidx = (dir === 'up' ? block[1] : block[3] + 1)
            var _d_ = this.insertTextAtPositions(newLines,text,[[0,insidx]]); newLines = _d_[0]; posl = _d_[1]

            if (dir === 'down')
            {
                d = block[3] - block[1] + 1
                var list = _k_.list(newPosl)
                for (var _e_ = 0; _e_ < list.length; _e_++)
                {
                    pos = list[_e_]
                    if (this.rangeContainsPos(block,pos))
                    {
                        pos[1] += d
                    }
                }
                var list1 = _k_.list(newRngs)
                for (var _f_ = 0; _f_ < list1.length; _f_++)
                {
                    rng = list1[_f_]
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
            var _b_ = this.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

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
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            index = list1[_c_]
            var _d_ = this.splitLineIndent(newLines[index]); indent = _d_[0]; line = _d_[1]

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
            var _b_ = this.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            if (indent.length)
            {
                sc = _k_.min(4,indent.length)
                newLines.splice(index,1,kseg.join(indent.slice(sc),line))
                var list1 = _k_.list(newPosl)
                for (var _c_ = 0; _c_ < list1.length; _c_++)
                {
                    pos = list1[_c_]
                    if (pos[1] === index)
                    {
                        pos[0] = _k_.max(0,pos[0] - sc)
                    }
                }
                var list2 = _k_.list(newRngs)
                for (var _d_ = 0; _d_ < list2.length; _d_++)
                {
                    rng = list2[_d_]
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
            var _b_ = this.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            newLines[index] = kseg.join(kseg.repeat(4),newLines[index])
            var list1 = _k_.list(newPosl)
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                pos = list1[_c_]
                if (pos[1] === index)
                {
                    pos[0] += 4
                }
            }
            var list2 = _k_.list(newRngs)
            for (var _d_ = 0; _d_ < list2.length; _d_++)
            {
                rng = list2[_d_]
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
            var _a_ = [pos2,pos1]; pos1 = _a_[0]; pos2 = _a_[1]

        }
        newRanges = []
        var list = _k_.list(rngs)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            rng = list[_b_]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2VkaXQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFdBQVI7OztBQUVWLFFBQUQ7Ozs7O0lBSUksTUFBQyxvQ0FBdUIsT0FBTSxNQUFLOzs7O3NCQUlQOztvQkFBckIsTUFBTTs7WUFFTixTQUFROztZQUNQLE1BQU8sS0FBSztZQUNaLGdCQUFZLElBQUUsSUFBSSxLQUFHLEVBQUU7O1FBSTNCLE9BQVMsS0FBSyxNQUFNO1FBQ3BCLFFBQVMsS0FBQyxhQUFhO1FBQ3ZCO1FBQ0E7UUFDQSxPQUFTLEtBQUMsK0JBQStCLE1BQU07UUFDL0M7NEJBSWU7YUFBUDs7WUFBSjtZQUVBLFFBQVEsS0FBQyxjQUFjLE1BQU07MEJBSXBCLG9CQUFlLE1BQU07O29CQUNSLGtCQUFTLE1BQU0sTUFBTTs7b0JBQXZDLE9BQU87OztnQkFFUixNQUFNOzswQkFFRyxLQUFLLE1BQUksSUFBaEIsWUFBRTs7K0JBRU07O29CQUFTLE9BQU8sT0FBTzs7OztvQkFDZCxPQUFPLE1BQU07O29CQUU1QixJQUFJLEtBQUssTUFBTSxTQUFVLFNBQVE7O29CQUNoQyxPQUFPLEtBQUssZ0JBQVksSUFBRSxLQUFLLFFBQVEsTUFBTTs7b0JBSTlDLE1BQU0sU0FBUzs7d0JBRVgsS0FBSyxTQUFTLEtBQU0sU0FBUTs7d0JBRTNCLG1CQUFtQixNQUFJLEtBQUssTUFBTTt3QkFDbEMsT0FBTyxLQUFLLEtBQUssT0FBTyxNQUFNO3dCQUM5QixNQUFNLE1BQU0sS0FBSyxlQUFXLFNBQVMsTUFBTSxTQUFPLE9BQU8sU0FBTzt3QkFDaEUsT0FBTyxLQUFLLE9BQU8sTUFBTSxPQUFPLE1BQU07Ozs7d0JBR3RDLGdCQUFnQixLQUFDLFVBQVU7NEJBRXhCLEtBQUssV0FBVSxLQUFNLFNBQVEsUUFBUyxLQUFLLEdBQUcsS0FBSzs7NEJBQ2xELGlCQUFpQixLQUFDLGtCQUFrQixNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/edit.kode
