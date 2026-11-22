var _k_ = {assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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

    layout["titlify"] = function (cells, rectree, depth = 0)
    {
        this.absolutize(cells,rectree)
        this.titleIn(rectree,depth)
        return rectree
    }

    layout["titleIn"] = function (node, depth)
    {
        var child, type, _233_35_

        if (!(node != null))
        {
            return
        }
        type = this.typeOf(node)
        if ((type != null))
        {
            node.title = _k_.lpad(depth + 2) + type
        }
        else
        {
            delete node.title
        }
        var list = ((_233_35_=node.children) != null ? _233_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.titleIn(child,depth + 2)
        }
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
        var box, dx, dy, maxRel, newEnd, newRel, oldEnd, oldRel, rect, value, _278_38_, _278_49_, _287_25_, _287_36_, _291_21_, _298_25_, _311_25_, _311_36_, _315_21_, _322_25_

        box = ((_278_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _278_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
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
                value = this.incrValue(node.x,(rect.x - box.x),dx,maxRel)
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
                    value = this.incrValue(node.x,oldRel,dx,maxRel)
                    if ((value != null))
                    {
                        newRel = this.offset(box.w,value)
                        node.x = value
                        node.r = oldEnd - (newRel - oldRel)
                    }
                }
                else
                {
                    value = this.incrValue(node.r,oldEnd,-dx,maxRel)
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
                value = this.incrValue(node.y,(rect.y - box.y),dy,maxRel)
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
                    value = this.incrValue(node.y,oldRel,dy,maxRel)
                    if ((value != null))
                    {
                        newRel = this.offset(box.h,value)
                        node.y = value
                        node.b = oldEnd - (newRel - oldRel)
                    }
                }
                else
                {
                    value = this.incrValue(node.b,oldEnd,-dy,maxRel)
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
        var box, dh, dw, rect, value, _342_38_, _342_49_, _353_21_, _362_21_

        box = ((_342_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _342_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
        rect = node.rect.abs
        switch (dir)
        {
            case 'less cols':
                dw = -1
                break
            case 'more cols':
                dw = 1
                break
            case 'less rows':
                dh = -1
                break
            case 'more rows':
                dh = 1
                break
        }

        if (dw)
        {
            if ((node.w != null))
            {
                value = this.incrValue(node.w,rect.w,dw,(box.w - rect.x))
                if ((value != null))
                {
                    node.w = value
                }
            }
            else
            {
                value = this.incrValue(node.r,(box.w - rect.w),-dw,(box.w - rect.x))
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
                value = this.incrValue(node.h,rect.h,dh,(box.h - rect.y))
                if ((value != null))
                {
                    node.h = value
                }
            }
            else
            {
                value = this.incrValue(node.b,(box.h - rect.h),-dh,(box.h - rect.y))
                if ((value != null))
                {
                    node.b = value
                }
            }
        }
        if (!_k_.empty(value))
        {
            this.absolutize(cells,rectree)
            return node
        }
    }

    layout["incrValue"] = function (field, old, dir, maxv)
    {
        var rep, res

        if (_k_.isStr(field) && field.endsWith('%'))
        {
            rep = parseInt(field) + dir
            if ((0 <= rep && rep <= 100))
            {
                return `${rep}%`
            }
        }
        else
        {
            res = _k_.clamp(0,maxv,old + dir)
            if (res !== old)
            {
                return res
            }
        }
    }

    layout["parentOf"] = function (node, target)
    {
        var child, found, _385_35_, _388_35_

        var list = ((_385_35_=node.children) != null ? _385_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (child === target)
            {
                return node
            }
        }
        var list1 = ((_388_35_=node.children) != null ? _388_35_ : [])
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
        var node, offset, rect, scale, spare, width, _400_20_, _405_75_, _405_91_, _410_26_

        if (!(rectree != null))
        {
            return 0
        }
        node = this.nodeForPos(cells,rectree,pos)
        node = (node != null ? node : rectree)
        if ((node.text != null))
        {
            scale = this.scaleOf(node)
            spare = node.text.length * scale + scale
            offset = this.textOffsetAt(node,pos)
            node.text = node.text.slice(0, typeof offset === 'number' ? offset : -1) + text + node.text.slice(offset)
            if (parseInt(node.w) === spare && parseInt(node.h) === scale && !(node.r != null) && !(node.b != null))
            {
                node.w = spare + text.split('\n')[0].length * scale
            }
        }
        else
        {
            width = text.split('\n')[0].length
            rect = node.rect.abs
            node.children = ((_410_26_=node.children) != null ? _410_26_ : [])
            node.children.push({text:text,x:pos[0] - rect.x,y:pos[1] - rect.y,w:width + 1,h:1})
            scale = 1
        }
        return scale * text.split('\n')[0].length
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _422_35_

        if (!(node != null))
        {
            return
        }
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_422_35_=node.children) != null ? _422_35_ : [])
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
        var regions, scale, _431_31_

        scale = this.scaleOf(node)
        regions = ((_431_31_=node.regions) != null ? _431_31_ : this.intervalsOf(node))
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
            end = (end != null ? end : slot)
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
        var _473_28_, _475_29_

        if (!(node.text != null))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_475_29_=node.scale) != null ? _475_29_ : 1)))
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
        var child, _605_47_, _607_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_607_35_=node.children) != null ? _607_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, strings, x, y, _612_29_, _628_43_, _638_43_, _641_58_, _642_41_

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
            chars = Array.from(((_628_43_=(strings != null ? strings[i] : undefined)) != null ? _628_43_ : ''))
            for (var _c_ = j = 0, _d_ = (rng[2] - rng[0]); (_c_ <= _d_ ? j < (rng[2] - rng[0]) : j > (rng[2] - rng[0])); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_638_43_=masked[`${x},${y}`]) != null ? _638_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    if ((cell.block != null))
                    {
                        this.unblock(grid,cell.block)
                    }
                    cell.char = ((_642_41_=chars[j]) != null ? _642_41_ : ' ')
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
        var char, scale, x, y

        scale = this.scaleOf(node)
        var list = _k_.list(fill.scaled(node,node.regions,node.rect.abs))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            x = list[_a_][0]
            y = list[_a_][1]
            char = list[_a_][2]
            if (this.charMaskedIn(masked,x,y,scale))
            {
                continue
            }
            this.markBlock(grid,x,y,scale,char,node)
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
        var block, c, cell, r, _680_54_

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
        var channel, channels, child, entry, key, masked, rng, x, _700_35_, _702_39_, _707_37_

        masked = {}
        var list = ((_700_35_=node.children) != null ? _700_35_ : [])
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
            var list1 = ((_707_37_=child.regions) != null ? _707_37_ : [])
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
