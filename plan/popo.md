# Sheets as independent editor states

## Context

popo was built around the solo main cursor, which moves freely across the sheet. On the
way it lost the normal editor's multi-cursor features: multiple selections, insert at
every cursor, alt+cmd+d, and cmd+up/down by spans. The current text editing in
`kode/ked/edit/act/sheet.kode` re-implements editor operations against the rectree
(option A). That path leads to a second editor just for sheets.

The goal is that every text node is a full editor `state`, and popo orchestrates those
states. The normal editor's features then work inside sheet text unchanged.

`state` now has soft wrapping (`kode/ked/edit/act/sue.kode` `##wrap`): logical lines
stay untouched, `wrapStarts li` gives the grapheme index where each visual row starts,
and `lineCell` / `posForCell` / `wrapMaxX` / `clampToWrap` map between the two. popo
is built on top of that instead of hard-wrapping text into lines itself.

## Roles

- **Page state.** The existing `editor.state`, and the only thing that is drawn.
  - In sheet mode its `s.lines`, `s.cursors`, `s.selections`, `s.highlights` and `s.sue`
    are **composited** output.
  - The old editing functions never change them directly.
  - It keeps doing everything that is visual: view, scrolling, mapview, gutter, cell
    rect, drawing.
  - It is never wrapped. Its lines are grid rows. `toggleWrap` and the scale actions
    already return early while `@rectree?` is set.
- **Node states.** One full `state` per text node, created eagerly when a sheet is
  loaded or a text node appears.
  - Its lines are the node's **logical lines**. `s.lines` is the only copy of the text
    (see *Undo*).
  - **`node.text` is the syntax language** of the node, not the content. The key makes
    the node a text node with a state, and the value is the language its state is
    highlighted with: `text:'md'` (the default for new and converted nodes),
    `text:'kode'`, and so on. It sets the node state's `syntax.ext`, so everything
    that depends on the language (highlighting, comment toggling, wrap indent markers)
    works per node. An unknown language falls back to plain text.
  - **Syntax colors are composited** like the glyphs: the page draws the composited
    lines, so a page cell asks the node that painted it for its class and color
    (reverse map → `node.state.syntax`). The node's `fg` / `bg` win over syntax colors,
    as sue colors do now.
  - **No syntax line scaling in nodes for now:** `md` and `kode` scale headings
    (`scaledExts`, `scales h1:3 h2:2`), but node states set `@scaling = false`. Scaled
    rows inside a node can come later.
  - On disk the content is a `lines` list of strings:
    `{text:'md' lines:['HELLO world!' …] x:… }`. Load creates the state from it,
    save writes `s.lines` back. The sheets in `test/level2` are converted once, with no
    code for the old format.
  - An empty text node (`lines: ['']`) is kept. It is removed like any node.
  - Every line is wrapped (`@wrap.all = true`). The rows of the wrapped lines are the
    node's spans, in flow order (see *Wrapping into spans*).
  - It owns its own cursors, selections, highlights and main cursor.
  - Scale doesn't exist inside a node state. Span capacities are already divided by the
    scale; scale only affects compositing.
  - It is never drawn itself, but it **scrolls** like the normal editor: its view
    decides which rows go into the spans (see *Node view*).
- **Projector.** A new `kode/ked/popo/projector.kode`, owned by the page state while a
  sheet is loaded. It holds:
  - the rectree and its layout
  - the node → state attachment (`node.state`, a runtime property like `rect`)
  - the **active** node state (the one that holds the main cursor)
  - key routing and multiplexing, compositing, position mapping, and undo
- **Sheet-level operations stay at sheet level** (A): create a text node by typing in a
  non-text home, move, resize, scale, delete, shift, paste nodes.

## Wrapping into spans

Spans are `fill.bands(node regions rect)` (`kode/ked/popo/fill.kode:58`), giving
`[y x1 x2]` in flow order. A span's capacity is `floor((x2-x1)/scale)`.

Today a wrapped line has one width for all rows: `wrapCols li` for the first row,
`wrapCols - wrapIndent` for the rest (`sue.wrapStarts line cols word indent`). In a
node the widths vary per row, and the rows of one line continue where the previous
line's rows ended:

- **Seam in `sue.wrapStarts`:** take a width function `width(k)` (or an array) instead
  of `cols` + `indent`. The editor passes `k == 0 ? cols : cols-indent`, so nothing
  changes there.
