var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var belt, key, mod, val

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import text from "./text.js"
import cell from "./cell.js"
import edit from "./edit.js"
import misc from "./misc.js"
import pair from "./pair.js"
import salt from "./salt.js"


belt = (function ()
{
    function belt ()
    {}

    belt["sum"] = function (arrays)
    {
        var array, i, n, sum

        sum = []
        for (var _a_ = n = 0, _b_ = arrays[0].length; (_a_ <= _b_ ? n < arrays[0].length : n > arrays[0].length); (_a_ <= _b_ ? ++n : --n))
        {
            sum.push(0)
        }
        var list = _k_.list(arrays)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            array = list[_c_]
            var list1 = _k_.list(array)
            for (i = 0; i < list1.length; i++)
            {
                n = list1[i]
                sum[i] += n
            }
        }
        return sum
    }

    belt["pos"] = function (x, y)
    {
        return ((_k_.isArr(x) && _k_.empty(y)) ? x : [x,y])
    }

    belt["samePos"] = function (a, b)
    {
        return a[0] === b[0] && a[1] === b[1]
    }

    belt["normalizePositions"] = function (posl, maxY)
    {
        if (_k_.empty(posl))
        {
            return []
        }
        posl = posl.map(function (a)
        {
            return [_k_.max(0,a[0]),_k_.clamp(0,maxY,a[1])]
        })
        posl = this.sortPositions(posl)
        return posl = this.removeDuplicatePositions(posl)
    }

    belt["sortPositions"] = function (posl)
    {
        return posl.sort(function (a, b)
        {
            return (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1])
        })
    }

    belt["removeDuplicatePositions"] = function (posl)
    {
        var i

        if (posl.length <= 1)
        {
            return posl
        }
        for (var _a_ = i = posl.length - 1, _b_ = 1; (_a_ <= _b_ ? i <= 1 : i >= 1); (_a_ <= _b_ ? ++i : --i))
        {
            if (this.samePos(posl[i],posl[i - 1]))
            {
                posl.splice(i,1)
            }
        }
        return posl
    }

    belt["indexOfPosInPositions"] = function (pos, posl)
    {
        if (_k_.empty(posl))
        {
            return -1
        }
        return posl.findIndex(function (p)
        {
            return _k_.eql(pos, p)
        })
    }

    belt["lineIndicesForPositions"] = function (posl)
    {
        var pos, set

        set = new Set()
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            set.add(pos[1])
        }
        return Array.from(set)
    }

    belt["positionInDirection"] = function (pos, dir)
    {
        var x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        switch (dir)
        {
            case 'up':
                return [x,y - 1]

            case 'down':
                return [x,y + 1]

            case 'left':
                return [x - 1,y]

            case 'right':
                return [x + 1,y]

        }

    }

    belt["movePositionsInDirection"] = function (posl, dir)
    {
        return posl.map((function (p)
        {
            return this.positionInDirection(p,dir)
        }).bind(this))
    }

    belt["traversePositionsInDirection"] = function (posl, pos, dir)
    {
        var next

        while (next = this.neighborPositionInDirection(posl,pos,dir))
        {
            pos = next
        }
        return pos
    }

    belt["neighborPositionInDirection"] = function (posl, pos, dir)
    {
        var nbp

        nbp = this.positionInDirection(pos,dir)
        if (this.positionsContain(posl,nbp))
        {
            return posl[this.indexOfPosInPositions(nbp,posl)]
        }
    }

    belt["positionsContain"] = function (posl, pos)
    {
        var p

        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            if (_k_.eql(p, pos))
            {
                return true
            }
        }
        return false
    }

    belt["positionsOutsideRange"] = function (posl, rng)
    {
        return posl.filter((function (p)
        {
            return this.isPosOutsideRange(p,rng)
        }).bind(this))
    }

    belt["deltaOfPosToRect"] = function (p, r)
    {
        var dx, dy

        dx = p[0] < r[0] ? r[0] - p[0] : p[0] > r[2] ? p[0] - r[2] : _k_.max(r[0] - p[0],p[0] - r[2])
        dy = p[1] < r[1] ? r[1] - p[1] : p[1] > r[3] ? p[1] - r[3] : _k_.max(r[1] - p[1],p[1] - r[3])
        return [dx,dy]
    }

    belt["columnPositionsMap"] = function (posl)
    {
        var map, p, _117_22_

        map = {}
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            map[p[0]] = ((_117_22_=map[p[0]]) != null ? _117_22_ : [])
            map[p[0]].push(p)
        }
        return map
    }

    belt["neighborPositionGroups"] = function (posl)
    {
        var groups, p

        groups = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            if ((groups.slice(-1)[0] != null ? groups.slice(-1)[0].slice(-1)[0][1] : undefined) === p[1] - 1)
            {
                groups.slice(-1)[0].push(p)
            }
            else
            {
                groups.push([p])
            }
        }
        return groups
    }

    belt["positionColumns"] = function (posl)
    {
        var columns, key, pl

        columns = []
        for (key in this.columnPositionsMap(posl))
        {
            pl = this.columnPositionsMap(posl)[key]
            columns = columns.concat(this.neighborPositionGroups(pl))
        }
        return columns
    }

    belt["isPosInsideRange"] = function (pos, rng)
    {
        if (this.isPosBeforeRange(pos,rng))
        {
            return false
        }
        if (this.isPosAfterRange(pos,rng))
        {
            return false
        }
        return true
    }

    belt["isPosOutsideRange"] = function (pos, rng)
    {
        return !this.isPosInsideRange(pos,rng)
    }

    belt["isPosBeforeRange"] = function (pos, rng)
    {
        return pos[1] < rng[1] || (pos[1] === rng[1] && pos[0] < rng[0])
    }

    belt["isPosAfterRange"] = function (pos, rng)
    {
        return pos[1] > rng[3] || (pos[1] === rng[3] && pos[0] > rng[2])
    }

    belt["isPosTouchingRange"] = function (pos, rng)
    {
        if (this.isPosInsideRange(pos,rng))
        {
            return true
        }
        if (_k_.eql(pos, this.endOfRange(rng)))
        {
            return true
        }
        if (_k_.eql(pos, this.startOfRange(rng)))
        {
            return true
        }
        return false
    }

    belt["rangeContainsPos"] = function (rng, pos)
    {
        return this.isPosInsideRange(pos,rng)
    }

    belt["rangeContainsRange"] = function (rng, ins)
    {
        return this.isPosInsideRange(this.startOfRange(ins),rng) && this.isPosInsideRange(this.endOfRange(ins),rng)
    }

    belt["rangeTouchesPos"] = function (rng, pos)
    {
        return this.isPosTouchingRange(pos,rng)
    }

    belt["rangeForPos"] = function (pos)
    {
        return [pos[0],pos[1],pos[0],pos[1]]
    }

    belt["rangeForSpan"] = function (span)
    {
        return [span[0],span[1],span[2],span[1]]
    }

    belt["rangeFromStartToEnd"] = function (start, end)
    {
        return [start[0],start[1],end[0],end[1]]
    }

    belt["rangesForSpans"] = function (spans)
    {
        return spans.map(this.rangeForSpan)
    }

    belt["isEmptyRange"] = function (rng)
    {
        return rng[0] === rng[2] && rng[1] === rng[3]
    }

    belt["isRangeEmpty"] = function (rng)
    {
        return rng[0] === rng[2] && rng[1] === rng[3]
    }

    belt["startOfRange"] = function (rng)
    {
        return [rng[0],rng[1]]
    }

    belt["endOfRange"] = function (rng)
    {
        return [rng[2],rng[3]]
    }

    belt["rangeGrownBy"] = function (rng, delta)
    {
        return [rng[0] - delta,rng[1],rng[2] + delta,rng[3]]
    }

    belt["rangeShrunkenBy"] = function (rng, delta)
    {
        return [rng[0] + delta,rng[1],rng[2] - delta,rng[3]]
    }

    belt["rangesShrunkenBy"] = function (rngs, delta)
    {
        return rngs.filter(function (r)
        {
            return r[2] - r[0] >= 2 * delta
        }).map((function (r)
        {
            return this.rangeShrunkenBy(r,delta)
        }).bind(this))
    }

    belt["rangesGrownBy"] = function (rngs, delta)
    {
        return rngs.map((function (r)
        {
            return this.rangeGrownBy(r,delta)
        }).bind(this))
    }

    belt["isSameSpan"] = function (a, b)
    {
        return _k_.eql(a, b)
    }

    belt["isSameRange"] = function (a, b)
    {
        return _k_.eql(a, b)
    }

    belt["isPosInsideSpan"] = function (pos, span)
    {
        if (this.isPosBeforeSpan(pos,span))
        {
            return false
        }
        if (this.isPosAfterSpan(pos,span))
        {
            return false
        }
        return true
    }

    belt["isPosBeforeSpan"] = function (pos, span)
    {
        return pos[1] < span[1] || (pos[1] === span[1] && pos[0] < span[0])
    }

    belt["isPosAfterSpan"] = function (pos, span)
    {
        return pos[1] > span[1] || (pos[1] === span[1] && pos[0] >= span[2])
    }

    belt["isPosBeforeOrInsideSpan"] = function (pos, span)
    {
        return this.isPosBeforeSpan(pos,span) || this.isPosInsideSpan(pos,span)
    }

    belt["startOfSpan"] = function (s)
    {
        return [s[0],s[1]]
    }

    belt["endOfSpan"] = function (s)
    {
        return [s[2],s[1]]
    }

    belt["nextSpanAfterPos"] = function (spans, pos)
    {
        var index, span

        if (_k_.empty(spans))
        {
            return
        }
        if (this.isPosAfterSpan(pos,spans.slice(-1)[0]))
        {
            pos = [0,0]
        }
        if (this.isPosBeforeSpan(pos,spans[0]))
        {
            return spans[0]
        }
        var list = _k_.list(spans)
        for (index = 0; index < list.length; index++)
        {
            span = list[index]
            if (this.isPosAfterSpan(pos,span))
            {
                if (index + 1 < spans.length && this.isPosBeforeOrInsideSpan(pos,spans[index + 1]))
                {
                    return spans[index + 1]
                }
            }
        }
    }

    belt["prevSpanBeforePos"] = function (spans, pos)
    {
        var index, span

        if (_k_.empty(spans))
        {
            return
        }
        if (this.isPosBeforeSpan(pos,spans[0]))
        {
            return spans.slice(-1)[0]
        }
        if (this.isPosInsideSpan(pos,spans[0]))
        {
            return spans.slice(-1)[0]
        }
        for (var _a_ = index = spans.length - 1, _b_ = 0; (_a_ <= _b_ ? index <= 0 : index >= 0); (_a_ <= _b_ ? ++index : --index))
        {
            span = spans[index]
            if (this.isPosAfterSpan(pos,span))
            {
                return span
            }
        }
    }

    belt["normalizeSpans"] = function (spans)
    {
        if (_k_.empty(spans))
        {
            return []
        }
        spans = spans.map(function (a)
        {
            if (a[0] > a[2])
            {
                return [a[2],a[1],a[0]]
            }
            else
            {
                return a
            }
        })
        spans.sort(function (a, b)
        {
            if (a[1] === b[1])
            {
                return a[0] - b[0]
            }
            else
            {
                return a[1] - b[1]
            }
        })
        return spans = spans.filter(function (a)
        {
            return a[0] !== a[2]
        })
    }

    belt["rangesContainLine"] = function (rngs, lineIndex)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if ((rng[1] <= lineIndex && lineIndex <= rng[3]))
            {
                return true
            }
        }
        return false
    }

    belt["rangesContainSpan"] = function (rngs, span)
    {
        return this.rangesContainRange(rngs,this.rangeForSpan(span))
    }

    belt["rangesContainRange"] = function (rngs, range)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (_k_.eql(rng, range))
            {
                return true
            }
        }
        return false
    }

    belt["normalizeRanges"] = function (rngs)
    {
        if (_k_.empty(rngs) || !(_k_.isArr(rngs)))
        {
            return []
        }
        rngs = rngs.map(function (a)
        {
            if (a[1] > a[3])
            {
                return [a[2],a[3],a[0],a[1]]
            }
            else
            {
                return a
            }
        })
        rngs = rngs.map(function (a)
        {
            if (a[1] === a[3] && a[0] > a[2])
            {
                return [a[2],a[1],a[0],a[3]]
            }
            else
            {
                return a
            }
        })
        rngs.sort(function (a, b)
        {
            if (a[1] === b[1])
            {
                return a[0] - b[0]
            }
            else
            {
                return a[1] - b[1]
            }
        })
        return rngs.filter(function (a)
        {
            return a[1] !== a[3] || a[0] !== a[2]
        })
    }

    belt["startPositionsOfRanges"] = function (rngs)
    {
        return rngs.map((function (r)
        {
            return this.startOfRange(r)
        }).bind(this))
    }

    belt["endPositionsOfRanges"] = function (rngs)
    {
        return rngs.map((function (r)
        {
            return this.endOfRange(r)
        }).bind(this))
    }

    belt["removeTrailingEmptyRange"] = function (rngs)
    {
        if (this.isEmptyRange(rngs.slice(-1)[0]))
        {
            return rngs.slice(0, -1)
        }
        else
        {
            return rngs
        }
    }

    belt["rangesForLinesSplitAtPositions"] = function (lines, posl)
    {
        var idx, pos, rngs

        if (_k_.empty(posl))
        {
            return []
        }
        if (posl[0][1] >= lines.length)
        {
            return [[0,0,kseg.width(lines.slice(-1)[0]),lines.length - 1],[kseg.width(lines.slice(-1)[0]),lines.length - 1,kseg.width(lines.slice(-1)[0]),lines.length - 1]]
        }
        rngs = [[0,0,posl[0][0],posl[0][1]]]
        var list = _k_.list(posl)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            if (idx > 0)
            {
                rngs.push([posl[idx - 1][0],posl[idx - 1][1],pos[0],pos[1]])
            }
        }
        rngs.push([pos[0],pos[1],kseg.width(lines.slice(-1)[0]),lines.length - 1])
        return rngs
    }

    belt["rangeInRangesContainingPos"] = function (rngs, pos)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (this.rangeContainsPos(rng,pos))
            {
                return rng
            }
        }
    }

    belt["rangeInRangesTouchingPos"] = function (rngs, pos)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (this.rangeTouchesPos(rng,pos))
            {
                return rng
            }
        }
    }

    belt["lineIndicesForRangesOrPositions"] = function (rngs, posl)
    {
        var indices

        indices = this.lineIndicesForRanges(rngs)
        if (_k_.empty(indices))
        {
            indices = this.lineIndicesForPositions(posl)
        }
        return indices
    }

    belt["lineIndicesForRangesAndPositions"] = function (rngs, posl)
    {
        var indices

        indices = kxk.util.uniq(this.lineIndicesForRanges(rngs).concat(this.lineIndicesForPositions(posl)))
        indices.sort()
        return indices
    }

    belt["lineIndicesForSpans"] = function (spans)
    {
        return kxk.util.uniq(spans.map(function (s)
        {
            return s[1]
        }))
    }

    belt["frontmostSpans"] = function (spans)
    {
        var fms, span

        fms = {}
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (!fms[span[1]])
            {
                fms[span[1]] = span
            }
        }
        return Object.values(fms)
    }

    belt["lineIndicesForRange"] = function (rng)
    {
        var indices, li

        indices = []
        for (var _a_ = li = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? li <= rng[3] : li >= rng[3]); (_a_ <= _b_ ? ++li : --li))
        {
            if (li !== rng[3] || rng[2] > 0)
            {
                indices.push(li)
            }
        }
        return indices
    }

    belt["lineIndicesForRanges"] = function (rngs)
    {
        var indices, rng

        indices = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            indices = indices.concat(this.lineIndicesForRange(rng))
        }
        return indices
    }

    belt["blockRangesForRangesAndPositions"] = function (lines, rngs, posl)
    {
        var block, blocks, ii, index, indices

        blocks = []
        indices = this.lineIndicesForRangesAndPositions(rngs,posl)
        if (_k_.empty(indices))
        {
            return blocks
        }
        block = [0,indices[0],-1,-1]
        var list = _k_.list(indices)
        for (ii = 0; ii < list.length; ii++)
        {
            index = list[ii]
            block[3] = index
            if (indices[ii + 1] === index + 1)
            {
                continue
            }
            block[2] = lines[index].length
            blocks.push(block)
            block = [0,indices[ii + 1],-1,-1]
        }
        return blocks
    }

    belt["mergeLineRanges"] = function (lines, rngs)
    {
        var i, mrgd, s, tail

        if (_k_.empty(rngs) || !(_k_.isArr(rngs)))
        {
            return []
        }
        rngs = this.normalizeRanges(rngs)
        mrgd = []
        var list = _k_.list(rngs)
        for (i = 0; i < list.length; i++)
        {
            s = list[i]
            if (_k_.empty(mrgd) || s[1] > tail[3] + 1 || s[1] === tail[3] && s[0] > tail[2] || s[1] === tail[3] + 1 && (s[0] > 0 || tail[2] < lines[tail[3]].length))
            {
                mrgd.push(s)
                tail = s
            }
            else if (s[3] > tail[3] || s[3] === tail[3] && s[2] > tail[2])
            {
                tail[2] = s[2]
                tail[3] = s[3]
            }
        }
        return mrgd
    }

    return belt
})()

