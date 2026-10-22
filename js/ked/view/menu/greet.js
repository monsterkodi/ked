var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var greet

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import help from "../../util/help.js"

import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import editor from "../../edit/editor.js"

import view from "../base/view.js"


greet = (function ()
{
    _k_.extend(greet, view)
    function greet (screen)
    {
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["show"] = this["show"].bind(this)
        this["hide"] = this["hide"].bind(this)
        greet.__super__.constructor.call(this,screen,'greet')
        this.isVisible = false
        this.header = help.headerCells()
        this.name = 'greet'
        this.a = 120
        this.cells.rows = 0
    }

    greet.prototype["hide"] = function ()
    {
        post.emit('greet.hide')
        return greet.__super__.hide.call(this)
    }

    greet.prototype["show"] = function ()
    {
        post.emit('greet.show')
        return greet.__super__.show.call(this)
    }

    greet.prototype["layout"] = function (x, y)
    {
        var h, w

        var _a_ = belt.cellSize(this.header); w = _a_[0]; h = _a_[1]

        return this.cells.layout(x,y,w,h)
    }

    greet.prototype["draw"] = function ()
    {
        var cell, duration, f, row, x, y

        if (this.hidden())
        {
            return
        }
        this.screen.fill_bg([0,0,0])
        duration = 480
        this.a += 1
        if (this.a > duration)
        {
            this.a = 0
        }
        f = 0.4 + 0.6 * Math.abs(Math.sin(2 * Math.PI * this.a / duration))
        this.header = help.headerCells(f)
        var list = _k_.list(this.header)
        for (y = 0; y < list.length; y++)
        {
            row = list[y]
            var list1 = _k_.list(row)
            for (x = 0; x < list1.length; x++)
            {
                cell = list1[x]
                this.cells.set(x,y,cell.char,cell.fg,cell.bg)
            }
        }
        return post.emit('redraw')
    }

    return greet
})()

export default greet;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JlZXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9ncmVldC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJTLFNBQVQ7O3NCQUF1QjthQUVuQixPQUFHOzs7Ozs7OENBRU8sT0FBTztRQUViLEtBQUMsWUFBWTtRQUViLEtBQUMsU0FBVSxLQUFLO1FBQ2hCLEtBQUMsT0FBVTtRQUNYLEtBQUMsSUFBVTtRQUVYLEtBQUMsTUFBTSxPQUFPOzs7cUJBUWxCOztRQUVJLEtBQUssS0FBSzs7OztxQkFHZDs7UUFFSSxLQUFLLEtBQUs7Ozs7cUJBR2QscUJBQVEsR0FBRTs7OztrQkFFRSxLQUFLLFNBQVMsS0FBQzs7ZUFFdkIsS0FBQyxNQUFNLE9BQU8sRUFBRSxFQUFFLEVBQUU7OztxQkFReEI7Ozs7WUFFVSxLQUFDOzs7O1FBRVAsS0FBQyxPQUFPLFNBQVMsRUFBRSxFQUFFO1FBRXJCLFdBQVc7UUFDWCxLQUFDLEtBQUs7WUFDSSxLQUFDLElBQUk7O1lBQWYsS0FBQyxJQUFJOztRQUNMLElBQUksTUFBTSxlQUFVLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxLQUFDLElBQUk7UUFFaEQsS0FBQyxTQUFTLEtBQUssWUFBWTs0QkFFZCxLQUFDOzs7WUFBVjtpQ0FDYzs7O2dCQUFWO2dCQUNBLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUssS0FBSyxHQUFHLEtBQUs7OztlQUU5QyxLQUFLLEtBQUs7OztXQTNEVDs7O2VBNkRGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/greet.kode
