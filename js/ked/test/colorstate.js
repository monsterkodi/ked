var toExport = {}
var cells, colors, data, e, h, m, s, text

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import theme from "../theme/theme.js"

import harness from "../util/harness.js"
import filecolors from "../util/filecolors.js"

import mapview from "../view/editor/mapview.js"

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
    await section("the map uses custom colors", async function ()
    {
        h = new harness({cols:20,rows:5})
        e = new editor(h.screen,'test_color_map',[])
        e.layout(0,0,20,5)
        e.state.loadLines(['abcdef'])
        e.state.setColorsForRanges([[1,0,2,0]],'#ff0000',null)
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('txt',e.state.s.lines)
        data = Buffer.alloc(120)
        m.imageForLine(data,e.state.s.lines[0],0)
        compare(data[6],255)
        compare(data[7],0)
        compare(data[8],0)
    })
    await section("the map uses custom backgrounds for spaces", async function ()
    {
        h = new harness({cols:20,rows:5})
        e = new editor(h.screen,'test_color_map',[])
        e.layout(0,0,20,5)
        e.state.loadLines(['a b'])
        e.state.setColorsForRanges([[1,0,2,0]],null,'#0000ff')
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('txt',e.state.s.lines)
        data = Buffer.alloc(120)
        m.imageForLine(data,e.state.s.lines[0],0)
        compare(data[6],0)
        compare(data[7],0)
        compare(data[8],255)
    })
    await section("the map can use colors passed in for a preview", async function ()
    {
        h = new harness({cols:20,rows:5})
        e = new editor(h.screen,'test_color_map',[])
        e.layout(0,0,20,5)
        e.state.loadLines(['abcdef'])
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('txt',e.state.s.lines)
        m.setColors({fg:[[1,0,2,'#00ff00']],bg:[]})
        data = Buffer.alloc(120)
        m.imageForLine(data,e.state.s.lines[0],0)
        compare(data[6],0)
        compare(data[7],255)
        compare(data[8],0)
    })
    await section("custom colors keep ascii header edges plain", async function ()
    {
        h = new harness({cols:20,rows:5})
        e = new editor(h.screen,'test_color_ascii',[])
        e.layout(0,0,20,5)
        e.state.loadLines(['████'])
        e.state.setMainCursor(10,0)
        e.state.setColorsForRanges([[0,0,1,0]],'#ff0000',null)
        e.draw()
        e.drawAsciiHeader(e.state.s.lines[0],0,'comment triple header')
        compare(h.screen.get_char(0,0),'█')
        compare(h.screen.get_fg(0,0),[255,0,0])
        compare(h.screen.get_char(3,0),'▋')
    })
    await section("setting colors can void a layer", async function ()
    {
        cells = {cols:40,rows:10}
        s = new state(cells,'test_color_state')
        s.loadLines(['abcdef'])
        s.setColorsForRanges([[0,0,6,0]],'#ff0000','#0000ff')
        s.setColorsForRanges([[1,0,4,0]],'#00ff00',null,['bg'])
        compare(s.s.colors.fg,[[0,0,1,'#ff0000'],[1,0,4,'#00ff00'],[4,0,6,'#ff0000']])
        compare(s.s.colors.bg,[[0,0,1,'#0000ff'],[4,0,6,'#0000ff']])
    })
    await section("bang comments use the header greens", async function ()
    {
        compare(theme.syntax['comment bang'],theme.syntax['comment header'])
        compare(theme.syntax['comment bangbang'],theme.syntax['comment triple header'])
    })
}
toExport["color state"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzdGF0ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9jb2xvcnN0YXRlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNxQixZQUFkO09BQW9CLGFBQXBCOztPQUNjLFlBQWQ7O09BQ2MsY0FBZDtPQUFzQixpQkFBdEI7O09BQ2MsY0FBVDs7Ozs7O1FBTUosU0FBUSxLQUFLLEdBQUcsS0FBSztRQUNyQixRQUFRLE1BQU0sTUFBTTtRQUNwQixFQUFFLFdBQVc7UUFFYixFQUFFLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxJQUFJLFVBQVU7Z0JBRTNDLEVBQUUsRUFBRSxPQUFPLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3hCLEVBQUUsRUFBRSxPQUFPO1FBRVgsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLO2dCQUV0QyxFQUFFLEVBQUUsT0FBTyxLQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN4QixFQUFFLEVBQUUsT0FBTyxLQUFPLEVBQUUsRUFBRSxFQUFFOzs7O1FBSXhCLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDckIsUUFBUSxNQUFNLE1BQU07UUFDcEIsRUFBRSxXQUFXO1FBRWIsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxVQUFVO1FBQzNDLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxFQUFFLElBQUksS0FBSztRQUV0QyxFQUFFLHVCQUF1QixFQUFFLEVBQUUsRUFBRTtnQkFFL0IsRUFBRSxFQUFFLE9BQU8sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDeEIsRUFBRSxFQUFFLE9BQU8sS0FBTyxFQUFFLEVBQUUsRUFBRTs7OztRQUl4QixTQUFRLEtBQUssR0FBRyxLQUFLO1FBQ3JCLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEVBQUUsV0FBVztRQUViLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxFQUFFLElBQUksVUFBVTtRQUUzQyxFQUFFLFVBQVU7Z0JBRVosRUFBRSxFQUFFLE9BQU8sS0FBTyxFQUFFLEVBQUUs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorstate.kode
