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
        this["onMouse"] = this["onMouse"].bind(this)
        this["moveSelection"] = this["moveSelection"].bind(this)
        this["selectAt"] = this["selectAt"].bind(this)
        this["cellAtPos"] = this["cellAtPos"].bind(this)
        this["selectFirst"] = this["selectFirst"].bind(this)
        this["selectedText"] = this["selectedText"].bind(this)
        this["itemText"] = this["itemText"].bind(this)
        this["incScale"] = this["incScale"].bind(this)
        this["setItems"] = this["setItems"].bind(this)
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
        this.scale = 2
        this.setFocusable()
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

        t = this.cells.screen.t
        for (row = 0; row < this.cells.rows; row++)
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
        var _71_24_

        if (_k_.isObj(item))
        {
            return ((_71_24_=item.char) != null ? _71_24_ : '')
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

    matrix.prototype["onMouse"] = function (event)
    {
        var col, row, x, y

        if (this.cells.isInsideEvent(event))
        {
            ;[x,y] = this.cells.posForEvent(event)
            ;[col,row] = this.cellAtPos(x,y)
            this.selectAt(col,row)
            if (event.type === 'press')
            {
                this.emit('submit')
            }
            return {redraw:true}
        }
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
            for (row = 0; row < this.viewportRows(); row++)
            {
                for (col = 0; col < cols; col++)
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
            ;[col,row] = this.selectedPos()
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

        if (!this.cells.screen.t.textSizing)
        {
            this.cells.set(x,y,char,fg,bg)
            for (j = 0; j < this.scale; j++)
            {
                for (i = 0; i < this.scale; i++)
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
        for (j = 0; j < this.scale; j++)
        {
            for (i = 0; i < this.scale; i++)
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
        var cols, csz, fg, h, kh, ky, num, regionH, rowH, rows, w, x, y

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
        cols = this.columns()
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
        squares.place(x,parseInt(y + w / 2),w,h - w,fg,null,'scrollbar')
        sircels.place(x,y,w,((ky ? fg : this.color.scroll_dot)),1111,'scrollbar')
        return sircels.place(x,y + h - w,w,(((y + h < (this.cells.y + this.cells.rows) * csz[1] - 1) ? fg : this.color.scroll_dot)),1111,'scrollbar')
    }

    return matrix
})()

export default matrix;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvbWF0cml4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsY0FBQTtPQUFRLGNBQUE7O09BQ1IsV0FBQTs7O0FBQ3JCLFVBQUQ7O3VCQUFRO2FBR0osUUFBRyxRQUFPOzs7Ozs7Ozs7Ozs7K0NBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxNQUFrQixFQUFFLEVBQUU7UUFDaEMsS0FBQyxTQUFTLE1BQWtCLElBQUksSUFBSTtRQUNwQyxLQUFDLFNBQVMsYUFBa0IsR0FBRyxHQUFHO1FBQ2xDLEtBQUMsU0FBUyxrQkFBa0IsR0FBRyxHQUFHO1FBQ2xDLEtBQUMsU0FBUyxVQUFrQixHQUFHLEdBQUc7UUFDbEMsS0FBQyxTQUFTLGNBQWtCLElBQUksSUFBSTtRQUNwQyxLQUFDO1FBQ0QsS0FBQyxnQkFBZ0I7UUFDakIsS0FBQyxTQUFnQjtRQUNqQixLQUFDLFFBQWdCO1FBRWpCLEtBQUM7OztzQkFFTCx1QkFBVTs7UUFFTixLQUFDLFNBQWdCLGdCQUFBO1FBQ2pCLEtBQUMsZ0JBQWdCO2VBQ2pCLEtBQUMsU0FBZ0I7OztzQkFFckIsdUJBQVU7Ozs7UUFFTixTQUFTLEtBQUM7UUFFVixLQUFDLFNBQVM7UUFDVixLQUFDLGtCQUFjLEVBQUUsRUFBRSxLQUFDO1lBRWpCLEtBQUMsVUFBUzs7WUFDVCxLQUFDOztRQUVMLEtBQUM7ZUFFRDs7O3NCQUVKOzs7O1FBRUksSUFBSSxLQUFDLE1BQU0sT0FBTzthQUVkLE1BQU8sU0FBSSxLQUFDLE1BQU07O1lBQ2xCLEVBQUUsVUFBVSxLQUFDLE1BQU0sR0FBRyxLQUFDLE1BQU0sSUFBRTtZQUMvQixFQUFFLGNBQWMsS0FBQyxNQUFNOzs7O3NCQUUvQjs7ZUFBYSxLQUFDLE1BQU07OztzQkFFcEI7O3VCQUVRLFlBQU8sS0FBQyxNQUFNLE9BQU8sS0FBQyxVQUFVLEtBQUMsUUFBUTs7O3NCQUVqRDs7dUJBQXFC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
//# sourceURL=../../../../kode/ked/view/base/matrix.kode
