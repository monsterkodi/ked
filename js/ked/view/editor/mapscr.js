var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var mapscr

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import config from "../../util/config.js"

import squares from "../../util/img/squares.js"

import belt from "../../edit/tool/belt.js"
import sue from "../../edit/tool/sue.js"

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
        this["pruneImages"] = this["pruneImages"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["lineOffsetPixels"] = this["lineOffsetPixels"].bind(this)
        this["wrapPos"] = this["wrapPos"].bind(this)
        this["wrapSig"] = this["wrapSig"].bind(this)
        this["isWrappedLine"] = this["isWrappedLine"].bind(this)
        this["lineScale"] = this["lineScale"].bind(this)
        this["lineRows"] = this["lineRows"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["getColors"] = this["getColors"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        this["onSueChanged"] = this["onSueChanged"].bind(this)
        this["onColorsChanged"] = this["onColorsChanged"].bind(this)
        this["onLinesChanged"] = this["onLinesChanged"].bind(this)
        this["showIfEnabled"] = this["showIfEnabled"].bind(this)
        this["syncEnabled"] = this["syncEnabled"].bind(this)
        this["enabled"] = this["enabled"].bind(this)
        mapscr.__super__.constructor.call(this,this.editor.screen,this.editor.state)
        this.state.on('view.changed',this.drawKnob)
        this.pointerType = 'pointer'
        this.knobId = this.imgId + 0xeeee
        this.topLine = 0
        this.botLine = 0
        this.topRow = 0
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
        post.on('greet.hide',this.showIfEnabled)
        post.on('popup.hide',this.showIfEnabled)
        post.on('popup.show',(function (name)
        {
            if (_k_.in(name,['differ','searcher','replacer']))
            {
                this.hide()
            }
            if (_k_.in(name,['finder']))
            {
                return this.showIfEnabled()
            }
        }).bind(this))
        post.on('config.loaded',(function (data)
        {
            return this.syncEnabled()
        }).bind(this))
        this.editor.state.on('lines.changed',this.onLinesChanged)
        this.editor.state.on('colors.changed',this.onColorsChanged)
        this.editor.state.on('sue.changed',this.onSueChanged)
        this.calcView()
    }

    mapscr.prototype["enabled"] = function ()
    {
        var _51_27_, _51_38_

        return ((_51_27_=config.data) != null ? (_51_38_=_51_27_.mapScroll) != null ? _51_38_.enable : undefined : undefined)
    }

    mapscr.prototype["syncEnabled"] = function ()
    {
        if (this.enabled())
        {
            return this.show()
        }
        else
        {
            return this.hide()
        }
    }

    mapscr.prototype["showIfEnabled"] = function ()
    {
        if (this.enabled())
        {
            return this.show()
        }
    }

    mapscr.prototype["onLinesChanged"] = function (diff)
    {
        var colors

        if (this.suspended)
        {
            return
        }
        if (diff.ins.length || diff.del.length)
        {
            colors = this.state.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                return this.clearImages()
            }
        }
    }

    mapscr.prototype["onColorsChanged"] = function ()
    {
        var colors

        colors = this.state.s.colors
        if (!(colors != null) || (_k_.empty(colors.fg) && _k_.empty(colors.bg)))
        {
            return
        }
        this.clearImages()
        return post.emit('redraw')
    }

    mapscr.prototype["onSueChanged"] = function ()
    {
        this.rowCache = null
        return post.emit('redraw')
    }

    mapscr.prototype["getSegls"] = function ()
    {
        return this.state.s.lines
    }

    mapscr.prototype["getSyntax"] = function ()
    {
        return this.state.syntax
    }

    mapscr.prototype["getColors"] = function ()
    {
        return this.state.s.colors
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
        var csz

        csz = this.cells.screen.t.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        this.csz = csz
        this.calcView()
        return this.redraw = true
    }

    mapscr.prototype["scrollToPixel"] = function (pixel)
    {
        var cli, clickOffset, crow, li, mc, row, scrollOffset, view, _130_33_, _130_44_, _130_58_

        view = this.state.s.view.asMutable()
        clickOffset = ((_130_58_=((_130_33_=config.data) != null ? (_130_44_=_130_33_.mapScroll) != null ? _130_44_.clickOffset : undefined : undefined)) != null ? _130_58_ : 0)
        row = this.topRow + parseInt((pixel[1] - clickOffset * this.pixelsPerRow - this.mapY) / this.pixelsPerRow)
        crow = this.topRow + parseInt((pixel[1] + clickOffset * this.pixelsPerRow - this.mapY) / this.pixelsPerRow)
        li = this.state.lineAtAbsoluteRow(row)
        cli = this.state.lineAtAbsoluteRow(crow)
        scrollOffset = row - this.state.rowsBeforeLine(li)
        view[1] = li
        view[1] = _k_.clamp(0,this.state.maxViewLine(),view[1])
        mc = this.state.mainCursor()
        if (_k_.eql(view, this.state.s.view) && scrollOffset === this.state.s.scrollOffset)
        {
            if (cli !== mc[1])
            {
                this.state.setCursors([[mc[0],cli]],{main:0,adjust:false})
                return {redraw:true}
            }
            return
        }
        this.state.setView(view,scrollOffset)
        this.state.setCursors([[mc[0],cli]],{main:0,adjust:false})
        this.drawKnob()
        return {redraw:true}
    }

    mapscr.prototype["calcView"] = function ()
    {
        var bot, bottom, denom, li, maxOffset, totalRows, viewFactor, viewTopRow

        this.mapX = this.cells.x * this.csz[0]
        this.mapY = this.cells.y * this.csz[1]
        this.mapHeight = this.cells.rows * this.csz[1]
        this.mapWidth = this.cells.cols * this.csz[0]
        this.mapBot = this.mapY + this.mapHeight - this.pixelsPerRow
        this.linesInMap = _k_.max(1,parseInt(this.mapHeight / this.pixelsPerRow))
        this.knobHeight = this.state.cells.rows * this.pixelsPerRow
        totalRows = this.state.totalRows()
        viewTopRow = this.state.viewTopRow()
        if (totalRows > this.linesInMap && viewTopRow > 0)
        {
            maxOffset = _k_.max(0,totalRows - this.linesInMap)
            denom = _k_.max(1,totalRows - this.state.cells.rows)
            viewFactor = _k_.clamp(0,1,(viewTopRow / denom))
            this.topRow = parseInt(viewFactor * maxOffset)
        }
        else
        {
            this.topRow = 0
        }
        this.topLine = this.state.lineAtAbsoluteRow(this.topRow)
        bottom = this.topRow + this.linesInMap
        li = this.topLine
        bot = this.topLine - 1
        while (li < this.state.s.lines.length && this.state.rowsBeforeLine(li) < bottom)
        {
            bot = li
            li += 1
        }
        return this.botLine = bot
    }

    mapscr.prototype["lineRows"] = function (y)
    {
        return this.state.lineHeight(y)
    }

    mapscr.prototype["lineScale"] = function (y)
    {
        return this.state.lineScale(y)
    }

    mapscr.prototype["isWrappedLine"] = function (y)
    {
        return this.state.isWrapped(y)
    }

    mapscr.prototype["wrapSig"] = function (y)
    {
        if (!this.state.isWrapped(y))
        {
            return ''
        }
        return `${this.state.wrapStarts(y)}|${this.state.wrapIndent(y,1)}`
    }

    mapscr.prototype["wrapPos"] = function (y)
    {
        var cells

        if (!this.state.isWrapped(y))
        {
            return null
        }
        cells = sue.cellPositionsForLine(this.state.s.lines,y,[])
        return (function (x)
        {
            return this.state.lineCell(x,y,cells)
        }).bind(this)
    }

    mapscr.prototype["lineOffsetPixels"] = function (y)
    {
        return this.lineOffset(y)
    }

    mapscr.prototype["lineOffset"] = function (y)
    {
        return (this.state.rowsBeforeLine(y) - this.topRow) * this.pixelsPerRow
    }

    mapscr.prototype["pixelPos"] = function (pos)
    {
        var cx, cy, px, py, x, y

        ;[x,y] = pos
        if (this.state.isWrapped(y))
        {
            ;[cx,cy] = this.state.lineCell(x,y)
            px = this.mapX + cx * this.pixelsPerCol
            py = this.mapY + this.lineOffset(y) + cy * this.pixelsPerRow
            return [px,py]
        }
        return [this.mapX + x * this.pixelsPerCol * this.lineRows(y),this.mapY + this.lineOffset(y)]
    }

    mapscr.prototype["rowsOfRanges"] = function (li, ranges)
    {
        var cells, len, r1, r2, rng, sh, sy, xe, xs, y2, _243_24_

        sy = this.mapY + this.lineOffset(li)
        sh = this.lineRows(li) * this.pixelsPerRow
        if (!this.state.isWrapped(li))
        {
            return [sy,sh]
        }
        len = this.state.s.lines[li].length
        xs = Infinity
        xe = -1
        var list = _k_.list(ranges)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            y2 = ((_243_24_=rng[3]) != null ? _243_24_ : rng[1])
            if (li < rng[1] || li > y2)
            {
                continue
            }
            xs = _k_.min(xs,((li === rng[1] ? rng[0] : 0)))
            xe = _k_.max(xe,((li === y2 ? rng[2] : len)))
        }
        if (xe < 0)
        {
            return [sy,sh]
        }
        cells = sue.cellPositionsForLine(this.state.s.lines,li,[])
        r1 = this.state.lineCell(xs,li,cells)[1]
        r2 = this.state.lineCell(_k_.max(xs,xe - 1),li,cells)[1]
        return [sy + r1 * this.pixelsPerRow,(r2 - r1 + this.lineScale(li)) * this.pixelsPerRow]
    }

    mapscr.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        mapscr.__super__.draw.call(this)
        if (!_k_.empty(this.csz))
        {
            this.drawCursors()
            return this.drawHighlights()
        }
    }

    mapscr.prototype["drawImages"] = function ()
    {
        var id, placed, py, rh, t, y, y1, y2

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        if (_k_.empty(this.csz))
        {
            return
        }
        this.calcView()
        placed = []
        if (this.botLine >= this.topLine)
        {
            py = (this.state.rowsBeforeLine(this.topLine) - this.topRow) * this.pixelsPerRow
            for (y = this.topLine; y <= this.botLine; y++)
            {
                rh = this.state.lineHeight(y) * this.pixelsPerRow
                y1 = _k_.max(0,py)
                y2 = _k_.min(this.mapHeight,(py + rh))
                if (y2 > y1)
                {
                    if (id = this.ensureImage(y))
                    {
                        if (this.textLine(y) || this.isWrappedLine(y))
                        {
                            t.placeImageSlice(id,this.cells.x,this.cells.y,y1,(y1 - py),(y2 - y1),this.mapWidth)
                        }
                        else
                        {
                            t.placeLineImage(id,this.cells.x,this.cells.y,y1,(y2 - y1))
                        }
                        placed.push(id)
                    }
                }
                py += rh
            }
        }
        this.hideUnplacedImages(placed)
        this.pruneImages()
        return this.drawKnob()
    }

    mapscr.prototype["pruneImages"] = function ()
    {
        var cache, keep, key, lines, t, y

        cache = this.imageCache
        if (!cache || cache.size === 0)
        {
            return
        }
        t = this.cells.screen.t
        lines = this.getSegls()
        keep = new Set()
        for (y = this.topLine; y <= this.botLine; y++)
        {
            key = this.imageKey(lines[y],this.imageHeight(y))
            keep.add(key)
        }
        return cache.forEach(function (img, key)
        {
            if (!keep.has(key))
            {
                t.deleteImage(img.id)
                return cache.delete(key)
            }
        })
    }

    mapscr.prototype["drawKnob"] = function ()
    {
        var ky, maxKy, offsetRow

        if (this.suspended)
        {
            return
        }
        if (_k_.empty(this.csz))
        {
            return
        }
        this.calcView()
        if (this.hidden() || this.collapsed())
        {
            return
        }
        maxKy = _k_.max(0,this.mapHeight - this.knobHeight)
        offsetRow = (this.state.viewTopRow() - this.topRow) * this.pixelsPerRow
        ky = _k_.clamp(0,maxKy,offsetRow)
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
        var fg, idx, isMain, pos, sh, sw, sx, sy

        var list = _k_.list(this.state.s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            ;[sx,sy] = this.pixelPos(pos)
            if (sy < this.mapY || sy >= this.mapBot)
            {
                continue
            }
            isMain = idx === this.state.s.main
            if (isMain)
            {
                fg = theme.cursor.main
            }
            else
            {
                fg = theme.cursor.multi
            }
            sh = this.lineScale(pos[1]) * this.pixelsPerRow
            sh = _k_.min(sh,(this.mapY + this.mapHeight - sy))
            if (isMain)
            {
                squares.place(this.cells.x * this.csz[0] + this.mapWidth - this.pixelsPerCol * 4,sy,this.pixelsPerCol * 4,sh,fg,2002,'map.cursor')
            }
            if (sx < this.mapX || sx >= this.mapX + this.mapWidth)
            {
                continue
            }
            if (isMain)
            {
                sw = this.pixelsPerCol * 2
                sx -= parseInt(this.pixelsPerCol / 2)
            }
            else
            {
                sw = this.pixelsPerCol
            }
            squares.place(sx,sy,sw,sh,fg,null,'map.cursor')
        }
    }

    mapscr.prototype["drawHighlights"] = function ()
    {
        var clr, hlw, li, mc, selw, sh, sy, xoff

        mc = this.state.mainCursor()
        xoff = this.mapX + this.mapWidth
        selw = this.pixelsPerCol * 16
        hlw = this.pixelsPerCol * 8
        var list = _k_.list(belt.lineIndicesForRangesAndPositions(this.state.s.selections,[]))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            li = list[_a_]
            ;[sy,sh] = this.rowsOfRanges(li,this.state.s.selections)
            if (sy < this.mapY || sy >= this.mapBot)
            {
                continue
            }
            sh = _k_.min(sh,(this.mapY + this.mapHeight - sy))
            if (this.state.isSpanSelectedLine(li))
            {
                clr = this.color.selection
            }
            else
            {
                clr = this.color.fullysel
            }
            squares.place(xoff - selw,sy,selw,sh,clr,2000,'map.select')
        }
        var list1 = _k_.list(belt.lineIndicesForSpans(this.state.s.highlights))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            li = list1[_b_]
            ;[sy,sh] = this.rowsOfRanges(li,this.state.s.highlights)
            if (sy < this.mapY || sy >= this.mapBot)
            {
                continue
            }
            sh = _k_.min(sh,(this.mapY + this.mapHeight - sy))
            squares.place(xoff - hlw,sy,hlw,sh,this.color.highlight,2001,'map.highlight')
        }
    }

    return mapscr
})()

