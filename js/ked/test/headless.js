var toExport = {}
var after, env, file, home, output, session, sessions, start

import fs from "fs"

import child_process from "child_process"
let spawn = child_process.spawn

import kxk from "../../kxk.js"
let slash = kxk.slash

toExport["headless"] = async function ()
{
    await section("the first screen waits for the session file", async function ()
    {
        home = slash.path('/tmp/opencode',`ked-headless-${Date.now()}`)
        sessions = slash.path(home,'.config','ked','headless-sessions')
        file = slash.path(home,'target.txt')
        fs.mkdirSync(sessions,{recursive:true})
        fs.writeFileSync(file,'hello')
        session = `editor\n    file  ${file}\n`
        fs.writeFileSync(slash.path(sessions,'zzzz.noon'),session)
        env = Object.assign({},process.env)
        env.HOME = home
        output = await new Promise(function (resolve)
        {
            var out, proc

            proc = spawn(slash.path(process.cwd(),'bin','ked'),['-H'],{env:env})
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
            return proc.stdin.end('a')
        })
        var _a_ = output.split('=== a'); start = _a_[0]; after = _a_[1]

        compare(start.includes(`[file: ${file}]`),true)
        fs.rmSync(home,{recursive:true,force:true})
    })
}
toExport["headless"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGxlc3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaGVhZGxlc3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ0ksU0FBQTs7T0FDQSxvQkFBQTtJQUFnQjs7T0FDVixVQUFBO0lBQU07Ozs7OztRQU1SLE9BQU8sTUFBTSxLQUFLLGdDQUFnQyxLQUFLO1FBQ3ZELFdBQVcsTUFBTSxLQUFLLEtBQUssVUFBVSxNQUFNO1FBQzNDLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFFdkIsR0FBRyxVQUFVLFVBQVMsVUFBVTtRQUNoQyxHQUFHLGNBQWMsS0FBSztRQUV0QiwrQkFBK0I7UUFDL0IsR0FBRyxjQUFjLE1BQU0sS0FBSyxTQUFTLGFBQWE7UUFFbEQsTUFBTSxPQUFPLFVBQVUsUUFBUTtRQUMvQixJQUFJLE9BQU87UUFFWCxtQkFBYyxrQkFBUzs7OztZQUVuQixPQUFPLE1BQU0sTUFBTSxLQUFLLFFBQVEsTUFBTSxNQUFNLFFBQVEsT0FBTSxJQUFJO1lBRTlELE1BQU07WUFFTixLQUFLLE9BQU8sR0FBRyxpQkFBUTs7dUJBQVMsT0FBTzs7WUFDdkMsS0FBSyxPQUFPLEdBQUcsaUJBQVE7O3VCQUFTLE9BQU87O1lBRXZDLEtBQUssR0FBRyxrQkFBUzs7dUJBQVMsUUFBUTs7bUJBRWxDLEtBQUssTUFBTSxJQUFJOztrQkFFSCxPQUFPLE1BQU0sVUFBNUIsZ0JBQU07O2dCQUVQLE1BQU0sbUJBQW1CLFNBQVc7UUFFcEMsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/headless.kode
