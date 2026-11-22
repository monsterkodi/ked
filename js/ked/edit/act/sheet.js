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
        var _171_21_
    
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _236_25_
    
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
        var cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _264_25_
    
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
        var area, areas, i, x, y, _292_23_
    
        areas = ((_292_23_=this.s.sue) != null ? _292_23_ : [])
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
        var areas, _304_23_
    
        areas = ((_304_23_=this.s.sue) != null ? _304_23_ : [])
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
        var areas, _324_23_
    
        areas = ((_324_23_=this.s.sue) != null ? _324_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    },
    clearSueForRanges:function (ranges)
    {
        var areas, cut, _331_21_, _333_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_333_23_=this.s.sue) != null ? _333_23_ : [])
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
        var next, ranges, _346_21_, _353_56_
    
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
        next = sue.rangesWithToggledFlag(ranges,(((_353_56_=this.s.sue) != null ? _353_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
    },
    stepScales:function (delta)
    {
        var areas, indices, lines, next, piece, runs, _361_21_, _363_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_363_23_=this.s.sue) != null ? _363_23_ : [])
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
        var areas, indices, next, piece, run, _386_21_, _388_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_388_23_=this.s.sue) != null ? _388_23_ : [])
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
        var areas, _404_23_
    
        areas = ((_404_23_=this.s.sue) != null ? _404_23_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsYUFBVDs7T0FDUyxXQUFaO09BQWlCLFVBQWpCOztPQUNZLFdBQUE7OztJQUlmLDBCQUFpQjs7OztRQUViLFFBQVUsS0FBQztRQUNYLFVBQVUsS0FBQztRQUNYLE9BQVUsS0FBQyxnQkFBZ0IsS0FBQztRQUM1QixVQUFVLE9BQU8sYUFBYSxNQUFNLFFBQVEsS0FBSzthQUV0Qzs7bUJBQVQ7O1FBRUYsS0FBQyxZQUFZLFFBQVEsT0FBTyxLQUFLLEtBQUcsUUFBUSxLQUFLO2VBRWpEOztJQUVKOzs7O2dCQUFlLGdCQUFNLEtBQUMsaUNBQWMsS0FBQyxNQUFNLE9BQU0sZ0JBQU0sS0FBQyxpQ0FBYyxLQUFDLE1BQU07O0lBRTdFLDRCQUFtQjs7ZUFBSyxJQUFJLHFCQUFxQixLQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUMsaUJBQWlCOztJQUU5RSwwQkFBaUI7Ozs7a0JBRUwsS0FBUCxZQUFFOztRQUVILFFBQVEsS0FBQyxrQkFBa0I7UUFDM0IsWUFBYSxNQUFNLFNBQU87WUFFdkIsS0FBSzs7b0JBQWUsTUFBTSxHQUFHOztnQkFFL0IsTUFBTSxhQUFhLElBQUksVUFBVTs7SUFFdEMsOEJBQXNCLEtBQUksS0FBSSxRQUFNOzs7O2tCQUV0QixLQUFDLGdCQUFnQixNQUExQixhQUFHOzt1QkFFQSxJQUFLLFNBQUkseUJBQUEsWUFBQTs7b0JBRUY7O3FCQUVIOzhCQUVjLEtBQUMsZ0JBQWdCLEtBQUMseUJBQXFCLEVBQUUsS0FBRyxHQUFHLE9BQXhELGFBQUc7OztxQkFFUjs4QkFFYyxLQUFDLGlCQUFpQixHQUFHLE1BQTlCLFlBQUU7OytCQUNPLEtBQUMsaUJBQWlCLElBQUUsRUFBRSxLQUEvQixjQUFHOztvQkFDSixhQUFjLEdBQUcsS0FBQyxZQUFZOztxQkFFbEM7cUJBQUs7K0JBRVMs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/sheet.kode
