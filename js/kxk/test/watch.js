var toExport = {}
var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, file: function () { return import.meta.url.substring(7); }}

var gone, p, r, seen, stat, w

import slash from "../slash.js"
import watch from "../watch.js"

gone = _k_.dir() + '/.watch-test-nonexistent'
toExport["watch"] = function ()
{
    section("stat", function ()
    {
        stat = watch.stat(_k_.file())
        compare(((stat != null)),true)
        compare(stat.isFile(),true)
        stat = watch.stat(_k_.dir())
        compare(((stat != null)),true)
        compare(stat.isDirectory(),true)
        stat = watch.stat(gone + '/nope')
        compare(((stat != null)),false)
        stat = watch.stat('')
        compare(((stat != null)),false)
        stat = watch.stat(_k_.file() + ':12')
        compare(((stat != null)),true)
    })
    section("ignore", function ()
    {
        w = watch.dir(gone)
        r = w.ignore('/a/b')
        compare(((r != null)),false)
        w = watch.dir(gone,{ignore:['\.log$']})
        r = w.ignore('/a/b.log')
        compare(((r != null)),true)
        r = w.ignore('/a/b.js')
        compare(((r != null)),false)
    })
    section("dirAndFile", function ()
    {
        w = watch.dir(gone)
        compare(w.dir,slash.path(gone))
        p = slash.path(gone,'a.txt')
        w = watch.file(p)
        compare(w.file,p)
        compare(w.dir,slash.path(gone))
    })
    section("onChange", function ()
    {
        w = watch.dir(gone,{emitRemove:true})
        seen = []
        w.on('change',(function (info)
        {
            return seen.push(info.change)
        }).bind(this))
        w.onChange('rename','ghost.txt',w.dir)
        compare(seen.length,1)
        compare(seen[0],'remove')
        w = watch.dir(gone,{ignore:['\.log$'],emitRemove:true})
        seen = []
        w.on('change',(function (info)
        {
            return seen.push(info.change)
        }).bind(this))
        w.onChange('rename','keep.log',w.dir)
        compare(seen.length,0)
        w = watch.file(slash.path(gone,'a.txt'))
        w.opt.emitRemove = true
        seen = []
        w.on('change',(function (info)
        {
            return seen.push(info.change)
        }).bind(this))
        w.onChange('rename','other.txt',w.dir)
        compare(seen.length,0)
    })
}
toExport["watch"]._section_ = true
toExport._test_ = true
export default toExport
