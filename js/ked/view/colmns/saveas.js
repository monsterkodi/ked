var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var saveas

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import fileutil from "../../util/fileutil.js"

import belt from "../../edit/tool/belt.js"

import quicky from "./quicky.js"
import brocol from "./brocol.js"
import diritem from "./diritem.js"
import dirlist from "./dirlist.js"


saveas = (function ()
{
    _k_.extend(saveas, quicky)
    function saveas (screen)
    {
        this.screen = screen
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["doSaveAs"] = this["doSaveAs"].bind(this)
        this["applyChoice"] = this["applyChoice"].bind(this)
        this["targetPath"] = this["targetPath"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        this["preview"] = this["preview"].bind(this)
        this["setFilePath"] = this["setFilePath"].bind(this)
        this["gotoDir"] = this["gotoDir"].bind(this)
        this["open"] = this["open"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        saveas.__super__.constructor.call(this,this.screen,'saveas')
        this.isVisible = false
        this.setColor('bg',theme.quicky.bg)
        this.setColor('frame',theme.quicky.frame)
        this.brocol = new brocol(this.screen,'saveas_brocol')
        this.brocol.setColor('bg',color.darken(this.color.bg,0.7))
        this.choices.mapscr.rowOffset = 1
        this.choices.frontRoundOffset = 2
        this.userNamed = false
    }

    saveas.prototype["arrange"] = function ()
    {
        var bw, ch, cr, cw, fh, h, hs, ih, iz, scx, scy, w, x, y

        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        ih = 2
        iz = 1
        hs = parseInt(this.screen.rows / 2)
        y = parseInt(scy - hs / 2 - ih)
        cr = (this.crumbs.visible() ? 1 : 0)
        ch = (this.crumbs.visible() ? hs : _k_.min(hs,this.choices.numFiltered()))
        w = _k_.min(_k_.min(this.screen.cols,42),_k_.max(32,parseInt(this.screen.cols / 2)))
        bw = (this.brocol.visible() ? w / 2 : 0)
        cw = w - bw - 2
        x = parseInt(scx - w / 2)
        h = ch + ih + cr + 2
        fh = (this.brocol.visible() ? ch : 0)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.crumbs.layout(x + 2,y + 1 + ih,w - 4,cr)
        this.choices.layout(x + 1,y + 1 + ih + cr,cw,ch)
        this.brocol.layout(x + 1 + cw,y + 1 + ih + cr,bw,fh)
        return this.cells.layout(x,y,w,h)
    }

    saveas.prototype["open"] = async function (dir, file)
    {
        var path

        console.log("OPEN",dir,file)
        this.input.show()
        path = slash.path(dir,file)
        await this.gotoDir(dir,path)
        if (file)
        {
            this.input.set(file)
            this.input.state.moveCursors('eol')
        }
        return this.input.grabFocus()
    }

    saveas.prototype["gotoDir"] = async function (dir, select)
    {
        var items

        if (_k_.empty(dir))
        {
            dir = process.cwd()
        }
        dir = slash.untilde(dir)
        try
        {
            items = await dirlist.items(dir)
        }
        catch (err)
        {
            console.log('list error',err)
            return
        }
        this.currentDir = dir
        this.crumbs.show(dir)
        select = (select != null ? select : (items[1] != null ? items[1].path : undefined))
        return this.showPathItems(items,select)
    }

    saveas.prototype["setFilePath"] = function (path)
    {
        console.log("SET FILE",slash.file(path))
        this.input.set(slash.file(path))
        this.input.state.moveCursors('eol')
        this.arrange()
        return post.emit('redraw')
    }

    saveas.prototype["preview"] = async function (item)
    {
        var segls, text

        if (_k_.empty((item != null ? item.path : undefined)))
        {
            return this.hideMap()
        }
        if (item.type === 'file')
        {
            this.brocol.hide()
            if (_k_.in(slash.ext(item.path),fileutil.sourceFileExtensions))
            {
                text = await nfs.read(item.path)
                if (this.brocol.visible())
                {
                    return
                }
                segls = belt.seglsForText(text)
                this.choices.mapscr.setSyntaxSegls(slash.ext(item.path),segls)
                this.choices.mapscr.show()
            }
            else
            {
                this.hideMap()
            }
        }
        else
        {
            this.hideMap()
            if (!item.tilde.endsWith('..'))
            {
                this.brocol.show(item.path)
                this.choices.hoverForSubmenu = true
            }
            else
            {
                this.brocol.hide()
                this.choices.hoverForSubmenu = false
            }
        }
        this.arrange()
        return post.emit('redraw')
    }

    saveas.prototype["onInputChange"] = function (text)
    {
        return this.userNamed = true
    }

    saveas.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'up':
            case 'down':
                this.moveSelection(event.combo)
                return true

        }

        return saveas.__super__.onKey.call(this,key,event)
    }

    saveas.prototype["targetPath"] = function (name)
    {
        if (slash.isAbsolute(name))
        {
            return name
        }
        return slash.path(this.currentDir,name)
    }

    saveas.prototype["applyChoice"] = function (choice)
    {
        switch (this.input.current())
        {
            case '/':
                return this.gotoDir('/')

            case '~':
                return this.gotoDir('~')

            case '.':
                return this.gotoDir(this.currentDir)

            case '..':
                return this.gotoDir(slash.dir(this.currentDir))

        }

        if (_k_.empty(choice) && !_k_.empty(this.input.current()))
        {
            this.gotoDirOrOpenFile(this.input.current())
            return {redraw:true}
        }
        if (_k_.empty(choice))
        {
            return {redraw:false}
        }
        if (_k_.empty(choice.path))
        {
            return {redraw:false}
        }
        this.gotoDir(choice.path)
        return {redraw:true}
    }

    saveas.prototype["doSaveAs"] = function ()
    {
        var name, path

        name = this.input.current()
        if (_k_.empty(name))
        {
            return
        }
        path = this.targetPath(name)
        this.hide()
        post.emit('focus','editor')
        console.log("WOULD SAVE FILE AS",path)
    }

    saveas.prototype["onChoicesAction"] = function (action, choice)
    {
        var upDir

        switch (action)
        {
            case 'right':
                if (choice.path)
                {
                    if (choice.tilde === ' ..')
                    {
                        return this.moveSelection('down')
                    }
                    if (choice.type === 'file')
                    {
                        console.log("CHOICE",choice)
                        this.setFilePath(choice.path)
                        return
                    }
                    else
                    {
                        this.hideMap()
                        return this.gotoDir(choice.path)
                    }
                }
                break
            case 'left':
            case 'delete':
                if (choice.path)
                {
                    upDir = slash.dir(this.currentDir)
                    if (_k_.empty(upDir))
                    {
                        return
                    }
                    this.hideMap()
                    return this.gotoDir(upDir,this.currentDir)
                }
                break
            case 'space':
                if (choice.path && choice.type === 'file')
                {
                    console.log("SPACE",choice.path)
                    this.setFilePath(choice.path)
                    return
                }
                break
        }

        return saveas.__super__.onChoicesAction.call(this,action,choice)
    }

    saveas.prototype["draw"] = function ()
    {
        var bg, cc, choice, cry, fg, x, y

        if (this.hidden())
        {
            return
        }
        saveas.__super__.draw.call(this)
        if (this.crumbs.visible())
        {
            cry = this.crumbs.cells.wy(0) - this.cells.y
            this.cells.set(1,cry,' ',null,this.color.bg)
            this.cells.set(this.crumbs.cells.cols + 2,cry,' ',null,this.color.bg)
        }
        if (this.brocol.visible())
        {
            this.brocol.draw()
            bg = this.color.bg
            fg = this.color.frame
            x = this.choices.cells.cols + 2
            if (choice = this.choices.current())
            {
                x = this.choices.cells.cols - 1
                y = this.choices.currentIndex() - this.choices.state.s.view[1]
                cc = (this.choices.hasFocus() ? this.choices.color.hover.bg : this.choices.color.hover.blur)
                this.choices.cells.fill_row(y,choice.tilde.length,x - 1,' ',bg,cc)
                return this.choices.cells.set(x,y,'',cc,bg)
            }
        }
    }

    saveas.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.brocol.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return saveas.__super__.onMouse.call(this,event)
    }

    saveas.prototype["onWheel"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.brocol.onWheel(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return saveas.__super__.onWheel.call(this,event)
    }

    return saveas
})()

