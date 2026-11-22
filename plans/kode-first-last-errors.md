# kode: clear errors for misplaced `first` / `last`

## Context

`first` and `last` are prefix operators in kode (`last [1 2 3]` ▸ 3). When they are used as
variable names, the compiler either reports an error that points somewhere unrelated or,
worse, silently compiles something else. Found while writing popo/sheet code (Nov 2026).

| source                     | today                                                  |
|----------------------------|--------------------------------------------------------|
| `for i in 0...last` + body | `unexpected block token in exp!` on the *body* line    |
| `x = last?`                | `? is missing a left operand`                          |
| `a = b if last?`           | `? is missing a left operand`                          |
| `x = [last[0] last[1]]`    | **silently** `[_k_.last([0]), _k_.last([1])]`          |
| `f = last[0]`              | **silently** `_k_.last([0])`                           |
| `last = 3` / `log last`    | compiles as a plain variable named `last`              |
| `x = first.length`         | compiles as a plain property access on `first`         |

So whether `last` is read as a name or as an operator depends on the next token. That
choice is made in a single place:

- `kode/kode/parse.kode:505` — in the token switch of `exp`:
  `e.text in ['first''last'] and (nxt.type not in ['op''nl'] and nxt.text?[0] not in ',.}])')`
  makes the token an operator, otherwise it falls through as an identifier.
- the operator itself is listed in `kode/kode/operator.kode:15`, special-cased in the lexer
  (`kode/kode/lexer.kode:336`) and rendered in `kode/kode/renderer.kode:1277`.

The misleading messages come from later stages: `parse.kode:307` (block as an operand) and
`parse.kode:352` (`?` without a left side).

## Goal

Every misuse of `first` / `last` as a name gives one error at the token itself:

    'last' is an operator (last [1 2 3] ▸ 3) and can't be a variable name

and no misuse compiles silently.

## Plan

1. **Decide the rule.** `first` and `last` are always operators and never identifiers.
   - Only `first <operand>` and `last <operand>` on the same line are valid, with a space
     before the operand.
   - Decide whether `last[0]` (no space) should be an error or mean the operator applied to
     an index. Proposal: an error. Unspaced `[` reads as indexing everywhere else in kode,
     so `last[0]` can only be a mistake.
2. **Check in `parse.kode` at the decision point (~505).** When `e.text in ['first' 'last']`:
   - if `nxt` is a block, a newline or a closing/separator punct (`,.}])`), or `?`, raise
     `@onError "'#{e.text}' is an operator …" tok:e` instead of falling through;
   - if `nxt` is `[` with no space before it, raise the same error;
   - if `nxt` is `=` (an assignment target) or `.` (member access), raise the same error.
3. **Catch the remaining cases in the scoper.** Some forms never reach that branch, for
   example a function parameter, a destructuring target, or a `for` variable named
   `last`/`first`. Reject those in `kode/kode/scoper.kode` where variables are declared,
   with the same message.
4. **Keep the message in one helper**, so the lexer, parser and scoper can't drift apart.

## Tests

Add to `kode/kode/test/error.kode` using the existing `codemsg` helper, one line per case:

    codemsg 'for i in 0...last\n    log i'   "'last' is an operator"
    codemsg 'x = last?'                       "'last' is an operator"
    codemsg 'x = [last[0] last[1]]'           "'last' is an operator"
    codemsg 'f = last[0]'                     "'last' is an operator"
    codemsg 'last = 3'                        "'last' is an operator"
    codemsg 'x = first.length'                "'first' is an operator"
    codemsg 'f = (a last) ->'                 "'last' is an operator"

and keep the valid forms working (`kode/kode/test/operator.kode`):

    last [1 2 3]  ▸ 3
    first 'abc'   ▸ 'a'
    [first(a) last(a)]

## Verification

- `./kk -t kode` — new error cases pass, existing operator tests unchanged.
- `node js/kode/kode.js -c 'f = last[0]'` prints the new error instead of JS.
- `./kk -b` — the compiler still bootstraps. Before that, check that kode's own sources
  don't use `first` / `last` as names:
  `grep -rnwE '(first|last) *(=|\[|\?|\.)' kode/` must only find operator uses.
- `./kk -t` — the full suite stays green, so no other module relied on the lenient parse.
