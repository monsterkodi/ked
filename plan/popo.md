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
- **Projector.** `kode/ked/popo/projector.kode` is a set of static functions between a
  text node and its state, without state of its own:
  - the node → state attachment (`attach`, `stateOf`; `node.state` is a runtime
    property like `rect`), the language (`extOf`) and the text (`linesOf`, `textOf`)
  - the span capacities (`spans`), painting (`glyphs`), the forward and reverse map
    (`cellOf`, `posAt`, `endOf`) and the node view (`scrollToCursor`, `scrollRows`)
- **Sheet orchestration** lives on the page state, in `kode/ked/edit/act/sheet.kode`:
  the rectree, the home and active node (`sheetHome`, `sheetActive`, `@sheetMirror`),
  multi mode (`@sheetMulti`), key routing (`feedSheetKey`, `inSheetNode`), mouse
  (`sheetMouse`), mode mirroring (`syncSheetModes`), compositing (`commitSheetNodes`,
  `compositeSheet`, `renderSheet`) and undo (`restoreSheet`).
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

As built (`act/sheet.kode`):

- `editor.onKey` handles the sheet-level keys first: delete and scale node, move and
  resize node. The susan keys (line styles, line scale, the wrap toggles) are caught
  there too and never reach a node state. Every other key goes to
  `state.feedSheetKey`.
- `feedSheetKey`:
  - **page keys** (`pageKeys`: the cursor motions, cmd/ctrl+up/down, undo/redo) run on
    the page with `feedKey`. In multi mode only the history keys (`historyKeys`) stay
    on the page, and the motions run in the nodes.
  - **esc** in multi mode ends it (`leaveSheetMulti`).
  - **everything else** runs in the home state with `inSheetNode (st) -> st.feedKey`,
    i.e. the unchanged `keys.kode` and the mirrored modes (`syncSheetModes`). In multi
    mode it runs in every multi node. Without a home it falls back to the page, where
    typing creates a text node (`insertIntoSheet` → `layout.addTextNode`).
  - **broadcast**: after alt+cmd+d / alt+ctrl+d (`highlightKeys`) in the active node,
    `spreadHighlights` highlights the word in all text nodes, or selects all of them.
- `inSheetNode` then calls `commitSheetNodes`: the states whose `s` changed are
  composited again (no regionize for a text edit), and one undo step is recorded if any
  text changed.
- The page's `insert`, `delete`, `cut`, `copy`, `selectAllLines` and
  `moveCursorsAndSelect` go to the home state too, so direct calls work like keys.
- novim: see phase 7.

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
  so unype and brckts behave the same inside nodes. novim is not mirrored: the page
  runs the only novim mode and sends its commands to the nodes (see phase 7).

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
3. ✔ **Solo editing through the home state, and global undo.**
   - Text keys in solo mode go to the home state.
   - Remove the A text twins and rewrite their tests.
   - Switch the format: `node.text` is the language (`'md'`), the content is `lines`,
     the state is the only copy of the text. Convert the sheets in `test/level2`.
   - Switch the node states to word wrap, and update the expected output once.
   - The node view: nodes scroll to keep the main cursor in view.
   - **As built** (`act/sheet.kode`):
     - `editor.onKey` → `feedSheetKey`. The page keeps the cursor motions,
       cmd/ctrl+up/down and undo/redo (`pageKeys`); every other key runs in the home
       state (`inSheetNode`), and falls back to the page if there is none, where
       typing creates a text node (`layout.addTextNode`).
     - The page's `insert`, `delete`, `cut`, `copy`, `selectAllLines` and
       `moveCursorsAndSelect` go to the home state too, so direct calls work as
       keys do. Page modes still transform typed text (`mode.insert`) first.
     - `sheetHome`: the topmost text node at the cursor cell, or the text node whose
       line ends just left of it. While the page cursors are the ones the last
       node change set (`@sheetMirror`), the node keeps its own cursors and anchors.
     - `commitSheetNode`: a node sized for its single line (`w == (width+1)*scale`,
       `h == scale`) grows and shrinks with it; then regionize, scroll the node
       view, render. Only changed lines make an undo step.
     - `renderSheet` composites the node selections into the page
       (`sheetSelections`), `restoreSheet` rebuilds the tree with
       `layout.liveNode`.
     - `layout.plainNode` keeps `s` (snapshots), `layout.dataNode` writes `lines`
       (save, sheetree copy, `ownProps`).
   - **Noticed, not changed:** word wrap moves a word to the next row when only the
     space after it doesn't fit (`sue.wrapStarts`, the editor does the same). Saving
     writes the page wrapper of `layout.pageOf` around the file's root node.
