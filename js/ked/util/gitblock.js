var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var gitblock


gitblock = (function ()
{
    function gitblock ()
    {}

    gitblock["fromDiff"] = function (diff)
    {
        var block, blocks, change, count, firstLine, hunk, lastLine, newLines, oldLines, start, _16_35_, _18_34_, _19_34_

        blocks = []
        var list = ((_16_35_=diff.changes) != null ? _16_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            oldLines = ((_18_34_=change.old) != null ? _18_34_ : [])
            newLines = ((_19_34_=change.new) != null ? _19_34_ : [])
            count = newLines.length
            start = count > 0 ? change.line - 1 : change.line
            firstLine = count > 0 ? start : _k_.max(0,start - 1)
            lastLine = count > 0 ? start + count - 1 : _k_.max(0,start - 1)
            hunk = {start:start,end:start + count,old:oldLines,new:newLines,oldMarks:this.oldMarksFor(oldLines,newLines),newMarks:this.newMarksFor(oldLines,newLines),del:oldLines.length > newLines.length}
            block = _k_.last(blocks)
            if ((block != null) && firstLine <= block.last + 1)
            {
                block.hunks.push(hunk)
                block.end = _k_.max(block.end,hunk.end)
                block.last = _k_.max(block.last,lastLine)
            }
            else
            {
                blocks.push({start:firstLine,end:hunk.end,first:firstLine,last:lastLine,hunks:[hunk]})
            }
        }
        var list1 = _k_.list(blocks)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            block = list1[_b_]
            block.start = block.hunks[0].start
            block.marks = this.marksForBlock(block)
            block.mods = this.modsOfBlock(block)
            delete block.first
            delete block.last
        }
        return blocks
    }

    gitblock["oldMarksFor"] = function (oldLines, newLines)
    {
        var i, marks, n

        n = _k_.min(oldLines.length,newLines.length)
        marks = []
        for (i = 0; i < oldLines.length; i++)
        {
            marks.push(((i < n ? 'mod' : 'del')))
        }
        return marks
    }

    gitblock["newMarksFor"] = function (oldLines, newLines)
    {
        var i, marks, n

        n = _k_.min(oldLines.length,newLines.length)
        marks = []
        for (i = 0; i < newLines.length; i++)
        {
            marks.push(((i < n ? 'mod' : 'add')))
        }
        return marks
    }

    gitblock["marksForBlock"] = function (block)
    {
        var hunk, i, line, marks

        marks = {}
        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            for (i = 0; i < hunk.new.length; i++)
            {
                marks[hunk.start + i] = hunk.newMarks[i]
            }
            if (hunk.del)
            {
                line = hunk.new.length ? hunk.start + hunk.new.length - 1 : _k_.max(0,hunk.start - 1)
                if (!marks[line])
                {
                    marks[line] = 'del'
                }
            }
        }
        return marks
    }

    gitblock["modsOfBlock"] = function (block)
    {
        var hunk, mods

        mods = 0
        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            mods += _k_.min(hunk.old.length,hunk.new.length)
        }
        return mods
    }

    gitblock["firstLine"] = function (block)
    {
        if (block.end > block.start)
        {
            return block.start
        }
        else
        {
            return _k_.max(0,block.start - 1)
        }
    }

    gitblock["revert"] = function (block, lines)
    {
        var delta, entry, hunk, op, ops

        if (!this.matchesNew(block,lines))
        {
            return
        }
        ops = []
        delta = 0
        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            ops.push({start:hunk.start,oldStart:hunk.start + delta,old:hunk.old,new:hunk.new,oldMarks:hunk.oldMarks,newMarks:hunk.newMarks})
            delta += hunk.old.length - hunk.new.length
        }
        entry = {ops:ops,block:block,start:ops[0].oldStart,end:ops[0].oldStart,before:lines[block.start - 1],after:lines[block.end]}
        var list1 = _k_.list(ops)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            op = list1[_b_]
            entry.end = _k_.max(entry.end,(op.oldStart + op.old.length))
        }
        entry.marks = this.marksForEntry(entry)
        return entry
    }

    gitblock["restore"] = function (entry, lines)
    {
        if (!this.matchesOld(entry,lines))
        {
            return
        }
        return entry.block
    }

    gitblock["matchesNew"] = function (block, lines)
    {
        var hunk, i

        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            if (hunk.start + hunk.new.length > lines.length)
            {
                return false
            }
            for (i = 0; i < hunk.new.length; i++)
            {
                if (lines[hunk.start + i] !== hunk.new[i])
                {
                    return false
                }
            }
        }
        return true
    }

    gitblock["matchesOld"] = function (entry, lines)
    {
        var i, op

        var list = _k_.list(entry.ops)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            op = list[_a_]
            if (op.oldStart + op.old.length > lines.length)
            {
                return false
            }
            for (i = 0; i < op.old.length; i++)
            {
                if (lines[op.oldStart + i] !== op.old[i])
                {
                    return false
                }
            }
        }
        return true
    }

    gitblock["marksForEntry"] = function (entry)
    {
        var i, line, marks, op

        marks = {}
        var list = _k_.list(entry.ops)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            op = list[_a_]
            if (op.old.length > 0)
            {
                for (i = 0; i < op.old.length; i++)
                {
                    marks[op.oldStart + i] = op.oldMarks[i]
                }
            }
            else
            {
                line = _k_.max(0,op.oldStart - 1)
                if (!marks[line])
                {
                    marks[line] = 'del'
                }
            }
            if (op.new.length === 0)
            {
                line = _k_.max(0,op.oldStart - 1)
                if (!marks[line])
                {
                    marks[line] = 'del'
                }
            }
        }
        return marks
    }

    gitblock["revertEdits"] = function (entry)
    {
        var edits, op

        edits = []
        var list = _k_.list(entry.ops)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            op = list[_a_]
            edits.push([op.start,op.new.length,op.old])
        }
        return edits
    }

    gitblock["restoreEdits"] = function (entry)
    {
        var edits, op

        edits = []
        var list = _k_.list(entry.ops)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            op = list[_a_]
            edits.push([op.oldStart,op.old.length,op.new])
        }
        return edits
    }

    gitblock["applyRevert"] = function (entry, lines)
    {
        var i, op, result

        result = lines.slice()
        for (i = entry.ops.length - 1; i >= 0; i--)
        {
            op = entry.ops[i]
            result = result.slice(0, typeof op.start === 'number' ? op.start : -1).concat(op.old).concat(result.slice(op.start + op.new.length))
        }
        return result
    }

    gitblock["applyRestore"] = function (entry, lines)
    {
        var i, op, result

        result = lines.slice()
        for (i = entry.ops.length - 1; i >= 0; i--)
        {
            op = entry.ops[i]
            result = result.slice(0, typeof op.oldStart === 'number' ? op.oldStart : -1).concat(op.new).concat(result.slice(op.oldStart + op.old.length))
        }
        return result
    }

    gitblock["stashedBlock"] = function (block, lines)
    {
        var d, delta, hunk, idx, os

        delta = 0
        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            os = hunk.start + delta
            if (hunk.old.length > 0)
            {
                idx = this.findSequence(lines,hunk.old,os)
                if (!_k_.empty(idx))
                {
                    d = idx - os
                    return this.entryAt(block,lines,d)
                }
            }
            delta += hunk.old.length - hunk.new.length
        }
        d = this.contextShift(block.before,block.after,block.start,lines)
        if (!!_k_.empty(d))
        {
            return
        }
        return this.entryAt(block,lines,d)
    }

    gitblock["entryAt"] = function (block, lines, d)
    {
        var delta, entry, hunk, i, op, ops, shifted

        shifted = this.shiftBlock(block,d)
        delta = 0
        var list = _k_.list(shifted.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            for (i = 0; i < hunk.old.length; i++)
            {
                if (lines[hunk.start + delta + i] !== hunk.old[i])
                {
                    return
                }
            }
            delta += hunk.old.length - hunk.new.length
        }
        ops = []
        delta = 0
        var list1 = _k_.list(shifted.hunks)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            hunk = list1[_b_]
            ops.push({start:hunk.start,oldStart:hunk.start + delta,old:hunk.old,new:hunk.new,oldMarks:hunk.oldMarks,newMarks:hunk.newMarks})
            delta += hunk.old.length - hunk.new.length
        }
        entry = {ops:ops,block:shifted,start:ops[0].oldStart,end:ops[0].oldStart}
        var list2 = _k_.list(ops)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            op = list2[_c_]
            entry.end = _k_.max(entry.end,(op.oldStart + op.old.length))
        }
        entry.before = lines[entry.start - 1]
        entry.after = lines[entry.end]
        entry.marks = this.marksForEntry(entry)
        return entry
    }

    gitblock["shiftBlock"] = function (block, d)
    {
        var after, before, hunk, hunks, kind, line, marks

        if (d === 0)
        {
            return block
        }
        marks = {}
        for (line in block.marks)
        {
            kind = block.marks[line]
            marks[parseInt(line) + d] = kind
        }
        hunks = []
        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            hunks.push({start:hunk.start + d,end:hunk.end + d,old:hunk.old,new:hunk.new,oldMarks:hunk.oldMarks,newMarks:hunk.newMarks,del:hunk.del})
        }
        before = block.before
        after = block.after
        block = {start:block.start + d,end:block.end + d,hunks:hunks,marks:marks,mods:block.mods}
        if (!_k_.empty(before))
        {
            block.before = before
        }
        if (!_k_.empty(after))
        {
            block.after = after
        }
        return block
    }

    gitblock["shiftEntry"] = function (entry, d)
    {
        var op, ops

        if (d === 0)
        {
            return entry
        }
        ops = []
        var list = _k_.list(entry.ops)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            op = list[_a_]
            ops.push({start:op.start + d,oldStart:op.oldStart + d,old:op.old,new:op.new,oldMarks:op.oldMarks,newMarks:op.newMarks})
        }
        entry = {ops:ops,block:this.shiftBlock(entry.block,d),start:entry.start + d,end:entry.end + d,before:entry.before,after:entry.after}
        entry.marks = this.marksForEntry(entry)
        return entry
    }

    gitblock["reanchorEntry"] = function (entry, lines)
    {
        var shift

        shift = this.shiftForEntry(entry,lines)
        if (!!_k_.empty(shift))
        {
            return
        }
        return this.shiftEntry(entry,shift)
    }

    gitblock["undoneBlock"] = function (entry, lines)
    {
        var block, d, hunk, idx

        block = entry.block
        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            if (_k_.empty(hunk.new))
            {
                continue
            }
            idx = this.findSequence(lines,hunk.new,hunk.start)
            if (!!_k_.empty(idx))
            {
                continue
            }
            d = idx - hunk.start
            if (this.blockMatchesAt(block,lines,d))
            {
                return this.shiftBlock(block,d)
            }
        }
        d = this.contextShift(entry.before,entry.after,block.start,lines)
        if (!_k_.empty(d) && this.blockMatchesAt(block,lines,d))
        {
            return this.shiftBlock(block,d)
        }
        return null
    }

    gitblock["shiftForEntry"] = function (entry, lines)
    {
        var hasOld, idx, op, shift

        hasOld = false
        var list = _k_.list(entry.ops)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            op = list[_a_]
            if (_k_.empty(op.old))
            {
                continue
            }
            hasOld = true
            idx = this.findSequence(lines,op.old,op.oldStart)
            if (!!_k_.empty(idx))
            {
                continue
            }
            shift = idx - op.oldStart
            if (this.entryMatchesAt(entry,lines,shift))
            {
                return shift
            }
        }
        if (hasOld)
        {
            return
        }
        return this.contextShift(entry.before,entry.after,entry.start,lines)
    }

    gitblock["entryMatchesAt"] = function (entry, lines, shift)
    {
        var i, op

        var list = _k_.list(entry.ops)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            op = list[_a_]
            if (op.oldStart + shift < 0)
            {
                return false
            }
            if (op.oldStart + shift + op.old.length > lines.length)
            {
                return false
            }
            for (i = 0; i < op.old.length; i++)
            {
                if (lines[op.oldStart + shift + i] !== op.old[i])
                {
                    return false
                }
            }
        }
        return true
    }

    gitblock["blockMatchesAt"] = function (block, lines, shift)
    {
        var hunk, i

        var list = _k_.list(block.hunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hunk = list[_a_]
            if (hunk.start + shift < 0)
            {
                return false
            }
            if (hunk.start + shift + hunk.new.length > lines.length)
            {
                return false
            }
            for (i = 0; i < hunk.new.length; i++)
            {
                if (lines[hunk.start + shift + i] !== hunk.new[i])
                {
                    return false
                }
            }
        }
        return true
    }

    gitblock["findSequence"] = function (lines, seq, near)
    {
        var best, d, dist, i, j, match

        if (_k_.empty(seq))
        {
            return
        }
        if (seq.length > lines.length)
        {
            return
        }
        near = (near != null ? near : 0)
        best = null
        dist = Infinity
        for (i = 0; i < lines.length - seq.length + 1; i++)
        {
            match = true
            for (j = 0; j < seq.length; j++)
            {
                if (lines[i + j] !== seq[j])
                {
                    match = false
                    break
                }
            }
            if (match)
            {
                d = Math.abs(i - near)
                if (d < dist)
                {
                    dist = d
                    best = i
                }
            }
        }
        return best
    }

    gitblock["contextShift"] = function (before, after, start, lines)
    {
        var best, d, dist, i

        if (!!_k_.empty(before))
        {
            if (!_k_.empty(after) && _k_.empty(lines))
            {
                return
            }
            if (!!_k_.empty(after))
            {
                if (_k_.empty(lines))
                {
                    return -start
                }
                return
            }
            if (lines.length && lines[0] === after)
            {
                return -start
            }
            return
        }
        if (!!_k_.empty(after))
        {
            for (i = 0; i < lines.length; i++)
            {
                if (lines[i] === before)
                {
                    best = i
                }
            }
            if (!_k_.empty(best))
            {
                return best + 1 - start
            }
            return
        }
        dist = Infinity
        for (i = 0; i < lines.length - 1; i++)
        {
            if (lines[i] === before && lines[i + 1] === after)
            {
                d = Math.abs((i + 1) - start)
                if (d < dist)
                {
                    dist = d
                    best = i + 1
                }
            }
        }
        if (!_k_.empty(best))
        {
            return best - start
        }
    }

    gitblock["overlaps"] = function (block, entry)
    {
        return this.intervalOverlap(block.start,block.end,entry.block.start,entry.block.end)
    }

    gitblock["intervalOverlap"] = function (aStart, aEnd, bStart, bEnd)
    {
        if (aStart === aEnd && bStart === bEnd && aStart === bStart)
        {
            return true
        }
        if (aStart === aEnd && (bStart < aStart && aStart < bEnd))
        {
            return true
        }
        if (bStart === bEnd && (aStart < bStart && bStart < aEnd))
        {
            return true
        }
        return aStart < bEnd && bStart < aEnd
    }

    return gitblock
})()

