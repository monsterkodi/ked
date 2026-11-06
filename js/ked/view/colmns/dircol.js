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

    dircol["allowedRoots"] = function ()
    {
        var _58_33_, _58_42_, _58_50_

        return ((_58_50_=((_58_33_=config.data) != null ? (_58_42_=_58_33_.dirtree) != null ? _58_42_.allow : undefined : undefined)) != null ? _58_50_ : [])
    }

    dircol["isAllowedPath"] = function (path, allow)
    {
        var part, root

        if (_k_.empty(path))
        {
            return false
        }
        path = slash.absolute(slash.untilde(path))
        var list = _k_.list(slash.pathlist(path))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            part = list[_a_]
            var list1 = (allow != null ? allow : [])
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

    dircol["itemAtEvent"] = function (event, dirtree)
    {
        var col, row

        var _a_ = dirtree.eventPos(event); col = _a_[0]; row = _a_[1]

        if (!dirtree.cells.inside(col,row))
        {
            return null
        }
        return dirtree.choiceAtRow(row + dirtree.state.s.view[1])
    }

    dircol["contextItems"] = function (item, root, allow)
    {
        var create

        if (_k_.empty(item))
        {
            return []
        }
        if (!this.isAllowedPath(item.path,allow))
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

    dircol["contextActionAllowed"] = function (item, root, choice, allow)
    {
        if (_k_.empty(item))
        {
            return false
        }
        if (!this.isAllowedPath(item.path,allow))
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
        var args, root, _129_24_

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

        item = dircol.itemAtEvent(event,this.dirtree)
        if (_k_.empty(item))
        {
            this.dirtree.state.deselect()
            item = {type:'dir',path:this.dirtree.currentRoot}
        }
        this.contextItem = item
        items = dircol.contextItems(item,this.dirtree.currentRoot,dircol.allowedRoots())
        if (_k_.empty(items))
        {
            return true
        }
        return context.show(event.cell,this.onContextChoice,items)
    }

    dircol.prototype["onContextChoice"] = async function (choice)
    {
        var current, dir

        if (current = this.contextItem)
        {
            if (!dircol.contextActionAllowed(current,this.dirtree.currentRoot,choice,dircol.allowedRoots()))
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
