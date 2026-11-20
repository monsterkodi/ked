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
        return this.inBox({x:0,y:0,w:cells.cols,h:cells.rows},rectree)
    }

    layout["inBox"] = function (box, node)
    {
        var child, h, inner, out, w, x, y, _23_54_, _23_66_, _24_54_, _24_66_, _39_24_

        if (!(node != null))
        {
            return node
        }
        _k_.assert("/home/kodi/s/ked/kode/ked/popo/layout.kode", 23, 8, "layout: w and r are both given" + " !((node.w != null) && (node.r != null))", !((node.w != null) && (node.r != null)))
        _k_.assert("/home/kodi/s/ked/kode/ked/popo/layout.kode", 24, 8, "layout: h and b are both given" + " !((node.h != null) && (node.b != null))", !((node.h != null) && (node.b != null)))
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
        var child, entry, found, _92_35_

        found = []
        if (node.blocks && node.w > 0 && node.h > 0)
        {
            found.push(node)
        }
        var list = ((_92_35_=node.children) != null ? _92_35_ : [])
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
        var blocker, child, _108_35_

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
        var list1 = ((_108_35_=node.children) != null ? _108_35_ : [])
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

    layout["titlify"] = function (cells, rectree, items = [], depth = 0)
    {
        var abstree, child, item, key, rect, type

        abstree = this.absolutize(cells,rectree)
        rectree.index = items.length
        var list = ['erase','text','pattern','bg','fg']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            type = list[_a_]
            if ((rectree[type] != null))
            {
                rect = {x:abstree.x,y:abstree.y,w:abstree.w,h:abstree.h}
                item = {title:_k_.lpad(depth + 2) + type,rect:rect,type:type,arg:rectree[type]}
                var list1 = ['x','y','w','h','r','b','fg','bg']
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    key = list1[_b_]
                    if ((rectree[key] != null))
                    {
                        item[key] = rectree[key]
                    }
                }
                break
            }
        }
        if (item)
        {
            items.push(item)
        }
        else
        {
            console.log('???',rectree)
        }
        var list2 = _k_.list(rectree.children)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            child = list2[_c_]
            this.titlify(cells,child,items,depth + 2)
        }
        return items
    }

    layout["modifyTreeNode"] = function (rectree, node)
    {
        var key, treeNode

        if (treeNode = this.nodeAtIndex(rectree,node.index))
        {
            var list = ['x','y','w','h','r','b','fg','bg']
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                key = list[_a_]
                if ((node[key] != null))
                {
                    treeNode[key] = node[key]
                }
                else
                {
                    delete treeNode[key]
                }
            }
        }
    }

    layout["nodeForPos"] = function (cells, rectree, pos)
    {
        var pair

        pair = this.topmostPairAt(this.absolutize(cells,rectree),rectree,pos)
        if (!(pair != null))
        {
            return null
        }
        return pair[0]
    }

    layout["insertTextAt"] = function (cells, rectree, pos, text)
    {
        var abs, node, offset, pair, scale, spare, target, width, _221_26_, _230_81_, _230_99_, _234_28_

        abs = this.absolutize(cells,rectree)
        pair = this.topmostPairAt(abs,rectree,pos)
        if ((pair != null))
        {
            var _a_ = pair; node = _a_[0]; target = _a_[1]

        }
        else
        {
            if (!(abs != null))
            {
                return 0
            }
            node = abs
            target = rectree
        }
        if (!_k_.empty(target.text))
        {
            scale = this.scaleOf(node)
            spare = target.text.length * scale + scale
            offset = this.textOffsetIn(node,pos,target.text.length)
            target.text = target.text.slice(0, typeof offset === 'number' ? offset : -1) + text + target.text.slice(offset)
            if (parseInt(target.w) === spare && parseInt(target.h) === scale && !(target.r != null) && !(target.b != null))
            {
                target.w = spare + text.split('\n')[0].length * scale
            }
        }
        else
        {
            width = text.split('\n')[0].length
            target.children = ((_234_28_=target.children) != null ? _234_28_ : [])
            target.children.push({text:text,x:pos[0] - node.x,y:pos[1] - node.y,w:width + 1,h:1})
            scale = 1
        }
        return scale * text.split('\n')[0].length
    }

    layout["topmostPairAt"] = function (abs, raw, pos)
    {
        var child, found, hit, i, _244_25_, _249_36_

        if (!(abs != null) || !(raw != null))
        {
            return null
        }
        found = null
        if (this.holds(abs,pos))
        {
            found = [abs,raw]
        }
        var list = ((_249_36_=abs.children) != null ? _249_36_ : [])
        for (i = 0; i < list.length; i++)
        {
            child = list[i]
            if (hit = this.topmostPairAt(child,raw.children[i],pos))
            {
                found = hit
            }
        }
        return found
    }

    layout["textOffsetIn"] = function (node, pos, length)
    {
        var offset, perLine, scale

        scale = this.scaleOf(node)
        perLine = _k_.max(1,parseInt(node.w / scale))
        offset = (_k_.max(0,pos[1] - node.y) * perLine) + parseInt(_k_.max(0,pos[0] - node.x) / scale)
        return _k_.clamp(0,length,offset)
    }

    layout["scaleOf"] = function (node)
    {
        var _267_29_

        if (!!_k_.empty(node.text))
        {
            return 1
        }
        return _k_.max(1,parseInt(((_267_29_=node.scale) != null ? _267_29_ : 1)))
    }

    layout["holds"] = function (node, pos)
    {
        var x, y

        x = pos[0]
        y = pos[1]
        return x >= node.x && x < node.x + node.w && y >= node.y && y < node.y + node.h
    }

    layout["nodeAtIndex"] = function (rectree, index)
    {
        var child, n

        if (rectree.index === index)
        {
            return rectree
        }
        var list = _k_.list(rectree.children)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            n = this.nodeAtIndex(child,index)
            if (n)
            {
                return n
            }
        }
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
        var child, _389_47_, _391_35_

        if (!(node != null))
        {
            return
        }
        if (!(node.erase != null))
        {
            this.paintNode(node,grid)
        }
        var list = ((_391_35_=node.children) != null ? _391_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.paintTree(child,grid)
        }
    }

    layout["paintNode"] = function (node, grid)
    {
        var cell, chars, gone, i, j, masked, rng, scale, strings, width, x, y, _396_29_, _406_38_, _414_43_, _424_43_, _427_41_, _433_41_

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
            scale = _k_.max(1,parseInt(((_406_38_=node.scale) != null ? _406_38_ : 1)))
        }
        masked = this.channelMaskOf(node)
        for (var _a_ = i = 0, _b_ = node.regions.length; (_a_ <= _b_ ? i < node.regions.length : i > node.regions.length); (_a_ <= _b_ ? ++i : --i))
        {
            rng = node.regions[i]
            width = rng[2] - rng[0]
            chars = Array.from(((_414_43_=(strings != null ? strings[i] : undefined)) != null ? _414_43_ : ''))
            for (var _c_ = j = 0, _d_ = width; (_c_ <= _d_ ? j < width : j > width); (_c_ <= _d_ ? ++j : --j))
            {
                x = rng[0] + j
                y = rng[1]
                if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length)
                {
                    continue
                }
                cell = grid[y][x]
                gone = ((_424_43_=masked[`${x},${y}`]) != null ? _424_43_ : {})
                if (!_k_.empty(strings) && !gone.char)
                {
                    cell.char = ((_427_41_=chars[j]) != null ? _427_41_ : ' ')
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
        var channel, channels, child, entry, key, masked, rng, x, _454_35_, _456_39_, _461_37_

        masked = {}
        var list = ((_454_35_=node.children) != null ? _454_35_ : [])
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
            var list1 = ((_461_37_=child.regions) != null ? _461_37_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL2xheW91dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDYSxVQUFQOzs7QUFFWCxVQUFEOzs7OztJQVdJLFFBQUMseUJBQVksT0FBTTs7ZUFFZixLQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sS0FBSyxFQUFFLE1BQU0sTUFBTTs7O0lBRS9DLFFBQUMsb0JBQU8sS0FBSTs7OztjQUVNOzttQkFBWjs7Z0hBRXNDLEtBQUssZUFBTyxLQUFLLGlCQUFqQixLQUFLLGVBQU8sS0FBSztnSEFDakIsS0FBSyxlQUFPLEtBQUssaUJBQWpCLEtBQUssZUFBTyxLQUFLO1FBRXpELGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBQ3RDLGNBQVUsRUFBRSxJQUFJLEdBQUcsS0FBQyxPQUFPLElBQUksRUFBRSxLQUFLO1FBRXRDLGNBQVUsR0FBRyxJQUFJLElBQUUsSUFBSSxLQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbkQsY0FBVSxHQUFHLElBQUksSUFBRSxJQUFJLEtBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSztRQUVuRCxNQUFNLEtBQUMsZ0JBQWdCO1FBRXZCLElBQUksSUFBSSxJQUFJLElBQUk7UUFDaEIsSUFBSSxJQUFJLElBQUksSUFBSTtRQUNoQixJQUFJLElBQUk7UUFDUixJQUFJLElBQUk7YUFFTCxLQUFLOztZQUNKLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDL0IsSUFBSTtnQ0FDUyxLQUFLOzs7Z0JBQWQ7Z0JBQ0EsSUFBSSxTQUFTLEtBQUssS0FBQyxNQUFNLE1BQU07OztlQUV2Qzs7O0lBRUosUUFBQyxxQkFBUSxRQUFPOzt3QkFFSzs7bUJBQWY7O1lBRVUsVUFBVDs7Z0JBQ0ksTUFBTSxT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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/popo/layout.kode
