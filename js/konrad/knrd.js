var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.m3=_k_.k.F256(_k_.k.m(3));_k_.m5=_k_.k.F256(_k_.k.m(5));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w5=_k_.k.F256(_k_.k.w(5))

var bundleDir, bundlePath, cacheFile, cachePath, compilerDir, fingerprint, fingerprintFiles, fpDirs, gatherFiles, hash, isCurrent, knrd, loadCache, reconcile, rel, rules, saveCache, shaped, srcForFile, stale, stampSource, tgtForSrc, usable

import kode from "../kode/kode.js"

import nfs from "../kxk/nfs.js"
import slash from "../kxk/slash.js"
import noon from "../kxk/noon.js"

import crypto from "crypto"

rules = {kode:{tgtExt:'js',srcDir:'kode',tgtDir:'js',compile:function (srcText, srcFile, tgtFile, opt)
{
    var k0de

    k0de = new kode({header:false,map:opt.map})
    try
    {
        return k0de.compile(srcText,srcFile,tgtFile)
    }
    catch (err)
    {
        console.log(err)
    }
}},noon:{tgtExt:'json',srcDir:'kode',tgtDir:'js',compile:function (srcText, srcFile, tgtFile, opt)
{
    return JSON.stringify(noon.parse(srcText),null,'  ')
}},ignore:['kolor/lang.noon','kode/.kkache']}

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

stampSource = (function (text, file)
{
    var b64, from, line, lines, m, map, src

    lines = text.split('\n')
    from = ''
    var list = _k_.list(lines)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        line = list[_b_]
        src = line.replace('//# sourceURL=file://','')
        if (src !== line)
        {
            from = slash.absolute(src,process.cwd())
        }
    }
    if (from)
    {
        return from
    }
    m = /sourceMappingURL=data:application\/json;base64,([A-Za-z0-9+\/=]*)/.exec(text)
    if (!(m && !_k_.empty(m[1])))
    {
        return ''
    }
    b64 = Buffer.from(m[1],'base64')
    map = JSON.parse(b64.toString('utf8'))
    if (!(!_k_.empty(map.sources) && !_k_.empty(map.sources[0])))
    {
        return ''
    }
    return slash.absolute(map.sources[0],slash.dir(file))
}).bind(this)

reconcile = async function (dirs, opt = {})
{
    var dir, file, from, here, item, list, removed, srcDir, still, text

    srcDir = opt.srcDir
    if (!srcDir)
    {
        srcDir = bundlePath('kode')
    }
    removed = []
    var list1 = _k_.list(dirs)
    for (var _c_ = 0; _c_ < list1.length; _c_++)
    {
        dir = list1[_c_]
        here = await nfs.dirExists(dir)
        if (!here)
        {
            continue
        }
        list = await nfs.list(dir)
        var list2 = _k_.list(list)
        for (var _d_ = 0; _d_ < list2.length; _d_++)
        {
            item = list2[_d_]
            if (item.type !== 'file')
            {
                continue
            }
            file = item.path
            text = await nfs.read(file)
            from = stampSource(text,file)
            if (!from)
            {
                continue
            }
            if (!from.startsWith(srcDir + '/'))
            {
                continue
            }
            still = await nfs.isFile(from)
            if (still)
            {
                continue
            }
            await nfs.remove(file)
            removed.push(file)
            if (!opt.quiet)
            {
                console.log(_k_.r4('🗑 '),_k_.w3(slash.tilde(file)))
            }
        }
    }
    return removed
}
cacheFile = 'kode/.kkache'

cachePath = function ()
{
    return bundlePath(cacheFile)
}

rel = function (p)
{
    return slash.relative(p,bundleDir())
}

hash = function (text)
{
    return crypto.createHash('sha1').update(text).digest('hex')
}
fpDirs = ['kode','kxk','kolor']

compilerDir = function ()
{
    return slash.path(_k_.dir(),'..')
}

fingerprintFiles = async function ()
{
    var d, dir, files, here, item

    files = []
    var list = _k_.list(fpDirs)
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        d = list[_e_]
        dir = slash.path(compilerDir(),d)
        here = await nfs.isDir(dir)
        if (!here)
        {
            continue
        }
        var list1 = _k_.list(await nfs.list(dir))
        for (var _f_ = 0; _f_ < list1.length; _f_++)
        {
            item = list1[_f_]
            if (item.type !== 'file')
            {
                continue
            }
            if (slash.ext(item.path) !== 'js')
            {
                continue
            }
            if (slash.relative(item.path,dir).startsWith('test/'))
            {
                continue
            }
            files.push(item.path)
        }
    }
    return files.sort()
}

