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
        var cx, cy, i, node, nx, ny, row, s, top, x, y
    
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
                    ;[nx,ny] = this.sheetCellForPos([x + 1,y])
                    if (this.sheetSnapCell([nx,ny])[0] <= cx)
                    {
                        node = layout.nodeForPos(this.sheetSize(),this.rectree,[cx,ny])
                        if (layout.scaleOf((node != null ? node : {})) > 1)
                        {
                            nx = node.rect.abs.x + node.rect.abs.w
                        }
                    }
                    cx = _k_.min(nx,this.sheetSize().cols)
                    cy = ny
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
        var _129_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, node, offset, old, scale, _135_25_
    
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
        var cell, cells, _176_25_, _182_49_
    
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
        var cells, _192_25_
    
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
        var cells, _208_25_
    
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
        var cell, _257_41_
    
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
        var _267_25_
    
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
        var _275_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _327_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _356_25_
    
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
        var area, areas, i, x, y, _387_23_
    
        areas = ((_387_23_=this.s.sue) != null ? _387_23_ : [])
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
        var areas, _399_23_
    
        areas = ((_399_23_=this.s.sue) != null ? _399_23_ : [])
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
        var areas, _419_23_
    
        areas = ((_419_23_=this.s.sue) != null ? _419_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    },
    clearSueForRanges:function (ranges)
    {
        var areas, cut, _426_21_, _428_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_428_23_=this.s.sue) != null ? _428_23_ : [])
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
        var next, ranges, _441_21_, _448_56_
    
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
        next = sue.rangesWithToggledFlag(ranges,(((_448_56_=this.s.sue) != null ? _448_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
    },
    stepScales:function (delta)
    {
        var areas, indices, lines, next, piece, runs, _456_21_, _458_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_458_23_=this.s.sue) != null ? _458_23_ : [])
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
        var areas, indices, next, piece, run, _481_21_, _483_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_483_23_=this.s.sue) != null ? _483_23_ : [])
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
        var areas, _499_23_
    
        areas = ((_499_23_=this.s.sue) != null ? _499_23_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsYUFBVDs7T0FDUyxXQUFaO09BQWlCLFVBQWpCOztPQUNZLFdBQUE7OztJQUlmLDBCQUFpQjs7OztRQUViLFFBQVcsS0FBQztRQUNaLFdBQVcsT0FBTyxhQUFhLE1BQU0sS0FBQyxRQUFRLEtBQUMsZ0JBQWdCLEtBQUMsY0FBYztjQUUvRDs7bUJBQWI7O1FBRUYsT0FBTyxVQUFVLE1BQU0sS0FBQztRQUV4QixLQUFDLFlBQVksS0FBQyxRQUFRLE1BQU0sT0FBTyxrQkFBa0IsU0FBUyxLQUFLLFNBQVM7ZUFFNUU7O0lBRUo7O2dCQUFlLEtBQUssS0FBQyxNQUFNLEtBQUssS0FBSyxLQUFDLE1BQU07O0lBRTVDLDRCQUFtQjs7ZUFBSyxJQUFJLHFCQUFxQixLQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUMsaUJBQWlCOztJQUU5RSwwQkFBaUI7Ozs7VUFFWixFQUFFLEtBQUs7UUFFUixRQUFRLEtBQUMsa0JBQWtCO1FBQzNCLFlBQWEsTUFBTSxTQUFPO1lBRXZCLEtBQUs7O29CQUFlLE1BQU0sR0FBRzs7Z0JBRS9CLE1BQU0sYUFBYSxJQUFJLFVBQVU7O0lBRXRDLDhCQUFzQixLQUFJLEtBQUksUUFBTTs7OztVQUUvQixHQUFHLE1BQU0sS0FBQyxnQkFBZ0I7YUFFdkIsSUFBSyxPQUFJOztvQkFFRjs7cUJBRUg7cUJBRUssR0FBRyxNQUFNLEtBQUMsZ0JBQWdCLEtBQUMseUJBQXFCLEVBQUUsS0FBRyxHQUFHOztxQkFFN0Q7cUJBRUssRUFBRSxLQUFPLEtBQUMsaUJBQWlCLEdBQUc7c0JBQzlCLEdBQUcsTUFBTSxLQUFDLGlCQUFpQixJQUFFLEVBQUU7d0JBRTdCLEtBQUMsZUFBZSxHQUFHLEtBQUssTUFBTTs7d0JBQzdCLE9BQU8sT0FBTyxXQUFXLEtBQUMsWUFBWSxLQUFDLFNBQVMs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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
