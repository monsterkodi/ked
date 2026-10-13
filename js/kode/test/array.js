var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["array"] = function ()
{
    section("index", function ()
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
        section("slice", function ()
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
        section("call", function ()
        {
            compare(kc('b[Math.floor n/7]'),'b[Math.floor(n / 7)]')
            compare(kc('b[Math.floor(n/7)]'),'b[Math.floor(n / 7)]')
        })
    })
    section("range", function ()
    {
        compare(kc('[1..10]'),';[1,2,3,4,5,6,7,8,9,10]')
        compare(kc('[1...10]'),';[1,2,3,4,5,6,7,8,9]')
        compare(kc('r = [1..10]'),'r = [1,2,3,4,5,6,7,8,9,10]')
        compare(kc('r = [1...10]'),'r = [1,2,3,4,5,6,7,8,9]')
        compare(kc('[1..100]'),`;(function() { var r = []; for (var i = 1; i <= 100; i++){ r.push(i); } return r; }).apply(this)`)
        compare(kc('[1...100]'),`;(function() { var r = []; for (var i = 1; i < 100; i++){ r.push(i); } return r; }).apply(this)`)
        compare(kc('[-3..3]'),';[-3,-2,-1,0,1,2,3]')
    })
    section("slice", function ()
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
    section("array", function ()
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
    section("objects", function ()
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
    section("function", function ()
    {
        compare(kc('[a(-3)]'),';[a(-3)]')
        compare(kc('[a -3]'),';[a,-3]')
        compare(kc('[a-3]'),';[a - 3]')
        compare(kc('[a - 3]'),';[a - 3]')
    })
    section("assign", function ()
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
    section("blocks", function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2FycmF5LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztnQkFvQlEsR0FBRyxRQUFtQjtnQkFDdEIsR0FBRyxXQUFtQjtnQkFDdEIsR0FBRyxXQUFtQjtnQkFDdEIsR0FBRyxZQUFtQjtnQkFDdEIsR0FBRyxZQUFtQjtnQkFDdEIsR0FBRyxjQUFtQjtnQkFDdEIsR0FBRyxrQkFBbUI7Z0JBQ3RCLEdBQUcsaUJBQW1CO2dCQUN0QixHQUFHLGlCQUFtQjs7O29CQUlsQixHQUFHLFdBQWU7b0JBQ2xCLEdBQUcsWUFBZTtvQkFDbEIsR0FBRyxTQUFlO29CQUNsQixHQUFHLFNBQWU7b0JBQ2xCLEdBQUcsV0FBZTtvQkFFbEIsR0FBSTtvQkFJQTs7Ozs7b0JBT0osR0FBRyxxQkFBdUI7b0JBQzFCLEdBQUcsc0JBQXVCOzs7OztnQkFVOUIsR0FBSSxXQUFvQjtnQkFDeEIsR0FBSSxZQUFvQjtnQkFDeEIsR0FBSSxlQUFvQjtnQkFDeEIsR0FBSSxnQkFBb0I7Z0JBRXhCLEdBQUksWUFDQTtnQkFJSixHQUFJLGFBQ0E7Z0JBSUosR0FBSSxXQUFZOzs7O2dCQVVoQixHQUFJLFdBQXNCO2dCQUMxQixHQUFJLFlBQXNCO2dCQUMxQixHQUFJLFlBQXNCO2dCQUMxQixHQUFJLFdBQXNCO2dCQUMxQixHQUFJLGFBQXNCO2dCQUMxQixHQUFJLGNBQXNCO2dCQUMxQixHQUFJLGdCQUFzQjtnQkFFMUIsR0FBSSxhQUFzQjtnQkFDMUIsR0FBSSxlQUFzQjtnQkFDMUIsR0FBSSxnQkFBc0I7Z0JBQzFCLEdBQUksaUJBQXNCO2dCQUMxQixHQUFJLFlBQXNCO2dCQUMxQixHQUFJLGFBQXNCO2dCQUUxQixHQUFJLFlBQXNCO2dCQUMxQixHQUFJLFdBQXNCO2dCQUMxQixHQUFJLFVBQXNCO2dCQUMxQixHQUFJLFNBQXNCO2dCQUUxQixHQUFJLG1CQUFzQjtnQkFHMUIsR0FBSSxzQkFBdUI7Z0JBRTNCLEdBQUksZUFBc0I7Z0JBQzFCLEdBQUksZUFBc0I7Z0JBRTFCLEdBQUksY0FBc0I7Z0JBQzFCLEdBQUksZUFBc0I7Ozs7Z0JBVTFCLEdBQUksT0FBc0I7Z0JBQzFCLEdBQUksU0FBc0I7Z0JBQzFCLEdBQUksU0FBc0I7Z0JBQzFCLEdBQUksU0FBc0I7Z0JBQzFCLEdBQUksU0FBc0I7Z0JBQzFCLEdBQUksV0FBc0I7Z0JBQzFCLEdBQUksV0FBc0I7Z0JBQzFCLEdBQUksYUFBc0I7Z0JBQzFCLEdBQUksYUFBc0I7Z0JBQzFCLEdBQUksZUFBc0I7Z0JBQzFCLEdBQUksZUFBc0I7Z0JBQzFCLEdBQUksaUJBQXNCO2dCQUMxQixHQUFJLFFBQXNCO2dCQUMxQixHQUFJLFFBQXNCO2dCQUMxQixHQUFJLFVBQXNCO2dCQUMxQixHQUFJLGFBQXNCO2dCQUMxQixHQUFJLGFBQXNCO2dCQUMxQixHQUFJLFlBQXNCO2dCQUMxQixHQUFJLGNBQXNCO2dCQUMxQixHQUFJLFVBQXNCO2dCQUMxQixHQUFJLFNBQXNCO2dCQUUxQixHQUFJLDJDQUNBO2dCQUVKLEdBQUkscUNBQ0E7Z0JBRUosR0FBSSxxQ0FDQTtnQkFFSixHQUFJLG1DQUNBO2dCQUVKLEdBQUksdUVBQ0E7Ozs7Z0JBVUosR0FBSSxTQUFzQjtnQkFFMUIsR0FBSTs7Ozs7Ozs7U0FXQTtnQkFJSixHQUFJOzs7Ozs7UUFTQTtnQkFJSixHQUFJLGNBQTBCO2dCQUM5QixHQUFJLGVBQTBCO2dCQUM5QixHQUFJLHlCQUEwQjs7OztnQkFVOUIsR0FBSSxXQUFjO2dCQUNsQixHQUFJLFVBQWM7Z0JBQ2xCLEdBQUksU0FBYztnQkFDbEIsR0FBSSxXQUFjOzs7O2dCQVVsQixHQUFJLGNBQW9CO2dCQUN4QixHQUFJLGFBQW9CO2dCQUV4QixHQUFJOztTQUtDLEVBQUU7Z0JBRVAsR0FBSTs7U0FLQyxFQUFFO2dCQUVQLEdBQUk7O0lBS0E7Z0JBRUosR0FBSTs7SUFLQTs7OztnQkFVSixHQUFJOztJQUtBO2dCQUlKLEdBQUk7O0lBS0E7Z0JBSUosR0FBSTs7O0lBTUE7Z0JBSUosR0FBSTs7O0lBTUE7Z0JBSUosR0FBSTs7Ozs7O0lBU0E7Z0JBSUosR0FBSTs7Ozs7O1FBU0E7Z0JBSUosR0FBSTs7Ozs7OztRQVVBO2dCQUlKLEdBQUk7Ozs7Ozs7SUFVQTtnQkFJSixHQUFJOzs7Ozs7OztRQVdBO2dCQUlKLEdBQUk7Ozs7UUFPQTs7OztnQkFPSixHQUFJOzs7Ozs7Ozs7O1FBYUE7Z0JBSUosR0FBSTs7Ozs7O2lCQVNBO2dCQUlKLEdBQUk7YUFJQTtnQkFJSixHQUFJO1FBSUE7Z0JBSUosR0FBSTs7VUFLQTtnQkFJSixHQUFJO1FBSUEifQ==
//# sourceURL=kode/kode/test/array.kode
