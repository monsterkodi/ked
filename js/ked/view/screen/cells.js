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
        this["add_scaled"] = this["add_scaled"].bind(this)
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

    cells.prototype["add_scaled"] = function (x, y, char, fg, bg, scale)
    {
        if (this.inside(x,y))
        {
            return this.screen.add_scaled(this.wx(x),this.wy(y),char,fg,bg,scale)
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
        var _48_46_

        if (this.inside(x,y))
        {
            this.m = ((_48_46_=this.m) != null ? _48_46_ : belt.metas(this.cols,this.rows))
            return this.m[y][x].pre.push(p)
        }
    }

    cells.prototype["meta_pst"] = function (x, y, p)
    {
        var _49_46_

        if (this.inside(x,y))
        {
            this.m = ((_49_46_=this.m) != null ? _49_46_ : belt.metas(this.cols,this.rows))
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
        var bg, fg, x, y, _177_16_, _185_20_, _186_20_, _202_26_

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
        opt.pad = ((_177_16_=opt.pad) != null ? _177_16_ : [1,0])
        fg = ((_185_20_=opt.fg) != null ? _185_20_ : '#888')
        bg = ((_186_20_=opt.bg) != null ? _186_20_ : null)
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
        var list = ((_202_26_=opt.hdiv) != null ? _202_26_ : [])
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
        var fg, zLayer, _224_24_, _225_28_

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
        fg = ((_224_24_=opt.fg) != null ? _224_24_ : '#888')
        zLayer = ((_225_28_=opt.zLayer) != null ? _225_28_ : 1000)
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

    cells.prototype["draw_rounded_cursor"] = function (x, y, fg, scale = 1)
    {
        if (this.screen.t.headless)
        {
            this.set_mark(x,y,'main')
            this.swap_fg_bg(x,y)
            return
        }
        return rounded.place(this.wx(x),this.wy(y),"rounded.cursor",fg,null,null,1000,null,scale)
    }

    cells.prototype["draw_rounded_multi_cursor"] = function (x, y, fg, scale = 1)
    {
        if (this.screen.t.headless)
        {
            this.set_mark(x,y,'multi')
            this.swap_fg_bg(x,y)
            return
        }
        return rounded.place(this.wx(x),this.wy(y),"rounded.multi",fg,null,null,1000,null,scale)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvc2NyZWVuL2NlbGxzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FZc0IsV0FBUDs7T0FDTyxZQUFaO09BQWtCLFlBQWxCOztPQUNZLGNBQUE7OztBQUViLFNBQVQ7O2FBRUksT0FBSTs7UUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFBVyxLQUFDLElBQUksS0FBQyxJQUFJLEtBQUMsT0FBTyxLQUFDLE9BQU87OztxQkFFeEM7O2dCQUFVLEtBQUMsRUFBRSxLQUFDLEVBQUUsS0FBQyxJQUFFLEtBQUMsT0FBSyxFQUFFLEtBQUMsSUFBRSxLQUFDLE9BQUs7OztxQkFFcEMscUJBQVMsR0FBRyxHQUFHLE1BQU07O1FBQWI7UUFBRztRQUFHO1FBQU07OztxQkFRcEIsaUJBQUk7O2dCQUFLLElBQUksSUFBSSxLQUFDLElBQUUsS0FBQyxPQUFLLElBQUksS0FBQyxJQUFFOzs7cUJBQ2pDLGlCQUFJOztnQkFBSyxJQUFJLElBQUksS0FBQyxJQUFFLEtBQUMsT0FBSyxJQUFJLEtBQUMsSUFBRTs7O3FCQUVqQyxxQkFBUyxHQUFFOztnQkFBSyxLQUFLLEtBQUEsSUFBSSxLQUFDLFVBQVMsS0FBSyxLQUFBLElBQUksS0FBQzs7O3FCQUM3QyxzQkFBUyxHQUFFOztnQkFBUyxLQUFDLE9BQU8sRUFBRTs7O3FCQUU5QixrQkFBWSxHQUFFLEdBQUUsTUFBSyxJQUFHOztZQUFTLEtBQUMsT0FBTyxFQUFFOzttQkFBSyxLQUFDLE9BQU8sSUFBVSxLQUFDLEdBQUcsR0FBRyxLQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUc7Ozs7bUJBQVE7Ozs7cUJBQ2hHLHlCQUFZLEdBQUUsR0FBRSxNQUFLLElBQUcsSUFBRzs7WUFBWSxLQUFDLE9BQU8sRUFBRTs7bUJBQUssS0FBQyxPQUFPLFdBQVcsS0FBQyxHQUFHLEdBQUcsS0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUc7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/cells.kode
