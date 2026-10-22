var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["object"] = async function ()
{
    await section("object", async function ()
    {
        compare(kc('a:1'),'{a:1}')
        compare(kc('{a:1}'),'{a:1}')
        compare(kc('a:1 b:2'),'{a:1,b:2}')
        compare(kc('{a:3 b:4}'),'{a:3,b:4}')
        compare(kc('a:b:c'),'{a:{b:c}}')
        compare(kc('a:b:c,d:e:f'),'{a:{b:c,d:{e:f}}}')
        compare(kc('a:b(c)'),'{a:b(c)}')
        compare(kc('a:b:c d:e:f'),'{a:{b:c,d:{e:f}}}')
        compare(kc('a:b:c(d:e:f)'),'{a:{b:c({d:{e:f}})}}')
        compare(kc('o = { a:1 b:2 c: d:4 e:5 }'),'o = {a:1,b:2,c:{d:4,e:5}}')
        compare(kc('o = noon:1'),'o = {noon:1}')
        compare(kc(`o = 
    a:[1 2 3]
    noon:1`),'o = {a:[1,2,3],noon:1}')
        compare(kc(`o = 
    try: 
        catch:1
    noon: 
        new:2
    switch:
        when:3
    delete:
        typeof:4
    instanceof:
        is:5`),`o = {try:{catch:1},noon:{new:2},switch:{when:3},delete:{typeof:4},instanceof:{is:5}}`)
        compare(kc(`a
    {
        a:1
    }`),`a({a:1})`)
        compare(kc(`a =
    {
        a:1
    }`),`a = {a:1}`)
        compare(kc(`{a:1}
log 3`),`{a:1}
console.log(3)`)
        compare(kc(`o={a:1}
log o`),`o = {a:1}
console.log(o)`)
        compare(kc(`i = y:1
log i`),`i = {y:1}
console.log(i)`)
        compare(kc(`i = y:1 z:2
log i`),`i = {y:1,z:2}
console.log(i)`)
        compare(kc(`u = v:0 w:1; x=y:2`),`u = {v:0,w:1}
x = {y:2}`)
        compare(kc(`i = y:1 z:2; z=a:1
log i`),`i = {y:1,z:2}
z = {a:1}
console.log(i)`)
        compare(kc(`d = 
    a: b:1
    c: d:2`),`d = {a:{b:1},c:{d:2}}`)
        compare(kc(`d = 
    a: b:1
       d:2`),`d = {a:{b:1,d:2}}`)
        compare(kc(`d = a: b:11
    c: d:22`),`d = {a:{b:11},c:{d:22}}`)
        compare(kc(`d = a: b:11
       d:222`),`d = {a:{b:11,d:222}}`)
        compare(kc(`d = a: b:c:d:1
       d:2`),`d = {a:{b:{c:{d:1}},d:2}}`)
        compare(kc(`d = a: b:c:d:1
         d:2`),`d = {a:{b:{c:{d:1},d:2}}}`)
        compare(kc(`d = a: b:c:d:1
           e:2`),`d = {a:{b:{c:{d:1,e:2}}}}`)
        compare(kc(`h =
    j: p:1 w:2
    t: q:3 r:4`),`h = {j:{p:1,w:2},t:{q:3,r:4}}`)
        compare(kc(`h = j: p:1 w:2
    t: q:3 r:4`),`h = {j:{p:1,w:2},t:{q:3,r:4}}`)
        compare(kc(`d =
    delete:delete
    empty:empty
    valid:valid
    noon:noon
    new:new
    is:is`),`d = {delete:delete,empty:empty,valid:valid,noon:noon,new:new,is:is}`)
    })
    await section("stringify", async function ()
    {
        compare(kc("a.b:1"),"{'a.b':1}")
        compare(kc("|:1"),"{'|':1}")
        compare(kc("==:1"),"{'==':1}")
        compare(kc(">=:1"),"{'>=':1}")
        compare(kc("<=:1"),"{'<=':1}")
        compare(kc("!=:1"),"{'!=':1}")
        compare(kc(".:1"),"{'.':1}")
        compare(kc(",:1"),"{',':1}")
        compare(kc(";:1"),"{';':1}")
        compare(kc("*:1"),"{'*':1}")
        compare(kc("+:1"),"{'+':1}")
        compare(kc("-:1"),"{'-':1}")
        compare(kc("/:1"),"{'/':1}")
    })
    await section("assign", async function ()
    {
        compare(kc("{x} = o"),"x = o.x\n")
        compare(kc("{x,y} = o"),"x = o.x\ny = o.y\n")
        compare(kc("{x,y} = require 'sthg'"),"x = require('sthg').x\ny = require('sthg').y\n")
    })
}
toExport["object"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9vYmplY3Qua29kZSJdLCJtYXBwaW5ncyI6IjtPQVFNLFlBQUE7SUFBUTtJQUFHOzs7Ozs7Z0JBTVQsR0FBSSxPQUF3QjtnQkFDNUIsR0FBSSxTQUF3QjtnQkFDNUIsR0FBSSxXQUF3QjtnQkFDNUIsR0FBSSxhQUF3QjtnQkFDNUIsR0FBSSxTQUF3QjtnQkFDNUIsR0FBSSxlQUF3QjtnQkFFNUIsR0FBSSxVQUF3QjtnQkFDNUIsR0FBSSxlQUF3QjtnQkFDNUIsR0FBSSxnQkFBeUI7Z0JBRTdCLEdBQUksOEJBQStCO2dCQUVuQyxHQUFJLGNBQXdCO2dCQUM1QixHQUFJOzthQUlNO2dCQUVWLEdBQUk7Ozs7Ozs7Ozs7ZUFhQTtnQkFJSixHQUFJOzs7UUFNQTtnQkFJSixHQUFJOzs7UUFNQTtnQkFJSixHQUFJO1FBSUE7O2dCQUtKLEdBQUk7UUFJQTs7Z0JBS0osR0FBSTtRQUlBOztnQkFLSixHQUFJO1FBSUE7O2dCQUtKLEdBQUksc0JBR0E7O2dCQUtKLEdBQUk7UUFJQTs7O2dCQU1KLEdBQUk7O2FBS0E7Z0JBSUosR0FBSTs7YUFLQTtnQkFJSixHQUFJO2NBSUE7Z0JBSUosR0FBSTtlQUlBO2dCQUlKLEdBQUk7YUFJQTtnQkFJSixHQUFJO2VBSUE7Z0JBSUosR0FBSTtpQkFJQTtnQkFJSixHQUFJOztpQkFLQTtnQkFJSixHQUFJO2lCQUlBO2dCQUlKLEdBQUk7Ozs7OztZQVNBOzs7O2dCQVlKLEdBQUksU0FBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Z0JBQ3BCLEdBQUksUUFBZ0I7Z0JBQ3BCLEdBQUksUUFBZ0I7Z0JBQ3BCLEdBQUksUUFBZ0I7Z0JBQ3BCLEdBQUksUUFBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Z0JBQ3BCLEdBQUksT0FBZ0I7Ozs7Z0JBVXBCLEdBQUksV0FBZ0M7Z0JBQ3BDLEdBQUksYUFBZ0M7Z0JBQ3BDLEdBQUksMEJBQWdDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/object.kode
