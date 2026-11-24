how to get ked to handle word/line-wrapping.
  
  a rough sketch:
  
  wrapping is a per-line-toggle: all lines are unwrapped by default. some (or all of them) might carry a 'wrap' flag.
  wrap flags are sues and are saved with the file like any other sue.
  wrap flag for a single line can be toggled via ctrl+w. for all lines with alt+w
  wrapping should have two variants: character and word. this is a state-wide toggle, not per individual line. it can be toggled via ctrl+alt+w
  wrapping is done 'outside' the existing state logic. meaning: the existing logic doesn't need to change or know about the wrapping.
  it will operate on the unwrapped logical lines.
  
  wrapped lines will be handled by susan/sue: 
  wrap flag is stored in a sue similar to LINE_SCALE
  state.lineHeight will report a line height that leaves enough space for the 'final' render to include the full content of the logical line.
  
  the aim is to add this feature with minimal disturbance of the existing editor logic.
  
  the ongoing implementation of popo triggered it and will benefit from this feature in the future, but it will not influence its design:
  breaking popo and its tests is fine since it will be refactored on top of the wrapping feature (tests that break will just be deactivated by commenting them out)

## decisions

storage
- wrap flag: a sue at x 0 of its line, like LINE_SCALE. not filtered on save.
- toggling wrap is an undo step.
- alt+w is a global toggle that overrides the per-line flags while it is set.
- ctrl+alt+w switches between character and word wrap for the whole state.
- both globals live on the state as @wrap = {all:false word:false}, outside the immutable s.
  not undoable. they reset on reload for now.

ctrl+w
- toggles every line that has a cursor or selection.
- the main cursor's line decides the new state: all of those lines are set to the opposite of its flag.
- does nothing while wrap.all is set.

edits
- enter: the new line after a wrapped line is unwrapped.
- join: the base line keeps its wrap flag. the flag of the line joined in is dropped.
- copy/paste: pasted lines are never wrapped. wrap sues are stripped before copy
  and/or at paste, by the same function that drops them on join.

width and height
- wrap width = editor cells width minus the gutter. no configurable cap.
- the row cache is dropped on resize and when wrapped lines change.
- scaled lines: a line at scale s wraps at cols/s. height = s × visual rows.
- partial scale runs (SCALE areas) inside wrapped lines may be skipped, whatever is simplest.

word vs character
- word mode breaks after whitespace and falls back to a character break for words wider than the line.
- no hanging indent. no break glyph or gutter glyph.
- a width-2 grapheme that doesn't fit at the edge moves to the next row, and the last cell stays empty.

view
- wrapped lines ignore view[0]. their rows always start at column 0.
- gutter: line number on the first row, spaces on continuation rows, the same as for scaled lines.
- minimap is left alone. it may show only the first chunk of a wrapped line.

cursor
- up/down move by logical lines, so the cursor may jump over continuation rows. home/end stay logical.
- the logical↔visual mapping is the main goal of the first step. it lives in state.kode,
  next to lineHeight/rowPrefix, and is used by cursor, selection, highlight and yank drawing and by posForCell.

## steps

1. state: @wrap, wrap sue, wrapRows li (row start indices), lineHeight uses the row count,
   logical↔visual lookups, posForCell. headless tests for toggling, drawing, cursor cell
   and posForCell. wrap state in the headless dump.
2. selection, highlight and yank drawing on wrapped rows.
3. edit rules: enter, join, copy/paste stripping.

scope
- active in every editor instance. only the fileeditor binds the shortcuts.
- the headless state dump shows wrap state.
  