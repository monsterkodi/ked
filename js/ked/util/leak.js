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

        if ((opt != null ? opt.headless : undefined))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9sZWFrLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRSSxTQUFBOzs7QUFFSyxRQUFUOzs7OztJQUVJLE1BQUMsYUFBVTtJQUNYLE1BQUMsVUFBVTtJQUNYLE1BQUMsU0FBVTtJQUNYLE1BQUMsYUFBVTtJQUVYLE1BQUMsb0JBQVE7Ozs7YUFFQSxjQUFBLElBQUs7Ozs7UUFFVixnQ0FBaUMsS0FBSztRQUN0Qyx5QkFBeUIsS0FBSyxLQUFLLEtBQUssU0FBUztRQUNqRCxZQUFJO1FBRUosS0FBSztRQUVMLEtBQUssUUFBUTs7bUJBQWdCLEtBQUs7dUJBQVUsS0FBSzt1QkFDakQsS0FBSyxNQUFNLHVCQUFYLEtBQUssTUFBTTs7O0lBRWYsTUFBQyxtQkFBTTs7ZUFFSCxnQkFBUSxjQUFTLFFBQVE7OztJQUU3QixNQUFDLG1CQUFNOzs7O1FBQ0gsZ0JBQVcsS0FBSyxJQUFJLFNBQU87UUFDM0IsSUFBSSxFQUFFLFFBQVEsSUFBSTtRQUNsQixhQUFTLEVBQUU7WUFDUixRQUFROzttQkFDUCxPQUFHOzs7O21CQUVILE9BQUc7Ozs7SUFFWCxNQUFDOzs7O1FBRUc7NEJBQ1ksR0FBRzs7O1lBQVg7WUFDQSxLQUFLLEtBQUssY0FBYyxLQUFLOztlQUNqQzs7O0lBRUosTUFBQzs7OztRQUVHLE1BQVEsUUFBUTtRQUNoQixPQUFRLEdBQUc7UUFDWCxRQUFRLEtBQUs7UUFFYixVQUNJLElBQWMsSUFBSSxJQUNsQixVQUFjLElBQUksVUFDbEIsU0FBYyxJQUFJLFNBQ2xCLFNBQWMsSUFBSSxTQUNsQixhQUFjLElBQUksYUFDbEIsTUFBYyxLQUFLLGdCQUNuQixjQUFjLE1BQU0sK0JBQVk7ZUFFcEM7OztJQUVKLE1BQUM7Ozs7UUFFRyxNQUFTLEtBQUs7UUFDZCxtQkFBUyxLQUFLLDhCQUFXO1FBQ3pCLGlCQUFTLEtBQUssMEJBQU87UUFFckIsS0FBSyxXQUFXO1FBRWhCLEtBQUssTUFBVyxLQUFLLElBQUksS0FBSyxJQUFJLElBQUk7UUFDdEMsS0FBSyxXQUFXLEtBQUssSUFBSSxLQUFLLFNBQVMsSUFBSTtRQUMzQyxLQUFLLE9BQVc7UUFFaEIsVUFBVSxNQUFNLElBQUksV0FBVyxJQUFJO1FBRW5DLFVBQVcsZ0JBQVEsRUFBRSxRQUFRLFFBQVEsT0FBTyxPQUFHO1FBRS9DLFFBQVEsT0FBRztRQUNYLFdBQVcsS0FBSyxLQUFLLElBQUk7UUFDekIsV0FBVyxLQUFLLEtBQUssSUFBSSxNQUFNLE9BQU87UUFJdEMsUUFBUSxPQUFHO1FBQ1gsV0FBVyxLQUFLLEtBQUssSUFBSTtRQUN6QixXQUFXLEtBQUssS0FBSyxJQUFJLFdBQVcsT0FBTztRQUMzQyxRQUFRLE9BQUc7UUFDWCxXQUFXLEtBQUssS0FBSyxJQUFJO1FBSXpCLFFBQVEsT0FBRztRQUNYLFdBQVcsS0FBSyxLQUFLLElBQUk7UUFFekIsWUFBSTtlQUVKOzs7V0E1RkM7OztlQThGRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/leak.kode
