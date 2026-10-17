var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var brocol

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post
let kstr = kxk.kstr
let nfs = kxk.nfs

import icons from "../../theme/icons.js"

import choices from "../menu/choices.js"

import diritem from "./diritem.js"

import rgxs from './quicky.json' with { type : "json" }

brocol = (function ()
{
    _k_.extend(brocol, choices)
    function brocol (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["show"] = this["show"].bind(this)
        brocol.__super__.constructor.call(this,screen,name,['scrllr'])
        this.frontRoundOffset = 2
        this.state.syntax.setRgxs(rgxs)
    }

    brocol.prototype["isCursorVisible"] = function ()
    {
        return false
    }

    brocol.prototype["show"] = function (dir)
    {
        this.listDir(dir)
        return brocol.__super__.show.call(this)
    }

    brocol.prototype["onMouse"] = function (event)
    {
        var col, ret, row

        if (this.hidden())
        {
            return
        }
        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        ret = brocol.__super__.onMouse.call(this,event)
        if (this.hoverIndex >= 0 && (!(this.hover) || this.state.isInvalidLineIndex(row)))
        {
            return this.unhover()
        }
        return ret
    }

    brocol.prototype["listDir"] = async function (dir)
    {
        var item, items, weight

        try
        {
            items = await nfs.list(dir,{recursive:false})
        }
        catch (err)
        {
            this.clear()
            post.emit('redraw')
            return
        }
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = ' ' + diritem.symbolName(item)
        }
        weight = (function (item)
        {
            var p, w

            p = slash.parse(item.path)
            w = 0
            if (item.type === 'file')
            {
                w += 10000
            }
            if (item.tilde.startsWith(icons.dir + ' .'))
            {
                w += 1000
            }
            if (_k_.in(slash.ext(item.tilde),['js','json']))
            {
                w += 1
            }
            w += kstr.weight(p.file)
            return w
        }).bind(this)
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        items.unshift({tilde:''})
        this.set(items,'tilde')
        this.state.setView([0,0])
        return post.emit('redraw')
    }

    return brocol
})()

export default brocol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9icm9jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztPQWFPLEtBQUssS0FBSyxnQkFBZ0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOzs7O3VCQUU3Qjs7Ozs7K0NBSVYsT0FBTyxNQUFNO1FBRW5CLEtBQUMsbUJBQW1CO1FBQ3BCLEtBQUMsTUFBTSxPQUFPLFFBQVE7Ozs7O2VBRU47Ozs7O1FBSWhCLEtBQUMsUUFBUTs7Ozs7Ozs7WUFLSCxLQUFDOzs7O2tCQUVLLEtBQUMsU0FBUzs7UUFFdEIseUNBQVk7WUFFVCxLQUFDLGNBQWMsUUFBVyxLQUFDLFVBQVUsS0FBQyxNQUFNLG1CQUFtQjs7bUJBQzNELEtBQUM7O2VBRVI7Ozs7Ozs7OztZQUtJLGNBQVMsSUFBSSxLQUFLLEtBQUksVUFBVTs7ZUFDOUI7O1lBQ0YsS0FBQztZQUNELEtBQUssS0FBSzs7OzRCQUdGOzs7O1lBQ1IsS0FBSyxRQUFRLE1BQU0sUUFBUSxXQUFXOztRQUUxQzs7OztZQUVJLElBQUksTUFBTSxNQUFNLEtBQUs7WUFFckIsSUFBSTtnQkFDVSxLQUFLLFNBQVE7O2dCQUEzQixLQUFLOztnQkFDUyxLQUFLLE1BQU0sV0FBVyxNQUFNLE1BQU07O2dCQUFoRCxLQUFLOzt1QkFDUyxNQUFNLElBQUksS0FBSyxRQUFXLEtBQUs7O2dCQUE3QyxLQUFLOztZQUNMLEtBQUssS0FBSyxPQUFPLEVBQUU7bUJBQ25COztRQUVKLE1BQU07O21CQUFjLE9BQU8sS0FBSyxPQUFPOztRQUV2QyxNQUFNLFNBQVEsTUFBTTtRQUVwQixLQUFDLElBQUksTUFBTTtRQUNYLEtBQUMsTUFBTSxTQUFTLEVBQUU7ZUFFbEIsS0FBSyxLQUFLOzs7Ozs7ZUFFWCJ9
//# sourceURL=file://kode/ked/view/colmns/brocol.kode
