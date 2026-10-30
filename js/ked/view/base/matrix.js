var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        this["setDouble"] = this["setDouble"].bind(this)
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
        this.double = false
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

    matrix.prototype["setDouble"] = function (on)
    {
        this.double = on
        this.ensureVisible()
        return true
    }

    matrix.prototype["numItems"] = function ()
    {
        return this.items.length
    }

    matrix.prototype["baseColumns"] = function ()
    {
        if (this.double)
        {
            return _k_.max(1,parseInt((this.cells.cols - 3) / 4))
        }
        return _k_.max(1,parseInt((this.cells.cols - 1) / 2))
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
        var bar

        bar = (this.scrollBarVisible() ? 1 : 0)
        if (this.double)
        {
            return _k_.max(1,parseInt((this.cells.cols - 3 - bar) / 4))
        }
        return _k_.max(1,parseInt((this.cells.cols - 1 - bar) / 2))
    }

    matrix.prototype["rowHeight"] = function ()
    {
        return (this.double ? 2 : 1)
    }

    matrix.prototype["viewportRows"] = function ()
    {
        return _k_.max(0,parseInt(this.cells.rows / this.rowHeight()))
    }

    matrix.prototype["numRows"] = function ()
    {
        var cols

        if (_k_.empty(this.items))
        {
            return 0
        }
        cols = this.columns()
        return parseInt((this.items.length + cols - 1) / cols)
    }

    matrix.prototype["itemText"] = function (item)
    {
        var _104_25_

        if (_k_.isObj(item))
        {
            if (!_k_.empty(item.show))
            {
                return item.show
            }
            return ((_104_25_=item.char) != null ? _104_25_ : '')
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
        if (this.double)
        {
            return [parseInt((x - 3) / 4),parseInt(y / 2)]
        }
        return [parseInt((x - 1) / 2),y]
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
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        if (!_k_.empty(this.items))
        {
            if (this.double)
            {
                this.drawDouble()
            }
            else
            {
                this.drawSingle()
            }
        }
        return this.drawScrollBar()
    }

    matrix.prototype["drawSingle"] = function ()
    {
        var col, cols, fg, idx, row, x, y

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
                this.cells.set(col * 2 + 1,row,this.itemText(this.items[idx]),this.color.fg,this.color.bg)
            }
        }
        if (this.selectedIndex < 0 || this.selectedIndex >= this.items.length)
        {
            return
        }
        var _e_ = this.selectedPos(); col = _e_[0]; row = _e_[1]

        y = row - this.offset
        if (y < 0 || y >= this.cells.rows)
        {
            return
        }
        x = col * 2 + 1
        fg = (this.focused ? this.color.selection : this.color.selection_blur)
        this.cells.set_bg(x,y,fg)
        this.cells.adjustContrastForHighlight(x,y,fg)
        this.cells.set_ch_fg(x - 1,y,'',fg)
        return this.cells.set_ch_fg(x + 1,y,'',fg)
    }

    matrix.prototype["drawDouble"] = function ()
    {
        var col, cols, fg, idx, row, x, y

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
                this.doubleCell(3 + col * 4,row * 2,this.itemText(this.items[idx]),this.color.fg,this.color.bg)
            }
        }
        if (this.selectedIndex < 0 || this.selectedIndex >= this.items.length)
        {
            return
        }
        var _e_ = this.selectedPos(); col = _e_[0]; row = _e_[1]

        y = (row - this.offset) * 2
        if (y < 0 || y >= this.cells.rows)
        {
            return
        }
        x = 3 + col * 4
        fg = (this.focused ? this.color.selection : this.color.selection_blur)
        this.cells.set_bg(x,y,fg)
        this.cells.adjustContrastForHighlight(x,y,fg)
        this.doubleCell(x - 2,y,'',fg,this.color.bg)
        return this.doubleCell(x + 2,y,'',fg,this.color.bg)
    }

    matrix.prototype["doubleCell"] = function (x, y, char, fg, bg)
    {
        if (this.cells.screen.t.headless)
        {
            this.cells.set(x,y,char,fg,bg)
            this.cells.set(x + 1,y,null,null,null)
            this.cells.set(x,y + 1,null,null,null)
            this.cells.set(x + 1,y + 1,null,null,null)
            return
        }
        this.cells.set(x,y,this.doubleText(char),fg,bg)
        this.cells.set(x + 1,y,null,null,null)
        this.cells.set(x,y + 1,this.skipText(),null,null)
        return this.cells.set(x + 1,y + 1,null,null)
    }

    matrix.prototype["doubleText"] = function (char)
    {
        return '\x1b]66;s=2:w=1;' + char + '\x07'
    }

    matrix.prototype["skipText"] = function ()
    {
        return '\x1b[2C'
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
        rowH = csz[1] * this.rowHeight()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvbWF0cml4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FjYSxVQUFBO0lBQVM7O09BQ0EsY0FBQTtPQUFRLGNBQUE7O09BQ1IsV0FBQTs7O0FBRWIsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBTzs7Ozs7Ozs7Ozs7OzsrQ0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLE1BQWtCLEVBQUUsRUFBRTtRQUNoQyxLQUFDLFNBQVMsTUFBa0IsSUFBSSxJQUFJO1FBQ3BDLEtBQUMsU0FBUyxhQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLGtCQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLFVBQWtCLEdBQUcsR0FBRztRQUNsQyxLQUFDLFNBQVMsY0FBa0IsSUFBSSxJQUFJO1FBRXBDLEtBQUM7UUFDRCxLQUFDLGdCQUFnQjtRQUNqQixLQUFDLFNBQWdCO1FBQ2pCLEtBQUMsVUFBZ0I7UUFDakIsS0FBQyxTQUFnQjtRQUVqQixLQUFLLEdBQUcsUUFBUSxLQUFDOzs7c0JBRXJCLHNCQUFTOztlQUFRLEtBQUMsV0FBVyxTQUFRLEtBQUM7OztzQkFFdEM7O2VBQWEsS0FBQzs7O3NCQUVkLHVCQUFVOztRQUVOLEtBQUMsU0FBZ0IsZ0JBQUE7UUFDakIsS0FBQyxnQkFBZ0I7ZUFDakIsS0FBQyxTQUFnQjs7O3NCQUVyQix3QkFBVzs7UUFFUCxLQUFDLFNBQVM7UUFDVixLQUFDO2VBRUQ7OztzQkFFSjs7ZUFBYSxLQUFDLE1BQU07OztzQkFLcEI7O1lBRU8sS0FBQzs7MkJBQ08sWUFBTyxLQUFDLE1BQU0sT0FBTyxLQUFLOzt1QkFFakMsWUFBTyxLQUFDLE1BQU0sT0FBTyxLQUFLOzs7c0JBRWxDOzs7O3NCQUVzQixLQUFDOzttQkFBaEI7O1lBQ1MsS0FBQyxNQUFNLE9BQU87O21CQUF2Qjs7UUFFSCxPQUFPLEtBQUM7eUJBRUgsS0FBQyxNQUFNLFNBQVMsT0FBTyxL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/matrix.kode
