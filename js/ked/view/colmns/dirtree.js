var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}}

var dirtree

import kxk from "../../../kxk.js"
let kutil = kxk.kutil
let kseg = kxk.kseg
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs

import prjcts from "../../index/prjcts.js"

import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import git from "../../util/git.js"

import choices from "../menu/choices.js"

import diritem from "./diritem.js"

import rgxs from './quicky.json' with { type : "json" }

dirtree = (function ()
{
    _k_.extend(dirtree, choices)
    function dirtree (screen, name, features)
    {
        this["dirItems"] = this["dirItems"].bind(this)
        this["setState"] = this["setState"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["setRoot"] = this["setRoot"].bind(this)
        this["onFileChange"] = this["onFileChange"].bind(this)
        this["onGitStatus"] = this["onGitStatus"].bind(this)
        dirtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax.setRgxs(rgxs)
        post.on('session.merge',this.onSessionMerge)
        post.on('file.change',this.onFileChange)
        post.on('git.status',this.onGitStatus)
        this.frontRoundOffset = 0
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
            if (item.type === 'dir')
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
        var item

        if (info.path.startsWith(this.currentRoot))
        {
            if (info.change === 'rename')
            {
                var list = _k_.list(this.items)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    item = list[_a_]
                    if (item.path === info.path)
                    {
                        return
                    }
                }
                this.setRoot(this.currentRoot,{redraw:true,index:this.currentIndex()})
            }
            if (_k_.in(info.change,['remove','deleted']))
            {
                var list1 = _k_.list(this.items)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    item = list1[_b_]
                    if (item.path === info.path)
                    {
                        this.setRoot(this.currentRoot,{redraw:true,index:this.currentIndex()})
                        return
                    }
                }
            }
        }
    }

    dirtree.prototype["setRoot"] = async function (path, opt)
    {
        var dir, item, items, _136_29_

        opt = (opt != null ? opt : {})
        dir = slash.untilde(path)
        items = await this.dirItems(dir,'dirtree.setRoot')
        this.currentRoot = dir
        if (_k_.empty(items))
        {
            return
        }
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
        this.set(items,((_136_29_=opt.index) != null ? _136_29_ : 0))
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
                        if (action === 'click' && event.mods)
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
                        if (event.button === 'right')
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
        var depth, index, item, items, state, _282_48_, _294_20_, _296_26_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlydHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWVPLEtBQUssS0FBSyxnQkFBZ0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOzs7O3dCQUU1Qjs7Ozs7Ozs7O2dEQUlYLE9BQU8sS0FBSztRQUVsQixLQUFDLE1BQU0sT0FBTyxRQUFRO1FBRXRCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsYUFBZ0IsS0FBQztRQUV6QixLQUFDLG1CQUFtQjs7Ozs7ZUFRVCxLQUFLLGlCQUFhLEtBQUssUUFBTSxJQUFFLEtBQUssUUFBUSxXQUFXOzs7Ozs7OzRCQVF0RCxLQUFDOzs7O2dCQUVOLEtBQUssU0FBUTs7Z0JBRVosY0FBYzsyQkFFWCxLQUFLLEtBQVEsT0FBTzs7aUNBRVAsT0FBTzs7NEJBQ1osS0FBSyxXQUFXLEtBQUs7OzRCQUNwQixLQUFLLFdBQVc7NEJBQ2hCLEtBQUMsTUFBTTs0QkFDUCxTQUFTOzRCQUNULGNBQWM7NEJBQ2Q7Ozs7b0JBRVQsS0FBSyxhQUFpQjs7MkJBRWQsS0FBSztvQkFDWixLQUFDLE1BQU07b0JBQ1AsU0FBUzs7Ozs7MkJBSVYsS0FBSyxLQUFRLE9BQU87O29CQUNuQixLQUFLLFdBQVc7b0JBQ2hCLEtBQUMsTUFBTTtvQkFDUCxTQUFTOzsyQkFFVixLQUFLLEtBQVEsT0FBTzs7b0JBQ25CLEtBQUssUUFBUTtvQkFDYixLQUFDLE1BQU07b0JBQ1AsU0FBUzs7b0JBRVYsS0FBSyxxQkFBYSxLQUFLLEtBQVksT0FBTyxhQUFXLEtBQUssa0JBQVUsS0FBSyxLQUFZLE9BQU87OzJCQUNwRixLQUFLO29CQUNaLEtBQUMsTUFBTTtvQkFDUCxTQUFTOzs7O1lBRWxCOztZQUNDLEtBQUMsSUFBSSxLQUFDLE1BQU0sS0FBQzttQkFDYixL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dirtree.kode
