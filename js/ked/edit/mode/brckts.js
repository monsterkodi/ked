var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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

    brckts["spansAt"] = function (lines, positions)
    {
        var openClose, spans, strings

        ;[spans,openClose,strings] = belt.spansOfNestedPairsAtPositions(lines,positions)
        if (_k_.empty(spans))
        {
            openClose = belt.openCloseSpansForPositions(lines,positions)
            strings = belt.stringDelimiterSpansForPositions(positions)
            spans = openClose.concat(strings)
        }
        return [spans,openClose,strings]
    }

    brckts.prototype["keepSpans"] = function ()
    {
        var openClose, spans, strings

        ;[spans,openClose,strings] = brckts.spansAt(this.state.s.lines,this.state.s.cursors)
        this.openCloseSpans = openClose
        this.stringDelimiterSpans = strings
        return spans
    }

    brckts.prototype["cursorsSet"] = function ()
    {
        var spans, _53_42_, _63_30_

        if ((this.state.sheetPage != null))
        {
            return this.keepSpans()
        }
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
            if (!(_k_.eql(this.allSpans, this.state.s.highlights.asMutable())))
            {
                return
            }
        }
        spans = ((this.state.rectree != null) ? this.sheetSpans() : this.keepSpans())
        this.state.setHighlights(spans)
        return this.allSpans = this.state.s.highlights.asMutable()
    }

    brckts.prototype["sheetSpans"] = function ()
    {
        var hit, nodeSpans, pos, rng, spans, _79_37_, _79_53_

        spans = []
        var list = _k_.list(this.state.s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            hit = this.state.sheetNodeAt(this.state.sheetCellForPos(pos))
            if (!((hit != null ? hit.node : undefined) != null) || !(hit.pos != null))
            {
                continue
            }
            nodeSpans = brckts.spansAt(hit.node.state.s.lines,[hit.pos])[0]
            var list1 = _k_.list(this.state.sheetRangesOf(hit.node,nodeSpans))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                rng = list1[_b_]
                spans.push([rng[0],rng[1],rng[2]])
            }
        }
        return spans
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

        if (mode.isActive(this.state,'novim'))
        {
            return 'unhandled'
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJja3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L21vZGUvYnJja3RzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFaOztPQUNZLFdBQUE7OztBQUNsQixVQUFEOztJQUNJLFFBQUMsY0FBVztJQUNaLFFBQUMsY0FFRyxLQUFNLEtBQUssS0FDWCxLQUFNLElBQUksS0FDVixLQUFNLElBQUksS0FDVixLQUFNLElBQUksS0FDVixLQUFNLElBQUksS0FDVixLQUFNLElBQUksS0FDVixLQUFNLElBQUksS0FDVixLQUFNLElBQUksS0FDVixLQUFNLElBQUk7YUFLZCxRQUFJOztRQUFEOzs7OztRQUVDLEtBQUMsT0FBTzs7O0lBS1osUUFBQyxzQkFBUyxPQUFNOzs7O1VBRVgsTUFBTSxVQUFVLFdBQVcsS0FBSyw4QkFBOEIsTUFBTTtzQkFFNUQ7O1lBQ0wsWUFBWSxLQUFLLDJCQUEyQixNQUFNO1lBQ2xELFVBQVksS0FBSyxpQ0FBaUM7WUFDbEQsUUFBWSxVQUFVLE9BQU87O2dCQUVoQyxNQUFNLFVBQVU7OztzQkFFckI7Ozs7VUFFSyxNQUFNLFVBQVUsV0FBVyxPQUFPLFFBQVEsS0FBQyxNQUFNLEVBQUUsTUFBTSxLQUFDLE1BQU0sRUFBRTtRQUVuRSxLQUFDLGlCQUF1QjtRQUN4QixLQUFDLHVCQUF1QjtlQUV4Qjs7O3NCQUVKOzs7O2FBSXNCLEtBQUMsTUFBTTs7bUJBQXZCLEtBQUM7O1lBRUEsS0FBQyxNQUFNLEVBQUUsV0FBVzs7d0JBQ2hCLEtBQUMsVUFBYSxLQUFDLE1BQU0sRUFBRTs7Z0JBQ3RCLEtBQUMsTUFBTTs7OztZQUdaLEtBQUMsTUFBTSxFQUFFLFdBQVc7OzBCQUNULEtBQUMsVUFBYSxLQUFDLE1BQU0sRUFBRSxXQUFXOzs7OztRQUVoRCxVQUFRLEtBQUMsTUFBTSxtQkFBVyxLQUFDLGVBQWUsS0FBQztRQUUzQyxLQUFDLE1BQU0sY0FBYztlQUVyQixLQUFDLFdBQVcs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
//# sourceURL=../../../../kode/ked/edit/mode/brckts.kode
