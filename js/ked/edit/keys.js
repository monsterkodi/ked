var handleKey

import config from "../util/config.js"

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
        case 'shift+ctrl+up':
            return this.moveSelectionOrCursorLines('up')

        case 'alt+down':
        case 'shift+ctrl+down':
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
            return this.contractCursors('up')

        case 'shift+cmd+down':
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
            if (!mode.isActive(this,'novim'))
            {
                return this.paste()
            }
            break
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

        case 'alt+n':
        case 'alt+z':
            return this.toggleMode('novim')

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

        case 'ctrl+return':
            return this.jumpToWordAtCursor()

        case 'esc':
            this.finishNovimInsert()
            if (this.hasCursorsHighlightsOrSelections())
            {
                return this.clearCursorsHighlightsAndSelections()
            }
            else
            {
                if (config.data.novim.autoEnableOnEscape)
                {
                    this.toggleMode('novim')
                }
            }
            break
    }

    return 'unhandled'
}
export default handleKey;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5cy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9rZXlzLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2MsYUFBUDs7T0FDRCxXQUFBOzs7QUFNTixzQkFBWSxLQUFJOztRQUlQLGdCQUFlLEtBQUssVUFBVSxLQUFFLElBQUk7Ozs7WUFFbEM7O2FBRUg7bUJBQXdDLEtBQUMsWUFBWTs7YUFDckQ7bUJBQXdDLEtBQUMsWUFBWTs7YUFDckQ7bUJBQXdDLEtBQUMsWUFBWTs7YUFDckQ7bUJBQXdDLEtBQUMsWUFBWTs7YUFFckQ7bUJBQXdDLEtBQUMsaUJBQWlCOzthQUMxRDttQkFBd0MsS0FBQyxpQkFBaUI7O2FBQzFEO21CQUF3QyxLQUFDLFlBQVksTUFBUSxNQUFNOzthQUNuRTttQkFBd0MsS0FBQyxZQUFZLFFBQVEsTUFBTTs7YUFFbkU7YUFBZ0I7bUJBQXdCLEtBQUMsYUFBYSxNQUFNOzthQUM1RDthQUFnQjttQkFBd0IsS0FBQyxhQUFhLE1BQU07O2FBRTVEO21CQUF3QyxLQUFDLFlBQVksUUFBUSxNQUFNLEtBQUssT0FBTyxRQUFROzthQUN2RjttQkFBd0MsS0FBQyxZQUFZLFNBQVEsTUFBTSxLQUFLLE9BQU8sUUFBUTs7YUFFdkY7bUJBQXdDLEtBQUMscUJBQXFCLFNBQVEsTUFBTSxLQUFLLE9BQU8sUUFBUTs7YUFDaEc7bUJBQXdDLEtBQUMscUJBQXFCLFFBQVEsTUFBTSxLQUFLLE9BQU8sUUFBUTs7YUFDaEc7bUJBQXdDLEtBQUMscUJBQXFCOzthQUM5RDttQkFBd0MsS0FBQyxxQkFBcUI7O2FBQzlEO21CQUF3QyxLQUFDLHFCQUFxQjs7YUFDOUQ7bUJBQXdDLEtBQUMscUJBQXFCOzthQUM5RDttQkFBd0MsS0FBQyxxQkFBcUI7O2FBQzlEO21CQUF3QyxLQUFDLHFCQUFxQjs7YUFDOUQ7bUJBQXdDLEtBQUMscUJBQXFCOzthQUM5RDttQkFBd0MsS0FBQyxxQkFBcUI7O2FBRTlEO21CQUF3QyxLQUFDLDBCQUEwQixNQUFRLEtBQUs7O2FBQ2hGO21CQUF3QyxLQUFDLDBCQUEwQixRQUFRLEtBQUs7O2FBQ2hGO21CQUF3QyxLQUFDLDBCQUEwQixRQUFRLEtBQUs7O2FBQ2hGO21CQUF3QyxLQUFDLDBCQUEwQixTQUFRLEtBQUs7O2FBRWhGO2FBQWdCO21CQUF3QixLQUFDLDJCQUE2Qjs7YUFDdEU7YUFBZ0I7bUJBQXdCLEtBQUMsMkJBQTZCOzthQUN0RTttQkFBd0MsS0FBQyw2QkFBNkI7O2FBQ3RFO21CQUF3QyxLQUFDLDZCQUE2Qjs7YUFFdEU7YUFBZ0I7bUJBQXdCLEtBQUMsY0FBZ0I7O2FBQ3pEO2FBQWdCO21CQUF3QixLQUFDLGNBQWdCOzthQUN6RDttQkFBd0MsS0FBQyxnQkFBZ0I7O2FBQ3pEO21CQUF3QyxLQUFDLGdCQUFnQjs7YUFFekQ7bUJBQXdDLEtBQUMsaUJBQWlCOzthQUMxRDttQkFBd0MsS0FBQyxpQkFBaUI7O2FBRTFEO21CQUF3QyxLQUFDOzthQUN6QzttQkFBd0MsS0FBQzs7YUFFekM7bUJBQXdDLEtBQUMsY0FBYyxFQUFFOzthQUN6RDttQkFBd0MsS0FBQyxjQUFjLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxNQUFNLFNBQU8sR0FBRyxPQUFPLEtBQUMsRUFBRSxNQUFNLFNBQU87O2FBRTFHO21CQUF3QyxLQUFDLE9BQU8sT0FBTzs7YUFDdkQ7YUFBZ0I7bUJBQXdCLEtBQUMsT0FBTzs7YUFDaEQ7bUJBQXdDLEtBQUMsT0FBTzs7YUFDaEQ7bUJBQXdDLEtBQUMsT0FBTzs7YUFDaEQ7bUJBQXdDLEtBQUMsT0FBTyxPQUFPOzthQUN2RDttQkFBd0MsS0FBQyxPQUFPLE9BQU87O2FBRXZEO21CQUF3QyxLQUFDOzthQUN6QzttQkFBd0MsS0FBQyxPQUFPOzthQUVoRDthQUFnQjttQkFBd0IsS0FBQzs7YUFDekM7YUFBZ0I7bUJBQXdCLEtBQUM7O2FBQ3pDO2FBQWdCO2lCQUF3QyxLQUFLLFNBQVMsS0FBRTs7dUJBQWhDLEtBQUM7OzthQUV6QzthQUFnQjttQkFBd0IsS0FBQzs7YUFDekM7YUFDQTthQUFnQjttQkFBd0IsS0FBQzs7YUFFekM7YUFBZ0I7bUJBQXdCLEtBQUM7O2FBQ3pDO21CQUF3QyxLQUFDOzthQUN6QzthQUFnQjttQkFBd0IsS0FBQzs7YUFDekM7YUFBZ0I7bUJBQXdCLEtBQUM7O2FBRXpDO2FBQWdCO21CQUF3QixLQUFDOzthQUN6QzthQUFnQjttQkFBd0IsS0FBQzs7YUFDekM7YUFBZ0I7bUJBQXdCLEtBQUM7O2FBRXpDO2FBQWdCO21CQUF3QixLQUFDOzthQUN6QzthQUFnQjttQkFBd0IsS0FBQzs7YUFDekM7YUFBZ0I7bUJBQXdCLEtBQUM7O2FBRXpDO21CQUF3QyxLQUFDLFdBQVc7O2FBQ3BEO2FBQWdCO21CQUF3QixLQUFDLFdBQVc7O2FBQ3BEO21CQUF3QyxLQUFDLFdBQVc7O2FBRXBEO2FBQWdCO21CQUF3QixLQUFDOzthQUN6QzthQUFnQjttQkFBd0IsS0FBQzs7YUFFekM7YUFBZ0I7bUJBQXdCLEtBQUM7O2FBQ3pDO2FBQWdCO21CQUF3QixLQUFDOzthQUV6QzttQkFBd0MsS0FBQzs7YUFFekM7WUFDSSxLQUFDO2dCQUNFLEtBQUM7O3VCQUNFLEtBQUM7Ozs7b0JBRUEsT0FBTyxLQUFLLE1BQU07O29CQUNqQixLQUFDLFdBQVc7Ozs7OztXQUU1Qjs7ZUFFRyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/keys.kode