- **Seam in the state:** a single `@rowWidths` hook (null in the editor). When set, it
  gives the capacities of all spans of the node. `wrapStarts`, `wrapCols`, `lineCell`,
  `wrapMaxX` and `posForCell` ask it for the width of row k of line li.
- **Flow layout:** the node state computes the starts of all lines in one pass, line
  after line, and remembers the first span index of each line. It is cached on
  `(s.lines identity, capacities key, wrap.word)`. The per-line WeakMap cache doesn't
  fit, because a line's rows depend on the rows of the lines above it.
- An empty line takes one span, as `fill.flow` does for `\n` now.
- Continuation rows are indented as in the editor (`wrapIndent`). The indent is capped
  at half of each row's own capacity and subtracted from it. The forward and reverse
  maps include it, like `lineCell` and `posForCell` do.
- The node's language decides the markers: list bullets, headings, quotes and comment
  starters indent like in the editor. No test text starts with whitespace or a marker
  the indent follows, so the phase 2 gate is unaffected (to be checked).

Because wrapping lives outside the logical lines, a **rect change only invalidates the
cache**. Cursors, selections and highlights are logical and stay where they are; no
rewrap bookkeeping is needed.

## Node view

A node holds as many rows as it has spans. Rows that don't fit are scrolled out of
sight, as in the normal editor, instead of being cut off at the bottom.

- The node state's `s.view[1]` (first visible line) and `s.scrollOffset` (rows of that
  line above the top) choose what fills span 0. The flow layout starts there. Lines
  above the view aren't laid out.
- Hidden rows of the first visible line (`scrollOffset > 0`) take the width of span 0.
- After every key the projector keeps the **main cursor's row** inside the spans, with
  the same rules as `adjustViewForMainCursor` (margins may be 0 in small nodes).
- With different span widths, scrolling reflows the visible text, because rows move
  to other spans. In rectangular nodes all spans are equally wide, and nothing reflows.
- The view is part of `s`, so undo restores it. It is not saved.
- **Later:** keeping the other cursors in view too, as far as they fit.

## Cursor model

- **Solo mode** (the main cursor is the only cursor anywhere):
  - Motions are page-level and visual, as now (`sheetPosInDirection`, `sheetSnapCell`).
  - After each motion the projector finds the cursor's home, the topmost node at its
    cell. If that's a text node, the cursor is mirrored into that node state as its
    single cursor (reverse map), and the state becomes active.
  - A non-text home has no node state, so editing keys there take the A path (create a
    text node).
- **Multi mode** (more than one cursor):
  - Entered from the active node state through ordinary operations: cmd+up/down,
    alt+cmd+d, shift+alt+cmd+up/down, or a click that adds a cursor.
  - Cursors only exist inside node states, and every motion runs inside each state's own
    lines. The node edges are natural barriers.
  - **up/down** move by visual rows, so inside a node they move by spans (see *Visual
    row motion*).

## Visual row motion

Up/down in wrapped lines move by visual rows, **in the normal editor too**: to the next
or previous row of the same line, or to the last row of the line above / the first row
of the line below. Unwrapped lines keep moving as now.

- **Where:** the `'up' 'down'` branch of `moveCursors` (`multi.kode:99`),
  `expandCursors` (cmd+up/down, `multi.kode:19`), and the shift+up/down selection
  extension (`belt.extendLineRangesByMovingPositionsInDirection`, `multi.kode:193`).
- **How:** `lineCell` gives the cursor's row and column, and the wrapped branch of
  `posForCell` finds the grapheme at that column in the target row, both through the
  `@rowWidths` seam. `scaleAdjustedColumn` still converts the column between scales.
- **Goal column:** the editor has none; a cursor past the end of a line keeps its x,
  and that makes the column stick. Wrapped lines clamp cursors (`clampToWrap`), so
  vertical moves keep a goal column per cursor outside `s`, like `@anchors`. Any
  move that isn't vertical drops it.
- **Column in a node:** counted in cells from the span start. Where a blocker indents
  a span, the cursor keeps its column in the text, not its page x. Solo mode moves on
  the page and is unaffected.
- **Tests:** the up/down expectations in `test/wrap.kode` change; new tests for row
  moves, cmd+down cursors and shift+down selections in wrapped lines.
