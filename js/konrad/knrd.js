var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.m3=_k_.k.F256(_k_.k.m(3));_k_.m5=_k_.k.F256(_k_.k.m(5));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w5=_k_.k.F256(_k_.k.w(5))

var bump, bundleDir, bundlePath, cacheFile, cachePath, fingerprint, fpDirs, gatherFiles, hash, isCurrent, knrd, loadCache, reconcile, rel, rules, saveCache, shaped, srcForFile, stampSource, tgtForSrc, usable

import kode from "../kode/kode.js"

import nfs from "../kxk/nfs.js"
import slash from "../kxk/slash.js"
import noon from "../kxk/noon.js"

import version from "./version.js"

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

stampSource = (function (text, file)
{
    var b64, from, line, lines, m, map, rel

    lines = text.split('\n')
    from = ''
    var list = _k_.list(lines)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        line = list[_b_]
        rel = line.replace('//# sourceURL=file://','')
        if (rel !== line)
        {
            from = slash.absolute(slash.path(process.cwd(),rel))
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
    return slash.absolute(slash.path(slash.dir(file),map.sources[0]))
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

fingerprint = async function ()
{
    var body, d, dir, f, files, here, item, joined, parts

    files = []
    var list = _k_.list(fpDirs)
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        d = list[_e_]
        dir = bundlePath(`js/${d}`)
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
        parts.push(`${rel(f)}\0${body}`)
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
    var _238_32_, _239_32_

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

isCurrent = async function (kache, srcFile, tgtFile, srcText)
{
    var s, t, tgtText, _250_20_, _251_20_

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

saveCache = async function (path, kache, fp, srcmap, srcs, tgts)
{
    var out, sorted, source, target

    if (_k_.empty(srcs))
    {
        return false
    }
    if (shaped(kache) && !(usable(kache,fp,srcmap)))
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
    var cache, compText, dir, dirs, file, fp, icon, ignore, kpath, loaded, rule, skip, srcFile, srcs, srcText, tgtFile, tgts, tgtText, transpiled, _312_23_, _313_23_, _390_18_

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
    opt.verbose = ((_312_23_=opt.verbose) != null ? _312_23_ : opt.debug)
    opt.map = ((_313_23_=opt.map) != null ? _313_23_ : true)
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
        await saveCache(kpath,loaded,fp,opt.map,srcs,tgts)
    }
    opt.reconcile = ((_390_18_=opt.reconcile) != null ? _390_18_ : true)
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
knrd.hash = hash
knrd.rel = rel
knrd.usable = usable
knrd.shaped = shaped
knrd.loadCache = loadCache
knrd.saveCache = saveCache
knrd.isCurrent = isCurrent
export default knrd;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb25yYWQva25yZC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQXVCQSxTQUVJLE1BQ0ksT0FBUyxLQUNULE9BQVMsT0FDVCxPQUFTLEtBQ1Q7Ozs7SUFDSSxXQUFXLE1BQUssT0FBTyxNQUFNLElBQUksSUFBSTs7O2VBRWpDLEtBQUssUUFBUSxRQUFRLFFBQVE7O1dBQzNCOztRQUNGLFlBQUk7O0dBQ2hCLE1BQ0ksT0FBUyxPQUNULE9BQVMsT0FDVCxPQUFTLEtBQ1Q7O1dBQXdDLEtBQUssVUFBVSxLQUFLLE1BQU0sU0FBUyxLQUFLO0dBRXBGLFFBQ0ksa0JBQ0E7O0FBU1I7Ozs7SUFFSSxVQUFVO1FBQ1AsTUFBTSxXQUFXOztRQUNoQixVQUFVLE1BQU0sS0FBSyxRQUFRLE1BQU07O1dBQ3ZDOzs7QUFFSjs7V0FFSSxNQUFNLFFBQVEsUUFBUSxRQUFRLFdBQVcsS0FBSyxRQUFRLFdBQVcsS0FBSyxTQUFTLEtBQUs7OztBQUV4Rjs7V0FBcUIsTUFBTSxLQUFLLFlBQVk7OztBQUU1Qzs7V0FHSSxRQUFROzs7QUFFWjs7aUJBRU0sSUFBSSxNQUFNLFdBQVcsc0NBQXNDLFVBQVE7OztBQVF6RTs7OztJQUVJLGFBQVMsSUFBSSxLQUFLLFdBQVc7SUFDN0IsT0FBUSxLQUFLOztlQUFpQixLQUFLLFNBQVE7O0lBRTNDLFFBQVEsS0FBSzs7ZUFBYyxLQUFLOztXQUNoQyxRQUFRLE1BQU07Ozs7NkJBQ0ksTUFBTTs7OztnQkFDTCxLQUFLLFNBQVM7O3VCQUF2Qjs7O2VBQ047Ozs7QUF1QlI7Ozs7SUFFSSxRQUFRLEtBQUssTUFBTTtJQUNuQixPQUFRO3dCQUVJOzs7O1FBRVIsTUFBTSxLQUFLLFFBQVEsd0JBQXdCO1lBRXhDLFFBQU87O1lBQ04sT0FBTyxNQUFNLFNBQVMsTUFBTSxLQUFLLFFBQVEsTUFBTzs7O1FBRXJEOztlQUNHOztJQUVOLElBQUksb0VBQW9FLEtBQUs7VUFDckUsZ0JBQVksRUFB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
//# sourceURL=file://kode/konrad/knrd.kode
