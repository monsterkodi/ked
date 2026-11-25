var _k_ = {assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isArr: function (o) {return Array.isArray(o)}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var layout

import fill from "./fill.js"
import projector from "./projector.js"

import kxk from "../../kxk.js"
let noon = kxk.noon

import sue from "../edit/tool/sue.js"


layout = (function ()
{
    function layout ()
    {}

    layout["absolutize"] = function (cells, rectree)
    {
        this.inBox({x:0,y:0,w:cells.cols,h:cells.rows},rectree)
        return rectree
    }

    layout["inBox"] = function (box, node)
    {
        var child, h, inner, w, x, y, _31_54_, _31_66_, _32_54_, _32_66_, _43_24_

        if (!(node != null))
        {
            return node
        }
        _k_.assert("kode/ked/popo/layout.kode", 31, 8, "layout: w and r are both given" + " !((node.w != null) && (node.r != null))", !((node.w != null) && (node.r != null)))
        _k_.assert("kode/ked/popo/layout.kode", 32, 8, "layout: h and b are both given" + " !((node.h != null) && (node.b != null))", !((node.h != null) && (node.b != null)))
        x = _k_.clamp(0,box.w,(this.offset(box.w,node.x)))
        y = _k_.clamp(0,box.h,(this.offset(box.h,node.y)))
        w = _k_.clamp(0,(box.w - x),(this.extent(box.w,x,node.w,node.r)))
        h = _k_.clamp(0,(box.h - y),(this.extent(box.h,y,node.h,node.b)))
        h = this.linesHeight(node,h,box.h - y)
        node.rect = {abs:{x:box.x + x,y:box.y + y,w:w,h:h},rel:{x:x,y:y,w:w,h:h}}
        if ((node.children != null))
        {
            inner = {x:box.x + x,y:box.y + y,w:w,h:h}
            var list = _k_.list(node.children)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                child = list[_a_]
                this.inBox(inner,child)
            }
        }
        return node
    }

    layout["linesHeight"] = function (node, h, room)
    {
        var scale, _59_33_

        scale = this.scaleOf(node)
        if (scale <= 1)
        {
            return h
        }
        if ((node.h != null))
        {
            h = _k_.max(scale,h)
        }
        h = _k_.min(h,room)
        return h - h % scale
    }

    layout["parseHeight"] = function (text)
    {
        var lines, m, scale

        m = /^\s*(\d*%?)\s*(?:x\s*(\d*))?\s*$/i.exec(String((text != null ? text : '')))
        if (!(m != null))
        {
            return
        }
        if (_k_.empty(m[1]) && _k_.empty(m[2]))
        {
            return
        }
        scale = _k_.clamp(1,7,((!_k_.empty((m[2])) ? parseInt(m[2]) : 1)))
        if (m[1].endsWith('%'))
        {
            return {h:m[1],scale:scale}
        }
        lines = (!_k_.empty((m[1])) ? parseInt(m[1]) : 1)
        return {h:lines * scale,scale:scale}
    }

    layout["heightText"] = function (node)
    {
        var scale, _88_27_, _90_37_

        if (!((node != null ? node.h : undefined) != null))
        {
            return ''
        }
        scale = _k_.max(1,parseInt(((_90_37_=node.scale) != null ? _90_37_ : 1)))
        if (scale <= 1)
        {
            return String(node.h)
        }
        if (_k_.isStr(node.h) && node.h.endsWith('%'))
        {
            return `${node.h}x${scale}`
        }
        return `${_k_.max(1,Math.floor(parseInt(node.h) / scale))}x${scale}`
    }

    layout["offset"] = function (extent, value)
    {
        if (!!_k_.empty(value))
        {
            return 0
        }
        if (_k_.isStr(value))
        {
            if (value.endsWith('%'))
            {
                value = extent * parseInt(value) / 100
            }
            return parseInt(value)
        }
        return value
    }

    layout["extent"] = function (total, start, w, r)
    {
        if (!_k_.empty(w))
        {
            return this.offset(total,w)
        }
        if (!_k_.empty(r))
        {
            return total - start - (this.offset(total,r))
        }
        return total - start
    }

    layout["regionize"] = function (cells, rectree)
    {
        if (!(rectree != null))
        {
            return
        }
        this.absolutize(cells,rectree)
        this.addRegions(rectree,(this.blockersIn(rectree)),[])
        return rectree
    }

    layout["blockersIn"] = function (node)
    {
        var child, entry, found, _133_35_

        found = []
        if (node.blocks && node.rect.abs.w > 0 && node.rect.abs.h > 0)
        {
            found.push(node)
        }
        var list = ((_133_35_=node.children) != null ? _133_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            var list1 = _k_.list(this.blockersIn(child))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                entry = list1[_b_]
                found.push(entry)
            }
        }
        return found
    }

    layout["addRegions"] = function (node, blockers, ancestors)
    {
        var blocker, child, _149_35_

        node.regions = this.intervalsOf(node)
        if (this.flows(node))
        {
            var list = _k_.list(blockers)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                blocker = list[_a_]
                if (blocker === node)
                {
                    continue
                }
                if (_k_.in(blocker,ancestors))
                {
                    continue
                }
                node.regions = this.cutBy(node.regions,blocker)
            }
        }
        var list1 = ((_149_35_=node.children) != null ? _149_35_ : [])
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            child = list1[_b_]
            this.addRegions(child,blockers,ancestors.concat([node]))
        }
    }

    layout["flows"] = function (node)
    {
        var _156_17_

        if (node.flows === false)
        {
            return false
        }
        return (node.text != null) || !_k_.empty(node.pattern) || !_k_.empty(node.image)
    }

    layout["intervalsOf"] = function (node)
    {
        var bot, out, rect, top, y

        rect = node.rect.abs
        top = rect.y
        bot = rect.y + rect.h
        out = []
        for (y = top; y < bot; y++)
        {
            out.push([rect.x,y,rect.x + rect.w])
        }
        return out
    }

    layout["cutBy"] = function (intervals, blocker)
    {
        var bx1, bx2, by1, by2, out, rect, rng, x1, x2, y

        rect = blocker.rect.abs
        bx1 = rect.x
        bx2 = rect.x + rect.w
        by1 = rect.y
        by2 = rect.y + rect.h
        out = []
        var list = _k_.list(intervals)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            x1 = rng[0]
            y = rng[1]
            x2 = rng[2]
            if (y < by1 || y >= by2 || bx2 <= x1 || bx1 >= x2)
            {
                out.push(rng)
                continue
            }
            if (x1 < bx1)
            {
                out.push([x1,y,bx1])
            }
            if (bx2 < x2)
            {
                out.push([bx2,y,x2])
            }
        }
        return out
    }

    layout["dumpRegions"] = function (rectree)
    {
        var cell, chars, grid, lines, row

        grid = this.gridOf(rectree)
        if (!(grid != null))
        {
            return ''
        }
        lines = []
        var list = _k_.list(grid)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            chars = []
            var list1 = _k_.list(row)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                cell = list1[_b_]
                if (cell.char === '')
                {
                    chars.push(' ')
                }
                else
                {
                    chars.push(cell.char)
                }
            }
            lines.push(chars.join(''))
        }
        return lines.join('\n')
    }

    layout["pageOf"] = function (tree)
    {
        var key

        if (!(tree != null))
        {
            return tree
        }
        for (key in tree)
        {
            if (key !== 'children')
            {
                return {children:[tree]}
            }
        }
        return tree
    }

    layout["titlify"] = function (cells, page)
    {
        var child, _229_35_

        this.absolutize(cells,page)
        delete page.title
        var list = ((_229_35_=page.children) != null ? _229_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.titleIn(child,0)
        }
        return page
    }

    layout["titleIn"] = function (node, depth)
    {
        var child, _240_35_

        if (!(node != null))
        {
            return
        }
        node.title = _k_.lpad(depth + 2) + this.roleOf(node)
        var list = ((_240_35_=node.children) != null ? _240_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.titleIn(child,depth + 2)
        }
    }

    layout["roleOf"] = function (node)
    {
        var _243_35_

        return ((_243_35_=this.typeOf(node)) != null ? _243_35_ : ((!_k_.empty((node.children)) ? 'box' : 'rect')))
    }

    layout["typeOf"] = function (node)
    {
        var type

        var list = ['erase','text','pattern','bg','fg']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            type = list[_a_]
            if ((node[type] != null))
            {
                return type
            }
        }
        return null
    }

    layout["argOf"] = function (node)
    {
        var type

        type = this.typeOf(node)
        if ((type != null))
        {
            return node[type]
        }
    }

    layout["sourceOf"] = function (rectree)
    {
        if (!(rectree != null))
        {
            return ''
        }
        return noon.stringify(this.dataNode(rectree))
    }

    layout["plainNode"] = function (node)
    {
        var key, out, value, _278_42_

        out = {}
        for (key in node)
        {
            value = node[key]
            if (_k_.in(key,['rect','title','index','regions','rendered','grid','rows','state']))
            {
                continue
            }
            if (key === 'children')
            {
                out.children = value.map((function (child)
                {
                    return this.plainNode(child)
                }).bind(this))
            }
            else
            {
                out[key] = value
            }
        }
        if ((node.state != null))
        {
            out.s = node.state.s
        }
        return out
    }

    layout["dataNode"] = function (node)
    {
        var key, out, value

        out = {}
        for (key in node)
        {
            value = node[key]
            if (_k_.in(key,['rect','title','index','regions','rendered','grid','rows','state','s','lines']))
            {
                continue
            }
            if (key === 'children')
            {
                out.children = value.map((function (child)
                {
                    return this.dataNode(child)
                }).bind(this))
            }
            else
            {
                out[key] = value
            }
            if (key === 'text')
            {
                out.lines = projector.linesOf(node)
            }
        }
        return out
    }

    layout["liveNode"] = function (plain)
    {
        var child, key, out, value

        out = {}
        for (key in plain)
        {
            value = plain[key]
            if (key === 'children')
            {
                out.children = []
                var list = _k_.list(value)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    child = list[_a_]
                    out.children.push(this.liveNode(child))
                }
            }
            else
            {
                out[key] = value
            }
        }
        return out
    }

    layout["nodeForPos"] = function (cells, rectree, pos)
    {
        this.absolutize(cells,rectree)
        return this.topmostIn(rectree,pos)
    }

    layout["moveNode"] = function (cells, rectree, node, dir)
    {
        var box, dx, dy, maxRel, newEnd, newRel, oldEnd, oldRel, rect, value, _321_38_, _321_49_, _330_25_, _330_36_, _334_21_, _341_25_, _354_25_, _354_36_, _358_21_, _365_25_

        box = ((_321_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _321_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
        rect = node.rect.abs
        switch (dir)
        {
            case 'left':
                dx = -1
                break
            case 'right':
                dx = 1
                break
            case 'up':
                dy = -1
                break
            case 'down':
                dy = 1
                break
        }

        if (dx && ((node.w != null) || (node.r != null)))
        {
            maxRel = _k_.max(0,(box.w - rect.w))
            if ((node.w != null))
            {
                value = this.incrValue(node.x,(rect.x - box.x),dx,0,maxRel)
                if ((value != null))
                {
                    node.x = value
                }
            }
            else
            {
                oldRel = rect.x - box.x
                oldEnd = maxRel - oldRel
                if ((node.x != null))
                {
                    value = this.incrValue(node.x,oldRel,dx,0,maxRel)
                    if ((value != null))
                    {
                        newRel = this.offset(box.w,value)
                        node.x = value
                        node.r = oldEnd - (newRel - oldRel)
                    }
                }
                else
                {
                    value = this.incrValue(node.r,oldEnd,-dx,0,maxRel)
                    if ((value != null))
                    {
                        newEnd = this.offset(box.w,value)
                        node.r = value
                        node.x = maxRel - newEnd
                    }
                }
            }
        }
        if (dy && ((node.h != null) || (node.b != null)))
        {
            maxRel = _k_.max(0,(box.h - rect.h))
            if ((node.h != null))
            {
                value = this.incrValue(node.y,(rect.y - box.y),dy,0,maxRel)
                if ((value != null))
                {
                    node.y = value
                }
            }
            else
            {
                oldRel = rect.y - box.y
                oldEnd = maxRel - oldRel
                if ((node.y != null))
                {
                    value = this.incrValue(node.y,oldRel,dy,0,maxRel)
                    if ((value != null))
                    {
                        newRel = this.offset(box.h,value)
                        node.y = value
                        node.b = oldEnd - (newRel - oldRel)
                    }
                }
                else
                {
                    value = this.incrValue(node.b,oldEnd,-dy,0,maxRel)
                    if ((value != null))
                    {
                        newEnd = this.offset(box.h,value)
                        node.b = value
                        node.y = maxRel - newEnd
                    }
                }
            }
        }
        if (!_k_.empty(value))
        {
            this.absolutize(cells,rectree)
            return node
        }
    }

    layout["resizeNode"] = function (cells, rectree, node, dir)
    {
        var before, box, dh, dw, key, rect, roomH, roomW, step, val, value, _385_38_, _385_49_, _401_21_, _410_21_

        box = ((_385_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _385_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
        rect = node.rect.abs
        step = this.scaleOf(node)
        roomW = box.w - (rect.x - box.x)
        roomH = box.h - (rect.y - box.y)
        switch (dir)
        {
            case 'less cols':
                dw = -step
                break
            case 'more cols':
                dw = step
                break
            case 'less rows':
                dh = -step
                break
            case 'more rows':
                dh = step
                break
        }

        before = {w:node.w,r:node.r,h:node.h,b:node.b}
        if (dw)
        {
            if ((node.w != null))
            {
                value = this.stepWidth(node,rect.w,dw,step,roomW)
                if ((value != null))
                {
                    node.w = value
                }
            }
            else
            {
                value = this.incrValue(node.r,roomW - rect.w,-dw,0,roomW - step)
                if ((value != null))
                {
                    node.r = value
                }
            }
        }
        if (dh)
        {
            if ((node.h != null))
            {
                value = this.incrValue(node.h,rect.h,dh,step,roomH)
                if ((value != null))
                {
                    node.h = value
                }
            }
            else
            {
                value = this.incrValue(node.b,roomH - rect.h,-dh,0,roomH - step)
                if ((value != null))
                {
                    node.b = value
                }
            }
        }
        if (!!_k_.empty(value))
        {
            return
        }
        this.absolutize(cells,rectree)
        if (node.rect.abs.w < step || node.rect.abs.h < step)
        {
            for (key in before)
            {
                val = before[key]
                ;(val != null) ? node[key] = val : delete node[key]
            }
            this.absolutize(cells,rectree)
            return
        }
        return node
    }

    layout["stepWidth"] = function (node, old, dir, step, room)
    {
        var w

        if (_k_.isStr(node.w) && node.w.endsWith('%'))
        {
            return this.incrValue(node.w,old,dir,step,room)
        }
        w = (dir > 0 ? (Math.floor(old / step) + 1) * step : (Math.ceil(old / step) - 1) * step)
        w = _k_.clamp(step,Math.ceil(room / step) * step,w)
        if (w !== old && w !== parseInt(node.w))
        {
            return w
        }
    }

    layout["incrValue"] = function (field, old, dir, minv, maxv)
    {
        var rep, res

        if (_k_.isStr(field) && field.endsWith('%'))
        {
            rep = parseInt(field) + ((dir > 0 ? 1 : -1))
            if ((0 <= rep && rep <= 100))
            {
                return `${rep}%`
            }
        }
        else
        {
            res = _k_.clamp(minv,maxv,old + dir)
            if (res !== old)
            {
                return res
            }
        }
    }

    layout["removeNode"] = function (rectree, node)
    {
        var parent

        parent = this.parentOf(rectree,node)
        if (!(parent != null))
        {
            return
        }
        parent.children.splice(parent.children.indexOf(node),1)
        if (_k_.empty(parent.children))
        {
            delete parent.children
        }
        return parent
    }

    layout["pathOf"] = function (rectree, node)
    {
        var parent, path

        if (node === rectree)
        {
            return []
        }
        parent = this.parentOf(rectree,node)
        if (!(parent != null))
        {
            return
        }
        path = this.pathOf(rectree,parent)
        if (!(path != null))
        {
            return
        }
        return path.concat([parent.children.indexOf(node)])
    }

    layout["nodeAtPath"] = function (rectree, path)
    {
        var index, node, _482_33_

        node = rectree
        var list = _k_.list(path)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            node = (node != null ? (_482_33_=node.children) != null ? _482_33_[index] : undefined : undefined)
        }
        return node
    }

    layout["ownProps"] = function (node)
    {
        var props

        props = this.dataNode(node)
        delete props.children
        return props
    }

    layout["isNodeData"] = function (data)
    {
        var child, key, value, _500_24_

        if (!(data != null) || _k_.isArr(data) || typeof(data) !== 'object')
        {
            return false
        }
        if (_k_.empty(data))
        {
            return false
        }
        for (key in data)
        {
            value = data[key]
            if (!(_k_.in(key,['x','y','w','h','r','b','text','lines','pattern','image','erase','bg','fg','scale','flows','blocks','type','children'])))
            {
                return false
            }
        }
        if ((data.children != null))
        {
            if (!(_k_.isArr(data.children)))
            {
                return false
            }
            var list = _k_.list(data.children)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                child = list[_a_]
                if (!this.isNodeData(child))
                {
                    return false
                }
            }
        }
        return true
    }

    layout["appendChild"] = function (parent, node)
    {
        var _509_24_

        parent.children = ((_509_24_=parent.children) != null ? _509_24_ : [])
        parent.children.push(node)
        return node
    }

    layout["shiftNode"] = function (rectree, node, dir)
    {
        var at, grand, index, other, parent, siblings, target

        parent = this.parentOf(rectree,node)
        if (!(parent != null))
        {
            return false
        }
        siblings = parent.children
        index = siblings.indexOf(node)
        target = (dir === 'up' ? index - 1 : index + 1)
        if ((0 <= target && target < siblings.length))
        {
            other = siblings[target]
            if (!_k_.empty(other.children))
            {
                this.reframe(node,parent.rect.abs,other.rect.abs)
                siblings.splice(index,1)
                dir === 'up' ? other.children.push(node) : other.children.unshift(node)
            }
            else
            {
                siblings.splice(index,1)
                siblings.splice(target,0,node)
            }
            return true
        }
        grand = this.parentOf(rectree,parent)
        if (!(grand != null))
        {
            return false
        }
        this.reframe(node,parent.rect.abs,grand.rect.abs)
        siblings.splice(index,1)
        if (_k_.empty(siblings))
        {
            delete parent.children
        }
        at = grand.children.indexOf(parent)
        grand.children.splice(((dir === 'up' ? at : at + 1)),0,node)
        return true
    }

    layout["reframe"] = function (node, from, to)
    {
        var cells, db, dr, dx, dy, _566_15_, _567_15_, _568_34_, _568_50_, _569_34_, _569_50_

        dx = from.x - to.x
        dy = from.y - to.y
        dr = (to.x + to.w) - (from.x + from.w)
        db = (to.y + to.h) - (from.y + from.h)
        cells = function (value)
        {
            return (value != null) && !(_k_.isStr(value))
        }
        if (cells(node.x))
        {
            node.x = node.x + dx
        }
        if (cells(node.y))
        {
            node.y = node.y + dy
        }
        if (cells(node.r))
        {
            node.r = node.r + dr
        }
        if (cells(node.b))
        {
            node.b = node.b + db
        }
        node.x = ((_566_15_=node.x) != null ? _566_15_ : dx)
        node.y = ((_567_15_=node.y) != null ? _567_15_ : dy)
        if (!(node.w != null) && !(node.r != null))
        {
            node.r = dr
        }
        if (!(node.h != null) && !(node.b != null))
        {
            return node.b = db
        }
    }

    layout["parentOf"] = function (node, target)
    {
        var child, found, _573_35_, _576_35_

        var list = ((_573_35_=node.children) != null ? _573_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (child === target)
            {
                return node
            }
        }
        var list1 = ((_576_35_=node.children) != null ? _576_35_ : [])
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            child = list1[_b_]
            if (found = this.parentOf(child,target))
            {
                return found
            }
        }
        return null
    }

    layout["addTextNode"] = function (cells, rectree, pos, text)
    {
        var child, lines, node, rect, _587_47_

        if (!(rectree != null))
        {
            return
        }
        node = ((_587_47_=this.nodeForPos(cells,rectree,pos)) != null ? _587_47_ : rectree)
        lines = text.split('\n')
        rect = node.rect.abs
        child = {text:'md',lines:lines,x:pos[0] - rect.x,y:pos[1] - rect.y,w:Array.from(lines[0]).length + 1,h:1}
        return this.appendChild(node,child)
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _600_35_

        if (!(node != null))
        {
            return
        }
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_600_35_=node.children) != null ? _600_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (hit = this.topmostIn(child,pos))
            {
                found = hit
            }
        }
        return found
    }

    layout["scaleOf"] = function (node)
    {
        var _608_28_, _610_29_

        if (!(node.text != null))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_610_29_=node.scale) != null ? _610_29_ : 1)))
    }

    layout["holds"] = function (node, pos)
    {
        var rect, x, y

        rect = node.rect.abs
        x = pos[0]
        y = pos[1]
        return x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h
    }

    layout["sueify"] = function (cells, rectree)
    {
        var data

        if (!(rectree != null))
        {
            return ''
        }
        data = this.sheetData(cells,rectree)
        return sue.ensue(data.text,data.sue)
    }

    layout["sheetData"] = function (cells, rectree, dirty)
    {
        var area, areas, root, row, size, y, _642_31_

        root = this.regionize(cells,rectree)
        if (!(root != null))
        {
            return {text:'',sue:[]}
        }
        projector.attach(root)
        size = {cols:cells.cols,rows:cells.rows}
        if ((dirty != null) && (root.grid != null) && _k_.eql(root.rendered, size))
        {
            this.repaintRows(root,dirty)
        }
        else
        {
            root.grid = this.gridOf(root)
            root.rows = []
            for (y = 0; y < root.grid.length; y++)
            {
                root.rows.push(this.lineOfRow(root.grid,y))
            }
        }
        root.rendered = size
        areas = []
        var list = _k_.list(root.rows)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            var list1 = _k_.list(row.areas)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                area = list1[_b_]
                areas.push(area)
            }
        }
        return {text:root.rows.map(function (row)
        {
            return row.line
        }).join('\n'),sue:areas}
    }

    layout["repaintRows"] = function (root, dirty)
    {
        var cell, grid, grown, rows, widen, y, ys

        grid = root.grid
        rows = new Set(dirty.filter(function (y)
        {
            return (0 <= y && y < grid.length)
        }))
        widen = (function (node)
        {
            var child, grown, rect, y, _668_50_, _674_39_

            if (this.scaleOf(node) > 1 && (node.regions != null ? node.regions.some(function (rng)
                {
                    return rows.has(rng[1])
                }) : undefined))
            {
                rect = node.rect.abs
                for (y = rect.y; y < _k_.min(grid.length,rect.y + rect.h); y++)
                {
                    if (!rows.has(y))
                    {
                        rows.add(y)
                        grown = true
                    }
                }
            }
            var list = ((_674_39_=node.children) != null ? _674_39_ : [])
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                child = list[_a_]
                widen(child)
            }
        }).bind(this)
        grown = true
        while (grown)
        {
            grown = false
            widen(root)
        }
        ys = Array.from(rows)
        var list = _k_.list(ys)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            y = list[_b_]
            var list1 = _k_.list(grid[y])
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                cell = list1[_c_]
                cell.char = ' '
                cell.fg = null
                cell.bg = null
                cell.block = null
            }
        }
        this.paintTree(root,grid,rows)
        var list2 = _k_.list(ys)
        for (var _d_ = 0; _d_ < list2.length; _d_++)
        {
            y = list2[_d_]
            root.rows[y] = this.lineOfRow(grid,y)
        }
    }

    layout["lineOfRow"] = function (grid, y)
    {
        var block, bottom, cell, glyph, glyphs, line, row, x

        row = grid[y]
        glyphs = []
        x = 0
        while (x < row.length)
        {
            cell = row[x]
            block = cell.block
            if (!_k_.empty(block))
            {
                bottom = block.y + block.scale - 1
                if (bottom === y)
                {
                    if (block.x === x)
                    {
                        glyphs.push({char:block.char,fg:cell.fg,bg:cell.bg,scale:block.scale,node:block.node})
                        x += block.scale
                    }
                    else
                    {
                        x += 1
                    }
                    continue
                }
                glyphs.push({char:' ',fg:cell.fg,bg:cell.bg,scale:1})
                x += 1
                continue
            }
            glyphs.push({char:cell.char,fg:cell.fg,bg:cell.bg,scale:1})
            x += 1
        }
        line = []
        var list = _k_.list(glyphs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            glyph = list[_a_]
            line.push(glyph.char)
        }
        return {line:line.join(''),areas:this.areasOfGlyphs(glyphs,y)}
    }

    layout["areasOfGlyphs"] = function (glyphs, y)
    {
        var areas, channel, code, i, j, scale, value, width

        areas = []
        var list = [[sue.FG_COLOR,'fg'],[sue.BG_COLOR,'bg']]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            code = list[_a_][0]
            channel = list[_a_][1]
            i = 0
            while (i < glyphs.length)
            {
                value = glyphs[i][channel]
                width = 1
                while (i + width < glyphs.length && glyphs[i + width][channel] === value)
                {
                    width += 1
                }
                if (!_k_.empty(value))
                {
                    areas.push({x:i,y:y,value:[code,width,1,value]})
                }
                i += width
            }
        }
        i = 0
        while (i < glyphs.length)
        {
            scale = glyphs[i].scale
            if (scale <= 1)
            {
                i += 1
                continue
            }
            j = i + 1
            while (j < glyphs.length && glyphs[j].scale === scale && glyphs[j].node === glyphs[i].node)
            {
                j += 1
            }
            areas.push({x:i,y:y,value:[sue.SCALE,-1,1,scale]})
            areas.push({x:j,y:y,value:[sue.CLOSE,-1,1,sue.SCALE]})
            i = j
        }
        return areas
    }

    layout["gridOf"] = function (rectree)
    {
        var grid, rect, row, x, y

        if (!(rectree != null))
        {
            return
        }
        grid = []
        rect = rectree.rect.abs
        for (y = 0; y < rect.h; y++)
        {
            row = []
            for (x = 0; x < rect.w; x++)
            {
                row.push({char:' ',fg:null,bg:null,block:null})
            }
            grid.push(row)
        }
        this.paintTree(rectree,grid)
        return grid
    }

    layout["paintTree"] = function (node, grid, rows)
    {
        var child, _797_52_, _799_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid,rows)
        }
        var list = ((_799_35_=node.children) != null ? _799_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid,rows)
        }
    }

    layout["paintNode"] = function (node, grid, rows)
    {
        var cell, chars, gone, i, j, masked, rng, strings, x, y, _804_29_, _812_25_, _814_25_, _823_43_, _833_43_, _836_58_, _837_41_

        if (!(node.regions != null))
        {
            return
        }
        masked = this.channelMaskOf(node)
        strings = null
        if (!_k_.empty(node.pattern))
        {
            strings = fill.pattern(node,node.regions)
        }
        else if ((node.text != null) && this.scaleOf(node) === 1)
        {
            strings = this.textRows(node)
        }
        else if ((node.text != null))
        {
            strings = node.regions.map(function (rng)
            {
                return fill.blank(rng[2] - rng[0])
            })
        }
        for (i = 0; i < node.regions.length; i++)
        {
            rng = node.regions[i]
            if ((rows != null) && !rows.has(rng[1]))
            {
                continue
            }
            chars = Array.from(((_823_43_=(strings != null ? strings[i] : undefined)) != null ? _823_43_ : ''))
            for (j = 0; j < (rng[2] - rng[0]); j++)
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_833_43_=masked[`${x},${y}`]) != null ? _833_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    if ((cell.block != null))
                    {
                        this.unblock(grid,cell.block)
                    }
                    cell.char = ((_837_41_=chars[j]) != null ? _837_41_ : ' ')
                }
                if (!_k_.empty(node.fg) && !gone.fg)
                {
                    cell.fg = node.fg
                }
                if (!_k_.empty(node.bg) && !gone.bg)
                {
                    cell.bg = node.bg
                }
            }
        }
        if (this.scaleOf(node) > 1)
        {
            return this.paintScaled(node,grid,masked,rows)
        }
    }

    layout["textRows"] = function (node)
    {
        var ch, chars, x, y

        chars = {}
        var list = _k_.list(projector.glyphs(node))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            x = list[_a_][0]
            y = list[_a_][1]
            ch = list[_a_][2]
            chars[`${x},${y}`] = ch
        }
        return node.regions.map(function (rng)
        {
            var row, _856_47_

            row = ''
            for (x = rng[0]; x < rng[2]; x++)
            {
                row += ((_856_47_=chars[`${x},${rng[1]}`]) != null ? _856_47_ : ' ')
            }
            return row
        })
    }

    layout["paintScaled"] = function (node, grid, masked, rows)
    {
        var char, chars, rect, scale, x, x1, x2, y, _881_66_

        scale = this.scaleOf(node)
        rect = node.rect.abs
        chars = {}
        var list = _k_.list(projector.glyphs(node))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            x = list[_a_][0]
            y = list[_a_][1]
            char = list[_a_][2]
            chars[`${x},${y}`] = char
        }
        var list1 = _k_.list(fill.bands(node,node.regions,rect))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            y = list1[_b_][0]
            x1 = list1[_b_][1]
            x2 = list1[_b_][2]
            if ((rows != null) && !rows.has(y))
            {
                continue
            }
            x = x1
            while (x + scale <= x2)
            {
                if (!this.charMaskedIn(masked,x,y,scale))
                {
                    this.markBlock(grid,x,y,scale,(((_881_66_=chars[`${x},${y}`]) != null ? _881_66_ : ' ')),node)
                }
                x += scale
            }
        }
    }

    layout["charMaskedIn"] = function (masked, x, y, scale)
    {
        var c, r

        for (r = y; r < y + scale; r++)
        {
            for (c = x; c < x + scale; c++)
            {
                if ((masked[`${c},${r}`] != null ? masked[`${c},${r}`].char : undefined))
                {
                    return true
                }
            }
        }
        return false
    }

    layout["markBlock"] = function (grid, x, y, scale, char, node)
    {
        var block, c, cell, r, _902_54_

        block = {x:x,y:y,scale:scale,char:char,node:node}
        for (r = y; r < _k_.min(grid.length,y + scale); r++)
        {
            for (c = x; c < _k_.min(grid[r].length,x + scale); c++)
            {
                cell = grid[r][c]
                if ((cell.block != null))
                {
                    this.unblock(grid,cell.block)
                }
                cell.block = block
                cell.char = ((c === x && r === y) ? char : '')
            }
        }
    }

    layout["unblock"] = function (grid, block)
    {
        var c, cell, r

        for (r = block.y; r < _k_.min(grid.length,block.y + block.scale); r++)
        {
            for (c = block.x; c < _k_.min(grid[r].length,block.x + block.scale); c++)
            {
                cell = grid[r][c]
                if (cell.block === block)
                {
                    cell.block = null
                    cell.char = ' '
                }
            }
        }
    }

    layout["channelMaskOf"] = function (node)
    {
        var channel, channels, child, entry, key, masked, rng, x, _922_35_, _924_39_, _929_37_

        masked = {}
        var list = ((_922_35_=node.children) != null ? _922_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (!(child.erase != null))
            {
                continue
            }
            channels = child.erase
            if (_k_.isStr(channels))
            {
                channels = [channels]
            }
            var list1 = ((_929_37_=child.regions) != null ? _929_37_ : [])
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                rng = list1[_b_]
                for (x = rng[0]; x < rng[2]; x++)
                {
                    key = `${x},${rng[1]}`
                    entry = masked[key]
                    if (!(entry != null))
                    {
                        entry = {}
                        masked[key] = entry
                    }
                    var list2 = _k_.list(channels)
                    for (var _c_ = 0; _c_ < list2.length; _c_++)
                    {
                        channel = list2[_c_]
                        entry[channel] = true
                    }
                }
            }
        }
        return masked
    }

    return layout
})()

