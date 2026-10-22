var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        return this.state.s.lines.length > this.cells.rows
    }

    scroll.prototype["scrollToPixel"] = function (pixel)
    {
        var csz, maxY, rowf, view

        if (_k_.empty((csz = this.screen.t.cellsz)))
        {
            return
        }
        view = this.state.s.view.asMutable()
        rowf = pixel[1] / csz[1] - this.cells.y
        view[1] = Math.floor(rowf * (this.state.s.lines.length - this.cells.rows + 1) / (this.cells.rows - 1))
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        if (_k_.eql(view, this.state.s.view))
        {
            return true
        }
        this.state.setView(view)
        return {redraw:true}
    }

    scroll.prototype["draw"] = function ()
    {
        var csz, fg, h, kh, ky, lnum, rows, w, x, y

        if (_k_.empty((csz = this.screen.t.cellsz)))
        {
            return
        }
        rows = this.cells.rows
        this.cells.fill_col(0,0,rows,' ',null,this.color.bg)
        lnum = this.state.s.lines.length
        if (lnum <= rows)
        {
            return
        }
        kh = ((rows * rows) / lnum) * csz[1]
        ky = ((rows * csz[1] - kh) * this.state.s.view[1] / (lnum - rows))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2Uvc2Nyb2xsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FXYSxVQUFBO0lBQVE7O09BQ0EsWUFBWDs7T0FDVyxjQUFBO09BQVEsY0FBQTs7T0FDUixXQUFBOztBQUVwQixNQUFPOzs7QUFFQyxVQUFUOzt1QkFBd0I7YUFFcEIsUUFBRyxRQUFRLE9BQU87O1FBQVI7UUFBTzs7Ozs7K0NBRVAsT0FBTyxLQUFDLE1BQU0sVUFBVTtRQUU5QixLQUFDLGNBQWM7UUFFZixLQUFDLFNBQVMsS0FBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLE1BQVEsTUFBTSxPQUFPO1FBQy9CLEtBQUMsU0FBUyxPQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsUUFBUSxNQUFNLE9BQU87OztzQkFRbkMsc0JBQVM7Ozs7a0JBRU8sS0FBQyxTQUFTLFFBQXJCLGNBQUk7OzJDQUVDO2dCQUVDLE1BQU07O2lCQUVUO29CQUVPLEtBQUM7O29CQUNBLEtBQUMsU0FBUztvQkFDVixLQUFLLEtBQUssVUFBUzsyQkFDaEIsS0FBQyxjQUFjLE1BQU07OztpQkFFaEM7b0JBRU8sS0FBQzs7b0JBQ0EsS0FBQyxRQUFRO29CQUNULEtBQUssS0FBSyxVQUFTOzJCQUNoQixLQUFDLGNBQWMsTUFBTTs7Z0JBRTVCLEtBQUMsUUFBUTs7aUJBRWI7b0JBRU8sS0FBQzs7d0JBQ2dDLEtBQUM7O3dCQUFqQyxLQUFLLEtBQUssVUFBUzs7MkJBQ1osS0FBQzsyQkFDTDs7Ozs7ZUFDZixLQUFDOzs7c0JBRUw7O2VBRUksS0FBQyxNQUFNLEVBQUUsTUFBTSxTQUFTLEtBQUMsTUFBTTs7O3NCQVFuQyw0QkFBZTs7Ozt1QkFFRSxNQUFNLEtBQUMsT0FBTyxFQUFFOzs7O1FBRTdCLE9BQU8sS0FBQyxNQUFNLEVBQUUsS0FBSztRQUVyQixPQUFPLE1BQU0sS0FBRyxJQUFJLEtBQUcsS0FBQyxNQUFNO1FBQzlCLEtBQUssZ0JBQVcsUUFBUSxLQUFDLE1BQU0sRUFBRSxNQUFNLFNBQVMsS0FBQyxNQUFNLE9BQU8sTUFBTyxLQUFDLE1BQU0sT0FBSztRQUVqRixPQUFPLEtBQUMsTUFBTSxFQUFFLE1BQU0sU0FBUyxLQUFDLE1BQU07WUFFUixPQUFPOztZQUFyQyxLQUFLLGFBQVMsS0FBSyxLQUFLOztRQUN4QixLQUFLLGFBQVMsRUFBRSxLQUFLO29CQUVWLE1BQVMsS0FBQyxNQUFNLEVBQUU7O21CQUExQjs7UUFFSCxLQUFDLE1BQU0sUUFBUTtnQkFFZixPQUFPOzs7c0JBUVg7Ozs7dUJBRWlCLE1BQU0sS0FBQyxPQUFPLEVBQUU7Ozs7UUFFN0IsT0FBTyxLQUFDLE1BQU07UUFFZCxLQUFDLE1BQU0sU0FBUyxFQUFFLEVBQUUsS0FBSyxJQUFJLEtBQUssS0FBQyxNQUFNO1FBRXpDLE9BQU8sS0FBQyxNQUFNLEVBQUUsTUFBTTtZQUVoQixRQUFROzs7O1FBRWQsT0FBTyxPQUFLLFFBQVEsUUFBUSxJQUFJO1FBQ2hDLE9BQU8sT0FBSyxJQUFJLEtBQUcsTUFBTSxLQUFDLE1BQU0sRUFBRSxLQUFLLE1BQU0sT0FBSztRQUVsRCxNQUFLLEtBQUMsUUFBUSxLQUFDLE1BQU0sUUFBUSxLQUFDLE1BQU07UUFFcEMsSUFBSyxLQUFDLE1BQU0sSUFBRSxJQUFJO1FBQ2xCLGFBQVMsS0FBQyxNQUFNLElBQUUsSUFBSSxLQUFHO1FBQ3pCLGFBQVMsSUFBSSxLQUFHO1FBQ2hCLGFBQVM7UUFFVCxRQUFRLE1BQU0sV0FBTSxJQUFFLElBQUUsR0FBRyxFQUFFLElBQUUsRUFBRTtRQUVqQyxRQUFRLE1BQU0sRUFBRSxFQUFNLElBQUcsS0FBSyxLQUFLLEtBQUMsTUFBTSxNQUFLO2VBQy9DLFFBQVEsTUFBTSxFQUFFLElBQUUsSUFBRSxFQUFFLEtBQUksSUFBRSxLQUFLLEtBQUMsTUFBTSxJQUFFLFFBQU0sSUFBSSxLQUFHLEtBQUssS0FBSyxLQUFDLE1BQU0sTUFBSzs7O1dBaEg1RTs7O2VBa0hGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/scroll.kode
