var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g7=_k_.k.F256(_k_.k.g(7));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.b7=_k_.k.F256(_k_.k.b(7));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w5=_k_.k.F256(_k_.k.w(5))

var args

import kxk from "../kxk.js"
let sleep = kxk.sleep
let karg = kxk.karg
let watch = kxk.watch
let nfs = kxk.nfs
let util = kxk.util
let slash = kxk.slash
let os = kxk.os

import tester from "../kode/tester.js"
import kode from "../kode/kode.js"

import knrd from "./knrd.js"

import child_process from "child_process"

args = karg(`kk
    files                                     **
    
    info       show build status              = false
    knrd       transpile kode and noon        = false
    build      bootstrap the compiler         = false
    watch      watch for file changes         = false
    test       run tests                      = false
    run        execute kode file              = false
    
    map        write inline source maps       = true
    
    quiet      log nothing                    = false
    debug      log debug                      = false -D
    verbose    log verbose                    = false -V
    version    log version                    = false`)
class kk
{
    static async run ()
    {
        var files, ok

        files = args.files
        if (args.version)
        {
            await console.log(_k_.w4(await knrd.fingerprint()),_k_.g7(slash.name(slash.path(_k_.dir(),'../../'))),_k_.b7(process.cwd()))
        }
        if (args.info)
        {
            await knrd([],util.defaults(args,{dryrun:true}))
        }
        if (args.knrd)
        {
            await knrd(files,args)
        }
        if (args.build)
        {
            await child_process.exec("pnpm build",{shell:true},function (err, stdout, stderr)
            {
                console.log(stdout)
            })
        }
        if (args.test)
        {
            ok = await kk.test(files)
            if (!ok)
            {
                process.exitCode = 1
            }
        }
        if (args.watch)
        {
            await kk.watch()
        }
        if (args.run)
        {
            await kode.run({files:files,run:true})
        }
        if (!_k_.empty(args.__ignored))
        {
            console.log('ignored options',args.__ignored)
        }
    }

    static async watch ()
    {
        console.log('👁 ',_k_.w5(kk.bundleDir()))
        return watch.watch(kk.bundleDir(),{recursive:true,cb:function (watcher)
        {
            return watcher.on('change',async function (info)
            {
                if (slash.contains(info.path,'.stash'))
                {
                    return
                }
                if (_k_.in(slash.ext(info.path),['kode','pug','styl','noon']))
                {
                    console.log(_k_.b5('🔧'),_k_.w3(info.path))
                    await knrd(info.path)
                    return await kk.test(args.files,{silent:true})
                }
            })
        }})
    }

    static async test (files, opt)
    {
        var cmd, file, ok, result, test

        if (await knrd.stale())
        {
            console.log(_k_.y5('⚠ '),_k_.r5('the tree is older than the compiler - run kk -k'))
        }
        ok = true
        if (await nfs.exists("js/test.js"))
        {
            cmd = "node js/test.js"
            if (!_k_.empty(files))
            {
                cmd += ' ' + files.join(' ')
            }
            if ((opt != null ? opt.silent : undefined))
            {
                cmd += ' silent'
            }
            opt = {shell:true,cwd:kk.bundleDir()}
            ok = await new Promise(function (resolve, reject)
            {
                return child_process.exec(cmd,opt,function (err, stdout, stderr)
                {
                    if (!_k_.empty(stdout))
                    {
                        console.log(stdout)
                    }
                    if (!_k_.empty(stderr))
                    {
                        console.log(stderr)
                    }
                    return resolve(!err)
                })
            })
        }
        else if (await nfs.isDir("js/test"))
        {
            if ((opt != null ? opt.silent : undefined))
            {
                tester.logSections = false
                tester.logModules = false
            }
            files = await nfs.list(slash.path(process.cwd(),'js','test'))
            var list = _k_.list(files)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                file = list[_a_]
                if (file.type === 'dir')
                {
                    continue
                }
                test = await import(file.path)
                result = await tester.test(test.default)
                ok = ok && ((result != null ? result : true))
            }
            tester.summarize()
        }
        return ok
    }

    static bundleDir ()
    {
        return process.cwd()
    }
}

