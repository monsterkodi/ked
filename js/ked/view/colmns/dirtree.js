var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var dirtree

import kxk from "../../../kxk.js"
let kutil = kxk.kutil
let kseg = kxk.kseg
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs
let watcher = kxk.watcher

import prjcts from "../../index/prjcts.js"

import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import git from "../../util/git.js"

import filterchoice from "../menu/filterchoice.js"

import diritem from "./diritem.js"

import rgxs from './quicky.json' with { type : "json" }

dirtree = (function ()
{
    _k_.extend(dirtree, filterchoice)
    function dirtree (screen, name, features)
    {
        this["itemAtEvent"] = this["itemAtEvent"].bind(this)
        this["itemIndexForPath"] = this["itemIndexForPath"].bind(this)
        this["itemForPath"] = this["itemForPath"].bind(this)
        this["indexOfOpenFile"] = this["indexOfOpenFile"].bind(this)
        this["drawSelections"] = this["drawSelections"].bind(this)
        this["selectParent"] = this["selectParent"].bind(this)
        this["selectOpenSiblingAboveOrParent"] = this["selectOpenSiblingAboveOrParent"].bind(this)
        this["selectNextKeepOffset"] = this["selectNextKeepOffset"].bind(this)
        this["selectPrevKeepOffset"] = this["selectPrevKeepOffset"].bind(this)
        this["set"] = this["set"].bind(this)
        this["closeDir"] = this["closeDir"].bind(this)
        this["emitAction"] = this["emitAction"].bind(this)
        this["setState"] = this["setState"].bind(this)
        this["refresh"] = this["refresh"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["restoreSessionState"] = this["restoreSessionState"].bind(this)
        this["openDirItems"] = this["openDirItems"].bind(this)
        this["openDir"] = this["openDir"].bind(this)
        this["dirItems"] = this["dirItems"].bind(this)
        this["setRoot"] = this["setRoot"].bind(this)
        this["openRelPath"] = this["openRelPath"].bind(this)
        this["reveal"] = this["reveal"].bind(this)
        this["queuedReveal"] = this["queuedReveal"].bind(this)
        this["onReveal"] = this["onReveal"].bind(this)
        this["revealEditorFile"] = this["revealEditorFile"].bind(this)
        this["selectEditorFile"] = this["selectEditorFile"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["onFileChange"] = this["onFileChange"].bind(this)
        this["onGitStatus"] = this["onGitStatus"].bind(this)
        dirtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax.setRgxs(rgxs)
        post.on('session.merge',this.onSessionMerge)
        post.on('file.change',this.onFileChange)
        post.on('git.status',this.onGitStatus)
        this.frontRoundOffset = 0
        this.refreshTimer = null
        this.revealing = null
    }

    dirtree.prototype["onGitStatus"] = function (status)
    {
        var file, foundChange, item, redraw

        var list = _k_.list(this.items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (item.tilde.endsWith('..'))
            {
                continue
            }
            else if (item.type === 'dir')
            {
                foundChange = false
                if (_k_.in(item.path,status.dirs))
                {
                    for (file in status.files)
                    {
                        if (file.startsWith(item.path))
                        {
                            item.modified = true
                            this.tilde(item)
                            redraw = true
                            foundChange = true
                            break
                        }
                    }
                }
                if (item.modified && !foundChange)
                {
                    delete item.modified
                    this.tilde(item)
                    redraw = true
                }
            }
            else
            {
                if (_k_.in(item.path,status.changed))
                {
                    item.modified = true
                    this.tilde(item)
                    redraw = true
                }
                if (_k_.in(item.path,status.added))
                {
                    item.added = true
                    this.tilde(item)
                    redraw = true
                }
                if (item.modified && !(_k_.in(item.path,status.changed)) || item.added && !(_k_.in(item.path,status.added)))
                {
                    delete item.modified
                    this.tilde(item)
                    redraw = true
                }
            }
        }
        if (redraw)
        {
            this.set(this.items,this.currentIndex())
            return post.emit('redraw')
        }
    }

    dirtree.prototype["onFileChange"] = function (info)
    {
        if (!info.path.startsWith(this.currentRoot))
        {
            return
        }
        switch (info.change)
        {
            case 'create':
            case 'delete':
            case 'rename':
                return this.refresh()

        }

    }

    dirtree.prototype["onMouseLeave"] = function (event)
    {
        return this.selectEditorFile()
    }

    dirtree.prototype["selectEditorFile"] = function ()
    {
        var file, item, row

        file = ked_session.get("editor▸file")
        if (item = this.itemForPath(file))
        {
            row = this.rowForChoice(item)
            return this.highlight(row)
        }
    }

    dirtree.prototype["revealEditorFile"] = async function ()
    {
        var file

        if (file = ked_session.get("editor▸file"))
        {
            return await this.onReveal(file,false)
        }
    }

    dirtree.prototype["onReveal"] = async function (p, focus = true)
    {
        var prev

        prev = this.revealing
        this.revealing = this.queuedReveal(prev,p,focus)
        await this.revealing
        return this.selectEditorFile()
    }

    dirtree.prototype["queuedReveal"] = async function (prev, p, focus)
    {
        if (prev)
        {
            try
            {
                await prev
            }
            catch (err)
            {
                console.error('dirtree.reveal',err)
            }
        }
        return await this.reveal(p,focus)
    }

    dirtree.prototype["reveal"] = async function (p, focus)
    {
        var ddd, item, pd, rel

        if (item = this.itemForPath(p))
        {
            this.select(item)
        }
        else
        {
            pd = slash.dir(p)
            if (item = this.itemForPath(pd))
            {
                if (!item.open)
                {
                    await this.openDir(item)
                }
            }
            else
            {
                ddd = prjcts.dir(p)
                rel = slash.relative(pd,ddd)
                await this.setRoot(ddd)
                await this.openRelPath(rel)
            }
        }
        if (focus)
        {
            return this.grabFocus()
        }
        else
        {
            return this.redraw()
        }
    }

    dirtree.prototype["openRelPath"] = async function (rel)
    {
        var idx, pi, pth, spl, sub

        spl = slash.split(rel)
        var list = _k_.list(spl)
        for (idx = 0; idx < list.length; idx++)
        {
            sub = list[idx]
            pth = slash.path(this.currentRoot,spl.slice(0, typeof idx === 'number' ? idx+1 : Infinity).join('/'))
            pi = this.itemForPath(pth)
            if (!pi)
            {
                return
            }
            await this.openDir(pi)
        }
    }

    dirtree.prototype["setRoot"] = async function (path, opt)
    {
        var dir, item, items, parent, _173_29_

        opt = (opt != null ? opt : {})
        dir = slash.untilde(path)
        watcher.watch(dir,{recursive:false})
        items = await this.dirItems(dir,'dirtree.setRoot')
        this.currentRoot = dir
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.depth = 0
            this.tilde(item)
        }
        items.sort((function (a, b)
        {
            return this.weight(a) - this.weight(b)
        }).bind(this))
        parent = slash.dir(dir)
        if (parent)
        {
            items.unshift({type:'dir',file:slash.name(parent),path:parent,tilde:' ' + icons.dir + '\u00A0..'})
        }
        this.set(items,((_173_29_=opt.index) != null ? _173_29_ : 0))
        await this.restoreSessionState(opt)
        if (opt.redraw)
        {
            return post.emit('redraw')
        }
    }

    dirtree.prototype["dirItems"] = async function (dir, info)
    {
        var items

        try
        {
            items = await nfs.list(dir,{recursive:false})
            return items
        }
        catch (err)
        {
            console.error(`list error -- ${info}`,err)
            return
        }
    }

    dirtree.prototype["openDir"] = async function (dirItem, opt)
    {
        if (_k_.empty(dirItem))
        {
            return
        }
        if (dirItem.opening)
        {
            await dirItem.opening
            if ((opt != null ? opt.redraw : undefined))
            {
                this.redraw()
            }
            return
        }
        if (dirItem.open)
        {
            return
        }
        dirItem.opening = this.openDirItems(dirItem,opt)
        await dirItem.opening
        return delete dirItem.opening
    }

    dirtree.prototype["openDirItems"] = async function (dirItem, opt)
    {
        var depth, index, item, items, state, _230_20_, _232_26_, _242_48_

        opt = (opt != null ? opt : {})
        dirItem.open = true
        watcher.watch(dirItem.path,{recursive:false})
        items = await this.dirItems(dirItem.path,'dirtree.openDir')
        dirItem.tilde = dirItem.tilde.replace(icons.dir_close,icons.dir_open)
        state = ked_session.get(this.name,{})
        depth = dirItem.depth + 1
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.depth = depth
            this.tilde(item)
        }
        items.sort((function (a, b)
        {
            return this.weight(a) - this.weight(b)
        }).bind(this))
        index = this.items.indexOf(dirItem)
        kutil.insert(this.items,index + 1,items)
        if ((opt.index != null))
        {
            index = opt.index
        }
        else if ((opt.select != null))
        {
            index = this.items.indexOf(opt.select)
        }
        this.set(this.items,index)
        ked_session.set(`${this.name}▸open▸${dirItem.path}`,'✔')
        git.status(dirItem.path)
        var list1 = _k_.list(items)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            item = list1[_b_]
            if (item.type === 'dir' && (state.open != null ? state.open[item.path] : undefined))
            {
                if (_k_.empty(opt.select) && _k_.empty(opt.index))
                {
                    opt.select = dirItem
                }
                await this.openDir(item,opt)
            }
        }
        if (opt.redraw)
        {
            return this.redraw()
        }
    }

    dirtree.prototype["restoreSessionState"] = async function (opt)
    {
        var key, state, value

        opt = (opt != null ? opt : {})
        opt.redraw = true
        state = ked_session.get(this.name,{})
        if (_k_.empty(state.open))
        {
            return
        }
        for (key in state.open)
        {
            value = state.open[key]
            if (key.startsWith(this.currentRoot))
            {
                await this.openDir(this.itemForPath(key),opt)
            }
        }
    }

    dirtree.prototype["onSessionMerge"] = function (recent)
    {
        return this.setState(recent[this.name])
    }

    dirtree.prototype["refresh"] = function ()
    {
        if (this.refreshTimer)
        {
            clearTimeout(this.refreshTimer)
        }
        return this.refreshTimer = setTimeout(((function ()
        {
            return this.setRoot(this.currentRoot,{redraw:true,index:this.currentIndex()})
        }).bind(this)),50)
    }

    dirtree.prototype["setState"] = function (state)
    {
        if (_k_.empty(state))
        {
            return
        }
        if (!(_k_.isObj(state)))
        {
            return
        }
        return ked_session.set(this.name,state)
    }

    dirtree.prototype["emitAction"] = function (action, choice, event)
    {
        if (action === 'hover')
        {
            this.grabFocus()
            if ((event.alt || event.cmd) && choice.type === 'file')
            {
                post.emit('quicky',choice.path)
            }
            return
        }
        if (action === 'cmd+delete')
        {
            if (choice.type === 'file')
            {
                post.emit('file.trash',choice.path)
            }
            return
        }
        switch (choice.type)
        {
            case 'dir':
                switch (action)
                {
                    case 'click':
                    case 'space':
                        if (event.button === 'right')
                        {
                            return
                        }
                        if (action === 'click' && event.mods || choice.tilde.endsWith('..'))
                        {
                            return post.emit('dircol.root',choice.path)
                        }
                        if (!choice.open)
                        {
                            this.openDir(choice,{redraw:true})
                        }
                        else
                        {
                            this.closeDir(choice)
                        }
                        return

                    case 'right':
                        if (choice.tilde.endsWith('..'))
                        {
                            return this.moveSelection('down')
                        }
                        if (!choice.open)
                        {
                            this.openDir(choice,{redraw:true})
                        }
                        else
                        {
                            this.selectNextKeepOffset()
                        }
                        return

                    case 'left':
                        if (choice.tilde.endsWith('..'))
                        {
                            return
                        }
                        if (choice.open)
                        {
                            this.closeDir(choice,{redraw:true})
                        }
                        else
                        {
                            this.selectPrevKeepOffset()
                        }
                        return

                    case 'delete':
                    case 'esc':
                        if (choice.tilde.endsWith('..'))
                        {
                            return
                        }
                        if (!choice.open)
                        {
                            this.selectOpenSiblingAboveOrParent()
                        }
                        if (choice.open)
                        {
                            this.closeDir(choice,{redraw:true})
                        }
                        return

                    case 'doubleclick':
                    case 'return':
                        return post.emit('dircol.root',choice.path)

                }

                break
            case 'file':
                switch (action)
                {
                    case 'left':
                        return this.selectPrevKeepOffset()

                    case 'right':
                        return this.selectNextKeepOffset()

                    case 'delete':
                    case 'esc':
                        return this.selectParent()

                    case 'drag':
                    case 'space':
                        return post.emit('quicky',choice.path)

                    case 'click':
                    case 'return':
                        if ((event != null ? event.button : undefined) === 'right')
                        {
                            return
                        }
                        return post.emit('file.open',choice.path)

                }

                break
        }

        return dirtree.__super__.emitAction.call(this,action,choice,event)
    }

    dirtree.prototype["closeDir"] = function (dirItem, opt)
    {
        var index, numChildren

        if (_k_.empty(dirItem))
        {
            return
        }
        opt = (opt != null ? opt : {})
        dirItem.open = false
        dirItem.tilde = dirItem.tilde.replace(icons.dir_open,icons.dir_close)
        index = this.items.indexOf(dirItem)
        numChildren = 0
        while (index + numChildren + 1 < this.items.length && this.items[index + numChildren + 1].path.startsWith(dirItem.path))
        {
            numChildren += 1
        }
        kutil.replace(this.items,index + 1,numChildren,[])
        this.set(this.items,index)
        ked_session.del(`${this.name}▸open▸${dirItem.path}`)
        if (opt.redraw)
        {
            return post.emit('redraw')
        }
    }

    dirtree.prototype["set"] = function (items, index = 0)
    {
        var oldTop

        oldTop = this.state.s.view[1]
        dirtree.__super__.set.call(this,items,'tilde')
        this.state.setView([0,oldTop])
        this.state.selectLine(index)
        return this.state.setMainCursor(0,index)
    }

    dirtree.prototype["selectPrevKeepOffset"] = function ()
    {
        this.selectPrev()
        if (this.current().type === 'file')
        {
            post.emit('quicky',this.current().path)
        }
        return this.state.setView([0,this.state.s.view[1] - 1])
    }

    dirtree.prototype["selectNextKeepOffset"] = function ()
    {
        if (this.current().type === 'file' && ked_session.get('editor▸file') !== this.current().path)
        {
            post.emit('quicky',this.current().path)
            return
        }
        this.selectNext()
        if (this.current().type === 'file')
        {
            post.emit('quicky',this.current().path)
        }
        return this.state.setView([0,this.state.s.view[1] + 1])
    }

    dirtree.prototype["selectOpenSiblingAboveOrParent"] = function ()
    {
        var index

        index = this.fuzzied.indexOf(this.current())
        index -= 1
        while (index > 0 && this.fuzzied[index].depth >= this.current().depth && !this.fuzzied[index].open)
        {
            index -= 1
        }
        this.state.selectLine(index)
        return this.state.setMainCursor(0,index)
    }

    dirtree.prototype["selectParent"] = function ()
    {
        var index

        index = this.fuzzied.indexOf(this.current())
        index -= 1
        while (index > 0 && this.fuzzied[index].depth >= this.current().depth)
        {
            index -= 1
        }
        this.state.selectLine(index)
        return this.state.setMainCursor(0,index)
    }

    dirtree.prototype["drawSelections"] = function ()
    {
        var bg, li, x, xs, y

        if (li = this.indexOfOpenFile())
        {
            bg = theme.gutter.bg
            y = li - this.state.s.view[1]
            if (y < this.cells.rows && li < this.state.s.lines.length)
            {
                xs = kseg.headCount(this.state.s.lines[li],' ')
                this.cells.set(xs - 1 - this.state.s.view[0],y,'',bg,this.color.bg)
                for (var _a_ = x = xs, _b_ = this.cells.cols; (_a_ <= _b_ ? x < this.cells.cols : x > this.cells.cols); (_a_ <= _b_ ? ++x : --x))
                {
                    this.cells.set_bg(x - this.state.s.view[0],y,bg)
                }
            }
        }
        return dirtree.__super__.drawSelections.call(this)
    }

    dirtree.prototype["indexOfOpenFile"] = function ()
    {
        var currentFile, idx, item

        currentFile = ked_session.get('editor▸file')
        if (_k_.empty(currentFile))
        {
            return
        }
        var list = _k_.list(this.fuzzied)
        for (idx = 0; idx < list.length; idx++)
        {
            item = list[idx]
            if (item.path === currentFile)
            {
                return idx
            }
        }
    }

    dirtree.prototype["itemForPath"] = function (p)
    {
        var idx, item

        var list = _k_.list(this.items)
        for (idx = 0; idx < list.length; idx++)
        {
            item = list[idx]
            if (slash.samePath(item.path,p))
            {
                return item
            }
        }
    }

    dirtree.prototype["itemIndexForPath"] = function (p)
    {
        var idx, item

        var list = _k_.list(this.items)
        for (idx = 0; idx < list.length; idx++)
        {
            item = list[idx]
            if (slash.samePath(item.path,p))
            {
                return idx
            }
        }
    }

    dirtree.prototype["itemAtEvent"] = function (event)
    {
        var col, item, row

        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        if (!this.cells.inside(col,row))
        {
            return
        }
        item = this.choiceAtRow(row + this.state.s.view[1])
        console.log(`itemAtEvent ${row} ${this.state.s.view[1]} ${item.path}`)
        return item
    }

    dirtree.prototype["tilde"] = function (item)
    {
        return item.tilde = _k_.lpad(item.depth * 2 + 1) + diritem.symbolName(item)
    }

    dirtree.prototype["weight"] = function (item)
    {
        var p, w

        p = slash.parse(item.path)
        w = 0
        if (item.type === 'file')
        {
            w += 10000
        }
        w += kstr.weight(p.file)
        return w
    }

    return dirtree
})()

