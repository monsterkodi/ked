var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }}

var colorspans

import kxk from "../../../kxk.js"
let kseg = kxk.kseg


colorspans = (function ()
{
    function colorspans ()
    {}

    colorspans["normalize"] = function (spans)
    {
        var color, lastSpan, merged, result, span, x1, x2, y

        result = []
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (!(_k_.isArr(span)) || span.length !== 4)
            {
                continue
            }
            var _b_ = span; x1 = _b_[0]; y = _b_[1]; x2 = _b_[2]; color = _b_[3]

            if (!(_k_.isNum(x1)) || !(_k_.isNum(y)) || !(_k_.isNum(x2)))
            {
                continue
            }
            if (!(_k_.isStr(color)) || _k_.empty(color))
            {
                continue
            }
            if (x1 >= x2 || y < 0)
            {
                continue
            }
            result.push([x1,y,x2,color])
        }
        result.sort(function (a, b)
        {
            return (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1])
        })
        merged = []
        var list1 = _k_.list(result)
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            span = list1[_c_]
            lastSpan = merged.slice(-1)[0]
            if ((lastSpan != null) && lastSpan[1] === span[1] && lastSpan[3] === span[3] && span[0] <= lastSpan[2])
            {
                lastSpan[2] = _k_.max(lastSpan[2],span[2])
            }
            else
            {
                merged.push(span)
            }
        }
        return merged
    }

    colorspans["spansForLine"] = function (spans, y)
    {
        var result, span

        result = []
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (span[1] === y)
            {
                result.push([span[0],span[2],span[3]])
            }
        }
        return result
    }

    colorspans["colorAtPos"] = function (spans, pos)
    {
        var span, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        var list = _k_.list(spans)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            span = list[_b_]
            if (span[1] === y && (span[0] <= x && x < span[2]))
            {
                return span[3]
            }
        }
        return null
    }

    colorspans["segmentsForRange"] = function (lines, rng)
    {
        var a, b, line, segs, width, x1, x2, y, y1, y2, _77_29_

        var _a_ = rng; x1 = _a_[0]; y1 = _a_[1]; x2 = _a_[2]; y2 = _a_[3]

        segs = []
        y1 = _k_.max(0,y1)
        y2 = _k_.min(lines.length - 1,y2)
        if (y1 > y2)
        {
            return segs
        }
        for (var _b_ = y = y1, _c_ = y2; (_b_ <= _c_ ? y <= y2 : y >= y2); (_b_ <= _c_ ? ++y : --y))
        {
            line = ((_77_29_=lines[y]) != null ? _77_29_ : [])
            width = kseg.width(line)
            a = (y === y1 ? x1 : 0)
            b = (y === y2 ? x2 : width)
            a = _k_.clamp(0,width,a)
            b = _k_.clamp(0,width,b)
            if (a < b)
            {
                segs.push([a,y,b])
            }
        }
        return segs
    }

    colorspans["removeSegment"] = function (spans, x1, y, x2)
    {
        var result, span

        result = []
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (span[1] !== y || span[2] <= x1 || span[0] >= x2)
            {
                result.push(span)
            }
            else
            {
                if (span[0] < x1)
                {
                    result.push([span[0],y,x1,span[3]])
                }
                if (x2 < span[2])
                {
                    result.push([x2,y,span[2],span[3]])
                }
            }
        }
        return result
    }

    colorspans["overlay"] = function (spans, ranges, color, lines)
    {
        var out, rng, seg, x1, x2, y

        out = this.normalize(spans)
        if (_k_.empty(color))
        {
            return out
        }
        var list = _k_.list(ranges)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            var list1 = _k_.list(this.segmentsForRange(lines,rng))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                seg = list1[_b_]
                var _c_ = seg; x1 = _c_[0]; y = _c_[1]; x2 = _c_[2]

                out = this.removeSegment(out,x1,y,x2)
                out.push([x1,y,x2,color])
                out = this.normalize(out)
            }
        }
        return out
    }

    colorspans["clear"] = function (spans, ranges)
    {
        var a, b, out, rng, x1, x2, y, y1, y2

        out = this.normalize(spans)
        var list = _k_.list(ranges)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            var _b_ = rng; x1 = _b_[0]; y1 = _b_[1]; x2 = _b_[2]; y2 = _b_[3]

            for (var _c_ = y = y1, _d_ = y2; (_c_ <= _d_ ? y <= y2 : y >= y2); (_c_ <= _d_ ? ++y : --y))
            {
                a = (y === y1 ? x1 : 0)
                b = (y === y2 ? x2 : 1000000000)
                out = this.removeSegment(out,a,y,b)
            }
        }
        return this.normalize(out)
    }

    colorspans["lineMap"] = function (oldLines, newLines)
    {
        var cursor, idxs, key, map, newLen, newMidLen, ni, oldLen, oldMidLen, positions, pre, suf, y, _170_31_, _178_38_

        oldLen = oldLines.length
        newLen = newLines.length
        map = []
        pre = 0
        while (pre < oldLen && pre < newLen && _k_.eql(oldLines[pre], newLines[pre]))
        {
            map[pre] = pre
            pre += 1
        }
        suf = 0
        while (suf < oldLen - pre && suf < newLen - pre && _k_.eql(oldLines[oldLen - 1 - suf], newLines[newLen - 1 - suf]))
        {
            map[oldLen - 1 - suf] = newLen - 1 - suf
            suf += 1
        }
        oldMidLen = oldLen - pre - suf
        newMidLen = newLen - pre - suf
        if (oldMidLen === newMidLen)
        {
            for (var _a_ = y = pre, _b_ = oldLen - suf; (_a_ <= _b_ ? y < oldLen - suf : y > oldLen - suf); (_a_ <= _b_ ? ++y : --y))
            {
                map[y] = y
            }
        }
        else
        {
            positions = Object.create(null)
            for (var _c_ = y = pre, _d_ = newLen - suf; (_c_ <= _d_ ? y < newLen - suf : y > newLen - suf); (_c_ <= _d_ ? ++y : --y))
            {
                key = kseg.str(newLines[y])
                positions[key] = ((_170_31_=positions[key]) != null ? _170_31_ : [])
                positions[key].push(y)
            }
            cursor = pre
            for (var _e_ = y = pre, _f_ = oldLen - suf; (_e_ <= _f_ ? y < oldLen - suf : y > oldLen - suf); (_e_ <= _f_ ? ++y : --y))
            {
                key = kseg.str(oldLines[y])
                idxs = ((_178_38_=positions[key]) != null ? _178_38_ : [])
                while (idxs.length && idxs[0] < cursor)
                {
                    idxs.shift()
                }
                if (idxs.length)
                {
                    ni = idxs.shift()
                    map[y] = ni
                    cursor = ni + 1
                }
                else
                {
                    map[y] = -1
                }
            }
        }
        return map
    }

    colorspans["adjustSegment"] = function (span, oldLine, newLine)
    {
        var color, delta, newChangeEnd, newLen, newWidth, oldChangeEnd, oldChangeStart, oldLen, oldWidth, p, preWidth, s, x1, x2, y

        var _a_ = span; x1 = _a_[0]; y = _a_[1]; x2 = _a_[2]; color = _a_[3]

        oldLen = oldLine.length
        newLen = newLine.length
        p = 0
        while (p < oldLen && p < newLen && oldLine[p] === newLine[p])
        {
            p += 1
        }
        s = 0
        while (s < oldLen - p && s < newLen - p && oldLine[oldLen - 1 - s] === newLine[newLen - 1 - s])
        {
            s += 1
        }
        oldWidth = kseg.width(oldLine)
        newWidth = kseg.width(newLine)
        preWidth = kseg.width(oldLine.slice(0, typeof p === 'number' ? p : -1))
        oldChangeStart = preWidth
        oldChangeEnd = oldWidth - kseg.width(oldLine.slice(oldLen - s, typeof oldLen === 'number' ? oldLen : -1))
        newChangeEnd = newWidth - kseg.width(newLine.slice(newLen - s, typeof newLen === 'number' ? newLen : -1))
        delta = newWidth - oldWidth
        if (oldChangeStart === oldChangeEnd)
        {
            if (x1 < preWidth && preWidth <= x2)
            {
                return [x1,y,x2 + delta,color]
            }
            if (x1 >= preWidth)
            {
                return [x1 + delta,y,x2 + delta,color]
            }
            return [x1,y,x2,color]
        }
        if (x2 <= oldChangeStart)
        {
            return [x1,y,x2,color]
        }
        if (x1 >= oldChangeEnd)
        {
            return [x1 + delta,y,x2 + delta,color]
        }
        if (x1 <= oldChangeStart && x2 >= oldChangeEnd)
        {
            return [x1,y,x2 + delta,color]
        }
        if (x1 <= oldChangeStart)
        {
            return [x1,y,oldChangeStart,color]
        }
        if (x2 >= oldChangeEnd)
        {
            return [newChangeEnd,y,x2 + delta,color]
        }
        return null
    }

    colorspans["adjust"] = function (spans, oldLines, newLines)
    {
        var adj, color, map, newLine, ny, oldLine, result, span, x1, x2, y, _261_34_, _262_35_

        if (_k_.empty(spans))
        {
            return []
        }
        map = this.lineMap(oldLines,newLines)
        result = []
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            var _b_ = span; x1 = _b_[0]; y = _b_[1]; x2 = _b_[2]; color = _b_[3]

            ny = map[y]
            if (!(ny != null) || ny < 0)
            {
                continue
            }
            oldLine = ((_261_34_=oldLines[y]) != null ? _261_34_ : [])
            newLine = ((_262_35_=newLines[ny]) != null ? _262_35_ : [])
            if (_k_.eql(oldLine, newLine))
            {
                result.push([x1,ny,x2,color])
            }
            else
            {
                adj = this.adjustSegment(span,oldLine,newLine)
                if ((adj != null))
                {
                    adj[1] = ny
                    result.push(adj)
                }
            }
        }
        return this.normalize(result)
    }

    return colorspans
})()

