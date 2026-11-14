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
        this.vinderText = ''
        this.pointerType = 'pointer'
        this.setColor('gutter',theme.gutter.bg)
        this.crumbs = new crumbs(this.screen,'title_crumbs')
        this.titlefile = new titlefile(this.screen,'title_file')
        this.titlenovim = new titlenovim(this.screen,'title_novim',this.state.name)
        this.filepos = new bubble(this.screen,"title_bubble")
        this.titlenovim.on('action',this.onNovimAction)
        this.crumbs.setColor('empty_left',this.color.gutter)
        this.crumbs.setColor('empty_right',theme.title.empty)
        this.filepos.setColor('empty',theme.title.empty)
        this.filepos.syntax = new fileposSyntax
        this.crumbs.on('action',this.onCrumbsAction)
        this.titlefile.on('action',this.onFileAction)
        this.filepos.on('action',this.onFileposAction)
        post.on('title.filepos',this.onTitleFilepos)
        post.on('vinder.text',(function (vinderText)
        {
            this.vinderText = vinderText
        
            return post.emit('redraw')
        }).bind(this))
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
                if (novim)
                {
                    return novim.ex = text
                }
                break
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
        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

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
        for (var _a_ = ci = 1, _b_ = this.gutter; (_a_ <= _b_ ? ci < this.gutter : ci > this.gutter); (_a_ <= _b_ ? ++ci : --ci))
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
            for (var _c_ = i = 0, _d_ = cur.length; (_c_ <= _d_ ? i < cur.length : i > cur.length); (_c_ <= _d_ ? ++i : --i))
            {
                add(cur[i],((i < cur.length - 1) ? 'cur' : color.darken(theme.title.cur)),'dark')
            }
        }
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length}≡`
            for (var _e_ = i = 0, _f_ = sel.length; (_e_ <= _f_ ? i < sel.length : i > sel.length); (_e_ <= _f_ ? ++i : --i))
            {
                add(sel[i],((i < sel.length - 1) ? 'sel' : color.darken(theme.title.sel)),'dark')
            }
        }
        if (this.state.s.highlights.length)
        {
            hil = `${this.state.s.highlights.length}❇`
            for (var _10_ = i = 0, _11_ = hil.length; (_10_ <= _11_ ? i < hil.length : i > hil.length); (_10_ <= _11_ ? ++i : --i))
            {
                add(hil[i],((i < hil.length - 1) ? 'hil' : color.darken(theme.title.hil)),'dark')
            }
        }
        novimX = x + 1
        for (var _12_ = ci = x, _13_ = cols - 1; (_12_ <= _13_ ? ci < cols - 1 : ci > cols - 1); (_12_ <= _13_ ? ++ci : --ci))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvdGl0bGUvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSztJQUFLOztPQUNyQixXQUFQOztPQUNPLGNBQU47O09BQ00sV0FBWjs7T0FDWSxZQUFaO09BQWtCLFlBQWxCOztPQUNZLFdBQWY7T0FBb0IsYUFBcEI7T0FBMkIsYUFBM0I7O09BQ2UsZ0JBQUE7T0FBVSxpQkFBQTs7O0FBQy9CLGlCQUFEOzthQUNJOzs7UUFFSSxLQUFDO1FBQ0QsS0FBQyxNQUFNLFNBQVMsTUFBTSxNQUFNO1FBQzVCLEtBQUMsTUFBTSxTQUFTLE1BQU0sT0FBTyxLQUFDLE1BQU0sT0FBTzs7OzZCQUUvQyx1QkFBVSxHQUFFLEdBQUU7O2dCQUVIOztpQkFDSDt1QkFBTSxLQUFDLE1BQU07Ozt1QkFDUCxLQUFDLE1BQU07Ozs7O1dBWHhCOzs7O0FBYUEsU0FBRDs7c0JBQU87YUFLSCxPQUFJLFFBQVE7O1FBQVQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs4Q0FFRCxLQUFDLE9BQU87UUFFZCxLQUFDLFFBQVcsS0FBQyxPQUFPO1FBQ3BCLEtBQUMsU0FBVztRQUNaLEtBQUMsT0FBVztRQUNaLEtBQUMsV0FBVztRQUNaLEtBQUM7UUFDRCxLQUFDO1FBRUQsS0FBQyxZQUFZO1FBQ2IsS0FBQyxhQUFhO1FBRWQsS0FBQyxjQUFjO1FBRWYsS0FBQyxTQUFTLFNBQVMsTUFBTSxPQUFPO1FBRWhDLEtBQUMsYUFBaUIsT0FBWSxLQUFDLE9BQU87UUFDdEMsS0FBQyxnQkFBaUIsVUFBWSxLQUFDLE9BQU87UUFDdEMsS0FBQyxpQkFBaUIsV0FBWSxLQUFDLE9BQU8sY0FBYyxLQUFDLE1BQU07UUFDM0QsS0FBQyxjQUFpQixPQUFZLEtBQUMsT0FBTztRQUV0QyxLQUFDLFdBQVcsR0FBRyxTQUFTLEtBQUM7UUFFekIsS0FBQyxPQUFPLFNBQVMsYUFBYyxLQUFDLE1BQU07UUFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/title.kode
