var _k_ = {isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        var head, interval, _32_33_, _32_69_, _49_24_

        if ((opt != null ? opt.headless : undefined) || (opt != null ? opt.colors : undefined))
        {
            return
        }
        leak.stop()
        interval = ((_32_33_=(opt != null ? opt.interval : undefined)) != null ? _32_33_ : parseInt(((_32_69_=process.env.KED_LEAK_INTERVAL) != null ? _32_69_ : 0)))
        leak.interval = _k_.isNum(interval) && interval > 0 ? interval : 30000
        leak.began = Date.now()
        leak.count = 0
        leak.previous = null
        leak.peak = null
        head = `leak ▸ sampling every ${leak.interval}ms`
        head += ` ▸ heap limit ${leak.size(leak.memory().limit)}`
        head += " ▸ deltas are since the previous sample"
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
            return '0 B'
        }
        units = ['B','kB','MB','GB','TB']
        n = bytes
        i = 0
        while (n >= 1000 && i < units.length - 1)
        {
            n /= 1000
            i += 1
        }
        if (i === 0)
        {
            return `${parseInt(n)} B`
        }
        else
        {
            return `${n.toFixed(1)} ${units[i]}`
        }
    }

    leak["sign"] = function (bytes)
    {
        var prefix

        if (!bytes)
        {
            return '0 B'
        }
        prefix = '+'
        if (bytes < 0)
        {
            prefix = '-'
        }
        return prefix + leak.size(Math.abs(bytes))
    }

    leak["stamp"] = function (ms)
    {
        var hour, min, sec

        sec = parseInt(ms / 1000)
        if (sec < 60)
        {
            return `${sec}s`
        }
        min = parseInt(sec / 60)
        if (min < 60)
        {
            return `${min}m${_k_.lpad(2,sec % 60,'0')}s`
        }
        hour = parseInt(min / 60)
        return `${hour}h${_k_.lpad(2,min % 60,'0')}m`
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
        var heap, mem, result, space, _122_42_, _123_51_

        mem = process.memoryUsage()
        heap = v8.getHeapStatistics()
        space = leak.spaces()
        result = {rss:mem.rss,heapTotal:mem.heapTotal,heapUsed:mem.heapUsed,external:mem.external,arrayBuffers:mem.arrayBuffers,limit:heap.heap_size_limit,old:((_122_42_=space.old_space) != null ? _122_42_ : 0),large:((_123_51_=space.large_object_space) != null ? _123_51_ : 0)}
        return result
    }

    leak["sample"] = function ()
    {
        var before, elapsed, line, mem, peak, percent, _132_31_, _133_27_, _142_43_

        mem = leak.memory()
        before = ((_132_31_=leak.previous) != null ? _132_31_ : mem)
        peak = ((_133_27_=leak.peak) != null ? _133_27_ : mem)
        leak.previous = mem
        leak.count += 1
        peak.rss = Math.max(peak.rss,mem.rss)
        peak.heapUsed = Math.max(peak.heapUsed,mem.heapUsed)
        leak.peak = peak
        elapsed = Date.now() - (((_142_43_=leak.began) != null ? _142_43_ : Date.now()))
        percent = 100 * mem.heapUsed / mem.limit
        line = `leak ▸ ${_k_.lpad(6,leak.stamp(elapsed))} ${_k_.lpad(4,'#' + leak.count)}`
        line += ` rss ${leak.size(mem.rss)} (${leak.sign(mem.rss - before.rss)})`
        line += ` heap ${leak.size(mem.heapUsed)} ${percent.toFixed(1)}% (${leak.sign(mem.heapUsed - before.heapUsed)})`
        line += ` total ${leak.size(mem.heapTotal)}`
        line += ` ext ${leak.size(mem.external)} buf ${leak.size(mem.arrayBuffers)}`
        line += ` old ${leak.size(mem.old)} large ${leak.size(mem.large)}`
        line += ` peak rss ${leak.size(peak.rss)} heap ${leak.size(peak.heapUsed)}`
        console.log(line)
        return mem
    }

    return leak
})()

