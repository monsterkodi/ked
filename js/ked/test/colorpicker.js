var toExport = {}
var cells, changes, colors, data, e, h, hex, lines, m, newLines, oldLines, p, pal, pickr, r, s, spans, text

import harness from "../util/harness.js"
import filecolors from "../util/filecolors.js"

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import colorspans from "../edit/tool/colorspans.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"

import palette from "../view/base/palette.js"
import radio from "../view/base/radio.js"

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

pal = function (cols, colors)
{
    var h, p

    h = new harness({cols:cols,rows:2})
    p = new palette(h.screen,'test_palette')
    p.layout(0,0,cols,1)
    p.setColors(colors)
    p.draw()
    return [h,p]
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
toExport["palette"] = async function ()
{
    await section("a cell shows its color", async function ()
    {
        var _b_ = pal(20,['#ff0000','#00ff00']); h = _b_[0]; p = _b_[1]

        compare(h.screen.get_bg(5,0),[255,0,0])
        compare(h.screen.get_bg(15,0),[0,255,0])
    })
    await section("one narrow cell keeps all the cells from showing their hex value", async function ()
    {
        var _c_ = pal(20,['#ff0000','#00ff00','#0000ff']); h = _c_[0]; p = _c_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
        compare(h.row(0).includes('#0000ff'),false)
    })
    await section("a narrow cell shows no hex value", async function ()
    {
        var _d_ = pal(10,['#ff0000','#00ff00']); h = _d_[0]; p = _d_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
    })
    await section("the palette has rounded edges", async function ()
    {
        var _e_ = pal(20,['#ff0000']); h = _e_[0]; p = _e_[1]

        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
    })
    await section("an empty palette has no cells", async function ()
    {
        var _f_ = pal(20,[]); h = _f_[0]; p = _f_[1]

        compare(p.options.length,0)
        compare(h.screen.get_bg(0,0),[])
    })
}
toExport["palette"]._section_ = true
toExport["radio"] = async function ()
{
    await section("a single option fills the row and shows its label", async function ()
    {
        h = new harness({cols:20,rows:2})
        r = new radio(h.screen,'test_radio')
        r.layout(0,0,20,1)
        r.setOptions([{color:[255,255,255],label:'#ffffff'}])
        r.draw()
        compare(h.row(0).includes('#ffffff'),true)
        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
        compare(h.screen.get_bg(10,0),[255,255,255])
    })
    await section("only the active option shows a label", async function ()
    {
        h = new harness({cols:20,rows:2})
        r = new radio(h.screen,'test_radio')
        r.layout(0,0,20,1)
        r.setOptions([{color:[255,255,255],label:'#ffffff'},{color:[0,0,255],label:'#0000ff'}])
        r.draw()
        compare(h.row(0).includes('#ffffff'),true)
        compare(h.row(0).includes('#0000ff'),false)
        compare(h.screen.get_bg(2,0),[255,255,255])
        compare(h.screen.get_bg(17,0),[0,0,255])
        r.setActive(1)
        r.draw()
        compare(h.row(0).includes('#ffffff'),false)
        compare(h.row(0).includes('#0000ff'),true)
    })
    await section("the active label gets focus markers when they fit", async function ()
    {
        h = new harness({cols:20,rows:2})
        r = new radio(h.screen,'test_radio')
        r.layout(0,0,20,1)
        r.setOptions([{color:[255,255,255],label:'#ffffff'},{color:[0,0,255],label:'#0000ff'}])
        r.setActive(1)
        r.grabFocus()
        r.draw()
        compare(h.row(0).includes('●#0000ff●'),true)
    })
}
toExport["radio"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ3FCLGNBQWQ7T0FBc0IsaUJBQXRCOztPQUNjLFlBQWQ7T0FBb0IsYUFBcEI7O09BQ2MsaUJBQVQ7O09BQ1MsWUFBZDtPQUFvQixZQUFwQjs7T0FDYyxjQUFUO09BQWlCLFlBQWpCOztPQUNTLGNBQVQ7O09BQ1Msa0JBQVQ7OztBQUVaOzs7O0lBQ0ksUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsUUFBUSxZQUFZLEVBQUUsT0FBTyxFQUFFO0lBQy9CLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztJQUNoQixFQUFFO1dBQ0Y7OztBQUVKLGdCQUFPLE1BQUs7Ozs7SUFFUixRQUFRLFNBQVEsS0FBSyxLQUFLLEtBQUs7SUFDL0IsUUFBUSxRQUFRLEVBQUUsT0FBTztJQUV6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUs7SUFDbEIsRUFBRSxVQUFVO0lBQ1osRUFBRTtZQUVELEVBQUU7Ozs7OztRQU1DLElBQUk7UUFFSixLQUNJLEtBQU0sUUFDTixNQUFPLEdBQUcsR0FDVixPQUFRLE9BQ1IsTUFBTztRQUNYLEVBQUUsUUFBUTtnQkFFVixFQUFFLElBQUksV0FBYTs7OztRQUluQixJQUFJO1FBRUosS0FDSSxLQUFNLFFBQ04sTUFBTyxFQUFFLEdBQ1QsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxJQUFJLFdBQWE7UUFFbkIsS0FDSSxLQUFNLE9BQ04sTUFBTyxHQUFHLEdBQ1YsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Z0JBRVYsRUFBRSxJQUFJLFdBQWE7UUFFbkIsS0FDSSxLQUFNLFVBQ04sTUFBTyxHQUFHLEdBQ1YsT0FBUSxPQUNSLE1BQU87UUFDWCxFQUFFLFFBQVE7Ozs7UUFJVixJQUFJO1FBQ0osRUFBRSxJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
