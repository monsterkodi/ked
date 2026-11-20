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
        var cursors, lines, _13_21_
    
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
        var _a_ = belt.insertTextAtPositions(this.s.lines,text,this.s.cursors); lines = _a_[0]; cursors = _a_[1]
    
        this.recordNovimInsert(text)
        this.clearHighlights()
        this.setLines(lines)
        this.setCursors(cursors)
        return mode.postInsert(this)
    },
    insertIntoSheet:function (text)
    {
        var advance, cells, data, pos, rectree, _31_38_, _31_72_
    
        cells = {cols:(((_31_38_=this.rectreeCols) != null ? _31_38_ : this.cells.cols)),rows:(((_31_72_=this.rectreeRows) != null ? _31_72_ : this.cells.rows))}
        rectree = this.rectree
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
        this.rectreeCols = cells.cols
        this.rectreeRows = cells.rows
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFSOztPQUNRLGFBQVQ7O09BQ1MsV0FBWjtPQUFpQixVQUFqQjs7T0FDWSxXQUFBOzs7SUFHZixpQkFBUTs7OztRQUVKLE9BQU8sS0FBSyxPQUFPLEtBQUU7YUFFaEIsS0FBQyxvQkFBYSxLQUFDLGdCQUFnQjs7Ozt1QkFFM0IsS0FBQyxFQUFFOztnQkFDb0IsU0FBUTs7dUJBQWxDLEtBQUM7O1lBQ0gsS0FBQzs7a0JBRWEsS0FBSyxzQkFBc0IsS0FBQyxFQUFFLE1BQU0sS0FBSyxLQUFDLEVBQUUsVUFBN0QsZ0JBQU07O1FBRVAsS0FBQyxrQkFBa0I7UUFFbkIsS0FBQztRQUNELEtBQUMsU0FBVztRQUNaLEtBQUMsV0FBVztlQUVaLEtBQUssV0FBVzs7SUFFcEIsMEJBQWlCOzs7O1FBRWIsU0FBVyxnQkFBTSxLQUFDLGlDQUFjLEtBQUMsTUFBTSxPQUFNLGdCQUFNLEtBQUMsaUNBQWMsS0FBQyxNQUFNO1FBQ3pFLFVBQVUsS0FBQztRQUNYLE1BQVUsS0FBQztRQUNYLFVBQVUsT0FBTyxhQUFhLE1BQU0sUUFBUSxJQUFJO2FBRXJDOzttQkFBVDs7UUFFRixLQUFLLEtBQUs7UUFFVixPQUFPLElBQUksTUFBTSxPQUFPLFFBQVEsS0FBSyxNQUFNLEtBQUssS0FBSyxNQUFNLE1BQU07UUFFakUsS0FBQyxVQUFVLEtBQUssS0FBSyxNQUFNO1FBQzNCLEtBQUMsUUFBVSxLQUFLO1FBQ2hCLEtBQUMsYUFBYSxJQUFJLEtBQUcsUUFBUSxJQUFJO1FBRWpDLEtBQUMsY0FBYyxNQUFNO1FBQ3JCLEtBQUMsY0FBYyxNQUFNO2VBRXJCOztJQUVKOzs7O2tCQUVpQyxLQUFLLHVDQUF1QyxLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsUUFBUSxLQUFDLEVBQUUsYUFBL0YsZ0JBQU0sa0JBQVE7O1FBRWYsS0FBQztRQUNELEtBQUMsU0FBYztRQUNmLEtBQUMsY0FBYztlQUNmLEtBQUMsV0FBYzs7SUFFbkIsNEJBQW1CLFNBQVE7Ozs7a0JBRVIsS0FBSyx1QkFBdUIsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFdBQVcsUUFBUSxPQUF6RSxnQkFBTTs7UUFFUCxLQUFDLFNBQWM7UUFDZixLQUFDO2VBQ0QsS0FBQyxXQUFjIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/insert.kode
