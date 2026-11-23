var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var c, cell, ch, clicks, e, frame, h, ids, img, keys, live, maxLive, pasteKeys, places, s, seqs, t, written, _292_18_

import editor from "../edit/editor.js"

import ttio from "../view/screen/ttio.js"
import screen from "../view/screen/screen.js"
import cells from "../view/screen/cells.js"
import vterm from "../view/screen/vterm.js"

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
        compare(t.cellsz,[10,20])
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
    await section("graphics replies", async function ()
    {
        compare(pasteKeys(['\x1b_Gi=101;ENOENT:no image\x1b\\x']).keys,[['x','x']])
        compare(pasteKeys(['\x1b_Gi=101;ENOENT:no ','image\x1b\\x','y']).keys,[['x','x'],['y','y']])
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

        ids = c.draw_cell_rect({x:1,y:1,w:4,h:3})
        compare(ids.length,4)
        compare(c.cellRect,{x:1,y:1,w:4,h:3})
        places = new vterm(20,6).feed(s.t.written()).placements().map(function (img)
        {
            return [img.x,img.y]
        })
        compare(places,[[3,2],[3,2],[6,2],[3,4]])
        c.del_cell_rect(ids)
        compare((c.cellRect != null),false)
        compare(new vterm(20,6).feed(s.t.written()).placements(),[])
    })
}
toExport["cells"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC90dGlvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ3FCLGFBQWQ7O09BQ2MsV0FBUjtPQUFhLGFBQWI7T0FBb0IsWUFBcEI7T0FBMEIsWUFBMUI7O09BQ1EsY0FBZDtPQUFzQixnQkFBdEI7OztBQUVQLHNCQUFhOzs7O0lBRVQsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO0lBQ2pDLFNBQVM7SUFDVDtJQUVBLEVBQUUsR0FBRzs7ZUFBVyxVQUFVOztJQUMxQixFQUFFLEdBQUcsZ0JBQU8sT0FBTTs7ZUFBVSxLQUFLLE1BQU0sTUFBTSxNQUFNOzt3QkFFdEM7OztRQUFUO1FBQ0EsRUFBRSxPQUFPLE9BQU8sS0FBSyxNQUFNOztZQUUzQixPQUFRLE9BQVEsS0FBTTs7Ozs7O1FBTXRCLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTTtnQkFDakMsRUFBRSxRQUFVLEdBQUc7UUFDZixFQUFFO1FBQ0YsRUFBRTtnQkFDRixFQUFFLFVBQVk7UUFFZCxPQUFPLEVBQUUsVUFBVSxPQUFPLEtBQUs7Z0JBQy9CLEtBQUssT0FBUztnQkFDZCxLQUFLLEdBQUcsSUFBTTtnQkFDZCxLQUFLLEdBQUcsSUFBTTtRQUVkLE9BQU8sRUFBRSxVQUFVLE9BQU8sS0FBSztnQkFDL0IsS0FBSyxPQUFTO2dCQUNkLEtBQUssR0FBRyxJQUFNO2dCQUNkLEtBQUssR0FBRyxJQUFNOzs7O2dCQUlkLFdBQVcsdUNBQXVDLE9BQVMsSUFBSTtnQkFDL0QsV0FBVyx5QkFBeUIsZUFBZSxNQUFNLE9BQVMsSUFBSSxNQUFNLElBQUk7Ozs7UUFJaEYsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBQ2pDLEVBQUUsVUFBVSxHQUFHO1FBRWYsT0FBTyxHQUFHO1FBRVYsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7UUFDdkMsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFL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
//# sourceURL=../../../kode/ked/test/ttio.kode
