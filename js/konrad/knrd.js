var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.m3=_k_.k.F256(_k_.k.m(3));_k_.m5=_k_.k.F256(_k_.k.m(5));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w5=_k_.k.F256(_k_.k.w(5))

var bundleDir, bundlePath, cacheFile, cachePath, compilerDir, fingerprint, fpDirs, gatherFiles, hash, isCurrent, knrd, loadCache, reconcile, rel, rules, saveCache, shaped, srcForFile, stale, stampSource, tgtForSrc, usable

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

fingerprint = async function ()
{
    var body, d, dir, f, files, here, item, joined, parts

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
            if (item.type === 'file' && slash.ext(item.path) === 'js')
            {
                files.push(item.path)
            }
        }
    }
    files.sort()
    parts = []
    var list2 = _k_.list(files)
    for (var _10_ = 0; _10_ < list2.length; _10_++)
    {
        f = list2[_10_]
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
    var _240_32_, _241_32_

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
    var s, t, tgtText, _268_20_, _269_20_

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
    await nfs.write(path,noon.stringify(out))
    return true
}

knrd = async function (files = [], opt = {})
{
    var cache, compText, dir, dirs, file, fp, icon, ignore, kpath, loaded, rule, skip, srcFile, srcs, srcText, tgtFile, tgts, tgtText, transpiled, whole, _344_23_, _345_23_, _421_18_

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
    opt.verbose = ((_344_23_=opt.verbose) != null ? _344_23_ : opt.debug)
    opt.map = ((_345_23_=opt.map) != null ? _345_23_ : true)
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
    opt.reconcile = ((_421_18_=opt.reconcile) != null ? _421_18_ : true)
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
knrd.stale = stale
knrd.hash = hash
knrd.rel = rel
knrd.usable = usable
knrd.shaped = shaped
knrd.loadCache = loadCache
knrd.saveCache = saveCache
knrd.isCurrent = isCurrent
export default knrd;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb25yYWQva25yZC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFzQkEsU0FFSSxNQUNJLE9BQVMsS0FDVCxPQUFTLE9BQ1QsT0FBUyxLQUNULGtCQUFTLFNBQVEsU0FBUSxTQUFROzs7O0lBQzdCLFdBQVcsTUFBSyxPQUFPLE1BQU0sSUFBSSxJQUFJOzs7ZUFFakMsS0FBSyxRQUFRLFFBQVEsUUFBUTs7V0FDM0I7O1FBQ0YsWUFBSTs7R0FDaEIsTUFDSSxPQUFTLE9BQ1QsT0FBUyxPQUNULE9BQVMsS0FDVCxrQkFBUyxTQUFRLFNBQVEsU0FBUTs7V0FBTyxLQUFLLFVBQVUsS0FBSyxNQUFNLFNBQVMsS0FBSztHQUVwRixRQUNJLGtCQUNBOztBQVNSLHVCQUFhOzs7O0lBRVQsVUFBVTtRQUNQLE1BQU0sV0FBVzs7UUFDaEIsVUFBVSxNQUFNLEtBQUssUUFBUSxNQUFNOztXQUN2Qzs7O0FBRUosc0JBQVksU0FBUTs7V0FFaEIsTUFBTSxRQUFRLFFBQVEsUUFBUSxXQUFXLEtBQUssUUFBUSxXQUFXLEtBQUssU0FBUyxLQUFLOzs7QUFFeEYsdUJBQWE7O1dBQVEsTUFBTSxLQUFLLFlBQVk7OztBQUU1Qzs7V0FHSSxRQUFROzs7QUFRWjs7OztJQUVJLGFBQVMsSUFBSSxLQUFLLFdBQVc7SUFDN0IsT0FBUSxLQUFLLGlCQUFROztlQUFTLEtBQUssU0FBUTs7SUFFM0MsUUFBUSxLQUFLLGNBQUs7O2VBQVMsS0FBSzs7V0FDaEMsUUFBUSxNQUFNLGlCQUFROzs7OzZCQUNKLE1BQU07OztZQUFoQjtnQkFDVyxLQUFLLFNBQVM7O3VCQUF2Qjs7O2VBQ047Ozs7QUFzQlIseUJBQWUsTUFBTTs7OztJQUVqQixRQUFRLEtBQUssTUFBTTtJQUNuQixPQUFRO3dCQUVJOzs7UUFBUjtRQUVBLE1BQU0sS0FBSyxRQUFRLHdCQUF3QjtZQUV4QyxRQUFPOztZQUNOLE9BQU8sTUFBTSxTQUFTLElBQUssUUFBUTs7O1FB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
//# sourceURL=file:///home/kodi/s/ked/kode/konrad/knrd.kode
