var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr

import prof from "../../util/prof.js"

import belt from "../tool/belt.js"

import mode from "../mode.js"

export default {
    insert:function (text)
    {
        var cursors, lines
    
        text = mode.insert(this,text)
        if (!_k_.empty(this.s.selections))
        {
            if (text === '\t')
            {
                return this.indentSelectedLines()
            }
            this.deleteSelection()
        }
        var _a_ = belt.insertTextAtPositions(this.s.lines,text,this.s.cursors); lines = _a_[0]; cursors = _a_[1]
    
        this.clearHighlights()
        this.setLines(lines)
        this.setCursors(cursors)
        return mode.postInsert(this)
    },
    insertAsciiHeaderForSelectionOrWordAtCursor:function ()
    {
        var cursors, lines, selections
    
        var _b_ = belt.insertAsciiHeaderForPositionsAndRanges(this.s.lines,this.s.cursors,this.s.selections); lines = _b_[0]; cursors = _b_[1]; selections = _b_[2]
    
        this.clearHighlights()
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    surroundSelection:function (trigger, pair)
    {
        var lines, posl
    
        var _c_ = belt.insertSurroundAtRanges(this.s.lines,this.s.selections,trigger,pair); lines = _c_[0]; posl = _c_[1]
    
        this.setLines(lines)
        this.setSelections([])
        return this.setCursors(posl)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRYSxVQUFBO0lBQU07O09BQ0EsV0FBUjs7T0FDUSxXQUFaOztPQUNZLFdBQUE7OztJQVVmLGlCQUFROzs7O1FBRUosT0FBTyxLQUFLLE9BQU8sS0FBRTt1QkFFWixLQUFDLEVBQUU7O2dCQUNxQixTQUFROzt1QkFBbEMsS0FBQzs7WUFDSixLQUFDOztrQkFFYSxLQUFLLHNCQUFzQixLQUFDLEVBQUUsTUFBTSxLQUFLLEtBQUMsRUFBRSxVQUE3RCxnQkFBTTs7UUFFUCxLQUFDO1FBQ0QsS0FBQyxTQUFXO1FBQ1osS0FBQyxXQUFXO2VBRVosS0FBSyxXQUFXOztJQVFwQjs7OztrQkFFaUMsS0FBSyx1Q0FBdUMsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFFBQVEsS0FBQyxFQUFFLGFBQS9GLGdCQUFNLGtCQUFROztRQUVmLEtBQUM7UUFDRCxLQUFDLFNBQWM7UUFDZixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQWM7O0lBUW5CLDRCQUFtQixTQUFROzs7O2tCQUVSLEtBQUssdUJBQXVCLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLFFBQVEsT0FBekUsZ0JBQU07O1FBRVAsS0FBQyxTQUFjO1FBQ2YsS0FBQztlQUNELEtBQUMsV0FBYyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/insert.kode
