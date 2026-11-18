var toExport = {}
var regions, tree

import kxk from "../../kxk.js"
let sds = kxk.sds

import layout from "../popo/layout.js"

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
    await section("regionize", async function ()
    {
        tree = {bg:'#00f',children:[{pattern:'0123456789',type:'repeat',fg:'#ff0',x:0,y:0,children:[{erase:'fg',x:2,y:2,r:2,b:2}]},{text:'heading',x:4,y:3,r:6,h:3,scale:3,flows:false},{text:'longer text that flows and flows and flows and flows into the sea',x:8,y:14,w:'100%',h:3},{text:'some',x:8,y:15,h:3,scale:3,blocks:true}]}
        regions = layout.regionize({rows:20,cols:30},tree)
        compare(sds.get(regions,'children.3.w'),22)
        compare(sds.get(regions,'children.3.regions'),[[13,8,23],[4,9,23],[4,10,23]])
        compare(layout.dumpRegions(regions),`01234567890123456789012345
012                     45
012                     45
01 h  e  a  d  i  n  g  45
01                      45
01          longer text 45
01 s o m e  that flows  45
01 and flows and flows  45
01234567890123456789012345
01234567890123456789012345`)
    })
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFVLFVBQUE7SUFBTTs7T0FDQSxhQUFUOzs7Ozs7Ozs7O3dCQVVLLE9BQU8sWUFBWSxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBVSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO3dCQUMxRixPQUFPLFlBQVksS0FBSyxHQUFJLEtBQUssSUFBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVUsRUFBRSxFQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUcsRUFBRTt3QkFDMUYsT0FBTyxZQUFZLEtBQUssR0FBSSxLQUFLLElBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFVLEVBQUUsRUFBRyxFQUFFLEVBQUUsRUFBRSxFQUFHLEVBQUU7Z0JBRTFGLFFBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTt3QkFFMUUsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUssT0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFOzs7O3dCQUkvRixPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTt3QkFDbkYsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
