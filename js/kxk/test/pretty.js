var toExport = {}
var before, now

import pretty from "../pretty.js"

toExport["pretty"] = async function ()
{
    await section("age", async function ()
    {
        now = (new Date(Date.now())).toString()
        compare(pretty.age(now),'0 seconds')
        before = (new Date(Date.now() - 999)).toString()
        compare(pretty.age(before),'1 second')
        before = (new Date(Date.now() - 1000 * 60 * 60)).toString()
        compare(pretty.age(before),'1 hour')
        before = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 29)).toString()
        compare(pretty.age(before),'29 days')
        before = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)).toString()
        compare(pretty.age(before),'1 month')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHR5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L3ByZXR0eS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FRUyxhQUFBOzs7Ozs7UUFNRCxXQUFXLEtBQUssS0FBSyxRQUFPO2dCQUM1QixPQUFPLElBQU8sS0FBTTtRQUVwQixjQUFjLEtBQUssS0FBSyxRQUFNLE1BQUs7Z0JBQ25DLE9BQU8sSUFBTyxRQUFTO1FBRXZCLGNBQWMsS0FBSyxLQUFLLFFBQU0sT0FBSyxLQUFHLEtBQUk7Z0JBQzFDLE9BQU8sSUFBTyxRQUFTO1FBRXZCLGNBQWMsS0FBSyxLQUFLLFFBQU0sT0FBSyxLQUFHLEtBQUcsS0FBRyxLQUFJO2dCQUNoRCxPQUFPLElBQU8sUUFBUztRQUV2QixjQUFjLEtBQUssS0FBSyxRQUFNLE9BQUssS0FBRyxLQUFHLEtBQUcsS0FBSTtnQkFDaEQsT0FBTyxJQUFPLFFBQVM7Ozs7Z0JBSXZCLE9BQU8sT0FBTyxHQUFJO2dCQUVsQixPQUFPLE9BQU8sTUFBTzs7OztnQkFJckIsT0FBTyxRQUFjO2dCQUNyQixPQUFPLE1BQU0sTUFBUTtnQkFDckIsT0FBTyxNQUFNLEtBQVE7Z0JBQ3JCLE9BQU8sTUFBTSxHQUFRO2dCQUVyQixPQUFPLE1BQU0sR0FBUTtnQkFDckIsT0FBTyxNQUFNLEdBQVE7Z0JBQ3JCLE9BQU8sTUFBTSxNQUFRO2dCQUNyQixPQUFPLE1BQU0sT0FBUTtnQkFDckIsT0FBTyxNQUFNLEtBQVE7Z0JBRXJCLE9BQU8sTUFBTSxNQUFRO2dCQUNyQixPQUFPLE1BQU0sTUFBUTtnQkFFckIsT0FBTyxNQUFNLE9BQVE7Z0JBQ3JCLE9BQU8sTUFBTSxPQUFRO2dCQUVyQixPQUFPLE1BQU0sSUFBUztnQkFDdEIsT0FBTyxNQUFNLElBQVM7Z0JBQ3RCLE9BQU8sTUFBTSxPQUFTO2dCQUN0QixPQUFPLE1BQU0sUUFBUztnQkFDdEIsT0FBTyxNQUFNLE1BQVM7Z0JBRXRCLE9BQU8sTUFBTSxPQUFTO2dCQUN0QixPQUFPLE1BQU0sT0FBUztnQkFFdEIsT0FBTyxNQUFNLFFBQVM7Z0JBQ3RCLE9BQU8sTUFBTSxRQUFTIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/pretty.kode
