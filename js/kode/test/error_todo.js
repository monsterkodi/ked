var toExport = {}
import utils from "./utils.js"
let codemsg = utils.codemsg

toExport["error_todo"] = function ()
{
    section("a token on its own", function ()
    {
        codemsg('\\','???')
        codemsg('■','???')
        codemsg('▪','???')
        codemsg('▸','???')
        codemsg('◆','???')
        codemsg('○','???')
        codemsg('●','???')
        codemsg('⮐','???')
        codemsg('->','???')
        codemsg('=>','???')
    })
    section("a keyword with no operand", function ()
    {
        codemsg('break','???')
        codemsg('continue','???')
    })
    section("a keyword on its own line", function ()
    {
        codemsg('x = 1\no f','???')
        codemsg('x = 1\nfrom','???')
    })
    section("a keyword in the wrong place", function ()
    {
        codemsg('a new','???')
        codemsg('a break','???')
        codemsg('a return','???')
        codemsg('d return','???')
        codemsg('m return','???')
        codemsg('s return','???')
        codemsg('t return','???')
        codemsg('x return','???')
        codemsg('a continue','???')
    })
    section("await outside async", function ()
    {
    })
    section("switch with an empty when", function ()
    {
        codemsg('switch x\n    else','???')
    })
    section("an operator the lexer does not have", function ()
    {
        codemsg('a === b','???')
        codemsg('a !== b','???')
        codemsg('a && b','???')
        codemsg('a || b','???')
        codemsg('a <<= b','???')
        codemsg('a >>= b','???')
        codemsg('a >>>= b','???')
        codemsg('a &&= b','???')
        codemsg('a ||= b','???')
        codemsg('a **= b','???')
        codemsg('a &^ b','???')
        codemsg('x = a && b','???')
        codemsg('a === 1','???')
    })
    section("the ? family", function ()
    {
        codemsg('a?b','???')
    })
    section("a reserved word used as a name", function ()
    {
        codemsg('new.a','???')
        codemsg('new()','???')
        codemsg('new = 1','???')
        codemsg('log new','???')
        codemsg('delete','???')
        codemsg('super.a','???')
    })
    section("a word reserved only in a module", function ()
    {
    })
    section("a global and a literal are not reserved words", function ()
    {
    })
    section("postfix on something that cannot take one", function ()
    {
        codemsg('f()++','???')
    })
    section("return in the wrong place", function ()
    {
        codemsg('⮐ ⮐','???')
        codemsg('⮐ x','???')
        codemsg('a ⮐','???')
        codemsg('r ⮐','???')
        codemsg('s ⮐','???')
        codemsg('x ⮐','???')
        codemsg('m\n ⮐','???')
        codemsg('p\n ⮐','???')
        codemsg('t  ⮐','???')
        codemsg('(x) ⮐','???')
        codemsg('f x ⮐','???')
        codemsg('●▸\n \\\n⮐','???')
        codemsg('x = 1\nx ⮐','???')
    })
    section("dots and slices", function ()
    {
        codemsg('...','???')
        codemsg('[1..]','???')
        codemsg('a[..]','???')
        codemsg('x[...]','???')
        codemsg('[1, 2, ...]','???')
    })
    section("malformed numbers", function ()
    {
        codemsg('.5','???')
        codemsg('1..2','???')
    })
    section("this used as a name", function ()
    {
        codemsg('@','???')
        codemsg('@ = 1','???')
    })
    section("assert with nothing to assert", function ()
    {
        codemsg('▴ x','???')
        codemsg('a ▴ "msg"','???')
    })
    section("a property chain on the next line", function ()
    {
        codemsg('a\n    .b','???')
        codemsg('a\n    .b.c','???')
        codemsg('a\n    .b()','???')
        codemsg('x = a\n    .b\n    .c','???')
    })
    section("seen by the fuzzer", function ()
    {
        codemsg('&&\n●','???')
        codemsg('||\n●','???')
        codemsg('●▸ \\','???')
        codemsg("'s' ■",'???')
        codemsg('(x) ▪','???')
        codemsg('&&\n ●','???')
        codemsg('? +\n 0','???')
        codemsg('|| \n ●','???')
        codemsg('~ each','???')
        codemsg('▴ ^ \n●','???')
        codemsg('"str" ◆','???')
        codemsg('ceil a?','???')
        codemsg('class @','???')
        codemsg('class 0','???')
        codemsg('class 4','???')
        codemsg('last a?','???')
        codemsg(', [1, 2]','???')
    })
}
toExport["error_todo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfdG9kby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvZXJyb3JfdG9kby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQXFDUSxRQUFRLEtBQUs7UUFDYixRQUFRLElBQUk7UUFDWixRQUFRLElBQUk7UUFDWixRQUFRLElBQUk7UUFDWixRQUFRLElBQUk7UUFDWixRQUFRLElBQUk7UUFDWixRQUFRLElBQUk7UUFDWixRQUFRLElBQUk7UUFDWixRQUFRLEtBQUs7UUFDYixRQUFRLEtBQUs7Ozs7UUEyQmIsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsV0FBVzs7OztRQUluQixRQUFRLGFBQWE7UUFDckIsUUFBUSxjQUFjOzs7O1FBWXRCLFFBQVEsUUFBUTtRQUVoQixRQUFRLFVBQVU7UUFTbEIsUUFBUSxXQUFXO1FBQ25CLFFBQVEsV0FBVztRQUNuQixRQUFRLFdBQVc7UUFDbkIsUUFBUSxXQUFXO1FBQ25CLFFBQVEsV0FBVztRQUNuQixRQUFRLFdBQVc7UUFDbkIsUUFBUSxhQUFhOzs7Ozs7O1FBZ0NyQixRQUFRLHFCQUFxQjs7OztRQVc3QixRQUFRLFVBQVU7UUFDbEIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsU0FBUztRQUNqQixRQUFRLFNBQVM7UUFDakIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFdBQVc7UUFDbkIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFVBQVU7UUFDbEIsUUFBUSxTQUFTO1FBQ2pCLFFBQVEsYUFBYTtRQUNyQixRQUFRLFVBQVU7Ozs7UUFLbEIsUUFBUSxNQUFNOzs7O1FBd0JkLFFBQVEsUUFBUTtRQUNoQixRQUFRLFFBQVE7UUFDaEIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsVUFBVTtRQUlsQixRQUFRLFNBQVM7UUFDakIsUUFBUSxVQUFVOzs7Ozs7Ozs7O1FBMENsQixRQUFRLFFBQVE7Ozs7UUFJaEIsUUFBUSxNQUFNO1FBQ2QsUUFBUSxNQUFNO1FBQ2QsUUFBUSxNQUFNO1FBQ2QsUUFBUSxNQUFNO1FBQ2QsUUFBUSxNQUFNO1FBQ2QsUUFBUSxNQUFNO1FBQ2QsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsUUFBUTtRQUNoQixRQUFRLE9BQU87UUFDZixRQUFRLFFBQVE7UUFDaEIsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsYUFBYTtRQUNyQixRQUFRLGFBQWE7Ozs7UUFJckIsUUFBUSxNQUFNO1FBQ2QsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsUUFBUTtRQUNoQixRQUFRLFNBQVM7UUFDakIsUUFBUSxjQUFjOzs7O1FBSXRCLFFBQVEsS0FBSztRQUNiLFFBQVEsT0FBTzs7OztRQUlmLFFBQVEsSUFBSTtRQUNaLFFBQVEsUUFBUTs7OztRQUloQixRQUFRLE1BQU07UUFDZCxRQUFRLFlBQVk7Ozs7UUFJcEIsUUFBUSxZQUFZO1FBQ3BCLFFBQVEsY0FBYztRQUN0QixRQUFRLGNBQWM7UUFDdEIsUUFBUSx3QkFBd0I7Ozs7UUFJaEMsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsUUFBUTtRQUNoQixRQUFRLFFBQVE7UUFDaEIsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsUUFBUTtRQUNoQixRQUFRLFNBQVM7UUFDakIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFNBQVM7UUFDakIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFVBQVU7UUFDbEIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFVBQVU7UUFDbEIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsV0FBVyJ9
//# sourceURL=file://kode/kode/test/error_todo.kode
