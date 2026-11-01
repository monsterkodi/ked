var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.g1=_k_.k.F256(_k_.k.g(1));_k_.g4=_k_.k.F256(_k_.k.g(4));_k_.b2=_k_.k.F256(_k_.k.b(2));_k_.b7=_k_.k.F256(_k_.k.b(7))

var leak

import v8 from "v8"


leak = (function ()
{
    function leak ()
    {}

    leak["interval"] = 10000
    leak["timer"] = null
    leak["peak"] = null
    leak["previous"] = null
    leak["start"] = function (opt)
    {
        var head, _29_24_

        if ((opt != null ? opt.headless : undefined) || (opt != null ? opt.headless_colors : undefined))
        {
            return
        }
        head = `leak ▸ sampling every ${leak.interval}ms`
        head += ` ▸ heap limit ${leak.size(leak.memory().limit)}`
        console.log(head)
        leak.sample()
        leak.timer = setInterval(((function ()
        {
            return leak.sample()
        }).bind(this)),leak.interval)
        return (typeof leak.timer.unref === "function" ? leak.timer.unref() : undefined)
    }

    leak["size"] = function (bytes)
    {
        return _k_.b7(_k_.lpad(5,`${parseInt(bytes / 1000000)}`))
    }

    leak["sign"] = function (bytes)
    {
        var s

        s = `${parseInt(Math.abs(bytes) / 1000000)}`
        s = s.replace('0','')
        s = _k_.lpad(5,s)
        if (bytes < 0)
        {
            return _k_.g1(s)
        }
        else
        {
            return _k_.r6(s)
        }
    }

    leak["spaces"] = function ()
    {
        var stat, used

        used = {}
        var list = _k_.list(v8.getHeapSpaceStatistics())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            stat = list[_a_]
            used[stat.space_name] = stat.space_used_size
        }
        return used
    }

    leak["memory"] = function ()
    {
        var heap, mem, result, space, _64_42_

        mem = process.memoryUsage()
        heap = v8.getHeapStatistics()
        space = leak.spaces()
        result = {rss:mem.rss,heapTotal:mem.heapTotal,heapUsed:mem.heapUsed,external:mem.external,arrayBuffers:mem.arrayBuffers,limit:heap.heap_size_limit,old:((_64_42_=space.old_space) != null ? _64_42_ : 0)}
        return result
    }

    leak["sample"] = function ()
    {
        var before, line, mem, peak, percent, _71_31_, _72_27_

        mem = leak.memory()
        before = ((_71_31_=leak.previous) != null ? _71_31_ : mem)
        peak = ((_72_27_=leak.peak) != null ? _72_27_ : mem)
        leak.previous = mem
        peak.rss = Math.max(peak.rss,mem.rss)
        peak.heapUsed = Math.max(peak.heapUsed,mem.heapUsed)
        leak.peak = peak
        percent = 100 * mem.heapUsed / mem.limit
        line = `${_k_.g4(_k_.lpad(5,percent.toFixed(1)))}${_k_.g1('%')} `
        line += _k_.b2(" rss ")
        line += `${leak.size(mem.rss)}`
        line += `${leak.sign(mem.rss - before.rss)}`
        line += _k_.b2(" heap ")
        line += `${leak.size(mem.heapUsed)}`
        line += `${leak.sign(mem.heapUsed - before.heapUsed)}`
        line += _k_.b2(" total ")
        line += `${leak.size(mem.heapTotal)}`
        line += _k_.b2(" old ")
        line += `${leak.size(mem.old)}`
        console.log(line)
        return mem
    }

    return leak
})()

export default leak;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9sZWFrLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRSSxTQUFBOzs7QUFFSyxRQUFUOzs7OztJQUVJLE1BQUMsYUFBVTtJQUNYLE1BQUMsVUFBVTtJQUNYLE1BQUMsU0FBVTtJQUNYLE1BQUMsYUFBVTtJQUVYLE1BQUMsb0JBQVE7Ozs7YUFFQSxjQUFBLElBQUssMEJBQVksY0FBQSxJQUFLOzs7O1FBRTNCLGdDQUFpQyxLQUFLO1FBQ3RDLHlCQUF5QixLQUFLLEtBQUssS0FBSyxTQUFTO1FBQ2pELFlBQUk7UUFFSixLQUFLO1FBRUwsS0FBSyxRQUFROzttQkFBZ0IsS0FBSzt1QkFBVSxLQUFLO3VCQUNqRCxLQUFLLE1BQU0sdUJBQVgsS0FBSyxNQUFNOzs7SUFFZixNQUFDLG1CQUFNOztlQUVILGdCQUFRLGNBQVMsUUFBUTs7O0lBRTdCLE1BQUMsbUJBQU07Ozs7UUFDSCxnQkFBVyxLQUFLLElBQUksU0FBTztRQUMzQixJQUFJLEVBQUUsUUFBUSxJQUFJO1FBQ2xCLGFBQVMsRUFBRTtZQUNSLFFBQVE7O21CQUNQLE9BQUc7Ozs7bUJBRUgsT0FBRzs7OztJQUVYLE1BQUM7Ozs7UUFFRzs0QkFDWSxHQUFHOzs7WUFBWDtZQUNBLEtBQUssS0FBSyxjQUFjLEtBQUs7O2VBQ2pDOzs7SUFFSixNQUFDOzs7O1FBRUcsTUFBUSxRQUFRO1FBQ2hCLE9BQVEsR0FBRztRQUNYLFFBQVEsS0FBSztRQUViLFVBQ0ksSUFBYyxJQUFJLElBQ2xCLFVBQWMsSUFBSSxVQUNsQixTQUFjLElBQUksU0FDbEIsU0FBYyxJQUFJLFNBQ2xCLGFBQWMsSUFBSSxhQUNsQixNQUFjLEtBQUssZ0JBQ25CLGNBQWMsTUFBTSwrQkFBWTtlQUVwQzs7O0lBRUosTUFBQzs7OztRQUVHLE1BQVMsS0FBSztRQUNkLG1CQUFTLEtBQUssOEJBQVc7UUFDekIsaUJBQVMsS0FBSywwQkFBTztRQUVyQixLQUFLLFdBQVc7UUFFaEIsS0FBSyxNQUFXLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSTtRQUN0QyxLQUFLLFdBQVcsS0FBSyxJQUFJLEtBQUssU0FBUyxJQUFJO1FBQzNDLEtBQUssT0FBVztRQUVoQixVQUFVLE1BQU0sSUFBSSxXQUFXLElBQUk7UUFFbkMsVUFBVyxnQkFBUSxFQUFFLFFBQVEsUUFBUSxPQUFPLE9BQUc7UUFFL0MsUUFBUSxPQUFHO1FBQ1gsV0FBVyxLQUFLLEtBQUssSUFBSTtRQUN6QixXQUFXLEtBQUssS0FBSyxJQUFJLE1BQU0sT0FBTztRQUl0QyxRQUFRLE9BQUc7UUFDWCxXQUFXLEtBQUssS0FBSyxJQUFJO1FBQ3pCLFdBQVcsS0FBSyxLQUFLLElBQUksV0FBVyxPQUFPO1FBQzNDLFFBQVEsT0FBRztRQUNYLFdBQVcsS0FBSyxLQUFLLElBQUk7UUFJekIsUUFBUSxPQUFHO1FBQ1gsV0FBVyxLQUFLLEtBQUssSUFBSTtRQUV6QixZQUFJO2VBRUo7OztXQTVGQzs7O2VBOEZGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/leak.kode
