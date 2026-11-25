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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zdHJpbmcua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNNLFlBQUE7SUFBUTtJQUFHOzs7Ozs7UUFNRSxRQUFYLEdBQUcsT0FBWTtRQUNtQyxRQUFsRCxFQUFHLCtDQUFpRDs7OztRQUtqQyxRQUFuQixHQUFHLGFBQWtCO1FBQ0YsUUFBbkIsR0FBRyxpQkFBa0I7UUFDRixRQUFuQixHQUFHLGVBQWtCO1FBQ0YsUUFBbkIsR0FBRyxnQkFBa0I7UUFDRixRQUFuQixHQUFHLGdCQUFrQjtRQUNGLFFBQW5CLEdBQUcsZ0JBQWtCOzs7O1FBUWIsUUFKUixHQUFJOzthQUtBO1FBTUksUUFKUixHQUFJOzthQUtBO1FBSUksUUFGUixHQUFJLHdCQUdBO1FBSUksUUFGUixHQUFJLDJCQUdBO1FBSUksUUFGUixHQUFJLDhCQUdBO1FBT0ksUUFMUixHQUFJOzs7YUFNQTtRQU9JLFFBTFIsR0FBSTs7O2FBTUE7UUFRSSxRQU5SLEdBQUk7Ozs7YUFPQTs7O1FBUUksUUFGUixHQUFJLDhCQUdBO1FBSUksUUFGUixHQUFJLCtCQUdBO1FBSUksUUFGUixHQUFJLG9DQUdBO1FBS0ksUUFIUixHQUFJO1NBSUE7UUFTSSxRQVBSLEdBQUk7Ozs7O2FBUUE7UUFFOEIsUUFBbEMsR0FBSSwrQkFBZ0M7UUE0QnpCLFFBMUJYLEdBQUksV0FDQSxjQUNBLFFBQ0EseUJBQ0EsWUFDQSx5Q0FDQSx1QkFDQSxZQUNBLE9BQ0EsZUFDQSxZQUNBLDZCQUNBLFlBQ0EsT0FDQSxlQUNBLFlBQ0Esb0JBQ0EsT0FDQSwrQkFDQSxnQkFDQSxrQ0FDQSw0QkFDQSx5QkFDQSxZQUNBLFFBQ0EsT0FDQSxRQUNBLGNBQ0EsUUFDQSx5QkFDQSxZQUNBLHlDQUNBLHVCQUNBLFlBQ0EsT0FDQSxlQUNBLFlBQ0EsNkJBQ0EsWUFDQSxPQUNBLGVBQ0EsWUFDQSxvQkFDQSxPQUNBLCtCQUNBLGdCQUNBLGtDQUNBLDRCQUNBLHlCQUNBLFlBQ0E7UUFDSjs7OztRQUlnRCxRQUFoRCxHQUFHLE1BQWlEO1FBQ0osUUFBaEQsR0FBRyxnQkFBaUQ7UUFDSixRQUFoRCxHQUFHLGtCQUFpRDtRQUNKLFFBQWhELEdBQUcsVUFBaUQ7UUFDSixRQUFoRCxHQUFHLGNBQWlEO1FBQ0osUUFBaEQsR0FBRyxZQUFpRDtRQUNKLFFBQWhELEdBQUcsVUFBaUQ7UUFDSixRQUFoRCxHQUFHLHdCQUFpRDtRQUNKLFFBQWhELEdBQUcscUJBQWlEO1FBQ0osUUFBaEQsR0FBRyx5QkFBaUQ7UUFDSixRQUFoRCxHQUFHLDZDQUFpRDtRQUNKLFFBQWhELEdBQUcsY0FBaUQ7UUFDSixRQUFoRCxHQUFHLGdCQUFpRDtRQUNKLFFBQWhELEdBQUcsbUNBQWlEO1FBQ2UsUUFBbkUsR0FBRyxnRUFBbUUifQ==
//# sourceURL=../../../kode/kode/test/string.kode
