var _k_ = {assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isArr: function (o) {return Array.isArray(o)}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var layout

import fill from "./fill.js"

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
        _k_.assert("/home/kodi/s/ked/kode/ked/popo/layout.kode", 31, 8, "layout: w and r are both given" + " !((node.w != null) && (node.r != null))", !((node.w != null) && (node.r != null)))
        _k_.assert("/home/kodi/s/ked/kode/ked/popo/layout.kode", 32, 8, "layout: h and b are both given" + " !((node.h != null) && (node.b != null))", !((node.h != null) && (node.b != null)))
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
        for (var _a_ = y = top, _b_ = bot; (_a_ <= _b_ ? y < bot : y > bot); (_a_ <= _b_ ? ++y : --y))
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
            if (_k_.in(key,['rect','title','index','regions']))
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
                value = this.incrValue(node.w,rect.w,dw,step,roomW)
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
                (val != null) ? node[key] = val : delete node[key]
            }
            this.absolutize(cells,rectree)
            return
        }
        return node
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
        var index, node, _436_33_

        node = rectree
        var list = _k_.list(path)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            node = (node != null ? (_436_33_=node.children) != null ? _436_33_[index] : undefined : undefined)
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
        var child, key, value, _454_24_

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
        var _463_24_

        parent.children = ((_463_24_=parent.children) != null ? _463_24_ : [])
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
        var cells, db, dr, dx, dy, _520_15_, _521_15_, _522_34_, _522_50_, _523_34_, _523_50_

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
        node.x = ((_520_15_=node.x) != null ? _520_15_ : dx)
        node.y = ((_521_15_=node.y) != null ? _521_15_ : dy)
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
        var child, found, _527_35_, _530_35_

        var list = ((_527_35_=node.children) != null ? _527_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (child === target)
            {
                return node
            }
        }
        var list1 = ((_530_35_=node.children) != null ? _530_35_ : [])
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
        var added, chars, child, node, offset, rect, scale, spare, width, _539_47_, _539_80_, _543_20_, _549_75_, _549_91_, _555_22_

        if (!(rectree != null))
        {
            return
        }
        node = ((_539_47_=this.textNodeAt(cells,rectree,pos)) != null ? _539_47_ : ((_539_80_=this.nodeForPos(cells,rectree,pos)) != null ? _539_80_ : rectree))
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
        node.children = ((_555_22_=node.children) != null ? _555_22_ : [])
        node.children.push(child)
        return {node:child,offset:added.length}
    }

    layout["textNodeAt"] = function (cells, rectree, cell)
    {
        var node, _564_28_, _568_27_

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
        if (_k_.eql(this.cellForTextOffset(node,Array.from(node.text).length), cell))
        {
            return node
        }
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _577_35_

        if (!(node != null))
        {
            return
        }
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_577_35_=node.children) != null ? _577_35_ : [])
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
        var regions, scale, _586_31_

        scale = this.scaleOf(node)
        regions = ((_586_31_=node.regions) != null ? _586_31_ : this.intervalsOf(node))
        return fill.flow(node,regions,node.rect.abs).map(function (slot)
        {
            return [slot[0],slot[1] + scale - 1,slot[2],slot[3]]
        })
    }

    layout["textOffsetAt"] = function (node, cell)
    {
        var best, cx, cy, scale, slot, top

        var _a_ = cell; cx = _a_[0]; cy = _a_[1]

        scale = this.scaleOf(node)
        top = node.rect.abs.y
        cy = top + Math.floor((cy - top) / scale) * scale + scale - 1
        best = null
        var list = _k_.list(this.textSlots(node))
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            slot = list[_b_]
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
        var _628_28_, _630_29_

        if (!(node.text != null))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_630_29_=node.scale) != null ? _630_29_ : 1)))
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
        grid = this.gridOf(root)
        lines = []
        areas = []
        for (var _a_ = y = 0, _b_ = grid.length; (_a_ <= _b_ ? y < grid.length : y > grid.length); (_a_ <= _b_ ? ++y : --y))
        {
            row = this.lineOfRow(grid,y)
            lines.push(row.line)
            var list = _k_.list(row.areas)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                area = list[_c_]
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
        for (var _a_ = y = 0, _b_ = rect.h; (_a_ <= _b_ ? y < rect.h : y > rect.h); (_a_ <= _b_ ? ++y : --y))
        {
            row = []
            for (var _c_ = x = 0, _d_ = rect.w; (_c_ <= _d_ ? x < rect.w : x > rect.w); (_c_ <= _d_ ? ++x : --x))
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
        var child, _760_47_, _762_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_762_35_=node.children) != null ? _762_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, strings, x, y, _767_29_, _783_43_, _793_43_, _796_58_, _797_41_

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
            strings = fill.text(node,node.regions)
        }
        else if (!_k_.empty(node.text))
        {
            strings = node.regions.map(function (rng)
            {
                return fill.blank(rng[2] - rng[0])
            })
        }
        for (var _a_ = i = 0, _b_ = node.regions.length; (_a_ <= _b_ ? i < node.regions.length : i > node.regions.length); (_a_ <= _b_ ? ++i : --i))
        {
            rng = node.regions[i]
            chars = Array.from(((_783_43_=(strings != null ? strings[i] : undefined)) != null ? _783_43_ : ''))
            for (var _c_ = j = 0, _d_ = (rng[2] - rng[0]); (_c_ <= _d_ ? j < (rng[2] - rng[0]) : j > (rng[2] - rng[0])); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_793_43_=masked[`${x},${y}`]) != null ? _793_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    if ((cell.block != null))
                    {
                        this.unblock(grid,cell.block)
                    }
                    cell.char = ((_797_41_=chars[j]) != null ? _797_41_ : ' ')
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

    layout["paintScaled"] = function (node, grid, masked)
    {
        var char, chars, rect, scale, x, x1, x2, y, _824_66_

        scale = this.scaleOf(node)
        rect = node.rect.abs
        chars = {}
        var list = _k_.list(fill.scaled(node,node.regions,rect))
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
                    this.markBlock(grid,x,y,scale,(((_824_66_=chars[`${x},${y}`]) != null ? _824_66_ : ' ')),node)
                }
                x += scale
            }
        }
    }

    layout["charMaskedIn"] = function (masked, x, y, scale)
    {
        var c, r

        for (var _a_ = r = y, _b_ = y + scale; (_a_ <= _b_ ? r < y + scale : r > y + scale); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = x, _d_ = x + scale; (_c_ <= _d_ ? c < x + scale : c > x + scale); (_c_ <= _d_ ? ++c : --c))
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
        var block, c, cell, r, _845_54_

        block = {x:x,y:y,scale:scale,char:char,node:node}
        for (var _a_ = r = y, _b_ = _k_.min(grid.length,y + scale); (_a_ <= _b_ ? r < _k_.min(grid.length,y + scale) : r > _k_.min(grid.length,y + scale)); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = x, _d_ = _k_.min(grid[r].length,x + scale); (_c_ <= _d_ ? c < _k_.min(grid[r].length,x + scale) : c > _k_.min(grid[r].length,x + scale)); (_c_ <= _d_ ? ++c : --c))
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

        for (var _a_ = r = block.y, _b_ = _k_.min(grid.length,block.y + block.scale); (_a_ <= _b_ ? r < _k_.min(grid.length,block.y + block.scale) : r > _k_.min(grid.length,block.y + block.scale)); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = block.x, _d_ = _k_.min(grid[r].length,block.x + block.scale); (_c_ <= _d_ ? c < _k_.min(grid[r].length,block.x + block.scale) : c > _k_.min(grid[r].length,block.x + block.scale)); (_c_ <= _d_ ? ++c : --c))
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
        var channel, channels, child, entry, key, masked, rng, x, _865_35_, _867_39_, _872_37_

        masked = {}
        var list = ((_865_35_=node.children) != null ? _865_35_ : [])
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
            var list1 = ((_872_37_=child.regions) != null ? _872_37_ : [])
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                rng = list1[_b_]
                for (var _c_ = x = rng[0], _d_ = rng[2]; (_c_ <= _d_ ? x < rng[2] : x > rng[2]); (_c_ <= _d_ ? ++x : --x))
                {
                    key = `${x},${rng[1]}`
                    entry = masked[key]
                    if (!(entry != null))
                    {
                        entry = {}
                        masked[key] = entry
                    }
                    var list2 = _k_.list(channels)
                    for (var _e_ = 0; _e_ < list2.length; _e_++)
                    {
                        channel = list2[_e_]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDSSxVQUFBO0lBQU07O09BQ0csVUFBUDs7O0FBRVgsVUFBRDs7Ozs7SUFnQkksUUFBQyx5QkFBWSxPQUFNOztRQUVmLEtBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxLQUFLLEVBQUUsTUFBTSxNQUFNO2VBRTNDOzs7SUFFSixRQUFDLG9CQUFPLEtBQUk7Ozs7Y0FFTTs7bUJBQVo7O2dIQUVzQyxLQUFLLGVBQU8sS0FBSyxpQkFBakIsS0FBSyxlQUFPLEtBQUs7Z0hBQ2pCLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSztRQUV6RCxjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUN0QyxjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUV0QyxjQUFVLEdBQUcsSUFBSSxJQUFFLElBQUksS0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ25ELGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbkQsSUFBSSxLQUFDLFlBQVksS0FBSyxFQUFFLElBQUksSUFBRTtRQUU5QixLQUFLLFFBQVEsS0FBSyxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7YUFFL0QsS0FBSzs7WUFDSixTQUFTLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQ0FDdEIsS0FBSzs7O2dCQUFkO2dCQUNBLEtBQUMsTUFBTSxNQUFNOzs7ZUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/layout.kode
