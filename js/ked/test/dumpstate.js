var toExport = {}
var cells, s

import state from "../edit/state.js"
import mode from "../edit/mode.js"

import dumpstate from "../util/dumpstate.js"

cells = {cols:55,rows:66}
toExport["dumpstate"] = async function ()
{
    await section("a plain state carries its file", async function ()
    {
        s = new state(cells,'plain')
        compare(dumpstate.tags(s,'/tmp/x'),'[file: /tmp/x]')
    })
    await section("the active modes and a pending ex command are shown", async function ()
    {
        await mode.loaded
        s = new state(cells,'modes')
        s.allowedModes.unype = true
        s.allowedModes.novim = true
        s.startMode('unype')
        s.startMode('novim')
        mode.get(s,'novim').ex = 'q'
        compare(dumpstate.tags(s,'/tmp/x'),'[modes: novim unype] [pending: :q] [file: /tmp/x]')
    })
    await section("a changed buffer is dirty", async function ()
    {
        s = new state(cells,'dirty')
        s.clearHistory()
        s.pushState()
        compare(dumpstate.tags(s,'/tmp/x'),'[dirty] [file: /tmp/x]')
    })
}
toExport["dumpstate"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcHN0YXRlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2R1bXBzdGF0ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDYyxZQUFQO09BQWEsV0FBYjs7T0FDTyxnQkFBUDs7QUFFUCxTQUFRLEtBQUssR0FBRyxLQUFLOzs7OztRQU1iLFFBQVEsTUFBTSxNQUFNO2dCQUVwQixVQUFVLEtBQUssRUFBRyxVQUFZOzs7O2NBSTVCLEtBQUs7UUFFUCxRQUFRLE1BQU0sTUFBTTtRQUNwQixFQUFFLGFBQWEsUUFBUTtRQUN2QixFQUFFLGFBQWEsUUFBUTtRQUN2QixFQUFFLFVBQVU7UUFDWixFQUFFLFVBQVU7UUFDWixLQUFLLElBQUksRUFBRyxTQUFTLEtBQUs7Z0JBRTFCLFVBQVUsS0FBSyxFQUFHLFVBQVk7Ozs7UUFJOUIsUUFBUSxNQUFNLE1BQU07UUFDcEIsRUFBRTtRQUNGLEVBQUU7Z0JBRUYsVUFBVSxLQUFLLEVBQUcsVUFBWSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dumpstate.kode
