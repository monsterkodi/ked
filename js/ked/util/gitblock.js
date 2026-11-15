var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var gitblock


gitblock = (function ()
{
    function gitblock ()
    {}

    gitblock["fromDiff"] = function (diff)
    {
        var block, blocks, change, count, first, hunk, last, newLines, oldLines, start, _16_35_, _18_34_, _19_34_

        blocks = []
        var list = ((_16_35_=diff.changes) != null ? _16_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            oldLines = ((_18_34_=change.old) != null ? _18_34_ : [])
            newLines = ((_19_34_=change.new) != null ? _19_34_ : [])
            count = newLines.length
            start = count > 0 ? change.line - 1 : change.line
            first = count > 0 ? start : _k_.max(0,start - 1)
            last = count > 0 ? start + count - 1 : _k_.max(0,start - 1)
            hunk = {start:start,end:start + count,old:oldLines,new:newLines,oldMarks:this.oldMarksFor(oldLines,newLines),newMarks:this.newMarksFor(oldLines,newLines),del:oldLines.length > newLines.length}
            block = _k_.last(blocks)
            if ((block != null) && first <= block.last + 1)
            {
                block.hunks.push(hunk)
                block.end = _k_.max(block.end,hunk.end)
                block.last = _k_.max(block.last,last)
            }
            else
            {
                blocks.push({start:first,end:hunk.end,first:first,last:last,hunks:[hunk]})
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
        for (var _a_ = i = 0, _b_ = oldLines.length; (_a_ <= _b_ ? i < oldLines.length : i > oldLines.length); (_a_ <= _b_ ? ++i : --i))
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
        for (var _a_ = i = 0, _b_ = newLines.length; (_a_ <= _b_ ? i < newLines.length : i > newLines.length); (_a_ <= _b_ ? ++i : --i))
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
            for (var _b_ = i = 0, _c_ = hunk.new.length; (_b_ <= _c_ ? i < hunk.new.length : i > hunk.new.length); (_b_ <= _c_ ? ++i : --i))
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
            return null
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
            return null
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
            for (var _b_ = i = 0, _c_ = hunk.new.length; (_b_ <= _c_ ? i < hunk.new.length : i > hunk.new.length); (_b_ <= _c_ ? ++i : --i))
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
            for (var _b_ = i = 0, _c_ = op.old.length; (_b_ <= _c_ ? i < op.old.length : i > op.old.length); (_b_ <= _c_ ? ++i : --i))
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
                for (var _b_ = i = 0, _c_ = op.old.length; (_b_ <= _c_ ? i < op.old.length : i > op.old.length); (_b_ <= _c_ ? ++i : --i))
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
        for (var _a_ = i = entry.ops.length - 1, _b_ = 0; (_a_ <= _b_ ? i <= 0 : i >= 0); (_a_ <= _b_ ? ++i : --i))
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
        for (var _a_ = i = entry.ops.length - 1, _b_ = 0; (_a_ <= _b_ ? i <= 0 : i >= 0); (_a_ <= _b_ ? ++i : --i))
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
            return null
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
            for (var _b_ = i = 0, _c_ = hunk.old.length; (_b_ <= _c_ ? i < hunk.old.length : i > hunk.old.length); (_b_ <= _c_ ? ++i : --i))
            {
                if (lines[hunk.start + delta + i] !== hunk.old[i])
                {
                    return null
                }
            }
            delta += hunk.old.length - hunk.new.length
        }
        ops = []
        delta = 0
        var list1 = _k_.list(shifted.hunks)
        for (var _d_ = 0; _d_ < list1.length; _d_++)
        {
            hunk = list1[_d_]
            ops.push({start:hunk.start,oldStart:hunk.start + delta,old:hunk.old,new:hunk.new,oldMarks:hunk.oldMarks,newMarks:hunk.newMarks})
            delta += hunk.old.length - hunk.new.length
        }
        entry = {ops:ops,block:shifted,start:ops[0].oldStart,end:ops[0].oldStart}
        var list2 = _k_.list(ops)
        for (var _e_ = 0; _e_ < list2.length; _e_++)
        {
            op = list2[_e_]
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
            return null
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
            return null
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
            for (var _b_ = i = 0, _c_ = op.old.length; (_b_ <= _c_ ? i < op.old.length : i > op.old.length); (_b_ <= _c_ ? ++i : --i))
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
            for (var _b_ = i = 0, _c_ = hunk.new.length; (_b_ <= _c_ ? i < hunk.new.length : i > hunk.new.length); (_b_ <= _c_ ? ++i : --i))
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
            return null
        }
        if (seq.length > lines.length)
        {
            return null
        }
        near = (near != null ? near : 0)
        best = null
        dist = Infinity
        for (var _a_ = i = 0, _b_ = lines.length - seq.length + 1; (_a_ <= _b_ ? i < lines.length - seq.length + 1 : i > lines.length - seq.length + 1); (_a_ <= _b_ ? ++i : --i))
        {
            match = true
            for (var _c_ = j = 0, _d_ = seq.length; (_c_ <= _d_ ? j < seq.length : j > seq.length); (_c_ <= _d_ ? ++j : --j))
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
                return null
            }
            if (!!_k_.empty(after))
            {
                if (_k_.empty(lines))
                {
                    return -start
                }
                return null
            }
            if (lines.length && lines[0] === after)
            {
                return -start
            }
            return null
        }
        if (!!_k_.empty(after))
        {
            best = null
            for (var _a_ = i = 0, _b_ = lines.length; (_a_ <= _b_ ? i < lines.length : i > lines.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (lines[i] === before)
                {
                    best = i
                }
            }
            if (best === null)
            {
                return null
            }
            return best + 1 - start
        }
        best = null
        dist = Infinity
        for (var _c_ = i = 0, _d_ = lines.length - 1; (_c_ <= _d_ ? i < lines.length - 1 : i > lines.length - 1); (_c_ <= _d_ ? ++i : --i))
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
        if (best === null)
        {
            return null
        }
        return best - start
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0YmxvY2suanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZ2l0YmxvY2sua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQyxZQUFEOzs7OztJQVdJLFVBQUMsdUJBQVU7Ozs7UUFFUDs2QkFFYyxLQUFLOzs7WUFBZjtZQUVBLHFCQUFXLE9BQU87WUFDbEIscUJBQVcsT0FBTztZQUVsQixRQUFRLFNBQVM7WUFDakIsUUFBVyxRQUFRLElBQUksT0FBTyxPQUFLLElBQU8sT0FBTztZQUVqRCxRQUFXLFFBQVEsSUFBSSxnQkFBZSxFQUFFLFFBQU07WUFDOUMsT0FBVyxRQUFRLElBQUksUUFBTSxRQUFNLFlBQVcsRUFBRSxRQUFNO1lBRXRELFFBQ0ksTUFBVSxNQUNWLElBQVUsUUFBTSxNQUNoQixJQUFVLFNBQ1YsSUFBVSxTQUNWLFNBQVUsS0FBQyxZQUFZLFNBQVMsVUFDaEMsU0FBVSxLQUFDLFlBQVksU0FBUyxVQUNoQyxJQUFVLFNBQVMsU0FBUyxTQUFTO1lBRXpDLGlCQUFhO2lCQUVWLGtCQUFXLFNBQVMsTUFBTSxPQUFLOztnQkFDOUIsTUFBTSxNQUFNLEtBQUs7Z0JBQ2pCLE1BQU0sY0FBVyxNQUFNLElBQUksS0FBSztnQkFDaEMsTUFBTSxlQUFXLE1BQU0sS0FBSzs7OztnQkFFNUIsT0FBTyxNQUNILE1BQU8sTUFDUCxJQUFPLEtBQUssSUFDWixNQUFPLE1BQ1AsS0FBTyxLQUNQLE9BQVE7Ozs2QkFFUDs7O1lBQVQ7WUFDQSxNQUFNLFFBQVEsTUFBTSxNQUFNLEdBQUc7WUFDN0IsTUFBTSxRQUFRLEtBQUMsY0FBYztZQUM3QixNQUFNLE9BQVEsS0FBQyxZQUFZO21CQUNwQixNQUFNO21CQUNOLE1BQU07O2VBRWpCOzs7SUFFSixVQUFDLDBCQUFhLFVBQVM7Ozs7UUFFbkIsWUFBUSxTQUFTLE9BQU8sU0FBUztRQUNqQzt1QkFDSSxJQUFLLFNBQUksU0FBUywwQkFBVCxTQUFTLGFBQVQsU0FBUzs7WUFDbEIsTUFBTSxPQUFNLElBQUks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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/gitblock.kode
