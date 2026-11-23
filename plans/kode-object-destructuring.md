# kode: simple object destructuring, passed through to native JS

## Context

| source          | today                                                     |
|-----------------|-----------------------------------------------------------|
| `{a b} = o`     | parse error `unmatched closing bracket` (curly literals need commas) |
| `{a, b} = o`    | `a = o.a` then `b = o.b`, which evaluates `o` once per key |
| `{a:x} = o`     | `undefined = o.undefined`                                 |

Only the comma form works, and it's used twice in the sources (`kode/kode/parser.kode:1009`,
`kode/kxk/scooter.kode:96`). The renderer branch for it is at `kode/kode/renderer.kode`
(`if op.lhs.object`, next to the array destructuring).

## Goal

Let a few simple forms through to native JS, the same way `import` is handled:
`parser.import` collects the raw tokens up to the end of the line and the renderer
emits them almost verbatim, without parsing them as kode expressions.

    {a b} = o       ▸  ;({a, b} = o)
    {a, b} = o      ▸  ;({a, b} = o)
    {a:x b} = o     ▸  ;({a: x, b} = o)      rename: x = o.a

The parens are required by JS (a leading `{` would start a block), and the existing
`;` rule for statements starting with `(` keeps it from continuing the line above.

Allowed between the braces: names (keyword names like `from` too), `name:name`, and
optional commas. Anything else is an error, not a guess: nested braces, defaults
(`a = 1`), strings or computed keys, `...rest`, and member targets (`{a:@x}`):

    only names and renames can be destructured from an object

## Plan

1. **Parser** (`kode/kode/parse.kode`, the token switch in `exp`). When a statement
   starts with `{` and its matching `}` is directly followed by `=`, collect the tokens
   between the braces like `import` does, check them against the allowed forms, then
   parse the right side as a normal expression. Result: a node
   `destruct: keys:[{key, target}] rhs:…`.
2. **Renderer**: `"(#{keys} = #{rhs})"`, with `key: target` only for renames. Remove
   the old `op.lhs.object` branch, which evaluates the right side once per key.
3. **Scoper**: declare each target (the rename target, otherwise the key).
4. Statement position only. `x = {a b} = o` stays an error for now.

## Tests

`kode/kode/test/object.kode`:

    kc '{a b} = o'          ▸ ';({a, b} = o)'
    kc '{a, b} = o'         ▸ ';({a, b} = o)'
    kc '{a:x b} = o'        ▸ ';({a: x, b} = o)'
    kc '{from to} = r'      ▸ ';({from, to} = r)'
    ke an eval where o is a call, checking that it runs once

`kode/kode/test/error.kode`: `{a = 1} = o`, `{a {b}} = o`, `{...r} = o`, `{a:@x} = o`.

Existing curly literals (`x = {a:1}`, `{a:1}["a"]`, blocks of key/values) must stay
unchanged.

## Verification

`./kk -t kode`, `./kk -b`, then a full `./kk -k`. Only `parser.js` and `scooter.js`
may change outside the compiler. Then `./kk -t`.
