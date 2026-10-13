var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

import slash from "../../kxk/slash.js"

toExport["misc"] = function ()
{
    section("dir", function ()
    {
        compare(kc('◆dir',import.meta.url.slice(7)),'_k_.dir()')
    })
    section("file", function ()
    {
        compare(kc('◆file',import.meta.url.slice(7)),'_k_.file()')
    })
    section("main", function ()
    {
        compare(kc(`◆main
    log 'hello'
    log 'main'`),`if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    console.log('hello')
    console.log('main')
}`)
    })
    section("this", function ()
    {
        compare(kc('@'),'this')
        compare(kc('@a'),'this.a')
        compare(kc('@a.b'),'this.a.b')
        compare(kc('@a.b()'),'this.a.b()')
        compare(kc('t = @'),'t = this')
        compare(kc('f(1,@)'),'f(1,this)')
        compare(kc('@[1]'),'this[1]')
        compare(kc('@[2]()'),'this[2]()')
        compare(kc('@[3](4)'),'this[3](4)')
        compare(kc('@[5] 6'),'this[5](6)')
        compare(kc('return @ if a'),`if (a)
{
    return this
}`)
        compare(kc("a.on 'b' @c"),"a.on('b',this.c)")
        compare(kc("a.on 'b' @c"),"a.on('b',this.c)")
        compare(kc(`if @
    1`),`if (this)
{
    1
}`)
        compare(kc(`if @ then 1`),`if (this)
{
    1
}`)
        compare(kc(`a @, file`),`a(this,file)`)
        compare(kc(`a = @ == b`),`a = this === b`)
    })
    section("try", function ()
    {
        compare(kc(`try 
    somethg
catch
    blark`),`try
{
    somethg
}
catch (err)
{
    blark
}`)
        compare(kc(`try 
    something
catch err
    error err`),`try
{
    something
}
catch (err)
{
    console.error(err)
}`)
        compare(kc(`try 
    sthelse
catch err
    error err
finally
    cleanup`),`try
{
    sthelse
}
catch (err)
{
    console.error(err)
}
finally
{
    cleanup
}`)
        section("try returns", function ()
        {
            compare(kc(`a = ->
    try
        p
    catch err
       err`),`
a = function ()
{
    try
    {
        return p
    }
    catch (err)
    {
        return err
    }
}`)
        })
        section("if try returns", function ()
        {
            compare(kc(`a = ->
    if 1
        try
            p
        catch err
           err`),`
a = function ()
{
    if (1)
    {
        try
        {
            return p
        }
        catch (err)
        {
            return err
        }
    }
}`)
        })
    })
    section("throw", function ()
    {
        compare(kc("throw 'msg'"),"throw 'msg'")
    })
    section("delete", function ()
    {
        compare(kc("delete a"),"delete a")
        compare(kc("delete @a"),"delete this.a")
        compare(kc("delete a.b"),"delete a.b")
        compare(kc('[delete a, b]'),';[delete a,b]')
        compare(kc('delete a.b.c'),'delete a.b.c')
        compare(kc('[delete a.b, a:b]'),';[delete a.b,{a:b}]')
        compare(kc('delete a.b == false'),'delete a.b === false')
    })
    section("require", function ()
    {
        compare(kc("noon  = require 'noon'"),"noon = require('noon')")
        compare(kc(`slash = require 'kslash'
kstr  = require 'kstr'`),`slash = require('kslash')
kstr = require('kstr')`)
        compare(kc(`if true
    {m,n} = require 'bla'`),`if (true)
{
    m = require('bla').m
    n = require('bla').n

}`)
        compare(kc(`{ empty, noon, valid } = kxk`),`empty = kxk.empty
noon = kxk.noon
valid = kxk.valid
`)
    })
    section("in condition", function ()
    {
        compare(kc("a in l"),"_k_.in(a,l)")
        compare(kc("a in 'xyz'"),"_k_.in(a,'xyz')")
        compare(kc("a in [1,2,3]"),"_k_.in(a,[1,2,3])")
        compare(kc("a not in b"),"!(_k_.in(a,b))")
        compare(kc("a not in [3,4]"),"!(_k_.in(a,[3,4]))")
        compare(kc(`if a in l then 1`),`if (_k_.in(a,l))
{
    1
}`)
        compare(kc(`if not a in l then 2`),`if (!(_k_.in(a,l)))
{
    2
}`)
        compare(kc(`if a in l
    2`),`if (_k_.in(a,l))
{
    2
}`)
    })
    section("primes", function ()
    {
        compare(ke(`eratosthenes = (n) ->
    
    prime = [x < 2 and 1 or 0 for x in 0..n]
    
    for i in 0..Math.sqrt n
        
        if prime[i] == 0
            
            l = 2

            while true
                
                break if n < j = i * l++

                prime[j] = 1

    prime = prime each (i, p) -> [i parseInt(p ? 0 : i)]
    prime = prime.filter (p) -> p
                
eratosthenes 100`),[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97])
    })
}
toExport["misc"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvbWlzYy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztnQkFxQlEsR0FBRyxPQUFRLE9BQU8sS0FBSyxVQUFJLElBQU87Ozs7Z0JBSWxDLEdBQUcsUUFBUSxPQUFPLEtBQUssVUFBSSxJQUFPOzs7O2dCQUlsQyxHQUFJOztpQkFJTTs7Ozs7Ozs7Z0JBZ0JWLEdBQUksS0FBb0I7Z0JBQ3hCLEdBQUksTUFBb0I7Z0JBQ3hCLEdBQUksUUFBb0I7Z0JBQ3hCLEdBQUksVUFBb0I7Z0JBQ3hCLEdBQUksU0FBb0I7Z0JBQ3hCLEdBQUksVUFBb0I7Z0JBQ3hCLEdBQUksUUFBb0I7Z0JBQ3hCLEdBQUksVUFBb0I7Z0JBQ3hCLEdBQUksV0FBb0I7Z0JBQ3hCLEdBQUksVUFBb0I7Z0JBRXhCLEdBQUksaUJBQ0E7Ozs7Z0JBT0osR0FBSSxlQUFvQjtnQkFDeEIsR0FBSSxlQUFvQjtnQkFFeEIsR0FBSTtRQUlBOzs7O2dCQU9KLEdBQUksZUFHQTs7OztnQkFPSixHQUFJLGFBR0E7Z0JBSUosR0FBSSxjQUdBOzs7O2dCQVlKLEdBQUk7OztZQU1BOzs7Ozs7OztnQkFXSixHQUFJOzs7Z0JBTUE7Ozs7Ozs7O2dCQVdKLEdBQUk7Ozs7O2NBUUE7Ozs7Ozs7Ozs7Ozs7O29CQXVCQSxHQUFJOzs7O2FBT0E7Ozs7Ozs7Ozs7Ozs7OztvQkFpQkosR0FBSTs7Ozs7aUJBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBMEJSLEdBQUksZUFBa0I7Ozs7Z0JBVXRCLEdBQUksWUFBZ0M7Z0JBQ3BDLEdBQUksYUFBZ0M7Z0JBQ3BDLEdBQUksY0FBZ0M7Z0JBRXBDLEdBQUksaUJBQWdDO2dCQUNwQyxHQUFJLGdCQUFnQztnQkFDcEMsR0FBSSxxQkFBZ0M7Z0JBQ3BDLEdBQUksdUJBQWdDOzs7O2dCQVVwQyxHQUFJLDBCQUFnQztnQkFDcEMsR0FBSTt5QkFJQTs7Z0JBS0osR0FBSTs0QkFJQTs7Ozs7O2dCQVNKLEdBQUksZ0NBR0E7Ozs7Ozs7Z0JBZUosR0FBSSxVQUF3QjtnQkFDNUIsR0FBSSxjQUF3QjtnQkFDNUIsR0FBSSxnQkFBd0I7Z0JBQzVCLEdBQUksY0FBd0I7Z0JBQzVCLEdBQUksa0JBQXdCO2dCQUU1QixHQUFJLG9CQUdBOzs7O2dCQU9KLEdBQUksd0JBR0E7Ozs7Z0JBT0osR0FBSTtRQUlBOzs7Ozs7O2dCQWlCSixHQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQXVCRSxFQUFHLEVBQUcsRUFBRyxFQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FDMUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcifQ==
//# sourceURL=kode/kode/test/misc.kode
