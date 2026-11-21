var toExport = {}
var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.G5=_k_.k.B256(_k_.k.G(5))

var data, e, h, hex, lines, m, newLines, noFg, oldLines, p, pal, pickr, r, sheetPickr, spans, _168_37_, _229_59_

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let sds = kxk.sds

import harness from "../util/harness.js"

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import belt from "../edit/tool/belt.js"
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

sheetPickr = function ()
{
    var e, h, p, tree

    h = new harness({cols:16,rows:9})
    e = new editor(h.screen,'test_editor_colorpicker_sheet',['susan'])
    e.layout(0,0,16,4)
    e.state.loadLines(['                ','                ','                ','                '])
    tree = {children:[{text:'hi',x:1,y:1,w:2,h:1,fg:'#ff0000',bg:'#0000ff'}]}
    e.state.setSheetTree(tree,16,4)
    e.state.renderSheet(tree,{cols:16,rows:4},[1,1],{history:false,silent:true})
    e.state.clearHistory()
    p = new colorpicker(h.screen,e,'test_colorpicker_sheet')
    p.layout(0,0,16,9)
    p.show()
    return [h,e,p]
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
    await section("an rgb input change updates the color", async function ()
    {
        p = pickr()
        p.setHex('#000000')
        p.syncAll()
        p.red.changeValue(255)
        compare(p.foregroundHex(),'#ff0000')
    })
    await section("a sheet node at the cursor seeds the picker", async function ()
    {
        var _a_ = sheetPickr(); h = _a_[0]; e = _a_[1]; p = _a_[2]

        compare(p.foregroundHex(),'#ff0000')
        compare(p.backgroundHex(),'#0000ff')
    })
    await section("a sheet node with only a background selects it", async function ()
    {
        h = new harness({cols:16,rows:9})
        e = new editor(h.screen,'test_editor_colorpicker_sheet_bg',[])
        e.layout(0,0,16,4)
        e.state.loadLines(['                ','                ','                ','                '])
        e.state.rectree = {children:[{text:'hi',x:1,y:1,w:2,h:1,bg:'#0000ff'}]}
        e.state.rectreeCols = 16
        e.state.rectreeRows = 4
        e.state.setCursors([[1,1]])
        p = new colorpicker(h.screen,e,'test_colorpicker_sheet_bg')
        p.layout(0,0,16,9)
        p.show()
        compare(p.activeIndex(),1)
        compare(p.colorVoided(0),true)
        compare(p.backgroundHex(),'#0000ff')
        compare(p.radio.options[0].label,'none')
        compare(p.radio.options[1].label,'#0000ff')
    })
    await section("a sheet node passed in is updated live", async function ()
    {
        h = new harness({cols:16,rows:9})
        e = new editor(h.screen,'test_editor_colorpicker_sheet_node',[])
        e.layout(0,0,16,4)
        e.state.loadLines(['                ','                ','                ','                '])
        e.state.rectree = {bg:'#0000ff'}
        e.state.rectreeCols = 16
        e.state.rectreeRows = 4
        e.state.setCursors([[1,1]])
        p = new colorpicker(h.screen,e,'test_colorpicker_sheet_node')
        p.layout(0,0,16,9)
        p.show([null,'#0000ff'],{node:e.state.rectree})
        p.setHex('#ff0000',1)
        p.emitChanged()
        compare(sds.get(e.state.rectree,'bg'),'#ff0000')
        noFg = !(e.state.rectree.fg != null)
        compare(noFg,true)
    })
    await section("return sets the colors on the sheet node", async function ()
    {
        var _b_ = sheetPickr(); h = _b_[0]; e = _b_[1]; p = _b_[2]

        p.setHex('#00ff00',0)
        p.setHex('#000000',1)
        p.submit()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#00ff00')
        compare(sds.get(e.state.rectree,'children.0.bg'),'#000000')
    })
    await section("changing a color updates the sheet live", async function ()
    {
        var _c_ = sheetPickr(); h = _c_[0]; e = _c_[1]; p = _c_[2]

        p.setHex('#123456',0)
        p.emitChanged()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#123456')
        e.draw()
        compare(h.screen.get_fg(2,1),[18,52,86])
    })
    await section("a sheet color change can be undone", async function ()
    {
        var _d_ = sheetPickr(); h = _d_[0]; e = _d_[1]; p = _d_[2]

        p.setHex('#123456',0)
        p.emitChanged()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#123456')
        e.state.undo()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#ff0000')
    })
    await section("a color drag is one undo step", async function ()
    {
        var _e_ = sheetPickr(); h = _e_[0]; e = _e_[1]; p = _e_[2]

        p.setHex('#123456',0)
        p.emitChanged()
        p.setHex('#654321',0)
        p.emitChanged()
        p.hide()
        e.state.undo()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#ff0000')
    })
    await section("a voided channel is removed from the sheet node", async function ()
    {
        var _f_ = sheetPickr(); h = _f_[0]; e = _f_[1]; p = _f_[2]

        p.voidActiveColor()
        p.submit()
        noFg = !(sds.get(e.state.rectree,'children.0.fg') != null)
        compare(noFg,true)
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
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            hex = list[_10_]
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
}
toExport["colorstate"]._section_ = true
toExport["palette"] = async function ()
{
    await section("a cell shows its color", async function ()
    {
        var _11_ = pal(20,['#ff0000','#00ff00']); h = _11_[0]; p = _11_[1]

        compare(h.screen.get_bg(5,0),[255,0,0])
        compare(h.screen.get_bg(15,0),[0,255,0])
    })
    await section("one narrow cell keeps all the cells from showing their hex value", async function ()
    {
        var _12_ = pal(20,['#ff0000','#00ff00','#0000ff']); h = _12_[0]; p = _12_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
        compare(h.row(0).includes('#0000ff'),false)
    })
    await section("a narrow cell shows no hex value", async function ()
    {
        var _13_ = pal(10,['#ff0000','#00ff00']); h = _13_[0]; p = _13_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
    })
    await section("the palette has rounded edges", async function ()
    {
        var _14_ = pal(20,['#ff0000']); h = _14_[0]; p = _14_[1]

        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
    })
    await section("an empty palette has no cells", async function ()
    {
        var _15_ = pal(20,[]); h = _15_[0]; p = _15_[1]

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
toExport["color"] = async function ()
{
    await section("hex", async function ()
    {
        compare(color.hex([0,0,0]),'#000000')
        compare(color.hex([0,255,0]),'#00ff00')
        compare(color.hex([255,255,0]),'#ffff00')
        compare(color.hex('#ffff00'),'#ffff00')
    })
    await section("darken", async function ()
    {
        compare(color.darken(color.values('ffff00'),1),color.values('#ffff00'))
        compare(color.darken(color.values('ffff00'),0.9),color.values('#e5e500'))
        compare(color.darken(color.values('ffff00'),0.8),color.values('#cccc00'))
        compare(color.darken(color.values('ffff00'),0.7),color.values('#b2b200'))
        compare(color.darken(color.values('ffff00'),0.6),color.values('#999900'))
        compare(color.darken(color.values('ffff00')),color.values('#7f7f00'))
        compare(color.darken(color.values('ffff00'),0.4),color.values('#666600'))
        compare(color.darken(color.values('ffff00'),0.3),color.values('#4c4c00'))
        compare(color.darken(color.values('ffff00'),0.2),color.values('#333300'))
        compare(color.darken(color.values('ffff00'),0.1),color.values('#191900'))
        compare(color.darken(color.values('ffff00'),0),color.values('#000000'))
    })
    await section("colorSeglsForText", async function ()
    {
        compare(belt.colorSeglsForText("hello\nworld"),[[],kseg.segls("hello\nworld")])
        compare(belt.colorSeglsForText(_k_.r5("red")),[[[{x:0,fg:[255,0,0],w:3}]],kseg.segls("red")])
        compare(belt.colorSeglsForText(_k_.r5("red") + _k_.g5("green")),[[[{x:0,fg:[255,0,0],w:3},{x:3,fg:[0,255,0],w:5}]],kseg.segls("redgreen")])
        compare(belt.colorSeglsForText(_k_.G5(_k_.r5("redOnGreen"))),[[[{x:0,bg:[0,255,0],w:10},{x:0,fg:[255,0,0],w:10}]],kseg.segls("redOnGreen")])
        compare(belt.colorSeglsForText(color.bg_rgb([12,123,234]) + ("bgrgb")),[[[{x:0,bg:[12,123,234]}]],kseg.segls("bgrgb")])
        compare(belt.colorSeglsForText(color.fg_rgb([12,123,234]) + ("fgrgb")),[[[{x:0,fg:[12,123,234]}]],kseg.segls("fgrgb")])
        compare(belt.colorSeglsForText(color.bg_rgb([12,123,234]) + color.fg_rgb([12,123,234]) + ("rgb")),[[[{x:0,bg:[12,123,234]},{x:0,fg:[12,123,234]}]],kseg.segls("rgb")])
        compare(belt.colorSeglsForText(`▸ ${color.fg_rgb([255,255,0,0])}${color.fg_rgb()} ms`),[[[{x:2,fg:[255,255,0],w:1}]],kseg.segls("▸  ms")])
    })
    await section("adjustForBackground", async function ()
    {
        compare(color.adjustForBackground([255,255,0],[0,0,0]),[255,255,0])
        compare(color.adjustForBackground([255,255,0],[200,200,0]),[76,77,0])
        compare(color.adjustForBackground([255,255,255],[170,170,170]),[51,51,51])
    })
}
toExport["color"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDSCxjQUFkOztPQUNjLFlBQWQ7T0FBb0IsYUFBcEI7O09BQ2MsV0FBVDtPQUFjLGlCQUFkOztPQUNTLFlBQWQ7T0FBb0IsWUFBcEI7O09BQ2MsY0FBVDtPQUFpQixZQUFqQjs7T0FDUyxjQUFUOztPQUNTLGtCQUFUOzs7QUFFWjs7OztJQUNJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsWUFBWSxFQUFFLE9BQU8sRUFBRTtJQUMvQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRTtXQUNGOzs7QUFFSjs7OztJQUVJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGlDQUFpQztJQUN6RCxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFFaEIsRUFBRSxNQUFNLFdBQVcsbUJBQW1CLG1CQUFtQixtQkFBbUI7SUFFNUUsUUFBUSxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxVQUFVLEdBQUc7SUFFOUQsRUFBRSxNQUFNLGFBQWEsS0FBSyxHQUFHO0lBQzdCLEVBQUUsTUFBTSxZQUFZLE1BQU0sS0FBSyxHQUFHLEtBQUssSUFBSSxFQUFFLElBQUcsUUFBUSxNQUFNLE9BQU87SUFDckUsRUFBRSxNQUFNO0lBRVIsUUFBUSxZQUFZLEVBQUUsT0FBTyxFQUFFO0lBQy9CLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztJQUNoQixFQUFFO1lBRUQsRUFBRSxFQUFFOzs7QUFFVCxnQkFBTyxNQUFLOzs7O0lBRVIsUUFBUSxTQUFRLEtBQUssS0FBSyxLQUFLO0lBQy9CLFFBQVEsUUFBUSxFQUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
