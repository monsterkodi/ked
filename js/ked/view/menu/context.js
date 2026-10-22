var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var context

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import inputchoice from "./inputchoice.js"


context = (function ()
{
    _k_.extend(context, inputchoice)
    context["menu"] = null
    function context (screen)
    {
        this.screen = screen
    
        this["draw"] = this["draw"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        context.__super__.constructor.call(this,this.screen,'context')
        this.setColor('bg',theme.context.bg)
        context.menu = this
    }

    context.prototype["arrange"] = function ()
    {
        var c, h, ih, iz, w, x, y

        w = this.width + 2 + 1
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        x = this.pos[0]
        y = this.pos[1]
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,w - 2,c)
        return this.cells.layout(x,y,w,h)
    }

    context["show"] = function (pos, cb, items)
    {
        return context.menu.show(pos,cb,items)
    }

    context.prototype["show"] = function (pos, cb, items)
    {
        this.pos = pos
        this.cb = cb
        this.items = items
    
        var items

        this.pos[1] -= 1
        items = this.items.map(function (i)
        {
            return ' ' + i
        })
        this.width = belt.widthOfLines(items)
        this.input.set('')
        this.input.hide()
        this.choices.set(items)
        this.choices.select(0)
        this.choices.state.setView([0,0])
        return context.__super__.show.call(this)
    }

    context.prototype["applyChoice"] = function (choice)
    {
        this.cb(choice)
        return this.hide()
    }

    context.prototype["onWheel"] = function ()
    {}

    context.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
        this.drawFrame()
        return this.drawChoices()
    }

    context.prototype["drawFrame"] = function ()
    {
        var cy

        cy = 0
        if (this.input.visible())
        {
            this.cells.draw_rounded_border(0,0,-1,2,{fg:this.color.bg})
            cy = 2
        }
        return this.cells.draw_rounded_border(0,cy,-1,-1,{fg:this.color.bg})
    }

    return context
})()

export default context;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L2NvbnRleHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVVhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsV0FBUDs7T0FDTyxZQUFaOztPQUNZLGtCQUFBOzs7QUFFYixXQUFUOzt3QkFBeUI7SUFFckIsU0FBQyxTQUFNO2FBRVAsU0FBSTs7UUFBRDs7OztnREFFTyxLQUFDLE9BQU87UUFFZCxLQUFDLFNBQVMsS0FBSyxNQUFNLFFBQVE7UUFFN0IsUUFBUSxPQUFPOzs7dUJBUW5COzs7O1FBRUksSUFBSSxLQUFDLFFBQU0sSUFBRTtRQUNiLElBQUksS0FBQyxRQUFRO1FBRWIsTUFBSyxLQUFDLGtCQUFrQixJQUFJO1FBQzVCLGFBQVMsRUFBRSxLQUFLO1FBQ2hCLElBQUksSUFBSSxJQUFJO1FBQ1osSUFBSSxLQUFDLElBQUk7UUFDVCxJQUFJLEtBQUMsSUFBSTtRQUVULEtBQUMsTUFBTSxPQUFVLElBQUUsRUFBSSxJQUFFLEVBQU8sSUFBRSxFQUFHO1FBQ3JDLEtBQUMsUUFBUSxPQUFRLElBQUUsRUFBSSxJQUFFLElBQUUsR0FBSyxJQUFFLEVBQUc7ZUFDckMsS0FBQyxNQUFNLE9BQVUsRUFBTSxFQUFTLEVBQUs7OztJQVF6QyxTQUFDLG1CQUFNLEtBQUksSUFBRzs7ZUFBUyxRQUFRLEtBQUssS0FBSyxJQUFJLEdBQUc7Ozt1QkFFaEQsbUJBQU8sS0FBSyxJQUFJOztRQUFWO1FBQUs7UUFBSTs7OztRQUVYLEtBQUMsSUFBSSxNQUFNO1FBRVgsUUFBUSxLQUFDLE1BQU0sY0FBSzs7bUJBQU0sTUFBTTs7UUFFaEMsS0FBQyxRQUFRLEtBQUssYUFBYTtRQUUzQixLQUFDLE1BQU0sSUFBSTtRQUNYLEtBQUMsTUFBTTtRQUNQLEtBQUMsUUFBUSxJQUFJO1FBQ2IsS0FBQyxRQUFRLE9BQU87UUFDaEIsS0FBQyxRQUFRLE1BQU0sU0FBUyxFQUFFOzs7O3VCQVU5QiwwQkFBYTs7UUFFVCxLQUFDLEdBQUc7ZUFDSixLQUFDOzs7dUJBRUw7Ozt1QkFRQTs7WUFFVSxLQUFDOzs7O1FBRVAsS0FBQztRQUNELEtBQUM7ZUFDRCxLQUFDOzs7dUJBRUw7Ozs7UUFFSSxLQUFLO1lBRUYsS0FBQyxNQUFNOztZQUNOLEtBQUMsTUFBTSxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsR0FBRSxHQUFHLEtBQUMsTUFBTTtZQUM5QyxLQUFLOztlQUVULEtBQUMsTUFBTSxvQkFBb0IsRUFBRSxHQUFHLEdBQUcsSUFBRyxHQUFHLEtBQUMsTUFBTTs7O1dBNUYvQzs7O2VBOEZGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/context.kode
