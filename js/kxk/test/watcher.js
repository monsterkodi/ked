var toExport = {}
var beforeUpgrade, created, createdChange, deleted, deletedChange, deletedPath, dir, events, file, keepError, keepLog, keepWarn, lines, nested, newDir, newFile, oldDir, oldFile, parentWatched, path, root, secret, secretWatched, sibling, siblingEvents, thrown, tmp

import fs from "fs"

import slash from "../slash.js"
import post from "../post.js"
import nfs from "../nfs.js"
import watcher from "../watcher.js"

import util from "../util.js"
let sleep = util.sleep

events = []
post.on('file.change',(function (info)
{
    if (events)
    {
        return events.push(info)
    }
}).bind(this))
watcher.debounce = 10
watcher.maxDelay = 40
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
            await sleep(20)
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
        await sleep(20)
        fs.writeFileSync(slash.path(root,'a.txt'),'hello')
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
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
        await sleep(20)
        fs.writeFileSync(file,'hello world')
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].change,'modify')
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
        await sleep(20)
        fs.rmSync(file)
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].change,'delete')
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
        await sleep(20)
        fs.renameSync(oldFile,newFile)
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
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
        await sleep(20)
        fs.copyFileSync(oldFile,newFile)
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].change,'create')
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
        await sleep(20)
        fs.writeFileSync(tmp,'new')
        fs.renameSync(tmp,file)
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].change,'modify')
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
        await sleep(20)
        await nfs.write(file,'new')
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].change,'modify')
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
        await sleep(20)
        fs.mkdirSync(dir)
        fs.writeFileSync(slash.path(dir,'inside.txt'),'hello')
        await sleep(80)
        created = events.length
        createdChange = (events[0] != null ? events[0].change : undefined)
        path = (events[0] != null ? events[0].path : undefined)
        events = []
        fs.rmSync(dir,{recursive:true,force:true})
        await sleep(80)
        deleted = events.length
        deletedChange = (events[0] != null ? events[0].change : undefined)
        deletedPath = (events[0] != null ? events[0].path : undefined)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(created,1)
        compare(createdChange,'create')
        compare(path,dir)
        compare(deleted,1)
        compare(deletedChange,'delete')
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
        await sleep(20)
        fs.renameSync(oldDir,newDir)
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].change,'rename')
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
        await sleep(20)
        dir = slash.path(root,'folder')
        fs.mkdirSync(dir)
        await sleep(80)
        events = []
        fs.writeFileSync(slash.path(dir,'inside.txt'),'hello')
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(events.length,1)
        compare(events[0].change,'create')
        compare(events[0].path,slash.path(dir,'inside.txt'))
    })
    await section("ignored directories are not watched", async function ()
    {
        root = '/tmp/opencode/ked-watcher-ignored'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        events = []
        await watcher.watch(root)
        await sleep(20)
        dir = slash.path(root,'node_modules')
        fs.mkdirSync(dir)
        fs.writeFileSync(slash.path(dir,'inside.txt'),'hello')
        await sleep(80)
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
        await sleep(20)
        fs.writeFileSync(nested,'changed')
        await sleep(80)
        beforeUpgrade = events.length
        await watcher.watch(nested)
        await sleep(20)
        fs.writeFileSync(nested,'changed again')
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(beforeUpgrade,0)
        compare(events.length,1)
        compare(events[0].change,'modify')
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
        await sleep(20)
        fs.writeFileSync(sibling,'changed')
        await sleep(80)
        siblingEvents = events.length
        fs.writeFileSync(file,'changed')
        await sleep(80)
        watcher.close()
        fs.rmSync(root,{recursive:true,force:true})
        compare(siblingEvents,0)
        compare(events.length,1)
        compare(events[0].change,'modify')
        compare(events[0].path,file)
        watcher.debounce = 75
        watcher.maxDelay = 250
    })
}
toExport["watcher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC93YXRjaGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7O09BQ0ssWUFBQTtPQUFNLFdBQUE7T0FBSyxVQUFBO09BQUksY0FBQTs7T0FDakIsV0FBQTtJQUFPOztBQUVkO0FBQ0EsS0FBSyxHQUFHLHlCQUFlOztRQUNDOztlQUFwQixPQUFPLEtBQUs7OztBQUdoQixRQUFRLFdBQVc7QUFDbkIsUUFBUSxXQUFXOzs7OztRQU1YLE9BQU87UUFDUCxTQUFTLE1BQU0sS0FBSyxLQUFLO1FBRXpCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxVQUFVO1FBQ2IsR0FBRyxVQUFVLE9BQU87UUFFcEI7UUFDQSxVQUFVLFFBQVE7UUFDbEIsV0FBVyxRQUFRO1FBQ25CLFlBQVksUUFBUTtRQUVwQixRQUFRLGdCQUFPOzttQkFBWSxNQUFNLEtBQUs7O1FBQ3RDLFFBQVEsaUJBQVE7O21CQUFZLE1BQU0sS0FBSzs7UUFDdkMsUUFBUSxrQkFBUzs7bUJBQVksTUFBTSxLQUFLOztRQUV4QyxTQUFTOzs7a0JBR0gsUUFBUSxNQUFNO2tCQUNkLE1BQU07O2VBQ047O1lBQ0YsU0FBUzs7UUFFYixnQkFBZ0IsUUFBUSxTQUFTLFVBQVM7UUFDMUMsZ0JBQWdCLFFBQVEsU0FBUyxZQUFXO1FBRTVDLFFBQVE7UUFFUixRQUFRLE1BQU07UUFDZCxRQUFRLE9BQU87UUFDZixRQUFRLFFBQVE7UUFFaEIsR0FBRyxVQUFVLE9BQU87UUFDcEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07aUJBRW5DLFdBQVUsTUFBUTtnQkFDbkIsTUFBTSxPQUFTO2dCQUNmLGNBQWdCO2dCQUNoQixjQUFnQjs7OztRQUloQixPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QjtjQUNFLFFBQVEsTUFBTTtjQUNkLE1BQU07UUFFUixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssU0FBUztjQUN4QyxNQUFNO1FBRVIsUUFBUTtRQUNSLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2dCQUVwQyxPQUFPLE9BQVM7Z0JBQ2hCLE9BQU8sR0FBRyxPQUFTO2dCQUNuQixPQUFPLEdBQUcsS0FBTyxNQUFNLEtBQUssS0FBSzs7OztRQUlqQyxPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUM1QixPQUFPLE1BQU0sS0FBSyxLQUFLO1FBQ3ZCLEdBQUcsY0FBYyxLQUFLO1FBRXRCO2NBQ0UsUUFBUSxNQUFNO2NBQ2QsTUFBTTtRQUVSLEdBQUcsY0FBYyxLQUFLO2NBQ3BCLE1BQU07UUFFUixRQUFRO1FBQ1IsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE9BQVM7Z0JBQ25CLE9BQU8sR0FBRyxLQUFPOzs7O1FBSWpCLE9BQU87UUFDUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFDdkIsR0FBRyxjQUFjLEtBQUs7UUFFdEI7Y0FDRSxRQUFRLE1BQU07Y0FDZCxNQUFNO1FBRVIsR0FBRyxPQUFPO2NBQ1IsTUFBTTtRQUVSLFFBQVE7UUFDUixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsT0FBTyxPQUFTO2dCQUNoQixPQUFPLEdBQUcsT0FBUztnQkFDbkIsT0FBTyxHQUFHLEtBQU87Ozs7UUFJakIsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsVUFBVSxNQUFNLEtBQUssS0FBSztRQUMxQixVQUFVLE1BQU0sS0FBSyxLQUFLO1FBQzFCLEdBQUcsY0FBYyxRQUFRO1FBRXpCO2NBQ0UsUUFBUSxNQUFNO2NBQ2QsTUFBTTtRQUVSLEdBQUcsV0FBVyxRQUFRO2NBQ3BCLE1BQU07UUFFUixRQUFRO1FBQ1IsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE9BQVM7Z0JBQ25CLE9BQU8sR0FBRyxLQUFPO2dCQUNqQixPQUFPLEdBQUcsUUFBVTs7OztRQUlwQixPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUM1QixVQUFVLE1BQU0sS0FBSyxLQUFLO1FBQzFCLFVBQVUsTUFBTSxLQUFLLEtBQUs7UUFDMUIsR0FBRyxjQUFjLFFBQVE7UUFFekI7Y0FDRSxRQUFRLE1BQU07Y0FDZCxNQUFNO1FBRVIsR0FBRyxhQUFhLFFBQVE7Y0FDdEIsTUFBTTtRQUVSLFFBQVE7UUFDUixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsT0FBTyxPQUFTO2dCQUNoQixPQUFPLEdBQUcsT0FBUztnQkFDbkIsT0FBTyxHQUFHLEtBQU87Ozs7UUFJakIsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsT0FBTyxNQUFNLEtBQUssS0FBSztRQUN2QixNQUFPLE1BQU0sS0FBSyxLQUFLO1FBQ3ZCLEdBQUcsY0FBYyxLQUFLO1FBRXRCO2NBQ0UsUUFBUSxNQUFNO2NBQ2QsTUFBTTtRQUVSLEdBQUcsY0FBYyxJQUFJO1FBQ3JCLEdBQUcsV0FBVyxJQUFJO2NBQ2hCLE1BQU07UUFFUixRQUFRO1FBQ1IsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE9BQVM7Z0JBQ25CLE9BQU8sR0FBRyxLQUFPOzs7O1FBSWpCLE9BQU87UUFDUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFDdkIsR0FBRyxjQUFjLEtBQUs7UUFFdEI7Y0FDRSxRQUFRLE1BQU07Y0FDZCxNQUFNO2NBRU4sSUFBSSxNQUFNLEtBQUs7Y0FDZixNQUFNO1FBRVIsUUFBUTtRQUNSLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2dCQUVwQyxPQUFPLE9BQVM7Z0JBQ2hCLE9BQU8sR0FBRyxPQUFTO2dCQUNuQixPQUFPLEdBQUcsS0FBTzs7OztRQUlqQixPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUM1QixNQUFNLE1BQU0sS0FBSyxLQUFLO1FBRXRCO2NBQ0UsUUFBUSxNQUFNO2NBQ2QsTUFBTTtRQUVSLEdBQUcsVUFBVTtRQUNiLEdBQUcsY0FBYyxNQUFNLEtBQUssSUFBSSxjQUFjO2NBQzVDLE1BQU07UUFFUixVQUFVLE9BQU87UUFDakIsaUJBQWdCLE9BQU8sYUFBUCxPQUFPLEdBQUk7UUFDM0IsUUFBTyxPQUFPLGFBQVAsT0FBTyxHQUFJO1FBRWxCO1FBQ0EsR0FBRyxPQUFPLEtBQUksVUFBVSxLQUFLLE1BQU07Y0FDakMsTUFBTTtRQUVSLFVBQVUsT0FBTztRQUNqQixpQkFBZ0IsT0FBTyxhQUFQLE9BQU8sR0FBSTtRQUMzQixlQUFjLE9BQU8sYUFBUCxPQUFPLEdBQUk7UUFFekIsUUFBUTtRQUNSLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2dCQUVwQyxRQUFVO2dCQUNWLGNBQWdCO2dCQUNoQixLQUFPO2dCQUNQLFFBQVU7Z0JBQ1YsY0FBZ0I7Z0JBQ2hCLFlBQWM7Ozs7UUFJZCxPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUM1QixTQUFTLE1BQU0sS0FBSyxLQUFLO1FBQ3pCLFNBQVMsTUFBTSxLQUFLLEtBQUs7UUFDekIsR0FBRyxVQUFVO1FBQ2IsR0FBRyxjQUFjLE1BQU0sS0FBSyxPQUFPLGNBQWM7UUFFakQ7Y0FDRSxRQUFRLE1BQU07Y0FDZCxNQUFNO1FBRVIsR0FBRyxXQUFXLE9BQU87Y0FDbkIsTUFBTTtRQUVSLFFBQVE7UUFDUixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsT0FBTyxPQUFTO2dCQUNoQixPQUFPLEdBQUcsT0FBUztnQkFDbkIsT0FBTyxHQUFHLEtBQU87Z0JBQ2pCLE9BQU8sR0FBRyxRQUFVOzs7O1FBSXBCLE9BQU87UUFDUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCO2NBQ0UsUUFBUSxNQUFNO2NBQ2QsTUFBTTtRQUVSLE1BQU0sTUFBTSxLQUFLLEtBQUs7UUFDdEIsR0FBRyxVQUFVO2NBQ1gsTUFBTTtRQUVSO1FBQ0EsR0FBRyxjQUFjLE1BQU0sS0FBSyxJQUFJLGNBQWM7Y0FDNUMsTUFBTTtRQUVSLFFBQVE7UUFDUixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsT0FBTyxPQUFTO2dCQUNoQixPQUFPLEdBQUcsT0FBUztnQkFDbkIsT0FBTyxHQUFHLEtBQU8sTUFBTSxLQUFLLElBQUk7Ozs7UUFJaEMsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUI7Y0FDRSxRQUFRLE1BQU07Y0FDZCxNQUFNO1FBRVIsTUFBTSxNQUFNLEtBQUssS0FBSztRQUN0QixHQUFHLFVBQVU7UUFDYixHQUFHLGNBQWMsTUFBTSxLQUFLLElBQUksY0FBYztjQUM1QyxNQUFNO1FBRVIsUUFBUTtRQUNSLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2dCQUVwQyxPQUFPLE9BQVM7Ozs7UUFJaEIsT0FBTztRQUNQLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxVQUFVLE1BQU0sS0FBSyxLQUFLO1FBQzdCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLFNBQVM7UUFDMUMsU0FBUyxNQUFNLEtBQUssS0FBSztRQUN6QixHQUFHLGNBQWMsT0FBTztRQUV4QjtjQUNFLFFBQVEsTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFTLFVBQVU7Y0FDakQsTUFBTTtRQUVSLEdBQUcsY0FBYyxPQUFPO2NBQ3RCLE1BQU07UUFFUixnQkFBZ0IsT0FBTztjQUVyQixRQUFRLE1BQU07Y0FDZCxNQUFNO1FBRVIsR0FBRyxjQUFjLE9BQU87Y0FDdEIsTUFBTTtRQUVSLFFBQVE7UUFDUixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsY0FBZ0I7Z0JBQ2hCLE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE9BQVM7Z0JBQ25CLE9BQU8sR0FBRyxLQUFPOzs7O1FBSWpCLE9BQU87UUFDUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLE9BQVUsTUFBTSxLQUFLLEtBQUs7UUFDMUIsVUFBVSxNQUFNLEtBQUssS0FBSztRQUMxQixHQUFHLGNBQWMsS0FBSztRQUN0QixHQUFHLGNBQWMsUUFBUTtRQUV6QjtjQUNFLFFBQVEsTUFBTTtjQUNkLE1BQU07UUFFUixHQUFHLGNBQWMsUUFBUTtjQUN2QixNQUFNO1FBRVIsZ0JBQWdCLE9BQU87UUFFdkIsR0FBRyxjQUFjLEtBQUs7Y0FDcEIsTUFBTTtRQUVSLFFBQVE7UUFDUixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsY0FBZ0I7Z0JBQ2hCLE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE9BQVM7Z0JBQ25CLE9BQU8sR0FBRyxLQUFPO1FBRWpCLFFBQVEsV0FBVztRQUNuQixRQUFRLFdBQVcifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/watcher.kode
