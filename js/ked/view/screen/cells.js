var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var cells

import belt from "../../edit/tool/belt.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import rounded from "../../util/img/rounded.js"


cells = (function ()
{
    function cells (screen)
    {
        this.screen = screen
    
        this["adjustContrastForHighlight"] = this["adjustContrastForHighlight"].bind(this)
        this["img"] = this["img"].bind(this)
        this["swap_fg_bg"] = this["swap_fg_bg"].bind(this)
        this["set_mark"] = this["set_mark"].bind(this)
        this["draw_rounded_multi_cursor"] = this["draw_rounded_multi_cursor"].bind(this)
        this["draw_rounded_cursor"] = this["draw_rounded_cursor"].bind(this)
        this["draw_rounded_border"] = this["draw_rounded_border"].bind(this)
        this["draw_frame"] = this["draw_frame"].bind(this)
        this["fill_col"] = this["fill_col"].bind(this)
        this["fill_row"] = this["fill_row"].bind(this)
        this["fill_rect"] = this["fill_rect"].bind(this)
        this["bg_fill"] = this["bg_fill"].bind(this)
        this["bg_rect"] = this["bg_rect"].bind(this)
        this["posForEvent"] = this["posForEvent"].bind(this)
        this["screenForPos"] = this["screenForPos"].bind(this)
        this["posForScreen"] = this["posForScreen"].bind(this)
        this["isOutsideEvent"] = this["isOutsideEvent"].bind(this)
        this["isInsideEvent"] = this["isInsideEvent"].bind(this)
        this["isOutsideScreen"] = this["isOutsideScreen"].bind(this)
        this["isInsideScreen"] = this["isInsideScreen"].bind(this)
        this["isOutsidePos"] = this["isOutsidePos"].bind(this)
        this["isInsidePos"] = this["isInsidePos"].bind(this)
        this["get_fg"] = this["get_fg"].bind(this)
        this["get_bg"] = this["get_bg"].bind(this)
        this["get_char"] = this["get_char"].bind(this)
        this["meta_clone"] = this["meta_clone"].bind(this)
        this["meta_pst"] = this["meta_pst"].bind(this)
        this["meta_pre"] = this["meta_pre"].bind(this)
        this["meta_clear"] = this["meta_clear"].bind(this)
        this["set_fg_bg"] = this["set_fg_bg"].bind(this)
        this["set_fg"] = this["set_fg"].bind(this)
        this["set_bg"] = this["set_bg"].bind(this)
        this["set_ch_fg"] = this["set_ch_fg"].bind(this)
        this["set_char"] = this["set_char"].bind(this)
        this["set_unsafe"] = this["set_unsafe"].bind(this)
        this["set"] = this["set"].bind(this)
        this["add"] = this["add"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this.x = this.y = this.cols = this.rows = 0
    }

    cells.prototype["rect"] = function ()
    {
        return [this.x,this.y,this.x + this.cols - 1,this.y + this.rows - 1]
    }

    cells.prototype["layout"] = function (x, y, cols, rows)
    {
        this.x = x
        this.y = y
        this.cols = cols
        this.rows = rows
    }

    cells.prototype["wx"] = function (x)
    {
        return (x < 0 ? this.x + this.cols + x : this.x + x)
    }

    cells.prototype["wy"] = function (y)
    {
        return (y < 0 ? this.y + this.rows + y : this.y + y)
    }

    cells.prototype["inside"] = function (x, y)
    {
        return (0 <= x && x < this.cols) && (0 <= y && y < this.rows)
    }

    cells.prototype["outside"] = function (x, y)
    {
        return !this.inside(x,y)
    }

    cells.prototype["add"] = function (x, y, char, fg, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.add(this.wx(x),this.wy(y),char,fg,bg)
        }
        else
        {
            return Infinity
        }
    }

    cells.prototype["set"] = function (x, y, char, fg, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set(this.wx(x),this.wy(y),char,fg,bg)
        }
    }

    cells.prototype["set_unsafe"] = function (x, y, char, fg, bg)
    {
        return this.screen.set(this.x + x,this.y + y,char,fg,bg)
    }

    cells.prototype["set_char"] = function (x, y, char)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_char(this.wx(x),this.wy(y),char)
        }
    }

    cells.prototype["set_ch_fg"] = function (x, y, char, fg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_ch_fg(this.wx(x),this.wy(y),char,fg)
        }
    }

    cells.prototype["set_bg"] = function (x, y, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_bg(this.wx(x),this.wy(y),bg)
        }
    }

    cells.prototype["set_fg"] = function (x, y, fg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_fg(this.wx(x),this.wy(y),fg)
        }
    }

    cells.prototype["set_fg_bg"] = function (x, y, fg, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_fg_bg(this.wx(x),this.wy(y),fg,bg)
        }
    }

    cells.prototype["meta_clear"] = function ()
    {
        return delete this.m
    }

    cells.prototype["meta_pre"] = function (x, y, p)
    {
        var _47_46_

        if (this.inside(x,y))
        {
            this.m = ((_47_46_=this.m) != null ? _47_46_ : belt.metas(this.cols,this.rows))
            return this.m[y][x].pre.push(p)
        }
    }

    cells.prototype["meta_pst"] = function (x, y, p)
    {
        var _48_46_

        if (this.inside(x,y))
        {
            this.m = ((_48_46_=this.m) != null ? _48_46_ : belt.metas(this.cols,this.rows))
            return this.m[y][x].pst.push(p)
        }
    }

    cells.prototype["meta_clone"] = function (x, y)
    {
        if (_k_.empty(this.m))
        {
            return
        }
        return this.screen.meta_set(this.wx(x),this.wy(y),this.m[y][x])
    }

    cells.prototype["get_char"] = function (x, y)
    {
        return this.screen.get_char(this.wx(x),this.wy(y))
    }

    cells.prototype["get_bg"] = function (x, y)
    {
        return this.screen.get_bg(this.wx(x),this.wy(y))
    }

    cells.prototype["get_fg"] = function (x, y)
    {
        return this.screen.get_fg(this.wx(x),this.wy(y))
    }

    cells.prototype["isInsidePos"] = function (x, y)
    {
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

        return ((0 <= x && x < this.cols)) && ((0 <= y && y < this.rows))
    }

    cells.prototype["isOutsidePos"] = function (x, y)
    {
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

        return x < 0 || x >= this.cols || y < 0 || y >= this.rows
    }

    cells.prototype["isInsideScreen"] = function (x, y)
    {
        return this.isInsidePos(this.posForScreen(x,y))
    }

    cells.prototype["isOutsideScreen"] = function (x, y)
    {
        return this.isOutsidePos(this.posForScreen(x,y))
    }

    cells.prototype["isInsideEvent"] = function (evt)
    {
        return this.isInsidePos(this.posForEvent(evt))
    }

    cells.prototype["isOutsideEvent"] = function (evt)
    {
        return this.isOutsidePos(this.posForEvent(evt))
    }

    cells.prototype["posForScreen"] = function (x, y)
    {
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

        return [x - this.x,y - this.y]
    }

    cells.prototype["screenForPos"] = function (x, y)
    {
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

        return [x + this.x,y + this.y]
    }

    cells.prototype["posForEvent"] = function (evt)
    {
        return this.posForScreen(evt.cell)
    }

    cells.prototype["bg_rect"] = function (x1, y1, x2, y2, bg)
    {
        var col, row

        if (x1 < 0)
        {
            x1 = this.cols + x1
        }
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y1 < 0)
        {
            y1 = this.rows + y1
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        for (var _a_ = row = y1, _b_ = y2; (_a_ <= _b_ ? row <= y2 : row >= y2); (_a_ <= _b_ ? ++row : --row))
        {
            if (row < this.rows)
            {
                for (var _c_ = col = x1, _d_ = x2; (_c_ <= _d_ ? col <= x2 : col >= x2); (_c_ <= _d_ ? ++col : --col))
                {
                    if (col < this.cols)
                    {
                        this.set_bg(col,row,bg)
                    }
                }
            }
        }
    }

    cells.prototype["bg_fill"] = function (x1, y1, x2, y2, bg)
    {
        var col, row

        if (x1 < 0)
        {
            x1 = this.cols + x1
        }
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y1 < 0)
        {
            y1 = this.rows + y1
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        if (x1 > x2)
        {
            return
        }
        for (var _a_ = row = y1, _b_ = y2; (_a_ <= _b_ ? row <= y2 : row >= y2); (_a_ <= _b_ ? ++row : --row))
        {
            if (row < this.rows)
            {
                for (var _c_ = col = x1, _d_ = x2; (_c_ <= _d_ ? col <= x2 : col >= x2); (_c_ <= _d_ ? ++col : --col))
                {
                    if (col < this.cols)
                    {
                        this.set_bg(col,row,bg)
                        this.set_char(col,row,' ')
                    }
                }
            }
        }
    }

    cells.prototype["fill_rect"] = function (x1, y1, x2, y2, char, fg, bg)
    {
        var col, row

        x1 = _k_.clamp(0,this.cols - 1,x1)
        y1 = _k_.clamp(0,this.rows - 1,y1)
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        for (var _a_ = row = y1, _b_ = y2; (_a_ <= _b_ ? row <= y2 : row >= y2); (_a_ <= _b_ ? ++row : --row))
        {
            for (var _c_ = col = x1, _d_ = x2; (_c_ <= _d_ ? col <= x2 : col >= x2); (_c_ <= _d_ ? ++col : --col))
            {
                this.set(col,row,char,fg,bg)
            }
        }
    }

    cells.prototype["fill_row"] = function (row, x1, x2, char, fg, bg)
    {
        var col

        if (x1 < 0 && x2 < 0)
        {
            return
        }
        x1 = _k_.clamp(0,this.cols - 1,x1)
        x2 = _k_.clamp(0,this.cols - 1,x2)
        if (x2 < x1)
        {
            return
        }
        for (var _a_ = col = x1, _b_ = x2; (_a_ <= _b_ ? col <= x2 : col >= x2); (_a_ <= _b_ ? ++col : --col))
        {
            this.set(col,row,char,fg,bg)
        }
    }

    cells.prototype["fill_col"] = function (col, y1, y2, char, fg, bg)
    {
        var row

        if (y1 < 0 && y2 < 0)
        {
            return
        }
        y1 = _k_.clamp(0,this.rows - 1,y1)
        y2 = _k_.clamp(0,this.rows - 1,y2)
        if (y2 < y1)
        {
            return
        }
        for (var _a_ = row = y1, _b_ = y2; (_a_ <= _b_ ? row <= y2 : row >= y2); (_a_ <= _b_ ? ++row : --row))
        {
            this.set(col,row,char,fg,bg)
        }
    }

    cells.prototype["draw_frame"] = function (x1, y1, x2, y2, opt)
    {
        var bg, fg, x, y, _176_16_, _184_20_, _185_20_, _201_26_

        if (x1 < 0 && x2 < 0)
        {
            return
        }
        if (y1 < 0 && y2 < 0)
        {
            return
        }
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        opt = (opt != null ? opt : {})
        opt.pad = ((_176_16_=opt.pad) != null ? _176_16_ : [1,0])
        fg = ((_184_20_=opt.fg) != null ? _184_20_ : '#888')
        bg = ((_185_20_=opt.bg) != null ? _185_20_ : null)
        this.set(x1,y1,'╭',fg,bg)
        this.set(x2,y1,'╮',fg,bg)
        this.set(x1,y2,'╰',fg,bg)
        this.set(x2,y2,'╯',fg,bg)
        this.fill_row(y1,x1 + 1,x2 - 1,'─',fg,bg)
        this.fill_row(y2,x1 + 1,x2 - 1,'─',fg,bg)
        this.fill_col(x1,y1 + 1,y2 - 1,'│',fg,bg)
        this.fill_col(x2,y1 + 1,y2 - 1,'│',fg,bg)
        for (var _a_ = x = 0, _b_ = opt.pad[0]; (_a_ <= _b_ ? x < opt.pad[0] : x > opt.pad[0]); (_a_ <= _b_ ? ++x : --x))
        {
            this.fill_col(x1 + 1 + x,y1 + 1,y2 - 1,' ',fg,bg)
            this.fill_col(x2 - 1 - x,y1 + 1,y2 - 1,' ',fg,bg)
        }
        var list = ((_201_26_=opt.hdiv) != null ? _201_26_ : [])
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            y = list[_c_]
            this.set(x1,y,'',fg,bg)
            this.set(x2,y,'',fg,bg)
            this.fill_row(y,x1 + 1,x2 - 1,'─',fg,bg)
        }
    }

    cells.prototype["draw_rounded_border"] = function (x1, y1, x2, y2, opt)
    {
        var fg, zLayer, _223_24_, _224_28_

        if (x1 < 0 && x2 < 0)
        {
            return
        }
        if (y1 < 0 && y2 < 0)
        {
            return
        }
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        opt = (opt != null ? opt : {})
        fg = ((_223_24_=opt.fg) != null ? _223_24_ : '#888')
        zLayer = ((_224_28_=opt.zLayer) != null ? _224_28_ : 1000)
        if (this.screen.t.headless)
        {
            this.draw_frame(x1,y1,x2,y2,opt)
            return
        }
        this.img(x1,y1,'rounded.border.tl',fg,zLayer)
        this.img(x2,y1,'rounded.border.tr',fg,zLayer)
        this.img(x1,y2,'rounded.border.bl',fg,zLayer)
        this.img(x2,y2,'rounded.border.br',fg,zLayer)
        this.img(x1 + 1,y1,'rounded.border.t',fg,zLayer,x2 - 1)
        if (y1 + 1 < y2)
        {
            this.img(x1,y1 + 1,'rounded.border.l',fg,zLayer,x1,y2 - 1)
        }
        if (x1 + 1 < x2)
        {
            this.img(x1 + 1,y2,'rounded.border.lb',fg,zLayer)
        }
        this.img(x1 + 2,y2,'rounded.border.b',fg,zLayer,x2 - 1)
        if (y1 + 1 < y2)
        {
            this.img(x2,y1 + 1,'rounded.border.rt',fg,zLayer,x2)
        }
        if (y1 + 2 < y2)
        {
            return this.img(x2,y1 + 2,'rounded.border.r',fg,zLayer,x2,y2 - 1)
        }
    }

    cells.prototype["draw_vertical_padding"] = function (x, y, fg, bg, zLayer = 1000)
    {
        return rounded.place(this.wx(x),this.wy(y),'rounded.vertical',fg,null,null,zLayer,bg)
    }

    cells.prototype["draw_horizontal_padding"] = function (x, y, fg, bg, zLayer = 1000)
    {
        return rounded.place(this.wx(x),this.wy(y),'rounded.horizontal',fg,null,null,zLayer,bg)
    }

    cells.prototype["draw_rounded_cursor"] = function (x, y, fg)
    {
        if (this.screen.t.headless)
        {
            this.set_mark(x,y,'main')
            this.swap_fg_bg(x,y)
            return
        }
        return this.img(x,y,"rounded.cursor",fg)
    }

    cells.prototype["draw_rounded_multi_cursor"] = function (x, y, fg)
    {
        if (this.screen.t.headless)
        {
            this.set_mark(x,y,'multi')
            this.swap_fg_bg(x,y)
            return
        }
        return this.img(x,y,"rounded.multi",fg)
    }

    cells.prototype["set_mark"] = function (x, y, kind)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_mark(this.wx(x),this.wy(y),kind)
        }
    }

    cells.prototype["swap_fg_bg"] = function (x, y)
    {
        var bg, fg

        fg = this.get_fg(x,y)
        bg = this.get_bg(x,y)
        return this.set_fg_bg(x,y,bg,fg)
    }

    cells.prototype["img"] = function (x, y, name, fg, zLayer = 1000, xe, ye)
    {
        if (this.outside(x,y))
        {
            return
        }
        return rounded.place(this.wx(x),this.wy(y),name,fg,this.wx(xe),this.wy(ye),zLayer)
    }

    cells.prototype["adjustContrastForHighlight"] = function (x, y, highlightColor)
    {
        var ofg

        ofg = this.get_fg(x,y)
        return this.set_fg(x,y,color.adjustForBackground(ofg,highlightColor))
    }

    return cells
})()

