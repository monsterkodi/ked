var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var attrCodes, screen

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import color from "../../theme/color.js"

import belt from "../../edit/tool/belt.js"


screen = (function ()
{
    screen["MAIN_MARK"] = '\x1b[4:1m'
    screen["MULTI_MARK"] = '\x1b[4:5m'
    screen["SELECT_MARK"] = '\x1b[7;4:3m'
    screen["HILGHT_MARK"] = '\x1b[7;4:4m'
    screen["END_MARK"] = '\x1b[0m'
    screen["BLOCK_MARK"] = '·'
    function screen (t)
    {
        this.t = t
    
        this["renderString"] = this["renderString"].bind(this)
        this["render"] = this["render"].bind(this)
        this["set_mark"] = this["set_mark"].bind(this)
        this["textColored"] = this["textColored"].bind(this)
        this["textMarked"] = this["textMarked"].bind(this)
        this["dumpChar"] = this["dumpChar"].bind(this)
        this["text"] = this["text"].bind(this)
        this["get_bg"] = this["get_bg"].bind(this)
        this["get_fg"] = this["get_fg"].bind(this)
        this["get_char"] = this["get_char"].bind(this)
        this["fill_bg"] = this["fill_bg"].bind(this)
        this["get_attr"] = this["get_attr"].bind(this)
        this["set_attr"] = this["set_attr"].bind(this)
        this["set_fg_bg"] = this["set_fg_bg"].bind(this)
        this["set_fg"] = this["set_fg"].bind(this)
        this["set_bg"] = this["set_bg"].bind(this)
        this["set_ch_fg"] = this["set_ch_fg"].bind(this)
        this["set_char"] = this["set_char"].bind(this)
        this["set"] = this["set"].bind(this)
        this["erase_scaled"] = this["erase_scaled"].bind(this)
        this["blockAt"] = this["blockAt"].bind(this)
        this["isBlock"] = this["isBlock"].bind(this)
        this["markBlock"] = this["markBlock"].bind(this)
        this["add_scaled"] = this["add_scaled"].bind(this)
        this["addRun"] = this["addRun"].bind(this)
        this["add"] = this["add"].bind(this)
        this["init"] = this["init"].bind(this)
        this.init()
    }

    screen.prototype["init"] = function ()
    {
        this.rows = this.t.rows()
        this.cols = this.t.cols()
        this.c = belt.cells(this.cols,this.rows)
        this.frameRuns = []
        this.frameBlocks = []
        return this.eraseRects = []
    }

    screen.prototype["add"] = function (x, y, char, fg, bg)
    {
        var w

        w = kseg.segWidth(char)
        if (w > 1)
        {
            if (char.length > 4)
            {
                char = '\x1b]66;w=2;' + char + '\x07'
            }
            this.set(x,y,char,fg,bg)
            this.set(x + 1,y,null,fg,bg)
            return 2
        }
        else
        {
            this.set(x,y,char,fg,bg)
            return 1
        }
    }

    screen.prototype["addRun"] = function (x, y, scale, w)
    {
        var run, _45_19_

        this.frameRuns = ((_45_19_=this.frameRuns) != null ? _45_19_ : [])
        if (run = this.frameRuns.slice(-1)[0])
        {
            if (run[1] === y && run[2] === scale && run[0] + run[3] * scale === x)
            {
                run[3] = run[3] + w
                return
            }
        }
        return this.frameRuns.push([x,y,scale,w])
    }

    screen.prototype["scaled_char"] = function (char, scale, width)
    {
        return `\x1b]66;s=${scale}:w=${width};${char}\x07`
    }

    screen.prototype["add_scaled"] = function (x, y, char, fg, bg, scale, line = null)
    {
        var i, j, w, _65_25_

        if (scale <= 1)
        {
            return this.add(x,y,char,fg,bg)
        }
        w = _k_.max(1,kseg.segWidth(char))
        if (this.t.textSizing)
        {
            char = this.scaled_char(char,scale,w)
            this.addRun(x,y,scale,w)
            this.frameBlocks = ((_65_25_=this.frameBlocks) != null ? _65_25_ : [])
            this.frameBlocks.push([x,y,scale,w])
        }
        this.set(x,y,char,fg,bg)
        for (var _a_ = j = 0, _b_ = scale; (_a_ <= _b_ ? j < scale : j > scale); (_a_ <= _b_ ? ++j : --j))
        {
            for (var _c_ = i = 0, _d_ = scale * w; (_c_ <= _d_ ? i < scale * w : i > scale * w); (_c_ <= _d_ ? ++i : --i))
            {
                if (i || j)
                {
                    if (j > 0 && i === 0 && this.t.textSizing)
                    {
                        this.set(x + i,y + j,`\x1b[${scale * w}C`,null,null)
                    }
                    else
                    {
                        this.set(x + i,y + j,null,null,null)
                    }
                }
            }
        }
        if (this.t.textSizing)
        {
            this.markBlock(x,y,scale,w,line)
        }
        return scale * w
    }

    screen.prototype["markBlock"] = function (x, y, scale, w, line)
    {
        var block, c, r

        block = [x,y,scale,w,line]
        for (var _a_ = r = _k_.max(0,y), _b_ = _k_.min(this.rows,y + scale); (_a_ <= _b_ ? r < _k_.min(this.rows,y + scale) : r > _k_.min(this.rows,y + scale)); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = _k_.max(0,x), _d_ = _k_.min(this.cols,x + scale * w); (_c_ <= _d_ ? c < _k_.min(this.cols,x + scale * w) : c > _k_.min(this.cols,x + scale * w)); (_c_ <= _d_ ? ++c : --c))
            {
                this.c[r][c].block = block
            }
        }
    }

    screen.prototype["isBlock"] = function (x, y)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return !_k_.empty(this.c[y][x].block)
        }
        return false
    }

    screen.prototype["blockAt"] = function (x, y)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return this.c[y][x].block
        }
        return null
    }

    screen.prototype["erase_scaled"] = function (x1, y1, x2, y2, bg = null)
    {
        var bx, by, scale, w, x, xx, y, yy, _117_20_, _128_44_

        x1 = _k_.max(0,x1)
        y1 = _k_.max(0,y1)
        x2 = _k_.min(this.cols - 1,x2)
        y2 = _k_.min(this.rows - 1,y2)
        if (x1 > x2 || y1 > y2)
        {
            return
        }
        this.eraseRects = ((_117_20_=this.eraseRects) != null ? _117_20_ : [])
        this.eraseRects.push([x1,y1,x2,y2])
        post.emit('screen.erased',[x1,y1,x2,y2])
        for (var _a_ = y = y1, _b_ = y2; (_a_ <= _b_ ? y <= y2 : y >= y2); (_a_ <= _b_ ? ++y : --y))
        {
            for (var _c_ = x = x1, _d_ = x2; (_c_ <= _d_ ? x <= x2 : x >= x2); (_c_ <= _d_ ? ++x : --x))
            {
                this.c[y][x].char = ' '
                if ((bg != null))
                {
                    this.c[y][x].bg = bg
                }
                this.c[y][x].block = null
            }
        }
        var list = ((_128_44_=this.frameBlocks) != null ? _128_44_ : [])
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            bx = list[_e_][0]
            by = list[_e_][1]
            scale = list[_e_][2]
            w = list[_e_][3]
            if (bx > x2 || bx + scale * w - 1 < x1)
            {
                continue
            }
            if (by > y2 || by + scale - 1 < y1)
            {
                continue
            }
            for (var _f_ = yy = by, _10_ = _k_.min(this.rows - 1,by + scale - 1); (_f_ <= _10_ ? yy <= _k_.min(this.rows - 1,by + scale - 1) : yy >= _k_.min(this.rows - 1,by + scale - 1)); (_f_ <= _10_ ? ++yy : --yy))
            {
                for (var _11_ = xx = bx, _12_ = _k_.min(this.cols - 1,bx + scale * w - 1); (_11_ <= _12_ ? xx <= _k_.min(this.cols - 1,bx + scale * w - 1) : xx >= _k_.min(this.cols - 1,bx + scale * w - 1)); (_11_ <= _12_ ? ++xx : --xx))
                {
                    this.c[yy][xx].char = ' '
                    this.c[yy][xx].block = null
                }
            }
        }
    }

    screen.prototype["set"] = function (x, y, char, fg, bg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            this.c[y][x].char = char
            this.c[y][x].fg = (fg != null ? fg : [])
            this.c[y][x].bg = (bg != null ? bg : [])
            return this.c[y][x].block = null
        }
    }

    screen.prototype["set_char"] = function (x, y, char)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            this.c[y][x].char = char
            return this.c[y][x].block = null
        }
    }

    screen.prototype["set_ch_fg"] = function (x, y, char, fg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            this.c[y][x].char = char
            this.c[y][x].fg = fg
            return this.c[y][x].block = null
        }
    }

    screen.prototype["set_bg"] = function (x, y, bg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            _k_.assert("/home/kodi/s/ked/kode/ked/view/screen/screen.kode", 160, 12, "assert failed!" + " !_k_.empty(this.c[y][x])", !_k_.empty(this.c[y][x]))
            if (this.c[y][x])
            {
                return this.c[y][x].bg = bg
            }
        }
    }

    screen.prototype["set_fg"] = function (x, y, fg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return this.c[y][x].fg = fg
        }
    }

    screen.prototype["set_fg_bg"] = function (x, y, fg, bg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            this.c[y][x].fg = fg
            return this.c[y][x].bg = bg
        }
    }

    screen.prototype["set_attr"] = function (x, y, attr, ul)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            this.c[y][x].attr = attr
            return this.c[y][x].ul = ul
        }
    }

    screen.prototype["get_attr"] = function (x, y)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return [this.c[y][x].attr,this.c[y][x].ul]
        }
        return [null,null]
    }

    screen.prototype["fill_bg"] = function (bg)
    {
        var cell, row

        var list = _k_.list(this.c)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            var list1 = _k_.list(row)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                cell = list1[_b_]
                cell.bg = bg
            }
        }
    }

    screen.prototype["get_char"] = function (x, y)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return this.c[y][x].char
        }
        return ''
    }

    screen.prototype["get_fg"] = function (x, y)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return this.c[y][x].fg
        }
        return []
    }

    screen.prototype["get_bg"] = function (x, y)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return this.c[y][x].bg
        }
        return []
    }

    screen.prototype["text"] = function ()
    {
        var line, lines, x, y

        lines = []
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            line = ''
            for (var _c_ = x = 0, _d_ = this.cols; (_c_ <= _d_ ? x < this.cols : x > this.cols); (_c_ <= _d_ ? ++x : --x))
            {
                line += this.dumpChar(x,y)
            }
            lines.push(line.replace(/\s+$/,''))
        }
        return lines
    }

    screen.prototype["dumpChar"] = function (x, y)
    {
        var block, cell, _236_25_

        cell = this.c[y][x]
        if (block = cell.block)
        {
            if (x !== block[0] || y !== block[1])
            {
                return screen.BLOCK_MARK
            }
            return (((_236_25_=cell.char) != null ? _236_25_ : '')).replace(/^\x1b\]66;[^;]*;/,'').replace(/\x07$/,'')
        }
        return (!_k_.empty((cell.char)) ? cell.char : ' ')
    }

    screen.prototype["textMarked"] = function ()
    {
        var ch, line, lines, mark, x, y

        lines = []
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            line = ''
            for (var _c_ = x = 0, _d_ = this.cols; (_c_ <= _d_ ? x < this.cols : x > this.cols); (_c_ <= _d_ ? ++x : --x))
            {
                ch = this.dumpChar(x,y)
                if (mark = this.c[y][x].mark)
                {
                    switch (mark)
                    {
                        case 'selection':
                            line += screen.SELECT_MARK
                            break
                        case 'highlight':
                            line += screen.HILGHT_MARK
                            break
                        case 'main':
                            line += screen.MAIN_MARK
                            break
                        default:
                            line += screen.MULTI_MARK
                    }

                    line += ch + screen.END_MARK
                }
                else
                {
                    line += ch
                }
            }
            lines.push(line.replace(/\s+$/,''))
        }
        return lines
    }

    screen.prototype["textColored"] = function ()
    {
        var bg, cell, ch, fg, line, lines, mark, pattr, pbg, pfg, pul, x, y

        lines = []
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            line = ''
            pbg = ''
            pfg = ''
            pattr = null
            pul = null
            for (var _c_ = x = 0, _d_ = this.cols; (_c_ <= _d_ ? x < this.cols : x > this.cols); (_c_ <= _d_ ? ++x : --x))
            {
                cell = this.c[y][x]
                ch = this.dumpChar(x,y)
                if (cell.attr !== pattr || cell.ul !== pul)
                {
                    line += screen.END_MARK
                    pattr = cell.attr
                    pul = cell.ul
                    pbg = ''
                    pfg = ''
                    line += attrCodes(cell.attr,cell.ul)
                }
                bg = color.bg_rgb(cell.bg)
                if (bg !== pbg)
                {
                    line += bg
                    pbg = bg
                }
                fg = color.fg_rgb(cell.fg)
                if (fg !== pfg)
                {
                    line += fg
                    pfg = fg
                }
                if (mark = cell.mark)
                {
                    switch (mark)
                    {
                        case 'selection':
                            line += screen.SELECT_MARK
                            break
                        case 'highlight':
                            line += screen.HILGHT_MARK
                            break
                        case 'main':
                            line += screen.MAIN_MARK
                            break
                        default:
                            line += screen.MULTI_MARK
                    }

                    line += ch + screen.END_MARK
                    pbg = ''
                    pfg = ''
                }
                else
                {
                    line += ch
                }
            }
            lines.push(line + screen.END_MARK)
        }
        return lines
    }

    screen.prototype["set_mark"] = function (x, y, kind)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return this.c[y][x].mark = kind
        }
    }

    screen.prototype["render"] = function ()
    {
        return this.t.write(this.renderString())
    }

    screen.prototype["renderString"] = function ()
    {
        var attr, bg, bx, by, char, fg, pattr, pbg, pfg, pul, r, s, scale, ul, width, x, x1, x2, y, y1, y2, _340_45_, _344_41_, _348_33_

        s = ''
        pbg = ''
        pfg = ''
        pattr = null
        pul = null
        var list = ((_340_45_=this.lastRuns) != null ? _340_45_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            bx = list[_a_][0]
            by = list[_a_][1]
            scale = list[_a_][2]
            width = list[_a_][3]
            for (var _b_ = r = by, _c_ = by + scale; (_b_ <= _c_ ? r < by + scale : r > by + scale); (_b_ <= _c_ ? ++r : --r))
            {
                s += `\x1b[${r + 1};${bx + 1}H\x1b[${width * scale}X`
            }
        }
        var list1 = ((_344_41_=this.eraseRects) != null ? _344_41_ : [])
        for (var _d_ = 0; _d_ < list1.length; _d_++)
        {
            x1 = list1[_d_][0]
            y1 = list1[_d_][1]
            x2 = list1[_d_][2]
            y2 = list1[_d_][3]
            for (var _e_ = r = y1, _f_ = y2; (_e_ <= _f_ ? r <= y2 : r >= y2); (_e_ <= _f_ ? ++r : --r))
            {
                s += `\x1b[${r + 1};${x1 + 1}H\x1b[${x2 - x1 + 1}X`
            }
        }
        this.lastRuns = ((_348_33_=this.frameRuns) != null ? _348_33_ : [])
        this.frameRuns = []
        this.frameBlocks = []
        this.eraseRects = []
        s += '\x1b[H'
        for (var _10_ = y = 0, _11_ = this.rows; (_10_ <= _11_ ? y < this.rows : y > this.rows); (_10_ <= _11_ ? ++y : --y))
        {
            for (var _12_ = x = 0, _13_ = this.cols; (_12_ <= _13_ ? x < this.cols : x > this.cols); (_12_ <= _13_ ? ++x : --x))
            {
                char = this.c[y][x].char
                if (char === null)
                {
                    continue
                }
                attr = this.c[y][x].attr
                ul = this.c[y][x].ul
                if (attr !== pattr || ul !== pul)
                {
                    s += '\x1b[0m'
                    pattr = attr
                    pul = ul
                    pbg = ''
                    pfg = ''
                    s += attrCodes(attr,ul)
                }
                bg = color.bg_rgb(this.c[y][x].bg)
                if (bg !== pbg)
                {
                    s += bg
                    pbg = bg
                }
                fg = color.fg_rgb(this.c[y][x].fg)
                if (fg !== pfg)
                {
                    s += fg
                    pfg = fg
                }
                s += char
            }
            if (y !== this.rows - 1)
            {
                s += '\n'
            }
        }
        return s
    }

    return screen
})()


