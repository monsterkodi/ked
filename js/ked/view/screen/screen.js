var _k_ = {assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this["add"] = this["add"].bind(this)
        this["init"] = this["init"].bind(this)
        this.init()
    }

    screen.prototype["init"] = function ()
    {
        this.rows = this.t.rows()
        this.cols = this.t.cols()
        return this.c = belt.cells(this.cols,this.rows)
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
            _k_.assert("/home/kodi/s/ked/kode/ked/view/screen/screen.kode", 69, 12, "assert failed!" + " !_k_.empty(this.c[y][x])", !_k_.empty(this.c[y][x]))
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
        var bg, char, fg, pbg, pfg, s, x, y

        this.t.setCursor(0,0)
        s = ''
        pbg = ''
        pfg = ''
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            for (var _c_ = x = 0, _d_ = this.cols; (_c_ <= _d_ ? x < this.cols : x > this.cols); (_c_ <= _d_ ? ++x : --x))
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
        return this.t.write(s)
    }

    return screen
})()

export default screen;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L3NjcmVlbi9zY3JlZW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBY1MsVUFBVDs7YUFFSSxRQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDOzs7c0JBRUw7O1FBRUksS0FBQyxPQUFPLEtBQUMsRUFBRTtRQUNYLEtBQUMsT0FBTyxLQUFDLEVBQUU7ZUFFWCxLQUFDLElBQUksS0FBSyxNQUFNLEtBQUMsS0FBSyxLQUFDOzs7c0JBUzNCLGtCQUFLLEdBQUUsR0FBRSxNQUFLLElBQUc7Ozs7UUFFYixJQUFJLEtBQUssU0FBUztZQUNmLElBQUk7O2dCQUNBLEtBQUssU0FBUzs7Z0JBQ2IsT0FBTyxpQkFBaUIsT0FBTzs7WUFDbkMsS0FBQyxJQUFJLEVBQUksRUFBRSxLQUFLLEdBQUc7WUFDbkIsS0FBQyxJQUFJLElBQUUsRUFBRSxFQUFFLEtBQUssR0FBRzttQkFDbkI7Ozs7WUFFQSxLQUFDLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRzttQkFDakI7Ozs7c0JBRVIsa0JBQUssR0FBRSxHQUFFLE1BQUssSUFBRzs7YUFFVixLQUFLLEtBQUEsSUFBSSxLQUFDLFVBQVMsS0FBSyxLQUFBLElBQUksS0FBQzs7WUFDNUIsS0FBQyxFQUFFLEdBQUcsR0FBRyxPQUFPO1lBQ2hCLEtBQUMsRUFBRSxHQUFHLEdBQUcsTUFBSyxhQUFBO21CQUNkLEtBQUMsRUFBRSxHQUFHLEdBQUcsTUFBSyxhQUFBOzs7O3NCQUV0Qix1QkFBVSxHQUFFLEdBQUU7O2FBRVAsS0FBSyxLQUFBLElBQUksS0FBQyxVQUFTLEtBQUssS0FBQSxJQUFJLEtBQUM7O21CQUM1QixLQUFDLEVBQUUsR0FBRyxHQUFHLE9BQU87Ozs7c0JBRXhCLHdCQUFXLEdBQUUsR0FBRSxNQUFLOzthQUViLEtBQUssS0FBQSxJQUFJLEtBQUMsVUFBUyxLQUFLLEtBQUEsSUFBSSxLQUFDOztZQUM1QixLQUFDLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/screen.kode
