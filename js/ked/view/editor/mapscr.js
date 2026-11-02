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
        this.rowAtTopLine = 0
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
        var clickOffset, li, mc, row, scrollOffset, view, _151_33_, _151_44_, _151_58_

        view = this.state.s.view.asMutable()
        row = this.topRow + parseInt((pixel[1] - this.mapY) / this.pixelsPerRow)
        li = this.state.lineAtAbsoluteRow(row)
        scrollOffset = row - this.state.rowsBeforeLine(li)
        clickOffset = ((_151_58_=((_151_33_=config.data) != null ? (_151_44_=_151_33_.mapscroll) != null ? _151_44_.clickOffset : undefined : undefined)) != null ? _151_58_ : 0)
        view[1] = li
        view[1] -= clickOffset
        view[1] = _k_.clamp(0,this.state.maxViewLine(),view[1])
        mc = this.state.mainCursor()
        if (_k_.eql(view, this.state.s.view) && scrollOffset === this.state.s.scrollOffset)
        {
            if (li !== mc[1])
            {
                this.state.setCursors([[mc[0],li + clickOffset]],{main:0,adjust:false})
                return {redraw:true}
            }
            return
        }
        this.state.setView(view,scrollOffset)
        this.state.setCursors([[mc[0],li + clickOffset]],{main:0,adjust:false})
        this.drawKnob()
        return {redraw:true}
    }

    mapscr.prototype["calcView"] = function ()
    {
        var bottom, denom, h, last, li, maxOffset, row, totalRows, viewFactor, viewTopRow

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
            this.topLine = this.state.lineAtAbsoluteRow(this.topRow)
            this.rowAtTopLine = this.state.rowsBeforeLine(this.topLine)
            this.topRow = this.rowAtTopLine
        }
        else
        {
            this.topRow = 0
            this.topLine = 0
            this.rowAtTopLine = 0
        }
        bottom = this.topRow + this.linesInMap
        li = this.topLine
        row = this.topRow
        last = this.topLine - 1
        while (li < this.state.s.lines.length)
        {
            h = this.state.lineHeight(li)
            if (row + h > bottom)
            {
                break
            }
            last = li
            row += h
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
        return (this.state.rowsBeforeLine(y) - this.rowAtTopLine) * this.pixelsPerRow
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
        var id, py, rh, t, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        this.calcView()
        if (this.botLine >= this.topLine)
        {
            py = 0
            for (var _a_ = y = this.topLine, _b_ = this.botLine; (_a_ <= _b_ ? y <= this.botLine : y >= this.botLine); (_a_ <= _b_ ? ++y : --y))
            {
                id = this.images[y]
                if (!!_k_.empty(id))
                {
                    break
                }
                rh = this.state.lineHeight(y) * this.pixelsPerRow
                t.placeLineImage(id,this.cells.x,this.cells.y,py,rh)
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
        offsetRow = (this.state.viewTopRow() - this.rowAtTopLine) * this.pixelsPerRow
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwc2NyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9tYXBzY3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVVhLFVBQUE7SUFBUzs7T0FDQSxZQUFaOztPQUNZLGFBQVg7O09BQ1csY0FBQTs7T0FDQSxXQUFQOztPQUNPLGNBQUE7OztBQUViLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFJOztRQUFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBRU8sS0FBQyxPQUFPLE9BQU8sS0FBQyxPQUFPO1FBRTdCLEtBQUMsTUFBTSxHQUFHLGVBQWUsS0FBQztRQUUxQixLQUFDLGNBQWM7UUFFZixLQUFDLFNBQVMsS0FBQyxRQUFNO1FBRWpCLEtBQUMsVUFBYTtRQUNkLEtBQUMsVUFBYTtRQUNkLEtBQUMsU0FBYTtRQUNkLEtBQUMsZUFBZTtRQUNoQixLQUFDLGFBQWE7UUFDZCxLQUFDLFdBQWE7UUFDZCxLQUFDLFlBQWE7UUFDZCxLQUFDLGFBQWE7UUFFZCxLQUFDLFNBQVMsS0FBWSxNQUFNLE9BQU87UUFDbkMsS0FBQyxTQUFTLFlBQVksTUFBTSxVQUFVO1FBQ3RDLEtBQUMsU0FBUyxZQUFZLE1BQU0sVUFBVTtRQUN0QyxLQUFDLFNBQVMsV0FBWSxNQUFNLFVBQVU7UUFFdEMsS0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLEtBQUM7UUFFMUIsS0FBSyxHQUFHLGFBQWEsS0FBQztRQUN0QixLQUFLLEdBQUcsYUFBYSxLQUFDO1FBQ3RCLEtBQUssR0FBRyxhQUFhLEtBQUM7UUFDdEIsS0FBSyxHQUFHLHdCQUFjOzt1QkFDUCxNQUFTLFNBQVM7O2dCQUE3QixLQUFDOzt1QkFDVSxNQUFTLFNBQVM7O3VCQUE3QixLQUFDOzs7UUFFTCxLQUFDLE9BQU8sTUFBTSxHQUFHLGdCQUFnQixLQUFDO1FBQ2xDLEtBQUMsT0FBTyxNQUFNLEdBQUc7O21CQUFxQixLQUFDOztRQUV2QyxLQUFDOzs7c0JBUUwsNkJBQWdCOzs7O2FBRVQsS0FBSyxJQUFJLFdB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapscr.kode
