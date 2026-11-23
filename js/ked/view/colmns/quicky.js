var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var quicky

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let kutil = kxk.kutil
let nfs = kxk.nfs

import prjcts from "../../index/prjcts.js"

import fileutil from "../../util/fileutil.js"
import frecent from "../../util/frecent.js"
import config from "../../util/config.js"

import belt from "../../edit/tool/belt.js"

import icons from "../../theme/icons.js"

import crumbs from "../base/crumbs.js"

import inputchoice from "../menu/inputchoice.js"

import diritem from "./diritem.js"

import rgxs from './quicky.json' with { type : "json" }

quicky = (function ()
{
    _k_.extend(quicky, inputchoice)
    function quicky (screen, name = 'quicky')
    {
        this.screen = screen
        this.name = name
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        this["applyChoice"] = this["applyChoice"].bind(this)
        this["hideMap"] = this["hideMap"].bind(this)
        this["browseDir"] = this["browseDir"].bind(this)
        this["preview"] = this["preview"].bind(this)
        this["choicesFiltered"] = this["choicesFiltered"].bind(this)
        this["moveSelection"] = this["moveSelection"].bind(this)
        this["openFileInEditor"] = this["openFileInEditor"].bind(this)
        this["showPathItems"] = this["showPathItems"].bind(this)
        this["calcWidthAndShowPathItems"] = this["calcWidthAndShowPathItems"].bind(this)
        this["showProjectFiles"] = this["showProjectFiles"].bind(this)
        this["gotoDirOrOpenFile"] = this["gotoDirOrOpenFile"].bind(this)
        this["showRecentFiles"] = this["showRecentFiles"].bind(this)
        this["showFiles"] = this["showFiles"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        quicky.__super__.constructor.call(this,this.screen,this.name,['mapview','scroll'])
        this.crumbs = new crumbs(this.screen,`${this.name}_crumbs`)
        this.crumbs.padLast = true
        this.crumbs.setColor('empty',this.color.bg)
        this.choices.state.syntax.setRgxs(rgxs)
        this.choices.on('select',this.preview)
        this.choices.mapscr.rowOffset = 0
        this.choices.frontRoundOffset = 0
        this.crumbs.on('action',this.onCrumbsAction)
        if (this.name === 'quicky')
        {
            post.on('quicky.files',this.showFiles)
        }
    }

    quicky.prototype["arrange"] = function ()
    {
        var ch, cr, cw, h, hs, ih, iz, scx, scy, w, x, y

        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        hs = parseInt(this.screen.rows / 2)
        y = parseInt(scy - hs / 2 - ih)
        cr = (this.crumbs.visible() ? 1 : 0)
        ch = (this.crumbs.visible() ? hs : _k_.min(hs,this.choices.numFiltered()))
        h = ch + ih + cr + 2
        cw = this.choicesWidth
        w = cw + 2
        x = parseInt(scx - w / 2)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.crumbs.layout(x + 2,y + 1 + ih,w - 4,cr)
        this.choices.layout(x + 1,y + 1 + ih + cr,cw,ch)
        return this.cells.layout(x,y,w,h)
    }

    quicky.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
        this.erase()
        this.drawFrame()
        this.crumbs.draw()
        return this.drawChoices()
    }

    quicky.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.crumbs.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = quicky.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return this.hover
    }

    quicky.prototype["showFiles"] = function (files)
    {
        var item, items

        items = files.map(function (path)
        {
            return {path:path,type:'file'}
        })
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = ' ' + diritem.symbolName(item)
        }
        this.crumbs.hide()
        return this.calcWidthAndShowPathItems(items)
    }

    quicky.prototype["showRecentFiles"] = function ()
    {
        return this.showFiles(frecent.list('file'))
    }

    quicky.prototype["gotoDirOrOpenFile"] = function ()
    {}

    quicky.prototype["showProjectFiles"] = function (currentFile)
    {
        this.currentFile = currentFile
    
        var items, prjDir, weight

        items = prjcts.files(this.currentFile)
        prjDir = prjcts.dir(this.currentFile)
        items = items.concat(ked_session.recentFiles().slice(0, 10))
        if (_k_.empty(items))
        {
            return this.gotoDirOrOpenFile(process.cwd())
        }
        items = kutil.uniq(items)
        this.currentDir = slash.dir(this.currentFile)
        if (_k_.empty(this.currentDir))
        {
            this.currentDir = process.cwd()
        }
        this.crumbs.hide()
        this.choices.mapscr.rowOffset = 0
        weight = (function (item)
        {
            var i, p, r, s, t, w

            t = item.tilde
            p = slash.parse(t)
            r = slash.relative(item.path,this.currentFile)
            w = 0
            w += (r.split('../').length - 1) * 1024 * 4
            var list = _k_.list(slash.split(slash.dir(item.path)))
            for (i = 0; i < list.length; i++)
            {
                s = list[i]
                w += kstr.weight(s) / ((i + 1) * (i + 1))
            }
            return w
        }).bind(this)
        items = items.map((function (path)
        {
            var item, prs, rel

            rel = slash.relative(path,prjDir)
            if (slash.isAbsolute(rel))
            {
                prs = slash.parse(rel)
                rel = slash.join(slash.split(prs.dir).slice(-2),prs.file)
            }
            item = {type:'file',path:path}
            item.tilde = ' ' + diritem.symbolName(item)
            return item
        }).bind(this))
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        return this.calcWidthAndShowPathItems(items)
    }

    quicky.prototype["calcWidthAndShowPathItems"] = function (items)
    {
        var lines

        lines = items.map(function (i)
        {
            return i.tilde
        })
        this.choicesWidth = _k_.min(parseInt(this.screen.rows * 1.2),16 + belt.widthOfLines(lines))
        return this.showPathItems(items)
    }

    quicky.prototype["showPathItems"] = function (items, select)
    {
        var idx, item, selectIndex

        if (this.autoHideInput)
        {
            this.input.set('')
            this.input.hide()
        }
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
        return this.choices.grabFocus()
    }

    quicky.prototype["openFileInEditor"] = function (file)
    {
        this.hide()
        post.emit('quicky',file)
        post.emit('focus','editor')
        return {redraw:true}
    }

    quicky.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'down':
                if (!this.choices.hasNext())
                {
                    return
                }
                break
            case 'up':
                if (!this.choices.hasPrev())
                {
                    return
                }
                break
        }

        this.hideMap()
        return this.choices.moveSelection(dir)
    }

    quicky.prototype["choicesFiltered"] = function ()
    {
        return this.preview(this.choices.current())
    }

    quicky.prototype["preview"] = async function (item)
    {
        var ext, segls, text

        if (_k_.empty((item != null ? item.path : undefined)))
        {
            return this.hideMap()
        }
        ext = config.data.filetypes[slash.file(item.path)]
        ext = (ext != null ? ext : slash.ext(item.path))
        if (item.type === 'file' && _k_.in(ext,config.data.sourceFileExtensions))
        {
            text = await nfs.read(item.path)
            segls = belt.seglsForText(text)
            this.choices.mapscr.show()
            this.choices.mapscr.setSyntaxSegls(slash.ext(item.path),segls)
        }
        else
        {
            this.hideMap()
        }
        return post.emit('redraw')
    }

    quicky.prototype["browseDir"] = async function (dir, select)
    {
        post.emit('browse.dir',dir)
        return this.hide()
    }

    quicky.prototype["hideMap"] = function ()
    {
        return this.choices.mapscr.hide()
    }

    quicky.prototype["applyChoice"] = function (choice)
    {
        switch (this.input.current())
        {
            case '/':
                return this.browseDir('/')

            case '~':
                return this.browseDir('~')

            case '.':
                return this.browseDir(this.currentDir)

            case '..':
                return this.browseDir(slash.dir(this.currentDir))

        }

        if (_k_.empty(choice))
        {
            return {redraw:false}
        }
        if (choice.type === 'dir')
        {
            this.browseDir(choice.path)
        }
        else
        {
            this.openFileInEditor(choice.path)
        }
        return {redraw:true}
    }

    quicky.prototype["onCrumbsAction"] = function (action, path)
    {
        switch (action)
        {
            case 'click':
                return this.applyChoice({tilde:path,path:slash.untilde(path)})

        }

    }

    quicky.prototype["onInputAction"] = function (action, text)
    {
        return quicky.__super__.onInputAction.call(this,action,text)
    }

    quicky.prototype["onChoicesAction"] = function (action, choice)
    {
        var upDir, _254_57_

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
                        return this.gotoDirOrOpenFile(((_254_57_=choice.link) != null ? _254_57_ : choice.path))
                    }
                }
                break
            case 'left':
                if (this.choices.currentIndex() === 0)
                {
                    if (this.input.visible())
                    {
                        this.input.grabFocus()
                    }
                }
                else
                {
                    this.choices.select(0)
                }
                return

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

        return quicky.__super__.onChoicesAction.call(this,action,choice)
    }

    return quicky
})()

