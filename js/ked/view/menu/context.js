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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L2NvbnRleHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFleUI7c0JBRWQ7Ozs7Ozs7Z0RBSUcsS0FBQyxPQUFPO1FBRWQsS0FBQyxTQUFTLEtBQUssTUFBTSxRQUFRO1FBRTdCLFFBQVEsT0FBTzs7Ozs7OztRQVVmLElBQUksS0FBQyxRQUFNLElBQUU7UUFDYixJQUFJLEtBQUMsUUFBUTtRQUViLE1BQUssS0FBQyxrQkFBa0IsSUFBSTtRQUM1QixhQUFTLEVBQUUsS0FBSztRQUNoQixJQUFJLElBQUksSUFBSTtRQUNaLElBQUksS0FBQyxJQUFJO1FBQ1QsSUFBSSxLQUFDLElBQUk7UUFFVCxLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQUksSUFBRSxFQUFPLElBQUUsRUFBRztRQUNyQyxLQUFDLFFBQVEsT0FBUSxJQUFFLEVBQUksSUFBRSxJQUFFLEdBQUssSUFBRSxFQUFHO2VBQ3JDLEtBQUMsTUFBTSxPQUFVLEVBQU0sRUFBUyxFQUFLOzs7OztlQVFsQixRQUFRLEtBQUssS0FBSyxJQUFJLEdBQUc7Ozs7Ozs7Ozs7O1FBSTVDLEtBQUMsSUFBSSxNQUFNO1FBRVgsUUFBUSxLQUFDLE1BQU07O21CQUFXLE1BQU07O1FBRWhDLEtBQUMsUUFBUSxLQUFLLGFBQWE7UUFFM0IsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07UUFDUCxLQUFDLFFBQVEsSUFBSTtRQUNiLEtBQUMsUUFBUSxPQUFPO1FBQ2hCLEtBQUMsUUFBUSxNQUFNLFNBQVMsRUFBRTs7Ozs7O1FBWTFCLEtBQUMsR0FBRztlQUNKLEtBQUM7Ozs7Ozs7O1lBWUssS0FBQzs7OztRQUVQLEtBQUM7UUFDRCxLQUFDO2VBQ0QsS0FBQzs7Ozs7OztRQUlELEtBQUs7WUFFRixLQUFDLE1BQU07O1lBQ04sS0FBQyxNQUFNLG9CQUFvQixFQUFFLEVBQUUsR0FBRyxHQUFFLEdBQUcsS0FBQyxNQUFNO1lBQzlDLEtBQUs7O2VBRVQsS0FBQyxNQUFNLG9CQUFvQixFQUFFLEdBQUcsR0FBRyxJQUFHLEdBQUcsS0FBQyxNQUFNOzs7Ozs7ZUFFakQifQ==
//# sourceURL=file://kode/ked/view/menu/context.kode
