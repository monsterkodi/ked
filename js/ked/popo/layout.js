var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var layout

import fill from "./fill.js"

import sue from "../edit/tool/sue.js"


layout = (function ()
{
    function layout ()
    {}

    layout["absolutize"] = function (cells, rectree)
    {
        var box

        box = {x:0,y:0,w:cells.cols,h:cells.rows}
        return this.inBox(box,rectree)
    }

    layout["inBox"] = function (box, node)
    {
        var child, h, inner, out, w, x, y, _33_17_, _33_29_, _36_17_, _36_29_, _52_24_

        if (!(node != null))
        {
            return node
        }
        if ((node.w != null) && (node.r != null))
        {
            throw new Error("layout: w and r are both given")
        }
        if ((node.h != null) && (node.b != null))
        {
            throw new Error("layout: h and b are both given")
        }
        x = _k_.clamp(0,box.w,(this.offset(box.w,node.x)))
        y = _k_.clamp(0,box.h,(this.offset(box.h,node.y)))
        w = _k_.clamp(0,(box.w - x),(this.extent(box.w,x,node.w,node.r)))
        h = _k_.clamp(0,(box.h - y),(this.extent(box.h,y,node.h,node.b)))
        out = this.withoutGeometry(node)
        out.x = box.x + x
        out.y = box.y + y
        out.w = w
        out.h = h
        if ((node.children != null))
        {
            inner = {x:out.x,y:out.y,w:w,h:h}
            out.children = []
            var list = _k_.list(node.children)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                child = list[_a_]
                out.children.push(this.inBox(inner,child))
            }
        }
        return out
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

    layout["withoutGeometry"] = function (node)
    {
        var key, out, value

        out = {}
        for (key in node)
        {
            value = node[key]
            if (_k_.in(key,['x','y','w','h','r','b','children']))
            {
                continue
            }
            out[key] = value
        }
        return out
    }

    layout["regionize"] = function (cells, rectree)
    {
        var root

        if (!(rectree != null))
        {
            return null
        }
        root = this.absolutize(cells,rectree)
        this.addRegions(root,(this.blockersIn(root)),[])
        return root
    }

    layout["blockersIn"] = function (node)
    {
        var child, entry, found, _126_35_

        found = []
        if (node.blocks && node.w > 0 && node.h > 0)
        {
            found.push(node)
        }
        var list = ((_126_35_=node.children) != null ? _126_35_ : [])
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
        var blocker, child, _142_35_

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
        var list1 = ((_142_35_=node.children) != null ? _142_35_ : [])
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

    layout["intervalsOf"] = function (rect)
    {
        var bot, out, top, y

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
        var bx1, bx2, by1, by2, out, rng, x1, x2, y

        bx1 = blocker.x
        bx2 = blocker.x + blocker.w
        by1 = blocker.y
        by2 = blocker.y + blocker.h
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
        var grid, row, x, y

        if (!(rectree != null))
        {
            return null
        }
        grid = []
        for (var _a_ = y = 0, _b_ = rectree.h; (_a_ <= _b_ ? y < rectree.h : y > rectree.h); (_a_ <= _b_ ? ++y : --y))
        {
            row = []
            for (var _c_ = x = 0, _d_ = rectree.w; (_c_ <= _d_ ? x < rectree.w : x > rectree.w); (_c_ <= _d_ ? ++x : --x))
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
        var child, _343_47_, _345_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_345_35_=node.children) != null ? _345_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, scale, strings, width, x, y, _350_29_, _360_38_, _368_43_, _378_43_, _381_41_, _387_41_

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
            scale = _k_.max(1,parseInt(((_360_38_=node.scale) != null ? _360_38_ : 1)))
        }
        masked = this.channelMaskOf(node)
        for (var _a_ = i = 0, _b_ = node.regions.length; (_a_ <= _b_ ? i < node.regions.length : i > node.regions.length); (_a_ <= _b_ ? ++i : --i))
        {
            rng = node.regions[i]
            width = rng[2] - rng[0]
            chars = Array.from(((_368_43_=(strings != null ? strings[i] : undefined)) != null ? _368_43_ : ''))
            for (var _c_ = j = 0, _d_ = width; (_c_ <= _d_ ? j < width : j > width); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_378_43_=masked[`${x},${y}`]) != null ? _378_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    cell.char = ((_381_41_=chars[j]) != null ? _381_41_ : ' ')
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
        var c, cell, r

        if (x + scale > node.x + node.w)
        {
            return
        }
        if (y + scale > node.y + node.h)
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
        var channel, channels, child, entry, key, masked, rng, x, _418_35_, _420_39_, _425_37_

        masked = {}
        var list = ((_418_35_=node.children) != null ? _418_35_ : [])
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
            var list1 = ((_425_37_=child.regions) != null ? _425_37_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDYSxVQUFQOzs7QUFFWCxVQUFEOzs7OztJQWlCSSxRQUFDLHlCQUFZLE9BQU07Ozs7UUFFZixPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEtBQUssRUFBRSxNQUFNO2VBRXBDLEtBQUMsTUFBTSxJQUFJOzs7SUFJZixRQUFDLG9CQUFPLEtBQUk7Ozs7Y0FFTTs7bUJBQVo7O2FBRUMsS0FBSyxlQUFPLEtBQUs7O1lBQ2hCLFVBQVUsTUFBTTs7YUFFakIsS0FBSyxlQUFPLEtBQUs7O1lBQ2hCLFVBQVUsTUFBTTs7UUFFcEIsY0FBVSxFQUFFLElBQUksR0FBRyxLQUFDLE9BQU8sSUFBSSxFQUFFLEtBQUs7UUFDdEMsY0FBVSxFQUFFLElBQUksR0FBRyxLQUFDLE9BQU8sSUFBSSxFQUFFLEtBQUs7UUFFdEMsY0FBVSxHQUFHLElBQUksSUFBRSxJQUFJLEtBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNuRCxjQUFVLEdBQUcsSUFBSSxJQUFFLElBQUksS0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLO1FBRW5ELE1BQU0sS0FBQyxnQkFBZ0I7UUFFdkIsSUFBSSxJQUFJLElBQUksSUFBSTtRQUNoQixJQUFJLElBQUksSUFBSSxJQUFJO1FBQ2hCLElBQUksSUFBSTtRQUNSLElBQUksSUFBSTthQUVMLEtBQUs7O1lBQ0osU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUMvQixJQUFJO2dDQUNTLEtBQUs7OztnQkFBZDtnQkFDQSxJQUFJLFNBQVMsS0FBSyxLQUFDLE1BQU0sTUFBTTs7O2VBRXZDOzs7SUFJSixRQUFDLHFCQUFRLFFBQU87O3dCQUVLOzttQkFBZjs7WUFFVSxVQUFUOztnQkFDSSxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/layout.kode
