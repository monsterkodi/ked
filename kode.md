<img src="./img/kode.svg" />

**kode** is a programming language that transpiles to JavaScript.

```kode
a = 1...3
for i in 0..5
```

Square brackets around ranges are optional.

## console

```kode
log 'hello'     ▸ hello
error 'world!'  ▸ world!
```

Simple shortcuts for `log`, `warn` and `error` methods of `console`.

## negative indexing

```kode
"abc"[-2]       ▸ 'b'
[1,2,3][-2]     ▸ 2
```

`v[-n]` is a shortcut for `v[-n..-n][0]` for number literals `n`

## if

```kode
if  
    a ➜ X
    b ➜ Y
      ➜ Z
```
is a shortcut for

```kode
if      a then X
else if b then Y
          else Z
```

## switch

```kode
switch x
    1
    2 3   ➜ X
    'abc' ➜ Y
          ➜ Z      
```
is a shortcut for

```kode
switch x
    when 1,2,3 then X
    when 'abc' then Y
    else            Z
```

## is

```kode
1 is 'number' and '' is 'string' and {} is Object and [] is Array   ▸ true
1 is Number or '' is String or [] is 'array'                        ▸ false
```

`is` is a shortcut for `typeof` and `instanceof`. 
The first is used, when the right hand side is a string.

### num str obj

```kode
"0xFF" is num and "-4.536" is num and 42 is num                     ▸  true
'' is str and "a" is str and new String("abc") is str               ▸  true
{} is obj and new Object() is obj                                   ▸  true
null is obj or new Map() is obj or [] is obj                        ▸  false
```

`is num` does a string coersion via `parseFloat` in the test.
`is str` checks both, type == 'string' or instanceof String.
`is obj` evaluates to true for plain Objects only.

## empty

```kode
empty [] and empty {} and empty '' and empty null and empty NaN     ▸ true
empty 0 or empty 'a' or empty [null] or empty Infinity              ▸ false
```

Returns true for null, undefined, NaN and empty array, object or string.

## valid

```kode
valid 0 and valid 'a' and valid [null] and valid Infinity           ▸ true
valid [] or valid {} or valid '' or valid null or valid NaN         ▸ false
```

Just the negation of `empty`.

## each

```kode
obj each (k,v) -> [k,v]
obj each (v) -> v
```

The `each` operator takes an object, array or string on the left hand side and 
a function on the right hand side.
The function is called for each key/value, index/item, index/character pair.
A new object, array or string is build from the results and returned:

```kode
'hello'   each (c) -> c+c                                           ▸ 'hheelllloo'
[1,3]     each (i,v) -> [1-i,v*v]                                   ▸ [9,1]
{a:1,b:3} each (k,v) -> ['▸'+k, k+v]                                ▸ { '▸a': 'a1', '▸b': 'b3' }
```

If the function takes only one argument, 
it is the value/item/character and a single return value is expected.

## for

```kode
x = null
for a in x
    log 'hello'
```

The above code would throw an exception at runtime in CoffeeScript.
**kode** generates code that doesn't fail if x is not an array.

## constructor

```kode
class C
    @: ->
```

is a shortcut for

```kode
class C
    constructor: ->
```

## list comprehension

```kode
l = [1,2,3]
a = [x for x in l]                                                  ▸ [1,2,3]
a = (x for x in l)                                                  ▸ [1,2,3]
```

**kode** doesn't distuinguish between round and square brackets around list comprehensions.

## ternary

```kode
false ? 1 : 2                                                       ▸ 2
```

A nifty `if` `then` `else` shortcut.
It introduces some ambiguity in a few corner cases, which can be resolved by different spacing:

```kode
null ? a: 'b'                                                       ▸ {a:'b'}
```

## old school classes

**kode** gives you two choices for class definitions:

### function

```kode
function ES5
    @: ->
    f: -> 1
```

```js
ES5 = (function ()
{
    function ES5 ()
    {}
    ES5.prototype["f"] = function ()
    {
        return 1
    }
    return ES5
})()
```

### class

```kode
class ES2015
    @: ->
    f: -> 1
```
```js
class ES2015
{
    constructor ()
    {}

    f ()
    {
        return 1
    }
}
```

Both forms can be used in the same module, but obviously not in the same class
hierarchy. 

