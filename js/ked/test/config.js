var toExport = {}
var dir, file, reloads, savedData, savedFile

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post
let watcher = kxk.watcher

import config from "../util/config.js"

toExport["config"] = async function ()
{
    await section("reloads when the config file changes", async function ()
    {
        dir = '/tmp/opencode/ked-config-reload'
        file = slash.path(dir,'config')
        fs.rmSync(dir,{recursive:true,force:true})
        fs.mkdirSync(dir,{recursive:true})
        fs.writeFileSync(file,'value\n    number  111')
        savedData = config.data
        savedFile = config.file
        config.file = file
        await config.load()
        await config.loaded
        compare(config.data.value.number,111)
        reloads = 0
        post.on('config.loaded',function ()
        {
            return reloads += 1
        })
        fs.writeFileSync(file,'value\n    number  2222')
        await sleep(300)
        compare(reloads,1)
        compare(config.data.value.number,2222)
        fs.writeFileSync(slash.path(dir,'other'),'unrelated')
        await sleep(200)
        compare(reloads,1)
        watcher.close()
        config.data = savedData
        config.file = savedFile
        fs.rmSync(dir,{recursive:true,force:true})
    })
}
toExport["config"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2NvbmZpZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNO0lBQU07SUFBSzs7T0FDakIsYUFBVDs7Ozs7O1FBTUMsTUFBTztRQUNQLE9BQU8sTUFBTSxLQUFLLElBQUk7UUFFdEIsR0FBRyxPQUFPLEtBQUksVUFBVSxLQUFLLE1BQU07UUFDbkMsR0FBRyxVQUFVLEtBQUksVUFBVTtRQUMzQixHQUFHLGNBQWMsS0FBSztRQUV0QixZQUFZLE9BQU87UUFDbkIsWUFBWSxPQUFPO1FBRW5CLE9BQU8sT0FBTztjQUNaLE9BQU87Y0FDUCxPQUFPO2dCQUVULE9BQU8sS0FBSyxNQUFNLE9BQVM7UUFFM0IsVUFBVTtRQUNWLEtBQUssR0FBRzs7bUJBQW1CLFdBQVc7O1FBRXRDLEdBQUcsY0FBYyxLQUFLO2NBQ3BCLE1BQU07Z0JBRVIsUUFBVTtnQkFDVixPQUFPLEtBQUssTUFBTSxPQUFTO1FBRTNCLEdBQUcsY0FBYyxNQUFNLEtBQUssSUFBSSxTQUFTO2NBQ3ZDLE1BQU07Z0JBRVIsUUFBVTtRQUVWLFFBQVE7UUFFUixPQUFPLE9BQU87UUFDZCxPQUFPLE9BQU87UUFFZCxHQUFHLE9BQU8sS0FBSSxVQUFVLEtBQUssTUFBTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/config.kode
