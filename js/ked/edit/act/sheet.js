var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var pageKeys

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import layout from "../../popo/layout.js"
import projector from "../../popo/projector.js"

import sue from "../tool/sue.js"
import belt from "../tool/belt.js"

import mode from "../mode.js"

pageKeys = ['up','down','left','right','alt+left','alt+right','pageup','pagedown','home','end','ctrl+h','ctrl+j','cmd+up','cmd+down','ctrl+up','ctrl+down','cmd+z','ctrl+z','shift+cmd+z','cmd+y','ctrl+y']
export default {
    feedSheetKey:function (key, event)
    {
        var done
    
        if (_k_.in(key,pageKeys))
        {
            return this.feedKey(key,event)
        }
        if (done = this.inSheetNode(function (st)
            {
                return st.feedKey(key,event)
            }))
        {
            return done.result
        }
        return this.feedKey(key,event)
    },
    sheetHome:function ()
    {
        var cell, cells, left, m, node, pos, _38_73_, _45_21_, _46_56_, _50_21_
    
        if (m = this.sheetMirror)
        {
            if (m.cursors === this.s.cursors && (layout.pathOf(this.rectree,m.node) != null))
            {
                return {node:m.node}
            }
        }
        cells = this.sheetSize()
        cell = this.sheetCellForPos(this.mainCursor())
        node = layout.nodeForPos(cells,this.rectree,cell)
        if (((node != null ? node.text : undefined) != null))
        {
            return {node:node,pos:(((_46_56_=projector.posAt(node,cell)) != null ? _46_56_ : projector.endOf(node)))}
        }
        left = layout.nodeForPos(cells,this.rectree,[cell[0] - 1,cell[1]])
        if (((left != null ? left.text : undefined) != null))
        {
            pos = projector.posAt(left,[cell[0] - 1,cell[1]])
            if ((pos != null) && pos[0] + 1 === left.state.s.lines[pos[1]].length)
            {
                return {node:left,pos:[pos[0] + 1,pos[1]]}
            }
        }
        return null
    },
    inSheetNode:function (fn)
    {
        var before, home, result, st, _62_30_, _69_44_
    
        if (!(this.rectree != null))
        {
            return null
        }
        home = this.sheetHome()
        if (!(home != null))
        {
            return null
        }
        st = home.node.state
        if ((home.pos != null))
        {
            st.setCursors([home.pos])
        }
        before = st.s
        result = fn(st)
        this.commitSheetNode(home.node,before)
        return {result:result}
    },
    commitSheetNode:function (node, before)
    {
        var cells, changed, scale, st, _87_68_, _87_84_
    
        st = node.state
        changed = st.s.lines !== before.lines
        if (changed && before.lines.length === 1 && st.s.lines.length === 1)
        {
            scale = projector.scaleOf(node)
            if (_k_.isNum(node.w) && parseInt(node.h) === scale && !(node.r != null) && !(node.b != null))
            {
                if (node.w === (kseg.width(before.lines[0]) + 1) * scale)
                {
                    node.w = (kseg.width(st.s.lines[0]) + 1) * scale
                }
            }
        }
        cells = this.sheetSize()
        layout.regionize(cells,this.rectree)
        projector.attach(this.rectree)
        projector.scrollToCursor(node)
        this.renderSheet(this.rectree,cells,projector.cellOf(node,st.mainCursor()),{history:changed})
        return this.sheetMirror = {node:node,cursors:this.s.cursors}
    },
    sheetSelections:function ()
    {
        var out, walk, _126_33_
    
        out = []
        walk = (function (node)
        {
            var cell, child, li, prev, px, py, rng, st, x, _123_39_
    
            st = node.state
            if ((st != null) && !_k_.empty(st.s.selections))
            {
                var list = _k_.list(belt.splitLineRanges(st.s.lines,st.s.selections,false))
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    rng = list[_a_]
                    li = rng[1]
                    for (x = rng[0]; x < _k_.min(rng[2],st.s.lines[li].length); x++)
                    {
                        if (!(cell = projector.cellOf(node,[x,li])))
                        {
                            continue
                        }
                        ;[px,py] = this.sheetPosForCell(cell)
                        prev = out.slice(-1)[0]
                        if ((prev != null) && prev[1] === py && prev[2] === px)
                        {
                            prev[2] = px + 1
                        }
                        else
                        {
                            out.push([px,py,px + 1,py])
                        }
                    }
                }
            }
            var list1 = ((_123_39_=node.children) != null ? _123_39_ : [])
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                child = list1[_b_]
                walk(child)
            }
        }).bind(this)
        if ((this.rectree != null))
        {
            walk(this.rectree)
        }
        return out
    },
    insertIntoSheet:function (text)
    {
        var cell, cells, node, _145_82_
    
        if (this.inSheetNode(function (st)
            {
                return st.insert(text)
            }))
        {
            return true
        }
        cells = this.sheetSize()
        cell = this.sheetCellForPos(this.mainCursor())
        node = layout.addTextNode(cells,this.rectree,cell,text)
        if (!(node != null))
        {
            return false
        }
        layout.regionize(cells,this.rectree)
        projector.attach(this.rectree)
        this.renderSheet(this.rectree,cells,(((_145_82_=projector.cellOf(node,projector.endOf(node))) != null ? _145_82_ : cell)))
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
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                run = list[_c_]
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
        var _256_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, node, old, pos, scale, _262_25_, _270_27_, _277_41_, _290_64_
    
        if (!(this.rectree != null))
        {
            return
        }
        cells = this.sheetSize()
        layout.absolutize(cells,this.rectree)
        cell = this.sheetCellForPos(this.mainCursor())
        node = layout.topmostIn(this.rectree,cell)
        if (!((node != null ? node.text : undefined) != null))
        {
            return
        }
        old = layout.scaleOf(node)
        scale = (delta === 0 ? 1 : _k_.clamp(1,7,old + delta))
        if (scale === old)
        {
            return
        }
        pos = ((_277_41_=projector.posAt(node,cell)) != null ? _277_41_ : projector.endOf(node))
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
        projector.attach(this.rectree)
        this.renderSheet(this.rectree,cells,(((_290_64_=projector.cellOf(node,pos)) != null ? _290_64_ : cell)))
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
        var cell, cells, _304_25_, _310_49_
    
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
        var cells, _320_25_
    
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
        var cells, _336_25_
    
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
    setSheetTree:function (rectree)
    {
        this.rectree = layout.pageOf(rectree)
        delete this.sheetMirror
        this.s = this.s.set('rectree',layout.plainNode(this.rectree))
        return this
    },
    clearSheet:function ()
    {
        delete this.rectree
        delete this.sheetMirror
        this.s = this.s.set('rectree',null)
        return this
    },
    restoreSheet:function ()
    {
        var cell, _369_41_
    
        if (!(this.s.rectree != null))
        {
            return this.clearSheet()
        }
        cell = this.sheetCellForPos(this.mainCursor())
        this.rectree = layout.liveNode(this.s.rectree)
        delete this.sheetMirror
        return this.renderSheet(this.rectree,this.sheetSize(),cell,{history:false,silent:true})
    },
    fitSheet:function ()
    {
        var _381_25_
    
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
        var _389_25_
    
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
        this.rectree = rectree
        this.s = this.s.set('sue',data.sue)
        this.s = this.s.set('rectree',layout.plainNode(rectree))
        if ((mc != null))
        {
            pos = this.sheetPosForCell(mc)
            this.s = this.s.set('cursors',[pos])
            this.s = this.s.set('main',0)
        }
        this.s = this.s.set('selections',this.sheetSelections())
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _443_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _472_25_
    
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
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxhQUFUO09BQWdCLGdCQUFoQjs7T0FDUyxVQUFaO09BQWdCLFdBQWhCOztPQUNZLFdBQUE7O0FBTW5CLFlBQ0ksS0FBSyxPQUFPLE9BQU8sUUFBUSxXQUFXLFlBQ3RDLFNBQVMsV0FBVyxPQUFPLE1BQU0sU0FBUyxTQUMxQyxTQUFTLFdBQVcsVUFBVSxZQUM5QixRQUFRLFNBQVMsY0FBYyxRQUFROztJQU12Qyx1QkFBZSxLQUFJOzs7O21CQUVVLElBQU87O21CQUE5QixLQUFDLFFBQVEsSUFBSTs7WUFFWixPQUFPLEtBQUMsc0JBQWE7O3VCQUFPLEdBQUcsUUFBUSxJQUFJOzs7bUJBQ3hDLEtBQUs7O2VBRVgsS0FBQyxRQUFRLElBQUk7O0lBT2pCOzs7O1lBRU8sSUFBSSxLQUFDOztnQkFDRCxFQUFFLFlBQVcsS0FBQyxFQUFFLFlBQVksT0FBTyxPQUFPLEtBQUMsUUFBUSxFQUFFOzt3QkFDbEQsS0FBSyxFQUFFOzs7UUFFakIsUUFBUSxLQUFDO1FBQ1QsT0FBUSxLQUFDLGdCQUFnQixLQUFDO1FBQzFCLE9BQVEsT0FBTyxXQUFXLE1BQU0sS0FBQyxRQUFRO2NBRXRDLGVBQUEsS0FBTTs7b0JBQ0gsS0FBSyxLQUFLLGVBQUssVUFBVSxNQUFNLEtBQUssMkJBQVEsVUFBVSxNQUFNOztRQUVsRSxPQUFPLE9BQU8sV0FBVyxNQUFNLEtBQUMsU0FBUyxLQUFLLEtBQUcsRUFBRSxLQUFLO2NBRXJELGVBQUEsS0FBTTs7WUFDTCxNQUFNLFVBQVUsTUFBTSxNQUFNLEtBQUssS0FBRyxFQUFFLEtBQUs7aUJBQ3hDLGdCQUFTLElBQUksS0FBRyxNQUFLLEtBQUssTUFBTSxFQUFFLE1BQU0sSUFBSSxJQUFJOzt3QkFDN0MsS0FBSyxLQUFLLEtBQUssSUFBSSxLQUFHLEVBQUUsSUFBSTs7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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
