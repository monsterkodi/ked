var toExport = {}
var file, root, text

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import kacher from "../index/kacher.js"

toExport["kacher"] = async function ()
{
    await section("caches the text of a file", async function ()
    {
        root = '/tmp/opencode/ked-kacher-cache'
        file = slash.path(root,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'alpha')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.writeFileSync(file,'beta')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("invalidates cached text on file change", async function ()
    {
        root = '/tmp/opencode/ked-kacher-change'
        file = slash.path(root,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'alpha')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.writeFileSync(file,'beta')
        post.emit('file.change',{path:file,change:'change'})
        text = await kacher.getText(file)
        compare(text,'beta')
        fs.rmSync(root,{recursive:true,force:true})
    })
}
toExport["kacher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FjaGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2thY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNOztPQUNQLGFBQVI7Ozs7OztRQU1DLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxjQUFjLEtBQUs7UUFFdEIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLGNBQWMsS0FBSztRQUV0QixhQUFRLE9BQU8sUUFBUTtnQkFDdkIsS0FBTztRQUVQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxjQUFjLEtBQUs7UUFFdEIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLGNBQWMsS0FBSztRQUN0QixLQUFLLEtBQUssZUFBYyxLQUFLLEtBQUssT0FBTztRQUV6QyxhQUFRLE9BQU8sUUFBUTtnQkFDdkIsS0FBTztRQUVQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/kacher.kode
