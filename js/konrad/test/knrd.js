var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var after, afterNo, away, back, bad, before, built, cache, cached, calm, cjfile, cjfile2, cjtext, cjtext2, ckache, ckfile, ckfile2, cksrc, cktext, cktext2, cktgt, compiledNo, copied, copyA, copyB, copyCompiler, copyFpA, copyFpB, dirs, disk, files, fpA, fpB, fpOne, fpTwo, fromCwd, gone, goneJsText, goneNoText, healed, healedOk, hereText, isFile, jdir, jp, junk, junkList, junkMap, kdir, kept, kp, live, loaded, mapHereText, mapped, merged, more, moved, nothing, nowhere, once, oneSrc, oneTgt, opt, other, relURL, root, setup, setupCache, stamped, still, was, whole, write, wrote

import knrd from "../knrd.js"

import nfs from "../../kxk/nfs.js"
import slash from "../../kxk/slash.js"
import testdir from "../../kxk/testdir.js"


stamped = function (src)
{
    return `var a\n\n//# sourceURL=file://${src}\n`
}

relURL = function (src)
{
    return `var a\n\n//# sourceURL=${src}\n`
}

mapped = function (src)
{
    var b64, json

    json = JSON.stringify({sources:[src],mappings:''})
    b64 = Buffer.from(json,'utf8').toString('base64')
    return `var a\n\n//# sourceMappingURL=data:application/json;base64,${b64}\n`
}
root = testdir('kodeknrd')
jdir = slash.path(root,'js')
kdir = slash.path(root,'kode')

jp = function (name)
{
    return slash.path(jdir,name)
}

kp = function (name)
{
    return slash.path(kdir,name)
}

isFile = async function (p)
{
    var found

    found = await nfs.isFile(p)
    return (found ? true : false)
}

fromCwd = function (p)
{
    return slash.relative(p,process.cwd())
}
hereText = stamped((fromCwd(kp('here.kode'))))
goneJsText = stamped((fromCwd(kp('gone.kode'))))
goneNoText = stamped((fromCwd(kp('gone.noon'))))
mapHereText = mapped('../kode/here.kode')

write = function (src, text)
{
    return nfs.write(jp(src),text)
}
opt = {srcDir:kdir,quiet:true}
dirs = [jdir]

