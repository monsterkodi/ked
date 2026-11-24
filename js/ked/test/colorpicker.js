var toExport = {}
var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.G5=_k_.k.B256(_k_.k.G(5))

var changes, data, e, h, hex, lines, m, newLines, noFg, oldLines, p, pal, pickr, r, rad, sheetPickr, spans, _162_37_, _197_59_

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

sheetPickr = function (colors = true)
{
    var e, h, p, tree

    h = new harness({cols:16,rows:9})
    e = new editor(h.screen,'test_editor_colorpicker_sheet',['susan'])
    e.layout(0,0,16,4)
    e.state.loadLines(['                ','                ','                ','                '])
    tree = {children:[{text:'hi',x:1,y:1,w:2,h:1,bg:'#0000ff'}]}
    if (colors)
    {
        tree.children[0].fg = '#ff0000'
    }
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

rad = function ()
{
    var h, r

    h = new harness({cols:20,rows:2})
    r = new radio(h.screen,'test_radio')
    r.layout(0,0,20,1)
    return [h,r]
}
toExport["colorpicker"] = async function ()
{
    await section("slider", async function ()
    {
        p = pickr()
        e = {type:'press',cell:[11,3],button:'left',count:1}
        p.onMouse(e)
        compare(p.hue.getValue(),133)
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
    await section("seeds", async function ()
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
        ;[h,e,p] = sheetPickr()
        compare(p.foregroundHex(),'#ff0000')
        compare(p.backgroundHex(),'#0000ff')
        ;[h,e,p] = sheetPickr(false)
        compare(p.activeIndex(),1)
        compare(p.colorVoided(0),true)
        compare(p.backgroundHex(),'#0000ff')
        compare(p.radio.options[0].label,'none')
        compare(p.radio.options[1].label,'#0000ff')
    })
    await section("live", async function ()
    {
        p = pickr()
        p.setHex('#000000')
        p.syncAll()
        p.red.changeValue(255)
        compare(p.foregroundHex(),'#ff0000')
        ;[h,e,p] = sheetPickr()
        p.setHex('#00ff00',0)
        p.setHex('#000000',1)
        p.submit()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#00ff00')
        compare(sds.get(e.state.rectree,'children.0.bg'),'#000000')
        ;[h,e,p] = sheetPickr()
        p.setHex('#123456',0)
        p.emitChanged()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#123456')
        e.draw()
        compare(h.screen.get_fg(2,1),[18,52,86])
        h = new harness({cols:16,rows:9})
        e = new editor(h.screen,'test_editor_colorpicker_sheet_node',[])
        e.layout(0,0,16,4)
        e.state.loadLines(['                ','                ','                ','                '])
        e.state.rectree = {bg:'#0000ff'}
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
    await section("undo", async function ()
    {
        ;[h,e,p] = sheetPickr()
        p.setHex('#123456',0)
        p.emitChanged()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#123456')
        e.state.undo()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#ff0000')
        ;[h,e,p] = sheetPickr()
        p.setHex('#123456',0)
        p.emitChanged()
        p.setHex('#654321',0)
        p.emitChanged()
        p.hide()
        e.state.undo()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#ff0000')
    })
    await section("void", async function ()
    {
        ;[h,e,p] = sheetPickr()
        p.voidActiveColor()
        p.submit()
        noFg = !(sds.get(e.state.rectree,'children.0.fg') != null)
        compare(noFg,true)
    })
}
toExport["colorpicker"]._section_ = true
toExport["colorpicker palette"] = async function ()
{
    await section("palette", async function ()
    {
        p = pickr()
        compare(p.palette,[])
        compare(p.pickerHeight(),9)
        compare(p.paletteMax,8)
        p.setHex('#ff0000')
        p.addCurrentColor()
        p.addCurrentColor()
        compare(p.palette,['#ff0000'])
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
    await section("height", async function ()
    {
        p = pickr()
        compare(p.pickerHeight(),9)
        p.setHex('#ff0000')
        p.addCurrentColor()
        compare(p.pickerHeight(),11)
    })
    await section("enter", async function ()
    {
        p = pickr()
        p.setHex('#ff0000')
        p.addCurrentColor()
        p.setHex('#00ff00')
        p.paletteView.setSelectedIndex(0)
        p.paletteView.grabFocus()
        e = {type:'press',combo:'return',char:''}
        p.onKey('return',e)
        compare(p.hex(),'#ff0000')
    })
    await section("focus ring", async function ()
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
    await section("overlay", async function ()
    {
        lines = [['a','b','c','d','e']]
        compare(colorspans.overlay([],[[1,0,4,0]],'#f00',lines),[[1,0,4,'#f00']])
        spans = [[0,0,5,'#00f']]
        compare(colorspans.overlay(spans,[[2,0,3,0]],'#f00',lines),[[0,0,2,'#00f'],[2,0,3,'#f00'],[3,0,5,'#00f']])
        lines = [['a','b','c','d','e'],['a','b','c','d','e'],['a','b','c','d','e']]
        compare(colorspans.overlay([],[[2,0,3,2]],'#f00',lines),[[2,0,5,'#f00'],[0,1,5,'#f00'],[0,2,3,'#f00']])
    })
    await section("adjust", async function ()
    {
        oldLines = [['a','b','c','d']]
        newLines = [['a','b','X','c','d']]
        compare(colorspans.adjust([[0,0,4,'#f00']],oldLines,newLines),[[0,0,5,'#f00']])
        compare(colorspans.adjust([[2,0,4,'#f00']],oldLines,newLines),[[3,0,5,'#f00']])
        oldLines = [['a','b','c','d','e']]
        newLines = [['a','b','e']]
        compare(colorspans.adjust([[0,0,5,'#f00']],oldLines,newLines),[[0,0,3,'#f00']])
        oldLines = [['a'],['b'],['c']]
        newLines = [['a'],['x'],['b'],['c']]
        compare(colorspans.adjust([[0,1,1,'#f00'],[0,2,1,'#0f0']],oldLines,newLines),[[0,2,1,'#f00'],[0,3,1,'#0f0']])
        oldLines = [['a'],['x'],['b'],['c']]
        newLines = [['a'],['b'],['c']]
        compare(colorspans.adjust([[0,2,1,'#f00'],[0,3,1,'#0f0']],oldLines,newLines),[[0,1,1,'#f00'],[0,2,1,'#0f0']])
    })
    await section("normalize", async function ()
    {
        compare(colorspans.normalize([[0,0,2,'#f00'],[2,0,4,'#f00'],[5,0,6,'#0f0']]),[[0,0,4,'#f00'],[5,0,6,'#0f0']])
    })
    await section("clear", async function ()
    {
        compare(colorspans.clear([[0,0,5,'#00f'],[6,0,9,'#00f']],[[2,0,7,0]]),[[0,0,2,'#00f'],[7,0,9,'#00f']])
    })
    await section("colorAtPos", async function ()
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
    await section("map preview", async function ()
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
    await section("cells", async function ()
    {
        ;[h,p] = pal(20,['#ff0000','#00ff00'])
        compare(h.screen.get_bg(5,0),[255,0,0])
        compare(h.screen.get_bg(15,0),[0,255,0])
        ;[h,p] = pal(20,['#ff0000','#00ff00','#0000ff'])
        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
        compare(h.row(0).includes('#0000ff'),false)
        ;[h,p] = pal(10,['#ff0000','#00ff00'])
        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
    })
    await section("edges", async function ()
    {
        ;[h,p] = pal(20,['#ff0000'])
        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
        ;[h,p] = pal(20,[])
        compare(p.options.length,0)
        compare(h.screen.get_bg(0,0),[])
    })
}
toExport["palette"]._section_ = true
toExport["radio"] = async function ()
{
    await section("options", async function ()
    {
        ;[h,r] = rad()
        r.setOptions([{color:[255,255,255],label:'#ffffff'}])
        r.draw()
        compare(h.row(0).includes('#ffffff'),true)
        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
        compare(h.screen.get_bg(10,0),[255,255,255])
        ;[h,r] = rad()
        r.setOptions([{color:[255,255,255],label:'#ffffff'},{color:[0,0,255],label:'#0000ff'}])
        r.draw()
        compare(h.row(0).includes('#ffffff'),true)
        compare(h.row(0).includes('#0000ff'),false)
        compare(h.screen.get_bg(2,0),[255,255,255])
        compare(h.screen.get_bg(17,0),[0,0,255])
        r.setSelectedIndex(1)
        compare(r.selectedIndex,1)
        r.draw()
        compare(h.row(0).includes('#ffffff'),false)
        compare(h.row(0).includes('#0000ff'),true)
    })
    await section("select", async function ()
    {
        ;[h,r] = rad()
        r.setOptions([{color:[255,255,255],label:'#ffffff'},{color:[0,0,255],label:'#0000ff'}])
        compare(r.selectedIndex,0)
        changes = []
        r.on('activeChange',function (idx)
        {
            return changes.push(idx)
        })
        r.select(0)
        r.select(1)
        r.select(1)
        compare(r.selectedIndex,1)
        compare(changes,[1])
    })
    await section("focus", async function ()
    {
        ;[h,r] = rad()
        r.setOptions([{color:[255,255,255],label:'#ffffff'},{color:[0,0,255],label:'#0000ff'}])
        r.setSelectedIndex(1)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDSCxjQUFkOztPQUNjLFlBQWQ7T0FBb0IsYUFBcEI7O09BQ2MsV0FBVDtPQUFjLGlCQUFkOztPQUNTLFlBQWQ7T0FBb0IsWUFBcEI7O09BQ2MsY0FBVDtPQUFpQixZQUFqQjs7T0FDUyxjQUFUOztPQUNTLGtCQUFUOzs7QUFFWjs7OztJQUNJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsWUFBWSxFQUFFLE9BQU8sRUFBRTtJQUMvQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRTtXQUNGOzs7QUFFSix1QkFBYyxTQUFPOzs7O0lBQ2pCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGlDQUFpQztJQUN6RCxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRSxNQUFNLFdBQVcsbUJBQW1CLG1CQUFtQixtQkFBbUI7SUFDNUUsUUFBUSxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRztRQUNkOztRQUFuQyxLQUFLLFNBQVMsR0FBRyxLQUFLOztJQUN0QixFQUFFLE1BQU0sYUFBYSxLQUFLLEdBQUc7SUFDN0IsRUFBRSxNQUFNLFlBQVksTUFBTSxLQUFLLEdBQUcsS0FBSyxJQUFJLEVBQUUsSUFBRyxRQUFRLE1BQU0sT0FBTztJQUNyRSxFQUFFLE1BQU07SUFDUixRQUFRLFlBQVksRUFBRSxPQUFPLEVBQUU7SUFDL0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ2hCLEVBQUU7WUFDRCxFQUFFLEVBQUU7OztBQUVULGdCQUFPLE1BQUs7Ozs7SUFDUixRQUFRLFNBQVEs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
//# sourceURL=../../../kode/ked/test/colorpicker.kode
