var toExport = {}
var e, h, hex, p, pickr

import harness from "../util/harness.js"

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"

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
    await section("a syntax color at the cursor seeds the picker", async function ()
    {
        h = new harness({cols:30,rows:9})
        e = new editor(h.screen,'test_editor_colorpicker_syntax',[])
        e.state.syntax.ext = 'kode'
        e.state.loadLines(['class Foo'])
        e.state.setMainCursor(5,0)
        p = new colorpicker(h.screen,e,'test_colorpicker_syntax')
        p.layout(0,0,30,9)
        p.show()
        compare(p.foregroundHex(),(color.hex(theme.syntax.keyword)))
    })
}
toExport["colorpicker"]._section_ = true
toExport["colorpicker palette"] = async function ()
{
    await section("the palette starts empty", async function ()
    {
        p = pickr()
        compare(p.palette,[])
        compare(p.pickerHeight(),9)
    })
    await section("the palette holds eight colors by default", async function ()
    {
        p = pickr()
        compare(p.paletteMax,8)
    })
    await section("the current color is added to the palette", async function ()
    {
        p = pickr()
        p.setHex('#ff0000')
        p.addCurrentColor()
        compare(p.palette,['#ff0000'])
    })
    await section("a color is not added twice", async function ()
    {
        p = pickr()
        p.setHex('#ff0000')
        p.addCurrentColor()
        p.addCurrentColor()
        compare(p.palette.length,1)
    })
    await section("the leftmost color is dropped when the palette is full", async function ()
    {
        p = pickr()
        p.paletteMax = 3
        var list = ['#ff0000','#00ff00','#0000ff']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hex = list[_a_]
            p.setHex(hex)
            p.addCurrentColor()
        }
        p.setHex('#ffffff')
        p.addCurrentColor()
        compare(p.palette,['#00ff00','#0000ff','#ffffff'])
    })
    await section("the picker grows by two rows when the palette is not empty", async function ()
    {
        p = pickr()
        p.setHex('#ff0000')
        p.addCurrentColor()
        compare(p.pickerHeight(),11)
    })
    await section("enter on a palette cell sets the current color", async function ()
    {
        p = pickr()
        p.setHex('#ff0000')
        p.addCurrentColor()
        p.setHex('#00ff00')
        p.paletteView.setActive(0)
        p.paletteView.grabFocus()
        e = {type:'press',combo:'return',char:''}
        p.onKey('return',e)
        compare(p.hex(),'#ff0000')
    })
    await section("backspace on a focused palette cell removes it", async function ()
    {
        p = pickr()
        p.setHex('#ff0000')
        p.addCurrentColor()
        p.setHex('#00ff00')
        p.addCurrentColor()
        p.paletteView.setActive(1)
        p.paletteView.grabFocus()
        e = {type:'press',combo:'backspace',char:''}
        p.onKey('backspace',e)
        compare(p.palette,['#ff0000'])
    })
    await section("the palette is not in the focus ring when it is empty", async function ()
    {
        p = pickr()
        compare(p.focusRing.includes(p.paletteView),false)
        p.setHex('#ff0000')
        p.addCurrentColor()
        p.layout(0,0,30,11)
        p.draw()
        compare(p.focusRing.includes(p.paletteView),true)
    })
}
toExport["colorpicker palette"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ3FCLGNBQWQ7O09BQ2MsWUFBZDtPQUFvQixhQUFwQjs7T0FDYyxZQUFkO09BQW9CLFlBQXBCOztPQUNjLGtCQUFUOzs7QUFFWjs7OztJQUNJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsWUFBWSxFQUFFLE9BQU8sRUFBRTtJQUMvQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRTtXQUNGOzs7Ozs7UUFNSSxJQUFJO1FBRUosS0FDSSxLQUFNLFFBQ04sTUFBTyxHQUFHLEdBQ1YsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxJQUFJLFdBQWE7Ozs7UUFJbkIsSUFBSTtRQUVKLEtBQ0ksS0FBTSxRQUNOLE1BQU8sRUFBRSxHQUNULE9BQVEsT0FDUixNQUFPO1FBQ1gsRUFBRSxRQUFRO2dCQUVWLEVBQUUsSUFBSSxXQUFhO1FBRW5CLEtBQ0ksS0FBTSxPQUNOLE1BQU8sR0FBRyxHQUNWLE9BQVEsT0FDUixNQUFPO1FBQ1gsRUFBRSxRQUFRO2dCQUVWLEVBQUUsSUFBSSxXQUFhO1FBRW5CLEtBQ0ksS0FBTSxVQUNOLE1BQU8sR0FBRyxHQUNWLE9BQVEsT0FDUixNQUFPO1FBQ1gsRUFBRSxRQUFROzs7O1FBSVYsSUFBSTtRQUNKLEVBQUUsSUFBSSxTQUFTO1FBRWYsS0FDSSxLQUFNLFFBQ04sTUFBTyxFQUFFLEdBQ1QsSUFBSztRQUNULEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTs7OztRQUluQixJQUFJO1FBQ0osRUFBRSxLQUFLO2dCQUVQLEVBQUUsTUFBTSxRQUFRLE9BQVM7Z0JBQ3pCLEVBQUUsTUFBTSxVQUFZOzs7O1FBSXBCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsTUFBTSxPQUFPLE1BQU07UUFDckIsRUFBRSxNQUFNLFdBQVc7UUFDbkIsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUV4QixRQUFRLFlBQVksRUFBRSxPQUFPLEVBQUU7UUFDL0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7Z0JBRUYsRUFBRSxpQkFBbUIsTUFBTSxJQUFJLE1BQU0sT0FBTzs7Ozs7Ozs7UUFNNUMsSUFBSTtnQkFFSixFQUFFO2dCQUNGLEVBQUUsZUFBaUI7Ozs7UUFJbkIsSUFBSTtnQkFFSixFQUFFLFdBQWE7Ozs7UUFJZixJQUFJO1FBQ0osRUFBRSxPQUFPO1FBQ1QsRUFBRTtnQkFFRixFQUFFLFNBQVc7Ozs7UUFJYixJQUFJO1FBQ0osRUFBRSxPQUFPO1FBQ1QsRUFBRTtRQUNGLEVBQUU7Z0JBRUYsRUFBRSxRQUFRLE9BQVM7Ozs7UUFJbkIsSUFBSTtRQUNKLEVBQUUsYUFBYTtvQkFFSCxVQUFVLFVBQVU7OztZQUE1QjtZQUNBLEVBQUUsT0FBTztZQUNULEVBQUU7O1FBRU4sRUFBRSxPQUFPO1FBQ1QsRUFBRTtnQkFFRixFQUFFLFNBQVcsVUFBVSxVQUFVOzs7O1FBSWpDLElBQUk7UUFDSixFQUFFLE9BQU87UUFDVCxFQUFFO2dCQUVGLEVBQUUsZUFBaUI7Ozs7UUFJbkIsSUFBSTtRQUNKLEVBQUUsT0FBTztRQUNULEVBQUU7UUFFRixFQUFFLE9BQU87UUFFVCxFQUFFLFlBQVksVUFBVTtRQUN4QixFQUFFLFlBQVk7UUFFZCxLQUNJLEtBQU0sUUFDTixNQUFPLFNBQ1AsS0FBTTtRQUNWLEVBQUUsTUFBTSxTQUFTO2dCQUVqQixFQUFFLE1BQVE7Ozs7UUFJVixJQUFJO1FBQ0osRUFBRSxPQUFPO1FBQ1QsRUFBRTtRQUNGLEVBQUUsT0FBTztRQUNULEVBQUU7UUFFRixFQUFFLFlBQVksVUFBVTtRQUN4QixFQUFFLFlBQVk7UUFFZCxLQUNJLEtBQU0sUUFDTixNQUFPLFlBQ1AsS0FBTTtRQUNWLEVBQUUsTUFBTSxZQUFZO2dCQUVwQixFQUFFLFNBQVc7Ozs7UUFJYixJQUFJO2dCQUVKLEVBQUUsVUFBVSxTQUFTLEVBQUUsYUFBZTtRQUV0QyxFQUFFLE9BQU87UUFDVCxFQUFFO1FBRUYsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7Z0JBRUYsRUFBRSxVQUFVLFNBQVMsRUFBRSxhQUFlIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
