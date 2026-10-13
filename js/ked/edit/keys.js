var handleKey

import mode from "./mode.js"


handleKey = function (key, event)
{
    if ('unhandled' !== mode.handleKey(this,key,event))
    {
        return
    }
    switch (key)
    {
        case 'up':
            return this.moveCursors('up')

        case 'down':
            return this.moveCursors('down')

        case 'left':
            return this.moveCursors('left')

        case 'right':
            return this.moveCursors('right')

        case 'ctrl+alt+up':
            return this.singleCursorPage('up')

        case 'ctrl+alt+down':
            return this.singleCursorPage('down')

        case 'shift+ctrl+alt+up':
            return this.moveCursors('up',{count:16})

        case 'shift+ctrl+alt+down':
            return this.moveCursors('down',{count:16})

        case 'cmd+left':
        case 'ctrl+left':
            return this.moveCursors(['bos','ind_bol'])

        case 'cmd+right':
        case 'ctrl+right':
            return this.moveCursors(['eos','ind_eol'])

        case 'alt+left':
            return this.moveCursors('left',{jump:['ws','word','empty','punct']})

        case 'alt+right':
            return this.moveCursors('right',{jump:['ws','word','empty','punct']})

        case 'shift+alt+right':
            return this.moveCursorsAndSelect('right',{jump:['ws','word','empty','punct']})

        case 'shift+alt+left':
            return this.moveCursorsAndSelect('left',{jump:['ws','word','empty','punct']})

        case 'shift+up':
            return this.moveCursorsAndSelect('up')

        case 'shift+down':
            return this.moveCursorsAndSelect('down')

        case 'shift+left':
            return this.moveCursorsAndSelect('left')

        case 'shift+right':
            return this.moveCursorsAndSelect('right')

        case 'shift+cmd+right':
            return this.moveCursorsAndSelect('ind_eol')

        case 'shift+cmd+left':
            return this.moveCursorsAndSelect('ind_bol')

        case 'shift+ctrl+h':
            return this.moveCursorsAndSelect('bof')

        case 'shift+ctrl+j':
            return this.moveCursorsAndSelect('eof')

        case 'shift+alt+cmd+up':
            return this.moveMainCursorInDirection('up',{keep:true})

        case 'shift+alt+cmd+down':
            return this.moveMainCursorInDirection('down',{keep:true})

        case 'shift+alt+cmd+left':
            return this.moveMainCursorInDirection('left',{keep:true})

        case 'shift+alt+cmd+right':
            return this.moveMainCursorInDirection('right',{keep:true})

        case 'alt+up':
            return this.moveSelectionOrCursorLines('up')

        case 'alt+down':
            return this.moveSelectionOrCursorLines('down')

        case 'shift+alt+up':
            return this.cloneSelectionAndCursorLines('up')

        case 'shift+alt+down':
            return this.cloneSelectionAndCursorLines('down')

        case 'cmd+up':
        case 'ctrl+up':
            return this.expandCursors('up')

        case 'cmd+down':
        case 'ctrl+down':
            return this.expandCursors('down')

        case 'shift+cmd+up':
        case 'shift+ctrl+up':
            return this.contractCursors('up')

        case 'shift+cmd+down':
        case 'shift+ctrl+down':
            return this.contractCursors('down')

        case 'pageup':
            return this.singleCursorPage('up')

        case 'pagedown':
            return this.singleCursorPage('down')

        case 'home':
            return this.singleCursorAtIndentOrStartOfLine()

        case 'end':
            return this.singleCursorAtEndOfLine()

        case 'ctrl+h':
            return this.setMainCursor(0,0)

        case 'ctrl+j':
            return this.setMainCursor(this.s.lines[this.s.lines.length - 1].length,this.s.lines.length - 1)

        case 'alt+d':
            return this.delete('next',true)

        case 'shift+ctrl+k':
        case 'entf':
            return this.delete('next')

        case 'ctrl+k':
            return this.delete('eol')

        case 'delete':
            return this.delete('back')

        case 'ctrl+delete':
            return this.delete('back',true)

        case 'cmd+delete':
            return this.delete('back',true)

        case 'shift+tab':
            return this.deindentSelectedOrCursorLines()

        case 'tab':
            return this.insert('\t')

        case 'cmd+x':
        case 'ctrl+x':
            return this.cut()

        case 'cmd+c':
        case 'ctrl+c':
            return this.copy()

        case 'cmd+v':
        case 'ctrl+v':
            return this.paste()

        case 'cmd+z':
        case 'ctrl+z':
            return this.undo()

        case 'shift+cmd+z':
        case 'cmd+y':
        case 'ctrl+y':
            return this.redo()

        case 'cmd+a':
        case 'ctrl+a':
            return this.selectAllLines()

        case 'cmd+j':
        case 'ctrl+j':
            return this.joinLines()

        case 'cmd+l':
        case 'ctrl+l':
            return this.selectMoreLines()

        case 'shift+cmd+l':
        case 'shift+ctrl+l':
            return this.selectLessLines()

        case 'cmd+e':
        case 'ctrl+e':
            return this.highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()

        case 'cmd+d':
        case 'ctrl+d':
            return this.selectWordAtCursor_highlightSelection_addNextHighlightToSelection()

        case 'cmd+g':
        case 'ctrl+g':
            return this.selectWordAtCursor_highlightSelection_selectNextHighlight()

        case 'shift+cmd+e':
        case 'shift+ctrl+e':
            return this.highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight()

        case 'shift+cmd+d':
        case 'shift+ctrl+d':
            return this.selectWordAtCursor_highlightSelection_addPrevHighlightToSelection()

        case 'shift+cmd+g':
        case 'shift+ctrl+g':
            return this.selectWordAtCursor_highlightSelection_selectPrevHighlight()

        case 'alt+y':
            return this.toggleMode('unype')

        case 'alt+r':
            return this.toggleMode('record')

        case 'alt+u':
            return this.toggleMode('uniko')

        case 'alt+;':
            return this.toggleMode('vimple')

        case 'alt+3':
            return this.toggleMode('salter')

        case 'cmd+3':
        case 'ctrl+3':
            return this.insertAsciiHeaderForSelectionOrWordAtCursor()

        case 'alt+cmd+d':
        case 'alt+ctrl+d':
            return this.selectWordAtCursor_highlightSelection_selectAllHighlights()

        case 'cmd+/':
        case 'ctrl+/':
            return this.toggleCommentAtSelectionOrCursorLines()

        case 'alt+cmd+/':
        case 'ctrl+alt+/':
            return this.toggleCommentTypeAtSelectionOrCursorLines()

        case 'esc':
            return this.clearCursorsHighlightsAndSelections()

    }

    return 'unhandled'
}
export default handleKey;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5cy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9rZXlzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBYUE7O1FBSVUsZ0JBQWUsS0FBSyxVQUFVLEtBQUUsSUFBSTs7OztZQUVuQzs7YUFFSDttQkFBeUMsS0FBQyxZQUFZOzthQUN0RDttQkFBeUMsS0FBQyxZQUFZOzthQUN0RDttQkFBeUMsS0FBQyxZQUFZOzthQUN0RDttQkFBeUMsS0FBQyxZQUFZOzthQUV0RDttQkFBeUMsS0FBQyxpQkFBaUI7O2FBQzNEO21CQUF5QyxLQUFDLGlCQUFpQjs7YUFDM0Q7bUJBQXlDLEtBQUMsWUFBWSxNQUFRLE1BQU07O2FBQ3BFO21CQUF5QyxLQUFDLFlBQVksUUFBUSxNQUFNOzthQUdwRTthQUFZO21CQUE2QixLQUFDLGFBQWEsTUFBTTs7YUFDN0Q7YUFBWTttQkFBNkIsS0FBQyxhQUFhLE1BQU07O2FBRTdEO21CQUF5QyxLQUFDLFlBQVksUUFBUSxNQUFNLEtBQUssT0FBTyxRQUFROzthQUN4RjttQkFBeUMsS0FBQyxZQUFZLFNBQVEsTUFBTSxLQUFLLE9BQU8sUUFBUTs7YUFFeEY7bUJBQXlDLEtBQUMscUJBQXFCLFNBQVEsTUFBTSxLQUFLLE9BQU8sUUFBUTs7YUFDakc7bUJBQXlDLEtBQUMscUJBQXFCLFFBQVEsTUFBTSxLQUFLLE9BQU8sUUFBUTs7YUFDakc7bUJBQXlDLEtBQUMscUJBQXFCOzthQUMvRDttQkFBeUMsS0FBQyxxQkFBcUI7O2FBQy9EO21CQUF5QyxLQUFDLHFCQUFxQjs7YUFDL0Q7bUJBQXlDLEtBQUMscUJBQXFCOzthQUMvRDttQkFBeUMsS0FBQyxxQkFBcUI7O2FBQy9EO21CQUF5QyxLQUFDLHFCQUFxQjs7YUFDL0Q7bUJBQXlDLEtBQUMscUJBQXFCOzthQUMvRDttQkFBeUMsS0FBQyxxQkFBcUI7O2FBRS9EO21CQUF5QyxLQUFDLDBCQUEwQixNQUFRLEtBQUs7O2FBQ2pGO21CQUF5QyxLQUFDLDBCQUEwQixRQUFRLEtBQUs7O2FBQ2pGO21CQUF5QyxLQUFDLDBCQUEwQixRQUFRLEtBQUs7O2FBQ2pGO21CQUF5QyxLQUFDLDBCQUEwQixTQUFRLEtBQUs7O2FBRWpGO21CQUF5QyxLQUFDLDJCQUEyQjs7YUFDckU7bUJBQXlDLEtBQUMsMkJBQTJCOzthQUNyRTttQkFBeUMsS0FBQyw2QkFBNkI7O2FBQ3ZFO21CQUF5QyxLQUFDLDZCQUE2Qjs7YUFFdkU7YUFBVzttQkFBOEIsS0FBQyxjQUFnQjs7YUFDMUQ7YUFBVzttQkFBOEIsS0FBQyxjQUFnQjs7YUFDMUQ7YUFBaUI7bUJBQXdCLEtBQUMsZ0JBQWdCOzthQUMxRDthQUFpQjttQkFBd0IsS0FBQyxnQkFBZ0I7O2FBRTFEO21CQUF5QyxLQUFDLGlCQUFpQjs7YUFDM0Q7bUJBQXlDLEtBQUMsaUJBQWlCOzthQUUzRDttQkFBeUMsS0FBQzs7YUFDMUM7bUJBQXlDLEtBQUM7O2FBRTFDO21CQUF5QyxLQUFDLGNBQWMsRUFBRTs7YUFDMUQ7bUJBQXlDLEtBQUMsY0FBYyxLQUFDLEVBQUUsTUFBTSxLQUFDLEVBQUUsTUFBTSxTQUFPLEdBQUcsT0FBTyxLQUFDLEVBQUUsTUFBTSxTQUFPOzthQUUzRzttQkFBeUMsS0FBQyxPQUFPLE9BQU87O2FBQ3hEO2FBQWU7bUJBQTBCLEtBQUMsT0FBTzs7YUFDakQ7bUJBQXlDLEtBQUMsT0FBTzs7YUFDakQ7bUJBQXlDLEtBQUMsT0FBTzs7YUFDakQ7bUJBQXlDLEtBQUMsT0FBTyxPQUFPOzthQUN4RDttQkFBeUMsS0FBQyxPQUFPLE9BQU87O2FBRXhEO21CQUF5QyxLQUFDOzthQUMxQzttQkFBeUMsS0FBQyxPQUFPOzthQUVqRDthQUFlO21CQUEwQixLQUFDOzthQUMxQzthQUFlO21CQUEwQixLQUFDOzthQUMxQzthQUFlO21CQUEwQixLQUFDOzthQUUxQzthQUFRO21CQUFpQyxLQUFDOzthQUMxQzthQUNBO2FBQVE7bUJBQWlDLEtBQUM7O2FBRTFDO2FBQWM7bUJBQTJCLEtBQUM7O2FBQzFDO2FBQWM7bUJBQTJCLEtBQUM7O2FBQzFDO2FBQWM7bUJBQTJCLEtBQUM7O2FBQzFDO2FBQWM7bUJBQTJCLEtBQUM7O2FBRTFDO2FBQVE7bUJBQWlDLEtBQUM7O2FBQzFDO2FBQVE7bUJBQWlDLEtBQUM7O2FBQzFDO2FBQVE7bUJBQWlDLEtBQUM7O2FBRTFDO2FBQWM7bUJBQTJCLEtBQUM7O2FBQzFDO2FBQWM7bUJBQTJCLEtBQUM7O2FBQzFDO2FBQWM7bUJBQTJCLEtBQUM7O2FBRTFDO21CQUF5QyxLQUFDLFdBQVc7O2FBQ3JEO21CQUF5QyxLQUFDLFdBQVc7O2FBQ3JEO21CQUF5QyxLQUFDLFdBQVc7O2FBQ3JEO21CQUF5QyxLQUFDLFdBQVc7O2FBQ3JEO21CQUF5QyxLQUFDLFdBQVc7O2FBRXJEO2FBQVE7bUJBQWlDLEtBQUM7O2FBQzFDO2FBQVk7bUJBQTZCLEtBQUM7O2FBRTFDO2FBQVE7bUJBQWlDLEtBQUM7O2FBQzFDO2FBQVk7bUJBQTZCLEtBQUM7O2FBRTFDO21CQUF5QyxLQUFDOzs7O1dBRTlDOztlQUVHIn0=
//# sourceURL=kode/ked/edit/keys.kode