export default mapscr;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwc2NyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9tYXBzY3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUzs7T0FDQSxZQUFaOztPQUNZLGFBQVg7O09BQ1csY0FBQTs7T0FDQSxXQUFQO09BQVksVUFBWjs7T0FDTyxjQUFBOzs7QUFDckIsVUFBRDs7dUJBQVE7YUFHSixRQUFJOztRQUFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBRU8sS0FBQyxPQUFPLE9BQU8sS0FBQyxPQUFPO1FBRTdCLEtBQUMsTUFBTSxHQUFHLGVBQWUsS0FBQztRQUUxQixLQUFDLGNBQWM7UUFFZixLQUFDLFNBQVMsS0FBQyxRQUFNO1FBRWpCLEtBQUMsVUFBYTtRQUNkLEtBQUMsVUFBYTtRQUNkLEtBQUMsU0FBYTtRQUNkLEtBQUMsYUFBYTtRQUNkLEtBQUMsV0FBYTtRQUNkLEtBQUMsWUFBYTtRQUNkLEtBQUMsYUFBYTtRQUVkLEtBQUMsU0FBUyxLQUFZLE1BQU0sT0FBTztRQUNuQyxLQUFDLFNBQVMsWUFBWSxNQUFNLFVBQVU7UUFDdEMsS0FBQyxTQUFTLFlBQVksTUFBTSxVQUFVO1FBQ3RDLEtBQUMsU0FBUyxXQUFZLE1BQU0sVUFBVTtRQUV0QyxLQUFDLE9BQU8sRUFBRSxHQUFHLFlBQVksS0FBQztRQUUxQixLQUFLLEdBQUcsYUFBYSxLQUFDO1FBQ3RCLEtBQUssR0FBRyxhQUFhLEtBQUM7UUFDdEIsS0FBSyxHQUFHLGFBQWEsS0FBQztRQUN0QixLQUFLLEdBQUcsd0JBQWM7O3VCQUNQLE1BQVMsU0FBUyxXQUFXOztnQkFBeEMsS0FBQzs7dUJBQ21CLE1BQVM7O3VCQUE3QixLQUFDOzs7UUFFTCxLQUFLLEdBQUcsMkJBQWlCOzttQkFBUyxLQUFDOztRQUVuQyxLQUFDLE9BQU8sTUFBTSxHQUFHLGdCQUFpQixLQUFDO1FBQ25DLEtBQUMsT0FBTyxNQUFNLEdBQUcsaUJBQWlCLEtBQUM7UUFDbkMsS0FB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
//# sourceURL=../../../../kode/ked/view/editor/mapscr.kode
