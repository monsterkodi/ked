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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L21lbnUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCUyxRQUFUOztxQkFBc0I7YUFFbEIsTUFBRzs7Ozs7Ozs7OzZDQUVPLEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxZQUFZLE1BQU0sS0FBQzs7O29CQVF4Qjs7OztRQUVJLElBQUksS0FBQyxRQUFNLElBQUU7UUFDYixJQUFJLEtBQUMsUUFBUTtRQUViLE1BQUssS0FBQyxrQkFBa0IsSUFBSTtRQUM1QixhQUFTLEVBQUUsS0FBSztRQUVoQixJQUFJLElBQUksSUFBSTtRQUNaLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsYUFBUyxPQUFLLElBQUUsS0FBRztRQUNuQixLQUFLO1FBRUwsZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixhQUFTLE1BQU0sSUFBRTtrQkFFUCxLQUFLLFNBQVMsS0FBQyxNQUFNOztRQUUvQixjQUFTLE1BQUksS0FBRztRQUNoQixhQUFTLFdBQU0sSUFBRSxLQUFHLElBQUU7WUFFbkIsS0FBQyxNQUFNLGFBQWMsS0FBSyxLQUFHOztZQUU1QixRQUFRLEtBQUcsTUFBSTttQkFFVCxRQUFTOztnQkFDVixNQUFNO2dCQUNOLFFBQVEsS0FBRyxNQUFJOzttQkFFZCxRQUFTLElBQUUsSUFBSSxLQUFDLE9BQU87O2dCQUN6QixLQUFLO2dCQUNMLFFBQVEsS0FBRyxNQUFJOzs7UUFFdkIsS0FBQyxNQUFNLE9BQVUsR0FBTTtRQUN2QixLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQUksSUFBRSxFQUFPLElBQUUsRUFBRztRQUNyQyxLQUFDLFFBQVEsT0FBUSxJQUFFLEVBQUksSUFBRSxJQUFFLEdBQUssSUFBRSxFQUFHO2VBQ3JDLEtBQUMsTUFBTSxPQUFVLEVBQU0sRUFBUyxFQUFLOzs7b0JBUXpDLG1CQUFNOzs7O1lBRUM7O1lBQ0MsS0FBQyxNQUFNO1lBQ1AsS0FBQyxPQUFPLEVBQUUsU0FBUzs7UUFFdkIsUUFBUSxLQUFLLGFBQ1Q7Ozs7O2FBUXlDOztZQUE3QyxNQUFNLE9BQU8sTUFBTSxTQUFPLEVBQUUsRUFBRTs7c0JBQ3NCLFlBQVk7O1lBQWhFLE1BQU0sT0FBTyxNQUFNLFFBQVEsY0FBYzs7UUFFekMsUUFBUSxNQUFNLGNBQUs7O21CQUFNLE1BQU07O1FBRS9CLGdCQUFXLEtBQUMsT0FBTyxPQUFLLEtBQUs7UUFFN0IsS0FBQyxRQUFRLEtBQUssYUFBYTtRQUUzQixLQUFDLE1BQU0sSUFBSTtRQUNYLEtBQUMsTUFBTTtRQUNQLEtBQUMsUUFBUSxJQUFJO1FBQ2IsS0FBQyxRQUFRLE9BQU87UUFDaEIsS0FBQyxRQUFRLE1BQU0sU0FBUyxFQUFFOzs7O29CQVU5Qjs7OztRQUVJLFNBQVMsUUFBUSxLQUFLO1FBRXRCLEtBQUMsUUFBUSxJQUFJO2VBRWIsS0FBSyxLQUFLLGVBQWU7OztvQkFFN0I7O1FBRUksS0FBQyxNQUFNOzs7O29CQUdYOzs7O1FBRUksY0FBYyxZQUFZLElBQUk7dUJBQ3JCOzs7Ozs7bUJBR0wsS0FBQzs7OztvQkFFVDs7UUFFSSxLQUFDO2VBQ0QsS0FBSyxLQUFLOzs7b0JBUWQsMEJBQWE7O2dCQUlGOztpQkFDSDtnQkFBZSxLQUFDOztpQkFDaEI7Z0JBQWUsS0FBQyxLQUFLOztpQkFDckI7Z0JBQWUsS0FBQyxNQUFNO2dCQUFRLEtBQUssS0FBSzs7aUJBQ3hDO2dCQUFlLEtBQUssS0FBSyxhQUFhLFFBQVE7O2lCQUM5QztnQkFBZSxLQUFDOztpQkFDaEI7Z0JBQWUsS0FBQztnQkFBUSxLQUFLLEtBQUssWUFBWSxNQUFNLGVBQVU7Ozs7ZUFFbEU7OztvQkFFSjs7O29CQVFBOztZQUVVLEtBQUM7Ozs7UUFFUCxLQUFDO1FBQ0QsS0FBQyxNQUFNO1FBQ1AsS0FBQztlQUNELEtBQUM7OztXQTdKQTs7O2VBK0pGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/menu.kode
