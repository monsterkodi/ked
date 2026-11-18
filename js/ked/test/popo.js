var toExport = {}
var dmp, regions, tree

import kxk from "../../kxk.js"
let sds = kxk.sds

import layout from "../popo/layout.js"
import fill from "../popo/fill.js"

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
            await section("errors", async function ()
            {
                try
                {
                    layout.absolutize({cols:10,rows:5},{x:0,y:0,w:1,r:1})
                    compare(true,false)
                }
                catch (err)
                {
                    compare(`${err}`.indexOf('w and r are both given') >= 0,true)
                }
                try
                {
                    layout.absolutize({cols:10,rows:5},{x:0,y:0,h:1,b:1})
                    compare(true,false)
                }
                catch (err)
                {
                    compare(`${err}`.indexOf('h and b are both given') >= 0,true)
                }
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
            try
            {
                fill.pattern({pattern:'ab',type:'bounce'},[[0,0,2]])
                compare(true,false)
            }
            catch (err)
            {
                compare(`${err}`.indexOf('pattern type bounce is not known') >= 0,true)
            }
        })
        await section("text", async function ()
        {
            compare(fill.text({text:'some text'},[[5,200,10],[5,201,10]]),['some ','text '])
            compare(fill.text({text:'abcdefgh'},[[0,0,3],[0,1,3],[0,2,3]]),['abc','def','gh '])
            compare(fill.text({text:'a\nb'},[[0,0,4],[0,1,4]]),['a   ','b   '])
            compare(fill.text({text:'abc',scale:2},[[0,0,8]]),['a b c   '])
            compare(fill.text({text:'abcdef',scale:2},[[0,0,5]]),['a b  '])
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
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFVLFVBQUE7SUFBTTs7T0FDQSxhQUFUO09BQWdCLFdBQWhCOzs7Ozs7Ozs7O3dCQVVTLE9BQU8sWUFBWSxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBVSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO3dCQUMxRixPQUFPLFlBQVksS0FBSyxHQUFJLEtBQUssSUFBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVUsRUFBRSxFQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUcsRUFBRTt3QkFDMUYsT0FBTyxZQUFZLEtBQUssR0FBSSxLQUFLLElBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFVLEVBQUUsRUFBRyxFQUFFLEVBQUUsRUFBRSxFQUFHLEVBQUU7Z0JBRTFGLFFBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTt3QkFFMUUsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUssT0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFOzs7O3dCQUkvRixPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDbkYsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
