var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../../util/prof.js"

import layout from "../../popo/layout.js"

import belt from "../tool/belt.js"
import sue from "../tool/sue.js"

import mode from "../mode.js"

export default {
    insert:function (text)
    {
        var cursors, lines, _13_19_
    
        text = mode.insert(this,text)
        if ((this.sheet != null) && this.insertIntoSheet(text))
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
        var _a_ = belt.insertTextAtPositions(this.s.lines,text,this.s.cursors); lines = _a_[0]; cursors = _a_[1]
    
        this.recordNovimInsert(text)
        this.clearHighlights()
        this.setLines(lines)
        this.setCursors(cursors)
        return mode.postInsert(this)
    },
    insertIntoSheet:function (text)
    {
        var advance, cells, data, pos, rectree, _31_37_, _31_70_
    
        cells = {cols:(((_31_37_=this.sheet.cols) != null ? _31_37_ : this.cells.cols)),rows:(((_31_70_=this.sheet.rows) != null ? _31_70_ : this.cells.rows))}
        rectree = this.sheet.rectree
        pos = this.mainCursor()
        advance = layout.insertTextAt(cells,rectree,pos,text)
        if (!advance)
        {
            return 0
        }
        post.emit('sheet.edited')
        data = sue.desue(layout.sueify({cols:cells.cols,rows:cells.rows},rectree))
        this.loadLines(data.text.split('\n'))
        this.loadSue(data.sue)
        this.setCursors([[pos[0] + advance,pos[1]]])
        this.sheet.cols = cells.cols
        this.sheet.rows = cells.rows
        return advance
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFSOztPQUNRLGFBQVQ7O09BQ1MsV0FBWjtPQUFpQixVQUFqQjs7T0FDWSxXQUFBOzs7SUFHZixpQkFBUTs7OztRQUVKLE9BQU8sS0FBSyxPQUFPLEtBQUU7YUFFaEIsS0FBQyxrQkFBVyxLQUFDLGdCQUFnQjs7Ozt1QkFFekIsS0FBQyxFQUFFOztnQkFDb0IsU0FBUTs7dUJBQWxDLEtBQUM7O1lBQ0gsS0FBQzs7a0JBRWEsS0FBSyxzQkFBc0IsS0FBQyxFQUFFLE1BQU0sS0FBSyxLQUFDLEVBQUUsVUFBN0QsZ0JBQU07O1FBRVAsS0FBQyxrQkFBa0I7UUFFbkIsS0FBQztRQUNELEtBQUMsU0FBVztRQUNaLEtBQUMsV0FBVztlQUVaLEtBQUssV0FBVzs7SUFFcEIsMEJBQWlCOzs7O1FBRWIsU0FBVyxnQkFBTSxLQUFDLE1BQU0sMEJBQU8sS0FBQyxNQUFNLE9BQU0sZ0JBQU0sS0FBQyxNQUFNLDBCQUFPLEtBQUMsTUFBTTtRQUN2RSxVQUFVLEtBQUMsTUFBTTtRQUNqQixNQUFVLEtBQUM7UUFDWCxVQUFVLE9BQU8sYUFBYSxNQUFNLFFBQVEsSUFBSTthQUVyQzs7bUJBQVQ7O1FBRUYsS0FBSyxLQUFLO1FBRVYsT0FBTyxJQUFJLE1BQU0sT0FBTyxRQUFRLEtBQUssTUFBTSxLQUFLLEtBQUssTUFBTSxNQUFNO1FBRWpFLEtBQUMsVUFBVSxLQUFLLEtBQUssTUFBTTtRQUMzQixLQUFDLFFBQVUsS0FBSztRQUNoQixLQUFDLGFBQWEsSUFBSSxLQUFHLFFBQVEsSUFBSTtRQUVqQyxLQUFDLE1BQU0sT0FBTyxNQUFNO1FBQ3BCLEtBQUMsTUFBTSxPQUFPLE1BQU07ZUFFcEI7O0lBRUo7Ozs7a0JBRWlDLEtBQUssdUNBQXVDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxRQUFRLEtBQUMsRUFBRSxhQUEvRixnQkFBTSxrQkFBUTs7UUFFZixLQUFDO1FBQ0QsS0FBQyxTQUFjO1FBQ2YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFjOztJQUVuQiw0QkFBbUIsU0FBUTs7OztrQkFFUixLQUFLLHVCQUF1QixLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsV0FBVyxRQUFRLE9BQXpFLGdCQUFNOztRQUVQLEtBQUMsU0FBYztRQUNmLEtBQUM7ZUFDRCxLQUFDLFdBQWMifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/insert.kode
