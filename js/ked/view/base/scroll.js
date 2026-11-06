var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var pow, scroll

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import squares from "../../util/img/squares.js"
import sircels from "../../util/img/sircels.js"

import view from "./view.js"

pow = Math.pow


scroll = (function ()
{
    _k_.extend(scroll, view)
    function scroll (screen, state, side = 'left')
    {
        this.state = state
        this.side = side
    
        this["draw"] = this["draw"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["knobOffset"] = this["knobOffset"].bind(this)
        this["knobHeight"] = this["knobHeight"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        scroll.__super__.constructor.call(this,screen,this.state.owner() + '_scroll')
        this.pointerType = 'pointer'
        this.setColor('bg',theme.gutter.bg)
        this.setColor('dot',theme.scroll.dot)
        this.setColor('knob',theme.scroll.knob)
        this.setColor('hover',theme.scroll.hover)
    }

    scroll.prototype["onMouse"] = function (event)
    {
        var col, row

        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        scroll.__super__.onMouse.call(this,event)
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    this.doDrag = true
                    post.emit('pointer','grabbing')
                    return this.scrollToPixel(event.pixel)
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    this.hover = true
                    post.emit('pointer','grab')
                    return this.scrollToPixel(event.pixel)
                }
                this.hover = false
                break
            case 'release':
                if (this.doDrag)
                {
                    if (this.hover)
                    {
                        post.emit('pointer','pointer')
                    }
                    delete this.doDrag
                    return true
                }
                break
        }

        return this.hover
    }

    scroll.prototype["isActive"] = function ()
    {
        return this.state.totalRows() > this.cells.rows
    }

    scroll.prototype["knobHeight"] = function (csz)
    {
        var kh, rows, total

        rows = this.cells.rows
        total = this.state.totalRows()
        if (total <= rows)
        {
            return 0
        }
        kh = parseInt(((rows * rows) / total) * csz[1])
        return _k_.clamp(csz[1],rows * csz[1],kh)
    }

    scroll.prototype["knobOffset"] = function (csz)
    {
        var kh, maxTop, offset, rows, total, track

        rows = this.cells.rows
        total = this.state.totalRows()
        if (total <= rows)
        {
            return 0
        }
        kh = this.knobHeight(csz)
        maxTop = _k_.max(1,total - rows)
        track = _k_.max(0,rows * csz[1] - kh)
        offset = parseInt(((track * this.state.viewTopRow()) / maxTop))
        return _k_.clamp(0,track,offset)
    }

    scroll.prototype["scrollToPixel"] = function (pixel)
    {
        var csz, li, maxTop, offset, row, rowf, rows, total

        if (_k_.empty((csz = this.screen.t.cellsz)))
        {
            return
        }
        rows = this.cells.rows
        total = this.state.totalRows()
        maxTop = _k_.max(0,total - rows)
        rowf = pixel[1] / csz[1] - this.cells.y
        row = Math.floor(rowf * (maxTop + 1) / _k_.max(1,rows - 1))
        li = this.state.s.view[1]
        offset = this.state.s.scrollOffset
        this.state.setScrollTop(row)
        if (this.state.s.view[1] === li && this.state.s.scrollOffset === offset)
        {
            return true
        }
        return {redraw:true}
    }

    scroll.prototype["draw"] = function ()
    {
        var csz, fg, h, kh, ky, rows, total, w, x, y

        if (_k_.empty((csz = this.screen.t.cellsz)))
        {
            return
        }
        rows = this.cells.rows
        this.cells.fill_col(0,0,rows,' ',null,this.color.bg)
        total = this.state.totalRows()
        if (total <= rows)
        {
            return
        }
        kh = this.knobHeight(csz)
        ky = this.knobOffset(csz)
        fg = (this.hover ? this.color.hover : this.color.knob)
        x = this.cells.x * csz[0]
        y = parseInt(this.cells.y * csz[1] + ky)
        w = parseInt(csz[0] / 2)
        h = parseInt(kh)
        squares.place(x,parseInt(y + w / 2),w,h - w,fg)
        sircels.place(x,y,w,((ky ? fg : this.color.dot)),1111)
        return sircels.place(x,y + h - w,w,(((y + h < (this.cells.y + rows) * csz[1] - 1) ? fg : this.color.dot)),1111)
    }

    return scroll
})()

