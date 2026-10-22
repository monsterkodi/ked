var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }}

var menu

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import frecent from "../../util/frecent.js"

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import cells from "../screen/cells.js"

import greet from "./greet.js"
import inputchoice from "./inputchoice.js"


menu = (function ()
{
    _k_.extend(menu, inputchoice)
    function menu (screen, name = 'menu')
    {
        this.screen = screen
        this.name = name
    
        this["onNewFile"] = this["onNewFile"].bind(this)
        this["onEscape"] = this["onEscape"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        menu.__super__.constructor.call(this,this.screen,this.name)
        this.greet = new greet(this.screen)
    }

    menu.prototype["arrange"] = function ()
    {
        var c, diff, gh, gw, gx, gy, h, ih, iz, scx, scy, w, x, y

        w = this.width + 2 + 1
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        scy = parseInt(this.screen.rows / 2)
        y = parseInt(scy - (c + 2) / 2)
        y -= ih
        scx = parseInt(this.screen.cols / 2)
        x = parseInt(scx - w / 2)
        var _a_ = belt.cellSize(this.greet.header); gw = _a_[0]; gh = _a_[1]

        gx = parseInt(scx - gw / 2)
        gy = _k_.max(0,parseInt(y - gh - 1 + ih))
        if (this.greet.visible() && y <= gy + gh)
        {
            diff = (gy + gh) - y
            while (diff && gy)
            {
                gy -= 1
                diff = (gy + gh) - y
            }
            while (diff && y + h < this.screen.rows)
            {
                y += 1
                diff = (gy + gh) - y
            }
        }
        this.greet.layout(gx,gy)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,w - 2,c)
        return this.cells.layout(x,y,w,h)
    }

    menu.prototype["show"] = function (greet = false)
    {
        var ccol, items

        if (greet)
        {
            this.greet.show()
            this.screen.t.setTitle('kėd')
        }
        items = belt.linesForText(`recent ...
open ...
new
help
quit`)
        if (!greet)
        {
            items.splice(items.length - 2,0,'about')
        }
        if (_k_.empty(ked_session.recentFiles()))
        {
            items.splice(items.indexOf('recent ...'),1)
        }
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
        return menu.__super__.show.call(this)
    }

    menu.prototype["showRecent"] = function ()
    {
        var recent

        recent = frecent.list('file')
        this.choices.set(recent)
        return post.emit('quicky.files',recent)
    }

    menu.prototype["hide"] = function ()
    {
        this.greet.hide()
        return menu.__super__.hide.call(this)
    }

    menu.prototype["onEscape"] = function ()
    {
        var currentFile

        currentFile = ked_session.get('editor▸file')
        if (!_k_.empty(currentFile))
        {
            return menu.__super__.onEscape.call(this)
        }
        else
        {
            return this.onNewFile()
        }
    }

    menu.prototype["onNewFile"] = function ()
    {
        this.hide()
        return post.emit('file.new')
    }

    menu.prototype["applyChoice"] = function (choice)
    {
        switch (choice)
        {
            case 'new':
                this.onNewFile()
                break
            case 'about':
                this.show(true)
                break
            case 'quit':
                this.greet.hide()
                post.emit('quit')
                break
            case 'open ...':
                post.emit('browse.dir',process.cwd())
                break
            case 'recent ...':
                this.showRecent()
                break
            case 'help':
                this.hide()
                post.emit('file.open',slash.path(_k_.dir(),'../../../../kode/ked/help.md'))
                break
        }

        return true
    }

    menu.prototype["onWheel"] = function ()
    {}

    menu.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
        this.greet.draw()
        this.drawFrame()
        return this.drawChoices()
    }

    return menu
})()

