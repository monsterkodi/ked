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
        compare(kc("{x} = o"),";({x} = o)")
        compare(kc("{x,y} = o"),";({x, y} = o)")
        compare(kc("{x,y} = require 'sthg'"),";({x, y} = require('sthg'))")
        compare(kc("{a b} = o"),";({a, b} = o)")
        compare(kc("{a, b} = o"),";({a, b} = o)")
        compare(kc("{a:x b} = o"),";({a: x, b} = o)")
        compare(kc("{from to} = r"),";({from, to} = r)")
        compare(kc("x = 1\n{a b} = o"),"x = 1\n;({a, b} = o)")
        compare(ke("o = a:1 b:2\ng = ->\n    {a b} = o\n    a+b\ng()"),3)
        compare(kc("{empty noon} = kxk"),";({empty, noon} = kxk)")
        compare(ke("n = 0\nf = -> n++; {a:1 b:2}\n{a b:c} = f()\n[a c n]"),[1,2,1])
        compare(kc("x = {a:1}"),"x = {a:1}")
        compare(kc("x = {a:1}['a']"),"x = {a:1}['a']")
    })
}
toExport["object"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9vYmplY3Qua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNNLFlBQUE7SUFBUTtJQUFHOzs7Ozs7UUFNZSxRQUF4QixHQUFJLE9BQXdCO1FBQ0osUUFBeEIsR0FBSSxTQUF3QjtRQUNKLFFBQXhCLEdBQUksV0FBd0I7UUFDSixRQUF4QixHQUFJLGFBQXdCO1FBQ0osUUFBeEIsR0FBSSxTQUF3QjtRQUNKLFFBQXhCLEdBQUksZUFBd0I7UUFDSixRQUF4QixHQUFJLFVBQXdCO1FBQ0osUUFBeEIsR0FBSSxlQUF3QjtRQUNILFFBQXpCLEdBQUksZ0JBQXlCO1FBRUksUUFBakMsR0FBSSw4QkFBK0I7UUFFWCxRQUF4QixHQUFJLGNBQXdCO1FBS3BCLFFBSlIsR0FBSTs7YUFJTTtRQWNGLFFBWlIsR0FBSTs7Ozs7Ozs7OztlQWFBO1FBU0ksUUFMUixHQUFJOzs7UUFNQTtRQVNJLFFBTFIsR0FBSTs7O1FBTUE7UUFPSSxRQUhSLEdBQUk7UUFJQTs7UUFRSSxRQUhSLEdBQUk7UUFJQTs7UUFRSSxRQUhSLEdBQUk7UUFJQTs7UUFRSSxRQUhSLEdBQUk7UUFJQTs7UUFPSSxRQUZSLEdBQUksc0JBR0E7O1FBUUksUUFIUixHQUFJO1FBSUE7OztRQVVJLFFBSlIsR0FBSTs7YUFLQTtRQVFJLFFBSlIsR0FBSTs7YUFLQTtRQU9JLFFBSFIsR0FBSTtjQUlBO1FBT0ksUUFIUixHQUFJO2VBSUE7UUFPSSxRQUhSLEdBQUk7YUFJQTtRQU9JLFFBSFIsR0FBSTtlQUlBO1FBT0ksUUFIUixHQUFJO2lCQUlBO1FBUUksUUFKUixHQUFJOztpQkFLQTtRQU9JLFFBSFIsR0FBSTtpQkFJQTtRQVlJLFFBUlIsR0FBSTs7Ozs7O1lBU0E7Ozs7UUFNWSxRQUFoQixHQUFJLFNBQWdCO1FBQ0osUUFBaEIsR0FBSSxPQUFnQjtRQUNKLFFBQWhCLEdBQUksUUFBZ0I7UUFDSixRQUFoQixHQUFJLFFBQWdCO1FBQ0osUUFBaEIsR0FBSSxRQUFnQjtRQUNKLFFBQWhCLEdBQUksUUFBZ0I7UUFDSixRQUFoQixHQUFJLE9BQWdCO1FBQ0osUUFBaEIsR0FBSSxPQUFnQjtRQUNKLFFBQWhCLEdBQUksT0FBZ0I7UUFDSixRQUFoQixHQUFJLE9BQWdCO1FBQ0osUUFBaEIsR0FBSSxPQUFnQjtRQUNKLFFBQWhCLEdBQUksT0FBZ0I7UUFDSixRQUFoQixHQUFJLE9BQWdCOzs7O1FBSVksUUFBaEMsR0FBSSxXQUFnQztRQUNKLFFBQWhDLEdBQUksYUFBZ0M7UUFDSixRQUFoQyxHQUFJLDBCQUFnQztRQUNKLFFBQWhDLEdBQUksYUFBZ0M7UUFDSixRQUFoQyxHQUFJLGNBQWdDO1FBQ0osUUFBaEMsR0FBSSxlQUFnQztRQUNKLFFBQWhDLEdBQUksaUJBQWdDO1FBQ0osUUFBaEMsR0FBSSxvQkFBZ0M7UUFFMkIsUUFBL0QsR0FBSSxvREFBNkQ7UUFDakMsUUFBaEMsR0FBSSxzQkFBZ0M7UUFFeUIsUUFBN0QsR0FBSSx5REFBNEQsRUFBRSxFQUFFO1FBRXBDLFFBQWhDLEdBQUksYUFBZ0M7UUFDSixRQUFoQyxHQUFJLGtCQUFnQyJ9
//# sourceURL=../../../kode/kode/test/object.kode
