var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var feedKey, handleKey

import config from "../util/config.js"

import mode from "./mode.js"


handleKey = function (state, key, event)
{
    if ('unhandled' !== mode.handleKey(state,key,event))
    {
        return
    }
    switch (key)
    {
        case 'up':
            return state.moveCursors('up')

        case 'down':
            return state.moveCursors('down')

        case 'left':
            return state.moveCursors('left')

        case 'right':
            return state.moveCursors('right')

        case 'ctrl+alt+up':
            return state.singleCursorPage('up')

        case 'ctrl+alt+down':
            return state.singleCursorPage('down')

        case 'shift+ctrl+alt+up':
            return state.moveCursors('up',{count:16})

        case 'shift+ctrl+alt+down':
            return state.moveCursors('down',{count:16})

        case 'cmd+left':
        case 'ctrl+left':
            return state.moveCursors(['bos','ind_bol'])

        case 'cmd+right':
        case 'ctrl+right':
            return state.moveCursors(['eos','ind_eol'])

        case 'alt+left':
            return state.moveCursors('left',{jump:['ws','word','empty','punct']})

        case 'alt+right':
            return state.moveCursors('right',{jump:['ws','word','empty','punct']})

        case 'shift+alt+right':
            return state.moveCursorsAndSelect('right',{jump:['ws','word','empty','punct']})

        case 'shift+alt+left':
            return state.moveCursorsAndSelect('left',{jump:['ws','word','empty','punct']})

        case 'shift+up':
            return state.moveCursorsAndSelect('up')

        case 'shift+down':
            return state.moveCursorsAndSelect('down')

        case 'shift+left':
            return state.moveCursorsAndSelect('left')

        case 'shift+right':
            return state.moveCursorsAndSelect('right')

        case 'shift+cmd+right':
            return state.moveCursorsAndSelect('ind_eol')

        case 'shift+cmd+left':
            return state.moveCursorsAndSelect('ind_bol')

        case 'shift+ctrl+h':
            return state.moveCursorsAndSelect('bof')

        case 'shift+ctrl+j':
            return state.moveCursorsAndSelect('eof')

        case 'shift+alt+cmd+up':
            return state.moveMainCursorInDirection('up',{keep:true})

        case 'shift+alt+cmd+down':
            return state.moveMainCursorInDirection('down',{keep:true})

        case 'shift+alt+cmd+left':
            return state.moveMainCursorInDirection('left',{keep:true})

        case 'shift+alt+cmd+right':
            return state.moveMainCursorInDirection('right',{keep:true})

        case 'alt+up':
        case 'shift+ctrl+up':
            return state.moveSelectionOrCursorLines('up')

        case 'alt+down':
        case 'shift+ctrl+down':
            return state.moveSelectionOrCursorLines('down')

        case 'shift+alt+up':
            return state.cloneSelectionAndCursorLines('up')

        case 'shift+alt+down':
            return state.cloneSelectionAndCursorLines('down')

        case 'cmd+up':
        case 'ctrl+up':
            return state.expandCursors('up')

        case 'cmd+down':
        case 'ctrl+down':
            return state.expandCursors('down')

        case 'shift+cmd+up':
            return state.contractCursors('up')

        case 'shift+cmd+down':
            return state.contractCursors('down')

        case 'pageup':
            return state.singleCursorPage('up')

        case 'pagedown':
            return state.singleCursorPage('down')

        case 'home':
            return state.singleCursorAtIndentOrStartOfLine()

        case 'end':
            return state.singleCursorAtEndOfLine()

        case 'ctrl+h':
            return state.setMainCursor(0,0)

        case 'ctrl+j':
            return state.setMainCursor(state.s.lines[state.s.lines.length - 1].length,state.s.lines.length - 1)

        case 'alt+d':
            return state.delete('next',true)

        case 'shift+ctrl+k':
        case 'entf':
            return state.delete('next')

        case 'ctrl+k':
            return state.delete('eol')

        case 'delete':
            return state.delete('back')

        case 'ctrl+delete':
            return state.delete('back',true)

        case 'cmd+delete':
            return state.delete('back',true)

        case 'shift+tab':
            return state.deindentSelectedOrCursorLines()

        case 'tab':
            return state.insert('\t')

        case 'cmd+x':
        case 'ctrl+x':
            return state.cut()

        case 'cmd+c':
        case 'ctrl+c':
            return state.copy()

        case 'cmd+v':
        case 'ctrl+v':
            if (!mode.isActive(state,'novim'))
            {
                return state.paste()
            }
            break
        case 'cmd+z':
        case 'ctrl+z':
            return state.undo()

        case 'shift+cmd+z':
        case 'cmd+y':
        case 'ctrl+y':
            return state.redo()

        case 'cmd+a':
        case 'ctrl+a':
            return state.selectAllLines()

        case 'cmd+j':
            return state.joinLines()

        case 'cmd+l':
        case 'ctrl+l':
            return state.selectMoreLines()

        case 'shift+cmd+l':
        case 'shift+ctrl+l':
            return state.selectLessLines()

        case 'cmd+e':
        case 'ctrl+e':
            return state.highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()

        case 'cmd+d':
        case 'ctrl+d':
            return state.selectWordAtCursor_highlightSelection_addNextHighlightToSelection()

        case 'cmd+g':
        case 'ctrl+g':
            return state.selectWordAtCursor_highlightSelection_selectNextHighlight()

        case 'shift+cmd+e':
        case 'shift+ctrl+e':
            return state.highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight()

        case 'shift+cmd+d':
        case 'shift+ctrl+d':
            return state.selectWordAtCursor_highlightSelection_addPrevHighlightToSelection()

        case 'shift+cmd+g':
        case 'shift+ctrl+g':
            return state.selectWordAtCursor_highlightSelection_selectPrevHighlight()

        case 'alt+y':
            return state.toggleMode('unype')

        case 'alt+n':
        case 'alt+z':
            return state.toggleMode('novim')

        case 'alt+3':
            return state.toggleMode('salter')

        case 'cmd+3':
        case 'ctrl+3':
            return state.insertAsciiHeaderForSelectionOrWordAtCursor()

        case 'alt+cmd+d':
        case 'alt+ctrl+d':
            return state.selectWordAtCursor_highlightSelection_selectAllHighlights()

        case 'cmd+/':
        case 'ctrl+/':
            return state.toggleCommentAtSelectionOrCursorLines()

        case 'alt+cmd+/':
        case 'ctrl+alt+/':
            return state.toggleCommentTypeAtSelectionOrCursorLines()

        case 'ctrl+return':
            return state.jumpToWordAtCursor()

        case 'esc':
            state.finishNovimInsert()
            if (state.hasCursorsHighlightsOrSelections())
            {
                return state.clearCursorsHighlightsAndSelections()
            }
            else
            {
                if (config.data.novim.autoEnableOnEscape)
                {
                    state.toggleMode('novim')
                }
            }
            break
    }

    return 'unhandled'
}

