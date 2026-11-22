var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var absol, absrect, areas, before, cells, click, container, data, desue, dmp, e, h, loadSheet, regions, res, rgns, rt, runs, sheet, showSue, text, tree, _247_27_, _637_43_, _694_22_, _743_30_, _808_27_

import sds from "../../kxk/sds.js"
import noon from "../../kxk/noon.js"

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import sue from "../edit/tool/sue.js"

import layout from "../popo/layout.js"
import fill from "../popo/fill.js"

import editor from "../edit/editor.js"

import fileeditor from "../view/editor/fileeditor.js"

import harness from "../util/harness.js"


absol = function (cells, tree)
{
    return layout.absolutize(cells,tree)
}

absrect = function (cells, tree)
{
    return absol(cells,tree).rect
}

rgns = function (cells, tree, path)
{
    return sds.get(layout.regionize(cells,tree),path)
}

dmp = function (cells, tree)
{
    return layout.dumpRegions(layout.regionize(cells,tree))
}

desue = function (cells, tree)
{
    return sue.desue(layout.sueify(cells,tree))
}

areas = function (data, type)
{
    return data.sue.filter(function (area)
    {
        return area.value[0] === type
    })
}
h = e = null

sheet = function (name, features = [])
{
    h = new harness({cols:16,rows:4})
    e = new editor(h.screen,name,features)
    e.layout(0,0,16,4)
    return e.state.loadLines(['                ','                ','                ','                '])
}

rt = function (path)
{
    return sds.get(e.state.rectree,path)
}

loadSheet = function (tree, cursor)
{
    e.state.setSheetTree(tree,16,4)
    e.state.renderSheet(tree,{cols:16,rows:4},cursor,{history:false,silent:true})
    return e.state.clearHistory()
}