fingerprint = async function ()
{
    var body, f, files, joined, parts

    files = await fingerprintFiles()
    parts = []
    var list = _k_.list(files)
    for (var _10_ = 0; _10_ < list.length; _10_++)
    {
        f = list[_10_]
        body = await nfs.read(f)
        parts.push(`${slash.relative(f,compilerDir())}\0${body}`)
    }
    joined = parts.join('')
    return hash(joined)
}

loadCache = async function (path)
{
    var kache, text

    text = await nfs.read(path)
    if (!_k_.empty(text))
    {
        try
        {
            kache = noon.parse(text)
            if (kache instanceof Object)
            {
                return kache
            }
        }
        catch (err)
        {
            return null
        }
    }
    return null
}

shaped = function (kache)
{
    var _186_32_, _187_32_

    if (_k_.empty(kache))
    {
        return false
    }
    if (!(kache instanceof Object))
    {
        return false
    }
    if (kache instanceof Array)
    {
        return false
    }
    if (_k_.empty(kache.kode))
    {
        return false
    }
    if (_k_.empty(kache.srcmap))
    {
        return false
    }
    if (!((kache.source != null)))
    {
        return false
    }
    if (!((kache.target != null)))
    {
        return false
    }
    return true
}

usable = function (kache, fp, srcmap)
{
    return shaped(kache) && (kache.kode === fp) && (kache.srcmap === srcmap)
}

stale = async function ()
{
    var here, kache, path

    path = cachePath()
    here = await nfs.isFile(path)
    if (!here)
    {
        return false
    }
    kache = await loadCache(path)
    if (!kache)
    {
        return false
    }
    if (_k_.empty(kache.kode))
    {
        return false
    }
    return kache.kode !== (await fingerprint())
}

isCurrent = async function (kache, srcFile, tgtFile, srcText)
{
    var s, t, tgtText, _210_20_, _211_20_

    if (_k_.empty(kache))
    {
        return false
    }
    s = (kache.source != null ? kache.source[rel(srcFile)] : undefined)
    t = (kache.target != null ? kache.target[rel(tgtFile)] : undefined)
    if (!((s != null) && (t != null)))
    {
        return false
    }
    if (s !== hash(srcText))
    {
        return false
    }
    tgtText = await nfs.read(tgtFile)
    return hash(tgtText) === t
}

saveCache = async function (path, kache, fp, srcmap, srcs, tgts, whole = false)
{
    var out, sorted, source, target

    if (_k_.empty(srcs))
    {
        return false
    }
    if (!whole && shaped(kache) && !(usable(kache,fp,srcmap)))
    {
        return false
    }
    if ((kache != null))
    {
        source = Object.assign({},kache.source,srcs)
        target = Object.assign({},kache.target,tgts)
    }
    else
    {
        source = srcs
        target = tgts
    }
    sorted = function (o)
    {
        var k, out

        out = {}
        var list = _k_.list(Object.keys(o).sort())
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            k = list[_11_]
            out[k] = o[k]
        }
        return out
    }
    source = sorted(source)
    target = sorted(target)
    out = {kode:fp,srcmap:srcmap,source:source,target:target}
    await nfs.write(path,noon.stringify(out,{maxalign:64}))
    return true
}

