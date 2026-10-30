var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var matrix

import kxk from "../../../kxk.js"
let post = kxk.post

import squares from "../../util/img/squares.js"
import sircels from "../../util/img/sircels.js"

import view from "./view.js"


matrix = (function ()
{
    _k_.extend(matrix, view)
    function matrix (screen, name)
    {
        this["draw"] = this["draw"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["moveSelection"] = this["moveSelection"].bind(this)
        this["selectAt"] = this["selectAt"].bind(this)
        this["cellAtPos"] = this["cellAtPos"].bind(this)
        this["selectFirst"] = this["selectFirst"].bind(this)
        this["selectedText"] = this["selectedText"].bind(this)
        this["itemText"] = this["itemText"].bind(this)
        this["incScale"] = this["incScale"].bind(this)
        this["setItems"] = this["setItems"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        matrix.__super__.constructor.call(this,screen,name)
        this.setColor('bg',[0,0,0])
        this.setColor('fg',[200,200,200])
        this.setColor('selection',[68,68,170])
        this.setColor('selection_blur',[60,60,60])
        this.setColor('scroll',[26,26,26])
        this.setColor('scroll_dot',[136,136,255])
        this.items = []
        this.selectedIndex = 0
        this.offset = 0
        this.focused = false
        this.scale = 1
        post.on('focus',this.onFocus)
    }

    matrix.prototype["onFocus"] = function (name)
    {
        return this.focused = (name === this.name)
    }

    matrix.prototype["hasFocus"] = function ()
    {
        return this.focused
    }

    matrix.prototype["setItems"] = function (items)
    {
        this.items = (items != null ? items : [])
        this.selectedIndex = 0
        return this.offset = 0
    }

    matrix.prototype["incScale"] = function (delta)
    {
        var before

        before = this.scale
        this.scale += delta
        this.scale = _k_.clamp(1,4,this.scale)
        if (this.scale !== before)
        {
            this.clearArea()
        }
        this.ensureVisible()
        return true
    }

    matrix.prototype["clearArea"] = function ()
    {
        var row, t

        if (this.cells.screen.t.headless)
        {
            return
        }
        t = this.cells.screen.t
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            t.setCursor(this.cells.x,(this.cells.y + row))
            t.write(`\x1b[${this.cells.cols}X`)
        }
    }

    matrix.prototype["numItems"] = function ()
    {
        return this.items.length
    }

    matrix.prototype["baseColumns"] = function ()
    {
        var s

        s = this.scale
        return _k_.max(1,parseInt((this.cells.cols - s) / (s * 2)))
    }

    matrix.prototype["scrollBarVisible"] = function ()
    {
        var cols

        if (_k_.empty(this.items))
        {
            return false
        }
        if (this.cells.rows < 1)
        {
            return false
        }
        cols = this.baseColumns()
        return parseInt((this.items.length + cols - 1) / cols) > this.viewportRows()
    }

    matrix.prototype["columns"] = function ()
    {
        var bar, s

        s = this.scale
        bar = (this.scrollBarVisible() ? 1 : 0)
        return _k_.max(1,parseInt((this.cells.cols - bar - s) / (s * 2)))
    }

    matrix.prototype["viewportRows"] = function ()
    {
        return _k_.max(0,parseInt(this.cells.rows / this.scale))
    }

    matrix.prototype["numRows"] = function ()
    {
        var cols

        if (_k_.empty(this.items))
        {
            return 0
        }
        cols = this.columns()
        return Math.ceil(this.items.length / cols)
    }

    matrix.prototype["itemText"] = function (item)
    {
        var _117_25_

        if (_k_.isObj(item))
        {
            if (!_k_.empty(item.show))
            {
                return item.show
            }
            return ((_117_25_=item.char) != null ? _117_25_ : '')
        }
        return item
    }

    matrix.prototype["selected"] = function ()
    {
        return this.items[this.selectedIndex]
    }

    matrix.prototype["selectedText"] = function ()
    {
        return this.itemText(this.selected())
    }

    matrix.prototype["selectedPos"] = function ()
    {
        var cols

        cols = this.columns()
        return [this.selectedIndex % cols,parseInt(this.selectedIndex / cols)]
    }

    matrix.prototype["selectFirst"] = function ()
    {
        this.selectedIndex = 0
        return this.offset = 0
    }

    matrix.prototype["cellAtPos"] = function (x, y)
    {
        var s

        s = this.scale
        return [parseInt((x - s) / (s * 2)),parseInt(y / s)]
    }

    matrix.prototype["selectAt"] = function (col, row)
    {
        var cols, idx

        cols = this.columns()
        idx = (this.offset + row) * cols + col
        if (idx < 0 || idx >= this.items.length)
        {
            return false
        }
        this.selectedIndex = idx
        return true
    }

    matrix.prototype["ensureVisible"] = function ()
    {
        var cols, maxOffset, row, rows

        cols = this.columns()
        rows = _k_.max(1,this.viewportRows())
        row = parseInt(this.selectedIndex / cols)
        if (row < this.offset)
        {
            this.offset = row
        }
        if (row >= this.offset + rows)
        {
            this.offset = row - rows + 1
        }
        maxOffset = _k_.max(0,(this.numRows() - rows))
        return this.offset = _k_.clamp(0,maxOffset,this.offset)
    }

    matrix.prototype["moveSelection"] = function (dir)
    {
        var before, cols, lastIndex, rows

        if (_k_.empty(this.items))
        {
            return false
        }
        cols = this.columns()
        rows = _k_.max(1,this.viewportRows())
        before = this.selectedIndex
        lastIndex = this.items.length - 1
        switch (dir)
        {
            case 'left':
                this.selectedIndex = _k_.max(0,(this.selectedIndex - 1))
                break
            case 'right':
                this.selectedIndex = _k_.min(lastIndex,(this.selectedIndex + 1))
                break
            case 'up':
                this.selectedIndex = _k_.max(0,(this.selectedIndex - cols))
                break
            case 'down':
                this.selectedIndex = _k_.min(lastIndex,(this.selectedIndex + cols))
                break
            case 'pageup':
                this.selectedIndex = _k_.max(0,(this.selectedIndex - cols * rows))
                break
            case 'pagedown':
                this.selectedIndex = _k_.min(lastIndex,(this.selectedIndex + cols * rows))
                break
        }

        this.ensureVisible()
        return this.selectedIndex !== before
    }

    matrix.prototype["grabFocus"] = function ()
    {
        post.emit('focus',this.name)
        return post.emit('redraw')
    }

    matrix.prototype["draw"] = function ()
    {
        var col, cols, fg, idx, row, x, y

        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        if (!_k_.empty(this.items))
        {
            cols = this.columns()
            for (var _a_ = row = 0, _b_ = this.viewportRows(); (_a_ <= _b_ ? row < this.viewportRows() : row > this.viewportRows()); (_a_ <= _b_ ? ++row : --row))
            {
                for (var _c_ = col = 0, _d_ = cols; (_c_ <= _d_ ? col < cols : col > cols); (_c_ <= _d_ ? ++col : --col))
                {
                    idx = (this.offset + row) * cols + col
                    if (idx >= this.items.length)
                    {
                        break
                    }
                    if (this.scale === 1)
                    {
                        this.cells.set(col * 2 + 1,row,this.itemText(this.items[idx]),this.color.fg,this.color.bg)
                    }
                    else
                    {
                        this.scaledCell(this.scale + col * this.scale * 2,row * this.scale,this.itemText(this.items[idx]),this.color.fg,this.color.bg)
                    }
                }
            }
            if (this.selectedIndex < 0 || this.selectedIndex >= this.items.length)
            {
                return
            }
            var _e_ = this.selectedPos(); col = _e_[0]; row = _e_[1]

            y = (row - this.offset) * this.scale
            if (y < 0 || y >= this.cells.rows)
            {
                return
            }
            x = this.scale + col * (this.scale * 2)
            fg = (this.focused ? this.color.selection : this.color.selection_blur)
            this.cells.set_bg(x,y,fg)
            this.cells.adjustContrastForHighlight(x,y,fg)
            if (this.scale === 1)
            {
                this.cells.set_ch_fg(x - 1,y,'',fg)
                this.cells.set_ch_fg(x + 1,y,'',fg)
            }
            else
            {
                this.scaledCell(x - this.scale,y,'',fg,this.color.bg)
                this.scaledCell(x + this.scale,y,'',fg,this.color.bg)
            }
        }
        return this.drawScrollBar()
    }

    matrix.prototype["scaledCell"] = function (x, y, char, fg, bg)
    {
        var i, j

        if (this.cells.screen.t.headless)
        {
            this.cells.set(x,y,char,fg,bg)
            for (var _a_ = j = 0, _b_ = this.scale; (_a_ <= _b_ ? j < this.scale : j > this.scale); (_a_ <= _b_ ? ++j : --j))
            {
                for (var _c_ = i = 0, _d_ = this.scale; (_c_ <= _d_ ? i < this.scale : i > this.scale); (_c_ <= _d_ ? ++i : --i))
                {
                    if (i || j)
                    {
                        this.cells.set(x + i,y + j,null,null,null)
                    }
                }
            }
            return
        }
        this.cells.set(x,y,this.scaleText(char),fg,bg)
        for (var _e_ = j = 0, _f_ = this.scale; (_e_ <= _f_ ? j < this.scale : j > this.scale); (_e_ <= _f_ ? ++j : --j))
        {
            for (var _10_ = i = 0, _11_ = this.scale; (_10_ <= _11_ ? i < this.scale : i > this.scale); (_10_ <= _11_ ? ++i : --i))
            {
                if (i || j)
                {
                    this.cells.set(x + i,y + j,((i === 0 ? this.skipText() : null)),null,null)
                }
            }
        }
    }

    matrix.prototype["scaleText"] = function (char)
    {
        return `\x1b]66;s=${this.scale}:w=1;` + char + '\x07'
    }

    matrix.prototype["skipText"] = function ()
    {
        return `\x1b[${this.scale}C`
    }

    matrix.prototype["drawScrollBar"] = function ()
    {
        var csz, fg, h, kh, ky, num, regionH, rowH, rows, w, x, y

        if (!this.scrollBarVisible())
        {
            return
        }
        if (_k_.empty((csz = this.screen.t.cellsz)))
        {
            return
        }
        rows = this.viewportRows()
        if (rows < 1)
        {
            return
        }
        num = this.numRows()
        if (num <= rows)
        {
            return
        }
        regionH = this.cells.rows * csz[1]
        rowH = csz[1] * this.scale
        kh = ((rows * rows) / num) * rowH
        ky = ((regionH - kh) * this.offset / (num - rows))
        fg = this.color.scroll
        x = (this.cells.x + this.cells.cols - 1) * csz[0]
        y = parseInt(this.cells.y * csz[1] + ky)
        w = parseInt(csz[0] / 2)
        h = parseInt(kh)
        squares.place(x,parseInt(y + w / 2),w,h - w,fg)
        sircels.place(x,y,w,((ky ? fg : this.color.scroll_dot)),1111)
        return sircels.place(x,y + h - w,w,(((y + h < (this.cells.y + this.cells.rows) * csz[1] - 1) ? fg : this.color.scroll_dot)),1111)
    }

    return matrix
})()

export default matrix;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvbWF0cml4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQVM7O09BQ0EsY0FBQTtPQUFRLGNBQUE7O09BQ1IsV0FBQTs7O0FBRWIsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBTzs7Ozs7Ozs7Ozs7OzsrQ0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLE1BQWtCLEVBQUUsRUFBRTtRQUNoQyxLQUFDLFNBQVMsTUFBa0IsSUFBSSxJQUFJO1FBQ3BDLEtBQUMsU0FBUyxhQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLGtCQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLFVBQWtCLEdBQUcsR0FBRztRQUNsQyxLQUFDLFNBQVMsY0FBa0IsSUFBSSxJQUFJO1FBRXBDLEtBQUM7UUFDRCxLQUFDLGdCQUFnQjtRQUNqQixLQUFDLFNBQWdCO1FBQ2pCLEtBQUMsVUFBZ0I7UUFDakIsS0FBQyxRQUFnQjtRQUVqQixLQUFLLEdBQUcsUUFBUSxLQUFDOzs7c0JBRXJCLHNCQUFTOztlQUFRLEtBQUMsV0FBVyxTQUFRLEtBQUM7OztzQkFFdEM7O2VBQWEsS0FBQzs7O3NCQUVkLHVCQUFVOztRQUVOLEtBQUMsU0FBZ0IsZ0JBQUE7UUFDakIsS0FBQyxnQkFBZ0I7ZUFDakIsS0FBQyxTQUFnQjs7O3NCQUVyQix1QkFBVTs7OztRQUVOLFNBQVMsS0FBQztRQUVWLEtBQUMsU0FBUztRQUNWLEtBQUMsa0JBQWMsRUFBRSxFQUFFLEtBQUM7WUFNakIsS0FBQyxVQUFTOztZQUNULEtBQUM7O1FBRUwsS0FBQztlQUVEOzs7c0JBRUo7Ozs7WUFFVSxLQUFDLE1BQU0sT0FBTyxFQUFFOzs7O1FBRXRCLElBQUksS0FBQyxNQUFNLE9BQU87dUJBRWQsTUFBTyxTQUFJLEtBQUMsTUFBTSwwQkFBUCxLQUFDLE1BQU0sYUFBUCxLQUFDLE1BQU07O1lBQ2xCLEVBQUUsVUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/matrix.kode