feedKey = function (state, key, event)
{
    var char, combo, result, _132_24_

    result = handleKey(state,key,event)
    state.recordMacroKey(key,event)
    if (result !== 'unhandled')
    {
        return 'handled'
    }
    if (!event)
    {
        return 'unhandled'
    }
    char = event.char
    combo = ((_132_24_=event.combo) != null ? _132_24_ : key)
    if (!_k_.empty(char) && (char === combo || _k_.in(combo,['space','shift+space','return','tab']) || combo.slice(0, -1) === 'shift+'))
    {
        state.insert(char)
        return 'inserted'
    }
    return 'unhandled'
}
export default {
    handleKey:handleKey,
    feedKey:feedKey
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5cy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9rZXlzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYyxhQUFQOztPQUNELFdBQUE7OztBQU9OLHNCQUFhLE9BQU0sS0FBSTs7UUFJZCxnQkFBZSxLQUFLLFVBQVUsTUFBTSxJQUFJOzs7O1lBRXRDOzthQUVIO21CQUF3QyxNQUFNLFlBQVk7O2FBQzFEO21CQUF3QyxNQUFNLFlBQVk7O2FBQzFEO21CQUF3QyxNQUFNLFlBQVk7O2FBQzFEO21CQUF3QyxNQUFNLFlBQVk7O2FBRTFEO21CQUF3QyxNQUFNLGlCQUFpQjs7YUFDL0Q7bUJBQXdDLE1BQU0saUJBQWlCOzthQUMvRDttQkFBd0MsTUFBTSxZQUFZLE1BQVEsTUFBTTs7YUFDeEU7bUJBQXdDLE1BQU0sWUFBWSxRQUFRLE1BQU07O2FBRXhFO2FBQWdCO21CQUF3QixNQUFNLGFBQWEsTUFBTTs7YUFDakU7YUFBZ0I7bUJBQXdCLE1BQU0sYUFBYSxNQUFNOzthQUVqRTttQkFBd0MsTUFBTSxZQUFZLFFBQVEsTUFBTSxLQUFLLE9BQU8sUUFBUTs7YUFDNUY7bUJBQXdDLE1BQU0sWUFBWSxTQUFRLE1BQU0sS0FBSyxPQUFPLFFBQVE7O2FBRTVGO21CQUF3QyxNQUFNLHFCQUFxQixTQUFRLE1BQU0sS0FBSyxPQUFPLFFBQVE7O2FBQ3JHO21CQUF3QyxNQUFNLHFCQUFxQixRQUFRLE1BQU0sS0FBSyxPQUFPLFFBQVE7O2FBQ3JHO21CQUF3QyxNQUFNLHFCQUFxQjs7YUFDbkU7bUJBQXdDLE1BQU0scUJBQXFCOzthQUNuRTttQkFBd0MsTUFBTSxxQkFBcUI7O2FBQ25FO21CQUF3QyxNQUFNLHFCQUFxQjs7YUFDbkU7bUJBQXdDLE1BQU0scUJBQXFCOzthQUNuRTttQkFBd0MsTUFBTSxxQkFBcUI7O2FBQ25FO21CQUF3QyxNQUFNLHFCQUFxQjs7YUFDbkU7bUJBQXdDLE1BQU0scUJBQXFCOzthQUVuRTttQkFBd0MsTUFBTSwwQkFBMEIsTUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/keys.kode
