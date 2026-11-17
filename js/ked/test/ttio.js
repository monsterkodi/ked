var toExport = {}
var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var clicks, e, event, frame, h, img, keys, live, maxLive, pasted, seqs, t

import editor from "../edit/editor.js"

import ttio from "../view/screen/ttio.js"

import harness from "../util/harness.js"
import keyscript from "../util/keyscript.js"

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
    await section("a bracketed paste in one chunk is pasted", async function ()
    {
        t = new ttio({headless:true,input:false})
        pasted = []
        keys = []
        t.on('paste',function (text)
        {
            return pasted.push(text)
        })
        t.on('key',function (combo)
        {
            return keys.push(combo)
        })
        t.onData(Buffer.from('\x1b[200~■\x1b[201~','utf8'))
        compare(pasted,['■'])
        compare(keys,[])
    })
    await section("a bracketed paste with unicode and text is pasted as text", async function ()
    {
        t = new ttio({headless:true,input:false})
        pasted = []
        keys = []
        t.on('paste',function (text)
        {
            return pasted.push(text)
        })
        t.on('key',function (combo)
        {
            return keys.push(combo)
        })
        t.onData(Buffer.from('\x1b[200~a■b\x1b[201~','utf8'))
        compare(pasted,['a■b'])
        compare(keys,[])
    })
    await section("a bracketed paste arriving in parts is pasted when it ends", async function ()
    {
        t = new ttio({headless:true,input:false})
        pasted = []
        t.on('paste',function (text)
        {
            return pasted.push(text)
        })
        t.onData(Buffer.from('\x1b[200~a','utf8'))
        t.onData(Buffer.from('■b\x1b[20','utf8'))
        compare(pasted,[])
        t.onData(Buffer.from('1~','utf8'))
        compare(pasted,['a■b'])
    })
    await section("input after a bracketed paste is still handled", async function ()
    {
        t = new ttio({headless:true,input:false})
        pasted = []
        keys = []
        t.on('paste',function (text)
        {
            return pasted.push(text)
        })
        t.on('key',function (combo)
        {
            return keys.push(combo)
        })
        t.onData(Buffer.from('\x1b[200~■\x1b[201~\x1b[B','utf8'))
        compare(pasted,['■'])
        compare(keys,['down'])
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC90dGlvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ3FCLGFBQWQ7O09BQ2MsV0FBUjs7T0FDUSxjQUFkO09BQXNCLGdCQUF0Qjs7Ozs7O1FBTUMsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO2dCQUNqQyxFQUFFOzs7O1FBSUYsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBRWpDLEVBQUU7UUFDRixFQUFFO2dCQUVGLEVBQUUsVUFBWTs7OztRQUlkLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTTtRQUVqQyxPQUFPLEVBQUUsVUFBVSxPQUFPLEtBQUs7Z0JBRS9CLEtBQUssT0FBUztnQkFDZCxLQUFLLEdBQUcsSUFBTTtnQkFDZCxLQUFLLEdBQUcsSUFBTTs7OztRQUlkLE9BQU8sRUFBRSxVQUFVLE9BQU8sS0FBSztnQkFFL0IsS0FBSyxPQUFTO2dCQUNkLEtBQUssR0FBRyxJQUFNO2dCQUNkLEtBQUssR0FBRyxJQUFNOzs7O1FBSWQsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBQ2pDLEVBQUUsVUFBVSxHQUFHO1FBQ2YsT0FBTyxHQUFHO1FBRVYsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7UUFDdkMsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7aUJBRXRDLEVBQUUsVUFBVSxNQUFNLE9BQU8sU0FBUyxHQUFLOzs7O1FBSXhDLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTTtRQUNqQyxFQUFFLFVBQVUsR0FBRztRQUNmLE9BQU8sR0FBRztRQUVWLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUssS0FBSyxLQUFLO1FBQ3ZDLEVBQUUsUUFBUSxJQUFJLEdBQUcsSUFBSTtRQUNyQixFQUFFLFFBQVEsSUFBSSxHQUFHLElBQUk7aUJBRXBCLEVBQUUsVUFBVSxNQUFNLE9BQU8sU0FBUyxHQUFLO2dC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/ttio.kode
