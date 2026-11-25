var toExport = {}
var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var absol, absrect, areas, bands, before, board, cells, click, cmd, container, content, data, desue, dmp, e, full, h, i, key, layouts, lined, lines, loadSheet, low, mc, mouse, node, order, page, painted, rect, regions, res, rgns, row, rt, runs, savedCopy, savedPaste, se, sel, sheet, showSue, size, strs, text, textnode, titles, top, tree, txt, undo, undos, _1222_78_, _1228_70_, _1243_42_, _1309_101_, _271_68_, _272_68_, _297_62_, _302_62_, _315_62_, _350_22_, _397_62_, _634_35_, _636_18_, _637_36_, _649_36_, _737_57_, _743_65_, _752_74_, _785_54_, _823_47_, _856_50_, _884_22_, _932_30_

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
import mode from "../edit/mode.js"

import brckts from "../edit/mode/brckts.js"

import fileeditor from "../view/editor/fileeditor.js"

import sheeditor from "../view/colmns/sheeditor.js"

import harness from "../util/harness.js"
import dumpstate from "../util/dumpstate.js"


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
    return layout.dumpRegions(layout.regionize(cells,lined(tree)))
}

desue = function (cells, tree)
{
    return sue.desue(layout.sueify(cells,lined(tree)))
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
    return projector.attach(layout.regionize(cells,{children:[lined(node)]})).children[0]
}

strs = function (node)
{
    return node.state.s.lines.map(function (l)
    {
        return kseg.str(l)
    })
}

content = function (node)
{
    return projector.textOf(node)
}

txt = function (path)
{
    return content(rt(path))
}

lined = function (node)
{
    var k, out, v

    if (!(node != null) || typeof(node) !== 'object')
    {
        return node
    }
    out = {}
    for (k in node)
    {
        v = node[k]
        if (k === 'children')
        {
            out.children = v.map(lined)
        }
        else if (k === 'text' && _k_.isStr(v))
        {
            out.text = 'md'
            out.lines = v.split('\n')
        }
        else
        {
            out[k] = v
        }
    }
    return out
}
h = e = null