export default menu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L21lbnUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVVhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsY0FBWDs7T0FDVyxXQUFQOztPQUNPLFlBQVo7O09BQ1ksWUFBZjs7T0FDZSxZQUFBO09BQU0sa0JBQUE7OztBQUVuQixRQUFUOztxQkFBc0I7YUFFbEIsTUFBSSxRQUFROztRQUFUO1FBQVE7Ozs7Ozs2Q0FFRCxLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsWUFBWSxNQUFNLEtBQUM7OztvQkFReEI7Ozs7UUFFSSxJQUFJLEtBQUMsUUFBTSxJQUFFO1FBQ2IsSUFBSSxLQUFDLFFBQVE7UUFFYixNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsSUFBSSxJQUFJLElBQUk7UUFDWixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGFBQVMsT0FBSyxJQUFFLEtBQUc7UUFDbkIsS0FBSztRQUVMLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsYUFBUyxNQUFNLElBQUU7a0JBRVAsS0FBSyxTQUFTLEtBQUMsTUFBTSxTQUE5QixhQUFHOztRQUVKLGNBQVMsTUFBSSxLQUFHO1FBQ2hCLGFBQVMsV0FBTSxJQUFFLEtBQUcsSUFBRTtZQUVuQixLQUFDLE1BQU0sYUFBYyxLQUFLLEtBQUc7O1lBRTVCLFFBQVEsS0FBRyxNQUFJO21CQUVULFFBQVM7O2dCQUNWLE1BQU07Z0JBQ04sUUFBUSxLQUFHLE1BQUk7O21CQUVkLFFBQVMsSUFBRSxJQUFJLEtBQUMsT0FBTzs7Z0JBQ3pCLEtBQUs7Z0JBQ0wsUUFBUSxLQUFHLE1BQUk7OztRQUV2QixLQUFDLE1BQU0sT0FBVSxHQUFNO1FBQ3ZCLEtBQUMsTUFBTSxPQUFVLElBQUUsRUFBSSxJQUFFLEVBQU8sSUFBRSxFQUFHO1FBQ3JDLEtBQUMsUUFBUSxPQUFRLElBQUUsRUFBSSxJQUFFLElBQUUsR0FBSyxJQUFFLEVBQUc7ZUFDckMsS0FBQyxNQUFNLE9BQVUsRUFBTSxFQUFTLEVBQUs7OztvQkFRekMsbUJBQU0sUUFBTTs7OztZQUVMOztZQUNDLEtBQUMsTUFBTTtZQUNQLEtBQUMsT0FBTyxFQUFFLFNBQVM7O1FBRXZCLFFBQVEsS0FBSyxhQUNUOzs7OzthQVF5Qzs7WUFBN0MsTUFBTSxPQUFPLE1BQU0sU0FBTyxFQUFFLEVBQUU7O3NCQUNzQixZQUFZOztZQUFoRSxNQUFNLE9BQU8sTUFBTSxRQUFRLGNBQWM7O1FBRXpDLFFBQVEsTUFBTSxjQUFLOzttQkFBTSxNQUFNOztRQUUvQixnQkFBVyxLQUFDLE9BQU8sT0FBSyxLQUFLO1FBRTdCLEtBQUMsUUFBUSxLQUFLLGFBQWE7UUFFM0IsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07UUFDUCxLQUFDLFFBQVEsSUFBSTtRQUNiLEtBQUMsUUFBUSxPQUFPO1FBQ2hCLEtBQUMsUUFBUSxNQUFNLFNBQVMsRUFBRTs7OztvQkFVOUI7Ozs7UUFFSSxTQUFTLFFBQVEsS0FBSztRQUV0QixLQUFDLFFBQVEsSUFBSTtlQUViLEtBQUssS0FBSyxlQUFlOzs7b0JBRTdCOztRQUVJLEtBQUMsTUFBTTs7OztvQkFHWDs7OztRQUVJLGNBQWMsWUFBWSxJQUFJO3VCQUNyQjs7Ozs7O21CQUdMLEtBQUM7Ozs7b0JBRVQ7O1FBRUksS0FBQztlQUNELEtBQUssS0FBSzs7O29CQVFkLDBCQUFhOztnQkFJRjs7aUJBQ0g7Z0JBQWUsS0FBQzs7aUJBQ2hCO2dCQUFlLEtBQUMsS0FBSzs7aUJBQ3JCO2dCQUFlLEtBQUMsTUFBTTtnQkFBUSxLQUFLLEtBQUs7O2lCQUN4QztnQkFBZSxLQUFLLEtBQUssYUFBYSxRQUFROztpQkFDOUM7Z0JBQWUsS0FBQzs7aUJBQ2hCO2dCQUFlLEtBQUM7Z0JBQVEsS0FBSyxLQUFLLFlBQVksTUFBTSxLQUFNLFVBQUk7Ozs7ZUFFbEU7OztvQkFFSjs7O29CQVFBOztZQUVVLEtBQUM7Ozs7UUFFUCxLQUFDO1FBQ0QsS0FBQyxNQUFNO1FBQ1AsS0FBQztlQUNELEtBQUM7OztXQTdKQTs7O2VBK0pGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/menu.kode
