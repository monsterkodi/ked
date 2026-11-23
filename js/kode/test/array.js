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
    })
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
        compare(kc('[a.b c.d e] = f()'),'var _a_ = f(); a.b = _a_[0]; c.d = _a_[1]; e = _a_[2]\n')
        compare(kc('[a[0] b] = f()'),'var _a_ = f(); a[0] = _a_[0]; b = _a_[1]\n')
        compare(kc('[@x @y z] = f()'),'var _a_ = f(); this.x = _a_[0]; this.y = _a_[1]; z = _a_[2]\n')
        compare(kc('[from to] = [to from]'),'var _a_ = [to,from]; from = _a_[0]; to = _a_[1]\n')
        compare(kc('[[a b] c] = f()'),'var _a_ = f(); var _b_ = _a_[0]; a = _b_[0]; b = _b_[1]; c = _a_[1]\n')
        compare(ke(`a = b:1
c = d:2
[a.b c.d] = [c.d a.b]
[a.b c.d]`),[2,1])
        compare(ke(`c = [0 0]
[c[0] c[1]] = [3 4]
c`),[3,4])
        compare(ke(`[[a b] c] = [[1 2] 3]
[c b a]`),[3,2,1])
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2FycmF5LmtvZGUiXSwibWFwcGluZ3MiOiI7T0FDTSxZQUFBO0lBQVE7SUFBRzs7Ozs7O1FBTVcsUUFBcEIsR0FBRyxRQUFtQjtRQUNGLFFBQXBCLEdBQUcsV0FBbUI7UUFDRixRQUFwQixHQUFHLFdBQW1CO1FBQ0YsUUFBcEIsR0FBRyxZQUFtQjtRQUNGLFFBQXBCLEdBQUcsWUFBbUI7UUFDRixRQUFwQixHQUFHLGNBQW1CO1FBQ0YsUUFBcEIsR0FBRyxrQkFBbUI7UUFDRixRQUFwQixHQUFHLGlCQUFtQjtRQUNGLFFBQXBCLEdBQUcsaUJBQW1COzs7O1FBSUYsUUFBaEIsR0FBRyxXQUFlO1FBQ0YsUUFBaEIsR0FBRyxZQUFlO1FBQ0YsUUFBaEIsR0FBRyxTQUFlO1FBQ0YsUUFBaEIsR0FBRyxTQUFlO1FBQ0YsUUFBaEIsR0FBRyxXQUFlO1FBS1YsUUFIUixHQUFJO29CQUlBOzs7OztRQU9vQixRQUF4QixHQUFHLHFCQUF1QjtRQUNGLFFBQXhCLEdBQUcsc0JBQXVCOzs7O1FBSVIsUUFBdEIsR0FBSSxXQUFvQjtRQUNGLFFBQXRCLEdBQUksWUFBb0I7UUFDRixRQUF0QixHQUFJLGVBQW9CO1FBQ0YsUUFBdEIsR0FBSSxnQkFBb0I7UUFFVCxRQUFmLEdBQUksWUFDQTtRQUlZLFFBQWhCLEdBQUksYUFDQTtRQUlVLFFBQWQsR0FBSSxXQUFZOzs7O1FBSVEsUUFBeEIsR0FBSSxXQUFzQjtRQUNGLFFBQXhCLEdBQUksWUFBc0I7UUFDRixRQUF4QixHQUFJLFlBQXNCO1FBQ0YsUUFBeEIsR0FBSSxXQUFzQjtRQUNGLFFBQXhCLEdBQUksYUFBc0I7UUFDRixRQUF4QixHQUFJLGNBQXNCO1FBQ0YsUUFBeEIsR0FBSSxnQkFBc0I7UUFFRixRQUF4QixHQUFJLGFBQXNCO1FBQ0YsUUFBeEIsR0FBSSxlQUFzQjtRQUNGLFFBQXhCLEdBQUksZ0JBQXNCO1FBQ0YsUUFBeEIsR0FBSSxpQkFBc0I7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
//# sourceURL=../../../kode/kode/test/array.kode
