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
novimOnPage = ['move','undo','matchBracket']
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
        var combo, done, feeding, handled, home, k, parts, prev, result, _74_29_
    
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
        result = 'unhandled'
        try
        {
            done = this.inSheetNode((function (st)
            {
                var r
    
                var list1 = _k_.list(novimParts)
                for (var _c_ = 0; _c_ < list1.length; _c_++)
                {
                    k = list1[_c_]
                    nv[k] = parts[k]
                }
                nv.state = st
                try
                {
                    r = nv.handleKey(key,event)
                    if (r !== 'unhandled')
                    {
                        return result = r
                    }
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
        handled = (done != null) && result !== 'unhandled'
        if (handled)
        {
            this.recordMacroKey(key,event)
        }
        this.runNovimLater()
        return (handled ? 'handled' : 'unhandled')
    },
    novimInNode:function (nv, fn, quiet)
    {
        var active, feeding, prev, result
    
        active = this.sheetActive()
        if (!(active != null))
        {
            if (quiet)
            {
                return true
            }
            post.emit('novim.error','not in a text node')
            return false
        }
        prev = nv.state
        feeding = this.novimFeeding
        this.novimFeeding = true
        result = null
        try
        {
            this.inTextNode(active,(function (st)
            {
                nv.state = st
                try
                {
                    return result = fn()
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
        this.runNovimLater()
        return result
    },
    runNovimLater:function ()
    {
        var job, jobs, _146_45_
    
        if (this.novimFeeding || !(this.novimAfter != null))
        {
            return
        }
        jobs = this.novimAfter
        delete this.novimAfter
        var list = _k_.list(jobs)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            job = list[_d_]
            job()
        }
    },
    novimLater:function (fn)
    {
        var _159_20_
    
        if (!this.novimFeeding)
        {
            return false
        }
        this.novimAfter = ((_159_20_=this.novimAfter) != null ? _159_20_ : [])
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
            var _212_47_
    
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
            var child, st, _282_25_, _289_39_
    
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
            var list = ((_289_39_=node.children) != null ? _289_39_ : [])
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
        var m, _307_73_
    
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
        var cells, left, node, pos, _319_21_, _320_56_, _324_21_
    
        cells = this.sheetSize()
        node = layout.nodeForPos(cells,this.rectree,cell)
        if (((node != null ? node.text : undefined) != null))
        {
            return {node:node,pos:(((_320_56_=projector.posAt(node,cell)) != null ? _320_56_ : projector.endOf(node)))}
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
        var count, d, hit, to, _345_36_, _349_83_
    
        if (event.cmd || event.ctrl)
        {
            return false
        }
        hit = this.sheetNodeAt(this.sheetCellForPos(pos))
        switch (type)
        {
            case 'press':
                count = ((_345_36_=event.count) != null ? _345_36_ : 1)
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
        var active, befores, home, joins, nodes, _406_59_
    
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
        var _479_25_
    
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
        var active, befores, home, node, nodes, r, result, _489_30_, _499_58_
    
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
        var scale, st, w, _600_64_, _600_80_
    
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
        var out, walk, _635_33_
    
        out = []
        walk = function (node)
        {
            var child, _632_39_, _633_39_
    
            if ((node.state != null))
            {
                out.push(node)
            }
            var list = ((_633_39_=node.children) != null ? _633_39_ : [])
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
        var cell, cells, node, _691_82_
    
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
        this.renderSheet(this.rectree,cells,(((_691_82_=projector.cellOf(node,projector.endOf(node))) != null ? _691_82_ : cell)))
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
        var _802_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, mc, node, old, pos, rect, scale, _808_25_, _816_27_, _823_41_
    
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
        pos = ((_823_41_=projector.posAt(node,cell)) != null ? _823_41_ : projector.endOf(node))
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
        var cell, cells, _856_25_, _862_49_
    
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
        var cells, _872_25_
    
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
        var cells, _888_25_
    
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
        var cell, _923_41_
    
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
        var _936_25_
    
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
        var _944_25_
    
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
        this.syntax.setOverlay(data.classes)
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _1009_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _1038_25_
    
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxhQUFUO09BQWdCLGdCQUFoQjs7T0FDUyxVQUFaO09BQWdCLFdBQWhCOztPQUNZLFdBQUE7O0FBTW5CLGVBQWUsUUFBUSxTQUFTLGNBQWMsUUFBUTtBQUV0RCxXQUFXLFlBQVksUUFDbkIsS0FBSyxPQUFPLE9BQU8sUUFBUSxXQUFXLFlBQ3RDLFNBQVMsV0FBVyxPQUFPLE1BQU0sU0FBUztBQUs5QyxpQkFBaUIsWUFBWTtBQUs3QixlQUFnQixTQUFTLFNBQVM7QUFDbEMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxRQUFRLEtBQUs7QUFDcEQsY0FBZ0IsUUFBUSxXQUFXLE9BQU8sU0FBUyxXQUFXLGtCQUFrQixlQUFlLE9BQU87QUFDdEcsZUFBZ0IsT0FBTyxPQUFPOztJQVUxQix1QkFBZSxLQUFJOzs7O2FBRU8sS0FBQyx1QkFBZ0IsS0FBQyxXQUFXLFlBQVcsS0FBQyxFQUFFOzttQkFBMUQsS0FBQzs7WUFFTCxRQUFPLFNBQVUsS0FBQzs7WUFDakIsS0FBQyxlQUFlLElBQUk7Z0NBQ3VCLEtBQUMsV0FBVzs7O2dCQUFwQjtnQkFBbkMsS0FBSyxNQUFNOzttQkFDVCxLQUFDOztZQUVKLEtBQUssS0FBSyxJQUFJLEtBQUU7O1lBQ2YsU0FBUyxLQUFDLGVBQWUsR0FBRyxJQUFJO2dCQUNwQixXQUFVOzt1QkFBcEI7OzttQkFFbUIsTUFBUSxLQUFDLGFBQWEsY0FBYzs7bUJBQTNELEtBQUMsUUFBUSxJQUFJOztRQUVmLDBCQUFvQixLQUFDLHdCQUFELEtBQUMsY0FBZSxNQUFNLEVBQUU7WUFFekMsT0FBTyxLQUFDLHNCQUFhOzt1QkFBTyxHQUFHLFFBQVEsSUFBSTs7O1lBQzFDLEtBQUMsZUFBZSxJQUFJO3VCQUNhLElBQU87O2dCQUF4QyxLQUFDLGlCQUFpQjs7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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