4. ✔ **Multi mode.** Cursor spawning, local multiplexing, the broadcast highlights, and
   composited multi cursors and selections. This covers the four examples:
   - alt+cmd+d then typing
   - several shift-selections in one node
   - cmd+down multicursors behaving like the main cursor
   - cmd+down in scaled text landing as a large cursor in the next span
   - **As built** (`act/sheet.kode`, tests in `sheet multi`):
     - `@sheetMulti = {active nodes cursors}`. It starts when the active node gets a
       second cursor (cmd/ctrl+up/down, shift+alt+cmd+up/down …), or with the second
       alt+cmd+d. While it is on, every key but undo/redo runs in all its nodes
       (`inSheetNode`), the motions too.
     - It ends with esc (`leaveSheetMulti`: the nodes clear their extra cursors,
       highlights and selections), when a single node is down to one cursor, and
       when the page cursors change from outside (a click, `setCursors`).
     - alt+cmd+d spreads (`spreadHighlights`): the first press highlights the word
       of the active node in all text nodes, the next one selects all of them.
       cmd+e, cmd+d and cmd+g stay in the active node.
     - `renderSheet` composites the cursors of all multi nodes (the active node's
       main cursor is the page's), and the selections and highlights of all text
       nodes. One undo step covers all nodes.
     - Two paths in `commitSheetNodes`: a text change or a scrolled node view
       renders the sheet; anything else only composites cursors, selections and
       highlights into the unchanged page (`compositeSheet`, a `swapState`, no
       `sue.changed` / `sheet.edited`). `renderSheet` reuses the page lines of
       unchanged rows, so the page syntax only tokenizes changed rows. 20 moves with
       10 cursors: 305ms → 86ms, the same as a single cursor.
     - Cursors keep their visual row when moving sideways (`rowDelta`), in the
       editor too, for all cursors (option a). Revisit with row end affinity if a
       single cursor not reaching the end of a row gets in the way.
     - Typing paints only the rows of the changed nodes again (`layout.sheetData`
       with dirty rows, the root keeps its grid), unless a node changed its size.
     - Not yet: adding cursors by click (phase 6), keeping the other nodes' cursors
       in view.
     - Noticed, not changed: multi cursor images are drawn one cell right of where
       the main cursor image would be, also in plain files.
5. ✔ **Layout changes.** Resize, scale and move hand new capacities to the states,
   create and delete attach and detach them, and undo works across them.
   - **As built:** every render attaches the states and hands them the span widths,
     so this needed no new mechanism; `sheet layout undo` tests undo and redo across
     typing, resize, move, scale, create and delete.
   - **Node views reset:** a page cursor change that leaves the text nodes scrolls
     every node view back to its first row (`sheetCursorsSet`, hooked into the
     page's `setCursors`). Resizing or scaling a node resets its view, and the page
     cursor is clamped to the node's rect (`sheet views`).
6. ✔ **Consumers:** sheetree, colorpicker, dumpstate, mouse drag, save.
   - **As built** (tests in `sheet mouse`):
     - `fileeditor.onMouse` hands press, drag and release to `state.sheetMouse` while
       a sheet is loaded (cmd/ctrl+click keeps jumping to words). A click clears the
       extra cursors, selections and highlights of all nodes (`sheetClear`) and
       places the cursor; inside a text node the node takes it. A drag selects in
       the node it started in, shift+click selects from the cursor in the same
       node, double and triple click select and highlight a word or a line.
     - alt+click adds a cursor to the clicked text node and starts multi mode
       (`sheetAddCursor`); a node that joins starts with just that cursor.
     - Modes: before a node handles a key or a click, it gets the page's allowed
       modes, and the page's active brckts and unype are started or stopped in it
       (`syncSheetModes`). Node states have unique names (`popo_node_<n>`), the mode
       instances of states that are gone are dropped. novim stays on the page.
     - dumpstate: `text 0.1.0 · 2 cursors · 2:0 9:0`, the active node and its
       cursors in its own lines (`dumpstate.textCursors`).
     - sheetree and colorpicker needed no change: in multi mode the page's main
       cursor is the active node's, so `sheetNodeAtCursor` is the active node.
       Save reads the lines from the states since phase 3.
     - Fixed on the way: `setMainCursorAndSelect` (shift+click) never selected, in
       the editor too: a nested implicit call passed the function itself to
       `setSelections`.
7. **novim in sheets.** Before this phase novim ran only on the page: its edits changed
   the composited page lines (`x` on the background), the keys it doesn't parse went to
   the node states, and the `esc` that ends an insert went to the node, so novim stayed
   off. Decided (2026-11-25):
   - **Routing.** The page owns the only novim mode. `feedSheetKey` gives it every key
     first. Its commands run in the nodes that have cursors (all multi nodes) through
     `inSheetNode`. Plain motions with a single cursor stay on the page (solo rules,
     home mirroring). Node states never start novim.
   - **Background** (no text node at the cursor). Editing commands and yanks do
     nothing: no undo step, not dirty. Motions move the page cursor. `i a o O` start
     insert on the page, the first typed character creates a text node (`o` / `O` on
     the row below / above). Structural edits stay in the sheetree.
   - **Shared parts.** Node states use the page's `state.novim` (register, macros,
     jumps, changes). Jumps are `{file x y node}`, changes `[x y node]`, `x y` in node
     coordinates; without `node` they are page positions. Going back makes the node
     the home and sets its cursor; an entry whose node is gone is skipped and dropped.
     Close entries merge only within the same node. A node is named by its state name
     (`popo_node_<n>`), or by its path if names don't survive undo. Clearing a node
     state doesn't reset the shared lists.
   - **Undo.** `u` / `ctrl+r` use the page undo (one step for all multi nodes). An
     insert session (`i a o O A I c s` … `esc`) is one undo step, **in plain files
     too**: `startNovimInsert` calls `begin`, novim's restart calls `end`, and so do
     toggling novim off, loading a file and clearing the state. The node histories stay
     unused.
   - **Ex, search, visual.** `:s :g :v :d :normal` run on the active node's logical
     lines (`%` is the node, `:5` its fifth line), in multi mode too; on the background
     they report `not in a text node`. `:w :q :wq :x :e` act on the page. `/ ? * # n N`
     search the active node. `v V ctrl+v` stay inside one node and stop at its edges,
     block columns are logical columns, `v` on the background does nothing; multi nodes
     each run visual mode. The confirm session of `:s///c` is `begin` / `end` on the
     page.
   - **Steps**, each tests first (`sheet novim`) and one commit:
     - ✔ 7a routing and background. As built: `feedSheetNovim` runs before the page
       keys; combos other than `ctrl+v/o/i` fall through. For the nodes the mode's
       `state` is set to each node state while it handles the key, and its pending
       parts (`novimParts`) are reset before every multi node. `start/stop/toggleMode
       'novim'` on a node state go to the page (`novimFromNode`, `st.sheetPage`).
       The page's `executeNovim` keeps only `novimOnPage` (`sheetNovim`), and
       `startNovimReplace` does nothing on a sheet. `mode.stop` of an inactive mode
       no longer removes another mode.
     - ✔ 7b shared novim state, jumps and changes with nodes. As built:
       `shareSheetNovim` gives a node's `novim` accessors to the page's `register`,
       `jumps`, `changes` and macro counters, and its `macroRecording` reads the
       page's; visual, insert and yank flash stay per state. Node states keep their
       name across undo (`stateName` in `plainNode` snapshots, not in `dataNode`).
       Only node states record changes, the page's composited lines don't. Jumps
       and `g;` / `g,` go through `jumpTo` → `page.sheetJump`, entries of gone nodes
       are dropped first (`pruneSheetJumps`, `retain`). Recording happens once per key
       on the page, replay runs through `feedSheetKey`; jumps and replays a node asks
       for wait until its commit is done (`novimLater`), so one change is one step.
     - Noticed, not changed: `G` keeps the width of the line it starts on
       (`moveCursors 'eof'` uses the current line), in plain files too.
     - ✔ 7c undo. As built: `beginNovimInsert` opens one group on the host (the
       page of a node state, or the state itself, `novimInsertGroup`) in
       `startNovimInsert`, `startNovimReplace` and before `openLine` adds its line;
       `finishNovimInsert` closes it, and so do starting novim, `esc` that ends multi
       mode, and loading text. `undoCommand` of a node runs the page's undo after the
       commit (`novimLater`). novim has no `ctrl+r`, redo stays on cmd/ctrl+y.
     - Noticed, not changed: typing over a selection that covers whole lines
       deletes linewise, so `C` from column 0 or `cw` on a line's last word also
       remove the line break, in plain files too.
     - 7d ex, search, visual

## Later

- per-node syntax colors composited into the page
- scaled md headings inside nodes
- keeping the other nodes' cursors in view
- row end affinity, if a cursor not reaching the end of a row gets in the way
- novim: `:%s` over all text nodes, and search that continues into the next nodes

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
2. ~~**novim in sheet mode:** what would break|needs changes?~~ Decided: one novim on the
   page, its commands run in the nodes (phase 7).
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
