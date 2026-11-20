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
        var advance, cells, pos, rectree, _31_38_, _31_72_
    
        cells = {cols:(((_31_38_=this.rectreeCols) != null ? _31_38_ : this.cells.cols)),rows:(((_31_72_=this.rectreeRows) != null ? _31_72_ : this.cells.rows))}
        rectree = this.rectree
        pos = this.mainCursor()
        advance = layout.insertTextAt(cells,rectree,pos,text)
        if (!advance)
        {
            return 0
        }
        this.renderSheet(rectree,cells,[pos[0] + advance,pos[1]])
        return advance
    },
    renderSheet:function (rectree, cells, pos, opt)
    {
        var data
    
        opt = (opt != null ? opt : {})
        post.emit('sheet.edited')
        data = sue.desue(layout.sueify({cols:cells.cols,rows:cells.rows},rectree))
        this.loadLines(data.text.split('\n'))
        this.loadSue(data.sue)
        if ((pos != null))
        {
            if (opt.silent)
            {
                this.setCursors([pos],{silent:true})
            }
            else
            {
                this.setCursors([pos])
            }
        }
        this.rectreeCols = cells.cols
        return this.rectreeRows = cells.rows
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFSOztPQUNRLGFBQVQ7O09BQ1MsV0FBWjtPQUFpQixVQUFqQjs7T0FDWSxXQUFBOzs7SUFHZixpQkFBUTs7OztRQUVKLE9BQU8sS0FBSyxPQUFPLEtBQUU7YUFFaEIsS0FBQyxvQkFBYSxLQUFDLGdCQUFnQjs7Ozt1QkFFM0IsS0FBQyxFQUFFOztnQkFDb0IsU0FBUTs7dUJBQWxDLEtBQUM7O1lBQ0gsS0FBQzs7a0JBRWEsS0FBSyxzQkFBc0IsS0FBQyxFQUFFLE1BQU0sS0FBSyxLQUFDLEVBQUUsVUFBN0QsZ0JBQU07O1FBRVAsS0FBQyxrQkFBa0I7UUFFbkIsS0FBQztRQUNELEtBQUMsU0FBVztRQUNaLEtBQUMsV0FBVztlQUVaLEtBQUssV0FBVzs7SUFFcEIsMEJBQWlCOzs7O1FBRWIsU0FBVyxnQkFBTSxLQUFDLGlDQUFjLEtBQUMsTUFBTSxPQUFNLGdCQUFNLEtBQUMsaUNBQWMsS0FBQyxNQUFNO1FBQ3pFLFVBQVUsS0FBQztRQUNYLE1BQVUsS0FBQztRQUNYLFVBQVUsT0FBTyxhQUFhLE1BQU0sUUFBUSxJQUFJO2FBRXJDOzttQkFBVDs7UUFFRixLQUFDLFlBQVksUUFBUSxPQUFPLElBQUksS0FBRyxRQUFRLElBQUk7ZUFFL0M7O0lBRUosc0JBQWMsU0FBUSxPQUFNLEtBQUk7Ozs7UUFJNUIsT0FBQSxjQUFBO1FBRUEsS0FBSyxLQUFLO1FBRVYsT0FBTyxJQUFJLE1BQU0sT0FBTyxRQUFRLEtBQUssTUFBTSxLQUFLLEtBQUssTUFBTSxNQUFNO1FBRWpFLEtBQUMsVUFBVSxLQUFLLEtBQUssTUFBTTtRQUMzQixLQUFDLFFBQVUsS0FBSzthQUViOztnQkFDSSxJQUFJOztnQkFDSCxLQUFDLFlBQVksTUFBSyxPQUFPOzs7O2dCQUV6QixLQUFDLFlBQVk7OztRQUVyQixLQUFDLGNBQWMsTUFBTTtlQUNyQixLQUFDLGNBQWMsTUFBTTs7SUFFekI7Ozs7a0JBRWlDLEtBQUssdUNBQXVDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxRQUFRLEtBQUMsRUFBRSxhQUEvRixnQkFBTSxrQkFBUTs7UUFFZixLQUFDO1FBQ0QsS0FBQyxTQUFjO1FBQ2YsS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFjOztJQUVuQiw0QkFBbUIsU0FBUTs7OztrQkFFUixLQUFLLHVCQUF1QixLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsV0FBVyxRQUFRLE9BQXpFLGdCQUFNOztRQUVQLEtBQUMsU0FBYztRQUNmLEtBQUM7ZUFDRCxLQUFDLFdBQWMifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/insert.kode