sheet = function (name, features = [], rows = 4, cls = editor)
{
    var _38_23_

    global.ked_session = ((_38_23_=global.ked_session) != null ? _38_23_ : {get:(function ()
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
    e.state.setSheetTree(lined(tree))
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
            tree = lined({bg:'#333',children:[{text:'hi',x:1,y:1,w:3,h:1}]})
            layout.titlify({cols:10,rows:5},tree)
            layout.sueify({cols:10,rows:5},tree)
            compare(noon.parse(layout.sourceOf(tree)),{bg:'#333',children:[{text:'md',lines:['hi'],x:1,y:1,w:3,h:1}]})
            tree = {bg:'#333'}
            layout.addTextNode({cols:10,rows:5},tree,[2,1],'a')
            compare(noon.parse(layout.sourceOf(tree)),{bg:'#333',children:[{text:'md',lines:['a'],x:2,y:1,w:2,h:1}]})
            tree = {children:[{text:'kode',lines:['a','    b','','c'],x:0,y:0,w:9,h:4}]}
            layout.sueify({cols:10,rows:5},tree)
            compare(tree.children[0].state.syntax.ext,'kode')
            compare(noon.parse(layout.sourceOf(tree)).children[0],{text:'kode',lines:['a','    b','','c'],x:0,y:0,w:9,h:4})
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
    await section("addTextNode", async function ()
    {
        tree = {}
        compare(layout.addTextNode({cols:10,rows:5},tree,[3,2],'a') === tree.children[0],true)
        compare(sds.get(tree,'children.0'),{text:'md',lines:['a'],x:3,y:2,w:2,h:1})
        tree = {pattern:'x',x:1,y:1,w:6,h:3}
        layout.addTextNode({cols:10,rows:5},tree,[3,2],'a')
        compare(sds.get(tree,'children.0'),{text:'md',lines:['a'],x:2,y:1,w:2,h:1})
        tree = {x:2,y:2,w:4,h:2}
        layout.addTextNode({cols:10,rows:10},tree,[8,8],'ab\nc')
        compare(sds.get(tree,'children.0'),{text:'md',lines:['ab','c'],x:6,y:6,w:3,h:1})
        compare((layout.addTextNode({cols:8,rows:2},null,[0,0],'X') != null),false)
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
        await section("bands", async function ()
        {
            compare(fill.bands({scale:2},[[0,0,6],[0,1,2],[4,1,6]],{x:0,y:0,w:6,h:2}),[[0,0,2],[0,4,6]])
            compare(fill.bands({scale:2},[[0,0,4],[0,1,4],[0,2,4]],{x:0,y:0,w:4,h:3}),[[0,0,4]])
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
01  longer text that        89
01  flows ans  o  m  e  d   89
01  flows an            d   89
01  flows an            d   89
01  flows into the sea.     89
01                          89
01                          89
01  longer text that        89
01  s  o  m  e  flows and   89
01              flows and   89
01              flows and   89
01  flows into the sea.     89
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
01  and                34
01  flows              34
01  and flows and      34
01                     34
01                     34
0123longer text that 1234
0123flows and flows  1234`)
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
    await section("repaint", async function ()
    {
        cells = {cols:12,rows:8}
        tree = lined({bg:'#111',children:[{pattern:'.',x:0,y:0,w:12,h:8,children:[{erase:'char',x:0,y:6,w:3,h:1}]},{text:'abc def',x:1,y:1,w:4,h:3,fg:'#f00'},{text:'XY',x:3,y:2,w:6,h:4,scale:2},{text:'z',x:9,y:6,w:3,h:2}]})
        full = function ()
        {
            return layout.sheetData(cells,layout.liveNode(layout.plainNode(tree)))
        }
        layout.sheetData(cells,tree)
        node = tree.children[1]
        node.state.setCursors([[3,0]])
        node.state.insert('QQ')
        top = tree.rows[0]
        low = tree.rows[7]
        compare(layout.sheetData(cells,tree,[1,2,3]),full())
        compare(tree.rows[0] === top,true)
        compare(tree.rows[7] === low,true)
        node = tree.children[3]
        node.state.setCursors([[1,0]])
        node.state.insert('w\nv\nu')
        projector.scrollToCursor(node)
        compare(layout.sheetData(cells,tree,[6,7]),full())
        node.state.setCursors([[0,0]])
        projector.scrollToCursor(node)
        compare(layout.sheetData(cells,tree,[6,7]),full())
        tree.children[2].state.setCursors([[0,0]])
        tree.children[2].state.insert('a b')
        compare(layout.sheetData(cells,tree,[3]),full())
        compare(tree.rows.length,8)
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
        compare(node.state.syntax.ext,'md')
        compare((node.lines != null),false)
        compare((layout.plainNode(node).state != null),false)
        compare(layout.plainNode(node).s === node.state.s,true)
        compare(layout.dataNode(node),{text:'md',lines:['abcdef','xy'],x:1,y:1,w:4,h:4})
        node = textnode({cols:4,rows:2},{text:'ab cd',x:0,y:0,w:4,h:2})
        compare(node.state.wrapStarts(0),[0,3])
        node = textnode({cols:4,rows:2},{text:'abcdefghij',x:0,y:0,w:4,h:2})
        node.state.setCursors([[10,0]])
        projector.scrollToCursor(node)
        compare(projector.glyphs(node),[[0,0,'e'],[1,0,'f'],[2,0,'g'],[3,0,'h'],[0,1,'i'],[1,1,'j']])
        compare(projector.cellOf(node,[10,0]),[2,1])
        compare((projector.cellOf(node,[0,0]) != null),false)
        compare(projector.posAt(node,[0,0]),[4,0])
        node.state.setCursors([[1,0]])
        projector.scrollToCursor(node)
        compare(projector.cellOf(node,[1,0]),[1,0])
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
        compare(txt('children.0'),'a')
        compare(rt('children.0.rect.abs'),{x:2,y:1,w:2,h:1})
        e.state.insert('b')
        e.draw()
        compare(mc(),[4,1])
        compare(h.at(3,1),'b')
        compare(txt('children.0'),'ab')
        compare(rt('children.0.w'),3)
        loadSheet({children:[{x:2,y:1,w:6,h:2}]})
        e.state.setCursors([[5,2]])
        e.state.insert('c')
        compare(layout.dataNode(rt('children.0.children.0')),{text:'md',lines:['c'],x:3,y:1,w:2,h:1})
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
        compare(txt('children.0'),'a')
        key('ctrl+alt+entf')
        compare(txt('children.0'),'c')
        compare(rt('children').length,1)
        e.state.setCursors([[12,3]])
        key('ctrl+alt+delete')
        compare(rt('children').length,1)
        e.state.deleteSheetNode(rt('children.0'))
        compare((rt('children') != null),false)
        e.state.undo()
        compare(txt('children.0'),'c')
        se = new sheeditor(h.screen,e,'popo_sheeditor')
        se.show()
        se.layout(0,0,16,4)
        se.sheetree.reloadTree()
        se.sheetree.select(0)
        compare(content(se.sheetree.current()),'c')
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
        compare(txt('children.0.children.0'),'a')
        e.state.undo()
        compare((rt('children.0.children') != null),false)
        e.state.redo()
        compare(txt('children.0.children.0'),'a')
    })
    await section("sheet views", async function ()
    {
        sheet('popo_sheet_views',['susan'])
        e.grabFocus()
        loadSheet({children:[{text:'abcdefghij',x:0,y:0,w:4,h:2}]})
        node = function ()
        {
            return rt('children.0')
        }
        e.state.setCursors([[3,1]])
        key('shift+down')
        compare(node().state.s.scrollOffset,1)
        e.draw()
        compare(h.at(0,0),'e')
        compare(mc(),[3,1])
        key("ctrl+alt+'")
        compare(rt('children.0.h'),3)
        compare(node().state.s.scrollOffset,0)
        e.draw()
        compare(h.at(0,0),'a')
        compare(mc(),[3,1])
        key('ctrl+alt+/')
        key('ctrl+alt+/')
        compare(rt('children.0.h'),1)
        compare(mc(),[3,0])
        e.state.setCursors([[1,0]])
        key('shift+down')
        compare(node().state.s.scrollOffset,1)
        e.draw()
        compare(h.at(0,0),'e')
        key('shift+alt+=')
        compare(rt('children.0.scale'),2)
        compare(node().state.s.scrollOffset,0)
        compare(node().state.s.view,[0,0])
    })
    await section("sheet layout undo", async function ()
    {
        sheet('popo_sheet_layout_undo',['susan'])
        e.grabFocus()
        loadSheet({children:[{text:'abc def',x:1,y:0,w:4,h:2}]})
        compare(kseg.str(e.state.s.lines[0]).trimEnd(),' abc')
        e.state.setCursors([[2,0]])
        e.state.insert('X')
        compare(txt('children.0'),'aXbc def')
        key('ctrl+alt+.')
        compare(rt('children.0.w'),5)
        key('shift+alt+l')
        compare(rt('children.0.x'),2)
        key('shift+alt+=')
        compare(rt('children.0.scale'),2)
        e.state.setCursors([[0,3]])
        e.state.insert('n')
        compare(rt('children').length,2)
        e.state.deleteSheetNode(rt('children.0'))
        compare(rt('children').length,1)
        compare(txt('children.0'),'n')
        e.state.undo()
        compare(rt('children').length,2)
        compare(txt('children.0'),'aXbc def')
        compare(txt('children.1'),'n')
        e.state.undo()
        compare(rt('children').length,1)
        e.state.undo()
        compare((rt('children.0.scale') != null),false)
        compare(rt('children.0.x'),2)
        e.state.undo()
        compare(rt('children.0.x'),1)
        compare(rt('children.0.w'),5)
        e.state.undo()
        compare(rt('children.0.w'),4)
        compare(txt('children.0'),'aXbc def')
        e.state.undo()
        compare(txt('children.0'),'abc def')
        compare(kseg.str(e.state.s.lines[0]).trimEnd(),' abc')
        e.state.redo()
        compare(txt('children.0'),'aXbc def')
        e.state.redo()
        e.state.redo()
        e.state.redo()
        compare(rt('children.0.scale'),2)
        compare(rt('children.0.x'),2)
        e.state.redo()
        compare(rt('children').length,2)
        e.state.redo()
        compare(rt('children').length,1)
        compare(txt('children.0'),'n')
        e.state.undo()
        e.state.setCursors([[2,1]])
        e.state.insert('Y')
        compare(txt('children.0'),'YaXbc def')
        compare(e.state.hasRedo(),false)
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
        compare(txt('children.0.children.0'),'a')
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
        compare(txt('children.1'),'zy')
        compare((rt('children') != null ? rt('children').length : undefined),2)
        compare(e.state.mainCursor(),[8,1])
        e.state.setCursors([[3,1]])
        e.state.insert('C')
        compare(txt('children.0'),'ABC')
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
        key('alt+w')
        loadSheet({children:[{text:'ab',x:0,y:0,w:4,h:2,scale:2}]})
        compare(e.state.isWrapped(1),false)
        compare(e.state.hasWrap(),false)
        compare(e.state.lineHeight(1),1)
        compare(e.state.scaleRunsForLine(1),[[0,2,2]])
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
        compare(txt('children.0'),'abcdef')
        compare(mc(),[2,1])
        e.state.setCursors([[3,1]])
        key('delete')
        compare(txt('children.0'),'bcdef')
        compare(mc(),[2,1])
        e.state.setCursors([[2,2]])
        key('delete')
        compare(txt('children.0'),'bcef')
        compare(mc(),[4,1])
        e.state.setCursors([[3,2]])
        key('delete')
        compare(txt('children.0'),'bce')
        compare(mc(),[4,1])
        key('delete')
        compare(txt('children.0'),'bc')
        compare(mc(),[4,1])
        e.state.setCursors([[10,3]])
        key('delete')
        compare(txt('children.0'),'bc')
        compare(mc(),[10,3])
        e.state.undo()
        compare(txt('children.0'),'bce')
        loadSheet({children:[{text:'ab\ncd',x:2,y:1,w:4,h:2}]})
        e.state.setCursors([[2,2]])
        key('delete')
        compare(txt('children.0'),'abcd')
        compare(mc(),[4,1])
        loadSheet({children:[{text:'abcd',x:2,y:0,w:4,h:4,scale:2}]})
        e.state.setCursors([[2,3]])
        key('delete')
        compare(txt('children.0'),'acd')
        compare(mc(),[3,1])
        loadSheet({children:[{text:'ab',x:2,y:1,w:3,h:2}]})
        e.state.setCursors([[4,1]])
        e.state.insert('c')
        compare(txt('children.0'),'abc')
        compare(mc(),[4,1])
        e.state.insert('d')
        compare(txt('children.0'),'abcd')
        compare(mc(),[3,2])
        e.state.setCursors([[3,1]])
        e.state.insert('X')
        compare(txt('children.0'),'aXbcd')
        compare(mc(),[4,1])
        e.state.insert('Y')
        compare(txt('children.0'),'aXYbcd')
        compare(mc(),[2,2])
        h.key(e,'return','\n')
        compare(strs(rt('children.0')),['aXY','bcd'])
        compare(mc(),[2,2])
        loadSheet({children:[{text:'ab',x:2,y:1,w:2,h:1}]})
        e.state.setCursors([[4,1]])
        e.state.insert('c')
        compare(txt('children.0'),'abc')
        compare(rt('children').length,1)
        compare(mc(),[3,1])
        e.draw()
        compare(h.at(2,1),'c')
        e.state.setCursors([[2,1]])
        e.draw()
        compare(h.at(2,1),'c')
        key('up')
        compare(rt('children.0').state.s.scrollOffset,0)
        e.draw()
        compare(h.at(2,1),'a')
        e.state.setCursors([[3,1]])
        key('right')
        compare(mc(),[4,1])
        compare(h.at(2,1),'a')
        loadSheet({children:[{text:'ab',x:2,y:0,w:6,h:4,scale:2}]})
        e.state.setCursors([[4,1]])
        e.state.insert('c')
        compare(txt('children.0'),'abc')
        compare(mc(),[4,1])
    })
    await section("sheet selection", async function ()
    {
        sheet('popo_sheet_select')
        e.grabFocus()
        sel = function ()
        {
            return rt('children.0').state.textOfSelection()
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
        compare(txt('children.0'),'X')
        compare(e.state.s.selections,[])
        compare(mc(),[3,1])
        e.state.undo()
        compare(txt('children.0'),'abcdef')
        key('esc')
        e.state.setCursors([[3,1]])
        key('shift+right')
        key('shift+right')
        compare(sel(),'b')
        key('shift+left')
        compare(sel(),'')
        key('shift+down')
        compare(sel(),'bcd')
        compare(e.state.s.selections,[[3,1,5,1],[2,2,3,2]])
        e.state.insert('Y')
        compare(txt('children.0'),'aYef')
        compare(mc(),[4,1])
        loadSheet({children:[{text:'abcdef',x:2,y:1,w:3,h:3}]})
        e.state.setCursors([[5,2]])
        key('shift+left')
        key('shift+up')
        compare(sel(),'cdef')
        key('delete')
        compare(txt('children.0'),'ab')
        compare(e.state.s.selections,[])
        e.state.undo()
        compare(txt('children.0'),'abcdef')
        compare(sel(),'cdef')
        key('esc')
        e.state.setCursors([[3,1]])
        key('entf')
        compare(txt('children.0'),'acdef')
        compare(mc(),[3,1])
        e.state.setCursors([[2,2]])
        key('shift+right')
        key('entf')
        compare(txt('children.0'),'acdf')
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
        e.state.setCursors([[4,1]])
        key('shift+left')
        key('shift+left')
        e.state.cut()
        compare(board,'ac')
        compare(txt('children.0'),'df')
        e.state.setCursors([[3,1]])
        e.state.paste()
        compare(txt('children.0'),'dacf')
        e.state.setCursors([[12,3]])
        e.state.cut()
        compare(txt('children.0'),'dacf')
        clip.copy = savedCopy
        clip.paste = savedPaste
    })
    await section("sheet multi", async function ()
    {
        sheet('popo_sheet_multi',[],8)
        e.grabFocus()
        loadSheet({children:[{text:'foo bar',x:0,y:0,w:8,h:2},{text:'bar foo',x:0,y:3,w:8,h:2}]})
        e.state.setCursors([[1,0]])
        key('alt+cmd+d')
        compare(e.state.s.highlights,[[0,0,3],[4,3,7]])
        compare(e.state.s.cursors.length,1)
        key('alt+cmd+d')
        compare(e.state.s.cursors,[[3,0],[7,3]])
        compare(e.state.s.selections,[[0,0,3,0],[4,3,7,3]])
        h.key(e,'X','X')
        compare(txt('children.0'),'X bar')
        compare(txt('children.1'),'bar X')
        compare(e.state.s.cursors,[[1,0],[5,3]])
        key('esc')
        compare(e.state.s.cursors,[[1,0]])
        h.key(e,'Y','Y')
        compare(txt('children.0'),'XY bar')
        compare(txt('children.1'),'bar X')
        e.state.undo()
        e.state.undo()
        compare(txt('children.0'),'foo bar')
        compare(txt('children.1'),'bar foo')
        loadSheet({children:[{text:'abc\ndef\nghi',x:1,y:0,w:4,h:3}]})
        e.state.setCursors([[1,0]])
        key('cmd+down')
        key('cmd+down')
        compare(e.state.s.cursors,[[1,0],[1,1],[1,2]])
        lines = e.state.s.lines
        undos = e.state.h.length
        key('shift+right')
        key('shift+right')
        compare(e.state.s.selections,[[1,0,3,0],[1,1,3,1],[1,2,3,2]])
        compare(e.state.s.lines === lines,true)
        compare(e.state.h.length,undos)
        row = e.state.s.lines[6]
        painted = e.state.rectree.rows[6]
        h.key(e,'X','X')
        compare(e.state.s.lines[6] === row,true)
        compare(e.state.s.lines === lines,false)
        compare(e.state.rectree.rows[6] === painted,true)
        compare(strs(rt('children.0')),['Xc','Xf','Xi'])
        compare(e.state.s.cursors,[[2,0],[2,1],[2,2]])
        loadSheet({children:[{text:'abcdefgh',x:0,y:0,w:3,h:3}]})
        e.state.setCursors([[1,0]])
        key('cmd+down')
        compare(e.state.s.cursors,[[1,0],[1,1]])
        key('down')
        compare(e.state.s.cursors,[[1,1],[1,2]])
        key('right')
        compare(e.state.s.cursors,[[2,1],[2,2]])
        key('right')
        compare(e.state.s.cursors,[[2,1],[2,2]])
        key('up')
        compare(e.state.s.cursors,[[2,0],[2,1]])
        key('left')
        key('left')
        key('left')
        compare(e.state.s.cursors,[[0,0],[0,1]])
        key('esc')
        compare(e.state.s.cursors.length,1)
        key('down')
        compare(e.state.s.cursors.length,1)
        loadSheet({children:[{text:'abcd',x:2,y:0,w:4,h:4,scale:2}]})
        e.state.setCursors([[2,1]])
        key('cmd+down')
        compare(e.state.s.cursors,[[2,1],[2,3]])
        compare(e.state.scaleRunsForLine(3),[[2,4,2]])
        loadSheet({children:[{text:'ab\ncd',x:0,y:0,w:4,h:2}]})
        e.state.setCursors([[0,0]])
        key('cmd+down')
        compare(e.state.s.cursors.length,2)
        e.state.setCursors([[3,1]])
        key('right')
        compare(e.state.s.cursors,[[4,1]])
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
        compare(content(se.sheetree.current()),'z')
        e.state.insert('x')
        compare(se.sheetree.current() === rt('children.1'),true)
        compare(txt('children.1'),'zx')
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
        compare(content(se.sheetree.current()),'q')
        compare(mc(),[10,4])
        se.onKey('entf',h.event('entf'))
        compare(rt('children').length,1)
        compare(content(se.sheetree.current()),'abc')
        compare(mc(),[2,1])
        se.onKey('ctrl+alt+delete',h.event('ctrl+alt+delete'))
        compare((rt('children') != null),false)
        se.sheetree.grabFocus()
        se.onKey('cmd+z',h.event('cmd+z'))
        compare(txt('children.0'),'abc')
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
        compare(content(se.sheetree.current()),'q')
        undo()
        compare(rt('children').length,3)
        compare(content(se.sheetree.current()),'q')
        compare(se.sheetree.currentIndex(),2)
        loadSheet({children:[{pattern:'.',x:0,y:0,w:8,h:3}]})
        se.sheetree.reloadTree()
        e.state.setCursors([[2,1]])
        e.state.insert('x')
        se.sheetree.select(1)
        compare(content(se.sheetree.current()),'x')
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
        compare(JSON.parse(board),{text:'md',lines:['z'],x:10,y:0,w:2,h:1,children:[{bg:'#f00',x:0,y:0,w:1,h:1}]})
        se.sheetree.select(0)
        cmd('cmd+v')
        compare(rt('children').length,2)
        compare(txt('children.0.children.0'),'z')
        compare(rt('children.0.children.0.children.0.bg'),'#f00')
        compare(se.sheetree.current() === rt('children.0.children.0'),true)
        se.sheetree.select(0)
        cmd('cmd+x')
        compare(rt('children').length,1)
        compare(JSON.parse(board).lines,['abc'])
        compare(content(se.sheetree.current()),'z')
        cmd('ctrl+v')
        compare(rt('children').length,1)
        compare(txt('children.0.children.1'),'abc')
        compare(txt('children.0.children.1.children.0'),'z')
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
                return content(n)
            })
        }
        rect = function (text)
        {
            return se.sheetree.fuzzied.find(function (n)
            {
                return content(n) === text
            }).rect.abs
        }
        loadSheet({children:[{text:'a',x:0,y:0,w:2,h:1},{text:'b',x:4,y:1,w:8,h:4,children:[{text:'c',x:1,y:1,w:2,h:1},{text:'e',x:'50%',y:2,r:1,b:1}]},{text:'d',x:14,y:0,w:2,h:1}]})
        se.sheetree.reloadTree()
        se.sheetree.grabFocus()
        se.sheetree.select(0)
        cmd('alt+down')
        compare(order(),['b','a','c','e','d'])
        compare(txt('children.0.children.0'),'a')
        compare(rt('children.0.children.0.x'),-4)
        cmd('alt+down')
        compare(order(),['b','c','a','e','d'])
        cmd('alt+down')
        compare(order(),['b','c','e','a','d'])
        cmd('alt+down')
        compare(order(),['b','c','e','a','d'])
        compare(txt('children.1'),'a')
        compare(rect('a'),{x:0,y:0,w:2,h:1})
        cmd('alt+down')
        compare(order(),['b','c','e','d','a'])
        cmd('alt+down')
        compare(order(),['b','c','e','d','a'])
        cmd('alt+up')
        compare(order(),['b','c','e','a','d'])
        cmd('alt+up')
        compare(order(),['b','c','e','a','d'])
        compare(txt('children.0.children.2'),'a')
        cmd('alt+up')
        compare(order(),['b','c','a','e','d'])
        compare(content(se.sheetree.current()),'a')
        se.sheetree.select(1)
        compare(rect('c'),{x:5,y:2,w:2,h:1})
        cmd('alt+up')
        compare(order(),['c','b','a','e','d'])
        compare(rect('c'),{x:5,y:2,w:2,h:1})
        se.sheetree.select(3)
        compare(rect('e'),{x:8,y:3,w:3,h:1})
        cmd('alt+down')
        compare(order(),['c','b','a','e','d'])
        compare(txt('children.2'),'e')
        compare(rect('e'),{x:8,y:3,w:3,h:1})
        undo()
        compare(txt('children.1.children.1'),'e')
        loadSheet({bg:'#333',children:[{text:'c',x:1,y:1,w:2,h:1}]})
        se.sheetree.reloadTree()
        se.sheetree.grabFocus()
        layouts = function ()
        {
            return se.sheetree.fuzzied.map(function (n)
            {
                var _1305_58_

                return ((n.text != null) ? content(n) : n.bg)
            })
        }
        compare(layouts(),['#333','c'])
        se.sheetree.select(1)
        cmd('alt+up')
        compare(layouts(),['c','#333'])
        compare(txt('children.0'),'c')
        compare((rt('children.1.children') != null),false)
        cmd('alt+up')
        compare(layouts(),['c','#333'])
        se.sheetree.select(1)
        cmd('delete')
        compare(layouts(),['c'])
        compare(noon.parse(layout.sourceOf(e.state.rectree)),{children:[{text:'md',lines:['c'],x:1,y:1,w:2,h:1}]})
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
        compare(txt('children.0'),'z')
    })
    await section("sheet mouse", async function ()
    {
        sheet('popo_sheet_mouse',[],8,fileeditor)
        mouse = function (type, x, y, opt = {})
        {
            return e.onMouse(Object.assign({type:type,cell:[x + e.cells.x,y + e.cells.y],button:'left',count:1},opt))
        }
        sel = function ()
        {
            return rt('children.0').state.textOfSelection()
        }
        loadSheet({children:[{text:'foo bar\nbaz',x:1,y:1,w:8,h:3},{text:'qux',x:1,y:5,w:4,h:1}]})
        mouse('press',1,1)
        mouse('drag',4,1)
        mouse('release',4,1)
        compare(sel(),'foo')
        compare(e.state.s.selections,[[1,1,4,1]])
        compare(mc(),[4,1])
        mouse('press',5,1)
        mouse('drag',3,2)
        mouse('release',3,2)
        compare(sel(),'bar\nba')
        compare(mc(),[3,2])
        mouse('press',6,6)
        compare(sel(),'')
        compare(e.state.s.selections,[])
        compare(mc(),[6,6])
        mouse('press',1,1)
        mouse('press',4,1,{shift:true})
        compare(sel(),'foo')
        compare(mc(),[4,1])
        mouse('press',6,1,{count:2})
        compare(sel(),'bar')
        compare(e.state.s.highlights,[[5,1,8]])
        mouse('press',2,2,{count:3})
        compare(sel(),'baz')
        mouse('press',2,1)
        mouse('press',2,2,{alt:true})
        compare(e.state.s.cursors,[[2,1],[2,2]])
        mouse('press',2,5,{alt:true})
        compare(e.state.s.cursors,[[2,1],[2,2],[2,5]])
        h.key(e,'X','X')
        compare(strs(rt('children.0')),['fXoo bar','bXaz'])
        compare(txt('children.1'),'qXux')
        compare(dumpstate.textCursors(e.state),'text 1 · 1 cursor · 2:0')
        mouse('press',6,6)
        compare(e.state.s.cursors.length,1)
        h.key(e,'Y','Y')
        compare(txt('children.1'),'qXux')
        mouse('press',1,1)
        mouse('press',1,2,{alt:true})
        compare(dumpstate.textCursors(e.state),'text 0 · 2 cursors · 0:0 0:1')
        mode.modes.brckts = brckts
        e.state.allowedModes.brckts = true
        e.state.startMode('brckts')
        mouse('press',2,1)
        mouse('drag',5,1)
        mouse('release',5,1)
        h.key(e,'(','(')
        compare(strs(rt('children.0')),['f(Xoo) bar','bXaz'])
        e.state.stopMode('brckts')
        mouse('press',2,3)
        mouse('drag',4,3)
        mouse('release',4,3)
        h.key(e,'(','(')
        compare(strs(rt('children.0')),['f(Xoo) bar','b(z'])
    })
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQW1CLFVBQVQ7T0FBYSxXQUFiO09BQWtCLFdBQWxCOztPQUNBLFVBQUE7SUFBUztJQUFLOztPQUNMLFVBQVA7O09BQ08sYUFBWjtPQUFtQixXQUFuQjtPQUF3QixnQkFBeEI7O09BQ1ksYUFBWjtPQUFtQixXQUFuQjs7T0FDWSxhQUFOOztPQUNRLGlCQUFUOztPQUNTLGdCQUFUOztPQUNPLGNBQVo7T0FBb0IsZ0JBQXBCOzs7QUFFUCxrQkFBVSxPQUFNOztXQUFRLE9BQU8sV0FBVyxNQUFNOzs7QUFDaEQsb0JBQVUsT0FBTTs7V0FBUSxNQUFNLE1BQU0sTUFBTTs7O0FBQzFDLGlCQUFVLE9BQU0sTUFBSzs7V0FBUSxJQUFJLElBQUksT0FBTyxVQUFVLE1BQU0sTUFBTTs7O0FBQ2xFLGdCQUFVLE9BQU07O1dBQVEsT0FBTyxZQUFZLE9BQU8sVUFBVSxNQUFNLE1BQU07OztBQUN4RSxrQkFBVSxPQUFNOztXQUFRLElBQUksTUFBTSxPQUFPLE9BQU8sTUFBTSxNQUFNOzs7QUFDNUQsa0JBQVUsTUFBSzs7V0FBUSxLQUFLLElBQUksaUJBQVE7O2VBQVMsS0FBSyxNQUFNLE9BQU07Ozs7QUFDbEUscUJBQVcsT0FBTTs7V0FBUSxVQUFVLE9BQU8sT0FBTyxVQUFVLE9BQU8sVUFBVSxNQUFNLFVBQVUsU0FBUzs7O0FBQ3JHLGlCQUFVOztXQUFRLEtBQUssTUFBTSxFQUFFLE1BQU0sY0FBSzs7ZUFBTSxLQUFLLElBQUk7Ozs7QUFDekQsb0JBQVU7O1dBQVEsVUFBVSxPQUFPOzs7QUFDbkMsZ0JBQVU7O1dBQVEsUUFBUSxHQUFHOzs7QUFFN0Isa0JBQVE7Ozs7VUFDVSxpQkFBUyxPQUFPLFVBQVM7O2VBQXJDOztJQUNGO1NBQ0ksS0FBTzs7UUFBTCxJQUFLO1lBQ0osTUFBSzs7WUFDSixJQUFJLFdBQVcsRUFBRSxJQUFJOztpQkFDakIsTUFB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QUcsS0FBSztnQkFDdEIsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFM0QsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTs7OztnQkFJM0UsU0FBUyxLQUFLLEdBQUcsS0FBSztnQkFDdEIsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFFdEUsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDM0UsT0FBTyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBNkIsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTs7Ozs7OztnQkFNM0UsU0FBUyxLQUFLLEdBQUcsS0FBSztnQkFDdEIsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFM0QsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTs7OztnQkFJakYsU0FBUyxLQUFLLEdBQUcsS0FBSztnQkFDdEIsT0FBTyxNQUFNLE9BQVEsV0FBWSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFFNUQsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxTQUFTLEdBQUcsRUFBSTtnQkFDakYsT0FBTyxXQUFXLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztnQkFBaUMsUUFBbkIsS0FBSyxT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
//# sourceURL=../../../kode/ked/test/popo.kode
