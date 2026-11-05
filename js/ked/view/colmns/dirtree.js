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
        var dir, item

        if (info.path.startsWith(this.currentRoot))
        {
            if (info.change === 'rename')
            {
                dir = slash.dir(info.path)
                var list = _k_.list(this.items)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    item = list[_a_]
                    if (item.path === info.path)
                    {
                        return
                    }
                    if (item.path === dir)
                    {
                        console.log(`item ${dir}`,item)
                    }
                }
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
        var dir, item, items, parent, _125_29_

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
        parent = slash.dir(dir)
        if (parent)
        {
            items.unshift({type:'dir',file:slash.name(parent),path:parent,tilde:' ' + icons.dir + '\u00A0..'})
        }
        this.set(items,((_125_29_=opt.index) != null ? _125_29_ : 0))
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
        var depth, index, item, items, state, _248_48_, _260_20_, _262_26_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlydHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQU07SUFBSztJQUFLO0lBQU07SUFBSzs7T0FDM0IsYUFBUjs7T0FDUSxZQUFUO09BQWUsWUFBZjs7T0FDUyxVQUFSOztPQUNRLG1CQUFaOztPQUNZLGNBQUE7O09BRVosS0FBSyxLQUFLLGdCQUFnQixLQUFLLEVBQUUsS0FBSSxFQUFFLE9BQU87O0FBRXBELFdBQUQ7O3dCQUFTO2FBRUwsU0FBRyxRQUFPLE1BQUs7Ozs7Ozs7O2dEQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLE1BQU0sT0FBTyxRQUFRO1FBRXRCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsYUFBZ0IsS0FBQztRQUV6QixLQUFDLG1CQUFtQjs7O3VCQUV4QixvQkFBTzs7ZUFBUSxLQUFLLGlCQUFhLEtBQUssUUFBTSxJQUFFLEtBQUssUUFBUSxXQUFXOzs7dUJBRXRFLDBCQUFhOzs7OzRCQU1HLEtBQUM7OztZQUFUO2dCQUVHLEtBQUssTUFBTSxTQUFTOztnQkFBTzs7cUJBRXRCLEtBQUssU0FBUTs7Z0JBRWpCLGNBQWM7MkJBRVgsS0FBSyxLQUFRLE9BQU87O3lCQUVmLFFBQVEsT0FBTzs7NEJBQ1osS0FBSyxXQUFXLEtBQUs7OzRCQUNwQixLQUFLLFdBQVc7NEJBQ2hCLEtBQUMsTUFBTTs0QkFDUCxTQUFTOzRCQUNULGNBQWM7NEJBQ2Q7Ozs7b0JBRVQsS0FBSyxhQUFpQjs7MkJBRWQsS0FBSztvQkFDWixLQUFDLE1BQU07b0JBQ1AsU0FBUzs7Ozs7MkJBSVYsS0FBSyxLQUFRLE9BQU87O29CQUNuQixLQUFLLFdBQVc7b0JBQ2hCLEtBQUMsTUFBTTtvQkFDUCxTQUFTOzsyQkFFVixLQUFLLEtBQVEsT0FBTzs7b0JBQ25CLEtBQUssUUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dirtree.kode