export default colorspans;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzcGFucy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL2NvbG9yc3BhbnMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTs7O0FBRVYsY0FBVDs7Ozs7SUFFSSxZQUFDLHdCQUFXOzs7O1FBRVI7NEJBRVk7OztZQUFSO2tCQUV5QixVQUFSLFVBQWdCLEtBQUssV0FBVTs7Z0JBQWhEOztzQkFFa0IsTUFBakIsYUFBRyxZQUFFLGFBQUc7O2tCQUVjLFVBQU4sVUFBd0IsVUFBTCxTQUF3QixVQUFOOztnQkFBdEQ7O2tCQUMwQixVQUFULHFCQUF1Qjs7Z0JBQXhDOztnQkFDWSxNQUFNLE1BQU0sSUFBSTs7Z0JBQTVCOztZQUVBLE9BQU8sTUFBTSxHQUFHLEVBQUUsR0FBRzs7UUFFekIsT0FBTyxlQUFNLEdBQUU7O29CQUFNLEVBQUUsT0FBTSxFQUFFLEtBQUssRUFBRSxLQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUcsRUFBRTs7UUFFdkQ7NkJBRVk7OztZQUFSO1lBRUEsV0FBVztpQkFFUixxQkFBYyxTQUFTLE9BQU0sS0FBSyxNQUFPLFNBQVMsT0FBTSxLQUFLLE1BQU8sS0FBSyxNQUFNLFNBQVM7O2dCQUN2RixTQUFTLGFBQVMsU0FBUyxHQUFHLEtBQUs7Ozs7Z0JBRW5DLE9BQU8sS0FBSzs7O2VBRXBCOzs7SUFFSixZQUFDLDJCQUFjLE9BQU07Ozs7UUFFakI7NEJBRVk7OztZQUFSO2dCQUNHLEtBQUssT0FBTTs7Z0JBQ1YsT0FBTyxNQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSzs7O2VBRTFDOzs7SUFFSixZQUFDLHlCQUFZLE9BQU07Ozs7a0JBRVAsS0FBUCxZQUFFOzs0QkFFUzs7O1lBQVI7Z0JBQ0csS0FBSyxPQUFNLE1BQU0sS0FBSyxNQUFNLEtBQUEsSUFBSSxLQUFLOzt1QkFDakMsS0FBSzs7O2VBRWhCOzs7SUFFSixZQUFDLCtCQUFrQixPQUFNOzs7O2tCQUVMLEtBQWYsYUFBRyxhQUFH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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/colorspans.kode
