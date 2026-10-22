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

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import crumbs from "../base/crumbs.js"
import bubble from "../base/bubble.js"

import titlefile from "./titlefile.js"


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
        this.pointerType = 'pointer'
        this.setColor('gutter',theme.gutter.bg)
        this.crumbs = new crumbs(this.screen,'title_crumbs')
        this.titlefile = new titlefile(this.screen,'title_file')
        this.filepos = new bubble(this.screen,"title_bubble")
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
                    return post.emit('dircol.root',path)
                }
                else
                {
                    return post.emit('browse.dir',path)
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

    title.prototype["onMouse"] = function (event)
    {
        var col, cret, fret, row, sret

        cret = this.crumbs.onMouse(event)
        sret = this.titlefile.onMouse(event)
        fret = this.filepos.onMouse(event)
        if (sret || cret || fret)
        {
            return sret || cret || fret
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
        return this.filepos.layout(x,y,this.filepos.rounded.length,1)
    }

    title.prototype["draw"] = function ()
    {
        var add, ch, ci, colno, cols, cur, cursor, dty, fg, fnl, hil, i, rdo, sel, set, x, y

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
        for (var _12_ = ci = x, _13_ = cols - 1; (_12_ <= _13_ ? ci < cols - 1 : ci > cols - 1); (_12_ <= _13_ ? ++ci : --ci))
        {
            add(' ',null,'dark')
        }
        add('','dark',this.color.gutter)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvdGl0bGUvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBc0JRLEtBQUM7UUFDRCxLQUFDLE1BQU0sU0FBUyxNQUFNLE1BQU07UUFDNUIsS0FBQyxNQUFNLFNBQVMsTUFBTSxPQUFPLEtBQUMsTUFBTSxPQUFPOzs7OztnQkFJcEM7O2lCQUNIO3VCQUFNLEtBQUMsTUFBTTs7O3VCQUNQLEtBQUMsTUFBTTs7Ozs7Ozs7Ozs7c0JBRUY7Ozs7Ozs7Ozs7Ozs7Ozs4Q0FJVCxLQUFDLE9BQU87UUFFZCxLQUFDLFFBQVcsS0FBQyxPQUFPO1FBQ3BCLEtBQUMsU0FBVztRQUNaLEtBQUMsT0FBVztRQUNaLEtBQUMsV0FBVztRQUNaLEtBQUM7UUFDRCxLQUFDO1FBRUQsS0FBQyxjQUFjO1FBRWYsS0FBQyxTQUFTLFNBQVMsTUFBTSxPQUFPO1FBRWhDLEtBQUMsYUFBZ0IsT0FBVyxLQUFDLE9BQU87UUFDcEMsS0FBQyxnQkFBZ0IsVUFBVyxLQUFDLE9BQU87UUFDcEMsS0FBQyxjQUFnQixPQUFXLEtBQUMsT0FBTztRQUVwQyxLQUFDLE9BQU8sU0FBUyxhQUFjLEtBQUMsTUFBTTtRQUN0QyxLQUFDLE9BQU8sU0FBUyxjQUFjLE1BQU0sTUFBTTtRQUUzQyxLQUFDLFFBQVEsU0FBUyxRQUFRLE1BQU0sTUFBTTtRQUN0QyxLQUFDLFFBQVEsYUFBYTtRQUV0QixLQUFDLE9BQU8sR0FBTyxTQUFTLEtBQUM7UUFDekIsS0FBQyxVQUFVLEdBQUksU0FBUyxLQUFDO1FBQ3pCLEtBQUMsUUFBUSxHQUFNLFNBQVMsS0FBQztRQUV6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7Ozs7Ozs7O1lBSXRCLEtBQUMsU0FBUyxTQUFTOzttQkFDbEIsS0FBQyxRQUFRLEtBQUksVUFBUyxLQUFDLFdBQVcsS0FBQyxTQUFTLFNBQU8sS0FBQyxXQUFTLElBQUksT0FBTSxL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/title.kode
