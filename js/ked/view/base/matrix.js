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
        this.focusable = true
        this.focused = false
        this.items = []
        this.selectedIndex = 0
        this.offset = 0
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
        this.scale = _k_.clamp(1,3,this.scale)
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

    matrix.prototype["columns"] = function ()
    {
        return _k_.max(1,parseInt((this.cells.cols - this.scale) / (this.scale * 2)))
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
        var _90_25_

        if (_k_.isObj(item))
        {
            if (!_k_.empty(item.show))
            {
                return item.show
            }
            return ((_90_25_=item.char) != null ? _90_25_ : '')
        }
        return item
    }

    matrix.prototype["selectedText"] = function ()
    {
        return this.itemText(this.items[this.selectedIndex])
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
        return [parseInt((x - this.scale) / (this.scale * 2)),parseInt(y / this.scale)]
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
        var before, col, cols, lastIndex, row, rows

        if (_k_.empty(this.items))
        {
            return false
        }
        cols = this.columns()
        rows = Math.ceil(this.items.length / cols)
        before = this.selectedIndex
        row = parseInt(this.selectedIndex / cols)
        col = this.selectedIndex % cols
        lastIndex = this.items.length - 1
        switch (dir)
        {
            case 'left':
                if (col > 0)
                {
                    this.selectedIndex = _k_.max(0,(this.selectedIndex - 1))
                }
                break
            case 'right':
                if (col < cols - 1)
                {
                    this.selectedIndex = _k_.min(lastIndex,(this.selectedIndex + 1))
                }
                break
            case 'up':
                if (row > 0)
                {
                    this.selectedIndex = _k_.max(0,(this.selectedIndex - cols))
                }
                break
            case 'down':
                if (row < rows - 1)
                {
                    this.selectedIndex = _k_.min(lastIndex,(this.selectedIndex + cols))
                }
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
                    this.cells.set(x + i,y + j,((i === 0 ? `\x1b[${this.scale}C` : null)),null,null)
                }
            }
        }
    }

    matrix.prototype["scaleText"] = function (char)
    {
        return `\x1b]66;s=${this.scale}:w=1;` + char + '\x07'
    }

    matrix.prototype["drawScrollBar"] = function ()
    {
        var csz, fg, h, kh, ky, num, regionH, rowH, rows, w, x, y

        if (_k_.empty(this.items))
        {
            return
        }
        if (this.cells.rows < 1)
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
        if (parseInt((this.items.length + cols - 1) / cols) <= rows)
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
        x = (this.cells.x + this.cells.cols) * csz[0]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvbWF0cml4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQVM7O09BQ0EsY0FBQTtPQUFRLGNBQUE7O09BQ1IsV0FBQTs7O0FBRWIsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBTzs7Ozs7Ozs7Ozs7OzsrQ0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLE1BQWtCLEVBQUUsRUFBRTtRQUNoQyxLQUFDLFNBQVMsTUFBa0IsSUFBSSxJQUFJO1FBQ3BDLEtBQUMsU0FBUyxhQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLGtCQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLFVBQWtCLEdBQUcsR0FBRztRQUNsQyxLQUFDLFNBQVMsY0FBa0IsSUFBSSxJQUFJO1FBQ3BDLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxVQUFnQjtRQUNqQixLQUFDO1FBQ0QsS0FBQyxnQkFBZ0I7UUFDakIsS0FBQyxTQUFnQjtRQUNqQixLQUFDLFFBQWdCO1FBRWpCLEtBQUssR0FBRyxRQUFRLEtBQUM7OztzQkFFckIsc0JBQVM7O2VBQVEsS0FBQyxXQUFXLFNBQVEsS0FBQzs7O3NCQUV0Qzs7ZUFBYSxLQUFDOzs7c0JBRWQsdUJBQVU7O1FBRU4sS0FBQyxTQUFnQixnQkFBQTtRQUNqQixLQUFDLGdCQUFnQjtlQUNqQixLQUFDLFNBQWdCOzs7c0JBRXJCLHVCQUFVOzs7O1FBRU4sU0FBUyxLQUFDO1FBRVYsS0FBQyxTQUFTO1FBQ1YsS0FBQyxrQkFBYyxFQUFFLEVBQUUsS0FBQztZQUVqQixLQUFDLFVBQVM7O1lBQ1QsS0FBQzs7UUFFTCxLQUFDO2VBRUQ7OztzQkFFSjs7OztZQUVVLEtBQUMsTUFBTSxPQUFPLEVBQUU7Ozs7UUFFdEIsSUFBSSxLQUFDLE1BQU0sT0FBTzt1QkFFZCxNQUFPLFNBQUksS0FBQyxNQUFNLDBCQUFQLEtBQUMsTUFBTSxhQUFQLEtBQUMsTUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/matrix.kode
