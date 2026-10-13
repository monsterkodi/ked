var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}};_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w5=_k_.k.F256(_k_.k.w(5))

var args

import kxk from "../kxk.js"
let sleep = kxk.sleep
let karg = kxk.karg
let slash = kxk.slash
let os = kxk.os

import watch from "../kxk/watch.js"

import knrd from "./knrd.js"
import version from "./version.js"

import child_process from "child_process"

import fs from 'fs/promises'
args = karg(`kk
    options                                   **
    
    info       show build status              = false
    knrd       transpile kode and noon        = false
    build      transpile kode and noon        = false
    watch      watch for file changes         = false
    test       run tests                      = false
    map        write inline source maps       = true
    
    quiet      log nothing                    = false
    debug      log debug                      = false -D
    verbose    log verbose                    = false -V
    version    log version                    = false`)
class kk
{
    static async run ()
    {
        var files

        files = args.options
        if (args.version)
        {
            await console.log(version,slash.name(slash.path(_k_.dir(),'../../')),process.cwd())
        }
        if (args.info)
        {
            await knrd([],{dryrun:true})
        }
        if (args.knrd)
        {
            await knrd(files,args)
        }
        if (args.build)
        {
            await knrd(files,args)
        }
        if (args.test)
        {
            await kk.test(files)
        }
        if (args.watch)
        {
            return await kk.watch()
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
                    return await kk.test(args.options)
                }
            })
        }})
    }

    static async test (options)
    {
        var cmd, opt

        cmd = "node js/test.js"
        if (!_k_.empty(options))
        {
            cmd += ' ' + options.join(' ')
        }
        opt = {shell:true,cwd:kk.bundleDir()}
        return new Promise(function (resolve, reject)
        {
            return child_process.exec(cmd,opt,function (err, stdout, stderr)
            {
                if (err)
                {
                    console.error('ERROR',err)
                    return resolve()
                }
                else
                {
                    if (!_k_.empty(stdout))
                    {
                        console.log(stdout)
                    }
                    return resolve()
                }
            })
        })
    }

    static bundleDir ()
    {
        return process.cwd()
    }
}

global['kk'] = kk
export default kk.run;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2suanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29ucmFkL2trLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O09BY08sR0FBRyxLQUFLO0FBRWYsT0FBTyxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQThCSixRQUFRLEtBQUs7WUFDVixLQUFLOztrQkFBWSxZQUFJLFFBQVEsTUFBTSxLQUFLLE1BQU0sZUFBVSxXQUFXLFFBQVE7O1lBQzNFLEtBQUs7O2tCQUFZLFNBQW1CLE9BQU87O1lBQzNDLEtBQUs7O2tCQUFZLEtBQWEsTUFBTTs7WUFDcEMsS0FBSzs7a0JBQVksS0FBYSxNQUFNOztZQUNwQyxLQUFLOztrQkFBWSxHQUFHLEtBQVU7O1lBQzlCLEtBQUs7O3lCQUFZLEdBQUc7Ozs7OztRQWF2QixZQUFJLGFBQVMsR0FBRztlQUVoQixNQUFNLE1BQU0sR0FBRyxhQUFZLFVBQVUsS0FBSzs7bUJBQ3RDLFFBQVEsR0FBRzs7b0JBRUQsTUFBTSxTQUFTLEtBQUssS0FBSzs7OzsyQkFFNUIsTUFBTSxJQUFJLEtBQUssT0FBVSxPQUFPLE1BQU0sT0FBTzs7b0JBQzVDLG1CQUFPLGFBQVMsS0FBSzswQkFDbkIsS0FBSyxLQUFLO2lDQUNWLEdBQUcsS0FBSyxLQUFLOzs7Ozs7Ozs7O1FBVTNCLE1BQU07dUJBQ2tDOztZQUF4QyxPQUFPLE1BQU0sUUFBUSxLQUFLOztRQUMxQixPQUFNLE1BQU0sS0FBSyxJQUFJLEdBQUc7bUJBRXBCOzttQkFFQSxjQUFjLEtBQUssSUFBSTs7b0JBRWhCOztvQkFDQyxjQUFNLFFBQVE7MkJBQ2Q7Ozs7bUNBRW9COzt3QkFBcEIsWUFBSTs7MkJBQ0o7Ozs7Ozs7O2VBRUQsUUFBUTs7OztBQUkzQixPQUFPLFFBQVE7ZUFFUixHQUFHIn0=
//# sourceURL=file://kode/konrad/kk.kode
