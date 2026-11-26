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
        w = _k_.clamp(0,(box.w - x),(this.extent(box.w,node.x,node.w,node.r)))
        h = _k_.clamp(0,(box.h - y),(this.extent(box.h,node.y,node.h,node.b)))
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
        return this.edge(this.exact(extent,value))
    }

    layout["exact"] = function (extent, value)
    {
        if (!!_k_.empty(value))
        {
            return 0
        }
        if (_k_.isStr(value))
        {
            if (value.endsWith('%'))
            {
                return extent * parseInt(value) / 100
            }
            return parseInt(value)
        }
        return value
    }

    layout["edge"] = function (v)
    {
        return Math.floor(v + 1e-9)
    }

    layout["extent"] = function (total, start, w, r)
    {
        var left

        left = this.exact(total,start)
        if (!_k_.empty(w))
        {
            return this.edge(left + this.exact(total,w)) - this.edge(left)
        }
        if (!_k_.empty(r))
        {
            return this.edge(total - this.exact(total,r)) - this.edge(left)
        }
        return total - this.edge(left)
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
        var child, entry, found, _144_35_

        found = []
        if (node.blocks && node.rect.abs.w > 0 && node.rect.abs.h > 0)
        {
            found.push(node)
        }
        var list = ((_144_35_=node.children) != null ? _144_35_ : [])
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
        var blocker, child, _160_35_

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
        var list1 = ((_160_35_=node.children) != null ? _160_35_ : [])
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            child = list1[_b_]
            this.addRegions(child,blockers,ancestors.concat([node]))
        }
    }

    layout["flows"] = function (node)
    {
        var _167_17_

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
        var child, _240_35_

        this.absolutize(cells,page)
        delete page.title
        var list = ((_240_35_=page.children) != null ? _240_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.titleIn(child,0)
        }
        return page
    }

    layout["titleIn"] = function (node, depth)
    {
        var child, _251_35_

        if (!(node != null))
        {
            return
        }
        node.title = _k_.lpad(depth + 2) + this.roleOf(node)
        var list = ((_251_35_=node.children) != null ? _251_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.titleIn(child,depth + 2)
        }
    }

    layout["roleOf"] = function (node)
    {
        var _254_35_

        return ((_254_35_=this.typeOf(node)) != null ? _254_35_ : ((!_k_.empty((node.children)) ? 'box' : 'rect')))
    }

    layout["typeOf"] = function (node)
    {
        var type

        var list = ['text','erase','pattern','bg','fg']
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
        var key, out, value, _289_21_

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
            out.stateName = node.state.name
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
            if (_k_.in(key,['rect','title','index','regions','rendered','grid','rows','state','s','stateName','lines']))
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
        var box, dx, dy, maxRel, newEnd, newRel, oldEnd, oldRel, rect, value, _334_38_, _334_49_, _343_25_, _343_36_, _347_21_, _354_25_, _367_25_, _367_36_, _371_21_, _378_25_

        box = ((_334_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _334_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
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
        var before, box, dh, dw, key, rect, roomH, roomW, step, val, value, _398_38_, _398_49_, _414_21_, _423_21_

        box = ((_398_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _398_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
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
        var index, node, _495_33_

        node = rectree
        var list = _k_.list(path)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            node = (node != null ? (_495_33_=node.children) != null ? _495_33_[index] : undefined : undefined)
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
        var child, key, value, _513_24_

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
        var _522_24_

        parent.children = ((_522_24_=parent.children) != null ? _522_24_ : [])
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
        var cells, db, dr, dx, dy, _579_15_, _580_15_, _581_34_, _581_50_, _582_34_, _582_50_

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
        node.x = ((_579_15_=node.x) != null ? _579_15_ : dx)
        node.y = ((_580_15_=node.y) != null ? _580_15_ : dy)
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
        var child, found, _586_35_, _589_35_

        var list = ((_586_35_=node.children) != null ? _586_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (child === target)
            {
                return node
            }
        }
        var list1 = ((_589_35_=node.children) != null ? _589_35_ : [])
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
        var child, lines, node, rect, _600_47_

        if (!(rectree != null))
        {
            return
        }
        node = ((_600_47_=this.nodeForPos(cells,rectree,pos)) != null ? _600_47_ : rectree)
        lines = text.split('\n')
        rect = node.rect.abs
        child = {text:'md',lines:lines,x:pos[0] - rect.x,y:pos[1] - rect.y,w:Array.from(lines[0]).length + 1,h:1}
        return this.appendChild(node,child)
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _613_35_

        if (!(node != null))
        {
            return
        }
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_613_35_=node.children) != null ? _613_35_ : [])
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
        var _621_28_, _623_29_

        if (!(node.text != null))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_623_29_=node.scale) != null ? _623_29_ : 1)))
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
        var area, areas, classes, root, row, size, text, y, _655_31_

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
        text = root.rows.map(function (row)
        {
            return row.line
        }).join('\n')
        classes = root.rows.map(function (row)
        {
            return row.classes
        })
        return {text:text,sue:areas,classes:classes}
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
            var child, grown, rect, y, _684_50_, _690_39_

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
            var list = ((_690_39_=node.children) != null ? _690_39_ : [])
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
                cell.clss = null
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
        var block, bottom, cell, classes, glyph, glyphs, line, row, x, _749_36_

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
                        glyphs.push({char:block.char,fg:cell.fg,bg:cell.bg,scale:block.scale,node:block.node,clss:block.clss})
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
            glyphs.push({char:cell.char,fg:cell.fg,bg:cell.bg,scale:1,clss:cell.clss})
            x += 1
        }
        line = []
        classes = []
        var list = _k_.list(glyphs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            glyph = list[_a_]
            line.push(glyph.char)
            classes.push(((_749_36_=glyph.clss) != null ? _749_36_ : null))
        }
        return {line:line.join(''),areas:this.areasOfGlyphs(glyphs,y),classes:classes}
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
                row.push({char:' ',fg:null,bg:null,block:null,clss:null})
            }
            grid.push(row)
        }
        this.paintTree(rectree,grid)
        return grid
    }

    layout["paintTree"] = function (node, grid, rows)
    {
        var child, _817_52_, _817_66_, _819_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null) || (node.text != null))
        {
            this.paintNode(node,grid,rows)
        }
        var list = ((_819_35_=node.children) != null ? _819_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid,rows)
        }
    }

    layout["paintNode"] = function (node, grid, rows)
    {
        var cell, chars, classes, gone, i, j, masked, rng, strings, x, y, _824_29_, _833_25_, _835_25_, _844_43_, _854_43_, _857_58_, _858_41_, _859_48_

        if (!(node.regions != null))
        {
            return
        }
        masked = this.channelMaskOf(node)
        strings = null
        classes = null
        if (!_k_.empty(node.pattern))
        {
            strings = fill.pattern(node,node.regions)
        }
        else if ((node.text != null) && this.scaleOf(node) === 1)
        {
            ;[strings,classes] = this.textRows(node)
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
            chars = Array.from(((_844_43_=(strings != null ? strings[i] : undefined)) != null ? _844_43_ : ''))
            for (j = 0; j < (rng[2] - rng[0]); j++)
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_854_43_=masked[`${x},${y}`]) != null ? _854_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    if ((cell.block != null))
                    {
                        this.unblock(grid,cell.block)
                    }
                    cell.char = ((_858_41_=chars[j]) != null ? _858_41_ : ' ')
                    cell.clss = ((_859_48_=(classes != null ? classes[i] != null ? classes[i][j] : undefined : undefined)) != null ? _859_48_ : null)
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
        var ch, chars, classes, clss, rows, x, y

        chars = {}
        classes = {}
        var list = _k_.list(projector.glyphs(node))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            x = list[_a_][0]
            y = list[_a_][1]
            ch = list[_a_][2]
            clss = list[_a_][3]
            chars[`${x},${y}`] = ch
            classes[`${x},${y}`] = clss
        }
        rows = node.regions.map(function (rng)
        {
            var row, _881_47_

            row = ''
            for (x = rng[0]; x < rng[2]; x++)
            {
                row += ((_881_47_=chars[`${x},${rng[1]}`]) != null ? _881_47_ : ' ')
            }
            return row
        })
        clss = node.regions.map(function (rng)
        {
            var row, _887_51_

            row = []
            for (x = rng[0]; x < rng[2]; x++)
            {
                row.push(((_887_51_=classes[`${x},${rng[1]}`]) != null ? _887_51_ : null))
            }
            return row
        })
        return [rows,clss]
    }

    layout["paintScaled"] = function (node, grid, masked, rows)
    {
        var char, chars, clss, rect, scale, x, x1, x2, y, _914_53_

        scale = this.scaleOf(node)
        rect = node.rect.abs
        chars = {}
        var list = _k_.list(projector.glyphs(node))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            x = list[_a_][0]
            y = list[_a_][1]
            char = list[_a_][2]
            clss = list[_a_][3]
            chars[`${x},${y}`] = [char,clss]
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
                    ;[char,clss] = ((_914_53_=chars[`${x},${y}`]) != null ? _914_53_ : [' ',null])
                    this.markBlock(grid,x,y,scale,char,node,clss)
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

    layout["markBlock"] = function (grid, x, y, scale, char, node, clss)
    {
        var block, c, cell, r, _936_54_

        block = {x:x,y:y,scale:scale,char:char,node:node,clss:clss}
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
                    cell.clss = null
                }
            }
        }
    }

    layout["channelMaskOf"] = function (node)
    {
        var channel, channels, child, entry, key, masked, rng, x, _957_35_, _959_39_, _964_37_

        masked = {}
        var list = ((_957_35_=node.children) != null ? _957_35_ : [])
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
            var list1 = ((_964_37_=child.regions) != null ? _964_37_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTtPQUFLLGdCQUFBOztPQUNELFVBQUE7SUFBTTs7T0FDRyxVQUFQOzs7QUFFWCxVQUFEOzs7OztJQWdCSSxRQUFDLHlCQUFZLE9BQU07O1FBRWYsS0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEtBQUssRUFBRSxNQUFNLE1BQU07ZUFFM0M7OztJQUVKLFFBQUMsb0JBQU8sS0FBSTs7OztjQUVNOzttQkFBWjs7K0ZBRXNDLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSzsrRkFDakIsS0FBSyxlQUFPLEtBQUssaUJBQWpCLEtBQUssZUFBTyxLQUFLO1FBRXpELGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBQ3RDLGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBRXRDLGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUN4RCxjQUFVLEdBQUcsSUFBSSxJQUFFLElBQUksS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDeEQsSUFBSSxLQUFDLFlBQVksS0FBSyxFQUFFLElBQUksSUFBRTtRQUU5QixLQUFLLFFBQVEsS0FBSyxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7YUFFL0QsS0FBSzs7WUFDSixTQUFTLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQ0FDdEIsS0FBSzs7O2dCQUFkO2dCQUNB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
//# sourceURL=../../../kode/ked/popo/layout.kode