export default quicky;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2t5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9xdWlja3kua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSztJQUFNOztPQUN0QixhQUFYOztPQUNXLGVBQVg7T0FBb0IsY0FBcEI7T0FBNEIsYUFBNUI7O09BQ1csV0FBUDs7T0FDTyxZQUFaOztPQUNZLGFBQWY7O09BQ2Usa0JBQWY7O09BQ2UsY0FBQTs7T0FFZixLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7QUFFcEQsVUFBRDs7dUJBQVE7YUFFSixRQUFJLFFBQVE7O1FBQVQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUVELEtBQUMsT0FBTyxLQUFDLE1BQU0sVUFBVTtRQUUvQixLQUFDLGFBQWEsT0FBUSxLQUFDLFVBQVUsS0FBQztRQUVsQyxLQUFDLE9BQU8sVUFBVTtRQUNsQixLQUFDLE9BQU8sU0FBUyxRQUFRLEtBQUMsTUFBTTtRQUVoQyxLQUFDLFFBQVEsTUFBTSxPQUFPLFFBQVE7UUFDOUIsS0FBQyxRQUFRLEdBQUcsU0FBUyxLQUFDO1FBRXRCLEtBQUMsUUFBUSxPQUFPLFlBQVk7UUFDNUIsS0FBQyxRQUFRLG1CQUFtQjtRQUU1QixLQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUM7WUFFZ0IsS0FBQyxTQUFROztZQUE5QyxLQUFLLEdBQUcsZUFBZSxLQUFDOzs7O3NCQUU1Qjs7OztRQUVJLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsZUFBVSxLQUFDLE9BQU8sT0FBSztRQUV2QixNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsY0FBUyxLQUFDLE9BQU8sT0FBSztRQUN0QixhQUFTLE1BQU0sS0FBRyxJQUFJO1FBRXRCLE1BQUssS0FBQyxPQUFPLFlBQVksSUFBSTtRQUM3QixNQUFLLEtBQUMsT0FBTyxZQUFZLGFBQVMsR0FBRyxL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
//# sourceURL=../../../../kode/ked/view/colmns/quicky.kode
