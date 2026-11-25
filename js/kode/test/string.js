var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["string"] = async function ()
{
    await section("unicode", async function ()
    {
        compare(kc('"▾"'),'"▾"')
        compare(kc('cs += "#{s.links[li][0]}#{s.links[li][1]} "'),'cs += `${s.links[li][0]}${s.links[li][1]} `')
    })
    await section("addition", async function ()
    {
        compare(kc("s='x'+'…'"),"s = 'x' + '…'")
        compare(kc("padding + '…'"),"padding + '…'")
        compare(kc("padding+'…'"),"padding + '…'")
        compare(kc("padding+ '…'"),"padding + '…'")
        compare(kc("padding +'…'"),"padding + '…'")
        compare(kc("padding +'s'"),"padding + 's'")
        compare(kc("[a +'s']"),";[a + 's']")
        compare(kc("[a +b]"),";[a,+b]")
        compare(kc("log 'a' +'b'"),"console.log('a' + 'b')")
    })
    await section("triple", async function ()
    {
        compare(ke(`a =\"\"\"
    hello
    \"\"\"`),'hello')
        compare(ke(`a =\"\"\"
hello
    \"\"\"`),'hello')
        compare(ke(`a =\"\"\"hello\"\"\"`),'hello')
        compare(ke(`a =\"\"\"   hello\"\"\"`),'   hello')
        compare(ke(`a =\"\"\"   hello   \"\"\"`),'   hello   ')
        compare(ke(`a =\"\"\"
    hello
world
    \"\"\"`),'    hello\nworld')
        compare(ke(`a =\"\"\"
        hello
    world
    \"\"\"`),'    hello\nworld')
        compare(ke(`a =\"\"\"
        hello
    world
            ugga
    \"\"\"`),`    hello
world
        ugga`)
        compare(ke(`a =\"\"\"heLlo world\"\"\"`),`heLlo world`)
        compare(ke(`a =\"\"\" helLo world\"\"\"`),` helLo world`)
        compare(ke(`a =\"\"\"   hellO world   \"\"\"`),`   hellO world   `)
        compare(ke(`a =\"\"\"   hello World
\"\"\"`),`   hello World`)
        compare(ke(`a =\"\"\"
    
    hullo
    wurld
    
    \"\"\"`),'\nhullo\nwurld\n')
        compare(ke('("""\nclass A\n{\n\n}\n""")'),"class A\n{\n\n}")
        compare(ke('("""\n' + 'class A\n' + '{\n' + '    constructor ()\n' + '    {\n' + '        this.b = this.b.bind(this)\n' + '        this.f()\n' + '    }\n' + '\n' + '    b ()\n' + '    {\n' + '        console.log(1)\n' + '    }\n' + '\n' + '    f ()\n' + '    {\n' + '        var g\n' + '\n' + '        g = (function ()\n' + '        {\n' + '            return this.b()\n' + '        }).bind(this)\n' + '        return g()\n' + '    }\n' + '}\n' + '\n' + '""")'),'class A\n' + '{\n' + '    constructor ()\n' + '    {\n' + '        this.b = this.b.bind(this)\n' + '        this.f()\n' + '    }\n' + '\n' + '    b ()\n' + '    {\n' + '        console.log(1)\n' + '    }\n' + '\n' + '    f ()\n' + '    {\n' + '        var g\n' + '\n' + '        g = (function ()\n' + '        {\n' + '            return this.b()\n' + '        }).bind(this)\n' + '        return g()\n' + '    }\n' + '}\n')
        true
    })
    await section("interpolation", async function ()
    {
        compare(kc("''"),"''")
        compare(kc('"1234#{}890"'),'"1234890"')
        compare(kc('"01234\#{}890"'),'"01234890"')
        compare(kc('"#{1}"'),"`${1}`")
        compare(kc('"#{\'b\'}"'),"`${'b'}`")
        compare(kc('"#{"b"}"'),'`${"b"}`')
        compare(kc('"#{a}"'),"`${a}`")
        compare(kc('log "#{a+1}", "#{a}"'),'console.log(`${a + 1}`,`${a}`)')
        compare(kc('"#{b+2}" ; "#{b}"'),'`${b + 2}`\n`${b}`')
        compare(kc('log "- #{c+3} - #{c}"'),'console.log(`- ${c + 3} - ${c}`)')
        compare(kc('"""tri#{triple}ple""" ; "dou#{double}ble"'),'`tri${triple}ple`\n`dou${double}ble`')
        compare(kc('"#{\'a\'}"'),"`${'a'}`")
        compare(kc('"""#{"a"}"""'),'`${"a"}`')
        compare(kc('"nullcheck in #{stripol ? 123}"'),"`nullcheck in ${(stripol != null ? stripol : 123)}`")
        compare(kc('"""{ok#} #{"well" + "1+\'2\' #{\'omg\'}" + kinda(fukked)}"""'),"`{ok#} ${\"well\" + `1+'2' ${'omg'}` + kinda(fukked)}`")
    })
}
toExport["string"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zdHJpbmcua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNNLFlBQUE7SUFBUTtJQUFHOzs7Ozs7UUFNRSxRQUFYLEdBQUcsT0FBWTtRQUNtQyxRQUFsRCxFQUFHLCtDQUFpRDs7OztRQUtqQyxRQUFuQixHQUFHLGFBQWtCO1FBQ0YsUUFBbkIsR0FBRyxpQkFBa0I7UUFDRixRQUFuQixHQUFHLGVBQWtCO1FBQ0YsUUFBbkIsR0FBRyxnQkFBa0I7UUFDRixRQUFuQixHQUFHLGdCQUFrQjtRQUNGLFFBQW5CLEdBQUcsZ0JBQWtCO1FBSUYsUUFBbkIsR0FBRyxZQUFrQjtRQUNGLFFBQW5CLEdBQUcsVUFBa0I7UUFDRixRQUFuQixHQUFHLGdCQUFrQjs7OztRQVFiLFFBSlIsR0FBSTs7YUFLQTtRQU1JLFFBSlIsR0FBSTs7YUFLQTtRQUlJLFFBRlIsR0FBSSx3QkFHQTtRQUlJLFFBRlIsR0FBSSwyQkFHQTtRQUlJLFFBRlIsR0FBSSw4QkFHQTtRQU9JLFFBTFIsR0FBSTs7O2FBTUE7UUFPSSxRQUxSLEdBQUk7OzthQU1BO1FBUUksUUFOUixHQUFJOzs7O2FBT0E7OztRQVFJLFFBRlIsR0FBSSw4QkFHQTtRQUlJLFFBRlIsR0FBSSwrQkFHQTtRQUlJLFFBRlIsR0FBSSxvQ0FHQTtRQUtJLFFBSFIsR0FBSTtTQUlBO1FBU0ksUUFQUixHQUFJOzs7OzthQVFBO1FBRThCLFFBQWxDLEdBQUksK0JBQWdDO1FBNEJ6QixRQTFCWCxHQUFJLFdBQ0EsY0FDQSxRQUNBLHlCQUNBLFlBQ0EseUNBQ0EsdUJBQ0EsWUFDQSxPQUNBLGVBQ0EsWUFDQSw2QkFDQSxZQUNBLE9BQ0EsZUFDQSxZQUNBLG9CQUNBLE9BQ0EsK0JBQ0EsZ0JBQ0Esa0NBQ0EsNEJBQ0EseUJBQ0EsWUFDQSxRQUNBLE9BQ0EsUUFDQSxjQUNBLFFBQ0EseUJBQ0EsWUFDQSx5Q0FDQSx1QkFDQSxZQUNBLE9BQ0EsZUFDQSxZQUNBLDZCQUNBLFlBQ0EsT0FDQSxlQUNBLFlBQ0Esb0JBQ0EsT0FDQSwrQkFDQSxnQkFDQSxrQ0FDQSw0QkFDQSx5QkFDQSxZQUNBO1FBQ0o7Ozs7UUFJZ0QsUUFBaEQsR0FBRyxNQUFpRDtRQUNKLFFBQWhELEdBQUcsZ0JBQWlEO1FBQ0osUUFBaEQsR0FBRyxrQkFBaUQ7UUFDSixRQUFoRCxHQUFHLFVBQWlEO1FBQ0osUUFBaEQsR0FBRyxjQUFpRDtRQUNKLFFBQWhELEdBQUcsWUFBaUQ7UUFDSixRQUFoRCxHQUFHLFVBQWlEO1FBQ0osUUFBaEQsR0FBRyx3QkFBaUQ7UUFDSixRQUFoRCxHQUFHLHFCQUFpRDtRQUNKLFFBQWhELEdBQUcseUJBQWlEO1FBQ0osUUFBaEQsR0FBRyw2Q0FBaUQ7UUFDSixRQUFoRCxHQUFHLGNBQWlEO1FBQ0osUUFBaEQsR0FBRyxnQkFBaUQ7UUFDSixRQUFoRCxHQUFHLG1DQUFpRDtRQUNlLFFBQW5FLEdBQUcsZ0VBQW1FIn0=
//# sourceURL=../../../kode/kode/test/string.kode
