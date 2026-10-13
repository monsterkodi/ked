var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var quicky

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let kutil = kxk.kutil

import nfs from "../../../kxk/nfs.js"

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
        this.crumbs = new crumbs(this.screen,'quicky_crumbs')
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
            var i, p, s, t, w

            t = item.tilde
            p = slash.parse(t)
            w = 0
            w += (t.split('../').length - 1) * 1024 * 4
            var list = _k_.list(slash.split(p.dir))
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

        this.input.set('')
        this.input.hide()
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
                if (choice.path)
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
                if (choice.path)
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
                if (choice.path && choice.type === 'file')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2t5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9xdWlja3kua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQk8sS0FBSyxLQUFLLGdCQUFnQixLQUFLLEVBQUUsS0FBSSxFQUFFLE9BQU87Ozs7dUJBRTdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FJVixLQUFDLE9BQU8sS0FBQyxNQUFNLFVBQVU7UUFFL0IsS0FBQyxhQUFhLE9BQVEsS0FBQyxPQUFPO1FBRTlCLEtBQUMsT0FBTyxVQUFVO1FBQ2xCLEtBQUMsT0FBTyxTQUFTLFFBQVEsS0FBQyxNQUFNO1FBRWhDLEtBQUMsUUFBUSxNQUFNLE9BQU8sUUFBUTtRQUM5QixLQUFDLFFBQVEsR0FBRyxTQUFTLEtBQUM7UUFFdEIsS0FBQyxRQUFRLE9BQU8sWUFBWTtRQUM1QixLQUFDLFFBQVEsbUJBQW1CO1FBRTVCLEtBQUMsT0FBTyxHQUFHLFNBQVMsS0FBQztZQUVnQixLQUFDLFNBQVE7O1lBQTlDLEtBQUssR0FBRyxlQUFlLEtBQUM7Ozs7Ozs7O1FBVXhCLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsZUFBVSxLQUFDLE9BQU8sT0FBSztRQUV2QixNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsY0FBUyxLQUFDLE9BQU8sT0FBSztRQUN0QixhQUFTLE1BQU0sS0FBRyxJQUFJO1FBRXRCLE1BQUssS0FBQyxPQUFPLFlBQVksSUFBSTtRQUM3QixNQUFLLEtBQUMsT0FBTyxZQUFZLGFBQVMsR0FBRyxLQUFDLFFBQVE7UUFDOUMsSUFBSyxLQUFLLEtBQUssS0FBSztRQUVwQixLQUFLLEtBQUM7UUFDTixJQUFLLEtBQUc7UUFDUixhQUFTLE1BQUksSUFBRTtRQUVmLEtBQUMsTUFBTSxPQUFVLElBQUUsRUFBTyxJQUFFLEVBQVMsSUFBRSxFQUFJO1FBQzNDLEtBQUMsT0FBTyxPQUFTLElB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
//# sourceURL=kode/ked/view/colmns/quicky.kode
