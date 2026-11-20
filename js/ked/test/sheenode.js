var toExport = {}
var e, h, ked_sess, node, noPattern, noText, noTextInNode, sn, _50_30_, _59_36_, _74_36_

import kxk from "../../kxk.js"
let post = kxk.post

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import layout from "../popo/layout.js"

import sheenode from "../view/colmns/sheenode.js"


ked_sess = function ()
{
    var fakeGet, fakeSet, store

    store = {}
    fakeGet = function (key, def)
    {
        var _9_38_

        return ((_9_38_=store[key]) != null ? _9_38_ : def)
    }
    fakeSet = function (key, value)
    {
        return store[key] = value
    }
    return global.ked_session = {get:fakeGet,set:fakeSet}
}
toExport["sheenode"] = async function ()
{
    await section("inputs", async function ()
    {
        ked_sess()
        h = new harness({cols:40,rows:20})
        e = new editor(h.screen,'sheenode_test_editor',[])
        sn = new sheenode(h.screen,e)
        sn.layout(0,0,40,9)
        node = {text:'hi',x:1,y:2,w:3,h:1,r:4,b:5,fg:'#fff',bg:'#000'}
        sn.onNode(node)
        compare(sn.items.length,4)
        compare(sn.focusRing.length,9)
        compare(sn.items[3],sn.scaleInput)
        compare(sn.typeArg.inputs[0].current(),'text')
        compare(sn.typeArg.inputs[1].current(),'hi')
    })
    await section("changing type and arg", async function ()
    {
        ked_sess()
        h = new harness({cols:40,rows:20})
        e = new editor(h.screen,'sheenode_test_typearg',[])
        sn = new sheenode(h.screen,e)
        sn.layout(0,0,40,9)
        node = {text:'hi',x:1,y:2,w:3,h:1}
        sn.onNode(node)
        sn.onTypeAction('change','pattern')
        compare(node.pattern,'hi')
        noText = !(node.text != null)
        compare(noText,true)
        sn.onArgAction('change','dots')
        compare(node.pattern,'dots')
        sn.onTypeAction('change','')
        noPattern = !(node.pattern != null)
        compare(noPattern,true)
        sn.onTypeAction('change','nonsense')
        compare(layout.typeOf(node),null)
        node = {text:'hi',x:1,y:2,w:3,h:1}
        sn.onNode(node)
        sn.typeArg.inputs[0].grabFocus()
        sn.typeArg.inputs[0].selectAll()
        h.type(sn.typeArg.inputs[0],'pattern')
        compare(node.pattern,'hi')
        noTextInNode = !(node.text != null)
        compare(noTextInNode,true)
        sn.typeArg.inputs[1].grabFocus()
        sn.typeArg.inputs[1].selectAll()
        h.type(sn.typeArg.inputs[1],'dots')
        compare(node.pattern,'dots')
    })
    await section("the scale row", async function ()
    {
        ked_sess()
        h = new harness({cols:40,rows:20})
        e = new editor(h.screen,'sheenode_test_scale',[])
        sn = new sheenode(h.screen,e)
        sn.layout(0,0,40,9)
        node = {text:'hi',x:1,y:2,w:3,h:1}
        sn.onNode(node)
        sn.scaleInput.inputs[0].changeValue(3)
        compare(node.scale,3)
    })
}
toExport["sheenode"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2hlZW5vZGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQVUsVUFBQTtJQUFNOztPQUNDLGFBQVY7O09BQ1UsY0FBVjs7T0FDVSxhQUFWOztPQUNjLGVBQVQ7OztBQUVaOzs7O0lBQ0k7SUFDQSxvQkFBVyxLQUFJOzs7O3dCQUFRLE1BQU0seUJBQU87O0lBQ3BDLG9CQUFXLEtBQUk7O2VBQVUsTUFBTSxPQUFPOztXQUN0QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7Ozs7OztRQU1qQztRQUVBLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFNBQVMsU0FBUyxFQUFFLE9BQU87UUFDM0IsR0FBRyxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWpCLFFBQVMsS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHO1FBRXhELEdBQUcsT0FBTztnQkFFVixHQUFHLE1BQU0sT0FBUztnQkFDbEIsR0FBRyxVQUFVLE9BQVM7Z0JBQ3RCLEdBQUcsTUFBTSxHQUFLLEdBQUc7Z0JBQ2pCLEdBQUcsUUFBUSxPQUFPLEdBQUcsVUFBWTtnQkFDakMsR0FBRyxRQUFRLE9BQU8sR0FBRyxVQUFZOzs7O1FBSWpDO1FBRUEsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsU0FBUyxTQUFTLEVBQUUsT0FBTztRQUMzQixHQUFHLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFakIsUUFBUyxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUVqQyxHQUFHLE9BQU87UUFFVixHQUFHLGFBQWEsU0FBUztnQkFFekIsS0FBSyxRQUFVO1FBQ2YsV0FBYSxLQUFLO2dCQUNsQixPQUFTO1FBRVQsR0FBRyxZQUFZLFNBQVM7Z0JBRXhCLEtBQUssUUFBVTtRQUVmLEdBQUcsYUFBYSxTQUFTO1FBRXpCLGNBQWdCLEtBQUs7Z0JBQ3JCLFVBQVk7UUFFWixHQUFHLGFBQWEsU0FBUztnQkFFekIsT0FBTyxPQUFPLE1BQVE7UUFFdEIsUUFBUyxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNqQyxHQUFHLE9BQU87UUFFVixHQUFHLFFBQVEsT0FBTyxHQUFHO1FBQ3JCLEdBQUcsUUFBUSxPQUFPLEdBQUc7UUFDckIsRUFBRSxLQUFLLEdBQUcsUUFBUSxPQUFPLEdBQUc7Z0JBRTVCLEtBQUssUUFBVTtRQUNmLGlCQUFtQixLQUFLO2dCQUN4QixhQUFlO1FBRWYsR0FBRyxRQUFRLE9BQU8sR0FBRztRQUNyQixHQUFHLFFBQVEsT0FBTyxHQUFHO1FBQ3JCLEVBQUUsS0FBSyxHQUFHLFFBQVEsT0FBTyxHQUFHO2dCQUU1QixLQUFLLFFBQVU7Ozs7UUFJZjtRQUVBLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFNBQVMsU0FBUyxFQUFFLE9BQU87UUFDM0IsR0FBRyxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWpCLFFBQVMsS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFFakMsR0FBRyxPQUFPO1FBRVYsR0FBRyxXQUFXLE9BQU8sR0FBRyxZQUFZO2dCQUVwQyxLQUFLLE1BQVEifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/sheenode.kode