global['kk'] = kk
export default kk.run;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2suanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29ucmFkL2trLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsT0FBTyxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBNkJKLFFBQVEsS0FBSztZQUNWLEtBQUs7O2tCQUFZLHlCQUFTLEtBQUssc0JBQWtCLE1BQU0sS0FBSyxNQUFNLGVBQVUsbUJBQWUsUUFBUTs7WUFDbkcsS0FBSzs7a0JBQVksUUFBZ0IsS0FBSyxTQUFTLE1BQUssT0FBTzs7WUFDM0QsS0FBSzs7a0JBQVksS0FBYSxNQUFNOztZQUNwQyxLQUFLOztrQkFBWSxjQUFjLEtBQUssY0FBYyxNQUFNOztnQkFBNkIsWUFBSTs7O1lBQ3pGLEtBQUs7O1lBQ0osV0FBTyxHQUFHLEtBQUs7aUJBQ1I7O2dCQUNILFFBQVEsV0FBVzs7O1lBQ3hCLEtBQUs7O2tCQUFZLEdBQUc7O1lBQ3BCLEtBQUs7O2tCQUFZLEtBQUssS0FBSSxNQUFNLE1BQU0sSUFBSTs7dUJBRXBDLEtBQUs7O1lBQ1YsWUFBSSxrQkFBa0IsS0FBSzs7Ozs7O1FBVS9CLFlBQUksYUFBUyxHQUFHO2VBRWhCLE1BQU0sTUFBTSxHQUFHLGFBQVksVUFBVSxLQUFLOzttQkFDdEMsUUFBUSxHQUFHOztvQkFFRCxNQUFNLFNBQVMsS0FBSyxLQUFLOzs7OzJCQUU1QixNQUFNLElBQUksS0FBSyxPQUFVLE9BQU8sTUFBTSxPQUFPOztvQkFDNUMsbUJBQU8sYUFBUyxLQUFLOzBCQUNuQixLQUFLLEtBQUs7aUNBQ1YsR0FBRyxLQUFLLEtBQUssT0FBTSxPQUFPOzs7Ozs7Ozs7O2tCQVVuQyxLQUFLOztZQUNOLG1CQUFPLGFBQVM7O1FBRXBCLEtBQUs7a0JBR0MsSUFBSSxPQUFPOztZQUVULE1BQU07MkJBQ2dDOztnQkFBdEMsT0FBTyxNQUFNLE1BQU0sS0FBSzs7aUJBQ0osY0FBQSxJQUFLOztnQkFBekIsT0FBTzs7WUFDUCxPQUFNLE1BQU0sS0FBSyxJQUFJLEdBQUc7WUFFeEIsZUFBVzs7dUJBRVAsY0FBYyxLQUFLLElBQUk7O21DQUVDOzt3QkFBcEIsWUFBSTs7bUNBQ2dCOzt3QkFBcEIsWUFBSTs7MkJBRUosU0FBWTs7Ozt1QkFFdEIsSUFBSSxNQUFNOztpQkFFTCxjQUFBLElBQUs7O2dCQUNKLE9BQU8sY0FBYztnQkFDckIsT0FBTyxhQUFjOztZQUV6QixjQUFTLElBQUksS0FBSyxNQUFNLEtBQUssUUFBUSxNQUFNLEtBQUs7Z0NBRXBDOzs7O29CQUNJLEtBQUssU0FBUTs7b0JBQXpCOztnQkFDQSxhQUFRLE9BQU8sS0FBSztnQkFDcEIsZUFBVSxPQUFPLEtBQUssS0FBSztnQkFDM0IsS0FBSyxRQUFRLGlCQUFBLFNBQVM7O1lBRTFCLE9BQU87O2VBQ2Y7Ozs7O2VBRVcsUUFBUTs7OztBQUUzQixPQUFPLFFBQVE7ZUFFUixHQUFHIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/konrad/kk.kode
