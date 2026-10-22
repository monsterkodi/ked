var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var searcherfile

import kxk from "../../../kxk.js"
let slash = kxk.slash
let kseg = kxk.kseg

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import crumbs from "../base/crumbs.js"
import bubble from "../base/bubble.js"


searcherfile = (function ()
{
    _k_.extend(searcherfile, view)
    function searcherfile (screen, name)
    {
        this.screen = screen
        this.name = name
    
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        searcherfile.__super__.constructor.call(this,this.screen,this.name)
        this.crumbs = new crumbs(this.screen,`${this.name}_crumbs`)
        this.bubble = new bubble(this.screen,`${this.name}_bubble`)
        this.setColor('bg',theme.finder.bg)
        this.setColor('frame',theme.finder.frame)
        this.crumbs.setColor('empty',this.color.bg)
        this.bubble.setColor('empty',this.color.bg)
        this.crumbs.dotlessRelative = true
        this.crumbs.on('action',this.onCrumbsAction)
    }

    searcherfile.prototype["set"] = function (file)
    {
        var name

        this.crumbs.set(slash.dir(file))
        name = slash.file(file)
        return this.bubble.set({tilde:name,path:file,segls:kseg.segls('/' + name)})
    }

    searcherfile.prototype["layout"] = function (x, y, w, h)
    {
        var bw, cw

        cw = this.crumbs.rounded.length
        bw = this.bubble.rounded.length
        if (true)
        {
            this.crumbs.layout(x + w - bw - cw,y,cw,1)
            this.bubble.layout(x + w - bw,y,bw,1)
        }
        else
        {
            this.crumbs.layout(x,y,cw,1)
            this.bubble.layout(x + cw,y,bw,1)
        }
        return this.cells.layout(x,y,w,1)
    }

    searcherfile.prototype["draw"] = function ()
    {
        var xe, xs

        if (this.hidden())
        {
            return
        }
        searcherfile.__super__.draw.call(this)
        this.crumbs.draw()
        this.bubble.draw()
        if (true)
        {
            return this.cells.fill_row(0,0,this.cells.cols - this.crumbs.rounded.length - this.bubble.rounded.length - 1,'─',this.color.frame,this.color.bg)
        }
        else
        {
            xs = this.crumbs.rounded.length + this.bubble.rounded.length
            xe = this.cells.x + this.cells.cols
            return this.cells.fill_row(0,xs,xe,'─',this.color.frame,this.color.bg)
        }
    }

    searcherfile.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.crumbs.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.bubble.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return searcherfile.__super__.onMouse.call(this,event)
    }

    searcherfile.prototype["onCrumbsAction"] = function (action, path)
    {
        console.log(`onCrumbsAction ${action} ${path}`)
    }

    return searcherfile
})()

export default searcherfile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXJmaWxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvc2VhcmNoZXJmaWxlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWNTLGdCQUFUOzs2QkFBOEI7YUFFMUIsY0FBRyxRQUFROzs7Ozs7O3FEQUVELEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxhQUFhLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFDakMsS0FBQyxhQUFhLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFFakMsS0FBQyxTQUFTLEtBQVMsTUFBTSxPQUFPO1FBQ2hDLEtBQUMsU0FBUyxRQUFTLE1BQU0sT0FBTztRQUVoQyxLQUFDLE9BQU8sU0FBUyxRQUFRLEtBQUMsTUFBTTtRQUNoQyxLQUFDLE9BQU8sU0FBUyxRQUFRLEtBQUMsTUFBTTtRQUVoQyxLQUFDLE9BQU8sa0JBQWtCO1FBQzFCLEtBQUMsT0FBTyxHQUFHLFNBQVUsS0FBQzs7OzRCQVExQixrQkFBSzs7OztRQUVELEtBQUMsT0FBTyxJQUFJLE1BQU0sSUFBSTtRQUV0QixPQUFPLE1BQU0sS0FBSztlQUVsQixLQUFDLE9BQU8sS0FBSSxNQUFNLEtBQUssS0FBSyxLQUFLLE1BQU0sS0FBSyxNQUFNLE1BQUk7Ozs0QkFRMUQscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7UUFFVixLQUFLLEtBQUMsT0FBTyxRQUFRO1FBQ3JCLEtBQUssS0FBQyxPQUFPLFFBQVE7WUFFbEI7O1lBQ0MsS0FBQyxPQUFPLE9BQU8sSUFBRSxJQUFFLEtBQUcsR0FBSSxFQUFFLEdBQUc7WUFDL0IsS0FBQyxPQUFPLE9BQU8sSUFBRSxJQUFFLEdBQU8sRUFBRSxHQUFHOzs7O1lBRS9CLEtBQUMsT0FBTyxPQUFPLEVBQVMsRUFBRSxHQUFHO1lBQzdCLEtBQUMsT0FBTyxPQUFPLElBQUUsR0FBTyxFQUFFLEdBQUc7O2VBRWpDLEtBQUMsTUFBTSxPQUFRLEVBQUssRUFBRSxFQUFHOzs7NEJBUTdCOzs7O1lBRVUsS0FBQzs7Ozs7UUFJUCxLQUFDLE9BQU87UUFDUixLQUFDLE9BQU87WUFFTDs7bUJBQ0MsS0FBQyxNQUFNLFNBQVMsRUFBRSxFQUFFLEtBQUMsTUFBTSxPQUFLLEtBQUMsT0FBTyxRQUFRLFNBQU8sS0FBQyxPQUFPLFFBQVEsU0FBTyxFQUFFLElBQUksS0FBQyxNQUFNLE1BQU0sS0FBQyxNQUFNOzs7O1lBRXhHLEtBQUssS0FBQyxPQUFPLFFBQVEsU0FBUyxLQUFDLE9BQU8sUUFBUTtZQUM5QyxLQUFLLEtBQUMsTUFBTSxJQUFJLEtBQUMsTUFBTTttQkFDdkIsS0FBQyxNQUFNLFNBQVMsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFDLE1BQU0sTUFBTSxLQUFDLE1BQU07Ozs7NEJBUXhELHNCQUFTOzs7O1lBRUMsS0FBQzs7OztRQUVQLE1BQU0sS0FBQyxPQUFPLFFBQVE7YUFBa0IsY0FBQSxJQUFLOzttQkFBWjs7UUFDakMsTUFBTSxLQUFDLE9BQU8sUUFBUTthQUFrQixjQUFBLElBQUs7O21CQUFaOzt3REFFM0I7Ozs0QkFRViw2QkFBZ0IsUUFBTzs7UUFFbkIsOEJBQXNCLFVBQVU7OztXQWpHL0I7OztlQW1HRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/searcherfile.kode
