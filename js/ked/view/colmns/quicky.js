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
        var upDir, _335_58_

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
                        return this.gotoDirOrOpenFile(((_335_58_=choice.link) != null ? _335_58_ : choice.path))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2t5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9xdWlja3kua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQk8sS0FBSyxLQUFLLGdCQUFnQixLQUFLLEVBQUUsS0FBSSxFQUFFLE9BQU87O0FBRTVDLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBRU8sS0FBQyxPQUFPLEtBQUMsTUFBTSxVQUFVO1FBRS9CLEtBQUMsYUFBYSxPQUFRLEtBQUMsVUFBVSxLQUFDO1FBRWxDLEtBQUMsT0FBTyxVQUFVO1FBQ2xCLEtBQUMsT0FBTyxTQUFTLFFBQVEsS0FBQyxNQUFNO1FBRWhDLEtBQUMsUUFBUSxNQUFNLE9BQU8sUUFBUTtRQUM5QixLQUFDLFFBQVEsR0FBRyxTQUFTLEtBQUM7UUFFdEIsS0FBQyxRQUFRLE9BQU8sWUFBWTtRQUM1QixLQUFDLFFBQVEsbUJBQW1CO1FBRTVCLEtBQUMsT0FBTyxHQUFHLFNBQVMsS0FBQztZQUVnQixLQUFDLFNBQVE7O1lBQTlDLEtBQUssR0FBRyxlQUFlLEtBQUM7Ozs7c0JBUTVCOzs7O1FBRUksZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBRXZCLE1BQUssS0FBQyxrQkFBa0IsSUFBSTtRQUM1QixhQUFTLEVBQUUsS0FBSztRQUVoQixjQUFTLEtBQUMsT0FBTyxPQUFLO1FBQ3RCLGFBQVMsTUFBTSxLQUFHLElBQUk7UUFFdEIsTUFBSyxLQUFDLE9BQU8sWUFBWSxJQUFJO1FBQzdCLE1BQUssS0FBQyxPQUFPLFlBQVksYUFBUyxHQUFHLEtBQUMsUUFBUTtRQUM5QyxJQUFLLEtBQUssS0FBSyxLQUFLO1FBRXBCLEtBQUssS0FBQztRQUNOLElBQUssS0FBRztRQUNSLGFBQVMsTUFBSSxJQUFFO1FBRWYsS0FBQyxNQUFNLE9BQVUsSUFBRSxFQUFPLElBQUUsRUFBUyxJQUFFLEVBQUk7UUFDM0MsS0FBQyxPQUFPLE9BQVMsSUFBRSxFQUFPLElBQUUsSUFBRSxHQUFPLElBQUUsRUFBSTtRQUMzQyxLQUFDLFFBQVEsT0FBUSxJQUFFLEVBQU8sSUFBRSxJQUFFLEtBQUcsR0FBSSxHQUFNO2VBQzNDLEtBQUMsTUFBTSxPQUFVLEVBQVMsRUFBVyxFQUFNOzs7c0JBUS9DOztZQUVVLEtBQUM7Ozs7UUFFUCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUMsT0FBTztlQUNSLEtBQUM7OztzQkFRTCxzQkFBUzs7OztZQUVDLEtBQUM7Ozs7UUFDUCxNQUFNLEtBQUMsT0FBTyxRQUFRO2FBQWtCLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ2pDLHlDQUFZO2FBQTRCLGNBQUEsSUFBSzs7bUJBQVo7O2VBQ2pDLEtBQUM7OztzQkFRTCx3QkFBVzs7OztRQUVQLFFBQVEsTUFBTSxjQUFLOztvQkFBUyxLQUFLLEtBQUssS0FBSzs7NEJBQy9COzs7WUFBUjtZQUNBLEtBQUssUUFBUSxNQUFNLFFBQVEsV0FBVzs7UUFDMUMsS0FBQyxPQUFPO2VBQ1IsS0FBQywwQkFBMEI7OztzQkFFL0I7O2VBRUksS0FBQyxVQUFVLFFBQVEsS0FBSzs7O3NCQVE1Qjs7O3NCQUVBLCtCQUFrQjs7Ozs7O1FBRWQsUUFBUyxPQUFPLE1BQU0sS0FBQztRQUN2QixTQUFTLE9BQU8sSUFBSSxLQUFDO1FBRXJCLFFBQVEsTUFBTSxPQUFPLFlBQVksb0JBQWM7c0JBRUg7O21CQUExQyxLQUFDLGtCQUFrQixRQUFROztRQUU3QixRQUFRLE1BQU0sS0FBSztRQUVuQixLQUFDLGFBQWEsTUFBTSxJQUFJLEtBQUM7c0JBRVksS0FBQzs7WUFBdEMsS0FBQyxhQUFhLFFBQVE7O1FBRXRCLEtBQUMsT0FBTztRQUNSLEtBQUMsUUFBUSxPQUFPLFlBQVk7UUFFNUIsb0JBQVM7Ozs7WUFFTCxJQUFJLEtBQUs7WUFDVCxJQUFJLE1BQU0sTUFBTTtZQUNoQixJQUFJLE1BQU0sU0FBUyxLQUFLLEtBQUssS0FBQztZQUM5QixJQUFJO1lBQ0osTUFBTSxFQUFFLE1BQU0sT0FBTyxTQUFPLEtBQUssT0FBTztnQ0FDN0IsTUFBTSxNQUFNLE1BQU0sSUFBSSxLQUFLOzs7Z0JBQWxDO2dCQUNBLEtBQUssS0FBSyxPQUFPLE9BQU8sSUFBRSxNQUFJLElBQUU7O21CQUNwQzs7UUFFSixRQUFRLE1BQU0sZUFBSzs7OztZQUVmLE1BQU0sTUFBTSxTQUFTLEtBQUs7Z0JBQ3ZCLE1BQU0sV0FBVzs7Z0JBQ2hCLE1BQU0sTUFBTSxNQUFNO2dCQUNsQixNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sSUFBSSxXQUFLLElBQU0sSUFBSTs7WUFFcEQsUUFBTyxLQUFLLE9BQU8sS0FBSztZQUN4QixLQUFLLFFBQVEsTUFBTSxRQUFRLFdBQVc7bUJBQ3RDOztRQUVKLE1BQU0sZUFBTSxHQUFFOzttQkFBTSxPQUFPLEtBQUssT0FBTzs7ZUFFdkMsS0FBQywwQkFBMEI7OztzQkFFL0Isd0NBQTJCOzs7O1FBRXZCLFFBQVEsTUFBTSxjQUFLOzttQkFBTSxFQUFFOztRQUUzQixLQUFDLGdDQUF1QixLQUFDLE9BQU8sT0FBSyxLQUFLLEtBQUcsS0FBSyxhQUFhO2VBRS9ELEtBQUMsY0FBYzs7O3NCQVFuQiw0QkFBZSxPQUFNOzs7O1lBRWQsS0FBQzs7WUFDQSxLQUFDLE1BQU0sSUFBSTtZQUNYLEtBQUMsTUFBTTs7UUFFWCxjQUFjO1lBRVg7O1lBQ0MsU0FBUyxNQUFNLFFBQVE7Z0NBQ1A7OztnQkFBWjtvQkFDRyxNQUFNLFNBQVMsS0FBSyxLQUFLOztvQkFDeEIsY0FBYztvQkFDZDs7OztRQUVaLEtBQUMsUUFBUSxNQUFNO1FBRWYsS0FBQyxRQUFRLElBQUksTUFBTTtRQUVuQixLQUFDLFFBQVEsTUFBTSxXQUFXO1FBQzFCLEtBQUMsUUFBUSxNQUFNLGNBQWMsRUFBRTtRQUMvQixLQUFDLFFBQVEsTUFBTSxTQUFTLEVBQUU7UUFFMUIsS0FBQztlQUNELEtBQUMsUUFBUTs7O3NCQVFiLCtCQUFrQjs7UUFFZCxLQUFDO1FBQ0QsS0FBSyxLQUFLLFNBQVM7UUFDbkIsS0FBSyxLQUFLLFFBQVE7Z0JBQ2xCLE9BQU87OztzQkFRWCw0QkFBZTs7Z0JBRUo7O2lCQUNIO3FCQUFtQixLQUFDLFFBQVE7Ozs7O2lCQUM1QjtxQkFBbUIsS0FBQyxRQUFROzs7Ozs7O1FBRWhDLEtBQUM7ZUFFRCxLQUFDLFFBQVEsY0FBYzs7O3NCQVEzQjs7ZUFFSSxLQUFDLFFBQVEsS0FBQyxRQUFROzs7c0JBRXRCLDRCQUFTOzs7O3VCQUVrQixlQUFBLEtBQU07O21CQUExQixLQUFDOztZQUVELEtBQUssU0FBUSxpQkFBVyxNQUFNLElBQUksS0FBSyxNQUFTLFNBQVM7O1lBQ3hELGFBQVEsSUFBSSxLQUFLLEtBQUs7WUFDdEIsUUFBUSxLQUFLLGFBQWE7WUFDMUIsS0FBQyxRQUFRLE9BQU87WUFDaEIsS0FBQyxRQUFRLE9BQU8sZUFBZSxNQUFNLElBQUksS0FBSyxNQUFNOzs7O1lBRXBELEtBQUM7O2VBRUwsS0FBSyxLQUFLOzs7c0JBUWQsOEJBQVcsS0FBSTs7UUFFWCxlQUFPLEtBQUMsa0JBQWtCO1FBQzFCLEtBQUssS0FBSyxhQUFhO2VBQ3ZCLEtBQUM7OztzQkFFTDs7ZUFFSSxLQUFDLFFBQVEsT0FBTzs7O3NCQVFwQiwwQkFBYTs7Z0JBRUYsS0FBQyxNQUFNOztpQkFFVjt1QkFBVSxLQUFDLFVBQVU7O2lCQUNyQjt1QkFBVSxLQUFDLFVBQVU7O2lCQUNyQjt1QkFBVSxLQUFDLFVBQVUsS0FBQzs7aUJBQ3RCO3VCQUFVLEtBQUMsVUFBVSxNQUFNLElBQUksS0FBQzs7OztzQkFNM0I7O29CQUFpQixPQUFPOztZQUc5QixPQUFPLFNBQVE7O1lBQ2QsS0FBQyxVQUFVLE9BQU87Ozs7WUFFbEIsS0FBQyxpQkFBaUIsT0FBTzs7Z0JBQzdCLE9BQU87OztzQkFRWCw2QkFBZ0IsUUFBTzs7Z0JBRVo7O2lCQUVIO3VCQUFhLEtBQUMsYUFBWSxNQUFNLEtBQUssS0FBSyxNQUFNLFFBQVE7Ozs7OztzQkFFaEUsNEJBQWUsUUFBTzs7d0RBRVosT0FBTzs7O3NCQUVqQiw4QkFBaUIsUUFBTzs7OztnQkFFYjs7aUJBRUg7cUJBRU8saUJBQUEsT0FBUTs7d0JBQ0osT0FBTyxVQUFTOzsrQkFDWixLQUFDLGNBQWM7O3dCQUNuQixPQUFPLFNBQVE7OytCQUNYLEtBQUssS0FBSyxTQUFTLE9BQU87Ozs7d0JBRTdCLEtBQUM7K0JBQ0UsS0FBQyw2QkFBa0IsT0FBTywyQkFBTyxPQUFPOzs7O2lCQUV2RDtvQkFFTyxLQUFDLFFBQVEsbUJBQWtCOzt3QkFDdkIsS0FBQyxNQUFNOzt3QkFDTixLQUFDLE1BQU07Ozs7O29CQUVYLEtBQUMsUUFBUSxPQUFPOzs7O2lCQUd4QjtxQkFFTyxpQkFBQSxPQUFROztvQkFDUCxRQUFRLE1BQU0sSUFBSSxLQUFDO2tDQUNQOzs7O29CQUNaLEtBQUM7MkJBQ0UsS0FBQyxRQUFRLE1BQU0sS0FBQzs7O2lCQUMzQjtxQkFFTyxpQkFBQSxPQUFRLHFCQUFTLE9BQU8sU0FBUTs7MkJBQzVCLEtBQUssS0FBSyxTQUFTLE9BQU87Ozs7OzBEQUVuQyxPQUFPOzs7V0FsVlo7OztlQW9WRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/quicky.kode
