var toExport = {}
var data, dmp, e, fg, h, regions, res, runs, tree

import kxk from "../../kxk.js"
let sds = kxk.sds

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
                compare(layout.absolutize({cols:100,rows:50},{x:'20%',y:'10%',r:'20%',b:'10%'}),{x:20,y:5,w:60,h:40})
                compare(layout.absolutize({cols:10,rows:5},{x:'20%',y:'20%',r:'20%',b:'20%'}),{x:2,y:1,w:6,h:3})
                compare(layout.absolutize({cols:10,rows:5},{x:'20%',y:'20%',w:'60%',h:'60%'}),{x:2,y:1,w:6,h:3})
                tree = {x:10,y:10,w:'100%',h:'100%',children:[{x:'50%',y:'50%',w:'50%',h:'25%'}]}
                compare(layout.absolutize({cols:100,rows:100},tree),{x:10,y:10,w:90,h:90,children:[{x:55,y:55,w:45,h:22}]})
            })
            await section("cells", async function ()
            {
                compare(layout.absolutize({cols:100,rows:50},{x:3,y:4,w:20,h:10}),{x:3,y:4,w:20,h:10})
                compare(layout.absolutize({cols:100,rows:50},{x:3,y:4,r:7,b:6}),{x:3,y:4,w:90,h:40})
                compare(layout.absolutize({cols:100,rows:50},{x:'3',y:'4',w:'20',h:'10'}),{x:3,y:4,w:20,h:10})
                compare(layout.absolutize({cols:100,rows:50},{x:3,y:'10%',w:20,h:'20%'}),{x:3,y:5,w:20,h:10})
            })
            await section("nesting", async function ()
            {
                tree = {x:1,y:1,w:10,h:10,children:[{x:1,y:1,w:'50%',h:'50%'},{x:0,y:'60%',w:4,h:2}]}
                compare(layout.absolutize({cols:20,rows:20},tree),{x:1,y:1,w:10,h:10,children:[{x:2,y:2,w:5,h:5},{x:1,y:7,w:4,h:2}]})
                tree = {x:0,y:0,w:'50%',h:'50%',children:[{x:'50%',y:'50%',w:'50%',h:'50%',children:[{x:0,y:0,w:'50%',h:'50%'}]}]}
                compare(layout.absolutize({cols:100,rows:100},tree),{x:0,y:0,w:50,h:50,children:[{x:25,y:25,w:25,h:25,children:[{x:25,y:25,w:12,h:12}]}]})
                tree = {x:8,y:0,w:'100%',h:10,children:[{x:'50%',y:0,w:'50%',h:2}]}
                compare(layout.absolutize({cols:10,rows:10},tree),{x:8,y:0,w:2,h:10,children:[{x:9,y:0,w:1,h:2}]})
                tree = {x:1,y:1,w:18,h:8,children:[{x:0,y:0,w:'50%',h:3,children:[{x:1,y:1,w:'50%',h:2}]},{x:'50%',y:0,w:'50%',h:3}]}
                compare(layout.absolutize({cols:20,rows:20},tree),{x:1,y:1,w:18,h:8,children:[{x:1,y:1,w:9,h:3,children:[{x:2,y:2,w:4,h:2}]},{x:10,y:1,w:9,h:3}]})
            })
            await section("no space", async function ()
            {
                tree = {x:0,y:0,w:10,h:5,children:[{x:20,y:20,w:5,h:5}]}
                compare(layout.absolutize({cols:10,rows:5},tree),{x:0,y:0,w:10,h:5,children:[{x:10,y:5,w:0,h:0}]})
                tree = {x:0,y:0,w:10,h:5,children:[{x:8,y:3,w:5,h:5}]}
                compare(layout.absolutize({cols:10,rows:5},tree),{x:0,y:0,w:10,h:5,children:[{x:8,y:3,w:2,h:2}]})
                tree = {x:0,y:0,w:0,h:0,children:[{x:1,y:1,w:3,h:3}]}
                compare(layout.absolutize({cols:10,rows:5},tree),{x:0,y:0,w:0,h:0,children:[{x:0,y:0,w:0,h:0}]})
                tree = {x:2,y:2,w:6,h:4,children:[{x:-2,y:-1,w:'100%',h:'100%'}]}
                compare(layout.absolutize({cols:10,rows:10},tree),{x:2,y:2,w:6,h:4,children:[{x:2,y:2,w:6,h:4}]})
                compare(layout.absolutize({cols:10,rows:5},{x:0,y:0,w:5,h:5,children:[]}),{x:0,y:0,w:5,h:5,children:[]})
            })
            await section("permutations", async function ()
            {
                tree = {x:'10%',y:'10%',r:'10%',b:10,children:[{x:4,y:2,w:'50%',b:'20%',children:[{x:'25%',y:3,r:6,h:'25%',children:[{x:2,y:'50%',w:12,h:2,children:[{x:0,y:0,r:'100%',b:'100%'}]}]}]}]}
                compare(layout.absolutize({cols:100,rows:50},tree),{x:10,y:5,w:80,h:35,children:[{x:14,y:7,w:40,h:26,children:[{x:24,y:10,w:24,h:6,children:[{x:26,y:13,w:12,h:2,children:[{x:26,y:13,w:0,h:0}]}]}]}]})
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
                compare(layout.nodeForPos({cols:10,rows:5},{x:'20%',y:1,w:'40%',h:2},[2,1]),{x:2,y:1,w:4,h:2})
                compare(layout.nodeForPos({cols:10,rows:5},{x:'20%',y:1,w:'40%',h:2},[5,2]),{x:2,y:1,w:4,h:2})
                compare(layout.nodeForPos({cols:10,rows:5},{x:'20%',y:1,w:'40%',h:2},[6,2]),null)
                compare(layout.nodeForPos({cols:10,rows:5},{x:'20%',y:1,w:'40%',h:2},[2,3]),null)
                compare(layout.nodeForPos({cols:10,rows:5},{x:1,y:1,r:2,b:1},[7,3]),{x:1,y:1,w:7,h:3})
                compare(layout.nodeForPos({cols:10,rows:5},{x:1,y:1,r:2,b:1},[8,3]),null)
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
            await section("empty and indexed", async function ()
            {
                tree = {children:[{text:'z',x:2,y:2,w:0,h:0}]}
                compare(layout.nodeForPos({cols:4,rows:4},tree,[2,2]),{x:0,y:0,w:4,h:4,children:[{text:'z',x:2,y:2,w:0,h:0}]})
                compare(layout.nodeForPos({cols:4,rows:4},{index:1,text:'i',x:1,y:1,w:2,h:2},[2,2]),{index:1,text:'i',x:1,y:1,w:2,h:2})
            })
        })
        await section("insertTextAt", async function ()
        {
            await section("creates a text node", async function ()
            {
                tree = {}
                compare(layout.insertTextAt({cols:10,rows:5},tree,[3,2],'a'),1)
                compare(tree,{children:[{text:'a',x:3,y:2,w:2,h:1}]})
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
            compare(sds.get(regions,'children.3.w'),22)
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
        e.state.sheet = {rectree:{bg:'#000'}}
        e.state.setCursors([[2,1]])
        e.state.insert('a')
        e.draw()
        compare(e.state.mainCursor(),[3,1])
        compare(h.at(2,1),'a')
        compare(sds.get(e.state.sheet.rectree,'children.0'),{text:'a',x:2,y:1,w:2,h:1})
        e.state.insert('b')
        e.draw()
        compare(e.state.mainCursor(),[4,1])
        compare(h.at(3,1),'b')
        compare(sds.get(e.state.sheet.rectree,'children.0.text'),'ab')
        compare(sds.get(e.state.sheet.rectree,'children.0.w'),3)
        e.state.sheet = {rectree:{x:2,y:1,w:6,h:2}}
        e.state.setCursors([[10,3]])
        e.state.insert('c')
        compare(sds.get(e.state.sheet.rectree,'children.0'),{text:'c',x:8,y:2,w:2,h:1})
    })
    await section("sheet render size", async function ()
    {
        h = new harness({cols:16,rows:4})
        e = new editor(h.screen,'popo_sheet_render_size',[])
        e.layout(0,0,16,4)
        e.state.loadLines(['                ','                ','                ','                '])
        e.state.sheet = {rectree:{children:[{pattern:'x',x:'50%',y:0,w:'50%',h:2}]},cols:10,rows:4}
        e.state.setCursors([[6,0]])
        e.state.insert('a')
        compare(sds.get(e.state.sheet.rectree,'children.0.children.0'),{text:'a',x:1,y:0,w:2,h:1})
    })
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFVLFVBQUE7SUFBTTs7T0FDQSxhQUFUO09BQWdCLFdBQWhCOztPQUNRLGFBQVI7O09BQ1ksVUFBUDs7T0FDRyxjQUFSOzs7Ozs7Ozs7O3dCQVVTLE9BQU8sWUFBWSxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBVSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO3dCQUMxRixPQUFPLFlBQVksS0FBSyxHQUFJLEtBQUssSUFBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVUsRUFBRSxFQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUcsRUFBRTt3QkFDMUYsT0FBTyxZQUFZLEtBQUssR0FBSSxLQUFLLElBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFVLEVBQUUsRUFBRyxFQUFFLEVBQUUsRUFBRSxFQUFHLEVBQUU7Z0JBRTFGLFFBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTt3QkFFMUUsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUssT0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFOzs7O3dCQUkvRixPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDbkYsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