## optional commata

In **kode**, you don't need to insert commata after number or string literals and POD structures.
Those are all valid expressions:

```kode
a = [ 1 2 3 ]
a = { b:1 c:2 d:3 }
a =   b:1 c:2 d:3
a =   b:[ c:2 'd' 3 ]
a = [ [1 2] [d:3] ]

test 'something' ->
    it 'should' ->

on 'event' @myCallback
```

### function calls without parens

```kode
f a b     ▸ f(a, b)
f a, b    ▸ f(a, b)
f(a, b)   ▸ f(a, b)

f a(b)    ▸ f(a(b))
f(a(b))   ▸ f(a(b))
```

only in top-level function calls can the parens be omitted. 

## use

```kode
use ./utils ▪ kc ke        ▸ import utils from "./utils.js"
                             let kc = utils.kc
                             let ke = utils.ke

use ../kxk ◆ slash nfs     ▸ import slash from "../kxk/slash.js"
                             import nfs from "../kxk/nfs.js"
                             
use fs os                  ▸ import fs from "fs"
                             import os from "os"
```

## ◆dir & ◆file

```kode
log ◆file                  ▸ [source file path]
log ◆dir                   ▸ [source directory]
```

## ◆main

```kode
◆main
    log 'executed as a script'
```

The body only runs when the module is the one node was started with.

## noon

```kode
s = noon a:1 b:2
log s                                   ▸ a   1
                                        ▸ b   2
```

Operator that converts argument into string in [noon](https://github.com/monsterkodi/noon) notation.
Handles recursion, unlike `JSON.stringify`.

## dbg

```kode
myObj = a:1 b:2 c:d:3
dbg myObj                               ▸ file.kode:2:0 myObj
                                        ▸ a   1
                                        ▸ b   2
                                        ▸ c
                                        ▸     d   3
dbg '1st' 0 '2nd' myObj.c               ▸ file.kode:7:0
                                        ▸ 1st 0 2nd d   3
```

Logs file and position followed by arguments in [noon](https://github.com/monsterkodi/noon) notation.
If first argument is an identifier, appends its name to the file position.

## assert

```kode
f = (a) -> ▴ a ; a                      ▸ file.kode:1:11 ▴ assert failed! a
▴ 'good' f(1)                             
▴ 'bad'  f(0)                           ▸ file.kode:3:0 ▴ bad f(0)
```

Logs file position, message and condition code if condition isn't truish. 
If message is omitted, 'assert failed!' will be used.

## profile

```kode
●▸ sunny times

fun = ->                              
    ● funny times                     
    Math.sqrt x for x in 0..100000    
                                      
fun() for i in 1..2                     ▸ funny times 12 ms
                                        ▸ funny times 11 ms
●▪ sunny times                          ▸ sunny times 26 ms
```

Logs time difference between matching `●▸` `●▪` pairs.

`●` is a shortcut that can be used in functions: `●▪` is inserted automatically before the function returns.

`performance.now` is used for the timing and the measurements come with *μs* accuracy.
Due to JavaScripts just in time compilation optimizations, the initial results might be greater than later runs.
    
## copy & clone

```
a = copy b                              # shallow copy of b
a = clone b                             # deep copy of b
```

Operators that return a shallow or deep copy of their argument. 
Only plain Objects, Arrays and Strings are copied. Functions, Maps, Sets, etc. are not copied.

## eql

```
a eql b                                 # deep comparison
```

Does a deep comparison of its operands. 
Only plain Objects, Arrays and Strings are compared.

## tests 

**kode** comes with its own testing framework

```
▸ test
    ▸ sub test
        something      ▸ result
        something else ▸ other result
```

If the `▸` has nothing on its left hand side, it denotes a test section.
Otherwise the expressions on both sides are compared.

## ansi colors

```kode
log Y5(r2('warning!')) ▸ output in dark red on bright yellow
```

**kode** injects color functions if it discovers calls with names like `R1` or `g8`.
Color functions: 'r' 'g' 'b' 'c' 'm' 'y' 'w' for foreground (uppercase for background) and a number between 1 and 8.

## first & last

```kode
a = first [1 2 3]   ▸ 1
b = last [1 2 3]    ▸ 3
```