setup = async function ()
{
    await nfs.remove(root)
    await nfs.mkdir(jdir)
    await nfs.mkdir(kdir)
    await nfs.write(kp('here.kode'),'x = 1\n')
    await write('kept.js',hereText)
    await write('stale.js',goneJsText)
    await write('hand.js','export default {}\n')
    return await write('stale.json',goneNoText)
}
toExport["stampSource"] = async function ()
{
    await section("a file kode did not write has no source", async function ()
    {
        compare(knrd.stampSource('var a = 1\n',jdir),'')
    })
    await section("a hand written file is not a candidate", async function ()
    {
        compare(knrd.stampSource('export default {}\n',jdir),'')
    })
    await section("the sourceURL is enough on its own", async function ()
    {
        compare(knrd.stampSource(hereText,jdir),kp('here.kode'))
    })
    await section("an absolute sourceURL is taken as it stands", async function ()
    {
        compare(knrd.stampSource(stamped(kp('here.kode')),jdir),kp('here.kode'))
    })
    await section("a relative sourceURL is read from the folder of the js file", async function ()
    {
        compare(knrd.stampSource(relURL('../kode/here.kode'),jp('x.js')),kp('here.kode'))
    })
    await section("and the sourcemap still works on its own", async function ()
    {
        compare(knrd.stampSource(mapHereText,jp('x.js')),kp('here.kode'))
    })
    await section("and a sourcemap naming an absolute source", async function ()
    {
        compare(knrd.stampSource(mapped(kp('here.kode')),jp('x.js')),kp('here.kode'))
    })
    await section("a sourcemap that is not base64 is not a stamp", async function ()
    {
        compare(knrd.stampSource('//# sourceMappingURL=data:application/json;base64,!!!\n',jdir),'')
    })
    await section("a map with no sources is not a stamp", async function ()
    {
        bad = '//# sourceMappingURL=data:application/json;base64,eyJmb28iOiJiYXIifQ==\n'
        compare(knrd.stampSource(bad,jdir),'')
    })
}
toExport["stampSource"]._section_ = true
toExport["reconcile"] = async function ()
{
    await section("what has lost its source goes, and only that", async function ()
    {
        await setup()
        gone = await knrd.reconcile(dirs,opt)
        compare(gone.length,2)
    })
    await section("and a file stamped with an absolute path goes too", async function ()
    {
        await setup()
        await nfs.write(jp('abs.js'),stamped(kp('gone.kode')))
        await knrd.reconcile(dirs,opt)
        compare(await (isFile(jp('abs.js'))),await (false))
    })
    await section("and a file stamped with a relative path goes too", async function ()
    {
        await setup()
        await nfs.write(jp('rel.js'),relURL('../kode/gone.kode'))
        await knrd.reconcile(dirs,opt)
        compare(await (isFile(jp('rel.js'))),await (false))
    })
    await section("and it is the right two", async function ()
    {
        await setup()
        gone = await knrd.reconcile(dirs,opt)
        compare(gone.join(' '),`${jp('stale.js')} ${jp('stale.json')}`)
    })
    await section("a generated file whose source is still there stays", async function ()
    {
        await setup()
        await knrd.reconcile(dirs,opt)
        compare(await (isFile(jp('kept.js'))),await (true))
    })
    await section("a file nobody generated stays", async function ()
    {
        await setup()
        await knrd.reconcile(dirs,opt)
        compare(await (isFile(jp('hand.js'))),await (true))
    })
    await section("a second pass has nothing to do", async function ()
    {
        await setup()
        await knrd.reconcile(dirs,opt)
        nothing = await knrd.reconcile(dirs,opt)
        compare(nothing,[])
    })
    await section("a directory that is not there is not an error", async function ()
    {
        nowhere = await knrd.reconcile([slash.path(root,'nowhere')],opt)
        compare(nowhere,[])
    })
    await section("the source is resolved, not guessed", async function ()
    {
        await setup()
        await knrd.reconcile(dirs,opt)
        away = slash.path(root,'elsewhere','here.kode')
        await nfs.write(jp('stray.js'),stamped(fromCwd(away)))
        await knrd.reconcile(dirs,opt)
        compare(await (isFile(jp('stray.js'))),await (true))
    })
    await section("a stamp naming a directory is not a source", async function ()
    {
        await setup()
        await knrd.reconcile(dirs,opt)
        await nfs.write(jp('dirish.js'),stamped(fromCwd(kdir)))
        await knrd.reconcile(dirs,opt)
        compare(await (isFile(jp('dirish.js'))),await (true))
    })
}
toExport["reconcile"]._section_ = true
cache = slash.path(root,'cache')
ckfile = slash.path(cache,'x.kode')
cjfile = slash.path(cache,'x.js')
ckfile2 = slash.path(cache,'y.kode')
cjfile2 = slash.path(cache,'y.js')
ckache = slash.path(cache,'.kkache')
cktext = 'x = 1\n'
cjtext = 'var x = 1;\n'
cktext2 = 'y = 2\n'
cjtext2 = 'var y = 2;\n'
fpA = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
fpB = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
cksrc = {}
cksrc[knrd.rel(ckfile)] = knrd.hash(cktext)
cksrc[knrd.rel(ckfile2)] = knrd.hash(cktext2)
cktgt = {}
cktgt[knrd.rel(cjfile)] = knrd.hash(cjtext)
cktgt[knrd.rel(cjfile2)] = knrd.hash(cjtext2)
more = {}
more[knrd.rel(ckfile)] = 'cccccccccccccccccccccccccccccccccccccccc'
oneSrc = {}
oneSrc[knrd.rel(ckfile)] = cksrc[knrd.rel(ckfile)]
oneTgt = {}
oneTgt[knrd.rel(cjfile)] = cktgt[knrd.rel(cjfile)]

