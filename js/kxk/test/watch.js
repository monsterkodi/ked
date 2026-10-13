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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva3hrL3Rlc3Qvd2F0Y2gua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFXQSxtQkFBYzs7Ozs7UUFNTixPQUFPLE1BQU07a0JBQ1osZUFBUztnQkFDVixLQUFLLFNBQVc7UUFFaEIsT0FBTyxNQUFNO2tCQUNaLGVBQVM7Z0JBQ1YsS0FBSyxjQUFnQjtRQUVyQixPQUFPLE1BQU0sS0FBSyxPQUFPO2tCQUN4QixlQUFTO1FBRVYsT0FBTyxNQUFNLEtBQUs7a0JBQ2pCLGVBQVM7UUFHVixPQUFPLE1BQU0sa0JBQWE7a0JBQ3pCLGVBQVM7Ozs7UUFJVixJQUFJLE1BQU0sSUFBSTtRQUNkLElBQUksRUFBRSxPQUFPO2tCQUNaLFlBQU07UUFFUCxJQUFJLE1BQU0sSUFBSSxNQUFNLFFBQVE7UUFDNUIsSUFBSSxFQUFFLE9BQU87a0JBQ1osWUFBTTtRQUNQLElBQUksRUFBRSxPQUFPO2tCQUNaLFlBQU07Ozs7UUFJUCxJQUFJLE1BQU0sSUFBSTtnQkFDZCxFQUFFLElBQU0sTUFBTSxLQUFLO1FBRW5CLElBQUksTUFBTSxLQUFLLEtBQU07UUFDckIsSUFBSSxNQUFNLEtBQUs7Z0JBQ2YsRUFBRSxLQUFPO2dCQUNULEVBQUUsSUFBTyxNQUFNLEtBQUs7Ozs7UUFNcEIsSUFBSSxNQUFNLElBQUksTUFBTSxXQUFXO1FBQy9CO1FBQ0EsRUFBRSxHQUFHOzttQkFBb0IsS0FBSyxLQUFLLEtBQUs7O1FBQ3hDLEVBQUUsU0FBUyxTQUFVLFlBQWEsRUFBRTtnQkFDcEMsS0FBSyxPQUFTO2dCQUNkLEtBQUssR0FBSztRQUdWLElBQUksTUFBTSxJQUFJLE1BQU0sUUFBUSxVQUFXLFdBQVc7UUFDbEQ7UUFDQSxFQUFFLEdBQUc7O21CQUFvQixLQUFLLEtBQUssS0FBSzs7UUFDeEMsRUFBRSxTQUFTLFNBQVUsV0FBWSxFQUFFO2dCQUNuQyxLQUFLLE9BQVM7UUFHZCxJQUFJLE1BQU0sS0FBSyxNQUFNLEtBQUssS0FBTTtRQUNoQyxFQUFFLElBQUksYUFBYTtRQUNuQjtRQUNBLEVBQUUsR0FBRzs7bUJBQW9CLEtBQUssS0FBSyxLQUFLOztRQUN4QyxFQUFFLFNBQVMsU0FBVSxZQUFhLEVBQUU7Z0JBQ3BDLEtBQUssT0FBUyJ9
//# sourceURL=file://kode/kxk/test/watch.kode
