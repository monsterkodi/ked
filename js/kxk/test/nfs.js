var toExport = {}
var items, keep, lines, root, secret

import fs from "fs"

import nfs from "../nfs.js"
import slash from "../slash.js"

toExport["nfs"] = async function ()
{
    await section("listing a directory it cannot read logs nothing", async function ()
    {
        root = '/tmp/opencode/kxk-nfs-eacces'
        secret = slash.path(root,'secret')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.mkdirSync(secret)
        fs.chmodSync(secret,0)
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        items = await nfs.list(secret,{recursive:false})
        console.log = keep
        fs.chmodSync(secret,493)
        fs.rmSync(root,{recursive:true,force:true})
        compare(lines.length,0)
        compare(items.length,0)
    })
}
toExport["nfs"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L25mcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNLLFVBQUE7T0FBSSxZQUFBOzs7Ozs7UUFNTCxPQUFPO1FBQ1AsU0FBUyxNQUFNLEtBQUssS0FBSztRQUV6QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsVUFBVTtRQUNiLEdBQUcsVUFBVSxPQUFPO1FBRXBCO1FBQ0EsT0FBTyxRQUFRO1FBRWYsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxjQUFTLElBQUksS0FBSyxRQUFPLFVBQVU7UUFFbkMsUUFBUSxNQUFNO1FBRWQsR0FBRyxVQUFVLE9BQU87UUFDcEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLE1BQU0sT0FBUztnQkFDZixNQUFNLE9BQVMifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/nfs.kode
