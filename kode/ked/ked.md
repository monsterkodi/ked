# KED - terminal editor

      crumbs  crumbs file infos novim status
    ┏━━━━━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━━┓
    ┣━━━━━━━━╋━━━━┻━━━━┻━━━━┻━━━━┻━━┳━┻━━━━━┫
    ┃        ┃                      ┃       ┃
    ┃ dirtee ┃      fileeditor      ┃ funcs ┃
    ┃        ┃                      ┃       ┃
    ┃        ┃                      ┃       ┃
    ┃        ┃                      ┃       ┃
    ┃        ┃                      ┃       ┃
    ┃        ┃                      ┃       ┃
    ┃        ┃                      ┃       ┃
    ┗━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━┛

## Headless mode

The editor runs without a terminal:

```sh
node bin/ked -H <file>               # the screen is dumped as text
node bin/ked -C <file>               # the screen is dumped with its colors
printf 'cmd+o' | node bin/ked -H <file>
```

`-C` is headless as well, and the dump carries the colors of the screen as
terminal escape codes instead of plain text.

`COLUMNS` and `LINES` set the size (80x24 without them). Nothing is written to
the terminal: the ttio keeps what would have been written.

Headless and terminal mode share one drawing path. A dump is the real frame,
read back through `kode/ked/view/screen/vterm.kode`, the same way a terminal
would show it. Visual changes are checked with such a dump, not only with unit
tests: the unit-test harness has no text sizing.

The screen is written out after every key of the script, so a script can be
followed step by step. Below each screen there is a state section:

```
<the screen>
=== shift+down
    [focus: editor] [modes: brckts filepos replex] [file: /tmp/x]
    cursor 0:1
    select 0:0-0:1
    images cursor 4:2
<the screen>
=== a
    [focus: editor] [modes: brckts filepos replex] [dirty] [undo 3] [file: /tmp/x]
    cursor 1:0
    images cursor 5:1
```

- `===` is followed by the label: the key that was sent.
- The tags show the focused view, the active modes, a pending `:` command,
  `dirty`, `undo n` / `redo n`, and the current file.
- After the tags:
  - `cursor` is the main cursor, and `select` the selections.
  - `rect` is the editor's cell rect.
  - in a sheet, `node` is the selected sheet node, and the node at the cursor
    if that is a different one.
  - `images` lists the named image boxes, like `cursor 27:1` or
    `scrollbar 16:1×3`.
  - `log` lines are what was logged.
- Empty parts are left out.

The cursor is drawn with kitty graphics, so it is not part of the text. It
shows up in `images`. A scaled cursor carries its height: `cursor 9:5 h6` is
placed at the top row of its band, 6 rows tall. This is the way to check
cursor scaling.

The console is captured: `console.log`, `warn` and `error` show up as `log`
lines below the dump they happened in, and no `ked.log` is written.

### live mode

```sh
node bin/ked -L <file>
```

`-L` reads the keys live from the terminal (raw mode, kitty keyboard protocol)
and implies `-C`. Every draw writes its frame, like in terminal mode. The label
is the events since the last frame, or `redraw` for asynchronous ones. Never
clear the screen with `\x1b[2J` in the live output: kitty deletes image
placements on it.

To drive live mode without a terminal, run it inside `script` and pipe the keys
in (`ctrl+q`, `\x11`, quits):

```sh
(sleep 3; printf 'abc'; printf '\x11') | script -qfec "stty cols 100 rows 30; bin/ked -L -f FILE" /dev/null
```

The keys are a script of key names: a word that names a key is that key, and
a word that names nothing is the characters it is made of. A word can have
modifiers: `cmd+o`, `shift+cmd+s`, `cmd+down`. A space is a key of its own:
`space`. The words are separated by spaces, and a space between them is not
a key.

`kode/ked/util/keyscript.kode` turns such a script into the bytes a terminal
sends, and `kode/ked/util/harness.kode` is the same thing for a test: a
headless ttio, a screen, and helpers to send keys to a view and to read the
screen.

```kode
use ../util ◆ harness

h = new harness
v = new saveas h.screen

h.focus v.input
h.type v 'foo'
h.key v 'down'

h.row 0            # a line of the screen
h.t.written()      # what would have been written to the terminal
h.placements()     # where images (cursors, frames, cell rects) are placed
h.placedAt 4 1     # whether an image is placed at x y
```
