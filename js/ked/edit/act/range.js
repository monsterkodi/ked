var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

export default {
    replaceLineRanges:function (edits)
    {
        var adjust, clampPos, clampRange, count, cursors, highlights, i, lines, maxY, segls, selections, sorted, start
    
        if (_k_.empty(edits))
        {
            return this
        }
        sorted = edits.slice().sort(function (a, b)
        {
            return a[0] - b[0]
        })
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        for (var _a_ = i = sorted.length - 1, _b_ = 0; (_a_ <= _b_ ? i <= 0 : i >= 0); (_a_ <= _b_ ? ++i : --i))
        {
            var _c_ = sorted[i]; start = _c_[0]; count = _c_[1]; segls = _c_[2]
    
            lines = lines.slice(0, typeof start === 'number' ? start : -1).concat(segls).concat(lines.slice(start + count))
        }
        adjust = function (y)
        {
            var list = _k_.list(sorted)
            for (var _d_ = 0; _d_ < list.length; _d_++)
            {
                start = list[_d_][0]
                count = list[_d_][1]
                segls = list[_d_][2]
                if (y < start)
                {
                    continue
                }
                if (y >= start + count)
                {
                    y += segls.length - count
                }
                else
                {
                    y = start + _k_.min(y - start,_k_.max(0,segls.length - 1))
                }
            }
            return y
        }
        maxY = lines.length - 1
        clampPos = function (pos)
        {
            var y
    
            y = _k_.clamp(0,maxY,(adjust(pos[1])))
            return [_k_.clamp(0,kseg.width(lines[y]),pos[0]),y]
        }
        clampRange = function (rng)
        {
            var p1, p2
    
            p1 = clampPos([rng[0],rng[1]])
            p2 = clampPos([rng[2],rng[3]])
            if (p1[1] > p2[1] || (p1[1] === p2[1] && p1[0] > p2[0]))
            {
                return [p2[0],p2[1],p1[0],p1[1]]
            }
            else
            {
                return [p1[0],p1[1],p2[0],p2[1]]
            }
        }
        cursors = this.s.cursors.map(function (pos)
        {
            return clampPos(pos)
        })
        selections = this.s.selections.map(function (rng)
        {
            return clampRange(rng)
        })
        highlights = this.s.highlights.map(function (rng)
        {
            return clampRange(rng)
        })
        this.pushState()
        this.setSegls(lines)
        this.setCursors(cursors)
        this.setSelections(selections)
        return this.setHighlights(highlights)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3JhbmdlLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQWEsVUFBQTtJQUFNOzs7SUFRZiw0QkFBbUI7Ozs7c0JBRUY7O21CQUFYOztRQUVGLFNBQVMsTUFBTSxRQUFRLGVBQU0sR0FBRTs7bUJBQU0sRUFBRSxLQUFHLEVBQUU7O1FBRTVDLFFBQVEsS0FBQyxFQUFFLE1BQU0sY0FBSzs7bUJBQU07O3VCQUV4QixJQUFLLE9BQU8sU0FBTyxTQUFHLHNCQUFBLFNBQUE7O3NCQUNBLE9BQU8sSUFBNUIsZ0JBQU0sZ0JBQU07O1lBQ2IsUUFBUSxZQUFNLFVBQUkscUJBQUEsWUFBTyxPQUFPLE9BQU8sT0FBTyxZQUFNLFFBQU07O1FBRTlELG1CQUFVOztnQ0FFcUI7OztnQkFBdEI7Z0JBQU07Z0JBQU07b0JBQ0QsSUFBSTs7b0JBQWhCOztvQkFDRyxLQUFLLFFBQU07O29CQUNWLEtBQUssTUFBTSxTQUFPOzs7O29CQUVsQixJQUFJLGdCQUFZLElBQUUsY0FBVSxFQUFFLE1BQU0sU0FBTzs7O21CQUVuRDs7UUFFSixPQUFPLE1BQU0sU0FBTztRQUVwQixxQkFBWTs7OztZQUNSLGNBQVUsRUFBRSxNQUFNLE9BQU8sSUFBSTs4QkFDdEIsRUFBRSxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksSUFBSTs7UUFFMUMsdUJBQWM7Ozs7WUFFVixLQUFLLFVBQVUsSUFBSSxHQUFHLElBQUk7WUFDMUIsS0FBSyxVQUFVLElBQUksR0FBRyxJQUFJO2dCQUV2QixHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsT0FBTSxHQUFHLE1BQU8sR0FBRyxLQUFLLEdBQUc7O3dCQUM5QyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHOzs7O3dCQUVyQixHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHOzs7UUFFOUIsVUFBYSxLQUFDLEVBQUUsUUFBUSxjQUFROzttQkFBUSxTQUFXOztRQUNuRCxhQUFhLEtBQUMsRUFBRSxXQUFXLGNBQUs7O21CQUFRLFdBQVc7O1FBQ25ELGFBQWEsS0FBQyxFQUFFLFdBQVcsY0FBSzs7bUJBQVEsV0FBVzs7UUFFbkQsS0FBQztRQUNELEtBQUMsU0FBUztRQUNWLEtBQUMsV0FBVztRQUNaLEtBQUMsY0FBYztlQUNmLEtBQUMsY0FBYyJ9
//# sourceURL=../../../../kode/ked/edit/act/range.kode
