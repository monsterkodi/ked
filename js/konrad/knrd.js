var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.m3=_k_.k.F256(_k_.k.m(3));_k_.m5=_k_.k.F256(_k_.k.m(5));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w5=_k_.k.F256(_k_.k.w(5))

var bump, bundleDir, bundlePath, gatherFiles, knrd, rules, srcForFile, tgtForSrc

import kode from "../kode/kode.js"

import nfs from "../kxk/nfs.js"
import slash from "../kxk/slash.js"
import noon from "../kxk/noon.js"

import version from "./version.js"

rules = {kode:{tgtExt:'js',srcDir:'kode',tgtDir:'js',compile:function (srcText, srcFile, tgtFile, opt)
{
    var k0de

    k0de = new kode({header:false,map:opt.map})
    return k0de.compile(srcText,srcFile,tgtFile)
}},noon:{tgtExt:'json',srcDir:'kode',tgtDir:'js',compile:function (srcText, srcFile, tgtFile, opt)
{
    return JSON.stringify(noon.parse(srcText),null,'  ')
}},ignore:['kolor/lang.noon']}

srcForFile = function (file)
{
    var srcFile

    srcFile = file
    if (slash.isRelative(srcFile))
    {
        srcFile = slash.path(process.cwd(),srcFile)
    }
    return srcFile
}

tgtForSrc = function (srcFile, rule)
{
    return slash.swapExt(srcFile.replace(bundlePath(rule.srcDir),bundlePath(rule.tgtDir)),rule.tgtExt)
}

bundlePath = function (p = '')
{
    return slash.path(bundleDir(),p)
}

bundleDir = function ()
{
    return process.cwd()
}

bump = async function ()
{
    return await nfs.write(bundlePath('kode/konrad/version.kode'),`export ${version + 1}\n`)
}

gatherFiles = async function ()
{
    var files, list

    list = await nfs.list(bundlePath('kode'))
    list = list.filter(function (item)
    {
        return item.type === 'file'
    })
    files = list.map(function (item)
    {
        return item.path
    })
    return files = files.filter(function (file)
    {
        var ignore

        var list1 = _k_.list(rules.ignore)
        for (var _a_ = 0; _a_ < list1.length; _a_++)
        {
            ignore = list1[_a_]
            if (file.endsWith(ignore))
            {
                return false
            }
        }
        return true
    })
}

