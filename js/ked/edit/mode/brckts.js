var _k_ = {eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var brckts

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil

import belt from "../tool/belt.js"

import mode from "../mode.js"


brckts = (function ()
{
    brckts["autoStart"] = true
    brckts["surround"] = {'#':['#{','}'],'{':['{','}'],'}':['{','}'],'[':['[',']'],']':['[',']'],'(':['(',')'],')':['(',')'],"'":["'","'"],'"':['"','"']}
    function brckts (state)
    {
        this.state = state
    
        this["handleKey"] = this["handleKey"].bind(this)
        this["conditionalSwapStringDelimiters"] = this["conditionalSwapStringDelimiters"].bind(this)
        this["swapStringDelimiters"] = this["swapStringDelimiters"].bind(this)
        this.name = 'brckts'
    }

    brckts.prototype["cursorsSet"] = function ()
    {
        var openClose, spans, strings

        if (this.state.s.selections.length)
        {
            if (_k_.eql(this.allSpans, this.state.s.highlights))
            {
                this.state.setHighlights([])
            }
            return
        }
        if (this.state.s.highlights.length)
        {
            if (_k_.eql(!this.allSpans, this.state.s.highlights.asMutable()))
            {
                return
            }
        }
        var _a_ = belt.spansOfNestedPairsAtPositions(this.state.s.lines,this.state.s.cursors); spans = _a_[0]; openClose = _a_[1]; strings = _a_[2]

        if (_k_.empty(spans))
        {
            this.openCloseSpans = belt.openCloseSpansForPositions(this.state.s.lines,this.state.s.cursors)
            this.stringDelimiterSpans = belt.stringDelimiterSpansForPositions(this.state.s.cursors)
            spans = this.openCloseSpans.concat(this.stringDelimiterSpans)
        }
        else
        {
            this.openCloseSpans = openClose
            this.stringDelimiterSpans = strings
        }
        this.state.setHighlights(spans)
        return this.allSpans = this.state.s.highlights.asMutable()
    }

    brckts.prototype["swapStringDelimiters"] = function ()
    {
        var cursors, selections

        this.state.begin()
        this.state.pushState()
        cursors = this.state.allCursors()
        selections = this.state.allSelections()
        this.state.setSelections(belt.rangesForSpans(this.stringDelimiterSpans))
        this.state.moveCursorsToEndOfSelections()
        if (this.state.textOfSelection().startsWith('"'))
        {
            this.state.insert("'")
        }
        else
        {
            this.state.insert('"')
        }
        this.state.setCursors(cursors)
        this.state.setSelections(selections)
        return this.state.end()
    }

    brckts.prototype["conditionalSwapStringDelimiters"] = function ()
    {
        if (!this.stringDelimiterSpans)
        {
            return
        }
        if (belt.textForSpans(this.state.s.lines,this.stringDelimiterSpans).startsWith("'"))
        {
            return this.swapStringDelimiters()
        }
    }

    brckts.prototype["handleKey"] = function (key, event)
    {
        var delrngs, nsegl, nsegs, pairs, pos, rngs, seg

        switch (key)
        {
            case "alt+cmd+'":
                if (!_k_.empty(this.stringDelimiterSpans))
                {
                    this.swapStringDelimiters()
                    return
                }
                break
            case 'alt+cmd+b':
                if (!_k_.empty(this.stringDelimiterSpans))
                {
                    this.state.setSelections(belt.rangesForSpans(this.stringDelimiterSpans))
                    this.state.moveCursorsToEndOfSelections()
                    return
                }
                if (!_k_.empty(this.openCloseSpans))
                {
                    this.state.setSelections(belt.rangesForSpans(this.openCloseSpans))
                    this.state.moveCursorsToEndOfSelections()
                    return
                }
                break
            case 'delete':
                if (_k_.empty(this.state.s.selections))
                {
                    pairs = kutil.uniq(Object.values(brckts.surround))
                    if (!_k_.empty((rngs = belt.rangesOfPairsSurroundingPositions(this.state.s.lines,pairs,this.state.s.cursors))))
                    {
                        this.state.setSelections(rngs)
                        this.state.deleteSelection()
                        return
                    }
                }
                break
        }

        if (_k_.empty(brckts.surround[event.char]))
        {
            return 'unhandled'
        }
        if (event.char === '#')
        {
            if (!_k_.empty(belt.positionsAndRangesOutsideStrings(this.state.s.lines,this.state.s.selections,this.state.s.cursors)))
            {
                return 'unhandled'
            }
            this.conditionalSwapStringDelimiters()
            this.state.begin()
            if (!_k_.empty(this.state.s.selections))
            {
                this.state.surroundSelection(event.char,brckts.surround[event.char])
            }
            else
            {
                this.state.insert(brckts.surround[event.char][0] + brckts.surround[event.char][1])
                this.state.moveCursors('left')
            }
            this.state.end()
            return
        }
        else
        {
            if (!_k_.empty(this.state.s.selections))
            {
                if (!_k_.empty(this.stringDelimiterSpans))
                {
                    delrngs = belt.normalizeRanges(belt.rangesForSpans(this.stringDelimiterSpans))
                    if (_k_.eql(delrngs, this.state.s.selections))
                    {
                        return 'unhandled'
                    }
                }
                return this.state.surroundSelection(event.char,brckts.surround[event.char])
            }
            nsegl = belt.segsForPositions(this.state.s.lines,this.state.s.cursors)
            nsegs = kutil.uniq(nsegl)
            var list = _k_.list(nsegs)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                seg = list[_a_]
                if (brckts.surround[event.char][1] === event.char)
                {
                    if (seg === event.char)
                    {
                        this.state.moveCursors('right')
                        return
                    }
                }
                if (!(_k_.in(seg,['',undefined,' ','}',']',')'])))
                {
                    return "unhandled"
                }
            }
            var list1 = _k_.list(this.state.s.cursors)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                pos = list1[_b_]
                if (belt.isUnbalancedPosition(this.state.s.lines,pos,event.char))
                {
                    return "unhandled"
                }
            }
            this.state.insert(brckts.surround[event.char][0] + brckts.surround[event.char][1])
            this.state.moveCursors('left')
            return
        }
        return 'unhandled'
    }

    return brckts
})()

