var toExport = {}
var e, h, setup

import kxk from "../../kxk.js"
let sleep = kxk.sleep

import harness from "../util/harness.js"

import fileeditor from "../view/editor/fileeditor.js"


setup = function ()
{
    var e, h, store

    store = {}
    global.ked_session = {get:function (key, def)
    {
        var _11_37_

        return ((_11_37_=store[key]) != null ? _11_37_ : def)
    },set:function (key, value)
    {
        return store[key] = value
    }}
    h = new harness({cols:40,rows:12})
    h.t.cellsz = [10,20]
    e = new fileeditor(h.screen,'test_fileeditor')
    e.layout(0,0,40,12)
    h.t.out = []
    return [h,e]
}
toExport["fileeditor"] = async function ()
{
    await section("a cell rect is covered by a transparent overlay", async function ()
    {
        var _a_ = setup(); h = _a_[0]; e = _a_[1]

        e.onCellsRect({x:2,y:1,w:3,h:4})
        compare(h.t.written().includes("\x1b[2;8H"),true)
        await sleep(10)
        delete global.ked_session
    })
    await section("an empty rect places no overlay", async function ()
    {
        var _b_ = setup(); h = _b_[0]; e = _b_[1]

        e.onCellsRect({x:2,y:1,w:0,h:4})
        compare(h.t.written().includes('a=p'),false)
        await sleep(10)
        delete global.ked_session
    })
}
toExport["fileeditor"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWVkaXRvci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9maWxlZWRpdG9yLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNVLFVBQUE7SUFBWTs7T0FDRCxjQUFkOztPQUNjLGlCQUFUOzs7QUFFWjs7OztJQUVJO0lBRUEsT0FBTyxlQUNILGNBQU0sS0FBSTs7Ozt5QkFBUSxNQUFNLDBCQUFPO01BQy9CLGNBQU0sS0FBSTs7ZUFBVSxNQUFNLE9BQU87O0lBRXJDLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixFQUFFLEVBQUUsVUFBVSxHQUFHO0lBRWpCLFFBQVEsV0FBVyxFQUFFLE9BQU87SUFDNUIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBRWhCLEVBQUUsRUFBRTtZQUVILEVBQUU7Ozs7OztrQkFNUyxTQUFQLFlBQUU7O1FBRUgsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTdCLEVBQUUsRUFBRSxVQUFVLFNBQVMsYUFBYztjQUVuQyxNQUFNO2VBQ0QsT0FBTzs7OztrQkFJTixTQUFQLFlBQUU7O1FBRUgsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTdCLEVBQUUsRUFBRSxVQUFVLFNBQVMsT0FBUTtjQUU3QixNQUFNO2VBQ0QsT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/fileeditor.kode
