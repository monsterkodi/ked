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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2Uvc2Nyb2xsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FXYSxVQUFBO0lBQVE7O09BQ0EsWUFBWDs7T0FDVyxjQUFBO09BQVEsY0FBQTs7T0FDUixXQUFBOztBQUVwQixNQUFPOzs7QUFFQyxVQUFUOzt1QkFBd0I7YUFFcEIsUUFBRyxRQUFRLE9BQU87O1FBQVI7UUFBTzs7Ozs7OzsrQ0FFUCxPQUFPLEtBQUMsTUFBTSxVQUFVO1FBRTlCLEtBQUMsY0FBYztRQUVmLEtBQUMsU0FBUyxLQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsTUFBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLE9BQVEsTUFBTSxPQUFPO1FBQy9CLEtBQUMsU0FBUyxRQUFRLE1BQU0sT0FBTzs7O3NCQVFuQyxzQkFBUzs7OztrQkFFTyxLQUFDLFNBQVMsUUFBckIsY0FBSTs7MkNBRUM7Z0JBRUMsTUFBTTs7aUJBRVQ7b0JBRU8sS0FBQzs7b0JBQ0EsS0FBQyxTQUFTO29CQUNWLEtBQUssS0FBSyxVQUFTOzJCQUNoQixLQUFDLGNBQWMsTUFBTTs7O2lCQUVoQztvQkFFTyxLQUFDOztvQkFDQSxLQUFDLFFBQVE7b0JBQ1QsS0FBSyxLQUFLLFVBQVM7MkJBQ2hCLEtBQUMsY0FBYyxNQUFNOztnQkFFNUIsS0FBQyxRQUFROztpQkFFYjtvQkFFTyxLQUFDOzt3QkFDZ0MsS0FBQzs7d0JBQWpDLEtBQUssS0FBSyxVQUFTOzsyQkFDWixLQUFDOzJCQUNMOzs7OztlQUNmLEtBQUM7OztzQkFFTDs7ZUFFSSxLQUFDLE1BQU0sY0FBYyxLQUFDLE1BQU07OztzQkFFaEMseUJBQVk7Ozs7UUFFUixPQUFRLEtBQUMsTUFBTTtRQUNmLFFBQVEsS0FBQyxNQUFNO1lBRVIsU0FBUzs7bUJBQWQ7O1FBRUYsZ0JBQVcsT0FBSyxRQUFRLFNBQVMsSUFBSTt5QkFDL0IsSUFBSSxHQUFHLE9BQUssSUFBSSxHQUFHOzs7c0JBRTdCLHlCQUFZOzs7O1FBRVIsT0FBUSxLQUFDLE1BQU07UUFDZixRQUFRLEtBQUMsTUFBTTtZQUVSLFNBQVM7O21CQUFkOztRQUVGLEtBQVMsS0FBQyxXQUFXO1FBQ3JCLGlCQUFhLEVBQUUsUUFBTTtRQUNyQixnQkFBYSxFQUFFLE9BQUssSUFBSSxLQUFHO1FBQzNCLG9CQUFlLFFBQVEsS0FBQyxNQUFNLGdCQUFnQjt5QkFFeEMsRUFBRSxNQUFNOzs7c0JBUWxCLDRCQUFlOzs7O3VCQUVFLE1BQU0sS0FBQyxPQUFPLEVBQUU7Ozs7UUFFN0IsT0FBUyxLQUFDLE1BQU07UUFDaEIsUUFBUyxLQUFDLE1BQU07UUFDaEIsaUJBQWEsRUFBRSxRQUFNO1FBRXJCLE9BQU8sTUFBTSxLQUFHLElBQUksS0FBRyxLQUFDLE1BQU07UUFDOUIsaUJBQWEsUUFBUSxTQUFPLGFBQVMsRUFBRSxPQUFLO1FBRTVDLEtBQVMsS0FBQyxNQUFNLEVBQUUsS0FBSztRQUN2QixTQUFTLEtBQUMsTUFBTSxFQUFFO1FBRWxCLEtBQUMsTUFBTSxhQUFhO1lBRVQsS0FBQyxNQUFNLEVBQUUsS0FBSyxPQUFNLE1BQU8sS0FBQyxNQUFNLEVBQUUsaUJBQWdCOzttQkFBNUQ7O2dCQUVILE9BQU87OztzQkFRWDs7Ozt1QkFFaUIsTUFBTSxLQUFDLE9BQU8sRUFBRTs7OztRQUU3QixPQUFPLEtBQUMsTUFBTTtRQUVkLEtBQUMsTUFBTSxTQUFTLEVBQUUsRUFBRSxLQUFLLElBQUksS0FBSyxLQUFDLE1BQU07UUFFekMsUUFBUSxLQUFDLE1BQU07WUFFVCxTQUFTOzs7O1FBRWYsS0FBSyxLQUFDLFdBQVc7UUFDakIsS0FBSyxLQUFDLFdBQVc7UUFFakIsTUFBSyxLQUFDLFFBQVEsS0FBQyxNQUFNLFFBQVEsS0FBQyxNQUFNO1FBRXBDLElBQUssS0FBQyxNQUFNLElBQUUsSUFBSTtRQUNsQixhQUFTLEtBQUMsTUFBTSxJQUFFLElBQUksS0FBRztRQUN6QixhQUFTLElBQUksS0FBRztRQUNoQixhQUFTO1FBRVQsUUFBUSxNQUFNLFdBQU0sSUFBRSxJQUFFLEdBQUcsRUFBRSxJQUFFLEVBQUU7UUFFakMsUUFBUSxNQUFNLEVBQUUsRUFBTSxJQUFHLEtBQUssS0FBSyxLQUFDLE1BQU0sTUFBSztlQUMvQyxRQUFRLE1BQU0sRUFBRSxJQUFFLElBQUUsRUFBRSxLQUFJLElBQUUsS0FBSyxLQUFDLE1BQU0sSUFBRSxRQUFNLElBQUksS0FBRyxLQUFLLEtBQUssS0FBQyxNQUFNLE1BQUs7OztXQXhJNUU7OztlQTBJRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/scroll.kode
