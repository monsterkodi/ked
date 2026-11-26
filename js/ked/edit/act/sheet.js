var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var highlightKeys, historyKeys, novimCombos, novimMotions, novimOnPage, novimParts, novimToggleKeys, pageKeys

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
novimToggleKeys = ['alt+n','alt+z']
export default {
    feedSheetKey:function (key, event)
    {
        var done, highlighted, node, nv, result, _44_41_, _51_25_, _61_42_
    
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
        if (_k_.in((((_51_25_=(event != null ? event.combo : undefined)) != null ? _51_25_ : key)),novimToggleKeys))
        {
            var list1 = _k_.list(this.sheetTextNodes())
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                node = list1[_b_]
                node.state.finishNovimInsert()
            }
            return this.feedKey(key,event)
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
        var _73_31_, _73_40_, _73_54_
    
        return ((_73_40_=(this.sheetMulti != null ? this.sheetMulti.active : undefined)) != null ? _73_40_ : (this.sheetHome() != null ? this.sheetHome().node : undefined))
    },
    feedSheetNovim:function (nv, key, event)
    {
        var combo, done, feeding, handled, home, k, parts, prev, result, _82_58_, _84_29_
    
        if ((nv.exConfirms != null ? nv.exConfirms.nodes : undefined))
        {
            return this.feedSheetConfirm(nv,key,event)
        }
        combo = ((_84_29_=(event != null ? event.combo : undefined)) != null ? _84_29_ : key)
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
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            k = list[_c_]
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
                for (var _d_ = 0; _d_ < list1.length; _d_++)
                {
                    k = list1[_d_]
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
    novimInNode:function (nv, fn, quiet, node)
    {
        var active, feeding, prev, result
    
        active = (node != null ? node : this.sheetActive())
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
    feedSheetConfirm:function (nv, key, event)
    {
        var feeding, prev
    
        prev = nv.state
        feeding = this.novimFeeding
        this.novimFeeding = true
        try
        {
            this.inTextNode(nv.exConfirms.node,(function (st)
            {
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
            this.sheetConfirmNext(nv,prev)
        }
        finally
        {
            this.novimFeeding = feeding
        }
        this.recordMacroKey(key,event)
        this.runNovimLater()
        return 'handled'
    },
    sheetConfirmNext:function (nv, prev)
    {
        var c
    
        while ((c = nv.exConfirms) && c.nextNode)
        {
            delete c.nextNode
            c.index += 1
            c.node = c.nodes[c.index]
            c.y1 = 0
            c.y2 = c.node.state.s.lines.length - 1
            c.y = 0
            c.fromX = 0
            this.inTextNode(c.node,(function (st)
            {
                nv.state = st
                try
                {
                    nv.advanceSubstituteConfirm()
                    if (c.all && nv.exConfirms)
                    {
                        return nv.acceptAllSubstitutions()
                    }
                }
                finally
                {
                    return nv.state = prev
                }
            }).bind(this))
        }
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
            for (var _e_ = 0; _e_ < list.length; _e_++)
            {
                node = list[_e_]
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
        var job, jobs, _253_45_
    
        if (this.novimFeeding || !(this.novimAfter != null))
        {
            return
        }
        jobs = this.novimAfter
        delete this.novimAfter
        var list = _k_.list(jobs)
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            job = list[_f_]
            job()
        }
    },
    novimLater:function (fn)
    {
        var _266_20_
    
        if (!this.novimFeeding)
        {
            return false
        }
        this.novimAfter = ((_266_20_=this.novimAfter) != null ? _266_20_ : [])
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
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            k = list[_10_]
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
            var _319_47_
    
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
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            node = list[_11_]
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
            for (var _13_ = 0; _13_ < list1.length; _13_++)
            {
                span = list1[_13_]
                matches.push({i:i,node:node,x:span[0],y:span[1]})
            }
        }
        return matches
    },
    sheetSearchSpot:function (nodes)
    {
        var before, cell, home, node, pos, r, _367_27_
    
        if (home = this.sheetHome())
        {
            pos = ((_367_27_=home.pos) != null ? _367_27_ : home.node.state.mainCursor())
            return {i:nodes.indexOf(home.node),node:home.node,x:pos[0],y:pos[1]}
        }
        cell = this.sheetCellForPos(this.mainCursor())
        before = 0
        var list = _k_.list(nodes)
        for (var _14_ = 0; _14_ < list.length; _14_++)
        {
            node = list[_14_]
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
        for (var _15_ = 0; _15_ < list.length; _15_++)
        {
            m = list[_15_]
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
        var from, i, t, target, _423_55_
    
        target = null
        from = spot
        for (i = 0; i < _k_.max(1,(count != null ? count : 1)); i++)
        {
            t = ((_423_55_=this.sheetSearchStep(matches,from,forward)) != null ? _423_55_ : this.searchWrapTarget(matches,forward))
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
        for (var _16_ = 0; _16_ < list.length; _16_++)
        {
            node = list[_16_]
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
        var matches, nodes, spot, target, _465_56_
    
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
        target = ((_465_56_=this.sheetSearchStep(matches,spot,forward)) != null ? _465_56_ : ((forward ? matches[0] : matches.slice(-1)[0])))
        return this.sheetSearchGo(target,spot)
    },
    sheetSearchGo:function (target, spot)
    {
        var origin, _475_29_, _479_20_
    
        if (!(target != null))
        {
            return
        }
        origin = ((_475_29_=spot.origin) != null ? _475_29_ : [spot.x,spot.y])
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
        for (var _18_ = 0; _18_ < list.length; _18_++)
        {
            k = list[_18_]
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
        for (var _19_ = 0; _19_ < list.length; _19_++)
        {
            node = list[_19_]
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
            var child, st, _566_25_, _573_39_
    
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
            var list = ((_573_39_=node.children) != null ? _573_39_ : [])
            for (var _1a_ = 0; _1a_ < list.length; _1a_++)
            {
                child = list[_1a_]
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
        var m, _591_73_
    
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
        var cells, left, node, pos, _603_21_, _604_56_, _608_21_
    
        cells = this.sheetSize()
        node = layout.nodeForPos(cells,this.rectree,cell)
        if (((node != null ? node.text : undefined) != null))
        {
            return {node:node,pos:(((_604_56_=projector.posAt(node,cell)) != null ? _604_56_ : projector.endOf(node)))}
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
        var count, d, hit, to, _629_36_, _633_83_
    
        if (event.cmd || event.ctrl)
        {
            return false
        }
        hit = this.sheetNodeAt(this.sheetCellForPos(pos))
        switch (type)
        {
            case 'press':
                count = ((_629_36_=event.count) != null ? _629_36_ : 1)
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
        for (var _1b_ = 0; _1b_ < list.length; _1b_++)
        {
            node = list[_1b_]
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
        var active, befores, home, joins, nodes, _690_59_
    
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
        for (var _1c_ = 0; _1c_ < list.length; _1c_++)
        {
            name = list[_1c_]
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
        for (var _1d_ = 0; _1d_ < list1.length; _1d_++)
        {
            key = list1[_1d_]
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
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            node = list[_1e_]
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
        var _763_25_
    
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
        var active, befores, home, node, nodes, r, result, _773_30_, _783_58_
    
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
        for (var _1f_ = 0; _1f_ < list.length; _1f_++)
        {
            node = list[_1f_]
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
        var scale, st, w, _884_64_, _884_80_
    
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
        for (var _22_ = 0; _22_ < list.length; _22_++)
        {
            x1 = list[_22_][0]
            li = list[_22_][1]
            x2 = list[_22_][2]
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
        var out, walk, _919_33_
    
        out = []
        walk = function (node)
        {
            var child, _916_39_, _917_39_
    
            if ((node.state != null))
            {
                out.push(node)
            }
            var list = ((_917_39_=node.children) != null ? _917_39_ : [])
            for (var _23_ = 0; _23_ < list.length; _23_++)
            {
                child = list[_23_]
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
        for (var _24_ = 0; _24_ < list.length; _24_++)
        {
            node = list[_24_]
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
        for (var _25_ = 0; _25_ < list.length; _25_++)
        {
            node = list[_25_]
            if (_k_.empty(node.state.s.highlights))
            {
                continue
            }
            var list1 = _k_.list(this.sheetRangesOf(node,node.state.s.highlights))
            for (var _26_ = 0; _26_ < list1.length; _26_++)
            {
                rng = list1[_26_]
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
        for (var _27_ = 0; _27_ < list.length; _27_++)
        {
            node = list[_27_]
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
        var cell, cells, node, _975_82_
    
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
        this.renderSheet(this.rectree,cells,(((_975_82_=projector.cellOf(node,projector.endOf(node))) != null ? _975_82_ : cell)))
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
            for (var _29_ = 0; _29_ < list.length; _29_++)
            {
                run = list[_29_]
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
        var _1086_25_
    
        if (!(this.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.sheetSize(),this.rectree,this.sheetCellForPos(this.mainCursor()))
    },
    scaleSheetNode:function (delta)
    {
        var cell, cells, mc, node, old, pos, rect, scale, _1092_25_, _1100_27_, _1107_41_
    
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
        pos = ((_1107_41_=projector.posAt(node,cell)) != null ? _1107_41_ : projector.endOf(node))
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
        var cell, cells, _1140_25_, _1146_49_
    
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
        var cells, _1156_25_
    
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
        var cells, _1172_25_
    
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
        var cell, _1217_41_
    
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
        var _1230_25_
    
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
        var _1238_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _1304_25_
    
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
        var cells, cursor, maxX, maxY, moved, node, oldRect, rect, x, y, _1333_25_
    
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L3NoZWV0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxhQUFUO09BQWdCLGdCQUFoQjs7T0FDUyxVQUFaO09BQWdCLFdBQWhCOztPQUNZLFdBQUE7O0FBTW5CLGVBQWUsUUFBUSxTQUFTLGNBQWMsUUFBUTtBQUV0RCxXQUFXLFlBQVksUUFDbkIsS0FBSyxPQUFPLE9BQU8sUUFBUSxXQUFXLFlBQ3RDLFNBQVMsV0FBVyxPQUFPLE1BQU0sU0FBUztBQUs5QyxpQkFBaUIsWUFBWTtBQUs3QixlQUFnQixTQUFTLFNBQVM7QUFDbEMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxRQUFRLEtBQUs7QUFDcEQsY0FBZ0IsUUFBUSxXQUFXLE9BQU8sU0FBUyxXQUFXLGtCQUFrQixlQUFlLE9BQU87QUFDdEcsZUFBZ0IsT0FBTyxPQUFPLGVBQWUsYUFBYTtBQUkxRCxtQkFBbUIsUUFBUTs7SUFVdkIsdUJBQWUsS0FBSTs7OzthQUVPLEtBQUMsdUJBQWdCLEtBQUMsV0FBVyxZQUFXLEtBQUMsRUFBRTs7bUJBQTFELEtBQUM7O1lBRUwsUUFBTyxTQUFVLEtBQUM7O1lBQ2pCLEtBQUMsZUFBZSxJQUFJO2dDQUN1QixLQUFDLFdBQVc7OztnQkFBcEI7Z0JBQW5DLEtBQUssTUFBTTs7bUJBQ1QsS0FBQzs7K0JBRUgsZ0JBQUEsTUFBTyx3Q0FBUSxNQUFROztpQ0FDb0IsS0FBQzs7O2dCQUFUO2dCQUFuQyxLQUFLLE1BQU07O21CQUNULEtBQUMsUUFBUSxJQUFJOztZQUVoQixLQUFLLEtBQUssSUFBSSxLQUFFOztZQUNmLFNBQVMsS0FBQyxlQUFlLEdBQUcsSUFBSTtnQkFDcEIsV0FBVTs7dUJBQXBCOzs7bUJBRW1CLE1BQVEsS0FBQyxhQUFhLGNBQWM7O21CQUEzRCxLQUFDLFFBQVEsSUFBSTs7UUFFZiwwQkFBb0IsS0FBQyx3QkFBRCxL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
//# sourceURL=../../../../kode/ked/edit/act/sheet.kode
