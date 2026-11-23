var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        this["set_mark"] = this["set_mark"].bind(this)
        this["draw_rounded_multi_cursor"] = this["draw_rounded_multi_cursor"].bind(this)
        this["draw_rounded_cursor"] = this["draw_rounded_cursor"].bind(this)
        this["draw_rounded_border"] = this["draw_rounded_border"].bind(this)
        this["draw_frame"] = this["draw_frame"].bind(this)
        this["fill_col"] = this["fill_col"].bind(this)
        this["fill_row"] = this["fill_row"].bind(this)
        this["fill_rect"] = this["fill_rect"].bind(this)
        this["bg_fill"] = this["bg_fill"].bind(this)
        this["bg_block"] = this["bg_block"].bind(this)
        this["bg_rect"] = this["bg_rect"].bind(this)
        this["posForEvent"] = this["posForEvent"].bind(this)
        this["screenForPos"] = this["screenForPos"].bind(this)
        this["posForScreen"] = this["posForScreen"].bind(this)
        this["rectForScreen"] = this["rectForScreen"].bind(this)
        this["isOutsideEvent"] = this["isOutsideEvent"].bind(this)
        this["isInsideEvent"] = this["isInsideEvent"].bind(this)
        this["isOutsideScreen"] = this["isOutsideScreen"].bind(this)
        this["isInsideScreen"] = this["isInsideScreen"].bind(this)
        this["isOutsidePos"] = this["isOutsidePos"].bind(this)
        this["isInsidePos"] = this["isInsidePos"].bind(this)
        this["get_fg"] = this["get_fg"].bind(this)
        this["get_bg"] = this["get_bg"].bind(this)
        this["get_char"] = this["get_char"].bind(this)
        this["blockAt"] = this["blockAt"].bind(this)
        this["isScaled"] = this["isScaled"].bind(this)
        this["get_attr"] = this["get_attr"].bind(this)
        this["set_attr"] = this["set_attr"].bind(this)
        this["set_fg_bg"] = this["set_fg_bg"].bind(this)
        this["set_fg"] = this["set_fg"].bind(this)
        this["set_bg"] = this["set_bg"].bind(this)
        this["set_ch_fg"] = this["set_ch_fg"].bind(this)
        this["set_char"] = this["set_char"].bind(this)
        this["set_unsafe"] = this["set_unsafe"].bind(this)
        this["set"] = this["set"].bind(this)
        this["erase_scaled"] = this["erase_scaled"].bind(this)
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

    cells.prototype["add_scaled"] = function (x, y, char, fg, bg, scale, line = null)
    {
        if (this.inside(x,y))
        {
            return this.screen.add_scaled(this.wx(x),this.wy(y),char,fg,bg,scale,line)
        }
        else
        {
            return Infinity
        }
    }

    cells.prototype["erase_scaled"] = function (x1, y1, x2, y2, bg = null)
    {
        return this.screen.erase_scaled(this.wx(x1),this.wy(y1),this.wx(x2),this.wy(y2),bg)
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

    cells.prototype["set_attr"] = function (x, y, attr, ul)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_attr(this.wx(x),this.wy(y),attr,ul)
        }
    }

    cells.prototype["get_attr"] = function (x, y)
    {
        return this.screen.get_attr(this.wx(x),this.wy(y))
    }

    cells.prototype["isScaled"] = function (x, y)
    {
        return this.screen.isBlock(this.wx(x),this.wy(y))
    }

    cells.prototype["blockAt"] = function (x, y)
    {
        var block

        block = this.screen.blockAt(this.wx(x),this.wy(y))
        if (!(block != null))
        {
            return
        }
        return [block[0] - this.x,block[1] - this.y,block[2],block[3],block[4]]
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
        ;[x,y] = belt.pos(x,y)
        return ((0 <= x && x < this.cols)) && ((0 <= y && y < this.rows))
    }

    cells.prototype["isOutsidePos"] = function (x, y)
    {
        ;[x,y] = belt.pos(x,y)
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

    cells.prototype["rectForScreen"] = function (rct)
    {
        var p1, p2

        p1 = this.posForScreen(rct[0],rct[1])
        p2 = this.posForScreen(rct[2],rct[3])
        return [p1[0],p1[1],p2[0],p2[1]]
    }

    cells.prototype["posForScreen"] = function (x, y)
    {
        ;[x,y] = belt.pos(x,y)
        return [x - this.x,y - this.y]
    }

    cells.prototype["screenForPos"] = function (x, y)
    {
        ;[x,y] = belt.pos(x,y)
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
        for (row = y1; row <= y2; row++)
        {
            if (row < this.rows)
            {
                for (col = x1; col <= x2; col++)
                {
                    if (col < this.cols)
                    {
                        this.set_bg(col,row,bg)
                    }
                }
            }
        }
    }

    cells.prototype["bg_block"] = function (block, bg)
    {
        var c, r

        for (r = block[1]; r < _k_.min(this.rows,block[1] + block[2]); r++)
        {
            for (c = block[0]; c < _k_.min(this.cols,block[0] + block[2] * block[3]); c++)
            {
                this.set_bg(c,r,bg)
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
        for (row = y1; row <= y2; row++)
        {
            if (row < this.rows)
            {
                for (col = x1; col <= x2; col++)
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
        for (row = y1; row <= y2; row++)
        {
            for (col = x1; col <= x2; col++)
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
        for (col = x1; col <= x2; col++)
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
        for (row = y1; row <= y2; row++)
        {
            this.set(col,row,char,fg,bg)
        }
    }

    cells.prototype["draw_frame"] = function (x1, y1, x2, y2, opt)
    {
        var bg, fg, x, y, _154_16_, _162_20_, _163_20_, _179_26_

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
        opt.pad = ((_154_16_=opt.pad) != null ? _154_16_ : [1,0])
        fg = ((_162_20_=opt.fg) != null ? _162_20_ : '#888')
        bg = ((_163_20_=opt.bg) != null ? _163_20_ : null)
        this.set(x1,y1,'╭',fg,bg)
        this.set(x2,y1,'╮',fg,bg)
        this.set(x1,y2,'╰',fg,bg)
        this.set(x2,y2,'╯',fg,bg)
        this.fill_row(y1,x1 + 1,x2 - 1,'─',fg,bg)
        this.fill_row(y2,x1 + 1,x2 - 1,'─',fg,bg)
        this.fill_col(x1,y1 + 1,y2 - 1,'│',fg,bg)
        this.fill_col(x2,y1 + 1,y2 - 1,'│',fg,bg)
        for (x = 0; x < opt.pad[0]; x++)
        {
            this.fill_col(x1 + 1 + x,y1 + 1,y2 - 1,' ',fg,bg)
            this.fill_col(x2 - 1 - x,y1 + 1,y2 - 1,' ',fg,bg)
        }
        var list = ((_179_26_=opt.hdiv) != null ? _179_26_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            y = list[_a_]
            this.set(x1,y,'',fg,bg)
            this.set(x2,y,'',fg,bg)
            this.fill_row(y,x1 + 1,x2 - 1,'─',fg,bg)
        }
    }

    cells.prototype["draw_rounded_border"] = function (x1, y1, x2, y2, opt)
    {
        var fg, zLayer, _193_24_, _194_28_

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
        fg = ((_193_24_=opt.fg) != null ? _193_24_ : '#888')
        zLayer = ((_194_28_=opt.zLayer) != null ? _194_28_ : 1000)
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

    cells.prototype["cellRectImageIdsFor"] = function (rect, csz, fg)
    {
        var hpx, imgId, key, t, wpx, _222_52_, _225_28_

        t = this.screen.t
        key = `${rect.w}x${rect.h}:${csz[0]}x${csz[1]}:${fg}`
        if (this.cellRectKey === key && (this.cellRectImageIds != null))
        {
            return this.cellRectImageIds
        }
        if ((this.cellRectImageIds != null))
        {
            var list = _k_.list(this.cellRectImageIds)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                imgId = list[_a_]
                t.deleteImage(imgId)
            }
        }
        wpx = rect.w * csz[0]
        hpx = rect.h * csz[1]
        this.cellRectImageIds = [t.sendImg(rounded.cellRect('top',wpx,csz[1],fg)),t.sendImg(rounded.cellRect('bottom',wpx,csz[1],fg)),t.sendImg(rounded.cellRect('left',csz[0],hpx,fg)),t.sendImg(rounded.cellRect('right',csz[0],hpx,fg))]
        this.cellRectKey = key
        return this.cellRectImageIds
    }

    cells.prototype["draw_cell_rect"] = function (rect)
    {
        var csz, ids, ph, pid, pw, t, x1, x2, y1, y2, _258_21_

        t = this.screen.t
        csz = t.cellsz
        this.cellRect = rect
        if (_k_.empty(csz))
        {
            return []
        }
        ids = this.cellRectImageIdsFor(rect,csz,theme.editor.cellrect)
        x1 = this.wx(rect.x)
        y1 = this.wy(rect.y)
        x2 = this.wx(rect.x + rect.w - 1)
        y2 = this.wy(rect.y + rect.h - 1)
        this.cellRectPid = ((_258_21_=this.cellRectPid) != null ? _258_21_ : 0)
        this.cellRectPid += 1
        pid = this.cellRectPid
        pw = rect.w * csz[0]
        ph = rect.h * csz[1]
        t.placeOverlay(ids[0],pid,x1,y1,0,pw,csz[1])
        t.placeOverlay(ids[1],pid,x1,y2,0,pw,csz[1])
        t.placeOverlay(ids[2],pid,x1,y1,0,csz[0],ph)
        t.placeOverlay(ids[3],pid,x2,y1,0,csz[0],ph)
        return [[ids[0],pid],[ids[1],pid],[ids[2],pid],[ids[3],pid]]
    }

    cells.prototype["del_cell_rect"] = function (rectid)
    {
        var imgId, pid

        delete this.cellRect
        if (_k_.empty(rectid))
        {
            return
        }
        var list = _k_.list(rectid)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            imgId = list[_a_][0]
            pid = list[_a_][1]
            this.screen.t.hideOverlay(imgId,pid)
        }
    }

    cells.prototype["draw_rounded_cursor"] = function (x, y, fg, scale = 1)
    {
        this.set_mark(x,y,'main')
        return rounded.place(this.wx(x),this.wy(y),"rounded.cursor",fg,null,null,1000,null,scale)
    }

    cells.prototype["draw_rounded_multi_cursor"] = function (x, y, fg, scale = 1)
    {
        this.set_mark(x,y,'multi')
        return rounded.place(this.wx(x),this.wy(y),"rounded.multi",fg,null,null,1000,null,scale)
    }

    cells.prototype["set_mark"] = function (x, y, kind)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_mark(this.wx(x),this.wy(y),kind)
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvc2NyZWVuL2NlbGxzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDc0IsV0FBUDs7T0FDTyxZQUFaO09BQWtCLFlBQWxCOztPQUNZLGNBQUE7OztBQUNyQixTQUFEOzthQU1JLE9BQUk7O1FBQUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFBVyxLQUFDLElBQUksS0FBQyxJQUFJLEtBQUMsT0FBTyxLQUFDLE9BQU87OztxQkFFeEM7O2dCQUFVLEtBQUMsRUFBRSxLQUFDLEVBQUUsS0FBQyxJQUFFLEtBQUMsT0FBSyxFQUFFLEtBQUMsSUFBRSxLQUFDLE9BQUs7OztxQkFFcEMscUJBQVMsR0FBRyxHQUFHLE1BQU07O1FBQWI7UUFBRztRQUFHO1FBQU07OztxQkFFcEIsaUJBQUk7O2dCQUFLLElBQUksSUFBSSxLQUFDLElBQUUsS0FBQyxPQUFLLElBQUksS0FBQyxJQUFFOzs7cUJBQ2pDLGlCQUFJOztnQkFBSyxJQUFJLElBQUksS0FBQyxJQUFFLEtBQUMsT0FBSyxJQUFJLEtBQUMsSUFBRTs7O3FCQUVqQyxxQkFBUyxHQUFFOztnQkFBSyxLQUFLLEtBQUEsSUFBSSxLQUFDLFVBQVMsS0FBSyxLQUFBLElBQUksS0FBQzs7O3FCQUM3QyxzQkFBUyxHQUFFOztnQkFBUyxLQUFDLE9BQU8sRUFBRTs7O3FCQUU5QixrQkFBWSxHQUFFLEdBQUUsTUFBSyxJQUFHOztZQUFTLEtBQUMsT0FBTyxFQUFFOzttQkFBSyxLQUFDLE9BQU8sSUFBVSxLQUFDLEdBQUcsR0FBRyxLQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUc7Ozs7bUJBQVE7Ozs7cUJBQ2hHLHlCQUFZLEdBQUUsR0FBRSxNQUFLLElBQUcsSUFBRyxPQUFNLE9BQUs7O1lBQVcsS0FBQyxPQUFPLEVBQUU7O21CQUFLLEtBQUMsT0FBTyxXQUFXLEtBQUMsR0FBRyxHQUFHLEtBQUMsR0FBRyxHQUFHLEtB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
//# sourceURL=../../../../kode/ked/view/screen/cells.kode
