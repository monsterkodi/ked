var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
    moveSheetNode:function (dir)
    {
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _66_30_
    
        if (!(this.rectree != null))
        {
            return null
        }
        cells = {cols:this.cells.cols,rows:this.cells.rows}
        layout.absolutize(cells,this.rectree)
        cursor = this.mainCursor()
        node = layout.topmostIn(this.rectree,cursor)
        if (!(node != null))
        {
            return null
        }
        oldRect = _k_.clone(node.rect.abs)
        moved = layout.moveNodeAt(cells,this.rectree,cursor,dir)
        if (!(moved != null))
        {
            return null
        }
        rect = moved.rect.abs
        maxX = _k_.max(rect.x,(rect.x + rect.w - 1))
        maxY = _k_.max(rect.y,(rect.y + rect.h - 1))
        x = _k_.clamp(rect.x,maxX,(rect.x + cursor[0] - oldRect.x))
        y = _k_.clamp(rect.y,maxY,(rect.y + cursor[1] - oldRect.y))
        this.renderSheet(this.rectree,cells,[x,y])
        return moved
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFSOztPQUNRLGFBQVQ7O09BQ1MsV0FBWjtPQUFpQixVQUFqQjs7T0FDWSxXQUFBOzs7SUFHZixpQkFBUTs7OztRQUVKLE9BQU8sS0FBSyxPQUFPLEtBQUU7YUFFaEIsS0FBQyxvQkFBYSxLQUFDLGdCQUFnQjs7Ozt1QkFFM0IsS0FBQyxFQUFFOztnQkFDb0IsU0FBUTs7dUJBQWxDLEtBQUM7O1lBQ0gsS0FBQzs7a0JBRWEsS0FBSyxzQkFBc0IsS0FBQyxFQUFFLE1BQU0sS0FBSyxLQUFDLEVBQUUsVUFBN0QsZ0JBQU07O1FBRVAsS0FBQyxrQkFBa0I7UUFFbkIsS0FBQztRQUNELEtBQUMsU0FBVztRQUNaLEtBQUMsV0FBVztlQUVaLEtBQUssV0FBVzs7SUFFcEIsMEJBQWlCOzs7O1FBRWIsU0FBVyxnQkFBTSxLQUFDLGlDQUFjLEtBQUMsTUFBTSxPQUFNLGdCQUFNLEtBQUMsaUNBQWMsS0FBQyxNQUFNO1FBQ3pFLFVBQVUsS0FBQztRQUNYLE1BQVUsS0FBQztRQUNYLFVBQVUsT0FBTyxhQUFhLE1BQU0sUUFBUSxJQUFJO2FBRXJDOzttQkFBVDs7UUFFRixLQUFDLFlBQVksUUFBUSxPQUFPLElBQUksS0FBRyxRQUFRLElBQUk7ZUFFL0M7O0lBRUosc0JBQWMsU0FBUSxPQUFNLEtBQUk7Ozs7UUFJNUIsT0FBQSxjQUFBO1FBRUEsS0FBSyxLQUFLO1FBRVYsT0FBTyxJQUFJLE1BQU0sT0FBTyxRQUFRLEtBQUssTUFBTSxLQUFLLEtBQUssTUFBTSxNQUFNO1FBRWpFLEtBQUMsVUFBVSxLQUFLLEtBQUssTUFBTTtRQUMzQixLQUFDLFFBQVUsS0FBSzthQUViOztnQkFDSSxJQUFJOztnQkFDSCxLQUFDLFlBQVksTUFBSyxPQUFPOzs7O2dCQUV6QixLQUFDLFlBQVk7OztRQUVyQixLQUFDLGNBQWMsTUFBTTtlQUNyQixLQUFDLGNBQWMsTUFBTTs7SUFFekIsd0JBQWdCOzs7O2NBRUUsS0FBQzs7bUJBQWI7O1FBRUYsU0FBUyxLQUFLLEtBQUMsTUFBTSxLQUFLLEtBQUssS0FBQyxNQUFNO1FBRXRDLE9BQU8sV0FBVyxNQUFNLEtBQUM7UUFFekIsU0FBUyxLQUFDO1FBQ1YsT0FBUyxPQUFPLFVBQVUsS0FBQyxRQUFRO2NBRXJCOzttQkFBWjs7UUFFRixvQkFBZ0IsS0FBSyxLQUFLO1FBQzFCLFFBQVUsT0FBTyxXQUFXLE1BQU0sS0FBQyxRQUFRLE9BQU87Y0FFcEM7O21CQUFaOztRQUVGLE9BQU8sTUFBTSxLQUFLO1FBRWxCLGVBQVcsS0FBSyxHQUFHLEtBQUssSUFBSSxLQUFLLElBQUk7UUFDckMsZUFBVyxLQUFLLEdBQUcsS0FBSyxJQUFJLEtBQUssSUFBSTtRQUVyQyxjQUFVLEtBQUssRUFBRSxNQUFNLEtBQUssSUFBSSxPQUFPLEtBQUssUUFBUTtRQUNwRCxjQUFVLEtBQUssRUFBRSxNQUFNLEtBQUssSUFBSSxPQUFPLEtBQUssUUFBUTtRQUVwRCxLQUFDLFlBQVksS0FBQyxRQUFRLE9BQU8sRUFBRTtlQUUvQjs7SUFFSjs7OztrQkFFaUMsS0FBSyx1Q0FBdUMsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFFBQVEsS0FBQyxFQUFFLGFBQS9GLGdCQUFNLGtCQUFROztRQUVmLEtBQUM7UUFDRCxLQUFDLFNBQWM7UUFDZixLQUFDLGNBQWM7ZUFDZixLQUFDLFdBQWM7O0lBRW5CLDRCQUFtQixTQUFROzs7O2tCQUVSLEtBQUssdUJBQXVCLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLFFBQVEsT0FBekUsZ0JBQU07O1FBRVAsS0FBQyxTQUFjO1FBQ2YsS0FBQztlQUNELEtBQUMsV0FBYyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/insert.kode
