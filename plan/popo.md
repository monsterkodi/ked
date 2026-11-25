# Sheets as independent editor states

## Context

popo was built around the solo main cursor, which moves freely across the sheet. On the
way it lost the normal editor's multi-cursor features: multiple selections, insert at
every cursor, alt+cmd+d, and cmd+up/down by spans. The current text editing in
`kode/ked/edit/act/sheet.kode` re-implements editor operations against the rectree
(option A). That path leads to a second editor just for sheets.

The goal is that every text node is a full editor `state`, whose lines are its spans,
and popo orchestrates those states. The normal editor's features then work inside sheet
text unchanged.

`state` already supports soft wrapping.

## Roles

- **Page state.** The existing `editor.state`, and the only thing that is drawn.
  - In sheet mode its `s.lines`, `s.cursors`, `s.selections`, `s.highlights` and `s.sue`
    are **composited** output.
  - The old editing functions never change them directly.
  - It keeps doing everything that is visual: view, scrolling, mapview, gutter, cell
    rect, drawing.
- **Node states.** One full `state` per text node, created eagerly when a sheet is
  loaded or a text node appears.
  - Its lines are the node's text wrapped into its spans, with the span capacities as
    wrap widths.
  - It owns its own cursors, selections, highlights and main cursor.
  - Scale doesn't exist inside a node state. It only affects compositing.
- **Projector.** A new `kode/ked/popo/projector.kode`, owned by the page state while a
  sheet is loaded. It holds:
  - the rectree and its layout
  - the node ↔ state attachment (runtime property on the node, like `rect`; never saved)
  - the **active** node state (the one that holds the main cursor)
  - key routing and multiplexing, compositing, position mapping, and undo
- **Sheet-level operations stay at sheet level** (A): create a text node by typing in a
  non-text home, move, resize, scale, delete, shift, paste nodes.

## Cursor model

- **Solo mode** (the main cursor is the only cursor anywhere):
  - Motions are page-level and visual, as now (`sheetPosInDirection`, `sheetSnapCell`).
  - After each motion the projector finds the cursor's home, the topmost node at its
    cell. If that's a text node, the cursor is mirrored into that node state as its
    single cursor, and the state becomes active.
  - A non-text home has no node state, so editing keys there take the A path (create a
    text node).
- **Multi mode** (more than one cursor):
  - Entered from the active node state through ordinary operations: cmd+up/down,
    alt+cmd+d, shift+alt+cmd+up/down, or a click that adds a cursor.
  - Cursors only exist inside node states, and every motion runs inside each state's own
    lines. The node edges are natural barriers, and up/down moves by span because spans
    are lines.
- **Back to solo:** when only the main cursor is left (for example after esc /
  `clearCursors`), the other states drop their cursors and page-level motion takes over
  again.

## Key flow (sheet mode)

`editor.onKey` → the existing sheet-level keys (node move, resize, scale, delete) are
unchanged → otherwise `orchestra.feedKey key event` does:

1. Classify the key. The policy table lives in the projector, not in `keys.kode`:
   - **solo motion**: page-level move, then home mirroring
   - **local** (default): run in every node state that has cursors, using
     `state.feedKey`, i.e. the unchanged `keys.kode` and modes
   - **broadcast**: the highlight-all family (alt+cmd+d, cmd+e, cmd+g …). Run in the
     active state first to get the word or text, then `highlightText` +
     `selectAllHighlights` in every text state.
2. For each state whose `s.lines` changed, write its text (lines joined at hard ends)
   into `node.text`. A text edit doesn't move rects, so there's **no regionize** here;
   only that node is composited again.
3. Composite, and record one undo step if anything changed.

`insert`, `paste`, `delete`, `cut`, `copy` and `cmd+a` need no sheet-specific code: they
are local operations in the node states.

## Compositing and mapping

Spans are `fill.bands(node regions rect)` (`kode/ked/popo/fill.kode:58`), giving
`[y x1 x2]` in flow order. A span's capacity is floor((x2-x1)/scale).

**Painting.** In `layout.paintNode` / `paintScaled`, text nodes take their glyphs from
their state's lines: line i → span i, glyph c → cell `x1 + c*scale`. This replaces
`fill.flow` / `fill.text` / `fill.scaled` for text. Lines past the last span (overflow)
aren't painted.

**Forward map, node → page.** (state, line i, col c) → cell `[x1 + c*scale, y+scale-1]`
→ page pos via `sheetPosForCell`. It is used to composite cursors, selections and
highlights into the page `s`, per span segment.

**Reverse map, page → node.** Cell → (topmost text node, span i, col c). It is used for
clicks, drag selection and mirroring the solo cursor home. Selection drags inside one node
go to that node state.