setupCache = async function ()
{
    await nfs.remove(cache)
    await nfs.mkdir(cache)
    await nfs.write(ckfile,cktext)
    await nfs.write(cjfile,cjtext)
    await nfs.write(ckfile2,cktext2)
    await nfs.write(cjfile2,cjtext2)
    return await nfs.remove(ckache)
}

built = async function (fp, srcs, tgts, whole)
{
    var back, ok

    back = await knrd.loadCache(ckache)
    ok = await knrd.saveCache(ckache,back,fp,true,srcs,tgts,whole)
    return {ok:ok,cache:await knrd.loadCache(ckache)}
}

cached = async function (fp)
{
    await setupCache()
    await knrd.saveCache(ckache,null,fp,true,cksrc,cktgt,false)
    return await knrd.loadCache(ckache)
}
toExport["cache"] = async function ()
{
    await section("it round trips through noon", async function ()
    {
        await setupCache()
        wrote = await knrd.saveCache(ckache,null,fpA,true,cksrc,cktgt)
        back = await knrd.loadCache(ckache)
        compare(wrote,true)
        compare(back.kode,fpA)
        compare(back.srcmap,true)
        compare(back.source[knrd.rel(ckfile)],knrd.hash(cktext))
        compare(back.target[knrd.rel(cjfile)],knrd.hash(cjtext))
    })
    await section("a file that is not there is not a cache", async function ()
    {
        compare(await (knrd.loadCache(slash.path(cache,'nowhere'))),await (null))
    })
    await section("rubbish that still parses is not a cache either", async function ()
    {
        await setupCache()
        await nfs.write(ckache,'- not a cache at all\n')
        junkList = await knrd.loadCache(ckache)
        await nfs.write(ckache,'kode   not\n\tsource\n')
        junkMap = await knrd.loadCache(ckache)
        compare(knrd.shaped(junkList),false)
        compare(knrd.shaped(junkMap),false)
        compare(knrd.usable(junkMap,fpA,true),false)
    })
    await section("the header is the compiler and the sourcemap, and it needs both", async function ()
    {
        back = await cached(fpA)
        compare(knrd.usable(back,fpA,true),true)
        compare(knrd.usable(back,fpB,true),false)
        compare(knrd.usable(back,fpA,false),false)
        compare(knrd.usable(null,fpA,true),false)
        compare(knrd.usable({},fpA,true),false)
    })
    await section("current means the source and what is on disk both still match", async function ()
    {
        back = await cached(fpA)
        compare(await (knrd.isCurrent(back,ckfile,cjfile,cktext)),await (true))
    })
    await section("a source that has moved is a miss", async function ()
    {
        back = await cached(fpA)
        compare(await (knrd.isCurrent(back,ckfile,cjfile,'x = 2\n')),await (false))
    })
    await section("a target that has moved is a miss", async function ()
    {
        back = await cached(fpA)
        await nfs.write(cjfile,'var x = 2;\n')
        compare(await (knrd.isCurrent(back,ckfile,cjfile,cktext)),await (false))
    })
    await section("a target that is not there is a miss", async function ()
    {
        back = await cached(fpA)
        await nfs.remove(cjfile)
        compare(await (knrd.isCurrent(back,ckfile,cjfile,cktext)),await (false))
    })
    await section("and no cache at all is a miss", async function ()
    {
        compare(await (knrd.isCurrent(null,ckfile,cjfile,cktext)),await (false))
    })
    await section("a build that compiled nothing writes nothing", async function ()
    {
        once = await built(fpA,cksrc,cktgt,false)
        before = await nfs.read(ckache)
        compiledNo = await knrd.saveCache(ckache,once.cache,fpA,true,{},{})
        afterNo = await nfs.read(ckache)
        compare(compiledNo,false)
        compare(afterNo,before)
    })
    await section("a partial build does not write over a cache from another compiler", async function ()
    {
        await built(fpA,cksrc,cktgt,false)
        other = await built(fpB,cksrc,cktgt,false)
        compare(other.ok,false)
        compare(other.cache.kode,fpA)
    })
    await section("and one that can, merges rather than replaces", async function ()
    {
        await built(fpA,cksrc,cktgt,false)
        merged = await built(fpA,more,cktgt,false)
        compare(merged.ok,true)
        compare(merged.cache.source[knrd.rel(ckfile)],more[knrd.rel(ckfile)])
        compare(merged.cache.target[knrd.rel(cjfile)],knrd.hash(cjtext))
    })
    await section("and a whole build can replace a cache from another compiler", async function ()
    {
        await built(fpA,cksrc,cktgt,false)
        await built(fpA,more,cktgt,false)
        whole = await built(fpB,cksrc,cktgt,true)
        compare(whole.ok,true)
        compare(whole.cache.kode,fpB)
        compare(whole.cache.source[knrd.rel(ckfile)],knrd.hash(cktext))
    })
    await section("but a partial one cannot, or the files it never looked at go on", async function ()
    {
    })
    await section("being marked current under a compiler they were never built with", async function ()
    {
        await built(fpA,cksrc,cktgt,false)
        await built(fpA,more,cktgt,false)
        await built(fpB,cksrc,cktgt,true)
        still = await built(fpA,cksrc,cktgt,false)
        compare(still.ok,false)
        compare(still.cache.kode,fpB)
    })
    await section("and a whole build adds to the cache rather than replacing it, or the", async function ()
    {
    })
    await section("files it did not compile lose their entry and the next build has to", async function ()
    {
    })
    await section("rebuild the tree to write them back", async function ()
    {
        once = await built(fpA,cksrc,cktgt,false)
        merged = await built(fpA,more,cktgt,false)
        whole = await built(fpB,cksrc,cktgt,true)
        still = await built(fpA,cksrc,cktgt,false)
        kept = await built(fpB,oneSrc,oneTgt,true)
        compare(kept.ok,true)
        compare(kept.cache.source[knrd.rel(ckfile)],cksrc[knrd.rel(ckfile)])
        compare(kept.cache.source[knrd.rel(ckfile2)],cksrc[knrd.rel(ckfile2)])
        compare(kept.cache.target[knrd.rel(cjfile)],cktgt[knrd.rel(cjfile)])
        compare(kept.cache.target[knrd.rel(cjfile2)],cktgt[knrd.rel(cjfile2)])
    })
    await section("but rubbish is replaced, or it would wedge the build for good", async function ()
    {
        await setupCache()
        await nfs.write(ckache,'- not a cache at all\n')
        junk = await knrd.loadCache(ckache)
        healedOk = await knrd.saveCache(ckache,junk,fpA,true,cksrc,cktgt)
        healed = await knrd.loadCache(ckache)
        compare(healedOk,true)
        compare(healed.kode,fpA)
        compare(healed.source[knrd.rel(ckfile)],knrd.hash(cktext))
    })
    await section("the fingerprint is a digest of the compiler, and it does not move", async function ()
    {
        fpOne = await knrd.fingerprint()
        fpTwo = await knrd.fingerprint()
        compare(fpOne === fpTwo,true)
        compare(fpOne.length,40)
        compare(fpOne !== knrd.hash(''),true)
    })
    await section("the fingerprint can be taken of a copy of the compiler, and a faithful", async function ()
    {
    })
    await section("copy of that copy has the same fingerprint", async function ()
    {
        copyA = testdir('compilerA')
        copyB = testdir('compilerB')
        copyCompiler = async function (from, to)
        {
            var f, files, text

            files = await knrd.fingerprintFiles(from)
            var list = _k_.list(files)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                f = list[_a_]
                text = await nfs.read(f)
                await nfs.write(slash.path(to,slash.relative(f,from)),text)
            }
        }
        await copyCompiler(knrd.compilerDir(),copyA)
        await copyCompiler(copyA,copyB)
        copyFpA = await knrd.fingerprint(copyA)
        copyFpB = await knrd.fingerprint(copyB)
        copied = await knrd.fingerprintFiles(copyA)
        live = await knrd.fingerprintFiles()
        compare(copyFpA.length,40)
        compare(copyFpA,copyFpB)
        compare(copied.length,live.length)
    })
    await section("the compiler fingerprint is taken when knrd loads, so a compiler that", async function ()
    {
    })
    await section("changes on disk later does not pass for the one that is running", async function ()
    {
        loaded = await knrd.compilerFingerprint()
        was = await knrd.stale()
        calm = await knrd.compilerMoved()
        await nfs.write(slash.path(copyA,'kode','zz_fingerprint_probe.js'),'// probe\n')
        disk = await knrd.fingerprint(copyA)
        after = await knrd.compilerFingerprint()
        still = await knrd.stale()
        moved = await knrd.compilerMoved(copyA)
        compare(loaded.length,40)
        compare(disk !== copyFpA,true)
        compare(disk !== loaded,true)
        compare(after,loaded)
        compare(still,was)
    })
    await section("and it can tell when the compiler on disk is no longer the loaded one", async function ()
    {
        compare(calm,false)
        compare(moved,true)
        compare(await (knrd.compilerMoved()),await (false))
    })
    await section("the fingerprint leaves out test files", async function ()
    {
        files = await knrd.fingerprintFiles()
        compare(files.length > 0,true)
        compare(files.filter(function (f)
        {
            return f.includes('/test/')
        }).length,0)
    })
    await section("the cache lives beside the sources it describes", async function ()
    {
        compare(knrd.cachePath().endsWith('kode/.kkache'),true)
    })
    await section("hashing is hashing", async function ()
    {
        compare(knrd.hash('x') === knrd.hash('x'),true)
        compare(knrd.hash('x') === knrd.hash('y'),false)
        compare(knrd.hash('').length,40)
    })
}
toExport["cache"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb25yYWQvdGVzdC9rbnJkLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ08sV0FBQTs7T0FDUyxVQUFOO09BQVUsWUFBVjtPQUFnQixjQUFoQjs7O0FBRVYsb0JBQVU7OzRDQUF3Qzs7O0FBQ2xELG1CQUFVOztxQ0FBaUM7OztBQUUzQyxtQkFBUzs7OztJQUVMLE9BQU8sS0FBSyxXQUFXLFNBQVMsS0FBSyxTQUFTO0lBQzlDLE1BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxTQUFTO3lFQUNxQjs7QUFFbEUsT0FBTyxRQUFRO0FBRWYsT0FBTyxNQUFNLEtBQUssS0FBTTtBQUN4QixPQUFPLE1BQU0sS0FBSyxLQUFNOztBQUV4QixlQUFLOztXQUFRLE1BQU0sS0FBSyxLQUFNOzs7QUFDOUIsZUFBSzs7V0FBUSxNQUFNLEtBQUssS0FBTTs7O0FBRTlCLHlCQUFTOzs7O0lBRUwsY0FBVSxJQUFJLE9BQU87WUFDckIsUUFBUSxPQUFPOzs7QUFFbkIsb0JBQVU7O1dBQUssTUFBTSxTQUFTLEVBQUcsUUFBUTs7QUFFekMsV0FBYSxTQUFTLFFBQVEsR0FBRztBQUNqQyxhQUFhLFNBQVMsUUFBUSxHQUFHO0FBQ2pDLGFBQWEsU0FBUyxRQUFRLEdBQUc7QUFFakMsY0FBYyxPQUFPOztBQUVyQixrQkFBUSxLQUFJOztXQUFRLElBQUksTUFBTSxHQUFHLEtBQUs7O0FBRXRDLE9BQVEsT0FBTyxLQUFLLE1BQU07QUFDMUIsUUFBUTs7QUFFUjs7VUFFTSxJQUFJLE9BQU87VUFDWCxJQUFJLE1BQU87VUFDWCxJQUFJLE1BQU87VUFDWCxJQUFJLE1BQU8sR0FBRyxhQUFhO1VBRTNCLE1BQU0sVUFBVTtVQUNoQixNQUFNLFdBQVc7VUFDakIsTUFBTSxVQUFVO2lCQUNoQixNQUFNLGFBQWE7Ozs7OztRQU1xQixRQUF0QyxLQUFLLFlBQVksY0FBZSxNQUFROzs7O1FBSU0sUUFBOUMsS0FBSyxZQUFZLHNCQUF1QixNQUFROzs7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
//# sourceURL=../../../kode/konrad/test/knrd.kode
