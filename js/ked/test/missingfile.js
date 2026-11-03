var toExport = {}
var output, path

import child_process from "child_process"
let spawn = child_process.spawn

import kxk from "../../kxk.js"
let slash = kxk.slash

toExport["missing file target"] = async function ()
{
    await section("a missing file opens as a buffer bound to its path", async function ()
    {
        path = slash.path(process.cwd(),'doesntexist')
        output = await new Promise(function (resolve)
        {
            var out, proc

            proc = spawn(slash.path(process.cwd(),'bin','ked'),['-H','--fresh',path])
            out = ''
            proc.stdout.on('data',function (data)
            {
                return out += data
            })
            proc.stderr.on('data',function (data)
            {
                return out += data
            })
            proc.on('close',function (code)
            {
                return resolve(out)
            })
            return proc.stdin.end()
        })
        compare(output.includes(`[file: ${path}]`),true)
        compare(output.includes('doesntexist'),true)
    })
}
toExport["missing file target"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzc2luZ2ZpbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvbWlzc2luZ2ZpbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQUksb0JBQUE7SUFBZ0I7O09BQ1YsVUFBQTtJQUFVOzs7Ozs7UUFNWixPQUFPLE1BQU0sS0FBSyxRQUFRLE1BQU07UUFFaEMsbUJBQWMsa0JBQVM7Ozs7WUFFbkIsT0FBTyxNQUFNLE1BQU0sS0FBSyxRQUFRLE1BQU0sTUFBTSxRQUFRLEtBQUssVUFBVTtZQUVuRSxNQUFNO1lBRU4sS0FBSyxPQUFPLEdBQUcsaUJBQVE7O3VCQUFTLE9BQU87O1lBQ3ZDLEtBQUssT0FBTyxHQUFHLGlCQUFROzt1QkFBUyxPQUFPOztZQUV2QyxLQUFLLEdBQUcsa0JBQVM7O3VCQUFTLFFBQVE7O21CQUVsQyxLQUFLLE1BQU07O2dCQUVmLE9BQU8sbUJBQW1CLFNBQVc7Z0JBQ3JDLE9BQU8sU0FBUyxlQUF1QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/missingfile.kode
