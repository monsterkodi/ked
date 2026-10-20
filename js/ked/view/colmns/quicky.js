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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2t5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9xdWlja3kua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQk8sS0FBSyxLQUFLLGdCQUFnQixLQUFLLEVBQUUsS0FBSSxFQUFFLE9BQU87Ozs7dUJBRTdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FJVixLQUFDLE9BQU8sS0FBQyxNQUFNLFVBQVU7UUFFL0IsS0FBQyxhQUFhLE9BQVEsS0FBQyxPQUFPO1FBRTlCLEtBQUMsT0FBTyxVQUFVO1FBQ2xCLEtBQUMsT0FBTyxTQUFTLFFBQVEsS0FBQyxNQUFNO1FBRWhDLEtBQUMsUUFBUSxNQUFNLE9BQU8sUUFBUTtRQUM5QixLQUFDLFFBQVEsR0FBRyxTQUFTLEtBQUM7UUFFdEIsS0FBQyxRQUFRLE9BQU8sWUFBWTtRQUM1QixLQUFDLFFBQVEsbUJBQW1CO1FBRTVCLEtBQUMsT0FBTyxHQUFHLFNBQVMsS0FBQztZQUVnQixLQUFDLFNBQVE7O1lBQTlDLEtBQUssR0FBRyxlQUFlLEtBQUM7Ozs7Ozs7O1FBVXhCLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsZUFBVSxLQUFDLE9BQU8sT0FBSztRQUV2QixNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsY0FBUyxLQUFDLE9BQU8sT0FBSztRQUN0QixhQUFTLE1BQU0sS0FBRyxJQUFJO1FBRXRCLE1BQUssS0FBQyxPQUFPLFlBQVksSUFBSTtRQUM3QixNQUFLLEtBQUMsT0FBTyxZQUFZLGFBQVMsR0FBRyxLQUFDLFFBQVE7UUFDOUMsSUFBSyxLQUFLLEtBQUssS0FBSztRQUVwQixLQUFLLEtBQUM7UUFDTixJQUFLLEtBQUc7UUFDUixhQUFTLE1BQUksSUFBRTtRQUVmLEtBQUMsTUFBTSxPQUFVLElBQUUsRUFBTyxJQUFFLEVBQVMsSUFBRSxFQUFJO1FBQzNDLEtBQUMsT0FBTyxPQUFTLElBQUUsRUFBTyxJQUFFLElBQUUsR0FBTyxJQUFFLEVBQUk7UUFDM0MsS0FBQyxRQUFRLE9BQVEsSUFBRSxFQUFPLElBQUUsSUFBRSxLQUFHLEdBQUksR0FBTTtlQUMzQyxLQUFDLE1BQU0sT0FBVSxFQUFTLEVBQVcsRUFBTTs7Ozs7WUFVckMsS0FBQzs7OztRQUVQLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxPQUFPO2VBQ1IsS0FBQzs7Ozs7OztZQVVLLEtBQUM7Ozs7UUFDUCxNQUFNLEtBQUMsT0FBTyxRQUFRO2FBQWtCLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ2pDLHlDQUFZO2FBQTRCLGNBQUEsSUFBSzs7bUJBQVo7O2VBQ2pDLEtBQUM7Ozs7Ozs7UUFVRCxRQUFRLE1BQU07O29CQUFjLEtBQUssS0FBSyxLQUFLOzs0QkFDL0I7Ozs7WUFDUixLQUFLLFFBQVEsTUFBTSxRQUFRLFdBQVc7O1FBQzFDLEtBQUMsT0FBTztlQUNSLEtBQUMsMEJBQTBCOzs7Ozs7Ozs7UUFVM0IsUUFBUyxPQUFPLE1BQU0sS0FBQztRQUN2QixTQUFTLE9BQU8sSUFBSSxLQUFDO1FBRXJCLFFBQVEsTUFBTSxPQUFPLFlBQVksb0JBQWM7c0JBRVo7O21CQUFoQyxLQUFDLFFBQVEsUUFBUTs7UUFFcEIsUUFBUSxNQUFNLEtBQUs7UUFFbkIsS0FBQyxhQUFhLE1BQU0sSUFBSSxLQUFDO3NCQUVZLEtBQUM7O1lBQXRDLEtBQUMsYUFBYSxRQUFROztRQUV0QixLQUFDLE9BQU87UUFDUixLQUFDLFFBQVEsT0FBTyxZQUFZO1FBRTVCOzs7O1lBRUksSUFBSSxLQUFLO1lBQ1QsSUFBSSxNQUFNLE1BQU07WUFDaEIsSUFBSSxNQUFNLFNBQVMsS0FBSyxLQUFLLEtBQUM7WUFDOUIsSUFBSTtZQUNKLE1BQU0sRUFBRSxNQUFNLE9BQU8sU0FBTyxLQUFLLE9BQU87Z0NBQzdCLE1BQU0sTUFBTSxNQUFNLElBQUksS0FBSzs7OztnQkFDbEMsS0FBSyxLQUFLLE9BQU8sT0FBTyxJQUFFLE1BQUksSUFBRTs7bUJBQ3BDOztRQUVKLFFBQVEsTUFBTTs7OztZQUVWLE1BQU0sTUFBTSxTQUFTLEtBQUs7Z0JBQ3ZCLE1BQU0sV0FBVzs7Z0JBQ2hCLE1BQU0sTUFBTSxNQUFNO2dCQUNsQixNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sSUFBSSxXQUFLLElBQU0sSUFBSTs7WUFFcEQsUUFBTyxLQUFLLE9BQU8sS0FBSztZQUN4QixLQUFLLFFBQVEsTUFBTSxRQUFRLFdBQVc7bUJBQ3RDOztRQUVKLE1BQU07O21CQUFjLE9BQU8sS0FBSyxPQUFPOztlQUV2QyxLQUFDLDBCQUEwQjs7Ozs7OztRQUkzQixRQUFRLE1BQU07O21CQUFXLEVBQUU7O1FBRTNCLEtBQUMsZ0NBQXVCLEtBQUMsT0FBTyxPQUFLLEtBQUssS0FBRyxLQUFLLGFBQWE7ZUFFL0QsS0FBQyxjQUFjOzs7Ozs7O1FBVWYsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07UUFFUCxjQUFjO1lBRVg7O1lBQ0MsU0FBUyxNQUFNLFFBQVE7Z0NBQ1A7Ozs7b0JBQ1QsTUFBTSxTQUFTLEtBQUssS0FBSzs7b0JBQ3hCLGNBQWM7b0JBQ2Q7Ozs7UUFFWixLQUFDLFFBQVEsTUFBTTtRQUVmLEtBQUMsUUFBUSxJQUFJLE1BQU07UUFFbkIsS0FBQyxRQUFRLE1BQU0sV0FBVztRQUMxQixLQUFDLFFBQVEsTUFBTSxjQUFjLEVBQUU7UUFDL0IsS0FBQyxRQUFRLE1BQU0sU0FBUyxFQUFFO1FBRTFCLEtBQUM7ZUFDRCxLQUFDLFFBQVE7Ozs7O1FBVVQsS0FBQztRQUNELEtBQUssS0FBSyxTQUFTO1FBQ25CLEtBQUssS0FBSyxRQUFRO2dCQUNsQixPQUFPOzs7OztnQkFVQTs7aUJBQ0g7cUJBQW1CLEtBQUMsUUFBUTs7Ozs7aUJBQzVCO3FCQUFtQixLQUFDLFFBQVE7Ozs7Ozs7UUFFaEMsS0FBQztlQUVELEtBQUMsUUFBUSxjQUFjOzs7OztlQVV2QixLQUFDLFFBQVEsS0FBQyxRQUFROzs7Ozs7O3VCQUlLLGVBQUEsS0FBTTs7bUJBQTFCLEtBQUM7O1lBRUQsS0FBSyxTQUFRLGlCQUFXLE1BQU0sSUFBSSxLQUFLLE1BQVMsU0FBUzs7WUFDeEQsYUFBUSxJQUFJLEtBQUssS0FBSztZQUN0QixRQUFRLEtBQUssYUFBYTtZQUMxQixLQUFDLFFBQVEsT0FBTztZQUNoQixLQUFDLFFBQVEsT0FBTyxlQUFlLE1BQU0sSUFBSSxLQUFLLE1BQU07Ozs7WUFFcEQsS0FBQzs7ZUFFTCxLQUFLLEtBQUs7Ozs7O1FBVVYsZUFBTyxLQUFDLGtCQUFrQjtRQUMxQixLQUFLLEtBQUssYUFBYTtlQUN2QixLQUFDOzs7OztlQUlELEtBQUMsUUFBUSxPQUFPOzs7OztnQkFVVCxLQUFDLE1BQU07O2lCQUVWO3VCQUFVLEtBQUMsVUFBVTs7aUJBQ3JCO3VCQUFVLEtBQUMsVUFBVTs7aUJBQ3JCO3VCQUFVLEtBQUMsVUFBVSxLQUFDOztpQkFDdEI7dUJBQVUsS0FBQyxVQUFVLE1BQU0sSUFBSSxLQUFDOzs7O3NCQU0zQjs7b0JBQWlCLE9BQU87O1lBRzlCLE9BQU8sU0FBUTs7WUFDZCxLQUFDLFVBQVUsT0FBTzs7OztZQUVsQixLQUFDLGlCQUFpQixPQUFPOztnQkFDN0IsT0FBTzs7Ozs7Z0JBVUE7O2lCQUVIO3VCQUFhLEtBQUMsYUFBWSxNQUFNLEtBQUssS0FBSyxNQUFNLFFBQVE7Ozs7Ozs7O3dEQUl0RCxPQUFPOzs7Ozs7O2dCQUlOOztpQkFFSDtvQkFFTyxPQUFPOzt3QkFDSCxPQUFPLFVBQVM7OytCQUNaLEtBQUMsY0FBYzs7d0JBQ25CLE9BQU8sU0FBUTs7K0JBQ1gsS0FBSyxLQUFLLFNBQVMsT0FBTzs7Ozt3QkFFN0IsS0FBQzsrQkFDRSxLQUFDLDZCQUFrQixPQUFPLDJCQUFPLE9BQU87Ozs7aUJBRXZEO29CQUVPLEtBQUMsUUFBUSxtQkFBa0I7O3dCQUN2QixLQUFDLE1BQU07O3dCQUNOLEtBQUMsTUFBTTs7Ozs7b0JBRVgsS0FBQyxRQUFRLE9BQU87Ozs7aUJBR3hCO29CQUVPLE9BQU87O29CQUNOLFFBQVEsTUFBTSxJQUFJLEtBQUM7a0NBQ1A7Ozs7b0JBQ1osS0FBQzsyQkFDRSxLQUFDLFFBQVEsTUFBTSxLQUFDOzs7aUJBQzNCO29CQUVPLE9BQU8sUUFBUyxPQUFPLFNBQVE7OzJCQUMzQixLQUFLLEtBQUssU0FBUyxPQUFPOzs7OzswREFFbkMsT0FBTzs7Ozs7O2VBRWQifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/quicky.kode
