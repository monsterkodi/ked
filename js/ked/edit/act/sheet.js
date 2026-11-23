var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import layout from "../../popo/layout.js"

import belt from "../tool/belt.js"
import sue from "../tool/sue.js"

import mode from "../mode.js"

export default {
    insertIntoSheet:function (text)
    {
        var cells, inserted
    
        cells = this.sheetSize()
        inserted = layout.insertTextAt(cells,this.rectree,this.sheetCellForPos(this.mainCursor()),text)
        if (!(inserted != null))
        {
            return false
        }
        layout.regionize(cells,this.rectree)
        this.renderSheet(this.rectree,cells,layout.cellForTextOffset(inserted.node,inserted.offset))
        return true
    },
    sheetSize:function ()
    {
        return {cols:this.cells.cols,rows:this.cells.rows}
    },
    sheetCellsForLine:function (y)
    {
        return sue.cellPositionsForLine(this.s.lines,y,this.scaleRunsForLine(y))
    },
    sheetCellForPos:function (pos)
    {
        var cells, lastIndex, x, y
    
        ;[x,y] = pos
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
    
        ;[cx,cy] = this.sheetCellForPos(pos)
        for (i = 0; i < count; i++)
        {
            switch (dir)
            {
                case 'left':
                    [cx,cy] = this.sheetCellForPos(this.sheetPosForCell([_k_.max(0,cx - 1),cy]))
                    break
                case 'right':
                    [x,y] = this.sheetPosForCell([cx,cy])
                    ;[cx,cy] = this.sheetCellForPos([x + 1,y])
                    cx = _k_.min(cx,this.sheetSize().cols)
                    break
                case 'up':
                case 'down':
                    [top,s] = this.sheetBandAt(cx,cy)
                    row = (dir === 'up' ? top - 1 : top + s)
                    row = _k_.clamp(0,this.s.lines.length - 1,row)
                    ;[top,s] = this.sheetBandAt(cx,row)
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
    sheetSnapCell:function (cell)
    {
        var cx, cy, node, rect, scale
    
        ;[cx,cy] = cell
        node = layout.nodeForPos(this.sheetSize(),this.rectree,[cx,cy])
        scale = layout.scaleOf((node != null ? node : {}))
        if (scale <= 1)
        {
            return cell
        }
        rect = node.rect.abs
        return [rect.x + Math.floor((cx - rect.x) / scale) * scale,rect.y + Math.floor((cy - rect.y) / scale) * scale + scale - 1]
    },
    sheetPosForCell:function (cell)
    {
        var below, cells, cx, cy, run, y
    
        ;[cx,cy] = this.sheetSnapCell(cell)
        below = _k_.min(this.s.lines.length,cy + 7)
        for (y = cy + 1; y < below; y++)
        {
            var list = _k_.list(this.scaleRunsForLine(y))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                run = list[_a_]
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
        for (gi = 0; gi < lastIndex; gi++)
        {
            if (cx < cells[gi + 1])
            {
                return [gi,y]
            }
        }
        return [lastIndex,y]
    },
    sheetNodeAtCursor:function ()
    {
        var _123_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, node, offset, old, scale, _129_25_
    
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
        offset = layout.textOffsetAt(node,cell)
        if (scale > 1)
        {
            node.scale = scale
        }
        else
        {
            delete node.scale
        }
        if (this.sheetCellsValue(node.w))
        {
            node.w = _k_.max(1,Math.floor(parseInt(node.w) / old)) * scale
        }
        if (this.sheetCellsValue(node.h))
        {
            node.h = _k_.max(1,Math.floor(parseInt(node.h) / old)) * scale
        }
        layout.regionize(cells,this.rectree)
        this.renderSheet(this.rectree,cells,layout.cellForTextOffset(node,offset))
        return node
    },
    sheetCellsValue:function (value)
    {
        var pct
    
        if (!(value != null))
        {
            return false
        }
        pct = _k_.isStr(value) && value.endsWith('%')
        return !pct
    },
    deleteSheetNode:function (node)
    {
        var cell, cells, _170_25_, _176_49_
    
        if (!(this.rectree != null))
        {
            return
        }
        cells = this.sheetSize()
        cell = this.sheetCellForPos(this.mainCursor())
        node = (node != null ? node : layout.nodeForPos(cells,this.rectree,cell))
        if (!(layout.removeNode(this.rectree,node) != null))
        {
            return
        }
        layout.regionize(cells,this.rectree)
        this.renderSheet(this.rectree,cells,cell)
        return node
    },
    shiftSheetNode:function (node, dir)
    {
        var cells, _186_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        cells = this.sheetSize()
        layout.absolutize(cells,this.rectree)
        if (!layout.shiftNode(this.rectree,node,dir))
        {
            return
        }
        layout.regionize(cells,this.rectree)
        this.renderSheet(this.rectree,cells,this.sheetCellForPos(this.mainCursor()))
        return node
    },
    insertSheetNode:function (node, parent)
    {
        var cells, _202_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        cells = this.sheetSize()
        layout.appendChild(((parent != null ? parent : this.rectree)),node)
        layout.regionize(cells,this.rectree)
        this.renderSheet(this.rectree,cells,this.sheetCellForPos(this.mainCursor()))
        return node
    },
    sheetBackspace:function ()
    {
        var cell, cells, chars, node, offset
    
        cells = this.sheetSize()
        cell = this.sheetCellForPos(this.mainCursor())
        node = this.sheetTextNodeAt(cell)
        if (!(node != null))
        {
            return
        }
        offset = layout.textOffsetAt(node,cell)
        if (offset <= 0)
        {
            return
        }
        chars = Array.from(node.text)
        chars.splice(offset - 1,1)
        node.text = chars.join('')
        layout.regionize(cells,this.rectree)
        return this.renderSheet(this.rectree,cells,layout.cellForTextOffset(node,offset - 1))
    },
    sheetTextNodeAt:function (cell)
    {
        return layout.textNodeAt(this.sheetSize(),this.rectree,cell)
    },
    setSheetTree:function (rectree)
    {
        this.rectree = layout.pageOf(rectree)
        this.s = this.s.set('rectree',layout.plainNode(this.rectree))
        return this
    },
    clearSheet:function ()
    {
        delete this.rectree
        this.s = this.s.set('rectree',null)
        return this
    },
    restoreSheet:function ()
    {
        var cell, _251_41_
    
        if (!(this.s.rectree != null))
        {
            return this.clearSheet()
        }
        cell = this.sheetCellForPos(this.mainCursor())
        this.rectree = this.s.rectree.asMutable()
        return this.renderSheet(this.rectree,this.sheetSize(),cell,{history:false,silent:true})
    },
    fitSheet:function ()
    {
        var _261_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        if (this.cells.cols < 1 || this.cells.rows < 1)
        {
            return
        }
        if (_k_.eql(this.rectree.rendered, this.sheetSize()))
        {
            return
        }
        return this.renderSheet(this.rectree,this.sheetSize(),this.sheetCellForPos(this.mainCursor()),{history:false,silent:true})
    },
    commitSheet:function ()
    {
        var _269_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return this.renderSheet(this.rectree,this.sheetSize(),this.sheetCellForPos(this.mainCursor()),{silent:true})
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
        this.segls = this.s.lines.slice()
        this.rowCache = null
        if (opt.history !== false)
        {
            this.r = []
        }
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _321_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        cells = this.sheetSize()
        layout.absolutize(cells,this.rectree)
        cursor = this.sheetCellForPos(this.mainCursor())
        node = layout.topmostIn(this.rectree,cursor)
        if (!(node != null))
        {
            return
        }
        oldRect = _k_.clone(node.rect.abs)
        moved = layout.moveNode(cells,this.rectree,node,dir)
        if (!(moved != null))
        {
            return
        }
        rect = moved.rect.abs
        maxX = _k_.max(rect.x,(rect.x + rect.w - 1))
        maxY = _k_.max(rect.y,(rect.y + rect.h - 1))
        x = _k_.clamp(rect.x,maxX,(rect.x + cursor[0] - oldRect.x))
        y = _k_.clamp(rect.y,maxY,(rect.y + cursor[1] - oldRect.y))
        this.renderSheet(this.rectree,cells,[x,y])
        return moved
    },
    resizeSheetNode:function (dir)
    {
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _350_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        cells = this.sheetSize()
        layout.absolutize(cells,this.rectree)
        cursor = this.sheetCellForPos(this.mainCursor())
        node = layout.topmostIn(this.rectree,cursor)
        if (!(node != null))
        {
            return
        }
        oldRect = _k_.clone(node.rect.abs)
        moved = layout.resizeNode(cells,this.rectree,node,dir)
        if (!(moved != null))
        {
            return
        }
        rect = moved.rect.abs
        maxX = _k_.max(rect.x,(rect.x + rect.w - 1))
        maxY = _k_.max(rect.y,(rect.y + rect.h - 1))
        x = _k_.clamp(rect.x,maxX,(rect.x + cursor[0] - oldRect.x))
        y = _k_.clamp(rect.y,maxY,(rect.y + cursor[1] - oldRect.y))
        this.renderSheet(this.rectree,cells,[x,y])
        return moved
    },
    sueAt:function (pos)
    {
        var area, areas, i, x, y, _381_23_
    
        areas = ((_381_23_=this.s.sue) != null ? _381_23_ : [])
        if (_k_.empty(areas))
        {
            return
        }
        ;[x,y] = pos
        for (i = areas.length - 1; i >= 0; i--)
        {
            area = areas[i]
            if (area.y === y && area.x <= x)
            {
                return area
            }
        }
    },
    setSue:function (x, y, value)
    {
        var areas, _393_23_
    
        areas = ((_393_23_=this.s.sue) != null ? _393_23_ : [])
        return this.changeSue(areas.concat([{x:x,y:y,value:value}]))
    },
    changeSue:function (areas)
    {
        this.s = this.s.set('sue',areas)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    },
    loadSue:function (areas)
    {
        this.s = this.s.set('sue',((areas != null ? areas : [])))
        this.rowCache = null
        this.clearHistory()
        return this.emit('sue.changed')
    },
    applySueAreas:function (next)
    {
        var areas, _413_23_
    
        areas = ((_413_23_=this.s.sue) != null ? _413_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    },
    clearSueForRanges:function (ranges)
    {
        var areas, cut, _420_21_, _422_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_422_23_=this.s.sue) != null ? _422_23_ : [])
        if (_k_.empty(areas) || _k_.empty(ranges))
        {
            return
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges,false)
        cut = sue.rangesCutFromAreasInLines(ranges,areas,this.s.lines)
        if (_k_.eql(cut, areas))
        {
            return
        }
        return this.changeSue(cut)
    },
    toggleSueFlag:function (flag)
    {
        var next, ranges, _435_21_, _442_56_
    
        if ((this.rectree != null))
        {
            return
        }
        ranges = this.selectionsOrCursorWordRanges()
        if (_k_.empty(ranges))
        {
            return
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges,false)
        next = sue.rangesWithToggledFlag(ranges,(((_442_56_=this.s.sue) != null ? _442_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
    },
    stepScales:function (delta)
    {
        var areas, indices, lines, next, piece, runs, _450_21_, _452_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_452_23_=this.s.sue) != null ? _452_23_ : [])
        next = areas
        if (_k_.empty(this.s.selections))
        {
            indices = belt.lineIndicesForPositions(this.s.cursors)
            next = sue.areasWithSteppedLineScales(areas,indices,delta,this.lineHeight)
        }
        else
        {
            lines = []
            runs = []
            var list = _k_.list(belt.splitLineRanges(this.s.lines,this.s.selections,false))
            for (var _b_ = 0; _b_ < list.length; _b_++)
            {
                piece = list[_b_]
                if (belt.isFullLineRange(this.s.lines,piece))
                {
                    if (!(_k_.in(piece[1],lines)))
                    {
                        lines.push(piece[1])
                    }
                }
                else
                {
                    runs.push(piece)
                }
            }
            next = sue.areasWithSteppedLineScales(next,lines,delta,this.lineHeight)
            next = sue.areasWithSteppedRunsInLines(next,runs,delta,this.s.lines)
        }
        return this.applySueAreas(next)
    },
    clearScales:function ()
    {
        var areas, indices, next, piece, run, _475_21_, _477_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_477_23_=this.s.sue) != null ? _477_23_ : [])
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        next = sue.areasWithoutLineScales(areas,indices)
        var list = _k_.list(belt.splitLineRanges(this.s.lines,this.s.selections,false))
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            piece = list[_c_]
            if (belt.isFullLineRange(this.s.lines,piece))
            {
                continue
            }
            var list1 = _k_.list(sue.runsForLine(next,this.s.lines,piece[1]))
            for (var _d_ = 0; _d_ < list1.length; _d_++)
            {
                run = list1[_d_]
                if (run[0] <= piece[0] && piece[2] <= run[1])
                {
                    next = sue.areasWithoutRun(next,piece[1],run[0],run[1])
                    break
                }
            }
        }
        return this.applySueAreas(next)
    },
    scaleRunsForLine:function (y)
    {
        var areas, _493_23_
    
        areas = ((_493_23_=this.s.sue) != null ? _493_23_ : [])
        if (_k_.empty(areas))
        {
            return []
        }
        return sue.runsForLine(areas,this.s.lines,y)
    },
    clearSueAtCursorOrSelection:function ()
    {
        var ranges
    
        if (ranges = this.selectionsOrCursorWordRanges())
        {
            return this.clearSueForRanges(ranges)
        }
    },
    sueColorAtSelection:function (layer)
    {
        var area, code, fg, rng
    
        fg = layer === 'fg'
        var list = _k_.list(this.s.selections)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            rng = list[_e_]
            if (area = this.sueAt([rng[0],rng[1]]))
            {
                ;[code] = area.value
                if (code === sue.FG_BG_COLOR)
                {
                    return area.value[(fg ? 3 : 4)]
                }
                if (fg && code === sue.FG_COLOR)
                {
                    return area.value[3]
                }
                if (!fg && code === sue.BG_COLOR)
                {
                    return area.value[3]
                }
            }
        }
        return null
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsYUFBVDs7T0FDUyxXQUFaO09BQWlCLFVBQWpCOztPQUNZLFdBQUE7OztJQUlmLDBCQUFpQjs7OztRQUViLFFBQVcsS0FBQztRQUNaLFdBQVcsT0FBTyxhQUFhLE1BQU0sS0FBQyxRQUFRLEtBQUMsZ0JBQWdCLEtBQUMsY0FBYztjQUUvRDs7bUJBQWI7O1FBRUYsT0FBTyxVQUFVLE1BQU0sS0FBQztRQUV4QixLQUFDLFlBQVksS0FBQyxRQUFRLE1BQU0sT0FBTyxrQkFBa0IsU0FBUyxLQUFLLFNBQVM7ZUFFNUU7O0lBRUo7O2dCQUFlLEtBQUssS0FBQyxNQUFNLEtBQUssS0FBSyxLQUFDLE1BQU07O0lBRTVDLDRCQUFtQjs7ZUFBSyxJQUFJLHFCQUFxQixLQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUMsaUJBQWlCOztJQUU5RSwwQkFBaUI7Ozs7VUFFWixFQUFFLEtBQUs7UUFFUixRQUFRLEtBQUMsa0JBQWtCO1FBQzNCLFlBQWEsTUFBTSxTQUFPO1lBRXZCLEtBQUs7O29CQUFlLE1BQU0sR0FBRzs7Z0JBRS9CLE1BQU0sYUFBYSxJQUFJLFVBQVU7O0lBRXRDLDhCQUFzQixLQUFJLEtBQUksUUFBTTs7OztVQUUvQixHQUFHLE1BQU0sS0FBQyxnQkFBZ0I7YUFFdkIsSUFBSyxPQUFJOztvQkFFRjs7cUJBRUg7cUJBRUssR0FBRyxNQUFNLEtBQUMsZ0JBQWdCLEtBQUMseUJBQXFCLEVBQUUsS0FBRyxHQUFHOztxQkFFN0Q7cUJBRUssRUFBRSxLQUFPLEtBQUMsaUJBQWlCLEdBQUc7c0JBQzlCLEdBQUcsTUFBTSxLQUFDLGlCQUFpQixJQUFFLEVBQUU7b0JBQ2hDLGFBQWMsR0FBRyxLQUFDLFlBQVk7O3FCQUVsQztxQkFBSztxQkFFQSxJQUFJLEtBQUssS0FBQyxZQUFZLEdBQUc7b0JB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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
