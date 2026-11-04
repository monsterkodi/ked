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
        var _42_14_

        this.file = ((_42_14_=this.file) != null ? _42_14_ : '')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVmaWxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L3RpdGxlL3RpdGxlZmlsZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQU07O09BQ04sWUFBVDtPQUFlLFlBQWY7O09BQ1MsYUFBUjs7T0FDUSxXQUFaOzs7QUFFTixhQUFEOzswQkFBbUI7YUFHZixXQUFHLFFBQU87Ozs7a0RBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxLQUFTLE1BQU0sTUFBTTtRQUMvQixLQUFDLFNBQVMsUUFBUyxNQUFNLE1BQU07UUFDL0IsS0FBQyxTQUFTLFFBQVMsTUFBTSxNQUFNO1FBRS9CLEtBQUMsY0FBYztRQUNmLEtBQUMsYUFBYTtRQUNkLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQyxVQUFVOzs7eUJBRWY7Ozs7WUFFVSxLQUFDOzs7OztRQUlQLE1BQUssS0FBQyxRQUFRLEtBQUMsTUFBTSxRQUFRLEtBQUMsTUFBTTs0QkFFeEIsS0FBQzthQUFOOztZQUFIO3VCQUNHLEdBQU07O2dCQUNMLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxHQUFHLEdBQUcsS0FBQyxNQUFNOzs7O2dCQUU1QixLQUFLLEtBQUMsT0FBTyxTQUFTLEVBQUU7Z0JBQ3hCLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxHQUFHLEdBQUc7b0JBQ3VCLEtBQUM7O29CQUE3QyxLQUFDLE1BQU0sMkJBQTJCLEVBQUUsRUFBRTs7Ozs7O3lCQUVsRDs7OztRQUVJLEtBQUMsaUJBQUQsS0FBQywwQkFBUTtRQUNULEtBQUMsT0FBTyxNQUFNLE1BQU0sS0FBQztRQUNyQixLQUFDLE9BQU87UUFDUixLQUFDLE9BQU8sVUFBVSxNQUFJLEtBQUMsS0FBSztlQUM1QixLQUFDLFVBQVUsTUFBTSxLQUFDLEtBQUssT0FBTzs7O3lCQUVsQyxrQkFBSzs7WUFFSyxLQUFDLGtCQUFhOzs7O1FBRXBCLEtBQUMsZ0JBQVk7ZUFDYixLQUFDOzs7eUJBRUwsbUJBQU07O1FBQVEsS0FBQyxJQUFJO2VBQU0sS0FBQyxNQUFNLE9BQU87Ozt5QkFFdkMsc0JBQVM7OzhDQUVDOztnQkFFQyxNQUFNOztpQkFFVDtvQkFFTyxLQUFDOztvQkFDQSxLQUFDLEtBQUssU0FBUyxRQUFRLEtBQUM7NEJBQ3RCLE9BQU87Ozs7O2VBQ3JCLEtBQUM7OztXQTdEUjs7O2VBK0RNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlefile.kode
