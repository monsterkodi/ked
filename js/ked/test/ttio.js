var toExport = {}
var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var clicks, e, event, frame, h, img, keys, live, maxLive, pasted, seqs, t

import editor from "../edit/editor.js"

import ttio from "../view/screen/ttio.js"

import harness from "../util/harness.js"

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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC90dGlvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ3FCLGFBQWQ7O09BQ2MsV0FBUjs7T0FDUSxjQUFkOzs7Ozs7UUFNQyxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07Z0JBQ2pDLEVBQUU7Ozs7UUFJRixRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07UUFFakMsRUFBRTtRQUNGLEVBQUU7Z0JBRUYsRUFBRSxVQUFZOzs7O1FBSWQsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBRWpDLE9BQU8sRUFBRSxVQUFVLE9BQU8sS0FBSztnQkFFL0IsS0FBSyxPQUFTO2dCQUNkLEtBQUssR0FBRyxJQUFNO2dCQUNkLEtBQUssR0FBRyxJQUFNOzs7O1FBSWQsT0FBTyxFQUFFLFVBQVUsT0FBTyxLQUFLO2dCQUUvQixLQUFLLE9BQVM7Z0JBQ2QsS0FBSyxHQUFHLElBQU07Z0JBQ2QsS0FBSyxHQUFHLElBQU07Ozs7UUFJZCxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07UUFDakMsRUFBRSxVQUFVLEdBQUc7UUFDZixPQUFPLEdBQUc7UUFFVixFQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUUsS0FBSyxLQUFLLEtBQUssS0FBSztRQUN2QyxFQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUUsS0FBSyxLQUFLLEtBQUssS0FBSztpQkFFdEMsRUFBRSxVQUFVLE1BQU0sT0FBTyxTQUFTLEdBQUs7Ozs7UUFJeEMsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBQ2pDLEVBQUUsVUFBVSxHQUFHO1FBQ2YsT0FBTyxHQUFHO1FBRVYsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7UUFDdkMsRUFBRSxRQUFRLElBQUksR0FBRyxJQUFJO1FBQ3JCLEVBQUUsUUFBUSxJQUFJLEdBQUcsSUFBSTtpQkFFcEIsRUFBRSxVQUFVLE1BQU0sT0FBTyxTQUFTLEdBQUs7Z0JBQ3hDLEVBQUUsVUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/ttio.kode
