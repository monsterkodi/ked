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
        ;[lines,selections,cursors] = belt.indentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices)
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    deindentSelectedOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        ;[lines,selections,cursors] = belt.deindentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices)
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbmRlbnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYyxXQUFQOzs7SUFJSDs7OztzQkFFZSxLQUFDLEVBQUU7Ozs7UUFFZCxVQUFVLEtBQUssZ0NBQWdDLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRTtVQUUvRCxNQUFNLFdBQVcsV0FBVyxLQUFLLHNDQUFzQyxLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUUsUUFBUTtRQUUxRyxLQUFDLFNBQVM7UUFDVixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQVc7O0lBRWhCOzs7O1FBRUksVUFBVSxLQUFLLGdDQUFnQyxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUU7VUFFL0QsTUFBTSxXQUFXLFdBQVcsS0FBSyx3Q0FBd0MsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFLFFBQVE7UUFFNUcsS0FBQyxTQUFTO1FBQ1YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFXIn0=
//# sourceURL=../../../../kode/ked/edit/act/indent.kode
