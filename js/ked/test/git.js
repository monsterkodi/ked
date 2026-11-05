var toExport = {}
var added, deleted, file, g, other, renamed, repo, statuses, waitFor

import fs from "fs"

import child_process from "child_process"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import git from "../util/git.js"


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
toExport["git"] = async function ()
{
    await section("file changes refresh git status", async function ()
    {
        repo = '/tmp/opencode/ked-git-status'
        file = slash.path(repo,'a.txt')
        other = slash.path(repo,'b.txt')
        fs.rmSync(repo,{recursive:true,force:true})
        fs.mkdirSync(repo,{recursive:true})
        child_process.execSync('git init -q',{cwd:repo})
        fs.writeFileSync(file,'hello')
        statuses = []
        post.on('git.status',function (status)
        {
            if (status.gitDir === repo)
            {
                return statuses.push(status)
            }
        })
        g = new git
        g.gitDirs.push(slash.path(repo,'.git'))
        post.emit('file.change',{path:file,change:'modify'})
        await waitFor(function ()
        {
            return statuses.length > 0
        })
        added = statuses[0].files[file]
        fs.renameSync(file,other)
        post.emit('file.change',{path:other,oldPath:file,change:'rename'})
        await waitFor(function ()
        {
            return statuses.length > 1
        })
        renamed = statuses[statuses.length - 1].files
        fs.rmSync(other)
        post.emit('file.change',{path:other,change:'delete'})
        await waitFor(function ()
        {
            return statuses.length > 2
        })
        deleted = statuses[statuses.length - 1].files
        g.gitDirs = []
        fs.rmSync(repo,{recursive:true,force:true})
        compare(added,'added')
        compare(renamed[other],'added')
        compare(((renamed[file] != null)),false)
        compare(Object.keys(deleted).length,0)
    })
}
toExport["git"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2dpdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDSSxTQUFBOztPQUNBLG9CQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNO0lBQU07O09BQ2QsVUFBUDs7O0FBRVAsMEJBQVc7Ozs7SUFFUCxJQUFJO1dBQ0UsSUFBSTs7WUFDSTs7bUJBQVI7O2NBQ0EsTUFBTTtRQUNSLEtBQUs7O1dBQ1Q7Ozs7OztRQU1JLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBQ3ZCLFFBQVEsTUFBTSxLQUFLLEtBQUs7UUFFeEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUM1QixjQUFjLFNBQVMsZUFBZSxJQUFJO1FBQzFDLEdBQUcsY0FBYyxLQUFLO1FBRXRCO1FBQ0EsS0FBSyxHQUFHLHVCQUFjOztnQkFBbUMsT0FBTyxXQUFVOzt1QkFBekMsU0FBUyxLQUFLOzs7UUFFL0MsUUFBUTtRQUNSLEVBQUUsUUFBUSxLQUFLLE1BQU0sS0FBSyxLQUFLO1FBRS9CLEtBQUssS0FBSyxlQUFjLEtBQUssS0FBSyxPQUFPO2NBQ3ZDOzttQkFBVyxTQUFTLFNBQVM7O1FBRS9CLFFBQVEsU0FBUyxHQUFHLE1BQU07UUFFMUIsR0FBRyxXQUFXLEtBQUs7UUFDbkIsS0FBSyxLQUFLLGVBQWMsS0FBSyxNQUFNLFFBQVEsS0FBSyxPQUFPO2NBQ3JEOzttQkFBVyxTQUFTLFNBQVM7O1FBRS9CLFVBQVUsU0FBUyxTQUFTLFNBQU8sR0FBRztRQUV0QyxHQUFHLE9BQU87UUFDVixLQUFLLEtBQUssZUFBYyxLQUFLLE1BQU0sT0FBTztjQUN4Qzs7bUJBQVcsU0FBUyxTQUFTOztRQUUvQixVQUFVLFNBQVMsU0FBUyxTQUFPLEdBQUc7UUFFdEMsRUFBRTtRQUNGLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2dCQUVwQyxNQUFRO2dCQUNSLFFBQVEsT0FBUztrQkFDaEIsUUFBUSxnQkFBVTtnQkFDbkIsT0FBTyxLQUFLLFNBQVMsT0FBUyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/git.kode
