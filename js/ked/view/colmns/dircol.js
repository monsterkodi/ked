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
        this["onShow"] = this["onShow"].bind(this)
        this["onToggle"] = this["onToggle"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["focusTree"] = this["focusTree"].bind(this)
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
        this.contextItem = null
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.crumbs = new crumbs(screen,`${this.name}_crumbs`)
        this.dirtree = new dirtree(screen,`${this.name}_dirtree`,['scroll'])
        this.mouseItems = [this.knob,this.crumbs,this.dirtree]
        this.wheelItems = [this.dirtree]
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
        post.on('dircol.focus',this.focusTree)
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
        var allow, part, root, _66_27_, _66_36_, _66_44_

        if (_k_.empty(path))
        {
            return false
        }
        path = slash.absolute(slash.untilde(path))
        allow = ((_66_44_=((_66_27_=config.data) != null ? (_66_36_=_66_27_.dirtree) != null ? _66_36_.allow : undefined : undefined)) != null ? _66_44_ : [])
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
        var args, root

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
        if (recent.dircol.active)
        {
            this.setActive(true)
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
                this.focusTree()
            }
            if (res !== fileName)
            {
                return post.emit('file.rename',current.path,slash.path(slash.dir(current.path),res))
            }
        }).bind(this)})
    }

    dircol.prototype["focusTree"] = function ()
    {
        return this.dirtree.grabFocus()
    }

    dircol.prototype["onResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    dircol.prototype["onToggle"] = function ()
    {
        var cols

        this.toggle()
        this.setActive(this.visible())
        ked_session.set('dircol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        post.emit('view.size',this.name,'right',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
        if (this.hidden())
        {
            post.emit('focus','editor')
            return post.emit('redraw')
        }
        else
        {
            return this.focusTree()
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
            return this.focusTree()
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9kaXJjb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLOztPQUNMLFdBQVA7O09BQ08sWUFBWjtPQUFrQixZQUFsQjtPQUF3QixZQUF4Qjs7T0FDWSxhQUFYOztPQUNXLFdBQWY7T0FBb0IsV0FBcEI7T0FBeUIsYUFBekI7T0FBZ0MsWUFBaEM7O09BQ2UsY0FBZjs7T0FDZSxjQUFBOzs7QUFFckIsVUFBRDs7dUJBQVE7YUFFSixRQUFHLFFBQVEsUUFBTzs7UUFBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUVBLE9BQU8sU0FBUztRQUV0QixLQUFDLFlBQVk7UUFFYixLQUFDLGNBQWM7UUFDZixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWMsS0FBUSxVQUFVLEtBQUM7UUFDbEMsS0FBQyxhQUFjLE9BQVEsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsY0FBYyxRQUFRLFVBQVUsS0FBQyxnQkFBZ0I7UUFFbEQsS0FBQyxjQUFjLEtBQUMsS0FBSyxLQUFDLE9BQU8sS0FBQztRQUM5QixLQUFDLGNBQWMsS0FBQztRQUVoQixLQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUM7UUFFckIsS0FBSyxNQUFNLFFBQVE7UUFFbkIsS0FBQyxRQUFRLFNBQVMsS0FBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsUUFBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsY0FBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsZUFBZ0I7UUFFbEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFTO1FBRWxDLEtBQUMsS0FBUSxTQUFTLEtBQWdCO1FBRWxDLEtBQUMsT0FBUSxTQUFTLFFBQWdCLE1BQU0sT0FBTztRQUUvQyxLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0Is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
//# sourceURL=../../../../kode/ked/view/colmns/dircol.kode
