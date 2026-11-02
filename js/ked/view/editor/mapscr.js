var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var mapscr

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import config from "../../util/config.js"

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
        this["lineOffsetPixels"] = this["lineOffsetPixels"].bind(this)
        this["lineRows"] = this["lineRows"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["getColors"] = this["getColors"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        this["onLinesChanged"] = this["onLinesChanged"].bind(this)
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
        post.on('greet.hide',this.show)
        post.on('popup.hide',this.show)
        post.on('popup.show',(function (name)
        {
            if (_k_.in(name,['differ','searcher']))
            {
                this.hide()
            }
            if (_k_.in(name,['finder','vinder']))
            {
                return this.show()
            }
        }).bind(this))
        this.editor.state.on('lines.changed',this.onLinesChanged)
        this.editor.state.on('colors.changed',((function ()
        {
            return this.reload()
        }).bind(this)))
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
        var cli, clickOffset, crow, li, mc, row, scrollOffset, view, _146_33_, _146_44_, _146_58_

        view = this.state.s.view.asMutable()
        clickOffset = ((_146_58_=((_146_33_=config.data) != null ? (_146_44_=_146_33_.mapScroll) != null ? _146_44_.clickOffset : undefined : undefined)) != null ? _146_58_ : 0)
        row = this.topRow + parseInt((pixel[1] - clickOffset - this.mapY) / this.pixelsPerRow)
        crow = this.topRow + parseInt((pixel[1] + clickOffset * this.pixelsPerRow - this.mapY) / this.pixelsPerRow)
        li = this.state.lineAtAbsoluteRow(row)
        cli = this.state.lineAtAbsoluteRow(crow)
        scrollOffset = row - this.state.rowsBeforeLine(li)
        console.log(`scrollToPixel ${li} ${cli} ${clickOffset}`)
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
        var bottom, denom, last, li, maxOffset, totalRows, viewFactor, viewTopRow

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
        last = this.topLine - 1
        while (li < this.state.s.lines.length && this.state.rowsBeforeLine(li) < bottom)
        {
            last = li
            li += 1
        }
        return this.botLine = last
    }

    mapscr.prototype["lineRows"] = function (y)
    {
        return this.state.lineHeight(y)
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
        return [this.mapX + pos[0] * this.pixelsPerCol * this.lineRows(pos[1]),this.mapY + this.lineOffset(pos[1])]
    }

    mapscr.prototype["maxLinesToLoad"] = function ()
    {
        return 10000
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
        var id, py, rh, t, y, y1, y2

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        this.calcView()
        if (this.botLine >= this.topLine)
        {
            py = (this.state.rowsBeforeLine(this.topLine) - this.topRow) * this.pixelsPerRow
            for (var _a_ = y = this.topLine, _b_ = this.botLine; (_a_ <= _b_ ? y <= this.botLine : y >= this.botLine); (_a_ <= _b_ ? ++y : --y))
            {
                id = this.images[y]
                if (!!_k_.empty(id))
                {
                    break
                }
                rh = this.state.lineHeight(y) * this.pixelsPerRow
                y1 = _k_.max(0,py)
                y2 = _k_.min(this.mapHeight,(py + rh))
                if (y2 > y1)
                {
                    t.placeLineImage(id,this.cells.x,this.cells.y,y1,(y2 - y1))
                }
                py += rh
            }
        }
        if (this.topLine > 0 && this.topLine <= this.images.length)
        {
            t.hideImagesInRange(this.images[0],this.images[this.topLine - 1])
        }
        if (this.botLine >= this.topLine && this.botLine + 1 < this.images.length)
        {
            t.hideImagesInRange(this.images[this.botLine + 1],this.images.slice(-1)[0])
        }
        return this.drawKnob()
    }

    mapscr.prototype["drawKnob"] = function ()
    {
        var ky, maxKy, offsetRow

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
        var list = _k_.list(belt.lineIndicesForRangesAndPositions(this.state.s.selections,[]))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwc2NyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9tYXBzY3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVVhLFVBQUE7SUFBUzs7T0FDQSxZQUFaOztPQUNZLGFBQVg7O09BQ1csY0FBQTs7T0FDQSxXQUFQOztPQUNPLGNBQUE7OztBQUViLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFJOztRQUFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBRU8sS0FBQyxPQUFPLE9BQU8sS0FBQyxPQUFPO1FBRTdCLEtBQUMsTUFBTSxHQUFHLGVBQWUsS0FBQztRQUUxQixLQUFDLGNBQWM7UUFFZixLQUFDLFNBQVMsS0FBQyxRQUFNO1FBRWpCLEtBQUMsVUFBYTtRQUNkLEtBQUMsVUFBYTtRQUNkLEtBQUMsU0FBYTtRQUNkLEtBQUMsYUFBYTtRQUNkLEtBQUMsV0FBYTtRQUNkLEtBQUMsWUFBYTtRQUNkLEtBQUMsYUFBYTtRQUVkLEtBQUMsU0FBUyxLQUFZLE1BQU0sT0FBTztRQUNuQyxLQUFDLFNBQVMsWUFBWSxNQUFNLFVBQVU7UUFDdEMsS0FBQyxTQUFTLFlBQVksTUFBTSxVQUFVO1FBQ3RDLEtBQUMsU0FBUyxXQUFZLE1BQU0sVUFBVTtRQUV0QyxLQUFDLE9BQU8sRUFBRSxHQUFHLFlBQVksS0FBQztRQUUxQixLQUFLLEdBQUcsYUFBYSxLQUFDO1FBQ3RCLEtBQUssR0FBRyxhQUFhLEtBQUM7UUFDdEIsS0FBSyxHQUFHLGFBQWEsS0FBQztRQUN0QixLQUFLLEdBQUcsd0JBQWM7O3VCQUNQLE1BQVMsU0FBUzs7Z0JBQTdCLEtBQUM7O3VCQUNVLE1BQVMsU0FBUzs7dUJBQTdCLEtBQUM7OztRQUVMLEtBQUMsT0FBTyxNQUFNLEdBQUcsZ0JBQWdCLEtBQUM7UUFDbEMsS0FBQyxPQUFPLE1BQU0sR0FBRzs7bUJBQXFCLEtBQUM7O1FBRXZDLEtBQUM7OztzQkFRTCw2QkFBZ0I7Ozs7YUFFVCxLQUFLLElBQUksV0FBVSxLQUFBLE1BQUssS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapscr.kode
