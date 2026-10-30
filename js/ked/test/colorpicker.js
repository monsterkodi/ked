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
        e = {type:'move',cell:[8,3]}
        p.onMouse(e)
        compare(p.focusIndex,1)
    })
    await section("hovering an rgb input focuses it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        e = {type:'move',cell:[6,6]}
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
        e = {type:'press',cell:[11,2],button:'left',count:1}
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
        e = {type:'press',cell:[5,2],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),111)
        e = {type:'drag',cell:[15,4],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),360)
        e = {type:'release',cell:[15,4],button:'left',count:1}
        p.onMouse(e)
    })
    await section("dragging over another slider does not focus it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        e = {type:'press',cell:[5,4],button:'left',count:1}
        p.onMouse(e)
        compare(p.focusIndex,2)
        e = {type:'drag',cell:[5,3],button:'left',count:1}
        p.onMouse(e)
        compare(p.focusIndex,2)
        e = {type:'drag',cell:[5,2],button:'left',count:1}
        p.onMouse(e)
        compare(p.focusIndex,2)
        e = {type:'release',cell:[5,2],button:'left',count:1}
        p.onMouse(e)
    })
    await section("the wheel steps a slider and focuses it", async function ()
    {
        h = new harness({cols:16,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,16,9)
        p.show()
        p.sat.setValue(50)
        e = {type:'wheel',cell:[8,4],dir:'up'}
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
        e = {type:'wheel',cell:[2,6],dir:'down'}
        p.onWheel(e)
        compare(p.red.getValue(),99)
        compare(p.focusIndex,3)
    })
    await section("a selection keeps two colors and adds the radio to the ring", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.showSelection('#ff0000','#00ff00')
        compare(p.selectionMode(),true)
        compare(p.radio.options.length,2)
        compare(p.radio.focusable,true)
        p.focusTo(5)
        h.key(p,'tab','')
        compare(p.focusIndex,6)
        h.key(p,'tab','')
        compare(p.focusIndex,0)
    })
    await section("left and right switch the active color", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.showSelection('#ff0000','#00ff00')
        p.focusTo(6)
        compare(p.activeColor,0)
        compare(p.hex(),'#ff0000')
        h.key(p,'right','')
        compare(p.activeColor,1)
        compare(p.hex(),'#00ff00')
        h.key(p,'left','')
        compare(p.activeColor,0)
        compare(p.hex(),'#ff0000')
    })
    await section("the radio is out of the ring in single color mode", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.show('#ff0000')
        compare(p.selectionMode(),false)
        compare(p.radio.options.length,1)
        compare(p.radio.focusable,false)
        p.focusTo(5)
        h.key(p,'tab','')
        compare(p.focusIndex,0)
        p.onMouse({type:'move',cell:[5,0]})
        compare(p.focusIndex,0)
    })
    await section("the radio shows the active color at the top", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.showSelection('#ff0000','#00ff00')
        p.draw()
        compare(h.row(0).includes('#ff0000'),true)
        compare(h.row(0).includes('#00ff00'),false)
        p.setActiveColor(1)
        p.draw()
        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),true)
    })
    await section("a focused radio shows markers around the active color", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.showSelection('#ff0000','#00ff00')
        p.focusTo(6)
        p.draw()
        compare(h.row(0).includes('● #ff0000 ●'),true)
    })
    await section("changing the background marks it as changed", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.showSelection('#ff0000','#0000ff')
        compare(p.backgroundChanged(),false)
        p.setActiveColor(1)
        p.setHex('#00ff00')
        compare(p.backgroundChanged(),true)
        compare(p.foregroundHex(),'#ff0000')
        compare(p.backgroundHex(),'#00ff00')
    })
    await section("hovering the radio focuses it", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.showSelection('#ff0000','#00ff00')
        p.onMouse({type:'move',cell:[5,0]})
        compare(p.focusIndex,6)
    })
    await section("typing rgb while the background is active marks it changed", async function ()
    {
        h = new harness({cols:30,rows:9})
        p = new colorpicker(h.screen,'test_cp')
        p.layout(0,0,30,9)
        p.showSelection('#ff0000','#00ff00')
        p.setActiveColor(1)
        p.focusTo(4)
        compare(p.backgroundChanged(),false)
        h.type(p,'12')
        compare(p.backgroundChanged(),true)
    })
}
toExport["colorpicker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BTXFCLGNBQWQ7O09BQ2Msa0JBQVQ7Ozs7OztRQU1KLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFlBQVksRUFBRSxPQUFPO1FBQzdCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFO2dCQUVGLEVBQUUsV0FBYTtRQUVmLEtBQ0ksS0FBTSxPQUNOLE1BQU8sRUFBRTtRQUNiLEVBQUUsUUFBUTtnQkFFVixFQUFFLFdBQWE7Ozs7UUFJZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLEtBQ0ksS0FBTSxPQUNOLE1BQU8sRUFBRTtRQUNiLEVBQUUsUUFBUTtnQkFFVixFQUFFLFdBQWE7Z0JBQ2YsRUFBRSxNQUFNLFdBQWE7Ozs7UUFJckIsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsWUFBWSxFQUFFLE9BQU87UUFDN0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixLQUNJLEtBQU0sUUFDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtnQkFDbkIsRUFBRSxXQUFhOzs7O1FBSWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsWUFBWSxFQUFFLE9BQU87UUFDN0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixLQUNJLEtBQU0sUUFDTixNQUFPLEVBQUUsR0FDVCxPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtRQUVuQixLQUNJLEtBQU0sT0FDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtRQUVuQixLQUNJLEtBQU0sVUFDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTs7OztRQUlWLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFlBQVksRUFBRSxPQUFPO1FBQzdCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFO1FBRUYsS0FDSSxLQUFNLFFBQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxXQUFhO1FBRWYsS0FDSSxLQUFNLE9BQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxXQUFhO1FBRWYsS0FDSSxLQUFNLE9BQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxXQUFhO1FBRWYsS0FDSSxLQUFNLFVBQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Ozs7UUFJVixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLEVBQUUsSUFBSSxTQUFTO1FBRWYsS0FDSSxLQUFNLFFBQ04sTUFBTyxFQUFFLEdBQ1QsSUFBSztRQUNULEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTtnQkFDbkIsRUFBRSxXQUFhOzs7O1FBSWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsWUFBWSxFQUFFLE9BQU87UUFDN0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixFQUFFLElBQUksU0FBUztRQUVmLEtBQ0ksS0FBTSxRQUNOLE1BQU8sRUFBRSxHQUNULElBQUs7UUFDVCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxJQUFJLFdBQWE7Z0JBQ25CLEVBQUUsV0FBYTs7OztRQUlmLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFlBQVksRUFBRSxPQUFPO1FBQzdCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUVoQixFQUFFLGNBQWMsVUFBVTtnQkFFMUIsRUFBRSxnQkFBa0I7Z0JBQ3BCLEVBQUUsTUFBTSxRQUFRLE9BQVM7Z0JBQ3pCLEVBQUUsTUFBTSxVQUFZO1FBRXBCLEVBQUUsUUFBUTtRQUNWLEVBQUUsSUFBSSxFQUFFLE1BQU07Z0JBQ2QsRUFBRSxXQUFhO1FBRWYsRUFBRSxJQUFJLEVBQUUsTUFBTTtnQkFDZCxFQUFFLFdBQWE7Ozs7UUFJZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsRUFBRSxjQUFjLFVBQVU7UUFDMUIsRUFBRSxRQUFRO2dCQUVWLEVBQUUsWUFBYztnQkFDaEIsRUFBRSxNQUFRO1FBRVYsRUFBRSxJQUFJLEVBQUUsUUFBUTtnQkFDaEIsRUFBRSxZQUFjO2dCQUNoQixFQUFFLE1BQVE7UUFFVixFQUFFLElBQUksRUFBRSxPQUFPO2dCQUNmLEVBQUUsWUFBYztnQkFDaEIsRUFBRSxNQUFROzs7O1FBSVYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsWUFBWSxFQUFFLE9BQU87UUFDN0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWhCLEVBQUUsS0FBSztnQkFFUCxFQUFFLGdCQUFrQjtnQkFDcEIsRUFBRSxNQUFNLFFBQVEsT0FBUztnQkFDekIsRUFBRSxNQUFNLFVBQVk7UUFFcEIsRUFBRSxRQUFRO1FBQ1YsRUFBRSxJQUFJLEVBQUUsTUFBTTtnQkFDZCxFQUFFLFdBQWE7UUFFZixFQUFFLFNBQ0UsS0FBTSxPQUNOLE1BQU8sRUFBRTtnQkFFYixFQUFFLFdBQWE7Ozs7UUFJZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsRUFBRSxjQUFjLFVBQVU7UUFDMUIsRUFBRTtnQkFFRixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Z0JBQy9CLEVBQUUsSUFBSSxHQUFHLFNBQVMsV0FBYTtRQUUvQixFQUFFLGVBQWU7UUFDakIsRUFBRTtnQkFFRixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Z0JBQy9CLEVBQUUsSUFBSSxHQUFHLFNBQVMsV0FBYTs7OztRQUkvQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsRUFBRSxjQUFjLFVBQVU7UUFDMUIsRUFBRSxRQUFRO1FBQ1YsRUFBRTtnQkFFRixFQUFFLElBQUksR0FBRyxTQUFTLGVBQWlCOzs7O1FBSW5DLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFlBQVksRUFBRSxPQUFPO1FBQzdCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUVoQixFQUFFLGNBQWMsVUFBVTtnQkFFMUIsRUFBRSxvQkFBc0I7UUFDeEIsRUFBRSxlQUFlO1FBQ2pCLEVBQUUsT0FBTztnQkFFVCxFQUFFLG9CQUFzQjtnQkFDeEIsRUFBRSxnQkFBa0I7Z0JBQ3BCLEVBQUUsZ0JBQWtCOzs7O1FBSXBCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFlBQVksRUFBRSxPQUFPO1FBQzdCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUVoQixFQUFFLGNBQWMsVUFBVTtRQUUxQixFQUFFLFNBQ0UsS0FBTSxPQUNOLE1BQU8sRUFBRTtnQkFFYixFQUFFLFdBQWE7Ozs7UUFJZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxZQUFZLEVBQUUsT0FBTztRQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsRUFBRSxjQUFjLFVBQVU7UUFDMUIsRUFBRSxlQUFlO1FBQ2pCLEVBQUUsUUFBUTtnQkFFVixFQUFFLG9CQUFzQjtRQUV4QixFQUFFLEtBQUssRUFBRTtnQkFFVCxFQUFFLG9CQUFzQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
