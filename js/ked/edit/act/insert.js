var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg
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
    setSheetTree:function (rectree, cols, rows)
    {
        this.rectree = rectree
        this.rectreeCols = cols
        this.rectreeRows = rows
        this.s = this.s.set('rectree',layout.plainNode(rectree))
        return this
    },
    clearSheet:function ()
    {
        delete this.rectree
        delete this.rectreeCols
        delete this.rectreeRows
        this.s = this.s.set('rectree',null)
        return this
    },
    restoreSheet:function ()
    {
        var _62_21_
    
        if ((this.s.rectree != null))
        {
            this.rectree = this.s.rectree.asMutable()
            this.rectreeCols = this.cells.cols
            this.rectreeRows = this.cells.rows
            layout.absolutize({cols:this.rectreeCols,rows:this.rectreeRows},this.rectree)
            post.emit('sheet.edited')
        }
        else
        {
            this.clearSheet()
        }
        return this
    },
    renderSheet:function (rectree, cells, pos, opt)
    {
        var data, lines
    
        opt = (opt != null ? opt : {})
        data = sue.desue(layout.sueify({cols:cells.cols,rows:cells.rows},rectree))
        lines = kseg.segls(data.text.split('\n'))
        this.segls = lines
        this.changeLinesSegls()
        this.syntax.setSegls(this.s.lines)
        this.s = this.s.set('sue',data.sue)
        this.s = this.s.set('rectree',layout.plainNode(rectree))
        if ((pos != null))
        {
            this.s = this.s.set('cursors',[pos])
            this.s = this.s.set('main',0)
        }
        this.rectree = rectree
        this.rectreeCols = cells.cols
        this.rectreeRows = cells.rows
        this.segls = this.s.lines.slice()
        this.rowCache = null
        this.r = []
        this.emit('sue.changed')
        if (opt.history === false)
        {
            this.swapState()
        }
        else
        {
            this.pushState()
        }
        if ((pos != null))
        {
            this.adjustViewForMainCursor()
            if (!opt.silent)
            {
                mode.cursorsSet(this)
                this.emit('cursorsSet')
            }
        }
        post.emit('sheet.edited')
        return this
    },
    moveSheetNode:function (dir)
    {
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _126_30_
    
        if (!(this.rectree != null))
        {
            return null
        }
        layout.absolutize(this.cells,this.rectree)
        cursor = this.mainCursor()
        node = layout.topmostIn(this.rectree,cursor)
        if (!(node != null))
        {
            return null
        }
        oldRect = _k_.clone(node.rect.abs)
        moved = layout.moveNode(this.cells,this.rectree,node,dir)
        if (!(moved != null))
        {
            return null
        }
        rect = moved.rect.abs
        maxX = _k_.max(rect.x,(rect.x + rect.w - 1))
        maxY = _k_.max(rect.y,(rect.y + rect.h - 1))
        x = _k_.clamp(rect.x,maxX,(rect.x + cursor[0] - oldRect.x))
        y = _k_.clamp(rect.y,maxY,(rect.y + cursor[1] - oldRect.y))
        this.renderSheet(this.rectree,this.cells,[x,y])
        return moved
    },
    resizeSheetNode:function (dir)
    {
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _154_30_
    
        if (!(this.rectree != null))
        {
            return null
        }
        cursor = this.mainCursor()
        node = layout.topmostIn(this.rectree,cursor)
        if (!(node != null))
        {
            return null
        }
        oldRect = _k_.clone(node.rect.abs)
        moved = layout.resizeNode(this.cells,this.rectree,node,dir)
        if (!(moved != null))
        {
            return null
        }
        rect = moved.rect.abs
        maxX = _k_.max(rect.x,(rect.x + rect.w - 1))
        maxY = _k_.max(rect.y,(rect.y + rect.h - 1))
        x = _k_.clamp(rect.x,maxX,(rect.x + cursor[0] - oldRect.x))
        y = _k_.clamp(rect.y,maxY,(rect.y + cursor[1] - oldRect.y))
        this.renderSheet(this.rectree,this.cells,[x,y])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYSxVQUFBO0lBQU07SUFBSztJQUFLOztPQUNWLFdBQVI7O09BQ1EsYUFBVDs7T0FDUyxXQUFaO09BQWlCLFVBQWpCOztPQUNZLFdBQUE7OztJQUdmLGlCQUFROzs7O1FBRUosT0FBTyxLQUFLLE9BQU8sS0FBRTthQUVoQixLQUFDLG9CQUFhLEtBQUMsZ0JBQWdCOzs7O3VCQUUzQixLQUFDLEVBQUU7O2dCQUNvQixTQUFROzt1QkFBbEMsS0FBQzs7WUFDSCxLQUFDOztrQkFFYSxLQUFLLHNCQUFzQixLQUFDLEVBQUUsTUFBTSxLQUFLLEtBQUMsRUFBRSxVQUE3RCxnQkFBTTs7UUFFUCxLQUFDLGtCQUFrQjtRQUVuQixLQUFDO1FBQ0QsS0FBQyxTQUFXO1FBQ1osS0FBQyxXQUFXO2VBRVosS0FBSyxXQUFXOztJQUVwQiwwQkFBaUI7Ozs7UUFFYixTQUFXLGdCQUFNLEtBQUMsaUNBQWMsS0FBQyxNQUFNLE9BQU0sZ0JBQU0sS0FBQyxpQ0FBYyxLQUFDLE1BQU07UUFDekUsVUFBVSxLQUFDO1FBQ1gsTUFBVSxLQUFDO1FBQ1gsVUFBVSxPQUFPLGFBQWEsTUFBTSxRQUFRLElBQUk7YUFFckM7O21CQUFUOztRQUVGLEtBQUMsWUFBWSxRQUFRLE9BQU8sSUFBSSxLQUFHLFFBQVEsSUFBSTtlQUUvQzs7SUFFSix1QkFBZSxTQUFRLE1BQUs7O1FBRXhCLEtBQUMsVUFBVTtRQUNYLEtBQUMsY0FBYztRQUNmLEtBQUMsY0FBYztRQUVmLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxVQUFVLE9BQU8sVUFBVTtlQUN2Qzs7SUFFSjs7ZUFFVyxLQUFDO2VBQ0QsS0FBQztlQUNELEtBQUM7UUFFUixLQUFDLElBQUksS0FBQyxFQUFFLElBQUksVUFBVTtlQUN0Qjs7SUFFSjs7OzthQUVPLEtBQUMsRUFBRTs7WUFFRixLQUFDLFVBQVUs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/insert.kode
