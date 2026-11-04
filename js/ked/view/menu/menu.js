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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L21lbnUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsY0FBWDs7T0FDVyxXQUFQOztPQUNPLFlBQVo7O09BQ1ksWUFBZjs7T0FDZSxZQUFBO09BQU0sa0JBQUE7OztBQUUzQixRQUFEOztxQkFBTTthQUdGLE1BQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7NkNBRUQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFlBQVksTUFBTSxLQUFDOzs7b0JBRXhCOzs7O1FBRUksSUFBSSxLQUFDLFFBQU0sSUFBRTtRQUNiLElBQUksS0FBQyxRQUFRO1FBRWIsTUFBSyxLQUFDLGtCQUFrQixJQUFJO1FBQzVCLGFBQVMsRUFBRSxLQUFLO1FBRWhCLElBQUksSUFBSSxJQUFJO1FBQ1osZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixhQUFTLE9BQUssSUFBRSxLQUFHO1FBQ25CLEtBQUs7UUFFTCxlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGFBQVMsTUFBTSxJQUFFO2tCQUVQLEtBQUssU0FBUyxLQUFDLE1BQU0sU0FBOUIsYUFBRzs7UUFFSixjQUFTLE1BQUksS0FBRztRQUNoQixhQUFTLFdBQU0sSUFBRSxLQUFHLElBQUU7WUFFbkIsS0FBQyxNQUFNLGFBQWMsS0FBSyxLQUFHOztZQUU1QixRQUFRLEtBQUcsTUFBSTttQkFFVCxRQUFTOztnQkFDVixNQUFNO2dCQUNOLFFBQVEsS0FBRyxNQUFJOzttQkFFZCxRQUFTLElBQUUsSUFBSSxLQUFDLE9BQU87O2dCQUN6QixLQUFLO2dCQUNMLFFBQVEsS0FBRyxNQUFJOzs7UUFFdkIsS0FBQyxNQUFNLE9BQVUsR0FBTTtRQUN2QixLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQUksSUFBRSxFQUFPLElBQUUsRUFBRztRQUNyQyxLQUFDLFFBQVEsT0FBUSxJQUFFLEVBQUksSUFBRSxJQUFFLEdBQUssSUFBRSxFQUFHO2VBQ3JDLEtBQUMsTUFBTSxPQUFVLEVBQU0sRUFBUyxFQUFLOzs7b0JBRXpDLG1CQUFNLFFBQU07Ozs7WUFFTDs7WUFDQyxLQUFDLE1BQU07WUFDUCxLQUFDLE9BQU8sRUFBRSxTQUFTOztRQUV2QixRQUFRLEtBQUssYUFDVDs7Ozs7YUFReUM7O1lBQTdDLE1BQU0sT0FBTyxNQUFNLFNBQU8sRUFBRSxFQUFFOztzQkFDc0IsWUFBWTs7WUFBaEUsTUFBTSxPQUFPLE1BQU0sUUFBUSxjQUFjOztRQUV6QyxRQUFRLE1BQU0sY0FBSzs7bUJBQU0sTUFBTTs7UUFFL0IsZ0JBQVcsS0FBQyxPQUFPLE9BQUssS0FBSztRQUU3QixLQUFDLFFBQVEsS0FBSyxhQUFhO1FBRTNCLEtBQUMsTUFBTSxJQUFJO1FBQ1gsS0FBQyxNQUFNO1FBQ1AsS0FBQyxRQUFRLElBQUk7UUFDYixLQUFDLFFBQVEsT0FBTztRQUNoQixLQUFDLFFBQVEsTUFBTSxTQUFTLEVBQUU7Ozs7b0JBSTlCOzs7O1FBRUksU0FBUyxRQUFRLEtBQUs7UUFFdEIsS0FBQyxRQUFRLElBQUk7ZUFFYixLQUFLLEtBQUssZUFBZTs7O29CQUU3Qjs7UUFFSSxLQUFDLE1BQU07Ozs7b0JBR1g7Ozs7UUFFSSxjQUFjLFlBQVksSUFBSTt1QkFDckI7Ozs7OzttQkFHTCxLQUFDOzs7O29CQUVUOztRQUVJLEtBQUM7ZUFDRCxLQUFLLEtBQUs7OztvQkFFZCwwQkFBYTs7Z0JBSUY7O2lCQUNIO2dCQUFlLEtBQUM7O2lCQUNoQjtnQkFBZSxLQUFDLEtBQUs7O2lCQUNyQjtnQkFBZSxLQUFDLE1BQU07Z0JBQVEsS0FBSyxLQUFLOztpQkFDeEM7Z0JBQWUsS0FBSyxLQUFLLGFBQWEsUUFBUTs7aUJBQzlDO2dCQUFlLEtBQUM7O2lCQUNoQjtnQkFBZSxLQUFDO2dCQUFRLEtBQUssS0FBSyxZQUFZLE1BQU0sS0FBTSxVQUFJOzs7O2VBRWxFOzs7b0JBRUo7OztvQkFFQTs7WUFFVSxLQUFDOzs7O1FBRVAsS0FBQztRQUNELEtBQUMsTUFBTTtRQUNQLEtBQUM7ZUFDRCxLQUFDOzs7V0FoSVI7OztlQWtJTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/menu.kode
