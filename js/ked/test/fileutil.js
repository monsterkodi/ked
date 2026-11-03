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
}
toExport["fileutil"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQVUsVUFBQTtJQUFNO0lBQUk7O09BQ0osZUFBVDs7Ozs7O1FBTUMsUUFBUyxNQUFNLFFBQVE7UUFDdkIsU0FBUyxNQUFNLFFBQVE7UUFDdkIsT0FBUyxNQUFNLFFBQVE7Y0FFckIsSUFBSSxNQUFNLE1BQVE7Y0FDbEIsSUFBSSxNQUFNLE9BQVE7UUFFcEIsU0FBUyxNQUFNLEtBQUssT0FBUSxNQUFNLEtBQUssUUFBUyxNQUFNLEtBQUssTUFBTyxNQUFNLEtBQUs7UUFFN0UsY0FBUyxTQUFTLGNBQWMsTUFBTSxNQUFNLElBQUk7Z0JBRWhELE9BQVMsTUFBTztjQUVkLElBQUksT0FBTztjQUNYLElBQUksT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/fileutil.kode
