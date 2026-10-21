var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var saveas

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post

import nfs from "../../../kxk/nfs.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import belt from "../../edit/tool/belt.js"

import quicky from "./quicky.js"
import brocol from "./brocol.js"
import diritem from "./diritem.js"
import dirlist from "./dirlist.js"


saveas = (function ()
{
    _k_.extend(saveas, quicky)
    function saveas (screen)
    {
        this.screen = screen
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["onBrocolAction"] = this["onBrocolAction"].bind(this)
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["applyChoice"] = this["applyChoice"].bind(this)
        this["targetPath"] = this["targetPath"].bind(this)
        this["goToParent"] = this["goToParent"].bind(this)
        this["enterDir"] = this["enterDir"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        this["preview"] = this["preview"].bind(this)
        this["showPathItems"] = this["showPathItems"].bind(this)
        this["gotoDir"] = this["gotoDir"].bind(this)
        this["open"] = this["open"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        saveas.__super__.constructor.call(this,this.screen,'saveas')
        this.isVisible = false
        this.setColor('bg',theme.quicky.bg)
        this.setColor('frame',theme.quicky.frame)
        this.brocol = new brocol(this.screen,'saveas_brocol')
        this.brocol.setColor('bg',color.darken(this.color.bg,0.7))
        this.brocol.on('action',this.onBrocolAction)
        this.choices.mapscr.rowOffset = 1
        this.choices.frontRoundOffset = 2
        this.userNamed = false
    }

    saveas.prototype["arrange"] = function ()
    {
        var bw, ch, cr, cw, fh, h, hs, ih, iz, scx, scy, w, x, y

        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        ih = 2
        iz = 1
        hs = parseInt(this.screen.rows / 2)
        y = parseInt(scy - hs / 2 - ih)
        cr = (this.crumbs.visible() ? 1 : 0)
        ch = (this.crumbs.visible() ? hs : _k_.min(hs,this.choices.numFiltered()))
        w = _k_.min(_k_.min(this.screen.cols,42),_k_.max(32,parseInt(this.screen.cols / 2)))
        bw = (this.brocol.visible() ? w / 2 : 0)
        cw = w - bw - 2
        x = parseInt(scx - w / 2)
        h = ch + ih + cr + 2
        fh = (this.brocol.visible() ? ch : 0)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.crumbs.layout(x + 2,y + 1 + ih,w - 4,cr)
        this.choices.layout(x + 1,y + 1 + ih + cr,cw,ch)
        this.brocol.layout(x + 1 + cw,y + 1 + ih + cr,bw,fh)
        return this.cells.layout(x,y,w,h)
    }

    saveas.prototype["open"] = async function (dir, name)
    {
        this.userNamed = false
        this.input.show()
        await this.gotoDir(dir)
        if (name)
        {
            this.input.set(name)
            this.input.state.moveCursors('eol')
        }
        return this.input.grabFocus()
    }

    saveas.prototype["gotoDir"] = async function (dir, select)
    {
        var items

        if (_k_.empty(dir))
        {
            dir = process.cwd()
        }
        dir = slash.untilde(dir)
        try
        {
            items = await dirlist.items(dir)
        }
        catch (err)
        {
            console.log('list error',err)
            return
        }
        this.currentDir = dir
        this.crumbs.show(dir)
        select = (select != null ? select : (items[1] != null ? items[1].path : undefined))
        return this.showPathItems(items,select)
    }

    saveas.prototype["showPathItems"] = function (items, select)
    {
        var idx, item, selectIndex

        selectIndex = 0
        if (select)
        {
            select = slash.untilde(select)
            var list = _k_.list(items)
            for (idx = 0; idx < list.length; idx++)
            {
                item = list[idx]
                if (slash.samePath(item.path,select))
                {
                    selectIndex = idx
                    break
                }
            }
        }
        this.preview(items[selectIndex])
        this.choices.set(items,'tilde')
        this.choices.state.selectLine(selectIndex)
        this.choices.state.setMainCursor(0,selectIndex)
        this.choices.state.setView([0,0])
        this.show()
        return this.input.grabFocus()
    }

    saveas.prototype["preview"] = function (item)
    {
        this.input.grabFocus()
        if (!this.userNamed && (item != null ? item.type : undefined) === 'file')
        {
            this.input.set(item.file)
            this.input.state.moveCursors('eol')
        }
        if ((item != null ? item.type : undefined) === 'dir' && !item.tilde.endsWith('..'))
        {
            this.brocol.show(item.path)
            this.choices.hoverForSubmenu = true
        }
        else
        {
            this.brocol.hide()
            this.choices.hoverForSubmenu = false
        }
        this.arrange()
        return post.emit('redraw')
    }

    saveas.prototype["onInputChange"] = function (text)
    {
        return this.userNamed = true
    }

    saveas.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'up':
            case 'down':
                this.moveSelection(event.combo)
                return true

            case 'left':
                if (this.input.state.mainCursor()[0] <= 0)
                {
                    this.goToParent()
                    return true
                }
                break
            case 'right':
                if (this.input.state.mainCursor()[0] >= this.input.current().length)
                {
                    this.enterDir()
                    return true
                }
                break
        }

        return saveas.__super__.onKey.call(this,key,event)
    }

    saveas.prototype["enterDir"] = function ()
    {
        var choice

        choice = this.choices.current()
        if (!choice)
        {
            return
        }
        if (choice.type !== 'dir')
        {
            return
        }
        return this.gotoDir(choice.path)
    }

    saveas.prototype["goToParent"] = function ()
    {
        var up

        up = slash.dir(this.currentDir)
        if (_k_.empty(up))
        {
            return
        }
        return this.gotoDir(up,this.currentDir)
    }

    saveas.prototype["targetPath"] = function (name)
    {
        if (slash.isAbsolute(name))
        {
            return name
        }
        return slash.path(this.currentDir,name)
    }

    saveas.prototype["applyChoice"] = function (choice)
    {
        var name, path

        name = this.input.current()
        if (_k_.empty(name))
        {
            return
        }
        path = this.targetPath(name)
        this.hide()
        post.emit('focus','editor')
        return post.emit('file.saveas',path)
    }

    saveas.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                if ((choice != null ? choice.type : undefined) === 'dir')
                {
                    this.enterDir()
                }
                else
                {
                    this.preview(choice)
                }
                return true

        }

        return saveas.__super__.onChoicesAction.call(this,action,choice)
    }

    saveas.prototype["onBrocolAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                return this.onChoicesAction('click',choice)

        }

        return saveas.__super__.onBrocolAction.call(this,action,choice)
    }

    saveas.prototype["draw"] = function ()
    {
        var bg, cc, choice, cry, fg, x, y

        if (this.hidden())
        {
            return
        }
        saveas.__super__.draw.call(this)
        if (this.crumbs.visible())
        {
            cry = this.crumbs.cells.wy(0) - this.cells.y
            this.cells.set(1,cry,' ',null,this.color.bg)
            this.cells.set(this.crumbs.cells.cols + 2,cry,' ',null,this.color.bg)
        }
        if (this.brocol.visible())
        {
            this.brocol.draw()
            bg = this.color.bg
            fg = this.color.frame
            x = this.choices.cells.cols + 2
            if (choice = this.choices.current())
            {
                x = this.choices.cells.cols - 1
                y = this.choices.currentIndex() - this.choices.state.s.view[1]
                cc = (this.choices.hasFocus() ? this.choices.color.hover.bg : this.choices.color.hover.blur)
                this.choices.cells.fill_row(y,choice.tilde.length,x - 1,' ',bg,cc)
                return this.choices.cells.set(x,y,'',cc,bg)
            }
        }
    }

    saveas.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.brocol.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return saveas.__super__.onMouse.call(this,event)
    }

    saveas.prototype["onWheel"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.brocol.onWheel(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return saveas.__super__.onWheel.call(this,event)
    }

    return saveas
})()