showSue = function (data)
{
    e.state.loadLines(data.text.split('\n'))
    e.state.loadSue(data.sue)
    return e.draw()
}
toExport["popo"] = async function ()
{
    await section("layout", async function ()
    {
        await section("absolutize", async function ()
        {
            await section("percentages", async function ()
            {
                compare(absrect({cols:100,rows:50},{x:'20%',y:'10%',r:'20%',b:'10%'}),{abs:{x:20,y:5,w:60,h:40},rel:{x:20,y:5,w:60,h:40}})
                compare(absrect({cols:10,rows:5},{x:'20%',y:'20%',r:'20%',b:'20%'}),{abs:{x:2,y:1,w:6,h:3},rel:{x:2,y:1,w:6,h:3}})
                compare(absrect({cols:10,rows:5},{x:'20%',y:'20%',w:'60%',h:'60%'}),{abs:{x:2,y:1,w:6,h:3},rel:{x:2,y:1,w:6,h:3}})
                tree = {x:10,y:10,w:'100%',h:'100%',children:[{x:'50%',y:'50%',w:'50%',h:'25%'}]}
                compare(absrect({cols:100,rows:100},tree),{abs:{x:10,y:10,w:90,h:90},rel:{x:10,y:10,w:90,h:90}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:55,y:55,w:45,h:22},rel:{x:45,y:45,w:45,h:22}})
            })
            await section("cells", async function ()
            {
                compare(absrect({cols:100,rows:50},{x:3,y:4,w:20,h:10}),{abs:{x:3,y:4,w:20,h:10},rel:{x:3,y:4,w:20,h:10}})
                compare(absrect({cols:100,rows:50},{x:3,y:4,r:7,b:6}),{abs:{x:3,y:4,w:90,h:40},rel:{x:3,y:4,w:90,h:40}})
                compare(absrect({cols:100,rows:50},{x:'3',y:'4',w:'20',h:'10'}),{abs:{x:3,y:4,w:20,h:10},rel:{x:3,y:4,w:20,h:10}})
                compare(absrect({cols:100,rows:50},{x:3,y:'10%',w:20,h:'20%'}),{abs:{x:3,y:5,w:20,h:10},rel:{x:3,y:5,w:20,h:10}})
            })
            await section("nesting", async function ()
            {
                tree = absol({cols:20,rows:20},{x:1,y:1,w:10,h:10,children:[{x:1,y:1,w:'50%',h:'50%'},{x:0,y:'60%',w:4,h:2}]})
                compare(tree.rect,{abs:{x:1,y:1,w:10,h:10},rel:{x:1,y:1,w:10,h:10}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:2,y:2,w:5,h:5},rel:{x:1,y:1,w:5,h:5}})
                compare(sds.get(tree,'children.1.rect'),{abs:{x:1,y:7,w:4,h:2},rel:{x:0,y:6,w:4,h:2}})
                tree = absol({cols:100,rows:100},{x:0,y:0,w:'50%',h:'50%',children:[{x:'50%',y:'50%',w:'50%',h:'50%',children:[{x:0,y:0,w:'50%',h:'50%'}]}]})
                compare(tree.rect,{abs:{x:0,y:0,w:50,h:50},rel:{x:0,y:0,w:50,h:50}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:25,y:25,w:25,h:25},rel:{x:25,y:25,w:25,h:25}})
                compare(sds.get(tree,'children.0.children.0.rect'),{abs:{x:25,y:25,w:12,h:12},rel:{x:0,y:0,w:12,h:12}})
                tree = absol({cols:10,rows:10},{x:8,y:0,w:'100%',h:10,children:[{x:'50%',y:0,w:'50%',h:2}]})
                compare(tree.rect,{abs:{x:8,y:0,w:2,h:10},rel:{x:8,y:0,w:2,h:10}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:9,y:0,w:1,h:2},rel:{x:1,y:0,w:1,h:2}})
                tree = absol({cols:20,rows:20},{x:1,y:1,w:18,h:8,children:[{x:0,y:0,w:'50%',h:3,children:[{x:1,y:1,w:'50%',h:2}]},{x:'50%',y:0,w:'50%',h:3}]})
                compare(tree.rect,{abs:{x:1,y:1,w:18,h:8},rel:{x:1,y:1,w:18,h:8}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:1,y:1,w:9,h:3},rel:{x:0,y:0,w:9,h:3}})
                compare(sds.get(tree,'children.0.children.0.rect'),{abs:{x:2,y:2,w:4,h:2},rel:{x:1,y:1,w:4,h:2}})
                compare(sds.get(tree,'children.1.rect'),{abs:{x:10,y:1,w:9,h:3},rel:{x:9,y:0,w:9,h:3}})
            })
            await section("no space", async function ()
            {
                tree = absol({cols:10,rows:5},{x:0,y:0,w:10,h:5,children:[{x:20,y:20,w:5,h:5}]})
                compare(tree.rect,{abs:{x:0,y:0,w:10,h:5},rel:{x:0,y:0,w:10,h:5}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:10,y:5,w:0,h:0},rel:{x:10,y:5,w:0,h:0}})
                tree = absol({cols:10,rows:5},{x:0,y:0,w:10,h:5,children:[{x:8,y:3,w:5,h:5}]})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:8,y:3,w:2,h:2},rel:{x:8,y:3,w:2,h:2}})
                tree = absol({cols:10,rows:5},{x:0,y:0,w:0,h:0,children:[{x:1,y:1,w:3,h:3}]})
                compare(tree.rect,{abs:{x:0,y:0,w:0,h:0},rel:{x:0,y:0,w:0,h:0}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:0,y:0,w:0,h:0},rel:{x:0,y:0,w:0,h:0}})
                tree = absol({cols:10,rows:10},{x:2,y:2,w:6,h:4,children:[{x:-2,y:-1,w:'100%',h:'100%'}]})
                compare(tree.rect,{abs:{x:2,y:2,w:6,h:4},rel:{x:2,y:2,w:6,h:4}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:2,y:2,w:6,h:4},rel:{x:0,y:0,w:6,h:4}})
                tree = absol({cols:10,rows:5},{x:0,y:0,w:5,h:5,children:[]})
                compare(tree.rect,{abs:{x:0,y:0,w:5,h:5},rel:{x:0,y:0,w:5,h:5}})
                compare(tree.children,[])
            })
            await section("permutations", async function ()
            {
                tree = absol({cols:100,rows:50},{x:'10%',y:'10%',r:'10%',b:10,children:[{x:4,y:2,w:'50%',b:'20%',children:[{x:'25%',y:3,r:6,h:'25%',children:[{x:2,y:'50%',w:12,h:2,children:[{x:0,y:0,r:'100%',b:'100%'}]}]}]}]})
                compare(tree.rect,{abs:{x:10,y:5,w:80,h:35},rel:{x:10,y:5,w:80,h:35}})
                compare(sds.get(tree,'children.0.rect.abs'),{x:14,y:7,w:40,h:26})
                compare(sds.get(tree,'children.0.children.0.rect.abs'),{x:24,y:10,w:24,h:6})
                compare(sds.get(tree,'children.0.children.0.children.0.rect.abs'),{x:26,y:13,w:12,h:2})
                compare(sds.get(tree,'children.0.children.0.children.0.children.0.rect.abs'),{x:26,y:13,w:0,h:0})
            })
        })
        await section("nodeForPos", async function ()
        {
            await section("containment", async function ()
            {
                tree = {bg:'#000',children:[{text:'hello',x:2,y:1,w:5,h:2}]}
                res = layout.nodeForPos({cols:10,rows:5},tree,[3,2])
                compare(res.text,'hello')
                compare(res.x,2)
                compare(res.y,1)
                compare(res.w,5)
                compare(res.h,2)
                res = layout.nodeForPos({cols:10,rows:5},tree,[7,2])
                compare(res.bg,'#000')
                res = layout.nodeForPos({cols:10,rows:5},tree,[3,3])
                compare(res.bg,'#000')
            })
            await section("percentages and anchors", async function ()
            {
                tree = {x:'20%',y:1,w:'40%',h:2}
                res = layout.nodeForPos({cols:10,rows:5},tree,[2,1])
                compare(res.rect.abs,{x:2,y:1,w:4,h:2})
                res = layout.nodeForPos({cols:10,rows:5},tree,[5,2])
                compare(res.rect.abs,{x:2,y:1,w:4,h:2})
                compare(!_k_.empty(layout.nodeForPos({cols:10,rows:5},tree,[6,2])),false)
                compare(!_k_.empty(layout.nodeForPos({cols:10,rows:5},tree,[2,3])),false)
                tree = {x:1,y:1,r:2,b:1}
                res = layout.nodeForPos({cols:10,rows:5},tree,[7,3])
                compare(res.rect.abs,{x:1,y:1,w:7,h:3})
                compare(!_k_.empty(layout.nodeForPos({cols:10,rows:5},tree,[8,3])),false)
            })
            await section("topmost", async function ()
            {
                tree = {bg:'#111',children:[{text:'x',x:1,y:1,w:2,h:2}]}
                compare(layout.nodeForPos({cols:4,rows:4},tree,[2,2]).text,'x')
                tree = {children:[{text:'a',x:0,y:0,w:4,h:2},{text:'b',x:2,y:0,w:4,h:2}]}
                compare(layout.nodeForPos({cols:6,rows:2},tree,[1,0]).text,'a')
                compare(layout.nodeForPos({cols:6,rows:2},tree,[3,0]).text,'b')
                tree = {children:[{text:'outer',x:0,y:0,w:4,h:2,children:[{text:'inner',x:1,y:0,w:2,h:2}]}]}
                compare(layout.nodeForPos({cols:4,rows:2},tree,[1,0]).text,'inner')
                compare(layout.nodeForPos({cols:4,rows:2},tree,[3,0]).text,'outer')
            })
            await section("nested", async function ()
            {
                tree = {bg:'#000',x:2,y:2,w:20,h:10,children:[{x:3,y:2,w:10,h:5,children:[{text:'in',x:1,y:1,w:6,h:3}]}]}
                res = layout.nodeForPos({cols:30,rows:20},tree,[9,6])
                compare(res.text,'in')
                compare(res.rect.abs,{x:6,y:5,w:6,h:3})
                compare(res.rect.rel,{x:1,y:1,w:6,h:3})
            })
            await section("empty and indexed", async function ()
            {
                res = layout.nodeForPos({cols:4,rows:4},{children:[{text:'z',x:2,y:2,w:0,h:0}]},[2,2])
                compare(res.rect.abs,{x:0,y:0,w:4,h:4})
                compare(sds.get(res,'children.0.rect.abs'),{x:2,y:2,w:0,h:0})
                res = layout.nodeForPos({cols:4,rows:4},{index:1,text:'i',x:1,y:1,w:2,h:2},[2,2])
                compare(res.index,1)
                compare(res.text,'i')
                compare(res.rect.abs,{x:1,y:1,w:2,h:2})
            })
        })
        await section("moveNode", async function ()
        {
            await section("absolute", async function ()
            {
                cells = {cols:20,rows:6}
                tree = absol(cells,{children:[{text:'move',x:2,y:2,w:4,h:2}]})
                layout.moveNode(cells,tree,tree.children[0],'left')
                compare(tree.children[0].x,1)
                layout.moveNode(cells,tree,tree.children[0],'left')
                compare(tree.children[0].x,0)
                layout.moveNode(cells,tree,tree.children[0],'left')
                compare(tree.children[0].x,0)
                layout.moveNode(cells,tree,tree.children[0],'right')
                compare(tree.children[0].x,1)
            })
            await section("relative", async function ()
            {
                cells = {cols:20,rows:10}
                tree = absol(cells,{children:[{text:'relm',x:'2%',y:'99%',w:'50%',h:'40%'}]})
                layout.moveNode(cells,tree,tree.children[0],'left')
                compare(tree.children[0].x,'1%')
                layout.moveNode(cells,tree,tree.children[0],'left')
                compare(tree.children[0].x,'0%')
                layout.moveNode(cells,tree,tree.children[0],'left')
                compare(tree.children[0].x,'0%')
                layout.moveNode(cells,tree,tree.children[0],'right')
                compare(tree.children[0].x,'1%')
            })
        })
        await section("resizeNode", async function ()
        {
            await section("absolute", async function ()
            {
                cells = {cols:20,rows:6}
                tree = absol(cells,{children:[{text:'size',x:2,y:2,w:4,h:2}]})
                layout.resizeNode(cells,tree,tree.children[0],'more cols')
                compare(tree.children[0].w,5)
                layout.resizeNode(cells,tree,tree.children[0],'more cols')
                compare(tree.children[0].w,6)
                layout.resizeNode(cells,tree,tree.children[0],'less cols')
                compare(tree.children[0].w,5)
                layout.resizeNode(cells,tree,tree.children[0],'more rows')
                compare(tree.children[0].h,3)
                layout.resizeNode(cells,tree,tree.children[0],'more rows')
                compare(tree.children[0].h,4)
                layout.resizeNode(cells,tree,tree.children[0],'more rows')
                compare(tree.children[0].h,4)
                layout.resizeNode(cells,tree,tree.children[0],'less rows')
                compare(tree.children[0].h,3)
            })
            await section("relative", async function ()
            {
                cells = {cols:20,rows:10}
                tree = absol(cells,{children:[{text:'a',x:2,y:2,w:'50%',h:'40%'}]})
                layout.resizeNode(cells,tree,tree.children[0],'more cols')
                compare(tree.children[0].w,'51%')
                layout.resizeNode(cells,tree,tree.children[0],'more cols')
                compare(tree.children[0].w,'52%')
                layout.resizeNode(cells,tree,tree.children[0],'less cols')
                compare(tree.children[0].w,'51%')
                layout.resizeNode(cells,tree,tree.children[0],'more rows')
                compare(tree.children[0].h,'41%')
                layout.resizeNode(cells,tree,tree.children[0],'more rows')
                compare(tree.children[0].h,'42%')
                layout.resizeNode(cells,tree,tree.children[0],'less rows')
                compare(tree.children[0].h,'41%')
            })
        })
        await section("titlify", async function ()
        {
            tree = {bg:'#000',x:2,y:2,w:20,h:10,children:[{x:3,y:2,w:10,h:5,children:[{text:'hi',x:1,y:1,w:3,h:1}]}]}
            layout.titlify({cols:30,rows:20},tree)
            compare(tree.title,'  bg')
            compare(tree.rect.abs,{x:2,y:2,w:20,h:10})
            container = sds.get(tree,'children.0')
            compare((container.title != null),false)
            text = sds.get(tree,'children.0.children.0')
            compare(text.title,'      text')
            compare(text.rect.abs,{x:6,y:5,w:3,h:1})
            compare(layout.typeOf(tree),'bg')
            compare(layout.argOf(tree),'#000')
            compare(layout.typeOf(container),null)
            compare(layout.typeOf(text),'text')
            compare(layout.argOf(text),'hi')
            tree = {bg:'#000',children:[{x:2,y:1,w:10,h:5,children:[{text:'hi',x:1,y:1,r:1,b:1}]}]}
            layout.titlify({cols:30,rows:20},tree)
            compare(sds.get(tree,'children.0.children.0.rect.abs'),{x:3,y:2,w:8,h:3})
        })
        await section("sourceOf", async function ()
        {
            tree = {bg:'#333',children:[{text:'hi',x:1,y:1,w:3,h:1}]}
            layout.titlify({cols:10,rows:5},tree)
            layout.regionize({cols:10,rows:5},tree)
            compare(noon.parse(layout.sourceOf(tree)),{bg:'#333',children:[{text:'hi',x:1,y:1,w:3,h:1}]})
            tree = {bg:'#333'}
            layout.insertTextAt({cols:10,rows:5},tree,[2,1],'a')
            compare(noon.parse(layout.sourceOf(tree)),{bg:'#333',children:[{text:'a',x:2,y:1,w:2,h:1}]})
        })
    })
    await section("insertTextAt", async function ()
    {
        await section("creates a text node", async function ()
        {
            tree = {}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[3,2],'a'),1)
            compare(sds.get(tree,'children.0'),{text:'a',x:3,y:2,w:2,h:1})
            tree = {pattern:'x',x:1,y:1,w:6,h:3}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[3,2],'a'),1)
            compare(sds.get(tree,'children.0'),{text:'a',x:2,y:1,w:2,h:1})
            tree = {x:2,y:2,w:4,h:2}
            compare(layout.insertTextAt({cols:10,rows:10},tree,[8,8],'a'),1)
            compare(sds.get(tree,'children.0'),{text:'a',x:6,y:6,w:2,h:1})
        })
        await section("inserts into a text node", async function ()
        {
            tree = {children:[{text:'ab',x:1,y:1,w:6,h:2}]}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[2,1],'X'),1)
            compare(sds.get(tree,'children.0.text'),'aXb')
            tree = {children:[{text:'ab',x:1,y:1,w:6,h:2}]}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[6,1],'Z'),1)
            compare(sds.get(tree,'children.0.text'),'abZ')
            tree = {children:[{text:'ab',scale:2,x:0,y:0,w:8,h:2}]}
            compare(layout.insertTextAt({cols:8,rows:2},tree,[4,0],'X'),2)
            compare(sds.get(tree,'children.0.text'),'abX')
            compare(layout.insertTextAt({cols:8,rows:2},null,[0,0],'X'),0)
        })
    })
    await section("fill", async function ()
    {
        await section("pattern", async function ()
        {
            compare(fill.pattern({pattern:'0123456789',type:'repeat'},[[10,2,20]]),['0123456789'])
            compare(fill.pattern({pattern:'0123456789',type:'repeat'},[[5,2,20],[5,3,15],[0,4,15]]),['567890123456789','5678901234','012345678901234'])
            compare(fill.pattern({pattern:'ab',type:'repeat'},[[0,0,3],[1,0,2]]),['aba','b'])
            compare(fill.pattern({pattern:'ab',type:'repeat'},[]),[])
            compare(fill.pattern({pattern:'ab',type:'repeat'},[[5,0,5]]),[''])
        })
        await section("text", async function ()
        {
            compare(fill.text({text:'some text'},[[5,200,10],[5,201,10]]),['some ','text '])
            compare(fill.text({text:'abcdefgh'},[[0,0,3],[0,1,3],[0,2,3]]),['abc','def','gh '])
            compare(fill.text({text:'a\nb'},[[0,0,4],[0,1,4]]),['a   ','b   '])
            compare(fill.text({text:''},[[0,0,3]]),['   '])
        })
        await section("scaled", async function ()
        {
            compare(fill.scaled({text:'abc',scale:2},[[0,0,8],[0,1,8]],{x:0,y:0,w:8,h:2}),[[0,0,'a'],[2,0,'b'],[4,0,'c']])
            compare(fill.scaled({text:'abcdef',scale:2},[[0,0,5],[0,1,5]],{x:0,y:0,w:5,h:2}),[[0,0,'a'],[2,0,'b']])
            compare(fill.scaled({text:'a cd',scale:2},[[0,0,4],[0,1,4],[0,2,4],[0,3,4]],{x:0,y:0,w:4,h:4}),[[0,0,'a'],[2,0,' '],[0,2,'c'],[2,2,'d']])
            compare(fill.scaled({text:'a\nb',scale:2},[[0,0,6],[0,1,6],[0,2,6],[0,3,6]],{x:0,y:0,w:6,h:4}),[[0,0,'a'],[0,2,'b']])
            compare(fill.scaled({text:'abcd',scale:2},[[0,0,6],[0,1,2],[4,1,6]],{x:0,y:0,w:6,h:2}),[[0,0,'a'],[4,0,'b']])
            compare(fill.scaled({text:'abcd',scale:2},[[0,0,4],[0,1,4],[0,2,4]],{x:0,y:0,w:4,h:3}),[[0,0,'a'],[2,0,'b']])
        })
    })
    await section("regionize", async function ()
    {
        await section("regions", async function ()
        {
            tree = {bg:'#00f',children:[{pattern:'0123456789',type:'repeat',fg:'#ff0',x:0,y:0,children:[{erase:'char',x:2,y:2,r:2,b:2}]},{text:'heading',x:4,y:3,r:6,h:3,scale:3,flows:false},{text:'longer text',x:8,y:14,w:'100%',h:3},{text:'some',x:8,y:15,h:3,scale:3,blocks:true}]}
            regions = layout.regionize({rows:20,cols:30},tree)
            compare(sds.get(regions,'children.3.rect.abs.w'),22)
            compare(sds.get(regions,'children.3.regions'),[[8,15,30],[8,16,30],[8,17,30]])
            compare(sds.get(regions,'children.2.regions'),[[8,14,30]])
            compare(sds.get(regions,'children.1.regions'),[[4,3,24],[4,4,24],[4,5,24]])
            compare(sds.get(regions,'children.0.regions'),[[0,0,30],[0,1,30],[0,2,30],[0,3,30],[0,4,30],[0,5,30],[0,6,30],[0,7,30],[0,8,30],[0,9,30],[0,10,30],[0,11,30],[0,12,30],[0,13,30],[0,14,30],[0,15,8],[0,16,8],[0,17,8],[0,18,30],[0,19,30]])
            tree = {bg:'#00f',children:[{pattern:'0123456789',type:'repeat',fg:'#ff0',x:0,y:0,children:[{erase:'char',x:2,y:2,r:2,b:2}]},{text:'heading',x:4,y:3,r:2,h:1,scale:3,flows:false},{text:'longer text that flows and flows and flows and flows into the sea.',x:4,y:6,r:4,h:5},{text:'some',x:'40%',y:7,w:12,h:3,scale:3,blocks:true},{text:'longer text that flows and flows and flows and flows into the sea.',x:4,y:13,r:4,h:5},{text:'some',x:4,y:14,w:12,h:3,scale:3,blocks:true}]}
            compare(dmp({rows:20,cols:30},tree),`012345678901234567890123456789
012345678901234567890123456789
01                          89
01  h  e  a  d  i  n  g     89
01                          89
01                          89
01  longer text that flows  89
01   and flos  o  m  e  ws  89
01   and flo            ws  89
01   and flo            ws  89
01   into the sea.          89
01                          89
01                          89
01  longer text that flows  89
01  s  o  m  e   and flows  89
01               and flows  89
01               and flows  89
01   into the sea.          89
012345678901234567890123456789
012345678901234567890123456789`)
            compare(dmp({rows:15,cols:25},tree),`0123456789012345678901234
0123456789012345678901234
01                     34
01  h  e  a  d  i  n   34
01                     34
01                     34
01  longer text that   34
01  flows s  o  m  e   34
01  and fl             34
01  ows an             34
01  d flows and flows  34
01                     34
01                     34
0123longer text that 1234
0123flows and flows a1234`)
            compare(dmp({cols:10,rows:3},{pattern:'1234',type:'repeat'}),`1234123412
1234123412
1234123412`)
            compare(dmp({cols:10,rows:3},{pattern:'1234',type:'repeat',children:[{erase:'char',x:3,y:1,r:3,h:1}]}),`1234123412
123    412
1234123412`)
            compare(dmp({cols:10,rows:3},{pattern:'1234',type:'repeat',children:[{erase:'char',x:3,y:1,r:3,h:1},{text:'hello',x:4,y:1,w:2,h:1}]}),`1234123412
123 he 412
1234123412`)
            compare(dmp({cols:10,rows:3},{pattern:'1234',type:'repeat',children:[{erase:'char',x:3,y:1,r:3,h:1},{text:'hello',x:4,y:1,w:2,h:1,scale:2}]}),`1234123412
123 h  412
1234  3412`)
        })
        await section("blocks", async function ()
        {
            tree = {w:10,h:2,children:[{text:'abcdefghij',x:0,y:0,w:10,h:2},{blocks:true,x:3,y:0,w:2,h:2}]}
            compare(rgns({rows:2,cols:10},tree,'children.0.regions'),[[0,0,3],[5,0,10],[0,1,3],[5,1,10]])
            tree = {blocks:true,x:0,y:0,w:8,h:2,children:[{text:'ab',x:0,y:0,w:8,h:2}]}
            compare(rgns({rows:2,cols:8},tree,'children.0.regions'),[[0,0,8],[0,1,8]])
            tree = {text:'ab',x:0,y:0,w:8,h:1,flows:false,children:[{blocks:true,x:2,y:0,w:2,h:1}]}
            compare(rgns({rows:1,cols:8},tree,'regions'),[[0,0,8]])
            tree = {pattern:'x',x:0,y:0,w:6,h:1,children:[{blocks:true,x:2,y:0,w:2,h:1}]}
            compare(rgns({rows:1,cols:6},tree,'regions'),[[0,0,2],[4,0,6]])
        })
    })
    await section("dump", async function ()
    {
        compare(dmp({rows:2,cols:10},{text:'abcdefghij',x:0,y:0,w:10,h:2,children:[{blocks:true,x:3,y:0,w:2,h:2}]}),'abc  defgh\nij        ')
        compare(dmp({rows:2,cols:6},{pattern:'abc',x:0,y:0,w:6,h:2,children:[{erase:'char',x:1,y:0,w:2,h:1}]}),'a  abc\nabcabc')
        compare(dmp({rows:2,cols:8},{text:'abc',scale:2,x:0,y:0,w:8,h:2}),'a b c   \n        ')
        compare(dmp({rows:1,cols:4},{w:4,h:1,children:[{pattern:'#.',x:0,y:0,w:4,h:1},{text:'xy',x:1,y:0,w:2,h:1}]}),'#xy.')
    })
    await section("sueify", async function ()
    {
        data = desue({cols:8,rows:3},{bg:'#00f',children:[{text:'hi',x:1,y:1,w:3,h:1,fg:'#ff0'}]})
        compare(data.text,'        \n hi     \n        ')
        compare(data.sue.length,4)
        compare(areas(data,sue.FG_COLOR).length,1)
        compare(areas(data,sue.FG_COLOR)[0].value,[31,3,1,'#ff0'])
        data = desue({cols:6,rows:5},{children:[{text:'A',x:1,y:1,w:3,h:3,scale:3,fg:'#ff0'}]})
        compare(data.text,'      \n      \n      \n A  \n      ')
        runs = areas(data,sue.SCALE)
        compare(runs.length,1)
        compare(runs[0].x,1)
        compare(runs[0].y,3)
        compare(runs[0].value[3],3)
        data = desue({cols:6,rows:3},{children:[{text:'A',x:1,y:1,w:3,h:1,scale:3}]})
        compare(data.text,'      \n      \n      ')
        compare(areas(data,sue.SCALE).length,0)
        data = desue({cols:12,rows:2},{children:[{text:'ab cd',x:0,y:0,w:12,h:2,scale:2}]})
        compare(data.text,'            \nab cd  ')
        runs = areas(data,sue.SCALE)
        compare(runs.length,1)
        compare(runs[0].x,0)
        compare(areas(data,sue.CLOSE)[0].x,5)
        data = desue({cols:6,rows:4},{children:[{text:'abcdef',x:0,y:0,w:6,h:4,scale:2}]})
        compare(data.text,'      \nabc\n      \ndef')
        compare(areas(data,sue.SCALE).map(function (a)
        {
            return [a.x,a.y]
        }),[[0,1],[0,3]])
        data = desue({cols:8,rows:2},{children:[{text:'ab',x:0,y:0,w:4,h:2,scale:2},{text:'cd',x:4,y:0,w:4,h:2,scale:2}]})
        compare(data.text,'        \nabcd')
        compare(areas(data,sue.SCALE).map(function (a)
        {
            return a.x
        }),[0,2])
        compare(areas(data,sue.CLOSE).map(function (a)
        {
            return a.x
        }),[2,4])
    })
    await section("heights", async function ()
    {
        compare(absrect({cols:10,rows:10},{text:'a',h:2,scale:3}).abs.h,3)
        compare(absrect({cols:10,rows:10},{text:'a',h:7,scale:3}).abs.h,6)
        compare(absrect({cols:10,rows:10},{text:'a',y:1,b:1,scale:3}).abs.h,6)
        compare(absrect({cols:10,rows:2},{text:'a',h:3,scale:3}).abs.h,0)
        compare(absrect({cols:10,rows:10},{pattern:'a',h:2,scale:3}).abs.h,2)
    })
    await section("blocks are never cut", async function ()
    {
        compare(dmp({cols:6,rows:2},{children:[{text:'ab',x:0,y:0,w:6,h:2,scale:2},{text:'z',x:1,y:1,w:1,h:1}]}),'  b   \n z    ')
    })
    await section("editor", async function ()
    {
        sheet('popo_test_editor',['susan'])
        showSue(desue({cols:16,rows:4},{bg:'#00f',children:[{text:'hi',x:1,y:1,w:2,h:1,fg:'#ff0'}]}))
        compare(h.at(1,1),'h')
        compare(h.at(2,1),'i')
        compare(h.screen.get_fg(1,1),[255,255,0])
        compare(h.screen.get_bg(5,0),[0,0,255])
        h.t.textSizing = true
        h.screen.init()
        showSue(desue({cols:16,rows:6},{children:[{text:'A',x:1,y:1,w:3,h:3,scale:3,fg:'#ff0'}]}))
        compare(h.at(1,1).includes(']66;s=3'),true)
        compare(h.screen.blockAt(1,1),[1,1,3,1,3])
    })
    await section("sheet typing", async function ()
    {
        sheet('popo_sheet_typing')
        e.state.rectree = {bg:'#000'}
        e.state.setCursors([[2,1]])
        e.state.insert('a')
        e.draw()
        compare(e.state.mainCursor(),[3,1])
        compare(h.at(2,1),'a')
        compare(rt('children.0.text'),'a')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:2,h:1})
        e.state.insert('b')
        e.draw()
        compare(e.state.mainCursor(),[4,1])
        compare(h.at(3,1),'b')
        compare(rt('children.0.text'),'ab')
        compare(rt('children.0.w'),3)
        e.state.rectree = {x:2,y:1,w:6,h:2}
        e.state.setCursors([[10,3]])
        e.state.insert('c')
        compare(rt('children.0.text'),'c')
        compare(rt('children.0.x'),8)
        compare(rt('children.0.y'),2)
    })
    await section("sheet move keys", async function ()
    {
        sheet('popo_sheet_move')
        e.grabFocus()
        e.state.rectree = {children:[{text:'a',x:2,y:1,w:3,h:2}]}
        e.state.rectreeCols = 16
        e.state.rectreeRows = 4
        e.state.setCursors([[3,1]])
        h.key(e,'shift+alt+l')
        compare(rt('children.0.rect.abs'),{x:3,y:1,w:3,h:2})
        compare(e.state.mainCursor(),[4,1])
        h.key(e,'shift+alt+j')
        compare(rt('children.0.rect.abs'),{x:3,y:2,w:3,h:2})
        h.key(e,'shift+alt+k')
        compare(rt('children.0.rect.abs'),{x:3,y:1,w:3,h:2})
        h.key(e,'shift+alt+h')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:3,h:2})
    })
    await section("sheet undo", async function ()
    {
        sheet('popo_sheet_undo')
        e.grabFocus()
        loadSheet({children:[{text:'a',x:2,y:1,w:3,h:2}]},[3,1])
        e.state.moveSheetNode('right')
        compare(rt('children.0.x'),3)
        e.draw()
        compare(h.at(3,1),'a')
        e.state.undo()
        compare(rt('children.0.x'),2)
        compare(e.state.mainCursor(),[3,1])
        e.draw()
        compare(h.at(2,1),'a')
        e.state.redo()
        compare(rt('children.0.x'),3)
    })
    await section("sheet text undo", async function ()
    {
        sheet('popo_sheet_text_undo')
        e.grabFocus()
        loadSheet({bg:'#000'},[2,1])
        e.state.setCursors([[2,1]])
        e.state.insert('a')
        compare(rt('children.0.text'),'a')
        e.state.undo()
        compare((rt('children') != null),false)
        e.state.redo()
        compare(rt('children.0.text'),'a')
    })
    await section("resize is not an undo step", async function ()
    {
        sheet('popo_sheet_resize_history')
        e.grabFocus()
        tree = {children:[{text:'a',x:2,y:1,w:3,h:2}]}
        loadSheet(tree,[3,1])
        before = e.state.h.length
        e.state.renderSheet(tree,{cols:10,rows:4},[3,1],{history:false,silent:true})
        compare(e.state.h.length,before)
    })
    await section("sheet render size", async function ()
    {
        sheet('popo_sheet_render_size')
        e.state.rectree = {children:[{pattern:'x',x:'50%',y:0,w:'50%',h:2}]}
        e.state.rectreeCols = 10
        e.state.rectreeRows = 4
        e.state.setCursors([[6,0]])
        e.state.insert('a')
        compare(rt('children.0.rect.abs'),{x:5,y:0,w:5,h:2})
        compare(rt('children.0.children.0.rect.abs'),{x:6,y:0,w:2,h:1})
    })
    await section("sheet cells and cursors", async function ()
    {
        sheet('popo_sheet_cells')
        e.grabFocus()
        loadSheet({children:[{text:'AB',x:1,y:0,w:6,h:2,scale:2},{text:'z',x:9,y:1,w:2,h:1}]},[0,0])
        compare(kseg.str(e.state.s.lines[1]),' AB    z      ')
        compare(e.state.sheetCellForPos([7,1]),[9,1])
        compare(e.state.sheetCellForPos([2,1]),[3,1])
        compare(e.state.sheetCellForPos([9,1]),[11,1])
        compare(e.state.sheetPosForCell([9,1]),[7,1])
        compare(e.state.sheetPosForCell([4,1]),[2,1])
        compare(e.state.sheetPosForCell([11,1]),[9,1])
        compare(e.state.sheetPosForCell([3,0]),[2,1])
        compare(e.state.sheetPosForCell([8,0]),[8,0])
        e.state.setCursors([[8,1]])
        e.state.insert('y')
        compare(rt('children.1.text'),'zy')
        compare((rt('children') != null ? rt('children').length : undefined),2)
        compare(e.state.mainCursor(),[9,1])
        e.state.setCursors([[3,1]])
        e.state.insert('C')
        compare(rt('children.0.text'),'ABC')
        compare(e.state.mainCursor(),[4,1])
        e.state.setCursors([[1,1]])
        h.key(e,'shift+alt+l')
        compare(rt('children.0.x'),2)
        compare(e.state.mainCursor(),[2,1])
    })
    await section("sheet scale keys", async function ()
    {
        sheet('popo_sheet_scale_keys',['susan'])
        e.grabFocus()
        loadSheet({children:[{text:'abc',x:1,y:0,w:12,h:1}]},[0,0])
        e.state.setCursors([[2,0]])
        h.key(e,'shift+alt+=')
        compare(rt('children.0.scale'),2)
        compare(rt('children.0.h'),2)
        compare(e.state.mainCursor(),[2,1])
        compare(e.state.s.sue.filter(function (a)
        {
            return a.value[0] === sue.LINE_SCALE
        }).length,0)
        compare(e.state.s.sue.filter(function (a)
        {
            return a.value[0] === sue.SCALE
        }).length,1)
        h.key(e,'shift+alt+=')
        compare(rt('children.0.scale'),3)
        compare(rt('children.0.h'),3)
        compare(e.state.mainCursor(),[2,2])
        h.key(e,'shift+alt+-')
        compare(rt('children.0.scale'),2)
        compare(rt('children.0.h'),2)
        h.key(e,'shift+alt+0')
        compare((rt('children.0.scale') != null),false)
        compare(rt('children.0.h'),1)
        compare(e.state.mainCursor(),[2,0])
        e.state.undo()
        compare(rt('children.0.scale'),2)
        before = e.state.s.sue
        h.key(e,'shift+alt+b')
        compare(e.state.s.sue,before)
    })
    await section("sheet cursor up and down", async function ()
    {
        h = new harness({cols:16,rows:8})
        e = new editor(h.screen,'popo_sheet_updown',[])
        e.layout(0,0,16,8)
        e.grabFocus()
        tree = {children:[{text:'abcdef',x:2,y:1,w:8,h:4,scale:2},{text:'xy',x:2,y:6,w:4,h:1}]}
        e.state.setSheetTree(tree,16,8)
        e.state.renderSheet(tree,{cols:16,rows:8},[0,0],{history:false,silent:true})
        compare(kseg.str(e.state.s.lines[2]).trimEnd(),'  abcd')
        compare(kseg.str(e.state.s.lines[4]).trimEnd(),'  ef')
        e.state.setCursors([[2,0]])
        h.key(e,'down')
        compare(e.state.mainCursor(),[2,2])
        h.key(e,'down')
        compare(e.state.mainCursor(),[2,4])
        h.key(e,'down')
        compare(e.state.mainCursor(),[2,5])
        h.key(e,'down')
        compare(e.state.mainCursor(),[2,6])
        h.key(e,'up')
        compare(e.state.mainCursor(),[2,5])
        h.key(e,'up')
        compare(e.state.mainCursor(),[2,4])
        h.key(e,'up')
        compare(e.state.mainCursor(),[2,2])
        h.key(e,'up')
        compare(e.state.mainCursor(),[2,0])
        e.state.setCursors([[3,0]])
        h.key(e,'down')
        compare(e.state.mainCursor(),[2,2])
        e.state.setCursors([[7,3]])
        h.key(e,'down')
        compare(e.state.mainCursor(),[7,5])
        e.state.setCursors([[7,3]])
        h.key(e,'up')
        compare(e.state.mainCursor(),[4,2])
        e.state.setCursors([[5,4]])
        compare(e.state.sheetCellForPos(e.state.mainCursor()),[7,4])
        h.key(e,'up')
        compare(e.state.mainCursor(),[4,2])
        e.state.setCursors([[2,0]])
        e.state.moveCursors('down',{count:2})
        compare(e.state.mainCursor(),[2,4])
    })
    await section("sheet clicks", async function ()
    {
        global.ked_session = ((_808_27_=global.ked_session) != null ? _808_27_ : {get:(function ()
        {
            return null
        }),set:(function ()
        {})})
        h = new harness({cols:16,rows:8})
        e = new fileeditor(h.screen,'popo_sheet_click')
        e.layout(0,0,16,8)
        tree = {children:[{text:'abcdef',x:2,y:1,w:8,h:4,scale:2},{text:'xy',x:2,y:6,w:4,h:1}]}
        e.state.setSheetTree(tree,16,8)
        e.state.renderSheet(tree,{cols:16,rows:8},[0,0],{history:false,silent:true})
        click = function (x, y)
        {
            return e.onMouse({type:'press',cell:[x + e.cells.x,y + e.cells.y],button:'left',count:1})
        }
        click(5,2)
        compare(e.state.mainCursor(),[3,2])
        click(5,1)
        compare(e.state.mainCursor(),[3,2])
        click(8,3)
        compare(e.state.mainCursor(),[6,4])
        click(3,6)
        compare(e.state.mainCursor(),[3,6])
        click(3,5)
        compare(e.state.mainCursor(),[3,5])
        post.emit('cells.rect',{x:2,y:1,w:8,h:4})
        compare(e.cells.cellRect,{x:2,y:1,w:8,h:4})
        click(4,2)
        compare(e.cells.cellRect,{x:2,y:1,w:8,h:4})
    })
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQW1CLFVBQVQ7T0FBYSxXQUFiOztPQUNBLFVBQUE7SUFBUztJQUFLOztPQUNMLFVBQVA7O09BQ08sYUFBWjtPQUFtQixXQUFuQjs7T0FDWSxhQUFaOztPQUNjLGlCQUFUOztPQUNPLGNBQVo7OztBQUVQLGtCQUFVLE9BQU07O1dBQVEsT0FBTyxXQUFXLE1BQU07OztBQUNoRCxvQkFBVSxPQUFNOztXQUFRLE1BQU0sTUFBTSxNQUFNOzs7QUFDMUMsaUJBQVUsT0FBTSxNQUFLOztXQUFRLElBQUksSUFBSSxPQUFPLFVBQVUsTUFBTSxNQUFNOzs7QUFDbEUsZ0JBQVUsT0FBTTs7V0FBUSxPQUFPLFlBQVksT0FBTyxVQUFVLE1BQU07OztBQUNsRSxrQkFBVSxPQUFNOztXQUFRLElBQUksTUFBTSxPQUFPLE9BQU8sTUFBTTs7O0FBQ3RELGtCQUFVLE1BQUs7O1dBQVEsS0FBSyxJQUFJLGlCQUFROztlQUFTLEtBQUssTUFBTSxPQUFNOzs7QUFFbEUsSUFBSSxJQUFJOztBQUVSLGtCQUFRLE1BQUs7O0lBQ1QsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sS0FBSztJQUM3QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7V0FDaEIsRUFBRSxNQUFNLFdBQVcsbUJBQW1CLG1CQUFtQixtQkFBbUI7OztBQUVoRixlQUFLOztXQUFRLElBQUksSUFBSSxFQUFFLE1BQU0sUUFBUTs7O0FBRXJDLHNCQUFZLE1BQUs7O0lBQ2IsRUFBRSxNQUFNLGFBQWEsS0FBSyxHQUFHO0lBQzdCLEVBQUUsTUFBTSxZQUFZLE1BQU0sS0FBSyxHQUFHLEtBQUssR0FBRyxRQUFPLFFBQVEsTUFBTSxPQUFPO1dBQ3RFLEVBQUUsTUFBTTs7O0FBRVosb0JBQVU7O0lBQ04sRUFBRSxNQUFNLFVBQVUsS0FBSyxLQUFLLE1BQU07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QUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDNUUsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFNUUsT0FBTyxPQUFPLEtBQUssSUFBSSxLQUFLLE1BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTt3QkFDbkksS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDekQsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTt3QkFDbkYsSUFBSSxJQUFJLEtBQUssK0JBQWlDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFFNUYsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLEtBQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTt3QkFDeEYsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDdkQsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFNUUsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLEtBQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7d0JBQzFJLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7d0JBQ3hELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQzVFLElBQUksSUFBSSxLQUFLLCtCQUFpQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQ3ZGLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7Z0JBSTdFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7d0JBQzVFLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7d0JBQ3hELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTlFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQzFFLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTVFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQ3pFLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQ3RELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTVFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxLQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7d0JBQ2pGLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQ3RELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTVFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDaEQsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDdEQsS0FBSzs7OztnQkFJTCxPQUFPLE9BQU8sS0FBSyxJQUFJLEtBQUssS0FBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsV0FBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBWSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sV0FBWSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO3dCQUN2TSxLQUFLLE1BQVEsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO3dCQUMzRCxJQUFJLElBQUksS0FBSyx3QkFBMEIsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDdkQsSUFBSSxJQUFJLEtBQUssbUNBQXFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7d0JBQ25FLElBQUksSUFBSSxLQUFLLDhDQUFnRCxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO3dCQUM5RSxJQUFJLElBQUksS0FBSyx5REFBMkQsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTs7Ozs7OztnQkFNeEYsUUFBUyxHQUFHLE9BQU8sV0FBWSxLQUFLLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFMUQsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUU7d0JBRWpELElBQUksS0FBTzt3QkFDWCxJQUFJLEVBQUk7d0JBQ1IsSUFBSSxFQUFJO3dCQUNSLElBQUksRUFBSTt3QkFDUixJQUFJLEVBQUk7Z0JBRVIsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUU7d0JBQ2pELElBQUksR0FBSztnQkFFVCxNQUFNLE9BQU8sWUFBWSxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRTt3QkFDakQsSUFBSSxHQUFLOzs7O2dCQUlULFFBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFFL0IsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUU7d0JBQ2pELElBQUksS0FBSyxLQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTlCLE1BQU0sT0FBTyxZQUFZLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFO3dCQUNqRCxJQUFJLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO21DQUV4QixPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUUsS0FBTTttQ0FDakQsT0FBTyxZQUFZLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFLEtBQU07Z0JBRXZELFFBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFdkIsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUU7d0JBQ2pELElBQUksS0FBSyxLQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7bUNBRXhCLE9BQU8sWUFBWSxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxLQUFNOzs7O2dCQUl2RCxRQUFTLEdBQUcsT0FBTyxXQUFZLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO3dCQUV0RCxPQUFPLFlBQVksS0FBSyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsSUFBSyxLQUFPO2dCQUV0RCxRQUFTLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBTSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFFekUsT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUksS0FBTzt3QkFDckQsT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUksS0FBTztnQkFFckQsUUFBUyxXQUFZLEtBQUssUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsV0FBWSxLQUFLLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFFekYsT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUksS0FBTzt3QkFDckQsT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUksS0FBTzs7OztnQkFJckQsUUFBUyxHQUFHLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLFdBQVksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVksS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRXRHLE1BQU0sT0FBTyxZQUFZLEtBQUssR0FBRyxLQUFLLElBQUksTUFBTSxFQUFFO3dCQUVsRCxJQUFJLEtBQU87d0JBQ1gsSUFBSSxLQUFLLEtBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDOUIsSUFBSSxLQUFLLEtBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7OztnQkFJOUIsTUFBTSxPQUFPLFlBQVksS0FBSyxFQUFFLEtBQUssSUFBSyxXQUFZLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQVEsRUFBRTt3QkFDdkYsSUFBSSxLQUFLLEtBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDOUIsSUFBSSxJQUFJLElBQUksd0JBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRXBELE1BQU0sT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLElBQUssTUFBTSxFQUFFLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUssRUFBRTt3QkFDaEYsSUFBSSxNQUFRO3dCQUNaLElBQUksS0FBTzt3QkFDWCxJQUFJLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7Ozs7O2dCQU05QixTQUFTLEtBQUssR0FBRyxLQUFLO2dCQUN0QixPQUFPLE1BQU0sT0FBUSxXQUFZLEtBQUssT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUUzRCxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO3dCQUFVLEtBQUssU0FBUyxHQUFHLEVBQUk7Z0JBQzNFLE9BQU8sU0FBUyxNQUFNLEtBQUssS0FBSyxTQUFTLEdBQUc7d0JBQVUsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRzt3QkFBVSxLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO3dCQUFVLEtBQUssU0FBUyxHQUFHLEVBQUk7Ozs7Z0JBSTNFLFNBQVMsS0FBSyxHQUFHLEtBQUs7Z0JBQ3RCLE9BQU8sTUFBTSxPQUFRLFdBQVksS0FBSyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7Z0JBRXRFLE9BQU8sU0FBUyxNQUFNLEtBQUssS0FBSyxTQUFTLEdBQUc7d0JBQVUsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRzt3QkFBVSxLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO3dCQUFVLEtBQUssU0FBUyxHQUFHLEVBQUk7Z0JBQzNFLE9BQU8sU0FBUyxNQUFNLEtBQUssS0FBSyxTQUFTLEdBQUc7d0JBQVUsS0FBSyxTQUFTLEdBQUcsRUFBSTs7Ozs7OztnQkFNM0UsU0FBUyxLQUFLLEdBQUcsS0FBSztnQkFDdEIsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFM0QsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRzt3QkFBYyxLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUNqRixPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO3dCQUFjLEtBQUssU0FBUyxHQUFHLEVBQUk7Z0JBQ2pGLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSyxTQUFTLEdBQUc7d0JBQWMsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRzt3QkFBYyxLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUNqRixPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO3dCQUFjLEtBQUssU0FBUyxHQUFHLEVBQUk7Z0JBQ2pGLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSyxTQUFTLEdBQUc7d0JBQWMsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRzt3QkFBYyxLQUFLLFNBQVMsR0FBRyxFQUFJOzs7O2dCQUlqRixTQUFTLEtBQUssR0FBRyxLQUFLO2dCQUN0QixPQUFPLE1BQU0sT0FBUSxXQUFZLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO2dCQUU1RCxPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO3dCQUFjLEtBQUssU0FBUyxHQUFHLEVBQUk7Z0JBQ2pGLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSyxTQUFTLEdBQUc7d0JBQWMsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRzt3QkFBYyxLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUNqRixPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO3dCQUFjLEtBQUssU0FBUyxHQUFHLEVBQUk7Z0JBQ2pGLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSyxTQUFTLEdBQUc7d0JBQWMsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRzt3QkFBYyxLQUFLLFNBQVMsR0FBRyxFQUFJOzs7OztZQUlyRixRQUFTLEdBQUcsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUV0RyxPQUFPLFNBQVMsS0FBSyxHQUFHLEtBQUssSUFBSTtvQkFFakMsS0FBSyxNQUFRO29CQUNiLEtBQUssS0FBSyxLQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7WUFFaEMsWUFBWSxJQUFJLElBQUksS0FBSztxQkFDekIsVUFBVSxlQUFTO1lBRW5CLE9BQU8sSUFBSSxJQUFJLEtBQUs7b0JBQ3BCLEtBQUssTUFBUTtvQkFDYixLQUFLLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO29CQUUvQixPQUFPLE9BQU8sTUFBUTtvQkFDdEIsT0FBTyxNQUFNLE1BQVE7b0JBQ3JCLE9BQU8sT0FBTyxXQUFhO29CQUMzQixPQUFPLE9BQU8sTUFBUTtvQkFDdEIsT0FBTyxNQUFNLE1BQVE7WUFFckIsUUFBUyxHQUFHLE9BQU8sV0FBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUVwRixPQUFPLFNBQVMsS0FBSyxHQUFHLEtBQUssSUFBSTtvQkFFakMsSUFBSSxJQUFJLEtBQUssbUNBQXFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7WUFJaEUsUUFBUyxHQUFHLE9BQU8sV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUV2RCxPQUFPLFNBQVMsS0FBSyxHQUFHLEtBQUssR0FBRztZQUNoQyxPQUFPLFdBQVcsS0FBSyxHQUFHLEtBQUssR0FBRztvQkFFbEMsS0FBSyxNQUFNLE9BQU8sU0FBUyxRQUFVLEdBQUcsT0FBTyxXQUFXLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRWxGLFFBQVMsR0FBRztZQUVaLE9BQU8sY0FBYyxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHO29CQUVoRCxLQUFLLE1BQU0sT0FBTyxTQUFTLFFBQVUsR0FBRyxPQUFPLFdBQVcsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7Ozs7WUFNakY7b0JBRUEsT0FBTyxjQUFjLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsS0FBTTtvQkFFdEQsSUFBSSxJQUFJLEtBQUssZUFBaUIsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFFckQsUUFBUyxRQUFRLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtvQkFFbkMsT0FBTyxjQUFjLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsS0FBTTtvQkFFdEQsSUFBSSxJQUFJLEtBQUssZUFBaUIsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFFckQsUUFBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO29CQUV2QixPQUFPLGNBQWMsS0FBSyxHQUFHLEtBQUssSUFBSSxNQUFNLEVBQUUsR0FBRyxLQUFNO29CQUV2RCxJQUFJLElBQUksS0FBSyxlQUFpQixLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7OztZQUlyRCxRQUFTLFdBQVksS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7b0JBRTdDLE9BQU8sY0FBYyxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEtBQU07b0JBRXRELElBQUksSUFBSSxLQUFLLG1CQUFxQjtZQUVsQyxRQUFTLFdBQVksS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7b0JBRTdDLE9BQU8sY0FBYyxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEtBQU07b0JBRXRELElBQUksSUFBSSxLQUFLLG1CQUFxQjtZQUVsQyxRQUFTLFdBQVksS0FBSyxLQUFLLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO29CQUVyRCxPQUFPLGNBQWMsS0FBSyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsR0FBRyxLQUFNO29CQUVyRCxJQUFJLElBQUksS0FBSyxtQkFBcUI7b0JBRWxDLE9BQU8sY0FBYyxLQUFLLEVBQUUsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEtBQU07Ozs7Ozs7b0JBTXJELEtBQUssU0FBUyxRQUFRLGFBQWEsS0FBSyxZQUFZLEdBQUcsRUFBRSxPQUFRO29CQUNqRSxLQUFLLFNBQVMsUUFBUSxhQUFhLEtBQUssWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBUSxrQkFBa0IsYUFBYTtvQkFDakgsS0FBSyxTQUFTLFFBQVEsS0FBSyxLQUFLLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU8sTUFBTTtvQkFDckUsS0FBSyxTQUFTLFFBQVEsS0FBSyxLQUFLO29CQUNoQyxLQUFLLFNBQVMsUUFBUSxLQUFLLEtBQUssWUFBWSxFQUFFLEVBQUUsTUFBTzs7OztvQkFJdkQsS0FBSyxNQUFNLEtBQUssZUFBZSxFQUFFLElBQUksS0FBSyxFQUFFLElBQUksT0FBUSxRQUFRO29CQUNoRSxLQUFLLE1BQU0sS0FBSyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFPLE1BQU0sTUFBTTtvQkFDckUsS0FBSyxNQUFNLEtBQUssVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTyxPQUFPO29CQUNwRCxLQUFLLE1BQU0sS0FBSyxNQUFNLEVBQUUsRUFBRSxNQUFPOzs7O29CQUlqQyxLQUFLLFFBQVEsS0FBSyxNQUFNLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUNqRyxLQUFLLFFBQVEsS0FBSyxTQUFTLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUMxRixLQUFLLFFBQVEsS0FBSyxPQUFPLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUM1SCxLQUFLLFFBQVEsS0FBSyxPQUFPLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUl4RyxLQUFLLFFBQVEsS0FBSyxPQUFPLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUloRyxLQUFLLFFBQVEsS0FBSyxPQUFPLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFOzs7Ozs7O1lBTWhHLFFBQVMsR0FBRyxPQUFPLFdBQ2IsUUFBUSxhQUFhLEtBQUssU0FBUyxHQUFHLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFDbkQsV0FBWSxNQUFNLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUN2QyxLQUFLLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQzdDLEtBQUssY0FBYyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQ3ZDLEtBQUssT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTztZQUc5QyxVQUFVLE9BQU8sV0FBVyxLQUFLLEdBQUcsS0FBSyxJQUFJO29CQUU3QyxJQUFJLElBQUksUUFBUSx5QkFBMEI7b0JBQzFDLElBQUksSUFBSSxRQUFRLHdCQUF5QixFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUc7b0JBQ2xFLElBQUksSUFBSSxRQUFRLHdCQUF5QixFQUFFLEdBQUc7b0JBQzlDLElBQUksSUFBSSxRQUFRLHdCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUU7b0JBQy9ELElBQUksSUFBSSxRQUFRLHdCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUc7WUFFL04sUUFBUyxHQUFHLE9BQU8sV0FDYixRQUFRLGFBQWEsS0FBSyxTQUFTLEdBQUcsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUNuRCxXQUFZLE1BQU0sT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQ3ZDLEtBQUssVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFDN0MsS0FBSyxxRUFBcUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUN4RixLQUFLLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLE9BQ2hELEtBQUsscUVBQXFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFDekYsS0FBSyxPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTztvQkFHbkQsS0FBSyxLQUFLLEdBQUcsS0FBSyxJQUFJLE1BQ3RCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkF1QkEsS0FBSyxLQUFLLEdBQUcsS0FBSyxJQUFJLE1BQ3RCOzs7Ozs7Ozs7Ozs7Ozs7b0JBa0JBLEtBQUssS0FBSyxHQUFHLEtBQUssSUFBSSxRQUFRLE9BQU8sS0FBSyxXQUMxQzs7O29CQU1BLEtBQUssS0FBSyxHQUFHLEtBQUssSUFBSSxRQUFRLE9BQU8sS0FBSyxTQUFTLFdBQVcsTUFBTSxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFDekY7OztvQkFNQSxLQUFLLEtBQUssR0FBRyxLQUFLLElBQUksUUFBUSxPQUFPLEtBQUssU0FBUyxXQUFXLE1BQU0sT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksS0FBSyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFDeEg7OztvQkFNQSxLQUFLLEtBQUssR0FBRyxLQUFLLElBQUksUUFBUSxPQUFPLEtBQUssU0FBUyxXQUFXLE1BQU0sT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksS0FBSyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQ2hJOzs7Ozs7WUFRQSxRQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBWSxLQUFLLGFBQWEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFNLE9BQU8sS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO29CQUMvRixNQUFNLEtBQUssRUFBRSxLQUFLLElBQUksS0FBSyx3QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO1lBRWpGLFFBQVMsT0FBTyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO29CQUN6RSxNQUFNLEtBQUssRUFBRSxLQUFLLEdBQUcsS0FBSyx3QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO1lBRS9ELFFBQVMsS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sV0FBWSxPQUFPLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtvQkFDckYsTUFBTSxLQUFLLEVBQUUsS0FBSyxHQUFHLEtBQUssYUFBYyxFQUFFLEVBQUU7WUFFNUMsUUFBUyxRQUFRLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFdBQVksT0FBTyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7b0JBQzNFLE1BQU0sS0FBSyxFQUFFLEtBQUssR0FBRyxLQUFLLGFBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFOzs7OztnQkFJeEQsS0FBSyxLQUFLLEVBQUUsS0FBSyxLQUFNLEtBQUssYUFBYSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBWSxPQUFPLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFTO2dCQUN6RyxLQUFLLEtBQUssRUFBRSxLQUFLLElBQU0sUUFBUSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFZLE1BQU0sT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQVc7Z0JBQ3ZHLEtBQUssS0FBSyxFQUFFLEtBQUssSUFBTSxLQUFLLE1BQU0sTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBK0M7Z0JBQ3ZHLEtBQUssS0FBSyxFQUFFLEtBQUssSUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLFdBQVksUUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBTSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFTOzs7O1FBSTdHLE9BQU8sT0FBTyxLQUFLLEVBQUUsS0FBSyxJQUFLLEdBQUcsT0FBTyxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRztnQkFFbEYsS0FBSyxLQUFPO2dCQUNaLEtBQUssSUFBSSxPQUFTO2dCQUNsQixNQUFNLEtBQUssSUFBSSxVQUFVLE9BQVM7Z0JBQ2xDLE1BQU0sS0FBSyxJQUFJLFVBQVUsR0FBRyxPQUFTLEdBQUcsRUFBRSxFQUFFO1FBRTVDLE9BQU8sT0FBTyxLQUFLLEVBQUUsS0FBSyxJQUFLLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRztnQkFFL0UsS0FBSyxLQUFPO1FBRVosT0FBTyxNQUFNLEtBQUssSUFBSTtnQkFFdEIsS0FBSyxPQUFTO2dCQUNkLEtBQUssR0FBRyxFQUFJO2dCQUNaLEtBQUssR0FBRyxFQUFJO2dCQUNaLEtBQUssR0FBRyxNQUFNLEdBQUs7UUFJbkIsT0FBTyxPQUFPLEtBQUssRUFBRSxLQUFLLElBQUssV0FBWSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU07Z0JBRTFFLEtBQUssS0FBTztnQkFDWixNQUFNLEtBQUssSUFBSSxPQUFPLE9BQVM7UUFJL0IsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLElBQUssV0FBWSxLQUFLLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU07Z0JBRWhGLEtBQUssS0FBTztRQUNaLE9BQU8sTUFBTSxLQUFLLElBQUk7Z0JBQ3RCLEtBQUssT0FBUztnQkFDZCxLQUFLLEdBQUcsRUFBSTtnQkFDWixNQUFNLEtBQUssSUFBSSxPQUFPLEdBQUcsRUFBSTtRQUU3QixPQUFPLE9BQU8sS0FBSyxFQUFFLEtBQUssSUFBSyxXQUFZLEtBQUssU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTTtnQkFFL0UsS0FBSyxLQUFPO2dCQUNaLE1BQU0sS0FBSyxJQUFJLE9BQU8sY0FBSzs7b0JBQU8sRUFBRSxFQUFFLEVBQUU7YUFBUSxFQUFFLElBQUksRUFBRTtRQUl4RCxPQUFPLE9BQU8sS0FBSyxFQUFFLEtBQUssSUFBSyxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxJQUFNLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTTtnQkFFakgsS0FBSyxLQUFPO2dCQUNaLE1BQU0sS0FBSyxJQUFJLE9BQU8sY0FBSzs7bUJBQU0sRUFBRTtZQUFNLEVBQUU7Z0JBQzNDLE1BQU0sS0FBSyxJQUFJLE9BQU8sY0FBSzs7bUJBQU0sRUFBRTtZQUFNLEVBQUU7Ozs7Z0JBTTNDLFNBQVMsS0FBSyxHQUFHLEtBQUssS0FBTSxLQUFLLElBQUksRUFBRSxFQUFFLE1BQU0sSUFBSyxJQUFJLEVBQUk7Z0JBQzVELFNBQVMsS0FBSyxHQUFHLEtBQUssS0FBTSxLQUFLLElBQUksRUFBRSxFQUFFLE1BQU0sSUFBSyxJQUFJLEVBQUk7Z0JBQzVELFNBQVMsS0FBSyxHQUFHLEtBQUssS0FBTSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLElBQUssSUFBSSxFQUFJO2dCQUNoRSxTQUFTLEtBQUssR0FBRyxLQUFLLElBQU0sS0FBSyxJQUFJLEVBQUUsRUFBRSxNQUFNLElBQUssSUFBSSxFQUFJO2dCQUM1RCxTQUFTLEtBQUssR0FBRyxLQUFLLEtBQU0sUUFBUSxJQUFJLEVBQUUsRUFBRSxNQUFNLElBQUssSUFBSSxFQUFJOzs7O2dCQU0vRCxLQUFLLEtBQUssRUFBRSxLQUFLLElBQUssV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sSUFBTSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFTOzs7O1FBSXhHLE1BQU0sb0JBQW9CO1FBRTFCLFFBQVEsT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEdBQUcsT0FBTyxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRztnQkFFcEYsRUFBRSxHQUFHLEVBQUUsR0FBSztnQkFDWixFQUFFLEdBQUcsRUFBRSxHQUFLO2dCQUNaLEVBQUUsT0FBTyxPQUFPLEVBQUUsSUFBTSxJQUFJLElBQUk7Z0JBQ2hDLEVBQUUsT0FBTyxPQUFPLEVBQUUsSUFBTSxFQUFFLEVBQUU7UUFFNUIsRUFBRSxFQUFFLGFBQWE7UUFDakIsRUFBRSxPQUFPO1FBRVQsUUFBUSxPQUFPLEtBQUssR0FBRyxLQUFLLElBQUssV0FBWSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHO2dCQUVqRixFQUFFLEdBQUcsRUFBRSxHQUFHLFNBQVMsV0FBYTtnQkFDaEMsRUFBRSxPQUFPLFFBQVEsRUFBRSxJQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7UUFJakMsTUFBTTtRQUVOLEVBQUUsTUFBTSxXQUFXLEdBQUc7UUFDdEIsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUN2QixFQUFFLE1BQU0sT0FBTztRQUNmLEVBQUU7Z0JBRUYsRUFBRSxNQUFNLGNBQWdCLEVBQUU7Z0JBQzFCLEVBQUUsR0FBRyxFQUFFLEdBQUs7Z0JBQ1osR0FBRyxtQkFBcUI7Z0JBQ3hCLEdBQUcsd0JBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFFM0MsRUFBRSxNQUFNLE9BQU87UUFDZixFQUFFO2dCQUVGLEVBQUUsTUFBTSxjQUFnQixFQUFFO2dCQUMxQixFQUFFLEdBQUcsRUFBRSxHQUFLO2dCQUNaLEdBQUcsbUJBQXFCO2dCQUN4QixHQUFHLGdCQUFrQjtRQUVyQixFQUFFLE1BQU0sV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2pDLEVBQUUsTUFBTSxhQUFhLEdBQUc7UUFDeEIsRUFBRSxNQUFNLE9BQU87Z0JBRWYsR0FBRyxtQkFBcUI7Z0JBQ3hCLEdBQUcsZ0JBQWtCO2dCQUNyQixHQUFHLGdCQUFrQjs7OztRQUlyQixNQUFNO1FBQ04sRUFBRTtRQUVGLEVBQUUsTUFBTSxXQUFXLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDdEQsRUFBRSxNQUFNLGNBQWM7UUFDdEIsRUFBRSxNQUFNLGNBQWM7UUFDdEIsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUV2QixFQUFFLElBQUksRUFBRTtnQkFBZ0IsR0FBRyx3QkFBMEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDbkUsRUFBRSxNQUFNLGNBQWdCLEVBQUU7UUFDMUIsRUFBRSxJQUFJLEVBQUU7Z0JBQWdCLEdBQUcsd0JBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbkUsRUFBRSxJQUFJLEVBQUU7Z0JBQWdCLEdBQUcsd0JBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbkUsRUFBRSxJQUFJLEVBQUU7Z0JBQWdCLEdBQUcsd0JBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7UUFJbkUsTUFBTTtRQUNOLEVBQUU7UUFDRixXQUFXLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFO1FBRXZELEVBQUUsTUFBTSxjQUFjO2dCQUN0QixHQUFHLGdCQUFrQjtRQUNyQixFQUFFO2dCQUNGLEVBQUUsR0FBRyxFQUFFLEdBQUs7UUFFWixFQUFFLE1BQU07Z0JBQ1IsR0FBRyxnQkFBa0I7Z0JBQ3JCLEVBQUUsTUFBTSxjQUFnQixFQUFFO1FBQzFCLEVBQUU7Z0JBQ0YsRUFBRSxHQUFHLEVBQUUsR0FBSztRQUVaLEVBQUUsTUFBTTtnQkFDUixHQUFHLGdCQUFrQjs7OztRQUlyQixNQUFNO1FBQ04sRUFBRTtRQUNGLFdBQVcsR0FBRyxTQUFTLEVBQUU7UUFDekIsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUV2QixFQUFFLE1BQU0sT0FBTztnQkFBTSxHQUFHLG1CQUFxQjtRQUM3QyxFQUFFLE1BQU07aUJBQWEsR0FBRyxxQkFBZTtRQUN2QyxFQUFFLE1BQU07Z0JBQWEsR0FBRyxtQkFBcUI7Ozs7UUFJN0MsTUFBTTtRQUNOLEVBQUU7UUFFRixRQUFRLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDM0MsVUFBVSxNQUFNLEVBQUU7UUFFbEIsU0FBUyxFQUFFLE1BQU0sRUFBRTtRQUNuQixFQUFFLE1BQU0sWUFBWSxNQUFNLEtBQUssR0FBRyxLQUFLLElBQUksRUFBRSxJQUFHLFFBQVEsTUFBTSxPQUFPO2dCQUNyRSxFQUFFLE1BQU0sRUFBRSxPQUFTOzs7O1FBSW5CLE1BQU07UUFFTixFQUFFLE1BQU0sV0FBVyxXQUFXLFFBQVEsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO1FBQ2hFLEVBQUUsTUFBTSxjQUFjO1FBQ3RCLEVBQUUsTUFBTSxjQUFjO1FBQ3RCLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFDdkIsRUFBRSxNQUFNLE9BQU87Z0JBRWYsR0FBRyx3QkFBMEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDM0MsR0FBRyxtQ0FBcUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7OztRQUl0RCxNQUFNO1FBQ04sRUFBRTtRQUlGLFdBQVcsV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sSUFBTSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFPLEVBQUU7Z0JBRTdGLEtBQUssSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLElBQU07Z0JBRS9CLEVBQUUsTUFBTSxpQkFBaUIsRUFBRSxLQUFPLEVBQUU7Z0JBQ3BDLEVBQUUsTUFBTSxpQkFBaUIsRUFBRSxLQUFPLEVBQUU7Z0JBQ3BDLEVBQUUsTUFBTSxpQkFBaUIsRUFBRSxLQUFPLEdBQUc7Z0JBQ3JDLEVBQUUsTUFBTSxpQkFBaUIsRUFBRSxLQUFPLEVBQUU7Z0JBQ3BDLEVBQUUsTUFBTSxpQkFBaUIsRUFBRSxLQUFPLEVBQUU7Z0JBQ3BDLEVBQUUsTUFBTSxpQkFBaUIsR0FBRyxLQUFPLEVBQUU7Z0JBSXJDLEVBQUUsTUFBTSxpQkFBaUIsRUFBRSxLQUFPLEVBQUU7Z0JBQ3BDLEVBQUUsTUFBTSxpQkFBaUIsRUFBRSxLQUFPLEVBQUU7UUFJcEMsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUN2QixFQUFFLE1BQU0sT0FBTztnQkFFZixHQUFHLG1CQUFxQjtpQkFDeEIsR0FBRyxzQkFBSCxHQUFHLFlBQWEsb0JBQVM7Z0JBQ3pCLEVBQUUsTUFBTSxjQUFnQixFQUFFO1FBSTFCLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFDdkIsRUFBRSxNQUFNLE9BQU87Z0JBRWYsR0FBRyxtQkFBcUI7Z0JBQ3hCLEVBQUUsTUFBTSxjQUFnQixFQUFFO1FBSTFCLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFDdkIsRUFBRSxJQUFJLEVBQUU7Z0JBRVIsR0FBRyxnQkFBa0I7Z0JBQ3JCLEVBQUUsTUFBTSxjQUFnQixFQUFFOzs7O1FBSTFCLE1BQU0seUJBQXlCO1FBQy9CLEVBQUU7UUFFRixXQUFXLFdBQVksS0FBSyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTyxFQUFFO1FBRTFELEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFFdkIsRUFBRSxJQUFJLEVBQUU7Z0JBRVIsR0FBRyxvQkFBc0I7Z0JBQ3pCLEdBQUcsZ0JBQWtCO2dCQUNyQixFQUFFLE1BQU0sY0FBZ0IsRUFBRTtnQkFDMUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxpQkFBUTs7bUJBQU0sRUFBRSxNQUFNLE9BQU0sSUFBSTtXQUFZLE9BQVM7Z0JBQ25FLEVBQUUsTUFBTSxFQUFFLElBQUksaUJBQVE7O21CQUFNLEVBQUUsTUFBTSxPQUFNLElBQUk7V0FBTyxPQUFTO1FBRTlELEVBQUUsSUFBSSxFQUFFO2dCQUVSLEdBQUcsb0JBQXNCO2dCQUN6QixHQUFHLGdCQUFrQjtnQkFDckIsRUFBRSxNQUFNLGNBQWdCLEVBQUU7UUFFMUIsRUFBRSxJQUFJLEVBQUU7Z0JBRVIsR0FBRyxvQkFBc0I7Z0JBQ3pCLEdBQUcsZ0JBQWtCO1FBRXJCLEVBQUUsSUFBSSxFQUFFO2lCQUVSLEdBQUcsNkJBQXVCO2dCQUMxQixHQUFHLGdCQUFrQjtnQkFDckIsRUFBRSxNQUFNLGNBQWdCLEVBQUU7UUFFMUIsRUFBRSxNQUFNO2dCQUNSLEdBQUcsb0JBQXNCO1FBSXpCLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDbkIsRUFBRSxJQUFJLEVBQUU7Z0JBQ1IsRUFBRSxNQUFNLEVBQUUsSUFBTTs7OztRQUloQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUVGLFFBQVEsV0FBWSxLQUFLLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sSUFBTSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUV0RixFQUFFLE1BQU0sYUFBYSxLQUFLLEdBQUc7UUFDN0IsRUFBRSxNQUFNLFlBQVksTUFBTSxLQUFLLEdBQUcsS0FBSyxJQUFJLEVBQUUsSUFBRyxRQUFRLE1BQU0sT0FBTztnQkFJckUsS0FBSyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sSUFBSSxVQUFZO2dCQUN6QyxLQUFLLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFJLFVBQVk7UUFFekMsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUN2QixFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUMzQyxFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUMzQyxFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUMzQyxFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUMzQyxFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUMzQyxFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUMzQyxFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUMzQyxFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUkzQyxFQUFFLE1BQU0sYUFBYSxFQUFFO1FBQ3ZCLEVBQUUsSUFBSSxFQUFFO2dCQUFTLEVBQUUsTUFBTSxjQUFnQixFQUFFO1FBSTNDLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFDdkIsRUFBRSxJQUFJLEVBQUU7Z0JBQVMsRUFBRSxNQUFNLGNBQWdCLEVBQUU7UUFFM0MsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUN2QixFQUFFLElBQUksRUFBRTtnQkFBUyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUUzQyxFQUFFLE1BQU0sYUFBYSxFQUFFO2dCQUN2QixFQUFFLE1BQU0sZ0JBQWdCLEVBQUUsTUFBTSxlQUFpQixFQUFFO1FBQ25ELEVBQUUsSUFBSSxFQUFFO2dCQUFTLEVBQUUsTUFBTSxjQUFnQixFQUFFO1FBSTNDLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFDdkIsRUFBRSxNQUFNLFlBQVksUUFBTyxNQUFNO2dCQUNqQyxFQUFFLE1BQU0sY0FBZ0IsRUFBRTs7OztRQUkxQixPQUFPLHlCQUFQLE9BQU8sbUNBQWU7O21CQUFRO1dBQU07O1FBRXBDLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFdBQVcsRUFBRSxPQUFPO1FBQzVCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUVoQixRQUFRLFdBQVksS0FBSyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLElBQU0sS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFFdEYsRUFBRSxNQUFNLGFBQWEsS0FBSyxHQUFHO1FBQzdCLEVBQUUsTUFBTSxZQUFZLE1BQU0sS0FBSyxHQUFHLEtBQUssSUFBSSxFQUFFLElBQUcsUUFBUSxNQUFNLE9BQU87UUFFckUsa0JBQVMsR0FBRTs7bUJBQU0sRUFBRSxTQUFRLEtBQUssUUFBUSxNQUFNLElBQUUsRUFBRSxNQUFNLEVBQUUsSUFBRSxFQUFFLE1BQU0sR0FBRyxPQUFPLE9BQU8sTUFBTTs7UUFJM0YsTUFBTSxFQUFFO2dCQUFJLEVBQUUsTUFBTSxjQUFnQixFQUFFO1FBQ3RDLE1BQU0sRUFBRTtnQkFBSSxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUN0QyxNQUFNLEVBQUU7Z0JBQUksRUFBRSxNQUFNLGNBQWdCLEVBQUU7UUFDdEMsTUFBTSxFQUFFO2dCQUFJLEVBQUUsTUFBTSxjQUFnQixFQUFFO1FBQ3RDLE1BQU0sRUFBRTtnQkFBSSxFQUFFLE1BQU0sY0FBZ0IsRUFBRTtRQUl0QyxLQUFLLEtBQUssY0FBYyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUN0QyxFQUFFLE1BQU0sVUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2xDLE1BQU0sRUFBRTtnQkFDUixFQUFFLE1BQU0sVUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
