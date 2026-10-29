var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"

export default {
    allCursors:function ()
    {
        return this.s.cursors.asMutable()
    },
    expandCursors:function (dir)
    {
        var c, cursors, dy, mc, newCursors
    
        cursors = this.allCursors()
        dy = (dir === 'up' ? -1 : 1)
        newCursors = []
        var list = _k_.list(cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            newCursors.push(c)
            newCursors.push([c[0],c[1] + dy])
        }
        mc = belt.traversePositionsInDirection(newCursors,this.mainCursor(),dir)
        return this.setCursors(newCursors,{main:mc,adjust:'topBotDelta'})
    },
    contractCursors:function (dir)
    {
        var add, c, cursors, nbdn, nbup, newCursors, solo
    
        cursors = this.allCursors()
        newCursors = []
        var list = _k_.list(cursors)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            c = list[_b_]
            nbup = belt.positionsContain(cursors,belt.positionInDirection(c,'down'))
            nbdn = belt.positionsContain(cursors,belt.positionInDirection(c,'up'))
            solo = !(nbup || nbdn)
            add = ((function ()
            {
                switch (dir)
                {
                    case 'up':
                        return nbup || solo
    
                    case 'down':
                        return nbdn || solo
    
                }
    
            }).bind(this))()
            if (add)
            {
                newCursors.push(c)
            }
        }
        return this.setCursors(newCursors)
    },
    addCursor:function (x, y)
    {
        var cursors, pos
    
        pos = belt.pos(x,y)
        cursors = this.allCursors()
        cursors.push(pos)
        return this.setCursors(cursors,{main:-1})
    },
    addCursors:function (cursors)
    {
        return this.setCursors(this.allCursors().concat(cursors))
    },
    delCursorsInRange:function (rng)
    {
        var outside
    
        outside = belt.positionsOutsideRange(this.allCursors(),rng)
        outside.push(belt.endOfRange(rng))
        return this.setCursors(outside,{main:-1})
    },
    moveCursors:function (dir, opt)
    {
        var adjust, back, c, cursors, ind, line, lines, main, pos, r, _121_28_, _75_18_, _76_22_
    
        if (_k_.isArr(dir))
        {
            switch (dir[0])
            {
                case 'bos':
                    if (this.moveCursorsToStartOfSelections())
                    {
                        return
                    }
                    dir = dir.slice(1)
                    break
                case 'eos':
                    if (this.moveCursorsToEndOfSelections())
                    {
                        return
                    }
                    dir = dir.slice(1)
                    break
            }
    
            dir = dir[0]
        }
        opt = (opt != null ? opt : {})
        opt.count = ((_75_18_=opt.count) != null ? _75_18_ : 1)
        opt.jumpWords = ((_76_22_=opt.jumpWords) != null ? _76_22_ : false)
        if (this.s.highlights.length)
        {
            this.deselect()
        }
        cursors = this.allCursors()
        lines = this.s.lines
        var list = _k_.list(cursors)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            c = list[_c_]
            line = lines[c[1]]
            switch (dir)
            {
                case 'left':
                case 'right':
                    c[0] += belt.numCharsFromPosToWordOrPunctInDirection(lines,c,dir,opt)
                    break
                case 'up':
                    c[1] -= opt.count
                    break
                case 'down':
                    c[1] += opt.count
                    break
                case 'eol':
                    c[0] = kseg.width(this.s.lines[c[1]])
                    break
                case 'bol':
                    c[0] = 0
                    break
                case 'bof':
                    c[0] = 0
                    c[1] = 0
                    break
                case 'eof':
                    c[1] = this.s.lines.length - 1
                    c[0] = kseg.width(line)
                    break
                case 'ind':
                    c[0] = belt.numIndent(line)
                    break
                case 'ind_eol':
                    ind = belt.numIndent(line)
                    c[0] = (c[0] < ind ? ind : kseg.width(line))
                    break
                case 'ind_bol':
                    ind = belt.numIndent(line)
                    c[0] = (c[0] > ind ? ind : 0)
                    break
                case 'lineFirstDown':
                    c[1] = _k_.min(c[1] + opt.count,lines.length - 1)
                    c[0] = belt.numIndent(lines[c[1]])
                    break
                case 'lineFirstUp':
                    c[1] = _k_.max(c[1] - opt.count,0)
                    c[0] = belt.numIndent(lines[c[1]])
                    break
                case 'paragraph':
                    pos = motion.paragraphPositionAfter(lines,c,1)
                    c[0] = pos[0]
                    c[1] = pos[1]
                    break
                case 'paragraphBack':
                    pos = motion.paragraphPositionBefore(lines,c,1)
                    c[0] = pos[0]
                    c[1] = pos[1]
                    break
                case 'sentence':
                case 'sentenceBack':
                    r = motion.range(lines,c,{kind:dir,count:opt.count})
                    if (r)
                    {
                        back = dir === 'sentenceBack'
                        c[0] = (back ? r[0] : r[2])
                        c[1] = (back ? r[1] : r[3])
                    }
                    break
                case 'word':
                case 'wend':
                case 'WORD':
                case 'WEND':
                    r = motion.range(lines,c,{kind:dir,count:opt.count,cursors:cursors.length})
                    c[0] = r[2]
                    c[1] = r[3]
                    break
                case 'drow':
                case 'DROW':
                    r = motion.range(lines,c,{kind:dir,count:opt.count,cursors:cursors.length})
                    c[0] = r[0]
                    c[1] = r[1]
                    break
            }
    
        }
        main = this.s.main
        adjust = ((_121_28_=opt.adjust) != null ? _121_28_ : 'topBotDelta')
        switch (dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                main = belt.indexOfExtremePositionInDirection(cursors,dir,main)
                adjust = 'topBotDeltaGrow'
                break
        }
    
        this.setCursors(cursors,{main:main,adjust:adjust})
        return true
    },
    moveCursorsToStartOfSelections:function ()
    {
        var rngs, selections
    
        selections = this.allSelections()
        if (_k_.empty(selections))
        {
            return
        }
        rngs = belt.splitLineRanges(this.s.lines,selections,false)
        this.setCursors(belt.startPositionsOfRanges(rngs))
        return true
    },
    moveCursorsToEndOfSelections:function ()
    {
        var rngs, selections
    
        selections = this.allSelections()
        if (_k_.empty(selections))
        {
            return
        }
        rngs = belt.splitLineRanges(this.s.lines,selections,false)
        this.setCursors(belt.endPositionsOfRanges(rngs))
        return true
    },
    moveCursorsToEndOfLines:function ()
    {
        var cur, cursors
    
        cursors = this.allCursors()
        var list = _k_.list(cursors)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            cur = list[_d_]
            cur[0] = belt.lineRangeAtPos(this.s.lines,cur)[2]
        }
        this.setCursors(cursors)
        return true
    },
    isAnyCursorInLine:function (y)
    {
        var c
    
        var list = _k_.list(this.allCursors())
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            c = list[_e_]
            if (c[1] === y)
            {
                return true
            }
        }
    },
    chunksBeforeCursors:function ()
    {
        return this.s.cursors.map((function (c)
        {
            return belt.chunkBeforePos(this.s.lines,c)
        }).bind(this))
    },
    moveCursorsAndSelect:function (dir, opt)
    {
        var cursors, selections
    
        if (_k_.empty(this.anchors))
        {
            this.anchors = this.allCursors()
        }
        var _f_ = belt.extendLineRangesByMovingPositionsInDirection(this.s.lines,this.s.selections,this.s.cursors,dir,opt,this.anchors); selections = _f_[0]; cursors = _f_[1]
    
        this.setSelections(selections)
        return this.setCursors(cursors,{adjust:'topBotDelta',keepAnchors:true})
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L211bHRpLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BUWEsVUFBQTtJQUFNOztPQUNBLFdBQVo7T0FBaUIsYUFBakI7OztJQUlIOztlQUFlLEtBQUMsRUFBRSxRQUFROztJQUUxQix3QkFBZTs7OztRQUVYLFVBQVUsS0FBQztRQUVYLE1BQUssUUFBTyxPQUFPLEtBQUs7UUFFeEI7NEJBQ1M7OztZQUFMO1lBQ0EsV0FBVyxLQUFLO1lBQ2hCLFdBQVcsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFHOztRQUUvQixLQUFLLEtBQUssNkJBQTZCLFdBQVcsS0FBQyxhQUFhO2VBQ2hFLEtBQUMsV0FBVyxZQUFXLEtBQUssR0FBRyxPQUFPOztJQUUxQywwQkFBaUI7Ozs7UUFFYixVQUFVLEtBQUM7UUFFWDs0QkFDUzs7O1lBQUw7WUFDQSxPQUFPLEtBQUssaUJBQWlCLFFBQVEsS0FBSyxvQkFBb0IsRUFBRTtZQUNoRSxPQUFPLEtBQUssaUJBQWlCLFFBQVEsS0FBSyxvQkFBb0IsRUFBRTtZQUNoRSxTQUFZLFFBQVE7WUFDcEI7O3dCQUFhOzt5QkFDVDsrQkFBUyxRQUFROzt5QkFDakI7K0JBQVMsUUFBUTs7Ozs7Z0JBRUE7O2dCQUFyQixXQUFXLEtBQUs7OztlQUVwQixLQUFDLFdBQVc7O0lBRWhCLG9CQUFXLEdBQUU7Ozs7UUFFVCxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ2pCLFVBQVUsS0FBQztRQUNYLFFBQVEsS0FBSztlQUNiLEtBQUMsV0FBVyxTQUFRLEtBQUs7O0lBRTdCLHFCQUFZOztlQUVSLEtBQUMsV0FBVyxLQUFDLGFBQWEsT0FBTzs7SUFFckMsNEJBQW1COzs7O1FBRWYsVUFBVSxLQUFLLHNCQUFzQixLQUFDLGFBQWE7UUFDbkQsUUFBUSxLQUFLLEtBQUssV0FBVztlQUM3QixLQUFDLFdBQVcsU0FBUSxLQUFLOztJQUU3QixzQkFBYSxLQUFJOzs7O1lBRUgsVUFBUDs7b0JB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/multi.kode