- **Back to solo:** when only the main cursor is left (for example after esc /
  `clearCursors`), the other states drop their cursors and page-level motion takes over
  again.

## Key flow (sheet mode)

`editor.onKey` → the existing sheet-level keys (`editor.kode:233` delete/scale node,
`:254` move/resize node) are unchanged → otherwise `projector.feedKey key event` does:

1. Classify the key. The policy table lives in the projector, not in `keys.kode`:
   - **solo motion**: page-level move, then home mirroring
   - **local** (default): run in every node state that has cursors, using
     `state.feedKey`, i.e. the unchanged `keys.kode` and modes
   - **broadcast**: the highlight-all family (alt+cmd+d, cmd+e, cmd+g …). Run in the
     active state first to get the word or text, then `highlightText` +
     `selectAllHighlights` in every text state.
   - **blocked**: the wrap toggles (ctrl+w, alt+w, ctrl+alt+w) and the susan line
     scale keys. They are bound in `editor.kode` under `feats['susan']`, so they must be
     caught before they reach a node state.
2. For each state whose `s` changed, composite that node again. A text edit doesn't
   move rects, so there's **no regionize** here.
3. Record one undo step if anything changed.

`insert`, `paste`, `delete`, `cut`, `copy` and `cmd+a` need no sheet-specific code: they
are local operations in the node states.

## Compositing and mapping

Both maps go through the node state's flow layout: row k of line li is span
`first[li] + k`.

**Painting.** In `layout.paintNode` / `paintScaled`, text nodes take their glyphs from
their state: the graphemes `starts[k]...starts[k+1]` of line li go into span
`first[li]+k`, grapheme cell c → page cell `x1 + c*scale`. This replaces `fill.flow` /
`fill.text` / `fill.scaled` for text. Rows outside the node view aren't painted.
The erase masks stay: `gone.char` for unscaled text, `charMaskedIn` for scaled blocks.
Blockers keep shaping the regions, and with them the spans and row widths.

**Hidden cursors.** A cursor in a row outside the node view has no cell and is left out
of the page composite; it still edits. The main cursor is always in view (see *Node
view*). A cursor whose cell is covered by a later node, or erased, still maps to that
cell and is drawn on top.

**Forward map, node → page.** (state, line li, grapheme x) → row k = `wrapRow x li`,
column = `cells[x] - cells[starts[k]]` → cell `[x1 + col*scale, y+scale-1]` → page pos
via `sheetPosForCell`. It is used to composite cursors, selections and highlights into
the page `s`, per span segment. Like `lineCell` it clamps to the last cell of a full
row.

**Reverse map, page → node.** Cell → (topmost text node, span → line li and row k,
column → grapheme). The same lookup as the wrapped branch of `state.posForCell`. It is
used for clicks, drag selection and mirroring the solo cursor home. Selection drags
inside one node go to that node state.

This replaces `layout.textSlots`, `textOffsetAt`, `cellForTextOffset`, `textNodeAt` and
the text part of `insertTextAt`.

## Layout changes

- **Rect changes** (resize, scale, move, terminal resize, shift in tree):
  `layout.regionize`, recompute spans, and hand the new capacities to the node state.
  Its flow layout cache is invalidated; cursors stay logical.
- **New text node** (typing in a non-text home, paste node): create and attach its state.
- **Deleted text node:** detach its state.
- **Scale change:** capacities and the cell mapping change. The node state's lines don't.

## Undo

Today the page `s` carries `rectree` as a plain node copy, `renderSheet` pushes one
state per sheet change, and `undo` / `redo` call `restoreSheet`, which re-renders from
`s.rectree`.

This stays: the page's `h` / `r` is the only history, and every entry is a **snapshot of
the whole sheet**. The node states go into the plain tree, one per text node:

```
page s
    lines cursors selections highlights sue …   # composited output, what is drawn
    rectree:
        children: [
            bg: '#333'
            children: [
                {text:'md' x:1 y:0 w:6 h:1 s:sA}       # sA.lines = [['h','e','l','l','o']]
                {text:'md' x:1 y:2 w:4 h:2 s:sB}       # sB.lines = [['a'] ['b']]
            ]
        ]
```

- **Snapshots are cheap.** Each `sA` is immutable and only referenced, and unchanged
  nodes share their `s` between snapshots.
