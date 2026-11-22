# kode: ranges that count down — discussion

## Context

`for i in a...b` and `for i in a..b` decide their direction:

- **at compile time for literals**: `for i in 3...0` → `for (i = 3; i > 0; i--)` (3, 2, 1);
- **at run time otherwise**: `for i in 0...n` →
  `for (_a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))`,
  so `n = -2` iterates 0, -1.

This is CoffeeScript's semantics, and it is mostly convenient. The surprise is the
"empty range" case. Code like

    for y in cy+1...min(lines.length cy+7)

is meant to run zero times when the start is past the end. Instead it runs *backwards*
over indices that may not exist. It was hit in `ked/edit/act/sheet.kode` and needed an
explicit `break if y >= below`. Index loops (`0...list.length`, `i+1...n`) are by far the
most common form, and for them "count down" is almost never what is meant.

There are about 477 `for … in …` range loops in `kode/`. Any change in semantics has to be
checked against them.

## Options

1. **Keep it, document it.** Add a note and an example to `kode.md` → *ranges*. That costs
   nothing, but the trap remains.
2. **Ascending only for variable ranges.** Literal ranges keep their direction
   (`3...0` counts down, which is visible in the source). Ranges with any non-literal
   bound only count up and are empty when start ≥ end (`...`) or start > end (`..`).
   That matches Python's `range`, JS `for` loops and the intent of index loops.
   Explicit descent needs a literal or a new form (see 3).
3. **Explicit step / direction.** Add `by`: `for i in a...b by -1` (CoffeeScript has
   `by`). Combined with option 2, a descending variable range is written as `a...b by -1`
   and is never accidental.
4. **Warn.** Keep the semantics, but have the compiler emit a runtime assertion (or a
   debug-mode log) when a variable range actually goes down. It's a diagnostic that
   finds the accidental cases without breaking anything.

## Recommendation

**Option 4 first, then 2 + 3.**

1. Add the debug-mode check (option 4) behind a flag and run `./kk -t` with it. That
   lists every variable range in the code base that really counts down during the
   tests. Each one is either a bug (like the `sheet.kode` case) or an intended
   descent.
2. Convert the intended descents to `by -1` (option 3), then switch variable ranges to
   ascending only (option 2) and drop the runtime direction check. The generated loops
   also get simpler: `for (i = a; i < b; i++)`.

## Plan

1. **Renderer** (`kode/kode/renderer.kode`, for-range rendering ~1005–1040, and the list
   ranges ~1430): add the optional descent check (step 1). Later switch the non-literal
   branch to ascending only and add `by <step>` parsing (`kode/kode/parse.kode`).
2. **Audit** the hits from the instrumented test run, plus a grep for
   `for \w+ in .*\.\.\.?` where the start is computed (`i+1...`, `x-1..`), since those
   are the likely accidental ones.
3. **Docs**: update `kode.md` → *ranges* with the final rule and examples for `by`.

## Tests

`kode/kode/test/loops.kode`:

    for i in 3...0       ▸ [3 2 1]           (literal, unchanged)
    for i in a...b       ▸ [] when a > b     (after step 2)
    for i in a...b by -1 ▸ descends
    r = 1...3            ▸ [1 2]             (list range, decide whether the same rule applies)

## Verification

`./kk -t kode`, `./kk -b`, then a full `./kk -k` and `./kk -t`. Before switching the
semantics, the instrumented run must show no unexplained descents.
