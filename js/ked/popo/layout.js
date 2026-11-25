var _k_ = {assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        if (node.flows === false)
        {
            return false
        }
        return !_k_.empty(node.text) || !_k_.empty(node.pattern) || !_k_.empty(node.image)
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
        return noon.stringify(this.plainNode(rectree))
    }

    layout["plainNode"] = function (node)
    {
        var child, key, out, plainChild, value

        out = {}
        for (key in node)
        {
            value = node[key]
            if (_k_.in(key,['rect','title','index','regions','rendered','state','stateText']))
            {
                continue
            }
            if (key === 'children')
            {
                out.children = []
                var list = _k_.list(value)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    child = list[_a_]
                    plainChild = this.plainNode(child)
                    out.children.push(plainChild)
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
        var box, dx, dy, maxRel, newEnd, newRel, oldEnd, oldRel, rect, value, _287_38_, _287_49_, _296_25_, _296_36_, _300_21_, _307_25_, _320_25_, _320_36_, _324_21_, _331_25_

        box = ((_287_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _287_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
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
        var before, box, dh, dw, key, rect, roomH, roomW, step, val, value, _351_38_, _351_49_, _367_21_, _376_21_

        box = ((_351_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _351_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
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
        var index, node, _448_33_

        node = rectree
        var list = _k_.list(path)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            node = (node != null ? (_448_33_=node.children) != null ? _448_33_[index] : undefined : undefined)
        }
        return node
    }

    layout["ownProps"] = function (node)
    {
        var props

        props = this.plainNode(node)
        delete props.children
        return props
    }

    layout["isNodeData"] = function (data)
    {
        var child, key, value, _466_24_

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
            if (!(_k_.in(key,['x','y','w','h','r','b','text','pattern','image','erase','bg','fg','scale','flows','blocks','type','children'])))
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
        var _475_24_

        parent.children = ((_475_24_=parent.children) != null ? _475_24_ : [])
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
        var cells, db, dr, dx, dy, _532_15_, _533_15_, _534_34_, _534_50_, _535_34_, _535_50_

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
        node.x = ((_532_15_=node.x) != null ? _532_15_ : dx)
        node.y = ((_533_15_=node.y) != null ? _533_15_ : dy)
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
        var child, found, _539_35_, _542_35_

        var list = ((_539_35_=node.children) != null ? _539_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (child === target)
            {
                return node
            }
        }
        var list1 = ((_542_35_=node.children) != null ? _542_35_ : [])
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

    layout["insertTextAt"] = function (cells, rectree, pos, text)
    {
        var added, chars, child, node, offset, rect, scale, spare, width, _551_47_, _551_80_, _555_20_, _561_75_, _561_91_, _567_22_

        if (!(rectree != null))
        {
            return
        }
        node = ((_551_47_=this.textNodeAt(cells,rectree,pos)) != null ? _551_47_ : ((_551_80_=this.nodeForPos(cells,rectree,pos)) != null ? _551_80_ : rectree))
        added = Array.from(text)
        width = Array.from(text.split('\n')[0]).length
        if ((node.text != null))
        {
            chars = Array.from(node.text)
            scale = this.scaleOf(node)
            spare = chars.length * scale + scale
            offset = this.textOffsetAt(node,pos)
            node.text = chars.slice(0, typeof offset === 'number' ? offset : -1).concat(added).concat(chars.slice(offset)).join('')
            if (parseInt(node.w) === spare && parseInt(node.h) === scale && !(node.r != null) && !(node.b != null))
            {
                node.w = spare + width * scale
            }
            return {node:node,offset:offset + added.length}
        }
        rect = node.rect.abs
        child = {text:text,x:pos[0] - rect.x,y:pos[1] - rect.y,w:width + 1,h:1}
        node.children = ((_567_22_=node.children) != null ? _567_22_ : [])
        node.children.push(child)
        return {node:child,offset:added.length}
    }

    layout["textNodeAt"] = function (cells, rectree, cell)
    {
        var node, slot, _576_28_, _580_27_

        node = this.nodeForPos(cells,rectree,cell)
        if (((node != null ? node.text : undefined) != null))
        {
            return node
        }
        node = this.nodeForPos(cells,rectree,[cell[0] - 1,cell[1]])
        if (!((node != null ? node.text : undefined) != null))
        {
            return
        }
        var list = _k_.list(this.textSlots(node))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            slot = list[_a_]
            if (slot[0] === cell[0] && slot[1] === cell[1])
            {
                return node
            }
        }
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _591_35_

        if (!(node != null))
        {
            return
        }
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_591_35_=node.children) != null ? _591_35_ : [])
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

    layout["textSlots"] = function (node)
    {
        var regions, scale, _600_31_

        scale = this.scaleOf(node)
        regions = ((_600_31_=node.regions) != null ? _600_31_ : this.intervalsOf(node))
        return fill.flow(node,regions,node.rect.abs).map(function (slot)
        {
            return [slot[0],slot[1] + scale - 1,slot[2],slot[3]]
        })
    }

    layout["textOffsetAt"] = function (node, cell)
    {
        var best, cx, cy, scale, slot, top

        ;[cx,cy] = cell
        scale = this.scaleOf(node)
        top = node.rect.abs.y
        cy = top + Math.floor((cy - top) / scale) * scale + scale - 1
        best = null
        var list = _k_.list(this.textSlots(node))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            slot = list[_a_]
            if (slot[0] === cx && slot[1] === cy)
            {
                return slot[3]
            }
            if (slot[1] < cy || (slot[1] === cy && slot[0] < cx))
            {
                best = slot
            }
        }
        if (!(best != null))
        {
            return 0
        }
        return ((best[2] != null) ? best[3] + 1 : best[3])
    }

    layout["cellForTextOffset"] = function (node, offset)
    {
        var end, final, slot, slots

        slots = this.textSlots(node)
        end = null
        var list = _k_.list(slots)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            slot = list[_a_]
            if (slot[3] !== offset)
            {
                continue
            }
            if ((slot[2] != null))
            {
                return [slot[0],slot[1]]
            }
            end = slot
        }
        if ((end != null))
        {
            return [end[0],end[1]]
        }
        final = slots.slice(-1)[0]
        if ((final != null))
        {
            return [final[0],final[1]]
        }
        return [node.rect.abs.x,node.rect.abs.y + this.scaleOf(node) - 1]
    }

    layout["scaleOf"] = function (node)
    {
        var _642_28_, _644_29_

        if (!(node.text != null))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_644_29_=node.scale) != null ? _644_29_ : 1)))
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
        var area, areas, grid, lines, root, row, y

        root = this.regionize(cells,rectree)
        if (!(root != null))
        {
            return ''
        }
        projector.attach(root)
        root.rendered = {cols:cells.cols,rows:cells.rows}
        grid = this.gridOf(root)
        lines = []
        areas = []
        for (y = 0; y < grid.length; y++)
        {
            row = this.lineOfRow(grid,y)
            lines.push(row.line)
            var list = _k_.list(row.areas)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                area = list[_a_]
                areas.push(area)
            }
        }
        return sue.ensue(lines.join('\n'),areas)
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

    layout["paintTree"] = function (node, grid)
    {
        var child, _778_47_, _780_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_780_35_=node.children) != null ? _780_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, strings, x, y, _785_29_, _801_43_, _811_43_, _814_58_, _815_41_

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
        else if (!_k_.empty(node.text) && this.scaleOf(node) === 1)
        {
            strings = this.textRows(node)
        }
        else if (!_k_.empty(node.text))
        {
            strings = node.regions.map(function (rng)
            {
                return fill.blank(rng[2] - rng[0])
            })
        }
        for (i = 0; i < node.regions.length; i++)
        {
            rng = node.regions[i]
            chars = Array.from(((_801_43_=(strings != null ? strings[i] : undefined)) != null ? _801_43_ : ''))
            for (j = 0; j < (rng[2] - rng[0]); j++)
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_811_43_=masked[`${x},${y}`]) != null ? _811_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    if ((cell.block != null))
                    {
                        this.unblock(grid,cell.block)
                    }
                    cell.char = ((_815_41_=chars[j]) != null ? _815_41_ : ' ')
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
            return this.paintScaled(node,grid,masked)
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
            var row, _834_47_

            row = ''
            for (x = rng[0]; x < rng[2]; x++)
            {
                row += ((_834_47_=chars[`${x},${rng[1]}`]) != null ? _834_47_ : ' ')
            }
            return row
        })
    }

    layout["paintScaled"] = function (node, grid, masked)
    {
        var char, chars, rect, scale, x, x1, x2, y, _857_66_

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
            x = x1
            while (x + scale <= x2)
            {
                if (!this.charMaskedIn(masked,x,y,scale))
                {
                    this.markBlock(grid,x,y,scale,(((_857_66_=chars[`${x},${y}`]) != null ? _857_66_ : ' ')),node)
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
        var block, c, cell, r, _878_54_

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
        var channel, channels, child, entry, key, masked, rng, x, _898_35_, _900_39_, _905_37_

        masked = {}
        var list = ((_898_35_=node.children) != null ? _898_35_ : [])
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
            var list1 = ((_905_37_=child.regions) != null ? _905_37_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTtPQUFLLGdCQUFBOztPQUNELFVBQUE7SUFBTTs7T0FDRyxVQUFQOzs7QUFFWCxVQUFEOzs7OztJQWdCSSxRQUFDLHlCQUFZLE9BQU07O1FBRWYsS0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEtBQUssRUFBRSxNQUFNLE1BQU07ZUFFM0M7OztJQUVKLFFBQUMsb0JBQU8sS0FBSTs7OztjQUVNOzttQkFBWjs7K0ZBRXNDLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSzsrRkFDakIsS0FBSyxlQUFPLEtBQUssaUJBQWpCLEtBQUssZUFBTyxLQUFLO1FBRXpELGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBQ3RDLGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBRXRDLGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbkQsY0FBVSxHQUFHLElBQUksSUFBRSxJQUFJLEtBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNuRCxJQUFJLEtBQUMsWUFBWSxLQUFLLEVBQUUsSUFBSSxJQUFFO1FBRTlCLEtBQUssUUFBUSxLQUFLLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTthQUUvRCxLQUFLOztZQUNKLFNBQVMsRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dDQUN0QixLQUFLOzs7Z0JBQWQ7Z0JBQ0EsS0FBQyxNQUFNLE1BQU07OztlQUVyQjs7O0lBS0osUUFBQywwQkFBYSxNQUFLLEdBQUU7Ozs7UUFFakIsUUFBUSxLQUFDLFFBQVE7WUFFVixTQUFTOzttQkFBZDs7YUFFaUIsS0FBSzs7WUFBeEIsWUFBUSxNQUFNOztRQUNkLFlBQVEsRUFBRTtlQUNWLElBQUksSUFBSTs7O0lBU1osUUFBQywwQkFBYTs7OztRQUVWLElBQUksb0NBQW9DLEtBQUssUUFBTyxlQUFBLE9BQU87Y0FFbEQ7Ozs7c0JBQ0UsRUFBRSxpQkFBYSxFQUFFOzs7O1FBRTVCLGtCQUFjLEVBQUUsZ0JBQVMsRUFBRSxnQkFBVSxFQUFFLE1BQU07WUFFMUMsRUFBRSxHQUFHLFNBQVM7O29CQUNWLEVBQUUsRUFBRSxHQUFHLE1BQU07O1FBRXBCLHFCQUFjLEVBQUUsZ0JBQVUsRUFBRSxNQUFNO2dCQUVqQyxFQUFFLFFBQU0sTUFBTSxNQUFNOzs7SUFFekIsUUFBQyx5QkFBWTs7OztlQUVHLGVBQUEsS0FBTTs7bUJBQWhCOztRQUVGLGdCQUFZLHFCQUFNLEtBQUssMkJBQVE7WUFFWCxTQUFTOzttQkFBM0IsT0FBTyxLQUFLOztZQUVzQixVQUFWLEtBQUssTUFBYSxLQUFLLEVBQUUsU0FBUzs7c0JBQXZELEtBQUssS0FBSzs7MEJBRVIsc0JBQVksS0FBSyxLQUFLLFdBQVc7OztJQUU1QyxRQUFDLHFCQUFRLFFBQU87O3dCQUVLOzttQkFBZjs7WUFFVSxVQUFUOztnQkFDSSxNQUFNLFNBQVM7O2dCQUNkLFFBQVEsa0JBQWEsU0FBUzs7NEJBQzVCOztlQUVWOzs7SUFFSixRQUFDLHFCQUFRLE9BQU0sT0FBTSxHQUFFOzt1QkFFUzs7bUJBQTFCLEtBQUMsT0FBTyxNQUFNOzt1QkFFOEI7O21CQUE1QyxRQUFRLFNBQVMsS0FBQyxPQUFPLE1BQU07O2VBRWpDLFFBQVE7OztJQUVaLFFBQUMsd0JBQVcsT0FBTTs7Y0FFTDs7OztRQUVULEtBQUMsV0FBVyxNQUFNO1FBRWxCLEtBQUMsV0FBVyxTQUFTLEtBQUMsV0FBVztlQUVqQzs7O0lBRUosUUFBQyx5QkFBWTs7OztRQUVUO1lBRW1CLEtBQUssVUFBVyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQU0sS0FBSyxLQUFLLElBQUksSUFBSTs7WUFBN0UsTUFBTSxLQUFLOzs4QkFFRSxLQUFLOzs7WUFBZDtpQ0FDYSxLQUFDLFdBQVc7OztnQkFBckI7Z0JBQ0EsTUFBTSxLQUFLOzs7ZUFFbkI7OztJQUVKLFFBQUMseUJBQVksTUFBSyxVQUFTOzs7O1FBRXZCLEtBQUssVUFBVSxLQUFDLFlBQVk7WUFFekIsS0FBQyxNQUFNOztnQ0FDUzs7O2dCQUFYO29CQUNZLFlBQVc7O29CQUF2Qjs7MkJBQ1ksUUFBVzs7b0JBQXZCOztnQkFDQSxLQUFLLFVBQVUsS0FBQyxNQUFNLEtBQUssUUFBUTs7OytCQUU5QixLQUFLOzs7WUFBZDtZQUNBLEtBQUMsV0FBVyxNQUFNLFNBQVMsVUFBVSxRQUFROzs7O0lBRXJELFFBQUMsb0JBQU87O1lBRU8sS0FBSyxVQUFTOzttQkFBdkI7OzBCQUVJLEtBQUssb0JBQWMsS0FBSyx1QkFBaUIsS0FBSzs7O0lBRXhELFFBQUMsMEJBQWE7Ozs7UUFFVixPQUFPLEtBQUssS0FBSztRQUVqQixNQUFNLEtBQUs7UUFDWCxNQUFNLEtBQUssSUFBSSxLQUFLO1FBRXBCO2FBQ0ksSUFBSyxTQUFNOztZQUNYLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRSxLQUFLLElBQUUsS0FBSzs7ZUFDbkM7OztJQUVKLFFBQUMsb0JBQU8sV0FBVTs7OztRQUVkLE9BQU8sUUFBUSxLQUFLO1FBRXBCLE1BQU0sS0FBSztRQUNYLE1BQU0sS0FBSyxJQUFJLEtBQUs7UUFDcEIsTUFBTSxLQUFLO1FBQ1gsTUFBTSxLQUFLLElBQUksS0FBSztRQUVwQjs0QkFFVzs7O1lBQVA7WUFFQSxLQUFLLElBQUk7WUFDVCxJQUFLLElBQUk7WUFDVCxLQUFLLElBQUk7Z0JBRU4sSUFBSSxPQUFPLEtBQUssT0FBTyxPQUFPLE1BQU0sT0FBTzs7Z0JBQzFDLElBQUksS0FBSztnQkFDVDs7Z0JBRW1CLEtBQUs7O2dCQUE1QixJQUFJLE1BQU0sR0FBRyxFQUFFOztnQkFDUSxNQUFNOztnQkFBN0IsSUFBSSxNQUFNLElBQUksRUFBRTs7O2VBRXBCOzs7SUFFSixRQUFDLDBCQUFhOzs7O1FBRVYsT0FBTyxLQUFDLE9BQU87Y0FFSDs7bUJBQVY7O1FBRUY7NEJBQ1c7OztZQUFQO1lBQ0E7aUNBQ1k7OztnQkFBUjtvQkFDRyxLQUFLLFNBQVE7O29CQUNaLE1BQU0sS0FBSzs7OztvQkFFWCxNQUFNLEtBQUssS0FBSzs7O1lBQ3hCLE1BQU0sS0FBSyxNQUFNLEtBQUs7O2VBRTFCLE1BQU0sS0FBSzs7O0lBRWYsUUFBQyxxQkFBUTs7OztjQUVTOzttQkFBWjs7YUFFRSxPQUFPOztnQkFDZ0IsUUFBTzs7d0JBQTNCLFVBQVU7OztlQUVqQjs7O0lBRUosUUFBQyxzQkFBUyxPQUFNOzs7O1FBRVosS0FBQyxXQUFXLE1BQU07ZUFFWCxLQUFLOzhCQUVDLEtBQUs7OztZQUFkO1lBQ0EsS0FBQyxRQUFRLE1BQU07O2VBRW5COzs7SUFFSixRQUFDLHNCQUFTLE1BQUs7Ozs7Y0FFRjs7OztRQUVULEtBQUssaUJBQWEsUUFBTSxLQUFLLEtBQUMsT0FBTzs4QkFFeEIsS0FBSzs7O1lBQWQ7WUFDQSxLQUFDLFFBQVEsTUFBTSxRQUFNOzs7O0lBRTdCLFFBQUMscUJBQVE7Ozs7MEJBQVEsS0FBQyxPQUFPLDBDQUFlLEtBQUssYUFBWSxRQUFROzs7SUFFakUsUUFBQyxxQkFBUTs7OztvQkFFUSxRQUFPLE9BQU0sVUFBUyxLQUFJOzs7WUFBbkM7aUJBQ1UsS0FBSzs7dUJBQWI7OztlQUVOOzs7SUFFSixRQUFDLG9CQUFPOzs7O1FBRUosT0FBTyxLQUFDLE9BQU87YUFFQzs7bUJBQWQsS0FBSzs7OztJQUVYLFFBQUMsdUJBQVU7O2NBRUs7O21CQUFWOztlQUVGLEtBQUssVUFBVSxLQUFDLFVBQVU7OztJQUU5QixRQUFDLHdCQUFXOzs7O1FBRVI7YUFFSSxPQUFhOztZQUFULFFBQVM7dUJBQ0QsS0FBUSxPQUFPLFFBQVEsUUFBUSxVQUFVLFdBQVcsUUFBUTs7Z0JBQXhFOztnQkFDRyxRQUFPOztnQkFDTixJQUFJO29DQUNTOzs7b0JBQVQ7b0JBQ0EsYUFBYSxLQUFDLFVBQVU7b0JBQ3hCLElBQUksU0FBUyxLQUFLOzs7OztnQkFFdEIsSUFBSSxPQUFPOzs7ZUFFbkI7OztJQUVKLFFBQUMseUJBQVksT0FBTSxTQUFROztRQUV2QixLQUFDLFdBQVcsTUFBTTtlQUNsQixLQUFDLFVBQVUsUUFBUTs7O0lBRXZCLFFBQUMsdUJBQVUsT0FBTSxTQUFRLE1BQUs7Ozs7UUFFMUIsa0JBQU8sS0FBQyxTQUFTLFFBQVEsZ0JBQWxCLEtBQUMsU0FBUyxRQUFRLE1BQU8sS0FBSyx3Q0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxLQUFLLEVBQUUsTUFBTTtRQUN6RSxPQUFPLEtBQUssS0FBSztnQkFFVjs7aUJBQ0g7Z0JBQVUsS0FBSzs7aUJBQ2Y7Z0JBQVUsS0FBTTs7aUJBQ2hCO2dCQUFVLEtBQUs7O2lCQUNmO2dCQUFVLEtBQU07Ozs7WUFFakIsUUFBUSxLQUFLLGVBQU0sS0FBSzs7WUFFdkIsaUJBQWEsR0FBRyxJQUFJLElBQUksS0FBSztpQkFFMUIsS0FBSzs7Z0JBQ0osUUFBUSxLQUFDLFVBQVUsS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFO3FCQUM3Qzs7b0JBQVMsS0FBSyxJQUFJOzs7OztnQkFFckIsU0FBUyxLQUFLLElBQUksSUFBSTtnQkFDdEIsU0FBUyxTQUFTO3FCQUVmLEtBQUs7O29CQUNKLFFBQVEsS0FBQyxVQUFVLEtBQUssRUFBRSxPQUFPLEdBQUcsRUFBRTt5QkFDbkM7O3dCQUNDLFNBQVMsS0FBQyxPQUFPLElBQUksRUFBRTt3QkFDdkIsS0FBSyxJQUFJO3dCQUNULEtBQUssSUFBSSxVQUFVLFNBQVM7Ozs7O29CQUVoQyxRQUFRLEtBQUMsVUFBVSxLQUFLLEVBQUUsUUFBUSxHQUFHLEVBQUU7eUJBQ3BDOzt3QkFDQyxTQUFTLEtBQUMsT0FBTyxJQUFJLEVBQUU7d0JBQ3ZCLEtBQUssSUFBSTt3QkFDVCxLQUFLLElBQUksU0FBUzs7Ozs7WUFFL0IsUUFBUSxLQUFLLGVBQU0sS0FBSzs7WUFFdkIsaUJBQWEsR0FBRyxJQUFJLElBQUksS0FBSztpQkFFMUIsS0FBSzs7Z0JBQ0osUUFBUSxLQUFDLFVBQVUsS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFO3FCQUM3Qzs7b0JBQVMsS0FBSyxJQUFJOzs7OztnQkFFckIsU0FBUyxLQUFLLElBQUksSUFBSTtnQkFDdEIsU0FBUyxTQUFTO3FCQUVmLEtBQUs7O29CQUNKLFFBQVEsS0FBQyxVQUFVLEtBQUssRUFBRSxPQUFPLEdBQUcsRUFBRTt5QkFDbkM7O3dCQUNDLFNBQVMsS0FBQyxPQUFPLElBQUksRUFBRTt3QkFDdkIsS0FBSyxJQUFJO3dCQUNULEtBQUssSUFBSSxVQUFVLFNBQVM7Ozs7O29CQUVoQyxRQUFRLEtBQUMsVUFBVSxLQUFLLEVBQUUsUUFBUSxHQUFHLEVBQUU7eUJBQ3BDOzt3QkFDQyxTQUFTLEtBQUMsT0FBTyxJQUFJLEVBQUU7d0JBQ3ZCLEtBQUssSUFBSTt3QkFDVCxLQUFLLElBQUksU0FBUzs7Ozs7dUJBRXpCOztZQUVMLEtBQUMsV0FBVyxNQUFNO21CQUNoQjs7OztJQUVWLFFBQUMseUJBQVksT0FBTSxTQUFRLE1BQUs7Ozs7UUFFNUIsa0JBQU8sS0FBQyxTQUFTLFFBQVEsZ0JBQWxCLEtBQUMsU0FBUyxRQUFRLE1BQU8sS0FBSyx3Q0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxLQUFLLEVBQUUsTUFBTTtRQUN6RSxPQUFPLEtBQUssS0FBSztRQUNqQixPQUFPLEtBQUMsUUFBUTtRQUNoQixRQUFRLElBQUksS0FBSyxLQUFLLElBQUksSUFBSTtRQUM5QixRQUFRLElBQUksS0FBSyxLQUFLLElBQUksSUFBSTtnQkFFdkI7O2lCQUNIO2dCQUFjLE1BQU07O2lCQUNwQjtnQkFBYyxLQUFNOztpQkFDcEI7Z0JBQWMsTUFBTTs7aUJBQ3BCO2dCQUFjLEtBQU07Ozs7UUFFeEIsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUs7WUFFekM7O2lCQUVJLEtBQUs7O2dCQUNKLFFBQVEsS0FBQyxVQUFVLEtBQUssS0FBSyxFQUFFLEdBQUcsS0FBSztxQkFDcEM7O29CQUFTLEtBQUssSUFBSTs7Ozs7Z0JBRXJCLFFBQVEsS0FBQyxVQUFVLEtBQUssRUFBRSxRQUFNLEtBQUssR0FBRyxHQUFHLEVBQUUsUUFBTTtxQkFDaEQ7O29CQUFTLEtBQUssSUFBSTs7OztZQUUxQjs7aUJBRUksS0FBSzs7Z0JBQ0osUUFBUSxLQUFDLFVBQVUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUs7cUJBQ3RDOztvQkFBUyxLQUFLLElBQUk7Ozs7O2dCQUVyQixRQUFRLEtBQUMsVUFBVSxLQUFLLEVBQUUsUUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLFFBQU07cUJBQ2hEOztvQkFBUyxLQUFLLElBQUk7Ozs7d0JBRWQ7Ozs7UUFFZixLQUFDLFdBQVcsTUFBTTtZQUVmLEtBQUssS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLEtBQUssSUFBSSxJQUFJOztpQkFFdkMsT0FBVzs7Z0JBQVAsTUFBTztrQkFDUixlQUFPLEtBQUssT0FBTyxhQUFnQixLQUFLOztZQUUvQyxLQUFDLFdBQVcsTUFBTTs7O2VBR3RCOzs7SUFLSixRQUFDLHdCQUFXLE1BQUssS0FBSSxLQUFJLE1BQUs7Ozs7WUFFMEIsVUFBVixLQUFLLE1BQWEsS0FBSyxFQUFFLFNBQVM7O21CQUExRSxLQUFDLFVBQVUsS0FBSyxFQUFFLElBQUksSUFBSSxLQUFLOztRQUVqQyxLQUFJLE1BQU0sZ0JBQVcsTUFBTSxRQUFRLEtBQUssa0JBQWEsTUFBTSxRQUFRLEtBQUs7UUFDeEUsY0FBVSxlQUFVLE9BQU8sUUFBTSxLQUFLO1lBRS9CLE1BQUssT0FBUSxlQUFTLEtBQUs7O21CQUFoQzs7OztJQUVOLFFBQUMsd0JBQVcsT0FBTSxLQUFJLEtBQUksTUFBSzs7OztZQUVmLFVBQVQsVUFBaUIsTUFBTSxTQUFTOztZQUMvQixlQUFVLFdBQVUsTUFBTSxJQUFJLElBQUk7aUJBQ25CLEtBQUssT0FBQSxPQUFPOzswQkFBdEI7Ozs7O1lBRUwsZ0JBQVksS0FBSyxLQUFLLE1BQUk7Z0JBQ2pCLFFBQU87O3VCQUFkOzs7OztJQUVWLFFBQUMseUJBQVksU0FBUTs7OztRQUVqQixTQUFTLEtBQUMsU0FBUyxRQUFRO2NBRWxCOzs7O1FBRVQsT0FBTyxTQUFTLE9BQU8sT0FBTyxTQUFTLFFBQVEsTUFBTTtzQkFDckIsT0FBTzs7bUJBQWhDLE9BQU87O2VBRWQ7OztJQUVKLFFBQUMscUJBQVEsU0FBUTs7OztZQUVMLFNBQVE7Ozs7UUFFaEIsU0FBUyxLQUFDLFNBQVMsUUFBUTtjQUVsQjs7OztRQUVULE9BQU8sS0FBQyxPQUFPLFFBQVE7Y0FFZDs7OztlQUVULEtBQUssUUFBUSxPQUFPLFNBQVMsUUFBUTs7O0lBRXpDLFFBQUMseUJBQVksU0FBUTs7OztRQUVqQixPQUFPOzRCQUVNOzs7WUFBVDtZQUNBLFFBQU8seUJBQUEsS0FBTSw2QkFBVTs7ZUFFM0I7OztJQUVKLFFBQUMsdUJBQVU7Ozs7UUFFUCxRQUFRLEtBQUMsVUFBVTtlQUNaLE1BQU07ZUFDYjs7O0lBRUosUUFBQyx5QkFBWTs7OztjQUVNLGlCQUFpQixVQUFSLFNBQWUsT0FBTyxVQUFTOzttQkFBckQ7O3NCQUNlOzttQkFBZjs7YUFFRSxPQUFhOztZQUFULFFBQVM7eUJBQ0YsS0FBWSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLFVBQVUsUUFBUSxRQUFRLEtBQUssS0FBSyxRQUFRLFFBQVEsU0FBUyxPQUFPOzt1QkFBeEg7OzthQUVILEtBQUs7O2tCQUM2QixVQUFqQixLQUFLOzt1QkFBbkI7O2dDQUNXLEtBQUs7OztnQkFBZDtxQkFDZSxLQUFDLFdBQVc7OzJCQUF6Qjs7OztlQUVWOzs7SUFFSixRQUFDLDBCQUFhLFFBQU87Ozs7UUFFakIsT0FBTyxzQkFBUCxPQUFPO1FBQ1AsT0FBTyxTQUFTLEtBQUs7ZUFFckI7OztJQUVKLFFBQUMsd0JBQVcsU0FBUSxNQUFLOzs7O1FBRXJCLFNBQVMsS0FBQyxTQUFTLFFBQVE7Y0FFWjs7bUJBQWI7O1FBRUYsV0FBVyxPQUFPO1FBQ2xCLFFBQVcsU0FBUyxRQUFRO1FBQzVCLFVBQVcsUUFBTyxPQUFPLFFBQU0sSUFBSSxRQUFNO2FBRXRDLEtBQUssVUFBQSxTQUFTLFNBQVM7O1lBRXRCLFFBQVEsU0FBUzsyQkFFUixNQUFNOztnQkFDWCxLQUFDLFFBQVEsS0FBSyxPQUFPLEtBQUssSUFBSSxNQUFNLEtBQUs7Z0JBQ3pDLFNBQVMsT0FBTyxNQUFNO2dCQUNuQixRQUFPLE9BQU8sTUFBTSxTQUFTLEtBQUssUUFBVSxNQUFNLFNBQVMsUUFBUTs7OztnQkFFdEUsU0FBUyxPQUFPLE1BQU07Z0JBQ3RCLFNBQVMsT0FBTyxPQUFPLEVBQUU7O21CQUUzQjs7UUFFTixRQUFRLEtBQUMsU0FBUyxRQUFRO2NBRVg7O21CQUFiOztRQUVGLEtBQUMsUUFBUSxLQUFLLE9BQU8sS0FBSyxJQUFJLE1BQU0sS0FBSztRQUV6QyxTQUFTLE9BQU8sTUFBTTtzQkFDVTs7bUJBQXpCLE9BQU87O1FBRWQsS0FBSyxNQUFNLFNBQVMsUUFBUTtRQUM1QixNQUFNLFNBQVMsU0FBUSxRQUFPLE9BQU8sS0FBSyxLQUFHLElBQUcsRUFBRTtlQUVsRDs7O0lBRUosUUFBQyxzQkFBUyxNQUFLLE1BQUs7Ozs7UUFFaEIsS0FBSyxLQUFLLElBQUksR0FBRztRQUNqQixLQUFLLEtBQUssSUFBSSxHQUFHO1FBQ2pCLE1BQU0sR0FBRyxJQUFJLEdBQUcsTUFBTSxLQUFLLElBQUksS0FBSztRQUNwQyxNQUFNLEdBQUcsSUFBSSxHQUFHLE1BQU0sS0FBSyxJQUFJLEtBQUs7UUFFcEMsa0JBQVM7O29CQUFVLG9CQUF5QixVQUFUOztZQUVYLE1BQU0sS0FBSzs7WUFBbkMsS0FBSyxJQUFJLEtBQUssSUFBSTs7WUFDTSxNQUFNLEtBQUs7O1lBQW5DLEtBQUssSUFBSSxLQUFLLElBQUk7O1lBQ00sTUFBTSxLQUFLOztZQUFuQyxLQUFLLElBQUksS0FBSyxJQUFJOztZQUNNLE1BQU0sS0FBSzs7WUFBbkMsS0FBSyxJQUFJLEtBQUssSUFBSTs7UUFFbEIsS0FBSyxlQUFMLEtBQUssd0JBQUs7UUFDVixLQUFLLGVBQUwsS0FBSyx3QkFBSztjQUNVLEtBQUssZ0JBQVcsS0FBSzs7WUFBekMsS0FBSyxJQUFLOztjQUNVLEtBQUssZ0JBQVcsS0FBSzs7bUJBQXpDLEtBQUssSUFBSzs7OztJQUVkLFFBQUMsdUJBQVUsTUFBSzs7Ozs4QkFFQyxLQUFLOzs7WUFBZDtnQkFDVSxVQUFTOzt1QkFBakI7OzsrQkFFTyxLQUFLOzs7WUFBZDtnQkFDRyxRQUFRLEtBQUMsU0FBUyxNQUFNOzt1QkFDckI7OztlQUNWOzs7SUFFSixRQUFDLDJCQUFjLE9BQU0sU0FBUSxLQUFJOzs7O2NBRXBCOzs7O1FBRVQsa0JBQVEsS0FBQyxXQUFXLE1BQU0sUUFBUSxzQ0FBTyxLQUFDLFdBQVcsTUFBTSxRQUFRLDJCQUFPO1FBQzFFLFFBQVEsTUFBTSxLQUFLO1FBQ25CLFFBQVEsTUFBTSxLQUFLLEtBQUssTUFBTSxNQUFNLElBQUk7YUFFckMsS0FBSzs7WUFDSixRQUFTLE1BQU0sS0FBSyxLQUFLO1lBQ3pCLFFBQVMsS0FBQyxRQUFRO1lBQ2xCLFFBQVMsTUFBTSxTQUFTLFFBQVE7WUFDaEMsU0FBUyxLQUFDLGFBQWEsS0FBSztZQUM1QixLQUFLLE9BQU8sWUFBTSxVQUFJLHNCQUFBLGFBQVEsT0FBTyxPQUFPLE9BQU8sWUFBTSxTQUFXLEtBQUs7eUJBQ2xFLEtBQUssT0FBTSxrQkFBYyxLQUFLLE9BQU0sV0FBYyxLQUFLLGdCQUFXLEtBQUs7O2dCQUMxRSxLQUFLLElBQUksUUFBUSxRQUFROztvQkFDM0IsS0FBSyxLQUFLLE9BQU8sU0FBTyxNQUFNOztRQUVwQyxPQUFRLEtBQUssS0FBSztRQUNsQixTQUFTLEtBQUssS0FBSyxFQUFFLElBQUksS0FBRyxLQUFLLEVBQUUsRUFBRSxJQUFJLEtBQUcsS0FBSyxFQUFFLEVBQUUsUUFBTSxFQUFFLEVBQUU7UUFDL0QsS0FBSyxzQkFBTCxLQUFLO1FBQ0wsS0FBSyxTQUFTLEtBQUs7Z0JBRW5CLEtBQUssTUFBTSxPQUFPLE1BQU07OztJQUU1QixRQUFDLHlCQUFZLE9BQU0sU0FBUTs7OztRQUV2QixPQUFPLEtBQUMsV0FBVyxNQUFNLFFBQVE7Y0FFdkIsZUFBQSxLQUFNOzttQkFBZDs7UUFFRixPQUFPLEtBQUMsV0FBVyxNQUFNLFNBQVMsS0FBSyxLQUFHLEVBQUUsS0FBSztlQUV4QyxlQUFBLEtBQU07Ozs7NEJBRUgsS0FBQyxVQUFVOzs7WUFBbkI7Z0JBQ1UsS0FBSyxPQUFNLEtBQUssTUFBTyxLQUFLLE9BQU0sS0FBSzs7dUJBQS9DOzs7OztJQUVWLFFBQUMsd0JBQVcsTUFBSzs7OztjQUVKOzs7O1lBRU8sS0FBQyxNQUFNLEtBQUs7O1lBQTVCLFFBQVE7OzhCQUVLLEtBQUs7OztZQUFkO2dCQUNHLE1BQU0sS0FBQyxVQUFVLE1BQU07O2dCQUN0QixRQUFROzs7ZUFFaEI7OztJQUVKLFFBQUMsd0JBQVc7Ozs7UUFFUixRQUFVLEtBQUMsUUFBUTtRQUNuQixxQkFBVSxLQUFLLDhCQUFVLEtBQUMsWUFBWTtlQUV0QyxLQUFLLEtBQUssS0FBSyxRQUFRLEtBQUssS0FBSyxLQUFLLGNBQUs7O29CQUFVLEtBQUssR0FBRyxLQUFLLEtBQUcsUUFBTSxFQUFFLEtBQUssR0FBRyxLQUFLOzs7O0lBRTlGLFFBQUMsMkJBQWMsTUFBSzs7OztVQUVmLEdBQUcsTUFBTTtRQUVWLFFBQVEsS0FBQyxRQUFRO1FBQ2pCLE1BQVEsS0FBSyxLQUFLLElBQUk7UUFDdEIsS0FBUSxrQkFBYSxLQUFLLE9BQU8sU0FBUyxRQUFRLFFBQU07UUFFeEQsT0FBTzs0QkFFSyxLQUFDLFVBQVU7OztZQUFuQjtnQkFDRyxLQUFLLE9BQU0sTUFBTyxLQUFLLE9BQU07O3VCQUFPLEtBQUs7O2dCQUN6QyxLQUFLLEtBQUssT0FBTyxLQUFLLE9BQU0sTUFBTyxLQUFLLEtBQUs7O2dCQUFNLE9BQU87OztjQUV0RDs7bUJBQVQ7O2lCQUVGLEtBQUssY0FBTSxLQUFLLEtBQUcsSUFBSSxLQUFLOzs7SUFFaEMsUUFBQyxnQ0FBbUIsTUFBSzs7OztRQUVyQixRQUFRLEtBQUMsVUFBVTtRQUNuQixNQUFROzRCQUVJOzs7WUFBUjtnQkFDWSxLQUFLLE9BQU07O2dCQUF2Qjs7aUJBQ0csS0FBSzs7d0JBQVMsS0FBSyxHQUFHLEtBQUs7O1lBQzlCLE1BQU07O2FBRVc7O29CQUFsQixJQUFJLEdBQUcsSUFBSTs7UUFFZCxRQUFRO2FBRWlCOztvQkFBdEIsTUFBTSxHQUFHLE1BQU07O2dCQUVqQixLQUFLLEtBQUssSUFBSSxFQUFFLEtBQUssS0FBSyxJQUFJLElBQUUsS0FBQyxRQUFRLFFBQU07OztJQUVwRCxRQUFDLHNCQUFTOzs7O2NBRUssS0FBSzs7bUJBQWQ7O3VCQUVFLHNCQUFNLEtBQUssNEJBQVE7OztJQUUzQixRQUFDLG9CQUFPLE1BQUs7Ozs7UUFFVCxPQUFPLEtBQUssS0FBSztRQUNqQixJQUFPLElBQUk7UUFDWCxJQUFPLElBQUk7ZUFFVCxLQUFLLEtBQUssS0FBTSxJQUFJLEtBQUssSUFBRSxLQUFLLEtBQU0sS0FBSyxLQUFLLEtBQU0sSUFBSSxLQUFLLElBQUUsS0FBSzs7O0lBRTVFLFFBQUMscUJBQVEsT0FBTTs7OztRQUVYLE9BQU8sS0FBQyxVQUFVLE1BQU07Y0FFWjs7bUJBQVY7O1FBRUYsVUFBVSxPQUFPO1FBRWpCLEtBQUssWUFBWSxLQUFLLE1BQU0sS0FBSyxLQUFLLE1BQU07UUFFNUMsT0FBUSxLQUFDLE9BQU87UUFDaEI7UUFDQTthQUVJLElBQUssT0FBSSxLQUFLOztZQUVkLE1BQU0sS0FBQyxVQUFVLEtBQUs7WUFFdEIsTUFBTSxLQUFLLElBQUk7Z0NBRUgsSUFBSTs7O2dCQUFaO2dCQUNBLE1BQU0sS0FBSzs7O2VBRW5CLElBQUksTUFBTSxNQUFNLEtBQUssTUFBTTs7O0lBRS9CLFFBQUMsd0JBQVksTUFBSzs7OztRQUVkLE1BQVMsS0FBSztRQUNkO1FBQ0EsSUFBUztlQUVILElBQUksSUFBSTs7WUFFVixPQUFRLElBQUk7WUFDWixRQUFRLEtBQUs7MkJBRUo7O2dCQUVMLFNBQVMsTUFBTSxJQUFJLE1BQU0sUUFBUTtvQkFFOUIsV0FBVTs7d0JBRU4sTUFBTSxNQUFLOzt3QkFDVixPQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsTUFBTSxNQUFNLE1BQU0sS0FBSyxNQUFNO3dCQUNoRixLQUFLLE1BQU07Ozs7d0JBRVgsS0FBSzs7b0JBRVQ7O2dCQUVKLE9BQU8sTUFBTSxLQUFLLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsTUFBTTtnQkFDbEQsS0FBSztnQkFDTDs7WUFFSixPQUFPLE1BQU0sS0FBSyxLQUFLLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsTUFBTTtZQUN4RCxLQUFLOztRQUVUOzRCQUNhOzs7WUFBVDtZQUNBLEtBQUssS0FBSyxNQUFNOztnQkFFbkIsS0FBSyxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUMsY0FBYyxPQUFPOzs7SUFFcEQsUUFBQyw0QkFBZ0IsUUFBTzs7OztRQUVwQjtxQkFFd0IsSUFBSSxTQUFTLE9BQU8sSUFBSSxTQUFTOzs7WUFBcEQ7WUFBSztZQUVOLElBQUk7bUJBRUUsSUFBSSxPQUFPOztnQkFFYixRQUFRLE9BQU8sR0FBRztnQkFDbEIsUUFBUTt1QkFFRixJQUFFLFFBQVEsT0FBTyxVQUFXLE9BQU8sSUFBRSxPQUFPLGFBQVk7O29CQUMxRCxTQUFTOzsrQkFFNEM7O29CQUF6RCxNQUFNLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEtBQUssTUFBTSxFQUFFOztnQkFFeEMsS0FBSzs7O1FBRWIsSUFBSTtlQUVFLElBQUksT0FBTzs7WUFFYixRQUFRLE9BQU8sR0FBRztnQkFFZixTQUFTOztnQkFDUixLQUFLO2dCQUNMOztZQUVKLElBQUksSUFBRTttQkFDQSxJQUFJLE9BQU8sVUFBVyxPQUFPLEdBQUcsVUFBUyxTQUFVLE9BQU8sR0FBRyxTQUFRLE9BQU8sR0FBRzs7Z0JBQ2pGLEtBQUs7O1lBRVQsTUFBTSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxJQUFJLE1BQU0sR0FBRyxFQUFFO1lBQzFDLE1BQU0sTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sSUFBSSxNQUFNLEdBQUcsRUFBRSxJQUFJO1lBRTlDLElBQUk7O2VBRVI7OztJQUVKLFFBQUMscUJBQVE7Ozs7Y0FFSTs7OztRQUVUO1FBQ0EsT0FBTyxRQUFRLEtBQUs7YUFFaEIsSUFBSyxPQUFJLEtBQUs7O1lBQ2Q7aUJBQ0ksSUFBSyxPQUFJLEtBQUs7O2dCQUNkLElBQUksTUFBTSxLQUFLLElBQUksR0FBRyxLQUFLLEdBQUcsS0FBSyxNQUFNOztZQUM3QyxLQUFLLEtBQUs7O1FBQ2QsS0FBQyxVQUFVLFFBQVE7ZUFFbkI7OztJQUVKLFFBQUMsd0JBQVcsTUFBSzs7OztjQUVKOzs7O2NBRW9CLEtBQUs7O1lBQWxDLEtBQUMsVUFBVSxLQUFLOzs4QkFFSCxLQUFLOzs7WUFBZDtZQUNBLEtBQUMsVUFBVSxNQUFNOzs7O0lBRXpCLFFBQUMsd0JBQVcsTUFBSzs7OztjQUVKLEtBQUs7Ozs7UUFFZCxTQUFTLEtBQUMsY0FBYztRQUV4QixVQUFVO3VCQUVELEtBQUs7O1lBQ1YsVUFBVSxLQUFLLFFBQVEsS0FBSyxLQUFLOzs0QkFDdkIsS0FBSyxTQUFTLEtBQUMsUUFBUSxVQUFTOztZQUMxQyxVQUFVLEtBQUMsU0FBUzs7NEJBQ1YsS0FBSzs7WUFDZixVQUFVLEtBQUssUUFBUSxjQUFLOzt1QkFBUSxLQUFLLE1BQU0sSUFBSSxLQUFLLElBQUk7OzthQUU1RCxJQUFLLE9BQUksS0FBSyxRQUFROztZQUV0QixNQUFRLEtBQUssUUFBUTtZQUNyQixRQUFRLE1BQU0saUJBQUssa0JBQUEsUUFBUyxzQ0FBSztpQkFFN0IsSUFBSyxRQUFLLElBQUksS0FBSyxJQUFJOztnQkFFdkIsSUFBSSxJQUFJLEtBQUs7Z0JBQ2IsSUFBSSxJQUFJO29CQUVJLElBQUksS0FBSyxJQUFJLEtBQUssS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLEdBQUc7O29CQUEvRDs7Z0JBRUEsT0FBTyxLQUFLLEdBQUc7Z0JBQ2Ysa0JBQU8sVUFBVSxLQUFLOytCQUViLGFBQWdCLEtBQUs7O3lCQUNFLEtBQUs7O3dCQUFqQyxLQUFDLFFBQVEsS0FBSyxLQUFLOztvQkFDbkIsS0FBSyxrQkFBTyxNQUFNLHlCQUFLOzsrQkFFQSxLQUFLLFFBQVcsS0FBSzs7b0JBQWhELEtBQUssS0FBSyxLQUFLOzsrQkFDWSxLQUFLLFFBQVcsS0FBSzs7b0JBQWhELEtBQUssS0FBSyxLQUFLOzs7O1lBRVUsS0FBQyxRQUFRLFFBQVE7O21CQUFsRCxLQUFDLFlBQVksS0FBSyxLQUFLOzs7O0lBSTNCLFFBQUMsdUJBQVU7Ozs7UUFFUDs0QkFFZ0IsVUFBVSxPQUFPOzs7WUFBNUI7WUFBRTtZQUFFO1lBQ0wsU0FBUyxLQUFLLE9BQU87O2VBRXpCLEtBQUssUUFBUSxjQUFLOzs7O1lBQ2QsTUFBTTtpQkFDRixJQUFLLElBQUksUUFBSyxJQUFJOztnQkFDbEIsa0JBQU8sU0FBUyxLQUFLLElBQUksNEJBQVE7O21CQUNyQzs7OztJQU1SLFFBQUMsMEJBQWEsTUFBSyxNQUFLOzs7O1FBRXBCLFFBQVEsS0FBQyxRQUFRO1FBQ2pCLE9BQVEsS0FBSyxLQUFLO1FBQ2xCOzRCQUVrQixVQUFVLE9BQU87OztZQUE5QjtZQUFFO1lBQUU7WUFDTCxTQUFTLEtBQUssT0FBTzs7NkJBRVIsS0FBSyxNQUFNLEtBQUssS0FBSyxRQUFROzs7WUFBekM7WUFBRTtZQUFHO1lBRU4sSUFBSTttQkFFRSxJQUFJLFNBQVM7O3FCQUVSLEtBQUMsYUFBYSxPQUFPLEVBQUUsRUFBRTs7b0JBQzVCLEtBQUMsVUFBVSxLQUFLLEVBQUUsRUFBRSxrQkFBTyxTQUFTLEtBQUssMkJBQU8sTUFBSzs7Z0JBRXpELEtBQUs7Ozs7O0lBRWpCLFFBQUMsMkJBQWMsUUFBTyxHQUFFLEdBQUU7Ozs7YUFFbEIsSUFBSyxPQUFJLElBQUU7O2lCQUNQLElBQUssT0FBSSxJQUFFOztxQkFDRCxVQUFVLEtBQUssZUFBZixVQUFVLEtBQUssS0FBTTs7MkJBQTdCOzs7O2VBRVY7OztJQUVKLFFBQUMsd0JBQVksTUFBSyxHQUFFLEdBQUUsT0FBTSxNQUFLOzs7O1FBRTdCLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sS0FBSyxLQUFLLEtBQUs7YUFFeEMsSUFBSyxlQUFRLEtBQUssT0FBTyxJQUFFOztpQkFDdkIsSUFBSyxlQUFRLEtBQUssR0FBRyxPQUFPLElBQUU7O2dCQUU5QixPQUFPLEtBQUssR0FBRztxQkFFYSxLQUFLOztvQkFBakMsS0FBQyxRQUFRLEtBQUssS0FBSzs7Z0JBRW5CLEtBQUssUUFBUTtnQkFDYixLQUFLLFNBQVMsTUFBSyxLQUFNLE1BQUssS0FBSyxPQUFPOzs7OztJQUV0RCxRQUFDLHNCQUFTLE1BQUs7Ozs7YUFFUCxJQUFLLE1BQU0sZUFBUSxLQUFLLE9BQU8sTUFBTSxJQUFFLE1BQU07O2lCQUN6QyxJQUFLLE1BQU0sZUFBUSxLQUFLLEdBQUcsT0FBTyxNQUFNLElBQUUsTUFBTTs7Z0JBRWhELE9BQU8sS0FBSyxHQUFHO29CQUVaLEtBQUssVUFBUzs7b0JBQ2IsS0FBSyxRQUFRO29CQUNiLEtBQUssT0FBUTs7Ozs7O0lBRTdCLFFBQUMsNEJBQWU7Ozs7UUFFWjs4QkFFYSxLQUFLOzs7WUFBZDtrQkFFZ0IsTUFBTTs7Z0JBQXRCOztZQUVBLFdBQVcsTUFBTTtnQkFDb0IsVUFBWjs7Z0JBQXpCLFlBQVk7O21DQUVELE1BQU07OztnQkFBYjtxQkFDSSxJQUFLLElBQUksUUFBSyxJQUFJOztvQkFFbEIsU0FBVyxLQUFLLElBQUk7b0JBQ3BCLFFBQVEsT0FBTzswQkFFUjs7d0JBQ0g7d0JBQ0EsT0FBTyxPQUFPOzt5Q0FFSDs7O3dCQUFYO3dCQUNBLE1BQU0sV0FBVzs7Ozs7ZUFFakM7OztXQWo1QlA7OztlQW01Qk0ifQ==
//# sourceURL=../../../kode/ked/popo/layout.kode
