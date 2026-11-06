var toExport = {}
import tester from "../tester.js"

import klor from "../../kxk/klor.js"

toExport["summary"] = async function ()
{
    await section("module times are names in medium blue and milliseconds in dark blue", async function ()
    {
        compare(tester.timesText([{name:'kxk',ms:200},{name:'kode',ms:20}]),' ' + klor.b3('kxk') + ' ' + klor.b1(200) + '  ' + klor.b3('kode') + ' ' + klor.b1(20) + ' ')
    })
    await section("no module times add nothing", async function ()
    {
        compare(tester.timesText([]),'')
    })
}
toExport["summary"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC90ZXN0ZXIua29kZSJdLCJtYXBwaW5ncyI6IjtPQUFPLGFBQUE7O09BQ1MsV0FBTjs7Ozs7O2dCQU1GLE9BQU8sWUFBWSxLQUFLLE1BQU0sR0FBRyxNQUFNLEtBQUssT0FBTyxHQUFHLE1BQVEsTUFBTSxLQUFLLEdBQUcsU0FBUyxNQUFNLEtBQUssR0FBRyxPQUFPLE9BQU8sS0FBSyxHQUFHLFVBQVUsTUFBTSxLQUFLLEdBQUcsTUFBTTs7OztnQkFJdkosT0FBTyxjQUFnQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/tester.kode
