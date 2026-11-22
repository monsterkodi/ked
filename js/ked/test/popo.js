var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var absol, absrect, areas, bands, before, board, cells, click, cmd, container, data, desue, dmp, e, h, i, key, layouts, loadSheet, mc, node, order, page, rect, regions, res, rgns, rt, runs, savedCopy, savedPaste, se, sheet, showSue, size, text, titles, tree, undo, _1058_105_, _252_68_, _253_68_, _278_62_, _283_62_, _317_22_, _387_63_, _683_57_, _689_65_, _698_74_, _728_54_, _779_22_, _827_30_, _971_78_, _977_70_, _992_42_

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
    h = new harness({cols:16,rows:rows})
    e = new cls(h.screen,name,features)
    e.layout(0,0,16,rows)
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
    e.state.setSheetTree(tree,h.cols,h.rows)
    e.state.renderSheet(e.state.rectree,{cols:h.cols,rows:h.rows},cursor,{history:false,silent:true})
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
                var _1054_59_

                return ((_1054_59_=n.text) != null ? _1054_59_ : n.bg)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQW1CLFVBQVQ7T0FBYSxXQUFiO09BQWtCLFdBQWxCOztPQUNBLFVBQUE7SUFBUztJQUFLOztPQUNMLFVBQVA7O09BQ08sYUFBWjtPQUFtQixXQUFuQjs7T0FDWSxhQUFaOztPQUNjLGlCQUFUOztPQUNTLGdCQUFUOztPQUNPLGNBQVo7OztBQUVQLGtCQUFVLE9BQU07O1dBQVEsT0FBTyxXQUFXLE1BQU07OztBQUNoRCxvQkFBVSxPQUFNOztXQUFRLE1BQU0sTUFBTSxNQUFNOzs7QUFDMUMsaUJBQVUsT0FBTSxNQUFLOztXQUFRLElBQUksSUFBSSxPQUFPLFVBQVUsTUFBTSxNQUFNOzs7QUFDbEUsZ0JBQVUsT0FBTTs7V0FBUSxPQUFPLFlBQVksT0FBTyxVQUFVLE1BQU07OztBQUNsRSxrQkFBVSxPQUFNOztXQUFRLElBQUksTUFBTSxPQUFPLE9BQU8sTUFBTTs7O0FBQ3RELGtCQUFVLE1BQUs7O1dBQVEsS0FBSyxJQUFJLGlCQUFROztlQUFTLEtBQUssTUFBTSxPQUFNOzs7QUFFbEUsSUFBSSxJQUFJOztBQUVSLGtCQUFRLE1BQUssZUFBWSxPQUFLLEdBQUUsTUFBSTs7OztJQUNoQyxPQUFPLHdCQUFQLE9BQU8sa0NBQWU7O2VBQVE7T0FBTTs7SUFDcEMsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsSUFBSSxFQUFFLE9BQU8sS0FBSztJQUMxQixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7V0FDaEIsRUFBRSxNQUFNLFVBQVUsTUFBTSxNQUFNLEtBQUssSUFBSSxPQUFPOzs7QUFFbEQsZUFBTTs7V0FBUSxJQUFJLElBQUksRUFBRSxNQUFNLFFBQVE7OztBQUN0Qzs7V0FBUyxFQUFFLE1BQU07OztBQUNqQixnQkFBTTs7V0FBUyxFQUFFLElBQUksRUFBRTs7O0FBRXZCLGtCQUFRLEdBQUU7O1dBQUssRUFBRSxT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RyxFQUFFLFNBQVksS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFOzs7O2dCQUl4RyxPQUFPLE9BQU8sS0FBSyxHQUFHLEtBQUssS0FBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTt3QkFDMUcsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDekQsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDNUUsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFNUUsT0FBTyxPQUFPLEtBQUssSUFBSSxLQUFLLE1BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTt3QkFDbkksS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDekQsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTt3QkFDbkYsSUFBSSxJQUFJLEtBQUssK0JBQWlDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFFNUYsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLEtBQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTt3QkFDeEYsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDdkQsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFNUUsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLEtBQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7d0JBQzFJLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7d0JBQ3hELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQzVFLElBQUksSUFBSSxLQUFLLCtCQUFpQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQ3ZGLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7Z0JBSTdFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7d0JBQzVFLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7d0JBQ3hELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTlFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQzFFLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTVFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
