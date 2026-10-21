# ked - terminal editor

Includes a self-hosting toolchain for a custom language (**Kode**) that compiles to JavaScript.
On top of it sit a TUI editor, a syntax highlighter and a build tool.

- `kode/` — source of truth, 200+ files, written in Kode
- `js/` — **generated**, 200+ files, mirrors `kode/` 1:1
- `bin/ked` — entry point of the editor
- `kk` — entry point of the build tool

## The two trees

`js/` is committed but **never edited**. It is build output; the next
transpile overwrites it.

## kk - build tool

usage: `./kk <flag>`

| command | does |
|---|---|
| `kk -i` | dry run: transpiles to memory, **writes nothing**. Safe. A crash here is a bad sign. |
| `kk -k` | transpile `kode/` → `js/`; `*.kode` to `*.js` and `*.noon` to `*.json` |
| `kk -k <file.kode>` | transpile a single source file |
| `kk -t` | run all tests |
| `kk -t kode` | one module: `kode` \| `kxk` \| `kolor` \| `ked` |
| `kk -t brief` | verbosity: `brief` \| `silent` |
| `kk -t path/to/file.js` | one test file |
| `kk -w` | watch: transpile + test on every change |

`kolor/lang.noon` is on the ignore list and is deliberately not transpiled.
Files are only written when content differs, so `js/` stays byte-stable.

### `kk -b` — compiler changes only

3-stage compiler bootstrapping. It is a fixed-point check that the compiler can compile itself.
If all tests pass after a self-recompile, the new compiler sources are copied over the old ones.

## Modules

| module | what it is |
|---|---|
| `kode` | the Kode compiler |
| `kxk` | utility library |
| `ked` | the TUI editor |
| `kolor` | syntax highlighting and language definitions |
| `konrad` | build / test driver (`kk`) |

## Kode syntax

```kode
use fs os path               # import standard node modules
use ../kxk ▪ slash karg      # import members of the default export
use ../bla ◆ file file       # import file modules

class Foo
    @: (a) ->                # constructor
        @a = a               # instance field
        @b ?= 3              # default if undefined
    method: (x) -> @a + x    # instance method
    plain: -> @a             # no-param shorthand
    async: ○-> ○ doThing()   # ○ = async, both for definitions and calls

log 'hi' x                   # console.log('hi', x)
arr = [a b c]                # array elements. no commas needed.
'x' + y                      # concatenation is +, as in JS
"#{x}"                       # string interpolation

f a b     ≡  f(a, b)         # parens are the rule
f a, b    ≡  f(a, b)
f(a, b)   ≡  f(a, b)
f a(b)    ≡  f(a(b))         # braces make the call
f(a(b))   ≡  f(a(b))

obj.method? arg              # trailing ? = call only if it exists

if a ➜ b else c              # ➜ is the keyword 'then', spelled as one glyph
x = if a ➜ b                 # else omitted, so it yields undefined
for x in xs ➜ body
⮐ value                      # explicit return
```

see `kode.md` for more details

the parenless calls are shorthand, and shorthand is positional: they read as a
call only at the root of a statement. `(f (a))`, `[f (a)]`, `g f (a)` and
`{ k: f (a) }` are not calls — and none of them complains.

### Checking a snippet without building anything

The compiler is its own CLI and takes a string, so you can settle a syntax
question instead of guessing:

```sh
node js/kode/kode.js --help
node js/kode/kode.js -c 'x = if a ➜ b else c'   # transpile, print JS
node js/kode/kode.js -e '1 + 2'                 # evaluate, print result -> 3
node js/kode/kode.js -c 'x = 1' -d              # also dump the token/AST trace
```

`-c` writes nothing and runs nothing — it just shows what the code becomes.
Prefer it. `-e` executes the compiled result, so it is the one to reach for
only when you actually need the value.

Keep the snippet in **single quotes**: `#` begins a Kode comment, and many
operators are non-ASCII (`➜`, `○`, `⮐`, `◆`), so anything the shell touches
will corrupt it.

## Headless mode

The editor runs without a terminal:

```sh
node bin/ked -H <file>               # the screen is dumped as text
printf 'cmd+o' | node bin/ked -H <file>
```

`COLUMNS` and `LINES` set the size (80x24 without them). Nothing is written to
the terminal: the ttio keeps what would have been written, and the screen is
a buffer of cells that can be read as text.

The screen is written out after every key of the script, so a script can be
followed step by step:

```
=== start
<the screen>
=== down
<the screen>
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
```

## Never

- **Never edit anything under `js/`.** It is generated and will be overwritten.
- **Never run `kk --commit`.** It does `git add . && git commit && git push`.
  Use plain `git`.

## One generated file outside the transpiler

`js/kolor/extlang.js` is built by `kode/kolor/lang.kode`, which reads
`kode/kolor/lang.noon`. It is **not** produced by `kk -k` — `lang.noon` is on
the transpiler's ignore list. Regenerate it directly:

```sh
node js/kolor/lang.js
```
