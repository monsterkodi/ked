var toExport = {}
var first, keep, lines, mem, second

import kxk from "../../kxk.js"
let sleep = kxk.sleep

import leak from "../util/leak.js"

toExport["leak"] = async function ()
{
    await section("a size is readable", async function ()
    {
        compare(leak.size(0),'0 B')
        compare(leak.size(999),'999 B')
        compare(leak.size(1000),'1.0 kB')
        compare(leak.size(1536),'1.5 kB')
        compare(leak.size(5242880),'5.2 MB')
    })
    await section("a difference keeps its sign", async function ()
    {
        compare(leak.sign(0),'0 B')
        compare(leak.sign(2048),'+2.0 kB')
        compare(leak.sign(-2048),'-2.0 kB')
    })
    await section("a stamp is a span of time", async function ()
    {
        compare(leak.stamp(0),'0s')
        compare(leak.stamp(59000),'59s')
        compare(leak.stamp(65000),'1m05s')
        compare(leak.stamp(3725000),'1h02m')
    })
    await section("memory has the numbers", async function ()
    {
        mem = leak.memory()
        compare((mem.rss > 0),true)
        compare((mem.heapUsed > 0),true)
        compare((mem.limit > 0),true)
    })
    await section("a headless run samples nothing", async function ()
    {
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        leak.start({headless:true,interval:10})
        await sleep(30)
        leak.stop()
        console.log = keep
        compare(lines.length,0)
    })
    await section("a sample logs one line of memory numbers", async function ()
    {
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args.join(' '))
        }
        leak.start({interval:10})
        await sleep(40)
        leak.stop()
        console.log = keep
        compare((lines.length > 1),true)
        compare((lines[0].includes('sampling every')),true)
        compare((lines[1].includes('rss')),true)
        compare((lines[1].includes('heap')),true)
        compare((lines[1].includes('peak')),true)
    })
    await section("a sample reports what it measured", async function ()
    {
        keep = console.log
        console.log = function ()
        {}
        mem = leak.sample()
        console.log = keep
        compare((mem.rss > 0),true)
        compare((mem.heapUsed > 0),true)
    })
    await section("starting twice keeps one timer", async function ()
    {
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        leak.start({interval:10})
        first = leak.timer
        leak.start({interval:10})
        second = leak.timer
        leak.stop()
        console.log = keep
        compare((first !== second),true)
        compare(leak.timer,null)
    })
}
toExport["leak"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9sZWFrLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFVLFVBQUE7SUFBTTs7T0FDRixXQUFQOzs7Ozs7Z0JBTUMsS0FBSyxLQUFLLEdBQUs7Z0JBQ2YsS0FBSyxLQUFLLEtBQU87Z0JBQ2pCLEtBQUssS0FBSyxNQUFRO2dCQUNsQixLQUFLLEtBQUssTUFBUTtnQkFDbEIsS0FBSyxLQUFLLFNBQVc7Ozs7Z0JBSXJCLEtBQUssS0FBSyxHQUFLO2dCQUNmLEtBQUssS0FBSyxNQUFRO2dCQUNsQixLQUFLLEtBQUssT0FBUzs7OztnQkFJbkIsS0FBSyxNQUFNLEdBQUs7Z0JBQ2hCLEtBQUssTUFBTSxPQUFTO2dCQUNwQixLQUFLLE1BQU0sT0FBUztnQkFDcEIsS0FBSyxNQUFNLFNBQVc7Ozs7UUFJdEIsTUFBTSxLQUFLO2lCQUVWLElBQUksTUFBTSxHQUFLO2lCQUNmLElBQUksV0FBVyxHQUFLO2lCQUNwQixJQUFJLFFBQVEsR0FBSzs7OztRQUlsQjtRQUNBLE9BQU8sUUFBUTtRQUNmLFFBQVEsZ0JBQU87O21CQUFZLE1BQU0sS0FBSzs7UUFFdEMsS0FBSyxPQUFNLFNBQVMsS0FBSyxTQUFTO2NBQ2hDLE1BQU07UUFDUixLQUFLO1FBQ0wsUUFBUSxNQUFNO2dCQUVkLE1BQU0sT0FBUzs7OztRQUlmO1FBQ0EsT0FBTyxRQUFRO1FBQ2YsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLLEtBQUssS0FBSzs7UUFFaEQsS0FBSyxPQUFNLFNBQVM7Y0FDbEIsTUFBTTtRQUNSLEtBQUs7UUFDTCxRQUFRLE1BQU07aUJBRWIsTUFBTSxTQUFTLEdBQUs7aUJBQ3BCLE1BQU0sR0FBRyxTQUFTLG1CQUFxQjtpQkFDdkMsTUFBTSxHQUFHLFNBQVMsUUFBVTtpQkFDNUIsTUFBTSxHQUFHLFNBQVMsU0FBVztpQkFDN0IsTUFBTSxHQUFHLFNBQVMsU0FBVzs7OztRQUk5QixPQUFPLFFBQVE7UUFDZixRQUFROztRQUVSLE1BQU0sS0FBSztRQUVYLFFBQVEsTUFBTTtpQkFFYixJQUFJLE1BQU0sR0FBSztpQkFDZixJQUFJLFdBQVcsR0FBSzs7OztRQUlyQjtRQUNBLE9BQU8sUUFBUTtRQUNmLFFBQVEsZ0JBQU87O21CQUFZLE1BQU0sS0FBSzs7UUFFdEMsS0FBSyxPQUFNLFNBQVM7UUFDcEIsUUFBUSxLQUFLO1FBQ2IsS0FBSyxPQUFNLFNBQVM7UUFDcEIsU0FBUyxLQUFLO1FBQ2QsS0FBSztRQUNMLFFBQVEsTUFBTTtpQkFFYixVQUFTLFFBQVU7Z0JBQ3BCLEtBQUssTUFBUSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/leak.kode
