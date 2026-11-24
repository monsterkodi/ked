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
        this["applyGitStatusCache"] = this["applyGitStatusCache"].bind(this)
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
        var file, foundChange, inRepo, item, redraw

        var list = _k_.list(this.items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            inRepo = status.gitDir === '/' || slash.samePath(item.path,status.gitDir) || item.path.startsWith(status.gitDir + '/')
            if (!inRepo)
            {
                continue
            }
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
                    if (!(_k_.in(item.path,status.changed)))
                    {
                        delete item.modified
                    }
                    if (!(_k_.in(item.path,status.added)))
                    {
                        delete item.added
                    }
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

    dirtree.prototype["applyGitStatusCache"] = function ()
    {
        var gitDir, status

        for (gitDir in git.statusCache)
        {
            status = git.statusCache[gitDir]
            this.onGitStatus(status)
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
        var dir, item, items, parent, _182_29_

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
        this.set(items,((_182_29_=opt.index) != null ? _182_29_ : 0))
        this.applyGitStatusCache()
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
        var depth, index, item, items, state, _240_20_, _242_26_, _253_48_

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
        this.applyGitStatusCache()
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
                for (x = xs; x < this.cells.cols; x++)
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

        ;[col,row] = this.eventPos(event)
        if (!this.cells.inside(col,row))
        {
            return
        }
        item = this.choiceAtRow(row + this.state.s.view[1])
        console.log(`itemAtEvent ${row} ${this.state.s.view[1]} ${(item != null ? item.path : undefined)}`)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlydHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQU07SUFBSztJQUFLO0lBQU07SUFBSztJQUFJOztPQUMvQixhQUFSOztPQUNRLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFVBQVI7O09BQ1EsbUJBQVo7O09BQ1ksY0FBQTs7T0FFWixLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7QUFFcEQsV0FBRDs7d0JBQVM7YUFFTCxTQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0RBRUwsT0FBTyxLQUFLO1FBRWxCLEtBQUMsTUFBTSxPQUFPLFFBQVE7UUFFdEIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxhQUFnQixLQUFDO1FBRXpCLEtBQUMsbUJBQW1CO1FBQ3BCLEtBQUMsZUFBZTtRQUNoQixLQUFDLFlBQVk7Ozt1QkFFakIsMEJBQWE7Ozs7NEJBTUcsS0FBQzs7O1lBQVQ7WUFFQSxTQUFTLE9BQU8sV0FBVSxPQUFPLE1BQU0sU0FBUyxLQUFLLEtBQU0sT0FBTyxXQUFXLEtBQUssS0FBSyxXQUFXLE9BQU8sU0FBUztpQkFDM0c7O2dCQUFTOztnQkFFYixLQUFLLE1BQU0sU0FBUzs7Z0JBQU87O3FCQUV0QixLQUFLLFNBQVE7O2dCQUVqQixjQUFjOzJCQUVYLEtBQUssS0FBUSxPQUFPOzt5QkFFZixRQUFRLE9BQU87OzRCQUNaLEtBQUssV0FBVyxLQUFLOzs0QkFDcEIsS0FBSyxXQUFXOzRCQUNoQixLQUFDLE1BQU07NEJBQ1AsU0FBUzs0QkFDVCxjQUFjOzRCQUNkOzs7O29CQUVULEtBQUssYUFBaUI7OzJCQUVkLEtBQUs7b0JBQ1osS0FBQyxNQUFNO29CQUNQLFNBQVM7Ozs7OzJCQUlWLEtBQUssS0FBUSxPQUFPOztvQkFDbkIsS0FBSyxXQUFXO29CQUNoQixLQUFDLE1BQU07b0JBQ1AsU0FBUzs7MkJBRVYsS0FBSyxLQUFRLE9BQU87O29CQUNuQixLQUFLLFFBQVE7b0JBQ2IsS0FBQyxNQUFNO29CQUNQLFNBQVM7O29CQUVWLEtBQUsscUJBQWEsS0FBSyxLQUFZLE9BQU8sYUFBVyxLQUFLLGtCQUFVLEtBQUssS0FBWSxPQUFPOztpQ0FDeEYsS0FBSyxLQUFZLE9BQU87OytCQUFpQixLQUFLOztpQ0FDOUMsS0FBSyxLQUFZLE9BQU87OytCQUFpQixLQUFLOztvQkFDakQsS0FBQyxNQUFNO29CQUNQLFNBQVM7Ozs7WUFFbEI7O1lBQ0MsS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO21CQUNiLEtBQUssS0FBSzs7Ozt1QkFFbEI7Ozs7YUFFUSxVQUFpQixJQUFJOztZQUFkLFNBQVUsSUFBSTtZQUNyQixLQUFDLFlBQVk7Ozs7dUJBRXJCLDJCQUFjOzthQUVELEtBQUssS0FBSyxXQUFXLEtBQUM7Ozs7Z0JBRXhCLEtBQUs7O2lCQUNSO2lCQUNBO2lCQUNBO3VCQUFXLEtBQUM7Ozs7Ozt1QkFFcEIsMkJBQWM7O2VBQVMsS0FBQzs7O3VCQUV4Qjs7OztRQUVJLE9BQU8sWUFBWSxJQUFJO1lBQ3BCLE9BQU8sS0FBQyxZQUFZOztZQUNuQixNQUFNLEtBQUMsYUFBYTttQkFDcEIsS0FBQyxVQUFVOzs7O3VCQUVuQjs7OztZQUVPLE9BQU8sWUFBWSxJQUFJOzt5QkFDcEIsS0FBQyxTQUFTLEtBQUs7Ozs7dUJBRXpCLDZCQUFVLEdBQUUsUUFBTTs7OztRQUVkLE9BQU8sS0FBQztRQUNSLEtBQUMsWUFBWSxLQUFDLGFBQWEsS0FBSyxFQUFFO2NBQ2hDLEtBQUM7ZUFDSCxLQUFDOzs7dUJBRUwsaUNBQWMsTUFBSyxHQUFFOztZQUVkOzs7O3NCQUVPOzttQkFDQTs7Z0JBQ0YsY0FBTSxpQkFBaUI7OztxQkFFN0IsS0FBQyxPQUFPLEVBQUU7Ozt1QkFFaEIsMkJBQVEsR0FBRTs7OztZQUVILE9BQU8sS0FBQyxZQUFZOztZQUNuQixLQUFDLE9BQU87Ozs7WUFFUixLQUFLLE1BQU0sSUFBSTtnQkFFWixPQUFPLEtBQUMsWUFBWTs7cUJBQ1osS0FBSzs7MEJBQ04sS0FBQyxRQUFROzs7OztnQkFFZixNQUFNLE9BQU8sSUFBSTtnQkFDakIsTUFBTSxNQUFNLFNBQVMsR0FBRztzQkFFdEIsS0FBQyxRQUFRO3NCQUNULEtBQUMsWUFBWTs7O1lBRXBCOzttQkFBUSxLQUFDOzs7O21CQUNELEtBQUM7Ozs7dUJBRWhCLGdDQUFhOzs7O1FBRVQsTUFBTSxNQUFNLE1BQU07NEJBQ0g7YUFBUDs7WUFBSjtZQUNBLE1BQU0sTUFBTSxLQUFLLEtBQUMsWUFBWSxVQUFJLFVBQUcsbUJBQUEsa0JBQUssS0FBSztZQUMvQyxLQUFLLEtBQUMsWUFBWTtpQkFDVDs7OztrQkFDUCxLQUFDLFFBQVE7Ozs7dUJBRW5CLDRCQUFTLE1BQUs7Ozs7UUFFVixPQUFBLGNBQUE7UUFFQSxNQUFNLE1BQU0sUUFBUTtRQUVwQixRQUFRLE1BQU0sS0FBSSxVQUFVO1FBRTVCLGNBQVMsS0FBQyxTQUFTLElBQUk7UUFFdkIsS0FBQyxjQUFjOzRCQUVIOzs7WUFBUjtZQUNBLEtBQUssUUFBUTtZQUNiLEtBQUMsTUFBTTs7UUFFWCxNQUFNLGdCQUFNLEdBQUU7O21CQUFNLEtBQUMsT0FBTyxLQUFLLEtBQUMsT0FBTzs7UUFFekMsU0FBUyxNQUFNLElBQUk7WUFDaEI7O1lBQ0MsTUFBTSxTQUNGLEtBQU0sTUFDTixLQUFNLE1BQU0sS0FBSyxRQUNqQixLQUFNLE9BQ04sTUFBTyxNQUFNLE1BQU0sTUFBTTs7UUFFakMsS0FBQyxJQUFJLGlCQUFNLElBQUksNEJBQVE7UUFDdkIsS0FBQztjQUVDLEtBQUMsb0JBQW9CO1lBRUQsSUFBSTs7bUJBQTFCLEtBQUssS0FBSzs7Ozt1QkFFZCw2QkFBVSxLQUFJOzs7Ozs7WUFHTixjQUFTLElBQUksS0FBSyxLQUFJLFVBQVU7bUJBQzlCOztlQUNBOztZQUNGLCtCQUF1QixPQUFPOzs7Ozt1QkFHdEMsNEJBQVMsU0FBUTs7c0JBRUY7Ozs7WUFFUixRQUFROztrQkFDTCxRQUFRO2lCQUNHLGNBQUEsSUFBSzs7Z0JBQWxCLEtBQUM7Ozs7WUFHQSxRQUFROzs7O1FBRWIsUUFBUSxVQUFVLEtBQUMsYUFBYSxRQUFRO2NBRXRDLFFBQVE7c0JBRUgsUUFBUTs7O3VCQUVuQixpQ0FBYyxTQUFROzs7O1FBRWxCLE9BQUEsY0FBQTtRQUVBLFFBQVEsT0FBTztRQUVmLFFBQVEsTUFBTSxRQUFRLE1BQUssVUFBVTtRQUVyQyxjQUFTLEtBQUMsU0FBUyxRQUFRLEtBQUs7UUFFaEMsUUFBUSxRQUFRLFFBQVEsTUFBTSxRQUFRLE1BQU0sVUFBVSxNQUFNO1FBRTVELFFBQVEsWUFBWSxJQUFJLEtBQUM7UUFFekIsUUFBUSxRQUFRLFFBQVE7NEJBQ1o7OztZQUFSO1lBQ0EsS0FBSyxRQUFRO1lBQ2IsS0FBQyxNQUFNOztRQUVYLE1BQU0sZ0JBQU0sR0FBRTs7bUJBQU0sS0FBQyxPQUFPLEtBQUssS0FBQyxPQUFPOztRQUV6QyxRQUFRLEtBQUMsTUFBTSxRQUFRO1FBRXZCLE1BQU0sT0FBTyxLQUFDLE1BQU0sUUFBTSxFQUFFO2FBRXpCLElBQUk7O1lBQ0gsUUFBUSxJQUFJOztrQkFDUixJQUFJOztZQUNSLFFBQVEsS0FBQyxNQUFNLFFBQVEsSUFBSTs7UUFFL0IsS0FBQyxJQUFJLEtBQUMsTUFBTTtRQUNaLEtBQUM7UUFFRCxZQUFZLE9BQU8sS0FBQyxhQUFhLFFBQVEsT0FBTztRQUVoRCxJQUFJLE9BQU8sUUFBUTs2QkFFUDs7O1lBQVI7Z0JBQ0csS0FBSyxTQUFRLFVBQVUsTUFBTSxlQUFOLE1BQU0sS0FBTSxLQUFLOzs4QkFDOUIsSUFBSSxxQkFBaUIsSUFBSTs7b0JBQzlCLElBQUksU0FBUzs7c0JBQ2YsS0FBQyxRQUFRLEtBQUs7OztZQUVYLElBQUk7O21CQUFqQixLQUFDOzs7O3VCQUVMLHdDQUFxQjs7OztRQUVqQixPQUFBLGNBQUE7UUFDQSxJQUFJLFNBQVM7UUFFYixRQUFRLFlBQVksSUFBSSxLQUFDO3NCQUVkLE1BQU07Ozs7YUFFYixPQUFhLE1BQU07O1lBQWYsUUFBUyxNQUFNO2dCQUVoQixJQUFJLFdBQVcsS0FBQzs7c0JBQ2IsS0FBQyxRQUFRLEtBQUMsWUFBWSxLQUFLOzs7Ozt1QkFFekMsNkJBQWdCOztlQUFVLEtBQUMsU0FBUyxPQUFPLEtBQUM7Ozt1QkFFNUM7O1lBRWtDLEtBQUM7O1lBQS9CLGFBQWEsS0FBQzs7ZUFDZCxLQUFDLGVBQWU7O21CQUFlLEtBQUMsUUFBUSxLQUFDLGFBQVksT0FBTyxLQUFLLE1BQU0sS0FBQzt1QkFBZ0I7Ozt1QkFFNUYsdUJBQVU7O3NCQUVLOzs7O2NBQ08sVUFBVDs7OztlQUlULFlBQVksSUFBSSxLQUFDLEtBQUs7Ozt1QkFFMUIseUJBQVksUUFBTyxRQUFPOztZQUluQixXQUFVOztZQUNULEtBQUM7aUJBQ0csTUFBTSxPQUFPLE1BQU0sUUFBUyxPQUFPLFNBQVE7O2dCQUMzQyxLQUFLLEtBQUssU0FBUyxPQUFPOzs7O1lBRy9CLFdBQVU7O2dCQUNOLE9BQU8sU0FBUTs7Z0JBQ2QsS0FBSyxLQUFLLGFBQWEsT0FBTzs7OztnQkFHL0IsT0FBTzs7aUJBRVY7d0JBRVc7O3lCQUVIO3lCQUNBOzRCQUNTLE1BQU0sV0FBVTs7Ozs0QkFDbEIsV0FBVSxXQUFZLE1BQU0sUUFBUSxPQUFPLE1BQU0sU0FBUzs7bUNBQ3ZELEtBQUssS0FBSyxjQUFjLE9BQU87OzZCQUU5QixPQUFPOzs0QkFBTyxLQUFDLFFBQVEsUUFBTyxPQUFPOzs7OzRCQUN2QyxLQUFDLFNBQVM7Ozs7eUJBR25COzRCQUNPLE9BQU8sTUFBTSxTQUFTOzttQ0FBVSxLQUFDLGNBQWM7OzZCQUMzQyxPQUFPOzs0QkFBTyxLQUFDLFFBQVEsUUFBTyxPQUFPOzs7OzRCQUN2QyxLQUFDOzs7O3lCQUdWOzRCQUNPLE9BQU8sTUFBTSxTQUFTOzs7OzRCQUN0QixPQUFPOzs0QkFBTyxLQUFDLFNBQVMsUUFBTyxPQUFPOzs7OzRCQUNwQyxLQUFDOzs7O3lCQUdWO3lCQUNBOzRCQUNPLE9BQU8sTUFBTSxTQUFTOzs7OzZCQUNnQixPQUFPOzs0QkFBaEQsS0FBQzs7NEJBQ2dDLE9BQU87OzRCQUF4QyxLQUFDLFNBQVMsUUFBTyxPQUFPOzs7O3lCQUc1Qjt5QkFDQTsrQkFBYSxLQUFLLEtBQUssY0FBYyxPQUFPOzs7OztpQkFFcEQ7d0JBRVc7O3lCQUVIOytCQUFhLEtBQUM7O3lCQUNkOytCQUFhLEtBQUM7O3lCQUVkO3lCQUNBOytCQUFhLEtBQUM7O3lCQUVkO3lCQUNBOytCQUFhLEtBQUssS0FBSyxTQUFTLE9BQU87O3lCQUV2Qzt5QkFDQTs2QkFDUyxnQkFBQSxNQUFPLHdCQUFVOzs7OytCQUNwQixLQUFLLEtBQUssWUFBWSxPQUFPOzs7Ozs7O3NEQUV6QyxPQUFPLE9BQU87Ozt1QkFFeEIsdUJBQVUsU0FBUTs7OztzQkFFSDs7OztRQUVYLE9BQUEsY0FBQTtRQUVBLFFBQVEsT0FBTztRQUVmLFFBQVEsUUFBUSxRQUFRLE1BQU0sUUFBUSxNQUFNLFNBQVMsTUFBTTtRQUUzRCxRQUFRLEtBQUMsTUFBTSxRQUFRO1FBRXZCLGNBQWM7ZUFDUixRQUFNLGNBQVksSUFBSSxLQUFDLE1BQU0sVUFBVyxLQUFDLE1BQU0sUUFBTSxjQUFZLEdBQUcsS0FBSyxXQUFXLFFBQVE7O1lBQzlGLGVBQWU7O1FBRW5CLE1BQU0sUUFBUSxLQUFDLE1BQU0sUUFBTSxFQUFFO1FBRTdCLEtBQUMsSUFBSSxLQUFDLE1BQU07UUFFWixZQUFZLE9BQU8sS0FBQyxhQUFhLFFBQVE7WUFFbkIsSUFBSTs7bUJBQTFCLEtBQUssS0FBSzs7Ozt1QkFFZCxrQkFBSyxPQUFNLFFBQU07Ozs7UUFFYixTQUFTLEtBQUMsTUFBTSxFQUFFLEtBQUs7d0NBQ2pCLE1BQU07UUFDWixLQUFDLE1BQU0sU0FBUyxFQUFFO1FBQ2xCLEtBQUMsTUFBTSxXQUFXO2VBQ2xCLEtBQUMsTUFBTSxjQUFjLEVBQUU7Ozt1QkFFM0I7O1FBRUksS0FBQztZQUNxQyxLQUFDLFVBQVUsU0FBUTs7WUFBekQsS0FBSyxLQUFLLFNBQVMsS0FBQyxVQUFVOztlQUM5QixLQUFDLE1BQU0sU0FBUyxFQUFFLEtBQUMsTUFBTSxFQUFFLEtBQUssS0FBRzs7O3VCQUV2Qzs7WUFFTyxLQUFDLFVBQVUsU0FBUSxVQUFXLFlBQVksSUFBSSxtQkFBa0IsS0FBQyxVQUFVOztZQUMxRSxLQUFLLEtBQUssU0FBUyxLQUFDLFVBQVU7OztRQUdsQyxLQUFDO1lBQ3FDLEtBQUMsVUFBVSxTQUFROztZQUF6RCxLQUFLLEtBQUssU0FBUyxLQUFDLFVBQVU7O2VBQzlCLEtBQUMsTUFBTSxTQUFTLEVBQUUsS0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFHOzs7dUJBRXZDOzs7O1FBRUksUUFBUSxLQUFDLFFBQVEsUUFBUSxLQUFDO1FBQzFCLFNBQVM7ZUFDSCxRQUFRLEtBQU0sS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFDLFVBQVUsVUFBYyxLQUFDLFFBQVEsT0FBTzs7WUFDbEYsU0FBUzs7UUFDYixLQUFDLE1BQU0sV0FBVztlQUNsQixLQUFDLE1BQU0sY0FBYyxFQUFFOzs7dUJBRTNCOzs7O1FBRUksUUFBUSxLQUFDLFFBQVEsUUFBUSxLQUFDO1FBQzFCLFNBQVM7ZUFDSCxRQUFRLEtBQU0sS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFDLFVBQVU7O1lBQ3BELFNBQVM7O1FBQ2IsS0FBQyxNQUFNLFdBQVc7ZUFDbEIsS0FBQyxNQUFNLGNBQWMsRUFBRTs7O3VCQUUzQjs7OztZQUVPLEtBQUssS0FBQzs7WUFDTCxLQUFLLE1BQU0sT0FBTztZQUNsQixJQUFLLEtBQUcsS0FBQyxNQUFNLEVBQUUsS0FBSztnQkFDbkIsSUFBSSxLQUFDLE1BQU0sUUFBUyxLQUFLLEtBQUMsTUFBTSxFQUFFLE1BQU07O2dCQUN2QyxLQUFLLEtBQUssVUFBVSxLQUFDLE1BQU0sRUFBRSxNQUFNLElBQUk7Z0JBQ3ZDLEtBQUMsTUFBTSxJQUFJLEtBQUcsSUFBRSxLQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsRUFBRSxJQUFJLEdBQUcsS0FBQyxNQUFNO3FCQUM3QyxJQUFLLFFBQUssS0FBQyxNQUFNOztvQkFDakIsS0FBQyxNQUFNLE9BQU8sSUFBRSxLQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsRUFBRTs7Ozs7Ozt1QkFJbkQ7Ozs7UUFFSSxjQUFjLFlBQVksSUFBSTtzQkFFbkI7Ozs7NEJBRUssS0FBQzthQUFSOztZQUFMO2dCQUNTLEtBQUssU0FBUTs7dUJBQXBCOzs7Ozt1QkFFViwwQkFBYTs7Ozs0QkFFTyxLQUFDO2FBQVI7O1lBQUw7Z0JBQ1UsTUFBTSxTQUFTLEtBQUssS0FBSzs7dUJBQWpDOzs7Ozt1QkFFViwrQkFBa0I7Ozs7NEJBRUUsS0FBQzthQUFSOztZQUFMO2dCQUNTLE1BQU0sU0FBUyxLQUFLLEtBQUs7O3VCQUFoQzs7Ozs7dUJBRVYsMEJBQWE7Ozs7VUFFUixJQUFJLE9BQU8sS0FBQyxTQUFTO2FBQ2YsS0FBQyxNQUFNLE9BQU8sSUFBSzs7OztRQUUxQixPQUFPLEtBQUMsWUFBWSxNQUFNLEtBQUMsTUFBTSxFQUFFLEtBQUs7UUFDeEMsMkJBQW1CLE9BQU8sS0FBQyxNQUFNLEVBQUUsS0FBSyxPQUFNLGVBQUEsS0FBTTtlQUNwRDs7O3VCQUVKLG9CQUFPOztlQUFRLEtBQUssaUJBQWEsS0FBSyxRQUFNLElBQUUsS0FBSyxRQUFRLFdBQVc7Ozt1QkFFdEUscUJBQVE7Ozs7UUFFSixJQUFJLE1BQU0sTUFBTSxLQUFLO1FBRXJCLElBQUk7WUFDVSxLQUFLLFNBQVE7O1lBQTNCLEtBQUs7O1FBQ0wsS0FBSyxLQUFLLE9BQU8sRUFBRTtlQUNuQjs7O1dBcGRQOzs7ZUFzZE0ifQ==
//# sourceURL=../../../../kode/ked/view/colmns/dirtree.kode
