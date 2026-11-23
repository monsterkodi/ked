var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var absol, absrect, areas, bands, before, board, cells, click, cmd, container, data, desue, dmp, e, h, i, key, layouts, loadSheet, mc, node, order, page, rect, regions, res, rgns, rt, runs, savedCopy, savedPaste, se, sheet, showSue, size, text, titles, tree, undo, _1050_105_, _253_68_, _254_68_, _279_62_, _284_62_, _318_22_, _388_63_, _673_57_, _679_65_, _688_74_, _721_54_, _743_50_, _771_22_, _819_30_, _963_78_, _969_70_, _984_42_

import sds from "../../kxk/sds.js"
import noon from "../../kxk/noon.js"
import clip from "../../kxk/clip.js"

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import sue from "../edit/tool/sue.js"

import layout from "../popo/layout.js"
import fill from "../popo/fill.js"

import editor from "../edit/editor.js"

import fileeditor from "../view/editor/fileeditor.js"

import sheeditor from "../view/colmns/sheeditor.js"

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

sheet = function (name, features = [], rows = 4, cls = editor)
{
    var _20_23_

    global.ked_session = ((_20_23_=global.ked_session) != null ? _20_23_ : {get:(function ()
    {
        return null
    }),set:(function ()
    {})})
    h = new harness({cols:32,rows:rows})
    e = new cls(h.screen,name,features)
    e.layout(0,0,16,rows)
    e.layout(0,0,32 - e.cells.cols,rows)
    return e.state.loadLines(Array(rows).fill(' '.repeat(16)))
}

rt = function (path)
{
    return sds.get(e.state.rectree,path)
}

mc = function ()
{
    return e.state.mainCursor()
}

key = function (combo)
{
    return h.key(e,combo)
}

click = function (x, y)
{
    return e.onMouse({type:'press',cell:[x + e.cells.x,y + e.cells.y],button:'left',count:1})
}

loadSheet = function (tree, cursor = [0,0])
{
    e.state.setSheetTree(tree)
    e.state.renderSheet(e.state.rectree,e.state.sheetSize(),cursor,{history:false,silent:true})
    return e.state.clearHistory()
}

