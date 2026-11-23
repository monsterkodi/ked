import belt from "../tool/belt.js"

export default {
    joinLines:function ()
    {
        var idxs, rngs
    
        this.moveCursorsToEndOfLines()
        idxs = belt.lineIndicesForPositions(this.s.cursors)
        rngs = belt.rangesForJoiningLines(this.s.lines,idxs)
        return this.deleteRanges(rngs,this.allCursors())
    },
    moveSelectionOrCursorLines:function (dir)
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        ;[lines,selections,cursors] = belt.moveLineRangesAndPositionsAtIndicesInDirection(this.s.lines,this.s.selections,this.s.cursors,indices,dir)
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    cloneSelectionAndCursorLines:function (dir)
    {
        var blocks, cursors, lines, selections
    
        blocks = belt.blockRangesForRangesAndPositions(this.s.lines,this.s.selections,this.s.cursors)
        ;[lines,selections,cursors] = belt.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(this.s.lines,blocks,this.s.selections,this.s.cursors,dir)
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    toggleCommentAtSelectionOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        ;[lines,selections,cursors] = belt.toggleCommentsInLineRangesAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices)
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    toggleCommentTypeAtSelectionOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        ;[lines,selections,cursors] = belt.toggleCommentTypesInLineRangesAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices)
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9hY3Qvam9pbi5rb2RlIl0sIm1hcHBpbmdzIjoiT0FDYyxXQUFQOzs7SUFJSDs7OztRQUVJLEtBQUM7UUFFRCxPQUFPLEtBQUssd0JBQXdCLEtBQUMsRUFBRTtRQUN2QyxPQUFPLEtBQUssc0JBQXNCLEtBQUMsRUFBRSxNQUFNO2VBRTNDLEtBQUMsYUFBYSxLQUFLLEtBQUM7O0lBRXhCLHFDQUE0Qjs7OztRQUV4QixVQUFVLEtBQUssZ0NBQWdDLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRTtVQUUvRCxNQUFNLFdBQVcsV0FBVyxLQUFLLCtDQUErQyxLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUUsUUFBUSxRQUFRO1FBRTNILEtBQUMsU0FBUztRQUNWLEtBQUMsY0FBYztlQUNmLEtBQUMsV0FBVzs7SUFFaEIsdUNBQThCOzs7O1FBRTFCLFNBQVMsS0FBSyxpQ0FBaUMsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFO1VBRXhFLE1BQU0sV0FBVyxXQUFXLEtBQUsseURBQXlELEtBQUMsRUFBRSxNQUFNLE9BQU8sS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFLFFBQVE7UUFFcEksS0FBQyxTQUFTO1FBQ1YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFXOztJQUVoQjs7OztRQUVJLFVBQVUsS0FBSyxnQ0FBZ0MsS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFO1VBRS9ELE1BQU0sV0FBVyxXQUFXLEtBQUssb0NBQW9DLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFRO1FBRXhHLEtBQUMsU0FBUztRQUNWLEtBQUMsY0FBYztlQUNmLEtBQUMsV0FBVzs7SUFFaEI7Ozs7UUFFSSxVQUFVLEtBQUssZ0NBQWdDLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRTtVQUUvRCxNQUFNLFdBQVcsV0FBVyxLQUFLLHdDQUF3QyxLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUUsUUFBUTtRQUU1RyxLQUFDLFNBQVM7UUFDVixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQVcifQ==
//# sourceURL=../../../../kode/ked/edit/act/join.kode
