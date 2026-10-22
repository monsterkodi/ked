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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vYi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL2tub2Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBZVMsUUFBVDs7cUJBQXNCO2FBRWxCLE1BQUcsUUFBTzs7Ozs2Q0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLEtBQUssTUFBTSxLQUFLO1FBQzFCLEtBQUMsU0FBUyxLQUFLLE1BQU0sS0FBSztRQUUxQixLQUFDLGFBQWMsS0FBQyxXQUFLO1FBQ3JCLEtBQUMsWUFBYztRQUNmLEtBQUMsV0FBYztRQUNmLEtBQUMsY0FBYzs7O29CQVFuQixzQkFBUzs7eUNBRUM7Ozs7Z0JBRUMsTUFBTTs7aUJBRVQ7b0JBRU8sS0FBQzs7b0JBQ0EsS0FBSyxLQUFLLFVBQVU7b0JBQ3BCLEtBQUMsU0FBUzs0QkFDUCxPQUFPOzs7aUJBRWxCO29CQUVPLEtBQUM7O29CQUNBLEtBQUMsUUFBUTs4QkFFRyxLQUFDLFNBQVM7O29CQUV0Qjs7Z0NBQWUsS0FBQzs7aUNBQ1o7d0NBQVc7O2lDQUNYO3VDQUFVOzs7OztvQkFFZCxLQUFLLEtBQUssVUFBVTt3QkFDakI7O3dCQUNDLEtBQUssS0FBSyxZQUFZLEtBQUMsV0FBVyxLQUFDLFVBQVU7OzRCQUU5QyxPQUFPOztnQkFFZCxLQUFDLFFBQVE7O2lCQUViO29CQUVPLEtBQUM7O3dCQUNvQyxLQUFDOzt3QkFBckMsS0FBSyxLQUFLLFVBQVUsS0FBQzs7MkJBQ2QsS0FBQzs0QkFDTCxPQUFPOzs7OztlQUN0QixLQUFDOzs7b0JBUUw7O2FBRWMsS0FBQzs7OztlQUVYLEtBQUMsTUFBTSxTQUFTLEVBQUUsRUFBRSxLQUFDLE1BQU0sT0FBSyxFQUFFLElBQUksS0FBQyxNQUFNLEdBQUcsS0FBQyxNQUFNOzs7V0F0RXREOzs7ZUF3RUYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/knob.kode
