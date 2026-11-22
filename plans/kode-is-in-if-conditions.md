# kode: `is` loses its type inside `if` conditions

## Context

`x is str` compiles to `_k_.isStr(x)` (`kode/kode/renderer.kode` ~1329). Any unknown
right side falls back to `x instanceof T` (~1345). Inside an `if` condition, a
parenthesized `is` that is followed by `and`/`or` and sits under `not` after another
`and` gets the wrong right side, so it ends up as `instanceof`:

| source                                       | today                                   |
|----------------------------------------------|-----------------------------------------|
| `v = a and not (h is str and b)`             | `a && !(_k_.isStr(h) && b)` ✔            |
| `if not (h is str and b)`                    | `!(_k_.isStr(h) && b)` ✔                 |
| `if a and (h is str)`                        | `a && (_k_.isStr(h))` ✔                  |
| `if a and not (h is str)`                    | `a && !(_k_.isStr(h))` ✔                 |
| `if a and not (h is str and b)`              | `a && !(h instanceof str && b)` ✘       |
| `if a and not (h is str or b)`               | `a && !(h instanceof str \|\| b)` ✘      |
| `if a and not (h is num and b)`              | `a && !(h instanceof num && b)` ✘       |

So inside the parens the operation is grouped as `h is (str and b)`. The renderer then
sees an operation, not the token `str`, as the right side of `is`. This was hit in
`edit/act/sheet.kode` (`if node.h? and not (node.h is str and node.h.endsWith '%')`),
where it threw `ReferenceError: str is not defined` at runtime.

`==` in the same position is fine (`if a and not (h == 1 and b)` ✔), and the same
expression in an assignment is fine. So the bug is in how the precedence pass
(`kode/kode/operator.kode`) handles the operation chain of an `if` condition: `is` has
precedence 0 (binds tightest), and somewhere the parens around `(h is str and b)` aren't
treated as a boundary when the chain is re-sorted.

## Goal

`is` always binds tightest, in every context. Parentheses always end an operation
chain, in `if`/`while`/`➜` conditions as everywhere else.

## Plan

1. **Pin it down with the debug trace.** Compare `node js/kode/kode.js -c '<src>' -d` for
   `v = a and not (h is str and b)` and `if a and not (h is str and b)`, and find where
   the `if` path sorts the condition differently. The candidates are `Operator.exp` /
   `@op` in `operator.kode` and how the `if` node hands its condition to the collector
   (the `if` cond may be visited through another branch than `tl.exps`).
2. **Fix the chain boundary**, so a `parens` node is sorted on its own (recursing into
   it) and never merged into the outer chain.
3. **Hardening:** in the renderer, when the right side of `is` is not a type token,
   report an error instead of emitting `instanceof` against a name that doesn't exist
   (`str`, `num`, `arr`, `obj`, `func`, `elem` are never JS globals).

## Tests

Add every ✘ row above to `kode/kode/test/is.kode` with the expected `_k_.isStr(h)` /
`_k_.isNum(h)` output, in `if`, `while` and `➜` forms, and keep the ✔ rows as
regression cases.

## Verification

- `./kk -t kode` and `./kk -b`.
- After a full `./kk -k`, `grep -rnE "instanceof (str|num|arr|obj|func|elem)\b" js/`
  must find nothing. Any hit is an existing silent bug.
- `./kk -t`.