export default dirtree;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlydHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQU07SUFBSztJQUFLO0lBQU07SUFBSztJQUFJOztPQUMvQixhQUFSOztPQUNRLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFVBQVI7O09BQ1EsbUJBQVo7O09BQ1ksY0FBQTs7T0FFWixLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7QUFFcEQsV0FBRDs7d0JBQVM7YUFFTCxTQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREFFTCxPQUFPLEtBQUs7UUFFbEIsS0FBQyxNQUFNLE9BQU8sUUFBUTtRQUV0QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGFBQWdCLEtBQUM7UUFFekIsS0FBQyxtQkFBbUI7UUFDcEIsS0FBQyxlQUFlO1FBQ2hCLEtBQUMsWUFBWTs7O3VCQUVqQiwwQkFBYTs7Ozs0QkFNRyxLQUFDOzs7WUFBVDtnQkFFRyxLQUFLLE1BQU0sU0FBUzs7Z0JBQU87O3FCQUV0QixLQUFLLFNBQVE7O2dCQUVqQixjQUFjOzJCQUVYLEtBQUssS0FBUSxPQUFPOzt5QkFFZixRQUFRLE9BQU87OzRCQUNaLEtBQUssV0FBVyxLQUFLOzs0QkFDcEIsS0FBSyxXQUFXOzRCQUNoQixLQUFDLE1BQU07NEJBQ1AsU0FBUzs0QkFDVCxjQUFjOzRCQUNkOzs7O29CQUVULEtBQUssYUFBaUI7OzJCQUVkLEtBQUs7b0JBQ1osS0FBQyxNQUFNO29CQUNQLFNBQVM7Ozs7OzJCQUlWLEtBQUssS0FBUSxPQUFPOztvQkFDbkIsS0FBSyxXQUFXO29CQUNoQixLQUFDLE1BQU07b0JBQ1AsU0FBUzs7MkJBRVYsS0FBSyxLQUFRLE9BQU87O29CQUNuQixLQUFLLFFBQVE7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dirtree.kode
