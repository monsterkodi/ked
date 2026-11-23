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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVwZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9wZXBlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNTLFdBQUE7Ozs7OztRQU1rQixRQUFuQixLQUFLO1FBQ2MsUUFBbkIsS0FBSztRQUNjLFFBQW5CLEtBQUssS0FBa0I7UUFDSixRQUFuQixLQUFLLE1BQWtCO1FBQ0osUUFBbkIsS0FBSyxVQUFrQjtRQUNKLFFBQW5CLEtBQUssZ0JBQWtCOzs7O1FBSUosUUFBbkIsS0FBSyxRQUF3QixNQUFNLElBQUksV0FBWSxJQUFJO1FBQ3BDLFFBQW5CLEtBQUssVUFBd0IsTUFBTSxJQUFJLFVBQVUsTUFBTSxJQUFJLFdBQVksSUFBSSxNQUFNLElBQUk7UUFDbEUsUUFBbkIsS0FBSyxjQUFrQixNQUFNLE1BQU0sSUFBSSxTQUFTLE9BQU8sSUFBSyxLQUFLO1FBQzlDLFFBQW5CLEtBQUssZ0JBQWtCLE1BQU0sTUFBTSxJQUFJLFVBQVUsTUFBTSxJQUFJLFNBQVMsT0FBTyxJQUFJLE1BQUssSUFBSyxLQUFLO1FBQzNFLFFBQW5CLEtBQUssZ0JBQWtCLE1BQU0sTUFBTSxJQUFJLFVBQVUsTUFBTSxJQUFJLFVBQVMsTUFBTSxJQUFJLFNBQVMsS0FBSyxJQUFJLE1BQUssSUFBSSxNQUFLLElBQUssS0FBSztRQUNyRyxRQUFuQixLQUFLLGdCQUFrQixNQUFNLE1BQU0sSUFBSSxVQUFVLE1BQU0sSUFBSSxVQUFTLE1BQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxNQUFLLElBQUksTUFBSyxJQUFLLEtBQUs7Ozs7UUFJdEcsUUFBbEIsS0FBSyxVQUNELE1BQU0sSUFBSSxXQUFXLElBQUksTUFDekIsTUFBTSxJQUFJLFdBQVcsSUFBSTs7OztRQUtULFFBQXBCLEtBQUssWUFDRCxNQUFNLElBQ04sVUFDUSxNQUFNLElBQUksV0FBVyxJQUFJLE1BQ3pCLE1BQU0sSUFBSSxXQUFXLElBQUksTUFFakMsSUFBSTtRQUdjLFFBQXRCLEtBQUssY0FDRCxNQUFNLElBQ04s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
//# sourceURL=../../../kode/kxk/test/pepe.kode
