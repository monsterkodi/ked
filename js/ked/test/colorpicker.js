var toExport = {}
var e, h, p

import harness from "../util/harness.js"

import colorpicker from "../view/colmns/colorpicker.js"

toExport["colorpicker"] = async function ()
{
    await section("hovering a slider focuses it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        compare(p.focusIndex,0)
        e = {type:'move',cell:[8,2]}
        p.onMouse(e)
        compare(p.focusIndex,1)
    })
    await section("hovering an rgb input focuses it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        e = {type:'move',cell:[6,5]}
        p.onMouse(e)
        compare(p.focusIndex,4)
        compare(p.green.hasFocus(),true)
    })
    await section("pressing a slider sets the value from the column", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        e = {type:'press',cell:[11,1],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),277)
        compare(p.focusIndex,0)
    })
    await section("dragging a slider keeps tracking outside of it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        e = {type:'press',cell:[5,1],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),111)
        e = {type:'drag',cell:[15,3],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),360)
        e = {type:'release',cell:[15,3],button:'left',count:1}
        p.onMouse(e)
    })
    await section("dragging over another slider does not focus it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        e = {type:'press',cell:[5,3],button:'left',count:1}
        p.onMouse(e)
        compare(p.focusIndex,2)
        e = {type:'drag',cell:[5,2],button:'left',count:1}
        p.onMouse(e)
        compare(p.focusIndex,2)
        e = {type:'drag',cell:[5,1],button:'left',count:1}
        p.onMouse(e)
        compare(p.focusIndex,2)
        e = {type:'release',cell:[5,1],button:'left',count:1}
        p.onMouse(e)
    })
    await section("the wheel steps a slider and focuses it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        p.sat.setValue(50)
        e = {type:'wheel',cell:[8,3],dir:'up'}
        p.onWheel(e)
        compare(p.sat.getValue(),51)
        compare(p.focusIndex,2)
    })
    await section("the wheel steps an rgb input and focuses it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        p.red.setValue(100)
        e = {type:'wheel',cell:[2,5],dir:'down'}
        p.onWheel(e)
        compare(p.red.getValue(),99)
        compare(p.focusIndex,3)
    })
}
toExport["colorpicker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BTXFCLGNBQWQ7O09BQ2Msa0JBQVQ7Ozs7OztRQU1KLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFlBQVksRUFBRSxPQUFPO1FBQzdCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFO2dCQUVGLEVBQUUsV0FBYTtRQUVmLEtBQ0ksS0FBTSxPQUNOLE1BQU8sRUFBRTtRQUNiLEVBQUUsUUFBUTtnQkFFVixFQUFFLFdBQWE7Ozs7UUFJZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLEtBQ0ksS0FBTSxPQUNOLE1BQU8sRUFBRTtRQUNiLEVBQUUsUUFBUTtnQkFFVixFQUFFLFdBQWE7Z0JBQ2YsRUFBRSxNQUFNLFdBQWE7Ozs7UUFJckIsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsWUFBWSxFQUFFLE9BQU87UUFDN0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixLQUNJLEtBQU0sUUFDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtnQkFDbkIsRUFBRSxXQUFhOzs7O1FBSWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsWUFBWSxFQUFFLE9BQU87UUFDN0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixLQUNJLEtBQU0sUUFDTixNQUFPLEVBQUUsR0FDVCxPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtRQUVuQixLQUNJLEtBQU0sT0FDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtRQUVuQixLQUNJLEtBQU0sVUFDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTs7OztRQUlWLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFlBQVksRUFBRSxPQUFPO1FBQzdCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFO1FBRUYsS0FDSSxLQUFNLFFBQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxXQUFhO1FBRWYsS0FDSSxLQUFNLE9BQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxXQUFhO1FBRWYsS0FDSSxLQUFNLE9BQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxXQUFhO1FBRWYsS0FDSSxLQUFNLFVBQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Ozs7UUFJVixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLEVBQUUsSUFBSSxTQUFTO1FBRWYsS0FDSSxLQUFNLFFBQ04sTUFBTyxFQUFFLEdBQ1QsSUFBSztRQUNULEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtnQkFDbkIsRUFBRSxXQUFhOzs7O1FBSWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsWUFBWSxFQUFFLE9BQU87UUFDN0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixFQUFFLElBQUksU0FBUztRQUVmLEtBQ0ksS0FBTSxRQUNOLE1BQU8sRUFBRSxHQUNULElBQUs7UUFDVCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxJQUFJLFdBQWE7Z0JBQ25CLEVBQUUsV0FBYSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
