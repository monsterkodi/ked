var _k_ = {assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var layout

import fill from "./fill.js"

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
        var child, h, inner, w, x, y, _30_54_, _30_66_, _31_54_, _31_66_, _41_24_

        if (!(node != null))
        {
            return node
        }
        _k_.assert("/home/kodi/s/ked/kode/ked/popo/layout.kode", 30, 8, "layout: w and r are both given" + " !((node.w != null) && (node.r != null))", !((node.w != null) && (node.r != null)))
        _k_.assert("/home/kodi/s/ked/kode/ked/popo/layout.kode", 31, 8, "layout: h and b are both given" + " !((node.h != null) && (node.b != null))", !((node.h != null) && (node.b != null)))
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
        var child, entry, found, _83_35_

        found = []
        if (node.blocks && node.rect.abs.w > 0 && node.rect.abs.h > 0)
        {
            found.push(node)
        }
        var list = ((_83_35_=node.children) != null ? _83_35_ : [])
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
        var blocker, child, _99_35_

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
        var list1 = ((_99_35_=node.children) != null ? _99_35_ : [])
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
        var child, type, _183_35_

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
        var list = ((_183_35_=node.children) != null ? _183_35_ : [])
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

    layout["nodeForPos"] = function (cells, rectree, pos)
    {
        this.absolutize(cells,rectree)
        return this.topmostIn(rectree,pos)
    }

    layout["insertTextAt"] = function (cells, rectree, pos, text)
    {
        var node, offset, rect, scale, spare, width, _225_75_, _225_91_, _230_26_

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
            node.children = ((_230_26_=node.children) != null ? _230_26_ : [])
            node.children.push({text:text,x:pos[0] - rect.x,y:pos[1] - rect.y,w:width + 1,h:1})
            scale = 1
        }
        return scale * text.split('\n')[0].length
    }

    layout["topmostIn"] = function (node, pos)
    {
        var child, found, hit, _243_35_

        if (!(node != null))
        {
            return null
        }
        found = null
        if (this.holds(node,pos))
        {
            found = node
        }
        var list = ((_243_35_=node.children) != null ? _243_35_ : [])
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
        var _262_29_

        if (!!_k_.empty(node.text))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_262_29_=node.scale) != null ? _262_29_ : 1)))
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
        var child, _378_47_, _380_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_380_35_=node.children) != null ? _380_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, scale, strings, width, x, y, _385_29_, _395_38_, _403_43_, _413_43_, _416_41_, _422_41_

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
            scale = _k_.max(1,parseInt(((_395_38_=node.scale) != null ? _395_38_ : 1)))
        }
        masked = this.channelMaskOf(node)
        for (var _a_ = i = 0, _b_ = node.regions.length; (_a_ <= _b_ ? i < node.regions.length : i > node.regions.length); (_a_ <= _b_ ? ++i : --i))
        {
            rng = node.regions[i]
            width = rng[2] - rng[0]
            chars = Array.from(((_403_43_=(strings != null ? strings[i] : undefined)) != null ? _403_43_ : ''))
            for (var _c_ = j = 0, _d_ = width; (_c_ <= _d_ ? j < width : j > width); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_413_43_=masked[`${x},${y}`]) != null ? _413_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    cell.char = ((_416_41_=chars[j]) != null ? _416_41_ : ' ')
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
        var channel, channels, child, entry, key, masked, rng, x, _445_35_, _447_39_, _452_37_

        masked = {}
        var list = ((_445_35_=node.children) != null ? _445_35_ : [])
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
            var list1 = ((_452_37_=child.regions) != null ? _452_37_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDYSxVQUFQOzs7QUFFWCxVQUFEOzs7OztJQWdCSSxRQUFDLHlCQUFZLE9BQU07O1FBRWYsS0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEtBQUssRUFBRSxNQUFNLE1BQU07ZUFFM0M7OztJQUVKLFFBQUMsb0JBQU8sS0FBSTs7OztjQUVNOzttQkFBWjs7Z0hBRXNDLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSztnSEFDakIsS0FBSyxlQUFPLEtBQUssaUJBQWpCLEtBQUssZUFBTyxLQUFLO1FBRXpELGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBQ3RDLGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBRXRDLGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbkQsY0FBVSxHQUFHLElBQUksSUFBRSxJQUFJLEtBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSztRQUVuRCxLQUFLLFFBQVEsS0FBSyxFQUFFLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7YUFFL0QsS0FBSzs7WUFDSixTQUFTLEVBQUUsSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLElBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQ0FDdEIsS0FBSzs7O2dCQUFkO2dCQUNBLEtBQUMsTUFBTSxNQUFNOzs7ZUFFckI7OztJQUVKLFFBQUMscUJBQVEsUUFBTzs7d0JBRUs7O21CQUFmOztZQUVVLFVBQVQ7O2dCQUNJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/layout.kode
