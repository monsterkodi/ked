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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2VkaXQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXUyxRQUFUOzs7OztVQVFJLG9DQUF3QixPQUFNLE1BQUs7Ozs7c0JBSU47O29CQUFyQixNQUFNOztZQUVQLFNBQVE7O1lBQ1AsTUFBTyxLQUFLO1lBQ1osZ0JBQVksSUFBRSxJQUFJLEtBQUcsRUFBRTs7UUFJM0IsT0FBUyxLQUFLLE1BQU07UUFDcEIsUUFBUyxLQUFDLGFBQWE7UUFDdkI7UUFDQTtRQUNBLE9BQVMsS0FBQywrQkFBK0IsTUFBTTtRQUMvQzs0QkFJZTs7O1lBQVg7WUFFQSxRQUFRLEtBQUMsY0FBYyxNQUFNOzBCQUlwQixvQkFBZSxNQUFNOztvQkFDUixrQkFBUyxNQUFNLE1BQU07O29CQUF2QyxPQUFPOzs7Z0JBRVIsTUFBTTs7MEJBRUcsS0FBSyxNQUFJOzsrQkFFUjs7b0JBQVMsT0FBTyxPQUFPOzs7O29CQUNkLE9BQU8sTUFBTTs7b0JBRTVCLElBQUksS0FBSyxNQUFNLFNBQVUsU0FBUTs7b0JBQ2hDLE9BQU8sS0FBSyxnQkFBWSxJQUFFLEtBQUssUUFBUSxNQUFNOztvQkFJOUMsTUFBTSxTQUFTOzt3QkFFWCxLQUFLLFNBQVMsS0FBTSxTQUFROzt3QkFFM0IsbUJBQW1CLE1BQUksS0FBSyxNQUFNO3dCQUNsQyxPQUFPLEtBQUssS0FBSyxPQUFPLE1BQU07d0JBQzlCLE1BQU0sTUFBTSxLQUFLLGVBQVcsU0FBUyxNQUFNLFNBQU8sT0FBTyxTQUFPO3dCQUNoRSxPQUFPLEtBQUssT0FBTyxNQUFNLE9BQU8sTUFBTTs7Ozt3QkFHdEMsZ0JBQWdCLEtBQUMsVUFBVTt3QkFDM0IsU0FBUyxjQUFVO3dCQUNuQixPQUFPLEtBQUssS0FBSyxPQUFPLE1BQU07NkNBRWIsWUFBTTs7OzRCQUFuQjtnQ0FDRyxPQUFPLE1BQU0sU0FBTyxnQkFBVyxTQUFRLFNBQVE7O2dDQUU5QyxPQUFPLEtBQUss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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/edit.kode
