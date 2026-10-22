var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["array"] = async function ()
{
    await section("index", async function ()
    {
        compare(kc('a[1]'),'a[1]')
        compare(kc('a[1][2]'),'a[1][2]')
        compare(kc('a[1][2]'),'a[1][2]')
        compare(kc('[1,2][1]'),';[1,2][1]')
        compare(kc('[1 2][1]'),';[1,2][1]')
        compare(kc('{a:1}["a"]'),'{a:1}["a"]')
        compare(kc(';[d,k,v,e] = f'),'var _a_ = f; d = _a_[0]; k = _a_[1]; v = _a_[2]; e = _a_[3]\n')
        compare(kc('[d,k,v,e] = f'),'var _a_ = f; d = _a_[0]; k = _a_[1]; v = _a_[2]; e = _a_[3]\n')
        compare(kc('[d k v e] = f'),'var _a_ = f; d = _a_[0]; k = _a_[1]; v = _a_[2]; e = _a_[3]\n')
        await section("slice", async function ()
        {
            compare(kc('a[0..1]'),'a.slice(0, 2)')
            compare(kc('a[0...1]'),'a.slice(0, 1)')
            compare(kc('a[-1]'),'a.slice(-1)[0]')
            compare(kc('a[-2]'),'a.slice(-2,-1)[0]')
            compare(kc('a[-100]'),'a.slice(-100,-99)[0]')
            compare(kc(`blocks[-1].tokens.push block
blocks.push block`),`blocks.slice(-1)[0].tokens.push(block)
blocks.push(block)`)
        })
        await section("call", async function ()
        {
            compare(kc('b[Math.floor n/7]'),'b[Math.floor(n / 7)]')
            compare(kc('b[Math.floor(n/7)]'),'b[Math.floor(n / 7)]')
        })
    })
    await section("range", async function ()
    {
        compare(kc('[1..10]'),';[1,2,3,4,5,6,7,8,9,10]')
        compare(kc('[1...10]'),';[1,2,3,4,5,6,7,8,9]')
        compare(kc('r = [1..10]'),'r = [1,2,3,4,5,6,7,8,9,10]')
        compare(kc('r = [1...10]'),'r = [1,2,3,4,5,6,7,8,9]')
        compare(kc('[1..100]'),`;(function() { var r = []; for (var i = 1; i <= 100; i++){ r.push(i); } return r; }).apply(this)`)
        compare(kc('[1...100]'),`;(function() { var r = []; for (var i = 1; i < 100; i++){ r.push(i); } return r; }).apply(this)`)
        compare(kc('[-3..3]'),';[-3,-2,-1,0,1,2,3]')
    })
    await section("slice", async function ()
    {
        compare(kc("a[1..4]"),"a.slice(1, 5)")
        compare(kc("a[1...4]"),"a.slice(1, 4)")
        compare(kc("a[1...a]"),"a.slice(1, typeof a === 'number' ? a : -1)")
        compare(kc("a[1..a]"),"a.slice(1, typeof a === 'number' ? a+1 : Infinity)")
        compare(kc("a[1..a.b]"),"a.slice(1, typeof a.b === 'number' ? a.b+1 : Infinity)")
        compare(kc("a[1..a[2]]"),"a.slice(1, typeof a[2] === 'number' ? a[2]+1 : Infinity)")
        compare(kc("a[1..a[3].b]"),"a.slice(1, typeof a[3].b === 'number' ? a[3].b+1 : Infinity)")
        compare(kc("b[c...-1]"),"b.slice(c, -1)")
        compare(kc("b[c.d...-1]"),"b.slice(c.d, -1)")
        compare(kc("b[c[0]...-1]"),"b.slice(c[0], -1)")
        compare(kc("b[c[0].d..-1]"),"b.slice(c[0].d)")
        compare(kc("s[i+1..]"),"s.slice(i + 1)")
        compare(kc("s[i+1...]"),"s.slice(i + 1, -1)")
        compare(kc("o[0..-1]"),"o.slice(0)")
        compare(kc("q[..-1]"),"q.slice(0)")
        compare(kc("p[0..]"),"p.slice(0)")
        compare(kc("r[..]"),"r.slice(0)")
        compare(kc("s[ic...c+index]"),"s.slice(ic, c + index)")
        compare(kc("s[...i] + s[i+1..]"),"s.slice(0, typeof i === 'number' ? i : -1) + s.slice(i + 1)")
        compare(ke("'abc'[0..1]"),"ab")
        compare(ke("'abc'[0..2]"),"abc")
        compare(ke("'xyz'[0..]"),"xyz")
        compare(ke("'uvw'[0...]"),"uv")
    })
    await section("array", async function ()
    {
        compare(kc('[1]'),';[1]')
        compare(kc('[1,2]'),';[1,2]')
        compare(kc('[1 2]'),';[1,2]')
        compare(kc('[a,b]'),';[a,b]')
        compare(kc('[a b]'),';[a,b]')
        compare(kc('[ "1" ]'),';["1"]')
        compare(kc("[ '1' ]"),";['1']")
        compare(kc('["1" "2"]'),';["1","2"]')
        compare(kc("['1' '2']"),";['1','2']")
        compare(kc('["1" , "2"]'),';["1","2"]')
        compare(kc("['1' , '2']"),";['1','2']")
        compare(kc("[['1'] , [2]]"),";[['1'],[2]]")
        compare(kc('[[]]'),';[[]]')
        compare(kc('[{}]'),';[{}]')
        compare(kc('[[[]]]'),';[[[]]]')
        compare(kc('[[[] []]]'),';[[[],[]]]')
        compare(kc('[[[],[]]]'),';[[[],[]]]')
        compare(kc('[[[][]]]'),';[[[],[]]]')
        compare(kc('[[[1]], 1]'),';[[[1]],1]')
        compare(kc('[b(c)]'),';[b(c)]')
        compare(kc('[b c]'),';[b,c]')
        compare(kc("['1' , a, true, false, null, undefined]"),";['1',a,true,false,null,undefined]")
        compare(kc("['1' a true false null undefined]"),";['1',a,true,false,null,undefined]")
        compare(kc("a = [1 2 - 3 x(4 + 5 'a' b('c'))]"),"a = [1,2 - 3,x(4 + 5,'a',b('c'))]")
        compare(kc("a = [1 2 - 3 x 4 + 5 'a' b 'c']"),"a = [1,2 - 3,x,4 + 5,'a',b,'c']")
        compare(kc(`['1' "2" 3 4.5 [] {} true false null undefined NaN Infinity yes no]`),`;['1',"2",3,4.5,[],{},true,false,null,undefined,NaN,Infinity,true,false]`)
    })
    await section("objects", async function ()
    {
        compare(kc('[a:b]'),';[{a:b}]')
        compare(kc(`a = [{
        a:1
        b:2
        c:3
    }{
        x:1
        y:2
        z:3
    }]`),`a = [{a:1,b:2,c:3},{x:1,y:2,z:3}]`)
        compare(kc(`a = [
        a:4
        b:5
    ,
        x:6
        y:7
    ]`),`a = [{a:4,b:5},{x:6,y:7}]`)
        compare(kc("[a:1 b:[]]"),";[{a:1,b:[]}]")
        compare(kc("[a:2 b:[1]]"),";[{a:2,b:[1]}]")
        compare(kc("[e:'e' a:[s:0 c:'C']]"),";[{e:'e',a:[{s:0,c:'C'}]}]")
    })
    await section("function", async function ()
    {
        compare(kc('[a(-3)]'),';[a(-3)]')
        compare(kc('[a -3]'),';[a,-3]')
        compare(kc('[a-3]'),';[a - 3]')
        compare(kc('[a - 3]'),';[a - 3]')
    })
    await section("assign", async function ()
    {
        compare(kc('[l, r] = a'),'var _a_ = a; l = _a_[0]; r = _a_[1]\n')
        compare(kc('[l r] = a'),'var _a_ = a; l = _a_[0]; r = _a_[1]\n')
        compare(ke(`a = [1,2]
[a, b] = a
[b,a]`),[2,1])
        compare(ke(`a = [1 2]
[a b] = a
[b a]`),[2,1])
        compare(ke(`a = [1,2,3]
[a, a, a] = a
a`),3)
        compare(ke(`a = [-1 -2 -3]
[a a a] = a
a`),-3)
    })
    await section("blocks", async function ()
    {
        compare(kc(`[
    1,2
]`),`;[1,2]`)
        compare(kc(`[
    1 2
]`),`;[1,2]`)
        compare(kc(`[
    1,
    2
]`),`;[1,2]`)
        compare(kc(`[
    1
    2
]`),`;[1,2]`)
        compare(kc(`[
    [
        0
        1
    ]
    2
]`),`;[[0,1],2]`)
        compare(kc(`a = [
        [
            0
            1
        ]
        2
    ]`),`a = [[0,1],2]`)
        compare(kc(`a =
    [
        [
            0
            1
        ]
        2
    ]`),`a = [[0,1],2]`)
        compare(kc(`[
    b
        [
            0
            1
        ]
    2
]`),`;[b([0,1]),2]`)
        compare(kc(`a
    [
        b
            [
                0
                1
            ]
        2
    ]`),`a([b([0,1]),2])`)
        compare(kc(`->
    [
        1
        2
    ]`),`(function ()
{
    return [1,2]
})`)
        compare(kc(`l = [
     1 2 3 'a'
     c:
      d:3
      e:4
     f:
      'b'
     'c'
     l =
        1
    ]`),`l = [1,2,3,'a',{c:{d:3,e:4},f:'b'},'c',l = 1]`)
        compare(kc(`l = [[ [
        [[
          1
          2
          ]
         ]
        ]]   ]`),`l = [[[[[1,2]]]]]`)
        compare(kc(`l = [[1
       2]]`),`l = [[1,2]]`)
        compare(kc(`l = [[1
  2]]`),`l = [[1,2]]`)
        compare(kc(`l = [[1
    2]
      ]`),`l = [[1,2]]`)
        compare(kc(`l = [[1 2]
    ]`),`l = [[1,2]]`)
    })
}
toExport["array"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2FycmF5LmtvZGUiXSwibWFwcGluZ3MiOiI7T0FRTSxZQUFBO0lBQVE7SUFBRzs7Ozs7O2dCQVlULEdBQUcsUUFBbUI7Z0JBQ3RCLEdBQUcsV0FBbUI7Z0JBQ3RCLEdBQUcsV0FBbUI7Z0JBQ3RCLEdBQUcsWUFBbUI7Z0JBQ3RCLEdBQUcsWUFBbUI7Z0JBQ3RCLEdBQUcsY0FBbUI7Z0JBQ3RCLEdBQUcsa0JBQW1CO2dCQUN0QixHQUFHLGlCQUFtQjtnQkFDdEIsR0FBRyxpQkFBbUI7OztvQkFJbEIsR0FBRyxXQUFlO29CQUNsQixHQUFHLFlBQWU7b0JBQ2xCLEdBQUcsU0FBZTtvQkFDbEIsR0FBRyxTQUFlO29CQUNsQixHQUFHLFdBQWU7b0JBRWxCLEdBQUk7b0JBSUE7Ozs7O29CQU9KLEdBQUcscUJBQXVCO29CQUMxQixHQUFHLHNCQUF1Qjs7Ozs7Z0JBVTlCLEdBQUksV0FBb0I7Z0JBQ3hCLEdBQUksWUFBb0I7Z0JBQ3hCLEdBQUksZUFBb0I7Z0JBQ3hCLEdBQUksZ0JBQW9CO2dCQUV4QixHQUFJLFlBQ0E7Z0JBSUosR0FBSSxhQUNBO2dCQUlKLEdBQUksV0FBWTs7OztnQkFVaEIsR0FBSSxXQUFzQjtnQkFDMUIsR0FBSSxZQUFzQjtnQkFDMUIsR0FBSSxZQUFzQjtnQkFDMUIsR0FBSSxXQUFzQjtnQkFDMUIsR0FBSSxhQUFzQjtnQkFDMUIsR0FBSSxjQUFzQjtnQkFDMUIsR0FBSSxnQkFBc0I7Z0JBRTFCLEdBQUksYUFBc0I7Z0JBQzFCLEdBQUksZUFBc0I7Z0JBQzFCLEdBQUksZ0JBQXNCO2dCQUMxQixHQUFJLGlCQUFzQjtnQkFDMUIsR0FBSSxZQUFzQjtnQkFDMUIsR0FBSSxhQUFzQjtnQkFFMUIsR0FBSSxZQUFzQjtnQkFDMUIsR0FBSSxXQUFzQjtnQkFDMUIsR0FBSSxVQUFzQjtnQkFDMUIsR0FBSSxTQUFzQjtnQkFFMUIsR0FBSSxtQkFBc0I7Z0JBRzFCLEdBQUksc0JBQXVCO2dCQUUzQixHQUFJLGVBQXNCO2dCQUMxQixHQUFJLGVBQXNCO2dCQUUxQixHQUFJLGNBQXNCO2dCQUMxQixHQUFJLGVBQXNCOzs7O2dCQVUxQixHQUFJLE9BQXNCO2dCQUMxQixHQUFJLFNBQXNCO2dCQUMxQixHQUFJLFNBQXNCO2dCQUMxQixHQUFJLFNBQXNCO2dCQUMxQixHQUFJLFNBQXNCO2dCQUMxQixHQUFJLFdBQXNCO2dCQUMxQixHQUFJLFdBQXNCO2dCQUMxQixHQUFJLGFBQXNCO2dCQUMxQixHQUFJLGFBQXNCO2dCQUMxQixHQUFJLGVBQXNCO2dCQUMxQixHQUFJLGVBQXNCO2dCQUMxQixHQUFJLGlCQUFzQjtnQkFDMUIsR0FBSSxRQUFzQjtnQkFDMUIsR0FBSSxRQUFzQjtnQkFDMUIsR0FBSSxVQUFzQjtnQkFDMUIsR0FBSSxhQUFzQjtnQkFDMUIsR0FBSSxhQUFzQjtnQkFDMUIsR0FBSSxZQUFzQjtnQkFDMUIsR0FBSSxjQUFzQjtnQkFDMUIsR0FBSSxVQUFzQjtnQkFDMUIsR0FBSSxTQUFzQjtnQkFFMUIsR0FBSSwyQ0FDQTtnQkFFSixHQUFJLHFDQUNBO2dCQUVKLEdBQUkscUNBQ0E7Z0JBRUosR0FBSSxtQ0FDQTtnQkFFSixHQUFJLHVFQUNBOzs7O2dCQVVKLEdBQUksU0FBc0I7Z0JBRTFCLEdBQUk7Ozs7Ozs7O1NBV0E7Z0JBSUosR0FBSTs7Ozs7O1FBU0E7Z0JBSUosR0FBSSxjQUEwQjtnQkFDOUIsR0FBSSxlQUEwQjtnQkFDOUIsR0FBSSx5QkFBMEI7Ozs7Z0JBVTlCLEdBQUksV0FBYztnQkFDbEIsR0FBSSxVQUFjO2dCQUNsQixHQUFJLFNBQWM7Z0JBQ2xCLEdBQUksV0FBYzs7OztnQkFVbEIsR0FBSSxjQUFvQjtnQkFDeEIsR0FBSSxhQUFvQjtnQkFFeEIsR0FBSTs7U0FLQyxFQUFFO2dCQUVQLEdBQUk7O1NBS0MsRUFBRTtnQkFFUCxHQUFJOztJQUtBO2dCQUVKLEdBQUk7O0lBS0E7Ozs7Z0JBVUosR0FBSTs7SUFLQTtnQkFJSixHQUFJOztJQUtBO2dCQUlKLEdBQUk7OztJQU1BO2dCQUlKLEdBQUk7OztJQU1BO2dCQUlKLEdBQUk7Ozs7OztJQVNBO2dCQUlKLEdBQUk7Ozs7OztRQVNBO2dCQUlKLEdBQUk7Ozs7Ozs7UUFVQTtnQkFJSixHQUFJOzs7Ozs7O0lBVUE7Z0JBSUosR0FBSTs7Ozs7Ozs7UUFXQTtnQkFJSixHQUFJOzs7O1FBT0E7Ozs7Z0JBT0osR0FBSTs7Ozs7Ozs7OztRQWFBO2dCQUlKLEdBQUk7Ozs7OztpQkFTQTtnQkFJSixHQUFJO2FBSUE7Z0JBSUosR0FBSTtRQUlBO2dCQUlKLEdBQUk7O1VBS0E7Z0JBSUosR0FBSTtRQUlBIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/array.kode
