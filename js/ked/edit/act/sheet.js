var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import layout from "../../popo/layout.js"

import sue from "../tool/sue.js"

import mode from "../mode.js"

export default {
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
        var _21_38_, _21_72_
    
        return {cols:(((_21_38_=this.rectreeCols) != null ? _21_38_ : this.cells.cols)),rows:(((_21_72_=this.rectreeRows) != null ? _21_72_ : this.cells.rows))}
    },
    sheetCellsForLine:function (y)
    {
        return sue.cellPositionsForLine(this.s.lines,y,this.scaleRunsForLine(y))
    },
    sheetCellForPos:function (pos)
    {
        var cells, lastIndex, x, y
    
        var _a_ = pos; x = _a_[0]; y = _a_[1]
    
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
        var cx, cy, i, row, s, top, x, y
    
        var _b_ = this.sheetCellForPos(pos); cx = _b_[0]; cy = _b_[1]
    
        for (var _c_ = i = 0, _d_ = count; (_c_ <= _d_ ? i < count : i > count); (_c_ <= _d_ ? ++i : --i))
        {
            switch (dir)
            {
                case 'left':
                    var _e_ = this.sheetCellForPos(this.sheetPosForCell([_k_.max(0,cx - 1),cy])); cx = _e_[0]; cy = _e_[1]
    
                    break
                case 'right':
                    var _f_ = this.sheetPosForCell([cx,cy]); x = _f_[0]; y = _f_[1]
    
                    var _10_ = this.sheetCellForPos([x + 1,y]); cx = _10_[0]; cy = _10_[1]
    
                    cx = _k_.min(cx,this.sheetSize().cols)
                    break
                case 'up':
                case 'down':
                    var _11_ = this.sheetBandAt(cx,cy); top = _11_[0]; s = _11_[1]
    
                    row = (dir === 'up' ? top - 1 : top + s)
                    row = _k_.clamp(0,this.s.lines.length - 1,row)
                    var _12_ = this.sheetBandAt(cx,row); top = _12_[0]; s = _12_[1]
    
                    cy = top + s - 1
                    break
            }
    
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
        var below, cells, cx, cy, run, s, top, y
    
        var _13_ = cell; cx = _13_[0]; cy = _13_[1]
    
        var _14_ = this.sheetBandAt(cx,cy); top = _14_[0]; s = _14_[1]
    
        cy = top + s - 1
        below = _k_.min(this.s.lines.length,cy + 7)
        for (var _15_ = y = cy + 1, _16_ = below; (_15_ <= _16_ ? y < below : y > below); (_15_ <= _16_ ? ++y : --y))
        {
            if (y >= below)
            {
                break
            }
            var list = _k_.list(this.scaleRunsForLine(y))
            for (var _17_ = 0; _17_ < list.length; _17_++)
            {
                run = list[_17_]
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
        for (var _18_ = gi = 0, _19_ = lastIndex; (_18_ <= _19_ ? gi < lastIndex : gi > lastIndex); (_18_ <= _19_ ? ++gi : --gi))
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
        var cell, cells, lines, node, offset, old, pct, scale, _110_25_, _135_17_
    
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
        var _164_21_
    
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _229_25_
    
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _257_25_
    
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
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsYUFBVDs7T0FDUyxVQUFaOztPQUNZLFdBQUE7OztJQUdmLDBCQUFpQjs7OztRQUViLFFBQVUsS0FBQztRQUNYLFVBQVUsS0FBQztRQUNYLE9BQVUsS0FBQyxnQkFBZ0IsS0FBQztRQUM1QixVQUFVLE9BQU8sYUFBYSxNQUFNLFFBQVEsS0FBSzthQUV0Qzs7bUJBQVQ7O1FBRUYsS0FBQyxZQUFZLFFBQVEsT0FBTyxLQUFLLEtBQUcsUUFBUSxLQUFLO2VBRWpEOztJQUVKOzs7O2dCQUFlLGdCQUFNLEtBQUMsaUNBQWMsS0FBQyxNQUFNLE9BQU0sZ0JBQU0sS0FBQyxpQ0FBYyxLQUFDLE1BQU07O0lBRTdFLDRCQUFtQjs7ZUFBSyxJQUFJLHFCQUFxQixLQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUMsaUJBQWlCOztJQUU5RSwwQkFBaUI7Ozs7a0JBRUwsS0FBUCxZQUFFOztRQUVILFFBQVEsS0FBQyxrQkFBa0I7UUFDM0IsWUFBYSxNQUFNLFNBQU87WUFFdkIsS0FBSzs7b0JBQWUsTUFBTSxHQUFHOztnQkFFL0IsTUFBTSxhQUFhLElBQUksVUFBVTs7SUFFdEMsOEJBQXNCLEtBQUksS0FBSSxRQUFNOzs7O2tCQUV0QixLQUFDLGdCQUFnQixNQUExQixhQUFHOzt1QkFFQSxJQUFLLFNBQUkseUJBQUEsWUFBQTs7b0JBRUY7O3FCQUVIOzhCQUVjLEtBQUMsZ0JBQWdCLEtBQUMseUJBQXFCLEVBQUUsS0FBRyxHQUFHLE9BQXhELGFBQUc7OztxQkFFUjs4QkFFYyxLQUFDLGlCQUFpQixHQUFHLE1BQTlCLFlBQUU7OytCQUNPLEtBQUMsaUJBQWlCLElBQUUsRUFBRSxLQUEvQixjQUFHOztvQkFDSixhQUFjLEdBQUcsS0FBQyxZQUFZOztxQkFFbEM7cUJBQUs7K0JBRVMsS0FBQyxZQUFZLEdBQUcsS0FBekIsZUFBSTs7b0JBRUwsT0FBTSxRQUFPLE9BQU8sTUFBSSxJQUFJLE1BQUk7b0JBQ2hDLGdCQUFZLEVBQUUsS0FBQyxFQUFFLE1BQU0sU0FBTyxFQUFFOytCQUV0QixLQUFDLFlBQVksR0FBRyxNQUF6QixlQUFJOztvQkFFTCxLQUFLLE1BQU0sSUFBRTs7Ozs7ZUFFekIsS0FBQyxpQkFBaUIsR0FBRzs7SUFFekIsc0JBQWMsSUFBRzs7OztRQUViLE9BQVEsT0FBTyxXQUFXLEtBQUMsWUFBWSxLQUFDLFNBQVMsR0FBRztRQUNwRCxRQUFRLE9BQU8sU0FBUSxlQUFBO1lBRXBCLFNBQVM7O29CQUFPLEdBQUc7O1FBRXRCLE9BQU8sS0FBSyxLQUFLO2dCQUVoQixLQUFLLGdCQUFXLEtBQUssS0FBSyxLQUFLLFNBQVMsTUFBTzs7SUFFcEQsMEJBQWlCOzs7O21CQUVILE1BQVQsY0FBRzs7bUJBRU0sS0FBQyxZQUFZLEdBQUcsS0FBekIsZUFBSTs7UUFDTCxLQUFLLE1BQU0sSUFBRTtRQUViLGdCQUFZLEtBQUMsRUFBRSxNQUFNLE9BQU8sS0FBRzt3QkFFM0IsSUFBSyxLQUFHLFVBQUksMkJBQUEsWUFBQTs7Z0JBQ0gsS0FBSzs7Z0JBQWQ7O2dDQUNXLEtBQUMsaUJBQWlCOzs7Z0JBQXpCO29CQUNZLElBQUksTUFBTSxJQUFJOztvQkFBMUI7O2dCQUNBLFFBQVEsS0FBQyxrQkFBa0I7cUJBQ3hCLE1BQU0sSUFBSSxPQUFPLE1BQUEsS0FBSyxNQUFNLElBQUk7OzJCQUM3QixLQUFDLGVBQWUsR0FBRyxFQUFFOzs7O2VBRW5DLEtBQUMsZUFBZSxHQUFHLEdBQUcsS0FBQyxrQkFBa0I7O0lBRTdDLHlCQUFpQixJQUFHLEdBQUU7Ozs7UUFFbEIsWUFBWSxNQUFNLFNBQU87WUFFdEIsTUFBTSxNQUFNOztvQkFBZ0IsWUFBWSxLQUFLLE1BQU0sV0FBVzs7d0JBRTdELEtBQU0sVUFBSSxnQ0FBQSxpQkFBQTs7Z0JBQ1AsS0FBSyxNQUFNLEtBQUc7O3dCQUFRLEdBQUc7OztnQkFFL0IsVUFBVTs7SUFFZix5QkFBZ0I7Ozs7Y0FFSCxLQUFDOzs7O1FBRVYsUUFBUSxLQUFDO1FBQ1QsT0FBTyxXQUFXLE1BQU0sS0FBQztRQUV6QixPQUFPLEtBQUMsZ0JBQWdCLEtBQUM7UUFDekIsT0FBTyxPQUFPLFVBQVUsS0FBQyxRQUFRO3lCQUVsQixlQUFBLEtBQU07Ozs7UUFFckIsTUFBUSxPQUFPLFFBQVE7UUFDdkIsU0FBUSxVQUFTLElBQUksY0FBVSxFQUFFLEVBQUUsTUFBSTtZQUVsQyxVQUFTOzs7O1FBRWQsU0FBUyxPQUFPLGFBQWEsS0FBSyxLQUFLLEtBQUssS0FBSztRQUNqRCxnQkFBYSxXQUFNLEtBQUssS0FBSyxJQUFJLElBQUk7WUFFbEMsUUFBUTs7WUFDUCxLQUFLLFFBQVE7Ozs7bUJBRU4sS0FBSzs7UUFFaEIsTUFBZ0IsVUFBVixLQUFLLE1BQWEsS0FBSyxFQUFFLFNBQVM7YUFFckMsS0FBSyxlQUFXOztZQUNmLEtBQUssSUFBSSxRQUFROztRQUVyQixPQUFPLFdBQVcsTUFBTSxLQUFDO1FBRXpCLEtBQUMsWUFBWSxLQUFDLFFBQVEsTUFBTSxPQUFPLGtCQUFrQixLQUFLO2VBRTFEOztJQUVKLHVCQUFlLFNBQVEsTUFBSzs7UUFFeEIsS0FBQyxVQUFVO1FBQ1gsS0FBQyxjQUFjO1FBQ2YsS0FBQyxjQUFjO1FBRWYsS0FBQyxJQUFJLEtBQUMsRUFBRSxJQUFJLFVBQVUsT0FBTyxVQUFVO2VBQ3ZDOztJQUVKOztlQUVXLEtBQUM7ZUFDRCxLQUFDO2VBQ0QsS0FBQztRQUVSLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxVQUFVO2VBQ3RCOztJQUVKOzs7O2FBRU8sS0FBQyxFQUFFOztZQUVGLEtBQUMsVUFBVSxLQUFDLEVBQUUsUUFBUTtZQUN0QixLQUFDLGNBQWMsS0FBQyxNQUFNO1lBQ3RCLEtBQUMsY0FBYyxLQUFDLE1BQU07WUFFdEIsT0FBTyxZQUFZLEtBQUssS0FBQyxZQUFZLEtBQUssS0FBQyxhQUFhLEtBQUM7WUFFekQsS0FBSyxLQUFLOzs7O1lBR1YsS0FBQzs7ZUFFTDs7SUFFSixzQkFBYyxTQUFRLE9BQU0sSUFBRzs7OztRQUkzQixPQUFBLGNBQUE7UUFFQSxPQUFRLElBQUksTUFBTSxPQUFPLFFBQVEsS0FBSyxNQUFNLEtBQUssS0FBSyxNQUFNLE1BQU07UUFDbEUsUUFBUSxLQUFLLE1BQU0sS0FBSyxLQUFLLE1BQU07UUFFbkMsS0FBQyxRQUFRO1FBRVQsS0FBQztRQUVELEtBQUMsT0FBTyxTQUFTLEtBQUMsRUFBRTtRQUVwQixLQUFDLElBQUksS0FBQyxFQUFFLElBQUksTUFBTSxLQUFLO1FBQ3ZCLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxVQUFVLE9BQU8sVUFBVTthQUVwQzs7WUFDQyxNQUFNLEtBQUMsZ0JBQWdCO1lBQ3ZCLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxXQUFXO1lBQ3ZCLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxPQUFPOztRQUV2QixLQUFDLFVBQVU7UUFDWCxLQUFDLGNBQWMsTUFBTTtRQUNyQixLQUFDLGNBQWMsTUFBTTtRQUVyQixLQUFDLFFBQVEsS0FBQyxFQUFFLE1BQU07UUFDbEIsS0FBQyxXQUFXO1FBQ1osS0FBQztRQUVELEtBQUMsS0FBSztZQUVILElBQUksWUFBVzs7WUFDZCxLQUFDOzs7O1lBRUQsS0FBQzs7YUFFRjs7WUFDQyxLQUFDO2lCQUNNLElBQUk7O2dCQUNQLEtBQUssV0FBVztnQkFDaEIsS0FBQyxLQUFLOzs7UUFFZCxLQUFLLEtBQUs7ZUFFVjs7SUFFSix3QkFBZ0I7Ozs7Y0FFSCxLQUFDOzs7O1FBRVYsT0FBTyxXQUFXLEtBQUMsTUFBTSxLQUFDO1FBRTFCLFNBQVMsS0FBQyxnQkFBZ0IsS0FBQztRQUMzQixPQUFTLE9BQU8sVUFBVSxLQUFDLFFBQVE7Y0FFMUI7Ozs7UUFFVCxvQkFBZ0IsS0FBSyxLQUFLO1FBQzFCLFFBQVUsT0FBTyxTQUFTLEtBQUMsTUFBTSxLQUFDLFFBQVEsS0FBSztjQUV0Qzs7OztRQUVULE9BQU8sTUFBTSxLQUFLO1FBRWxCLGVBQVcsS0FBSyxHQUFHLEtBQUssSUFBSSxLQUFLLElBQUk7UUFDckMsZUFBVyxLQUFLLEdBQUcsS0FBSyxJQUFJLEtBQUssSUFBSTtRQUVyQyxjQUFVLEtBQUssRUFBRSxNQUFNLEtBQUssSUFBSSxPQUFPLEtBQUssUUFBUTtRQUNwRCxjQUFVLEtBQUssRUFBRSxNQUFNLEtBQUssSUFBSSxPQUFPLEtBQUssUUFBUTtRQUVwRCxLQUFDLFlBQVksS0FBQyxRQUFRLEtBQUMsT0FBTyxFQUFFO2VBRWhDOztJQUVKLDBCQUFrQjs7OztjQUVMLEtBQUM7Ozs7UUFFVixTQUFTLEtBQUMsZ0JBQWdCLEtBQUM7UUFDM0IsT0FBUyxPQUFPLFVBQVUsS0FBQyxRQUFRO2NBRTFCOzs7O1FBRVQsb0JBQWdCLEtBQUssS0FBSztRQUMxQixRQUFVLE9BQU8sV0FBVyxLQUFDLE1BQU0sS0FBQyxRQUFRLEtBQUs7Y0FFeEM7Ozs7UUFFVCxPQUFPLE1BQU0sS0FBSztRQUVsQixlQUFXLEtBQUssR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJO1FBQ3JDLGVBQVcsS0FBSyxHQUFHLEtBQUssSUFBSSxLQUFLLElBQUk7UUFFckMsY0FBVSxLQUFLLEVBQUUsTUFBTSxLQUFLLElBQUksT0FBTyxLQUFLLFFBQVE7UUFDcEQsY0FBVSxLQUFLLEVBQUUsTUFBTSxLQUFLLElBQUksT0FBTyxLQUFLLFFBQVE7UUFFcEQsS0FBQyxZQUFZLEtBQUMsUUFBUSxLQUFDLE9BQU8sRUFBRTtlQUVoQyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/sheet.kode
