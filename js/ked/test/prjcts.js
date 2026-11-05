var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var a, b, c, files, mapping, newDir, newFile, newMapping, oldDir, oldFile, oldMapping, root, waitFor

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import prjcts from "../index/prjcts.js"


waitFor = async function (cond)
{
    var n

    n = 0
    while (n < 100)
    {
        if (cond())
        {
            return true
        }
        await sleep(10)
        n += 1
    }
    return false
}
toExport["prjcts"] = async function ()
{
    await section("created files join an indexed project", async function ()
    {
        root = '/tmp/opencode/ked-prjcts-create'
        a = slash.path(root,'a.kode')
        b = slash.path(root,'b.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(a,'a = 1\n')
        fs.writeFileSync(b,'b = 2\n')
        prjcts.projects[root] = {dir:root,files:[a]}
        prjcts.allFiles[a] = root
        post.emit('file.change',{path:b,change:'create'})
        await waitFor(function ()
        {
            return _k_.in(b,prjcts.projects[root].files)
        })
        files = prjcts.projects[root].files
        mapping = prjcts.allFiles[b]
        delete prjcts.projects[root]
        delete prjcts.allFiles[a]
        delete prjcts.allFiles[b]
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(b,files)),true)
        compare(mapping,root)
    })
    await section("deleted files leave an indexed project", async function ()
    {
        root = '/tmp/opencode/ked-prjcts-delete'
        a = slash.path(root,'a.kode')
        b = slash.path(root,'b.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(a,'a = 1\n')
        fs.writeFileSync(b,'b = 2\n')
        prjcts.projects[root] = {dir:root,files:[a,b]}
        prjcts.allFiles[a] = root
        prjcts.allFiles[b] = root
        fs.rmSync(b)
        post.emit('file.change',{path:b,change:'delete'})
        await waitFor(function ()
        {
            return !(_k_.in(b,prjcts.projects[root].files))
        })
        files = prjcts.projects[root].files
        mapping = prjcts.allFiles[b]
        delete prjcts.projects[root]
        delete prjcts.allFiles[a]
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(b,files)),false)
        compare((_k_.in(a,files)),true)
        compare(((mapping != null)),false)
    })
    await section("renamed files move inside an indexed project", async function ()
    {
        root = '/tmp/opencode/ked-prjcts-rename'
        a = slash.path(root,'a.kode')
        c = slash.path(root,'c.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(a,'a = 1\n')
        prjcts.projects[root] = {dir:root,files:[a]}
        prjcts.allFiles[a] = root
        fs.renameSync(a,c)
        post.emit('file.change',{path:c,oldPath:a,change:'rename'})
        await waitFor(function ()
        {
            return _k_.in(c,prjcts.projects[root].files)
        })
        files = prjcts.projects[root].files
        oldMapping = prjcts.allFiles[a]
        newMapping = prjcts.allFiles[c]
        delete prjcts.projects[root]
        delete prjcts.allFiles[c]
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(a,files)),false)
        compare((_k_.in(c,files)),true)
        compare(((oldMapping != null)),false)
        compare(newMapping,root)
    })
    await section("renamed folders move their files inside an indexed project", async function ()
    {
        root = '/tmp/opencode/ked-prjcts-folder-rename'
        oldDir = slash.path(root,'old')
        newDir = slash.path(root,'new')
        oldFile = slash.path(oldDir,'a.kode')
        newFile = slash.path(newDir,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(oldDir,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(oldFile,'a = 1\n')
        prjcts.projects[root] = {dir:root,files:[oldFile]}
        prjcts.allFiles[oldFile] = root
        fs.renameSync(oldDir,newDir)
        post.emit('file.change',{path:newDir,oldPath:oldDir,change:'rename'})
        await waitFor(function ()
        {
            return _k_.in(newFile,prjcts.projects[root].files)
        })
        files = prjcts.projects[root].files
        delete prjcts.projects[root]
        delete prjcts.allFiles[newFile]
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(oldFile,files)),false)
        compare((_k_.in(newFile,files)),true)
    })
}
toExport["prjcts"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJqY3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3ByamN0cy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUNJLFNBQUE7O09BQ00sVUFBQTtJQUFNO0lBQU07SUFBTTs7T0FDYixhQUFSOzs7QUFFUCwwQkFBVzs7OztJQUVQLElBQUk7V0FDRSxJQUFJOztZQUNJOzttQkFBUjs7Y0FDQSxNQUFNO1FBQ1IsS0FBSzs7V0FDVDs7Ozs7O1FBTUksT0FBTztRQUNQLElBQUksTUFBTSxLQUFLLEtBQUs7UUFDcEIsSUFBSSxNQUFNLEtBQUssS0FBSztRQUNwQixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLEVBQUU7UUFDbkIsR0FBRyxjQUFjLEVBQUU7UUFFbkIsT0FBTyxTQUFTLFNBQVEsSUFBSSxLQUFLLE9BQU87UUFDeEMsT0FBTyxTQUFTLEtBQUs7UUFFckIsS0FBSyxLQUFLLGVBQWMsS0FBSyxFQUFFLE9BQU87Y0FDcEM7OzBCQUFXLEVBQUssT0FBTyxTQUFTLE1BQU07O1FBRXhDLFFBQVEsT0FBTyxTQUFTLE1BQU07UUFDOUIsVUFBVSxPQUFPLFNBQVM7ZUFFbkIsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFDdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07d0JBRW5DLEVBQUssUUFBUztnQkFDZixRQUFVOzs7O1FBSVYsT0FBTztRQUNQLElBQUksTUFBTSxLQUFLLEtBQUs7UUFDcEIsSUFBSSxNQUFNLEtBQUssS0FBSztRQUNwQixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLEVBQUU7UUFDbkIsR0FBRyxjQUFjLEVBQUU7UUFFbkIsT0FBTyxTQUFTLFNBQVEsSUFBSSxLQUFLLE9BQU8sRUFBRTtRQUMxQyxPQUFPLFNBQVMsS0FBSztRQUNyQixPQUFPLFNBQVMsS0FBSztRQUVyQixHQUFHLE9BQU87UUFDVixLQUFLLEtBQUssZUFBYyxLQUFLLEVBQUUsT0FBTztjQUNwQzs7NEJBQVcsRUFBUyxPQUFPLFNBQVMsTUFBTTs7UUFFNUMsUUFBUSxPQUFPLFNBQVMsTUFBTTtRQUM5QixVQUFVLE9BQU8sU0FBUztlQUVuQixPQUFPLFNBQVM7ZUFDaEIsT0FBTyxTQUFTO1FBQ3ZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO3dCQUVuQyxFQUFLLFFBQVM7d0JBQ2QsRUFBSyxRQUFTO2tCQUNkLGtCQUFZOzs7O1FBSWIsT0FBTztRQUNQLElBQUksTUFBTSxLQUFLLEtBQUs7UUFDcEIsSUFBSSxNQUFNLEtBQUssS0FBSztRQUNwQixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLEVBQUU7UUFFbkIsT0FBTyxTQUFTLFNBQVEsSUFBSSxLQUFLLE9BQU87UUFDeEMsT0FBTyxTQUFTLEtBQUs7UUFFckIsR0FBRyxXQUFXLEVBQUU7UUFDaEIsS0FBSyxLQUFLLGVBQWMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPO2NBQzlDOzswQkFBVyxFQUFLLE9BQU8sU0FBUyxNQUFNOztRQUV4QyxRQUFRLE9BQU8sU0FBUyxNQUFNO1FBQzlCLGFBQWEsT0FBTyxTQUFTO1FBQzdCLGFBQWEsT0FBTyxTQUFTO2VBRXRCLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFDdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07d0JBRW5DLEVBQUssUUFBUzt3QkFDZCxFQUFLLFFBQVM7a0JBQ2QscUJBQWU7Z0JBQ2hCLFdBQWE7Ozs7UUFJYixPQUFPO1FBQ1AsU0FBUyxNQUFNLEtBQUssS0FBSztRQUN6QixTQUFTLE1BQU0sS0FBSyxLQUFLO1FBQ3pCLFVBQVUsTUFBTSxLQUFLLE9BQU87UUFDNUIsVUFBVSxNQUFNLEtBQUssT0FBTztRQUM1QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsUUFBTyxVQUFVO1FBQzlCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLFFBQVE7UUFFekIsT0FBTyxTQUFTLFNBQVEsSUFBSSxLQUFLLE9BQU87UUFDeEMsT0FBTyxTQUFTLFdBQVc7UUFFM0IsR0FBRyxXQUFXLE9BQU87UUFDckIsS0FBSyxLQUFLLGVBQWMsS0FBSyxPQUFPLFFBQVEsT0FBTyxPQUFPO2NBQ3hEOzswQkFBVyxRQUFXLE9BQU8sU0FBUyxNQUFNOztRQUU5QyxRQUFRLE9BQU8sU0FBUyxNQUFNO2VBRXZCLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFDdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07d0JBRW5DLFFBQVcsUUFBUzt3QkFDcEIsUUFBVyxRQUFTIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/prjcts.kode
