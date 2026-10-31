var toExport = {}
var e, p, pickr

import harness from "../util/harness.js"

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import colorpicker from "../view/colmns/colorpicker.js"


pickr = function ()
{
    var e, h, p

    h = new harness({cols:30,rows:9})
    e = new editor(h.screen,'test_editor_colorpicker',[])
    p = new colorpicker(h.screen,e,'test_colorpicker')
    p.layout(0,0,30,9)
    p.show()
    return p
}
toExport["colorpicker"] = async function ()
{
    await section("pressing a slider sets the value from the column", async function ()
    {
        p = pickr()
        e = {type:'press',cell:[11,3],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),133)
    })
    await section("dragging a slider keeps tracking outside of it", async function ()
    {
        p = pickr()
        e = {type:'press',cell:[5,3],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),53)
        e = {type:'drag',cell:[15,5],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),187)
        e = {type:'release',cell:[15,5],button:'left',count:1}
        p.onMouse(e)
    })
    await section("the wheel steps an rgb input and focuses it", async function ()
    {
        p = pickr()
        p.red.setValue(100)
        e = {type:'wheel',cell:[2,7],dir:'down'}
        p.onWheel(e)
        compare(p.red.getValue(),99)
    })
    await section("the radio is out of the ring in single color mode", async function ()
    {
        p = pickr()
        p.show('#ff0000')
        compare(p.radio.options.length,1)
        compare(p.radio.focusable,false)
    })
}
toExport["colorpicker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ3FCLGNBQWQ7O09BQ2MsWUFBZDtPQUFvQixhQUFwQjs7T0FDYyxrQkFBVDs7O0FBRVo7Ozs7SUFDSSxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7SUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixRQUFRLFlBQVksRUFBRSxPQUFPLEVBQUU7SUFDL0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ2hCLEVBQUU7V0FDRjs7Ozs7O1FBTUksSUFBSTtRQUVKLEtBQ0ksS0FBTSxRQUNOLE1BQU8sR0FBRyxHQUNWLE9BQVEsT0FDUixNQUFPO1FBQ1gsRUFBRSxRQUFRO2dCQUVWLEVBQUUsSUFBSSxXQUFhOzs7O1FBSW5CLElBQUk7UUFFSixLQUNJLEtBQU0sUUFDTixNQUFPLEVBQUUsR0FDVCxPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtRQUVuQixLQUNJLEtBQU0sT0FDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtRQUVuQixLQUNJLEtBQU0sVUFDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTs7OztRQUlWLElBQUk7UUFDSixFQUFFLElBQUksU0FBUztRQUVmLEtBQ0ksS0FBTSxRQUNOLE1BQU8sRUFBRSxHQUNULElBQUs7UUFDVCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxJQUFJLFdBQWE7Ozs7UUFJbkIsSUFBSTtRQUNKLEVBQUUsS0FBSztnQkFFUCxFQUFFLE1BQU0sUUFBUSxPQUFTO2dCQUN6QixFQUFFLE1BQU0sVUFBWSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