export default saveas;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFxQndCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBSVYsS0FBQyxPQUFPO1FBRWQsS0FBQyxZQUFZO1FBRWIsS0FBQyxTQUFTLEtBQVMsTUFBTSxPQUFPO1FBQ2hDLEtBQUMsU0FBUyxRQUFTLE1BQU0sT0FBTztRQUVoQyxLQUFDLGFBQWEsT0FBTyxLQUFDLE9BQU87UUFDN0IsS0FBQyxPQUFPLFNBQVMsS0FBSyxNQUFNLE9BQU8sS0FBQyxNQUFNLEdBQUc7UUFDN0MsS0FBQyxPQUFPLEdBQUcsU0FBVyxLQUFDO1FBRXZCLEtBQUMsUUFBUSxPQUFPLFlBQVk7UUFDNUIsS0FBQyxRQUFRLG1CQUFtQjtRQUU1QixLQUFDLFlBQVk7Ozs7Ozs7UUFPYixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFFdkIsS0FBSztRQUNMLEtBQUs7UUFFTCxjQUFTLEtBQUMsT0FBTyxPQUFLO1FBQ3RCLGFBQVMsTUFBTSxLQUFHLElBQUk7UUFFdEIsTUFBSyxLQUFDLE9BQU8sWUFBWSxJQUFJO1FBQzdCLE1BQUssS0FBQyxPQUFPLFlBQVksYUFBUyxHQUFHLEtBQUMsUUFBUTtRQUU5QyxvQkFBYSxLQUFDLE9BQU8sS0FBSyxZQUFRLFlBQU8sS0FBQyxPQUFPLE9BQUs7UUFDdEQsTUFBSyxLQUFDLE9BQU8sWUFBWSxJQUFFLElBQUk7UUFDL0IsS0FBSyxJQUFFLEtBQUc7UUFFVixhQUFTLE1BQUksSUFBRTtRQUVmLElBQUssS0FBSyxLQUFLLEtBQUs7UUFDcEIsTUFBSyxLQUFDLE9BQU8sWUFBWSxLQUFLO1FBRTlCLEtBQUMsTUFBTSxPQUFVLElBQUUsRUFBTyxJQUFFLEVBQVMsSUFBRSxFQUFJO1FBQzNDLEtBQUMsT0FBTyxPQUFTLElBQUUsRUFBTyxJQUFFLElBQUUsR0FBTyxJQUFFLEVBQUk7UUFDM0MsS0FBQyxRQUFRLE9BQVEsSUFBRSxFQUFPLElBQUUsSUFBRSxLQUFHLEdBQUksR0FBTTtRQUMzQyxLQUFDLE9BQU8sT0FBUyxJQUFFLElBQUUsR0FBSyxJQUFFLElBQUUsS0FBRyxHQUFJLEdBQU07ZUFDM0MsS0FBQyxNQUFNLE9BQVUsRUFBUyxFQUFZLEVBQU07Ozs7O1FBTTVDLEtBQUMsWUFBWTtRQUViLEtBQUMsTUFBTTtjQUVMLEtBQUMsUUFBUTtZQUtSOztZQUNDLEtBQUMsTUFBTSxJQUFJO1lBQ1gsS0FBQyxNQUFNLE1BQU0sWUFBWTs7ZUFFN0IsS0FBQyxNQUFNOzs7Ozs7O3NCQUlzQjs7WUFBN0IsTUFBTSxRQUFROztRQUNkLE1BQU0sTUFBTSxRQUFROzs7WUFHaEIsY0FBUyxRQUFRLE1BQU07O2VBQ3JCOztZQUNGLFlBQUksYUFBYTs7O1FBR3JCLEtBQUMsYUFBYTtRQUNkLEtBQUMsT0FBTyxLQUFLO1FBRWIsVUFBQSxpQkFBQSxVQUFVLE1BQU0sYUFBTixNQUFNLEdBQUk7ZUFFcEIsS0FBQyxjQUFjLE1BQU07Ozs7Ozs7UUFNckIsY0FBYztZQUVYOztZQUNDLFNBQVMsTUFBTSxRQUFRO2dDQUNQOzs7O29CQUNULE1BQU0sU0FBUyxLQUFLLEtBQUs7O29CQUN4QixjQUFjO29CQUNkOzs7O1FBRVosS0FBQyxRQUFRLE1BQU07UUFFZixLQUFDLFFBQVEsSUFBSSxNQUFNO1FBQ25CLEtBQUMsUUFBUSxNQUFNLFdBQVc7UUFDMUIsS0FBQyxRQUFRLE1BQU0sY0FBYyxFQUFFO1FBQy9CLEtBQUMsUUFBUSxNQUFNLFNBQVMsRUFBRTtRQUUxQixLQUFDO2VBRUQsS0FBQyxNQUFNOzs7OztRQVNQLEtBQUMsTUFBTTthQUVBLEtBQUMsY0FBYyxlQUFBLEtBQU0sc0JBQVE7O1lBQ2hDLEtBQUMsTUFBTSxJQUFJLEtBQUs7WUFDaEIsS0FBQyxNQUFNLE1BQU0sWUFBWTs7YUFFMUIsZUFBQSxLQUFNLHNCQUFRLFVBQWMsS0FBSyxNQUFNLFNBQVM7O1lBQy9DLEtBQUMsT0FBTyxLQUFLLEtBQUs7WUFDbEIsS0FBQyxRQUFRLGtCQUFrQjs7OztZQUUzQixLQUFDLE9BQU87WUFDUixLQUFDLFFBQVEsa0JBQWtCOztRQUUvQixLQUFDO2VBQ0QsS0FBSyxLQUFLOzs7OztlQU9WLEtBQUMsWUFBWTs7Ozs7WUFPUCxLQUFDOzs7O2dCQUVBLE1BQU07O2lCQUVUO2lCQUFLO2dCQUNELEtBQUMsY0FBYyxNQUFNO3VCQUNsQjs7aUJBRVA7b0JBQ08sS0FBQyxNQUFNLE1BQU0sYUFBYSxNQUFNOztvQkFDL0IsS0FBQzsyQkFDRTs7O2lCQUVYO29CQUNPLEtBQUMsTUFBTSxNQUFNLGFBQWEsTUFBTSxLQUFDLE1BQU0sVUFBVTs7b0JBQ2hELEtBQUM7MkJBQ0U7Ozs7O2dEQUVULElBQUk7Ozs7Ozs7UUFNVixTQUFTLEtBQUMsUUFBUTthQUVSOzs7O1lBQ0osT0FBTyxTQUFROzs7O2VBRXJCLEtBQUMsUUFBUSxPQUFPOzs7Ozs7O1FBTWhCLEtBQUssTUFBTSxJQUFJLEtBQUM7c0JBRUo7Ozs7ZUFFWixLQUFDLFFBQVEsR0FBRyxLQUFDOzs7OztZQU1WLE1BQU0sV0FBVzs7bUJBQ2I7O2VBRVAsTUFBTSxLQUFLLEtBQUMsV0FBWTs7Ozs7OztRQU14QixPQUFPLEtBQUMsTUFBTTtzQkFFRjs7OztRQUVaLE9BQU8sS0FBQyxXQUFXO1FBRW5CLEtBQUM7UUFFRCxLQUFLLEtBQUssUUFBUTtlQUNsQixLQUFLLEtBQUssY0FBYzs7Ozs7Z0JBTWpCOztpQkFDSDtxQkFDTyxpQkFBQSxPQUFRLHNCQUFROztvQkFDZixLQUFDOzs7O29CQUVELEtBQUMsUUFBUTs7dUJBQ1Y7Ozs7MERBRUwsT0FBTzs7Ozs7Z0JBSU47O2lCQUNIO3VCQUFhLEtBQUMsZ0JBQWdCLFFBQVE7Ozs7eURBRXBDLE9BQU87Ozs7Ozs7WUFJUCxLQUFDOzs7OztZQUlKLEtBQUMsT0FBTzs7WUFFUCxNQUFNLEtBQUMsT0FBTyxNQUFNLEdBQUcsS0FBRyxLQUFDLE1BQU07WUFDakMsS0FBQyxNQUFNLElBQUksRUFBcUIsSUFBSSxJQUFJLEtBQUssS0FBQyxNQUFNO1lBQ3BELEtBQUMsTUFBTSxJQUFJLEtBQUMsT0FBTyxNQUFNLE9BQUssRUFBRSxJQUFJLElBQUksS0FBSyxLQUFDLE1BQU07O1lBRXJELEtBQUMsT0FBTzs7WUFFUCxLQUFDLE9BQU87WUFFUixLQUFLLEtBQUMsTUFBTTtZQUNaLEtBQUssS0FBQyxNQUFNO1lBRVosSUFBSSxLQUFDLFFBQVEsTUFBTSxPQUFLO2dCQUVyQixTQUFTLEtBQUMsUUFBUTs7Z0JBRWpCLElBQUksS0FBQyxRQUFRLE1BQU0sT0FBSztnQkFDeEIsSUFBSSxLQUFDLFFBQVEsaUJBQWUsS0FBQyxRQUFRLE1BQU0sRUFBRSxLQUFLO2dCQUVsRCxNQUFLLEtBQUMsUUFBUSxhQUFhLEtBQUMsUUFBUSxNQUFNLE1BQU0sS0FBSyxLQUFDLFFBQVEsTUFBTSxNQUFNO2dCQUUxRSxLQUFDLFFBQVEsTUFBTSxTQUFhLEVBQUUsT0FBTyxNQUFNLE9BQU8sSUFBRSxFQUFFLElBQUksR0FBRzt1QkFDN0QsS0FBQyxRQUFRLE1BQU0sSUFBYSxFQUFFLEVBQUUsSUFBSSxHQUFHOzs7Ozs7Ozs7WUFLekMsS0FBQzs7OztRQUNQLE1BQU0sS0FBQyxPQUFPLFFBQVE7YUFBbUIsY0FBQSxJQUFLOzttQkFBWjs7a0RBQzVCOzs7Ozs7O1lBSUEsS0FBQzs7OztRQUNQLE1BQU0sS0FBQyxPQUFPLFFBQVE7YUFBa0IsY0FBQSxJQUFLOzttQkFBWjs7a0RBQzNCOzs7Ozs7ZUFHUCJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
