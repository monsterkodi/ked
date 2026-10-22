var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var knob

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import view from "./view.js"


knob = (function ()
{
    _k_.extend(knob, view)
    function knob (screen, name)
    {
        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        knob.__super__.constructor.call(this,screen,name)
        this.setColor('fg',theme.knob.fg)
        this.setColor('bg',theme.knob.bg)
        this.parentName = this.name.slice(0, -5)
        this.frameSide = 'right'
        this.maxWidth = 68
        this.pointerType = 'ew-resize'
    }

    knob.prototype["onMouse"] = function (event)
    {
        knob.__super__.onMouse.call(this,event)
    
        var col, delta, row

        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    post.emit('pointer','grabbing')
                    this.doDrag = true
                    return {redraw:true}
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    this.hover = true
                    var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

                    delta = ((function ()
                    {
                        switch (this.frameSide)
                        {
                            case 'left':
                                return -col

                            case 'right':
                                return col

                        }

                    }).bind(this))()
                    post.emit('pointer','grabbing')
                    if (delta)
                    {
                        post.emit('view.size',this.parentName,this.frameSide,delta)
                    }
                    return {redraw:true}
                }
                this.hover = false
                break
            case 'release':
                if (this.doDrag)
                {
                    if (this.hover)
                    {
                        post.emit('pointer',this.pointerType)
                    }
                    delete this.doDrag
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    knob.prototype["draw"] = function ()
    {
        if (!this.hover)
        {
            return
        }
        return this.cells.fill_col(0,0,this.cells.rows - 1,'|',this.color.fg,this.color.bg)
    }

    return knob
})()

export default knob;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vYi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL2tub2Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVdhLFVBQUE7SUFBTTs7T0FDQSxZQUFUOztPQUNTLFdBQUE7OztBQUVWLFFBQVQ7O3FCQUFzQjthQUVsQixNQUFHLFFBQU87Ozs7NkNBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxLQUFLLE1BQU0sS0FBSztRQUMxQixLQUFDLFNBQVMsS0FBSyxNQUFNLEtBQUs7UUFFMUIsS0FBQyxhQUFjLEtBQUMsV0FBSztRQUNyQixLQUFDLFlBQWM7UUFDZixLQUFDLFdBQWM7UUFDZixLQUFDLGNBQWM7OztvQkFRbkIsc0JBQVM7O3lDQUVDOzs7O2dCQUVDLE1BQU07O2lCQUVUO29CQUVPLEtBQUM7O29CQUNBLEtBQUssS0FBSyxVQUFVO29CQUNwQixLQUFDLFNBQVM7NEJBQ1AsT0FBTzs7O2lCQUVsQjtvQkFFTyxLQUFDOztvQkFDQSxLQUFDLFFBQVE7OEJBRUcsS0FBQyxTQUFTLFFBQXJCLGNBQUk7O29CQUVMOztnQ0FBZSxLQUFDOztpQ0FDWjt3Q0FBVzs7aUNBQ1g7dUNBQVU7Ozs7O29CQUVkLEtBQUssS0FBSyxVQUFVO3dCQUNqQjs7d0JBQ0MsS0FBSyxLQUFLLFlBQVksS0FBQyxXQUFXLEtBQUMsVUFBVTs7NEJBRTlDLE9BQU87O2dCQUVkLEtBQUMsUUFBUTs7aUJBRWI7b0JBRU8sS0FBQzs7d0JBQ29DLEtBQUM7O3dCQUFyQyxLQUFLLEtBQUssVUFBVSxLQUFDOzsyQkFDZCxLQUFDOzRCQUNMLE9BQU87Ozs7O2VBQ3RCLEtBQUM7OztvQkFRTDs7YUFFYyxLQUFDOzs7O2VBRVgsS0FBQyxNQUFNLFNBQVMsRUFBRSxFQUFFLEtBQUMsTUFBTSxPQUFLLEVBQUUsSUFBSSxLQUFDLE1BQU0sR0FBRyxLQUFDLE1BQU07OztXQXRFdEQ7OztlQXdFRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/knob.kode
