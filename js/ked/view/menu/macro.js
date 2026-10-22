var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var macro

import kxk from "../../../kxk.js"
let post = kxk.post

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import inputchoice from "./inputchoice.js"


macro = (function ()
{
    _k_.extend(macro, inputchoice)
    function macro (screen)
    {
        this.screen = screen
    
        this["hide"] = this["hide"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        macro.__super__.constructor.call(this,this.screen,'macro')
    }

    macro.prototype["arrange"] = function ()
    {
        var c, h, ih, iz, scx, scy, w, x, y

        w = _k_.max(20,this.width + 2 + 1)
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        scy = parseInt(this.screen.rows / 2)
        y = parseInt(scy - (c + 2) / 2)
        y -= ih
        scx = parseInt(this.screen.cols / 2)
        x = parseInt(scx - w / 2)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,w - 2,c)
        return this.cells.layout(x,y,w,h)
    }

    macro.prototype["show"] = function ()
    {
        var ccol, items

        items = belt.linesForText(`status
diff
history`)
        items = items.map(function (i)
        {
            return ' ' + i
        })
        ccol = parseInt(this.screen.cols / 2) - 5
        this.width = belt.widthOfLines(items)
        this.input.set('')
        this.input.hide()
        this.choices.set(items)
        this.choices.select(0)
        this.choices.state.setView([0,0])
        return macro.__super__.show.call(this)
    }

    macro.prototype["hide"] = function ()
    {
        post.emit('focus','editor')
        return macro.__super__.hide.call(this)
    }

    macro.prototype["applyChoice"] = function (choice)
    {
        var input, lf, num, sf, sp

        if (_k_.empty(choice))
        {
            input = this.input.current()
            if (input === 'bof')
            {
                post.emit('goto.bof')
            }
            else if (input === 'eof')
            {
                post.emit('goto.eof')
            }
            else if (num = parseInt(input))
            {
                post.emit('goto.line',num - 1,'ind')
            }
            else if (input.startsWith('vibrant '))
            {
                sp = input.split(/\s+/)
                sf = parseFloat(sp[1])
                lf = ((sp.length > 2) ? parseFloat(sp[2]) : 1)
                post.emit('theme.vibrant',sf,lf)
            }
            else if (input.startsWith('class '))
            {
                sp = input.split(/\s+/)
                if (!_k_.empty(sp[1]))
                {
                    post.emit('file.class',sp[1])
                }
            }
        }
        else
        {
            switch (choice)
            {
                case 'diff':
                    post.emit('differ.file')
                    break
                case 'status':
                    post.emit('differ.status')
                    break
                case 'history':
                    post.emit('differ.history')
                    break
            }

        }
        this.hide()
        return true
    }

    return macro
})()

export default macro;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjcm8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9tYWNyby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQWVTLFNBQVQ7O3NCQUF1QjthQUVuQixPQUFHOzs7Ozs7OENBRU8sS0FBQyxPQUFPOzs7cUJBUWxCOzs7O1FBRUksWUFBUSxHQUFHLEtBQUMsUUFBTSxJQUFFO1FBQ3BCLElBQUksS0FBQyxRQUFRO1FBRWIsTUFBSyxLQUFDLGtCQUFrQixJQUFJO1FBQzVCLGFBQVMsRUFBRSxLQUFLO1FBRWhCLElBQUksSUFBSSxJQUFJO1FBQ1osZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixhQUFTLE9BQUssSUFBRSxLQUFHO1FBQ25CLEtBQUs7UUFFTCxlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGFBQVMsTUFBTSxJQUFFO1FBRWpCLEtBQUMsTUFBTSxPQUFVLElBQUUsRUFBSSxJQUFFLEVBQU8sSUFBRSxFQUFHO1FBQ3JDLEtBQUMsUUFBUSxPQUFRLElBQUUsRUFBSSxJQUFFLElBQUUsR0FBSyxJQUFFLEVBQUc7ZUFDckMsS0FBQyxNQUFNLE9BQVUsRUFBTSxFQUFTLEVBQUs7OztxQkFRekM7Ozs7UUFFSSxRQUFRLEtBQUssYUFDVDs7O1FBTUosUUFBUSxNQUFNLGNBQUs7O21CQUFNLE1BQU07O1FBRS9CLGdCQUFXLEtBQUMsT0FBTyxPQUFLLEtBQUs7UUFFN0IsS0FBQyxRQUFRLEtBQUssYUFBYTtRQUUzQixLQUFDLE1BQU0sSUFBSTtRQUNYLEtBQUMsTUFBTTtRQUNQLEtBQUMsUUFBUSxJQUFJO1FBQ2IsS0FBQyxRQUFRLE9BQU87UUFDaEIsS0FBQyxRQUFRLE1BQU0sU0FBUyxFQUFFOzs7O3FCQUk5Qjs7UUFFSSxLQUFLLEtBQUssUUFBUTs7OztxQkFTdEIsMEJBQWE7Ozs7c0JBSUE7O1lBQ0wsUUFBUSxLQUFDLE1BQU07Z0JBRVgsVUFBUzs7Z0JBQVMsS0FBSyxLQUFLOztxQkFDNUIsVUFBUzs7Z0JBQVMsS0FBSyxLQUFLOztxQkFDNUIsZUFBVTs7Z0JBQVEsS0FBSyxLQUFLLFlBQVksTUFBSSxFQUFFOztxQkFFOUMsTUFBTSxXQUFXOztnQkFFYixLQUFLLE1BQU0sTUFBTTtnQkFDakIsS0FBSyxXQUFXLEdBQUc7Z0JBQ25CLE9BQU0sR0FBRyxTQUFTLEtBQUssV0FBVyxHQUFHLE1BQU07Z0JBQzNDLEtBQUssS0FBSyxnQkFBZ0IsR0FBRzs7cUJBRWpDLE1BQU0sV0FBVzs7Z0JBRWIsS0FBSyxNQUFNLE1BQU07K0JBQ1IsR0FBRzs7b0JBQ1IsS0FBSyxLQUFLLGFBQWEsR0FBRzs7Ozs7O29CQUUvQjs7cUJBQ0g7b0JBQVksS0FBSyxLQUFLOztxQkFDdEI7b0JBQVksS0FBSyxLQUFLOztxQkFDdEI7b0JBQVksS0FBSyxLQUFLOzs7OztRQUU5QixLQUFDO2VBQ0Q7OztXQXRHQzs7O2VBd0dGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/macro.kode
