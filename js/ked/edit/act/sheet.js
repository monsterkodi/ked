var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        var _22_38_, _22_72_
    
        return {cols:(((_22_38_=this.rectreeCols) != null ? _22_38_ : this.cells.cols)),rows:(((_22_72_=this.rectreeRows) != null ? _22_72_ : this.cells.rows))}
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
    sheetNodeAtCursor:function ()
    {
        var _111_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, lines, node, offset, old, pct, scale, _117_25_, _142_17_
    
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
        layout.regionize(cells,this.rectree)
        this.renderSheet(this.rectree,cells,layout.cellForTextOffset(node,offset))
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
        var _193_21_
    
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _258_25_
    
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _286_25_
    
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
    sueAt:function (pos)
    {
        var area, areas, i, x, y, _314_23_
    
        areas = ((_314_23_=this.s.sue) != null ? _314_23_ : [])
        if (_k_.empty(areas))
        {
            return
        }
        var _1a_ = pos; x = _1a_[0]; y = _1a_[1]
    
        for (var _1b_ = i = areas.length - 1, _1c_ = 0; (_1b_ <= _1c_ ? i <= 0 : i >= 0); (_1b_ <= _1c_ ? ++i : --i))
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
        var areas, _326_23_
    
        areas = ((_326_23_=this.s.sue) != null ? _326_23_ : [])
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
        var areas, _346_23_
    
        areas = ((_346_23_=this.s.sue) != null ? _346_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    },
    clearSueForRanges:function (ranges)
    {
        var areas, cut, _353_21_, _355_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_355_23_=this.s.sue) != null ? _355_23_ : [])
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
        var next, ranges, _368_21_, _375_56_
    
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
        next = sue.rangesWithToggledFlag(ranges,(((_375_56_=this.s.sue) != null ? _375_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
    },
    stepScales:function (delta)
    {
        var areas, indices, lines, next, piece, runs, _383_21_, _385_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_385_23_=this.s.sue) != null ? _385_23_ : [])
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
            for (var _1d_ = 0; _1d_ < list.length; _1d_++)
            {
                piece = list[_1d_]
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
        var areas, indices, next, piece, run, _408_21_, _410_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_410_23_=this.s.sue) != null ? _410_23_ : [])
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        next = sue.areasWithoutLineScales(areas,indices)
        var list = _k_.list(belt.splitLineRanges(this.s.lines,this.s.selections,false))
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            piece = list[_1e_]
            if (belt.isFullLineRange(this.s.lines,piece))
            {
                continue
            }
            var list1 = _k_.list(sue.runsForLine(next,this.s.lines,piece[1]))
            for (var _1f_ = 0; _1f_ < list1.length; _1f_++)
            {
                run = list1[_1f_]
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
        var areas, _426_23_
    
        areas = ((_426_23_=this.s.sue) != null ? _426_23_ : [])
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
        for (var _20_ = 0; _20_ < list.length; _20_++)
        {
            rng = list[_20_]
            if (area = this.sueAt([rng[0],rng[1]]))
            {
                var _21_ = area.value; code = _21_[0]
    
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsYUFBVDs7T0FDUyxXQUFaO09BQWlCLFVBQWpCOztPQUNZLFdBQUE7OztJQUlmLDBCQUFpQjs7OztRQUViLFFBQVcsS0FBQztRQUNaLFdBQVcsT0FBTyxhQUFhLE1BQU0sS0FBQyxRQUFRLEtBQUMsZ0JBQWdCLEtBQUMsY0FBYztjQUUvRDs7bUJBQWI7O1FBRUYsT0FBTyxVQUFVLE1BQU0sS0FBQztRQUV4QixLQUFDLFlBQVksS0FBQyxRQUFRLE1BQU0sT0FBTyxrQkFBa0IsU0FBUyxLQUFLLFNBQVM7ZUFFNUU7O0lBRUo7Ozs7Z0JBQWUsZ0JBQU0sS0FBQyxpQ0FBYyxLQUFDLE1BQU0sT0FBTSxnQkFBTSxLQUFDLGlDQUFjLEtBQUMsTUFBTTs7SUFFN0UsNEJBQW1COztlQUFLLElBQUkscUJBQXFCLEtBQUMsRUFBRSxNQUFNLEVBQUUsS0FBQyxpQkFBaUI7O0lBRTlFLDBCQUFpQjs7OztrQkFFTCxLQUFQLFlBQUU7O1FBRUgsUUFBUSxLQUFDLGtCQUFrQjtRQUMzQixZQUFhLE1BQU0sU0FBTztZQUV2QixLQUFLOztvQkFBZSxNQUFNLEdBQUc7O2dCQUUvQixNQUFNLGFBQWEsSUFBSSxVQUFVOztJQUV0Qyw4QkFBc0IsS0FBSSxLQUFJLFFBQU07Ozs7a0JBRXRCLEtBQUMsZ0JBQWdCLE1BQTFCLGFBQUc7O3VCQUVBLElBQUssU0FBSSx5QkFBQSxZQUFBOztvQkFFRjs7cUJBRUg7OEJBRWMsS0FBQyxnQkFBZ0IsS0FBQyx5QkFBcUIsRUFBRSxLQUFHLEdBQUcsT0FBeEQsYUFBRzs7O3FCQUVSOzhCQUVjLEtBQUMsaUJBQWlCLEdBQUcsTUFBOUIsWUFBRTs7K0JBQ08sS0FBQyxpQkFBaUIsSUFBRSxFQUFFLEtBQS9CLGNBQUc7O29CQUNKLGFBQWMsR0FBRyxLQUFDLFlBQVk7O3FCQUVsQztxQkFBSzsrQkFFUyxLQUFDLFlBQVksR0FBRyxLQUF6QixlQUFJOztvQkFFTCxPQUFNLFFBQU8sT0FBTyxNQUFJLElBQUksTUFBSTtvQkFDaEMsZ0JBQVksRUFBRSxLQUFDLEVBQUUsTUFBTSxTQUFPLEVBQUU7K0JBRXRCLEtBQUMsWUFBWSxHQUFHLE1BQXpCLGVBQUk7O29CQUVMLEtBQUssTUFBTSxJQUFFOzs7OztlQUV6QixLQUFDLGlCQUFpQixHQUFHOztJQUV6QixzQkFBYyxJQUFHOzs7O1FBRWIsT0FBUSxPQUFPLFdBQVcsS0FBQyxZQUFZLEtBQUMsU0FBUyxHQUFHO1FBQ3BELFFBQVEsT0FBTyxTQUFRLGVBQUE7WUFFcEIsU0FBUzs7b0JBQU8sR0FBRzs7UUFFdEIsT0FBTyxLQUFLLEtBQUs7Z0JBRWhCLEtBQUssZ0JBQVcsS0FBSyxLQUFLLEtBQUssU0FBUyxNQUFPOztJQUVwRCwwQkFBaUI7Ozs7bUJBRUgsTUFBVCxjQUFHOzttQkFFTSxLQUFDLFlBQVksR0FBRyxLQUF6QixlQUFJOztRQUNMLEtBQUssTUFBTSxJQUFFO1FBRWIsZ0JBQVksS0FBQyxFQUFFLE1BQU0sT0FBTyxLQUFHO3dCQUUzQixJQUFLLEtBQUcsVUFBSSwyQkFBQSxZQUFBOztnQkFDSCxLQUFLOztnQkFBZDs7Z0NBQ1csS0FBQyxpQkFBaUI7OztnQkFBekI7b0JBQ1ksSUFBSSxNQUFNLElBQUk7O29CQUExQjs7Z0JBQ0EsUUFBUSxLQUFDLGtCQUFrQjtxQkFDeEIsTUFBTSxJQUFJLE9BQU8sTUFBQSxLQUFLLE1BQU0sSUFBSTs7MkJBQzdCLEtBQUMsZUFBZSxHQUFHLEVBQUU7Ozs7ZUFFbkMsS0FBQyxlQUFlLEdBQUcsR0FBRyxLQUFDLGtCQUFrQjs7SUFFN0MseUJBQWlCLElBQUcsR0FBRTs7OztRQUVsQixZQUFZLE1BQU0sU0FBTztZQUV0QixNQUFNLE1BQU07O29CQUFnQixZQUFZLEtBQUssTUFBTSxXQUFXOzt3QkFFN0QsS0FBTSxVQUFJLGdDQUFBLGlCQUFBOztnQkFDUCxLQUFLLE1BQU0sS0FBRzs7d0JBQVEsR0FBRzs7O2dCQUUvQixVQUFVOztJQUVmOzs7O2NBRWEsS0FBQzs7OztlQUVWLE9BQU8sV0FBVyxLQUFDLFlBQVksS0FBQyxRQUFRLEtBQUMsZ0JBQWdCLEtBQUM7O0lBRTlELHlCQUFnQjs7OztjQUVILEtBQUM7Ozs7UUFFVixRQUFRLEtBQUM7UUFDVCxPQUFPLFdBQVcsTUFBTSxLQUFDO1FBRXpCLE9BQU8sS0FBQyxnQkFBZ0IsS0FBQztRQUN6QixPQUFPLE9BQU8sVUFBVSxLQUFDLFFBQVE7eUJBRWxCLGVBQUEsS0FBTTs7OztRQUVyQixNQUFRLE9BQU8sUUFBUTtRQUN2QixTQUFRLFVBQVMsSUFBSSxjQUFVLEVBQUUsRUFBRSxNQUFJO1lBRWxDLFVBQVM7Ozs7UUFFZCxTQUFTLE9BQU8sYUFBYSxLQUFLO1FBQ2xDLGdCQUFhLFdBQU0sS0FBSyxLQUFLLElBQUksSUFBSTtZQUVsQyxRQUFROztZQUNQLEtBQUssUUFBUTs7OzttQkFFTixLQUFLOztRQUVoQixNQUFnQixVQUFWLEtBQUssTUFBYSxLQUFLLEVBQUUsU0FBUzthQUVyQyxLQUFLLGVBQVc7O1lBQ2YsS0FBSyxJQUFJLFFBQVE7O1FBRXJCLE9BQU8sVUFBVSxNQUFNLEtBQUM7UUFFeEIsS0FBQyxZQUFZLEtBQUMsUUFBUSxNQUFNLE9BQU8sa0JBQWtCLEtBQUs7ZUFFMUQ7O0lBRUo7Ozs7UUFFSSxRQUFRLEtBQUM7UUFDVCxPQUFRLEtBQUMsZ0JBQWdCLEtBQUM7UUFDMUIsT0FBUSxLQUFDLGdCQUFnQjtjQUVoQjs7OztRQUVULFNBQVMsT0FBTyxhQUFhLEtBQUs7WUFFN0IsVUFBVTs7OztRQUVmLFFBQVEsTUFBTSxLQUFLLEtBQUs7UUFDeEIsTUFBTSxPQUFPLFNBQU8sRUFBRTtRQUN0QixLQUFLLE9BQU8sTUFBTSxLQUFLO1FBRXZCLE9BQU8sVUFBVSxNQUFNLEtBQUM7ZUFFeEIsS0FBQyxZQUFZLEtBQUMsUUFBUSxNQUFNLE9BQU8sa0JBQWtCLEtBQUssU0FBTzs7SUFFckUsMEJBQWlCOztlQUFRLE9BQU8sV0FBVyxLQUFDLFlBQVksS0FBQyxRQUFROztJQUVqRSx1QkFBZSxTQUFRLE1BQUs7O1FBRXhCLEtBQUMsVUFBVTtRQUNYLEtBQUMsY0FBYztRQUNmLEtBQUMsY0FBYztRQUVmLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxVQUFVLE9BQU8sVUFBVTtlQUN2Qzs7SUFFSjs7ZUFFVyxLQUFDO2VBQ0QsS0FBQztlQUNELEtBQUM7UUFFUixLQUFDLElBQUksS0FBQyxFQUFFLElBQUksVUFBVTtlQUN0Qjs7SUFFSjs7OzthQUVPLEtBQUMsRUFBRTs7WUFFRixLQUFDLFVBQVUsS0FBQyxFQUFFLFFBQVE7WUFDdEIsS0FBQyxjQUFjLEtBQUMsTUFBTTtZQUN0QixLQUFDLGNBQWMsS0FBQyxNQUFNO1lBRXRCLE9BQU8sWUFBWSxLQUFLLEtBQUMsWUFBWSxLQUFLLEtBQUMsYUFBYSxLQUFDO1lBRXpELEtBQUssS0FBSzs7OztZQUdWLEtBQUM7O2VBRUw7O0lBRUosc0JBQWMsU0FBUSxPQUFNLElBQUc7Ozs7UUFJM0IsT0FBQSxjQUFBO1FBRUEsT0FBUSxJQUFJLE1BQU0sT0FBTyxRQUFRLEtBQUssTUFBTSxLQUFLLEtBQUssTUFBTSxNQUFNO1FBQ2xFLFFBQVEsS0FBSyxNQUFNLEtBQUssS0FBSyxNQUFNO1FBRW5DLEtBQUMsUUFBUTtRQUVULEtBQUM7UUFFRCxLQUFDLE9BQU8sU0FBUyxLQUFDLEVBQUU7UUFFcEIsS0FBQyxJQUFJLEtBQUMsRUFBRSxJQUFJLE1BQU0sS0FBSztRQUN2QixLQUFDLElBQUksS0FBQyxFQUFFLElBQUksVUFBVSxPQUFPLFVBQVU7YUFFcEM7O1lBQ0MsTUFBTSxLQUFDLGdCQUFnQjtZQUN2QixLQUFDLElBQUksS0FBQyxFQUFFLElBQUksV0FBVztZQUN2QixLQUFDLElBQUksS0FBQyxFQUFFLElBQUksT0FBTzs7UUFFdkIsS0FBQyxVQUFVO1FBQ1gsS0FBQyxjQUFjLE1BQU07UUFDckIsS0FBQyxjQUFjLE1BQU07UUFFckIsS0FBQyxRQUFRLEtBQUMsRUFBRSxNQUFNO1FBQ2xCLEtBQUMsV0FBVztRQUNaLEtBQUM7UUFFRCxLQUFDLEtBQUs7WUFFSCxJQUFJLFlBQVc7O1lBQ2QsS0FBQzs7OztZQUVELEtBQUM7O2FBRUY7O1lBQ0MsS0FBQztpQkFDTSxJQUFJOztnQkFDUCxLQUFLLFdBQVc7Z0JBQ2hCLEtBQUMsS0FBSzs7O1FBRWQsS0FBSyxLQUFLO2VBRVY7O0lBRUosd0JBQWdCOzs7O2NBRUgsS0FBQzs7OztRQUVWLE9BQU8sV0FBVyxLQUFDLE1BQU0sS0FBQztRQUUxQixTQUFTLEtBQUMsZ0JBQWdCLEtBQUM7UUFDM0IsT0FBUyxPQUFPLFVBQVUsS0FBQyxRQUFRO2NBRTFCOzs7O1FBRVQsb0JBQWdCLEtBQUssS0FBSztRQUMxQixRQUFVLE9BQU8sU0FBUyxLQUFDLE1BQU0sS0FBQyxRQUFRLEtBQUs7Y0FFdEM7Ozs7UUFFVCxPQUFPLE1BQU0sS0FBSztRQUVsQixlQUFXLEtBQUssR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJO1FBQ3JDLGVBQVcsS0FBSyxHQUFHLEtBQUssSUFBSSxLQUFLLElBQUk7UUFFckMsY0FBVSxLQUFLLEVBQUUsTUFBTSxLQUFLLElBQUksT0FBTyxLQUFLLFFBQVE7UUFDcEQsY0FBVSxLQUFLLEVBQUUsTUFBTSxLQUFLLElBQUksT0FBTyxLQUFLLFFBQVE7UUFFcEQsS0FBQyxZQUFZLEtBQUMsUUFBUSxLQUFDLE9BQU8sRUFBRTtlQUVoQzs7SUFFSiwwQkFBa0I7Ozs7Y0FFTCxLQUFDOzs7O1FBRVYsU0FBUyxLQUFDLGdCQUFnQixLQUFDO1FBQzNCLE9BQVMsT0FBTyxVQUFVLEtBQUMsUUFBUTtjQUUxQjs7OztRQUVULG9CQUFnQixLQUFLLEtBQUs7UUFDMUIsUUFBVSxPQUFPLFdBQVcsS0FBQyxNQUFNLEtBQUMsUUFBUSxLQUFLO2NBRXhDOzs7O1FBRVQsT0FBTyxNQUFNLEtBQUs7UUFFbEIsZUFBVyxLQUFLLEdBQUcsS0FBSyxJQUFJLEtBQUssSUFBSTtRQUNyQyxlQUFXLEtBQUssR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJO1FBRXJDLGNBQVUsS0FBSyxFQUFFLE1BQU0sS0FBSyxJQUFJLE9BQU8sS0FBSyxRQUFRO1FBQ3BELGNBQVUsS0FBSyxFQUFFLE1BQU0sS0FBSyxJQUFJLE9BQU8sS0FBSyxRQUFRO1FBRXBELEtBQUMsWUFBWSxLQUFDLFFBQVEsS0FBQyxPQUFPLEVBQUU7ZUFFaEM7O0lBSUosZ0JBQU87Ozs7UUFFSCxtQkFBUSxLQUFDLEVBQUU7c0JBQ0E7Ozs7bUJBRUgsS0FBUCxhQUFFOzt3QkFFQyxJQUFLLE1BQU0sU0FBTyxVQUFHLHdCQUFBLFNBQUE7O1lBQ3JCLE9BQU8sTUFBTTtnQkFDVixLQUFLLE1BQUssS0FBTSxLQUFLLEtBQUs7O3VCQUN2Qjs7OztJQUVkLGlCQUFTLEdBQUUsR0FBRTs7OztRQUVULG1CQUFRLEtBQUMsRUFBRTtlQUNYLEtBQUMsVUFBVSxNQUFNLFNBQVMsRUFBRyxFQUFFLEVBQUcsRUFBRSxNQUFPOztJQUUvQyxvQkFBVzs7UUFFUCxLQUFDLElBQUksS0FBQyxFQUFFLElBQUksTUFBTTtRQUNsQixLQUFDLFdBQVc7UUFDWixLQUFDO1FBQ0QsS0FBQztlQUNELEtBQUMsS0FBSzs7SUFFVixrQkFBUzs7UUFFTCxLQUFDLElBQUksS0FBQyxFQUFFLElBQUksUUFBTyxnQkFBQTtRQUNuQixLQUFDLFdBQVc7UUFDWixLQUFDO2VBQ0QsS0FBQyxLQUFLOztJQUVWLHdCQUFlOzs7O1FBRVgsbUJBQVEsS0FBQyxFQUFFO29CQUNOLE1BQVM7Ozs7ZUFFZCxLQUFDLFVBQVU7O0lBRWYsNEJBQW1COzs7O2FBRVYsS0FBQzs7OztRQUVOLG1CQUFRLEtBQUMsRUFBRTtzQkFDQSxvQkFBZTs7OztRQUUxQixTQUFTLEtBQUssZ0JBQWdCLEtBQUMsRUFBRSxNQUFNLE9BQU87UUFFOUMsTUFBTSxJQUFJLDBCQUEwQixPQUFPLE1BQU0sS0FBQyxFQUFFO29CQUUvQyxLQUFROzs7O2VBRWIsS0FBQyxVQUFVOztJQUVmLHdCQUFlOzs7O2FBRU4sS0FBQzs7OztRQUVOLFNBQVMsS0FBQztzQkFDQzs7OztRQUVYLFNBQVMsS0FBSyxnQkFBZ0IsS0FBQyxFQUFFLE1BQU0sT0FBTztRQUU5QyxPQUFPLElBQUksc0JBQXNCLG1CQUFRLEtBQUMsRUFBRSwrQkFBVSxLQUFDLEVBQUUsTUFBTTtvQkFFMUQsTUFBUyxLQUFDLEVBQUU7Ozs7ZUFFakIsS0FBQyxVQUFVOztJQUVmLHFCQUFZOzs7O2FBRUgsS0FBQzs7OztRQUVOLG1CQUFRLEtBQUMsRUFBRTtRQUNYLE9BQVE7c0JBRUMsS0FBQyxFQUFFOztZQUNSLFVBQVUsS0FBSyx3QkFBd0IsS0FBQyxFQUFFO1lBQzFDLE9BQU8sSUFBSSwyQkFBMkIsTUFBTSxRQUFRLE1BQU0sS0FBQzs7OztZQUUzRDtZQUNBO2dDQUVhLEtBQUssZ0JBQWdCLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXOzs7Z0JBQXJEO29CQUNHLEtBQUssZ0JBQWdCLEtBQUMsRUFBRSxNQUFNOztpQ0FDTixNQUFNLEdBQVU7O3dCQUF2QyxNQUFNLEtBQUssTUFBTTs7Ozs7b0JBRWpCLEtBQUssS0FBSzs7O1lBRWxCLE9BQU8sSUFBSSwyQkFBMkIsS0FBSyxNQUFNLE1BQU0sS0FBQztZQUN4RCxPQUFPLElBQUksNEJBQTRCLEtBQUssS0FBSyxNQUFNLEtBQUMsRUFBRTs7ZUFFOUQsS0FBQyxjQUFjOztJQUVuQjs7OzthQUVTLEtBQUM7Ozs7UUFFTixtQkFBUSxLQUFDLEVBQUU7UUFDWCxVQUFVLEtBQUssZ0NBQWdDLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRTtRQUVoRSxPQUFPLElBQUksdUJBQXVCLE1BQU07NEJBRTNCLEtBQUssZ0JBQWdCLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXOzs7WUFBckQ7Z0JBQ1ksS0FBSyxnQkFBZ0IsS0FBQyxFQUFFLE1BQU07O2dCQUExQzs7aUNBQ1csSUFBSSxZQUFZLEtBQUssS0FBQyxFQUFFLE1BQU0sTUFBTTs7O2dCQUEzQztvQkFDRyxJQUFJLE1BQU0sTUFBTSxNQUFPLE1BQU0sTUFBTSxJQUFJOztvQkFDdEMsT0FBTyxJQUFJLGdCQUFnQixLQUFLLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSTtvQkFDcEQ7Ozs7ZUFFWixLQUFDLGNBQWM7O0lBRW5CLDJCQUFrQjs7OztRQUVkLG1CQUFRLEtBQUMsRUFBRTtzQkFDRzs7OztlQUVkLElBQUksWUFBWSxNQUFNLEtBQUMsRUFBRSxNQUFNOztJQUVuQzs7OztZQUVPLFNBQVMsS0FBQzs7bUJBQ1QsS0FBQyxrQkFBa0I7OztJQUUzQiw4QkFBcUI7Ozs7UUFFakIsS0FBSyxVQUFTOzRCQUVILEtBQUMsRUFBRTs7O1lBQVY7Z0JBQ0csT0FBTyxLQUFDLE9BQU8sSUFBSSxHQUFHLElBQUk7OzJCQUNoQixLQUFLLE9BQWI7O29CQUNFLFNBQVEsSUFBSTs7MkJBQ1QsS0FBSyxPQUFNLEtBQUssSUFBSTs7b0JBQ3ZCLE1BQU8sU0FBUSxJQUFJOzsyQkFDaEIsS0FBSyxNQUFNOztxQkFDVixNQUFPLFNBQVEsSUFBSTs7MkJBQ3BCLEtBQUssTUFBTTs7OztlQUV6QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/sheet.kode
