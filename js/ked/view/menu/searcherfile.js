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
        this.marker = '●'
        this.excluded = false
        this.selected = false
        this.crumbs = new crumbs(this.screen,`${this.name}_crumbs`)
        this.bubble = new bubble(this.screen,`${this.name}_bubble`)
        this.setColor('bg',theme.finder.bg)
        this.setColor('frame',theme.finder.frame)
        this.setColor('selection',theme.selection.span)
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
        var lineColor, xe, xs

        if (this.hidden())
        {
            return
        }
        searcherfile.__super__.draw.call(this)
        this.crumbs.draw()
        this.bubble.draw()
        lineColor = (this.selected ? this.color.selection : this.color.frame)
        if (true)
        {
            return this.cells.fill_row(0,0,this.cells.cols - this.crumbs.rounded.length - this.bubble.rounded.length - 1,'─',lineColor,this.color.bg)
        }
        else
        {
            xs = this.crumbs.rounded.length + this.bubble.rounded.length
            xe = this.cells.x + this.cells.cols
            return this.cells.fill_row(0,xs,xe,'─',lineColor,this.color.bg)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXJmaWxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvc2VhcmNoZXJmaWxlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUOztPQUNTLFdBQVo7T0FBaUIsYUFBakI7T0FBd0IsYUFBeEI7OztBQUNOLGdCQUFEOzs2QkFBYzthQUdWLGNBQUksUUFBUTs7UUFBVDtRQUFROzs7O3FEQUVELEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxTQUFXO1FBQ1osS0FBQyxXQUFXO1FBQ1osS0FBQyxXQUFXO1FBRVosS0FBQyxhQUFhLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFDakMsS0FBQyxhQUFhLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFFakMsS0FBQyxTQUFTLEtBQVksTUFBTSxPQUFPO1FBQ25DLEtBQUMsU0FBUyxRQUFZLE1BQU0sT0FBTztRQUNuQyxLQUFDLFNBQVMsWUFBWSxNQUFNLFVBQVU7UUFFdEMsS0FBQyxPQUFPLFNBQVMsUUFBUSxLQUFDLE1BQU07UUFDaEMsS0FBQyxPQUFPLFNBQVMsUUFBUSxLQUFDLE1BQU07UUFFaEMsS0FBQyxPQUFPLGtCQUFrQjtRQUMxQixLQUFDLE9BQU8sR0FBRyxTQUFVLEtBQUM7Ozs0QkFFMUIsa0JBQUs7Ozs7UUFFRCxLQUFDLE9BQU8sSUFBSSxNQUFNLElBQUk7UUFFdEIsT0FBTyxNQUFNLEtBQUs7ZUFFbEIsS0FBQyxPQUFPLEtBQUksTUFBTSxLQUFLLEtBQUssS0FBSyxNQUFNLEtBQUssTUFBTSxNQUFJOzs7NEJBRTFELHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs7O1FBRVYsS0FBSyxLQUFDLE9BQU8sUUFBUTtRQUNyQixLQUFLLEtBQUMsT0FBTyxRQUFRO1lBRWxCOztZQUNDLEtBQUMsT0FBTyxPQUFPLElBQUUsSUFBRSxLQUFHLEdBQUksRUFBRSxHQUFHO1lBQy9CLEtBQUMsT0FBTyxPQUFPLElBQUUsSUFBRSxHQUFPLEVBQUUsR0FBRzs7OztZQUUvQixLQUFDLE9BQU8sT0FBTyxFQUFTLEVBQUUsR0FBRztZQUM3QixLQUFDLE9BQU8sT0FBTyxJQUFFLEdBQU8sRUFBRSxHQUFHOztlQUVqQyxLQUFDLE1BQU0sT0FBUSxFQUFLLEVBQUUsRUFBRzs7OzRCQUU3Qjs7OztZQUVTLEtBQUM7Ozs7O1FBSU4sS0FBQyxPQUFPO1FBQ1IsS0FBQyxPQUFPO1FBRVIsYUFBWSxLQUFDLFdBQVcsS0FBQyxNQUFNLFlBQVksS0FBQyxNQUFNO1lBRS9DOzttQkFDQyxLQUFDLE1BQU0sU0FBUyxFQUFFLEVBQUUsS0FBQyxNQUFNLE9BQUssS0FBQyxPQUFPLFFBQVEsU0FBTyxLQUFDLE9BQU8sUUFBUSxTQUFPLEVBQUUsSUFBSSxVQUFVLEtBQUMsTUFBTTs7OztZQUVyRyxLQUFLLEtBQUMsT0FBTyxRQUFRLFNBQVMsS0FBQyxPQUFPLFFBQVE7WUFDOUMsS0FBSyxLQUFDLE1BQU0sSUFBSSxLQUFDLE1BQU07bUJBQ3ZCLEtBQUMsTUFBTSxTQUFTLEVBQUUsR0FBRyxHQUFHLElBQUksVUFBVSxLQUFDLE1BQU07Ozs7NEJBRXJELHNCQUFTOzs7O1lBRUEsS0FBQzs7OztRQUVOLE1BQU0sS0FBQyxPQUFPLFFBQVE7YUFBaUIsY0FBQSxJQUFLOzttQkFBWjs7UUFDaEMsTUFBTSxLQUFDLE9BQU8sUUFBUTthQUFpQixjQUFBLElBQUs7O21CQUFaOzt3REFFMUI7Ozs0QkFFViw2QkFBZ0IsUUFBTzs7UUFFbkIsOEJBQXNCLFVBQVU7OztXQTNFdkM7OztlQTZFTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/searcherfile.kode
