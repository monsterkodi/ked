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
    
        this["draw"] = this["draw"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["applyChoice"] = this["applyChoice"].bind(this)
        this["onNewFile"] = this["onNewFile"].bind(this)
        this["onEscape"] = this["onEscape"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["showRecent"] = this["showRecent"].bind(this)
        this["show"] = this["show"].bind(this)
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
        ;[gw,gh] = belt.cellSize(this.greet.header)
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
        this.erase()
        this.greet.draw()
        this.drawFrame()
        return this.drawChoices()
    }

    return menu
})()

export default menu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L21lbnUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsY0FBWDs7T0FDVyxXQUFQOztPQUNPLFlBQVo7O09BQ1ksWUFBZjs7T0FDZSxZQUFBO09BQU0sa0JBQUE7OztBQUUzQixRQUFEOztxQkFBTTthQUdGLE1BQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7Ozs7Ozs2Q0FFRCxLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsWUFBWSxNQUFNLEtBQUM7OztvQkFFeEI7Ozs7UUFFSSxJQUFJLEtBQUMsUUFBTSxJQUFFO1FBQ2IsSUFBSSxLQUFDLFFBQVE7UUFFYixNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsSUFBSSxJQUFJLElBQUk7UUFDWixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGFBQVMsT0FBSyxJQUFFLEtBQUc7UUFDbkIsS0FBSztRQUVMLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsYUFBUyxNQUFNLElBQUU7VUFFaEIsR0FBRyxNQUFNLEtBQUssU0FBUyxLQUFDLE1BQU07UUFFL0IsY0FBUyxNQUFJLEtBQUc7UUFDaEIsYUFBUyxXQUFNLElBQUUsS0FBRyxJQUFFO1lBRW5CLEtBQUMsTUFBTSxhQUFjLEtBQUssS0FBRzs7WUFFNUIsUUFBUSxLQUFHLE1BQUk7bUJBRVQsUUFBUzs7Z0JBQ1YsTUFBTTtnQkFDTixRQUFRLEtBQUcsTUFBSTs7bUJBRWQsUUFBUyxJQUFFLElBQUksS0FBQyxPQUFPOztnQkFDekIsS0FBSztnQkFDTCxRQUFRLEtBQUcsTUFBSTs7O1FBRXZCLEtBQUMsTUFBTSxPQUFVLEdBQU07UUFDdkIsS0FBQyxNQUFNLE9BQVUsSUFBRSxFQUFJLElBQUUsRUFBTyxJQUFFLEVBQUc7UUFDckMsS0FBQyxRQUFRLE9BQVEsSUFBRSxFQUFJLElBQUUsSUFBRSxHQUFLLElBQUUsRUFBRztlQUNyQyxLQUFDLE1BQU0sT0FBVSxFQUFNLEVBQVMsRUFBSzs7O29CQUV6QyxtQkFBTSxRQUFNOzs7O1lBRUw7O1lBQ0MsS0FBQyxNQUFNO1lBQ1AsS0FBQyxPQUFPLEVBQUUsU0FBUzs7UUFFdkIsUUFBUSxLQUFLLGFBQ1Q7Ozs7O2FBUXlDOztZQUE3QyxNQUFNLE9BQU8sTUFBTSxTQUFPLEVBQUUsRUFBRTs7c0JBQ3NCLFlBQVk7O1lBQWhFLE1BQU0sT0FBTyxNQUFNLFFBQVEsY0FBYzs7UUFFekMsUUFBUSxNQUFNLGNBQUs7O21CQUFNLE1BQU07O1FBRS9CLGdCQUFXLEtBQUMsT0FBTyxPQUFLLEtBQUs7UUFFN0IsS0FBQyxRQUFRLEtBQUssYUFBYTtRQUUzQixLQUFDLE1BQU0sSUFBSTtRQUNYLEtBQUMsTUFBTTtRQUNQLEtBQUMsUUFBUSxJQUFJO1FBQ2IsS0FBQyxRQUFRLE9BQU87UUFDaEIsS0FBQyxRQUFRLE1BQU0sU0FBUyxFQUFFOzs7O29CQUk5Qjs7OztRQUVJLFNBQVMsUUFBUSxLQUFLO1FBRXRCLEtBQUMsUUFBUSxJQUFJO2VBRWIsS0FBSyxLQUFLLGVBQWU7OztvQkFFN0I7O1FBRUksS0FBQyxNQUFNOzs7O29CQUdYOzs7O1FBRUksY0FBYyxZQUFZLElBQUk7dUJBQ3JCOzs7Ozs7bUJBR0wsS0FBQzs7OztvQkFFVDs7UUFFSSxLQUFDO2VBQ0QsS0FBSyxLQUFLOzs7b0JBRWQsMEJBQWE7O2dCQUVGOztpQkFDSDtnQkFBZSxLQUFDOztpQkFDaEI7Z0JBQWUsS0FBQyxLQUFLOztpQkFDckI7Z0JBQWUsS0FBQyxNQUFNO2dCQUFRLEtBQUssS0FBSzs7aUJBQ3hDO2dCQUFlLEtBQUssS0FBSyxhQUFhLFFBQVE7O2lCQUM5QztnQkFBZSxLQUFDOztpQkFDaEI7Z0JBQWUsS0FBQztnQkFBUSxLQUFLLEtBQUssWUFBWSxNQUFNLEtBQU0sVUFBSTs7OztlQUVsRTs7O29CQUVKOzs7b0JBRUE7O1lBRVMsS0FBQzs7OztRQUVOLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxNQUFNO1FBQ1AsS0FBQztlQUNELEtBQUM7OztXQS9IUjs7O2VBaUlNIn0=
//# sourceURL=../../../../kode/ked/view/menu/menu.kode
