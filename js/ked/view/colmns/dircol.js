var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var dircol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import config from "../../util/config.js"

import view from "../base/view.js"
import knob from "../base/knob.js"
import crumbs from "../base/crumbs.js"
import input from "../base/input.js"

import context from "../menu/context.js"

import dirtree from "./dirtree.js"


dircol = (function ()
{
    _k_.extend(dircol, view)
    function dircol (screen, editor, features)
    {
        this.editor = editor
    
        var bg, root

        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onShow"] = this["onShow"].bind(this)
        this["onToggle"] = this["onToggle"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["rename"] = this["rename"].bind(this)
        this["onReveal"] = this["onReveal"].bind(this)
        this["onContextChoice"] = this["onContextChoice"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["setRoot"] = this["setRoot"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        dircol.__super__.constructor.call(this,screen,'dircol',features)
        this.isVisible = false
        this.active = true
        this.contextItem = null
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.crumbs = new crumbs(screen,`${this.name}_crumbs`)
        this.dirtree = new dirtree(screen,`${this.name}_dirtree`,['scroll'])
        this.crumbs.on('action',this.onCrumbsAction)
        bg = theme.dirtree.bg
        this.dirtree.setColor('bg',bg)
        this.dirtree.setColor('empty',bg)
        this.dirtree.setColor('cursor_main',bg)
        this.dirtree.setColor('cursor_empty',bg)
        this.dirtree.scroll.setColor('bg',bg)
        this.knob.setColor('bg',bg)
        this.crumbs.setColor('empty',theme.gutter.bg)
        post.on('dircol.reveal',this.onReveal)
        post.on('dircol.resize',this.onResize)
        post.on('dircol.toggle',this.onToggle)
        post.on('dircol.show',this.onShow)
        post.on('dircol.root',this.setRoot)
        post.on('dircol.focus',(function ()
        {
            return this.dirtree.grabFocus()
        }).bind(this))
        post.on('session.merge',this.onSessionMerge)
        root = ked_session.get('dircol▸root',process.cwd())
        this.setRoot(root)
    }

    dircol["isParentItem"] = function (item)
    {
        return !_k_.empty((item != null ? item.tilde : undefined)) && item.tilde.endsWith('..')
    }

    dircol["isRootItem"] = function (item, root)
    {
        return !_k_.empty(item) && slash.samePath(item.path,root)
    }

    dircol["isInSystemRoot"] = function (item)
    {
        return !_k_.empty(item) && slash.samePath(slash.dir(item.path),'/')
    }

    dircol["isAllowedPath"] = function (path)
    {
        var allow, part, root, _63_27_, _63_36_, _63_44_

        if (_k_.empty(path))
        {
            return false
        }
        path = slash.absolute(slash.untilde(path))
        allow = ((_63_44_=((_63_27_=config.data) != null ? (_63_36_=_63_27_.dirtree) != null ? _63_36_.allow : undefined : undefined)) != null ? _63_44_ : [])
        var list = _k_.list(slash.pathlist(path))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            part = list[_a_]
            var list1 = _k_.list(allow)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                root = list1[_b_]
                if (part === slash.absolute(slash.untilde(root)))
                {
                    return true
                }
            }
        }
        return false
    }

    dircol["contextItems"] = function (item, root)
    {
        var create

        if (_k_.empty(item))
        {
            return []
        }
        if (!this.isAllowedPath(item.path))
        {
            return []
        }
        if (this.isParentItem(item))
        {
            return []
        }
        create = [icons.dir_open + ' ']
        if (this.isRootItem(item,root) || slash.samePath(item.path,'/'))
        {
            return create
        }
        if (this.isInSystemRoot(item))
        {
            return []
        }
        return ['\uF044 ','\uF0C5 ',icons.dir_open + " ",'\uF014 ']
    }

    dircol["contextActionAllowed"] = function (item, root, choice)
    {
        if (_k_.empty(item))
        {
            return false
        }
        if (!this.isAllowedPath(item.path))
        {
            return false
        }
        if (this.isParentItem(item))
        {
            return false
        }
        if (this.isInSystemRoot(item))
        {
            return false
        }
        if (this.isRootItem(item,root) || slash.samePath(item.path,'/'))
        {
            return choice === icons.dir_open
        }
        return true
    }

    dircol.prototype["onCrumbsAction"] = function (action, path)
    {
        if (action === 'click')
        {
            return this.setRoot(path)
        }
    }

    dircol.prototype["onSessionMerge"] = function (recent)
    {
        var args, root, _119_24_

        if (_k_.empty(recent.dircol))
        {
            return
        }
        args = ked_session.get('ked▸args',{})
        if (!_k_.empty(args.options))
        {
            root = slash.dir(args.options[0])
        }
        else
        {
            root = recent.dircol.root
        }
        if (root)
        {
            this.setRoot(root)
        }
        if ((recent.funcol != null ? recent.funcol.active : undefined))
        {
            this.active = true
            this.show()
        }
        return ked_session.set('dircol',recent.dircol)
    }

    dircol.prototype["setRoot"] = function (path)
    {
        if (_k_.empty(path))
        {
            return
        }
        path = slash.absolute(path,process.cwd())
        path = slash.tilde(path)
        this.crumbs.set(path)
        this.dirtree.setRoot(path,{redraw:true})
        return ked_session.set('dircol▸root',path)
    }

    dircol.prototype["layout"] = function (x, y, w, h)
    {
        this.crumbs.layout(x,y,w,1)
        this.dirtree.layout(x,y + 1,w,h - 1)
        this.knob.layout(x + w - 1,y + 1,1,h - 1)
        return dircol.__super__.layout.call(this,x,y,w,h)
    }

    dircol.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        this.cells.fill_rect(0,1,-1,-1,' ',null,this.dirtree.color.bg)
        this.cells.fill_rect(0,0,-1,0,' ',null,this.crumbs.color.empty)
        this.crumbs.draw()
        this.dirtree.draw()
        this.knob.draw()
        return dircol.__super__.draw.call(this)
    }

    dircol.prototype["onContext"] = function (event)
    {
        var item, items

        item = this.itemAtEvent(event)
        if (_k_.empty(item))
        {
            this.dirtree.state.deselect()
            item = {type:'dir',path:this.dirtree.currentRoot}
        }
        this.contextItem = item
        items = dircol.contextItems(item,this.dirtree.currentRoot)
        if (_k_.empty(items))
        {
            return true
        }
        return context.show(event.cell,this.onContextChoice,items)
    }

    dircol.prototype["itemAtEvent"] = function (event)
    {
        var col, row

        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        if (!this.cells.inside(col,row))
        {
            return
        }
        return this.choiceAtRow(row + this.state.s.view[1])
    }

    dircol.prototype["onContextChoice"] = async function (choice)
    {
        var current, dir

        if (current = this.contextItem)
        {
            if (!dircol.contextActionAllowed(current,this.dirtree.currentRoot,choice))
            {
                return
            }
            switch (choice)
            {
                case '':
                    return this.rename()

                case '':
                    return post.emit('file.duplicate',current.path)

                case icons.dir_open:
                    dir = current.path
                    if (current.type === 'file')
                    {
                        dir = slash.dir(dir)
                    }
                    return post.emit('file.new_folder',dir)

                case '':
                    return post.emit('file.trash',current.path)

            }

        }
    }

    dircol.prototype["onReveal"] = async function (p)
    {
        var d, dd, item

        this.dirtree.grabFocus()
        if (item = this.dirtree.itemForPath(p))
        {
            this.select(item)
            return
        }
        if (d = this.dirtree.itemForPath(slash.dir(p)))
        {
            if (!d.open)
            {
                await this.dirtree.openDir(d,{redraw:true})
            }
            else
            {
                console.error(`dircol.onReveal already open? ${d}`)
            }
        }
        else
        {
            if (dd = this.dirtree.itemForPath(slash.dir(slash.dir(p))))
            {
                if (!dd.open)
                {
                    await this.dirtree.openDir(dd)
                    await this.dirtree.openDir(d,{redraw:true})
                }
                else
                {
                    console.error(`dircol.onReveal already open dd? ${d}`)
                }
            }
            else
            {
                this.setRoot(d)
            }
        }
        return this.dirtree.grabFocus()
    }

    dircol.prototype["rename"] = function ()
    {
        var current, fileName, ox, w, x, y

        current = this.dirtree.current()
        ox = belt.numIndent(current.tilde) + 2
        x = this.dirtree.cells.x + ox
        y = this.dirtree.cells.y + this.dirtree.currentIndex()
        w = this.dirtree.cells.cols - ox
        fileName = slash.file(current.path)
        return post.emit('input.popup',{text:fileName,x:x,y:y,w:w,cb:(function (res)
        {
            if (this.hover)
            {
                this.dirtree.grabFocus()
            }
            if (res !== fileName)
            {
                return post.emit('file.rename',current.path,slash.path(slash.dir(current.path),res))
            }
        }).bind(this)})
    }

    dircol.prototype["onResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    dircol.prototype["onToggle"] = function ()
    {
        var cols

        this.toggle()
        this.active = this.visible()
        ked_session.set('dircol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        post.emit('view.size',this.name,'right',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
        if (this.hidden())
        {
            return post.emit('focus','editor')
        }
        else
        {
            return this.dirtree.grabFocus()
        }
    }

    dircol.prototype["onShow"] = function ()
    {
        if (this.hidden())
        {
            return this.onToggle()
        }
        else
        {
            return this.dirtree.grabFocus()
        }
    }

    dircol.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        ret = dircol.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.knob.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.crumbs.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.dirtree.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
    }

    dircol.prototype["onWheel"] = function (event)
    {
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        return this.dirtree.onWheel(event)
    }

    dircol.prototype["onKey"] = function (key, event)
    {
        if (!this.dirtree.hasFocus())
        {
            return
        }
        switch (key)
        {
            case 'f2':
                return this.rename()

            case 'cmd+left':
            case 'ctrl+left':
                return this.setRoot(slash.dir(this.dirtree.currentRoot))

        }

        return this.dirtree.onKey(key,event)
    }

    return dircol
})()

export default dircol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9kaXJjb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLOztPQUNMLFdBQVA7O09BQ08sWUFBWjtPQUFrQixZQUFsQjtPQUF3QixZQUF4Qjs7T0FDWSxhQUFYOztPQUNXLFdBQWY7T0FBb0IsV0FBcEI7T0FBeUIsYUFBekI7T0FBZ0MsWUFBaEM7O09BQ2UsY0FBZjs7T0FDZSxjQUFBOzs7QUFDckIsVUFBRDs7dUJBQVE7YUFDSixRQUFHLFFBQVEsUUFBTzs7UUFBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FFQSxPQUFPLFNBQVM7UUFFdEIsS0FBQyxZQUFZO1FBQ2IsS0FBQyxTQUFZO1FBRWIsS0FBQyxjQUFjO1FBQ2YsS0FBQyxjQUFjO1FBRWYsS0FBQyxXQUFjLEtBQVEsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsYUFBYyxPQUFRLFVBQVUsS0FBQztRQUNsQyxLQUFDLGNBQWMsUUFBUSxVQUFVLEtBQUMsZ0JBQWdCO1FBRWxELEtBQUMsT0FBTyxHQUFHLFNBQVMsS0FBQztRQUVyQixLQUFLLE1BQU0sUUFBUTtRQUVuQixLQUFDLFFBQVEsU0FBUyxLQUFnQjtRQUNsQyxLQUFDLFFBQVEsU0FBUyxRQUFnQjtRQUNsQyxLQUFDLFFBQVEsU0FBUyxjQUFnQjtRQUNsQyxLQUFDLFFBQVEsU0FBUyxlQUFnQjtRQUVsQyxLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQVM7UUFFbEMsS0FBQyxLQUFRLFNBQVMsS0FBZ0I7UUFFbEMsS0FBQyxPQUFRLFNBQVMsUUFBZ0IsTUFBTSxPQUFPO1FBRS9DLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dircol.kode
