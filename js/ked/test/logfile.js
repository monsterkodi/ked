var toExport = {}
var before, closed, log

import logfile from "../util/logfile.js"

toExport["logfile"] = async function ()
{
    await section("a headless logfile leaves the console alone", async function ()
    {
        before = [console.log,console.warn,console.error]
        log = new logfile('test',true)
        compare(log.stream,undefined)
        compare((console.log === before[0]),true)
        compare((console.warn === before[1]),true)
        compare((console.error === before[2]),true)
    })
    await section("a headless logfile writes nowhere", async function ()
    {
        log = new logfile('test',true)
        log.write('nothing happens')
    })
    await section("a headless logfile still closes", async function ()
    {
        log = new logfile('test',true)
        closed = false
        log.close(function ()
        {
            return closed = true
        })
        compare(closed,true)
    })
}
toExport["logfile"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZmlsZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9sb2dmaWxlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQU9jLGNBQVA7Ozs7OztRQU1DLFVBQVUsUUFBUSxJQUFJLFFBQVEsS0FBSyxRQUFRO1FBQzNDLFVBQVUsUUFBUSxPQUFPO2dCQUV6QixJQUFJLE9BQVM7aUJBQ1osUUFBUSxRQUFPLE9BQU8sSUFBTTtpQkFDNUIsUUFBUSxTQUFRLE9BQU8sSUFBTTtpQkFDN0IsUUFBUSxVQUFTLE9BQU8sSUFBTTs7OztRQUkvQixVQUFVLFFBQVEsT0FBTztRQUV6QixJQUFJLE1BQU07Ozs7UUFJVixVQUFVLFFBQVEsT0FBTztRQUN6QixTQUFTO1FBRVQsSUFBSTs7bUJBQVMsU0FBUzs7Z0JBRXRCLE9BQVMifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/logfile.kode