knrd = async function (files = [], opt = {})
{
    var cache, compText, dir, dirs, file, fp, icon, ignore, kpath, loaded, rule, skip, srcFile, srcs, srcText, tgtFile, tgts, tgtText, transpiled, whole, _265_23_, _266_23_, _339_18_

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
    opt.verbose = ((_265_23_=opt.verbose) != null ? _265_23_ : opt.debug)
    opt.map = ((_266_23_=opt.map) != null ? _266_23_ : true)
    if (opt.verbose)
    {
        console.log('opt',opt)
    }
    if (opt.debug)
    {
        console.log('files',files)
    }
    whole = _k_.empty(files)
    if (whole)
    {
        files = await gatherFiles()
    }
    icon = (opt.dryrun ? _k_.w4(' ') : '🔨')
    if (!opt.quiet)
    {
        console.log(icon,_k_.w5(slash.name(bundleDir())),_k_.b5(files.length))
    }
    kpath = cachePath()
    loaded = await loadCache(kpath)
    fp = await fingerprint()
    cache = usable(loaded,fp,opt.map) ? loaded : null
    if (opt.verbose && (loaded != null) && _k_.empty(cache))
    {
        console.log(_k_.w2('  '),_k_.w3('cache is for another compiler, ignoring it'))
    }
    transpiled = 0
    dirs = []
    srcs = {}
    tgts = {}
    var list = _k_.list(files)
    for (var _12_ = 0; _12_ < list.length; _12_++)
    {
        file = list[_12_]
        skip = false
        var list1 = _k_.list(rules.ignore)
        for (var _13_ = 0; _13_ < list1.length; _13_++)
        {
            ignore = list1[_13_]
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
            dir = slash.dir(tgtFile)
            if (!(_k_.in(dir,dirs)))
            {
                dirs.push(dir)
            }
            srcText = await nfs.read(srcFile)
            if (await isCurrent(cache,srcFile,tgtFile,srcText))
            {
                if (opt.verbose)
                {
                    console.log(_k_.g2('▸'),_k_.m3(slash.tilde(tgtFile)),_k_.w4('cached'))
                }
                continue
            }
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
                console.log(_k_.y5('✘ '),_k_.r5(slash.tilde(srcFile)),_k_.r4('failed to transpile!'))
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
                srcs[rel(srcFile)] = hash(srcText)
                tgts[rel(tgtFile)] = hash(compText)
            }
        }
    }
    if (!opt.dryrun)
    {
        await saveCache(kpath,loaded,fp,opt.map,srcs,tgts,whole)
    }
    opt.reconcile = ((_339_18_=opt.reconcile) != null ? _339_18_ : true)
    if (opt.reconcile && !opt.dryrun)
    {
        await reconcile(dirs,opt)
    }
    return transpiled
}
knrd.bundlePath = bundlePath
knrd.stampSource = stampSource
knrd.reconcile = reconcile
knrd.cachePath = cachePath
knrd.fingerprint = fingerprint
knrd.fingerprintFiles = fingerprintFiles
knrd.stale = stale
knrd.hash = hash
knrd.rel = rel
knrd.usable = usable
knrd.shaped = shaped
knrd.loadCache = loadCache
knrd.saveCache = saveCache
knrd.isCurrent = isCurrent
export default knrd;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb25yYWQva25yZC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQWMsV0FBUDs7T0FDTyxVQUFQO09BQVcsWUFBWDtPQUFpQixXQUFqQjs7T0FDSCxhQUFBOztBQVNKLFNBRUksTUFDSSxPQUFTLEtBQ1QsT0FBUyxPQUNULE9BQVMsS0FDVCxrQkFBUyxTQUFRLFNBQVEsU0FBUTs7OztJQUM3QixXQUFXLE1BQUssT0FBTyxNQUFNLElBQUksSUFBSTs7O2VBRWpDLEtBQUssUUFBUSxRQUFRLFFBQVE7O1dBQzNCOztRQUNGLFlBQUk7O0dBQ2hCLE1BQ0ksT0FBUyxPQUNULE9BQVMsT0FDVCxPQUFTLEtBQ1Qsa0JBQVMsU0FBUSxTQUFRLFNBQVE7O1dBQU8sS0FBSyxVQUFVLEtBQUssTUFBTSxTQUFTLEtBQUs7R0FFcEYsUUFDSSxrQkFDQTs7QUFHUix1QkFBYTs7OztJQUVULFVBQVU7UUFDUCxNQUFNLFdBQVc7O1FBQ2hCLFVBQVUsTUFBTSxLQUFLLFFBQVEsTUFBTTs7V0FDdkM7OztBQUVKLHNCQUFZLFNBQVE7O1dBRWhCLE1BQU0sUUFBUSxRQUFRLFFBQVEsV0FBVyxLQUFLLFFBQVEsV0FBVyxLQUFLLFNBQVMsS0FBSzs7O0FBRXhGLHVCQUFhLElBQUU7O1dBQU0sTUFBTSxLQUFLLFlBQVk7OztBQUU1Qzs7V0FBZSxRQUFROzs7QUFFdkI7Ozs7SUFFSSxhQUFTLElBQUksS0FBSyxXQUFXO0lBQzdCLE9BQVEsS0FBSyxpQkFBUTs7ZUFBUyxLQUFLLFNBQVE7O0lBRTNDLFFBQVEsS0FBSyxjQUFLOztlQUFTLEtBQUs7O1dBQ2hDLFFBQVEsTUFBTSxpQkFBUTs7Ozs2QkFDSixNQUFNOzs7WUFBaEI7Z0JBQ1csS0FBSyxTQUFTOzt1QkFBdkI7OztlQUNOOzs7O0FBRVIseUJBQWUsTUFBTTs7OztJQUVqQixRQUFRLEtBQUssTUFBTTtJQUNuQixPQUFRO3dCQUVJOzs7UUFBUjtRQUVBLE1BQU0sS0FBSyxRQUFRLHdC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
//# sourceURL=file:///home/kodi/s/ked/kode/konrad/knrd.kode
