var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var brocol

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post
let kstr = kxk.kstr

import nfs from "../../../kxk/nfs.js"

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9icm9jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FjTyxLQUFLLEtBQUssZ0JBQWdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7Ozt1QkFFN0I7Ozs7OytDQUlWLE9BQU8sTUFBTTtRQUVuQixLQUFDLG1CQUFtQjtRQUNwQixLQUFDLE1BQU0sT0FBTyxRQUFROzs7OztlQUVOOzs7OztRQUloQixLQUFDLFFBQVE7Ozs7Ozs7O1lBS0gsS0FBQzs7OztrQkFFSyxLQUFDLFNBQVM7O1FBRXRCLHlDQUFZO1lBRVQsS0FBQyxjQUFjLFFBQVcsS0FBQyxVQUFVLEtBQUMsTUFBTSxtQkFBbUI7O21CQUMzRCxLQUFDOztlQUVSOzs7Ozs7Ozs7WUFLSSxjQUFTLElBQUksS0FBSyxLQUFJLFVBQVU7O2VBQzlCOztZQUNGLEtBQUM7WUFDRCxLQUFLLEtBQUs7Ozs0QkFHRjs7OztZQUNSLEtBQUssUUFBUSxNQUFNLFFBQVEsV0FBVzs7UUFFMUM7Ozs7WUFFSSxJQUFJLE1BQU0sTUFBTSxLQUFLO1lBRXJCLElBQUk7Z0JBQ1UsS0FBSyxTQUFROztnQkFBM0IsS0FBSzs7Z0JBQ1MsS0FBSyxNQUFNLFdBQVcsTUFBTSxNQUFNOztnQkFBaEQsS0FBSzs7dUJBQ1MsTUFBTSxJQUFJLEtBQUssUUFBVyxLQUFLOztnQkFBN0MsS0FBSzs7WUFDTCxLQUFLLEtBQUssT0FBTyxFQUFFO21CQUNuQjs7UUFFSixNQUFNOzttQkFBYyxPQUFPLEtBQUssT0FBTzs7UUFFdkMsTUFBTSxTQUFRLE1BQU07UUFFcEIsS0FBQyxJQUFJLE1BQU07UUFDWCxLQUFDLE1BQU0sU0FBUyxFQUFFO2VBRWxCLEtBQUssS0FBSzs7Ozs7O2VBRVgifQ==
//# sourceURL=kode/ked/view/colmns/brocol.kode
