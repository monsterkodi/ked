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
        this["get_bg"] = this["get_bg"].bind(this)
        this["get_fg"] = this["get_fg"].bind(this)
        this["get_char"] = this["get_char"].bind(this)
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
            return this.c[y][x].bg = bg
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L3NjcmVlbi9zY3JlZW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWtCUSxLQUFDOzs7OztRQUlELEtBQUMsT0FBTyxLQUFDLEVBQUU7UUFDWCxLQUFDLE9BQU8sS0FBQyxFQUFFO2VBRVgsS0FBQyxJQUFJLEtBQUssTUFBTSxLQUFDLEtBQUssS0FBQzs7Ozs7OztRQVd2QixJQUFJLEtBQUssU0FBUztZQUNmLElBQUk7O2dCQUNBLEtBQUssU0FBUzs7Z0JBQ2IsT0FBTyxpQkFBaUIsT0FBTzs7WUFDbkMsS0FBQyxJQUFJLEVBQUksRUFBRSxLQUFLLEdBQUc7WUFDbkIsS0FBQyxJQUFJLElBQUUsRUFBRSxFQUFFLEtBQUssR0FBRzttQkFDbkI7Ozs7WUFFQSxLQUFDLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRzttQkFDakI7Ozs7OzthQUlELEtBQUssS0FBQSxJQUFJLEtBQUMsVUFBUyxLQUFLLEtBQUEsSUFBSSxLQUFDOztZQUM1QixLQUFDLEVBQUUsR0FBRyxHQUFHLE9BQU87WUFDaEIsS0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFLLGFBQUE7bUJBQ2QsS0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFLLGFBQUE7Ozs7OzthQUlmLEtBQUssS0FBQSxJQUFJLEtBQUMsVUFBUyxLQUFLLEtBQUEsSUFBSSxLQUFDOzttQkFDNUIsS0FBQyxFQUFFLEdBQUcsR0FBRyxPQUFPOzs7Ozs7YUFJakIsS0FBSyxLQUFBLElBQUksS0FBQyxVQUFTLEtBQUssS0FBQSxJQUFJLEtBQUM7O1lBQzVCLEtBQUMsRUFBRSxHQUFHLEdBQUcsT0FBTzttQkFDaEIsS0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFPOzs7Ozs7YUFJakIsS0FBSyxLQUFBLElBQUksS0FBQyxVQUFTLEtBQUssS0FBQSxJQUFJLEtBQUM7O21CQUM1QixLQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUs7Ozs7OzthQUlmLEtBQUssS0FBQSxJQUFJLEtBQUMsVUFBUyxLQUFLLEtBQUEsSUFBSSxLQUFDOzttQkFDNUIsS0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLOzs7Ozs7YUFJZixLQUFLLEtBQUEsSUFBSSxLQUFDLFVBQVMsS0FBSyxLQUFBLElBQUksS0FBQzs7WUFDNUIsS0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLO21CQUNkLEtBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSzs7Ozs7O2FBeUJmLEtBQUssS0FBQSxJQUFJLEtBQUMsVUFBUyxLQUFLLEtBQUEsSUFBSSxLQUFDOzttQkFDMUIsS0FBQyxFQUFFLEdBQUcsR0FBRzs7ZUFDZjs7Ozs7YUFJRyxLQUFLLEtBQUEsSUFBSSxLQUFDLFVBQVMsS0FBSyxLQUFBLElBQUksS0FBQzs7bUJBQzFCLEtBQUMsRUFBRSxHQUFHLEdBQUc7Ozs7Ozs7YUFLWixLQUFLLEtBQUEsSUFBSSxLQUFDLFVBQVMsS0FBSyxLQUFBLElBQUksS0FBQzs7bUJBQzFCLEtBQUMsRUFBRSxHQUFHLEdBQUc7Ozs7Ozs7OztRQVdmLEtBQUMsRUFBRSxVQUFVLEVBQUU7UUFDZixJQUFJO1FBQ0osTUFBTTtRQUNOLE1BQU07MkJBRUcsU0FBSSxLQUFDLHdCQUFELEtBQUMsV0FBRCxLQUFDOzsrQkFDRCxTQUFJLEtBQUMsd0JBQUQsS0FBQyxXQUFELEtBQUM7O2dCQUVWLE9BQU8sS0FBQyxFQUFFLEdBQUcsR0FBRztvQkFDSixTQUFROztvQkFBcEI7O2dCQUVBLEtBQUssTUFBTSxPQUFPLEtBQUMsRUFBRSxHQUFHLEdBQUc7b0JBQ3hCLE9BQU07O29CQUNMLEtBQUs7b0JBQ0wsTUFBTTs7Z0JBQ1YsS0FBSyxNQUFNLE9BQU8sS0FBQyxFQUFFLEdBQUcsR0FBRztvQkFDeEIsT0FBTTs7b0JBQ0wsS0FBSztvQkFDTCxNQUFNOztnQkFLVixLQUFLOztnQkFLSSxNQUFLLEtBQUMsT0FBSzs7Z0JBQXhCLEtBQUs7OztlQUVULEtBQUMsRUFBRSxNQUFNOzs7Ozs7ZUFFViJ9
//# sourceURL=kode/ked/view/screen/screen.kode
