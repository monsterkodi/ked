var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import belt from "../tool/belt.js"

export default {
    sortSelectionsOrCursorLines:function ()
    {
        var cursors, lines, ranges, selections, sorted, texts
    
        ranges = this.s.selections
        if (_k_.empty(ranges))
        {
            ranges = belt.lineRangesForPositions(this.s.lines,this.s.cursors)
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges)
        texts = ranges.map((function (rng)
        {
            return belt.textForLineRange(this.s.lines,rng)
        }).bind(this))
        sorted = texts.map(function (text)
        {
            return text
        })
        sorted.sort(function (a, b)
        {
            return a.localeCompare(b)
        })
        if (_k_.eql(sorted, texts))
        {
            sorted.reverse()
        }
        var _a_ = belt.replaceTextsInLineRanges(this.s.lines,ranges,sorted); lines = _a_[0]; selections = _a_[1]
    
        cursors = belt.endPositionsOfRanges(selections)
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9hY3Qvc29ydC5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUNjLFdBQVA7OztJQUlIOzs7O1FBRUksU0FBUyxLQUFDLEVBQUU7c0JBR0g7O1lBQ0wsU0FBUyxLQUFLLHVCQUF1QixLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUU7O1FBRXJELFNBQVMsS0FBSyxnQkFBZ0IsS0FBQyxFQUFFLE1BQU07UUFFdkMsUUFBUSxPQUFPLGVBQUs7O21CQUFRLEtBQUssaUJBQWlCLEtBQUMsRUFBRSxNQUFNOztRQUUzRCxTQUFTLE1BQU0sY0FBSzs7bUJBQVM7O1FBRTdCLE9BQU8sZUFBTSxHQUFFOzttQkFBTSxFQUFFLGNBQWM7O29CQUVqQixRQUFXOztZQUEvQixPQUFPOztrQkFFYyxLQUFLLHlCQUF5QixLQUFDLEVBQUUsTUFBTSxPQUFPLFNBQWxFLGdCQUFNOztRQUVQLFVBQVUsS0FBSyxxQkFBcUI7UUFFcEMsS0FBQyxTQUFTO1FBQ1YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFXIn0=
//# sourceURL=../../../../kode/ked/edit/act/sort.kode
