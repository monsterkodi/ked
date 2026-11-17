var toExport = {}
var cells, changes, colors, data, e, h, hex, lines, m, newLines, oldLines, p, pickr, s, spans, text

import harness from "../util/harness.js"
import filecolors from "../util/filecolors.js"

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import colorspans from "../edit/tool/colorspans.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"

import mapview from "../view/editor/mapview.js"

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
toExport["colorspans"] = async function ()
{
    await section("overlay adds a span", async function ()
    {
        lines = [['a','b','c','d','e']]
        spans = colorspans.overlay([],[[1,0,4,0]],'#f00',lines)
        compare(spans,[[1,0,4,'#f00']])
    })
    await section("overlay splits an existing span", async function ()
    {
        lines = [['a','b','c','d','e']]
        spans = colorspans.overlay([[0,0,5,'#00f']],[[2,0,3,0]],'#f00',lines)
        compare(spans,[[0,0,2,'#00f'],[2,0,3,'#f00'],[3,0,5,'#00f']])
    })
    await section("overlay turns a multiline range into lines", async function ()
    {
        lines = [['a','b','c','d','e'],['a','b','c','d','e'],['a','b','c','d','e']]
        spans = colorspans.overlay([],[[2,0,3,2]],'#f00',lines)
        compare(spans,[[2,0,5,'#f00'],[0,1,5,'#f00'],[0,2,3,'#f00']])
    })
    await section("normalize merges touching spans of the same color", async function ()
    {
        spans = colorspans.normalize([[0,0,2,'#f00'],[2,0,4,'#f00'],[5,0,6,'#0f0']])
        compare(spans,[[0,0,4,'#f00'],[5,0,6,'#0f0']])
    })
    await section("clear removes and splits", async function ()
    {
        spans = colorspans.clear([[0,0,5,'#00f'],[6,0,9,'#00f']],[[2,0,7,0]])
        compare(spans,[[0,0,2,'#00f'],[7,0,9,'#00f']])
    })
    await section("an insertion inside a span stretches it", async function ()
    {
        oldLines = [['a','b','c','d']]
        newLines = [['a','b','X','c','d']]
        spans = colorspans.adjust([[0,0,4,'#f00']],oldLines,newLines)
        compare(spans,[[0,0,5,'#f00']])
    })
    await section("an insertion before a span moves it", async function ()
    {
        oldLines = [['a','b','c','d']]
        newLines = [['a','b','X','c','d']]
        spans = colorspans.adjust([[2,0,4,'#f00']],oldLines,newLines)
        compare(spans,[[3,0,5,'#f00']])
    })
    await section("a deletion inside a span shrinks it", async function ()
    {
        oldLines = [['a','b','c','d','e']]
        newLines = [['a','b','e']]
        spans = colorspans.adjust([[0,0,5,'#f00']],oldLines,newLines)
        compare(spans,[[0,0,3,'#f00']])
    })
    await section("inserting a line moves spans below", async function ()
    {
        oldLines = [['a'],['b'],['c']]
        newLines = [['a'],['x'],['b'],['c']]
        spans = colorspans.adjust([[0,1,1,'#f00'],[0,2,1,'#0f0']],oldLines,newLines)
        compare(spans,[[0,2,1,'#f00'],[0,3,1,'#0f0']])
    })
    await section("deleting a line moves spans below", async function ()
    {
        oldLines = [['a'],['x'],['b'],['c']]
        newLines = [['a'],['b'],['c']]
        spans = colorspans.adjust([[0,2,1,'#f00'],[0,3,1,'#0f0']],oldLines,newLines)
        compare(spans,[[0,1,1,'#f00'],[0,2,1,'#0f0']])
    })
    await section("colorAtPos finds the span at a position", async function ()
    {
        spans = [[1,2,4,'#f00'],[6,2,9,'#0f0']]
        compare(colorspans.colorAtPos(spans,[2,2]),'#f00')
        compare(colorspans.colorAtPos(spans,[5,2]),null)
        compare(colorspans.colorAtPos(spans,[6,2]),'#0f0')
    })
}
toExport["colorspans"]._section_ = true
toExport["colorstate"] = async function ()
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
    await section("loading unchanged colors is not announced", async function ()
    {
        cells = {cols:40,rows:10}
        s = new state(cells,'test_color_state')
        s.loadLines(['abcdef'])
        changes = 0
        s.on('colors.changed',function ()
        {
            return changes += 1
        })
        s.loadColors({fg:[],bg:[]})
        compare(changes,0)
        s.loadColors({fg:[[0,0,2,'#ff0000']],bg:[]})
        compare(changes,1)
        s.loadColors({fg:[[0,0,2,'#ff0000']],bg:[]})
        compare(changes,1)
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
}
toExport["colorstate"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ3FCLGNBQWQ7T0FBc0IsaUJBQXRCOztPQUNjLFlBQWQ7T0FBb0IsYUFBcEI7O09BQ2MsaUJBQVQ7O09BQ1MsWUFBZDtPQUFvQixZQUFwQjs7T0FDYyxjQUFUOztPQUNTLGtCQUFUOzs7QUFFWjs7OztJQUNJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsWUFBWSxFQUFFLE9BQU8sRUFBRTtJQUMvQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRTtXQUNGOzs7Ozs7UUFNSSxJQUFJO1FBRUosS0FDSSxLQUFNLFFBQ04sTUFBTyxHQUFHLEdBQ1YsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxJQUFJLFdBQWE7Ozs7UUFJbkIsSUFBSTtRQUVKLEtBQ0ksS0FBTSxRQUNOLE1BQU8sRUFBRSxHQUNULE9BQVEsT0FDUixNQUFPO1FBQ1gsRUFBRSxRQUFRO2dCQUVWLEVBQUUsSUFBSSxXQUFhO1FBRW5CLEtBQ0ksS0FBTSxPQUNOLE1BQU8sR0FBRyxHQUNWLE9BQVEsT0FDUixNQUFPO1FBQ1gsRUFBRSxRQUFRO2dCQUVWLEVBQUUsSUFBSSxXQUFhO1FBRW5CLEtBQ0ksS0FBTSxVQUNOLE1BQU8sR0FBRyxHQUNWLE9BQVEsT0FDUixNQUFPO1FBQ1gsRUFBRSxRQUFROzs7O1FBSVYsSUFBSTtRQUNKLEVBQUUsSUFBSSxTQUFTO1FBRWYsS0FDSSxLQUFNLFFBQ04sTUFBTyxFQUFFLEdBQ1QsSUFBSztRQUNULEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTs7OztRQUluQixJQUFJO1FBQ0osRUFBRSxLQUFLO2dCQUVQLEVBQUUsTUFBTSxRQUFRLE9BQVM7Z0JBQ3pCLEVBQUUsTUFBTSxVQUFZOzs7O1FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
