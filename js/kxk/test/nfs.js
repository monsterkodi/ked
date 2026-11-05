var toExport = {}
var copy666, dupe, file, first, folder, items, keep, lines, root, second, secret, text, third

import fs from "fs"

import nfs from "../nfs.js"
import slash from "../slash.js"

toExport["nfs"] = async function ()
{
    await section("listing a directory it cannot read logs nothing", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-eacces'
        secret = slash.path(root,'secret')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.mkdirSync(secret)
        fs.chmodSync(secret,0)
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        items = await nfs.list(secret,{recursive:false})
        console.log = keep
        fs.chmodSync(secret,493)
        fs.rmSync(root,{recursive:true,force:true})
        compare(lines.length,0)
        compare(items.length,0)
    })
    await section("duplicating a file inserts a copy suffix before the extension", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-duplicate'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'test.txt')
        fs.writeFileSync(file,'hello')
        dupe = await nfs.duplicate(file)
        text = fs.readFileSync(dupe,'utf8')
        fs.rmSync(root,{recursive:true,force:true})
        compare(slash.file(dupe),'test-copy.txt')
        compare(text,'hello')
    })
    await section("duplicating again continues the copy number and ignores gaps", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-duplicate'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'test.txt')
        fs.writeFileSync(file,'hello')
        first = await nfs.duplicate(file)
        second = await nfs.duplicate(file)
        third = await nfs.duplicate(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(slash.file(first),'test-copy.txt')
        compare(slash.file(second),'test-copy2.txt')
        compare(slash.file(third),'test-copy3.txt')
        root = '/tmp/opencode/kxk-nfs-duplicate-gap'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'test.txt')
        fs.writeFileSync(file,'hello')
        fs.writeFileSync(slash.path(root,'test-copy666.txt'),'old')
        dupe = await nfs.duplicate(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(slash.file(dupe),'test-copy667.txt')
    })
    await section("duplicating a copy continues the chain of the original", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-duplicate-copy'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'test.txt')
        copy666 = slash.path(root,'test-copy666.txt')
        fs.writeFileSync(file,'hello')
        fs.writeFileSync(copy666,'old')
        dupe = await nfs.duplicate(copy666)
        fs.rmSync(root,{recursive:true,force:true})
        compare(slash.file(dupe),'test-copy667.txt')
    })
    await section("duplicating a folder copies its contents", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-duplicate-dir'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        folder = slash.path(root,'folder')
        fs.mkdirSync(folder)
        fs.writeFileSync(slash.path(folder,'inside.txt'),'inside')
        dupe = await nfs.duplicate(folder)
        text = fs.readFileSync(slash.path(dupe,'inside.txt'),'utf8')
        fs.rmSync(root,{recursive:true,force:true})
        compare(slash.file(dupe),'folder-copy')
        compare(text,'inside')
    })
    await section("duplicating a file without an extension appends a copy suffix", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-duplicate-noext'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'README')
        fs.writeFileSync(file,'docs')
        dupe = await nfs.duplicate(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(slash.file(dupe),'README-copy')
    })
}
toExport["nfs"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L25mcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNLLFVBQUE7T0FBSSxZQUFBOzs7Ozs7UUFNTCxPQUFPO1FBQ1AsU0FBUyxNQUFNLEtBQUssS0FBSztRQUV6QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsVUFBVTtRQUNiLEdBQUcsVUFBVSxPQUFPO1FBRXBCO1FBQ0EsT0FBTyxRQUFRO1FBRWYsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxjQUFTLElBQUksS0FBSyxRQUFPLFVBQVU7UUFFbkMsUUFBUSxNQUFNO1FBRWQsR0FBRyxVQUFVLE9BQU87UUFDcEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE1BQU0sT0FBUztnQkFDZixNQUFNLE9BQVM7Ozs7UUFJZixPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixPQUFPLE1BQU0sS0FBSyxLQUFLO1FBQ3ZCLEdBQUcsY0FBYyxLQUFLO1FBRXRCLGFBQVEsSUFBSSxVQUFVO1FBQ3RCLE9BQU8sR0FBRyxhQUFhLEtBQUs7UUFFNUIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE1BQU0sS0FBSyxNQUFRO2dCQUNuQixLQUFPOzs7O1FBSVAsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsT0FBTyxNQUFNLEtBQUssS0FBSztRQUN2QixHQUFHLGNBQWMsS0FBSztRQUV0QixjQUFVLElBQUksVUFBVTtRQUN4QixlQUFVLElBQUksVUFBVTtRQUN4QixjQUFVLElBQUksVUFBVTtRQUV4QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsTUFBTSxLQUFLLE9BQVU7Z0JBQ3JCLE1BQU0sS0FBSyxRQUFVO2dCQUNyQixNQUFNLEtBQUssT0FBVTtRQUVyQixPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixPQUFPLE1BQU0sS0FBSyxLQUFLO1FBQ3ZCLEdBQUcsY0FBYyxLQUFLO1FBQ3RCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxvQkFBb0I7UUFFckQsYUFBUSxJQUFJLFVBQVU7UUFFdEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE1BQU0sS0FBSyxNQUFROzs7O1FBSW5CLE9BQU87UUFDUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLE9BQVUsTUFBTSxLQUFLLEtBQUs7UUFDMUIsVUFBVSxNQUFNLEtBQUssS0FBSztRQUMxQixHQUFHLGNBQWMsS0FBSztRQUN0QixHQUFHLGNBQWMsUUFBUTtRQUV6QixhQUFRLElBQUksVUFBVTtRQUV0QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsTUFBTSxLQUFLLE1BQVE7Ozs7UUFJbkIsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsU0FBUyxNQUFNLEtBQUssS0FBSztRQUN6QixHQUFHLFVBQVU7UUFDYixHQUFHLGNBQWMsTUFBTSxLQUFLLE9BQU8sY0FBYztRQUVqRCxhQUFRLElBQUksVUFBVTtRQUN0QixPQUFPLEdBQUcsYUFBYSxNQUFNLEtBQUssS0FBSyxjQUFjO1FBRXJELEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2dCQUVwQyxNQUFNLEtBQUssTUFBUTtnQkFDbkIsS0FBTzs7OztRQUlQLE9BQU87UUFDUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFDdkIsR0FBRyxjQUFjLEtBQUs7UUFFdEIsYUFBUSxJQUFJLFVBQVU7UUFFdEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE1BQU0sS0FBSyxNQUFRIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/nfs.kode
