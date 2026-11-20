var toExport = {}
var again, container, containerTitle, data, dmp, e, fg, h, node, regions, res, runs, source, text, tree, _213_40_

import kxk from "../../kxk.js"
let sds = kxk.sds
let noon = kxk.noon

import layout from "../popo/layout.js"
import fill from "../popo/fill.js"

import editor from "../edit/editor.js"

import sue from "../edit/tool/sue.js"

import harness from "../util/harness.js"

toExport["popo"] = async function ()
{
    await section("layout", async function ()
    {
        await section("absolutize", async function ()
        {
            await section("percentages", async function ()
            {
                tree = {x:'20%',y:'10%',r:'20%',b:'10%'}
                layout.absolutize({cols:100,rows:50},tree)
                compare(tree.rect,{abs:{x:20,y:5,w:60,h:40},rel:{x:20,y:5,w:60,h:40}})
                tree = {x:'20%',y:'20%',r:'20%',b:'20%'}
                layout.absolutize({cols:10,rows:5},tree)
                compare(tree.rect,{abs:{x:2,y:1,w:6,h:3},rel:{x:2,y:1,w:6,h:3}})
                tree = {x:'20%',y:'20%',w:'60%',h:'60%'}
                layout.absolutize({cols:10,rows:5},tree)
                compare(tree.rect,{abs:{x:2,y:1,w:6,h:3},rel:{x:2,y:1,w:6,h:3}})
                tree = {x:10,y:10,w:'100%',h:'100%',children:[{x:'50%',y:'50%',w:'50%',h:'25%'}]}
                layout.absolutize({cols:100,rows:100},tree)
                compare(tree.rect,{abs:{x:10,y:10,w:90,h:90},rel:{x:10,y:10,w:90,h:90}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:55,y:55,w:45,h:22},rel:{x:45,y:45,w:45,h:22}})
            })
            await section("cells", async function ()
            {
                tree = {x:3,y:4,w:20,h:10}
                layout.absolutize({cols:100,rows:50},tree)
                compare(tree.rect,{abs:{x:3,y:4,w:20,h:10},rel:{x:3,y:4,w:20,h:10}})
                tree = {x:3,y:4,r:7,b:6}
                layout.absolutize({cols:100,rows:50},tree)
                compare(tree.rect,{abs:{x:3,y:4,w:90,h:40},rel:{x:3,y:4,w:90,h:40}})
                tree = {x:'3',y:'4',w:'20',h:'10'}
                layout.absolutize({cols:100,rows:50},tree)
                compare(tree.rect,{abs:{x:3,y:4,w:20,h:10},rel:{x:3,y:4,w:20,h:10}})
                tree = {x:3,y:'10%',w:20,h:'20%'}
                layout.absolutize({cols:100,rows:50},tree)
                compare(tree.rect,{abs:{x:3,y:5,w:20,h:10},rel:{x:3,y:5,w:20,h:10}})
            })
            await section("nesting", async function ()
            {
                tree = {x:1,y:1,w:10,h:10,children:[{x:1,y:1,w:'50%',h:'50%'},{x:0,y:'60%',w:4,h:2}]}
                layout.absolutize({cols:20,rows:20},tree)
                compare(tree.rect,{abs:{x:1,y:1,w:10,h:10},rel:{x:1,y:1,w:10,h:10}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:2,y:2,w:5,h:5},rel:{x:1,y:1,w:5,h:5}})
                compare(sds.get(tree,'children.1.rect'),{abs:{x:1,y:7,w:4,h:2},rel:{x:0,y:6,w:4,h:2}})
                tree = {x:0,y:0,w:'50%',h:'50%',children:[{x:'50%',y:'50%',w:'50%',h:'50%',children:[{x:0,y:0,w:'50%',h:'50%'}]}]}
                layout.absolutize({cols:100,rows:100},tree)
                compare(tree.rect,{abs:{x:0,y:0,w:50,h:50},rel:{x:0,y:0,w:50,h:50}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:25,y:25,w:25,h:25},rel:{x:25,y:25,w:25,h:25}})
                compare(sds.get(tree,'children.0.children.0.rect'),{abs:{x:25,y:25,w:12,h:12},rel:{x:0,y:0,w:12,h:12}})
                tree = {x:8,y:0,w:'100%',h:10,children:[{x:'50%',y:0,w:'50%',h:2}]}
                layout.absolutize({cols:10,rows:10},tree)
                compare(tree.rect,{abs:{x:8,y:0,w:2,h:10},rel:{x:8,y:0,w:2,h:10}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:9,y:0,w:1,h:2},rel:{x:1,y:0,w:1,h:2}})
                tree = {x:1,y:1,w:18,h:8,children:[{x:0,y:0,w:'50%',h:3,children:[{x:1,y:1,w:'50%',h:2}]},{x:'50%',y:0,w:'50%',h:3}]}
                layout.absolutize({cols:20,rows:20},tree)
                compare(tree.rect,{abs:{x:1,y:1,w:18,h:8},rel:{x:1,y:1,w:18,h:8}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:1,y:1,w:9,h:3},rel:{x:0,y:0,w:9,h:3}})
                compare(sds.get(tree,'children.0.children.0.rect'),{abs:{x:2,y:2,w:4,h:2},rel:{x:1,y:1,w:4,h:2}})
                compare(sds.get(tree,'children.1.rect'),{abs:{x:10,y:1,w:9,h:3},rel:{x:9,y:0,w:9,h:3}})
            })
            await section("no space", async function ()
            {
                tree = {x:0,y:0,w:10,h:5,children:[{x:20,y:20,w:5,h:5}]}
                layout.absolutize({cols:10,rows:5},tree)
                compare(tree.rect,{abs:{x:0,y:0,w:10,h:5},rel:{x:0,y:0,w:10,h:5}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:10,y:5,w:0,h:0},rel:{x:10,y:5,w:0,h:0}})
                tree = {x:0,y:0,w:10,h:5,children:[{x:8,y:3,w:5,h:5}]}
                layout.absolutize({cols:10,rows:5},tree)
                compare(sds.get(tree,'children.0.rect'),{abs:{x:8,y:3,w:2,h:2},rel:{x:8,y:3,w:2,h:2}})
                tree = {x:0,y:0,w:0,h:0,children:[{x:1,y:1,w:3,h:3}]}
                layout.absolutize({cols:10,rows:5},tree)
                compare(tree.rect,{abs:{x:0,y:0,w:0,h:0},rel:{x:0,y:0,w:0,h:0}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:0,y:0,w:0,h:0},rel:{x:0,y:0,w:0,h:0}})
                tree = {x:2,y:2,w:6,h:4,children:[{x:-2,y:-1,w:'100%',h:'100%'}]}
                layout.absolutize({cols:10,rows:10},tree)
                compare(tree.rect,{abs:{x:2,y:2,w:6,h:4},rel:{x:2,y:2,w:6,h:4}})
                compare(sds.get(tree,'children.0.rect'),{abs:{x:2,y:2,w:6,h:4},rel:{x:0,y:0,w:6,h:4}})
                tree = {x:0,y:0,w:5,h:5,children:[]}
                layout.absolutize({cols:10,rows:5},tree)
                compare(tree.rect,{abs:{x:0,y:0,w:5,h:5},rel:{x:0,y:0,w:5,h:5}})
                compare(tree.children,[])
            })
            await section("permutations", async function ()
            {
                tree = {x:'10%',y:'10%',r:'10%',b:10,children:[{x:4,y:2,w:'50%',b:'20%',children:[{x:'25%',y:3,r:6,h:'25%',children:[{x:2,y:'50%',w:12,h:2,children:[{x:0,y:0,r:'100%',b:'100%'}]}]}]}]}
                layout.absolutize({cols:100,rows:50},tree)
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
                res = layout.nodeForPos({cols:10,rows:5},tree,[6,2])
                compare(res,null)
                res = layout.nodeForPos({cols:10,rows:5},tree,[2,3])
                compare(res,null)
                tree = {x:1,y:1,r:2,b:1}
                res = layout.nodeForPos({cols:10,rows:5},tree,[7,3])
                compare(res.rect.abs,{x:1,y:1,w:7,h:3})
                res = layout.nodeForPos({cols:10,rows:5},tree,[8,3])
                compare(res,null)
            })
            await section("topmost", async function ()
            {
                tree = {bg:'#111',children:[{text:'x',x:1,y:1,w:2,h:2}]}
                res = layout.nodeForPos({cols:4,rows:4},tree,[2,2])
                compare(res.text,'x')
                tree = {children:[{text:'a',x:0,y:0,w:4,h:2},{text:'b',x:2,y:0,w:4,h:2}]}
                res = layout.nodeForPos({cols:6,rows:2},tree,[1,0])
                compare(res.text,'a')
                res = layout.nodeForPos({cols:6,rows:2},tree,[3,0])
                compare(res.text,'b')
                tree = {children:[{text:'outer',x:0,y:0,w:4,h:2,children:[{text:'inner',x:1,y:0,w:2,h:2}]}]}
                res = layout.nodeForPos({cols:4,rows:2},tree,[1,0])
                compare(res.text,'inner')
                res = layout.nodeForPos({cols:4,rows:2},tree,[3,0])
                compare(res.text,'outer')
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
                tree = {children:[{text:'z',x:2,y:2,w:0,h:0}]}
                res = layout.nodeForPos({cols:4,rows:4},tree,[2,2])
                compare(res.rect.abs,{x:0,y:0,w:4,h:4})
                compare(sds.get(res,'children.0.rect.abs'),{x:2,y:2,w:0,h:0})
                node = {index:1,text:'i',x:1,y:1,w:2,h:2}
                res = layout.nodeForPos({cols:4,rows:4},node,[2,2])
                compare(res.index,1)
                compare(res.text,'i')
                compare(res.rect.abs,{x:1,y:1,w:2,h:2})
            })
        })
        await section("titlify", async function ()
        {
            tree = {bg:'#000',x:2,y:2,w:20,h:10,children:[{x:3,y:2,w:10,h:5,children:[{text:'hi',x:1,y:1,w:3,h:1}]}]}
            layout.titlify({cols:30,rows:20},tree)
            compare(tree.title,'  bg')
            compare(tree.rect.abs,{x:2,y:2,w:20,h:10})
            container = sds.get(tree,'children.0')
            containerTitle = (container.title != null)
            compare(containerTitle,false)
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
            source = layout.sourceOf(tree)
            again = noon.parse(source)
            compare(again,{bg:'#333',children:[{text:'hi',x:1,y:1,w:3,h:1}]})
            tree = {bg:'#333'}
            layout.insertTextAt({cols:10,rows:5},tree,[2,1],'a')
            source = layout.sourceOf(tree)
            again = noon.parse(source)
            compare(again,{bg:'#333',children:[{text:'a',x:2,y:1,w:2,h:1}]})
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
            compare(fill.text({text:'abc',scale:2},[[0,0,8]]),['a b c   '])
            compare(fill.text({text:'abcdef',scale:2},[[0,0,5]]),['a b  '])
            compare(fill.text({text:'abcd',scale:2},[[0,0,4],[0,1,4],[0,2,4]]),['a b ','    ','c d '])
            compare(fill.text({text:''},[[0,0,3]]),['   '])
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
            dmp = function (c, r)
            {
                return layout.dumpRegions(layout.regionize(c,r))
            }
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
0123s  o  m  e  flows1234`)
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
1234123412`)
        })
        await section("blocks", async function ()
        {
            tree = {w:10,h:2,children:[{text:'abcdefghij',x:0,y:0,w:10,h:2},{blocks:true,x:3,y:0,w:2,h:2}]}
            regions = layout.regionize({rows:2,cols:10},tree)
            compare(sds.get(regions,'children.0.regions'),[[0,0,3],[5,0,10],[0,1,3],[5,1,10]])
            tree = {blocks:true,x:0,y:0,w:8,h:2,children:[{text:'ab',x:0,y:0,w:8,h:2}]}
            regions = layout.regionize({rows:2,cols:8},tree)
            compare(sds.get(regions,'children.0.regions'),[[0,0,8],[0,1,8]])
            tree = {text:'ab',x:0,y:0,w:8,h:1,flows:false,children:[{blocks:true,x:2,y:0,w:2,h:1}]}
            regions = layout.regionize({rows:1,cols:8},tree)
            compare(sds.get(regions,'regions'),[[0,0,8]])
            tree = {pattern:'x',x:0,y:0,w:6,h:1,children:[{blocks:true,x:2,y:0,w:2,h:1}]}
            regions = layout.regionize({rows:1,cols:6},tree)
            compare(sds.get(regions,'regions'),[[0,0,2],[4,0,6]])
        })
    })
    await section("dump", async function ()
    {
        tree = {text:'abcdefghij',x:0,y:0,w:10,h:2,children:[{blocks:true,x:3,y:0,w:2,h:2}]}
        regions = layout.regionize({rows:2,cols:10},tree)
        compare(layout.dumpRegions(regions),'abc  defgh\nij        ')
        tree = {pattern:'abc',x:0,y:0,w:6,h:2,children:[{erase:'char',x:1,y:0,w:2,h:1}]}
        regions = layout.regionize({rows:2,cols:6},tree)
        compare(layout.dumpRegions(regions),'a  abc\nabcabc')
        tree = {text:'abc',scale:2,x:0,y:0,w:8,h:1}
        regions = layout.regionize({rows:1,cols:8},tree)
        compare(layout.dumpRegions(regions),'a b c   ')
        tree = {w:4,h:1,children:[{pattern:'#.',x:0,y:0,w:4,h:1},{text:'xy',x:1,y:0,w:2,h:1}]}
        regions = layout.regionize({rows:1,cols:4},tree)
        compare(layout.dumpRegions(regions),'#xy.')
    })
    await section("sueify", async function ()
    {
        tree = {bg:'#00f',children:[{text:'hi',x:1,y:1,w:3,h:1,fg:'#ff0'}]}
        data = sue.desue(layout.sueify({cols:8,rows:3},tree))
        compare(data.text,'        \n hi     \n        ')
        compare(data.sue.length,4)
        fg = data.sue.filter(function (area)
        {
            return area.value[0] === sue.FG_COLOR
        })
        compare(fg.length,1)
        compare(fg[0].value,[31,3,1,'#ff0'])
        tree = {children:[{text:'A',x:1,y:1,w:3,h:3,scale:3,fg:'#ff0'}]}
        data = sue.desue(layout.sueify({cols:6,rows:5},tree))
        compare(data.text,'      \n      \n      \n A  \n      ')
        runs = data.sue.filter(function (area)
        {
            return area.value[0] === sue.SCALE
        })
        compare(runs.length,1)
        compare(runs[0].x,1)
        compare(runs[0].y,3)
        compare(runs[0].value[3],3)
        tree = {children:[{text:'A',x:1,y:1,w:3,h:1,scale:3}]}
        data = sue.desue(layout.sueify({cols:6,rows:3},tree))
        compare(data.text,'      \n A    \n      ')
        compare(data.sue.filter(function (area)
        {
            return area.value[0] === sue.SCALE
        }).length,0)
    })
    await section("editor", async function ()
    {
        h = new harness({cols:16,rows:4})
        e = new editor(h.screen,'popo_test_editor',[])
        e.layout(0,0,16,4)
        tree = {bg:'#00f',children:[{text:'hi',x:1,y:1,w:2,h:1,fg:'#ff0'}]}
        data = sue.desue(layout.sueify({cols:16,rows:4},tree))
        e.state.loadLines(data.text.split('\n'))
        e.state.loadSue(data.sue)
        e.draw()
        compare(h.at(1,1),'h')
        compare(h.at(2,1),'i')
        compare(h.screen.get_fg(1,1),[255,255,0])
        compare(h.screen.get_bg(5,0),[0,0,255])
        h.t.textSizing = true
        h.screen.init()
        tree = {children:[{text:'A',x:1,y:1,w:3,h:3,scale:3,fg:'#ff0'}]}
        data = sue.desue(layout.sueify({cols:16,rows:6},tree))
        e.state.loadLines(data.text.split('\n'))
        e.state.loadSue(data.sue)
        e.draw()
        compare(h.at(1,1).includes(']66;s=3'),true)
        compare(h.screen.blockAt(1,1),[1,1,3,1,3])
    })
    await section("sheet typing", async function ()
    {
        h = new harness({cols:16,rows:4})
        e = new editor(h.screen,'popo_sheet_typing',[])
        e.layout(0,0,16,4)
        e.state.loadLines(['                ','                ','                ','                '])
        e.state.rectree = {bg:'#000'}
        e.state.setCursors([[2,1]])
        e.state.insert('a')
        e.draw()
        compare(e.state.mainCursor(),[3,1])
        compare(h.at(2,1),'a')
        compare(sds.get(e.state.rectree,'children.0.text'),'a')
        compare(sds.get(e.state.rectree,'children.0.rect.abs'),{x:2,y:1,w:2,h:1})
        e.state.insert('b')
        e.draw()
        compare(e.state.mainCursor(),[4,1])
        compare(h.at(3,1),'b')
        compare(sds.get(e.state.rectree,'children.0.text'),'ab')
        compare(sds.get(e.state.rectree,'children.0.w'),3)
        e.state.rectree = {x:2,y:1,w:6,h:2}
        e.state.setCursors([[10,3]])
        e.state.insert('c')
        compare(sds.get(e.state.rectree,'children.0.text'),'c')
        compare(sds.get(e.state.rectree,'children.0.x'),8)
        compare(sds.get(e.state.rectree,'children.0.y'),2)
    })
    await section("sheet render size", async function ()
    {
        h = new harness({cols:16,rows:4})
        e = new editor(h.screen,'popo_sheet_render_size',[])
        e.layout(0,0,16,4)
        e.state.loadLines(['                ','                ','                ','                '])
        e.state.rectree = {children:[{pattern:'x',x:'50%',y:0,w:'50%',h:2}]}
        e.state.rectreeCols = 10
        e.state.rectreeRows = 4
        e.state.setCursors([[6,0]])
        e.state.insert('a')
        compare(sds.get(e.state.rectree,'children.0.rect.abs'),{x:5,y:0,w:5,h:2})
        compare(sds.get(e.state.rectree,'children.0.children.0.rect.abs'),{x:6,y:0,w:2,h:1})
    })
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFVLFVBQUE7SUFBTTtJQUFJOztPQUNKLGFBQVQ7T0FBZ0IsV0FBaEI7O09BQ1EsYUFBUjs7T0FDWSxVQUFQOztPQUNHLGNBQVI7Ozs7Ozs7Ozs7Z0JBVVMsUUFBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUNuQyxPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssSUFBSTt3QkFDckMsS0FBSyxNQUFRLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFFM0QsUUFBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUNuQyxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRzt3QkFDbkMsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFdEQsUUFBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUNuQyxPQUFPLFlBQVksS0FBSyxHQUFHLEtBQUssR0FBRzt3QkFDbkMsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFFdEQsUUFBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUMxRSxPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssS0FBSzt3QkFDdEMsS0FBSyxNQUFRLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTt3QkFDN0QsSUFBSSxJQUFJLEtBQUssb0JBQXNCLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTs7OztnQkFJbkYsUUFBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO2dCQUN4QixPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssSUFBSTt3QkFDckMsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFFekQsUUFBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUN2QixPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssSUFBSTt3QkFDckMsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFFekQsUUFBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO2dCQUM5QixPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssSUFBSTt3QkFDckMsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFFekQsUUFBUyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUM1QixPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssSUFBSTt3QkFDckMsS0FBSyxNQUFRLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTs7OztnQkFJekQsUUFBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtnQkFDbEYsT0FBTyxZQUFZLEtBQUssR0FBRyxLQUFLLElBQUk7d0JBQ3BDLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7d0JBQ3pELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQzVFLElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRTVFLFFBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFDekcsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUs7d0JBQ3RDLEtBQUssTUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7d0JBQ3pELElBQUksSUFBSSxLQUFLLG9CQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