export default gitblock;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0YmxvY2suanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZ2l0YmxvY2sua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQyxZQUFEOzs7OztJQVdJLFVBQUMsdUJBQVU7Ozs7UUFFUDs2QkFFYyxLQUFLOzs7WUFBZjtZQUVBLHFCQUFXLE9BQU87WUFDbEIscUJBQVcsT0FBTztZQUVsQixRQUFRLFNBQVM7WUFDakIsUUFBVyxRQUFRLElBQUksT0FBTyxPQUFLLElBQU8sT0FBTztZQUVqRCxZQUFlLFFBQVEsSUFBSSxnQkFBZSxFQUFFLFFBQU07WUFDbEQsV0FBZSxRQUFRLElBQUksUUFBTSxRQUFNLFlBQVcsRUFBRSxRQUFNO1lBRTFELFFBQ0ksTUFBVSxNQUNWLElBQVUsUUFBTSxNQUNoQixJQUFVLFNBQ1YsSUFBVSxTQUNWLFNBQVUsS0FBQyxZQUFZLFNBQVMsVUFDaEMsU0FBVSxLQUFDLFlBQVksU0FBUyxVQUNoQyxJQUFVLFNBQVMsU0FBUyxTQUFTO1lBRXpDLGlCQUFhO2lCQUVWLGtCQUFXLGFBQWEsTUFBTSxPQUFLOztnQkFDbEMsTUFBTSxNQUFNLEtBQUs7Z0JBQ2pCLE1BQU0sY0FBVyxNQUFNLElBQUksS0FBSztnQkFDaEMsTUFBTSxlQUFXLE1BQU0sS0FBSzs7OztnQkFFNUIsT0FBTyxNQUNILE1BQU8sVUFDUCxJQUFPLEtBQUssSUFDWixNQUFPLFVBQ1AsS0FBTyxTQUNQLE9BQVE7Ozs2QkFFUDs7O1lBQVQ7WUFDQSxNQUFNLFFBQVEsTUFBTSxNQUFNLEdBQUc7WUFDN0IsTUFBTSxRQUFRLEtBQUMsY0FBYztZQUM3QixNQUFNLE9BQVEsS0FBQyxZQUFZO21CQUNwQixNQUFNO21CQUNOLE1BQU07O2VBRWpCOzs7SUFFSixVQUFDLDBCQUFhLFVBQVM7Ozs7UUFFbkIsWUFBUSxTQUFTLE9BQU8sU0FBUztRQUNqQzthQUNJLElBQUssT0FBSSxTQUFTOztZQUNsQixNQUFNLE9BQU0sSUFBSSxJQUFJLFFBQVE7O2VBQ2hDOzs7SUFF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
//# sourceURL=../../../kode/ked/util/gitblock.kode
