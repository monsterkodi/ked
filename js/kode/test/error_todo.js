var toExport = {}
import utils from "./utils.js"
let codemsg = utils.codemsg

toExport["error_todo"] = function ()
{
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
    section("switch with an empty when", function ()
    {
        codemsg('switch x\n    else','???')
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
    section("postfix on something that cannot take one", function ()
    {
        codemsg('f()++','???')
    })
    section("return", function ()
    {
        codemsg('⮐','???')
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
        codemsg('1..2','???')
    })
    section("this used as a name", function ()
    {
        codemsg('@','???')
        codemsg('@ = 1','???')
    })
    section("assert with nothing to assert", function ()
    {
        codemsg('a ▴ "msg"','???')
    })
    section("check what this actually does right now", function ()
    {
    })
    section("a property chain on the next line, TBD: error or missing feature?", function ()
    {
        codemsg('a\n    .b','???')
        codemsg('a\n    .b.c','???')
        codemsg('a\n    .b()','???')
        codemsg('x = a\n    .b\n    .c','???')
    })
    section("seen by the fuzzer", function ()
    {
        codemsg('●▸ \\','???')
        codemsg('? +\n 0','???')
        codemsg('~ each','???')
        codemsg('▴ ^ \n●','???')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfdG9kby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvZXJyb3JfdG9kby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQXNCUSxRQUFRLFFBQVE7UUFDaEIsUUFBUSxXQUFXOzs7O1FBSW5CLFFBQVEsYUFBYTtRQUNyQixRQUFRLGNBQWM7Ozs7UUFJdEIsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFdBQVc7UUFDbkIsUUFBUSxXQUFXO1FBQ25CLFFBQVEsV0FBVztRQUNuQixRQUFRLFdBQVc7UUFDbkIsUUFBUSxXQUFXO1FBQ25CLFFBQVEsV0FBVztRQUNuQixRQUFRLGFBQWE7Ozs7UUFJckIsUUFBUSxxQkFBcUI7Ozs7UUFJN0IsUUFBUSxNQUFNOzs7O1FBSWQsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsUUFBUTtRQUNoQixRQUFRLFVBQVU7UUFDbEIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsU0FBUztRQUNqQixRQUFRLFVBQVU7Ozs7UUFJbEIsUUFBUSxRQUFROzs7O1FBSWhCLFFBQVEsSUFBSTtRQUNaLFFBQVEsTUFBTTtRQUNkLFFBQVEsTUFBTTtRQUNkLFFBQVEsTUFBTTtRQUNkLFFBQVEsTUFBTTtRQUNkLFFBQVEsTUFBTTtRQUNkLFFBQVEsTUFBTTtRQUNkLFFBQVEsUUFBUTtRQUNoQixRQUFRLFFBQVE7UUFDaEIsUUFBUSxPQUFPO1FBQ2YsUUFBUSxRQUFRO1FBQ2hCLFFBQVEsUUFBUTtRQUNoQixRQUFRLGFBQWE7UUFDckIsUUFBUSxhQUFhOzs7O1FBSXJCLFFBQVEsTUFBTTtRQUNkLFFBQVEsUUFBUTtRQUNoQixRQUFRLFFBQVE7UUFDaEIsUUFBUSxTQUFTO1FBQ2pCLFFBQVEsY0FBYztRQUN0QixRQUFRLE9BQU87Ozs7UUFJZixRQUFRLElBQUk7UUFDWixRQUFRLFFBQVE7Ozs7UUFJaEIsUUFBUSxZQUFZOzs7Ozs7O1FBT3BCLFFBQVEsWUFBWTtRQUNwQixRQUFRLGNBQWM7UUFDdEIsUUFBUSxjQUFjO1FBQ3RCLFFBQVEsd0JBQXdCOzs7O1FBSWhDLFFBQVEsUUFBUTtRQUNoQixRQUFRLFVBQVU7UUFDbEIsUUFBUSxTQUFTO1FBQ2pCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFVBQVU7UUFDbEIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsVUFBVTtRQUNsQixRQUFRLFVBQVU7UUFDbEIsUUFBUSxVQUFVO1FBQ2xCLFFBQVEsV0FBVyJ9
//# sourceURL=file://kode/kode/test/error_todo.kode
