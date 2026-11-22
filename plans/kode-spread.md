# kode: spread in calls and arrays — fix and discuss

## Context

kode supports rest **parameters** in CoffeeScript style, with the dots as a suffix:
`(event args...) ->` → `function (event, ...args)` (used e.g. in `ked/util/prof.kode`,
`ked/test/colmns.kode`). There is no **spread** in calls or array literals. `...` is the
exclusive range operator, so every attempt turns into a range or breaks:

| source             | today                                                         |
|--------------------|---------------------------------------------------------------|
| `f a ...b`         | `f((function(){ for (i = a; i < b; …) }).apply(this))` — range |
| `x = [a ...b]`     | range from `a` to `b`                                          |
| `g ...b`           | `(function(){ for (i = g; i < b; …) })` — `g` becomes the start |
| `f(a, ...b)`       | `f(a,...,b)` — invalid JS                                      |
| `f a, b...`        | parse error                                                    |
| `[a, b...]`        | range from `b` to nothing — invalid JS                         |
| `(a ...b) ->`      | `function (a, ..., b)` — invalid JS                            |

The workarounds are `f.apply(null, [a].concat(b))` or `a.concat(b)`. In
`ked/popo/layout.kode` the code needed `chars[0...offset].concat(added).concat(chars[offset..])`
instead of `chars.splice offset 0 ...added`.

## Decision needed: the spelling

The JS form `...b` clashes with ranges: `a ...b` is already a range, and kode drops commas,
so the parser can't tell `f(a, ...b)` from `f a ...b`. Options:

1. **Suffix dots, like rest params** — `f a b...`, `[a b...]`.
   Consistent with `(args...) ->` and with CoffeeScript. But `b...` followed by something
   still looks like the start of a range, so it needs a rule: `x...` immediately before
   `)`, `]`, `,` or the end of a call's arguments is a spread.
2. **Prefix dots with no space before the operand, and a space before the dots** —
   `f a ...b` is a spread, `a...b` / `a ... b` stay ranges. Closest to JS, but whitespace
   becomes meaningful, and every existing `x ...y` range (spaced) would change meaning.
3. **A distinct glyph** — e.g. `…b` (U+2026) or `▸▸b`. kode already uses glyphs
   (`➜ ⮐ ○ ▪ ◆`), so `f a …b` / `[a …b]` would be unambiguous and need no whitespace
   rules. It costs one more glyph to type.

Recommendation: **option 1** (suffix), because rest params already use it, so
`(args...) -> f args...` reads symmetrically. The rule for when a suffix `...` is a spread
is the main design work. Option 3 is the fallback if the suffix rule turns out ambiguous.

## Plan (for option 1)

1. **Inventory** every current `x...` and `x ...y` in `kode/` with a grep, and classify
   each as a range or a rest param. No source may change meaning.
2. **Parser** (`kode/kode/parse.kode`, where `dots` are parsed for slices/ranges): when
   `...` directly follows an operand and is followed by a closing bracket, a
   call-argument end, a newline in an argument list, or nothing, produce a `spread` node
   instead of an open range.
3. **Renderer**: emit `...expr` for `spread` nodes in call arguments and array literals.
   Fix the broken prefix forms in the table to report a clear error ("use `b...` for
   spread") instead of emitting invalid JS.
4. **Rest params**: keep `(a b...) ->` and make `(a ...b) ->` an error with the same hint.

## Tests

`kode/kode/test/call.kode` / `array.kode`:

    f a b...        ▸ f(a, ...b)
    f(a, b...)      ▸ f(a, ...b)
    [a b...]        ▸ [a, ...b]
    [b... c]        ▸ [...b, c]
    g x... y        ▸ decide: error or g(...x, y)
    1...3           ▸ unchanged range [1,2]
    (a b...) ->     ▸ unchanged rest param

## Verification

`./kk -t kode`, `./kk -b`, then a full `./kk -k`, and a `git diff --stat js/`. Apart from the
new tests, the generated JS of the existing sources must not change. Then `./kk -t`.