This replaces `layout.textSlots`, `textOffsetAt`, `cellForTextOffset`, `textNodeAt` and
the text part of `insertTextAt`.

## Layout changes

- **Rect changes** (resize, scale, move, terminal resize, shift in tree):
  `layout.regionize`, recompute spans, and give each node state its new wrap widths.
  The state rewraps and keeps its cursors.
- **New text node** (typing in a non-text home, paste node): create and attach its state.
- **Deleted text node:** detach its state.
- **Scale change:** node widths change, and so does the cell mapping. The node state
  itself doesn't change.

## Undo

The projector keeps a single history of **global snapshots**:
`{tree: plain rectree structure, states: [node state s, in tree order]}`. These are
cheap, because each `state.s` is immutable and only referenced.

- **Undo / redo** restores the rectree structure, then re-attaches the states in tree
  order and sets each one's `s` back. No node ids are needed: tree order within a
  snapshot is enough.
- **Created and deleted nodes** fall out of this: a deleted node's state lives on in
  older snapshots.
- **Node states' own `h` / `r` histories** are bypassed in sheet mode. `cmd+z` is a
  global key handled by the projector.

## What gets removed or kept

- **Removed** (replaced by node states): `sheetSelection`, `sheetRangesForText`,
  `sheetMoveAndSelect`, `sheetDelete`, `sheetCutText`, `sheetSelectAll`,
  `sheetSelectedText`, the text branch of `insertIntoSheet`, the sheet branches in
  `state.cut` / `copy` / `selectAllLines` / `moveCursorsAndSelect` / `delete`, and
  `layout.textSlots` and friends. Also their tests in `kode/ked/test/popo.kode`
  (`sheet editing`, `sheet selection`, parts of `sheet cursor`), rewritten against the
  new model.
- **Kept:** `moveNode`, `resizeNode` (+ `stepWidth`), `scaleSheetNode`,
  `deleteSheetNode`, `shiftNode`, `sheetPosInDirection` / `sheetSnapCell` (solo motion),
  `sueify`'s grid and block painting, and sheetree.

## Consumers to adapt

- `kode/ked/ked.kode:520` load path (`setSheetTree`) → `orchestra.load`.
- `ked.kode:646` save → `layout.sourceOf` reads texts from the node states.
- Editor mouse handling (`state.kode:388` and click/drag in `editor` / `fileeditor`) →
  reverse map.
- `view/colmns/sheetree.kode` (`highlightCursorNode`), `colorpicker.kode`
  (`sheetNodeAtCursor`) → the active node, or the solo home.
- `util/dumpstate.kode`: add a line with the active node state's cursors in its own
  coordinates (`node 0.1.0 · 3 cursors · 0:2 1:2 2:2`), so the headless dumps stay
  readable.
- **Modes:** the node states get the page state's allowed and active modes mirrored,
  so unype and brckts behave the same inside nodes.

## Phases

1. **Projector, node states, compositing; rendering only.** Load the sheet, create
   the states, paint text from them, and map the cursor. Editing still goes through A.
   - **Gate:** all existing popo tests pass with the new paint path, and headless output
     of `test2.sheet` is identical.
2. **Solo editing through the home state, and global undo.**
   - Text keys in solo mode go to the home state.
   - Remove the A text twins and rewrite their tests.
3. **Multi mode.** Cursor spawning, local multiplexing, the broadcast highlights, and
   composited multi cursors and selections. This covers all four of your examples:
   - alt+cmd+d then typing
   - several shift-selections in one node
   - cmd+down multicursors behaving like the main cursor
   - cmd+down in scaled text landing as a large cursor in the next span
4. **Layout changes.** Resize, scale and move rewrap the states, create and delete
   attach and detach them, and undo works across them.
5. **Consumers:** sheetree, colorpicker, dumpstate, mouse drag, save.

## Verification

- `./kk -t` after every phase, using `./kk -t ked popo plain` while iterating.
- New popo tests per phase, including all four examples above as tests.
- Headless runs on `kode/ked/test/level2/test2.sheet` (`bin/ked -H`, keys piped in):
  - cursor heights (`h6`) and multi-cursor boxes in the `images` line
  - reflowed text on screen
  - the `node` line following the active node

## Open questions

1. **Undo:** how is sheet data stored in the immutable?
2. **novim in sheet mode:** what would break|needs changes?
3. **Cursors in overflow lines or hidden text** (covered by other nodes) aren't visible.
   Show a marker, or accept it for now?
4. **node masking | flow mechanism** should we re-implement it after the refactor?