export default cells;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvc2NyZWVuL2NlbGxzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQWdCUyxTQUFUOzthQUVJLE9BQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUFXLEtBQUMsSUFBSSxLQUFDLElBQUksS0FBQyxPQUFPLEtBQUMsT0FBTzs7O3FCQUV4Qzs7Z0JBQVUsS0FBQyxFQUFFLEtBQUMsRUFBRSxLQUFDLElBQUUsS0FBQyxPQUFLLEVBQUUsS0FBQyxJQUFFLEtBQUMsT0FBSzs7O3FCQUVwQyxxQkFBUSxHQUFHLEdBQUcsTUFBTTs7Ozs7Ozs7cUJBUXBCLGlCQUFJOztnQkFBSyxJQUFJLElBQUksS0FBQyxJQUFFLEtBQUMsT0FBSyxJQUFJLEtBQUMsSUFBRTs7O3FCQUNqQyxpQkFBSTs7Z0JBQUssSUFBSSxJQUFJLEtBQUMsSUFBRSxLQUFDLE9BQUssSUFBSSxLQUFDLElBQUU7OztxQkFFakMscUJBQVMsR0FBRTs7Z0JBQUssS0FBSyxLQUFBLElBQUksS0FBQyxVQUFTLEtBQUssS0FBQSxJQUFJLEtBQUM7OztxQkFDN0Msc0JBQVMsR0FBRTs7Z0JBQVMsS0FBQyxPQUFPLEVBQUU7OztxQkFFOUIsa0JBQVksR0FBRSxHQUFFLE1BQUssSUFBRzs7WUFBUyxLQUFDLE9BQU8sRUFBRTs7bUJBQUssS0FBQyxPQUFPLElBQVUsS0FBQyxHQUFHLEdBQUcsS0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHOzs7O21CQUFROzs7O3FCQUNoRyxrQkFBWSxHQUFFLEdBQUUsTUFBSyxJQUFHOztZQUFTLEtBQUMsT0FBTyxFQUFFOzttQkFBSyxLQUFDLE9BQU8sSUFBVSxLQUFDLEdBQUcsR0FBRyxLQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUc7Ozs7cUJBQ3hGLHlCQUFZLEdBQUUsR0FBRSxNQUFLLElBQUc7O2VBQXdCLEtBQUMsT0FBTyxJQUFXLEtBQUMsSUFBRSxF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/cells.kode
