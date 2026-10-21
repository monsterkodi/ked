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
        console.log(`${this.name}.arrange`,this.inputIsActive())
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9icm93c2Uua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FjTyxLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7Ozt1QkFFN0I7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUlWLEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxZQUFZO1FBRWIsS0FBQyxTQUFTLEtBQVMsTUFBTSxPQUFPO1FBQ2hDLEtBQUMsU0FBUyxRQUFTLE1BQU0sT0FBTztRQUVoQyxLQUFDLGFBQWEsT0FBTyxLQUFDLFVBQVUsS0FBQztRQUNqQyxLQUFDLE9BQU8sU0FBUyxLQUFLLE1BQU0sT0FBTyxLQUFDLE1BQU0sR0FBRztRQUM3QyxLQUFDLE9BQU8sR0FBRyxTQUFXLEtBQUM7UUFFdkIsS0FBQyxRQUFRLE9BQU8sWUFBWTtRQUM1QixLQUFDLFFBQVEsbUJBQW1CO1lBRXpCLEtBQUMsU0FBUTs7WUFDUixLQUFLLEdBQUcsYUFBYSxLQUFDOzs7Ozs7OztRQVUxQixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsZUFBTyxLQUFDLGVBQWUsS0FBQztRQUN4QixNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsY0FBUyxLQUFDLE9BQU8sT0FBSztRQUN0QixhQUFTLE1BQU0sS0FBRyxJQUFJO1FBRXRCLE1BQUssS0FBQyxPQUFPLFlBQVksSUFBSTtRQUM3QixNQUFLLEtBQUMsT0FBTyxZQUFZLGFBQVMsR0FBRyxLQUFDLFFBQVE7UUFFOUMsb0JBQWEsS0FBQyxPQUFPLEtBQUssWUFBUSxZQUFPLEtBQUMsT0FBTyxPQUFLO1FBQ3RELE1BQUssS0FBQyxPQUFPLFlBQVksSUFBRSxJQUFJO1FBQy9CLEtBQUssSUFBRSxLQUFHO1FBRVYsYUFBUyxNQUFJLElBQUU7UUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/browse.kode
