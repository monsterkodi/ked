var toExport = {}
var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var ch, clicks, e, event, frame, h, img, keys, live, maxLive, pasteKeys, seqs, t, written

import editor from "../edit/editor.js"

import ttio from "../view/screen/ttio.js"

import harness from "../util/harness.js"
import keyscript from "../util/keyscript.js"


pasteKeys = function (chunks, enc = 'utf8')
{
    var chunk, keys, pastes, t

    if (_k_.isStr(chunks))
    {
        chunks = [chunks]
    }
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
        t.onData(Buffer.from(chunk,enc))
    }
    return {pastes:pastes,keys:keys}
}
toExport["ttio"] = async function ()
{
    await section("a headless ttio has no cells", async function ()
    {
        t = new ttio({headless:true,input:false})
        compare(t.cellsz,[])
    })
    await section("a synchronized update can bracket a frame", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.syncStart()
        t.syncEnd()
        compare(t.written(),'\x1b[?2026h\x1b[?2026l')
    })
    await section("a csi sequence ends with its final byte", async function ()
    {
        t = new ttio({headless:true,input:false})
        seqs = t.parseData(Buffer.from('\x1b[B\r'))
        compare(seqs.length,2)
        compare(seqs[0].csi,'B')
        compare(seqs[1].raw,'\r')
    })
    await section("a sequence that is not a csi one ends where the next escape is", async function ()
    {
        seqs = t.parseData(Buffer.from('\x1bOP\x1b[B'))
        compare(seqs.length,2)
        compare(seqs[0].esc,'OP')
        compare(seqs[1].csi,'B')
    })
    await section("an image placement is sent only once per frame", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        img = {id:42}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.placeImg(img,1,2,null,null,null,null,1000)
        compare((t.written().split('a=p').length - 1),1)
    })
    await section("overlays with different colors use different image data", async function ()
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
    await section("a hidden image placement can be shown again", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        img = {id:42}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.showImg(img.id,img.pid)
        compare((t.written().split('a=p').length - 1),2)
        compare(t.written().includes("a=p,i=42,p=1,X=0,Y=0,w=10,h=20,z=1000,C=1"),true)
    })
    await section("a hidden image stays hidden when placed again", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        img = {id:42}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.removeImgs()
        t.placeImg(img,1,2,null,null,null,null,1000)
        compare((t.written().split('a=p').length - 1),1)
    })
    await section("a hidden image stays hidden when placed again in the same frame", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        img = {id:42}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.placeImg(img,1,2,null,null,null,null,1000)
        compare((t.written().split('a=p').length - 1),1)
    })
    await section("an image removed while hidden is not shown again", async function ()
    {
        t = new ttio({headless:true,input:false})
        t.cellsz = [10,20]
        img = {id:42}
        t.placeImg(img,1,2,null,null,null,null,1000)
        t.hideImg(img.id,img.pid)
        t.removeImgs()
        t.removeImgs()
        t.out = []
        t.showImg(img.id,img.pid)
        compare(t.written().includes('a=p'),false)
    })
    await section("a cursor hidden under an erasure is shown when the erasure is gone", async function ()
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
    })
    await section("a cursor hidden under an erasure stays hidden while it exists", async function ()
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
        e.showCursorsOutsideRects([[0,0,39,11]])
        compare(h.t.written().includes('a=p'),false)
    })
    await section("a moved cursor never has two placements at once", async function ()
    {
        h = new harness({cols:40,rows:12})
        h.t.cellsz = [10,20]
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
        e = new editor(h.screen,'test_two_cursors',[])
        e.layout(0,0,40,12)
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
    await section("the keys of a chunk are keys of their own", async function ()
    {
        keys = []
        t.on('key',function (combo)
        {
            return keys.push(combo)
        })
        t.onData(Buffer.from('\x1b[B\x1b[B\r'))
        compare(keys,['down','down','return'])
    })
    await section("a printable character is a key with itself as combo and char", async function ()
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
    })
    await section("an uppercase character is shift and that character", async function ()
    {
        t = new ttio({headless:true,input:false})
        keys = []
        t.on('key',function (combo, event)
        {
            return keys.push([combo,event.char])
        })
        var list1 = ['A','b']
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            ch = list1[_c_]
            t.onData(Buffer.from(ch))
        }
        compare(keys,[['shift+a','A'],['b','b']])
    })
    await section("a kitty character without modifiers is its own char", async function ()
    {
        t = new ttio({headless:true,input:false})
        keys = []
        t.on('key',function (combo, event)
        {
            return keys.push([combo,event.char])
        })
        t.onData(Buffer.from('\x1b[104;1u'))
        t.onData(Buffer.from('\x1b[105u'))
        compare(keys,[['h','h'],['i','i']])
    })
    await section("a mouse press in a chunk is a mouse event", async function ()
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
    await section("a bracketed paste in one chunk is one paste", async function ()
    {
        compare(pasteKeys('\x1b[200~■\x1b[201~','utf8'),{pastes:1,keys:[]})
    })
    await section("the text of a paste does not leak out as keys", async function ()
    {
        compare(pasteKeys('\x1b[200~a■b\x1b[201~','utf8'),{pastes:1,keys:[]})
    })
    await section("a bracketed paste arriving in parts is one paste when it ends", async function ()
    {
        compare(pasteKeys(['\x1b[200~a','■b\x1b[20','1~'],'utf8'),{pastes:1,keys:[]})
    })
    await section("input after a bracketed paste is still handled", async function ()
    {
        compare(pasteKeys('\x1b[200~■\x1b[201~\x1b[B','utf8'),{pastes:1,keys:[['down','']]})
    })
    await section("two bracketed pastes in one chunk are two pastes", async function ()
    {
        compare(pasteKeys('\x1b[200~a\x1b[201~\x1b[200~b\x1b[201~','utf8'),{pastes:2,keys:[]})
    })
    await section("escape sequences inside a paste are part of the paste", async function ()
    {
        compare(pasteKeys('\x1b[200~a\x1b[Bb\x1b[201~','utf8'),{pastes:1,keys:[]})
    })
    await section("text typed in one chunk arrives as keys", async function ()
    {
        compare(pasteKeys('ab\r','utf8'),{pastes:0,keys:[['a','a'],['b','b'],['return','\n']]})
    })
    await section("an escape before a printable character is alt and that character", async function ()
    {
        t = new ttio({headless:true,input:false})
        event = t.parseEsc('c')
        compare(event.combo,'alt+c')
        compare(event.key,'c')
        compare(event.char,'c')
    })
    await section("an escape before punctuation is alt and the punctuation", async function ()
    {
        t = new ttio({headless:true,input:false})
        compare(t.parseEsc(',').combo,'alt+,')
    })
    await section("an escape before an uppercase character is alt shift and that character", async function ()
    {
        t = new ttio({headless:true,input:false})
        event = t.parseEsc('C')
        compare(event.combo,'alt+shift+c')
        compare(event.char,'C')
    })
    await section("an escape before the end of a graphics message is still no key", async function ()
    {
        t = new ttio({headless:true,input:false})
        compare(t.parseEsc('\\'),undefined)
    })
}
toExport["ttio"]._section_ = true
toExport["keyscript"] = async function ()
{
    await section("a word that names a key", async function ()
    {
        compare(keyscript.bytes('down'),'\x1b[B')
        compare(keyscript.bytes('up'),'\x1b[A')
        compare(keyscript.bytes('left'),'\x1b[D')
        compare(keyscript.bytes('right'),'\x1b[C')
        compare(keyscript.bytes('return'),'\r')
        compare(keyscript.bytes('space'),' ')
        compare(keyscript.bytes('esc'),'\x1b[27u')
    })
    await section("a word that names nothing is the characters it is made of", async function ()
    {
        compare(keyscript.bytes('ab'),'ab')
        compare(keyscript.bytes('a'),'a')
    })
    await section("a word can have modifiers", async function ()
    {
        compare(keyscript.bytes('cmd+o'),'\x1b[111;9u')
        compare(keyscript.bytes('ctrl+s'),'\x1b[115;5u')
        compare(keyscript.bytes('alt+r'),'\x1b[114;3u')
        compare(keyscript.bytes('shift+cmd+s'),'\x1b[115;10u')
        compare(keyscript.bytes('cmd+down'),'\x1b[1;9B')
        compare(keyscript.bytes('cmd+tab'),'\x1b[9;9u')
    })
    await section("a word that is not a modifier is not a combination", async function ()
    {
        compare(keyscript.bytes('cmd+foo'),'cmd+foo')
        compare(keyscript.bytes('o+'),'o+')
    })
    await section("an escape sequence is a sequence already", async function ()
    {
        compare(keyscript.bytes('\x1b[B'),'\x1b[B')
    })
    await section("a script is the words of it", async function ()
    {
        compare(keyscript.script('cmd+o down'),'\x1b[111;9u\x1b[B')
        compare(keyscript.script('a b'),'ab')
        compare(keyscript.script('  '),'')
    })
    await section("the steps of a script are the keys of it, one by one", async function ()
    {
        compare(keyscript.steps('cmd+o down'),[['cmd+o','\x1b[111;9u'],['down','\x1b[B']])
        compare(keyscript.steps('ab'),[['a','a'],['b','b']])
        compare(keyscript.steps(''),[])
    })
}
toExport["keyscript"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC90dGlvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ3FCLGFBQWQ7O09BQ2MsV0FBUjs7T0FDUSxjQUFkO09BQXNCLGdCQUF0Qjs7O0FBTVAsc0JBQWEsUUFBTyxNQUFJOzs7O1FBRVcsVUFBVjs7UUFBckIsVUFBVTs7SUFFVixRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07SUFDakMsU0FBUztJQUNUO0lBRUEsRUFBRSxHQUFHOztlQUFXLFVBQVU7O0lBQzFCLEVBQUUsR0FBRyxnQkFBTyxPQUFNOztlQUFVLEtBQUssTUFBTSxNQUFNLE1BQU07O3dCQUV0Qzs7O1FBQVQ7UUFDQSxFQUFFLE9BQU8sT0FBTyxLQUFLLE1BQU07O1lBRTNCLE9BQVEsT0FBUSxLQUFNOzs7Ozs7UUFNdEIsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO2dCQUNqQyxFQUFFOzs7O1FBSUYsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBRWpDLEVBQUU7UUFDRixFQUFFO2dCQUVGLEVBQUUsVUFBWTs7OztRQUlkLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTTtRQUVqQyxPQUFPLEVBQUUsVUFBVSxPQUFPLEtBQUs7Z0JBRS9CLEtBQUssT0FBUztnQkFDZCxLQUFLLEdBQUcsSUFBTTtnQkFDZCxLQUFLLEdBQUcsSUFBTTs7OztRQUlkLE9BQU8sRUFBRSxVQUFVLE9BQU8sS0FBSztnQkFFL0IsS0FBSyxPQUFTO2dCQUNkLEtBQUssR0FBRyxJQUFNO2dCQUNkLEtBQUssR0FBRyxJQUFNOzs7O1FBSWQsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBQ2pDLEVBQUUsVUFBVSxHQUFHO1FBQ2YsT0FBTyxHQUFHO1FBRVYsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7UUFDdkMsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7aUJBRXRDLEVBQUUsVUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/ttio.kode
