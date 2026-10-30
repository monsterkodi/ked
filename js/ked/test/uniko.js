var toExport = {}
var all, before, copied, e, h, i, triggers, u

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import clip from "../../kxk/clip.js"

import harness from "../util/harness.js"

import editor from "../edit/editor.js"
import specs from "../edit/specs.js"

import uniko from "../view/colmns/uniko.js"

toExport["uniko"] = async function ()
{
    await section("the default list starts with the characters of the trigger list", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        triggers = specs.trigger['~']
        compare(u.matrix.numItems() > triggers.length,true)
        for (var _a_ = i = 0, _b_ = triggers.length; (_a_ <= _b_ ? i < triggers.length : i > triggers.length); (_a_ <= _b_ ? ++i : --i))
        {
            compare(u.matrix.items[i].char.trim(),triggers[i].trim())
        }
    })
    await section("the default list has no double width characters", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        compare(u.allItems.every(function (item)
        {
            return kseg.segWidth(item.char) < 2
        }),true)
    })
    await section("a key filters the characters", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('sqrt')
        compare(u.matrix.numItems() > 0,true)
        compare(u.matrix.selectedText(),'√')
    })
    await section("an alias finds the same character", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('surd')
        compare(u.matrix.selectedText(),'√')
    })
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
    await section("space inserts while the input is focused too", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,14)
        u.show()
        h.type(u,'sqrt')
        compare(u.focus,'input')
        h.key(u,'space',' ')
        compare(kseg.str(e.state.s.lines[0]),'a√bc')
        compare(u.hidden(),false)
        compare(u.focus,'input')
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
        compare(u.height,16)
        compare(u.matrix.scale,1)
        h.key(u,'cmd+up','')
        compare(u.height,16)
        compare(u.matrix.scale,2)
        h.key(u,'cmd+up','')
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,4)
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,4)
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,3)
        h.key(u,'cmd+down','')
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,1)
    })
}
toExport["uniko"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdW5pa28ua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BTVUsVUFBQTtJQUFZOztPQUNBLFdBQVo7O09BQ1ksY0FBZjs7T0FDZSxhQUFmO09BQXNCLFlBQXRCOztPQUNlLFlBQVY7Ozs7OztRQU1KLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsTUFBTSxFQUFFLE9BQU8sRUFBRTtRQUN6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLFdBQVcsTUFBTSxRQUFRO2dCQUV6QixFQUFFLE9BQU8sYUFBYSxTQUFTLE9BQVM7dUJBRXBDLElBQUssU0FBSSxTQUFTLDBCQUFULFNBQVMsYUFBVCxTQUFTOztvQkFDbEIsRUFBRSxPQUFPLE1BQU0sR0FBRyxLQUFLLE9BQVMsU0FBUyxHQUFHOzs7OztRQUloRCxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPLEVBQUU7UUFDekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUU7Z0JBRUYsRUFBRSxTQUFTLGdCQUFPOzttQkFBUyxLQUFLLFNBQVMsS0FBSyxRQUFRO1dBQUs7Ozs7UUFJM0QsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsUUFBUSxNQUFNLEVBQUUsT0FBTyxFQUFFO1FBQ3pCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFO1FBRUYsRUFBRSxPQUFPO2dCQUVULEVBQUUsT0FBTyxhQUFhLEVBQUk7Z0JBQzFCLEVBQUUsT0FBTyxlQUFpQjs7OztRQUkxQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/uniko.kode
