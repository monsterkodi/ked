var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var highlightKeys, historyKeys, novimCombos, novimMotions, novimOnPage, novimParts, pageKeys

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
novimCombos = ['ctrl+v','ctrl+o','ctrl+i']
novimMotions = ['h','j','k','l','left','right','up','down']
novimParts = ['count','operator','area','prefix','register','registerPending','macroPending','find','replace']
novimOnPage = ['move','undo','searchNext','searchPrev','searchWord','matchBracket']
export default {
    feedSheetKey:function (key, event)
    {
        var done, highlighted, node, nv, result, _40_41_, _53_42_
    
        if ((this.sheetMulti != null) && this.sheetMulti.cursors !== this.s.cursors)
        {
            delete this.sheetMulti
        }
        if (key === 'esc' && this.sheetMulti)
        {
            this.recordMacroKey(key,event)
            var list = _k_.list(this.sheetMulti.nodes)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                node = list[_a_]
                node.state.finishNovimInsert()
            }
            return this.leaveSheetMulti()
        }
        if (nv = mode.get(this,'novim'))
        {
            result = this.feedSheetNovim(nv,key,event)
            if (result !== 'unhandled')
            {
                return result
            }
        }
        if (_k_.in(key,((this.sheetMulti ? historyKeys : pageKeys))))
        {
            return this.feedKey(key,event)
        }
        highlighted = !_k_.empty((this.sheetActive() != null ? this.sheetActive().state.s.highlights : undefined))
        if (done = this.inSheetNode(function (st)
            {
                return st.feedKey(key,event)
            }))
        {
            this.recordMacroKey(key,event)
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
        var _65_31_, _65_40_, _65_54_
    
        return ((_65_40_=(this.sheetMulti != null ? this.sheetMulti.active : undefined)) != null ? _65_40_ : (this.sheetHome() != null ? this.sheetHome().node : undefined))
    },
    feedSheetNovim:function (nv, key, event)
    {
        var combo, done, feeding, home, job, jobs, k, parts, prev, _104_44_, _109_21_, _74_29_
    
        combo = ((_74_29_=(event != null ? event.combo : undefined)) != null ? _74_29_ : key)
        if (!(_k_.in(combo,novimCombos)))
        {
            if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
            {
                return 'unhandled'
            }
        }
        if (!this.sheetMulti)
        {
            home = this.sheetHome()
            if (!(home != null) || (_k_.in(combo,novimMotions) && !this.novimPending(nv,home.node.state)))
            {
                return this.feedKey(key,event)
            }
        }
        parts = {}
        var list = _k_.list(novimParts)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            k = list[_b_]
            parts[k] = nv[k]
        }
        prev = nv.state
        feeding = this.novimFeeding
        this.novimFeeding = true
        try
        {
            done = this.inSheetNode((function (st)
            {
                var list1 = _k_.list(novimParts)
                for (var _c_ = 0; _c_ < list1.length; _c_++)
                {
                    k = list1[_c_]
                    nv[k] = parts[k]
                }
                nv.state = st
                try
                {
                    return nv.handleKey(key,event)
                }
                finally
                {
                    return nv.state = prev
                }
            }).bind(this))
        }
        finally
        {
            this.novimFeeding = feeding
        }
        if ((done != null))
        {
            this.recordMacroKey(key,event)
        }
        if (!this.novimFeeding && (this.novimAfter != null))
        {
            jobs = this.novimAfter
            delete this.novimAfter
            var list1 = _k_.list(jobs)
            for (var _d_ = 0; _d_ < list1.length; _d_++)
            {
                job = list1[_d_]
                job()
            }
        }
        return ((_109_21_=(done != null ? done.result : undefined)) != null ? _109_21_ : 'unhandled')
    },
    novimLater:function (fn)
    {
        var _118_20_
    
        if (!this.novimFeeding)
        {
            return false
        }
        this.novimAfter = ((_118_20_=this.novimAfter) != null ? _118_20_ : [])
        this.novimAfter.push(fn)
        return true
    },
    novimPending:function (nv, st)
    {
        var k
    
        if (st.novim.visual)
        {
            return true
        }
        var list = _k_.list(novimParts)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            k = list[_e_]
            if (k === 'count')
            {
                continue
            }
            if (nv[k])
            {
                return true
            }
        }
        return false
    },
    novimFromNode:function (action)
    {
        if (action !== 'stop')
        {
            this.finishNovimInsert()
        }
        switch (action)
        {
            case 'start':
                return this.startMode('novim')
    
            case 'stop':
                return this.stopMode('novim')
    
            case 'toggle':
                return this.toggleMode('novim')
    
        }
    
    },
    sheetJump:function (x, y, name)
    {
        var node
    
        node = null
        if ((name != null))
        {
            node = this.sheetTextNodes().find(function (n)
            {
                return n.state.name === name
            })
            if (!(node != null))
            {
                return false
            }
        }
        if (this.novimLater((function ()
            {
                return this.sheetJump(x,y,name)
            }).bind(this)))
        {
            return true
        }
        this.sheetClear()
        if ((node != null))
        {
            this.inTextNode(node,function (st)
            {
                return st.setCursors([[x,y]])
            })
        }
        else
        {
            this.setMainCursor(x,y)
            this.compositeSheet(null)
        }
        return true
    },
    pruneSheetJumps:function ()
    {
        var live
    
        live = new Set(this.sheetTextNodes().map(function (node)
        {
            return node.state.name
        }))
        this.novim.jumps.retain(function (e)
        {
            var _171_47_
    
            return !(e.node != null) || live.has(e.node)
        })
        return this.novim.changes.retain(function (e)
        {
            return !(e[2] != null) || live.has(e[2])
        })
    },
    shareSheetNovim:function (st)
    {
        var k
    
        if (st.novim.page === this)
        {
            return
        }
        var list = ['register','jumps','changes','macroReplaying','macroLastRegister','macroSkipKey']
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            k = list[_f_]
            this.sharePart(st.novim,this.novim,k)
        }
        Object.defineProperty(st.novim,'page',{value:this,configurable:true})
        return Object.defineProperty(st,'macroRecording',{get:((function ()
        {
            return this.macroRecording
        }).bind(this)),configurable:true})
    },
    sharePart:function (obj, src, k)
    {
        return Object.defineProperty(obj,k,{get:function ()
        {
            return src[k]
        },set:function (v)
        {
            return src[k] = v
        },configurable:true,enumerable:true})
    },
    sheetNovim:function (cmd)
    {
        var pos
    
        if (_k_.in(cmd.operator,novimOnPage))
        {
            return false
        }
        switch (cmd.operator)
        {
            case 'openLine':
                pos = this.sheetPosInDirection(this.mainCursor(),((cmd.after ? 'down' : 'up')))
                this.setMainCursor(pos[0],pos[1])
                this.startNovimInsert({kind:'insert'})
                break
            case 'insertAtIndent':
                this.startNovimInsert({kind:'insert'})
                break
        }
    
        return true
    },
    leaveSheetMulti:function ()
    {
        var active, node
    
        active = this.sheetMulti.active
        var list = _k_.list(this.sheetMulti.nodes)
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            node = list[_10_]
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
            var child, st, _241_25_, _248_39_
    
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
            var list = ((_248_39_=node.children) != null ? _248_39_ : [])
            for (var _11_ = 0; _11_ < list.length; _11_++)
            {
                child = list[_11_]
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
        var m, _266_73_
    
        if (m = this.sheetMirror)
        {
            if (m.cursors === this.s.cursors && (layout.pathOf(this.rectree,m.node) != null))
            {
                return {node:m.node}
            }
        }
        return this.sheetNodeAt(this.sheetCellForPos(this.mainCursor()))
    },
    sheetNodeAt:function (cell)
    {
        var cells, left, node, pos, _278_21_, _279_56_, _283_21_
    
        cells = this.sheetSize()
        node = layout.nodeForPos(cells,this.rectree,cell)
        if (((node != null ? node.text : undefined) != null))
        {
            return {node:node,pos:(((_279_56_=projector.posAt(node,cell)) != null ? _279_56_ : projector.endOf(node)))}
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
    sheetMouse:function (type, pos, event)
    {
        var count, d, hit, to, _304_36_, _308_83_
    
        if (event.cmd || event.ctrl)
        {
            return false
        }
        hit = this.sheetNodeAt(this.sheetCellForPos(pos))
        switch (type)
        {
            case 'press':
                count = ((_304_36_=event.count) != null ? _304_36_ : 1)
                if (count === 1 && event.alt && (hit != null))
                {
                    return this.sheetAddCursor(hit)
                }
                if (count === 1 && event.shift && (hit != null) && hit.node === (this.sheetHome() != null ? this.sheetHome().node : undefined) && !this.sheetMulti)
                {
                    this.inSheetNode(function (st)
                    {
                        return st.setMainCursorAndSelect(hit.pos[0],hit.pos[1])
                    })
                    return true
                }
                this.sheetClear()
                if (!(hit != null))
                {
                    this.setMainCursor(pos[0],pos[1])
                    this.compositeSheet(null)
                    return true
                }
                this.inTextNode(hit.node,function (st)
                {
                    st.setCursors([hit.pos])
                    if (count === 2)
                    {
                        st.selectWord(hit.pos[0],hit.pos[1])
                        return st.highlightSelection()
                    }
                    else if (count > 2)
                    {
                        return st.selectLine(hit.pos[1])
                    }
                })
                if (count === 1)
                {
                    this.sheetDrag = {node:hit.node,pos:hit.pos}
                }
                break
            case 'drag':
                if (d = this.sheetDrag)
                {
                    if (to = projector.posAt(d.node,this.sheetCellForPos(pos)))
                    {
                        this.inTextNode(d.node,function (st)
                        {
                            return st.select(d.pos,to)
                        })
                    }
                }
                break
            case 'release':
                delete this.sheetDrag
                break
        }
    
        return true
    },
    sheetClear:function ()
    {
        var node, st
    
        delete this.sheetMulti
        var list = _k_.list(this.sheetTextNodes())
        for (var _12_ = 0; _12_ < list.length; _12_++)
        {
            node = list[_12_]
            st = node.state
            if (st.hasCursorsHighlightsOrSelections())
            {
                st.clearCursors()
                st.clearHighlights()
                st.deselect()
            }
        }
    },
    sheetAddCursor:function (hit)
    {
        var active, befores, home, joins, nodes, _365_59_
    
        active = this.sheetActive()
        if (this.sheetMulti)
        {
            nodes = this.sheetMulti.nodes.slice()
        }
        else if ((active != null))
        {
            home = this.sheetHome()
            if (((home != null ? home.pos : undefined) != null))
            {
                active.state.setCursors([home.pos])
            }
            nodes = [active]
        }
        else
        {
            nodes = []
        }
        joins = !(_k_.in(hit.node,nodes))
        if (joins)
        {
            nodes.push(hit.node)
        }
        befores = nodes.map(function (node)
        {
            return node.state.s
        })
        if (joins)
        {
            hit.node.state.setCursors([hit.pos])
        }
        else
        {
            hit.node.state.addCursor(hit.pos[0],hit.pos[1])
        }
        if ((active != null))
        {
            this.sheetMulti = {active:hit.node,nodes:nodes}
        }
        this.commitSheetNodes(hit.node,nodes,befores)
        return true
    },
    inTextNode:function (node, fn)
    {
        var before
    
        before = node.state.s
        this.syncSheetModes(node.state)
        fn(node.state)
        return this.commitSheetNodes(node,[node],[before])
    },
    syncSheetModes:function (st)
    {
        var key, live, name
    
        st.sheetPage = this
        st.allowedModes = this.allowedModes
        this.shareSheetNovim(st)
        var list = ['brckts','unype']
        for (var _13_ = 0; _13_ < list.length; _13_++)
        {
            name = list[_13_]
            if (!(mode.modes[name] != null))
            {
                continue
            }
            if (mode.isActive(this,name) && !mode.isActive(st,name))
            {
                mode.start(st,name)
            }
            else if (mode.isActive(st,name) && !mode.isActive(this,name))
            {
                mode.stop(st,name)
            }
        }
        live = new Set(this.sheetTextNodes().map(function (node)
        {
            return node.state.name
        }))
        var list1 = _k_.list(Object.keys(mode.active))
        for (var _14_ = 0; _14_ < list1.length; _14_++)
        {
            key = list1[_14_]
            if (key.startsWith('popo_node') && !live.has(key))
            {
                delete mode.active[key]
            }
        }
    },
    sheetResetViews:function (nodes)
    {
        var node, reset, st
    
        reset = false
        var list = (nodes != null ? nodes : this.sheetTextNodes())
        for (var _15_ = 0; _15_ < list.length; _15_++)
        {
            node = list[_15_]
            st = node.state
            if (!(st != null))
            {
                continue
            }
            if (st.s.view[1] !== 0 || st.s.scrollOffset !== 0)
            {
                st.setView([0,0],0)
                reset = true
            }
        }
        return reset
    },
    sheetCursorsSet:function ()
    {
        var _438_25_
    
        if ((this.sheetHome() != null))
        {
            return
        }
        if (!this.sheetResetViews())
        {
            return
        }
        return this.renderSheet(this.rectree,this.sheetSize(),null,{history:false,silent:true})
    },
    inSheetNode:function (fn)
    {
        var active, befores, home, node, nodes, r, result, _448_30_, _458_58_
    
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
        for (var _16_ = 0; _16_ < list.length; _16_++)
        {
            node = list[_16_]
            this.syncSheetModes(node.state)
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
        var b, cells, changed, dirty, i, mc, node, rect, resized, st, y
    
        changed = false
        resized = false
        var list = _k_.list(nodes)
        for (i = 0; i < list.length; i++)
        {
            node = list[i]
            if (node.state.s.lines !== befores[i].lines)
            {
                changed = true
                if (this.fitTextNode(node,befores[i]))
                {
                    resized = true
                }
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
        if (changed)
        {
            layout.regionize(cells,this.rectree)
            projector.attach(this.rectree)
        }
        projector.scrollToCursor(active)
        dirty = []
        var list1 = _k_.list(nodes)
        for (i = 0; i < list1.length; i++)
        {
            node = list1[i]
            st = node.state
            b = befores[i]
            if (st.s.lines !== b.lines || st.s.view !== b.view || st.s.scrollOffset !== b.scrollOffset)
            {
                rect = node.rect.abs
                for (y = rect.y; y < rect.y + rect.h; y++)
                {
                    dirty.push(y)
                }
            }
        }
        if (!_k_.empty(dirty))
        {
            mc = projector.cellOf(active,active.state.mainCursor())
            this.renderSheet(this.rectree,cells,mc,{history:changed,dirty:((resized ? null : dirty))})
        }
        else
        {
            this.compositeSheet(active)
        }
        this.sheetMirror = {node:active,cursors:this.s.cursors}
        if (this.sheetMulti)
        {
            return this.sheetMulti.cursors = this.s.cursors
        }
    },
    compositeSheet:function (active)
    {
        var cell, cursors, main
    
        if (this.sheetMulti)
        {
            ;[cursors,main] = this.sheetCursors()
            main = _k_.max(0,belt.indexOfPosInPositions(main,cursors))
        }
        else if ((active != null) && (cell = projector.cellOf(active,active.state.mainCursor())))
        {
            cursors = [this.sheetPosForCell(cell)]
            main = 0
        }
        if (!_k_.empty(cursors))
        {
            this.s = this.s.set('cursors',cursors)
            this.s = this.s.set('main',main)
        }
        this.s = this.s.set('selections',this.sheetSelections())
        this.s = this.s.set('highlights',this.sheetHighlights())
        this.s = this.s.set('rectree',layout.plainNode(this.rectree))
        this.swapState()
        this.adjustViewForMainCursor()
        mode.cursorsSet(this)
        return this.emit('cursorsSet')
    },
    fitTextNode:function (node, before)
    {
        var scale, st, w, _559_64_, _559_80_
    
        st = node.state
        if (before.lines.length !== 1 || st.s.lines.length !== 1)
        {
            return false
        }
        scale = projector.scaleOf(node)
        if (_k_.isNum(node.w) && parseInt(node.h) === scale && !(node.r != null) && !(node.b != null))
        {
            if (node.w === (kseg.width(before.lines[0]) + 1) * scale)
            {
                w = (kseg.width(st.s.lines[0]) + 1) * scale
                if (w === node.w)
                {
                    return false
                }
                node.w = w
                return true
            }
        }
        return false
    },
    sheetRangesOf:function (node, pieces)
    {
        var cell, li, lines, out, prev, px, py, x, x1, x2
    
        out = []
        lines = node.state.s.lines
        var list = _k_.list(pieces)
        for (var _19_ = 0; _19_ < list.length; _19_++)
        {
            x1 = list[_19_][0]
            li = list[_19_][1]
            x2 = list[_19_][2]
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
        var out, walk, _594_33_
    
        out = []
        walk = function (node)
        {
            var child, _591_39_, _592_39_
    
            if ((node.state != null))
            {
                out.push(node)
            }
            var list = ((_592_39_=node.children) != null ? _592_39_ : [])
            for (var _1a_ = 0; _1a_ < list.length; _1a_++)
            {
                child = list[_1a_]
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
        for (var _1b_ = 0; _1b_ < list.length; _1b_++)
        {
            node = list[_1b_]
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
        for (var _1c_ = 0; _1c_ < list.length; _1c_++)
        {
            node = list[_1c_]
            if (_k_.empty(node.state.s.highlights))
            {
                continue
            }
            var list1 = _k_.list(this.sheetRangesOf(node,node.state.s.highlights))
            for (var _1d_ = 0; _1d_ < list1.length; _1d_++)
            {
                rng = list1[_1d_]
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
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            node = list[_1e_]
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
        var cell, cells, node, _650_82_
    
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
        this.renderSheet(this.rectree,cells,(((_650_82_=projector.cellOf(node,projector.endOf(node))) != null ? _650_82_ : cell)))
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
            for (var _20_ = 0; _20_ < list.length; _20_++)
            {
                run = list[_20_]
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
        var _761_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, mc, node, old, pos, rect, scale, _767_25_, _775_27_, _782_41_
    
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
        pos = ((_782_41_=projector.posAt(node,cell)) != null ? _782_41_ : projector.endOf(node))
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
        this.sheetResetViews([node])
        rect = node.rect.abs
        mc = projector.cellOf(node,pos)
        mc = (mc != null ? mc : [_k_.clamp(rect.x,_k_.max(rect.x,rect.x + rect.w - 1),cell[0]),_k_.clamp(rect.y,_k_.max(rect.y,rect.y + rect.h - 1),cell[1])])
        this.renderSheet(this.rectree,cells,mc)
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
        var cell, cells, _815_25_, _821_49_
    
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
        var cells, _831_25_
    
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
        var cells, _847_25_
    
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
        var cell, _882_41_
    
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
        var _895_25_
    
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
        var _903_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return this.renderSheet(this.rectree,this.sheetSize(),this.sheetCellForPos(this.mainCursor()),{silent:true})
    },
    renderSheet:function (rectree, cells, mc, opt)
    {
        var cursors, data, main, old, pos
    
        opt = (opt != null ? opt : {})
        data = layout.sheetData({cols:cells.cols,rows:cells.rows},rectree,opt.dirty)
        old = this.s.lines
        this.segls = data.text.split('\n').map(function (text, i)
        {
            return (((old[i] != null) && kseg.str(old[i]) === text) ? old[i] : kseg(text))
        })
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _967_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _996_25_
    
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
        this.sheetResetViews([moved])
        this.renderSheet(this.rectree,cells,[x,y])
        return moved
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxhQUFUO09BQWdCLGdCQUFoQjs7T0FDUyxVQUFaO09BQWdCLFdBQWhCOztPQUNZLFdBQUE7O0FBTW5CLGVBQWUsUUFBUSxTQUFTLGNBQWMsUUFBUTtBQUV0RCxXQUFXLFlBQVksUUFDbkIsS0FBSyxPQUFPLE9BQU8sUUFBUSxXQUFXLFlBQ3RDLFNBQVMsV0FBVyxPQUFPLE1BQU0sU0FBUztBQUs5QyxpQkFBaUIsWUFBWTtBQUs3QixlQUFnQixTQUFTLFNBQVM7QUFDbEMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxRQUFRLEtBQUs7QUFDcEQsY0FBZ0IsUUFBUSxXQUFXLE9BQU8sU0FBUyxXQUFXLGtCQUFrQixlQUFlLE9BQU87QUFDdEcsZUFBZ0IsT0FBTyxPQUFPLGFBQWEsYUFBYSxhQUFhOztJQVVqRSx1QkFBZSxLQUFJOzs7O2FBRU8sS0FBQyx1QkFBZ0IsS0FBQyxXQUFXLFlBQVcsS0FBQyxFQUFFOzttQkFBMUQsS0FBQzs7WUFFTCxRQUFPLFNBQVUsS0FBQzs7WUFDakIsS0FBQyxlQUFlLElBQUk7Z0NBQ3VCLEtBQUMsV0FBVzs7O2dCQUFwQjtnQkFBbkMsS0FBSyxNQUFNOzttQkFDVCxLQUFDOztZQUVKLEtBQUssS0FBSyxJQUFJLEtBQUU7O1lBQ2YsU0FBUyxLQUFDLGVBQWUsR0FBRyxJQUFJO2dCQUNwQixXQUFVOzt1QkFBcEI7OzttQkFFbUIsTUFBUSxLQUFDLGFBQWEsY0FBYzs7bUJBQTNELEtBQUMsUUFBUSxJQUFJOztRQUVmLDBCQUFvQixLQUFDLHdCQUFELEtBQUMsY0FBZSxNQUFNLEVBQUU7WUFFekMsT0FBTyxLQUFDLHNCQUFhOzt1QkFBTyxHQUFHLFFBQVEsSUFBSTs7O1lBQzFDLEtBQUMsZUFBZSxJQUFJO3VCQUNhLElBQU87O2dCQUF4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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
