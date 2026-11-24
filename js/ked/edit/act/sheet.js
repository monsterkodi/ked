var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        var cell, cells, inserted, sel
    
        cells = this.sheetSize()
        cell = this.sheetCellForPos(this.mainCursor())
        if (sel = this.sheetSelection())
        {
            this.sheetCutText(sel)
            cell = layout.cellForTextOffset(sel.node,sel.from)
        }
        inserted = layout.insertTextAt(cells,this.rectree,cell,text)
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
        var _135_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, node, offset, old, scale, _141_25_
    
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
        var cell, cells, _182_25_, _188_49_
    
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
        var cells, _198_25_
    
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
        var cells, _214_25_
    
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
    sheetDelete:function (type)
    {
        var cell, from, node, offset, sel
    
        if (sel = this.sheetSelection())
        {
            this.sheetCutText(sel)
            this.renderSheet(this.rectree,this.sheetSize(),layout.cellForTextOffset(sel.node,sel.from))
            return
        }
        cell = this.sheetCellForPos(this.mainCursor())
        node = this.sheetTextNodeAt(cell)
        if (!(node != null))
        {
            return
        }
        offset = layout.textOffsetAt(node,cell)
        from = (type === 'back' ? offset - 1 : offset)
        if (from < 0 || from >= Array.from(node.text).length)
        {
            return
        }
        this.sheetCutText({node:node,from:from,to:from + 1})
        return this.renderSheet(this.rectree,this.sheetSize(),layout.cellForTextOffset(node,from))
    },
    sheetCutText:function (sel)
    {
        var chars
    
        chars = Array.from(sel.node.text)
        chars.splice(sel.from,sel.to - sel.from)
        sel.node.text = chars.join('')
        return layout.regionize(this.sheetSize(),this.rectree)
    },
    sheetTextNodeAt:function (cell)
    {
        return layout.textNodeAt(this.sheetSize(),this.rectree,cell)
    },
    sheetSelection:function ()
    {
        var from, inside, node, rng, slot, to, x, y, _279_37_, _283_21_
    
        if (_k_.empty(this.s.selections))
        {
            return
        }
        node = this.sheetTextNodeAt(this.sheetCellForPos(this.mainCursor()))
        if (!(node != null))
        {
            return
        }
        inside = function (x, y, r)
        {
            return (y > r[1] || y === r[1] && x >= r[0]) && (y < r[3] || y === r[3] && x < r[2])
        }
        from = to = null
        var list = _k_.list(layout.textSlots(node))
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            slot = list[_b_]
            if (!(slot[2] != null))
            {
                continue
            }
            ;[x,y] = this.sheetPosForCell([slot[0],slot[1]])
            var list1 = _k_.list(this.s.selections)
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                rng = list1[_c_]
                if (inside(x,y,rng))
                {
                    from = _k_.min((((_279_37_=from) != null ? _279_37_ : slot[3])),slot[3])
                    to = _k_.max(((to != null ? to : slot[3] + 1)),slot[3] + 1)
                    break
                }
            }
        }
        if (!(from != null))
        {
            return
        }
        return {node:node,from:from,to:to}
    },
    sheetRangesForText:function (node, from, to)
    {
        var prev, ranges, slot, x, y
    
        ranges = []
        var list = _k_.list(layout.textSlots(node))
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            slot = list[_d_]
            if (!(slot[2] != null) || slot[3] < from || slot[3] >= to)
            {
                continue
            }
            ;[x,y] = this.sheetPosForCell([slot[0],slot[1]])
            prev = _k_.last(ranges)
            if ((prev != null) && prev[1] === y && prev[2] === x)
            {
                prev[2] = x + 1
            }
            else
            {
                ranges.push([x,y,x + 1,y])
            }
        }
        return ranges
    },
    sheetSelectedText:function ()
    {
        var sel
    
        if (sel = this.sheetSelection())
        {
            return Array.from(sel.node.text).slice(sel.from,sel.to).join('')
        }
    },
    sheetSelectAll:function ()
    {
        var len, node, ranges
    
        node = this.sheetTextNodeAt(this.sheetCellForPos(this.mainCursor()))
        if (!(node != null))
        {
            return
        }
        len = Array.from(node.text).length
        ranges = this.sheetRangesForText(node,0,len)
        if (_k_.empty((ranges)) || _k_.eql(ranges, this.s.selections))
        {
            this.deselect()
            return
        }
        this.setSelections(ranges)
        return this.setCursors([this.sheetPosForCell(layout.cellForTextOffset(node,len))])
    },
    sheetMoveAndSelect:function (dir)
    {
        var anchor, at, cell, len, next, node, sel, to, _334_25_
    
        cell = this.sheetCellForPos(this.mainCursor())
        sel = this.sheetSelection()
        node = ((_334_25_=(sel != null ? sel.node : undefined)) != null ? _334_25_ : this.sheetTextNodeAt(cell))
        if (!(node != null) || !(_k_.in(dir,['left','right','up','down'])))
        {
            return
        }
        at = layout.textOffsetAt(node,cell)
        anchor = at
        if ((sel != null))
        {
            anchor = ((at === sel.from ? sel.to : sel.from))
        }
        len = Array.from(node.text).length
        if (_k_.in(dir,['left','right']))
        {
            to = _k_.clamp(0,len,((dir === 'left' ? at - 1 : at + 1)))
        }
        else
        {
            next = this.sheetCellForPos(this.sheetPosInDirection(this.mainCursor(),dir))
            if (layout.holds(node,next) || this.sheetTextNodeAt(next) === node)
            {
                to = layout.textOffsetAt(node,next)
            }
            else
            {
                to = (dir === 'up' ? 0 : len)
            }
        }
        this.setSelections(this.sheetRangesForText(node,_k_.min(anchor,to),_k_.max(anchor,to)))
        return this.setCursors([this.sheetPosForCell(layout.cellForTextOffset(node,to))])
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
        var cell, _372_41_
    
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
        var _382_25_
    
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
        var _390_25_
    
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
        if (opt.history !== false)
        {
            this.s = this.s.set('selections',[])
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _444_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _473_25_
    
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
        var area, areas, i, x, y, _504_23_
    
        areas = ((_504_23_=this.s.sue) != null ? _504_23_ : [])
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
        var areas, _516_23_
    
        areas = ((_516_23_=this.s.sue) != null ? _516_23_ : [])
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
        var areas, _536_23_
    
        areas = ((_536_23_=this.s.sue) != null ? _536_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    },
    clearSueForRanges:function (ranges)
    {
        var areas, cut, _543_21_, _545_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_545_23_=this.s.sue) != null ? _545_23_ : [])
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
        var next, ranges, _558_21_, _565_56_
    
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
        next = sue.rangesWithToggledFlag(ranges,(((_565_56_=this.s.sue) != null ? _565_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
    },
    stepScales:function (delta)
    {
        var areas, indices, lines, next, piece, runs, _573_21_, _575_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_575_23_=this.s.sue) != null ? _575_23_ : [])
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
            for (var _e_ = 0; _e_ < list.length; _e_++)
            {
                piece = list[_e_]
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
        var areas, indices, next, piece, run, _598_21_, _600_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_600_23_=this.s.sue) != null ? _600_23_ : [])
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        next = sue.areasWithoutLineScales(areas,indices)
        var list = _k_.list(belt.splitLineRanges(this.s.lines,this.s.selections,false))
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            piece = list[_f_]
            if (belt.isFullLineRange(this.s.lines,piece))
            {
                continue
            }
            var list1 = _k_.list(sue.runsForLine(next,this.s.lines,piece[1]))
            for (var _10_ = 0; _10_ < list1.length; _10_++)
            {
                run = list1[_10_]
                if (run[0] <= piece[0] && piece[2] <= run[1])
                {
                    next = sue.areasWithoutRun(next,piece[1],run[0],run[1])
                    break
                }
            }
        }
        return this.applySueAreas(next)
    },
    toggleWrap:function ()
    {
        var areas, indices, wrap, _617_21_, _622_23_
    
        if ((this.rectree != null) || this.wrap.all)
        {
            return
        }
        indices = belt.lineIndicesForRangesAndPositions(this.s.selections,this.s.cursors)
        if (_k_.empty(indices))
        {
            return
        }
        areas = ((_622_23_=this.s.sue) != null ? _622_23_ : [])
        wrap = !sue.isWrapLine(areas,this.mainCursor()[1])
        this.applySueAreas(sue.areasWithWraps(areas,indices,wrap))
        return this.adjustViewForMainCursor()
    },
    toggleWrapAll:function ()
    {
        return this.setWrap({all:!this.wrap.all})
    },
    toggleWrapWord:function ()
    {
        return this.setWrap({word:!this.wrap.word})
    },
    scaleRunsForLine:function (y)
    {
        var areas, _633_23_
    
        areas = ((_633_23_=this.s.sue) != null ? _633_23_ : [])
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
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            rng = list[_11_]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsYUFBVDs7T0FDUyxXQUFaO09BQWlCLFVBQWpCOztPQUNZLFdBQUE7OztJQUlmLDBCQUFpQjs7OztRQUViLFFBQVEsS0FBQztRQUNULE9BQVEsS0FBQyxnQkFBZ0IsS0FBQztZQUV2QixNQUFNLEtBQUM7O1lBQ04sS0FBQyxhQUFhO1lBQ2QsT0FBTyxPQUFPLGtCQUFrQixJQUFJLEtBQUssSUFBSTs7UUFFakQsV0FBVyxPQUFPLGFBQWEsTUFBTSxLQUFDLFFBQVEsS0FBSztjQUVwQzs7bUJBQWI7O1FBRUYsT0FBTyxVQUFVLE1BQU0sS0FBQztRQUV4QixLQUFDLFlBQVksS0FBQyxRQUFRLE1BQU0sT0FBTyxrQkFBa0IsU0FBUyxLQUFLLFNBQVM7ZUFFNUU7O0lBRUo7O2dCQUFlLEtBQUssS0FBQyxNQUFNLEtBQUssS0FBSyxLQUFDLE1BQU07O0lBRTVDLDRCQUFtQjs7ZUFBSyxJQUFJLHFCQUFxQixLQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUMsaUJBQWlCOztJQUU5RSwwQkFBaUI7Ozs7VUFFWixFQUFFLEtBQUs7UUFFUixRQUFRLEtBQUMsa0JBQWtCO1FBQzNCLFlBQWEsTUFBTSxTQUFPO1lBRXZCLEtBQUs7O29CQUFlLE1BQU0sR0FBRzs7Z0JBRS9CLE1BQU0sYUFBYSxJQUFJLFVBQVU7O0lBRXRDLDhCQUFzQixLQUFJLEtBQUksUUFBTTs7OztVQUUvQixHQUFHLE1BQU0sS0FBQyxnQkFBZ0I7YUFFdkIsSUFBSyxPQUFJOztvQkFFRjs7cUJBRUg7cUJBRUssR0FBRyxNQUFNLEtBQUMsZ0JBQWdCLEtBQUMseUJBQXFCLEVBQUUsS0FBRyxHQUFHOztxQkFFN0Q7cUJBRUssRUFBRSxLQUFPLEtBQUMsaUJBQWlCLEdBQUc7c0JBQzlCLEdBQUcsTUFBTSxLQUFDLGlCQUFpQixJQUFF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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
