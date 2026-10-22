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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXJmaWxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvc2VhcmNoZXJmaWxlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUOztPQUNTLFdBQVo7T0FBaUIsYUFBakI7T0FBd0IsYUFBeEI7OztBQUVFLGdCQUFUOzs2QkFBOEI7YUFFMUIsY0FBSSxRQUFROztRQUFUO1FBQVE7Ozs7cURBRUQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLGFBQWEsT0FBTyxLQUFDLFVBQVUsS0FBQztRQUNqQyxLQUFDLGFBQWEsT0FBTyxLQUFDLFVBQVUsS0FBQztRQUVqQyxLQUFDLFNBQVMsS0FBUyxNQUFNLE9BQU87UUFDaEMsS0FBQyxTQUFTLFFBQVMsTUFBTSxPQUFPO1FBRWhDLEtBQUMsT0FBTyxTQUFTLFFBQVEsS0FBQyxNQUFNO1FBQ2hDLEtBQUMsT0FBTyxTQUFTLFFBQVEsS0FBQyxNQUFNO1FBRWhDLEtBQUMsT0FBTyxrQkFBa0I7UUFDMUIsS0FBQyxPQUFPLEdBQUcsU0FBVSxLQUFDOzs7NEJBUTFCLGtCQUFLOzs7O1FBRUQsS0FBQyxPQUFPLElBQUksTUFBTSxJQUFJO1FBRXRCLE9BQU8sTUFBTSxLQUFLO2VBRWxCLEtBQUMsT0FBTyxLQUFJLE1BQU0sS0FBSyxLQUFLLEtBQUssTUFBTSxLQUFLLE1BQU0sTUFBSTs7OzRCQVExRCxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7OztRQUVWLEtBQUssS0FBQyxPQUFPLFFBQVE7UUFDckIsS0FBSyxLQUFDLE9BQU8sUUFBUTtZQUVsQjs7WUFDQyxLQUFDLE9BQU8sT0FBTyxJQUFFLElBQUUsS0FBRyxHQUFJLEVBQUUsR0FBRztZQUMvQixLQUFDLE9BQU8sT0FBTyxJQUFFLElBQUUsR0FBTyxFQUFFLEdBQUc7Ozs7WUFFL0IsS0FBQyxPQUFPLE9BQU8sRUFBUyxFQUFFLEdBQUc7WUFDN0IsS0FBQyxPQUFPLE9BQU8sSUFBRSxHQUFPLEVBQUUsR0FBRzs7ZUFFakMsS0FBQyxNQUFNLE9BQVEsRUFBSyxFQUFFLEVBQUc7Ozs0QkFRN0I7Ozs7WUFFVSxLQUFDOzs7OztRQUlQLEtBQUMsT0FBTztRQUNSLEtBQUMsT0FBTztZQUVMOzttQkFDQyxLQUFDLE1BQU0sU0FBUyxFQUFFLEVBQUUsS0FBQyxNQUFNLE9BQUssS0FBQyxPQUFPLFFBQVEsU0FBTyxLQUFDLE9BQU8sUUFBUSxTQUFPLEVBQUUsSUFBSSxLQUFDLE1BQU0sTUFBTSxLQUFDLE1BQU07Ozs7WUFFeEcsS0FBSyxLQUFDLE9BQU8sUUFBUSxTQUFTLEtBQUMsT0FBTyxRQUFRO1lBQzlDLEtBQUssS0FBQyxNQUFNLElBQUksS0FBQyxNQUFNO21CQUN2QixLQUFDLE1BQU0sU0FBUyxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUMsTUFBTSxNQUFNLEtBQUMsTUFBTTs7Ozs0QkFReEQsc0JBQVM7Ozs7WUFFQyxLQUFDOzs7O1FBRVAsTUFBTSxLQUFDLE9BQU8sUUFBUTthQUFrQixjQUFBLElBQUs7O21CQUFaOztRQUNqQyxNQUFNLEtBQUMsT0FBTyxRQUFRO2FBQWtCLGNBQUEsSUFBSzs7bUJBQVo7O3dEQUUzQjs7OzRCQVFWLDZCQUFnQixRQUFPOztRQUVuQiw4QkFBc0IsVUFBVTs7O1dBakcvQjs7O2VBbUdGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/searcherfile.kode