knrd = async function (files = [], opt = {})
{
    var compText, file, icon, ignore, rule, skip, srcFile, srcText, tgtFile, tgtText, transpiled, _104_23_

    if (_k_.isStr(files))
    {
        if (_k_.in(slash.ext(files),['kode','noon']))
        {
            files = [files]
        }
        else
        {
            files = []
        }
    }
    if (_k_.isArr(files) && !_k_.empty(files))
    {
        if (!(_k_.in(slash.ext(files[0]),['kode','noon'])))
        {
            console.log(_k_.y5('✘ '),_k_.r5(slash.tilde(files[0])),_k_.r4('-- unknown file type!'))
            return []
        }
    }
    opt.verbose = ((_104_23_=opt.verbose) != null ? _104_23_ : opt.debug)
    if (opt.verbose)
    {
        console.log('opt',opt)
    }
    if (opt.debug)
    {
        console.log('files',files)
    }
    if (_k_.empty(files))
    {
        files = await gatherFiles()
    }
    icon = (opt.dryrun ? _k_.w4(' ') : '🔨')
    if (!opt.quiet)
    {
        console.log(icon,_k_.w5(slash.name(bundleDir())),_k_.b5(files.length))
    }
    transpiled = 0
    var list = _k_.list(files)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        file = list[_b_]
        skip = false
        var list1 = _k_.list(rules.ignore)
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            ignore = list1[_c_]
            if (file.endsWith(ignore))
            {
                if (opt.verbose)
                {
                    console.log(_k_.w2('✘  '),_k_.w3(slash.tilde(file)))
                }
                skip = true
                break
            }
        }
        if (skip)
        {
            continue
        }
        if (rule = rules[slash.ext(file)])
        {
            srcFile = srcForFile(file)
            tgtFile = tgtForSrc(srcFile,rule)
            srcText = await nfs.read(srcFile)
            tgtText = await nfs.read(tgtFile)
            if (opt.verbose)
            {
                console.log(_k_.g2('▸'),_k_.m3(srcFile),_k_.m5(tgtFile))
            }
            compText = rule.compile(srcText,srcFile,tgtFile,opt)
            if (opt.verbose)
            {
                console.log(_k_.g2('▸'),_k_.m3(srcFile),_k_.m5(tgtFile))
            }
            if (opt.debug && opt.verbose)
            {
                console.log('tgtText',tgtFile,tgtText)
            }
            if (opt.debug && opt.verbose)
            {
                console.log('compText',compText)
            }
            if (_k_.empty(compText))
            {
                console.log(_k_.y5('✘ '),_k_.r5(slash.tilde(srcFile)),_k_.r4('transpiles to empty!'))
            }
            else
            {
                if (opt.verbose)
                {
                    console.log(_k_.g2('🔧'),_k_.m3(slash.tilde(srcFile)))
                }
                if (tgtText !== compText)
                {
                    transpiled++
                    if (!opt.dryrun)
                    {
                        await nfs.write(tgtFile,compText)
                    }
                    console.log(_k_.b5('✔ '),_k_.g5(slash.tilde(tgtFile)))
                }
            }
        }
    }
    return transpiled
}
knrd.bundlePath = bundlePath
export default knrd;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb25yYWQva25yZC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFzQkEsU0FFSSxNQUNJLE9BQVMsS0FDVCxPQUFTLE9BQ1QsT0FBUyxLQUNUOzs7O0lBQXdDLFdBQVcsTUFBSyxPQUFPLE1BQU8sSUFBSSxJQUFJO1dBQUssS0FBSyxRQUFRLFFBQVEsUUFBUTtHQUNwSCxNQUNJLE9BQVMsT0FDVCxPQUFTLE9BQ1QsT0FBUyxLQUNUOztXQUF3QyxLQUFLLFVBQVUsS0FBSyxNQUFNLFNBQVMsS0FBSztHQUVwRixRQUNJOztBQVNSOzs7O0lBRUksVUFBVTtRQUNQLE1BQU0sV0FBVzs7UUFDaEIsVUFBVSxNQUFNLEtBQUssUUFBUSxNQUFNOztXQUN2Qzs7O0FBRUo7O1dBRUksTUFBTSxRQUFRLFFBQVEsUUFBUSxXQUFXLEtBQUssUUFBUSxXQUFXLEtBQUssU0FBUyxLQUFLOzs7QUFFeEY7O1dBQXFCLE1BQU0sS0FBSyxZQUFZOzs7QUFFNUM7O1dBR0ksUUFBUTs7O0FBRVo7O2lCQUVNLElBQUksTUFBTSxXQUFXLHNDQUFzQyxVQUFROzs7QUFRekU7Ozs7SUFFSSxhQUFTLElBQUksS0FBSyxXQUFXO0lBQzdCLE9BQVEsS0FBSzs7ZUFBaUIsS0FBSyxTQUFROztJQUUzQyxRQUFRLEtBQUs7O2VBQWMsS0FBSzs7V0FDaEMsUUFBUSxNQUFNOzs7OzZCQUNJLE1BQU07Ozs7Z0JBQ0wsS0FBSyxTQUFTOzt1QkFBdkI7OztlQUNOOzs7O0FBUVI7Ozs7a0JBRU87O21CQUNJLE1BQU0sSUFBSSxRQUFXLE9BQU87O1lBQzNCLFNBQVM7Ozs7WUFFVDs7O2tCQUVMLHFCQUF1Qjs7cUJBQ25CLE1BQU0sSUFBSSxNQUFNLEtBQVksT0FBTzs7WUFDbEMsbUJBQU8sYUFBUyxNQUFNLE1BQU0sTUFBTSxZQUFROzs7O0lBR2xELElBQUkscUJBQUosSUFBSSw4QkFBa0IsSUFBSTtRQUNKLElBQUk7O1FBQTFCLFlBQUksTUFBUzs7UUFDUyxJQUFJOztRQUExQixZQUFJLFFBQVM7O2tCQUltQjs7UUFBaEMsY0FBUzs7SUFFVCxRQUFPLElBQUksZ0JBQVksUUFBUTtTQUU4QixJQUFJOztRQUFqRSxZQUFJLFlBQVEsTUFBTSxLQUFLLHFCQUFpQixNQUFNOztJQUU5QyxhQUFhO3dCQUVEOzs7O1FBRVIsT0FBTzs2QkFDTyxNQUFNOzs7O2dCQUNiLEtBQUssU0FBUzs7b0JBQzBCLElBQUk7O29CQUEzQyxtQkFBTyxjQUFVLE1BQU0sTUFBTTs7Z0JBQzdCLE9BQU87Z0JBQ1A7OztZQUVMOztZQUFPOztZQUVQLE9BQU8sTUFBTSxNQUFNLElBQUk7O1lBRXRCLFVBQVcsV0FBVztZQUN0QixVQUFXLFVBQVcsUUFBUztZQUUvQixnQkFBWSxJQUFJLEtBQUs7WUFDckIsZ0JBQVksSUFBSSxLQUFLO2dCQUNrQixJQUFJOztnQkFBM0MsbUJBQU8sWUFBUSxnQkFBWTs7WUFDM0IsV0FBVyxLQUFLLFFBQVEsUUFBUyxRQUFTLFFBQVM7Z0JBQ1osSUFBSTs7Z0JBQTNDLG1CQUFPLFlBQVEsZ0JBQVk7O2dCQUVRLElBQUksU0FBVSxJQUFJOztnQkFBckQsWUFBSSxVQUFXLFFBQVM7O2dCQUNXLElBQUksU0FBVSxJQUFJOztnQkFBckQsWUFBSSxXQUFXOzswQkFFTjs7Z0JBQ0wsbUJBQU8sYUFBUyxNQUFNLE1BQU0saUJBQWE7Ozs7b0JBRUEsSUFBSTs7b0JBQTdDLG1CQUFPLGFBQVMsTUFBTSxNQUFNOztvQkFDekIsWUFBVzs7b0JBQ1Y7eUJBQ3FDLElBQUk7OzhCQUF2QyxJQUFJLE1BQU0sUUFBUzs7b0JBQ3JCLG1CQUFPLGFBQVMsTUFBTSxNQUFNOzs7OztXQUk1Qzs7QUFFSixLQUFLLGFBQWE7ZUFFWCJ9
//# sourceURL=file://kode/konrad/knrd.kode
