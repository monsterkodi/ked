var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var saveas

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQWV3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUlWLEtBQUMsT0FBTztRQUVkLEtBQUMsWUFBWTtRQUViLEtBQUMsU0FBUyxLQUFTLE1BQU0sT0FBTztRQUNoQyxLQUFDLFNBQVMsUUFBUyxNQUFNLE9BQU87UUFFaEMsS0FBQyxhQUFhLE9BQU8sS0FBQyxPQUFPO1FBQzdCLEtBQUMsT0FBTyxTQUFTLEtBQUssTUFBTSxPQUFPLEtBQUMsTUFBTSxHQUFHO1FBQzdDLEtBQUMsT0FBTyxHQUFHLFNBQVcsS0FBQztRQUV2QixLQUFDLFFBQVEsT0FBTyxZQUFZO1FBQzVCLEtBQUMsUUFBUSxtQkFBbUI7UUFFNUIsS0FBQyxZQUFZOzs7Ozs7O1FBT2IsZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBRXZCLEtBQUs7UUFDTCxLQUFLO1FBRUwsY0FBUyxLQUFDLE9BQU8sT0FBSztRQUN0QixhQUFTLE1BQU0sS0FBRyxJQUFJO1FBRXRCLE1BQUssS0FBQyxPQUFPLFlBQVksSUFBSTtRQUM3QixNQUFLLEtBQUMsT0FBTyxZQUFZLGFBQVMsR0FBRyxLQUFDLFFBQVE7UUFFOUMsb0JBQWEsS0FBQyxPQUFPLEtBQUssWUFBUSxZQUFPLEtBQUMsT0FBTyxPQUFLO1FBQ3RELE1BQUssS0FBQyxPQUFPLFlBQVksSUFBRSxJQUFJO1FBQy9CLEtBQUssSUFBRSxLQUFHO1FBRVYsYUFBUyxNQUFJLElBQUU7UUFFZixJQUFLLEtBQUssS0FBSyxLQUFLO1FBQ3BCLE1BQUssS0FBQyxPQUFPLFlBQVksS0FBSztRQUU5QixLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQU8sSUFBRSxFQUFTLElBQUUsRUFBSTtRQUMzQyxLQUFDLE9BQU8sT0FBUyxJQUFFLEVBQU8sSUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
