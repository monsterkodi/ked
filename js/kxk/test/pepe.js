var toExport = {}
var cb

import pepe from "../pepe.js"

toExport["pepe"] = async function ()
{
    await section("simple", async function ()
    {
        compare(pepe(1),[])
        compare(pepe(null),[])
        compare(pepe(""),[''])
        compare(pepe(" "),[' '])
        compare(pepe("A B C"),['A B C'])
        compare(pepe(" s p a c e "),[" s p a c e "])
    })
    await section("brackets", async function ()
    {
        compare(pepe("()"),[{start:'(',content:[],end:')'}])
        compare(pepe("(())"),[{start:'(',content:[{start:'(',content:[],end:')'}],end:')'}])
        compare(pepe("A ( B ) C"),['A ',{start:'(',content:[' B '],end:')'},' C'])
        compare(pepe("A ({ B }) C"),['A ',{start:'(',content:[{start:'{',content:[' B '],end:'}'}],end:')'},' C'])
        compare(pepe("A ({[B]}) C"),['A ',{start:'(',content:[{start:'{',content:[{start:'[',content:['B'],end:']'}],end:'}'}],end:')'},' C'])
        compare(pepe("A [[[B]]] C"),['A ',{start:'[',content:[{start:'[',content:[{start:'[',content:['B'],end:']'}],end:']'}],end:']'},' C'])
    })
    await section("multiple", async function ()
    {
        compare(pepe("()[]"),[{start:'(',content:[],end:')'},{start:'[',content:[],end:']'}])
    })
    await section("nested multiple", async function ()
    {
        compare(pepe("{()[]}"),[{start:'{',content:[{start:'(',content:[],end:')'},{start:'[',content:[],end:']'}],end:'}'}])
        compare(pepe("{[()()]}"),[{start:'{',content:[{start:'[',content:[{start:'(',content:[],end:')'},{start:'(',content:[],end:')'}],end:']'}],end:'}'}])
    })
    await section("unbalanced", async function ()
    {
        compare(pepe("("),{unbalanced:[{content:[]},{start:'(',content:[]}]})
        compare(pepe(";(("),{unbalanced:[{content:[';']},{start:'(',content:[]},{start:'(',content:[]}]})
        compare(pepe(";(8("),{unbalanced:[{content:[';']},{start:'(',content:['8']},{start:'(',content:[]}]})
        compare(pepe(";(8)("),{unbalanced:[{content:[';',{start:'(',content:['8'],end:')'}]},{start:'(',content:[]}]})
        compare(pepe(";(8)(xxx"),{unbalanced:[{content:[';',{start:'(',content:['8'],end:')'}]},{start:'(',content:[]}],tail:'xxx'})
    })
    await section("mismatch", async function ()
    {
        compare(pepe("}"),{mismatch:[{content:[]}],tail:'}'})
        compare(pepe(")"),{mismatch:[{content:[]}],tail:')'})
        compare(pepe("]"),{mismatch:[{content:[]}],tail:']'})
        compare(pepe("(])"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:'])'})
        compare(pepe("(]"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:']'})
        compare(pepe("(]xxx"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:']xxx'})
        compare(pepe("(xxx]"),{mismatch:[{content:[]},{start:'(',content:['xxx']}],tail:']'})
    })
    await section("strings", async function ()
    {
        compare(pepe("''"),[{start:"'",content:[],end:"'"}])
        compare(pepe("'x'"),[{start:"'",content:['x'],end:"'"}])
        compare(pepe("'"),{unbalanced:[{content:[]},{start:"'",content:[]}]})
        compare(pepe('"'),{unbalanced:[{content:[]},{start:'"',content:[]}]})
        compare(pepe("'()'"),[{start:"'",content:['()'],end:"'"}])
        compare(pepe("'(]}'"),[{start:"'",content:['(]}'],end:"'"}])
        compare(pepe("'\"'"),[{start:"'",content:['"'],end:"'"}])
        compare(pepe("'\"\"\"'"),[{start:"'",content:['"""'],end:"'"}])
        compare(pepe("str: '}])([{'"),['str: ',{start:"'",content:['}])([{'],end:"'"}])
    })
    await section("depepe", async function ()
    {
        cb = function (s)
        {
            return s.toLowerCase()
        }
        compare(pepe.depepe(pepe("A ( B ) C"),cb),"A ( b ) C")
        compare(pepe.depepe(pepe("A ({ B }) C"),cb),"A ({ b }) C")
    })
    await section("pairs", async function ()
    {
        compare(pepe.pairs(""),[])
        compare(pepe.pairs("[]"),[{start:'[',rng:[0,1],end:']'}])
        compare(pepe.pairs("[()]"),[{start:'[',rng:[0,3],end:']'},{start:'(',rng:[1,2],end:')'}])
        compare(pepe.pairs("[()]{''}"),[{start:'[',rng:[0,3],end:']'},{start:'(',rng:[1,2],end:')'},{start:'{',rng:[4,7],end:'}'},{start:"'",rng:[5,6],end:"'"}])
        compare(pepe.pairs("([()]{''})"),[{start:'(',rng:[0,9],end:')'},{start:'[',rng:[1,4],end:']'},{start:'(',rng:[2,3],end:')'},{start:'{',rng:[5,8],end:'}'},{start:"'",rng:[6,7],end:"'"}])
        compare(pepe.pairs("some ( nested [ stuff ] )"),[{start:'(',rng:[5,24],end:')'},{start:'[',rng:[14,22],end:']'}])
    })
}
toExport["pepe"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVwZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9wZXBlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQVFTLFdBQUE7Ozs7OztnQkFZRCxLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsS0FBSyxLQUFrQjtnQkFDdkIsS0FBSyxNQUFrQjtnQkFDdkIsS0FBSyxVQUFrQjtnQkFDdkIsS0FBSyxnQkFBa0I7Ozs7Z0JBVXZCLEtBQUssUUFBd0IsTUFBTSxJQUFJLFdBQVksSUFBSTtnQkFDdkQsS0FBSyxVQUF3QixNQUFNLElBQUksVUFBVSxNQUFNLElBQUksV0FBWSxJQUFJLE1BQU0sSUFBSTtnQkFDckYsS0FBSyxjQUFrQixNQUFNLE1BQU0sSUFBSSxTQUFTLE9BQU8sSUFBSyxLQUFLO2dCQUNqRSxLQUFLLGdCQUFrQixNQUFNLE1BQU0sSUFBSSxVQUFVLE1BQU0sSUFBSSxTQUFTLE9BQU8sSUFBSSxNQUFLLElBQUssS0FBSztnQkFDOUYsS0FBSyxnQkFBa0IsTUFBTSxNQUFNLElBQUksVUFBVSxNQUFNLElBQUksVUFBUyxNQUFNLElBQUksU0FBUyxLQUFLLElBQUksTUFBSyxJQUFJLE1BQUssSUFBSyxLQUFLO2dCQUN4SCxLQUFLLGdCQUFrQixNQUFNLE1BQU0sSUFBSSxVQUFVLE1BQU0sSUFBSSxVQUFTLE1BQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxNQUFLLElBQUksTUFBSyxJQUFLLEtBQUs7Ozs7Z0JBVXhILEtBQUssVUFDRCxNQUFNLElBQUksV0FBVyxJQUFJLE1BQ3pCLE1BQU0sSUFBSSxXQUFXLElBQUk7Ozs7Z0JBSzdCLEtBQUssWUFDRCxNQUFNLElBQ04sVUFDUSxNQUFNLElBQUksV0FBVyxJQUFJLE1BQ3pCLE1BQU0sSUFBSSxXQUFXLElBQUksTUFFakMsSUFBSTtnQkFHUixLQUFLLGNBQ0QsTUFBTSxJQUNOLFVBQ0ksTUFBTSxJQUNOLFVBQ1EsTUFBTSxJQUFJLFdBQVcsSUFBSSxNQUN6QixNQUFNLElBQUksV0FBVyxJQUFJLE1BRWpD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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/pepe.kode
