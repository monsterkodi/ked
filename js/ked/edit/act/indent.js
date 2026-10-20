var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import belt from "../tool/belt.js"

export default {
    indentSelectedLines:function ()
    {
        var cursors, indices, lines, selections
    
        if (_k_.empty(this.s.selections))
        {
            return
        }
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        var _a_ = belt.indentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _a_[0]; selections = _a_[1]; cursors = _a_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    deindentSelectedOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        var _b_ = belt.deindentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _b_[0]; selections = _b_[1]; cursors = _b_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbmRlbnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7SUFrQkk7Ozs7c0JBRWdCLEtBQUMsRUFBRTs7OztRQUVmLFVBQVUsS0FBSyxnQ0FBZ0MsS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFO2tCQUVuQyxLQUFLLHNDQUFzQyxLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUUsUUFBUTs7UUFFMUcsS0FBQyxTQUFTO1FBQ1YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFXOztJQVFoQjs7OztRQUVJLFVBQVUsS0FBSyxnQ0FBZ0MsS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFO2tCQUVuQyxLQUFLLHdDQUF3QyxLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUUsUUFBUTs7UUFFNUcsS0FBQyxTQUFTO1FBQ1YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFXIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/indent.kode
