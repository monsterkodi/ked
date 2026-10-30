var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var matrix

import kxk from "../../../kxk.js"
let post = kxk.post

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
        matrix.__super__.constructor.call(this,screen,name)
        this.setColor('bg',[0,0,0])
        this.setColor('fg',[200,200,200])
        this.setColor('selection',[68,68,170])
        this.items = []
        this.selectedIndex = 0
        this.offset = 0
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

    matrix.prototype["columns"] = function ()
    {
        return _k_.max(1,parseInt((this.cells.cols - 1) / 2))
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
        var _56_25_

        if (_k_.isObj(item))
        {
            if (!_k_.empty(item.show))
            {
                return item.show
            }
            return ((_56_25_=item.char) != null ? _56_25_ : '')
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
        fg = this.color.selection
        this.cells.set_bg(x,y,fg)
        this.cells.set_bg(x + 1,y,fg)
        this.cells.adjustContrastForHighlight(x,y,fg)
        this.cells.set_ch_fg(x - 1,y,'',fg)
        return this.cells.set_ch_fg(x + 1,y,'',fg)
    }

    return matrix
})()

export default matrix;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvbWF0cml4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FZYSxVQUFBO0lBQU07O09BQ0EsV0FBQTs7O0FBRVYsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBTzs7Ozs7Ozs7OzsrQ0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLE1BQWEsRUFBRSxFQUFFO1FBQzNCLEtBQUMsU0FBUyxNQUFhLElBQUksSUFBSTtRQUMvQixLQUFDLFNBQVMsYUFBYSxHQUFHLEdBQUc7UUFFN0IsS0FBQztRQUNELEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsU0FBZ0I7OztzQkFFckIsdUJBQVU7O1FBRU4sS0FBQyxTQUFnQixnQkFBQTtRQUNqQixLQUFDLGdCQUFnQjtlQUNqQixLQUFDLFNBQWdCOzs7c0JBRXJCOztlQUFhLEtBQUMsTUFBTTs7O3NCQUtwQjs7dUJBQWdCLFlBQU8sS0FBQyxNQUFNLE9BQU8sS0FBSzs7O3NCQUUxQzs7OztzQkFFa0IsS0FBQzs7bUJBQVo7O1FBRUgsT0FBTyxLQUFDO3lCQUVILEtBQUMsTUFBTSxTQUFTLE9BQU8sS0FBSzs7O3NCQUVyQyx1QkFBVTs7OztZQUVLLFVBQVI7OzJCQUNVLEtBQUs7O3VCQUNQLEtBQUs7OzZCQUNULEtBQUssMEJBQU87O2VBQ25COzs7c0JBRUo7O2VBQWEsS0FBQyxNQUFNLEtBQUM7OztzQkFFckI7O2VBQWlCLEtBQUMsU0FBUyxLQUFDOzs7c0JBRTVCOzs7O1FBRUksT0FBTyxLQUFDO2dCQUVQLEtBQUMsZ0JBQWdCLGNBQVMsS0FBQyxnQkFBZ0I7OztzQkFRaEQ7O1FBRUksS0FBQyxnQkFBZ0I7ZUFDakIsS0FBQyxTQUFnQjs7O3NCQUVyQix1QkFBVSxLQUFJOzs7O1FBRVYsT0FBTyxLQUFDO1FBQ1IsT0FBUSxLQUFDLFNBQVMsT0FBTyxPQUFPO1lBRXBCLE1BQU0sS0FBSyxPQUFPLEtBQUMsTUFBTTs7bUJBQWxDOztRQUVILEtBQUMsZ0JBQWdCO2VBRWpCOzs7c0JBRUo7Ozs7UUFFSSxPQUFPLEtBQUM7UUFDUixlQUFXLEVBQUUsS0FBQyxNQUFNO1FBQ3BCLGVBQVcsS0FBQyxnQkFBZ0I7WUFFWCxNQUFNLEtBQUM7O1lBQXhCLEtBQUMsU0FBUzs7WUFDa0IsT0FBTyxLQUFDLFNBQVM7O1lBQTdDLEtBQUMsU0FBUyxNQUFNLE9BQU87O1FBRXZCLG9CQUFnQixHQUFHLEtBQUMsWUFBWTtlQUVoQyxLQUFDLG1CQUFlLEVBQUUsVUFBVSxLQUFDOzs7c0JBRWpDLDRCQUFlOzs7O3NCQUVPLEtBQUM7O21CQUFoQjs7UUFFSCxPQUFTLEtBQUM7UUFDVixlQUFhLEVBQUUsS0FBQyxNQUFNO1FBQ3RCLFNBQVMsS0FBQztRQUNWLFlBQVksS0FBQyxNQUFNLFNBQVM7Z0JBRXJCOztpQkFDSDtnQkFBYSxLQUFDLHdCQUFvQixHQUFHLEtBQUMsZ0JBQWdCOztpQkFDdEQ7Z0JBQWEsS0FBQyx3QkFBb0IsV0FBVyxLQUFDLGdCQUFnQjs7aUJBQzlEO2dCQUFhLEtBQUMsd0JBQW9CLEdBQUcsS0FBQyxnQkFBZ0I7O2lCQUN0RDtnQkFBYSxLQUFDLHdCQUFvQixXQUFXLEtBQUMsZ0JBQWdCOztpQkFDOUQ7Z0JBQWEsS0FBQyx3QkFBb0IsR0FBRyxLQUFDLGdCQUFnQixPQUFPOztpQkFDN0Q7Z0JBQWEsS0FBQyx3QkFBb0IsV0FBVyxLQUFDLGdCQUFnQixPQUFPOzs7O1FBRXpFLEtBQUM7ZUFFRCxLQUFDLGtCQUFpQjs7O3NCQUV0Qjs7UUFFSSxLQUFLLEtBQUssUUFBUSxLQUFDO2VBQ25CLEtBQUssS0FBSzs7O3NCQVFkOzs7O1lBRVUsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFcEIsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNO3NCQUUvQixLQUFDOzs7O1FBRWIsT0FBTyxLQUFDO3VCQUVKLE1BQU8sU0FBSSxLQUFDLE1BQU0sMEJBQVAsS0FBQyxNQUFNLGFBQVAsS0FBQyxNQUFNOzsyQkFFZCxNQUFPLFNBQUksMEJBQUEsYUFBQTs7Z0JBRVgsT0FBTyxLQUFDLFNBQVMsT0FBTyxPQUFPO29CQUV0QixPQUFPLEtBQUMsTUFBTTs7b0JBQXZCOztnQkFFQSxLQUFDLE1BQU0sSUFBSSxNQUFJLElBQUUsRUFBRSxJQUFJLEtBQUMsU0FBUyxLQUFDLE1BQU0sTUFBTSxLQUFDLE1BQU0sR0FBRyxLQUFDLE1BQU07OztZQUVqRSxLQUFDLGdCQUFnQixLQUFLLEtBQUMsaUJBQWlCLEtBQUMsTUFBTTs7OztrQkFFekMsS0FBQyxlQUFaLGNBQUk7O1FBRUwsSUFBSSxNQUFNLEtBQUM7WUFFTCxJQUFJLEtBQUssS0FBSyxLQUFDLE1BQU07Ozs7UUFFM0IsSUFBSyxNQUFJLElBQUk7UUFDYixLQUFLLEtBQUMsTUFBTTtRQUVaLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRTtRQUNsQixLQUFDLE1BQU0sT0FBTyxJQUFFLEVBQUUsRUFBRTtRQUVwQixLQUFDLE1BQU0sMkJBQTJCLEVBQUUsRUFBRTtRQUV0QyxLQUFDLE1BQU0sVUFBVSxJQUFFLEVBQUUsRUFBRSxJQUFJO2VBQzNCLEtBQUMsTUFBTSxVQUFVLElBQUUsRUFBRSxFQUFFLElBQUk7OztXQTdKMUI7OztlQStKRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/matrix.kode