attrCodes = function (attr, ul)
{
    var codes

    codes = ''
    if (!_k_.empty(attr) && !_k_.empty(attr))
    {
        if (attr.includes('b'))
        {
            codes += '\x1b[1m'
        }
        if (attr.includes('i'))
        {
            codes += '\x1b[3m'
        }
        if (attr.includes('u'))
        {
            codes += '\x1b[4m'
        }
        if (attr.includes('s'))
        {
            codes += '\x1b[9m'
        }
    }
    if (!_k_.empty(ul))
    {
        codes += `\x1b[58:2::${ul[0]}:${ul[1]}:${ul[2]}m`
    }
    return codes
}
export default screen;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L3NjcmVlbi9zY3JlZW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLOztPQUNMLFlBQVo7O09BQ1ksV0FBUDs7O0FBQ2QsVUFBRDs7SUFHSSxRQUFDLGNBQWE7SUFDZCxRQUFDLGVBQWE7SUFDZCxRQUFDLGdCQUFhO0lBQ2QsUUFBQyxnQkFBYTtJQUNkLFFBQUMsYUFBYTtJQUNkLFFBQUMsZUFBYTthQUVkLFFBQUk7O1FBQUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUMsS0FBQzs7O3NCQUVMOztRQUVJLEtBQUMsT0FBTyxLQUFDLEVBQUU7UUFDWCxLQUFDLE9BQU8sS0FBQyxFQUFFO1FBRVgsS0FBQyxJQUFJLEtBQUssTUFBTSxLQUFDLEtBQUssS0FBQztRQUV2QixLQUFDO1FBQ0QsS0FBQztlQUNELEtBQUM7OztzQkFFTCxrQkFBSyxHQUFFLEdBQUUsTUFBSyxJQUFHOzs7O1FBRWIsSUFBSSxLQUFLLFNBQVM7WUFDZixJQUFJOztnQkFDQSxLQUFLLFNBQVM7O2dCQUNiLE9BQU8saUJBQWlCLE9BQU87O1lBQ25DLEtBQUMsSUFBSSxFQUFJLEVBQUUsS0FBSyxHQUFHO1lBQ25CLEtBQUMsSUFBSSxJQUFFLEVBQUUsRUFBRSxLQUFLLEdBQUc7bUJBQ25COzs7O1lBRUEsS0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEdBQUc7bUJBQ2pCOzs7O3NCQUVSLHFCQUFRLEdBQUUsR0FBRSxPQUFNOzs7O1FBRWQsS0FBQyxzQkFBRCxLQUFDO1lBRUUsTUFBTSxLQUFDOztnQkFDSCxJQUFJLE9BQU0sS0FBTSxJQUFJLE9BQU0sU0FBVSxJQUFJLEtBQUssSUFBSSxLQUFHLFVBQVM7O2dCQUM1RCxJQUFJLEtBQUssSUFBSSxLQUFLOzs7O2VBRzFCLEtBQUMsVUFBVSxNQUFNLEVBQUUsRUFBRSxNQUFNOzs7c0JBRS9CLDBCQUFhLE1BQUssT0FBTTs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/screen.kode
