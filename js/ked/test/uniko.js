var toExport = {}
var all, before, cols, copied, e, h, m, s, u, x

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import clip from "../../kxk/clip.js"

import harness from "../util/harness.js"

import editor from "../edit/editor.js"
import specs from "../edit/specs.js"

import matrix from "../view/base/matrix.js"

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
toExport["matrix"] = async function ()
{
    await section("selection moves through the items in reading order", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedText(),'a')
        compare(m.moveSelection('right'),true)
        compare(m.selectedText(),'b')
        cols = m.columns()
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedIndex,0)
        compare(m.moveSelection('down'),true)
        compare(m.selectedIndex,cols)
    })
    await section("left at the first item stays put", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c'])
        compare(m.moveSelection('left'),false)
        compare(m.selectedIndex,0)
    })
    await section("up in the first row stays put", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c'])
        compare(m.moveSelection('up'),false)
        compare(m.selectedIndex,0)
    })
    await section("the matrix knows whether it has the focus", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        compare(!m.hasFocus(),true)
        h.focus(m)
        compare(m.hasFocus(),true)
        post.emit('focus','somewhere_else')
        compare(!m.hasFocus(),true)
    })
    await section("a larger scale uses more cell rows per logical row", async function ()
    {
        h = new harness({cols:20,rows:20})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,20,20)
        compare(m.scale,2)
        compare(m.viewportRows(),10)
        m.incScale(1)
        compare(m.scale,3)
        compare(m.viewportRows(),6)
        compare(m.cellAtPos(3,4),[0,1])
        m.incScale(1)
        compare(m.scale,3)
        compare(m.viewportRows(),6)
        compare(m.cellAtPos(3,3),[0,1])
        m.incScale(-1)
        m.incScale(-1)
        compare(m.scale,1)
        compare(m.viewportRows(),20)
    })
    await section("scaled cells and the selection line up at every scale", async function ()
    {
        var list = [2,3]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            s = list[_a_]
            h = new harness({cols:24,rows:20})
            m = new matrix(h.screen,'test_matrix')
            m.layout(0,0,24,20)
            while (m.scale < s)
            {
                m.incScale(1)
            }
            m.setItems(['a'])
            m.draw()
            x = s
            compare(h.screen.get_char(x - s,0),'')
            compare(h.screen.get_char(x,0),'a')
            compare(h.screen.get_char(x + s,0),'')
        }
    })
}
toExport["matrix"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdW5pa28ua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ1UsVUFBQTtJQUFZO0lBQUs7O09BQ0wsV0FBWjs7T0FDWSxjQUFmOztPQUNlLGFBQWY7T0FBc0IsWUFBdEI7O09BQ2UsYUFBVjs7T0FDVSxZQUFWOzs7Ozs7UUFNSixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPLEVBQUU7UUFDekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixFQUFFLE9BQU87Z0JBRVQsRUFBRSxPQUFPLGFBQWEsRUFBSTs7OztRQUkxQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPLEVBQUU7UUFDekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7UUFFRixNQUFNLEVBQUUsT0FBTztRQUVmLEVBQUUsT0FBTztRQUNULEVBQUUsT0FBTztnQkFFVCxFQUFFLE9BQU8sV0FBYTs7OztRQUl0QixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPLEVBQUU7UUFDekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7Z0JBRUYsRUFBRSxNQUFRO2dCQUNWLEVBQUUsT0FBTyxjQUFnQjtRQUV6QixFQUFFLElBQUksRUFBRSxJQUFJO2dCQUVaLEVBQUUsTUFBUTtnQkFDVixFQUFFLE1BQU0sVUFBWTs7OztRQUlwQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/uniko.kode
