var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var screen

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import color from "../../theme/color.js"

import belt from "../../edit/tool/belt.js"


screen = (function ()
{
    function screen (t)
    {
        this.t = t
    
        this["renderString"] = this["renderString"].bind(this)
        this["erase_scaled"] = this["erase_scaled"].bind(this)
        this["render"] = this["render"].bind(this)
        this["set_mark"] = this["set_mark"].bind(this)
        this["textColored"] = this["textColored"].bind(this)
        this["textMarked"] = this["textMarked"].bind(this)
        this["text"] = this["text"].bind(this)
        this["get_bg"] = this["get_bg"].bind(this)
        this["get_fg"] = this["get_fg"].bind(this)
        this["get_char"] = this["get_char"].bind(this)
        this["fill_bg"] = this["fill_bg"].bind(this)
        this["set_fg_bg"] = this["set_fg_bg"].bind(this)
        this["set_fg"] = this["set_fg"].bind(this)
        this["set_bg"] = this["set_bg"].bind(this)
        this["set_ch_fg"] = this["set_ch_fg"].bind(this)
        this["set_char"] = this["set_char"].bind(this)
        this["set"] = this["set"].bind(this)
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
        var run, _60_19_

        this.frameRuns = ((_60_19_=this.frameRuns) != null ? _60_19_ : [])
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

    screen.prototype["add_scaled"] = function (x, y, char, fg, bg, scale)
    {
        var i, j, w, _82_25_

        if (scale <= 1)
        {
            return this.add(x,y,char,fg,bg)
        }
        w = _k_.max(1,kseg.segWidth(char))
        if (this.t.textSizing)
        {
            char = this.scaled_char(char,scale,w)
            this.addRun(x,y,scale,w)
            this.frameBlocks = ((_82_25_=this.frameBlocks) != null ? _82_25_ : [])
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
        return scale * w
    }

    screen.prototype["set"] = function (x, y, char, fg, bg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            this.c[y][x].char = char
            this.c[y][x].fg = (fg != null ? fg : [])
            return this.c[y][x].bg = (bg != null ? bg : [])
        }
    }

    screen.prototype["set_char"] = function (x, y, char)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            return this.c[y][x].char = char
        }
    }

    screen.prototype["set_ch_fg"] = function (x, y, char, fg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            this.c[y][x].char = char
            return this.c[y][x].fg = fg
        }
    }

    screen.prototype["set_bg"] = function (x, y, bg)
    {
        if ((0 <= x && x < this.cols) && (0 <= y && y < this.rows))
        {
            _k_.assert("/home/kodi/s/ked/kode/ked/view/screen/screen.kode", 118, 12, "assert failed!" + " !_k_.empty(this.c[y][x])", !_k_.empty(this.c[y][x]))
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
        var ch, line, lines, x, y

        lines = []
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            line = ''
            for (var _c_ = x = 0, _d_ = this.cols; (_c_ <= _d_ ? x < this.cols : x > this.cols); (_c_ <= _d_ ? ++x : --x))
            {
                ch = this.c[y][x].char
                if (!!_k_.empty(ch))
                {
                    ch = ' '
                }
                line += ch
            }
            lines.push(line.replace(/\s+$/,''))
        }
        return lines
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
                ch = this.c[y][x].char
                if (!!_k_.empty(ch))
                {
                    ch = ' '
                }
                if (mark = this.c[y][x].mark)
                {
                    if (mark === 'main')
                    {
                        line += '\x1b[7;4:3m'
                    }
                    else
                    {
                        line += '\x1b[7m'
                    }
                    line += ch + '\x1b[0m'
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
        var bg, cell, ch, fg, line, lines, mark, pbg, pfg, x, y

        lines = []
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            line = ''
            pbg = ''
            pfg = ''
            for (var _c_ = x = 0, _d_ = this.cols; (_c_ <= _d_ ? x < this.cols : x > this.cols); (_c_ <= _d_ ? ++x : --x))
            {
                cell = this.c[y][x]
                ch = cell.char
                if (!!_k_.empty(ch))
                {
                    ch = ' '
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
                    line += (mark === 'main' ? '\x1b[7;4:3m' : '\x1b[7m')
                    line += ch + '\x1b[0m'
                    pbg = ''
                    pfg = ''
                }
                else
                {
                    line += ch
                }
            }
            lines.push(line + '\x1b[0m')
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

    screen.prototype["erase_scaled"] = function (x1, y1, x2, y2, bg = null)
    {
        var bx, by, scale, w, x, xx, y, yy, _317_20_, _329_44_

        x1 = _k_.max(0,x1)
        y1 = _k_.max(0,y1)
        x2 = _k_.min(this.cols - 1,x2)
        y2 = _k_.min(this.rows - 1,y2)
        if (x1 > x2 || y1 > y2)
        {
            return
        }
        this.eraseRects = ((_317_20_=this.eraseRects) != null ? _317_20_ : [])
        this.eraseRects.push([x1,y1,x2,y2])
        for (var _a_ = y = y1, _b_ = y2; (_a_ <= _b_ ? y <= y2 : y >= y2); (_a_ <= _b_ ? ++y : --y))
        {
            for (var _c_ = x = x1, _d_ = x2; (_c_ <= _d_ ? x <= x2 : x >= x2); (_c_ <= _d_ ? ++x : --x))
            {
                this.c[y][x].char = ' '
                if ((bg != null))
                {
                    this.c[y][x].bg = bg
                }
            }
        }
        var list = ((_329_44_=this.frameBlocks) != null ? _329_44_ : [])
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
                }
            }
        }
    }

    screen.prototype["renderString"] = function ()
    {
        var bg, bx, by, char, fg, pbg, pfg, r, s, scale, width, x, x1, x2, y, y1, y2, _348_45_, _352_41_, _356_33_

        s = ''
        pbg = ''
        pfg = ''
        var list = ((_348_45_=this.lastRuns) != null ? _348_45_ : [])
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
        var list1 = ((_352_41_=this.eraseRects) != null ? _352_41_ : [])
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
        this.lastRuns = ((_356_33_=this.frameRuns) != null ? _356_33_ : [])
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

export default screen;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L3NjcmVlbi9zY3JlZW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVVhLFVBQUE7SUFBUzs7T0FDQSxZQUFaOztPQUNZLFdBQVA7OztBQUVOLFVBQVQ7O2FBRUksUUFBSTs7UUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDOzs7c0JBRUw7O1FBRUksS0FBQyxPQUFPLEtBQUMsRUFBRTtRQUNYLEtBQUMsT0FBTyxLQUFDLEVBQUU7UUFFWCxLQUFDLElBQUksS0FBSyxNQUFNLEtBQUMsS0FBSyxLQUFDO1FBR3ZCLEtBQUM7UUFDRCxLQUFDO2VBQ0QsS0FBQzs7O3NCQVFMLGtCQUFLLEdBQUUsR0FBRSxNQUFLLElBQUc7Ozs7UUFFYixJQUFJLEtBQUssU0FBUztZQUNmLElBQUk7O2dCQUNBLEtBQUssU0FBUzs7Z0JBQ2IsT0FBTyxpQkFBaUIsT0FBTzs7WUFDbkMsS0FBQyxJQUFJLEVBQUksRUFBRSxLQUFLLEdBQUc7WUFDbkIsS0FBQyxJQUFJLElBQUUsRUFBRSxFQUFFLEtBQUssR0FBRzttQkFDbkI7Ozs7WUFFQSxLQUFDLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRzttQkFDakI7Ozs7c0JBUVIscUJBQVEsR0FBRSxHQUFFLE9BQU07Ozs7UUFFZCxLQUFDLHNCQUFELEtBQUM7WUFFRSxNQUFNLEtBQUM7O2dCQUNILElBQUksT0FBTSxLQUFNLElBQUksT0FBTSxTQUFVLElBQUksS0FBSyxJQUFJLEtBQUcsVUFBUzs7Z0JBQzVELElBQUksS0FBSyxJQUFJLEtBQUs7Ozs7ZUFHMUIsS0FBQyxVQUFVLE1BQU0sRUFBRSxFQUFFLE1BQU07OztzQkFJL0IsMEJBQWEsTUFBSyxPQUFNOzs0QkFBc0IsV0FBVyxTQUFTOzs7c0JBRWxFLHlCQUFZLEdBQUUsR0FBRSxNQUFLLElBQUcsSUFBRzs7OztZQUVFLFNBQVM7O21CQUFoQyxLQUFDLElBQUksRUFBRSxFQUFFLEtBQUss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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/screen.kode