export default scroll;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2Uvc2Nyb2xsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVE7O09BQ0EsWUFBWDs7T0FDVyxjQUFBO09BQVEsY0FBQTs7T0FDUixXQUFBOztBQUVwQixNQUFPOzs7QUFDUCxVQUFEOzt1QkFBUTthQUtKLFFBQUcsUUFBUSxPQUFPOztRQUFSO1FBQU87Ozs7Ozs7K0NBRVAsT0FBTyxLQUFDLE1BQU0sVUFBVTtRQUU5QixLQUFDLGNBQWM7UUFFZixLQUFDLFNBQVMsS0FBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLE1BQVEsTUFBTSxPQUFPO1FBQy9CLEtBQUMsU0FBUyxPQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsUUFBUSxNQUFNLE9BQU87OztzQkFFbkMsc0JBQVM7Ozs7a0JBRU8sS0FBQyxTQUFTLFFBQXJCLGNBQUk7OzJDQUVDO2dCQUVDLE1BQU07O2lCQUVUO29CQUVPLEtBQUM7O29CQUNBLEtBQUMsU0FBUztvQkFDVixLQUFLLEtBQUssVUFBUzsyQkFDakIsS0FBQyxjQUFjLE1BQU07OztpQkFFL0I7b0JBRU8sS0FBQzs7b0JBQ0EsS0FBQyxRQUFRO29CQUNULEtBQUssS0FBSyxVQUFTOzJCQUNqQixLQUFDLGNBQWMsTUFBTTs7Z0JBRTNCLEtBQUMsUUFBUTs7aUJBRWI7b0JBRU8sS0FBQzs7d0JBQ2dDLEtBQUM7O3dCQUFqQyxLQUFLLEtBQUssVUFBUzs7MkJBQ1osS0FBQzsyQkFDTjs7Ozs7ZUFDZCxLQUFDOzs7c0JBRUw7O2VBRUksS0FBQyxNQUFNLGNBQWMsS0FBQyxNQUFNOzs7c0JBRWhDLHlCQUFZOzs7O1FBRVIsT0FBUSxLQUFDLE1BQU07UUFDZixRQUFRLEtBQUMsTUFBTTtZQUVSLFNBQVM7O21CQUFkOztRQUVGLGdCQUFXLE9BQUssUUFBUSxTQUFTLElBQUk7eUJBQy9CLElBQUksR0FBRyxPQUFLLElBQUksR0FBRzs7O3NCQUU3Qix5QkFBWTs7OztRQUVSLE9BQVEsS0FBQyxNQUFNO1FBQ2YsUUFBUSxLQUFDLE1BQU07WUFFUixTQUFTOzttQkFBZDs7UUFFRixLQUFTLEtBQUMsV0FBVztRQUNyQixpQkFBYSxFQUFFLFFBQU07UUFDckIsZ0JBQWEsRUFBRSxPQUFLLElBQUksS0FBRztRQUMzQixvQkFBZSxRQUFRLEtBQUMsTUFBTSxnQkFBZ0I7eUJBRXhDLEVBQUUsTUFBTTs7O3NCQUVsQiw0QkFBZTs7Ozt1QkFFQyxNQUFNLEtBQUMsT0FBTyxFQUFFOzs7O1FBRTVCLE9BQVMsS0FBQyxNQUFNO1FBQ2hCLFFBQVMsS0FBQyxNQUFNO1FBQ2hCLGlCQUFhLEVBQUUsUUFBTTtRQUVyQixPQUFPLE1BQU0sS0FBRyxJQUFJLEtBQUcsS0FBQyxNQUFNO1FBQzlCLGlCQUFhLFFBQVEsU0FBTyxhQUFTLEVBQUUsT0FBSztRQUU1QyxLQUFTLEtBQUMsTUFBTSxFQUFFLEtBQUs7UUFDdkIsU0FBUyxLQUFDLE1BQU0sRUFBRTtRQUVsQixLQUFDLE1BQU0sYUFBYTtZQUVWLEtBQUMsTUFBTSxFQUFFLEtBQUssT0FBTSxNQUFPLEtBQUMsTUFBTSxFQUFFLGlCQUFnQjs7bUJBQTVEOztnQkFFRixPQUFPOzs7c0JBRVg7Ozs7dUJBRWdCLE1BQU0sS0FBQyxPQUFPLEVBQUU7Ozs7UUFFNUIsT0FBTyxLQUFDLE1BQU07UUFFZCxLQUFDLE1BQU0sU0FBUyxFQUFFLEVBQUUsS0FBSyxJQUFJLEtBQUssS0FBQyxNQUFNO1FBRXpDLFFBQVEsS0FBQyxNQUFNO1lBRVYsU0FBUzs7OztRQUVkLEtBQUssS0FBQyxXQUFXO1FBQ2pCLEtBQUssS0FBQyxXQUFXO1FBRWpCLE1BQUssS0FBQyxRQUFRLEtBQUMsTUFBTSxRQUFRLEtBQUMsTUFBTTtRQUVwQyxJQUFLLEtBQUMsTUFBTSxJQUFFLElBQUk7UUFDbEIsYUFBUyxLQUFDLE1BQU0sSUFBRSxJQUFJLEtBQUc7UUFDekIsYUFBUyxJQUFJLEtBQUc7UUFDaEIsYUFBUztRQUVULFFBQVEsTUFBTSxXQUFNLElBQUUsSUFBRSxHQUFHLEVBQUUsSUFBRSxFQUFFO1FBRWpDLFFBQVEsTUFBTSxFQUFFLEVBQU0sSUFBRyxLQUFLLEtBQUssS0FBQyxNQUFNLE1BQUs7ZUFDL0MsUUFBUSxNQUFNLEVBQUUsSUFBRSxJQUFFLEVBQUUsS0FBSSxJQUFFLEtBQUssS0FBQyxNQUFNLElBQUUsUUFBTSxJQUFJLEtBQUcsS0FBSyxLQUFLLEtBQUMsTUFBTSxNQUFLOzs7V0F6SHBGOzs7ZUEySE0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/scroll.kode
