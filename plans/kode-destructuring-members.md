# kode: destructuring into members and indices

## Context

Destructuring assignment only works when every target is a plain name. Any target that is
a property or an index compiles to an assignment to `undefined`. That throws in strict
mode, or silently drops the value in sloppy mode.

| source                     | today                                                           |
|----------------------------|-----------------------------------------------------------------|
| `[x y] = [y x]`            | `var _a_ = [y,x]; x = _a_[0]; y = _a_[1]` ✔                      |
| `[a.b c.d] = [c.d a.b]`    | `var _a_ = [c.d,a.b]; undefined = _a_[0]; undefined = _a_[1]`   |
| `[a[0] b] = f()`           | `var _a_ = f(); undefined = _a_[0]; b = _a_[1]`                 |
| `[c[0] c[1]] = g()`        | same, both `undefined` (hit in `edit/act/multi.kode`, Nov 2026)  |

Swapping two fields (`[a.b c.d] = [c.d a.b]`) and unpacking into array slots
(`[c[0] c[1]] = pos`) are common, so the workaround (one temporary plus N assignments)
shows up repeatedly.

## Goal

Every target that is valid on the left of `=` is also valid inside `[...] = rhs`:
names, `a.b`, `a[i]`, `@x`, `a?.b` excluded (can't be assigned), nested `[[a b] c]` if
already supported. Values are read from the temporary first and then assigned left to
right, so swaps work.

## Plan

1. **Find the renderer path.** In `kode/kode/renderer.kode`, look for the code that emits
   `var _a_ = …; x = _a_[0]`. It takes each element's `.text`; for a property access or
   an index the element is an expression node without `.text`, so it prints `undefined`.
2. **Render each target as an lvalue**: use the same renderer call that a plain
   `a.b = v` uses (`@node target`), not the token text.
3. **Declare only plain names.** The scoper (`kode/kode/scoper.kode`) must add `var`
   declarations for name targets only, never for `a.b` / `a[0]` (today `b` in
   `[a[0] b]` is declared correctly; keep that).
4. **Evaluate the right side once** (already true via `_a_`), so
   `[a.b c.d] = [c.d a.b]` swaps correctly.
5. **Reject non-assignable targets** (`f()`, `a?.b`, literals) with a clear error instead
   of emitting `undefined = …`.

## Tests

Add to `kode/kode/test/` (the destructuring tests; `array.kode` or `misc.kode`):

    [a.b c.d] = [c.d a.b]   ▸ compiles to  _a_ = [c.d,a.b]; a.b = _a_[0]; c.d = _a_[1]
    [a[0] b] = f()          ▸ a[0] = _a_[0]; b = _a_[1]   and only `b` is declared
    [@x @y] = [1 2]         ▸ this.x = …; this.y = …
    plus an evaluated swap of two object fields giving the swapped values

## Verification

- `./kk -t kode`, then `./kk -b` (the compiler sources must still bootstrap).
- `grep -rn "undefined = _" js/` over the generated JS should find nothing after a full
  `./kk -k`. That also catches any existing source that was silently broken.
- `./kk -t` for the whole suite.
