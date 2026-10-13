var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var fileposSyntax, status

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let kstr = kxk.kstr
let kseg = kxk.kseg

import nfs from "../../../kxk/nfs.js"

import belt from "../../edit/tool/belt.js"

import filepos from "../../edit/mode/filepos.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import crumbs from "../base/crumbs.js"
import bubble from "../base/bubble.js"

import statusfile from "./statusfile.js"


fileposSyntax = (function ()
{
    function fileposSyntax ()
    {
        this["getColor"] = this["getColor"].bind(this)
        this.color = {}
        this.color.number = theme.status.filepos
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


status = (function ()
{
    _k_.extend(status, view)
    function status (screen, editor)
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
        this["onStatusFilepos"] = this["onStatusFilepos"].bind(this)
        status.__super__.constructor.call(this,this.screen,'status')
        this.state = this.editor.state
        this.gutter = 4
        this.file = ''
        this.drawTime = ''
        this.fileposl = []
        this.fileoffs = []
        this.pointerType = 'pointer'
        this.setColor('gutter',theme.gutter.bg)
        this.crumbs = new crumbs(this.screen,'status_crumbs')
        this.statusfile = new statusfile(this.screen,'status_file')
        this.filepos = new bubble(this.screen,"status_filepos")
        this.crumbs.setColor('empty_left',this.color.gutter)
        this.crumbs.setColor('empty_right',theme.status.empty)
        this.filepos.setColor('empty',theme.status.empty)
        this.filepos.syntax = new fileposSyntax
        this.crumbs.on('action',this.onCrumbsAction)
        this.statusfile.on('action',this.onFileAction)
        this.filepos.on('action',this.onFileposAction)
        post.on('status.filepos',this.onStatusFilepos)
    }

    status.prototype["onStatusFilepos"] = function (fileposl, fileoffs)
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

    status.prototype["onFileposAction"] = function (action, item)
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

    status.prototype["onCrumbsAction"] = function (action, path, event)
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

    status.prototype["droopCrumb"] = async function (path, crumb)
    {
        var files, x

        clearTimeout(this.droopTimer)
        delete this.droopTimer
        path = slash.untilde(path)
        files = await nfs.list(path,{recursive:false})
        x = this.crumbs.cells.x + parseInt((crumb.cols[1] + crumb.cols[0]) / 2)
        return post.emit('droop.show',{files:files,pos:[x,this.crumbs.cells.y + 1]})
    }

    status.prototype["onFileAction"] = function (action, file)
    {
        switch (action)
        {
            case 'click':
                return post.emit('browse.dir',slash.dir(file),file)

        }

    }

    status.prototype["onMouse"] = function (event)
    {
        var col, cret, fret, row, sret

        cret = this.crumbs.onMouse(event)
        sret = this.statusfile.onMouse(event)
        fret = this.filepos.onMouse(event)
        if (sret || cret || fret)
        {
            return sret || cret || fret
        }
        status.__super__.onMouse.call(this,event)
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

    status.prototype["setFile"] = function (file)
    {
        this.file = file
    
        if (_k_.empty(this.file))
        {
            return
        }
        this.crumbs.set(slash.dir(this.file))
        return this.statusfile.set(this.file)
    }

    status.prototype["layout"] = function (x, y, w, h)
    {
        status.__super__.layout.call(this,x,y,w,h)
    
        var cw

        cw = parseInt(w / 2)
        x += this.gutter + 1
        this.crumbs.layout(x,y,cw,1)
        this.crumbs.layout(x,y,this.crumbs.rounded.length,1)
        x += this.crumbs.rounded.length
        this.statusfile.layout(x,y,this.statusfile.rounded.length,1)
        x += this.statusfile.rounded.length
        return this.filepos.layout(x,y,this.filepos.rounded.length,1)
    }

    status.prototype["draw"] = function ()
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
                fg = theme.status[fg]
            }
            if (_k_.isStr(bg))
            {
                bg = theme.status[bg]
            }
            this.cells.set(x,y,char,fg,bg)
            return 1
        }).bind(this)
        add = (function (char, fg, bg)
        {
            return x += set(x,char,fg,bg)
        }).bind(this)
        add('','col',this.color.gutter)
        colno = _k_.rpad(this.gutter - 1,`${cursor[0]}`)
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
        this.statusfile.draw()
        this.filepos.draw()
        x += this.crumbs.rounded.length
        x += this.statusfile.rounded.length
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
                add(cur[i],((i < cur.length - 1) ? 'cur' : color.darken(theme.status.cur)),'dark')
            }
        }
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length}≡`
            for (var _e_ = i = 0, _f_ = sel.length; (_e_ <= _f_ ? i < sel.length : i > sel.length); (_e_ <= _f_ ? ++i : --i))
            {
                add(sel[i],((i < sel.length - 1) ? 'sel' : color.darken(theme.status.sel)),'dark')
            }
        }
        if (this.state.s.highlights.length)
        {
            hil = `${this.state.s.highlights.length}❇`
            for (var _10_ = i = 0, _11_ = hil.length; (_10_ <= _11_ ? i < hil.length : i > hil.length); (_10_ <= _11_ ? ++i : --i))
            {
                add(hil[i],((i < hil.length - 1) ? 'hil' : color.darken(theme.status.hil)),'dark')
            }
        }
        for (var _12_ = ci = x, _13_ = cols - 1; (_12_ <= _13_ ? ci < cols - 1 : ci > cols - 1); (_12_ <= _13_ ? ++ci : --ci))
        {
            add(' ',null,'dark')
        }
        add('','dark',this.color.gutter)
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

    return status
})()

export default status;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L3N0YXR1cy9zdGF0dXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXVCUSxLQUFDO1FBQ0QsS0FBQyxNQUFNLFNBQVMsTUFBTSxPQUFPO1FBQzdCLEtBQUMsTUFBTSxTQUFTLE1BQU0sT0FBTyxLQUFDLE1BQU0sT0FBTzs7Ozs7Z0JBSXBDOztpQkFDSDt1QkFBTSxLQUFDLE1BQU07Ozt1QkFDUCxLQUFDLE1BQU07Ozs7Ozs7Ozs7O3VCQUVEOzs7Ozs7Ozs7Ozs7Ozs7K0NBSVYsS0FBQyxPQUFPO1FBRWQsS0FBQyxRQUFXLEtBQUMsT0FBTztRQUNwQixLQUFDLFNBQVc7UUFDWixLQUFDLE9BQVc7UUFDWixLQUFDLFdBQVc7UUFDWixLQUFDO1FBQ0QsS0FBQztRQUVELEtBQUMsY0FBYztRQUVmLEtBQUMsU0FBUyxTQUFTLE1BQU0sT0FBTztRQUVoQyxLQUFDLGFBQWlCLE9BQVcsS0FBQyxPQUFPO1FBQ3JDLEtBQUMsaUJBQWlCLFdBQVcsS0FBQyxPQUFPO1FBQ3JDLEtBQUMsY0FBaUIsT0FBVyxLQUFDLE9BQU87UUFFckMsS0FBQyxPQUFPLFNBQVMsYUFBYyxLQUFDLE1BQU07UUFDdEMsS0FBQyxPQUFPLFNBQVMsY0FBYyxNQUFNLE9BQU87UUFFNUMsS0FBQyxRQUFRLFNBQVMsUUFBUSxNQUFNLE9BQU87UUFDdkMsS0FBQyxRQUFRLGFBQWE7UUFFdEIsS0FBQyxPQUFPLEdBQU8sU0FBUyxLQUFDO1FBQ3pCLEtBQUMsV0FBVyxHQUFHLFNBQVMsS0FBQztRQUN6QixLQUFDLFFBQVEsR0FBTSxTQUFTLEtBQUM7UUFFekIsS0FBSyxHQUFHLGlCQUFpQixLQUFDOzs7Ozs7OztZQUl2QixLQUFDLFNBQVMsU0FBUzs7bUJBQ2xCLEtBQUMsUUFBUSxLQUFJLFVBQVMsS0FBQyxXQUFXLEtBQUMsU0FBUyxTQUFPLEtBQUMsV0FBUyxJQUFJLE9B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
//# sourceURL=kode/ked/view/status/status.kode
