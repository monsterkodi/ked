var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var fileposSyntax, title

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let kstr = kxk.kstr
let kseg = kxk.kseg
let nfs = kxk.nfs

import belt from "../../edit/tool/belt.js"

import filepos from "../../edit/mode/filepos.js"

import mode from "../../edit/mode.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import crumbs from "../base/crumbs.js"
import bubble from "../base/bubble.js"

import titlefile from "./titlefile.js"
import titlenovim from "./titlenovim.js"


fileposSyntax = (function ()
{
    function fileposSyntax ()
    {
        this["getColor"] = this["getColor"].bind(this)
        this.color = {}
        this.color.number = theme.title.filepos
        this.color.symbol = color.darken(this.color.number,0.8)
    }

    fileposSyntax.prototype["getColor"] = function (x, y, ch)
    {
        switch (ch)
        {
            case '':
                return this.color.symbol

            default:
                return this.color.number
        }

    }

    return fileposSyntax
})()


title = (function ()
{
    _k_.extend(title, view)
    function title (screen, editor)
    {
        this.screen = screen
        this.editor = editor
    
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["setFile"] = this["setFile"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onVinderAction"] = this["onVinderAction"].bind(this)
        this["onNovimAction"] = this["onNovimAction"].bind(this)
        this["onFileAction"] = this["onFileAction"].bind(this)
        this["droopCrumb"] = this["droopCrumb"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        this["onFileposAction"] = this["onFileposAction"].bind(this)
        this["onTitleFilepos"] = this["onTitleFilepos"].bind(this)
        title.__super__.constructor.call(this,this.screen,'title')
        this.state = this.editor.state
        this.gutter = 4
        this.file = ''
        this.drawTime = ''
        this.fileposl = []
        this.fileoffs = []
        this.novimText = ''
        this.pointerType = 'pointer'
        this.setColor('gutter',theme.gutter.bg)
        this.crumbs = new crumbs(this.screen,'title_crumbs')
        this.titlefile = new titlefile(this.screen,'title_file')
        this.titlenovim = new titlenovim(this.screen,'title_novim',this.state.name)
        this.filepos = new bubble(this.screen,"title_bubble")
        this.titlenovim.on('action',this.onNovimAction)
        this.titlenovim.on('vinder',this.onVinderAction)
        this.crumbs.setColor('empty_left',this.color.gutter)
        this.crumbs.setColor('empty_right',theme.title.empty)
        this.filepos.setColor('empty',theme.title.empty)
        this.filepos.syntax = new fileposSyntax
        this.crumbs.on('action',this.onCrumbsAction)
        this.titlefile.on('action',this.onFileAction)
        this.filepos.on('action',this.onFileposAction)
        post.on('title.filepos',this.onTitleFilepos)
    }

    title.prototype["onTitleFilepos"] = function (fileposl, fileoffs)
    {
        this.fileposl = fileposl
        this.fileoffs = fileoffs
    
        if (this.fileposl.length > 1)
        {
            return this.filepos.set({tilde:`${(this.fileoffs ? this.fileposl.length - this.fileoffs - 1 : '')}${this.fileposl.length - 1}`})
        }
        else
        {
            return this.filepos.set(null)
        }
    }

    title.prototype["onFileposAction"] = function (action, item)
    {
        var files

        switch (action)
        {
            case 'leave':
                console.log('hide filepos files?')
                break
            case 'click':
                return post.emit('filepos.swapPrevious')

            case 'enter':
                if (filepos.fileposl.length > 1)
                {
                    files = filepos.fileposl.map(function (fp)
                    {
                        return fp[0]
                    })
                    files = files.reverse()
                    if (filepos.offset === 0)
                    {
                        files.shift()
                    }
                    return post.emit('droop.show',{files:files,pos:[this.filepos.cells.x + parseInt(this.filepos.cells.cols / 2),this.filepos.cells.y + 1]})
                }
                break
        }

    }

    title.prototype["onCrumbsAction"] = function (action, path, event)
    {
        switch (action)
        {
            case 'click':
                clearTimeout(this.droopTimer)
                if (!_k_.empty(event.mods))
                {
                    return post.emit('browse.dir',path)
                }
                else
                {
                    return post.emit('dircol.root',path)
                }
                break
            case 'enter':
                post.emit('droop.hide')
                clearTimeout(this.droopTimer)
                return this.droopTimer = setTimeout(((function (p, e)
                {
                    return (function ()
                    {
                        return this.droopCrumb(p,e)
                    }).bind(this)
                }).bind(this))(path,event),500)

            case 'leave':
                clearTimeout(this.droopTimer)
                return delete this.droopTimer

        }

    }

    title.prototype["droopCrumb"] = async function (path, crumb)
    {
        var files, x

        clearTimeout(this.droopTimer)
        delete this.droopTimer
        path = slash.untilde(path)
        files = await nfs.list(path,{recursive:false})
        x = this.crumbs.cells.x + parseInt((crumb.cols[1] + crumb.cols[0]) / 2)
        return post.emit('droop.show',{files:files,pos:[x,this.crumbs.cells.y + 1]})
    }

    title.prototype["onFileAction"] = function (action, file)
    {
        switch (action)
        {
            case 'click':
                return post.emit('browse.dir',slash.dir(file),file)

        }

    }

    title.prototype["onNovimAction"] = function (action, text)
    {
        var novim

        novim = mode.get(this.state,'novim')
        switch (action)
        {
            case 'submit':
                this.editor.grabFocus()
                return (novim != null ? novim.runEx(text) : undefined)

            case 'cancel':
                this.editor.grabFocus()
                return (novim != null ? novim.cancelEx() : undefined)

            case 'change':
                return (novim != null ? novim.exChanged(text) : undefined)

            case 'historyUp':
                return (novim != null ? novim.historyUp('ex',text) : undefined)

            case 'historyDown':
                return (novim != null ? novim.historyDown('ex',text) : undefined)

        }

    }

    title.prototype["onVinderAction"] = function (action, text)
    {
        var novim

        novim = mode.get(this.state,'novim')
        switch (action)
        {
            case 'submit':
                (novim != null ? novim.commitSearch() : undefined)
                return this.editor.grabFocus()

            case 'cancel':
                this.editor.grabFocus()
                return (novim != null ? novim.cancelSearch() : undefined)

            case 'change':
                return (novim != null ? novim.searchChanged(text) : undefined)

            case 'historyUp':
                return (novim != null ? novim.historyUp('search',text) : undefined)

            case 'historyDown':
                return (novim != null ? novim.historyDown('search',text) : undefined)

        }

    }

    title.prototype["onKey"] = function (key, event)
    {
        if (this.titlenovim.onKey(key,event))
        {
            return true
        }
        return false
    }

    title.prototype["onMouse"] = function (event)
    {
        var col, cret, fret, nret, row, sret

        cret = this.crumbs.onMouse(event)
        sret = this.titlefile.onMouse(event)
        fret = this.filepos.onMouse(event)
        nret = this.titlenovim.onMouse(event)
        if (sret || cret || fret || nret)
        {
            return sret || cret || fret || nret
        }
        title.__super__.onMouse.call(this,event)
        ;[col,row] = this.eventPos(event)
        if (this.hover)
        {
            post.emit('pointer',this.pointerType)
        }
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    if ((0 <= col && col < 4))
                    {
                        post.emit('dircol.toggle')
                        return {redraw:true}
                    }
                    if ((this.cells.cols - 12 <= col && col < this.cells.cols))
                    {
                        post.emit('funcol.toggle')
                        return {redraw:true}
                    }
                }
                break
        }

        return this.hover
    }

    title.prototype["setFile"] = function (file)
    {
        this.file = file
    
        if (_k_.empty(this.file))
        {
            return
        }
        this.crumbs.set(slash.dir(this.file))
        return this.titlefile.set(this.file)
    }

    title.prototype["layout"] = function (x, y, w, h)
    {
        title.__super__.layout.call(this,x,y,w,h)
    
        var cw

        cw = parseInt(w / 2)
        x += this.gutter + 1
        this.crumbs.layout(x,y,cw,1)
        this.crumbs.layout(x,y,this.crumbs.rounded.length,1)
        x += this.crumbs.rounded.length
        this.titlefile.layout(x,y,this.titlefile.rounded.length,1)
        x += this.titlefile.rounded.length
        this.filepos.layout(x,y,this.filepos.rounded.length,1)
        x += this.filepos.rounded.length
        x += 12
        return this.titlenovim.layout(x,y,w - x,1)
    }

    title.prototype["draw"] = function ()
    {
        var add, ch, ci, colno, cols, cur, cursor, dty, fg, fnl, hil, i, novimX, rdo, sel, set, x, y

        if (this.hidden() || _k_.empty(this.file))
        {
            return
        }
        x = 0
        y = 0
        cursor = this.state.mainCursor()
        cols = this.cells.cols
        fnl = this.file.length
        rdo = this.state.hasRedo()
        dty = this.state.isDirty()
        set = (function (x, char, fg, bg)
        {
            if (_k_.isStr(fg))
            {
                fg = theme.title[fg]
            }
            if (_k_.isStr(bg))
            {
                bg = theme.title[bg]
            }
            this.cells.set(x,y,char,fg,bg)
            return 1
        }).bind(this)
        add = (function (char, fg, bg)
        {
            return x += set(x,char,fg,bg)
        }).bind(this)
        add('','col',this.color.gutter)
        colno = _k_.rpad(this.gutter - 1,`${cursor[0] + 1}`)
        for (ci = 1; ci < this.gutter; ci++)
        {
            fg = (cursor[0] ? 'fg' : 'col_zero')
            if (belt.isLinesPosOutside(this.state.s.lines,cursor))
            {
                fg = 'col_empty'
            }
            add(((ci - 1 < colno.length) ? colno[ci - 1] : ' '),fg,'col')
        }
        add('','col',this.color.gutter)
        this.crumbs.draw()
        this.titlefile.draw()
        this.filepos.draw()
        x += this.crumbs.rounded.length
        x += this.titlefile.rounded.length
        x += this.filepos.rounded.length
        add('','dark','empty')
        if (dty)
        {
            add('<','dirty','dark')
        }
        if (dty)
        {
            add(' ','dirty','dark')
        }
        if (rdo)
        {
            add('>','redo','dark')
        }
        add(' ','dark','dark')
        if (this.state.s.cursors.length > 1)
        {
            cur = `${this.state.s.cursors.length}♦`
            for (i = 0; i < cur.length; i++)
            {
                add(cur[i],((i < cur.length - 1) ? 'cur' : color.darken(theme.title.cur)),'dark')
            }
        }
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length}≡`
            for (i = 0; i < sel.length; i++)
            {
                add(sel[i],((i < sel.length - 1) ? 'sel' : color.darken(theme.title.sel)),'dark')
            }
        }
        if (this.state.s.highlights.length)
        {
            hil = `${this.state.s.highlights.length}❇`
            for (i = 0; i < hil.length; i++)
            {
                add(hil[i],((i < hil.length - 1) ? 'hil' : color.darken(theme.title.hil)),'dark')
            }
        }
        novimX = x + 1
        for (ci = x; ci < cols - 1; ci++)
        {
            add(' ',null,'dark')
        }
        add('','dark',this.color.gutter)
        if (mode.isActive(this.state,'novim'))
        {
            this.titlenovim.draw(this.cells.x + novimX,this.cells.cols - novimX)
        }
        if (false)
        {
            ci = _k_.clamp(0,3,parseInt((this.time / (1000 * 1000) - 8) / 8))
            ch = ' •'[ci]
            fg = [[32,32,32],[0,96,0],[255,0,0],[255,255,0]][ci]
            switch (ch)
            {
                case '•':
                    1
                    break
                case '':
                    1
                    break
                case '':
                    1
                    break
            }

            return set(cols - 2,ch,fg,'dark')
        }
    }

    return title
})()

export default title;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvdGl0bGUvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSztJQUFLOztPQUNyQixXQUFQOztPQUNPLGNBQU47O09BQ00sV0FBWjs7T0FDWSxZQUFaO09BQWtCLFlBQWxCOztPQUNZLFdBQWY7T0FBb0IsYUFBcEI7T0FBMkIsYUFBM0I7O09BQ2UsZ0JBQUE7T0FBVSxpQkFBQTs7O0FBQy9CLGlCQUFEOzthQUNJOzs7UUFFSSxLQUFDO1FBQ0QsS0FBQyxNQUFNLFNBQVMsTUFBTSxNQUFNO1FBQzVCLEtBQUMsTUFBTSxTQUFTLE1BQU0sT0FBTyxLQUFDLE1BQU0sT0FBTzs7OzZCQUUvQyx1QkFBVSxHQUFFLEdBQUU7O2dCQUVIOztpQkFDSDt1QkFBTSxLQUFDLE1BQU07Ozt1QkFDUCxLQUFDLE1BQU07Ozs7O1dBWHhCOzs7O0FBYUEsU0FBRDs7c0JBQU87YUFLSCxPQUFJLFFBQVE7O1FBQVQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7OENBRUQsS0FBQyxPQUFPO1FBRWQsS0FBQyxRQUFXLEtBQUMsT0FBTztRQUNwQixLQUFDLFNBQVc7UUFDWixLQUFDLE9BQVc7UUFDWixLQUFDLFdBQVc7UUFDWixLQUFDO1FBQ0QsS0FBQztRQUVELEtBQUMsWUFBWTtRQUViLEtBQUMsY0FBYztRQUVmLEtBQUMsU0FBUyxTQUFTLE1BQU0sT0FBTztRQUVoQyxLQUFDLGFBQWlCLE9BQVksS0FBQyxPQUFPO1FBQ3RDLEtBQUMsZ0JBQWlCLFVBQVksS0FBQyxPQUFPO1FBQ3RDLEtBQUMsaUJBQWlCLFdBQVksS0FBQyxPQUFPLGNBQWMsS0FBQyxNQUFNO1FBQzNELEtBQUMsY0FBaUIsT0FBWSxLQUFDLE9BQU87UUFFdEMsS0FBQyxXQUFXLEdBQUcsU0FBUyxLQUFDO1FBQ3pCLEtBQUMsV0FBVyxHQUFHLFNBQVMsS0FBQztRQUV6QixLQUFDLE9BQU8sU0FBUyxh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
//# sourceURL=../../../../kode/ked/view/title/title.kode
