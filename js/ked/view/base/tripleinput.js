var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var tripleinput

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import input from "./input.js"
import view from "./view.js"


tripleinput = (function ()
{
    _k_.extend(tripleinput, view)
    function tripleinput (screen, name, fields)
    {
        this.screen = screen
        this.name = name
        this.fields = fields
    
        var field, inp

        this["onKey"] = this["onKey"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        tripleinput.__super__.constructor.call(this,this.screen,this.name)
        this.focusable = true
        this.inputs = []
        var list = _k_.list(this.fields)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            field = list[_a_]
            inp = new input(this.screen,`${this.name}_${field}`)
            inp.drawUnfocusedCursors = false
            this.inputs.push(inp)
        }
    }

    tripleinput.prototype["onWheel"] = function (event)
    {
        var input

        if (this.hidden() || this.collapsed())
        {
            return
        }
        if (!this.cells.isInsideEvent(event))
        {
            return
        }
        var list = _k_.list(this.inputs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            if (input.hasFocus())
            {
                return input.onWheel(event)
            }
        }
    }

    tripleinput.prototype["layout"] = function (x, y, w, h)
    {
        var input, wi, xi, xs

        xs = parseInt(w / 3)
        wi = _k_.min(xs - 1,5)
        xi = 0
        var list = _k_.list(this.inputs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            input.layout(x + xi,y,wi,1)
            xi += xs
        }
        return tripleinput.__super__.layout.call(this,x,y,w,h)
    }

    tripleinput.prototype["draw"] = function ()
    {
        var input

        if (this.hidden() || this.collapsed())
        {
            return
        }
        tripleinput.__super__.draw.call(this)
        var list = _k_.list(this.inputs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            input.draw()
        }
    }

    tripleinput.prototype["hasFocus"] = function ()
    {
        var input

        var list = _k_.list(this.inputs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            if (input.hasFocus())
            {
                return true
            }
        }
        return false
    }

    tripleinput.prototype["grabFocus"] = function ()
    {
        return this.inputs[0].grabFocus()
    }

    tripleinput.prototype["onKey"] = function (key, event)
    {
        var input

        if (!this.hasFocus())
        {
            return false
        }
        if (this.hidden() || this.collapsed())
        {
            return false
        }
        var list = _k_.list(this.inputs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            if (input.hasFocus())
            {
                return input.onKey(key,event)
            }
        }
        return false
    }

    return tripleinput
})()

export default tripleinput;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcGxlaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS90cmlwbGVpbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsWUFBQTtPQUFNLFdBQUE7OztBQUV4QixlQUFEOzs0QkFBYTthQUNULGFBQUksUUFBUSxNQUFNOztRQUFmO1FBQVE7UUFBTTs7Ozs7Ozs7b0RBRVAsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFlBQVk7UUFFYixLQUFDOzRCQUNZLEtBQUM7OztZQUFWO1lBQ0EsVUFBVSxNQUFNLEtBQUMsVUFBVSxLQUFDLFFBQVE7WUFDcEMsSUFBSSx1QkFBdUI7WUFDM0IsS0FBQyxPQUFPLEtBQUs7Ozs7MkJBZXJCLHNCQUFTOzs7O1lBRUEsS0FBQyxZQUFZLEtBQUM7Ozs7YUFDVixLQUFDLE1BQU0sY0FBYzs7Ozs0QkFFakIsS0FBQzs7O1lBQVY7Z0JBQ0csTUFBTTs7dUJBQWUsTUFBTSxRQUFROzs7OzsyQkFrQjlDLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs7O1FBRVYsY0FBUyxJQUFJO1FBQ2IsYUFBUyxLQUFHLEVBQUU7UUFDZCxLQUFLOzRCQUNRLEtBQUM7OztZQUFWO1lBQ0EsTUFBTSxPQUFPLElBQUUsR0FBRyxFQUFFLEdBQUc7WUFDdkIsTUFBTTs7c0RBRUosRUFBRSxFQUFFLEVBQUU7OzsyQkFFaEI7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7Ozs7NEJBSU4sS0FBQzs7O1lBQVY7WUFDQSxNQUFNOzs7OzJCQUVkOzs7OzRCQUVpQixLQUFDOzs7WUFBVjtnQkFDRyxNQUFNOzt1QkFBZTs7O2VBQzVCOzs7MkJBRUo7O2VBQWMsS0FBQyxPQUFPLEdBQUc7OzsyQkFFekIsb0JBQU8sS0FBSTs7OzthQUVRLEtBQUM7O21CQUFkOztZQUNTLEtBQUMsWUFBWSxLQUFDOzttQkFBdkI7OzRCQUVXLEtBQUM7OztZQUFWO2dCQUNHLE1BQU07O3VCQUFlLE1BQU0sTUFBTSxJQUFJOzs7ZUFFNUM7OztXQXRGUDs7O2VBd0ZNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/tripleinput.kode
