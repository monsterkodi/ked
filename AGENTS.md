# ked - terminal editor

Includes a self-hosting toolchain for a custom language (**kode**) that compiles to JavaScript.

## structure

- `kode/` — source of truth, 200+ files, written in Kode
- `js/` — **generated**, committed but **never edited**
- `bin/ked` — entry point of the editor
- `kk` — entry point of the build tool

## kode/ modules

| module | what it is |
|---|---|
| `kode` | the Kode compiler |
| `kxk` | utility library |
| `ked` | the TUI editor |
| `kolor` | syntax highlighting and language definitions |
| `konrad` | build / test driver (`kk`) |

## kk - build tool

usage: `./kk <flag>`

| command | does |
|---|---|
| `kk -i` | dry run: transpiles to memory, **writes nothing**. Safe. |
| `kk -k` | transpiles `kode/**` → `js/**`; `*.kode` to `*.js` and `*.noon` to `*.json` |
| `kk -k <file.kode>` | transpiles a single source file |
| `kk -t` | runs all tests |
| `kk -t <module>` | tests one module: `kode` \| `kxk` \| `kolor` \| `ked` |

## files outside the transpiler

`kolor/lang.noon` is on the ignore list and is deliberately not transpiled:
`js/kolor/extlang.js` is built by manually calling `node js/kolor/lang.js`, which reads `kode/kolor/lang.noon`. 

# kode

## syntax

```kode
use fs os path               # import standard node modules
use ../kxk ▪ slash karg      # import members of the default export
use ../bla ◆ file file       # import file modules

class Foo
    @: a ->                  # constructor
        @a = a               # instance field
        @b ?= 3              # default if undefined
    method: x -> @a + x      # instance method
    plain: -> @a             # no-param shorthand
    async: ○-> ○ doThing()   # ○ async, both for definitions and calls

log 'hi' x                   # console.log('hi', x)
arr = [a b c]                # array elements. no commas needed.
'x' + y                      # concatenation is +, as in JS
"#{x}"                       # string interpolation

f a b     ≡  f(a, b)         # parens are inserted for un-nested top-level calls only!
f a, b    ≡  f(a, b)
f(a, b)   ≡  f(a, b)
f a(b)    ≡  f(a(b))         # if nested, only braces make the call
f(a(b))   ≡  f(a(b))
[f a]     ≡  [f, a]

obj.method? arg              # trailing? ▸ call only if it exists

if a ➜ b else c              # ➜ is the keyword 'then', spelled as one glyph
for x in xs ➜ body
⮐ value                      # explicit return
```

see `kode.md` for more details and kode examples

## checking snippets without building

```sh
node js/kode/kode.js --help
node js/kode/kode.js -c 'x = if a ➜ b else c'   # transpile, print JS
node js/kode/kode.js -c 'x = 1' -d              # also dump the token/AST trace
node js/kode/kode.js -e '1 + 2'                 # evaluate, print result -> 3
```
## bootstrapping

`kk -b` 

3-stage compiler bootstrapping. It is a fixed-point check that the compiler can compile itself.
If all tests pass after a self-recompile, the new compiler sources are copied over the old ones.
