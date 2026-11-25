var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
                ocol = this.lineScale(oline) * pos[0]
                return parseInt(ocol / this.lineScale(pos[1]))
            }
        }
        return pos[0]
    },
    expandCursors:function (dir)
    {
        var c, cn, cursors, dy, mc, newCursors, rows
    
        cursors = this.allCursors()
        dy = (dir === 'up' ? -1 : 1)
        rows = this.hasWrap()
        newCursors = []
        var list = _k_.list(cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            newCursors.push(c)
            if (rows)
            {
                newCursors.push(this.rowStep(c,dir)[0])
            }
            else
            {
                cn = this.scaleAdjustedColumn([c[0],c[1] + dy],dy)
                newCursors.push([cn,c[1] + dy])
            }
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
        var adjust, back, c, cursors, goal, goals, ind, line, lines, main, pos, r, rows, _103_31_, _108_31_, _146_28_, _84_18_, _85_22_, _93_48_
    
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
        opt.count = ((_84_18_=opt.count) != null ? _84_18_ : 1)
        opt.jumpWords = ((_85_22_=opt.jumpWords) != null ? _85_22_ : false)
        if (this.s.highlights.length)
        {
            this.deselect()
        }
        cursors = this.allCursors()
        lines = this.s.lines
        if (_k_.in(dir,['up','down']) && !(this.rectree != null) && this.hasWrap())
        {
            goals = this.rowGoals()
            rows = {}
        }
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
                    else if (rows)
                    {
                        ;[pos,goal] = this.rowSteps(c,dir,opt.count,goals[`${c[0]} ${c[1]}`])
                        c[0] = pos[0]
                        c[1] = pos[1]
                        rows[`${c[0]} ${c[1]}`] = goal
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
        adjust = ((_146_28_=opt.adjust) != null ? _146_28_ : 'topBotDelta')
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
        if (rows)
        {
            this.keepRowGoals(rows)
        }
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
        var cursors, selections, _202_46_
    
        if ((this.rectree != null))
        {
            return this.sheetMoveAndSelect(dir)
        }
        if (_k_.in(dir,['up','down']) && this.hasWrap())
        {
            return this.moveRowsAndSelect(dir)
        }
        if (_k_.empty(this.anchors))
        {
            this.anchors = this.allCursors()
        }
        ;[selections,cursors] = belt.extendLineRangesByMovingPositionsInDirection(this.s.lines,this.s.selections,this.s.cursors,dir,opt,this.anchors)
        this.setSelections(selections)
        return this.setCursors(cursors,{adjust:'topBotDelta',keepAnchors:true})
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L211bHRpLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFdBQVo7T0FBaUIsYUFBakI7O09BQ1ksYUFBUjs7O0lBSVA7O2VBQWUsS0FBQyxFQUFFLFFBQVE7O0lBRTFCLDhCQUFxQixLQUFJOzs7O1lBRWxCLE9BQU8sSUFBSTs7WUFDVixRQUFRLElBQUksS0FBSztnQkFDZDs7Z0JBQ0MsT0FBTyxLQUFDLFVBQVUsU0FBUyxJQUFJO2dDQUN6QixPQUFPLEtBQUMsVUFBVSxJQUFJOzs7ZUFDcEMsSUFBSTs7SUFFUix3QkFBZTs7OztRQUVYLFVBQVUsS0FBQztRQUVYLE1BQUssUUFBTyxPQUFPLEtBQUs7UUFFeEIsT0FBTyxLQUFDO1FBRVI7NEJBQ1M7OztZQUFMO1lBQ0EsV0FBVyxLQUFLO2dCQUNiOztnQkFDQyxXQUFXLEtBQUssS0FBQyxRQUFRLEVBQUUsS0FBSzs7OztnQkFFaEMsS0FBSyxLQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRSxLQUFHLElBQUk7Z0JBQ3pDLFdBQVcsTUFBTSxHQUFHLEVBQUUsS0FBRzs7O1FBRWpDLEtBQUssS0FBSyw2QkFBNkIsV0FBVyxLQUFDLGFBQWE7ZUFDaEUsS0FBQyxXQUFXLFlBQVcsS0FBSyxHQUFHLE9BQU87O0lBRTFDLDBCQUFpQjs7OztRQUViLFVBQVUsS0FBQztRQUVYOzRCQUNTOzs7WUFBTDtZQUNBLE9BQU8sS0FBSyxpQkFBaUIsUUFBUSxLQUFLLG9CQUFvQixFQUFFO1lBQ2hFLE9BQU8sS0FBSyxpQkFBaUIsUUFBUSxLQUFLLG9CQUFvQixFQUFFO1lBQ2hFLFNBQVksUUFBUTtZQUNwQjs7d0JBQWE7O3lCQUNUOytCQUFTLFFBQVE7O3lCQUNqQjsrQkFBUyxRQUFROzs7OztnQkFFQTs7Z0JBQXJCLFdBQVcsS0FBSzs7O2VBRXBCLEtBQUMsV0FBVzs7SUFFaEIsb0JBQVcsR0FBRTs7OztRQUVULE1B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
//# sourceURL=../../../../kode/ked/edit/act/multi.kode