export default layout;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTtPQUFLLGdCQUFBOztPQUNELFVBQUE7SUFBTTs7T0FDRyxVQUFQOzs7QUFFWCxVQUFEOzs7OztJQWdCSSxRQUFDLHlCQUFZLE9BQU07O1FBRWYsS0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEtBQUssRUFBRSxNQUFNLE1BQU07ZUFFM0M7OztJQUVKLFFBQUMsb0JBQU8sS0FBSTs7OztjQUVNOzttQkFBWjs7K0ZBRXNDLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSzsrRkFDakIsS0FBSyxlQUFPLEtBQUssaUJBQWpCLEtBQUssZUFBTyxLQUFLO1FBRXpELGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBQ3RDLGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBRXRDLGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbkQsY0FBVSxHQUFHLElBQUksSUFBRSxJQUFJLEtBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNuRCxJQUFJLEtBQUMsWUFBWSxLQUFLLEVBQUUsSUFBSSxJQUFFO1FBRTlCLEtBQUssUUFBUSxLQUFLLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTthQUUvRCxLQUFLOztZQUNKLFNBQVMsRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dDQUN0QixLQUFLOzs7Z0JBQWQ7Z0JBQ0EsS0FBQyxNQUFN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
//# sourceURL=../../../kode/ked/popo/layout.kode
