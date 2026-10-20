var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var mapscr

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import squares from "../../util/img/squares.js"

import belt from "../../edit/tool/belt.js"

import mapview from "./mapview.js"


mapscr = (function ()
{
    _k_.extend(mapscr, mapview)
    function mapscr (editor)
    {
        this.editor = editor
    
        this["drawHighlights"] = this["drawHighlights"].bind(this)
        this["drawCursors"] = this["drawCursors"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["drawKnob"] = this["drawKnob"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["maxLinesToLoad"] = this["maxLinesToLoad"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        this["onLinesChanged"] = this["onLinesChanged"].bind(this)
        mapscr.__super__.constructor.call(this,this.editor.screen,this.editor.state)
        this.state.on('view.changed',this.drawKnob)
        this.pointerType = 'pointer'
        this.knobId = this.imgId + 0xeeee
        this.topLine = 0
        this.botLine = 0
        this.knobHeight = 0
        this.mapWidth = 0
        this.mapHeight = 0
        this.linesInMap = 0
        this.setColor('bg',theme.editor.mapscr)
        this.setColor('highlight',theme.highlight.map)
        this.setColor('selection',theme.selection.map)
        this.setColor('fullysel',theme.selection.mapfully)
        this.screen.t.on('preResize',this.clearImages)
        post.on('greet.show',this.hide)
        post.on('greet.hide',this.show)
        post.on('popup.hide',this.show)
        post.on('popup.show',(function (name)
        {
            if (_k_.in(name,['differ','searcher']))
            {
                this.hide()
            }
            if (_k_.in(name,['finder']))
            {
                return this.show()
            }
        }).bind(this))
        this.editor.state.on('lines.changed',this.onLinesChanged)
        this.calcView()
    }

    mapscr.prototype["onLinesChanged"] = function (diff)
    {
        var cli, minLine

        if ((diff.del.length === 0 && 0 === diff.chg.length))
        {
            return this.reload()
        }
        else
        {
            if (diff.chg.length && (diff.del.length === 0 && 0 === diff.ins.length))
            {
                var list = _k_.list(diff.chg)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    cli = list[_a_]
                    this.updateLine(cli)
                }
            }
            else
            {
                minLine = this.state.s.lines.length
                if (diff.ins.length)
                {
                    minLine = _k_.min(minLine,diff.ins[0])
                }
                if (diff.del.length)
                {
                    minLine = _k_.min(minLine,diff.del[0])
                }
                var list1 = _k_.list(diff.chg)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    cli = list1[_b_]
                    if (cli >= minLine)
                    {
                        break
                    }
                    this.updateLine(cli)
                }
                return this.updateFromLine(minLine)
            }
        }
    }

    mapscr.prototype["getSegls"] = function ()
    {
        return this.state.segls
    }

    mapscr.prototype["getSyntax"] = function ()
    {
        return this.state.syntax
    }

    mapscr.prototype["onMouse"] = function (event)
    {
        mapscr.__super__.onMouse.call(this,event)
    
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    this.doDrag = true
                    post.emit('pointer','grabbing')
                    return this.scrollToPixel(event.pixel)
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    post.emit('pointer','grab')
                    return this.scrollToPixel(event.pixel)
                }
                this.hover = false
                break
            case 'release':
                if (this.doDrag)
                {
                    delete this.doDrag
                    if (this.hover)
                    {
                        post.emit('pointer','pointer')
                    }
                    return true
                }
                break
        }

        return this.hover
    }

    mapscr.prototype["onResize"] = function ()
    {
        this.csz = this.cells.screen.t.cellsz
        if (_k_.empty(this.csz))
        {
            return
        }
        this.calcView()
        return this.redraw = true
    }

    mapscr.prototype["scrollToPixel"] = function (pixel)
    {
        var li, maxY, mc, view

        view = this.state.s.view.asMutable()
        li = this.topLine + parseInt((pixel[1] - this.mapY) / this.pixelsPerRow)
        view[1] = li
        view[1] -= 5
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        mc = this.state.mainCursor()
        if (_k_.eql(view, this.state.s.view))
        {
            if (li !== mc[1])
            {
                this.state.setCursors([[mc[0],li + 5]],{main:0,adjust:false})
                return {redraw:true}
            }
            return
        }
        this.state.setView(view)
        this.state.setCursors([[mc[0],li + 5]],{main:0,adjust:false})
        this.drawKnob()
        return {redraw:true}
    }

    mapscr.prototype["calcView"] = function ()
    {
        var editorLinesHeight, maxOffset, viewFactor

        this.mapX = this.cells.x * this.csz[0]
        this.mapY = this.cells.y * this.csz[1]
        this.mapHeight = this.cells.rows * this.csz[1]
        this.mapWidth = this.cells.cols * this.csz[0]
        this.mapBot = this.mapY + this.mapHeight - this.pixelsPerRow
        this.linesInMap = parseInt(this.mapHeight / this.pixelsPerRow)
        this.knobHeight = this.state.cells.rows * this.pixelsPerRow
        editorLinesHeight = this.state.s.lines.length * this.pixelsPerRow
        if (editorLinesHeight > this.mapHeight && this.state.s.view[1] > 0)
        {
            maxOffset = this.state.s.lines.length - this.linesInMap
            viewFactor = this.state.s.view[1] / (this.state.s.lines.length - this.cells.rows)
            this.topLine = parseInt(viewFactor * maxOffset)
        }
        else
        {
            this.topLine = 0
        }
        return this.botLine = _k_.min(this.state.s.lines.length - 1,this.topLine + this.linesInMap)
    }

    mapscr.prototype["lineOffset"] = function (y)
    {
        return (y - this.topLine) * this.pixelsPerRow
    }

    mapscr.prototype["pixelPos"] = function (pos)
    {
        return [this.mapX + pos[0] * this.pixelsPerCol,this.mapY + this.lineOffset(pos[1])]
    }

    mapscr.prototype["maxLinesToLoad"] = function ()
    {
        return 2000
    }

    mapscr.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        mapscr.__super__.draw.call(this)
        if (this.csz)
        {
            this.drawCursors()
            return this.drawHighlights()
        }
    }

    mapscr.prototype["drawImages"] = function ()
    {
        var id, t, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        for (var _a_ = y = this.topLine, _b_ = this.botLine; (_a_ <= _b_ ? y <= this.botLine : y >= this.botLine); (_a_ <= _b_ ? ++y : --y))
        {
            id = this.images[y]
            t.placeLineImage(id,this.cells.x,this.cells.y,this.lineOffset(y),this.pixelsPerRow)
        }
        if (this.topLine)
        {
            t.hideImagesInRange(this.images[0],this.images[this.topLine - 1])
        }
        if (this.botLine < this.images.length)
        {
            t.hideImagesInRange(this.images[this.botLine],this.images.slice(-1)[0])
        }
        return this.drawKnob()
    }

    mapscr.prototype["drawKnob"] = function ()
    {
        var ky

        this.calcView()
        if (_k_.empty(this.csz) || this.hidden() || this.collapsed())
        {
            return
        }
        ky = this.lineOffset(this.state.s.view[1])
        return this.cells.screen.t.placeImageOverlay(this.knobId,this.cells.x,this.cells.y,ky,this.mapWidth,this.knobHeight)
    }

    mapscr.prototype["hide"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.screen.t.hideImageOverlay(this.knobId)
        return mapscr.__super__.hide.call(this)
    }

    mapscr.prototype["drawCursors"] = function ()
    {
        var fg, idx, pos, sw, sx, sy

        var list = _k_.list(this.state.s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            var _b_ = this.pixelPos(pos); sx = _b_[0]; sy = _b_[1]

            if (sy < this.mapY || sy >= this.mapBot)
            {
                continue
            }
            if (sx < this.mapX || sx >= this.mapX + this.mapWidth)
            {
                continue
            }
            if (idx === this.state.s.main)
            {
                fg = theme.cursor.main
                sw = this.pixelsPerCol * 2
                sx -= parseInt(this.pixelsPerCol / 2)
            }
            else
            {
                fg = theme.cursor.multi
                sw = this.pixelsPerCol
            }
            squares.place(sx,sy,sw,this.pixelsPerRow,fg)
            if (idx === this.state.s.main)
            {
                squares.place(this.cells.x * this.csz[0] + this.mapWidth - this.pixelsPerCol * 4,sy,this.pixelsPerCol * 4,this.pixelsPerRow,fg,2002)
            }
        }
    }

    mapscr.prototype["drawHighlights"] = function ()
    {
        var clr, hlw, li, mc, selw, sy, xoff

        mc = this.state.mainCursor()
        xoff = this.mapX + this.mapWidth
        selw = this.pixelsPerCol * 16
        hlw = this.pixelsPerCol * 8
        var list = _k_.list(belt.lineIndicesForRanges(this.state.s.selections))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            li = list[_a_]
            sy = this.mapY + this.lineOffset(li)
            if (sy < this.mapY || sy >= this.mapBot)
            {
                continue
            }
            if (this.state.isSpanSelectedLine(li))
            {
                clr = this.color.selection
            }
            else
            {
                clr = this.color.fullysel
            }
            squares.place(xoff - selw,sy,selw,this.pixelsPerRow,clr,2000)
        }
        var list1 = _k_.list(belt.lineIndicesForSpans(this.state.s.highlights))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            li = list1[_b_]
            sy = this.mapY + this.lineOffset(li)
            if (sy < this.mapY || sy >= this.mapBot)
            {
                continue
            }
            squares.place(xoff - hlw,sy,hlw,this.pixelsPerRow,this.color.highlight,2001)
        }
    }

    return mapscr
})()

