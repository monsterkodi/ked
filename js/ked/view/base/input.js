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
            return false
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsYUFBVDs7O0FBQ1QsU0FBRDs7c0JBQU87YUFLSCxPQUFHLFFBQU87Ozs7OzhDQUVBLE9BQU8sTUFBTSxTQUFTLFNBQVM7UUFFckMsS0FBQyxTQUFTLGlCQUFrQixLQUFDLE1BQU07UUFDbkMsS0FBQyxTQUFTLEtBQWtCLE1BQU0sT0FBTztRQUN6QyxLQUFDLFNBQVMsVUFBa0IsTUFBTSxPQUFPO1FBQ3pDLEtBQUMsU0FBUyxXQUFrQixNQUFNLE9BQU87OztxQkFJN0MsMkJBQWM7O1FBRVYsS0FBQyxLQUFLLFNBQVM7c0RBQ1Q7OztxQkFFVixzQkFBUzs7WUFFQSxLQUFDOzs7O2lEQUVBOzs7cUJBRVY7O2VBQWEsS0FBSyxJQUFJLEtBQUMsTUFBTSxFQUFFLE1BQU07OztxQkFFckMsa0JBQUs7O2VBRUQsS0FBQyxNQUFNLFdBQVc7OztxQkFFdEI7O1FBRUksS0FBQyxNQUFNLFdBQVc7ZUFDbEIsS0FBQyxNQUFNLFlBQVk7OztxQkFFdkIsb0JBQU8sS0FBSTs7OzthQUlRLEtBQUM7O21CQUFkOztnQkFJSyxNQUFNOztpQkFFVDtnQkFFSSxLQUFDLEtBQUssU0FBUyxTQUFTLEtBQUM7dUJBQ3ZCOztpQkFFTjtpQkFBSztnQkFFRCxLQUFDLEtBQUssU0FBUyxNQUFNO3VCQUNuQjs7aUJBRU47b0JBRU8sS0FBQyxNQUFNLGFBQWEsTUFBTSxLQUFDLFVBQVU7O29CQUNwQyxLQUFDLEtBQUssU0FBUzsyQkFDYjs7O2lCQUVWO2dCQUVJLEtBQUMsS0FBSyxTQUFTO3VCQUNiOzs7O1FBRVYsU0FBUyxLQUFDO1FBRVYscUNBQVcsSUFBSTtZQUVaLFdBQVUsS0FBQzs7WUFDVixLQUFDLEtBQUssU0FBUyxTQUFTLEtBQUM7bUJBQ3ZCOztlQUVOOzs7cUJBRUo7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxTQUFTLE1BQUssS0FBQyxhQUFhLEtBQUMsTUFBTSxXQUFXLEtBQUMsTUFBTTtRQUN0RCxLQUFDLFNBQVMsUUFBUSxLQUFDLE1BQU07Ozs7V0FwRmhDOzs7ZUEwRk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/input.kode
