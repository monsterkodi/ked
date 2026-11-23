var toExport = {}
var events

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
toExport["ignore"] = async function ()
{
    compare(watcher.ignoredPath('/p/.claude/worktrees'),true)
    compare(watcher.ignoredPath('/p/node_modules'),true)
    compare(watcher.ignoredPath('/p/.git'),true)
    compare(watcher.ignoredPath('/p/.claude'),false)
    compare(watcher.ignoredPath('/p/.claude/worktrees/w'),false)
    compare(watcher.ignoredPath('/p/.claude/worktrees/w/kode/a.kode'),false)
    compare(watcher.ignoredPath('/p/AGENTS.md'),false)
    compare(watcher.ignoredPath('/p/js/a.js'),false)
}
toExport["ignore"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC93YXRjaGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7O09BQ0ssWUFBQTtPQUFNLFdBQUE7T0FBSyxVQUFBO09BQUksY0FBQTs7T0FDakIsV0FBQTtJQUFPOztBQUVkO0FBQ0EsS0FBSyxHQUFHLHlCQUFlOztRQUNDOztlQUFwQixPQUFPLEtBQUs7OztBQUdoQixRQUFRLFdBQVc7QUFDbkIsUUFBUSxXQUFXOzs7SUFJK0IsUUFBOUMsUUFBUSxZQUFZLHdCQUE0QjtJQUNGLFFBQTlDLFFBQVEsWUFBWSxtQkFBNEI7SUFDRixRQUE5QyxRQUFRLFlBQVksV0FBNEI7SUFDRixRQUE5QyxRQUFRLFlBQVksY0FBNEI7SUFDRixRQUE5QyxRQUFRLFlBQVksMEJBQTRCO0lBQ1MsUUFBekQsUUFBUSxZQUFZLHNDQUF1QztJQUNiLFFBQTlDLFFBQVEsWUFBWSxnQkFBNEI7SUFDRixRQUE5QyxRQUFRLFlBQVksY0FBNEIifQ==
//# sourceURL=../../../kode/kxk/test/watcher.kode
