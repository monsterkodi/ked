# kaktus

A self-hosting toolchain. A custom language (**Kode**) compiles to JavaScript;
on top of it sit a TUI editor, a syntax highlighter and a build driver.

- `kode/` — source of truth, 203 files, written in Kode
- `js/` — **generated**, 212 files, mirrors `kode/` 1:1
- `bin/ked`, `./kk` — entry points
- `kode/ked/notes.md` — the author's todo list

## The two trees

`js/` is committed but **never edited**. It is build output; the next
transpile overwrites it. Always change `kode/`, then transpile.

Transpile rules (`js/konrad/knrd.js`):

| source | target | dir |
|---|---|---|
| `*.kode` | `*.js` | `kode/` → `js/` |
| `*.noon` | `*.json` | `kode/` → `js/` |

`kolor/lang.noon` is on the ignore list and is deliberately not transpiled.
Files are only written when content differs, so `js/` stays byte-stable.

### `.noon` files

`.noon` is the source of truth; `.json` is derived from it. However `.noon`
transpilation is **known-suspect** — it is believed there is a bug in
`kk`/`konrad` that fails to transpile some `.noon` files correctly. If a
generated `.json` looks wrong, suspect the transpiler before hand-editing the
output — and prefer fixing the `.noon`.

`package.noon` at the repo root sits outside `kode/` and is never touched by the
transpiler. It currently disagrees with `package.json` (`build1` carries an
extra `-v`). Which is authoritative has not been decided.

## Commands

`./kk <flag>` — or `pnpm run <script>` for the two npm scripts.

| command | does |
|---|---|
| `kk -i` | dry run: transpiles to memory, **writes nothing**. Safe. A crash here is a bad sign. |
| `kk -k` / `kk -b` | transpile `kode/` → `js/` (aliases) |
| `kk -k <file.kode>` | transpile a single source file |
| `kk -R` | rebuild: transpile the whole tree |
| `kk -t` | run all tests (`node js/test.js`) |
| `kk -t kode` | one module: `kode` \| `kxk` \| `kolor` \| `ked` |
| `kk -t brief` | verbosity: `brief` \| `silent` |
| `kk -t path/to/file.js` | one test file |
| `kk -w` | watch: transpile + test on every change |
| `kk -s` / `kk -d` | git status / status with diffs |

Long forms work too (`kk --knrd`, `kk --test`). Short flags are the option's
first letter by default; `-R`, `-D`, `-V` are the deliberate exceptions.

**Trap:** the single-file form only accepts `.kode`. Handing `knrd` a `.noon`
path fails the extension check, the file list comes back empty, and it silently
transpiles the *entire tree* instead. To transpile one `.noon`, transpile the
tree or use `kk -R`.

### `kk --build` is an alias for `kk --knrd`

`kk -b` transpiles, same as `kk -k`. Both take the same optional file argument.

### `pnpm run stage` — compiler changes only

The only thing that needs the two-stage self-compilation. Stage 0 compiles
`kode/kode/*.kode` with the checked-in compiler, stage 1 recompiles with the
result, tests, then promotes stage 1 over `js/kode/`. It is a fixed-point check
that the compiler can compile itself.

Required when `kode/kode/**` changes. Not required for `ked`, `kxk`, `kolor`
or `konrad` changes — `kk -k` is enough there.

## Modules

| module | what it is |
|---|---|
| `kode` | the Kode compiler: lexer, parser, scoper, stripol, returner, operator, renderer |
| `kxk` | utility library: nfs (filesystem), path, args, strings, regex, watch, noon |
| `ked` | the TUI editor — the largest piece |
| `kolor` | syntax highlighting and language definitions |
| `konrad` | build / test / commit driver (`kk`) |

`kk` loads `kxk`; `kxk` is transpiled by `kode`. The naming is recursive on
purpose — don't assume a layering that isn't there.

## Kode syntax

There is no language documentation anywhere in the repo. This is the crib.

