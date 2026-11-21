var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var ch, clicks, e, frame, h, img, keys, live, maxLive, pasteKeys, seqs, t, written

import editor from "../edit/editor.js"

import ttio from "../view/screen/ttio.js"

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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC90dGlvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ3FCLGFBQWQ7O09BQ2MsV0FBUjs7T0FDUSxjQUFkO09BQXNCLGdCQUF0Qjs7O0FBRVAsc0JBQWE7Ozs7SUFFVCxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07SUFDakMsU0FBUztJQUNUO0lBRUEsRUFBRSxHQUFHOztlQUFXLFVBQVU7O0lBQzFCLEVBQUUsR0FBRyxnQkFBTyxPQUFNOztlQUFVLEtBQUssTUFBTSxNQUFNLE1BQU07O3dCQUV0Qzs7O1FBQVQ7UUFDQSxFQUFFLE9BQU8sT0FBTyxLQUFLLE1BQU07O1lBRTNCLE9BQVEsT0FBUSxLQUFNOzs7Ozs7UUFNdEIsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO2dCQUNqQyxFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7Z0JBQ0YsRUFBRSxVQUFZO1FBRWQsT0FBTyxFQUFFLFVBQVUsT0FBTyxLQUFLO2dCQUMvQixLQUFLLE9BQVM7Z0JBQ2QsS0FBSyxHQUFHLElBQU07Z0JBQ2QsS0FBSyxHQUFHLElBQU07UUFFZCxPQUFPLEVBQUUsVUFBVSxPQUFPLEtBQUs7Z0JBQy9CLEtBQUssT0FBUztnQkFDZCxLQUFLLEdBQUcsSUFBTTtnQkFDZCxLQUFLLEdBQUcsSUFBTTs7OztRQUlkLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTTtRQUNqQyxFQUFFLFVBQVUsR0FBRztRQUVmLE9BQU8sR0FBRztRQUVWLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUssS0FBSyxLQUFLO1FBQ3ZDLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUssS0FBSyxLQUFLO2lCQUV0QyxFQUFFLFVBQVUsTUFBTSxPQUFPLFNBQVMsR0FBSztRQUV4QyxPQUFPLEdBQUc7UUFFVixFQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUUsS0FBSyxLQUFLLEtBQUssS0FBSztRQUN2QyxFQUFFLFFBQVEsSUFBSSxHQUFHLElBQUk7UUFDckIsRUFBRSxRQUFRLElBQUksR0FBRyxJQUFJO2lCQUVwQixFQUFFLFVBQVUsTUFBTSxPQUFPLFNBQVMsR0FBSztnQkFDeEMsRUFBRSxVQUFVLFNBQVMsNkNBQStDO1FBRXBFLE9BQU8sR0FBRztRQUVWLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUssS0FBSyxLQUFLO1FBQ3ZDLEVBQUUsUUFBUSxJQUFJLEdBQUcsSUFBSTtRQUVyQixFQUFFO1FBQ0YsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7aUJBRXRDLEVBQUUsVUFBVSxNQUFNLE9BQU8sU0FBUyxHQUFLO1FBRXhDLE9BQU8sR0FBRztRQUVWLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUssS0FBSyxLQUFLO1FBQ3ZDLEVBQUUsUUFBUSxJQUFJLEdBQUcsSUFBSTtRQUNyQixFQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUUsS0FBSyxLQUFLLEtBQUssS0FBSztpQkFFdEMsRUFBRSxVQUFVLE1BQU0sT0FBTyxTQUFTLEdBQUs7UUFFeEMsT0FBTyxHQUFHO1FBRVYsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7UUFDdkMsRUFBRSxRQUFRLElBQUksR0FBRyxJQUFJO1FBRXJCLEVBQUU7UUFDRixFQUFFO1FBRUYsRUFBRTtRQUNGLEVBQUUsUUFBUSxJQUFJLEdBQUcsSUFBSTtnQkFFckIsRUFBRSxVQUFVLFNBQVMsT0FBUzs7OztRQUk5QixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsRUFBRSxFQUFFLFVBQVUsR0FBRztRQUVqQixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sYUFBYSxFQUFFO1FBRXZCLE9BQU8sR0FBRztRQUNWLEVBQUUsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFLEtBQUssS0FBSyxLQUFLLEtBQUs7UUFDekMsRUFBRSxFQUFFLFFBQVEsSUFBSSxHQUFHLElBQUk7UUFFdkIsRUFBRTtRQUNGLEVBQUUsVUFBVSxNQUFNLElBQUksR0FBRyxJQUFJO1FBRTdCLEVBQUUsRUFBRTtRQUNKLEVBQUU7aUJBRUQsRUFBRSxFQUFFLFVBQVUsTUFBTSxPQUFPLFNBQVMsR0FBSztRQUUxQyxPQUFPLEdBQUc7UUFDVixFQUFFLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUssS0FBSyxLQUFLO1FBQ3pDLEVBQUUsRUFBRSxRQUFRLElBQUksR0FBRyxJQUFJO1FBRXZCLEVBQUU7UUFDRixFQUFFLFVBQVUsTUFBTSxJQUFJLEdBQUcsSUFBSTtRQUU3QixFQUFFLEVBQUU7UUFDSixFQUFFLDBCQUEwQixFQUFFLEVBQUUsR0FBRztnQkFFbkMsRUFBRSxFQUFFLFVBQVUsU0FBUyxPQUFTO1FBRWhDLEVBQUUsRUFBRTtRQUNKLEVBQUUsRUFBRSxXQUFXO1FBRWYsT0FBTztRQUNQLFVBQVU7UUFFVixFQUFFLEVBQUUsa0JBQVM7Ozs7WUFDVCxFQUFFLEVBQUUsSUFBSSxLQUFLO1lBQ2IsT0FBTztpQkFDSCxRQUFhLEVBQUUsRUFBRTs7Z0JBQVosT0FBUSxFQUFFLEVBQUU7b0JBQ0osS0FBSyxPQUFNOztvQkFBeEIsUUFBUTs7O21CQUNaLGtCQUFjLFFBQVE7O1FBRTFCLEVBQUUsTUFBTSxXQUFXO1FBQ25CLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFFdkI7Ozs7WUFDSSxTQUFTLEVBQUUsT0FBTztZQUNsQixFQUFFO1lBQ0YsRUFBRSxPQUFPO1lBQ1QsRUFBRSxFQUFFO21CQUNKLEVBQUUsd0JBQXdCOztRQUU5QjtnQkFFQSxRQUFVO1FBRVYsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUV2QjtnQkFFQSxRQUFVOzs7O1FBSVYsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBQ2pDLEVBQUUsVUFBVSxHQUFHO1FBRWYsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHO1FBQy9CLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRztpQkFFakMsRUFBRSxjQUFhLEVBQUUsbUJBQXFCO1FBRXZDLFVBQVUsRUFBRTtnQkFFWixRQUFRLGtCQUFrQixFQUFFLGlCQUFtQjtnQkFDL0MsUUFBUSxrQkFBa0IsRUFBRSx5QkFBMkI7Ozs7UUFJdkQsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBQ2pDO1FBRUEsRUFBRSxHQUFHLGdCQUFPLE9BQU07O21CQUFVLEtBQUssTUFBTSxNQUFNLE1BQU07O29CQUV4QyxJQUFJLElBQUksSUFBSTs7O1lBQW5CO1lBQ0EsRUFBRSxPQUFPLE9BQU8sS0FBSzs7Z0JBRXpCLE9BQVMsSUFBSSxNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sSUFBSTtRQUUzQztRQUNBLEVBQUUsT0FBTyxPQUFPLEtBQUs7Z0JBRXJCLE9BQVMsT0FBTyxLQUFLLE9BQU8sS0FBSyxTQUFTO1FBRTFDO3FCQUNXLElBQUk7OztZQUFYO1lBQ0EsRUFBRSxPQUFPLE9BQU8sS0FBSzs7Z0JBRXpCLE9BQVMsVUFBVSxNQUFNLElBQUk7UUFFN0I7UUFDQSxFQUFFLE9BQU8sT0FBTyxLQUFLO1FBQ3JCLEVBQUUsT0FBTyxPQUFPLEtBQUs7Z0JBRXJCLE9BQVMsSUFBSSxNQUFNLElBQUk7Ozs7UUFJdkIsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNO1FBQ2pDLEVBQUUsVUFBVSxHQUFHO1FBQ2Y7UUFFQSxFQUFFLEdBQUcsa0JBQVM7O21CQUFVLE9BQU8sS0FBSzs7UUFFcEMsRUFBRSxPQUFPLE9BQU8sS0FBSztnQkFFckIsT0FBTyxPQUFhO2dCQUNwQixPQUFPLEdBQUcsS0FBVTtnQkFDcEIsT0FBTyxHQUFHLE9BQVU7Z0JBQ3BCLE9BQU8sR0FBRyxNQUFXLEdBQUc7Ozs7Z0JBSXhCLFdBQVcseUJBQTRDLE9BQU8sRUFBRTtnQkFDaEUsV0FBVywyQkFBNEMsT0FBTyxFQUFFO2dCQUNoRSxXQUFXLGFBQWEsWUFBWSxRQUFtQixPQUFPLEVBQUU7Z0JBQ2hFLFdBQVcsK0JBQTRDLE9BQU8sRUFBRSxPQUFPLE9BQU87Z0JBQzlFLFdBQVcsNENBQTRDLE9BQU8sRUFBRTtnQkFDaEUsV0FBVyxnQ0FBNEMsT0FBTyxFQUFFO2dCQUNoRSxXQUFXLFVBQTRDLE9BQU8sRUFBRSxPQUFPLElBQUksTUFBTSxJQUFJLE1BQU0sU0FBUzs7OztRQUlwRyxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07Z0JBRWpDLEVBQUUsU0FBUyxNQUFRLElBQUksSUFBSSxLQUFLLFFBQVEsTUFBTSxRQUFRLEtBQUs7Z0JBQzNELEVBQUUsU0FBUyxNQUFRLElBQUksSUFBSSxLQUFLLFFBQVEsTUFBTSxRQUFRLEtBQUs7Z0JBQzNELEVBQUUsU0FBUyxNQUFRLElBQUksSUFBSSxLQUFLLFFBQVEsTUFBTSxjQUFjLEtBQUs7Z0JBQ2pFLEVBQUUsU0FBUyxNQUFROzs7Ozs7WUFJbkIsVUFBVSxNQUFNLFFBQWtCO1lBQ2xDLFVBQVUsTUFBTSxNQUFrQjtZQUNsQyxVQUFVLE1BQU0sUUFBa0I7WUFDbEMsVUFBVSxNQUFNLFNBQWtCO1lBQ2xDLFVBQVUsTUFBTSxVQUFrQjtZQUNsQyxVQUFVLE1BQU0sU0FBa0I7WUFDbEMsVUFBVSxNQUFNLE9BQWtCO1lBQ2xDLFVBQVUsTUFBTSxNQUFrQjtZQUNsQyxVQUFVLE1BQU0sS0FBa0I7WUFDbEMsVUFBVSxNQUFNLFNBQWtCO1lBQ2xDLFVBQVUsTUFBTSxVQUFrQjtZQUNsQyxVQUFVLE1BQU0sU0FBa0I7WUFDbEMsVUFBVSxNQUFNLGVBQWtCO1lBQ2xDLFVBQVUsTUFBTSxZQUFrQjtZQUNsQyxVQUFVLE1BQU0sV0FBa0I7WUFDbEMsVUFBVSxNQUFNLFdBQWtCO1lBQ2xDLFVBQVUsTUFBTSxNQUFrQjtZQUNsQyxVQUFVLE1BQU0sVUFBa0I7WUFDbEMsVUFBVSxPQUFPLGNBQWlCO1lBQ2xDLFVBQVUsT0FBTyxPQUFpQjtZQUNsQyxVQUFVLE9BQU8sTUFBaUI7WUFDbEMsVUFBVSxNQUFNLGdCQUFvQixRQUFRLGdCQUFnQixPQUFPO1lBQ25FLFVBQVUsTUFBTSxRQUFvQixJQUFJLE1BQU0sSUFBSTtZQUNsRCxVQUFVLE1BQU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/ttio.kode
