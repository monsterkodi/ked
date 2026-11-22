var toExport = {}
var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.G5=_k_.k.B256(_k_.k.G(5))

var data, e, h, hex, lines, m, newLines, noFg, oldLines, p, pal, pickr, r, rad, sheetPickr, spans, _164_37_, _199_59_

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
        var _a_ = sheetPickr(); h = _a_[0]; e = _a_[1]; p = _a_[2]

        compare(p.foregroundHex(),'#ff0000')
        compare(p.backgroundHex(),'#0000ff')
        var _b_ = sheetPickr(false); h = _b_[0]; e = _b_[1]; p = _b_[2]

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
        var _c_ = sheetPickr(); h = _c_[0]; e = _c_[1]; p = _c_[2]

        p.setHex('#00ff00',0)
        p.setHex('#000000',1)
        p.submit()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#00ff00')
        compare(sds.get(e.state.rectree,'children.0.bg'),'#000000')
        var _d_ = sheetPickr(); h = _d_[0]; e = _d_[1]; p = _d_[2]

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
    await section("undo", async function ()
    {
        var _e_ = sheetPickr(); h = _e_[0]; e = _e_[1]; p = _e_[2]

        p.setHex('#123456',0)
        p.emitChanged()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#123456')
        e.state.undo()
        compare(sds.get(e.state.rectree,'children.0.fg'),'#ff0000')
        var _f_ = sheetPickr(); h = _f_[0]; e = _f_[1]; p = _f_[2]

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
        var _10_ = sheetPickr(); h = _10_[0]; e = _10_[1]; p = _10_[2]

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
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            hex = list[_11_]
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
        p.paletteView.setActive(0)
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
        var _12_ = pal(20,['#ff0000','#00ff00']); h = _12_[0]; p = _12_[1]

        compare(h.screen.get_bg(5,0),[255,0,0])
        compare(h.screen.get_bg(15,0),[0,255,0])
        var _13_ = pal(20,['#ff0000','#00ff00','#0000ff']); h = _13_[0]; p = _13_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
        compare(h.row(0).includes('#0000ff'),false)
        var _14_ = pal(10,['#ff0000','#00ff00']); h = _14_[0]; p = _14_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
    })
    await section("edges", async function ()
    {
        var _15_ = pal(20,['#ff0000']); h = _15_[0]; p = _15_[1]

        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
        var _16_ = pal(20,[]); h = _16_[0]; p = _16_[1]

        compare(p.options.length,0)
        compare(h.screen.get_bg(0,0),[])
    })
}
toExport["palette"]._section_ = true
toExport["radio"] = async function ()
{
    await section("options", async function ()
    {
        var _17_ = rad(); h = _17_[0]; r = _17_[1]

        r.setOptions([{color:[255,255,255],label:'#ffffff'}])
        r.draw()
        compare(h.row(0).includes('#ffffff'),true)
        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
        compare(h.screen.get_bg(10,0),[255,255,255])
        var _18_ = rad(); h = _18_[0]; r = _18_[1]

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
    await section("focus", async function ()
    {
        var _19_ = rad(); h = _19_[0]; r = _19_[1]

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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY29sb3JwaWNrZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDSCxjQUFkOztPQUNjLFlBQWQ7T0FBb0IsYUFBcEI7O09BQ2MsV0FBVDtPQUFjLGlCQUFkOztPQUNTLFlBQWQ7T0FBb0IsWUFBcEI7O09BQ2MsY0FBVDtPQUFpQixZQUFqQjs7T0FDUyxjQUFUOztPQUNTLGtCQUFUOzs7QUFFWjs7OztJQUNJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsWUFBWSxFQUFFLE9BQU8sRUFBRTtJQUMvQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRTtXQUNGOzs7QUFFSix1QkFBYyxTQUFPOzs7O0lBQ2pCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGlDQUFpQztJQUN6RCxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRSxNQUFNLFdBQVcsbUJBQW1CLG1CQUFtQixtQkFBbUI7SUFDNUUsUUFBUSxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRztRQUNkOztRQUFuQyxLQUFLLFNBQVMsR0FBRyxLQUFLOztJQUN0QixFQUFFLE1BQU0sYUFBYSxLQUFLLEdBQUc7SUFDN0IsRUFBRSxNQUFNLFlBQVksTUFBTSxLQUFLLEdBQUcsS0FBSyxJQUFJLEVBQUUsSUFBRyxRQUFRLE1BQU0sT0FBTztJQUNyRSxFQUFFLE1BQU07SUFDUixRQUFRLFlBQVksRUFBRSxPQUFPLEVBQUU7SUFDL0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ2hCLEVBQUU7WUFDRCxFQUFFLEVBQUU7OztBQUVULGdCQUFPLE1BQUs7Ozs7SUFDUixRQUFRLFNBQVEs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorpicker.kode
