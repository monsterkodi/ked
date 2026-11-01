var toExport = {}
var first, gone, output, second, third

import child_process from "child_process"
let spawn = child_process.spawn

import kxk from "../../kxk.js"
let slash = kxk.slash

toExport["file arguments"] = async function ()
{
    await section("existing extra files go to the filepos history", async function ()
    {
        first = slash.path(process.cwd(),'kode/ked/ked.kode')
        second = slash.path(process.cwd(),'kode/ked/ked.md')
        third = slash.path(process.cwd(),'kode/ked/help.md')
        gone = slash.path(process.cwd(),'doesntexist')
        output = await new Promise(function (resolve)
        {
            var out, proc

            proc = spawn(slash.path(process.cwd(),'bin','ked'),['-H','--fresh',first,gone,second,third])
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
            proc.stdin.write('\x1b[49;3u')
            return proc.stdin.end()
        })
        compare(output.includes(`[file: ${first}]`),true)
        compare(output.includes(`[file: ${second}]`),true)
        compare(output.includes(`[file: ${gone}]`),false)
    })
    await section("a missing first argument stays the current history entry", async function ()
    {
        first = slash.path(process.cwd(),'doesntexist')
        second = slash.path(process.cwd(),'kode/ked/ked.md')
        output = await new Promise(function (resolve)
        {
            var out, proc

            proc = spawn(slash.path(process.cwd(),'bin','ked'),['-H','--fresh',first,second])
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
            proc.stdin.write('\x1b[49;3u')
            return proc.stdin.end()
        })
        compare(output.includes(`[file: ${first}]`),true)
        compare(output.includes(`[file: ${second}]`),true)
    })
}
toExport["file arguments"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJndW1lbnRzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2FyZ3VtZW50cy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBSSxvQkFBQTtJQUFnQjs7T0FDVixVQUFBO0lBQVM7Ozs7OztRQU1YLFFBQVMsTUFBTSxLQUFLLFFBQVEsTUFBTTtRQUNsQyxTQUFTLE1BQU0sS0FBSyxRQUFRLE1BQU07UUFDbEMsUUFBUyxNQUFNLEtBQUssUUFBUSxNQUFNO1FBQ2xDLE9BQVMsTUFBTSxLQUFLLFFBQVEsTUFBTTtRQUVsQyxtQkFBYyxrQkFBUzs7OztZQUVuQixPQUFPLE1BQU0sTUFBTSxLQUFLLFFBQVEsTUFBTSxNQUFNLFFBQVEsS0FBSyxVQUFVLE1BQU8sS0FBTSxPQUFRO1lBRXhGLE1BQU07WUFFTixLQUFLLE9BQU8sR0FBRyxpQkFBUTs7dUJBQVMsT0FBTzs7WUFDdkMsS0FBSyxPQUFPLEdBQUcsaUJBQVE7O3VCQUFTLE9BQU87O1lBRXZDLEtBQUssR0FBRyxrQkFBUzs7dUJBQVMsUUFBUTs7WUFFbEMsS0FBSyxNQUFNLE1BQU07bUJBQ2pCLEtBQUssTUFBTTs7Z0JBRWYsT0FBTyxtQkFBbUIsVUFBYTtnQkFDdkMsT0FBTyxtQkFBbUIsV0FBYTtnQkFDdkMsT0FBTyxtQkFBbUIsU0FBYTs7OztRQUl2QyxRQUFTLE1BQU0sS0FBSyxRQUFRLE1BQU07UUFDbEMsU0FBUyxNQUFNLEtBQUssUUFBUSxNQUFNO1FBRWxDLG1CQUFjLGtCQUFTOzs7O1lBRW5CLE9BQU8sTUFBTSxNQUFNLEtBQUssUUFBUSxNQUFNLE1BQU0sUUFBUSxLQUFLLFVBQVUsTUFBTztZQUUxRSxNQUFNO1lBRU4sS0FBSyxPQUFPLEdBQUcsaUJBQVE7O3VCQUFTLE9BQU87O1lBQ3ZDLEtBQUssT0FBTyxHQUFHLGlCQUFROzt1QkFBUyxPQUFPOztZQUV2QyxLQUFLLEdBQUcsa0JBQVM7O3VCQUFTLFFBQVE7O1lBRWxDLEtBQUssTUFBTSxNQUFNO21CQUNqQixLQUFLLE1BQU07O2dCQUVmLE9BQU8sbUJBQW1CLFVBQWE7Z0JBQ3ZDLE9BQU8sbUJBQW1CLFdBQWEifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/arguments.kode
