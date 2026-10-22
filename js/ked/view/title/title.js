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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvdGl0bGUvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCUyxpQkFBVDs7YUFFSTs7O1FBRUksS0FBQztRQUNELEtBQUMsTUFBTSxTQUFTLE1BQU0sTUFBTTtRQUM1QixLQUFDLE1BQU0sU0FBUyxNQUFNLE9BQU8sS0FBQyxNQUFNLE9BQU87Ozs2QkFFL0MsdUJBQVUsR0FBRSxHQUFFOztnQkFFSDs7aUJBQ0g7dUJBQU0sS0FBQyxNQUFNOzs7dUJBQ1AsS0FBQyxNQUFNOzs7OztXQVpoQjs7OztBQWNBLFNBQVQ7O3NCQUF1QjthQUVuQixPQUFHLFFBQVE7Ozs7Ozs7Ozs7Ozs7OzhDQUVELEtBQUMsT0FBTztRQUVkLEtBQUMsUUFBVyxLQUFDLE9BQU87UUFDcEIsS0FBQyxTQUFXO1FBQ1osS0FBQyxPQUFXO1FBQ1osS0FBQyxXQUFXO1FBQ1osS0FBQztRQUNELEtBQUM7UUFFRCxLQUFDLGNBQWM7UUFFZixLQUFDLFNBQVMsU0FBUyxNQUFNLE9BQU87UUFFaEMsS0FBQyxhQUFnQixPQUFXLEtBQUMsT0FBTztRQUNwQyxLQUFDLGdCQUFnQixVQUFXLEtBQUMsT0FBTztRQUNwQyxLQUFDLGNBQWdCLE9BQVcsS0FBQyxPQUFPO1FBRXBDLEtBQUMsT0FBTyxTQUFTLGFBQWMsS0FBQyxNQUFNO1FBQ3RDLEtBQUMsT0FBTyxTQUFTLGNBQWMsTUFBTSxNQUFNO1FBRTNDLEtBQUMsUUFBUSxTQUFTLFFBQVEsTUFBTSxNQUFNO1FBQ3RDLEtBQUMsUUFBUSxhQUFhO1FBRXRCLEtBQUMsT0FBTyxHQUFPLFNBQVMsS0FBQztRQUN6QixLQUFDLFVBQVUsR0FBSSxTQUFTLEtBQUM7UUFDekIsS0FBQyxRQUFRLEdBQU0sU0FBUyxLQUFDO1FBRXpCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQzs7O3FCQUU3Qiw2QkFBZ0IsVUFBVTs7Ozs7WUFFbkIsS0FBQyxTQUFTLFNBQVM7O21CQUNsQixLQUFDLFFBQVEsS0FBSSxVQUFTLEtBQUMsV0FBVyxLQUFDLFNBQVMsU0FBTyxLQUFDLFdBQVMsSUFBSSxPQUFNLEtBQUMsU0FBUyxTQUFPOzs7O21CQUV4RixLQUFDLFFBQVEsSUFBSTs7OztxQkFFckIsOEJBQWlCLFFBQU87Ozs7Z0JBRWI7O2lCQUNIO2dCQUFVLFlBQUk7O2lCQUNkO3VCQUFVLEtBQUssS0FBSzs7aUJBQ3BCO29CQUNPLFFBQVEsU0FBUyxTQUFTOztvQkFDekIsUUFBUSxRQUFRLFNBQVMsY0FBSzs7K0JBQU8sR0FBRzs7b0JBQ3hDLFFBQVEsTUFBTTt3QkFDRyxRQUFRLFdBQVU7O3dCQUFuQyxNQUFNOzsyQkFDTixLQUFLLEtBQUssY0FBYSxNQUFNLE1BQU0sS0FBSyxLQUFDLFFBQVEsTUFBTSxhQUFNLEtBQUMsUUFBUSxNQUFNLE9BQUssR0FBRyxLQUFDLFFBQVEsTUFBTSxJQUFFOzs7Ozs7O3FCQUVySCw2QkFBZ0IsUUFBTyxNQUFLOztnQkFFakI7O2lCQUVIO2dCQUVJLGFBQWEsS0FBQzsrQkFDTCxNQUFNOzsyQkFDWCxLQUFLLEtBQUssY0FBYzs7OzsyQkFFeEIsS0FBSyxLQUFLLGFBQWE7OztpQkFFL0I7Z0JBRUksS0FBSyxLQUFLO2dCQUNWLGFBQWEsS0FBQzt1QkFDZCxLQUFDLGFBQWEsdUJBQWEsR0FBRTs7OzsrQkFBVSxLQUFDLFdBQVcsRUFBRTs7K0JBQUksS0FBSyxPQUFROztpQkFFMUU7Z0JBRUksYUFBYSxLQUFDOzhCQUNQLEtBQUM7Ozs7OztxQkFFcEIsK0JBQVksTUFBSzs7OztRQUViLGFBQWEsS0FBQztlQUNQLEtBQUM7UUFFUixPQUFPLE1BQU0sUUFBUTtRQUNyQixjQUFTLElBQUksS0FBSyxNQUFLLFVBQVU7UUFDakMsSUFBSSxLQUFDLE9BQU8sTUFBTSxjQUFPLE1BQU0sS0FBSyxLQUFHLE1BQU0sS0FBSyxNQUFJO2VBQ3RELEtBQUssS0FBSyxjQUFhLE1BQU0sTUFBTSxLQUFLLEVBQUUsS0FBQyxPQUFPLE1BQU0sSUFBRTs7O3FCQUU5RCwyQkFBYyxRQUFPOztnQkFFVjs7aUJBQ0g7dUJBQVUsS0FBSyxLQUFLLGFBQWEsTUFBTSxJQUFJLE1BQU07Ozs7OztxQkFRekQsc0JBQVM7Ozs7UUFFTCxPQUFPLEtBQUMsT0FBVyxRQUFRO1FBQzNCLE9BQU8sS0FBQyxVQUFVLFFBQVE7UUFDMUIsT0FBTyxLQUFDLFFBQVcsUUFBUTtZQUVBLFFBQVEsUUFBUTs7bUJBQXhDLFFBQVEsUUFBUTs7MENBRWI7a0JBRU0sS0FBQyxTQUFTOztZQUVjLEtBQUM7O1lBQXJDLEtBQUssS0FBSyxVQUFVLEtBQUM7O2dCQUVkLE1BQU07O2lCQUVUO29CQUVPLEtBQUM7O3lCQUNHLEtBQUssT0FBQSxNQUFNOzt3QkFDVixLQUFLLEtBQUs7Z0NBQ1AsT0FBTzs7eUJBQ1gsS0FBQyxNQUFNLE9BQUssTUFBTSxPQUFBLE1BQU0sS0FBQyxNQUFNOzt3QkFDOUIsS0FBSyxLQUFLO2dDQUNQLE9BQU87Ozs7OztlQUUxQixLQUFDOzs7cUJBUUwsc0JBQVM7Ozs7c0JBRU8sS0FBQzs7OztRQUNiLEtBQUMsT0FBTyxJQUFJLE1BQU0sSUFBSSxLQUFDO2VBQ3ZCLEtBQUMsVUFBVSxJQUFJLEtBQUM7OztxQkFRcEIscUJBQVEsR0FBRSxHQUFFLEdBQUU7O3lDQUVKLEVBQUUsRUFBRSxFQUFFOzs7O1FBRVosY0FBUyxJQUFFO1FBRVgsS0FBSyxLQUFDLFNBQU87UUFFYixLQUFDLE9BQU8sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixLQUFDLE9BQU8sT0FBTyxFQUFFLEVBQUUsS0FBQyxPQUFPLFFBQVEsT0FBTztRQUUxQyxLQUFLLEtBQUMsT0FBTyxRQUFRO1FBRXJCLEtBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxLQUFDLFVBQVUsUUFBUSxPQUFPO1FBRWhELEtBQUssS0FBQyxVQUFVLFFBQVE7ZUFFeEIsS0FBQyxRQUFRLE9BQU8sRUFBRSxFQUFFLEtBQUMsUUFBUSxRQUFRLE9BQU87OztxQkFRaEQ7Ozs7WUFFVSxLQUFDLHNCQUFrQixLQUFDOzs7O1FBRTFCLElBQVM7UUFDVCxJQUFTO1FBQ1QsU0FBUyxLQUFDLE1BQU07UUFDaEIsT0FBUyxLQUFDLE1BQU07UUFDaEIsTUFBUyxLQUFDLEtBQUs7UUFDZixNQUFTLEtBQUMsTUFBTTtRQUNoQixNQUFTLEtBQUMsTUFBTTtRQUVoQixpQkFBTSxHQUFFLE1BQUssSUFBRzs7MEJBQ1Q7O2dCQUFZLEtBQUssTUFBTSxNQUFNOzswQkFDN0I7O2dCQUFZLEtBQUssTUFBTSxNQUFNOztZQUNoQyxLQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsS0FBSyxHQUFHO21CQUN2Qjs7UUFDSixpQkFBTSxNQUFLLElBQUc7O21CQUFNLEtBQUssSUFBSSxFQUFFLEtBQUssR0FBRzs7UUFFdkMsSUFBSSxJQUFJLE1BQU0sS0FBQyxNQUFNO1FBQ3JCLGlCQUFhLEtBQUMsU0FBTyxLQUFLLE9BQU8sS0FBRzt1QkFDaEMsS0FBTSxTQUFJLEtBQUMsMkJBQUQsS0FBQyxjQUFELEtBQUM7O1lBQ1gsTUFBSyxPQUFPLEtBQUssT0FBTztnQkFDSixLQUFLLGtCQUFrQixLQUFDLE1BQU0sRUFBRSxNQUFNOztnQkFBMUQsS0FBSzs7WUFDTCxNQUFLLEtBQUcsSUFBSSxNQUFNLFVBQVUsTUFBTSxLQUFHLEtBQUssS0FBSSxHQUFHOztRQUNyRCxJQUFJLElBQUksTUFBTSxLQUFDLE1BQU07UUFFckIsS0FBQyxPQUFPO1FBQ1IsS0FBQyxVQUFVO1FBQ1gsS0FBQyxRQUFRO1FBRVQsS0FBSyxLQUFDLE9BQU8sUUFBUTtRQUNyQixLQUFLLEtBQUMsVUFBVSxRQUFRO1FBQ3hCLEtBQUssS0FBQyxRQUFRLFFBQVE7UUFHdEIsSUFBSSxJQUFJLE9BQVE7WUFDVTs7WUFBMUIsSUFBSSxJQUFJLFFBQVE7O1lBQ1U7O1lBQTFCLElBQUksSUFBSSxRQUFROztZQUNVOztZQUExQixJQUFJLElBQUksT0FBUTs7UUFDaEIsSUFBSSxJQUFJLE9BQVE7WUFFYixLQUFDLE1BQU0sRUFBRSxRQUFRLFNBQVM7O1lBRXpCLFNBQVMsS0FBQyxNQUFNLEVBQUUsUUFBUTsyQkFFdEIsSUFBSyxTQUFJLElBQUksMEJBQUosSUFBSSxhQUFKLElBQUk7O2dCQUNiLElBQUksSUFBSSxLQUFJLElBQUUsSUFBSSxTQUFPLEtBQUssUUFBUSxNQUFNLE9BQU8sTUFBTSxNQUFNLE1BQUs7OztZQUV6RSxLQUFDLE1BQU0sRUFBRSxXQUFXOztZQUVuQixTQUFTLEtBQUMsTUFBTSxFQUFFLFdBQVc7MkJBRXpCLElBQUssU0FBSSxJQUFJLDBCQUFKLElBQUksYUFBSixJQUFJOztnQkFDYixJQUFJLElBQUksS0FBSSxJQUFFLElBQUksU0FBTyxLQUFLLFFBQVEsTUFBTSxPQUFPLE1BQU0sTUFBTSxNQUFLOzs7WUFFekUsS0FBQyxNQUFNLEVBQUUsV0FBVzs7WUFFbkIsU0FBUyxLQUFDLE1BQU0sRUFBRSxXQUFXOzRCQUV6QixJQUFLLFVBQUksSUFBSSw0QkFBSixJQUFJLGFBQUosSUFBSTs7Z0JBQ2IsSUFBSSxJQUFJLEtBQUksSUFBRSxJQUFJLFNBQU8sS0FBSyxRQUFRLE1BQU0sT0FBTyxNQUFNLE1BQU0sTUFBSzs7O3dCQUl4RSxLQUFNLFVBQUksT0FBSyx3QkFBTCxPQUFLLFNBQUwsT0FBSzs7WUFDZixJQUFJLElBQUksS0FBSzs7UUFFakIsSUFBSSxJQUFJLE9BQU8sS0FBQyxNQUFNO1lBRW5COztZQUNDLGVBQVcsRUFBRSxZQUFPLEtBQUMsUUFBTSxPQUFLLFFBQU0sS0FBRztZQUN6QyxLQUFLLE9BQU87WUFDWixPQUFPLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJO29CQUMxQzs7cUJBQ0g7b0JBQU07O3FCQUNOO29CQUFNOztxQkFDTjtvQkFBTTs7OzttQkFDVixJQUFJLE9BQUssRUFBRSxHQUFHLEdBQUc7Ozs7V0FyUHBCOzs7ZUF1UEYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/title.kode
