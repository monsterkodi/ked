var toExport = {}
var cells, colors, data, e, h, s, text

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import filecolors from "../util/filecolors.js"

toExport["color state"] = async function ()
{
    await section("foreground and background are independent layers", async function ()
    {
        cells = {cols:40,rows:10}
        s = new state(cells,'test_color_state')
        s.loadLines(['abcdef'])
        s.setColorsForRanges([[0,0,3,0]],'#ff0000',null)
        compare(s.s.colors.fg,[[0,0,3,'#ff0000']])
        compare(s.s.colors.bg,[])
        s.setColorsForRanges([[1,0,5,0]],null,'#0000ff')
        compare(s.s.colors.fg,[[0,0,3,'#ff0000']])
        compare(s.s.colors.bg,[[1,0,5,'#0000ff']])
    })
    await section("clearing splits both layers", async function ()
    {
        cells = {cols:40,rows:10}
        s = new state(cells,'test_color_state')
        s.loadLines(['abcdef'])
        s.setColorsForRanges([[0,0,3,0]],'#ff0000',null)
        s.setColorsForRanges([[1,0,5,0]],null,'#0000ff')
        s.clearColorsForRanges([[1,0,4,0]])
        compare(s.s.colors.fg,[[0,0,1,'#ff0000']])
        compare(s.s.colors.bg,[[4,0,5,'#0000ff']])
    })
    await section("editing adjusts the spans", async function ()
    {
        cells = {cols:40,rows:10}
        s = new state(cells,'test_color_state')
        s.loadLines(['abcdef'])
        s.setColorsForRanges([[0,0,6,0]],'#ff0000',null)
        s.setLines(['abXcdef'])
        compare(s.s.colors.fg,[[0,0,7,'#ff0000']])
    })
    await section("clearing at the selection clears both layers", async function ()
    {
        cells = {cols:40,rows:10}
        s = new state(cells,'test_color_state')
        s.loadLines(['abcdef'])
        s.setColorsForRanges([[0,0,6,0]],'#ff0000','#0000ff')
        s.setSelections([[0,0,6,0]])
        s.clearColorsAtCursorOrSelection()
        compare(s.s.colors.fg,[])
        compare(s.s.colors.bg,[])
    })
    await section("colors can be undone", async function ()
    {
        cells = {cols:40,rows:10}
        s = new state(cells,'test_color_state')
        s.loadLines(['abcdef'])
        s.setColorsForRanges([[0,0,3,0]],'#ff0000',null)
        compare(s.s.colors.fg,[[0,0,3,'#ff0000']])
        s.undo()
        compare(s.s.colors.fg,[])
    })
    await section("colors are drawn over syntax", async function ()
    {
        h = new harness({cols:20,rows:5})
        e = new editor(h.screen,'test_color_draw',[])
        e.layout(0,0,20,5)
        e.state.loadLines(['abcdef'])
        e.state.setColorsForRanges([[1,0,4,0]],'#ff0000','#0000ff')
        e.draw()
        compare(h.screen.get_fg(2,0),[255,0,0])
        compare(h.screen.get_bg(2,0),[0,0,255])
    })
    await section("a saved background survives a load", async function ()
    {
        colors = {fg:[],bg:[[1,0,4,'#0000ff']]}
        text = filecolors.join('test.js','abcdef',colors)
        data = filecolors.split('test.js',text)
        h = new harness({cols:20,rows:5})
        e = new editor(h.screen,'test_color_load',[])
        e.layout(0,0,20,5)
        e.state.loadLines(data.text.split('\n'))
        e.state.loadColors(data.colors)
        e.draw()
        compare(h.screen.get_bg(2,0),[0,0,255])
    })
}
toExport["color state"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzdGF0ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9jb2xvcnN0YXRlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQU1lLFlBQVI7T0FBYyxhQUFkOztPQUNRLGNBQVI7T0FBZ0IsaUJBQWhCOzs7Ozs7UUFNQyxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQ3JCLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEVBQUUsV0FBVztRQUViLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxFQUFFLElBQUksVUFBVTtnQkFFM0MsRUFBRSxFQUFFLE9BQU8sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDeEIsRUFBRSxFQUFFLE9BQU87UUFFWCxFQUFFLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUs7Z0JBRXRDLEVBQUUsRUFBRSxPQUFPLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3hCLEVBQUUsRUFBRSxPQUFPLEtBQU8sRUFBRSxFQUFFLEVBQUU7Ozs7UUFJeEIsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUNyQixRQUFRLE1BQU0sTUFBTTtRQUNwQixFQUFFLFdBQVc7UUFFYixFQUFFLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxJQUFJLFVBQVU7UUFDM0MsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLO1FBRXRDLEVBQUUsdUJBQXVCLEVBQUUsRUFBRSxFQUFFO2dCQUUvQixFQUFFLEVBQUUsT0FBTyxLQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN4QixFQUFFLEVBQUUsT0FBTyxLQUFPLEVBQUUsRUFBRSxFQUFFOzs7O1FBSXhCLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDckIsUUFBUSxNQUFNLE1BQU07UUFDcEIsRUFBRSxXQUFXO1FBRWIsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxVQUFVO1FBRTNDLEVBQUUsVUFBVTtnQkFFWixFQUFFLEVBQUUsT0FBTyxLQUFPLEVBQUUsRUFBRSxFQUFFOzs7O1FBSXhCLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDckIsUUFBUSxNQUFNLE1BQU07UUFDcEIsRUFBRSxXQUFXO1FBRWIsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxVQUFVO1FBQzNDLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO1FBRXhCLEVBQUU7Z0JBRUYsRUFBRSxFQUFFLE9BQU87Z0JBQ1gsRUFBRSxFQUFFLE9BQU87Ozs7UUFJWCxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQ3JCLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEVBQUUsV0FBVztRQUViLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxFQUFFLElBQUksVUFBVTtnQkFFM0MsRUFBRSxFQUFFLE9BQU8sS0FBTyxFQUFFLEVBQUUsRUFBRTtRQUV4QixFQUFFO2dCQUVGLEVBQUUsRUFBRSxPQUFPOzs7O1FBSVgsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsTUFBTSxXQUFXO1FBRW5CLEVBQUUsTUFBTSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxVQUFVO1FBRWpELEVBQUU7Z0JBRUYsRUFBRSxPQUFPLE9BQU8sRUFBRSxJQUFNLElBQUksRUFBRTtnQkFDOUIsRUFBRSxPQUFPLE9BQU8sRUFBRSxJQUFNLEVBQUUsRUFBRTs7OztRQUk1QixVQUNJLE1BQ0EsS0FBTSxFQUFFLEVBQUUsRUFBRTtRQUVoQixPQUFPLFdBQVcsS0FBSyxVQUFVLFNBQVM7UUFDMUMsT0FBTyxXQUFXLE1BQU0sVUFBVTtRQUVsQyxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUV4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxNQUFNLFVBQVUsS0FBSyxLQUFLLE1BQU07UUFDbEMsRUFBRSxNQUFNLFdBQVcsS0FBSztRQUV4QixFQUFFO2dCQUVGLEVBQUUsT0FBTyxPQUFPLEVBQUUsSUFBTSxFQUFFLEVBQUUifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorstate.kode
