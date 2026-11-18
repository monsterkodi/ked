var toExport = {}
var tree

import kxk from "../../kxk.js"
let sds = kxk.sds

import layout from "../popo/layout.js"

toExport["popo"] = async function ()
{
    await section("layout", async function ()
    {
        await section("absolutize", async function ()
        {
            compare(layout.absolutize({cols:100,rows:50},{x:'20%',y:'10%',r:'20%',b:'10%'}),{x:20,y:5,w:60,h:40})
            compare(layout.absolutize({cols:10,rows:5},{x:'20%',y:'20%',r:'20%',b:'20%'}),{x:2,y:1,w:6,h:3})
            compare(layout.absolutize({cols:10,rows:5},{x:'20%',y:'20%',w:'60%',h:'60%'}),{x:2,y:1,w:6,h:3})
            tree = {x:10,y:10,w:'100%',h:'100%',children:[{x:'50%',y:'50%',w:'50%',h:'25%'}]}
            compare(layout.absolutize({cols:100,rows:100},tree),{x:10,y:10,w:90,h:90,children:[{x:55,y:55,w:45,h:22}]})
        })
    })
}
toExport["popo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wb3BvLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFVLFVBQUE7SUFBTTs7T0FDQSxhQUFUOzs7Ozs7OztvQkFRSyxPQUFPLFlBQVksS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtvQkFDMUYsT0FBTyxZQUFZLEtBQUssR0FBSSxLQUFLLElBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFVLEVBQUUsRUFBRyxFQUFFLEVBQUUsRUFBRSxFQUFHLEVBQUU7b0JBQzFGLE9BQU8sWUFBWSxLQUFLLEdBQUksS0FBSyxJQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBVSxFQUFFLEVBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRyxFQUFFO1lBRTFGLFFBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtvQkFFMUUsT0FBTyxZQUFZLEtBQUssSUFBSSxLQUFLLEtBQUssT0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/popo.kode
