var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var highlightKeys, historyKeys, pageKeys

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import layout from "../../popo/layout.js"
import projector from "../../popo/projector.js"

import sue from "../tool/sue.js"
import belt from "../tool/belt.js"

import mode from "../mode.js"

historyKeys = ['cmd+z','ctrl+z','shift+cmd+z','cmd+y','ctrl+y']
pageKeys = historyKeys.concat(['up','down','left','right','alt+left','alt+right','pageup','pagedown','home','end','ctrl+h','ctrl+j'])
highlightKeys = ['alt+cmd+d','alt+ctrl+d']
export default {
    feedSheetKey:function (key, event)
    {
        var done, highlighted, _32_41_, _38_42_
    
        if ((this.sheetMulti != null) && this.sheetMulti.cursors !== this.s.cursors)
        {
            delete this.sheetMulti
        }
        if (_k_.in(key,((this.sheetMulti ? historyKeys : pageKeys))))
        {
            return this.feedKey(key,event)
        }
        if (key === 'esc' && this.sheetMulti)
        {
            return this.leaveSheetMulti()
        }
        highlighted = !_k_.empty((this.sheetActive() != null ? this.sheetActive().state.s.highlights : undefined))
        if (done = this.inSheetNode(function (st)
            {
                return st.feedKey(key,event)
            }))
        {
            if (_k_.in(key,highlightKeys))
            {
                this.spreadHighlights(highlighted)
            }
            return done.result
        }
        return this.feedKey(key,event)
    },
    sheetActive:function ()
    {
        var _49_31_, _49_40_, _49_54_
    
        return ((_49_40_=(this.sheetMulti != null ? this.sheetMulti.active : undefined)) != null ? _49_40_ : (this.sheetHome() != null ? this.sheetHome().node : undefined))
    },
    leaveSheetMulti:function ()
    {
        var active, node
    
        active = this.sheetMulti.active
        var list = _k_.list(this.sheetMulti.nodes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            node = list[_a_]
            if (node.state.hasCursorsHighlightsOrSelections())
            {
                node.state.clearCursorsHighlightsAndSelections()
            }
        }
        delete this.sheetMulti
        this.commitSheetNodes(active,[active],[active.state.s])
        return 'handled'
    },
    spreadHighlights:function (highlighted)
    {
        var active, all, ast, nodes, span, text, walk
    
        active = this.sheetActive()
        if (!(active != null))
        {
            return
        }
        ast = active.state
        span = ast.s.highlights[0]
        text = ((span != null) ? kseg.str(ast.s.lines[span[1]].slice(span[0],span[2])) : null)
        all = highlighted && !_k_.empty(ast.s.selections)
        nodes = [active]
        walk = (function (node)
        {
            var child, st, _80_25_, _87_39_
    
            if ((node.state != null) && node !== active)
            {
                st = node.state
                ;(text != null) ? st.highlightText(text) : st.clearHighlights()
                if (all && !_k_.empty(st.s.highlights))
                {
                    st.setCursors([belt.endOfSpan(st.s.highlights[0])])
                    st.selectAllHighlights()
                    nodes.push(node)
                }
            }
            var list = ((_87_39_=node.children) != null ? _87_39_ : [])
            for (var _b_ = 0; _b_ < list.length; _b_++)
            {
                child = list[_b_]
                walk(child)
            }
        }).bind(this)
        walk(this.rectree)
        if (all)
        {
            this.sheetMulti = {active:active,nodes:nodes}
        }
        return this.commitSheetNodes(active,nodes,nodes.map(function (n)
        {
            return n.state.s
        }))
    },
    sheetHome:function ()
    {
        var cell, cells, left, m, node, pos, _105_73_, _112_21_, _113_56_, _117_21_
    
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
            return {node:node,pos:(((_113_56_=projector.posAt(node,cell)) != null ? _113_56_ : projector.endOf(node)))}
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
        var active, befores, home, node, nodes, r, result, _129_30_, _139_58_
    
        if (!(this.rectree != null))
        {
            return null
        }
        if (this.sheetMulti)
        {
            active = this.sheetMulti.active
            nodes = this.sheetMulti.nodes
        }
        else
        {
            home = this.sheetHome()
            if (!(home != null))
            {
                return null
            }
            active = home.node
            nodes = [active]
            if ((home.pos != null))
            {
                active.state.setCursors([home.pos])
            }
        }
        befores = nodes.map(function (node)
        {
            return node.state.s
        })
        result = null
        var list = _k_.list(nodes)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            node = list[_c_]
            r = fn(node.state)
            if (node === active)
            {
                result = r
            }
        }
        this.commitSheetNodes(active,nodes,befores)
        return {result:result}
    },
    commitSheetNodes:function (active, nodes, befores)
    {
        var cells, changed, i, node
    
        changed = false
        var list = _k_.list(nodes)
        for (i = 0; i < list.length; i++)
        {
            node = list[i]
            if (node.state.s.lines !== befores[i].lines)
            {
                changed = true
                this.fitTextNode(node,befores[i])
            }
        }
        if (this.sheetMulti)
        {
            if (nodes.length === 1 && active.state.s.cursors.length === 1)
            {
                delete this.sheetMulti
            }
        }
        else if (active.state.s.cursors.length > 1)
        {
            this.sheetMulti = {active:active,nodes:[active]}
        }
        cells = this.sheetSize()
        layout.regionize(cells,this.rectree)
        projector.attach(this.rectree)
        projector.scrollToCursor(active)
        this.renderSheet(this.rectree,cells,projector.cellOf(active,active.state.mainCursor()),{history:changed})
        this.sheetMirror = {node:active,cursors:this.s.cursors}
        if (this.sheetMulti)
        {
            return this.sheetMulti.cursors = this.s.cursors
        }
    },
    fitTextNode:function (node, before)
    {
        var scale, st, _191_64_, _191_80_
    
        st = node.state
        if (before.lines.length !== 1 || st.s.lines.length !== 1)
        {
            return
        }
        scale = projector.scaleOf(node)
        if (_k_.isNum(node.w) && parseInt(node.h) === scale && !(node.r != null) && !(node.b != null))
        {
            if (node.w === (kseg.width(before.lines[0]) + 1) * scale)
            {
                return node.w = (kseg.width(st.s.lines[0]) + 1) * scale
            }
        }
    },
    sheetRangesOf:function (node, pieces)
    {
        var cell, li, lines, out, prev, px, py, x, x1, x2
    
        out = []
        lines = node.state.s.lines
        var list = _k_.list(pieces)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            x1 = list[_e_][0]
            li = list[_e_][1]
            x2 = list[_e_][2]
            for (x = x1; x < _k_.min(x2,lines[li].length); x++)
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
        return out
    },
    sheetTextNodes:function ()
    {
        var out, walk, _221_33_
    
        out = []
        walk = function (node)
        {
            var child, _218_39_, _219_39_
    
            if ((node.state != null))
            {
                out.push(node)
            }
            var list = ((_219_39_=node.children) != null ? _219_39_ : [])
            for (var _f_ = 0; _f_ < list.length; _f_++)
            {
                child = list[_f_]
                walk(child)
            }
        }
        if ((this.rectree != null))
        {
            walk(this.rectree)
        }
        return out
    },
    sheetSelections:function ()
    {
        var node, out, pieces, st
    
        out = []
        var list = _k_.list(this.sheetTextNodes())
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            node = list[_10_]
            st = node.state
            if (_k_.empty(st.s.selections))
            {
                continue
            }
            pieces = belt.splitLineRanges(st.s.lines,st.s.selections,false).map(function (r)
            {
                return [r[0],r[1],r[2]]
            })
            out = out.concat(this.sheetRangesOf(node,pieces))
        }
        return out
    },
    sheetHighlights:function ()
    {
        var node, out, rng
    
        out = []
        var list = _k_.list(this.sheetTextNodes())
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            node = list[_11_]
            if (_k_.empty(node.state.s.highlights))
            {
                continue
            }
            var list1 = _k_.list(this.sheetRangesOf(node,node.state.s.highlights))
            for (var _12_ = 0; _12_ < list1.length; _12_++)
            {
                rng = list1[_12_]
                out.push([rng[0],rng[1],rng[2]])
            }
        }
        return out
    },
    sheetCursors:function ()
    {
        var c, cell, cursors, i, main, node, pos, st
    
        cursors = []
        main = null
        var list = _k_.list(this.sheetMulti.nodes)
        for (var _13_ = 0; _13_ < list.length; _13_++)
        {
            node = list[_13_]
            st = node.state
            var list1 = _k_.list(st.s.cursors)
            for (i = 0; i < list1.length; i++)
            {
                c = list1[i]
                if (!(cell = projector.cellOf(node,c)))
                {
                    continue
                }
                pos = this.sheetPosForCell(cell)
                cursors.push(pos)
                if (node === this.sheetMulti.active && i === st.s.main)
                {
                    main = pos
                }
            }
        }
        return [belt.normalizePositions(cursors,this.s.lines.length - 1),main]
    },
    insertIntoSheet:function (text)
    {
        var cell, cells, node, _277_82_
    
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
        this.renderSheet(this.rectree,cells,(((_277_82_=projector.cellOf(node,projector.endOf(node))) != null ? _277_82_ : cell)))
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
            for (var _15_ = 0; _15_ < list.length; _15_++)
            {
                run = list[_15_]
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
        var _388_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, node, old, pos, scale, _394_25_, _402_27_, _409_41_, _422_64_
    
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
        pos = ((_409_41_=projector.posAt(node,cell)) != null ? _409_41_ : projector.endOf(node))
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
        this.renderSheet(this.rectree,cells,(((_422_64_=projector.cellOf(node,pos)) != null ? _422_64_ : cell)))
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
        var cell, cells, _436_25_, _442_49_
    
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
        var cells, _452_25_
    
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
        var cells, _468_25_
    
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
        delete this.sheetMulti
        this.s = this.s.set('rectree',layout.plainNode(this.rectree))
        return this
    },
    clearSheet:function ()
    {
        delete this.rectree
        delete this.sheetMirror
        delete this.sheetMulti
        this.s = this.s.set('rectree',null)
        return this
    },
    restoreSheet:function ()
    {
        var cell, _503_41_
    
        if (!(this.s.rectree != null))
        {
            return this.clearSheet()
        }
        cell = this.sheetCellForPos(this.mainCursor())
        this.rectree = layout.liveNode(this.s.rectree)
        delete this.sheetMirror
        delete this.sheetMulti
        return this.renderSheet(this.rectree,this.sheetSize(),cell,{history:false,silent:true})
    },
    fitSheet:function ()
    {
        var _516_25_
    
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
        var _524_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return this.renderSheet(this.rectree,this.sheetSize(),this.sheetCellForPos(this.mainCursor()),{silent:true})
    },
    renderSheet:function (rectree, cells, mc, opt)
    {
        var cursors, data, lines, main, pos
    
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
        if (this.sheetMulti)
        {
            ;[cursors,main] = this.sheetCursors()
            if (!_k_.empty(cursors))
            {
                this.s = this.s.set('cursors',cursors)
                this.s = this.s.set('main',_k_.max(0,belt.indexOfPosInPositions(main,cursors)))
            }
        }
        this.s = this.s.set('selections',this.sheetSelections())
        this.s = this.s.set('highlights',this.sheetHighlights())
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _585_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _614_25_
    
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxhQUFUO09BQWdCLGdCQUFoQjs7T0FDUyxVQUFaO09BQWdCLFdBQWhCOztPQUNZLFdBQUE7O0FBTW5CLGVBQWUsUUFBUSxTQUFTLGNBQWMsUUFBUTtBQUV0RCxXQUFXLFlBQVksUUFDbkIsS0FBSyxPQUFPLE9BQU8sUUFBUSxXQUFXLFlBQ3RDLFNBQVMsV0FBVyxPQUFPLE1BQU0sU0FBUztBQUs5QyxpQkFBaUIsWUFBWTs7SUFVekIsdUJBQWUsS0FBSTs7OzthQUVPLEtBQUMsdUJBQWdCLEtBQUMsV0FBVyxZQUFXLEtBQUMsRUFBRTs7bUJBQTFELEtBQUM7O21CQUVpQixNQUFRLEtBQUMsYUFBYSxjQUFjOzttQkFBM0QsS0FBQyxRQUFRLElBQUk7O1lBRVMsUUFBTyxTQUFVLEtBQUM7O21CQUF4QyxLQUFDOztRQUVILDBCQUFvQixLQUFDLHdCQUFELEtBQUMsY0FBZSxNQUFNLEVBQUU7WUFFekMsT0FBTyxLQUFDLHNCQUFhOzt1QkFBTyxHQUFHLFFBQVEsSUFBSTs7O3VCQUNULElBQU87O2dCQUF4QyxLQUFDLGlCQUFpQjs7bUJBQ2hCLEtBQUs7O2VBRVgsS0FBQyxRQUFRLElBQUk7O0lBS2pCOzs7OzBCQUFnQixLQUFDLHFCQUFELEtBQUMsV0FBWSwwQ0FBUyxLQUFDLHNCQUFELEtBQUMsWUFBYTs7SUFFcEQ7Ozs7UUFFSSxTQUFTLEtBQUMsV0FBVzs0QkFFVCxLQUFDLFdBQVc7OztZQUFwQjtnQkFDb0QsS0FBSyxNQUFNOztnQkFBL0QsS0FBSyxNQUFNOzs7ZUFFUixLQUFDO1FBRVIsS0FBQyxpQkFBaUIsUUFBUSxTQUFTLE9BQU8sTUFBTTtlQUVoRDs7SUFLSiwyQkFBa0I7Ozs7UUFFZCxTQUFTLEtBQUM7Y0FFRDs7OztRQUVULE1BQU8sT0FBTztRQUNkLE9BQU8sSUFB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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
