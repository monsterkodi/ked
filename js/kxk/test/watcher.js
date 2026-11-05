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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC93YXRjaGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ0ksU0FBQTs7T0FDSyxZQUFBO09BQU0sV0FBQTtPQUFLLFVBQUE7T0FBSSxjQUFBOztPQUNqQixXQUFBO0lBQU87O0FBRWQ7QUFDQSxLQUFLLEdBQUcseUJBQWU7O1FBQ0M7O2VBQXBCLE9BQU8sS0FBSzs7O0FBR2hCLFFBQVEsV0FBVztBQUNuQixRQUFRLFdBQVcifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/watcher.kode
