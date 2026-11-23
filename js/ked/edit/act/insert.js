var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import belt from "../tool/belt.js"

import mode from "../mode.js"

export default {
    insert:function (text)
    {
        var cursors, lines, _10_21_
    
        text = mode.insert(this,text)
        if ((this.rectree != null) && this.insertIntoSheet(text))
        {
            return
        }
        if (!_k_.empty(this.s.selections))
        {
            if (text === '\t')
            {
                return this.indentSelectedLines()
            }
            this.deleteSelection()
        }
        ;[lines,cursors] = belt.insertTextAtPositions(this.s.lines,text,this.s.cursors)
        this.recordNovimInsert(text)
        this.clearHighlights()
        this.setLines(lines)
        this.setCursors(cursors)
        return mode.postInsert(this)
    },
    insertAsciiHeaderForSelectionOrWordAtCursor:function ()
    {
        var cursors, lines, selections
    
        ;[lines,cursors,selections] = belt.insertAsciiHeaderForPositionsAndRanges(this.s.lines,this.s.cursors,this.s.selections)
        this.clearHighlights()
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    surroundSelection:function (trigger, pair)
    {
        var lines, posl
    
        ;[lines,posl] = belt.insertSurroundAtRanges(this.s.lines,this.s.selections,trigger,pair)
        this.setLines(lines)
        this.setSelections([])
        return this.setCursors(posl)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYyxXQUFQOztPQUNPLFdBQUE7OztJQUdWLGlCQUFROzs7O1FBRUosT0FBTyxLQUFLLE9BQU8sS0FBRTthQUVoQixLQUFDLG9CQUFhLEtBQUMsZ0JBQWdCOzs7O3VCQUUzQixLQUFDLEVBQUU7O2dCQUNvQixTQUFROzt1QkFBbEMsS0FBQzs7WUFDSCxLQUFDOztVQUVKLE1BQU0sV0FBVyxLQUFLLHNCQUFzQixLQUFDLEVBQUUsTUFBTSxLQUFLLEtBQUMsRUFBRTtRQUU5RCxLQUFDLGtCQUFrQjtRQUVuQixLQUFDO1FBQ0QsS0FBQyxTQUFXO1FBQ1osS0FBQyxXQUFXO2VBRVosS0FBSyxXQUFXOztJQUVwQjs7OztVQUVLLE1BQU0sUUFBUSxjQUFjLEtBQUssdUNBQXVDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxRQUFRLEtBQUMsRUFBRTtRQUVoRyxLQUFDO1FBQ0QsS0FBQyxTQUFjO1FBQ2YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFjOztJQUVuQiw0QkFBbUIsU0FBUTs7OztVQUV0QixNQUFNLFFBQVEsS0FBSyx1QkFBdUIsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFdBQVcsUUFBUTtRQUUxRSxLQUFDLFNBQWM7UUFDZixLQUFDO2VBQ0QsS0FBQyxXQUFjIn0=
//# sourceURL=../../../../kode/ked/edit/act/insert.kode