export default leak;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9sZWFrLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FZSSxTQUFBOzs7QUFFSyxRQUFUOzs7OztJQUVJLE1BQUMsYUFBVTtJQUNYLE1BQUMsVUFBTztJQUNSLE1BQUMsVUFBTztJQUNSLE1BQUMsVUFBTztJQUNSLE1BQUMsYUFBVTtJQUNYLE1BQUMsU0FBTTtJQUlQLE1BQUMsb0JBQVE7Ozs7YUFFQyxjQUFBLElBQUssMEJBQVksY0FBQSxJQUFLOzs7O1FBRTVCLEtBQUs7UUFFTCxzQkFBVyxjQUFBLElBQUssOERBQWUsUUFBUSxJQUFJLHVDQUFvQjtRQUMvRCxLQUFLLFdBQTBCLFVBQVosYUFBb0IsV0FBVyxJQUFJLFdBQWM7UUFFcEUsS0FBSyxRQUFXLEtBQUs7UUFDckIsS0FBSyxRQUFXO1FBQ2hCLEtBQUssV0FBVztRQUNoQixLQUFLLE9BQVc7UUFFaEIsZ0NBQWlDLEtBQUs7UUFDdEMseUJBQXlCLEtBQUssS0FBSyxLQUFLLFNBQVM7UUFDakQsUUFBUTtRQUVSLFlBQUk7UUFFSixLQUFLO1FBRUwsS0FBSyxRQUFROzttQkFBZ0IsS0FBSzt1QkFBVSxLQUFLO2lCQUNqRCxLQUFLLE1BQU0sdUJBQVgsS0FBSyxNQUFNO2VBRVg7OztJQUVKLE1BQUM7O1lBRStCLEtBQUs7O1lBQWpDLGNBQWMsS0FBSzs7ZUFDbkIsS0FBSyxRQUFROzs7SUFJakIsTUFBQyxtQkFBTTs7OzthQUVZOzttQkFBYjs7UUFFRixTQUFVLElBQUksS0FBSyxLQUFLLEtBQUs7UUFDN0IsSUFBSTtRQUNKLElBQUk7ZUFFRSxLQUFLLFFBQVMsSUFBSSxNQUFNLFNBQVM7O1lBQ25DLEtBQUs7WUFDTCxLQUFLOztZQUVOLE1BQUs7OytCQUFXOzs7O3NCQUNMLEVBQUUsUUFBUSxNQUFNLE1BQU07Ozs7SUFFeEMsTUFBQyxtQkFBTTs7OzthQUVZOzttQkFBYjs7UUFFRixTQUFTO1lBQ08sUUFBUTs7WUFBeEIsU0FBUzs7ZUFFVCxTQUFTLEtBQUssS0FBSyxLQUFLLElBQUk7OztJQUVoQyxNQUFDLG9CQUFPOzs7O1FBRUosZUFBVSxLQUFHO1lBRUUsTUFBTTs7c0JBQWhCOztRQUVMLGVBQVUsTUFBSTtZQUV5QixNQUFNOztzQkFBeEMsZ0JBQVksRUFBRyxNQUFJLEdBQUk7O1FBRTVCLGdCQUFXLE1BQUk7a0JBRVosaUJBQWEsRUFBRyxNQUFJLEdBQUk7OztJQUkvQixNQUFDOzs7O1FBRUc7NEJBRVksR0FBRzs7O1lBQVg7WUFDQSxLQUFLLEtBQUssY0FBYyxLQUFLOztlQUVqQzs7O0lBRUosTUFBQzs7OztRQUVHLE1BQVEsUUFBUTtRQUNoQixPQUFRLEdBQUc7UUFDWCxRQUFRLEtBQUs7UUFFYixVQUNJLElBQWMsSUFBSSxJQUNsQixVQUFjLElBQUksVUFDbEIsU0FBYyxJQUFJLFNBQ2xCLFNBQWMsSUFBSSxTQUNsQixhQUFjLElBQUksYUFDbEIsTUFBYyxLQUFLLGdCQUNuQixlQUFjLE1BQU0sZ0NBQVksR0FDaEMsaUJBQWMsTUFBTSx5Q0FBcUI7ZUFFN0M7OztJQUlKLE1BQUM7Ozs7UUFFRyxNQUFTLEtBQUs7UUFDZCxvQkFBUyxLQUFLLCtCQUFXO1FBQ3pCLGtCQUFTLEtBQUssMkJBQU87UUFFckIsS0FBSyxXQUFXO1FBQ2hCLEtBQUssU0FBVztRQUVoQixLQUFLLE1BQVcsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJO1FBQ3RDLEtBQUssV0FBVyxLQUFLLElBQUksS0FBSyxTQUFTLElBQUk7UUFDM0MsS0FBSyxPQUFXO1FBRWhCLFVBQVUsS0FBSyxvQkFBUyxLQUFLLDRCQUFRLEtBQUs7UUFDMUMsVUFBVSxNQUFNLElBQUksV0FBVyxJQUFJO1FBRW5DLDBCQUF1QixFQUFHLEtBQUssTUFBTSxzQkFBa0IsRUFBRyxNQUFNLEtBQUs7UUFDckUsZ0JBQWdCLEtBQUssS0FBSyxJQUFJLFNBQVMsS0FBSyxLQUFLLElBQUksTUFBTSxPQUFPO1FBQ2xFLGlCQUFpQixLQUFLLEtBQUssSUFBSSxhQUFhLFFBQVEsUUFBUSxRQUFRLEtBQUssS0FBSyxJQUFJLFdBQVcsT0FBTztRQUNwRyxrQkFBa0IsS0FBSyxLQUFLLElBQUk7UUFDaEMsZ0JBQWdCLEtBQUssS0FBSyxJQUFJLGlCQUFpQixLQUFLLEtBQUssSUFBSTtRQUM3RCxnQkFBZ0IsS0FBSyxLQUFLLElBQUksY0FBYyxLQUFLLEtBQUssSUFBSTtRQUMxRCxxQkFBcUIsS0FBSyxLQUFLLEtBQUssYUFBYSxLQUFLLEtBQUssS0FBSztRQUVoRSxZQUFJO2VBRUo7OztXQTVJQzs7O2VBOElGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/leak.kode
