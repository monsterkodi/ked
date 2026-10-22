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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbmRlbnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRYyxXQUFQOzs7SUFVSDs7OztzQkFFZ0IsS0FBQyxFQUFFOzs7O1FBRWYsVUFBVSxLQUFLLGdDQUFnQyxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUU7a0JBRW5DLEtBQUssc0NBQXNDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFRLFVBQXpHLGdCQUFNLHFCQUFXOztRQUVsQixLQUFDLFNBQVM7UUFDVixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQVc7O0lBUWhCOzs7O1FBRUksVUFBVSxLQUFLLGdDQUFnQyxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUU7a0JBRW5DLEtBQUssd0NBQXdDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFRLFVBQTNHLGdCQUFNLHFCQUFXOztRQUVsQixLQUFDLFNBQVM7UUFDVixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQVcifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/indent.kode
