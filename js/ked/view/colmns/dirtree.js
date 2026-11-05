var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}}

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
        this["dirItems"] = this["dirItems"].bind(this)
        this["setState"] = this["setState"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["setRoot"] = this["setRoot"].bind(this)
        this["refresh"] = this["refresh"].bind(this)
        this["onFileChange"] = this["onFileChange"].bind(this)
        this["onGitStatus"] = this["onGitStatus"].bind(this)
        dirtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax.setRgxs(rgxs)
        post.on('session.merge',this.onSessionMerge)
        post.on('file.change',this.onFileChange)
        post.on('git.status',this.onGitStatus)
        this.frontRoundOffset = 0
        this.refreshTimer = null
    }

    dirtree.prototype["tilde"] = function (item)
    {
        return item.tilde = _k_.lpad(item.depth * 2 + 1) + diritem.symbolName(item)
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

    dirtree.prototype["setRoot"] = async function (path, opt)
    {
        var dir, item, items, parent, _121_29_

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
        this.set(items,((_121_29_=opt.index) != null ? _121_29_ : 0))
        this.restoreSessionState(opt)
        if (opt.redraw)
        {
            return post.emit('redraw')
        }
    }

    dirtree.prototype["restoreSessionState"] = function (opt)
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
                this.openDir(this.itemForPath(key),opt)
            }
        }
    }

    dirtree.prototype["onSessionMerge"] = function (recent)
    {
        return this.setState(recent[this.name])
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

    dirtree.prototype["openDir"] = async function (dirItem, opt)
    {
        var depth, index, item, items, state, _246_48_, _258_20_, _260_26_

        if (_k_.empty(dirItem))
        {
            return
        }
        if (dirItem.open)
        {
            return
        }
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
            if (item.type === 'dir' && (state.open != null ? state.open[item.path] : undefined))
            {
                if (_k_.empty(opt.select) && _k_.empty(opt.index))
                {
                    opt.select = dirItem
                }
                opt.redraw = true
                this.openDir(item,opt)
            }
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
        if (opt.redraw)
        {
            return post.emit('redraw')
        }
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

    dirtree.prototype["dirItems"] = async function (dir, info)
    {
        var items

        try
        {
            return items = await nfs.list(dir,{recursive:false})
        }
        catch (err)
        {
            console.error(`list error -- ${info}`,err)
            return
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlydHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQU07SUFBSztJQUFLO0lBQU07SUFBSztJQUFJOztPQUMvQixhQUFSOztPQUNRLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFVBQVI7O09BQ1EsbUJBQVo7O09BQ1ksY0FBQTs7T0FFWixLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7QUFFcEQsV0FBRDs7d0JBQVM7YUFFTCxTQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7O2dEQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLE1BQU0sT0FBTyxRQUFRO1FBRXRCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsYUFBZ0IsS0FBQztRQUV6QixLQUFDLG1CQUFtQjtRQUNwQixLQUFDLGVBQWU7Ozt1QkFFcEIsb0JBQU87O2VBQVEsS0FBSyxpQkFBYSxLQUFLLFFBQU0sSUFBRSxLQUFLLFFBQVEsV0FBVzs7O3VCQUV0RSwwQkFBYTs7Ozs0QkFNRyxLQUFDOzs7WUFBVDtnQkFFRyxLQUFLLE1BQU0sU0FBUzs7Z0JBQU87O3FCQUV0QixLQUFLLFNBQVE7O2dCQUVqQixjQUFjOzJCQUVYLEtBQUssS0FBUSxPQUFPOzt5QkFFZixRQUFRLE9BQU87OzRCQUNaLEtBQUssV0FBVyxLQUFLOzs0QkFDcEIsS0FBSyxXQUFXOzRCQUNoQixLQUFDLE1BQU07NEJBQ1AsU0FBUzs0QkFDVCxjQUFjOzRCQUNkOzs7O29CQUVULEtBQUssYUFBaUI7OzJCQUVkLEtBQUs7b0JBQ1osS0FBQyxNQUFNO29CQUNQLFNBQVM7Ozs7OzJCQUlWLEtBQUssS0FBUSxPQUFPOztvQkFDbkIsS0FBSyxXQUFXO29CQUNoQixLQUFDLE1BQU07b0JBQ1AsU0FBUzs7MkJBRVYsS0FBSyxLQUFR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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dirtree.kode
