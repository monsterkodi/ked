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
        this["selectFirst"] = this["selectFirst"].bind(this)
        this["selectedText"] = this["selectedText"].bind(this)
        this["itemText"] = this["itemText"].bind(this)
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

    matrix.prototype["numItems"] = function ()
    {
        return this.items.length
    }

    matrix.prototype["baseColumns"] = function ()
    {
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
        return parseInt((this.items.length + cols - 1) / cols) > this.cells.rows
    }

    matrix.prototype["columns"] = function ()
    {
        var bar

        bar = (this.scrollBarVisible() ? 1 : 0)
        return _k_.max(1,parseInt((this.cells.cols - 1 - bar) / 2))
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
        var _84_25_

        if (_k_.isObj(item))
        {
            if (!_k_.empty(item.show))
            {
                return item.show
            }
            return ((_84_25_=item.char) != null ? _84_25_ : '')
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
        rows = _k_.max(1,this.cells.rows)
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
        rows = _k_.max(1,this.cells.rows)
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
        if (_k_.empty(this.items))
        {
            return
        }
        cols = this.columns()
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
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
        this.cells.set_ch_fg(x + 1,y,'',fg)
        return this.drawScrollBar()
    }

    matrix.prototype["drawScrollBar"] = function ()
    {
        var csz, fg, h, kh, ky, num, rows, w, x, y

        if (!this.scrollBarVisible())
        {
            return
        }
        if (_k_.empty((csz = this.screen.t.cellsz)))
        {
            return
        }
        rows = this.cells.rows
        num = this.numRows()
        if (num <= rows)
        {
            return
        }
        kh = ((rows * rows) / num) * csz[1]
        ky = ((rows * csz[1] - kh) * this.offset / (num - rows))
        fg = this.color.scroll
        x = (this.cells.x + this.cells.cols - 1) * csz[0]
        y = parseInt(this.cells.y * csz[1] + ky)
        w = parseInt(csz[0] / 2)
        h = parseInt(kh)
        squares.place(x,parseInt(y + w / 2),w,h - w,fg)
        sircels.place(x,y,w,((ky ? fg : this.color.scroll_dot)),1111)
        return sircels.place(x,y + h - w,w,(((y + h < (this.cells.y + rows) * csz[1] - 1) ? fg : this.color.scroll_dot)),1111)
    }

    return matrix
})()

export default matrix;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvbWF0cml4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FhYSxVQUFBO0lBQVM7O09BQ0EsY0FBQTtPQUFRLGNBQUE7O09BQ1IsV0FBQTs7O0FBRWIsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBTzs7Ozs7Ozs7Ozs7K0NBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxNQUFrQixFQUFFLEVBQUU7UUFDaEMsS0FBQyxTQUFTLE1BQWtCLElBQUksSUFBSTtRQUNwQyxLQUFDLFNBQVMsYUFBa0IsR0FBRyxHQUFHO1FBQ2xDLEtBQUMsU0FBUyxrQkFBa0IsR0FBRyxHQUFHO1FBQ2xDLEtBQUMsU0FBUyxVQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLGNBQWtCLElBQUksSUFBSTtRQUVwQyxLQUFDO1FBQ0QsS0FBQyxnQkFBZ0I7UUFDakIsS0FBQyxTQUFnQjtRQUNqQixLQUFDLFVBQWdCO1FBRWpCLEtBQUssR0FBRyxRQUFRLEtBQUM7OztzQkFFckIsc0JBQVM7O2VBQVEsS0FBQyxXQUFXLFNBQVEsS0FBQzs7O3NCQUV0Qzs7ZUFBYSxLQUFDOzs7c0JBRWQsdUJBQVU7O1FBRU4sS0FBQyxTQUFnQixnQkFBQTtRQUNqQixLQUFDLGdCQUFnQjtlQUNqQixLQUFDLFNBQWdCOzs7c0JBRXJCOztlQUFhLEtBQUMsTUFBTTs7O3NCQUtwQjs7dUJBQW9CLFlBQU8sS0FBQyxNQUFNLE9BQU8sS0FBSzs7O3NCQUU5Qzs7OztzQkFFc0IsS0FBQzs7bUJBQWhCOztZQUNTLEtBQUMsTUFBTSxPQUFPOzttQkFBdkI7O1FBRUgsT0FBTyxLQUFDO3lCQUVILEtBQUMsTUFBTSxTQUFTLE9BQU8sS0FBSyxRQUFRLEtBQUMsTUFBTTs7O3NCQUVwRDs7OztRQUVJLE9BQU0sS0FBQyxxQkFBcUIsSUFBSTt1QkFFNUIsWUFBTyxLQUFDLE1BQU0sT0FBTyxJQUFJLE9BQU87OztzQkFHeEM7Ozs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/matrix.kode
