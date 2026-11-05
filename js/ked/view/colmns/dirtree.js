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
        var dir, item, items, parent, _119_29_

        opt = (opt != null ? opt : {})
        dir = slash.untilde(path)
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
        this.set(items,((_119_29_=opt.index) != null ? _119_29_ : 0))
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
        var depth, index, item, items, state, _242_48_, _254_20_, _256_26_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlydHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQU07SUFBSztJQUFLO0lBQU07SUFBSzs7T0FDM0IsYUFBUjs7T0FDUSxZQUFUO09BQWUsWUFBZjs7T0FDUyxVQUFSOztPQUNRLG1CQUFaOztPQUNZLGNBQUE7O09BRVosS0FBSyxLQUFLLGdCQUFnQixLQUFLLEVBQUUsS0FBSSxFQUFFLE9BQU87O0FBRXBELFdBQUQ7O3dCQUFTO2FBRUwsU0FBRyxRQUFPLE1BQUs7Ozs7Ozs7OztnREFFTCxPQUFPLEtBQUs7UUFFbEIsS0FBQyxNQUFNLE9BQU8sUUFBUTtRQUV0QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGFBQWdCLEtBQUM7UUFFekIsS0FBQyxtQkFBbUI7UUFDcEIsS0FBQyxlQUFlOzs7dUJBRXBCLG9CQUFPOztlQUFRLEtBQUssaUJBQWEsS0FBSyxRQUFNLElBQUUsS0FBSyxRQUFRLFdBQVc7Ozt1QkFFdEUsMEJBQWE7Ozs7NEJBTUcsS0FBQzs7O1lBQVQ7Z0JBRUcsS0FBSyxNQUFNLFNBQVM7O2dCQUFPOztxQkFFdEIsS0FBSyxTQUFROztnQkFFakIsY0FBYzsyQkFFWCxLQUFLLEtBQVEsT0FBTzs7eUJBRWYsUUFBUSxPQUFPOzs0QkFDWixLQUFLLFdBQVcsS0FBSzs7NEJBQ3BCLEtBQUssV0FBVzs0QkFDaEIsS0FBQyxNQUFNOzRCQUNQLFNBQVM7NEJBQ1QsY0FBYzs0QkFDZDs7OztvQkFFVCxLQUFLLGFBQWlCOzsyQkFFZCxLQUFLO29CQUNaLEtBQUMsTUFBTTtvQkFDUCxTQUFTOzs7OzsyQkFJVixLQUFLLEtBQVEsT0FBTzs7b0JBQ25CLEtBQUssV0FBVztvQkFDaEIsS0FBQyxNQUFNO29CQUNQLFNBQVM7OzJCQUVWLEtBQUssS0FBUSxPQUFPOztvQkFDbkIsS0FBSyxRQUFRO29CQUNiLEtBQUMsTUFBTTtvQkFDUCxTQUFTOztvQkFFVixLQUFLLHFCQUFhLEtBQUssS0FBWSxPQUFPLGFBQVcsS0FBSyxrQkFBVSxLQUFLLEtBQVksT0FBTzs7MkJBQ3BGLEtBQUs7b0JBQ1osS0FBQyxNQUFNO29CQUNQLFNBQVM7Ozs7WUFFbEI7O1lBQ0MsS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO21CQUNiLEtBQUssS0FBSzs7Ozt1QkFFbEIsMkJBQWM7O2FBRUQsS0FBSyxLQUFLLFdBQVcsS0FBQzs7OztnQkFFeEIsS0FBSzs7aUJBQ1I7aUJBQ0E7aUJBQ0E7dUJBQVcsS0FBQzs7Ozs7O3VCQUVwQjs7WUFFa0MsS0FBQzs7WUFBL0IsYUFBYSxLQUFDOztlQUNkLEtBQUMsZUFBZTs7bUJBQWUsS0FBQyxRQUFRLEtBQUMsYUFBWSxPQUFPLEtBQUssTUFBTSxLQUFDO3VCQUFnQjs7O3VCQUU1Riw0QkFBUyxNQUFLOzs7O1FBRVYsT0FBQSxjQUFBO1FBRUEsTUFBTSxNQUFNLFFBQVE7UUFFcEIsY0FBUyxLQUFDLFNBQVMsSUFBSTtRQUV2QixLQUFDLGNBQWM7NEJBRUg7OztZQUFSO1lBQ0EsS0FBSyxRQUFRO1lBQ2IsS0FBQyxNQUFNOztRQUVYLE1BQU0sZ0JBQU0sR0FBRTs7bUJBQU0sS0FBQyxPQUFPLEtBQUssS0FBQyxPQUFPOztRQUV6QyxTQUFTLE1BQU0sSUFBSTtZQUNoQjs7WUFDQyxNQUFNLFNBQ0YsS0FBTSxNQUNOLEtBQU0sTUFBTSxLQUFLLFFBQ2pCLEtBQU0sT0FDTixNQUFPLE1BQU0sTUFBTSxNQUFNOztRQUlqQyxLQUFDLElBQUksaUJBQU0sSUFBSSw0QkFBUTtRQUV2QixLQUFDLG9CQUFvQjtZQUVDLElBQUk7O21CQUExQixLQUFLLEtBQUs7Ozs7dUJBRWQsa0NBQXFCOzs7O1FBRWpCLE9BQUEsY0FBQTtRQUNBLElBQUksU0FBUztRQUViLFFBQVEsWUFBWSxJQUFJLEtBQUM7c0JBRWQsTUFBTTs7OzthQUViLE9BQWEsTUFBTTs7WUFBZixRQUFTLE1BQU07Z0JBRWhCLElBQUksV0FBVyxLQUFDOztnQkFDZixLQUFDLFFBQVEsS0FBQyxZQUFZLEtBQUs7Ozs7O3VCQUV2Qyw2QkFBZ0I7O2VBQVUsS0FBQyxTQUFTLE9BQU8sS0FBQzs7O3VCQUU1Qyx1QkFBVTs7c0JBRUs7Ozs7Y0FDTyxVQUFUOzs7O2VBSVQsWUFBWSxJQUFJLEtBQUMsS0FBSzs7O3VCQUUxQix5QkFBWSxRQUFPLFFBQU87O1lBSW5CLFdBQVU7O1lBQ1QsS0FBQztpQkFDRyxNQUFNLE9BQU8sTUFBTSxRQUFTLE9BQU8sU0FBUTs7Z0JBQzNDLEtBQUssS0FBSyxTQUFTLE9BQU87Ozs7WUFHL0IsV0FBVTs7Z0JBQ04sT0FBTyxTQUFROztnQkFDZCxLQUFLLEtBQUssYUFBYSxPQUFPOzs7O2dCQUcvQixPQUFPOztpQkFFVjt3QkFFVzs7eUJBRUg7eUJBQ0E7NEJBQ1MsTUFBTSxXQUFVOzs7OzRCQUNsQixXQUFVLFdBQVksTUFBTSxRQUFRLE9BQU8sTUFBTSxTQUFTOzttQ0FDdkQsS0FBSyxLQUFLLGNBQWMsT0FBTzs7NkJBRTlCLE9BQU87OzRCQUFPLEtBQUMsUUFBUSxRQUFPLE9BQU87Ozs7NEJBQ3ZDLEtBQUMsU0FBUzs7Ozt5QkFHbkI7NEJBQ08sT0FBTyxNQUFNLFNBQVM7O21DQUFVLEtBQUMsY0FBYzs7NkJBQzNDLE9BQU87OzRCQUFPLEtBQUMsUUFBUSxRQUFPLE9BQU87Ozs7NEJBQ3ZDLEtBQUM7Ozs7eUJBR1Y7NEJBQ08sT0FBTyxNQUFNLFNBQVM7Ozs7NEJBQ3RCLE9BQU87OzRCQUFPLEtBQUMsU0FBUyxRQUFPLE9BQU87Ozs7NEJBQ3BDLEtBQUM7Ozs7eUJBR1Y7eUJBQ0E7NEJBQ08sT0FBTyxNQUFNLFNBQVM7Ozs7NkJBQ2dCLE9BQU87OzRCQUFoRCxLQUFDOzs0QkFDZ0MsT0FBTzs7NEJBQXhDLEtBQUMsU0FBUyxRQUFPLE9BQU87Ozs7eUJBRzVCO3lCQUNBOytCQUFhLEtBQUssS0FBSyxjQUFjLE9BQU87Ozs7O2lCQUVwRDt3QkFFVzs7eUJBRUg7K0JBQWEsS0FBQzs7eUJBQ2Q7K0JBQWEsS0FBQzs7eUJBRWQ7eUJBQ0E7K0JBQWEsS0FBQzs7eUJBRWQ7eUJBQ0E7K0JBQWEsS0FBSyxLQUFLLFNBQVMsT0FBTzs7eUJBRXZDO3lCQUNBOzZCQUNTLGdCQUFBLE1BQU8sd0JBQVU7Ozs7K0JBQ3BCLEtBQUssS0FBSyxZQUFZLE9BQU87Ozs7Ozs7c0RBRXpDLE9BQU8sT0FBTzs7O3VCQUV4Qiw0QkFBUyxTQUFROzs7O3NCQUVGOzs7O1lBQ04sUUFBUTs7OztRQUViLE9BQUEsY0FBQTtRQUVBLFFBQVEsT0FBTztRQUVmLGNBQVMsS0FBQyxTQUFTLFFBQVEsS0FBSztRQUVoQyxRQUFRLFFBQVEsUUFBUSxNQUFNLFFBQVEsTUFBTSxVQUFVLE1BQU07UUFFNUQsUUFBUSxZQUFZLElBQUksS0FBQztRQUV6QixRQUFRLFFBQVEsUUFBUTs0QkFDWjs7O1lBQVI7WUFDQSxLQUFLLFFBQVE7WUFDYixLQUFDLE1BQU07Z0JBQ0osS0FBSyxTQUFRLFVBQVUsTUFBTSxlQUFOLE1BQU0sS0FBTSxLQUFLOzs4QkFDOUIsSUFBSSxxQkFBaUIsSUFBSTs7b0JBQzlCLElBQUksU0FBUzs7Z0JBQ2pCLElBQUksU0FBUztnQkFDYixLQUFDLFFBQVEsS0FBSzs7O1FBRXRCLE1BQU0sZ0JBQU0sR0FBRTs7bUJBQU0sS0FBQyxPQUFPLEtBQUssS0FBQyxPQUFPOztRQUV6QyxRQUFRLEtBQUMsTUFBTSxRQUFRO1FBRXZCLE1BQU0sT0FBTyxLQUFDLE1BQU0sUUFBTSxFQUFFO2FBRXpCLElBQUk7O1lBQ0gsUUFBUSxJQUFJOztrQkFDUixJQUFJOztZQUNSLFFBQVEsS0FBQyxNQUFNLFFBQVEsSUFBSTs7UUFFL0IsS0FBQyxJQUFJLEtBQUMsTUFBTTtRQUVaLFlBQVksT0FBTyxLQUFDLGFBQWEsUUFBUSxPQUFPO1FBRWhELElBQUksT0FBTyxRQUFRO1lBRUcsSUFBSTs7bUJBQTFCLEtBQUssS0FBSzs7Ozt1QkFFZCx1QkFBVSxTQUFROzs7O3NCQUVIOzs7O1FBRVgsT0FBQSxjQUFBO1FBRUEsUUFBUSxPQUFPO1FBRWYsUUFBUSxRQUFRLFFBQVEsTUFBTSxRQUFRLE1BQU0sU0FBUyxNQUFNO1FBRTNELFFBQVEsS0FBQyxNQUFNLFFBQVE7UUFFdkIsY0FBYztlQUNSLFFBQU0sY0FBWSxJQUFJLEtBQUMsTUFBTSxVQUFXLEtBQUMsTUFBTSxRQUFNLGNBQVksR0FBRyxLQUFLLFdBQVcsUUFBUTs7WUFDOUYsZUFBZTs7UUFFbkIsTUFBTSxRQUFRLEtBQUMsTUFBTSxRQUFNLEVBQUU7UUFFN0IsS0FBQyxJQUFJLEtBQUMsTUFBTTtRQUVaLFlBQVksT0FBTyxLQUFDLGFBQWEsUUFBUTtZQUVuQixJQUFJOzttQkFBMUIsS0FBSyxLQUFLOzs7O3VCQUVkLDZCQUFVLEtBQUk7Ozs7OzttQkFHTixjQUFTLElBQUksS0FBSyxLQUFJLFVBQVU7O2VBQzlCOztZQUNGLCtCQUF1QixPQUFPOzs7Ozt1QkFHdEMsa0JBQUssT0FBTSxRQUFNOzs7O1FBRWIsU0FBUyxLQUFDLE1BQU0sRUFBRSxLQUFLO3dDQUNqQixNQUFNO1FBQ1osS0FBQyxNQUFNLFNBQVMsRUFBRTtRQUNsQixLQUFDLE1BQU0sV0FBVztlQUNsQixLQUFDLE1BQU0sY0FBYyxFQUFFOzs7dUJBRTNCOztRQUVJLEtBQUM7WUFDcUMsS0FBQyxVQUFVLFNBQVE7O1lBQXpELEtBQUssS0FBSyxTQUFTLEtBQUMsVUFBVTs7ZUFDOUIsS0FBQyxNQUFNLFNBQVMsRUFBRSxLQUFDLE1BQU0sRUFBRSxLQUFLLEtBQUc7Ozt1QkFFdkM7O1lBRU8sS0FBQyxVQUFVLFNBQVEsVUFBVyxZQUFZLElBQUksbUJBQWtCLEtBQUMsVUFBVTs7WUFDMUUsS0FBSyxLQUFLLFNBQVMsS0FBQyxVQUFVOzs7UUFHbEMsS0FBQztZQUNxQyxLQUFDLFVBQVUsU0FBUTs7WUFBekQsS0FBSyxLQUFLLFNBQVMsS0FBQyxVQUFVOztlQUM5QixLQUFDLE1BQU0sU0FBUyxFQUFFLEtBQUMsTUFBTSxFQUFFLEtBQUssS0FBRzs7O3VCQUV2Qzs7OztRQUVJLFFBQVEsS0FBQyxRQUFRLFFBQVEsS0FBQztRQUMxQixTQUFTO2VBQ0gsUUFBUSxLQUFNLEtBQUMsUUFBUSxPQUFPLFNBQVMsS0FBQyxVQUFVLFVBQWMsS0FBQyxRQUFRLE9BQU87O1lBQ2xGLFNBQVM7O1FBQ2IsS0FBQyxNQUFNLFdBQVc7ZUFDbEIsS0FBQyxNQUFNLGNBQWMsRUFBRTs7O3VCQUUzQjs7OztRQUVJLFFBQVEsS0FBQyxRQUFRLFFBQVEsS0FBQztRQUMxQixTQUFTO2VBQ0gsUUFBUSxLQUFNLEtBQUMsUUFBUSxPQUFPLFNBQVMsS0FBQyxVQUFVOztZQUNwRCxTQUFTOztRQUNiLEtBQUMsTUFBTSxXQUFXO2VBQ2xCLEtBQUMsTUFBTSxjQUFjLEVBQUU7Ozt1QkFFM0I7Ozs7WUFFTyxLQUFLLEtBQUM7O1lBQ0wsS0FBSyxNQUFNLE9BQU87WUFDbEIsSUFBSyxLQUFHLEtBQUMsTUFBTSxFQUFFLEtBQUs7Z0JBQ25CLElBQUksS0FBQyxNQUFNLFFBQVMsS0FBSyxLQUFDLE1BQU0sRUFBRSxNQUFNOztnQkFDdkMsS0FBSyxLQUFLLFVBQVUsS0FBQyxNQUFNLEVBQUUsTUFBTSxJQUFJO2dCQUN2QyxLQUFDLE1BQU0sSUFBSSxLQUFHLElBQUUsS0FBQyxNQUFNLEVBQUUsS0FBSyxHQUFHLEVBQUUsSUFBSSxHQUFHLEtBQUMsTUFBTTsrQkFDN0MsSUFBSyxVQUFLLEtBQUMsTUFBTSx3QkFBUCxLQUFDLE1BQU0sV0FBUCxLQUFDLE1BQU07O29CQUNqQixLQUFDLE1BQU0sT0FBTyxJQUFFLEtBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxFQUFFOzs7Ozs7O3VCQUluRDs7OztRQUVJLGNBQWMsWUFBWSxJQUFJO3NCQUVuQjs7Ozs0QkFFSyxLQUFDO2FBQVI7O1lBQUw7Z0JBQ1MsS0FBSyxTQUFROzt1QkFBcEI7Ozs7O3VCQUVWLDBCQUFhOzs7OzRCQUVPLEtBQUM7YUFBUjs7WUFBTDtnQkFDVSxNQUFNLFNBQVMsS0FBSyxLQUFLOzt1QkFBakM7Ozs7O3VCQUVWLCtCQUFrQjs7Ozs0QkFFRSxLQUFDO2FBQVI7O1lBQUw7Z0JBQ1MsTUFBTSxTQUFTLEtBQUssS0FBSzs7dUJBQWhDOzs7Ozt1QkFFVixxQkFBUTs7OztRQUVKLElBQUksTUFBTSxNQUFNLEtBQUs7UUFFckIsSUFBSTtZQUNVLEtBQUssU0FBUTs7WUFBM0IsS0FBSzs7UUFDTCxLQUFLLEtBQUssT0FBTyxFQUFFO2VBQ25COzs7V0FqWFA7OztlQW1YTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dirtree.kode
