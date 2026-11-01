var _k_ = {isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.g4=_k_.k.F256(_k_.k.g(4));_k_.b7=_k_.k.F256(_k_.k.b(7));_k_.w3=_k_.k.F256(_k_.k.w(3))

var leak

import v8 from "v8"


leak = (function ()
{
    function leak ()
    {}

    leak["interval"] = 30000
    leak["timer"] = null
    leak["began"] = null
    leak["count"] = 0
    leak["previous"] = null
    leak["peak"] = null
    leak["start"] = function (opt)
    {
        var head, interval, _32_33_, _32_69_, _47_24_

        if ((opt != null ? opt.headless : undefined) || (opt != null ? opt.colors : undefined))
        {
            return
        }
        leak.stop()
        interval = ((_32_33_=(opt != null ? opt.interval : undefined)) != null ? _32_33_ : parseInt(((_32_69_=process.env.KED_LEAK_INTERVAL) != null ? _32_69_ : 0)))
        leak.interval = _k_.isNum(interval) && interval > 0 ? interval : 10000
        leak.began = Date.now()
        leak.count = 0
        leak.previous = null
        leak.peak = null
        head = `leak ▸ sampling every ${leak.interval}ms`
        head += ` ▸ heap limit ${leak.size(leak.memory().limit)}`
        console.log(head)
        leak.sample()
        leak.timer = setInterval(((function ()
        {
            return leak.sample()
        }).bind(this)),leak.interval)
        ;(typeof leak.timer.unref === "function" ? leak.timer.unref() : undefined)
        return leak
    }

    leak["stop"] = function ()
    {
        if (leak.timer)
        {
            clearInterval(leak.timer)
        }
        return leak.timer = null
    }

    leak["size"] = function (bytes)
    {
        var i, n, units

        if (!bytes)
        {
            return _k_.lpad(9,'')
        }
        units = ['b','k','M','G','T']
        n = bytes
        i = 0
        while (n >= 1000 && i < units.length - 1)
        {
            n /= 1000
            i += 1
        }
        if (i === 0)
        {
            return _k_.b7(_k_.lpad(7,`${parseInt(n)}`)) + _k_.w3(` ${units[i]}`)
        }
        else
        {
            return _k_.b7(_k_.lpad(7,`${n.toFixed(1)}`)) + _k_.w3(` ${units[i]}`)
        }
    }

    leak["sign"] = function (bytes)
    {
        var prefix

        if (!bytes)
        {
            return ''
        }
        prefix = '+'
        if (bytes < 0)
        {
            prefix = '-'
        }
        return prefix + leak.size(Math.abs(bytes))
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
        var heap, mem, result, space, _106_42_, _107_51_

        mem = process.memoryUsage()
        heap = v8.getHeapStatistics()
        space = leak.spaces()
        result = {rss:mem.rss,heapTotal:mem.heapTotal,heapUsed:mem.heapUsed,external:mem.external,arrayBuffers:mem.arrayBuffers,limit:heap.heap_size_limit,old:((_106_42_=space.old_space) != null ? _106_42_ : 0),large:((_107_51_=space.large_object_space) != null ? _107_51_ : 0)}
        return result
    }

    leak["sample"] = function ()
    {
        var before, line, mem, peak, percent, _116_31_, _117_27_

        mem = leak.memory()
        before = ((_116_31_=leak.previous) != null ? _116_31_ : mem)
        peak = ((_117_27_=leak.peak) != null ? _117_27_ : mem)
        leak.previous = mem
        leak.count += 1
        peak.rss = Math.max(peak.rss,mem.rss)
        peak.heapUsed = Math.max(peak.heapUsed,mem.heapUsed)
        leak.peak = peak
        percent = 100 * mem.heapUsed / mem.limit
        line = `${leak.size(mem.rss)} ${_k_.lpad(10,leak.sign(mem.rss - before.rss))}`
        line += `${leak.size(mem.heapUsed)} ${_k_.g4(percent.toFixed(1))}${_k_.w3('%')} ${_k_.lpad(10,leak.sign(mem.heapUsed - before.heapUsed))}`
        line += `${leak.size(mem.heapTotal)}`
        line += `${leak.size(mem.external)} ${leak.size(mem.arrayBuffers)}`
        line += `${leak.size(mem.old)} ${leak.size(mem.large)}`
        line += `${leak.size(peak.rss)} ${leak.size(peak.heapUsed)}`
        console.log(line)
        return mem
    }

    return leak
})()

export default leak;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9sZWFrLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FZSSxTQUFBOzs7QUFFSyxRQUFUOzs7OztJQUVJLE1BQUMsYUFBVTtJQUNYLE1BQUMsVUFBTztJQUNSLE1BQUMsVUFBTztJQUNSLE1BQUMsVUFBTztJQUNSLE1BQUMsYUFBVTtJQUNYLE1BQUMsU0FBTTtJQUlQLE1BQUMsb0JBQVE7Ozs7YUFFQyxjQUFBLElBQUssMEJBQVksY0FBQSxJQUFLOzs7O1FBRTVCLEtBQUs7UUFFTCxzQkFBVyxjQUFBLElBQUssOERBQWUsUUFBUSxJQUFJLHVDQUFvQjtRQUMvRCxLQUFLLFdBQTBCLFVBQVosYUFBb0IsV0FBVyxJQUFJLFdBQWM7UUFFcEUsS0FBSyxRQUFXLEtBQUs7UUFDckIsS0FBSyxRQUFXO1FBQ2hCLEtBQUssV0FBVztRQUNoQixLQUFLLE9BQVc7UUFFaEIsZ0NBQWlDLEtBQUs7UUFDdEMseUJBQXlCLEtBQUssS0FBSyxLQUFLLFNBQVM7UUFDakQsWUFBSTtRQUVKLEtBQUs7UUFFTCxLQUFLLFFBQVE7O21CQUFnQixLQUFLO3VCQUFVLEtBQUs7aUJBQ2pELEtBQUssTUFBTSx1QkFBWCxLQUFLLE1BQU07ZUFFWDs7O0lBRUosTUFBQzs7WUFFK0IsS0FBSzs7WUFBakMsY0FBYyxLQUFLOztlQUNuQixLQUFLLFFBQVE7OztJQUlqQixNQUFDLG1CQUFNOzs7O2FBRWdCOzs0QkFBWixFQUFFOztRQUVULFNBQVUsSUFBSSxJQUFJLElBQUksSUFBSTtRQUMxQixJQUFJO1FBQ0osSUFBSTtlQUVFLEtBQUssUUFBUyxJQUFJLE1BQU0sU0FBUzs7WUFDbkMsS0FBSztZQUNMLEtBQUs7O1lBRU4sTUFBSzs7bUJBQUksZ0JBQVEsY0FBUyxTQUFRLFdBQU8sTUFBTTs7OzttQkFDdEMsZ0JBQVEsS0FBSyxFQUFFLFFBQVEsU0FBUyxXQUFPLE1BQU07Ozs7SUFFN0QsTUFBQyxtQkFBTTs7OzthQUVTOzttQkFBVjs7UUFFRixTQUFTO1lBQ08sUUFBUTs7WUFBeEIsU0FBUzs7ZUFFVCxTQUFTLEtBQUssS0FBSyxLQUFLLElBQUk7OztJQUloQyxNQUFDOzs7O1FBRUc7NEJBRVksR0FBRzs7O1lBQVg7WUFDQSxLQUFLLEtBQUssY0FBYyxLQUFLOztlQUVqQzs7O0lBRUosTUFBQzs7OztRQUVHLE1BQVEsUUFBUTtRQUNoQixPQUFRLEdBQUc7UUFDWCxRQUFRLEtBQUs7UUFFYixVQUNJLElBQWMsSUFBSSxJQUNsQixVQUFjLElBQUksVUFDbEIsU0FBYyxJQUFJLFNBQ2xCLFNBQWMsSUFBSSxTQUNsQixhQUFjLElBQUksYUFDbEIsTUFBYyxLQUFLLGdCQUNuQixlQUFjLE1BQU0sZ0NBQVksR0FDaEMsaUJBQWMsTUFBTSx5Q0FBcUI7ZUFFN0M7OztJQUlKLE1BQUM7Ozs7UUFFRyxNQUFTLEtBQUs7UUFDZCxvQkFBUyxLQUFLLCtCQUFXO1FBQ3pCLGtCQUFTLEtBQUssMkJBQU87UUFFckIsS0FBSyxXQUFXO1FBQ2hCLEtBQUssU0FBVztRQUVoQixLQUFLLE1BQVcsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJO1FBQ3RDLEtBQUssV0FBVyxLQUFLLElBQUksS0FBSyxTQUFTLElBQUk7UUFDM0MsS0FBSyxPQUFXO1FBRWhCLFVBQVUsTUFBTSxJQUFJLFdBQVcsSUFBSTtRQUVuQyxVQUFVLEtBQUssS0FBSyxJQUFJLGlCQUFhLEdBQUksS0FBSyxLQUFLLElBQUksTUFBTSxPQUFPO1FBQ3BFLFdBQVcsS0FBSyxLQUFLLElBQUksYUFBYSxPQUFHLFFBQVEsUUFBUSxNQUFLLE9BQUcsaUJBQWEsR0FBSSxLQUFLLEtBQUssSUFBSSxXQUFXLE9BQU87UUFDbEgsV0FBVyxLQUFLLEtBQUssSUFBSTtRQUN6QixXQUFXLEtBQUssS0FBSyxJQUFJLGFBQWEsS0FBSyxLQUFLLElBQUk7UUFDcEQsV0FBVyxLQUFLLEtBQUssSUFBSSxRQUFRLEtBQUssS0FBSyxJQUFJO1FBQy9DLFdBQVcsS0FBSyxLQUFLLEtBQUssUUFBUSxLQUFLLEtBQUssS0FBSztRQUVqRCxZQUFJO2VBRUo7OztXQTFIQzs7O2VBNEhGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/leak.kode