export default mapscr;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwc2NyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9tYXBzY3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQWdCd0I7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FJVixLQUFDLE9BQU8sT0FBTyxLQUFDLE9BQU87UUFFN0IsS0FBQyxNQUFNLEdBQUcsZUFBZSxLQUFDO1FBRTFCLEtBQUMsY0FBYztRQUVmLEtBQUMsU0FBUyxLQUFDLFFBQU07UUFFakIsS0FBQyxVQUFhO1FBQ2QsS0FBQyxVQUFhO1FBQ2QsS0FBQyxhQUFhO1FBQ2QsS0FBQyxXQUFhO1FBQ2QsS0FBQyxZQUFhO1FBQ2QsS0FBQyxhQUFhO1FBRWQsS0FBQyxTQUFTLEtBQVksTUFBTSxPQUFPO1FBQ25DLEtBQUMsU0FBUyxZQUFZLE1BQU0sVUFBVTtRQUN0QyxLQUFDLFNBQVMsWUFBWSxNQUFNLFVBQVU7UUFDdEMsS0FBQyxTQUFTLFdBQVksTUFBTSxVQUFVO1FBRXRDLEtBQUMsT0FBTyxFQUFFLEdBQUcsWUFBWSxLQUFDO1FBRTFCLEtBQUssR0FBRyxhQUFhLEtBQUM7UUFDdEIsS0FBSyxHQUFHLGFBQWEsS0FBQztRQUN0QixLQUFLLEdBQUcsYUFBYSxLQUFDO1FBQ3RCLEtBQUssR0FBRzs7dUJBQ08sTUFBUyxTQUFTOztnQkFBN0IsS0FBQzs7dUJBQ1UsTUFBUzs7dUJBQXBCLEtBQUM7OztRQUVMLEtBQUMsT0FBTyxNQUFNLEdBQUcsZ0JBQWdCLEtBQUM7UUFFbEMsS0FBQzs7Ozs7OzthQVVFLEtBQUssSUFBSSxXQUFVLEtBQUEsTUFBSyxLQUFLLElBQUk7O21CQUNoQyxLQUFDOzs7O2dCQUVFLEtBQUssSUFBSSxXQUFXLEtBQUssSUFBSSxXQUFVLEtBQUEsTUFBSyxLQUFLLElBQUk7O29DQUN6QyxLQUFLOzs7O29CQUNaLEtBQUMsV0FBVzs7Ozs7Z0JBRWhCLFVBQVUsS0FBQyxNQUFNLEVBQUUsTUFBTTtvQkFDWSxLQUFLLElBQUk7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapscr.kode
