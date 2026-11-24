var toExport = {}
var copy666, dupe, file, folder, gone, items, keep, lines, name, newText, oldItem, oldText, one, res, root, second, secret, text, third, trashRoot

import fs from "fs"

import nfs from "../nfs.js"
import slash from "../slash.js"
import testdir from "../testdir.js"

toExport["nfs"] = async function ()
{
    await section("listing a directory it cannot read logs nothing", async function ()
    {
        root = testdir('kxk-nfs-eacces')
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
        root = testdir('kxk-nfs-duplicate')
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
        root = testdir('kxk-nfs-duplicate')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'test.txt')
        fs.writeFileSync(file,'hello')
        one = await nfs.duplicate(file)
        second = await nfs.duplicate(file)
        third = await nfs.duplicate(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(slash.file(one),'test-copy.txt')
        compare(slash.file(second),'test-copy2.txt')
        compare(slash.file(third),'test-copy3.txt')
        root = testdir('kxk-nfs-duplicate-gap')
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
        root = testdir('kxk-nfs-duplicate-copy')
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
        root = testdir('kxk-nfs-duplicate-dir')
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
        root = testdir('kxk-nfs-duplicate-noext')
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
        root = testdir('kxk-nfs-trash-tmp','/tmp')
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
        root = testdir('kxk-nfs-trash',slash.path(slash.home(),'tmp'))
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
        file = slash.path(slash.home(),'.local/share/Trash/files',`${testdir.id()}-nfs-trash.txt`)
        fs.writeFileSync(file,'hello')
        res = await nfs.trash(file)
        gone = await nfs.exists(file)
        fs.rmSync(file,{force:true})
        compare(res,file)
        compare(((gone != null)),false)
    })
    await section("trashed items go into a timestamped hashed folder", async function ()
    {
        root = testdir('kxk-nfs-trash-stamp',slash.path(slash.home(),'.cache/opencode'))
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
        name = `${testdir.id()}-nfs-trash-collision.txt`
        oldItem = slash.path(trashRoot,name)
        root = testdir('kxk-nfs-trash-collision',slash.path(slash.home(),'.cache/opencode'))
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
        name = `${testdir.id()}-nfs-trash-collision-dir`
        oldItem = slash.path(trashRoot,name)
        root = testdir('kxk-nfs-trash-collision-dir',slash.path(slash.home(),'.cache/opencode'))
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L25mcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNLLFVBQUE7T0FBSSxZQUFBO09BQU0sY0FBQTs7Ozs7O1FBTVgsT0FBTyxRQUFRO1FBQ2YsU0FBUyxNQUFNLEtBQUssS0FBSztRQUV6QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsVUFBVTtRQUNiLEdBQUcsVUFBVSxPQUFPO1FBRXBCO1FBQ0EsT0FBTyxRQUFRO1FBRWYsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxjQUFTLElBQUksS0FBSyxRQUFPLFVBQVU7UUFFbkMsUUFBUSxNQUFNO1FBRWQsR0FBRyxVQUFVLE9BQU87UUFDcEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFFdkIsUUFBYixNQUFNLE9BQVM7UUFDRixRQUFiLE1BQU0sT0FBUzs7OztRQUlmLE9BQU8sUUFBUTtRQUNmLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsT0FBTyxNQUFNLEtBQUssS0FBSztRQUN2QixHQUFHLGNBQWMsS0FBSztRQUV0QixhQUFRLElBQUksVUFBVTtRQUN0QixPQUFPLEdBQUcsYUFBYSxLQUFLO1FBRTVCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBRW5CLFFBQWpCLE1BQU0sS0FBSyxNQUFRO1FBQ2QsUUFBTCxLQUFPOzs7O1FBSVAsT0FBTyxRQUFRO1FBQ2YsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixPQUFPLE1BQU0sS0FBSyxLQUFLO1FBQ3ZCLEdBQUcsY0FBYyxLQUFLO1FBRXRCLFlBQVUsSUFBSSxVQUFVO1FBQ3hCLGVBQVUsSUFBSSxVQUFVO1FBQ3hCLGNB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
//# sourceURL=../../../kode/kxk/test/nfs.kode
