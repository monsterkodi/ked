# KED - terminal editor

      crumbs  file      tabs          status
    ┏━━━━━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━━┓
    ┣━━━━━━━━╋━━━━┻━━━━┻━━━━┻━━━━┻━━┳━┻━━━━━┫
    ┃        ┃                      ┃       ┃
    ┃ dirtee ┃    editor            ┃ funcs ┃
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
the terminal: the ttio keeps what would have been written, and the screen is
a buffer of cells that can be read as text.

The console is not taken over: `console.log` keeps writing to stdout and no
`ked.log` is written, so a script can print while it drives the editor.

The screen is written out after every key of the script, so a script can be
followed step by step:

```
=== start [modes: brckts filepos novim replex] [file: /tmp/x]
<the screen>
=== down [modes: brckts filepos novim replex] [dirty] [file: /tmp/x]
<the screen>
=== q [pending: :q] [dirty] [file: /tmp/x]
<the screen>
```

The label carries the state of the editor: the active modes, a pending `:`
command, whether the buffer is dirty, and the current file. Empty parts are
left out.

The cursor is drawn with kitty graphics, which a headless screen has none of,
so it is marked with escape sequences there: the character under the cursor is
in the colors of the other way round, and the main cursor is underlined as
well.

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
```
