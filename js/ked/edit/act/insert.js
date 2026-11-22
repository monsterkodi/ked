var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        var advance, cell, cells, rectree
    
        cells = this.sheetSize()
        rectree = this.rectree
        cell = this.sheetCellForPos(this.mainCursor())
        advance = layout.insertTextAt(cells,rectree,cell,text)
        if (!advance)
        {
            return 0
        }
        this.renderSheet(rectree,cells,[cell[0] + advance,cell[1]])
        return advance
    },
    sheetSize:function ()
    {
        var _42_38_, _42_72_
    
        return {cols:(((_42_38_=this.rectreeCols) != null ? _42_38_ : this.cells.cols)),rows:(((_42_72_=this.rectreeRows) != null ? _42_72_ : this.cells.rows))}
    },
    sheetCellsForLine:function (y)
    {
        return sue.cellPositionsForLine(this.s.lines,y,this.scaleRunsForLine(y))
    },
    sheetCellForPos:function (pos)
    {
        var cells, lastIndex, x, y
    
        var _b_ = pos; x = _b_[0]; y = _b_[1]
    
        cells = this.sheetCellsForLine(y)
        lastIndex = cells.length - 1
        if (x <= lastIndex)
        {
            return [cells[x],y]
        }
        return [cells[lastIndex] + x - lastIndex,y]
    },
    sheetPosInDirection:function (pos, dir, count = 1)
    {
        var cx, cy, i, row, s, top
    
        var _c_ = this.sheetCellForPos(pos); cx = _c_[0]; cy = _c_[1]
    
        for (var _d_ = i = 0, _e_ = count; (_d_ <= _e_ ? i < count : i > count); (_d_ <= _e_ ? ++i : --i))
        {
            var _f_ = this.sheetBandAt(cx,cy); top = _f_[0]; s = _f_[1]
    
            row = (dir === 'up' ? top - 1 : top + s)
            row = _k_.clamp(0,this.s.lines.length - 1,row)
            var _10_ = this.sheetBandAt(cx,row); top = _10_[0]; s = _10_[1]
    
            cy = top + s - 1
        }
        return this.sheetPosForCell([cx,cy])
    },
    sheetBandAt:function (cx, cy)
    {
        var node, rect, scale
    
        node = layout.nodeForPos(this.sheetSize(),this.rectree,[cx,cy])
        scale = layout.scaleOf((node != null ? node : {}))
        if (scale <= 1)
        {
            return [cy,1]
        }
        rect = node.rect.abs
        return [rect.y + Math.floor((cy - rect.y) / scale) * scale,scale]
    },
    sheetPosForCell:function (cell)
    {
        var below, cells, cx, cy, run, y
    
        var _11_ = cell; cx = _11_[0]; cy = _11_[1]
    
        below = _k_.min(this.s.lines.length,cy + 7)
        for (var _12_ = y = cy + 1, _13_ = below; (_12_ <= _13_ ? y < below : y > below); (_12_ <= _13_ ? ++y : --y))
        {
            if (y >= below)
            {
                break
            }
            var list = _k_.list(this.scaleRunsForLine(y))
            for (var _14_ = 0; _14_ < list.length; _14_++)
            {
                run = list[_14_]
                if (y - cy >= run[2])
                {
                    continue
                }
                cells = this.sheetCellsForLine(y)
                if ((cells[run[0]] <= cx && cx < cells[run[1]]))
                {
                    return this.sheetPosOnLine(cx,y,cells)
                }
            }
        }
        return this.sheetPosOnLine(cx,cy,this.sheetCellsForLine(cy))
    },
    sheetPosOnLine:function (cx, y, cells)
    {
        var gi, lastIndex
    
        lastIndex = cells.length - 1
        if (cx >= cells[lastIndex])
        {
            return [lastIndex + cx - cells[lastIndex],y]
        }
        for (var _15_ = gi = 0, _16_ = lastIndex; (_15_ <= _16_ ? gi < lastIndex : gi > lastIndex); (_15_ <= _16_ ? ++gi : --gi))
        {
            if (cx < cells[gi + 1])
            {
                return [gi,y]
            }
        }
        return [lastIndex,y]
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, lines, node, offset, old, pct, scale, _114_25_, _139_17_
    
        if (!(this.rectree != null))
        {
            return
        }
        cells = this.sheetSize()
        layout.absolutize(cells,this.rectree)
        cell = this.sheetCellForPos(this.mainCursor())
        node = layout.topmostIn(this.rectree,cell)
        if (!!_k_.empty((node != null ? node.text : undefined)))
        {
            return
        }
        old = layout.scaleOf(node)
        scale = (delta === 0 ? 1 : _k_.clamp(1,7,old + delta))
        if (scale === old)
        {
            return
        }
        offset = layout.textOffsetIn(node,cell,node.text.length)
        lines = _k_.max(1,parseInt(node.rect.abs.h / old))
        if (scale > 1)
        {
            node.scale = scale
        }
        else
        {
            delete node.scale
        }
        pct = _k_.isStr(node.h) && node.h.endsWith('%')
        if ((node.h != null) && !pct)
        {
            node.h = lines * scale
        }
        layout.absolutize(cells,this.rectree)
        this.renderSheet(this.rectree,cells,layout.cellForTextOffset(node,offset))
        return node
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
        var _168_21_
    
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
    renderSheet:function (rectree, cells, mc, opt)
    {
        var data, lines, pos
    
        opt = (opt != null ? opt : {})
        data = sue.desue(layout.sueify({cols:cells.cols,rows:cells.rows},rectree))
        lines = kseg.segls(data.text.split('\n'))
        this.segls = lines
        this.changeLinesSegls()
        this.syntax.setSegls(this.s.lines)
        this.s = this.s.set('sue',data.sue)
        this.s = this.s.set('rectree',layout.plainNode(rectree))
        if ((mc != null))
        {
            pos = this.sheetPosForCell(mc)
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _233_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        layout.absolutize(this.cells,this.rectree)
        cursor = this.sheetCellForPos(this.mainCursor())
        node = layout.topmostIn(this.rectree,cursor)
        if (!(node != null))
        {
            return
        }
        oldRect = _k_.clone(node.rect.abs)
        moved = layout.moveNode(this.cells,this.rectree,node,dir)
        if (!(moved != null))
        {
            return
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _261_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        cursor = this.sheetCellForPos(this.mainCursor())
        node = layout.topmostIn(this.rectree,cursor)
        if (!(node != null))
        {
            return
        }
        oldRect = _k_.clone(node.rect.abs)
        moved = layout.resizeNode(this.cells,this.rectree,node,dir)
        if (!(moved != null))
        {
            return
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
    
        var _17_ = belt.insertAsciiHeaderForPositionsAndRanges(this.s.lines,this.s.cursors,this.s.selections); lines = _17_[0]; cursors = _17_[1]; selections = _17_[2]
    
        this.clearHighlights()
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    surroundSelection:function (trigger, pair)
    {
        var lines, posl
    
        var _18_ = belt.insertSurroundAtRanges(this.s.lines,this.s.selections,trigger,pair); lines = _18_[0]; posl = _18_[1]
    
        this.setLines(lines)
        this.setSelections([])
        return this.setCursors(posl)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9pbnNlcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYSxVQUFBO0lBQU07SUFBSztJQUFLOztPQUNWLFdBQVI7O09BQ1EsYUFBVDs7T0FDUyxXQUFaO09BQWlCLFVBQWpCOztPQUNZLFdBQUE7OztJQUdmLGlCQUFROzs7O1FBRUosT0FBTyxLQUFLLE9BQU8sS0FBRTthQUVoQixLQUFDLG9CQUFhLEtBQUMsZ0JBQWdCOzs7O3VCQUUzQixLQUFDLEVBQUU7O2dCQUNvQixTQUFROzt1QkFBbEMsS0FBQzs7WUFDSCxLQUFDOztrQkFFYSxLQUFLLHNCQUFzQixLQUFDLEVBQUUsTUFBTSxLQUFLLEtBQUMsRUFBRSxVQUE3RCxnQkFBTTs7UUFFUCxLQUFDLGtCQUFrQjtRQUVuQixLQUFDO1FBQ0QsS0FBQyxTQUFXO1FBQ1osS0FBQyxXQUFXO2VBRVosS0FBSyxXQUFXOztJQUVwQiwwQkFBaUI7Ozs7UUFFYixRQUFVLEtBQUM7UUFDWCxVQUFVLEtBQUM7UUFDWCxPQUFVLEtBQUMsZ0JBQWdCLEtBQUM7UUFDNUIsVUFBVSxPQUFPLGFBQWEsTUFBTSxRQUFRLEtBQUs7YUFFdEM7O21CQUFUOztRQUVGLEtBQUMsWUFBWSxRQUFRLE9BQU8sS0FBSyxLQUFHLFFBQVEsS0FBSztlQUVqRDs7SUFFSjs7OztnQkFBZSxnQkFBTSxLQUFDLGlDQUFjLEtBQUMsTUFBTSxPQUFNLGdCQUFNLEtBQUMsaUNBQWMsS0FBQyxNQUFNOztJQUU3RSw0QkFBbUI7O2VBQUssSUFBSSxxQkFBcUIsS0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFDLGlCQUFpQjs7SUFFOUUsMEJBQWlCOzs7O2tCQUVMLEtBQVAsWUFBRTs7UUFFSCxRQUFRLEtBQUMsa0JBQWtCO1FBQzNCLFlBQWEsTUFBTSxTQUFPO1lBRXZCLEtBQUs7O29CQUFlLE1BQU0sR0FBRzs7Z0JBRS9CLE1BQU0sYUFBYSxJQUFJLFVBQVU7O0lBRXRDLDhC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/insert.kode