bands = function ()
{
    return {children:[{text:'abcdef',x:2,y:1,w:8,h:4,scale:2},{text:'xy',x:2,y:6,w:4,h:1}]}
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
            await section("limits", async function ()
            {
                cells = {cols:20,rows:10}
                node = function (tree)
                {
                    return tree.children[0]
                }
                size = function (tree, dir)
                {
                    layout.resizeNode(cells,tree,node(tree),dir)
                    return node(tree).rect.abs
                }
                tree = absol(cells,{children:[{text:'a',x:2,y:2,w:1,h:1}]})
                compare((layout.resizeNode(cells,tree,node(tree),'less cols') != null),false)
                compare((layout.resizeNode(cells,tree,node(tree),'less rows') != null),false)
                compare(node(tree).rect.abs,{x:2,y:2,w:1,h:1})
                tree = absol(cells,{children:[{text:'a',x:2,y:2,r:2,h:1}]})
                compare(size(tree,'more cols').w,17)
                compare(node(tree).r,1)
                compare(size(tree,'less cols').w,16)
                compare(node(tree).r,2)
                tree = absol(cells,{children:[{text:'a',x:2,y:2,r:2,b:2}]})
                compare(size(tree,'more rows').h,7)
                compare(node(tree).b,1)
                tree = absol(cells,{x:4,y:2,w:10,h:6,children:[{x:2,y:1,w:3,h:2}]})
                for (i = 0; i < 9; i++)
                {
                    size(tree,'more cols')
                }
                compare(node(tree).w,8)
                for (i = 0; i < 9; i++)
                {
                    size(tree,'more rows')
                }
                compare(node(tree).h,5)
            })
            await section("scaled", async function ()
            {
                cells = {cols:20,rows:10}
                tree = absol(cells,{children:[{text:'ab',x:0,y:0,w:4,h:4,scale:2}]})
                node = tree.children[0]
                layout.resizeNode(cells,tree,node,'more rows')
                compare(node.rect.abs.h,6)
                layout.resizeNode(cells,tree,node,'less rows')
                compare(node.rect.abs.h,4)
                layout.resizeNode(cells,tree,node,'less rows')
                compare(node.rect.abs.h,2)
                compare((layout.resizeNode(cells,tree,node,'less rows') != null),false)
                compare(node.rect.abs.h,2)
                layout.resizeNode(cells,tree,node,'more cols')
                compare(node.rect.abs.w,6)
                layout.resizeNode(cells,tree,node,'less cols')
                compare(node.rect.abs.w,4)
                layout.resizeNode(cells,tree,node,'less cols')
                compare(node.rect.abs.w,2)
                compare((layout.resizeNode(cells,tree,node,'less cols') != null),false)
            })
        })
        await section("titlify", async function ()
        {
            tree = {bg:'#000',x:2,y:2,w:20,h:10,children:[{x:3,y:2,w:10,h:5,children:[{text:'hi',x:1,y:1,w:3,h:1}]}]}
            layout.titlify({cols:30,rows:20},layout.pageOf(tree))
            compare(tree.title,'  bg')
            compare(tree.rect.abs,{x:2,y:2,w:20,h:10})
            container = sds.get(tree,'children.0')
            compare(container.title,'    box')
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
            page = {children:[{x:1,y:1,w:4,h:2},{x:6,y:1,w:4,h:2,children:[{x:0,y:0,w:1,h:1}]}]}
            layout.titlify({cols:30,rows:20},page)
            compare((page.title != null),false)
            compare(sds.get(page,'children.0.title'),'  rect')
            compare(sds.get(page,'children.1.title'),'  box')
            compare(sds.get(page,'children.1.children.0.title'),'    rect')
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
    await section("pageOf", async function ()
    {
        compare(layout.pageOf({bg:'#333',children:[{text:'a'}]}),{children:[{bg:'#333',children:[{text:'a'}]}]})
        compare(layout.pageOf({x:1}),{children:[{x:1}]})
        page = {children:[{text:'a'}]}
        compare(layout.pageOf(page) === page,true)
        compare(layout.pageOf({}),{})
    })
    await section("insertTextAt", async function ()
    {
        await section("creates a text node", async function ()
        {
            tree = {}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[3,2],'a').offset,1)
            compare(sds.get(tree,'children.0'),{text:'a',x:3,y:2,w:2,h:1})
            tree = {pattern:'x',x:1,y:1,w:6,h:3}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[3,2],'a').offset,1)
            compare(sds.get(tree,'children.0'),{text:'a',x:2,y:1,w:2,h:1})
            tree = {x:2,y:2,w:4,h:2}
            compare(layout.insertTextAt({cols:10,rows:10},tree,[8,8],'a').node.text,'a')
            compare(sds.get(tree,'children.0'),{text:'a',x:6,y:6,w:2,h:1})
        })
        await section("inserts into a text node", async function ()
        {
            tree = {children:[{text:'ab',x:1,y:1,w:6,h:2}]}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[2,1],'X').offset,2)
            compare(sds.get(tree,'children.0.text'),'aXb')
            tree = {children:[{text:'ab',x:1,y:1,w:6,h:2}]}
            compare(layout.insertTextAt({cols:10,rows:5},tree,[6,1],'Z').offset,3)
            compare(sds.get(tree,'children.0.text'),'abZ')
            tree = {children:[{text:'ab',scale:2,x:0,y:0,w:8,h:2}]}
            compare(layout.insertTextAt({cols:8,rows:2},tree,[4,0],'X').offset,3)
            compare(sds.get(tree,'children.0.text'),'abX')
            compare((layout.insertTextAt({cols:8,rows:2},null,[0,0],'X') != null),false)
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
        compare(data.text,'            \nab cd ')
        runs = areas(data,sue.SCALE)
        compare(runs.length,1)
        compare(runs[0].x,0)
        compare(areas(data,sue.CLOSE)[0].x,6)
        data = desue({cols:6,rows:4},{children:[{text:'abcdef',x:0,y:0,w:6,h:4,scale:2}]})
        compare(data.text,'      \nabc\n      \ndef')
        compare(areas(data,sue.SCALE).map(function (a)
        {
            return [a.x,a.y]
        }),[[0,1],[0,3]])
        data = desue({cols:8,rows:4},{children:[{text:'ab',x:0,y:0,w:8,h:4,scale:2}]})
        compare(data.text,'        \nab  \n        \n    ')
        compare(areas(data,sue.SCALE).map(function (a)
        {
            return [a.x,a.y]
        }),[[0,1],[0,3]])
        compare(areas(data,sue.CLOSE).map(function (a)
        {
            return [a.x,a.y]
        }),[[4,1],[4,3]])
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
        compare(h.screen.text().slice(1, 4),[' A··',' ···',' ···'])
        compare(h.screen.textMarked()[1],' A··')
    })
    await section("sheet typing", async function ()
    {
        sheet('popo_sheet_typing')
        loadSheet({})
        e.state.setCursors([[2,1]])
        e.state.insert('a')
        e.draw()
        compare(mc(),[3,1])
        compare(h.at(2,1),'a')
        compare(rt('children.0.text'),'a')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:2,h:1})
        e.state.insert('b')
        e.draw()
        compare(mc(),[4,1])
        compare(h.at(3,1),'b')
        compare(rt('children.0.text'),'ab')
        compare(rt('children.0.w'),3)
        loadSheet({children:[{x:2,y:1,w:6,h:2}]})
        e.state.setCursors([[5,2]])
        e.state.insert('c')
        compare(layout.plainNode(rt('children.0.children.0')),{text:'c',x:3,y:1,w:2,h:1})
    })
    await section("sheet move keys", async function ()
    {
        sheet('popo_sheet_move')
        e.grabFocus()
        loadSheet({children:[{text:'a',x:2,y:1,w:3,h:2}]},[3,1])
        h.key(e,'shift+alt+l')
        compare(rt('children.0.rect.abs'),{x:3,y:1,w:3,h:2})
        compare(e.state.mainCursor(),[4,1])
        h.key(e,'shift+alt+j')
        compare(rt('children.0.rect.abs'),{x:3,y:2,w:3,h:2})
        h.key(e,'shift+alt+k')
        compare(rt('children.0.rect.abs'),{x:3,y:1,w:3,h:2})
        h.key(e,'shift+alt+h')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:3,h:2})
        key("ctrl+alt+'")
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:3,h:3})
        key('ctrl+alt+/')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:3,h:2})
        key('ctrl+alt+/')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:3,h:1})
        key('ctrl+alt+/')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:3,h:1})
        key('ctrl+alt+,')
        key('ctrl+alt+,')
        key('ctrl+alt+,')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:1,h:1})
        key('ctrl+alt+.')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:2,h:1})
        loadSheet({children:[{text:'ab',x:2,y:0,w:4,h:2,scale:2}]})
        e.state.setCursors([[2,1]])
        key("ctrl+alt+'")
        compare(rt('children.0.h'),4)
        compare(rt('children.0.rect.abs.h'),4)
        key('ctrl+alt+/')
        compare(rt('children.0.h'),2)
        key('ctrl+alt+/')
        compare(rt('children.0.h'),2)
        loadSheet({children:[{text:'a',x:2,y:1,w:3,h:2,children:[{text:'b',x:1,y:0,w:1,h:1}]},{text:'c',x:8,y:0,w:2,h:1}]})
        e.state.setCursors([[3,1]])
        key('ctrl+alt+delete')
        compare((rt('children.0.children') != null),false)
        compare(rt('children.0.text'),'a')
        key('ctrl+alt+entf')
        compare(rt('children.0.text'),'c')
        compare(rt('children').length,1)
        e.state.setCursors([[12,3]])
        key('ctrl+alt+delete')
        compare(rt('children').length,1)
        e.state.deleteSheetNode(rt('children.0'))
        compare((rt('children') != null),false)
        e.state.undo()
        compare(rt('children.0.text'),'c')
        se = new sheeditor(h.screen,e,'popo_sheeditor')
        se.show()
        se.layout(0,0,16,4)
        se.sheetree.reloadTree()
        se.sheetree.select(0)
        compare(se.sheetree.current().text,'c')
        se.onKey('ctrl+alt+entf',h.event('ctrl+alt+entf'))
        compare((rt('children') != null),false)
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
        rt('children.0').w = 5
        e.state.commitSheet()
        compare(rt('children.0.rect.abs.w'),5)
        e.state.undo()
        compare(rt('children.0.w'),3)
        compare(rt('children.0.rect.abs.w'),3)
    })
    await section("sheet text undo", async function ()
    {
        sheet('popo_sheet_text_undo')
        e.grabFocus()
        loadSheet({bg:'#000'},[2,1])
        e.state.setCursors([[2,1]])
        e.state.insert('a')
        compare(rt('children.0.children.0.text'),'a')
        e.state.undo()
        compare((rt('children.0.children') != null),false)
        e.state.redo()
        compare(rt('children.0.children.0.text'),'a')
    })
    await section("sheet resize", async function ()
    {
        sheet('popo_sheet_resize')
        loadSheet({children:[{pattern:'x',x:'50%',y:0,w:'50%',h:2}]},[9,0])
        compare(rt('children.0.rect.abs'),{x:8,y:0,w:8,h:2})
        before = e.state.h.length
        e.layout(0,0,10,4)
        compare(rt('children.0.rect.abs'),{x:5,y:0,w:5,h:2})
        compare(kseg.str(e.state.s.lines[0]),'     xxxxx')
        compare(e.state.h.length,before)
        e.state.setCursors([[6,0]])
        e.state.insert('a')
        compare(rt('children.0.children.0.rect.abs'),{x:6,y:0,w:2,h:1})
        e.layout(0,0,16,4)
        compare(rt('children.0.children.0.rect.abs'),{x:9,y:0,w:2,h:1})
        e.state.undo()
        compare((rt('children.0.children') != null),false)
        compare(kseg.str(e.state.s.lines[0]),'        xxxxxxxx')
        e.layout(0,0,12,4)
        e.state.redo()
        compare(rt('children.0.children.0.text'),'a')
        compare(e.state.s.lines[0].length,12)
    })
    await section("sheet cells and cursors", async function ()
    {
        sheet('popo_sheet_cells')
        e.grabFocus()
        loadSheet({children:[{text:'AB',x:1,y:0,w:6,h:2,scale:2},{text:'z',x:9,y:1,w:2,h:1}]},[0,0])
        compare(kseg.str(e.state.s.lines[1]),' AB   z      ')
        compare(e.state.sheetCellForPos([6,1]),[9,1])
        compare(e.state.sheetCellForPos([2,1]),[3,1])
        compare(e.state.sheetCellForPos([8,1]),[11,1])
        compare(e.state.sheetPosForCell([9,1]),[6,1])
        compare(e.state.sheetPosForCell([4,1]),[2,1])
        compare(e.state.sheetPosForCell([11,1]),[8,1])
        compare(e.state.sheetPosForCell([3,0]),[2,1])
        compare(e.state.sheetPosForCell([8,0]),[8,0])
        e.state.setCursors([[7,1]])
        e.state.insert('y')
        compare(rt('children.1.text'),'zy')
        compare((rt('children') != null ? rt('children').length : undefined),2)
        compare(e.state.mainCursor(),[8,1])
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
        compare(rt('children.0.w'),24)
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
        compare(rt('children.0.w'),36)
        compare(e.state.mainCursor(),[2,2])
        h.key(e,'shift+alt+-')
        compare(rt('children.0.scale'),2)
        compare(rt('children.0.h'),2)
        compare(rt('children.0.w'),24)
        h.key(e,'shift+alt+0')
        compare((rt('children.0.scale') != null),false)
        compare(rt('children.0.h'),1)
        compare(rt('children.0.w'),12)
        compare(e.state.mainCursor(),[2,0])
        e.state.undo()
        compare(rt('children.0.scale'),2)
        compare(rt('children.0.w'),24)
        loadSheet({children:[{text:'abcdef',x:1,y:0,w:3,h:2},{text:'p',x:'50%',w:'25%',y:2,h:1}]})
        e.state.setCursors([[1,0]])
        key('shift+alt+=')
        compare(rt('children.0.w'),6)
        compare(rt('children.0.h'),4)
        key('shift+alt+-')
        compare(rt('children.0.w'),3)
        compare(rt('children.0.h'),2)
        e.state.setCursors([[9,2]])
        key('shift+alt+=')
        compare(rt('children.1.w'),'25%')
        compare(rt('children.1.scale'),2)
        before = e.state.s.sue
        h.key(e,'shift+alt+b')
        compare(e.state.s.sue,before)
    })
    await section("sheet cursor", async function ()
    {
        sheet('popo_sheet_updown',[],8)
        e.grabFocus()
        loadSheet(bands())
        compare(kseg.str(e.state.s.lines[2]).trimEnd(),'  abcd')
        compare(kseg.str(e.state.s.lines[4]).trimEnd(),'  ef')
        e.state.setCursors([[2,0]])
        key('down')
        compare(mc(),[2,2])
        key('down')
        compare(mc(),[2,4])
        key('down')
        compare(mc(),[2,5])
        key('down')
        compare(mc(),[2,6])
        key('up')
        compare(mc(),[2,5])
        key('up')
        compare(mc(),[2,4])
        key('up')
        compare(mc(),[2,2])
        key('up')
        compare(mc(),[2,0])
        e.state.setCursors([[3,0]])
        key('down')
        compare(mc(),[2,2])
        e.state.setCursors([[7,3]])
        key('down')
        compare(mc(),[7,5])
        e.state.setCursors([[7,3]])
        key('up')
        compare(mc(),[4,2])
        e.state.setCursors([[5,4]])
        key('up')
        compare(mc(),[5,2])
        e.state.setCursors([[4,4]])
        key('right')
        compare(e.state.sheetCellForPos(mc()),[8,4])
        e.state.setCursors([[2,0]])
        e.state.moveCursors('down',{count:2})
        compare(mc(),[2,4])
        e.state.setCursors([[0,2]])
        key('right')
        compare(mc(),[1,2])
        key('right')
        compare(mc(),[2,2])
        key('right')
        compare(mc(),[3,2])
        key('left')
        compare(mc(),[2,2])
        key('left')
        compare(mc(),[1,2])
        key('left')
        compare(mc(),[0,2])
        key('left')
        compare(mc(),[0,2])
        e.state.setCursors([[5,2]])
        key('right')
        compare(mc(),[6,2])
        key('left')
        compare(mc(),[5,2])
        e.state.setCursors([[1,3]])
        key('right')
        compare(mc(),[2,4])
        key('left')
        compare(mc(),[1,4])
        e.state.setCursors([[15,0]])
        key('right')
        compare(mc(),[16,0])
        key('right')
        compare(mc(),[16,0])
        e.state.setCursors([[0,2]])
        key('alt+right')
        compare(mc(),[2,2])
    })
    await section("sheet editing", async function ()
    {
        sheet('popo_sheet_editing')
        e.grabFocus()
        loadSheet({children:[{text:'abcdef',x:2,y:1,w:3,h:3}]})
        e.state.setCursors([[2,1]])
        key('delete')
        compare(rt('children.0.text'),'abcdef')
        compare(mc(),[2,1])
        e.state.setCursors([[3,1]])
        key('delete')
        compare(rt('children.0.text'),'bcdef')
        compare(mc(),[2,1])
        e.state.setCursors([[2,2]])
        key('delete')
        compare(rt('children.0.text'),'bcef')
        compare(mc(),[4,1])
        e.state.setCursors([[3,2]])
        key('delete')
        compare(rt('children.0.text'),'bce')
        compare(mc(),[2,2])
        key('delete')
        compare(rt('children.0.text'),'bc')
        compare(mc(),[4,1])
        e.state.setCursors([[10,3]])
        key('delete')
        compare(rt('children.0.text'),'bc')
        compare(mc(),[10,3])
        e.state.undo()
        compare(rt('children.0.text'),'bce')
        loadSheet({children:[{text:'ab\ncd',x:2,y:1,w:4,h:2}]})
        e.state.setCursors([[2,2]])
        key('delete')
        compare(rt('children.0.text'),'abcd')
        compare(mc(),[4,1])
        loadSheet({children:[{text:'abcd',x:2,y:0,w:4,h:4,scale:2}]})
        e.state.setCursors([[2,3]])
        key('delete')
        compare(rt('children.0.text'),'acd')
        compare(mc(),[3,1])
        loadSheet({children:[{text:'ab',x:2,y:1,w:3,h:2}]})
        e.state.setCursors([[4,1]])
        e.state.insert('c')
        compare(rt('children.0.text'),'abc')
        compare(mc(),[2,2])
        e.state.insert('d')
        compare(rt('children.0.text'),'abcd')
        compare(mc(),[3,2])
        e.state.setCursors([[3,1]])
        e.state.insert('X')
        compare(rt('children.0.text'),'aXbcd')
        compare(mc(),[4,1])
        e.state.insert('Y')
        compare(rt('children.0.text'),'aXYbcd')
        compare(mc(),[2,2])
        loadSheet({children:[{text:'ab',x:2,y:1,w:2,h:1}]})
        e.state.setCursors([[4,1]])
        e.state.insert('c')
        compare(rt('children.0.text'),'abc')
        compare(rt('children').length,1)
        loadSheet({children:[{text:'ab',x:2,y:0,w:6,h:4,scale:2}]})
        e.state.setCursors([[4,1]])
        e.state.insert('c')
        compare(rt('children.0.text'),'abc')
        compare(mc(),[2,3])
    })
    await section("sheet clicks", async function ()
    {
        sheet('popo_sheet_click',[],8,fileeditor)
        loadSheet(bands())
        click(5,2)
        compare(mc(),[3,2])
        click(5,1)
        compare(mc(),[3,2])
        click(8,3)
        compare(mc(),[5,4])
        click(3,6)
        compare(mc(),[3,6])
        click(3,5)
        compare(mc(),[3,5])
        post.emit('cells.rect',{x:2,y:1,w:8,h:4})
        click(4,2)
        compare(e.cells.cellRect,{x:2,y:1,w:8,h:4})
        se = new sheeditor(h.screen,e,'popo_sheeditor_jump')
        se.show()
        se.layout(0,0,16,8)
        loadSheet({children:[{text:'abc',x:2,y:1,w:6,h:2},{text:'z',x:10,y:0,w:2,h:1}]})
        se.sheetree.reloadTree()
        e.state.setCursors([[4,2]])
        se.sheetree.select(0)
        se.sheetree.jumpTo(se.sheetree.current())
        compare(mc(),[4,2])
        se.sheetree.select(1)
        se.sheetree.jumpTo(se.sheetree.current())
        compare(mc(),[10,0])
        se.sheetree.select(0)
        se.sheetree.jumpTo(se.sheetree.current())
        compare(mc(),[2,1])
        loadSheet({children:[{text:'abc',x:2,y:1,w:6,h:2},{text:'z',x:10,y:0,w:2,h:1},{text:'q',x:10,y:4,w:2,h:1}]})
        se.sheetree.reloadTree()
        se.sheetree.grabFocus()
        se.sheetree.select(0)
        se.onKey('down',h.event('down'))
        compare(mc(),[10,0])
        se.onKey('delete',h.event('delete'))
        compare(rt('children').length,2)
        compare(se.sheetree.current().text,'q')
        compare(mc(),[10,4])
        se.onKey('entf',h.event('entf'))
        compare(rt('children').length,1)
        compare(se.sheetree.current().text,'abc')
        compare(mc(),[2,1])
        se.onKey('ctrl+alt+delete',h.event('ctrl+alt+delete'))
        compare((rt('children') != null),false)
        se.sheetree.grabFocus()
        se.onKey('cmd+z',h.event('cmd+z'))
        compare(rt('children.0.text'),'abc')
        se.onKey('ctrl+z',h.event('ctrl+z'))
        compare(rt('children').length,2)
        se.onKey('shift+cmd+z',h.event('shift+cmd+z'))
        compare(rt('children').length,1)
        se.onKey('ctrl+y',h.event('ctrl+y'))
        compare((rt('children') != null),false)
        undo = function ()
        {
            return se.onKey('cmd+z',h.event('cmd+z'))
        }
        loadSheet({children:[{text:'abc',x:2,y:1,w:6,h:2},{text:'z',x:10,y:0,w:2,h:1},{text:'q',x:10,y:4,w:2,h:1}]})
        se.sheetree.reloadTree()
        se.sheetree.grabFocus()
        se.sheetree.select(1)
        se.onKey('delete',h.event('delete'))
        compare(se.sheetree.current().text,'q')
        undo()
        compare(rt('children').length,3)
        compare(se.sheetree.current().text,'q')
        compare(se.sheetree.currentIndex(),2)
        loadSheet({children:[{pattern:'.',x:0,y:0,w:8,h:3}]})
        se.sheetree.reloadTree()
        e.state.setCursors([[2,1]])
        e.state.insert('x')
        se.sheetree.select(1)
        compare(se.sheetree.current().text,'x')
        undo()
        compare((rt('children.0.children') != null),false)
        compare(se.sheetree.current().pattern,'.')
        board = ''
        savedCopy = clip.copy
        savedPaste = clip.paste
        clip.copy = function (text)
        {
            return board = text
        }
        clip.paste = function ()
        {
            return board
        }
        cmd = function (combo)
        {
            return se.onKey(combo,h.event(combo))
        }
        loadSheet({children:[{text:'abc',x:2,y:1,w:6,h:2},{text:'z',x:10,y:0,w:2,h:1,children:[{bg:'#f00',x:0,y:0,w:1,h:1}]}]})
        se.sheetree.reloadTree()
        se.sheetree.grabFocus()
        se.sheetree.select(1)
        cmd('ctrl+c')
        compare(JSON.parse(board),{text:'z',x:10,y:0,w:2,h:1,children:[{bg:'#f00',x:0,y:0,w:1,h:1}]})
        se.sheetree.select(0)
        cmd('cmd+v')
        compare(rt('children').length,2)
        compare(rt('children.0.children.0.text'),'z')
        compare(rt('children.0.children.0.children.0.bg'),'#f00')
        compare(se.sheetree.current() === rt('children.0.children.0'),true)
        se.sheetree.select(0)
        cmd('cmd+x')
        compare(rt('children').length,1)
        compare(JSON.parse(board).text,'abc')
        compare(se.sheetree.current().text,'z')
        cmd('ctrl+v')
        compare(rt('children').length,1)
        compare(rt('children.0.children.1.text'),'abc')
        compare(rt('children.0.children.1.children.0.text'),'z')
        var list = ['hello','{"foo":1}','[1]','{}','{"children":[{"x":"1","nope":2}]}']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            text = list[_a_]
            board = text
            cmd('cmd+v')
            compare(rt('children.0.children').length,2)
        }
        undo()
        compare(rt('children.0.children').length,1)
        clip.copy = savedCopy
        clip.paste = savedPaste
        order = function ()
        {
            return se.sheetree.fuzzied.map(function (n)
            {
                return n.text
            })
        }
        rect = function (text)
        {
            return se.sheetree.fuzzied.find(function (n)
            {
                return n.text === text
            }).rect.abs
        }
        loadSheet({children:[{text:'a',x:0,y:0,w:2,h:1},{text:'b',x:4,y:1,w:8,h:4,children:[{text:'c',x:1,y:1,w:2,h:1},{text:'e',x:'50%',y:2,r:1,b:1}]},{text:'d',x:14,y:0,w:2,h:1}]})
        se.sheetree.reloadTree()
        se.sheetree.grabFocus()
        se.sheetree.select(0)
        cmd('alt+down')
        compare(order(),['b','a','c','e','d'])
        compare(rt('children.0.children.0.text'),'a')
        compare(rt('children.0.children.0.x'),-4)
        cmd('alt+down')
        compare(order(),['b','c','a','e','d'])
        cmd('alt+down')
        compare(order(),['b','c','e','a','d'])
        cmd('alt+down')
        compare(order(),['b','c','e','a','d'])
        compare(rt('children.1.text'),'a')
        compare(rect('a'),{x:0,y:0,w:2,h:1})
        cmd('alt+down')
        compare(order(),['b','c','e','d','a'])
        cmd('alt+down')
        compare(order(),['b','c','e','d','a'])
        cmd('alt+up')
        compare(order(),['b','c','e','a','d'])
        cmd('alt+up')
        compare(order(),['b','c','e','a','d'])
        compare(rt('children.0.children.2.text'),'a')
        cmd('alt+up')
        compare(order(),['b','c','a','e','d'])
        compare(se.sheetree.current().text,'a')
        se.sheetree.select(1)
        compare(rect('c'),{x:5,y:2,w:2,h:1})
        cmd('alt+up')
        compare(order(),['c','b','a','e','d'])
        compare(rect('c'),{x:5,y:2,w:2,h:1})
        se.sheetree.select(3)
        compare(rect('e'),{x:8,y:3,w:3,h:1})
        cmd('alt+down')
        compare(order(),['c','b','a','e','d'])
        compare(rt('children.2.text'),'e')
        compare(rect('e'),{x:8,y:3,w:3,h:1})
        undo()
        compare(rt('children.1.children.1.text'),'e')
        loadSheet({bg:'#333',children:[{text:'c',x:1,y:1,w:2,h:1}]})
        se.sheetree.reloadTree()
        se.sheetree.grabFocus()
        layouts = function ()
        {
            return se.sheetree.fuzzied.map(function (n)
            {
                var _1046_59_

                return ((_1046_59_=n.text) != null ? _1046_59_ : n.bg)
            })
        }
        compare(layouts(),['#333','c'])
        se.sheetree.select(1)
        cmd('alt+up')
        compare(layouts(),['c','#333'])
        compare(rt('children.0.text'),'c')
        compare((rt('children.1.children') != null),false)
        cmd('alt+up')
        compare(layouts(),['c','#333'])
        se.sheetree.select(1)
        cmd('delete')
        compare(layouts(),['c'])
        compare(noon.parse(layout.sourceOf(e.state.rectree)),{children:[{text:'c',x:1,y:1,w:2,h:1}]})
        loadSheet({children:[{x:1,y:1,w:6,h:3,children:[{text:'t',x:2,y:1,w:2,h:1}]},{text:'z',x:10,y:0,w:2,h:1}]})
        se.sheetree.reloadTree()
        titles = function ()
        {
            return se.sheetree.fuzzied.map(function (n)
            {
                return n.title.trim()
            })
        }
        compare(titles(),['box','text','text'])
        e.state.setCursors([[1,1]])
        compare(se.sheetree.currentIndex(),0)
        e.state.setCursors([[3,2]])
        compare(se.sheetree.currentIndex(),1)
        e.state.setCursors([[10,0]])
        compare(se.sheetree.currentIndex(),2)
        e.state.setCursors([[14,3]])
        compare(se.sheetree.currentIndex(),2)
        se.sheetree.grabFocus()
        se.sheetree.select(0)
        cmd('delete')
        compare(titles(),['text'])
        compare(rt('children.0.text'),'z')
    })
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQW1CLFVBQVQ7T0FBYSxXQUFiO09BQWtCLFdBQWxCOztPQUNBLFVBQUE7SUFBUztJQUFLOztPQUNMLFVBQVA7O09BQ08sYUFBWjtPQUFtQixXQUFuQjs7T0FDWSxhQUFaOztPQUNjLGlCQUFUOztPQUNTLGdCQUFUOztPQUNPLGNBQVo7OztBQUVQLGtCQUFVLE9BQU07O1dBQVEsT0FBTyxXQUFXLE1BQU07OztBQUNoRCxvQkFBVSxPQUFNOztXQUFRLE1BQU0sTUFBTSxNQUFNOzs7QUFDMUMsaUJBQVUsT0FBTSxNQUFLOztXQUFRLElBQUksSUFBSSxPQUFPLFVBQVUsTUFBTSxNQUFNOzs7QUFDbEUsZ0JBQVUsT0FBTTs7V0FBUSxPQUFPLFlBQVksT0FBTyxVQUFVLE1BQU07OztBQUNsRSxrQkFBVSxPQUFNOztXQUFRLElBQUksTUFBTSxPQUFPLE9BQU8sTUFBTTs7O0FBQ3RELGtCQUFVLE1BQUs7O1dBQVEsS0FBSyxJQUFJLGlCQUFROztlQUFTLEtBQUssTUFBTSxPQUFNOzs7QUFFbEUsSUFBSSxJQUFJOztBQUVSLGtCQUFRLE1BQUssZUFBWSxPQUFLLEdBQUUsTUFBSTs7OztJQUNoQyxPQUFPLHdCQUFQLE9BQU8sa0NBQWU7O2VBQVE7T0FBTTs7SUFDcEMsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsSUFBSSxFQUFFLE9BQU8sS0FBSztJQUMxQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFHLEVBQUUsTUFBTSxLQUFLO1dBQzdCLEVBQUUsTUFBTSxVQUFVLE1BQU0sTUFBTSxLQUFLLElBQUksT0FBTzs7O0FBRWxELGVBQU07O1dBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxRQUFROzs7QUFDdEM7O1dBQVMsRUFBRSxNQUFNOzs7QUFDakIsZ0JBQU07O1dBQVMs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LEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDNUUsSUFBSSxJQUFJLEtBQUssK0JBQWlDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDdkYsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7OztnQkFJN0UsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLElBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTt3QkFDNUUsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDeEQsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFOUUsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLElBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDMUUsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFNUUsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLElBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVB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LEVBQUUsRUFBRSxNQUFPOzs7O29CQUl2RCxLQUFLLE1BQU0sS0FBSyxlQUFlLEVBQUUsSUFBSSxLQUFLLEVBQUUsSUFBSSxPQUFRLFFBQVE7b0JBQ2hFLEtBQUssTUFBTSxLQUFLLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU8sTUFBTSxNQUFNO29CQUNyRSxLQUFLLE1BQU0sS0FBSyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFPLE9BQU87b0JBQ3BELEtBQUssTUFBTSxLQUFLLE1BQU0sRUFBRSxFQUFFLE1BQU87Ozs7b0JBSWpDLEtBQUssUUFBUSxLQUFLLE1BQU0sTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQ2pHLEtBQUssUUFBUSxLQUFLLFNBQVMsTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQzFGLEtBQUssUUFBUSxLQUFLLE9BQU8sTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQzVILEtBQUssUUFBUSxLQUFLLE9BQU8sTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