- **Live tree vs snapshot.** The live node holds the state object (`node.state`).
  `plainNode` writes `s: node.state.s`. `sourceOf` writes `lines` (as strings) instead,
  and drops `s`.
- **Edit:** the node state changes its `s`, the node is composited again, the page `s`
  gets the new plain tree and output, and `pushState`.
- **Undo / redo:** the page's `undo` / `redo` are unchanged, then `restoreSheet`:
  1. Rebuilds the live tree from `s.rectree`. It walks the tree itself instead of
     `asMutable deep:true`, which would make mutable copies of the `s` objects.
  2. Gives every text node a state object and sets `state.s = plain.s`. State objects
     are only containers; all undoable data is in `s`.
  3. Always regionizes, hands the capacities to the states, and composites again: the
     cells may have been resized since the snapshot was taken.
  4. Sets the active node from the page's main cursor.
- **Created and deleted nodes** fall out of this: a deleted node's `s` lives on in older
  snapshots.
- **Node states' own `h` / `r` histories** are ignored in sheet mode. `cmd+z` reaches
  the page state.
- **`node.text` is the language:** `flows`, `scaleOf` and `typeOf` / `roleOf` /
  `argOf` test the key or a valid value, so they keep working. The sheenode arg field
  shows and sets the language, like the color of a `bg` node; changing it sets the
  node state's `syntax.ext`. Switching the type away from `text` drops the state. Text is only edited in the sheet, so the sheenode doesn't touch node
  states. `isNodeData` accepts `lines`. `insertTextAt`, `fill` and paint are rewritten
  anyway.

## What gets removed or kept

- **Removed** (replaced by node states):
  - `act/sheet.kode`: `sheetSelection`, `sheetRangesForText`, `sheetMoveAndSelect`,
    `sheetDelete`, `sheetCutText`, `sheetSelectAll`, `sheetSelectedText`,
    `sheetTextNodeAt`, and the text branch of `insertIntoSheet`.
  - their hooks: `del.kode:10`, `insert.kode:10`, `select.kode:296`,
    `multi.kode:188` (move and select), and the `@rectree?` branches of `state.cut` /
    `state.copy` (`state.kode:507`, `:523`).
  - `layout.textSlots`, `textOffsetAt`, `cellForTextOffset`, `textNodeAt`.
  - their tests in `kode/ked/test/popo.kode`: `sheet editing`, `sheet selection`, parts
    of `sheet cursor` and `sheet text undo`, rewritten against the new model.
- **Kept:** `moveNode`, `resizeNode` (+ `stepWidth`), `scaleSheetNode`,
  `deleteSheetNode`, `shiftNode`, `sheetPosInDirection` / `sheetSnapCell` (solo motion,
  `multi.kode:94` and `:99`), `sueify`'s grid and block painting, and sheetree.

## Consumers to adapt

- `kode/ked/ked.kode:520` load path (`setSheetTree`) → `projector.load`.
- `ked.kode:645` save → `layout.sourceOf` reads texts from the node states.
- Editor mouse handling (`state.posForCell`, `state.kode:409`, and click/drag in
  `editor` / `fileeditor`) → reverse map.
- `view/colmns/sheetree.kode` (`highlightCursorNode`, `:108`), `colorpicker.kode`
  (`sheetNodeAtCursor`, `:333`) → the active node, or the solo home.
- `util/dumpstate.kode:61`: add a line with the active node state's cursors in its own
  coordinates (`node 0.1.0 · 3 cursors · 0:2 1:2 2:2`), so the headless dumps stay
  readable.
- **Modes:** the node states get the page state's allowed and active modes mirrored,
  so unype and brckts behave the same inside nodes. novim included: it stays active in
  sheets (see phase 7).

## Phases

1. ✔ **Wrap seam and visual row motion.** `sue.wrapStarts` with a width function,
   `@rowWidths` in the state, flow layout across lines, then up/down by visual rows.
   Tested on plain states, without sheets.
   - **Gate:** wrap and mapscr tests unchanged after the seam; after the motion only
     the up/down expectations in `test/wrap.kode` change.
