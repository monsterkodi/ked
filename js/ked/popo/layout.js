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

    layout["insertTextAt"] = function (cells, rectree, pos, text)
    {
        var node, offset, rect, scale, spare, width, _252_75_, _252_91_, _257_26_

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
            node.children = ((_257_26_=node.children) != null ? _257_26_ : [])
            node.children.push({text:text,x:pos[0] - rect.x,y:pos[1] - rect.y,w:width + 1,h:1})
            scale = 1
        }
        return scale * text.split('\n')[0].length
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _270_35_

        if (!(node != null))
        {
            return null
        }
        found = null
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_270_35_=node.children) != null ? _270_35_ : [])
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
        var _289_29_

        if (!!_k_.empty(node.text))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_289_29_=node.scale) != null ? _289_29_ : 1)))
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
        var child, _405_47_, _407_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_407_35_=node.children) != null ? _407_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, scale, strings, width, x, y, _412_29_, _422_38_, _430_43_, _440_43_, _443_41_, _449_41_

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
            scale = _k_.max(1,parseInt(((_422_38_=node.scale) != null ? _422_38_ : 1)))
        }
        masked = this.channelMaskOf(node)
        for (var _a_ = i = 0, _b_ = node.regions.length; (_a_ <= _b_ ? i < node.regions.length : i > node.regions.length); (_a_ <= _b_ ? ++i : --i))
        {
            rng = node.regions[i]
            width = rng[2] - rng[0]
            chars = Array.from(((_430_43_=(strings != null ? strings[i] : undefined)) != null ? _430_43_ : ''))
            for (var _c_ = j = 0, _d_ = width; (_c_ <= _d_ ? j < width : j > width); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_440_43_=masked[`${x},${y}`]) != null ? _440_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    cell.char = ((_443_41_=chars[j]) != null ? _443_41_ : ' ')
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
        var channel, channels, child, entry, key, masked, rng, x, _472_35_, _474_39_, _479_37_

        masked = {}
        var list = ((_472_35_=node.children) != null ? _472_35_ : [])
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
            var list1 = ((_479_37_=child.regions) != null ? _479_37_ : [])
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
