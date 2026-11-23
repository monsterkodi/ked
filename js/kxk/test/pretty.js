var toExport = {}
var before, now

import pretty from "../pretty.js"

toExport["pretty"] = async function ()
{
    await section("age", async function ()
    {
        now = (new Date(Date.now())).toString()
        compare(pretty.age(now),'0 seconds')
        before = (new Date(Date.now() - 1000)).toString()
        compare(pretty.age(before),'1 second')
        before = (new Date(Date.now() - 1000 * 60 * 60)).toString()
        compare(pretty.age(before),'1 hour')
        before = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 29)).toString()
        compare(pretty.age(before),'29 days')
        before = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)).toString()
        compare(pretty.age(before),'1 month')
    })
    await section("duration", async function ()
    {
        compare(pretty.duration(0),'0 seconds')
        compare(pretty.duration(1000),'1 second')
        compare(pretty.duration(45000),'45 seconds')
        compare(pretty.duration(60000),'1 minute')
        compare(pretty.duration(50 * 60000),'50 minutes')
        compare(pretty.duration(60 * 60000),'1 hour')
        compare(pretty.duration(2.5 * 60 * 60000),'2.5 hours')
        compare(pretty.duration(24 * 60 * 60000),'1 day')
        compare(pretty.duration(2.5 * 24 * 60 * 60000),'2.5 days')
        compare(pretty.duration(-50 * 60000),'50 minutes')
    })
    await section("number", async function ()
    {
        compare(pretty.number(1),'1')
        compare(pretty.number(0.11),'0.1')
    })
    await section("bytes", async function ()
    {
        compare(pretty.bytes(),'0 bytes')
        compare(pretty.bytes(0.99),'0 bytes')
        compare(pretty.bytes('x'),'0 bytes')
        compare(pretty.bytes(0),'0 bytes')
        compare(pretty.bytes(1),'1 byte')
        compare(pretty.bytes(3),'3 bytes')
        compare(pretty.bytes(3.33),'3 bytes')
        compare(pretty.bytes('123'),'123 bytes')
        compare(pretty.bytes(316),'316 bytes')
        compare(pretty.bytes(1000),'1 kB')
        compare(pretty.bytes(1024),'1 kB')
        compare(pretty.bytes(20000),'20 kB')
        compare(pretty.bytes(20480),'20 kB')
        compare(pretty.bytes(-1),'1 byte')
        compare(pretty.bytes(-3),'3 bytes')
        compare(pretty.bytes(-3.33),'3 bytes')
        compare(pretty.bytes('-123'),'123 bytes')
        compare(pretty.bytes(-316),'316 bytes')
        compare(pretty.bytes(-1000),'1 kB')
        compare(pretty.bytes(-1024),'1 kB')
        compare(pretty.bytes(-20000),'20 kB')
        compare(pretty.bytes(-20480),'20 kB')
    })
}
toExport["pretty"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHR5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L3ByZXR0eS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDUyxhQUFBOzs7Ozs7UUFNRCxXQUFXLEtBQUssS0FBSyxRQUFPO2dCQUM1QixPQUFPLElBQU8sS0FBTTtRQUVwQixjQUFjLEtBQUssS0FBSyxRQUFNLE9BQU07Z0JBQ3BDLE9BQU8sSUFBTyxRQUFTO1FBRXZCLGNBQWMsS0FBSyxLQUFLLFFBQU0sT0FBSyxLQUFHLEtBQUk7Z0JBQzFDLE9BQU8sSUFBTyxRQUFTO1FBRXZCLGNBQWMsS0FBSyxLQUFLLFFBQU0sT0FBSyxLQUFHLEtBQUcsS0FBRyxLQUFJO2dCQUNoRCxPQUFPLElBQU8sUUFBUztRQUV2QixjQUFjLEtBQUssS0FBSyxRQUFNLE9BQUssS0FBRyxLQUFHLEtBQUcsS0FBSTtnQkFDaEQsT0FBTyxJQUFPLFFBQVM7Ozs7Z0JBSXZCLE9BQU8sU0FBUyxHQUFzQjtnQkFDdEMsT0FBTyxTQUFTLE1BQXNCO2dCQUN0QyxPQUFPLFNBQVMsT0FBc0I7Z0JBQ3RDLE9BQU8sU0FBUyxPQUFzQjtnQkFDdEMsT0FBTyxTQUFTLEtBQUcsT0FBbUI7Z0JBQ3RDLE9BQU8sU0FBUyxLQUFHLE9BQW1CO2dCQUN0QyxPQUFPLFNBQVMsTUFBSSxLQUFHLE9BQWU7Z0JBQ3RDLE9BQU8sU0FBUyxLQUFHLEtBQUcsT0FBZ0I7Z0JBQ3RDLE9BQU8sU0FBUyxNQUFJLEtBQUcsS0FBRyxPQUFZO2dCQUN0QyxPQUFPLFNBQVMsTUFBSSxPQUFrQjs7OztnQkFJdEMsT0FBTyxPQUFPLEdBQUk7Z0JBRWxCLE9BQU8sT0FBTyxNQUFPOzs7O2dCQUlyQixPQUFPLFFBQWM7Z0JBQ3JCLE9BQU8sTUFBTSxNQUFRO2dCQUNyQixPQUFPLE1BQU0sS0FBUTtnQkFDckIsT0FBTyxNQUFNLEdBQVE7Z0JBRXJCLE9BQU8sTUFBTSxHQUFRO2dCQUNyQixPQUFPLE1BQU0sR0FBUTtnQkFDckIsT0FBTyxNQUFNLE1BQVE7Z0JBQ3JCLE9BQU8sTUFBTSxPQUFRO2dCQUNyQixPQUFPLE1BQU0sS0FBUTtnQkFFckIsT0FBTyxNQUFNLE1BQVE7Z0JBQ3JCLE9BQU8sTUFBTSxNQUFRO2dCQUVyQixPQUFPLE1BQU0sT0FBUTtnQkFDckIsT0FBTyxNQUFNLE9BQVE7Z0JBRXJCLE9BQU8sTUFBTSxJQUFTO2dCQUN0QixPQUFPLE1BQU0sSUFBUztnQkFDdEIsT0FBTyxNQUFNLE9BQVM7Z0JBQ3RCLE9BQU8sTUFBTSxRQUFTO2dCQUN0QixPQUFPLE1BQU0sTUFBUztnQkFFdEIsT0FBTyxNQUFNLE9BQVM7Z0JBQ3RCLE9BQU8sTUFBTSxPQUFTO2dCQUV0QixPQUFPLE1BQU0sUUFBUztnQkFDdEIsT0FBTyxNQUFNLFFBQVMifQ==
//# sourceURL=../../../kode/kxk/test/pretty.kode
