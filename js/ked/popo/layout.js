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
        var box, dx, dy, maxRel, newEnd, newRel, oldEnd, oldRel, rect, value, _229_38_, _229_49_, _238_25_, _238_36_, _242_21_, _249_25_, _262_25_, _262_36_, _266_21_, _273_25_

        box = ((_229_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _229_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
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
        var box, dh, dw, rect, value, _293_38_, _293_49_, _304_21_, _313_21_

        box = ((_293_49_=(this.parentOf(rectree,node) != null ? this.parentOf(rectree,node).rect.abs : undefined)) != null ? _293_49_ : {x:0,y:0,w:cells.cols,h:cells.rows})
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
        var child, found, _336_35_, _339_35_

        var list = ((_336_35_=node.children) != null ? _336_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            if (child === target)
            {
                return node
            }
        }
        var list1 = ((_339_35_=node.children) != null ? _339_35_ : [])
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
        var node, offset, rect, scale, spare, width, _356_75_, _356_91_, _361_26_

        if (!(rectree != null))
        {
            return 0
        }
        node = this.nodeForPos(cells,rectree,pos)
        node = (node != null ? node : rectree)
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
            node.children = ((_361_26_=node.children) != null ? _361_26_ : [])
            node.children.push({text:text,x:pos[0] - rect.x,y:pos[1] - rect.y,w:width + 1,h:1})
            scale = 1
        }
        return scale * text.split('\n')[0].length
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _373_35_

        if (!(node != null))
        {
            return
        }
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_373_35_=node.children) != null ? _373_35_ : [])
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
        var _392_29_

        if (!!_k_.empty(node.text))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_392_29_=node.scale) != null ? _392_29_ : 1)))
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
        var child, _508_47_, _510_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_510_35_=node.children) != null ? _510_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, scale, strings, width, x, y, _515_29_, _525_38_, _533_43_, _543_43_, _546_41_, _552_41_

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
            scale = _k_.max(1,parseInt(((_525_38_=node.scale) != null ? _525_38_ : 1)))
        }
        masked = this.channelMaskOf(node)
        for (var _a_ = i = 0, _b_ = node.regions.length; (_a_ <= _b_ ? i < node.regions.length : i > node.regions.length); (_a_ <= _b_ ? ++i : --i))
        {
            rng = node.regions[i]
            width = rng[2] - rng[0]
            chars = Array.from(((_533_43_=(strings != null ? strings[i] : undefined)) != null ? _533_43_ : ''))
            for (var _c_ = j = 0, _d_ = width; (_c_ <= _d_ ? j < width : j > width); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_543_43_=masked[`${x},${y}`]) != null ? _543_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    cell.char = ((_546_41_=chars[j]) != null ? _546_41_ : ' ')
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
        var channel, channels, child, entry, key, masked, rng, x, _575_35_, _577_39_, _582_37_

        masked = {}
        var list = ((_575_35_=node.children) != null ? _575_35_ : [])
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
            var list1 = ((_582_37_=child.regions) != null ? _582_37_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDSSxVQUFBO0lBQU07O09BQ0csVUFBUDs7O0FBRVgsVUFBRDs7Ozs7SUFnQkksUUFBQyx5QkFBWSxPQUFNOztRQUVmLEtBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxLQUFLLEVBQUUsTUFBTSxNQUFNO2VBRTNDOzs7SUFFSixRQUFDLG9CQUFPLEtBQUk7Ozs7Y0FFTTs7bUJBQVo7O2dIQUVzQyxLQUFLLGVBQU8sS0FBSyxpQkFBakIsS0FBSyxlQUFPLEtBQUs7Z0hBQ2pCLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSztRQUV6RCxjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUN0QyxjQUFVLEVBQUUsSUFBSSxHQUFHLEtBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSztRQUV0QyxjQUFVLEdBQUcsSUFBSSxJQUFFLElBQUksS0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ25ELGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFFbkQsS0FBSyxRQUFRLEtBQUssRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2FBRS9ELEtBQUs7O1lBQ0osU0FBUyxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0NBQ3RCLEtBQUs7OztnQkFBZDtnQkFDQSxLQUFDLE1BQU0sTUFBTTs7O2VBRXJCOzs7SUFFSixRQUFDLHFCQUFRLFFBQU87O3dCQUVLOzttQkFBZjs7WUFFVSxVQUFUOztnQkFDSSxNQUFNLFNBQVM7O2dCQUNkLFFBQVEsa0JBQWEsU0FBUzs7NEJBQzVCOztlQUVWOzs7SUFFSixRQUFDLHFCQUFRLE9BQU0sT0FBTSxHQUFFOzt1QkFFUzs7bUJBQTFCLEtBQUMsT0FBTyxNQUFNOzt1QkFFOEI7O21CQUE1QyxRQUFRLFNBQVMsS0FBQyxPQUFPLE1BQU07O2VBRWpDLFFBQVE7OztJQUVaLFFBQUMsd0JBQVcsT0FBTTs7Y0FFTDs7OztRQUVULEtBQUMsV0FBVyxNQUFNO1FBRWxCLEtBQUMsV0FBVyxTQUFTLEtBQUMsV0FBVztlQUVqQzs7O0lBRUosUUFBQyx5QkFBWTs7OztRQUVUO1lBRW1CLEtBQUssVUFBVyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQU0sS0FBSyxLQUFLLElBQUksSUFBSTs7WUFBN0UsTUFBTSxLQUFLOzs2QkFFRSxLQUFLOzs7WUFBZDtpQ0FDYSxLQUFDLFdBQVc7OztnQkFBckI7Z0JBQ0EsTUFBTSxLQUFLOzs7ZUFFbkI7OztJQUVKLFFBQUMseUJBQVksTUFBSyxVQUFTOzs7O1FBRXZCLEtBQUssVUFBVSxLQUFDLFlBQVk7WUFFekIsS0FBQyxNQUFNOztnQ0FDUzs7O2dCQUFYO29CQUNZLFlBQVc7O29CQUF2Qjs7MkJBQ1ksUUFBVzs7b0JBQXZCOztnQkFDQSxLQUFLLFVBQVUsS0FBQyxNQUFNLEtBQUssUUFBUTs7OytCQUU5QixLQUFLOzs7WUFBZDtZQUNBLEtBQUMsV0FBVyxNQUFNLFNBQVMsVUFBVSxRQUFROzs7O0lBRXJELFFBQUMsb0JBQU87O1lBRU8sS0FBSyxVQUFTOzttQkFBdkI7OzBCQUVJLEtBQUssb0JBQWMsS0FBSyx1QkFBaUIsS0FBSzs7O0lBRXhELFFBQUMsMEJBQWE7Ozs7UUFFVixPQUFPLEtBQUssS0FBSztRQUVqQixNQUFNLEtBQUs7UUFDWCxNQUFNLEtBQUssSUFBSSxLQUFLO1FBRXBCO3VCQUNJLElBQUssV0FBTSx1QkFBQSxVQUFBOztZQUNYLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRSxLQUFLLElBQUUsS0FBSzs7ZUFDbkM7OztJQUVKLFFBQUMsb0JBQU8sV0FBVTs7OztRQUVkLE9BQU8sUUFBUSxLQUFLO1FBRXBCLE1BQU0sS0FBSztRQUNYLE1BQU0sS0FBSyxJQUFJLEtBQUs7UUFDcEIsTUFBTSxLQUFLO1FBQ1gsTUFBTSxLQUFLLElBQUksS0FBSztRQUVwQjs0QkFFVzs7O1lBQVA7WUFFQSxLQUFLLElBQUk7WUFDVCxJQUFLLElBQUk7WUFDVCxLQUFLLElBQUk7Z0JBRU4sSUFBSSxPQUFPLEtBQUssT0FBTyxPQUFPLE1BQU0sT0FBTzs7Z0JBQzFDLElBQUksS0FBSztnQkFDVDs7Z0JBRW1CLEtBQUs7O2dCQUE1QixJQUFJLE1BQU0sR0FBRyxFQUFFOztnQkFDUSxNQUFNOztnQkFBN0IsSUFBSSxNQUFNLElBQUksRUFBRTs7O2VBRXBCOzs7SUFFSixRQUFDLDBCQUFhOzs7O1FBRVYsT0FBTyxLQUFDLE9BQU87Y0FFSDs7bUJBQVY7O1FBRUY7NEJBQ1c7OztZQUFQO1lBQ0E7aUNBQ1k7OztnQkFBUjtvQkFDRyxLQUFLLFNBQVE7O29CQUNaLE1BQU0sS0FBSzs7OztvQkFFWCxNQUFNLEtBQUssS0FBSzs7O1lBQ3hCLE1BQU0sS0FBSyxNQUFNLEtBQUs7O2VBRTFCLE1BQU0sS0FBSzs7O0lBRWYsUUFBQyxzQkFBUyxPQUFNLFNBQVEsUUFBTTs7UUFFMUIsS0FBQyxXQUFXLE1BQU07UUFFbEIsS0FBQyxRQUFRLFFBQVE7ZUFFakI7OztJQUVKLFFBQUMsc0JBQVMsTUFBSzs7OztjQUVGOzs7O1FBRVQsT0FBTyxLQUFDLE9BQU87YUFFWjs7WUFDQyxLQUFLLGlCQUFhLFFBQU0sS0FBRzs7OzttQkFFcEIsS0FBSzs7OEJBRUgsS0FBSzs7O1lBQWQ7WUFDQSxLQUFDLFFBQVEsTUFBTSxRQUFNOzs7O0lBRTdCLFFBQUMscUJBQVE7Ozs7b0JBRVEsUUFBTyxPQUFNLFVBQVMsS0FBSTs7O1lBQW5DO2lCQUNVLEtBQUs7O3VCQUFiOzs7ZUFFTjs7O0lBRUosUUFBQyxvQkFBTzs7OztRQUVKLE9BQU8sS0FBQyxPQUFPO2FBRUM7O21CQUFkLEtBQUs7Ozs7SUFFWCxRQUFDLHVCQUFVOztjQUVLOzttQkFBVjs7ZUFFRixLQUFLLFVBQVUsS0FBQyxVQUFVOzs7SUFFOUIsUUFBQyx3QkFBVzs7OztRQUVSO2FBRUksT0FBYTs7WUFBVCxRQUFTO3VCQUNELEtBQVEsT0FBTyxRQUFRLFFBQVE7O2dCQUEzQzs7Z0JBQ0csUUFBTzs7Z0JBQ04sSUFBSTtvQ0FDUzs7O29CQUFUO29CQUNBLGFBQWEsS0FBQyxVQUFVO29CQUN4QixJQUFJLFNBQVMsS0FBSzs7Ozs7Z0JBRXRCLElBQUksT0FBTzs7O2VBRW5COzs7SUFFSixRQUFDLHlCQUFZLE9BQU0sU0FBUTs7UUFFdkIsS0FBQyxXQUFXLE1BQU07ZUFDbEIsS0FBQyxVQUFVLFFBQVE7OztJQUV2QixRQUFDLHVCQUFVLE9BQU0sU0FBUSxNQUFLOzs7O1FBRTFCLGtCQUFPLEtBQUMsU0FBUyxRQUFRLGdCQUFsQixLQUFDLFNBQVMsUUFBUSxNQUFPLEtBQUssd0NBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sS0FBSyxFQUFFLE1BQU07UUFDekUsT0FBTyxLQUFLLEtBQUs7Z0JBRVY7O2lCQUNIO2dCQUFVLEtBQUs7O2lCQUNmO2dCQUFVLEtBQU07O2lCQUNoQjtnQkFBVSxLQUFLOztpQkFDZjtnQkFBVSxLQUFNOzs7O1lBRWpCLFFBQVEsS0FBSyxlQUFNLEtBQUs7O1lBRXZCLGlCQUFhLEdBQUcsSUFBSSxJQUFJLEtBQUs7aUJBRTFCLEtBQUs7O2dCQUNKLFFBQVEsS0FBQyxVQUFVLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEdBQUc7cUJBQzNDOztvQkFBUyxLQUFLLElBQUk7Ozs7O2dCQUVyQixTQUFTLEtBQUssSUFBSSxJQUFJO2dCQUN0QixTQUFTLFNBQVM7cUJBRWYsS0FBSzs7b0JBQ0osUUFBUSxLQUFDLFVBQVUsS0FBSyxFQUFFLE9BQU8sR0FBRzt5QkFDakM7O3dCQUNDLFNBQVMsS0FBQyxPQUFPLElBQUksRUFBRTt3QkFDdkIsS0FBSyxJQUFJO3dCQUNULEtBQUssSUFBSSxVQUFVLFNBQVM7Ozs7O29CQUVoQyxRQUFRLEtBQUMsVUFBVSxLQUFLLEVBQUUsUUFBUSxHQUFHO3lCQUNsQzs7d0JBQ0MsU0FBUyxLQUFDLE9BQU8sSUFBSSxFQUFFO3dCQUN2QixLQUFLLElBQUk7d0JBQ1QsS0FBSyxJQUFJLFNBQVM7Ozs7O1lBRS9CLFFBQVEsS0FBSyxlQUFNLEtBQUs7O1lBRXZCLGlCQUFhLEdBQUcsSUFBSSxJQUFJLEtBQUs7aUJBRTFCLEtBQUs7O2dCQUNKLFFBQVEsS0FBQyxVQUFVLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEdBQUc7cUJBQzNDOztvQkFBUyxLQUFLLElBQUk7Ozs7O2dCQUVyQixTQUFTLEtBQUssSUFBSSxJQUFJO2dCQUN0QixTQUFTLFNBQVM7cUJBRWYsS0FBSzs7b0JBQ0osUUFBUSxLQUFDLFVBQVUsS0FBSyxFQUFFLE9BQU8sR0FBRzt5QkFDakM7O3dCQUNDLFNBQVMsS0FBQyxPQUFPLElBQUksRUFBRTt3QkFDdkIsS0FBSyxJQUFJO3dCQUNULEtBQUssSUFBSSxVQUFVLFNBQVM7Ozs7O29CQUVoQyxRQUFRLEtBQUMsVUFBVSxLQUFLLEVBQUUsUUFBUSxHQUFHO3lCQUNsQzs7d0JBQ0MsU0FBUyxLQUFDLE9BQU8sSUFBSSxFQUFFO3dCQUN2QixLQUFLLElBQUk7d0JBQ1QsS0FBSyxJQUFJLFNBQVM7Ozs7O3VCQUV6Qjs7WUFFTCxLQUFDLFdBQVcsTUFBTTttQkFDaEI7Ozs7SUFFVixRQUFDLHlCQUFZLE9BQU0sU0FBUSxNQUFLOzs7O1FBRTVCLGtCQUFPLEtBQUMsU0FBUyxRQUFRLGdCQUFsQixLQUFDLFNBQVMsUUFBUSxNQUFPLEtBQUssd0NBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sS0FBSyxFQUFFLE1BQU07UUFDekUsT0FBTyxLQUFLLEtBQUs7Z0JBRVY7O2lCQUNIO2dCQUFjLEtBQUs7O2lCQUNuQjtnQkFBYyxLQUFNOztpQkFDcEI7Z0JBQWMsS0FBSzs7aUJBQ25CO2dCQUFjLEtBQU07Ozs7WUFFckI7O2lCQUVJLEtBQUs7O2dCQUNKLFFBQVEsS0FBQyxVQUFVLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxJQUFJLElBQUksS0FBSztxQkFDL0M7O29CQUFTLEtBQUssSUFBSTs7Ozs7Z0JBRXJCLFFBQVEsS0FBQyxVQUFVLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUs7cUJBQzFEOztvQkFBUyxLQUFLLElBQUk7Ozs7WUFFMUI7O2lCQUVJLEtBQUs7O2dCQUNKLFFBQVEsS0FBQyxVQUFVLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxJQUFJLElBQUksS0FBSztxQkFDL0M7O29CQUFTLEtBQUssSUFBSTs7Ozs7Z0JBRXJCLFFBQVEsS0FBQyxVQUFVLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUs7cUJBQzFEOztvQkFBUyxLQUFLLElBQUk7Ozs7dUJBRXBCOztZQUVMLEtBQUMsV0FBVyxNQUFNO21CQUNoQjs7OztJQUVWLFFBQUMsd0JBQVcsT0FBTSxLQUFJLEtBQUk7Ozs7WUFFVixVQUFULFVBQWlCLE1BQU0sU0FBUzs7WUFDL0IsZUFBVSxTQUFTO2lCQUNKLEtBQUssT0FBQSxPQUFPOzswQkFBdEI7Ozs7O1lBRUwsZ0JBQVksRUFBRSxLQUFLLE1BQUk7Z0JBQ2QsUUFBTzs7dUJBQWQ7Ozs7O0lBRVYsUUFBQyx1QkFBVSxNQUFLOzs7OzhCQUVDLEtBQUs7OztZQUFkO2dCQUNVLFVBQVM7O3VCQUFqQjs7OytCQUVPLEtBQUs7OztZQUFkO2dCQUNHLFFBQVEsS0FBQyxTQUFTLE1BQU07O3VCQUNyQjs7O2VBQ1Y7OztJQUVKLFFBQUMsMkJBQWMsT0FBTSxTQUFRLEtBQUk7Ozs7Y0FFbEI7O21CQUFUOztRQUVGLE9BQU8sS0FBQyxXQUFXLE1BQU0sUUFBUTtRQUNqQyxRQUFBLGVBQUEsT0FBUTt1QkFFQyxLQUFLOztZQUNWLFFBQVEsS0FBQyxRQUFRO1lBQ2pCLFFBQVEsS0FBSyxLQUFLLFNBQVMsUUFBUTtZQUNuQyxTQUFTLEtBQUMsYUFBYSxLQUFLLElBQUksS0FBSyxLQUFLO1lBQzFDLEtBQUssT0FBTyxLQUFLLFdBQUssVUFBSSxzQkFBQSxlQUFVLE9BQU8sS0FBSyxXQUFLO3lCQUM5QyxLQUFLLE9BQU0sa0JBQWMsS0FBSyxPQUFNLFdBQWMsS0FBSyxnQkFBVyxLQUFLOztnQkFDMUUsS0FBSyxJQUFJLFFBQVEsS0FBSyxNQUFNLE1BQU0sR0FBRyxTQUFTOzs7OztZQUVsRCxRQUFRLEtBQUssTUFBTSxNQUFNLEdBQUc7WUFDNUIsT0FBTyxLQUFLLEtBQUs7WUFDakIsS0FBSyxzQkFBTCxLQUFLO1lBQ0wsS0FBSyxTQUFTLE1BQU0sS0FBSyxLQUFLLEVBQUUsSUFBSSxLQUFHLEtBQUssRUFBRSxFQUFFLElBQUksS0FBRyxLQUFLLEVBQUUsRUFBRSxRQUFNLEVBQUUsRUFBRTtZQUMxRSxRQUFROztlQUVaLFFBQVEsS0FBSyxNQUFNLE1BQU0sR0FBRzs7O0lBRWhDLFFBQUMsd0JBQVcsTUFBSzs7OztjQUVKOzs7O1lBRU8sS0FBQyxNQUFNLEtBQUs7O1lBQTVCLFFBQVE7OzhCQUVLLEtBQUs7OztZQUFkO2dCQUNHLE1BQU0sS0FBQyxVQUFVLE1BQU07O2dCQUN0QixRQUFROzs7ZUFFaEI7OztJQUVKLFFBQUMsMkJBQWMsTUFBSyxLQUFJOzs7O1FBRXBCLE9BQVUsS0FBSyxLQUFLO1FBQ3BCLFFBQVUsS0FBQyxRQUFRO1FBQ25CLGtCQUFjLFdBQU0sS0FBSyxJQUFJO1FBQzdCLGtCQUFlLEVBQUUsSUFBSSxLQUFHLEtBQUssS0FBSyw0QkFBbUIsRUFBRSxJQUFJLEtBQUcsS0FBSyxLQUFLO3lCQUVsRSxFQUFFLE9BQU87OztJQUVuQixRQUFDLHNCQUFTOzs7O3dCQUVXLEtBQUs7O21CQUFwQjs7dUJBRUUsc0JBQU0sS0FBSyw0QkFBUTs7O0lBRTNCLFFBQUMsb0JBQU8sTUFBSzs7OztRQUVULE9BQU8sS0FBSyxLQUFLO1FBQ2pCLElBQU8sSUFBSTtRQUNYLElBQU8sSUFBSTtlQUVULEtBQUssS0FBSyxLQUFNLElBQUksS0FBSyxJQUFFLEtBQUssS0FBTSxLQUFLLEtBQUssS0FBTSxJQUFJLEtBQUssSUFBRSxLQUFLOzs7SUFFNUUsUUFBQyxxQkFBUSxPQUFNOzs7O1FBRVgsT0FBTyxLQUFDLFVBQVUsTUFBTTtjQUVaOzttQkFBVjs7UUFFRixPQUFRLEtBQUMsT0FBTztRQUNoQjtRQUNBO3VCQUVJLElBQUssU0FBSSxLQUFLLDBCQUFMLEtBQUssYUFBTCxLQUFLOztZQUVkLE1BQU0sS0FBQyxVQUFVLEtBQUs7WUFFdEIsTUFBTSxLQUFLLElBQUk7Z0NBRUgsSUFBSTs7O2dCQUFaO2dCQUNBLE1BQU0sS0FBSzs7O2VBRW5CLElBQUksTUFBTSxNQUFNLEtBQUssTUFBTTs7O0lBRS9CLFFBQUMsd0JBQVksTUFBSzs7OztRQUVkLE1BQVMsS0FBSztRQUNkO1FBQ0EsSUFBUztlQUVILElBQUksSUFBSTs7WUFFVixPQUFRLElBQUk7WUFDWixRQUFRLEtBQUs7MkJBRUo7O2dCQUVMLFNBQVMsTUFBTSxJQUFJLE1BQU0sUUFBUTtvQkFFOUIsV0FBVTs7d0JBRU4sTUFBTSxNQUFLOzt3QkFDVixPQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsTUFBTSxNQUFNO3dCQUMvRCxLQUFLLE1BQU07Ozs7d0JBRVgsS0FBSzs7b0JBRVQ7O2dCQUVKLE9BQU8sTUFBTSxLQUFLLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsTUFBTTtnQkFDbEQsS0FBSztnQkFDTDs7WUFFSixPQUFPLE1BQU0sS0FBSyxLQUFLLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsTUFBTTtZQUN4RCxLQUFLOztRQUVUOzRCQUNhOzs7WUFBVDtZQUNBLEtBQUssS0FBSyxNQUFNOztnQkFFbkIsS0FBSyxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUMsY0FBYyxPQUFPOzs7SUFFcEQsUUFBQyw0QkFBZ0IsUUFBTzs7OztRQUVwQjtxQkFFd0IsSUFBSSxTQUFTLE9BQU8sSUFBSSxTQUFTOzs7WUFBcEQ7WUFBSztZQUVOLElBQUk7bUJBRUUsSUFBSSxPQUFPOztnQkFFYixRQUFRLE9BQU8sR0FBRztnQkFDbEIsUUFBUTt1QkFFRixJQUFFLFFBQVEsT0FBTyxVQUFXLE9BQU8sSUFBRSxPQUFPLGFBQVk7O29CQUMxRCxTQUFTOzsrQkFFNEM7O29CQUF6RCxNQUFNLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEtBQUssTUFBTSxFQUFFOztnQkFFeEMsS0FBSzs7O3VCQUVULElBQUssU0FBSSxPQUFPLDBCQUFQLE9BQU8sYUFBUCxPQUFPOztnQkFDYixPQUFPLEdBQUcsUUFBUTs7Z0JBQ2pCLE1BQU0sTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sSUFBSSxNQUFNLEdBQUcsRUFBRSxPQUFPLEdBQUc7Z0JBQ3BELE1BQU0sTUFBTSxFQUFFLElBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxJQUFJLE1BQU0sR0FBRyxFQUFFLElBQUk7OztlQUV4RDs7O0lBRUosUUFBQyxxQkFBUTs7OztjQUVJOzs7O1FBRVQ7UUFDQSxPQUFPLFFBQVEsS0FBSzt1QkFFaEIsSUFBSyxTQUFJLEtBQUsscUJBQUwsS0FBSyxRQUFMLEtBQUs7O1lBQ2Q7MkJBQ0ksSUFBSyxTQUFJLEtBQUsscUJBQUwsS0FBSyxRQUFMLEtBQUs7O2dCQUNkLElBQUksTUFBTSxLQUFLLElBQUksR0FBRyxLQUFLLEdBQUcsS0FBSyxNQUFNOztZQUM3QyxLQUFLLEtBQUs7O1FBQ2QsS0FBQyxVQUFVLFFBQVE7ZUFFbkI7OztJQUVKLFFBQUMsd0JBQVcsTUFBSzs7OztjQUVKOzs7O2NBRW9CLEtBQUs7O1lBQWxDLEtBQUMsVUFBVSxLQUFLOzs4QkFFSCxLQUFLOzs7WUFBZDtZQUNBLEtBQUMsVUFBVSxNQUFNOzs7O0lBRXpCLFFBQUMsd0JBQVcsTUFBSzs7OztjQUVKLEtBQUs7Ozs7UUFFZCxVQUFVO3VCQUVELEtBQUs7O1lBQ1YsVUFBVSxLQUFLLFFBQVEsS0FBSyxLQUFLOzs0QkFDdkIsS0FBSzs7WUFDZixVQUFVLEtBQUssS0FBSyxLQUFLLEtBQUs7O1FBRWxDLFFBQVM7dUJBQ29DLEtBQUs7O1lBQWxELGdCQUFhLHNCQUFNLEtBQUssNEJBQVE7O1FBRWhDLFNBQVMsS0FBQyxjQUFjO3VCQUVwQixJQUFLLFNBQUksS0FBSyxRQUFRLDBCQUFiLEtBQUssUUFBUSxhQUFiLEtBQUssUUFBUTs7WUFFdEIsTUFBUSxLQUFLLFFBQVE7WUFDckIsUUFBUSxJQUFJLEtBQUssSUFBSTtZQUNyQixRQUFRLE1BQU0saUJBQUssa0JBQUEsUUFBUyxzQ0FBSzsyQkFFN0IsSUFBSyxTQUFJLHlCQUFBLFlBQUE7O2dCQUVULElBQUksSUFBSSxLQUFLO2dCQUNiLElBQUksSUFBSTtvQkFFSSxJQUFJLEtBQUssSUFBSSxLQUFLLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxHQUFHOztvQkFBL0Q7O2dCQUVBLE9BQU8sS0FBSyxHQUFHO2dCQUNmLGtCQUFPLFVBQVUsS0FBSzsrQkFFYixhQUFnQixLQUFLOztvQkFDMUIsS0FBSyxrQkFBTyxNQUFNLHlCQUFLOzsrQkFFQSxLQUFLLFFBQVcsS0FBSzs7b0JBQWhELEtBQUssS0FBSyxLQUFLOzsrQkFDWSxLQUFLLFFBQVcsS0FBSzs7b0JBQWhELEtBQUssS0FBSyxLQUFLOztpQ0FFUSxZQUFZLFFBQVEsS0FBTSxJQUFJLFVBQVM7O29CQUE5RDs7c0JBQ2dCLEtBQUssaUJBQVMsS0FBSyxTQUFROztvQkFBM0M7O2dCQUVBLEtBQUMsVUFBVSxLQUFLLEVBQUUsRUFBRSxNQUFNLEtBQUssS0FBSzs7Ozs7SUFFaEQsUUFBQyx3QkFBWSxNQUFLLEdBQUUsR0FBRSxPQUFNLE1BQUs7Ozs7UUFFN0IsT0FBTyxLQUFLLEtBQUs7WUFFWixJQUFJLFFBQVEsS0FBSyxJQUFJLEtBQUs7Ozs7WUFDMUIsSUFBSSxRQUFRLEtBQUssSUFBSSxLQUFLOzs7O3VCQUUzQixJQUFLLGlCQUFRLEtBQUssT0FBTyxJQUFFLGtDQUFkLEtBQUssT0FBTyxJQUFFLHFCQUFkLEtBQUssT0FBTyxJQUFFOzsyQkFDdkIsSUFBSyxpQkFBUSxLQUFLLEdBQUcsT0FBTyxJQUFFLGtDQUFqQixLQUFLLEdBQUcsT0FBTyxJQUFFLHFCQUFqQixLQUFLLEdBQUcsT0FBTyxJQUFFOztnQkFFOUIsT0FBTyxLQUFLLEdBQUc7Z0JBRWYsS0FBSyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLEtBQUs7b0JBQ3BCLE1BQUssS0FBSyxNQUFLOztvQkFBbEMsS0FBSyxPQUFROzs7Ozs7SUFFekIsUUFBQyw0QkFBZTs7OztRQUVaOzhCQUVhLEtBQUs7OztZQUFkO2tCQUVnQixNQUFNOztnQkFBdEI7O1lBRUEsV0FBVyxNQUFNO2dCQUNvQixVQUFaOztnQkFBekIsWUFBWTs7bUNBRUQsTUFBTTs7O2dCQUFiOytCQUNJLElBQUssSUFBSSxVQUFLLElBQUksc0JBQUosSUFBSSxTQUFKLElBQUk7O29CQUVsQixTQUFXLEtBQUssSUFBSTtvQkFDcEIsUUFBUSxPQUFPOzBCQUVSOzt3QkFDSDt3QkFDQSxPQUFPLE9BQU87O3lDQUVIOzs7d0JBQVg7d0JBQ0EsTUFBTSxXQUFXOzs7OztlQUVqQzs7O1dBOWtCUDs7O2VBZ2xCTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/layout.kode
