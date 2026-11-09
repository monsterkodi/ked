var toExport = {}
var files, first, gone, names, second

import kxk from "../../kxk.js"
let nfs = kxk.nfs
let slash = kxk.slash

import fileutil from "../util/fileutil.js"

toExport["fileutil"] = async function ()
{
    await section("existing files are absolute, resolved and unique", async function ()
    {
        first = slash.tmpfile('txt')
        second = slash.tmpfile('txt')
        gone = slash.tmpfile('txt')
        await nfs.write(first,'first')
        await nfs.write(second,'second')
        names = [slash.file(first),slash.file(second),slash.file(gone),slash.file(first)]
        files = await fileutil.existingFiles(names,slash.dir(first))
        compare(files,[first,second])
        await nfs.remove(first)
        await nfs.remove(second)
    })
    await section("the language of a snippet is detected", async function ()
    {
        compare(fileutil.detectExt(''),'kode')
        compare(fileutil.detectExt('ordinary words only'),'kode')
        compare(fileutil.detectExt('{"name": "kodi", "ok": true}'),'kode')
        compare(fileutil.detectExt("log 'hello'"),'kode')
        compare(fileutil.detectExt("use ../../kxk ▪ post\nlog 'hi'"),'kode')
        compare(fileutil.detectExt('function foo() { const x = 1; return x; }'),'js')
        compare(fileutil.detectExt('async function load() { await fetch(url) }'),'js')
        compare(fileutil.detectExt('const greet = (name) => console.log(name)'),'js')
        compare(fileutil.detectExt('interface Foo { readonly name: string }'),'ts')
        compare(fileutil.detectExt('def greet(name):\n    print(name)'),'py')
        compare(fileutil.detectExt('for f in *.txt; do cat "$f"; done'),'sh')
        compare(fileutil.detectExt('pub fn main() void { var x: u32 = 1; }'),'zig')
        compare(fileutil.detectExt('const std = @import("std");'),'zig')
        compare(fileutil.detectExt('local x = 1\nprint(x)'),'lua')
        compare(fileutil.detectExt('unless x then y else z'),'coffee')
        compare(fileutil.detectExt('<div class="foo">hello</div>'),'html')
    })
}
toExport["fileutil"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQVUsVUFBQTtJQUFNO0lBQUk7O09BQ0osZUFBVDs7Ozs7O1FBTUMsUUFBUyxNQUFNLFFBQVE7UUFDdkIsU0FBUyxNQUFNLFFBQVE7UUFDdkIsT0FBUyxNQUFNLFFBQVE7Y0FFckIsSUFBSSxNQUFNLE1BQVE7Y0FDbEIsSUFBSSxNQUFNLE9BQVE7UUFFcEIsU0FBUyxNQUFNLEtBQUssT0FBUSxNQUFNLEtBQUssUUFBUyxNQUFNLEtBQUssTUFBTyxNQUFNLEtBQUs7UUFFN0UsY0FBUyxTQUFTLGNBQWMsTUFBTSxNQUFNLElBQUk7Z0JBRWhELE9BQVMsTUFBTztjQUVkLElBQUksT0FBTztjQUNYLElBQUksT0FBTzs7OztnQkFJYixTQUFTLFVBQVUsSUFBTTtnQkFDekIsU0FBUyxVQUFVLHVCQUF5QjtnQkFDNUMsU0FBUyxVQUFVLGdDQUFrQztnQkFDckQsU0FBUyxVQUFVLGVBQWlCO2dCQUNwQyxTQUFTLFVBQVUsa0NBQW9DO2dCQUV2RCxTQUFTLFVBQVUsNkNBQStDO2dCQUNsRSxTQUFTLFVBQVUsOENBQWdEO2dCQUNuRSxTQUFTLFVBQVUsNkNBQStDO2dCQUNsRSxTQUFTLFVBQVUsMkNBQTZDO2dCQUVoRSxTQUFTLFVBQVUscUNBQXVDO2dCQUMxRCxTQUFTLFVBQVUscUNBQXVDO2dCQUMxRCxTQUFTLFVBQVUsMENBQTRDO2dCQUMvRCxTQUFTLFVBQVUsK0JBQWlDO2dCQUNwRCxTQUFTLFVBQVUseUJBQTJCO2dCQUM5QyxTQUFTLFVBQVUsMEJBQTRCO2dCQUMvQyxTQUFTLFVBQVUsZ0NBQWtDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/fileutil.kode
