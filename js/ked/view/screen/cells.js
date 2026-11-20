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
        this["swap_fg_bg"] = this["swap_fg_bg"].bind(this)
        this["set_mark"] = this["set_mark"].bind(this)
        this["draw_rounded_multi_cursor"] = this["draw_rounded_multi_cursor"].bind(this)
        this["draw_rounded_cursor"] = this["draw_rounded_cursor"].bind(this)
        this["draw_cell_rect_corners"] = this["draw_cell_rect_corners"].bind(this)
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
            return null
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

    cells.prototype["rectForScreen"] = function (rct)
    {
        var p1, p2

        p1 = this.posForScreen(rct[0],rct[1])
        p2 = this.posForScreen(rct[2],rct[3])
        return [p1[0],p1[1],p2[0],p2[1]]
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

    cells.prototype["bg_block"] = function (block, bg)
    {
        var c, r

        for (var _a_ = r = block[1], _b_ = _k_.min(this.rows,block[1] + block[2]); (_a_ <= _b_ ? r < _k_.min(this.rows,block[1] + block[2]) : r > _k_.min(this.rows,block[1] + block[2])); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = block[0], _d_ = _k_.min(this.cols,block[0] + block[2] * block[3]); (_c_ <= _d_ ? c < _k_.min(this.cols,block[0] + block[2] * block[3]) : c > _k_.min(this.cols,block[0] + block[2] * block[3])); (_c_ <= _d_ ? ++c : --c))
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
        for (var _a_ = x = 0, _b_ = opt.pad[0]; (_a_ <= _b_ ? x < opt.pad[0] : x > opt.pad[0]); (_a_ <= _b_ ? ++x : --x))
        {
            this.fill_col(x1 + 1 + x,y1 + 1,y2 - 1,' ',fg,bg)
            this.fill_col(x2 - 1 - x,y1 + 1,y2 - 1,' ',fg,bg)
        }
        var list = ((_179_26_=opt.hdiv) != null ? _179_26_ : [])
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

    cells.prototype["cellRectImageIdsFor"] = function (rect, csz, fg)
    {
        var hpx, imgId, key, t, wpx, _226_52_, _229_28_

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
        var csz, ids, ph, pid, pw, t, x1, x2, y1, y2, _264_21_

        t = this.screen.t
        csz = t.cellsz
        if (t.headless)
        {
            this.cellRect = rect
            return []
        }
        if (_k_.empty(csz))
        {
            return []
        }
        ids = this.cellRectImageIdsFor(rect,csz,theme.editor.cellrect)
        x1 = this.wx(rect.x)
        y1 = this.wy(rect.y)
        x2 = this.wx(rect.x + rect.w - 1)
        y2 = this.wy(rect.y + rect.h - 1)
        this.cellRectPid = ((_264_21_=this.cellRectPid) != null ? _264_21_ : 0)
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

    cells.prototype["draw_cell_rect_corners"] = function ()
    {
        var rect, _291_26_

        if (!(this.cellRect != null))
        {
            return
        }
        rect = this.cellRect
        this.set_char(rect.x,rect.y,'╭')
        return this.set_char(rect.x + rect.w - 1,rect.y + rect.h - 1,'╯')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvc2NyZWVuL2NlbGxzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDc0IsV0FBUDs7T0FDTyxZQUFaO09BQWtCLFlBQWxCOztPQUNZLGNBQUE7OztBQUNyQixTQUFEOzthQU1JLE9BQUk7O1FBQUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUFXLEtBQUMsSUFBSSxLQUFDLElBQUksS0FBQyxPQUFPLEtBQUMsT0FBTzs7O3FCQUV4Qzs7Z0JBQVUsS0FBQyxFQUFFLEtBQUMsRUFBRSxLQUFDLElBQUUsS0FBQyxPQUFLLEVBQUUsS0FBQyxJQUFFLEtBQUMsT0FBSzs7O3FCQUVwQyxxQkFBUyxHQUFHLEdBQUcsTUFBTTs7UUFBYjtRQUFHO1FBQUc7UUFBTTs7O3FCQUVwQixpQkFBSTs7Z0JBQUssSUFBSSxJQUFJLEtBQUMsSUFBRSxLQUFDLE9BQUssSUFBSSxLQUFDLElBQUU7OztxQkFDakMsaUJBQUk7O2dCQUFLLElBQUksSUFBSSxLQUFDLElBQUUsS0FBQyxPQUFLLElBQUksS0FBQyxJQUFFOzs7cUJBRWpDLHFCQUFTLEdBQUU7O2dCQUFLLEtBQUssS0FBQSxJQUFJLEtBQUMsVUFBUyxLQUFLLEtBQUEsSUFBSSxLQUFDOzs7cUJBQzdDLHNCQUFTLEdBQUU7O2dCQUFTLEtBQUMsT0FBTyxFQUFFOzs7cUJBRTlCLGtCQUFZLEdBQUUsR0FBRSxNQUFLLElBQUc7O1lBQVMsS0FBQyxPQUFPLEVBQUU7O21CQUFLLEtBQUMsT0FBTyxJQUFVLEtBQUMsR0FBRyxHQUFHLEtBQUMsR0FBRyxHQUFHLEtBQUssR0FBRzs7OzttQkFBUTs7OztxQkFDaEcseUJBQVksR0FBRSxHQUFFLE1BQUssSUFBRyxJQUFHLE9BQU0sT0FBSzs7WUFBVyxLQUFDLE9BQU8sRUFBRTs7bUJBQUssS0FBQyxPQUFPLFdBQVcsS0FBQyxHQUFHLEdBQUcsS0FBQyxHQUFHLEdBQUcs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/cells.kode
