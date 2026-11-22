var toExport = {}
var e, h, hin, ked_sess, node, noPattern, noR, noText, noTextInNode, sn, _143_14_, _152_18_, _178_31_, _179_33_, _49_30_, _58_36_, _73_36_, _98_24_

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
        compare(sn.items.length,3)
        compare(sn.focusRing.length,8)
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
    await section("percent values are stored as strings", async function ()
    {
        ked_sess()
        h = new harness({cols:40,rows:20})
        e = new editor(h.screen,'sheenode_test_percent',[])
        sn = new sheenode(h.screen,e)
        sn.layout(0,0,40,9)
        node = {text:'hi',x:1,y:2,w:3,h:1}
        sn.onNode(node)
        sn.xwrInput.inputs[1].changeValue('50%')
        compare(node.w,'50%')
        noR = !(node.r != null)
        compare(noR,true)
        sn.xwrInput.inputs[0].changeValue('200')
        compare(node.x,200)
    })
    await section("typing into a percent input updates the node", async function ()
    {
        ked_sess()
        h = new harness({cols:40,rows:20})
        e = new editor(h.screen,'sheenode_test_percent_typing',[])
        sn = new sheenode(h.screen,e)
        sn.layout(0,0,40,9)
        node = {text:'hi',x:1,y:2,w:3,h:1}
        sn.onNode(node)
        sn.xwrInput.inputs[1].grabFocus()
        sn.xwrInput.inputs[1].selectAll()
        h.type(sn.xwrInput.inputs[1],'50%')
        compare(sn.xwrInput.inputs[1].current(),'50%')
        compare(node.w,'50%')
    })
    await section("the height field joins lines and scale", async function ()
    {
        ked_sess()
        h = new harness({cols:40,rows:20})
        e = new editor(h.screen,'sheenode_test_scale',[])
        sn = new sheenode(h.screen,e)
        sn.layout(0,0,40,7)
        hin = sn.yhbInput.inputs[1]
        node = {text:'hi',x:1,y:2,w:3,h:4,b:1}
        sn.onNode(node)
        compare(hin.current(),'4')
        hin.changeValue('3x2')
        compare(node.h,6)
        compare(node.scale,2)
        compare((node.b != null),false)
        compare(hin.current(),'3x2')
        hin.changeValue('x3')
        compare(node.h,3)
        compare(node.scale,3)
        hin.changeValue('12')
        compare(node.h,12)
        compare((node.scale != null),false)
        hin.changeValue('2x9')
        compare(hin.current(),'2x7')
        compare(node.h,14)
        sn.onNode({text:'hi',h:7,scale:3})
        compare(hin.current(),'2x3')
    })
    await section("typing keeps partial values", async function ()
    {
        hin.grabFocus()
        hin.selectAll()
        h.type(hin,'3x2')
        compare(hin.current(),'3x2')
        compare(sn.node.h,6)
        compare(sn.node.scale,2)
    })
    await section("parseHeight", async function ()
    {
        compare(layout.parseHeight('12'),{h:12,scale:1})
        compare(layout.parseHeight('3x2'),{h:6,scale:2})
        compare(layout.parseHeight('x3'),{h:3,scale:3})
        compare(layout.parseHeight('3x'),{h:3,scale:1})
        compare(layout.parseHeight('50%x2'),{h:'50%',scale:2})
        compare((layout.parseHeight('x') != null),false)
        compare((layout.parseHeight('abc') != null),false)
    })
    await section("heightText", async function ()
    {
        compare(layout.heightText({h:6,scale:2}),'3x2')
        compare(layout.heightText({h:5}),'5')
        compare(layout.heightText({h:'50%',scale:2}),'50%x2')
        compare(layout.heightText({b:2,scale:2}),'')
    })
}
toExport["sheenode"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2hlZW5vZGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQVUsVUFBQTtJQUFNOztPQUNDLGFBQVY7O09BQ1UsY0FBVjs7T0FDVSxhQUFWOztPQUNjLGVBQVQ7OztBQUVaOzs7O0lBQ0k7SUFDQSxvQkFBVyxLQUFJOzs7O3dCQUFRLE1BQU0seUJBQU87O0lBQ3BDLG9CQUFXLEtBQUk7O2VBQVUsTUFBTSxPQUFPOztXQUN0QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7Ozs7OztRQU1qQztRQUVBLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFNBQVMsU0FBUyxFQUFFLE9BQU87UUFDM0IsR0FBRyxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWpCLFFBQVMsS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHO1FBRXhELEdBQUcsT0FBTztnQkFFVixHQUFHLE1BQU0sT0FBUztnQkFDbEIsR0FBRyxVQUFVLE9BQVM7Z0JBQ3RCLEdBQUcsUUFBUSxPQUFPLEdBQUcsVUFBWTtnQkFDakMsR0FBRyxRQUFRLE9BQU8sR0FBRyxVQUFZOzs7O1FBSWpDO1FBRUEsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsU0FBUyxTQUFTLEVBQUUsT0FBTztRQUMzQixHQUFHLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFakIsUUFBUyxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUVqQyxHQUFHLE9BQU87UUFFVixHQUFHLGFBQWEsU0FBUztnQkFFekIsS0FBSyxRQUFVO1FBQ2YsV0FBYSxLQUFLO2dCQUNsQixPQUFTO1FBRVQsR0FBRyxZQUFZLFNBQVM7Z0JB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/sheenode.kode
