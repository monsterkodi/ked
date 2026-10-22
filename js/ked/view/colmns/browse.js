var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var browse

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs

import fileutil from "../../util/fileutil.js"

import belt from "../../edit/tool/belt.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import quicky from "./quicky.js"
import brocol from "./brocol.js"
import diritem from "./diritem.js"
import dirlist from "./dirlist.js"

import rgxs from './quicky.json' with { type : "json" }

browse = (function ()
{
    _k_.extend(browse, quicky)
    function browse (screen, name = 'browse')
    {
        this.screen = screen
        this.name = name
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onBrocolAction"] = this["onBrocolAction"].bind(this)
        this["choicesFiltered"] = this["choicesFiltered"].bind(this)
        this["applyChoice"] = this["applyChoice"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["preview"] = this["preview"].bind(this)
        this["gotoDirOrOpenFile"] = this["gotoDirOrOpenFile"].bind(this)
        this["gotoDir"] = this["gotoDir"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        browse.__super__.constructor.call(this,this.screen,this.name)
        this.isVisible = false
        this.setColor('bg',theme.quicky.bg)
        this.setColor('frame',theme.quicky.frame)
        this.brocol = new brocol(this.screen,`${this.name}_brocol`)
        this.brocol.setColor('bg',color.darken(this.color.bg,0.7))
        this.brocol.on('action',this.onBrocolAction)
        this.choices.mapscr.rowOffset = 1
        this.choices.frontRoundOffset = 2
        if (this.name === 'browse')
        {
            post.on('browse.dir',this.gotoDir)
        }
    }

    browse.prototype["arrange"] = function ()
    {
        var bw, ch, cr, cw, fh, h, hs, ih, iz, scx, scy, w, x, y

        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
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

    browse.prototype["draw"] = function ()
    {
        var bg, cc, choice, cry, fg, x, y

        if (this.hidden())
        {
            return
        }
        browse.__super__.draw.call(this)
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

    browse.prototype["gotoDir"] = async function (dir, select)
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
        this.crumbs.show(this.currentDir)
        select = (select != null ? select : (items[1] != null ? items[1].path : undefined))
        return this.showPathItems(items,select)
    }

    browse.prototype["gotoDirOrOpenFile"] = async function (path)
    {
        var isDir, isFile

        isDir = await nfs.dirExists(path)
        if (isDir)
        {
            return await this.gotoDir(path)
        }
        else
        {
            isFile = await nfs.fileExists(path)
            if (isFile)
            {
                return this.openFileInEditor(path)
            }
        }
    }

    browse.prototype["preview"] = async function (item)
    {
        var segls, text

        if (_k_.empty((item != null ? item.path : undefined)))
        {
            return this.hideMap()
        }
        if (item.type === 'file')
        {
            this.brocol.hide()
            if (_k_.in(slash.ext(item.path),fileutil.sourceFileExtensions))
            {
                text = await nfs.read(item.path)
                if (this.brocol.visible())
                {
                    return
                }
                segls = belt.seglsForText(text)
                this.choices.mapscr.setSyntaxSegls(slash.ext(item.path),segls)
                this.choices.mapscr.show()
            }
            else
            {
                this.hideMap()
            }
        }
        else
        {
            this.hideMap()
            if (!item.tilde.endsWith('..'))
            {
                this.brocol.show(item.path)
                this.choices.hoverForSubmenu = true
            }
            else
            {
                this.brocol.hide()
                this.choices.hoverForSubmenu = false
            }
        }
        this.arrange()
        return post.emit('redraw')
    }

    browse.prototype["onMouse"] = function (event)
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
        return browse.__super__.onMouse.call(this,event)
    }

    browse.prototype["onWheel"] = function (event)
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
        return browse.__super__.onWheel.call(this,event)
    }

    browse.prototype["applyChoice"] = function (choice)
    {
        switch (this.input.current())
        {
            case '/':
                return this.gotoDir('/')

            case '~':
                return this.gotoDir('~')

            case '.':
                return this.gotoDir(this.currentDir)

            case '..':
                return this.gotoDir(slash.dir(this.currentDir))

        }

        if (_k_.empty(choice) && !_k_.empty(this.input.current()))
        {
            this.gotoDirOrOpenFile(this.input.current())
            return {redraw:true}
        }
        if (_k_.empty(choice))
        {
            return {redraw:false}
        }
        if (_k_.empty(choice.path))
        {
            return {redraw:false}
        }
        this.gotoDirOrOpenFile(choice.path)
        return {redraw:true}
    }

    browse.prototype["choicesFiltered"] = function ()
    {
        return this.preview(this.choices.current())
    }

    browse.prototype["onBrocolAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                return this.applyChoice(choice)

        }

    }

    browse.prototype["onChoicesAction"] = function (action, choice)
    {
        var upDir, _262_58_

        console.log('--- onChoicesAction',action,choice,this.currentDir)
        switch (action)
        {
            case 'right':
                if ((choice != null ? choice.path : undefined))
                {
                    if (choice.tilde === ' ..')
                    {
                        return this.moveSelection('down')
                    }
                    if (choice.type === 'file')
                    {
                        return post.emit('quicky',choice.path)
                    }
                    else
                    {
                        this.hideMap()
                        return this.gotoDirOrOpenFile(((_262_58_=choice.link) != null ? _262_58_ : choice.path))
                    }
                }
                break
            case 'left':
            case 'delete':
                if ((choice != null ? choice.path : undefined))
                {
                    upDir = slash.dir(this.currentDir)
                    if (_k_.empty(upDir))
                    {
                        return
                    }
                    this.hideMap()
                    return this.gotoDir(upDir,this.currentDir)
                }
                break
            case 'space':
                if ((choice != null ? choice.path : undefined) && choice.type === 'file')
                {
                    return post.emit('quicky',choice.path)
                }
                break
        }

        return browse.__super__.onChoicesAction.call(this,action,choice)
    }

    return browse
})()

