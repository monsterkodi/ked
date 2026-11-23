var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var absol, absrect, areas, bands, before, board, cells, click, cmd, container, data, desue, dmp, e, h, i, key, layouts, loadSheet, mc, node, order, page, rect, regions, res, rgns, rt, runs, savedCopy, savedPaste, se, sheet, showSue, size, text, titles, tree, undo, _1002_70_, _1017_42_, _1083_105_, _253_68_, _254_68_, _279_62_, _284_62_, _297_62_, _332_22_, _402_63_, _687_57_, _693_65_, _702_74_, _735_54_, _757_50_, _785_22_, _833_30_, _996_78_

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
                tree = absol(cells,{children:[{text:'ab',x:0,y:0,w:7,h:3,scale:3}]})
                node = tree.children[0]
                layout.resizeNode(cells,tree,node,'more cols')
                compare(node.w,9)
                layout.resizeNode(cells,tree,node,'less cols')
                compare(node.w,6)
                tree = absol(cells,{children:[{text:'ab',x:0,y:0,w:7,h:3,scale:3}]})
                node = tree.children[0]
                layout.resizeNode(cells,tree,node,'less cols')
                compare(node.w,6)
                tree = absol(cells,{children:[{text:'ab',x:4,y:0,w:15,h:3,scale:3}]})
                node = tree.children[0]
                layout.resizeNode(cells,tree,node,'more cols')
                compare(node.w,18)
                compare(node.rect.abs.w,16)
                compare((layout.resizeNode(cells,tree,node,'more cols') != null),false)
                layout.resizeNode(cells,tree,node,'less cols')
                compare(node.w,15)
                compare(node.rect.abs.w,15)
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
        loadSheet({children:[{text:'ab',x:2,y:0,w:7,h:2,scale:2}]})
        e.state.setCursors([[6,1]])
        key('left')
        compare(mc(),[5,1])
        compare(e.state.scaleRunsForLine(1),[[2,5,2]])
        key('left')
        compare(mc(),[4,1])
        key('right')
        compare(mc(),[5,1])
        key('right')
        compare(mc(),[6,1])
        e.state.setCursors([[9,0]])
        key('left')
        compare(mc(),[5,1])
        e.state.setCursors([[8,2]])
        key('up')
        compare(mc(),[5,1])
        loadSheet({children:[{text:'ab',x:2,y:0,w:8,h:3,scale:3}]})
        e.state.setCursors([[3,2]])
        key('right')
        compare(mc(),[4,2])
        key('right')
        compare(mc(),[6,2])
        compare(e.state.sheetCellForPos(mc()),[10,2])
        key('right')
        compare(mc(),[7,2])
        key('left')
        compare(mc(),[6,2])
        key('left')
        compare(mc(),[4,2])
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
                var _1079_59_

                return ((_1079_59_=n.text) != null ? _1079_59_ : n.bg)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQW1CLFVBQVQ7T0FBYSxXQUFiO09BQWtCLFdBQWxCOztPQUNBLFVBQUE7SUFBUztJQUFLOztPQUNMLFVBQVA7O09BQ08sYUFBWjtPQUFtQixXQUFuQjs7T0FDWSxhQUFaOztPQUNjLGlCQUFUOztPQUNTLGdCQUFUOztPQUNPLGNBQVo7OztBQUVQLGtCQUFVLE9BQU07O1dBQVEsT0FBTyxXQUFXLE1BQU07OztBQUNoRCxvQkFBVSxPQUFNOztXQUFRLE1BQU0sTUFBTSxNQUFNOzs7QUFDMUMsaUJBQVUsT0FBTSxNQUFLOztXQUFRLElBQUksSUFBSSxPQUFPLFVBQVUsTUFBTSxNQUFNOzs7QUFDbEUsZ0JBQVUsT0FBTTs7V0FBUSxPQUFPLFlBQVksT0FBTyxVQUFVLE1BQU07OztBQUNsRSxrQkFBVSxPQUFNOztXQUFRLElBQUksTUFBTSxPQUFPLE9BQU8sTUFBTTs7O0FBQ3RELGtCQUFVLE1BQUs7O1dBQVEsS0FBSyxJQUFJLGlCQUFROztlQUFTLEtBQUssTUFBTSxPQUFNOzs7QUFFbEUsSUFBSSxJQUFJOztBQUVSLGtCQUFRLE1BQUssZUFBWSxPQUFLLEdBQUUsTUFBSTs7OztJQUNoQyxPQUFPLHdCQUFQLE9BQU8sa0NBQWU7O2VBQVE7T0FBTTs7SUFDcEMsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsSUFBSSxFQUFFLE9BQU8sS0FBSztJQUMxQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFHLEVBQUUsTUFBTSxLQUFLO1dBQzdCLEVBQUUsTUFBTSxVQUFVLE1BQU0sTUFBTSxLQUFLLElBQUksT0FBTzs7O0FBRWxELGVBQU07O1dBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxRQUFROzs7QUFDdEM7O1dBQVMsRUFBRSxNQUFNOzs7QUFDakIsZ0JBQU07O1dBQVMs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LEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFFdEUsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTs7Ozs7OztnQkFNM0UsU0FBUyxLQUFLLEdBQUcsS0FBSztnQkFDdEIsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFM0QsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTs7OztnQkFJakYsU0FBUyxLQUFLLEdBQUcsS0FBSztnQkFDdEIsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFFNUQsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTs7OztnQkFJakYsU0FBUyxLQUFLLEdBQUcsS0FBSztnQkFDdEIsaUJBQVM7OzJCQUFTLEtBQUssU0FBUzs7Z0JBQ2hDLGlCQUFTLE1BQUs7O29CQUFRLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSyxNQUFNOzJCQUFNLEtBQUssTUFBTSxLQUFLOztnQkFFcEYsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDRixTQUF0RCxPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssTUFBTSxzQkFBZ0I7Z0JBQ0YsU0FBdEQsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLE1BQU0sc0JBQWdCO2dCQUNwQyxRQUFwQixLQUFLLE1BQU0sS0FBSyxLQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRXJDLE9BQU8sTUFBTSxPQUFRLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQy9CLFFBQXpCLEtBQUssS0FBSyxhQUFhLEVBQUk7Z0JBQWtCLFFBQWIsS0FBSyxNQUFNLEVBQUk7Z0JBQ3RCLFFBQXpCLEtBQUssS0FBSyxhQUFhLEVBQUk7Z0JBQWtCLFFBQWIsS0FBSyxNQUFNLEVBQUk7Z0JBRS9DLE9BQU8sTUFBTSxPQUFRLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQy9CLFFBQXpCLEtBQUssS0FBSyxhQUFhLEVBQUk7Z0JBQWlCLFFBQWIsS0FBSyxNQUFNLEVBQUk7Z0JBRTlDLE9BQU8sTUFBTSxPQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7cUJBQzVELElBQUssT0FBSTs7b0JBQUksS0FBSyxLQUFLOztnQkFDZCxRQUFiLEtBQUssTUFBTSxFQUFJO3FCQUNYLElBQUssT0FBSTs7b0JBQUksS0FBSyxLQUFLOztnQkFDZCxRQUFiLEtBQUssTUFBTSxFQUFJOzs7O2dCQUlmLFNBQVMsS0FBSyxHQUFHLEtBQUs7Z0JBQ3RCLE9BQVEsTUFBTSxPQUFRLFdBQVksS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNO2dCQUNsRSxPQUFRLEtBQUssU0FBUztnQkFFdEIsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLO2dCQUE4QixRQUFoQixLQUFLLEtBQUssSUFBSSxFQUFJO2dCQUNsRSxPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUs7Z0JBQThCLFFBQWhCLEtBQUssS0FBSyxJQUFJLEVBQUk7Z0JBQ2xFLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSztnQkFBOEIsUUFBaEIsS0FBSyxLQUFLLElBQUksRUFBSTtnQkFDbEIsU0FBaEQsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLHNCQUFnQjtnQkFDbEMsUUFBaEIsS0FBSyxLQUFLLElBQUksRUFBSTtnQkFDbEIsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLO2dCQUE4QixRQUFoQixLQUFLLEtBQUssSUFBSSxFQUFJO2dCQUNsRSxPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUs7Z0JBQThCLFFBQWhCLEtBQUssS0FBSyxJQUFJLEVBQUk7Z0JBQ2xFLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSztnQkFBOEIsUUFBaEIsS0FBSyxLQUFLLElBQUksRUFBSTtnQkFDbEIsU0FBaEQsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLHNCQUFnQjtnQkFFbEQsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU07Z0JBQ2pFLE9BQU8sS0FBSyxTQUFTO2dCQUNyQixPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUs7Z0JBQXFCLFFBQVAsS0FBSyxFQUFJO2dCQUN6RCxPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUs7Z0JBQXFCLFFBQVAsS0FBSyxFQUFJO2dCQUN6RCxPQUFPLE1BQU0sT0FBUSxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTTtnQkFDakUsT0FBTyxLQUFLLFNBQVM7Z0JBQ3JCLE9BQU8sV0FBVyxNQUFNLEtBQUssS0FBSztnQkFBcUIsUUFBUCxLQUFLLEVBQUk7Z0JBRXpELE9BQU8sTUFBTSxPQUFRLFdBQVksS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNO2dCQUNsRSxPQUFPLEtBQUssU0FBUztnQkFDckIsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLO2dCQUFxQixRQUFQLEtBQUssRUFBSTtnQkFBcUIsUUFBaEIsS0FBSyxLQUFLLElBQUksRUFBSTtnQkFDaEMsU0FBaEQsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLHNCQUFnQjtnQkFDbEQsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLO2dCQUFxQixRQUFQLEtBQUssRUFBSTtnQkFBcUIsUUFBaEIsS0FBSyxLQUFLLElBQUksRUFBSTs7Ozs7WUFJcEYsUUFBUyxHQUFHLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLFdBQVksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVksS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFFdEcsT0FBTyxTQUFTLEtBQUssR0FBRyxLQUFLLElBQUksT0FBTyxPQUFPO1lBRXBDLFFBQVgsS0FBSyxNQUFRO1lBQ0MsUUFBZCxLQUFLLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO1lBRWhDLFlBQVksSUFBSSxJQUFJLEtBQUs7WUFDVCxRQUFoQixVQUFVLE1BQVE7WUFFbEIsT0FBTyxJQUFJLElBQUksS0FBSztZQUNULFFBQVgsS0FBSyxNQUFRO1lBQ0MsUUFBZCxLQUFLLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRVgsUUFBcEIsT0FBTyxPQUFPLE1BQVE7WUFDSCxRQUFuQixPQUFPLE1BQU0sTUFBUTtZQUNJLFFBQXpCLE9BQU8sT0FBTyxXQUFhO1lBQ1AsUUFBcEIsT0FBTyxPQUFPLE1BQVE7WUFDSCxRQUFuQixPQUFPLE1BQU0sTUFBUTtZQUVyQixRQUFTLEdBQUcsT0FBTyxXQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRXBGLE9BQU8sU0FBUyxLQUFLLEdBQUcsS0FBSyxJQUFJO1lBRWMsUUFBL0MsSUFBSSxJQUFJLEtBQUssbUNBQXFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFFaEUsUUFBUyxXQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsV0FBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRW5GLE9BQU8sU0FBUyxLQUFLLEdBQUcsS0FBSyxJQUFJO1lBRXJCLFNBQVosS0FBSyxlQUFTO1lBQ21CLFFBQWpDLElBQUksSUFBSSxLQUFLLG9CQUFzQjtZQUNGLFFBQWpDLElBQUksSUFBSSxLQUFLLG9CQUFzQjtZQUNTLFFBQTVDLElBQUksSUFBSSxLQUFLLCtCQUFpQzs7OztZQUk5QyxRQUFTLEdBQUcsT0FBTyxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRXZELE9BQU8sU0FBUyxLQUFLLEdBQUcsS0FBSyxHQUFHO1lBQ2hDLE9BQU8sV0FBVyxLQUFLLEdBQUcsS0FBSyxHQUFHO1lBRUEsUUFBbEMsS0FBSyxNQUFNLE9BQU8sU0FBUyxRQUFVLEdBQUcsT0FBTyxXQUFXLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRWxGLFFBQVMsR0FBRztZQUVaLE9BQU8sY0FBYyxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHO1lBRWQsUUFBbEMsS0FBSyxNQUFNLE9BQU8sU0FBUyxRQUFVLEdBQUcsT0FBTyxXQUFXLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7OztRQUloQyxRQUFqRCxPQUFPLFFBQVEsR0FBRyxPQUFPLFdBQVcsS0FBSyxTQUFXLFdBQVcsR0FBRyxPQUFPLFdBQVcsS0FBSztRQUNwRSxRQUFyQixPQUFPLFFBQVEsRUFBRSxLQUFPLFdBQVcsRUFBRTtRQUNyQyxRQUFRLFdBQVcsS0FBSztRQUNJLFFBQTVCLE9BQU8sT0FBTyxVQUFTLEtBQU87UUFDWixRQUFsQixPQUFPOzs7Ozs7WUFNUDtZQUU0RCxRQUE1RCxPQUFPLGNBQWMsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUUsR0FBRyxLQUFLLE9BQVM7WUFFbkMsUUFBM0IsSUFBSSxJQUFJLEtBQUssZUFBaUIsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFFckQsUUFBUyxRQUFRLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUV5QixRQUE1RCxPQUFPLGNBQWMsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUUsR0FBRyxLQUFLLE9BQVM7WUFFbkMsUUFBM0IsSUFBSSxJQUFJLEtBQUssZUFBaUIsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFFckQsUUFBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRXlDLFFBQWhFLE9BQU8sY0FBYyxLQUFLLEdBQUcsS0FBSyxJQUFJLE1BQU0sRUFBRSxHQUFHLEtBQUssS0FBSyxLQUFPO1lBRXZDLFFBQTNCLElBQUksSUFBSSxLQUFLLGVBQWlCLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O1lBSXJELFFBQVMsV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUVlLFFBQTVELE9BQU8sY0FBYyxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEtBQUssT0FBUztZQUU5QixRQUFoQyxJQUFJLElBQUksS0FBSyxtQkFBcUI7WUFFbEMsUUFBUyxXQUFZLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRWUsUUFBNUQsT0FBTyxjQUFjLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsS0FBSyxPQUFTO1lBRTlCLFFBQWhDLElBQUksSUFBSSxLQUFLLG1CQUFxQjtZQUVsQyxRQUFTLFdBQVksS0FBSyxLQUFLLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBRU0sUUFBM0QsT0FBTyxjQUFjLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsS0FBSyxPQUFTO1lBRTdCLFFBQWhDLElBQUksSUFBSSxLQUFLLG1CQUFxQjtZQUVtQixTQUFyRCxPQUFPLGNBQWMsS0FBSyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsR0FBRyxjQUFROzs7Ozs7O1lBTU8sUUFBOUQsS0FBSyxTQUFTLFFBQVEsYUFBYSxLQUFLLFlBQVksR0FBRyxFQUFFLE9BQVE7WUFDYyxRQUEvRSxLQUFLLFNBQVMsUUFBUSxhQUFhLEtBQUssWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBUSxrQkFBa0IsYUFBYTtZQUNyRCxRQUE1RCxLQUFLLFNBQVMsUUFBUSxLQUFLLEtBQUssWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTyxNQUFNO1lBQ3hCLFFBQTdDLEtBQUssU0FBUyxRQUFRLEtBQUssS0FBSztZQUNvQixRQUFwRCxLQUFLLFNBQVMsUUFBUSxLQUFLLEtBQUssWUFBWSxFQUFFLEVBQUUsTUFBTzs7OztZQUlGLFFBQXJELEtBQUssTUFBTSxLQUFLLGVBQWUsRUFBRSxJQUFJLEtBQUssRUFBRSxJQUFJLE9BQVEsUUFBUTtZQUNWLFFBQXRELEtBQUssTUFBTSxLQUFLLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU8sTUFBTSxNQUFNO1lBQzNCLFFBQTFDLEtBQUssTUFBTSxLQUFLLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU8sT0FBTztZQUN0QixRQUE5QixLQUFLLE1BQU0sS0FBSyxNQUFNLEVBQUUsRUFBRSxNQUFPOzs7O1lBSW9DLFFBQXJFLEtBQUssUUFBUSxLQUFLLE1BQU0sTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDekIsUUFBeEUsS0FBSyxRQUFRLEtBQUssU0FBUyxNQUFNLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNKLFFBQXRGLEtBQUssUUFBUSxLQUFLLE9BQU8sTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdEMsUUFBdEYsS0FBSyxRQUFRLEtBQUssT0FBTyxNQUFNLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUUxQixRQUE5RSxLQUFLLFFBQVEsS0FBSyxPQUFPLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBRWxCLFFBQTlFLEtBQUssUUFBUSxLQUFLLE9BQU8sTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFB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
//# sourceURL=../../../kode/ked/test/popo.kode
