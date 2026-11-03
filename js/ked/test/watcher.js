var toExport = {}
var keepError, keepLog, keepWarn, lines, parentWatched, root, secret, secretWatched, thrown

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep

import watcher from "../util/watcher.js"

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
}
toExport["watcher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC93YXRjaGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7O09BQ00sVUFBQTtJQUFNO0lBQU07O09BQ04sY0FBVDs7Ozs7O1FBTUMsT0FBTztRQUNQLFNBQVMsTUFBTSxLQUFLLEtBQUs7UUFFekIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUM1QixHQUFHLFVBQVU7UUFDYixHQUFHLFVBQVUsT0FBTztRQUVwQjtRQUNBLFVBQVUsUUFBUTtRQUNsQixXQUFXLFFBQVE7UUFDbkIsWUFBWSxRQUFRO1FBRXBCLFFBQVEsZ0JBQU87O21CQUFZLE1BQU0sS0FBSzs7UUFDdEMsUUFBUSxpQkFBUTs7bUJBQVksTUFBTSxLQUFLOztRQUN2QyxRQUFRLGtCQUFTOzttQkFBWSxNQUFNLEtBQUs7O1FBRXhDLFNBQVM7OztrQkFHSCxRQUFRLE1BQU07a0JBQ2QsTUFBTTs7ZUFDTjs7WUFDRixTQUFTOztRQUViLGdCQUFnQixRQUFRLFNBQVMsVUFBUztRQUMxQyxnQkFBZ0IsUUFBUSxTQUFTLFlBQVc7UUFFNUMsUUFBUTtRQUVSLFFBQVEsTUFBTTtRQUNkLFFBQVEsT0FBTztRQUNmLFFBQVEsUUFBUTtRQUVoQixHQUFHLFVBQVUsT0FBTztRQUNwQixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtpQkFFbkMsV0FBVSxNQUFRO2dCQUNuQixNQUFNLE9BQVM7Z0JBQ2YsY0FBZ0I7Z0JBQ2hCLGNBQWdCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/watcher.kode