export default browse;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9icm93c2Uua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FjTyxLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7QUFFNUMsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBRU8sS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFlBQVk7UUFFYixLQUFDLFNBQVMsS0FBUyxNQUFNLE9BQU87UUFDaEMsS0FBQyxTQUFTLFFBQVMsTUFBTSxPQUFPO1FBRWhDLEtBQUMsYUFBYSxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBQ2pDLEtBQUMsT0FBTyxTQUFTLEtBQUssTUFBTSxPQUFPLEtBQUMsTUFBTSxHQUFHO1FBQzdDLEtBQUMsT0FBTyxHQUFHLFNBQVcsS0FBQztRQUV2QixLQUFDLFFBQVEsT0FBTyxZQUFZO1FBQzVCLEtBQUMsUUFBUSxtQkFBbUI7WUFFekIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxhQUFhLEtBQUM7Ozs7c0JBUTlCOzs7O1FBRUksZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBRXZCLE1BQUssS0FBQyxrQkFBa0IsSUFBSTtRQUM1QixhQUFTLEVBQUUsS0FBSztRQUVoQixjQUFTLEtBQUMsT0FBTyxPQUFLO1FBQ3RCLGFBQVMsTUFBTSxLQUFHLElBQUk7UUFFdEIsTUFBSyxLQUFDLE9BQU8sWUFBWSxJQUFJO1FBQzdCLE1BQUssS0FBQyxPQUFPLFlBQVksYUFBUyxHQUFHLEtBQUMsUUFBUTtRQUU5QyxvQkFBYSxLQUFDLE9BQU8sS0FBSyxZQUFRLFlBQU8sS0FBQyxPQUFPLE9BQUs7UUFDdEQsTUFBSyxLQUFDLE9BQU8sWUFBWSxJQUFFLElBQUk7UUFDL0IsS0FBSyxJQUFFLEtBQUc7UUFFVixhQUFTLE1BQUksSUFBRTtRQUVm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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/browse.kode
