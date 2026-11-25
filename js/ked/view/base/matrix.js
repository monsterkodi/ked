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
        this["onWheel"] = this["onWheel"].bind(this)
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
        matrix.__super__.onMouse.call(this,event)
    
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

    matrix.prototype["onWheel"] = function (event)
    {
        switch (event.dir)
        {
            case 'left':
            case 'right':
            case 'up':
            case 'down':
                this.moveSelection(event.dir)
                break
        }

        return {redraw:true}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvbWF0cml4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsY0FBQTtPQUFRLGNBQUE7O09BQ1IsV0FBQTs7O0FBQ3JCLFVBQUQ7O3VCQUFRO2FBR0osUUFBRyxRQUFPOzs7Ozs7Ozs7Ozs7OytDQUVBLE9BQU87UUFFYixLQUFDLFNBQVMsTUFBa0IsRUFBRSxFQUFFO1FBQ2hDLEtBQUMsU0FBUyxNQUFrQixJQUFJLElBQUk7UUFDcEMsS0FBQyxTQUFTLGFBQWtCLEdBQUcsR0FBRztRQUNsQyxLQUFDLFNBQVMsa0JBQWtCLEdBQUcsR0FBRztRQUNsQyxLQUFDLFNBQVMsVUFBa0IsR0FBRyxHQUFHO1FBQ2xDLEtBQUMsU0FBUyxjQUFrQixJQUFJLElBQUk7UUFDcEMsS0FBQztRQUNELEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsU0FBZ0I7UUFDakIsS0FBQyxRQUFnQjtRQUVqQixLQUFDOzs7c0JBRUwsdUJBQVU7O1FBRU4sS0FBQyxTQUFnQixnQkFBQTtRQUNqQixLQUFDLGdCQUFnQjtlQUNqQixLQUFDLFNBQWdCOzs7c0JBRXJCLHVCQUFVOzs7O1FBRU4sU0FBUyxLQUFDO1FBRVYsS0FBQyxTQUFTO1FBQ1YsS0FBQyxrQkFBYyxFQUFFLEVBQUUsS0FBQztZQUVqQixLQUFDLFVBQVM7O1lBQ1QsS0FBQzs7UUFFTCxLQUFDO2VBRUQ7OztzQkFFSjs7OztRQUVJLElBQUksS0FBQyxNQUFNLE9BQU87YUFFZCxNQUFPLFNBQUksS0FBQyxNQUFNOztZQUNsQixFQUFFLFVBQVUsS0FBQyxNQUFNLEdBQUcsS0FBQyxNQUFNLElBQUU7WUFDL0IsRUFBRSxjQUFjLEtBQUMsTUFBTTs7OztzQkFFL0I7O2VBQWEsS0FBQyxNQUFNOzs7c0JBRXBCOzt1QkFFUSxZQUFPLEtBQUMsTUFBTSxPQUFPLEtBQUMsVUFBVSxLQUFDLFFBQVE7OztzQkFFakQ7O3VCQUFx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
//# sourceURL=../../../../kode/ked/view/base/matrix.kode
