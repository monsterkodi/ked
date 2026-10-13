var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var droop

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import rounded from "../../util/img/rounded.js"

import inputchoice from "../menu/inputchoice.js"

import quicky from "./quicky.js"
import diritem from "./diritem.js"


droop = (function ()
{
    _k_.extend(droop, quicky)
    function droop (screen, editor)
    {
        this.screen = screen
        this.editor = editor
    
        this["arrange"] = this["arrange"].bind(this)
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["preview"] = this["preview"].bind(this)
        this["onShow"] = this["onShow"].bind(this)
        this["onHide"] = this["onHide"].bind(this)
        droop.__super__.constructor.call(this,this.screen,'droop')
        this.isVisible = false
        this.setColor('bg',theme.droop.bg)
        this.setColor('frame',theme.quicky.frame)
        post.on('droop.show',this.onShow)
        post.on('droop.hide',this.onHide)
    }

    droop.prototype["onHide"] = function ()
    {
        return this.hide()
    }

    droop.prototype["onShow"] = function (d)
    {
        var item, items, lines

        this.pos = d.pos
        if (_k_.empty(d.files))
        {
            return
        }
        if (_k_.isStr(d.files[0]))
        {
            items = d.files.map(function (f)
            {
                return {path:f}
            })
        }
        else
        {
            items = d.files
        }
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = ' ' + diritem.symbolName(item)
        }
        lines = items.map(function (i)
        {
            return i.tilde
        })
        this.choicesWidth = belt.widthOfLines(lines)
        return this.showPathItems(items)
    }

    droop.prototype["preview"] = async function (item)
    {}

    droop.prototype["drawFrame"] = function ()
    {
        droop.__super__.drawFrame.call(this)
    
        var bg, sy

        sy = 0
        bg = this.color.bg
        if (this.input.visible())
        {
            sy = 2
            if (this.input.hasFocus())
            {
                bg = color.brighten(bg)
            }
        }
        if (this.cells.y <= 1 && this.input.hidden())
        {
            this.cells.fill_row(sy,1,this.cells.cols - 2,' ',null,bg)
            this.cells.img(0,sy,'rounded.border.l',bg,1002)
            return this.cells.img(this.cells.cols - 1,sy,'rounded.border.r',bg,1002)
        }
    }

    droop.prototype["onChoicesAction"] = function (action, choice)
    {
        return inputchoice.prototype.onChoicesAction.call(this,action,choice)
    }

    droop.prototype["arrange"] = function ()
    {
        var ch, cw, h, ih, iz, w, x, y

        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        cw = this.choicesWidth + 3
        w = cw + 2
        ch = _k_.min(10,this.choices.numFiltered())
        h = ch + ih + 2
        x = this.pos[0] - parseInt(cw / 2)
        y = this.pos[1]
        x = _k_.min(x,this.editor.cells.x + this.editor.cells.cols - w)
        x = _k_.max(x,this.editor.cells.x)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,cw,ch)
        return this.cells.layout(x,y,w,h)
    }

    return droop
})()

export default droop;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvb3AuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2Ryb29wLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQWV1Qjs7Ozs7Ozs7Ozs7OENBSVQsS0FBQyxPQUFPO1FBRWQsS0FBQyxZQUFZO1FBRWIsS0FBQyxTQUFTLEtBQVEsTUFBTSxNQUFNO1FBQzlCLEtBQUMsU0FBUyxRQUFRLE1BQU0sT0FBTztRQUUvQixLQUFLLEdBQUcsYUFBYSxLQUFDO1FBQ3RCLEtBQUssR0FBRyxhQUFhLEtBQUM7Ozs7O2VBRWYsS0FBQzs7Ozs7OztRQUlSLEtBQUMsTUFBTSxFQUFFO3NCQUVHLEVBQUU7Ozs7c0JBRVgsRUFBRSxNQUFNOztZQUNQLFFBQVEsRUFBRSxNQUFNOzt3QkFBVyxLQUFLOzs7OztZQUVoQyxRQUFRLEVBQUU7OzRCQUVGOzs7O1lBQ1IsS0FBSyxRQUFRLE1BQUksUUFBUSxXQUFXOztRQUV4QyxRQUFRLE1BQU07O21CQUFXLEVBQUU7O1FBQzNCLEtBQUMsZUFBZSxLQUFLLGFBQWE7ZUFDbEMsS0FBQyxjQUFjOzs7Ozs7Ozs7Ozs7UUFRZixLQUFLO1FBQ0wsS0FBSyxLQUFDLE1BQU07WUFFVCxLQUFDLE1BQU07O1lBQ04sS0FBSztnQkFDc0IsS0FBQyxNQUFNOztnQkFBbEMsS0FBSyxNQUFNLFNBQVM7OztZQUVyQixLQUFDLE1BQU0sS0FBSyxLQUFNLEtBQUMsTUFBTTs7WUFDeEIsS0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFFLEtBQUMsTUFBTSxPQUFLLEVBQUUsSUFBSSxLQUFLO1lBQzVDLEtBQUMsTUFBTSxJQUFJLEVBQWMsR0FBRyxtQkFBbUIsR0FBRzttQkFDbEQsS0FBQyxNQUFNLElBQUksS0FBQyxNQUFNLE9BQUssRUFBRSxHQUFHLG1CQUFtQixHQUFHOzs7Ozs7ZUFJdEQsWUFBWSxVQUFVLGdCQUFnQixLQUFLLEtBQUUsT0FBTzs7Ozs7OztRQUlwRCxNQUFLLEtBQUMsa0JBQWtCLElBQUk7UUFDNUIsYUFBUyxFQUFFLEtBQUs7UUFFaEIsS0FBSyxLQUFDLGVBQWE7UUFDbkIsSUFBSyxLQUFHO1FBRVIsYUFBUyxHQUFHLEtBQUMsUUFBUTtRQUNyQixJQUFLLEtBQUssS0FBSztRQUVmLElBQUssS0FBQyxJQUFJLGNBQVMsS0FBRztRQUN0QixJQUFLLEtBQUMsSUFBSTtRQUVWLFlBQVEsRUFBRSxLQUFDLE9BQU8sTUFBTSxJQUFJLEtBQUMsT0FBTyxNQUFNLE9BQU87UUFDakQsWUFBUSxFQUFFLEtBQUMsT0FBTyxNQUFNO1FBRXhCLEtBQUMsTUFBTSxPQUFVLElBQUUsRUFBRyxJQUFFLEVBQU0sSUFBRSxFQUFHO1FBQ25DLEtBQUMsUUFBUSxPQUFRLElBQUUsRUFBRyxJQUFFLElBQUUsR0FBSSxHQUFLO2VBQ25DLEtBQUMsTUFBTSxPQUFVLEVBQUssRUFBUSxFQUFLOzs7Ozs7ZUFFcEMifQ==
//# sourceURL=file://kode/ked/view/colmns/droop.kode
