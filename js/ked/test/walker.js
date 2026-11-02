var toExport = {}
var result, root, walk

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash

import walker from "../util/walker.js"

toExport["walker"] = async function ()
{
    await section("maxDepth zero lists only the root", async function ()
    {
        root = '/tmp/opencode/ked-walker-depth'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(slash.path(root,'one','two'),{recursive:true})
        fs.writeFileSync(slash.path(root,'a.md'),'')
        fs.writeFileSync(slash.path(root,'one','b.md'),'')
        fs.writeFileSync(slash.path(root,'one','two','c.md'),'')
        walk = new walker({root:root,maxDepth:0,ignore:[],includeExt:['md']})
        result = await walk.start()
        fs.rmSync(root,{recursive:true,force:true})
        compare(result.files.includes(slash.path(root,'a.md')),true)
        compare(result.files.includes(slash.path(root,'one','b.md')),false)
        compare(result.files.includes(slash.path(root,'one','two','c.md')),false)
    })
    await section("maxDepth one descends one level", async function ()
    {
        root = '/tmp/opencode/ked-walker-depth'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(slash.path(root,'one','two'),{recursive:true})
        fs.writeFileSync(slash.path(root,'a.md'),'')
        fs.writeFileSync(slash.path(root,'one','b.md'),'')
        fs.writeFileSync(slash.path(root,'one','two','c.md'),'')
        walk = new walker({root:root,maxDepth:1,ignore:[],includeExt:['md']})
        result = await walk.start()
        fs.rmSync(root,{recursive:true,force:true})
        compare(result.files.includes(slash.path(root,'a.md')),true)
        compare(result.files.includes(slash.path(root,'one','b.md')),true)
        compare(result.files.includes(slash.path(root,'one','two','c.md')),false)
    })
}
toExport["walker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2VyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3dhbGtlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBTTs7T0FDRixhQUFQOzs7Ozs7UUFNQyxPQUFPO1FBRVAsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQU0sS0FBSyxLQUFLLE1BQU0sUUFBTyxVQUFVO1FBQ3BELEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxRQUFRO1FBQ3pDLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxNQUFNLFFBQVE7UUFDL0MsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLE1BQU0sTUFBTSxRQUFRO1FBRXJELFdBQVcsUUFDUCxLQUFZLEtBQ1osU0FBWSxFQUNaLFVBQ0EsWUFBYTtRQUVqQixlQUFVLEtBQUs7UUFFZixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsT0FBTyxNQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBVztnQkFDakQsT0FBTyxNQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUssTUFBTSxTQUFXO2dCQUN2RCxPQUFPLE1BQU0sU0FBUyxNQUFNLEtBQUssS0FBSyxNQUFNLE1BQU0sU0FBVzs7OztRQUk3RCxPQUFPO1FBRVAsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQU0sS0FBSyxLQUFLLE1BQU0sUUFBTyxVQUFVO1FBQ3BELEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxRQUFRO1FBQ3pDLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxNQUFNLFFBQVE7UUFDL0MsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLE1BQU0sTUFBTSxRQUFRO1FBRXJELFdBQVcsUUFDUCxLQUFZLEtBQ1osU0FBWSxFQUNaLFVBQ0EsWUFBYTtRQUVqQixlQUFVLEtBQUs7UUFFZixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsT0FBTyxNQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBVztnQkFDakQsT0FBTyxNQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUssTUFBTSxTQUFXO2dCQUN2RCxPQUFPLE1BQU0sU0FBUyxNQUFNLEtBQUssS0FBSyxNQUFNLE1BQU0sU0FBVyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/walker.kode
