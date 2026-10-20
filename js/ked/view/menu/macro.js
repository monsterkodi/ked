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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjcm8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9tYWNyby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQWV1Qjs7Ozs7Ozs4Q0FJVCxLQUFDLE9BQU87Ozs7Ozs7UUFVZCxZQUFRLEdBQUcsS0FBQyxRQUFNLElBQUU7UUFDcEIsSUFBSSxLQUFDLFFBQVE7UUFFYixNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsSUFBSSxJQUFJLElBQUk7UUFDWixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGFBQVMsT0FBSyxJQUFFLEtBQUc7UUFDbkIsS0FBSztRQUVMLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsYUFBUyxNQUFNLElBQUU7UUFFakIsS0FBQyxNQUFNLE9BQVUsSUFBRSxFQUFJLElBQUUsRUFBTyxJQUFFLEVBQUc7UUFDckMsS0FBQyxRQUFRLE9BQVEsSUFBRSxFQUFJLElBQUUsSUFBRSxHQUFLLElBQUUsRUFBRztlQUNyQyxLQUFDLE1BQU0sT0FBVSxFQUFNLEVBQVMsRUFBSzs7Ozs7OztRQVVyQyxRQUFRLEtBQUssYUFDVDs7O1FBTUosUUFBUSxNQUFNOzttQkFBVyxNQUFNOztRQUUvQixnQkFBVyxLQUFDLE9BQU8sT0FBSyxLQUFLO1FBRTdCLEtBQUMsUUFBUSxLQUFLLGFBQWE7UUFFM0IsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07UUFDUCxLQUFDLFFBQVEsSUFBSTtRQUNiLEtBQUMsUUFBUSxPQUFPO1FBQ2hCLEtBQUMsUUFBUSxNQUFNLFNBQVMsRUFBRTs7Ozs7O1FBTTFCLEtBQUssS0FBSyxRQUFROzs7Ozs7OztzQkFhVDs7WUFDTCxRQUFRLEtBQUMsTUFBTTtnQkFFWCxVQUFTOztnQkFBUyxLQUFLLEtBQUs7O3FCQUM1QixVQUFTOztnQkFBUyxLQUFLLEtBQUs7O3FCQUM1QixlQUFVOztnQkFBUSxLQUFLLEtBQUssWUFBWSxNQUFJLEVBQUU7O3FCQUU5QyxNQUFNLFdBQVc7O2dCQUViLEtBQUssTUFBTSxNQUFNO2dCQUNqQixLQUFLLFdBQVcsR0FBRztnQkFDbkIsT0FBTSxHQUFHLFNBQVMsS0FBSyxXQUFXLEdBQUcsTUFBTTtnQkFDM0MsS0FBSyxLQUFLLGdCQUFnQixHQUFHOztxQkFFakMsTUFBTSxXQUFXOztnQkFFYixLQUFLLE1BQU0sTUFBTTsrQkFDUixHQUFHOztvQkFDUixLQUFLLEtBQUssYUFBYSxHQUFHOzs7Ozs7b0JBRS9COztxQkFDSDtvQkFBWSxLQUFLLEtBQUs7O3FCQUN0QjtvQkFBWSxLQUFLLEtBQUs7O3FCQUN0QjtvQkFBWSxLQUFLLEtBQUs7Ozs7O1FBRTlCLEtBQUM7ZUFDRDs7Ozs7O2VBRUQifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/macro.kode