export default brckts;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJja3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L21vZGUvYnJja3RzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFaOztPQUNZLFdBQUE7OztBQUVWLFVBQVQ7O0lBRUksUUFBQyxjQUFXO0lBQ1osUUFBQyxjQUVHLEtBQU0sS0FBSyxLQUNYLEtBQU0sSUFBSSxLQUNWLEtBQU0sSUFBSSxLQUNWLEtBQU0sSUFBSSxLQUNWLEtBQU0sSUFBSSxLQUNWLEtBQU0sSUFBSSxLQUNWLEtBQU0sSUFBSSxLQUNWLEtBQU0sSUFBSSxLQUNWLEtBQU0sSUFBSTthQUtkLFFBQUk7O1FBQUQ7Ozs7O1FBRUMsS0FBQyxPQUFPOzs7c0JBUVo7Ozs7WUFHTyxLQUFDLE1BQU0sRUFBRSxXQUFXOzt3QkFDaEIsS0FBQyxVQUFhLEtBQUMsTUFBTSxFQUFFOztnQkFDdEIsS0FBQyxNQUFNOzs7O1lBR1osS0FBQyxNQUFNLEVBQUUsV0FBVzs7eUJBQ1QsS0FBQyxVQUFhLEtBQUMsTUFBTSxFQUFFLFdBQVc7Ozs7O2tCQUVwQixLQUFLLDhCQUE4QixLQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUMsTUFBTSxFQUFFLFVBQXRGLGdCQUFNLG9CQUFVOztzQkFFUjs7WUFDTCxLQUFDLGlCQUF1QixLQUFLLDJCQUEyQixLQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUMsTUFBTSxFQUFFO1lBQ2hGLEtBQUMsdUJBQXVCLEtBQUssaUNBQTBDLEtBQUMsTUFBTSxFQUFFO1lBQ2hGLFFBQVEsS0FBQyxlQUFlLE9BQU8sS0FBQzs7OztZQUVoQyxLQUFDLGlCQUF1QjtZQUN4QixLQUFDLHVCQUF1Qjs7UUFFNUIsS0FBQyxNQUFNLGNBQWM7ZUFFckIsS0FBQyxXQUFXLEtBQUMsTUFBTSxFQUFFLFdBQVc7OztzQkFRcEM7Ozs7UUFFSSxLQUFDLE1BQU07UUFDUCxLQUFDLE1BQU07UUFDUCxVQUFVLEtBQUMsTUFBTTtRQUNqQixhQUFh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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/brckts.kode
