var toExport = {}
var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, file: function () { return import.meta.url.substring(7); }}

var gone, p, r, seen, stat, w

import slash from "../slash.js"
import watch from "../watch.js"

gone = _k_.dir() + '/.watch-test-nonexistent'
toExport["watch"] = async function ()
{
    await section("stat", async function ()
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
    await section("ignore", async function ()
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
    await section("dirAndFile", async function ()
    {
        w = watch.dir(gone)
        compare(w.dir,slash.path(gone))
        p = slash.path(gone,'a.txt')
        w = watch.file(p)
        compare(w.file,p)
        compare(w.dir,slash.path(gone))
    })
    await section("onChange", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva3hrL3Rlc3Qvd2F0Y2gua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FRUyxZQUFBO09BQU0sWUFBQTs7QUFHZixPQUFRLFlBQU07Ozs7O1FBTU4sT0FBTyxNQUFNLEtBQU07a0JBQ2xCLGVBQVM7Z0JBQ1YsS0FBSyxTQUFXO1FBRWhCLE9BQU8sTUFBTSxLQUFNO2tCQUNsQixlQUFTO2dCQUNWLEtBQUssY0FBZ0I7UUFFckIsT0FBTyxNQUFNLEtBQUssT0FBTztrQkFDeEIsZUFBUztRQUVWLE9BQU8sTUFBTSxLQUFLO2tCQUNqQixlQUFTO1FBR1YsT0FBTyxNQUFNLEtBQU0sYUFBTztrQkFDekIsZUFBUzs7OztRQUlWLElBQUksTUFBTSxJQUFJO1FBQ2QsSUFBSSxFQUFFLE9BQU87a0JBQ1osWUFBTTtRQUVQLElBQUksTUFBTSxJQUFJLE1BQU0sUUFBUTtRQUM1QixJQUFJLEVBQUUsT0FBTztrQkFDWixZQUFNO1FBQ1AsSUFBSSxFQUFFLE9BQU87a0JBQ1osWUFBTTs7OztRQUlQLElBQUksTUFBTSxJQUFJO2dCQUNkLEVBQUUsSUFBTSxNQUFNLEtBQUs7UUFFbkIsSUFBSSxNQUFNLEtBQUssS0FBTTtRQUNyQixJQUFJLE1BQU0sS0FBSztnQkFDZixFQUFFLEtBQU87Z0JBQ1QsRUFBRSxJQUFPLE1BQU0sS0FBSzs7OztRQU1wQixJQUFJLE1BQU0sSUFBSSxNQUFNLFdBQVc7UUFDL0I7UUFDQSxFQUFFLEdBQUcsb0JBQVc7O21CQUFTLEtBQUssS0FBSyxLQUFLOztRQUN4QyxFQUFFLFNBQVMsU0FBVSxZQUFhLEVBQUU7Z0JBQ3BDLEtBQUssT0FBUztnQkFDZCxLQUFLLEdBQUs7UUFHVixJQUFJLE1BQU0sSUFBSSxNQUFNLFFBQVEsVUFBVyxXQUFXO1FBQ2xEO1FBQ0EsRUFBRSxHQUFHLG9CQUFXOzttQkFBUyxLQUFLLEtBQUssS0FBSzs7UUFDeEMsRUFBRSxTQUFTLFNBQVUsV0FBWSxFQUFFO2dCQUNuQyxLQUFLLE9BQVM7UUFHZCxJQUFJLE1BQU0sS0FBSyxNQUFNLEtBQUssS0FBTTtRQUNoQyxFQUFFLElBQUksYUFBYTtRQUNuQjtRQUNBLEVBQUUsR0FBRyxvQkFBVzs7bUJBQVMsS0FBSyxLQUFLLEtBQUs7O1FBQ3hDLEVBQUUsU0FBUyxTQUFVLFlBQWEsRUFBRTtnQkFDcEMsS0FBSyxPQUFTIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/watch.kode
