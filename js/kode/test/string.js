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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zdHJpbmcua29kZSJdLCJtYXBwaW5ncyI6IjtPQVFNLFlBQUE7SUFBUTtJQUFHOzs7Ozs7Z0JBTVQsR0FBRyxPQUFZO2dCQUNmLEVBQUcsK0NBQWlEOzs7O2dCQW1CcEQsR0FBSTs7YUFLQTtnQkFFSixHQUFJOzthQUtBO2dCQUVKLEdBQUksd0JBR0E7Z0JBRUosR0FBSSwyQkFHQTtnQkFFSixHQUFJLDhCQUdBO2dCQUVKLEdBQUk7OzthQU1BO2dCQUVKLEdBQUk7OzthQU1BO2dCQUVKLEdBQUk7Ozs7YUFPQTs7O2dCQU1KLEdBQUksOEJBR0E7Z0JBRUosR0FBSSwrQkFHQTtnQkFFSixHQUFJLG9DQUdBO2dCQUVKLEdBQUk7U0FJQTtnQkFFSixHQUFJOzs7OzthQVFBO2dCQUVKLEdBQUksK0JBQWdDO2dCQUVwQyxHQUFJLFdBQ0EsY0FDQSxRQUNBLHlCQUNBLFlBQ0EseUNBQ0EsdUJBQ0EsWUFDQSxPQUNBLGVBQ0EsWUFDQSw2QkFDQSxZQUNBLE9BQ0EsZUFDQSxZQUNBLG9CQUNBLE9BQ0EsK0JBQ0EsZ0JBQ0Esa0NBQ0EsNEJBQ0EseUJBQ0EsWUFDQSxRQUNBLE9BQ0EsUUFDQSxjQUNBLFFBQ0EseUJBQ0EsWUFDQSx5Q0FDQSx1QkFDQSxZQUNBLE9BQ0EsZUFDQSxZQUNBLDZCQUNBLFlBQ0EsT0FDQSxlQUNBLFlBQ0Esb0JBQ0EsT0FDQSwrQkFDQSxnQkFDQSxrQ0FDQSw0QkFDQSx5QkFDQSxZQUNBO1FBQ0o7Ozs7Z0JBVUEsR0FBRyxNQUFpRDtnQkFDcEQsR0FBRyxnQkFBaUQ7Z0JBQ3BELEdBQUcsa0JBQWlEO2dCQUNwRCxHQUFHLFVBQWlEO2dCQUNwRCxHQUFHLGNBQWlEO2dCQUNwRCxHQUFHLFlBQWlEO2dCQUNwRCxHQUFHLFVBQWlEO2dCQUNwRCxHQUFHLHdCQUFpRDtnQkFDcEQsR0FBRyxxQkFBaUQ7Z0JBQ3BELEdBQUcseUJBQWlEO2dCQUNwRCxHQUFHLDZDQUFpRDtnQkFDcEQsR0FBRyxjQUFpRDtnQkFDcEQsR0FBRyxnQkFBaUQ7Z0JBQ3BELEdBQUcsbUNBQWlEO2dCQUNwRCxHQUFHLGdFQUFtRSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/string.kode
