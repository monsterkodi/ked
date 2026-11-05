var toExport = {}
var file, newDir, newFile, oldDir, oldFile, root, text

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
        post.emit('file.change',{path:file,change:'modify'})
        text = await kacher.getText(file)
        compare(text,'beta')
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("renames invalidate the old path", async function ()
    {
        root = '/tmp/opencode/ked-kacher-rename'
        oldFile = slash.path(root,'old.kode')
        newFile = slash.path(root,'new.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(oldFile,'alpha')
        text = await kacher.getText(oldFile)
        compare(text,'alpha')
        fs.renameSync(oldFile,newFile)
        post.emit('file.change',{path:newFile,oldPath:oldFile,change:'rename'})
        fs.writeFileSync(oldFile,'beta')
        text = await kacher.getText(oldFile)
        fs.rmSync(root,{recursive:true,force:true})
        compare(text,'beta')
    })
    await section("deletes invalidate the old path", async function ()
    {
        root = '/tmp/opencode/ked-kacher-delete'
        file = slash.path(root,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'alpha')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.rmSync(file)
        post.emit('file.change',{path:file,change:'delete'})
        fs.writeFileSync(file,'beta')
        text = await kacher.getText(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(text,'beta')
    })
    await section("folder renames invalidate cached paths below the folder", async function ()
    {
        root = '/tmp/opencode/ked-kacher-folder-rename'
        oldDir = slash.path(root,'old')
        newDir = slash.path(root,'new')
        oldFile = slash.path(oldDir,'a.kode')
        newFile = slash.path(newDir,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(oldDir,{recursive:true})
        fs.writeFileSync(oldFile,'alpha')
        text = await kacher.getText(oldFile)
        compare(text,'alpha')
        fs.renameSync(oldDir,newDir)
        post.emit('file.change',{path:newDir,oldPath:oldDir,change:'rename'})
        fs.mkdirSync(oldDir,{recursive:true})
        fs.writeFileSync(oldFile,'beta')
        text = await kacher.getText(oldFile)
        fs.rmSync(root,{recursive:true,force:true})
        compare(text,'beta')
    })
}
toExport["kacher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FjaGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2thY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNOztPQUNQLGFBQVI7Ozs7OztRQU1DLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxjQUFjLEtBQUs7UUFFdEIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLGNBQWMsS0FBSztRQUV0QixhQUFRLE9BQU8sUUFBUTtnQkFDdkIsS0FBTztRQUVQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxjQUFjLEtBQUs7UUFFdEIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLGNBQWMsS0FBSztRQUN0QixLQUFLLEtBQUssZUFBYyxLQUFLLEtBQUssT0FBTztRQUV6QyxhQUFRLE9BQU8sUUFBUTtnQkFDdkIsS0FBTztRQUVQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxVQUFVLE1BQU0sS0FBSyxLQUFLO1FBQzFCLFVBQVUsTUFBTSxLQUFLLEtBQUs7UUFFMUIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUM1QixHQUFHLGNBQWMsUUFBUTtRQUV6QixhQUFRLE9BQU8sUUFBUTtnQkFDdkIsS0FBTztRQUVQLEdBQUcsV0FBVyxRQUFRO1FBQ3RCLEtBQUssS0FBSyxlQUFjLEtBQUssUUFBUSxRQUFRLFFBQVEsT0FBTztRQUU1RCxHQUFHLGNBQWMsUUFBUTtRQUN6QixhQUFRLE9BQU8sUUFBUTtRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsS0FBTzs7OztRQUlQLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxjQUFjLEtBQUs7UUFFdEIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLE9BQU87UUFDVixLQUFLLEtBQUssZUFBYyxLQUFLLEtBQUssT0FBTztRQUV6QyxHQUFHLGNBQWMsS0FBSztRQUN0QixhQUFRLE9BQU8sUUFBUTtRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsS0FBTzs7OztRQUlQLE9BQU87UUFDUCxTQUFTLE1BQU0sS0FBSyxLQUFLO1FBQ3pCLFNBQVMsTUFBTSxLQUFLLEtBQUs7UUFDekIsVUFBVSxNQUFNLEtBQUssT0FBTztRQUM1QixVQUFVLE1BQU0sS0FBSyxPQUFPO1FBRTVCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxRQUFPLFVBQVU7UUFDOUIsR0FBRyxjQUFjLFFBQVE7UUFFekIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLFdBQVcsT0FBTztRQUNyQixLQUFLLEtBQUssZUFBYyxLQUFLLE9BQU8sUUFBUSxPQUFPLE9BQU87UUFFMUQsR0FBRyxVQUFVLFFBQU8sVUFBVTtRQUM5QixHQUFHLGNBQWMsUUFBUTtRQUN6QixhQUFRLE9BQU8sUUFBUTtRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsS0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/kacher.kode
