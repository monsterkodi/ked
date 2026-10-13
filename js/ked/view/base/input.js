var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var input

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import theme from "../../theme/theme.js"

import editor from "../../edit/editor.js"


input = (function ()
{
    _k_.extend(input, editor)
    function input (screen, name)
    {
        this["current"] = this["current"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        input.__super__.constructor.call(this,screen,name,['brckts','replex','unype'])
        this.setColor('selection_line',this.color.selection)
        this.setColor('bg',theme.quicky.bg)
        this.setColor('bg_blur',theme.quicky.bg)
        this.setColor('bg_focus',theme.editor.bg)
    }

    input.prototype["hasFocus"] = function ()
    {
        return this.state.hasFocus
    }

    input.prototype["onMouseLeave"] = function (event)
    {
        this.emit('action','cancel')
        return input.__super__.onMouseLeave.call(this,event)
    }

    input.prototype["onMouse"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        return input.__super__.onMouse.call(this,event)
    }

    input.prototype["current"] = function ()
    {
        return kseg.str(this.state.s.lines[0])
    }

    input.prototype["set"] = function (text)
    {
        return this.state.loadLines([text])
    }

    input.prototype["selectAll"] = function ()
    {
        this.state.selectLine(0)
        return this.state.moveCursors('eol')
    }

    input.prototype["onKey"] = function (key, event)
    {
        var before, sr

        if (!this.hasFocus())
        {
            return
        }
        switch (event.combo)
        {
            case 'return':
                this.emit('action','submit',this.current())
                return true

            case 'up':
            case 'down':
                this.emit('action',event.combo)
                return false

            case 'right':
                if (this.state.mainCursor()[0] >= this.current().length)
                {
                    this.emit('action','right')
                    return true
                }
                break
            case 'esc':
                this.emit('action','cancel')
                return true

        }

        before = this.current()
        sr = input.__super__.onKey.call(this,key,event)
        if (before !== this.current())
        {
            this.emit('action','change',this.current())
            return true
        }
        return sr
    }

    input.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.setColor('bg',(this.hasFocus() ? this.color.bg_focus : this.color.bg_blur))
        this.setColor('empty',this.color.bg)
        return input.__super__.draw.call(this)
    }

    return input
})()

export default input;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFldUI7Ozs7Ozs4Q0FJVCxPQUFPLE1BQU0sU0FBUyxTQUFTO1FBRXJDLEtBQUMsU0FBUyxpQkFBa0IsS0FBQyxNQUFNO1FBQ25DLEtBQUMsU0FBUyxLQUFrQixNQUFNLE9BQU87UUFDekMsS0FBQyxTQUFTLFVBQWtCLE1BQU0sT0FBTztRQUN6QyxLQUFDLFNBQVMsV0FBa0IsTUFBTSxPQUFPOzs7OztlQVFoQyxLQUFDLE1BQU07Ozs7O1FBSWhCLEtBQUMsS0FBSyxTQUFTO3NEQUNUOzs7OztZQUlBLEtBQUM7Ozs7aURBRUQ7Ozs7O2VBRUcsS0FBSyxJQUFJLEtBQUMsTUFBTSxFQUFFLE1BQU07Ozs7O2VBSWpDLEtBQUMsTUFBTSxXQUFXOzs7OztRQUlsQixLQUFDLE1BQU0sV0FBVztlQUNsQixLQUFDLE1BQU0sWUFBWTs7Ozs7OzthQVVULEtBQUM7Ozs7Z0JBRUosTUFBTTs7aUJBRVQ7Z0JBRUksS0FBQyxLQUFLLFNBQVMsU0FBUyxLQUFDO3VCQUN0Qjs7aUJBRVA7aUJBQUs7Z0JBRUQsS0FBQyxLQUFLLFNBQVMsTUFBTTt1QkFDbEI7O2lCQUVQO29CQUVPLEtBQUMsTUFBTSxhQUFhLE1BQU0sS0FBQyxVQUFVOztvQkFDcEMsS0FBQyxLQUFLLFNBQVM7MkJBQ1o7OztpQkFFWDtnQkFFSSxLQUFDLEtBQUssU0FBUzt1QkFDWjs7OztRQUVYLFNBQVMsS0FBQztRQUVWLHFDQUFXLElBQUk7WUFFWixXQUFVLEtBQUM7O1lBQ1YsS0FBQyxLQUFLLFNBQVMsU0FBUyxLQUFDO21CQUN0Qjs7ZUFFUDs7Ozs7WUFVSyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLFNBQVMsTUFBSyxLQUFDLGFBQWEsS0FBQyxNQUFNLFdBQVcsS0FBQyxNQUFNO1FBQ3RELEtBQUMsU0FBUyxRQUFRLEtBQUMsTUFBTTs7Ozs7OztlQU0xQiJ9
//# sourceURL=kode/ked/view/base/input.kode
