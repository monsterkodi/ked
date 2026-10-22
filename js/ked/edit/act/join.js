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
        var _a_ = belt.moveLineRangesAndPositionsAtIndicesInDirection(this.s.lines,this.s.selections,this.s.cursors,indices,dir); lines = _a_[0]; selections = _a_[1]; cursors = _a_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    cloneSelectionAndCursorLines:function (dir)
    {
        var blocks, cursors, lines, selections
    
        blocks = belt.blockRangesForRangesAndPositions(this.s.lines,this.s.selections,this.s.cursors)
        var _b_ = belt.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(this.s.lines,blocks,this.s.selections,this.s.cursors,dir); lines = _b_[0]; selections = _b_[1]; cursors = _b_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    toggleCommentAtSelectionOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        var _c_ = belt.toggleCommentsInLineRangesAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _c_[0]; selections = _c_[1]; cursors = _c_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    toggleCommentTypeAtSelectionOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        var _d_ = belt.toggleCommentTypesInLineRangesAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _d_[0]; selections = _d_[1]; cursors = _d_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9hY3Qvam9pbi5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7SUFrQkk7Ozs7UUFFSSxLQUFDO1FBRUQsT0FBTyxLQUFLLHdCQUF3QixLQUFDLEVBQUU7UUFDdkMsT0FBTyxLQUFLLHNCQUFzQixLQUFDLEVBQUUsTUFBTTtlQUUzQyxLQUFDLGFBQWEsS0FBSyxLQUFDOztJQVF4QixxQ0FBNEI7Ozs7UUFFeEIsVUFBVSxLQUFLLGdDQUFnQyxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUU7a0JBRW5DLEtBQUssK0NBQStDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFRLFFBQVE7O1FBRTNILEtBQUMsU0FBUztRQUNWLEtBQUMsY0FBYztlQUNmLEtBQUMsV0FBVzs7SUFRaEIsdUNBQThCOzs7O1FBRTFCLFNBQVMsS0FBSyxpQ0FBaUMsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFO2tCQUU1QyxLQUFLLHlEQUF5RCxLQUFDLEVBQUUsTUFBTSxPQUFPLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFROztRQUVwSSxLQUFDLFNBQVM7UUFDVixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQVc7O0lBUWhCOzs7O1FBRUksVUFBVSxLQUFLLGdDQUFnQyxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUU7a0JBRW5DLEtBQUssb0NBQW9DLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFROztRQUV4RyxLQUFDLFNBQVM7UUFDVixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQVc7O0lBRWhCOzs7O1FBRUksVUFBVSxLQUFLLGdDQUFnQyxLQUFDLEVBQUUsV0FBVyxLQUFDLEVBQUU7a0JBRW5DLEtBQUssd0NBQXdDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFROztRQUU1RyxLQUFDLFNBQVM7UUFDVixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQVcifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/join.kode
