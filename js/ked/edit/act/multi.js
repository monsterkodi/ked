var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"

import config from "../../util/config.js"

export default {
    allCursors:function ()
    {
        return this.s.cursors.asMutable()
    },
    scaleAdjustedColumn:function (pos, dir)
    {
        var ocol, oline
    
        if (config.get('cursor.scaleAdjustCol'))
        {
            oline = pos[1] - dir
            if (oline)
            {
                ocol = this.lineHeight(oline) * pos[0]
                return parseInt(ocol / this.lineHeight(pos[1]))
            }
        }
        return pos[0]
    },
    expandCursors:function (dir)
    {
        var c, cn, cursors, dy, mc, newCursors
    
        cursors = this.allCursors()
        dy = (dir === 'up' ? -1 : 1)
        newCursors = []
        var list = _k_.list(cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            newCursors.push(c)
            cn = this.scaleAdjustedColumn([c[0],c[1] + dy],dy)
            newCursors.push([cn,c[1] + dy])
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
        var adjust, back, c, cursors, ind, line, lines, main, pos, r, _133_28_, _79_18_, _80_22_, _94_31_, _99_31_
    
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
        opt.count = ((_79_18_=opt.count) != null ? _79_18_ : 1)
        opt.jumpWords = ((_80_22_=opt.jumpWords) != null ? _80_22_ : false)
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
                    if ((this.rectree != null) && !opt.jump)
                    {
                        pos = this.sheetPosInDirection(c,dir,opt.count)
                        c[0] = pos[0]
                        c[1] = pos[1]
                    }
                    else
                    {
                        c[0] += belt.numCharsFromPosToWordOrPunctInDirection(lines,c,dir,opt)
                    }
                    break
                case 'up':
                case 'down':
                    if ((this.rectree != null))
                    {
                        pos = this.sheetPosInDirection(c,dir,opt.count)
                        c[0] = pos[0]
                        c[1] = pos[1]
                    }
                    else if (dir === 'up')
                    {
                        c[1] -= opt.count
                        c[0] = this.scaleAdjustedColumn(c,-opt.count)
                    }
                    else
                    {
                        c[1] += opt.count
                        c[0] = this.scaleAdjustedColumn(c,opt.count)
                    }
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
        adjust = ((_133_28_=opt.adjust) != null ? _133_28_ : 'topBotDelta')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L211bHRpLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFdBQVo7T0FBaUIsYUFBakI7O09BQ1ksYUFBUjs7O0lBSVA7O2VBQWUsS0FBQyxFQUFFLFFBQVE7O0lBRTFCLDhCQUFxQixLQUFJOzs7O1lBRWxCLE9BQU8sSUFBSTs7WUFDVixRQUFRLElBQUksS0FBSztnQkFDZDs7Z0JBQ0MsT0FBTyxLQUFDLFdBQVcsU0FBUyxJQUFJO2dDQUMxQixPQUFPLEtBQUMsV0FBVyxJQUFJOzs7ZUFDckMsSUFBSTs7SUFFUix3QkFBZTs7OztRQUVYLFVBQVUsS0FBQztRQUVYLE1BQUssUUFBTyxPQUFPLEtBQUs7UUFFeEI7NEJBQ1M7OztZQUFMO1lBQ0EsV0FBVyxLQUFLO1lBQ2hCLEtBQUssS0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsS0FBRyxJQUFJO1lBQ3pDLFdBQVcsTUFBTSxHQUFHLEVBQUUsS0FBRzs7UUFFN0IsS0FBSyxLQUFLLDZCQUE2QixXQUFXLEtBQUMsYUFBYTtlQUNoRSxLQUFDLFdBQVcsWUFBVyxLQUFLLEdBQUcsT0FBTzs7SUFFMUMsMEJBQWlCOzs7O1FBRWIsVUFBVSxLQUFDO1FBRVg7NEJBQ1M7OztZQUFMO1lBQ0EsT0FBTyxLQUFLLGlCQUFpQixRQUFRLEtBQUssb0JBQW9CLEVBQUU7WUFDaEUsT0FBTyxLQUFLLGlCQUFpQixRQUFRLEtBQUssb0JBQW9CLEVBQUU7WUFDaEUsU0FBWSxRQUFRO1lBQ3BCOzt3QkFBYTs7eUJBQ1Q7K0JBQVMsUUFBUTs7eUJBQ2pCOytCQUFTLFFBQVE7Ozs7O2dCQUVBOztnQkFBckIsV0FBVyxLQUFLOzs7ZUFFcEIsS0FBQyxXQUFXOztJQUVoQixvQkFBVyxHQUFFOzs7O1FBRVQsTUFBTSxLQUFLLElBQUksRUFBRTtRQUNqQixVQUFVLEtBQUM7UUFDWCxRQUFRLEtBQUs7ZUFDYixLQUFDLFdBQVcs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/multi.kode