```kode
use ◆ slash nfs              # import; ◆ separates the path from the names
use ../kxk ◆ slash karg

class Foo
    @: (a) ->                # constructor
        @a = a               # instance field
        @b ?= 3              # default if undefined
    method: (x) -> @a + x    # instance method
    plain: -> @a             # no-param shorthand
    async: ○-> ○ doThing()   # ○ = async, both for definitions and calls

valid x                      # not null/undefined/NaN
empty x                      # '' / null / undefined / NaN / empty object

log 'hi' x                   # juxtaposition = call: log('hi', x)
arr = [a b c]                # ... and array elements. no commas needed.
'x' + y                      # concatenation is +, as in JS
"#{x}"                       # interpolation

@insert foo.bar(baz)        # braces make the call
f a b  ≡  f a, b  ≡  f(a, b)

obj.method? arg              # trailing ? = call only if it exists

if a ➜ b else c             # ➜ is the keyword 'then', spelled as one glyph
if a then b else c          # identical — 'then' and '➜' are the same token
x = if a ➜ b                # else omitted, so it yields undefined
for x in xs ➜ body
⮐ value                      # explicit return
```

Other mechanics worth knowing:

- **Sequence always means a comma-separated list, never grouping.** Commas and
  juxtaposition are interchangeable and compile identically — `f a b`,
  `f a, b` and `f(a, b)` are all `f(a, b)`. Kode inserts a comma wherever a
  bracket could have been inserted, so a juxtaposed chain is *one* call with a
  flat argument list. It never nests.
- **Only braces make a call.** `f g x` is `f(g, x)`, not `f(g(x))` — and manual
  parens do not rescue it: `f(g x)` and `f (g x)` are flat too. Put braces on
  the inner call: `f g(x)` → `f(g(x))`. Brackets *do* group where a sequence
  must stay whole: `f [a b]` → `f([a, b])`.
- The `?` postfix follows the same rule: `(foo.has '')?` becomes the comma
  expression `(foo.has, '')`, not a call. Use `(foo.has(''))`, or assign to a
  variable first and test that.
- **Write the commas and braces anyway.** Kode's own source leans on
  juxtaposition for readability, but that is a style choice, not a shorthand
  you need to imitate. Prefer `f(a, b)` and `g(x)` over `f a b` and bare
  `g x`: the explicit forms cannot be misparsed, and they cost nothing.
- **Last expression in a block returns implicitly.** `@returner.collect` in
  `kode/kode/kode.kode` inserts the return; you rarely write `⮐` for it.
- `if` is an **expression**, not a statement. In value position it renders as a
  JS ternary: `x = if a ➜ b else c` becomes `x = a ? b : c`.
- **`;` separates statements inside a branch, not branches.** `if a ➜ b; c; d`
  is one `if` with a three-statement body. A second `➜` with no `if` in front
  of it is silently dropped — `if a ➜ b; c ➜ d` compiles to `if (a) { b; c }`.
- The AST pipeline is `@ast()` at `kode/kode/kode.kode:111`, in order: lexer →
  parser → stripol (interpolation) → scoper (variable collection) → returner →
  operator (precedence sort).
- `karg """..."""` declares CLI options with an inline help block.
- Trailing same-line comments can hide a whole body:
  `ignore: (p) -> #log 'ignore' p; true` — the method is a no-op.

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

## Conventions

- **The `0`-art header at the top of each file is deliberate.** Each file opens
  with a comment block spelling a word in ASCII art using only `0` and space.
  It is a navigation aid, not decoration. Do not remove it, and do not treat it
  as noise when tidying a file.
- **`# log '...' args` lines are a live debugging idiom,** not dead code. They
  are the fastest way to trace execution in this codebase. They may be removed
  only when the surrounding code they describe is removed.

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

## Unresolved

A few things about `js/` are **not yet understood** and should be checked
individually before being touched:

| file | status |
|---|---|
| `js/ked/test/level2/test23.js`, `test234.js` | probably test fixtures |
| `js/kolor/test.js`, `js/kolor/test/uutil.js` | probably test fixtures |
| `js/csi.js`, `js/kxk/path.js`, `js/kxk/styl.js`, `js/kxk/kxk.js` | no matching `.kode` source; hand-written or stale artifact — unknown which |

Treat these as read-only until their provenance is established.