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
  - **`node.text` is the text type**, not the content. The key makes the node a text
    node with a state, and the value is the kind of text. For now it is always
    `'normal'`, a placeholder that gets a meaning later.
  - On disk the content is a `lines` list of strings:
    `{text:'normal' lines:['HELLO world!' …] x:… }`. Load creates the state from it,
    save writes `s.lines` back. The sheets in `test/level2` are converted once, with no
    code for the old format.
  - An empty text node (`lines: ['']`) is kept. It is removed like any node.
  - Every line is wrapped (`@wrap.all = true`). The rows of the wrapped lines are the
    node's spans, in flow order (see *Wrapping into spans*).
  - It owns its own cursors, selections, highlights and main cursor.
  - Scale doesn't exist inside a node state. Span capacities are already divided by the
    scale; scale only affects compositing.
  - It is never drawn and never scrolls (`@skipAdjustViewForMainCursor`, or cells big
    enough that the view never moves).
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
- Continuation rows aren't indented in sheets: `wrapIndent` is 0 when `@rowWidths` is
  set (to be confirmed, see open questions).

Because wrapping lives outside the logical lines, a **rect change only invalidates the
cache**. Cursors, selections and highlights are logical and stay where they are; no
rewrap bookkeeping is needed.

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
  - **up/down:** the editor moves wrapped lines by logical lines, so the cursor jumps
    over continuation rows. Inside a node that means jumping over spans. Moving by spans
    needs up/down by visual rows in wrapped lines (open question 5).
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
`fill.text` / `fill.scaled` for text. Rows past the last span (overflow) aren't painted.

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
                {text:'normal' x:1 y:0 w:6 h:1 s:sA}   # sA.lines = [['h','e','l','l','o']]
                {text:'normal' x:1 y:2 w:4 h:2 s:sB}   # sB.lines = [['a'] ['b']]
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
- **`node.text` is the type:** `flows`, `scaleOf` and `typeOf` / `roleOf` / `argOf` test
  the key or a valid value, so they keep working. The sheenode arg field shows and sets
  the text type, like the color of a `bg` node; switching the type away from `text`
  drops the state. Text is only edited in the sheet, so the sheenode doesn't touch node
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
  so unype and brckts behave the same inside nodes. novim is blocked while a sheet is
  loaded, until phase 7.

## Phases

1. **Wrap seam.** `sue.wrapStarts` with a width function, `@rowWidths` in the state,
   flow layout across lines. Tested on plain states, without sheets.
   - **Gate:** all wrap and mapscr tests unchanged.
2. **Projector, node states, compositing; rendering only.** Load the sheet, create
   the states, paint text from them, and map the cursor. Editing still goes through A.
   - **Gate:** all existing popo tests pass with the new paint path, and headless output
     of `test2.sheet` is identical (only holds with char wrap, see open question 6).
3. **Solo editing through the home state, and global undo.**
   - Text keys in solo mode go to the home state.
   - Remove the A text twins and rewrite their tests.
4. **Multi mode.** Cursor spawning, local multiplexing, the broadcast highlights, and
   composited multi cursors and selections. This covers the four examples:
   - alt+cmd+d then typing
   - several shift-selections in one node
   - cmd+down multicursors behaving like the main cursor
   - cmd+down in scaled text landing as a large cursor in the next span
5. **Layout changes.** Resize, scale and move hand new capacities to the states,
   create and delete attach and detach them, and undo works across them.
6. **Consumers:** sheetree, colorpicker, dumpstate, mouse drag, save.
7. **novim in sheets.** Until then the novim mode is stopped and can't be started while
   a sheet is loaded. Per node, novim would break: the register, macros, jumps and
   changes would be split across nodes, pending commands (`3d…`, `f`) would get lost
   when the home changes, `u` / `ctrl+r` would hit the ignored node histories, and the
   projector's raw key classes would fight novim's parser. The shape:
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
   is the text type, the content is `lines` on disk, empty text nodes are kept.
2. ~~**novim in sheet mode:** what would break|needs changes?~~ Decided: deferred to
   phase 7, blocked in sheets until then.
3. **Cursors in overflow lines or hidden text** (covered by other nodes) aren't visible.
   Show a marker, or accept it for now?
4. **node masking | flow mechanism** should we re-implement it after the refactor?
5. **up/down in wrapped lines:** the editor moves by logical lines. Examples 3 and 4
   need moving by visual rows (spans). Change it for all wrapped lines, only for node
   states, or keep logical moves in sheets?
6. **word or char wrap in sheets:** `fill.flow` breaks anywhere, the state defaults to
   word wrap. Word wrap in nodes changes how existing sheets look.
7. **continuation indent in sheets:** none (as now), or the editor's indent that lines
   up with leading whitespace and list markers?
