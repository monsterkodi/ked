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
        this.mouseItems = [this.knob,this.crumbs,this.dirtree]
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
        var allow, part, root, _64_27_, _64_36_, _64_44_

        if (_k_.empty(path))
        {
            return false
        }
        path = slash.absolute(slash.untilde(path))
        allow = ((_64_44_=((_64_27_=config.data) != null ? (_64_36_=_64_27_.dirtree) != null ? _64_36_.allow : undefined : undefined)) != null ? _64_44_ : [])
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
        var args, root, _117_24_

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
        var cols, _216_26_, _216_31_

        this.toggle()
        this.active = this.visible()
        ked_session.set('dircol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        if (!((_216_26_=config.data) != null ? (_216_31_=_216_26_.zen) != null ? _216_31_.enable : undefined : undefined))
        {
            post.emit('view.size',this.name,'right',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
        }
        if (this.hidden())
        {
            post.emit('focus','editor')
            return post.emit('redraw')
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

            case 'shift+alt+cmd+[':
                return post.emit('view.size',this.name,'right',-1)

            case 'shift+alt+cmd+]':
                return post.emit('view.size',this.name,'right',1)

        }

        return this.dirtree.onKey(key,event)
    }

    return dircol
})()

export default dircol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9kaXJjb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLOztPQUNMLFdBQVA7O09BQ08sWUFBWjtPQUFrQixZQUFsQjtPQUF3QixZQUF4Qjs7T0FDWSxhQUFYOztPQUNXLFdBQWY7T0FBb0IsV0FBcEI7T0FBeUIsYUFBekI7T0FBZ0MsWUFBaEM7O09BQ2UsY0FBZjs7T0FDZSxjQUFBOzs7QUFDckIsVUFBRDs7dUJBQVE7YUFDSixRQUFHLFFBQVEsUUFBTzs7UUFBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUVBLE9BQU8sU0FBUztRQUV0QixLQUFDLFlBQVk7UUFDYixLQUFDLFNBQVk7UUFFYixLQUFDLGNBQWM7UUFDZixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWMsS0FBUSxVQUFVLEtBQUM7UUFDbEMsS0FBQyxhQUFjLE9BQVEsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsY0FBYyxRQUFRLFVBQVUsS0FBQyxnQkFBZ0I7UUFFbEQsS0FBQyxjQUFjLEtBQUMsS0FBSyxLQUFDLE9BQU8sS0FBQztRQUU5QixLQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUM7UUFFckIsS0FBSyxNQUFNLFFBQVE7UUFFbkIsS0FBQyxRQUFRLFNBQVMsS0FBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsUUFBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsY0FBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsZUFBZ0I7UUFFbEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFTO1FBRWxDLEtBQUMsS0FBUSxTQUFTLEtBQWdCO1FBRWxDLEtBQUMsT0FBUSxTQUFTLFFBQWdCLE1BQU0sT0FBTztRQUUvQyxLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQztR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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dircol.kode
