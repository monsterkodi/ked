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
        var allow, part, root, _62_27_, _62_36_, _62_44_

        if (_k_.empty(path))
        {
            return false
        }
        path = slash.absolute(slash.untilde(path))
        allow = ((_62_44_=((_62_27_=config.data) != null ? (_62_36_=_62_27_.dirtree) != null ? _62_36_.allow : undefined : undefined)) != null ? _62_44_ : [])
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
        if (this.isRootItem(item,root) || slash.samePath(item.path,'/'))
        {
            return [icons.dir_open + ' ']
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
        var args, root, _115_24_

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

        item = this.dirtree.itemAtEvent(event)
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
        return await this.dirtree.onReveal(p)
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
