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
novimOnPage = ['move','undo','matchBracket','searchNext','searchPrev']
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
    novimInNodes:function (nv, fn)
    {
        var active, befores, feeding, node, nodes, prev, selected
    
        nodes = this.sheetReadingNodes()
        if (_k_.empty(nodes))
        {
            post.emit('novim.error','not in a text node')
            return false
        }
        active = this.sheetActive()
        befores = nodes.map(function (node)
        {
            return node.state.s
        })
        prev = nv.state
        feeding = this.novimFeeding
        ;(active != null) ? active.state.pushJump() : this.pushJump()
        this.novimFeeding = true
        this.novim.jumps.keep += 1
        this.begin()
        try
        {
            var list = _k_.list(nodes)
            for (var _d_ = 0; _d_ < list.length; _d_++)
            {
                node = list[_d_]
                this.syncSheetModes(node.state)
                nv.state = node.state
                fn()
            }
        }
        finally
        {
            nv.state = prev
            this.novimFeeding = feeding
            this.novim.jumps.keep -= 1
        }
        selected = nodes.filter(function (node)
        {
            return !_k_.empty(node.state.s.selections)
        })
        if (!_k_.empty(selected))
        {
            active = selected[0]
            if (selected.length > 1 || active.state.s.cursors.length > 1)
            {
                this.sheetMulti = {active:active,nodes:selected}
            }
        }
        active = (active != null ? active : nodes[0])
        this.commitSheetNodes(active,nodes,befores)
        this.end()
        this.runNovimLater()
        return true
    },
    runNovimLater:function ()
    {
        var job, jobs, _196_45_
    
        if (this.novimFeeding || !(this.novimAfter != null))
        {
            return
        }
        jobs = this.novimAfter
        delete this.novimAfter
        var list = _k_.list(jobs)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            job = list[_e_]
            job()
        }
    },
    novimLater:function (fn)
    {
        var _209_20_
    
        if (!this.novimFeeding)
        {
            return false
        }
        this.novimAfter = ((_209_20_=this.novimAfter) != null ? _209_20_ : [])
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
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            k = list[_f_]
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
            var _262_47_
    
            return !(e.node != null) || live.has(e.node)
        })
        return this.novim.changes.retain(function (e)
        {
            return !(e[2] != null) || live.has(e[2])
        })
    },
    sheetReadingNodes:function ()
    {
        return this.sheetTextNodes().sort(function (a, b)
        {
            var ra, rb
    
            ra = a.rect.abs
            rb = b.rect.abs
            return (ra.y - rb.y) || (ra.x - rb.x)
        })
    },
    sheetSearchHighlight:function (text)
    {
        var node, nodes
    
        if (this.novimLater((function ()
            {
                return this.sheetSearchHighlight(text)
            }).bind(this)))
        {
            return
        }
        nodes = this.sheetTextNodes()
        if (_k_.empty(text))
        {
            nodes = nodes.filter(function (node)
            {
                return !_k_.empty(node.state.s.highlights)
            })
            if (_k_.empty(nodes))
            {
                return
            }
        }
        var list = _k_.list(nodes)
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            node = list[_10_]
            _k_.empty(text) ? node.state.clearHighlights() : node.state.highlightText(text)
        }
        return this.compositeSheet(this.sheetActive())
    },
    sheetSearchMatches:function (nodes)
    {
        var i, matches, node, span
    
        matches = []
        var list = _k_.list(nodes)
        for (i = 0; i < list.length; i++)
        {
            node = list[i]
            var list1 = _k_.list(node.state.s.highlights)
            for (var _12_ = 0; _12_ < list1.length; _12_++)
            {
                span = list1[_12_]
                matches.push({i:i,node:node,x:span[0],y:span[1]})
            }
        }
        return matches
    },
    sheetSearchSpot:function (nodes)
    {
        var before, cell, home, node, pos, r, _310_27_
    
        if (home = this.sheetHome())
        {
            pos = ((_310_27_=home.pos) != null ? _310_27_ : home.node.state.mainCursor())
            return {i:nodes.indexOf(home.node),node:home.node,x:pos[0],y:pos[1]}
        }
        cell = this.sheetCellForPos(this.mainCursor())
        before = 0
        var list = _k_.list(nodes)
        for (var _13_ = 0; _13_ < list.length; _13_++)
        {
            node = list[_13_]
            r = node.rect.abs
            if (r.y < cell[1] || (r.y === cell[1] && r.x <= cell[0]))
            {
                before += 1
            }
        }
        return {i:before - 0.5,x:0,y:0}
    },
    sheetSearchAt:function (match, spot)
    {
        return match.node === spot.node && match.x === spot.x && match.y === spot.y
    },
    sheetSearchStep:function (matches, spot, forward)
    {
        var c, m, target
    
        target = null
        var list = _k_.list(matches)
        for (var _14_ = 0; _14_ < list.length; _14_++)
        {
            m = list[_14_]
            c = (m.i - spot.i) || (m.y - spot.y) || (m.x - spot.x)
            if (forward && c > 0)
            {
                return m
            }
            if (!forward && c < 0)
            {
                target = m
            }
        }
        return target
    },
    sheetSearchNext:function (count, text, forward)
    {
        var matches, nodes, spot
    
        if (this.novimLater((function ()
            {
                return this.sheetSearchNext(count,text,forward)
            }).bind(this)))
        {
            return
        }
        nodes = this.sheetReadingNodes()
        matches = this.sheetSearchMatches(nodes)
        if (_k_.empty((matches)) && !_k_.empty((text)))
        {
            this.sheetSearchHighlight(text)
            matches = this.sheetSearchMatches(nodes)
        }
        if (_k_.empty(matches))
        {
            return
        }
        spot = this.sheetSearchSpot(nodes)
        return this.sheetSearchGo(this.sheetSearchCount(matches,spot,count,forward),spot)
    },
    sheetSearchCount:function (matches, spot, count, forward)
    {
        var from, i, t, target, _366_55_
    
        target = null
        from = spot
        for (i = 0; i < _k_.max(1,(count != null ? count : 1)); i++)
        {
            t = ((_366_55_=this.sheetSearchStep(matches,from,forward)) != null ? _366_55_ : this.searchWrapTarget(matches,forward))
            if (!t)
            {
                break
            }
            target = from = t
        }
        return target
    },
    sheetSearchWord:function (st, text, count, forward)
    {
        var node, nodes, rng, spot
    
        if (this.novimLater((function ()
            {
                return this.sheetSearchWord(st,text,count,forward)
            }).bind(this)))
        {
            return
        }
        nodes = this.sheetReadingNodes()
        var list = _k_.list(nodes)
        for (var _15_ = 0; _15_ < list.length; _15_++)
        {
            node = list[_15_]
            node.state.setHighlights(node.state.wordSpansForText(text))
        }
        this.compositeSheet(this.sheetActive())
        node = nodes.find(function (n)
        {
            return n.state === st
        })
        rng = belt.rangeOfClosestWordToPos(st.s.lines,st.mainCursor())
        if (!(node != null) || !rng)
        {
            return
        }
        spot = {i:nodes.indexOf(node),node:node,x:rng[0],y:rng[1],origin:st.mainCursor()}
        return this.sheetSearchGo(this.sheetSearchCount(this.sheetSearchMatches(nodes),spot,count,forward),spot)
    },
    sheetSearchCommit:function (forward)
    {
        var matches, nodes, spot, target, _408_56_
    
        nodes = this.sheetReadingNodes()
        matches = this.sheetSearchMatches(nodes)
        if (_k_.empty(matches))
        {
            return
        }
        spot = this.sheetSearchSpot(nodes)
        if (matches.find((function (m)
            {
                return this.sheetSearchAt(m,spot)
            }).bind(this)))
        {
            return
        }
        target = ((_408_56_=this.sheetSearchStep(matches,spot,forward)) != null ? _408_56_ : ((forward ? matches[0] : matches.slice(-1)[0])))
        return this.sheetSearchGo(target,spot)
    },
    sheetSearchGo:function (target, spot)
    {
        var origin, _418_29_, _422_20_
    
        if (!(target != null))
        {
            return
        }
        origin = ((_418_29_=spot.origin) != null ? _418_29_ : [spot.x,spot.y])
        if (target.node === spot.node && target.x === origin[0] && target.y === origin[1])
        {
            return
        }
        ;(spot.node != null) ? spot.node.state.pushJump(origin) : this.pushJump()
        return this.inTextNode(target.node,function (st)
        {
            return st.setCursors([[target.x,target.y]])
        })
    },
    sheetSearchPosition:function ()
    {
        var k, m, matches, nodes, spot
    
        nodes = this.sheetReadingNodes()
        matches = this.sheetSearchMatches(nodes)
        if (_k_.empty(matches))
        {
            return
        }
        spot = this.sheetSearchSpot(nodes)
        var list = _k_.list(matches)
        for (k = 0; k < list.length; k++)
        {
            m = list[k]
            if (this.sheetSearchAt(m,spot))
            {
                return [k + 1,matches.length]
            }
        }
        return [0,matches.length]
    },
    shareSheetNovim:function (st)
    {
        var k
    
        if (st.novim.page === this)
        {
            return
        }
        var list = ['register','jumps','changes','macroReplaying','macroLastRegister','macroSkipKey']
        for (var _17_ = 0; _17_ < list.length; _17_++)
        {
            k = list[_17_]
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
        for (var _18_ = 0; _18_ < list.length; _18_++)
        {
            node = list[_18_]
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
            var child, st, _509_25_, _516_39_
    
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
            var list = ((_516_39_=node.children) != null ? _516_39_ : [])
            for (var _19_ = 0; _19_ < list.length; _19_++)
            {
                child = list[_19_]
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
        var m, _534_73_
    
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
        var cells, left, node, pos, _546_21_, _547_56_, _551_21_
    
        cells = this.sheetSize()
        node = layout.nodeForPos(cells,this.rectree,cell)
        if (((node != null ? node.text : undefined) != null))
        {
            return {node:node,pos:(((_547_56_=projector.posAt(node,cell)) != null ? _547_56_ : projector.endOf(node)))}
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
        var count, d, hit, to, _572_36_, _576_83_
    
        if (event.cmd || event.ctrl)
        {
            return false
        }
        hit = this.sheetNodeAt(this.sheetCellForPos(pos))
        switch (type)
        {
            case 'press':
                count = ((_572_36_=event.count) != null ? _572_36_ : 1)
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
        for (var _1a_ = 0; _1a_ < list.length; _1a_++)
        {
            node = list[_1a_]
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
        var active, befores, home, joins, nodes, _633_59_
    
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
        for (var _1b_ = 0; _1b_ < list.length; _1b_++)
        {
            name = list[_1b_]
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
        for (var _1c_ = 0; _1c_ < list1.length; _1c_++)
        {
            key = list1[_1c_]
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
        for (var _1d_ = 0; _1d_ < list.length; _1d_++)
        {
            node = list[_1d_]
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
        var _706_25_
    
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
        var active, befores, home, node, nodes, r, result, _716_30_, _726_58_
    
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
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            node = list[_1e_]
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
        var scale, st, w, _827_64_, _827_80_
    
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
        for (var _21_ = 0; _21_ < list.length; _21_++)
        {
            x1 = list[_21_][0]
            li = list[_21_][1]
            x2 = list[_21_][2]
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
        var out, walk, _862_33_
    
        out = []
        walk = function (node)
        {
            var child, _859_39_, _860_39_
    
            if ((node.state != null))
            {
                out.push(node)
            }
            var list = ((_860_39_=node.children) != null ? _860_39_ : [])
            for (var _22_ = 0; _22_ < list.length; _22_++)
            {
                child = list[_22_]
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
        for (var _23_ = 0; _23_ < list.length; _23_++)
        {
            node = list[_23_]
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
        for (var _24_ = 0; _24_ < list.length; _24_++)
        {
            node = list[_24_]
            if (_k_.empty(node.state.s.highlights))
            {
                continue
            }
            var list1 = _k_.list(this.sheetRangesOf(node,node.state.s.highlights))
            for (var _25_ = 0; _25_ < list1.length; _25_++)
            {
                rng = list1[_25_]
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
        for (var _26_ = 0; _26_ < list.length; _26_++)
        {
            node = list[_26_]
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
        var cell, cells, node, _918_82_
    
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
        this.renderSheet(this.rectree,cells,(((_918_82_=projector.cellOf(node,projector.endOf(node))) != null ? _918_82_ : cell)))
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
            for (var _28_ = 0; _28_ < list.length; _28_++)
            {
                run = list[_28_]
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
        var _1029_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, mc, node, old, pos, rect, scale, _1035_25_, _1043_27_, _1050_41_
    
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
        pos = ((_1050_41_=projector.posAt(node,cell)) != null ? _1050_41_ : projector.endOf(node))
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
        var cell, cells, _1083_25_, _1089_49_
    
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
        var cells, _1099_25_
    
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
        var cells, _1115_25_
    
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
    sheetText:function ()
    {
        var data
    
        data = layout.sheetData(this.sheetSize(),this.rectree)
        this.sheetClasses = data.classes
        return sue.ensue(data.text,data.sue)
    },
    clearSheet:function ()
    {
        delete this.rectree
        delete this.sheetMirror
        delete this.sheetMulti
        delete this.sheetClasses
        this.s = this.s.set('rectree',null)
        return this
    },
    restoreSheet:function ()
    {
        var cell, _1160_41_
    
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
        var _1173_25_
    
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
        var _1181_25_
    
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
        this.sheetClasses = data.classes
        this.syntax.setSegls(this.s.lines)
        this.syntax.setOverlay(this.sheetClasses)
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _1247_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _1276_25_
    
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxhQUFUO09BQWdCLGdCQUFoQjs7T0FDUyxVQUFaO09BQWdCLFdBQWhCOztPQUNZLFdBQUE7O0FBTW5CLGVBQWUsUUFBUSxTQUFTLGNBQWMsUUFBUTtBQUV0RCxXQUFXLFlBQVksUUFDbkIsS0FBSyxPQUFPLE9BQU8sUUFBUSxXQUFXLFlBQ3RDLFNBQVMsV0FBVyxPQUFPLE1BQU0sU0FBUztBQUs5QyxpQkFBaUIsWUFBWTtBQUs3QixlQUFnQixTQUFTLFNBQVM7QUFDbEMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxRQUFRLEtBQUs7QUFDcEQsY0FBZ0IsUUFBUSxXQUFXLE9BQU8sU0FBUyxXQUFXLGtCQUFrQixlQUFlLE9BQU87QUFDdEcsZUFBZ0IsT0FBTyxPQUFPLGVBQWUsYUFBYTs7SUFVdEQsdUJBQWUsS0FBSTs7OzthQUVPLEtBQUMsdUJBQWdCLEtBQUMsV0FBVyxZQUFXLEtBQUMsRUFBRTs7bUJBQTFELEtBQUM7O1lBRUwsUUFBTyxTQUFVLEtBQUM7O1lBQ2pCLEtBQUMsZUFBZSxJQUFJO2dDQUN1QixLQUFDLFdBQVc7OztnQkFBcEI7Z0JBQW5DLEtBQUssTUFBTTs7bUJBQ1QsS0FBQzs7WUFFSixLQUFLLEtBQUssSUFBSSxLQUFFOztZQUNmLFNBQVMsS0FBQyxlQUFlLEdBQUcsSUFBSTtnQkFDcEIsV0FBVTs7dUJBQXBCOzs7bUJBRW1CLE1BQVEsS0FBQyxhQUFhLGNBQWM7O21CQUEzRCxLQUFDLFFBQVEsSUFBSTs7UUFFZiwwQkFBb0IsS0FBQyx3QkFBRCxLQUFDLGNBQWUsTUFBTSxFQUFFO1lBRXpDLE9BQU8sS0FBQyxzQkFBYTs7dUJBQU8sR0FBRyxRQUFRLElBQUk7OztZQUMxQyxLQUFDLGVBQWUsSUFBSTt1QkFDYSxJQUFPOztnQkFBeEMsS0FB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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
