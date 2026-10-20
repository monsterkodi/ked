var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        var after, before, idx, indent, insertLineIndex, insl, lidx, line, newls, newpl, pos, posLineIndent, rng, rngs, txtls, x, y

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

    edit["deleteLineRangesAndAdjustPositions"] = function (lines, rngs, posl)
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
                if (rng[0] === 0 && rng[2] === lines[rng[1]].length)
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

    edit["extendLineRangesByMovingPositionsInDirection"] = function (lines, rngs, posl, dir, opt)
    {
        var ind, line, nc, newPosl, newRngs, pos, rng

        newRngs = rngs.asMutable()
        newPosl = posl.asMutable()
        var list = _k_.list(newPosl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
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

            if (rng[1] < lines.length)
            {
                rng[0] = _k_.clamp(0,lines[rng[1]].length,rng[0])
            }
            if (rng[3] < lines.length)
            {
                rng[2] = _k_.clamp(0,lines[rng[3]].length,rng[2])
            }
        }
        return [newRngs,newPosl]
    }

    return edit
})()

export default edit;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2VkaXQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBdUJpQzs7b0JBQXJCLE1BQU07O1lBRVAsU0FBUTs7WUFDUCxNQUFPLEtBQUs7WUFDWixnQkFBWSxJQUFFLElBQUksS0FBRyxFQUFFOztRQUkzQixPQUFTLEtBQUssTUFBTTtRQUNwQixRQUFTLEtBQUMsYUFBYTtRQUN2QjtRQUNBO1FBQ0EsT0FBUyxLQUFDLCtCQUErQixNQUFNO1FBQy9DOzRCQUllOzs7O1lBRVgsUUFBUSxLQUFDLGNBQWMsTUFBTTswQkFJcEIsb0JBQWUsTUFBTTs7b0JBQ1Isa0JBQVMsTUFBTSxNQUFNOztvQkFBdkMsT0FBTzs7O2dCQUVSLE1BQU07OzBCQUVHLEtBQUssTUFBSTs7K0JBRVI7O29CQUFTLE9BQU8sT0FBTzs7OztvQkFDZCxPQUFPLE1BQU07O29CQUU1QixJQUFJLEtBQUssTUFBTSxTQUFVLFNBQVE7O29CQUNoQyxPQUFPLEtBQUssZ0JBQVksSUFBRSxLQUFLLFFBQVEsTUFBTTs7b0JBSTlDLE1BQU0sU0FBUzs7d0JBRVgsS0FBSyxTQUFTLEtBQU0sU0FBUTs7d0JBRTNCLG1CQUFtQixNQUFJLEtBQUssTUFBTTt3QkFDbEMsT0FBTyxLQUFLLEtBQUssT0FBTyxNQUFNO3dCQUM5QixNQUFNLE1BQU0sS0FBSyxlQUFXLFNBQVMsTUFBTSxTQUFPLE9BQU8sU0FBTzt3QkFDaEUsT0FBTyxLQUFLLE9BQU8sTUFBTSxPQUFPLE1BQU07Ozs7d0JBR3RDLGdCQUFnQixLQUFDLFVBQVU7d0JBQzNCLFNBQVMsY0FBVTt3QkFDbkIsT0FBTyxLQUFLLEtBQUssT0FBTyxNQUFNOzZDQUViLFlBQU07Ozs7Z0NBQ2hCLE9BQU8sTUFBTSxTQUFPLGdCQUFXLFNBQVEsU0FBUTs7Z0NBRTlDLE9BQU8sS0FBSyxPQUFPLE9BQU87Ozs0QkFFL0IsSUFBSTs7NEJBQ0gsTUFBTSxN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/edit.kode
