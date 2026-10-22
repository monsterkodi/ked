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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvb3AuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2Ryb29wLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRYSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFQOztPQUNPLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksY0FBQTs7T0FDQSxrQkFBZjs7T0FDZSxhQUFBO09BQU8sY0FBQTs7O0FBRXBCLFNBQVQ7O3NCQUF1QjthQUVuQixPQUFJLFFBQVE7O1FBQVQ7UUFBUTs7Ozs7Ozs4Q0FFRCxLQUFDLE9BQU87UUFFZCxLQUFDLFlBQVk7UUFFYixLQUFDLFNBQVMsS0FBUSxNQUFNLE1BQU07UUFDOUIsS0FBQyxTQUFTLFFBQVEsTUFBTSxPQUFPO1FBRS9CLEtBQUssR0FBRyxhQUFhLEtBQUM7UUFDdEIsS0FBSyxHQUFHLGFBQWEsS0FBQzs7O3FCQUUxQjs7ZUFBVyxLQUFDOzs7cUJBRVoscUJBQVE7Ozs7UUFFSixLQUFDLE1BQU0sRUFBRTtzQkFFRyxFQUFFOzs7O1lBRUcsVUFBZCxFQUFFLE1BQU07O1lBQ1AsUUFBUSxFQUFFLE1BQU0sY0FBSzs7d0JBQU0sS0FBSzs7Ozs7WUFFaEMsUUFBUSxFQUFFOzs0QkFFRjs7O1lBQVI7WUFDQSxLQUFLLFFBQVEsTUFBSSxRQUFRLFdBQVc7O1FBRXhDLFFBQVEsTUFBTSxjQUFLOzttQkFBTSxFQUFFOztRQUMzQixLQUFDLGVBQWUsS0FBSyxhQUFhO2VBQ2xDLEtBQUMsY0FBYzs7O3FCQUVuQiw0QkFBUzs7O3FCQUVUOzs7Ozs7UUFJSSxLQUFLO1FBQ0wsS0FBSyxLQUFDLE1BQU07WUFFVCxLQUFDLE1BQU07O1lBQ04sS0FBSztnQkFDc0IsS0FBQyxNQUFNOztnQkFBbEMsS0FBSyxNQUFNLFNBQVM7OztZQUVyQixLQUFDLE1BQU0sS0FBSyxLQUFNLEtBQUMsTUFBTTs7WUFDeEIsS0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFFLEtBQUMsTUFBTSxPQUFLLEVBQUUsSUFBSSxLQUFLO1lBQzVDLEtBQUMsTUFBTSxJQUFJLEVBQWMsR0FBRyxtQkFBbUIsR0FBRzttQkFDbEQsS0FBQyxNQUFNLElBQUksS0FBQyxNQUFNLE9BQUssRUFBRSxHQUFHLG1CQUFtQixHQUFHOzs7O3FCQUUxRCw4QkFBaUIsUUFBTzs7ZUFFcEIsWUFBWSxVQUFVLGdCQUFnQixLQUFLLEtBQUUsT0FBTzs7O3FCQUV4RDs7OztRQUVJLE1BQUssS0FBQyxrQkFBa0IsSUFBSTtRQUM1QixhQUFTLEVBQUUsS0FBSztRQUVoQixLQUFLLEtBQUMsZUFBYTtRQUNuQixJQUFLLEtBQUc7UUFFUixhQUFTLEdBQUcsS0FBQyxRQUFRO1FBQ3JCLElBQUssS0FBSyxLQUFLO1FBRWYsSUFBSyxLQUFDLElBQUksY0FBUyxLQUFHO1FBQ3RCLElBQUssS0FBQyxJQUFJO1FBRVYsWUFBUSxFQUFFLEtBQUMsT0FBTyxNQUFNLElBQUksS0FBQyxPQUFPLE1BQU0sT0FBTztRQUNqRCxZQUFRLEVBQUUsS0FBQyxPQUFPLE1BQU07UUFFeEIsS0FBQyxNQUFNLE9BQVUsSUFBRSxFQUFHLElBQUUsRUFBTSxJQUFFLEVBQUc7UUFDbkMsS0FBQyxRQUFRLE9BQVEsSUFBRSxFQUFHLElBQUUsSUFBRSxHQUFJLEdBQUs7ZUFDbkMsS0FBQyxNQUFNLE9BQVUsRUFBSyxFQUFRLEVBQUs7OztXQTNFbEM7OztlQTZFRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/droop.kode