var list = [text,cell,edit,misc,pair,salt]
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    mod = list[_a_]
    for (key in mod)
    {
        val = mod[key]
        belt[key] = val
    }
}
export default belt;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2JlbHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTs7T0FDYixXQUFBO09BQUssV0FBQTtPQUFLLFdBQUE7T0FBSyxXQUFBO09BQUssV0FBQTtPQUFLLFdBQUE7OztBQUV0QixRQUFUOzs7OztJQUVJLE1BQUMsa0JBQUs7Ozs7UUFFRjt1QkFDSSxJQUFLLFNBQUksT0FBTyxHQUFHLDBCQUFWLE9BQU8sR0FBRyxhQUFWLE9BQU8sR0FBRzs7WUFBUyxJQUFJLEtBQUs7OzRCQUM1Qjs7O1lBQVQ7aUNBQ1c7aUJBQUw7O2dCQUFGO2dCQUNBLElBQUksTUFBTTs7O2VBQ2xCOzs7SUFRSixNQUFDLGtCQUFLLEdBQUU7O2lCQUFXLFVBQUwsZ0JBQW1CLE1BQUssS0FBSyxFQUFFOzs7SUFFN0MsTUFBQyxzQkFBUyxHQUFFOztlQUFLLEVBQUUsT0FBTSxFQUFFLE1BQU8sRUFBRSxPQUFNLEVBQUU7OztJQUU1QyxNQUFDLGlDQUFvQixNQUFLOztzQkFFUDs7OztRQUVmLE9BQU8sS0FBSyxjQUFLOzs0QkFBVyxFQUFFLEVBQUUsY0FBVSxFQUFFLEtBQUssRUFBRTs7UUFDbkQsT0FBTyxLQUFDLGNBQWM7ZUFDdEIsT0FBTyxLQUFDLHlCQUF5Qjs7O0lBRXJDLE1BQUMsNEJBQWU7O2VBQVEsS0FBSyxlQUFNLEdBQUU7O29CQUFNLEVBQUUsT0FBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7OztJQUVqRixNQUFDLHVDQUEwQjs7OztZQUVaLEtBQUssVUFBVTs7bUJBQXZCOzt1QkFFQyxJQUFLLEtBQUssU0FBTyxTQUFHLHNCQUFBLFNBQUE7O2dCQUNqQixLQUFDLFFBQVEsS0FBSyxHQUFHLEtBQUssSUFBRTs7Z0JBQ3ZCLEtBQUssT0FBTyxFQUFFOzs7ZUFDdEI7OztJQUVKLE1BQUMsb0NBQXVCLEtBQUk7O3NCQUVUOzttQkFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/belt.kode
