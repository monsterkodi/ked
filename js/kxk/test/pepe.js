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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVwZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9wZXBlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztnQkFvQlEsS0FBSztnQkFDTCxLQUFLO2dCQUNMLEtBQUssS0FBa0I7Z0JBQ3ZCLEtBQUssTUFBa0I7Z0JBQ3ZCLEtBQUssVUFBa0I7Z0JBQ3ZCLEtBQUssZ0JBQWtCOzs7O2dCQVV2QixLQUFLLFFBQXdCLE1BQU0sSUFBSSxXQUFZLElBQUk7Z0JBQ3ZELEtBQUssVUFBd0IsTUFBTSxJQUFJLFVBQVUsTUFBTSxJQUFJLFdBQVksSUFBSSxNQUFNLElBQUk7Z0JBQ3JGLEtBQUssY0FBa0IsTUFBTSxNQUFNLElBQUksU0FBUyxPQUFPLElBQUssS0FBSztnQkFDakUsS0FBSyxnQkFBa0IsTUFBTSxNQUFNLElBQUksVUFBVSxNQUFNLElBQUksU0FBUyxPQUFPLElBQUksTUFBSyxJQUFLLEtBQUs7Z0JBQzlGLEtBQUssZ0JBQWtCLE1BQU0sTUFBTSxJQUFJLFVBQVUsTUFBTSxJQUFJLFVBQVMsTUFBTSxJQUFJLFNBQVMsS0FBSyxJQUFJLE1BQUssSUFBSSxNQUFLLElBQUssS0FBSztnQkFDeEgsS0FBSyxnQkFBa0IsTUFBTSxNQUFNLElBQUksVUFBVSxNQUFNLElBQUksVUFBUyxNQUFNLElBQUksU0FBUyxLQUFLLElBQUksTUFBSyxJQUFJLE1BQUssSUFBSyxLQUFLOzs7O2dCQVV4SCxLQUFLLFVBQ0QsTUFBTSxJQUFJLFdBQVcsSUFBSSxNQUN6QixNQUFNLElBQUksV0FBVyxJQUFJOzs7O2dCQUs3QixLQUFLLFlBQ0QsTUFBTSxJQUNOLFVBQ1EsTUFBTSxJQUFJLFdBQVcsSUFBSSxNQUN6QixNQUFNLElBQUksV0FBVyxJQUFJLE1BRWpDLElBQUk7Z0JBR1IsS0FBSyxjQUNELE1BQU0sSUFDTixVQUNJLE1BQU0sSUFDTixVQUNRLE1BQU0sSUFBSSxXQUFXLElBQUksTUFDekIsTUFBTSxJQUFJLFdBQVcsSUFBSSxNQUVqQyxJQUFJLE1B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
//# sourceURL=file://kode/kxk/test/pepe.kode
