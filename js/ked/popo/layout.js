var _k_ = {assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        var child, h, inner, w, x, y, _31_54_, _31_66_, _32_54_, _32_66_, _42_24_

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
                return parseInt(extent * parseInt(value.slice(0, -1)) / 100)
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
            return null
        }
        this.absolutize(cells,rectree)
        this.addRegions(rectree,(this.blockersIn(rectree)),[])
        return rectree
    }

    layout["blockersIn"] = function (node)
    {
        var child, entry, found, _84_35_

        found = []
        if (node.blocks && node.rect.abs.w > 0 && node.rect.abs.h > 0)
        {
            found.push(node)
        }
        var list = ((_84_35_=node.children) != null ? _84_35_ : [])
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
        var blocker, child, _100_35_

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
        var list1 = ((_100_35_=node.children) != null ? _100_35_ : [])
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
        var child, type, _184_35_

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
        var list = ((_184_35_=node.children) != null ? _184_35_ : [])
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
        var plain

        if (!(rectree != null))
        {
            return ''
        }
        plain = this.plainNode(rectree)
        return noon.stringify(plain)
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

    layout["moveNodeAt"] = function (cells, rectree, pos, dir)
    {
        var box, dx, dy, maxRel, moved, newEnd, newRel, node, oldEnd, oldRel, parent, rect, value, _242_34_, _256_30_, _256_41_, _260_21_, _269_25_, _284_30_, _284_41_, _288_21_, _297_25_

        this.absolutize(cells,rectree)
        node = this.topmostIn(rectree,pos)
        if (!(node != null))
        {
            return null
        }
        parent = this.parentOf(rectree,node)
        box = ((_242_34_=(parent != null ? parent.rect.abs : undefined)) != null ? _242_34_ : {x:0,y:0,w:cells.cols,h:cells.rows})
        rect = node.rect.abs
        dx = 0
        dy = 0
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

        moved = false
        if (dx !== 0 && ((node.w != null) || (node.r != null)))
        {
            maxRel = _k_.max(0,(box.w - rect.w))
            if ((node.w != null))
            {
                value = this.movedValue(node.x,(rect.x - box.x),maxRel,dx,box.w)
                if ((value != null))
                {
                    node.x = value
                    moved = true
                }
            }
            else
            {
                oldRel = rect.x - box.x
                oldEnd = maxRel - oldRel
                if ((node.x != null))
                {
                    value = this.movedValue(node.x,oldRel,maxRel,dx,box.w)
                    if ((value != null))
                    {
                        newRel = this.offset(box.w,value)
                        node.x = value
                        node.r = oldEnd - (newRel - oldRel)
                        moved = true
                    }
                }
                else
                {
                    value = this.movedValue(node.r,oldEnd,maxRel,(-dx),box.w)
                    if ((value != null))
                    {
                        newEnd = this.offset(box.w,value)
                        node.r = value
                        node.x = maxRel - newEnd
                        moved = true
                    }
                }
            }
        }
        if (dy !== 0 && ((node.h != null) || (node.b != null)))
        {
            maxRel = _k_.max(0,(box.h - rect.h))
            if ((node.h != null))
            {
                value = this.movedValue(node.y,(rect.y - box.y),maxRel,dy,box.h)
                if ((value != null))
                {
                    node.y = value
                    moved = true
                }
            }
            else
            {
                oldRel = rect.y - box.y
                oldEnd = maxRel - oldRel
                if ((node.y != null))
                {
                    value = this.movedValue(node.y,oldRel,maxRel,dy,box.h)
                    if ((value != null))
                    {
                        newRel = this.offset(box.h,value)
                        node.y = value
                        node.b = oldEnd - (newRel - oldRel)
                        moved = true
                    }
                }
                else
                {
                    value = this.movedValue(node.b,oldEnd,maxRel,(-dy),box.h)
                    if ((value != null))
                    {
                        newEnd = this.offset(box.h,value)
                        node.b = value
                        node.y = maxRel - newEnd
                        moved = true
                    }
                }
            }
        }
        if (!moved)
        {
            return null
        }
        this.absolutize(cells,rectree)
        return node
    }

    layout["parentOf"] = function (node, target)
    {
        var child, found, _320_35_, _323_35_

        var list = ((_320_35_=node.children) != null ? _320_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (child === target)
            {
                return node
            }
        }
        var list1 = ((_323_35_=node.children) != null ? _323_35_ : [])
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

    layout["movedValue"] = function (field, oldRel, maxRel, dir, total)
    {
        var newRel

        if (_k_.isStr(field) && field.endsWith('%'))
        {
            return this.movedPercent(oldRel,maxRel,dir,total)
        }
        newRel = _k_.clamp(0,maxRel,(oldRel + dir))
        if (newRel === oldRel)
        {
            return null
        }
        return newRel
    }

    layout["movedPercent"] = function (oldRel, maxRel, dir, total)
    {
        var best, p, rel

        best = null
        for (p = 0; p <= 100; p++)
        {
            rel = parseInt(total * p / 100)
            if (rel > maxRel)
            {
                continue
            }
            if (dir > 0)
            {
                if (rel <= oldRel)
                {
                    continue
                }
                if (!(best != null) || rel < best.rel)
                {
                    best = {p:p,rel:rel}
                }
            }
            else
            {
                if (rel >= oldRel)
                {
                    continue
                }
                if (!(best != null) || rel > best.rel)
                {
                    best = {p:p,rel:rel}
                }
            }
        }
        if (!(best != null))
        {
            return null
        }
        return `${best.p}%`
    }

    layout["insertTextAt"] = function (cells, rectree, pos, text)
    {
        var node, offset, rect, scale, spare, width, _381_75_, _381_91_, _386_26_

        if (!(rectree != null))
        {
            return 0
        }
        this.absolutize(cells,rectree)
        node = this.topmostIn(rectree,pos)
        if (!(node != null))
        {
            node = rectree
        }
        if (!_k_.empty(node.text))
        {
            scale = this.scaleOf(node)
            spare = node.text.length * scale + scale
            offset = this.textOffsetIn(node,pos,node.text.length)
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
            node.children = ((_386_26_=node.children) != null ? _386_26_ : [])
            node.children.push({text:text,x:pos[0] - rect.x,y:pos[1] - rect.y,w:width + 1,h:1})
            scale = 1
        }
        return scale * text.split('\n')[0].length
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _399_35_

        if (!(node != null))
        {
            return null
        }
        found = null
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_399_35_=node.children) != null ? _399_35_ : [])
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

    layout["textOffsetIn"] = function (node, pos, length)
    {
        var offset, perLine, rect, scale

        rect = node.rect.abs
        scale = this.scaleOf(node)
        perLine = _k_.max(1,parseInt(rect.w / scale))
        offset = (_k_.max(0,pos[1] - rect.y) * perLine) + parseInt(_k_.max(0,pos[0] - rect.x) / scale)
        return _k_.clamp(0,length,offset)
    }

    layout["scaleOf"] = function (node)
    {
        var _418_29_

        if (!!_k_.empty(node.text))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_418_29_=node.scale) != null ? _418_29_ : 1)))
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
                        glyphs.push({char:block.char,fg:cell.fg,bg:cell.bg,scale:block.scale})
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
        var areas, channel, code, i, value, width

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
        for (var _b_ = i = 0, _c_ = glyphs.length; (_b_ <= _c_ ? i < glyphs.length : i > glyphs.length); (_b_ <= _c_ ? ++i : --i))
        {
            if (glyphs[i].scale > 1)
            {
                areas.push({x:i,y:y,value:[sue.SCALE,-1,1,glyphs[i].scale]})
                areas.push({x:i + 1,y:y,value:[sue.CLOSE,-1,1,sue.SCALE]})
            }
        }
        return areas
    }

    layout["gridOf"] = function (rectree)
    {
        var grid, rect, row, x, y

        if (!(rectree != null))
        {
            return null
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
        var child, _534_47_, _536_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_536_35_=node.children) != null ? _536_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, scale, strings, width, x, y, _541_29_, _551_38_, _559_43_, _569_43_, _572_41_, _578_41_

        if (!(node.regions != null))
        {
            return
        }
        strings = null
        if (!_k_.empty(node.pattern))
        {
            strings = fill.pattern(node,node.regions)
        }
        else if (!_k_.empty(node.text))
        {
            strings = fill.text(node,node.regions)
        }
        scale = 1
        if (!_k_.empty(node.text))
        {
            scale = _k_.max(1,parseInt(((_551_38_=node.scale) != null ? _551_38_ : 1)))
        }
        masked = this.channelMaskOf(node)
        for (var _a_ = i = 0, _b_ = node.regions.length; (_a_ <= _b_ ? i < node.regions.length : i > node.regions.length); (_a_ <= _b_ ? ++i : --i))
        {
            rng = node.regions[i]
            width = rng[2] - rng[0]
            chars = Array.from(((_559_43_=(strings != null ? strings[i] : undefined)) != null ? _559_43_ : ''))
            for (var _c_ = j = 0, _d_ = width; (_c_ <= _d_ ? j < width : j > width); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_569_43_=masked[`${x},${y}`]) != null ? _569_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    cell.char = ((_572_41_=chars[j]) != null ? _572_41_ : ' ')
                }
                if (!_k_.empty(node.fg) && !gone.fg)
                {
                    cell.fg = node.fg
                }
                if (!_k_.empty(node.bg) && !gone.bg)
                {
                    cell.bg = node.bg
                }
                if (!(!_k_.empty(strings) && scale > 1 && j % scale === 0))
                {
                    continue
                }
                if (!(cell.char != null) || cell.char === ' ')
                {
                    continue
                }
                this.markBlock(grid,x,y,scale,cell.char,node)
            }
        }
    }

    layout["markBlock"] = function (grid, x, y, scale, char, node)
    {
        var c, cell, r, rect

        rect = node.rect.abs
        if (x + scale > rect.x + rect.w)
        {
            return
        }
        if (y + scale > rect.y + rect.h)
        {
            return
        }
        for (var _a_ = r = y, _b_ = _k_.min(grid.length,y + scale); (_a_ <= _b_ ? r < _k_.min(grid.length,y + scale) : r > _k_.min(grid.length,y + scale)); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = x, _d_ = _k_.min(grid[r].length,x + scale); (_c_ <= _d_ ? c < _k_.min(grid[r].length,x + scale) : c > _k_.min(grid[r].length,x + scale)); (_c_ <= _d_ ? ++c : --c))
            {
                cell = grid[r][c]
                cell.block = {x:x,y:y,scale:scale,char:char}
                if (c !== x || r !== y)
                {
                    cell.char = ''
                }
            }
        }
    }

    layout["channelMaskOf"] = function (node)
    {
        var channel, channels, child, entry, key, masked, rng, x, _601_35_, _603_39_, _608_37_

        masked = {}
        var list = ((_601_35_=node.children) != null ? _601_35_ : [])
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
            var list1 = ((_608_37_=child.regions) != null ? _608_37_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDSSxVQUFBO0lBQU07O09BQ0csVUFBUDs7O0FBRVgsVUFBRDs7Ozs7SUFnQkksUUFBQyx5QkFBWSxPQUFNOztRQUVmLEtBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxLQUFLLEVBQUUsTUFBTSxNQUFNO2VBRTNDOzs7SUFFSixRQUFDLG9CQUFPLEtBQUk7Ozs7Y0FFTTs7bUJBQVo7O2dIQUVzQyxLQUFLLGVBQU8sS0FBSyxpQkFBakIsS0FBSyxlQUFPLEtBQUs7Z0hBQ2pCLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSztRQUV6RCxjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUN0QyxjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUV0QyxjQUFVLEdBQUcsSUFBSSxJQUFFLElBQUksS0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ25ELGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFFbkQsS0FBSyxRQUFRLEtBQUssRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2FBRS9ELEtBQUs7O1lBQ0osU0FBUyxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0NBQ3RCLEtBQUs7OztnQkFBZDtnQkFDQSxLQUFDLE1BQU0sTUFBTTs7O2VBRXJCOzs7SUFFSixRQUFDLHFCQUFRLFFBQU87O3dCQUVLOzttQkFBZjs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/layout.kode