export default saveas;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBZ0J3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FJVixLQUFDLE9BQU87UUFFZCxLQUFDLFlBQVk7UUFFYixLQUFDLFNBQVMsS0FBUyxNQUFNLE9BQU87UUFDaEMsS0FBQyxTQUFTLFFBQVMsTUFBTSxPQUFPO1FBRWhDLEtBQUMsYUFBYSxPQUFPLEtBQUMsT0FBTztRQUM3QixLQUFDLE9BQU8sU0FBUyxLQUFLLE1BQU0sT0FBTyxLQUFDLE1BQU0sR0FBRztRQUc3QyxLQUFDLFFBQVEsT0FBTyxZQUFZO1FBQzVCLEtBQUMsUUFBUSxtQkFBbUI7UUFFNUIsS0FBQyxZQUFZOzs7Ozs7O1FBSWIsZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixlQUFVLEtBQUMsT0FBTyxPQUFLO1FBRXZCLEtBQUs7UUFDTCxLQUFLO1FBRUwsY0FBUyxLQUFDLE9BQU8sT0FBSztRQUN0QixhQUFTLE1BQU0sS0FBRyxJQUFJO1FBRXRCLE1BQUssS0FBQyxPQUFPLFlBQVksSUFBSTtRQUM3QixNQUFLLEtBQUMsT0FBTyxZQUFZLGFBQVMsR0FBRyxLQUFDLFFBQVE7UUFFOUMsb0JBQWEsS0FBQyxPQUFPLEtBQUssWUFBUSxZQUFPLEtBQUMsT0FBTyxPQUFLO1FBQ3RELE1BQUssS0FBQyxPQUFPLFlBQVksSUFBRSxJQUFJO1FBQy9CLEtBQUssSUFBRSxLQUFHO1FBRVYsYUFBUyxNQUFJLElBQUU7UUFFZixJQUFLLEtBQUssS0FBSyxLQUFLO1FBQ3BCLE1BQUssS0FBQyxPQUFPLFlBQVksS0FBSztRQUU5QixLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQU8sSUFBRSxFQUFTLElBQUUsRUFBSTtRQUMzQyxLQUFDLE9BQU8sT0FBUyxJQUFFLEVBQU8sSUFBRSxJQUFFLEdBQU8sSUFBRSxFQUFJO1FBQzNDLEtBQUMsUUFBUSxPQUFRLElBQUUsRUFBTyxJQUFFLElBQUUsS0FBRyxHQUFJLEdBQU07UUFDM0MsS0FBQyxPQUFPLE9BQVMsSUFBRSxJQUFFLEdBQUssSUFBRSxJQUFFLEtBQUcsR0FBSSxHQUFNO2VBQzNDLEtBQUMsTUFBTSxPQUFVLEVBQVMsRUFBWSxFQUFNOzs7Ozs7O1FBSTVDLFlBQUksT0FBTyxJQUFJO1FBR2YsS0FBQyxNQUFNO1FBRVAsT0FBTyxNQUFNLEtBQUssSUFBSTtjQUVwQixLQUFDLFFBQVEsSUFBSTtZQUVaOztZQUNDLEtBQUMsTUFBTSxJQUFJO1lBQ1gsS0FBQyxNQUFNLE1BQU0sWUFBWTs7ZUFFN0IsS0FBQyxNQUFNOzs7Ozs7O3NCQUlzQjs7WUFBN0IsTUFBTSxRQUFROztRQUNkLE1BQU0sTUFBTSxRQUFROzs7WUFHaEIsY0FBUyxRQUFRLE1BQU07O2VBQ3JCOztZQUNGLFlBQUksYUFBYTs7O1FBR3JCLEtBQUMsYUFBYTtRQUNkLEtBQUMsT0FBTyxLQUFLO1FBRWIsVUFBQSxpQkFBQSxVQUFVLE1BQU0sYUFBTixNQUFNLEdBQUk7ZUFFcEIsS0FBQyxjQUFjLE1BQU07Ozs7O1FBR3JCLFlBQUksV0FBVyxNQUFNLEtBQUs7UUFDMUIsS0FBQyxNQUFNLElBQUksTUFBTSxLQUFLO1FBQ3RCLEtBQUMsTUFBTSxNQUFNLFlBQVk7UUFDekIsS0FBQztlQUNELEtBQUssS0FBSzs7Ozs7Ozt1QkFJYSxlQUFBLEtBQU07O21CQUExQixLQUFDOztZQUVELEtBQUssU0FBUTs7WUFFWixLQUFDLE9BQU87dUJBRUwsTUFBTSxJQUFJLEtBQUssTUFBUyxTQUFTOztnQkFDaEMsYUFBUSxJQUFJLEtBQUssS0FBSztvQkFDaEIsS0FBQyxPQUFPOzs7O2dCQUNkLFFBQVEsS0FBSyxhQUFhO2dCQUMxQixLQUFDLFFBQVEsT0FBTyxlQUFlLE1BQU0sSUFBSSxLQUFLLE1BQU07Z0JBQ3BELEtBQUMsUUFBUSxPQUFPOzs7O2dCQUVoQixLQUFDOzs7OztZQUlMLEtBQUM7aUJBRU0sS0FBSyxNQUFNLFNBQVM7O2dCQUN2QixLQUFDLE9BQU8sS0FBSyxLQUFLO2dCQUNsQixLQUFDLFFBQVEsa0JBQWtCOzs7O2dCQUUzQixLQUFDLE9BQU87Z0JBQ1IsS0FBQyxRQUFRLGtCQUFrQjs7O1FBRW5DLEtBQUM7ZUFDRCxLQUFLLEtBQUs7Ozs7O2VBSVYsS0FBQyxZQUFZOzs7OztZQUlQLEtBQUM7Ozs7Z0JBRUEsTUFBTTs7aUJBRVQ7aUJBQUs7Z0JBQ0QsS0FBQyxjQUFjLE1BQU07dUJBQ2xCOzs7O2dEQUVMLElBQUk7Ozs7O1lBSVAsTUFBTSxXQUFXOzttQkFDYjs7ZUFFUCxNQUFNLEtBQUssS0FBQyxXQUFZOzs7OztnQkFLakIsS0FBQyxNQUFNOztpQkFFVjt1QkFBVSxLQUFDLFFBQVE7O2lCQUNuQjt1QkFBVSxLQUFDLFFBQVE7O2lCQUNuQjt1QkFBVSxLQUFDLFFBQVEsS0FBQzs7aUJBQ3BCO3VCQUFVLEtBQUMsUUFBUSxNQUFNLElBQUksS0FBQzs7OztzQkFFekIsc0JBQWlCLEtBQUMsTUFBTTs7WUFDN0IsS0FBQyxrQkFBa0IsS0FBQyxNQUFNO29CQUN2QixPQUFPOztzQkFFTDs7b0JBQWlCLE9BQU87O3NCQUN4QixPQUFPOztvQkFBVSxPQUFPOztRQUVqQyxLQUFDLFFBQVEsT0FBTztnQkFDaEIsT0FBTzs7Ozs7OztRQUlQLE9BQU8sS0FBQyxNQUFNO3NCQUVGOzs7O1FBRVosT0FBTyxLQUFDLFdBQVc7UUFFbkIsS0FBQztRQUVELEtBQUssS0FBSyxRQUFRO1FBRWxCLFlBQUkscUJBQXFCOzs7Ozs7O2dCQU9sQjs7aUJBRUg7b0JBRU8sT0FBTzs7d0JBQ0gsT0FBTyxVQUFTOzsrQkFDWixLQUFDLGNBQWM7O3dCQUNuQixPQUFPLFNBQVE7O3dCQUNkLFlBQUksU0FBUzt3QkFDYixLQUFDLFlBQVksT0FBTzs7Ozs7d0JBR3BCLEtBQUM7K0JBQ0MsS0FBQyxRQUFRLE9BQU87Ozs7aUJBRTlCO2lCQUFPO29CQUVBLE9BQU87O29CQUNOLFFBQVEsTUFBTSxJQUFJLEtBQUM7a0NBQ1A7Ozs7b0JBQ1osS0FBQzsyQkFDRSxLQUFDLFFBQVEsTUFBTSxLQUFDOzs7aUJBQzNCO29CQUVPLE9BQU8sUUFBUyxPQUFPLFNBQVE7O29CQUU5QixZQUFJLFFBQVEsT0FBTztvQkFDbkIsS0FBQyxZQUFZLE9BQU87Ozs7OzswREFHMUIsT0FBTzs7Ozs7OztZQUlSLEtBQUM7Ozs7O1lBSUgsS0FBQyxPQUFPOztZQUVQLE1BQU0sS0FBQyxPQUFPLE1BQU0sR0FBRyxLQUFHLEtBQUMsTUFBTTtZQUNqQyxLQUFDLE1BQU0sSUFBSSxFQUFxQixJQUFJLElBQUksS0FBSyxLQUFDLE1BQU07WUFDcEQsS0FBQyxNQUFNLElBQUksS0FBQyxPQUFPLE1BQU0sT0FBSyxFQUFFLElBQUksSUFBSSxLQUFLLEtBQUMsTUFBTTs7WUFFckQsS0FBQyxPQUFPOztZQUVQLEtBQUMsT0FBTztZQUVSLEtBQUssS0FBQyxNQUFNO1lBQ1osS0FBSyxLQUFDLE1BQU07WUFFWixJQUFJLEtBQUMsUUFBUSxNQUFNLE9BQUs7Z0JBRXJCLFNBQVMsS0FBQyxRQUFROztnQkFFakIsSUFBSSxLQUFDLFFBQVEsTUFBTSxPQUFLO2dCQUN4QixJQUFJLEtBQUMsUUFBUSxpQkFBZSxLQUFDLFFBQVEsTUFBTSxFQUFFLEtBQUs7Z0JBRWxELE1BQUssS0FBQyxRQUFRLGFBQWEsS0FBQyxRQUFRLE1BQU0sTUFBTSxLQUFLLEtBQUMsUUFBUSxNQUFNLE1BQU07Z0JBRTFFLEtBQUMsUUFBUSxNQUFNLFNBQWEsRUFBRSxPQUFPLE1BQU0sT0FBTyxJQUFFLEVBQUUsSUFBSSxHQUFHO3VCQUM3RCxLQUFDLFFBQVEsTUFBTSxJQUFhLEVBQUUsRUFBRSxJQUFJLEdBQUc7Ozs7Ozs7OztZQUl6QyxLQUFDOzs7O1FBQ1AsTUFBTSxLQUFDLE9BQU8sUUFBUTthQUFtQixjQUFBLElBQUs7O21CQUFaOztrREFDNUI7Ozs7Ozs7WUFJQSxLQUFDOzs7O1FBQ1AsTUFBTSxLQUFDLE9BQU8sUUFBUTthQUFrQixjQUFBLElBQUs7O21CQUFaOztrREFDM0I7Ozs7OztlQUVQIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
