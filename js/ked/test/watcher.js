var toExport = {}
var beforeUpgrade, created, createdType, deleted, deletedPath, deletedType, dir, events, file, keepError, keepLog, keepWarn, lines, nested, newDir, newFile, oldDir, oldFile, parentWatched, path, root, secret, secretWatched, sibling, siblingEvents, thrown, tmp

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post
let nfs = kxk.nfs

import watcher from "../util/watcher.js"

events = []
post.on('file.change',(function (info)
{
    if (events)
    {
        return events.push(info)
    }
}).bind(this))
toExport["watcher"] = async function ()
{
    await section("no read error logs", async function ()
    {
        root = '/tmp/opencode/ked-watcher-eacces'
        secret = slash.path(root,'secret')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.mkdirSync(secret)
        fs.chmodSync(secret,0)
        lines = []
        keepLog = console.log
        keepWarn = console.warn
        keepError = console.error
        console.log = function (...args)
        {
            return lines.push(args)
        }
        console.warn = function (...args)
        {
            return lines.push(args)
        }
        console.error = function (...args)
        {
            return lines.push(args)
        }
        thrown = null
        try
        {
            await watcher.watch(root)
            await sleep(100)
        }
        catch (err)
        {
            thrown = err
        }
        parentWatched = watcher.watchers[root] !== undefined
        secretWatched = watcher.watchers[secret] !== undefined
        watcher.close()
        console.log = keepLog
        console.warn = keepWarn
        console.error = keepError
        fs.chmodSync(secret,493)
        fs.rmSync(root,{recursive:true,force:true})
        compare((thrown === null),true)
        compare(lines.length,0)
        compare(parentWatched,true)
        compare(secretWatched,false)
    })
    await section("creates emit one create event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-create'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.writeFileSync(slash.path(root,'a.txt'),'hello')
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'create')
        compare(events[0].change,'create')
        compare(events[0].path,slash.path(root,'a.txt'))
    })
    await section("modifications emit one modify event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-modify'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'a.txt')
        fs.writeFileSync(file,'hello')
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.writeFileSync(file,'hello world')
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'modify')
        compare(events[0].change,'change')
        compare(events[0].path,file)
    })
    await section("deletions emit one delete event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-delete'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'a.txt')
        fs.writeFileSync(file,'hello')
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.rmSync(file)
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'delete')
        compare(events[0].change,'remove')
        compare(events[0].path,file)
    })
    await section("renames emit one rename event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-rename'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        oldFile = slash.path(root,'a.txt')
        newFile = slash.path(root,'b.txt')
        fs.writeFileSync(oldFile,'hello')
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.renameSync(oldFile,newFile)
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'rename')
        compare(events[0].change,'rename')
        compare(events[0].path,newFile)
        compare(events[0].oldPath,oldFile)
    })
    await section("copies emit one create event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-copy'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        oldFile = slash.path(root,'a.txt')
        newFile = slash.path(root,'b.txt')
        fs.writeFileSync(oldFile,'hello')
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.copyFileSync(oldFile,newFile)
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'create')
        compare(events[0].path,newFile)
    })
    await section("atomic saves emit one modify event and no temp events", async function ()
    {
        root = '/tmp/opencode/ked-watcher-atomic'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'a.txt')
        tmp = slash.path(root,'.a.txt.tmp')
        fs.writeFileSync(file,'old')
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.writeFileSync(tmp,'new')
        fs.renameSync(tmp,file)
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'modify')
        compare(events[0].path,file)
    })
    await section("nfs.write emits one modify event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-nfswrite'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'a.txt')
        fs.writeFileSync(file,'old')
        events = []
        await watcher.watch(root)
        await sleep(100)
        await nfs.write(file,'new')
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'modify')
        compare(events[0].path,file)
    })
    await section("directories emit one create and one delete event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-dirs'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        dir = slash.path(root,'folder')
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.mkdirSync(dir)
        fs.writeFileSync(slash.path(dir,'inside.txt'),'hello')
        await sleep(400)
        created = events.length
        createdType = (events[0] != null ? events[0].type : undefined)
        path = (events[0] != null ? events[0].path : undefined)
        events = []
        fs.rmSync(dir,{recursive:true,force:true})
        await sleep(400)
        deleted = events.length
        deletedType = (events[0] != null ? events[0].type : undefined)
        deletedPath = (events[0] != null ? events[0].path : undefined)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(created,1)
        compare(createdType,'create')
        compare(path,dir)
        compare(deleted,1)
        compare(deletedType,'delete')
        compare(deletedPath,dir)
    })
    await section("directory renames emit one rename event", async function ()
    {
        root = '/tmp/opencode/ked-watcher-dirrename'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        oldDir = slash.path(root,'old')
        newDir = slash.path(root,'new')
        fs.mkdirSync(oldDir)
        fs.writeFileSync(slash.path(oldDir,'inside.txt'),'hello')
        events = []
        await watcher.watch(root)
        await sleep(100)
        fs.renameSync(oldDir,newDir)
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'rename')
        compare(events[0].path,newDir)
        compare(events[0].oldPath,oldDir)
    })
    await section("directories created after watching are watched", async function ()
    {
        root = '/tmp/opencode/ked-watcher-newdir'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        events = []
        await watcher.watch(root)
        await sleep(100)
        dir = slash.path(root,'folder')
        fs.mkdirSync(dir)
        await sleep(400)
        events = []
        fs.writeFileSync(slash.path(dir,'inside.txt'),'hello')
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].type,'create')
        compare(events[0].path,slash.path(dir,'inside.txt'))
    })
    await section("ignored directories are not watched", async function ()
    {
        root = '/tmp/opencode/ked-watcher-ignored'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        events = []
        await watcher.watch(root)
        await sleep(100)
        dir = slash.path(root,'node_modules')
        fs.mkdirSync(dir)
        fs.writeFileSync(slash.path(dir,'inside.txt'),'hello')
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,0)
    })
    await section("non-recursive watches are upgraded to recursive", async function ()
    {
        root = '/tmp/opencode/ked-watcher-upgrade'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.mkdirSync(slash.path(root,'sub'))
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(slash.path(root,'a.txt'),'hello')
        nested = slash.path(root,'sub/b.txt')
        fs.writeFileSync(nested,'hello')
        events = []
        await watcher.watch(slash.path(root,'a.txt'),{recursive:false})
        await sleep(100)
        fs.writeFileSync(nested,'changed')
        await sleep(400)
        beforeUpgrade = events.length
        await watcher.watch(nested)
        await sleep(100)
        fs.writeFileSync(nested,'changed again')
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(beforeUpgrade,0)
        compare(events.length,1)
        compare(events[0].type,'modify')
        compare(events[0].path,nested)
    })
    await section("watching a file filters out sibling changes", async function ()
    {
        root = '/tmp/opencode/ked-watcher-file'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'a.txt')
        sibling = slash.path(root,'b.txt')
        fs.writeFileSync(file,'hello')
        fs.writeFileSync(sibling,'hello')
        events = []
        await watcher.watch(file)
        await sleep(100)
        fs.writeFileSync(sibling,'changed')
        await sleep(400)
        siblingEvents = events.length
        fs.writeFileSync(file,'changed')
        await sleep(400)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(siblingEvents,0)
        compare(events.length,1)
        compare(events[0].type,'modify')
        compare(events[0].path,file)
    })
}
toExport["watcher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC93YXRjaGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7O09BQ00sVUFBQTtJQUFNO0lBQU07SUFBTTtJQUFLOztPQUNqQixjQUFUOztBQUVQO0FBQ0EsS0FBSyxHQUFHLHlCQUFlOztRQUNDOztlQUFwQixPQUFPLEtBQUs7Ozs7Ozs7UUFNUixPQUFPO1FBQ1AsU0FBUyxNQUFNLEtBQUssS0FBSztRQUV6QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsVUFBVTtRQUNiLEdBQUcsVUFBVSxPQUFPO1FBRXBCO1FBQ0EsVUFBVSxRQUFRO1FBQ2xCLFdBQVcsUUFBUTtRQUNuQixZQUFZLFFBQVE7UUFFcEIsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUN0QyxRQUFRLGlCQUFROzttQkFBWSxNQUFNLEtBQUs7O1FBQ3ZDLFFBQVEsa0JBQVM7O21CQUFZLE1BQU0sS0FBSzs7UUFFeEMsU0FBUzs7O2tCQUdILFFBQVEsTUFBTTtrQkFDZCxNQUFNOztlQUNOOztZQUNGLFNBQVM7O1FBRWIsZ0JBQWdCLFFBQVEsU0FBUyxVQUFTO1FBQzFDLGdCQUFnQixRQUFRLFNBQVMsWUFBVztRQUU1QyxRQUFRO1FBRVIsUUFBUSxNQUFNO1FBQ2QsUUFBUSxPQUFPO1FBQ2YsUUFBUSxRQUFRO1FBRWhCLEdBQUcsVUFBVSxPQUFPO1FBQ3BCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2lCQUVuQyxXQUFVLE1BQVE7Z0JBQ25CLE1BQU0sT0FBUztnQkFDZixjQUFnQjtnQkFDaEIsY0FBZ0I7Ozs7UUFJaEIsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUI7Y0FDRSxRQUFRLE1BQU07Y0FDZCxNQUFNO1FBRVIsR0FBRyxj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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/watcher.kode
