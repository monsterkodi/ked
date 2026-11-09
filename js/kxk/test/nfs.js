var toExport = {}
var copy666, dupe, file, first, folder, gone, items, keep, lines, name, newText, oldItem, oldText, res, root, second, secret, stamp, text, third, trashRoot

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
    await section("trashImmediate selects tmp and trash paths", async function ()
    {
        compare(nfs.trashImmediate('/tmp/a.txt'),true)
        compare(nfs.trashImmediate('/tmp'),true)
        compare(nfs.trashImmediate('/tmpfoo/a.txt'),false)
        compare(nfs.trashImmediate(slash.path(slash.home(),'tmp/a.txt')),true)
        compare(nfs.trashImmediate(slash.path(slash.home(),'.local/share/Trash/files/a.txt')),true)
        compare(nfs.trashImmediate(slash.path(slash.home(),'other/a.txt')),false)
    })
    await section("trashing a file in /tmp deletes it", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-trash-tmp'
        file = slash.path(root,'a.txt')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'hello')
        res = await nfs.trash(file)
        gone = await nfs.exists(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(res,file)
        compare(((gone != null)),false)
    })
    await section("trashing a file in ~/tmp deletes it", async function ()
    {
        root = slash.path(slash.home(),'tmp',`opencode-nfs-trash-${Date.now()}`)
        file = slash.path(root,'a.txt')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'hello')
        res = await nfs.trash(file)
        gone = await nfs.exists(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(res,file)
        compare(((gone != null)),false)
    })
    await section("trashing a file in the trash deletes it", async function ()
    {
        file = slash.path(slash.home(),'.local/share/Trash/files',`opencode-nfs-trash-${Date.now()}.txt`)
        fs.writeFileSync(file,'hello')
        res = await nfs.trash(file)
        gone = await nfs.exists(file)
        fs.rmSync(file,{force:true})
        compare(res,file)
        compare(((gone != null)),false)
    })
    await section("trashed items go into a timestamped hashed folder", async function ()
    {
        root = slash.path(slash.home(),'.cache/opencode',`kxk-nfs-trash-stamp-${Date.now()}`)
        file = slash.path(root,'a.txt')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'hello')
        res = await nfs.trash(file)
        folder = ''
        if (res)
        {
            folder = slash.file(slash.dir(res))
        }
        fs.rmSync(root,{recursive:true,force:true})
        if (res)
        {
            fs.rmSync(slash.dir(res),{recursive:true,force:true})
        }
        compare(((res != null)),true)
        compare((/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-[0-9a-f]{8}$/.test(folder)),true)
    })
    await section("trashing a file with a name already in the trash keeps both", async function ()
    {
        trashRoot = slash.path(slash.home(),'.local/share/Trash/files')
        stamp = Date.now()
        name = `opencode-nfs-trash-collision-${stamp}.txt`
        oldItem = slash.path(trashRoot,name)
        root = slash.path(slash.home(),'.cache/opencode',`kxk-nfs-trash-collision-${stamp}`)
        file = slash.path(root,name)
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'new')
        fs.mkdirSync(trashRoot,{recursive:true})
        fs.writeFileSync(oldItem,'old')
        res = await nfs.trash(file)
        gone = await nfs.exists(file)
        oldText = fs.readFileSync(oldItem,'utf8')
        newText = ''
        if (res)
        {
            newText = fs.readFileSync(res,'utf8')
        }
        fs.rmSync(root,{recursive:true,force:true})
        fs.rmSync(oldItem,{force:true})
        if (res)
        {
            fs.rmSync(slash.dir(res),{recursive:true,force:true})
        }
        compare(((gone != null)),false)
        compare(((res != null)),true)
        compare(oldText,'old')
        compare(newText,'new')
    })
    await section("trashing a folder with a name already in the trash keeps both", async function ()
    {
        trashRoot = slash.path(slash.home(),'.local/share/Trash/files')
        stamp = Date.now()
        name = `opencode-nfs-trash-collision-dir-${stamp}`
        oldItem = slash.path(trashRoot,name)
        root = slash.path(slash.home(),'.cache/opencode',`kxk-nfs-trash-collision-dir-${stamp}`)
        folder = slash.path(root,name)
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(folder,{recursive:true})
        fs.writeFileSync(slash.path(folder,'inside.txt'),'new')
        fs.mkdirSync(oldItem,{recursive:true})
        fs.writeFileSync(slash.path(oldItem,'inside.txt'),'old')
        res = await nfs.trash(folder)
        gone = await nfs.exists(folder)
        oldText = fs.readFileSync(slash.path(oldItem,'inside.txt'),'utf8')
        newText = ''
        if (res)
        {
            newText = fs.readFileSync(slash.path(res,'inside.txt'),'utf8')
        }
        fs.rmSync(root,{recursive:true,force:true})
        fs.rmSync(oldItem,{recursive:true,force:true})
        if (res)
        {
            fs.rmSync(slash.dir(res),{recursive:true,force:true})
        }
        compare(((gone != null)),false)
        compare(((res != null)),true)
        compare(oldText,'old')
        compare(newText,'new')
    })
}
toExport["nfs"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L25mcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNLLFVBQUE7T0FBSSxZQUFBOzs7Ozs7UUFNTCxPQUFPO1FBQ1AsU0FBUyxNQUFNLEtBQUssS0FBSztRQUV6QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsVUFBVTtRQUNiLEdBQUcsVUFBVSxPQUFPO1FBRXBCO1FBQ0EsT0FBTyxRQUFRO1FBRWYsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxjQUFTLElBQUksS0FBSyxRQUFPLFVBQVU7UUFFbkMsUUFBUSxNQUFNO1FBRWQsR0FBRyxVQUFVLE9BQU87UUFDcEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE1BQU0sT0FBUztnQkFDZixNQUFNLE9BQVM7Ozs7UUFJZixPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixPQUFPLE1BQU0sS0FBSyxLQUFLO1FBQ3ZCLEdBQUcsY0FBYyxLQUFLO1FBRXRCLGFBQVEsSUFBSSxVQUFVO1FBQ3RCLE9BQU8sR0FBRyxhQUFhLEtBQUs7UUFFNUIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE1BQU0sS0FBSyxNQUFRO2dCQUNuQixLQUFPOzs7O1FBSVAsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsT0FBTyxNQUFNLEtBQUssS0FBSztRQUN2QixHQUFHLGNBQWMsS0FBSztRQUV0QixjQUFVLElBQUksVUFBVTtRQUN4QixlQUFVLElBQUksVUFBVTtRQUN4QixjQUFVLElBQUksVUFBVTtRQUV4QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/nfs.kode
