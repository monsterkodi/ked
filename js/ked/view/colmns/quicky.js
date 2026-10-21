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

    quicky.prototype["showProjectFiles"] = function (currentFile)
    {
        this.currentFile = currentFile
    
        var items, prjDir, weight

        items = prjcts.files(this.currentFile)
        prjDir = prjcts.dir(this.currentFile)
        items = items.concat(ked_session.recentFiles().slice(0, 10))
        if (_k_.empty(items))
        {
            return this.gotoDir(process.cwd())
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
        var segls, text

        if (_k_.empty((item != null ? item.path : undefined)))
        {
            return this.hideMap()
        }
        if (item.type === 'file' && _k_.in(slash.ext(item.path),fileutil.sourceFileExtensions))
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
        console.log(`${this.name} browseDir ${dir}`)
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
        var upDir, _329_58_

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
                        return this.gotoDirOrOpenFile(((_329_58_=choice.link) != null ? _329_58_ : choice.path))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2t5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9xdWlja3kua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWlCTyxLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7Ozt1QkFFN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUlWLEtBQUMsT0FBTyxLQUFDLE1BQU0sVUFBVTtRQUUvQixLQUFDLGFBQWEsT0FBUSxLQUFDLFVBQVUsS0FBQztRQUVsQyxLQUFDLE9BQU8sVUFBVTtRQUNsQixLQUFDLE9BQU8sU0FBUyxRQUFRLEtBQUMsTUFBTTtRQUVoQyxLQUFDLFFBQVEsTUFBTSxPQUFPLFFBQVE7UUFDOUIsS0FBQyxRQUFRLEdBQUcsU0FBUyxLQUFDO1FBRXRCLEtBQUMsUUFBUSxPQUFPLFlBQVk7UUFDNUIsS0FBQyxRQUFRLG1CQUFtQjtRQUU1QixLQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUM7WUFFZ0IsS0FBQyxTQUFROztZQUE5QyxLQUFLLEdBQUcsZUFBZSxLQUFDOzs7Ozs7OztRQVV4QixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBQ3ZCLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFFdkIsTUFBSyxLQUFDLGtCQUFrQixJQUFJO1FBQzVCLGFBQVMsRUFBRSxLQUFLO1FBRWhCLGNBQVMsS0FBQyxPQUFPLE9BQUs7UUFDdEIsYUFBUyxNQUFNLEtBQUcsSUFBSTtRQUV0QixNQUFLLEtBQUMsT0FBTyxZQUFZLElBQUk7UUFDN0IsTUFBSyxLQUFDLE9BQU8sWUFBWSxhQUFTLEdBQUcsS0FBQyxRQUFRO1FBQzlDLElBQUssS0FBSyxLQUFLLEtBQUs7UUFFcEIsS0FBSyxLQUFDO1FBQ04sSUFBSyxLQUFHO1FBQ1IsYUFBUyxNQUFJLElBQUU7UUFFZixLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQU8sSUFBRSxFQUFTLElBQUUsRUFBSTtRQUMzQyxLQUFDLE9BQU8sT0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/quicky.kode
