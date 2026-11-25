var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var absol, absrect, areas, bands, before, board, cells, click, cmd, container, data, desue, dmp, e, h, i, key, layouts, loadSheet, mc, node, order, page, rect, regions, res, rgns, rt, runs, savedCopy, savedPaste, se, sel, sheet, showSue, size, strs, text, textnode, titles, tree, undo, _1084_78_, _1090_70_, _1105_42_, _1171_105_, _255_68_, _256_68_, _281_62_, _286_62_, _299_62_, _334_22_, _404_63_, _629_35_, _630_36_, _717_57_, _723_65_, _732_74_, _765_54_, _787_50_, _815_22_, _863_30_

import sds from "../../kxk/sds.js"
import noon from "../../kxk/noon.js"
import clip from "../../kxk/clip.js"

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import sue from "../edit/tool/sue.js"

import layout from "../popo/layout.js"
import fill from "../popo/fill.js"
import projector from "../popo/projector.js"

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

textnode = function (cells, node)
{
    return projector.attach(layout.regionize(cells,{children:[node]})).children[0]
}

strs = function (node)
{
    return node.state.s.lines.map(function (l)
    {
        return kseg.str(l)
    })
}
h = e = null

sheet = function (name, features = [], rows = 4, cls = editor)
{
    var _22_23_

    global.ked_session = ((_22_23_=global.ked_session) != null ? _22_23_ : {get:(function ()
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
    await section("projector", async function ()
    {
        node = textnode({cols:8,rows:6},{text:'abcdef\nxy',x:1,y:1,w:4,h:4})
        compare(strs(node),['abcdef','xy'])
        compare(node.state.wrapStarts(0),[0,4])
        compare(projector.glyphs(node),[[1,1,'a'],[2,1,'b'],[3,1,'c'],[4,1,'d'],[1,2,'e'],[2,2,'f'],[1,3,'x'],[2,3,'y']])
        compare(projector.cellOf(node,[5,0]),[2,2])
        compare(projector.cellOf(node,[4,0]),[1,2])
        compare(projector.cellOf(node,[1,1]),[2,3])
        compare(projector.posAt(node,[3,2]),[6,0])
        compare(projector.posAt(node,[2,3]),[1,1])
        compare((projector.posAt(node,[1,4]) != null),false)
        compare((layout.plainNode(node).state != null),false)
        node.text = 'xyz'
        projector.attach(node)
        compare(strs(node),['xyz'])
        node = textnode({cols:4,rows:4},{text:'abc',x:0,y:0,w:4,h:4,scale:2})
        compare(projector.glyphs(node),[[0,0,'a'],[2,0,'b'],[0,2,'c']])
        compare(projector.cellOf(node,[1,0]),[2,1])
        compare(projector.cellOf(node,[2,0]),[0,3])
        compare(projector.posAt(node,[2,1]),[1,0])
        compare(projector.posAt(node,[1,3]),[2,0])
        node = textnode({cols:6,rows:2},{text:'abcdefg',x:0,y:0,w:6,h:2,children:[{x:2,y:0,w:2,h:1,blocks:true}]})
        compare(projector.glyphs(node),[[0,0,'a'],[1,0,'b'],[4,0,'c'],[5,0,'d'],[0,1,'e'],[1,1,'f'],[2,1,'g']])
        compare(projector.cellOf(node,[2,0]),[4,0])
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
    await section("sheet selection", async function ()
    {
        sheet('popo_sheet_select')
        e.grabFocus()
        sel = function ()
        {
            return e.state.sheetSelectedText()
        }
        loadSheet({children:[{text:'abcdef',x:2,y:1,w:3,h:3},{pattern:'.',x:8,y:0,w:2,h:2}]})
        e.state.setCursors([[3,1]])
        key('cmd+a')
        compare(sel(),'abcdef')
        compare(e.state.s.selections,[[2,1,5,1],[2,2,5,2]])
        key('cmd+a')
        compare(e.state.s.selections,[])
        key('cmd+a')
        e.state.insert('X')
        compare(rt('children.0.text'),'X')
        compare(e.state.s.selections,[])
        compare(mc(),[3,1])
        e.state.undo()
        compare(rt('children.0.text'),'abcdef')
        e.state.deselect()
        e.state.setCursors([[3,1]])
        key('shift+right')
        key('shift+right')
        compare(sel(),'bc')
        key('shift+left')
        compare(sel(),'b')
        key('shift+right')
        key('shift+down')
        compare(sel(),'bcdef')
        e.state.insert('Y')
        compare(rt('children.0.text'),'aY')
        compare(mc(),[4,1])
        loadSheet({children:[{text:'abcdef',x:2,y:1,w:3,h:3}]})
        e.state.setCursors([[5,2]])
        key('shift+left')
        key('shift+up')
        compare(sel(),'cdef')
        key('shift+up')
        compare(sel(),'abcdef')
        key('delete')
        compare(rt('children.0.text'),'')
        compare(e.state.s.selections,[])
        e.state.undo()
        compare(rt('children.0.text'),'abcdef')
        compare(sel(),'abcdef')
        e.state.deselect()
        e.state.setCursors([[3,1]])
        key('entf')
        compare(rt('children.0.text'),'acdef')
        compare(mc(),[3,1])
        e.state.setCursors([[2,2]])
        key('shift+right')
        key('entf')
        compare(rt('children.0.text'),'acdf')
        e.state.setCursors([[12,3]])
        key('cmd+a')
        compare(e.state.s.selections,[])
        key('shift+right')
        compare(e.state.s.selections,[])
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
        e.state.setCursors([[2,1]])
        key('shift+right')
        key('shift+right')
        e.state.copy()
        compare(board,'ac')
        e.state.cut()
        compare(board,'ac')
        compare(rt('children.0.text'),'df')
        e.state.setCursors([[3,1]])
        e.state.paste()
        compare(rt('children.0.text'),'dacf')
        e.state.setCursors([[12,3]])
        e.state.cut()
        compare(rt('children.0.text'),'dacf')
        clip.copy = savedCopy
        clip.paste = savedPaste
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
        e.grabFocus()
        e.state.setCursors([[11,0]])
        compare(se.sheetree.current().text,'z')
        e.state.insert('x')
        compare(se.sheetree.current() === rt('children.1'),true)
        compare(rt('children.1.text'),'zx')
        key('delete')
        compare(se.sheetree.current() === rt('children.1'),true)
        e.state.undo()
        compare(se.sheetree.current() === rt('children.1'),true)
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
                var _1167_59_

                return ((_1167_59_=n.text) != null ? _1167_59_ : n.bg)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQW1CLFVBQVQ7T0FBYSxXQUFiO09BQWtCLFdBQWxCOztPQUNBLFVBQUE7SUFBUztJQUFLOztPQUNMLFVBQVA7O09BQ08sYUFBWjtPQUFtQixXQUFuQjtPQUF3QixnQkFBeEI7O09BQ1ksYUFBWjs7T0FDYyxpQkFBVDs7T0FDUyxnQkFBVDs7T0FDTyxjQUFaOzs7QUFFUCxrQkFBVSxPQUFNOztXQUFRLE9BQU8sV0FBVyxNQUFNOzs7QUFDaEQsb0JBQVUsT0FBTTs7V0FBUSxNQUFNLE1BQU0sTUFBTTs7O0FBQzFDLGlCQUFVLE9BQU0sTUFBSzs7V0FBUSxJQUFJLElBQUksT0FBTyxVQUFVLE1BQU0sTUFBTTs7O0FBQ2xFLGdCQUFVLE9BQU07O1dBQVEsT0FBTyxZQUFZLE9BQU8sVUFBVSxNQUFNOzs7QUFDbEUsa0JBQVUsT0FBTTs7V0FBUSxJQUFJLE1BQU0sT0FBTyxPQUFPLE1BQU07OztBQUN0RCxrQkFBVSxNQUFLOztXQUFRLEtBQUssSUFBSSxpQkFBUTs7ZUFBUyxLQUFLLE1BQU0sT0FBTTs7OztBQUNsRSxxQkFBVyxPQUFNOztXQUFRLFVBQVUsT0FBTyxPQUFPLFVBQVUsT0FBTyxVQUFVLFNBQVMsU0FBUzs7O0FBQzlGLGlCQUFVOztXQUFRLEtBQUssTUFBTSxFQUFFLE1BQU0sY0FBSzs7ZUFBTSxLQUFLLElBQUk7OztBQUV6RCxJQUFJLElBQUk7O0FBRVIsa0JBQVEsTUFBSyxlQUFZLE9BQUssR0FBRSxNQUFJOzs7O0lBQ2hDLE9BQU8sd0JBQVAsT0FBTyxrQ0FBZTs7ZUFBUTtPQUFNOztJQUNwQyxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7SUFDN0IsUUFBUSxJQUFJLEVBQUUsT0FBTyxLQUFLO0lBQzFCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztJQUNoQixFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUcsRUFBRSxNQUFNLEtBQUs7V0FDN0IsRUFBRSxNQUFNLFVBQVUsTUFBTSxNQUFNLEtBQUssSUFBSSxPQUFPOzs7QUFFbEQsZUFBTTs7V0FBUSxJQUFJLElBQUksRUFBRSxNQUFNLFFBQVE7OztBQUN0Qzs7V0FBUyxFQUFFLE1BQU07OztBQUNqQixnQkFBTTs7V0FBUyxFQUFFLElBQUksRUFBRTs7O0FBRXZCLGtCQUFRLEdBQUU7O1dBQUssRUFBRSxTQUFRLEtBQUssUUFBUSxNQUFNLElBQUUsRUFBRSxNQUFNLEVBQUUsSUFBRSxFQUFFLE1BQU0sR0FBRyxPQUFPLE9BQU8sTUFBTTs7O0FBRXpGLHNCQUFZLE1BQUssVUFBUSxFQUFFOztJQUN2QixFQUFFLE1BQU0sYUFBYTtJQUNyQixFQUFFLE1BQU0sWUFBWSxFQUFFLE1BQU0sUUFBUSxFQUFFLE1BQU0sWUFBWSxRQUFPLFFBQVEsTUFBTSxPQUFPO1dBQ3BGLEVBQUUsTUFBTTs7O0FBRVo7O1lBQVksV0FBWSxLQUFLLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sSUFBTSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7O0FBRTFGLG9CQUFVOztJQUNOLEVBQUUsTUFBTSxVQUFVLEtBQUssS0FBSyxNQUFNO0lBQ2xDLEVBQUUsTUFBTSxRQUFRLEtBQUs7V0FDckIsRUFBRTs7Ozs7Ozs7OztnQkFVeUUsUUFBL0QsU0FBUyxLQUFLLElBQUksS0FBSyxLQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBVyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ2pELFFBQS9ELFNBQVMsS0FBSyxHQUFHLEtBQUssSUFBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUM1QyxRQUEvRCxTQUFTLEtBQUssR0FBRyxLQUFLLElBQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFXLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFM0csUUFBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUN6QyxRQUFqQyxTQUFTLEtBQUssSUFBSSxLQUFLLEtBQUssT0FBUSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7Z0JBQ3BELFFBQWhDLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7Ozs7Z0JBSTFCLFFBQXpELFNBQVMsS0FBSyxJQUFJLEtBQUssS0FBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQWdCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDL0MsUUFBekQsU0FBUyxLQUFLLElBQUksS0FBSyxLQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBaUIsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO2dCQUMvQyxRQUF6RCxTQUFTLEtBQUssSUFBSSxLQUFLLEtBQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFVLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDL0MsUUFBekQsU0FBUyxLQUFLLElBQUksS0FBSyxLQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsU0FBWSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Ozs7Z0JBSXhHLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxLQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO2dCQUNoRyxRQUFWLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3pCLFFBQWhDLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQzVDLFFBQWhDLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTVFLE9BQU8sT0FBTyxLQUFLLElBQUksS0FBSyxNQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7Z0JBQ3pILFFBQVYsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDekIsUUFBaEMsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtnQkFDeEMsUUFBM0MsSUFBSSxJQUFJLEtBQUssK0JBQWlDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFFNUYsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLEtBQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFDOUUsUUFBVixLQUFLLE1BQVEsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUN2QixRQUFoQyxJQUFJLElBQUksS0FBSyxvQkFBc0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUU1RSxPQUFPLE9BQU8sS0FBSyxHQUFHLEtBQUssS0FBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFDaEksUUFBVixLQUFLLE1BQVEsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO2dCQUN4QixRQUFoQyxJQUFJLElBQUksS0FBSyxvQkFBc0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUNqQyxRQUEzQyxJQUFJLElBQUksS0FBSywrQkFBaUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUN2RCxRQUFoQyxJQUFJLElBQUksS0FBSyxvQkFBc0IsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O2dCQUk3RSxPQUFPLE9BQU8sS0FBSyxHQUFHLEtBQUssSUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO2dCQUNsRSxRQUFWLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3hCLFFBQWhDLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTlFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQzFDLFFBQWhDLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTVFLE9BQU8sT0FBTyxLQUFLLEdBQUcsS0FBSyxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQy9ELFFBQVYsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDdEIsUUFBaEMsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFNUUsT0FBTyxPQUFPLEtBQUssR0FBRyxLQUFLLEtBQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTtnQkFDdkUsUUFBVixLQUFLLE1BQVEsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUN0QixRQUFoQyxJQUFJLElBQUksS0FBSyxvQkFBc0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUU1RSxPQUFPLE9BQU8sS0FBSyxHQUFHLEtBQUssSUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQ3RDLFFBQVYsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDeEMsUUFBZCxLQUFLOzs7O2dCQUlMLE9BQU8sT0FBTyxLQUFLLElBQUksS0FBSyxLQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxXQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxXQUFZLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxXQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7Z0JBQzdMLFFBQVYsS0FBSyxNQUFRLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDdkIsUUFBcEMsSUFBSSxJQUFJLEtBQUssd0JBQTBCLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ1IsUUFBL0MsSUFBSSxJQUFJLEtBQUssbUNBQXFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7Z0JBQ1QsUUFBMUQsSUFBSSxJQUFJLEtBQUssOENBQWdELEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7Z0JBQ1QsUUFBckUsSUFBSSxJQUFJLEtBQUsseURBQTJELEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7Ozs7Ozs7Z0JBTXhGLFFBQVMsR0FBRyxPQUFPLFdBQVksS0FBSyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTFELE1BQU0sT0FBTyxZQUFZLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFO2dCQUV4QyxRQUFULElBQUksS0FBTztnQkFDTCxRQUFOLElBQUksRUFBSTtnQkFDRixRQUFOLElBQUksRUFBSTtnQkFDRixRQUFOLElBQUksRUFBSTtnQkFDRixRQUFOLElBQUksRUFBSTtnQkFFUixNQUFNLE9BQU8sWUFBWSxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRTtnQkFDMUMsUUFBUCxJQUFJLEdBQUs7Z0JBRVQsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUU7Z0JBQzFDLFFBQVAsSUFBSSxHQUFLOzs7O2dCQUlULFFBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFFL0IsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUU7Z0JBQ3BDLFFBQWIsSUFBSSxLQUFLLEtBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFOUIsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUU7Z0JBQ3BDLFFBQWIsSUFBSSxLQUFLLEtBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFdUIsbUJBQS9DLE9BQU8sWUFBWSxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxLQUFNO2dCQUNGLG1CQUEvQyxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUUsS0FBTTtnQkFFdkQsUUFBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUV2QixNQUFNLE9BQU8sWUFBWSxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRTtnQkFDcEMsUUFBYixJQUFJLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUV1QixtQkFBL0MsT0FBTyxZQUFZLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFLEtBQU07Ozs7Z0JBSXZELFFBQVMsR0FBRyxPQUFPLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRUYsUUFBcEQsT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUssS0FBTztnQkFFdEQsUUFBUyxXQUFZLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQU0sS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRXRCLFFBQW5ELE9BQU8sWUFBWSxLQUFLLEVBQUUsS0FBSyxHQUFHLE1BQU0sRUFBRSxJQUFJLEtBQU87Z0JBQ0YsUUFBbkQsT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUksS0FBTztnQkFFckQsUUFBUyxXQUFZLEtBQUssUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsV0FBWSxLQUFLLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFdEMsUUFBbkQsT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUksS0FBTztnQkFDRixRQUFuRCxPQUFPLFlBQVksS0FBSyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsSUFBSSxLQUFPOzs7O2dCQUlyRCxRQUFTLEdBQUcsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBWSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFdEcsTUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssSUFBSSxNQUFNLEVBQUU7Z0JBRXpDLFFBQVQsSUFBSSxLQUFPO2dCQUNFLFFBQWIsSUFBSSxLQUFLLEtBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDakIsUUFBYixJQUFJLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O2dCQUk5QixNQUFNLE9BQU8sWUFBWSxLQUFLLEVBQUUsS0FBSyxJQUFLLFdBQVksS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBUSxFQUFFO2dCQUMxRSxRQUFiLElBQUksS0FBSyxLQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQ0ssUUFBbkMsSUFBSSxJQUFJLElBQUksd0JBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRXBELE1BQU0sT0FBTyxZQUFZLEtBQUssRUFBRSxLQUFLLElBQUssTUFBTSxFQUFFLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUssRUFBRTtnQkFDdEUsUUFBVixJQUFJLE1BQVE7Z0JBQ0gsUUFBVCxJQUFJLEtBQU87Z0JBQ0UsUUFBYixJQUFJLEtBQUssS0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7Ozs7O2dCQU05QixTQUFTLEtBQUssR0FBRyxLQUFLO2dCQUN0QixPQUFPLE1BQU0sT0FBUSxXQUFZLEtBQUssT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUUzRCxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJOzs7O2dCQUkzRSxTQUFTLEtBQUssR0FBRyxLQUFLO2dCQUN0QixPQUFPLE1BQU0sT0FBUSxXQUFZLEtBQUssT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUV0RSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUMzRSxPQUFPLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUE2QixRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJOzs7Ozs7O2dCQU0zRSxTQUFTLEtBQUssR0FBRyxLQUFLO2dCQUN0QixPQUFPLE1BQU0sT0FBUSxXQUFZLEtBQUssT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUUzRCxPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUFpQyxRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUNqRixPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUFpQyxRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUNqRixPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUFpQyxRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUNqRixPQUFPLFdBQVcsTUFBTSxLQUFLLEtBQUssU0FBUyxHQUFHO2dCQUFpQyxRQUFuQixLQUFLLFNBQVMsR0FBRyxFQUFJO2dCQUNqRixPQUFPLFdBQVcsTUFBTSxLQUFLLEtB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LEtBQUssVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTyxPQUFPO1lBQ3RCLFFBQTlCLEtBQUssTUFBTSxLQUFLLE1BQU0sRUFBRSxFQUFFLE1BQU87Ozs7WUFJb0MsUUFBckUsS0FBSyxRQUFRLEtBQUssTUFBTSxNQUFNLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN6QixRQUF4RSxLQUFLLFFBQVEsS0FBSyxTQUFTLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ0osUUFBdEYsS0FBSyxRQUFRLEtBQUssT0FBTyxNQUFNLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN0QyxRQUF0RixLQUFLLFFBQVEsS0FBSyxPQUFPLE1BQU0sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBRTFCLFFBQTlFLEtBQUssUUFBUSxLQUFLLE9BQU8sTUFBTSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7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
//# sourceURL=../../../kode/ked/test/popo.kode