2. ✔ **Projector, node states, compositing; rendering only.** `popo/projector.kode`
   attaches a state to every text node (in `sueify`), gives it the span widths, and
   paints text from it (`glyphs`). `cellOf` / `posAt` are the forward and reverse map.
   Editing still goes through A.
   - The **old format stays** in this phase: A edits `node.text` as content, so the
     states are built from it (`node.text.split '\n'`) and reload whenever it
     changes (`node.stateText`). The language and `lines` format comes in phase 3.
   - The node states use **char wrap** and no node view yet: A's `textSlots` still
     lay text out with `fill.flow`, so painting must match it until A is gone.
   - **Gate:** all existing popo tests pass with the new paint path, and the headless
     output of `test2.sheet` and `test.sheet` is identical, for cursor moves and for
     typing into a text node.
3. **Solo editing through the home state, and global undo.**
   - Text keys in solo mode go to the home state.
   - Remove the A text twins and rewrite their tests.
   - Switch the format: `node.text` is the language (`'md'`), the content is `lines`,
     the state is the only copy of the text. Convert the sheets in `test/level2`.
   - Switch the node states to word wrap, and update the expected output once.
   - The node view: nodes scroll to keep the main cursor in view.
4. **Multi mode.** Cursor spawning, local multiplexing, the broadcast highlights, and
   composited multi cursors and selections. This covers the four examples:
   - alt+cmd+d then typing
   - several shift-selections in one node
   - cmd+down multicursors behaving like the main cursor
   - cmd+down in scaled text landing as a large cursor in the next span
5. **Layout changes.** Resize, scale and move hand new capacities to the states,
   create and delete attach and detach them, and undo works across them.
6. **Consumers:** sheetree, colorpicker, dumpstate, mouse drag, save.
7. **novim in sheets.** Until then novim stays active in sheets, mirrored into the node
   states like the other modes. If the refactor breaks novim tests, we decide then
   whether to deactivate novim in sheets or disable those tests. Known gaps of novim
   per node: the register, macros, jumps and changes are split across nodes, pending
   commands (`3d…`, `f`) get lost when the home changes, `u` / `ctrl+r` hit the
   ignored node histories, and the projector's raw key classes fight novim's parser.
   The shape of the fix:
   - **One novim mode on the page state.** It parses keys into commands, and the
     projector dispatches `executeNovim cmd`. With a single cursor, motions follow the
     solo rules (page-level `hjkl`, home mirroring). Everything else goes to the node
     states that have cursors.
   - **Shared parts are owned by the page state:** register, macros, jumps (node +
     position) and changes. Node states reference them instead of creating their own
     `novimState()`.
   - **Undo:** `u` / `ctrl+r` go to the page undo. An insert session is wrapped in page
     `begin` / `end`, so it is one step.
   - **Ex commands** run on the active node's lines. Visual mode stays inside one node,
     like shift-selections.

## Verification

- `./kk -t` after every phase, using `./kk -t ked popo plain` while iterating.
- New popo tests per phase, including all four examples above as tests.
- Headless runs on `kode/ked/test/level2/test2.sheet` (`bin/ked -H`, keys piped in):
  - cursor heights (`h6`) and multi-cursor boxes in the `images` line
  - reflowed text on screen
  - the `node` line following the active node

## Open questions

1. ~~**Undo:** how is sheet data stored in the immutable?~~ Decided: in the page's
   history, with each node's `s` inside its plain tree node (see *Undo*). `node.text`
   is the syntax language (`'md'` by default), the content is `lines` on disk, empty
   text nodes are kept.
2. ~~**novim in sheet mode:** what would break|needs changes?~~ Decided: stays active,
   properly fixed in phase 7; breaking tests are decided on when they break.
3. ~~**Cursors in overflow lines or hidden text** aren't visible.~~ Decided: nodes
   scroll to keep the main cursor in view (*Node view*). Other cursors out of view
   aren't drawn, covered ones are drawn on top. No overflow marker.
4. ~~**node masking | flow mechanism** should we re-implement it after the refactor?~~
   Decided: both stay as they are (see *Compositing and mapping*).
5. ~~**up/down in wrapped lines:** the editor moves by logical lines.~~ Decided: visual
   rows for all wrapped lines, the editor included (see *Visual row motion*).
6. ~~**word or char wrap in sheets**~~ Decided: word wrap, char wrap only for the phase 2
   gate. No toggle in sheets for now.
7. ~~**continuation indent in sheets**~~ Decided: kept, as in the editor (see *Wrapping
   into spans*).
