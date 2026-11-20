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

    layout["titlify"] = function (cells, rectree, items = [], depth = 0, abstree = null)
    {
        var child, i, item, key, rect, type

        if (!(abstree != null))
        {
            abstree = this.absolutize(cells,rectree)
        }
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
        var list2 = _k_.list(rectree.children)
        for (i = 0; i < list2.length; i++)
        {
            child = list2[i]
            this.titlify(cells,child,items,depth + 2,abstree.children[i])
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
