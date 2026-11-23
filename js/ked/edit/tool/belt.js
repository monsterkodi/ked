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
import ex from "./ex.js"
import sue from "./sue.js"


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
        var map, p, _105_22_

        map = {}
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            map[p[0]] = ((_105_22_=map[p[0]]) != null ? _105_22_ : [])
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

    belt["normalizeRanges"] = function (rngs, keepEmpty)
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
            return a[1] !== a[3] || a[0] !== a[2] || (keepEmpty && a[0] === 0 && a[2] === 0)
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

    belt["mergeLineRanges"] = function (lines, rngs, keepEmpty)
    {
        var i, mrgd, s, tail

        if (_k_.empty(rngs) || !(_k_.isArr(rngs)))
        {
            return []
        }
        rngs = this.normalizeRanges(rngs,keepEmpty)
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

var list = [text,cell,edit,misc,pair,salt,ex,sue]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2JlbHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTs7T0FDYixXQUFBO09BQUssV0FBQTtPQUFLLFdBQUE7T0FBSyxXQUFBO09BQUssV0FBQTtPQUFLLFdBQUE7T0FBSyxTQUFBO09BQUcsVUFBQTs7O0FBRXRDLFFBQUQ7Ozs7O0lBRUksTUFBQyxrQkFBSzs7OztRQUVGO3VCQUNJLElBQUssU0FBSSxPQUFPLEdBQUcsMEJBQVYsT0FBTyxHQUFHLGFBQVYsT0FBTyxHQUFHOztZQUFTLElBQUksS0FBSzs7NEJBQzVCOzs7WUFBVDtpQ0FDVztpQkFBTDs7Z0JBQUY7Z0JBQ0EsSUFBSSxNQUFNOzs7ZUFDbEI7OztJQUdKLE1BQUMsa0JBQUssR0FBRTs7aUJBQVcsVUFBTCxnQkFBbUIsTUFBSyxLQUFLLEVBQUU7OztJQUU3QyxNQUFDLHNCQUFTLEdBQUU7O2VBQUssRUFBRSxPQUFNLEVBQUUsTUFBTyxFQUFFLE9BQU0sRUFBRTs7O0lBRTVDLE1BQUMsaUNBQW9CLE1BQUs7O3NCQUVSOzs7O1FBRWQsT0FBTyxLQUFLLGNBQUs7OzRCQUFXLEVBQUUsRUFBRSxjQUFVLEVBQUUsS0FBSyxFQUFFOztRQUNuRCxPQUFPLEtBQUMsY0FBYztlQUN0QixPQUFPLEtBQUMseUJBQXlCOzs7SUFFckMsTUFBQyw0QkFBZTs7ZUFBUSxLQUFLLGVBQU0sR0FBRTs7b0JBQU0sRUFBRSxPQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFOzs7O0lBRWpGLE1BQUMsdUNBQTBCOzs7O1lBRWIsS0FBSyxVQUFVOzttQkFBdkI7O3VCQUVFLElBQUssS0FBSyxTQUFPLFNBQUcsc0JBQUEsU0FBQTs7Z0JBQ2pCLEtBQUMsUUFBUSxLQUFLLEdBQUcsS0FBSyxJQUFFOztnQkFDdkIsS0FBSyxPQUFPLEVBQUU7OztlQUN0Qjs7O0lBRUosTUFBQyxvQ0FB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
//# sourceURL=../../../../kode/ked/edit/tool/belt.kode
