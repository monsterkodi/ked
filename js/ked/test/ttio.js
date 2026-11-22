var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var c, cell, ch, clicks, e, exists, frame, h, img, keys, live, maxLive, pasteKeys, s, seqs, t, written, _283_27_

import editor from "../edit/editor.js"

import ttio from "../view/screen/ttio.js"
import screen from "../view/screen/screen.js"
import cells from "../view/screen/cells.js"

import harness from "../util/harness.js"
import keyscript from "../util/keyscript.js"


pasteKeys = function (chunks)
{
    var chunk, keys, pastes, t

    t = new ttio({headless:true,input:false})
    pastes = 0
    keys = []
    t.on('paste',function ()
    {
        return pastes += 1
    })
    t.on('key',function (combo, event)
    {
        return keys.push([combo,event.char])
    })
    var list = _k_.list(chunks)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        chunk = list[_a_]
        t.onData(Buffer.from(chunk,'utf8'))
    }
    return {pastes:pastes,keys:keys}
}
toExport["ttio"] = async function ()
{
    await section("headless", async function ()
    {
        t = new ttio({headless:true,input:false})
        compare(t.cellsz,[])
        t.syncStart()
        t.syncEnd()
        compare(t.written(),'\x1b[?2026h\x1b[?2026l')
        seqs = t.parseData(Buffer.from('\x1b[B\r'))
        compare(seqs.length,2)
        compare(seqs[0].csi,'B')
        compare(seqs[1].raw,'\r')
        seqs = t.parseData(Buffer.from('\x1bOP\x1b[B'))
        compare(seqs.length,2)
        compare(seqs[0].esc,'OP')
        compare(seqs[1].csi,'B')
    })
    await section("hide and show images", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        img = {id:41}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.placeImg(img,1,2,null,null,null,null,1000)
        compare((t.written().split('a=p').length - 1),1)
        img = {id:42}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.showImg(img.id,img.pid)
        compare((t.written().split('a=p').length - 1),3)
        compare(t.written().includes("a=p,i=42,p=1,X=0,Y=0,w=10,h=20,z=1000,C=1"),true)
        img = {id:43}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.removeImgs()
        t.placeImg(img,1,2,null,null,null,null,1000)
        compare((t.written().split('a=p').length - 1),4)
        img = {id:44}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.placeImg(img,1,2,null,null,null,null,1000)
        compare((t.written().split('a=p').length - 1),5)
        img = {id:45}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.removeImgs()
        t.removeImgs()
        t.out = []
        t.showImg(img.id,img.pid)
        compare(t.written().includes('a=p'),false)
    })
    await section("cursor images", async function ()
    {
        h = new harness({cols:40,rows:12})
        h.t.cellsz = [10,20]
        e = new editor(h.screen,'test_show_cursors',[])
        e.layout(0,0,40,12)
        e.state.loadLines(['abc'])
        e.state.setCursors([[0,0]])
        img = {id:42}
        h.t.placeImg(img,0,0,null,null,null,null,666)
        h.t.hideImg(img.id,img.pid)
        e.cursorIds = {}
        e.cursorIds[0] = [img.id,img.pid]
        h.t.out = []
        e.showCursorsOutsideRects([])
        compare((h.t.written().split('a=p').length - 1),1)
        img = {id:42}
        h.t.placeImg(img,0,0,null,null,null,null,666)
        h.t.hideImg(img.id,img.pid)
        e.cursorIds = {}
        e.cursorIds[0] = [img.id,img.pid]
        h.t.out = []
        e.showCursorsOutsideRects([[0,0,39,11]])
        compare(h.t.written().includes('a=p'),false)
        h.t.removeImgs()
        h.t.headless = false
        live = 0
        maxLive = 0
        h.t.write = function (str)
        {
            var args, idpl

            h.t.out.push(str)
            live = 0
            for (idpl in h.t.plargs)
            {
                args = h.t.plargs[idpl]
                if (args[6] === 666)
                {
                    live += 1
                }
            }
            return maxLive = _k_.max(maxLive,live)
        }
        e.state.loadLines(['abcdefghijabcdefghijabcdefghijabcdefghij'])
        e.state.setCursors([[0,0]])
        frame = function ()
        {
            var erases

            erases = h.screen.eraseRects
            e.draw()
            h.screen.render()
            h.t.removeImgs()
            return e.showCursorsOutsideRects(erases)
        }
        frame()
        compare(maxLive,1)
        e.state.setCursors([[1,0]])
        frame()
        compare(maxLive,1)
    })
    await section("overlay colors", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        t.placeImageOverlay(1,0,0,0,10,20)
        t.placeCellRectOverlay(2,0,0,0,10,20)
        compare((t.overlayID !== t.cellRectOverlayID),true)
        written = t.written()
        compare(written.includes(`a=p,i=${t.overlayID},p=1`),true)
        compare(written.includes(`a=p,i=${t.cellRectOverlayID},p=2`),true)
    })
    await section("keys", async function ()
    {
        t = new ttio({headless:true,input:false})
        keys = []
        t.on('key',function (combo, event)
        {
            return keys.push([combo,event.char])
        })
        var list = ['a','b',' ','!']
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            ch = list[_b_]
            t.onData(Buffer.from(ch))
        }
        compare(keys,[['a','a'],['b','b'],[' ',' '],['!','!']])
        keys = []
        t.onData(Buffer.from('\x1b[B\x1b[B\r'))
        compare(keys,[['down',''],['down',''],['return','\n']])
        keys = []
        var list1 = ['A','b']
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            ch = list1[_c_]
            t.onData(Buffer.from(ch))
        }
        compare(keys,[['shift+a','A'],['b','b']])
        keys = []
        t.onData(Buffer.from('\x1b[104;1u'))
        t.onData(Buffer.from('\x1b[105u'))
        compare(keys,[['h','h'],['i','i']])
    })
    await section("mouse event", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        clicks = []
        t.on('mouse',function (event)
        {
            return clicks.push(event)
        })
        t.onData(Buffer.from('\x1b[<0;100;80M'))
        compare(clicks.length,1)
        compare(clicks[0].type,'press')
        compare(clicks[0].button,'left')
        compare(clicks[0].cell,[10,4])
    })
    await section("terminal paste", async function ()
    {
        compare(pasteKeys(['\x1b[200~■\x1b[201~']),{pastes:1,keys:[]})
        compare(pasteKeys(['\x1b[200~a■b\x1b[201~']),{pastes:1,keys:[]})
        compare(pasteKeys(['\x1b[200~a','■b\x1b[20','1~']),{pastes:1,keys:[]})
        compare(pasteKeys(['\x1b[200~■\x1b[201~\x1b[B']),{pastes:1,keys:[['down','']]})
        compare(pasteKeys(['\x1b[200~a\x1b[201~\x1b[200~b\x1b[201~']),{pastes:2,keys:[]})
        compare(pasteKeys(['\x1b[200~a\x1b[Bb\x1b[201~']),{pastes:1,keys:[]})
        compare(pasteKeys(['ab\r']),{pastes:0,keys:[['a','a'],['b','b'],['return','\n']]})
    })
    await section("escape", async function ()
    {
        t = new ttio({headless:true,input:false})
        compare(t.parseEsc('c'),{key:'c',type:'press',combo:'alt+c',char:'c'})
        compare(t.parseEsc(','),{key:',',type:'press',combo:'alt+,',char:','})
        compare(t.parseEsc('C'),{key:'c',type:'press',combo:'alt+shift+c',char:'C'})
        compare(t.parseEsc('\\'),undefined)
    })
}
toExport["ttio"]._section_ = true
toExport["keyscript"] = async function ()
{
    compare(keyscript.bytes('down'),'\x1b[B')
    compare(keyscript.bytes('up'),'\x1b[A')
    compare(keyscript.bytes('left'),'\x1b[D')
    compare(keyscript.bytes('right'),'\x1b[C')
    compare(keyscript.bytes('return'),'\r')
    compare(keyscript.bytes('space'),' ')
    compare(keyscript.bytes('esc'),'\x1b[27u')
    compare(keyscript.bytes('ab'),'ab')
    compare(keyscript.bytes('a'),'a')
    compare(keyscript.bytes('cmd+o'),'\x1b[111;9u')
    compare(keyscript.bytes('ctrl+s'),'\x1b[115;5u')
    compare(keyscript.bytes('alt+r'),'\x1b[114;3u')
    compare(keyscript.bytes('shift+cmd+s'),'\x1b[115;10u')
    compare(keyscript.bytes('cmd+down'),'\x1b[1;9B')
    compare(keyscript.bytes('cmd+tab'),'\x1b[9;9u')
    compare(keyscript.bytes('cmd+foo'),'cmd+foo')
    compare(keyscript.bytes('o+'),'o+')
    compare(keyscript.bytes('\x1b[B'),'\x1b[B')
    compare(keyscript.script('cmd+o down'),'\x1b[111;9u\x1b[B')
    compare(keyscript.script('a b'),'ab')
    compare(keyscript.script('  '),'')
    compare(keyscript.steps('cmd+o down'),[['cmd+o','\x1b[111;9u'],['down','\x1b[B']])
    compare(keyscript.steps('ab'),[['a','a'],['b','b']])
    compare(keyscript.steps(''),[])
}
toExport["keyscript"]._section_ = true

