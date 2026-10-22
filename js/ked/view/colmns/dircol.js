var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var dircol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

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
        post.on('dircol.root',this.setRoot)
        post.on('dircol.focus',(function ()
        {
            return this.dirtree.grabFocus()
        }).bind(this))
        post.on('session.merge',this.onSessionMerge)
        root = ked_session.get('dircol▸root',process.cwd())
        this.setRoot(root)
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
        var args, root, _78_24_

        if (_k_.empty(recent.dircol))
        {
            return
        }
        args = ked_session.get('ked▸args',{})
        if (!_k_.empty(args.options))
        {
            console.log(`dircol.onSessionMerge - use first options dir ${slash.dir(args.options[0])}`)
            root = slash.dir(args.options[0])
        }
        else
        {
            console.log(`dircol.onSessionMerge - use last session dir ${recent.dircol.root}`)
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
        return context.show(event.cell,this.onContextChoice,[" ",icons.dir_open + " "," "])
    }

    dircol.prototype["onContextChoice"] = async function (choice)
    {
        var current, dir

        if (current = this.dirtree.current())
        {
            switch (choice)
            {
                case '':
                    return this.rename()

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
        var d, dd

        this.dirtree.grabFocus()
        if (this.dirtree.itemForPath(p))
        {
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

        if (!(this.visible() && this.collapsed()))
        {
            this.toggle()
        }
        this.active = this.visible()
        ked_session.set('dircol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        return post.emit('view.size',this.name,'right',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9kaXJjb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBUztJQUFLOztPQUNMLFdBQVA7O09BQ08sWUFBWjtPQUFrQixZQUFsQjtPQUF3QixZQUF4Qjs7T0FDWSxXQUFmO09BQW9CLFdBQXBCO09BQXlCLGFBQXpCO09BQWdDLFlBQWhDOztPQUNlLGNBQWY7O09BQ2UsY0FBQTs7O0FBRWIsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBUSxRQUFPOztRQUFSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBRUEsT0FBTyxTQUFTO1FBRXRCLEtBQUMsWUFBWTtRQUNiLEtBQUMsU0FBWTtRQUViLEtBQUMsY0FBYztRQUVmLEtBQUMsV0FBYyxLQUFRLFVBQVUsS0FBQztRQUNsQyxLQUFDLGFBQWMsT0FBUSxVQUFVLEtBQUM7UUFDbEMsS0FBQyxjQUFjLFFBQVEsVUFBVSxLQUFDLGdCQUFnQjtRQUVsRCxLQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUM7UUFFckIsS0FBSyxNQUFNLFFBQVE7UUFFbkIsS0FBQyxRQUFRLFNBQVMsS0FBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsUUFBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsY0FBZ0I7UUFDbEMsS0FBQyxRQUFRLFNBQVMsZUFBZ0I7UUFFbEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFTO1FBRWxDLEtBQUMsS0FBUSxTQUFTLEtBQWdCO1FBRWxDLEtBQUMsT0FBUSxTQUFTLFFBQWdCLE1BQU0sT0FBTztRQUUvQyxLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUc7O21CQUFtQixLQUFDLFFBQVE7O1FBRXBDLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUV6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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dircol.kode
