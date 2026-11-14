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

var list = [text,cell,edit,misc,pair,salt,ex]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2JlbHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTs7T0FDYixXQUFBO09BQUssV0FBQTtPQUFLLFdBQUE7T0FBSyxXQUFBO09BQUssV0FBQTtPQUFLLFdBQUE7T0FBSyxTQUFBOzs7QUFFbkMsUUFBRDs7Ozs7SUFFSSxNQUFDLGtCQUFLOzs7O1FBRUY7dUJBQ0ksSUFBSyxTQUFJLE9BQU8sR0FBRywwQkFBVixPQUFPLEdBQUcsYUFBVixPQUFPLEdBQUc7O1lBQVMsSUFBSSxLQUFLOzs0QkFDNUI7OztZQUFUO2lDQUNXO2lCQUFMOztnQkFBRjtnQkFDQSxJQUFJLE1BQU07OztlQUNsQjs7O0lBR0osTUFBQyxrQkFBSyxHQUFFOztpQkFBVyxVQUFMLGdCQUFtQixNQUFLLEtBQUssRUFBRTs7O0lBRTdDLE1BQUMsc0JBQVMsR0FBRTs7ZUFBSyxFQUFFLE9BQU0sRUFBRSxNQUFPLEVBQUUsT0FBTSxFQUFFOzs7SUFFNUMsTUFBQyxpQ0FBb0IsTUFBSzs7c0JBRVI7Ozs7UUFFZCxPQUFPLEtBQUssY0FBSzs7NEJBQVcsRUFBRSxFQUFFLGNBQVUsRUFBRSxLQUFLLEVBQUU7O1FBQ25ELE9BQU8sS0FBQyxjQUFjO2VBQ3RCLE9BQU8sS0FBQyx5QkFBeUI7OztJQUVyQyxNQUFDLDRCQUFlOztlQUFRLEtBQUssZUFBTSxHQUFFOztvQkFBTSxFQUFFLE9BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7Ozs7SUFFakYsTUFBQyx1Q0FBMEI7Ozs7WUFFYixLQUFLLFVBQVU7O21CQUF2Qjs7dUJBRUUsSUFBSyxLQUFLLFNBQU8sU0FBRyxzQkFBQSxTQUFBOztnQkFDakIsS0FBQyxRQUFRLEtBQUssR0FBRyxLQUFLLElBQUU7O2dCQUN2QixLQUFLLE9BQU8sRUFBRTs7O2VBQ3RCOzs7SUFFSixNQUFDLG9DQUF1QixLQUFJOztz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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/belt.kode
