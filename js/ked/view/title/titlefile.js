var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var titlefile

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import syntax from "../../util/syntax.js"

import view from "../base/view.js"


titlefile = (function ()
{
    _k_.extend(titlefile, view)
    function titlefile (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["show"] = this["show"].bind(this)
        titlefile.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.title.bg)
        this.setColor('empty',theme.title.empty)
        this.setColor('hover',theme.hover.bg)
        this.pointerType = 'pointer'
        this.syntax = new syntax
        this.syntax.setExt('noon')
        this.rounded = ''
    }

    titlefile.prototype["draw"] = function ()
    {
        var bg, ch, fg, x

        if (this.hidden())
        {
            return
        }
        titlefile.__super__.draw.call(this)
        bg = (this.hover ? this.color.hover : this.color.bg)
        var list = _k_.list(this.rounded)
        for (x = 0; x < list.length; x++)
        {
            ch = list[x]
            if (_k_.in(ch,''))
            {
                this.cells.set(x,0,ch,bg,this.color.empty)
            }
            else
            {
                fg = this.syntax.getColor(x,0)
                this.cells.set(x,0,ch,fg,bg)
                if (this.hover)
                {
                    this.cells.adjustContrastForHighlight(x,0,bg)
                }
            }
        }
    }

    titlefile.prototype["adjustText"] = function ()
    {
        var _62_14_

        this.file = ((_62_14_=this.file) != null ? _62_14_ : '')
        this.pars = slash.parse(this.file)
        this.syntax.clear()
        this.syntax.setLines(['/' + this.pars.file])
        return this.rounded = '' + this.pars.file + ''
    }

    titlefile.prototype["set"] = function (file)
    {
        if (this.file === _k_.trim(file))
        {
            return
        }
        this.file = _k_.trim(file)
        return this.adjustText()
    }

    titlefile.prototype["show"] = function (file)
    {
        this.set(file)
        return this.cells.rows = 1
    }

    titlefile.prototype["onMouse"] = function (event)
    {
        titlefile.__super__.onMouse.call(this,event)
    
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    this.emit('action','click',this.file)
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    return titlefile
})()

export default titlefile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVmaWxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L3RpdGxlL3RpdGxlZmlsZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BVWEsVUFBQTtJQUFNO0lBQU07O09BQ04sWUFBVDtPQUFlLFlBQWY7O09BQ1MsYUFBUjs7T0FDUSxXQUFaOzs7QUFFRSxhQUFUOzswQkFBMkI7YUFFdkIsV0FBRyxRQUFPOzs7O2tEQUVBLE9BQU87UUFFYixLQUFDLFNBQVMsS0FBUyxNQUFNLE1BQU07UUFDL0IsS0FBQyxTQUFTLFFBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxRQUFTLE1BQU0sTUFBTTtRQUUvQixLQUFDLGNBQWM7UUFDZixLQUFDLGFBQWE7UUFDZCxLQUFDLE9BQU8sT0FBTztRQUVmLEtBQUMsVUFBVTs7O3lCQVFmOzs7O1lBRVUsS0FBQzs7Ozs7UUFJUCxNQUFLLEtBQUMsUUFBUSxLQUFDLE1BQU0sUUFBUSxLQUFDLE1BQU07NEJBRXhCLEtBQUM7YUFBTjs7WUFBSDt1QkFDRyxHQUFNOztnQkFDTCxLQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsR0FBRyxHQUFHLEtBQUMsTUFBTTs7OztnQkFFNUIsS0FBSyxLQUFDLE9BQU8sU0FBUyxFQUFFO2dCQUN4QixLQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsR0FBRyxHQUFHO29CQUN1QixLQUFDOztvQkFBN0MsS0FBQyxNQUFNLDJCQUEyQixFQUFFLEVBQUU7Ozs7Ozt5QkFRbEQ7Ozs7UUFFSSxLQUFDLGlCQUFELEtBQUMsMEJBQVE7UUFDVCxLQUFDLE9BQU8sTUFBTSxNQUFNLEtBQUM7UUFDckIsS0FBQyxPQUFPO1FBQ1IsS0FBQyxPQUFPLFVBQVUsTUFBSSxLQUFDLEtBQUs7ZUFDNUIsS0FBQyxVQUFVLE1BQU0sS0FBQyxLQUFLLE9BQU87Ozt5QkFFbEMsa0JBQUs7O1lBRUssS0FBQyxrQkFBYTs7OztRQUVwQixLQUFDLGdCQUFZO2VBQ2IsS0FBQzs7O3lCQUVMLG1CQUFNOztRQUFRLEtBQUMsSUFBSTtlQUFNLEtBQUMsTUFBTSxPQUFPOzs7eUJBUXZDLHNCQUFTOzs4Q0FFQzs7Z0JBRUMsTUFBTTs7aUJBRVQ7b0JBRU8sS0FBQzs7b0JBQ0EsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFDOzRCQUN0QixPQUFPOzs7OztlQUNyQixLQUFDOzs7V0E5RUE7OztlQWdGRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlefile.kode
