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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHR5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L3ByZXR0eS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDUyxhQUFBOzs7Ozs7UUFNRCxXQUFXLEtBQUssS0FBSyxRQUFPO1FBQ1YsUUFBbEIsT0FBTyxJQUFPLEtBQU07UUFFcEIsY0FBYyxLQUFLLEtBQUssUUFBTSxPQUFNO1FBQ2YsUUFBckIsT0FBTyxJQUFPLFFBQVM7UUFFdkIsY0FBYyxLQUFLLEtBQUssUUFBTSxPQUFLLEtBQUcsS0FBSTtRQUNyQixRQUFyQixPQUFPLElBQU8sUUFBUztRQUV2QixjQUFjLEtBQUssS0FBSyxRQUFNLE9BQUssS0FBRyxLQUFHLEtBQUcsS0FBSTtRQUMzQixRQUFyQixPQUFPLElBQU8sUUFBUztRQUV2QixjQUFjLEtBQUssS0FBSyxRQUFNLE9BQUssS0FBRyxLQUFHLEtBQUcsS0FBSTtRQUMzQixRQUFyQixPQUFPLElBQU8sUUFBUzs7OztRQUlhLFFBQXBDLE9BQU8sU0FBUyxHQUFzQjtRQUNGLFFBQXBDLE9BQU8sU0FBUyxNQUFzQjtRQUNGLFFBQXBDLE9BQU8sU0FBUyxPQUFzQjtRQUNGLFFBQXBDLE9BQU8sU0FBUyxPQUFzQjtRQUNGLFFBQXBDLE9BQU8sU0FBUyxLQUFHLE9BQW1CO1FBQ0YsUUFBcEMsT0FBTyxTQUFTLEtBQUcsT0FBbUI7UUFDRixRQUFwQyxPQUFPLFNBQVMsTUFBSSxLQUFHLE9BQWU7UUFDRixRQUFwQyxPQUFPLFNBQVMsS0FBRyxLQUFHLE9BQWdCO1FBQ0YsUUFBcEMsT0FBTyxTQUFTLE1BQUksS0FBRyxLQUFHLE9BQVk7UUFDRixRQUFwQyxPQUFPLFNBQVMsTUFBSSxPQUFrQjs7OztRQUl0QixRQUFoQixPQUFPLE9BQU8sR0FBSTtRQUVDLFFBQW5CLE9BQU8sT0FBTyxNQUFPOzs7O1FBSUYsUUFBbkIsT0FBTyxRQUFjO1FBQ0YsUUFBbkIsT0FBTyxNQUFNLE1BQVE7UUFDRixRQUFuQixPQUFPLE1BQU0sS0FBUTtRQUNGLFFBQW5CLE9BQU8sTUFBTSxHQUFRO1FBRUYsUUFBbkIsT0FBTyxNQUFNLEdBQVE7UUFDRixRQUFuQixPQUFPLE1BQU0sR0FBUTtRQUNGLFFBQW5CLE9BQU8sTUFBTSxNQUFRO1FBQ0YsUUFBbkIsT0FBTyxNQUFNLE9BQVE7UUFDRixRQUFuQixPQUFPLE1BQU0sS0FBUTtRQUVGLFFBQW5CLE9BQU8sTUFBTSxNQUFRO1FBQ0YsUUFBbkIsT0FBTyxNQUFNLE1BQVE7UUFFRixRQUFuQixPQUFPLE1BQU0sT0FBUTtRQUNGLFFBQW5CLE9BQU8sTUFBTSxPQUFRO1FBRUQsUUFBcEIsT0FBTyxNQUFNLElBQVM7UUFDRixRQUFwQixPQUFPLE1BQU0sSUFBUztRQUNGLFFBQXBCLE9BQU8sTUFBTSxPQUFTO1FBQ0YsUUFBcEIsT0FBTyxNQUFNLFFBQVM7UUFDRixRQUFwQixPQUFPLE1BQU0sTUFBUztRQUVGLFFBQXBCLE9BQU8sTUFBTSxPQUFTO1FBQ0YsUUFBcEIsT0FBTyxNQUFNLE9BQVM7UUFFRixRQUFwQixPQUFPLE1BQU0sUUFBUztRQUNGLFFBQXBCLE9BQU8sTUFBTSxRQUFTIn0=
//# sourceURL=../../../kode/kxk/test/pretty.kode
