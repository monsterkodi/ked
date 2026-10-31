var toExport = {}
var all, before, copied, e, h, u

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import clip from "../../kxk/clip.js"

import harness from "../util/harness.js"

import editor from "../edit/editor.js"
import specs from "../edit/specs.js"

import uniko from "../view/colmns/uniko.js"

toExport["uniko"] = async function ()
{
    await section("comments are searchable and the match is case insensitive", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('GREEK')
        compare(u.matrix.numItems() > 0,true)
    })
    await section("an empty search shows the whole list again", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        all = u.matrix.numItems()
        u.filter('sqrt')
        u.filter('')
        compare(u.matrix.numItems(),all)
    })
    await section("the matrix starts focused and typing moves the focus to the input", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        compare(u.focus,'matrix')
        compare(u.matrix.selectedIndex,0)
        h.key(u,'s','s')
        compare(u.focus,'input')
        compare(u.input.current(),'s')
    })
    await section("return inserts the selected character at the cursors but keeps the picker open", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('sqrt')
        h.key(u,'return','')
        compare(kseg.str(e.state.s.lines[0]),'a√bc')
        compare(u.hidden(),false)
        compare(u.focus,'matrix')
        compare(e.hasFocus(),false)
    })
    await section("space inserts the selected character and keeps the matrix focused", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('sqrt')
        h.key(u,'space',' ')
        compare(kseg.str(e.state.s.lines[0]),'a√bc')
        compare(u.hidden(),false)
        compare(u.focus,'matrix')
        compare(e.hasFocus(),false)
    })
    await section("a mouse click inserts the clicked character and keeps the matrix focused", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,14)
        u.show()
        u.filter('sqrt')
        u.onMouse({type:'press',cell:[2,3],button:'left',count:1})
        compare(kseg.str(e.state.s.lines[0]),'a√bc')
        compare(u.hidden(),false)
        compare(u.focus,'matrix')
        compare(e.hasFocus(),false)
    })
    await section("copy writes the selected character to the clipboard", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        copied = []
        before = clip.copy
        clip.copy = function (text)
        {
            return copied.push(text)
        }
        u.filter('sqrt')
        h.key(u,'cmd+c','')
        compare(copied,['√'])
        compare(u.hidden(),false)
        clip.copy = before
    })
    await section("escape closes without a change and gives the focus back", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        h.key(u,'esc','')
        compare(kseg.str(e.state.s.lines[0]),'abc')
        compare(u.hidden(),true)
        compare(e.hasFocus(),true)
    })
    await section("scale change", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        compare(u.matrix.scale,2)
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,3)
        h.key(u,'cmd+up','')
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,3)
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,2)
        h.key(u,'cmd+down','')
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,1)
    })
}
toExport["uniko"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdW5pa28ua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ1UsVUFBQTtJQUFZOztPQUNBLFdBQVo7O09BQ1ksY0FBZjs7T0FDZSxhQUFmO09BQXNCLFlBQXRCOztPQUNlLFlBQVY7Ozs7OztRQU1KLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsTUFBTSxFQUFFLE9BQU8sRUFBRTtRQUN6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLEVBQUUsT0FBTztnQkFFVCxFQUFFLE9BQU8sYUFBYSxFQUFJOzs7O1FBSTFCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsTUFBTSxFQUFFLE9BQU8sRUFBRTtRQUN6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLE1BQU0sRUFBRSxPQUFPO1FBRWYsRUFBRSxPQUFPO1FBQ1QsRUFBRSxPQUFPO2dCQUVULEVBQUUsT0FBTyxXQUFhOzs7O1FBSXRCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsTUFBTSxFQUFFLE9BQU8sRUFBRTtRQUN6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtnQkFFRixFQUFFLE1BQVE7Z0JBQ1YsRUFBRSxPQUFPLGNBQWdCO1FBRXpCLEVBQUUsSUFBSSxFQUFFLElBQUk7Z0JBRVosRUFBRSxNQUFRO2dCQUNWLEVBQUUsTUFBTSxVQUFZOzs7O1FBSXBCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsTUFBTSxXQUFXO1FBQ25CLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFFeEIsUUFBUSxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/uniko.kode