cell = function ()
{
    var c, s

    t = new ttio({headless:true,input:false,cols:20,rows:6})
    s = new screen(t)
    c = new cells(s)
    c.layout(2,1,10,4)
    return [s,c]
}
toExport["cells"] = async function ()
{
    await section("rect", async function ()
    {
        var _d_ = cell(); s = _d_[0]; c = _d_[1]

        compare(c.draw_cell_rect({x:1,y:1,w:4,h:3}),[])
        compare(c.cellRect,{x:1,y:1,w:4,h:3})
        c.del_cell_rect([])
        exists = (c.cellRect != null)
        compare(exists,false)
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),' ')
    })
    await section("corners", async function ()
    {
        var _e_ = cell(); s = _e_[0]; c = _e_[1]

        c.draw_cell_rect({x:1,y:1,w:4,h:3})
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),'╭')
        compare(s.get_char(6,4),'╯')
        compare(s.get_char(4,2),' ')
        var _f_ = cell(); s = _f_[0]; c = _f_[1]

        c.draw_cell_rect({x:-1,y:0,w:3,h:2})
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),'╯')
        compare(s.get_char(1,1),' ')
    })
}
toExport["cells"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC90dGlvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ3FCLGFBQWQ7O09BQ2MsV0FBUjtPQUFhLGFBQWI7T0FBb0IsWUFBcEI7O09BQ1EsY0FBZDtPQUFzQixnQkFBdEI7OztBQUVQLHNCQUFhOzs7O0lBRVQsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO0lBQ2pDLFNBQVM7SUFDVDtJQUVBLEVBQUUsR0FBRzs7ZUFBVyxVQUFVOztJQUMxQixFQUFFLEdBQUcsZ0JBQU8sT0FBTTs7ZUFBVSxLQUFLLE1BQU0sTUFBTSxNQUFNOzt3QkFFdEM7OztRQUFUO1FBQ0EsRUFBRSxPQUFPLE9BQU8sS0FBSyxNQUFNOztZQUUzQixPQUFRLE9BQVEsS0FBTTs7Ozs7O1FBTXRCLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTTtnQkFDakMsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO2dCQUNGLEVBQUUsVUFBWTtRQUVkLE9BQU8sRUFBRSxVQUFVLE9BQU8sS0FBSztnQkFDL0IsS0FBSyxPQUFTO2dCQUNkLEtBQUssR0FBRyxJQUFNO2dCQUNkLEtBQUssR0FBRyxJQUFNO1FBRWQsT0FBTyxFQUFFLFVBQVUsT0FBTyxLQUFLO2dCQUMvQixLQUFLLE9BQVM7Z0JBQ2QsS0FBSyxHQUFHLElBQU07Z0JBQ2QsS0FBSyxHQUFHLElBQU07Ozs7UUFJZCxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07UUFDakMsRUFBRSxVQUFVLEdBQUc7UUFFZixPQUFPLEdBQUc7UUFFVixFQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUUsS0FBSyxLQUFLLEtBQUssS0FBSztRQUN2QyxFQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUUsS0FBSyxLQUFLLEtBQUssS0FBSztpQkFFdEMsRUFBRSxVQUFVLE1BQU0sT0FBTyxTQUFTLEdBQUs7UUFFeEMsT0FBTyxHQUFHO1FBRVYsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/ttio.kode
