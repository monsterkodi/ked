var toExport = {}
var decorated, js, plain, tag, text

import utils from "./utils.js"
let kc = utils.kc

tag = String.fromCodePoint(0xE0041)
toExport["source"] = async function ()
{
    await section("tag characters are stripped before compiling", async function ()
    {
        plain = 'x = 1\n'
        decorated = "x" + tag + " = 1\n"
        compare(kc(plain,'x.kode'),kc(decorated,'x.kode'))
    })
    await section("tag characters do not reach the output", async function ()
    {
        text = "s = 'a" + tag + "b'\n"
        js = kc(text,'x.kode')
        compare(js.includes(tag),false)
    })
}
toExport["source"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zb3VyY2Uua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQU0sWUFBQTtJQUFROztBQUVkLE1BQU0sT0FBTyxjQUFjOzs7OztRQU1uQixRQUFRO1FBQ1IsWUFBWSxNQUFNLE1BQU07UUFFTCxRQUFuQixHQUFHLE1BQU0sVUFBWSxHQUFHLFVBQVU7Ozs7UUFJbEMsT0FBTyxXQUFXLE1BQU07UUFFeEIsS0FBSyxHQUFHLEtBQUs7UUFFSSxRQUFqQixHQUFHLFNBQVMsS0FBTyJ9
//# sourceURL=../../../kode/kode/test/source.kode
