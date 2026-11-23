var toExport = {}
var after, afterNo, away, back, bad, before, built, cache, cached, calm, cjfile, cjfile2, cjtext, cjtext2, ckache, ckfile, ckfile2, cksrc, cktext, cktext2, cktgt, compiledNo, dirs, disk, files, first, fpA, fpB, fpOne, fpTwo, fromCwd, gone, goneJsText, goneNoText, healed, healedOk, hereText, isFile, jdir, jp, junk, junkList, junkMap, kdir, kept, kp, loaded, mapHereText, mapped, merged, more, moved, nothing, nowhere, oneSrc, oneTgt, opt, other, probe, relURL, root, setup, setupCache, stamped, still, was, whole, write, wrote

import knrd from "../knrd.js"

import nfs from "../../kxk/nfs.js"
import slash from "../../kxk/slash.js"


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
root = '/tmp/opencode/kodeknrd'
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
        first = await built(fpA,cksrc,cktgt,false)
        before = await nfs.read(ckache)
        compiledNo = await knrd.saveCache(ckache,first.cache,fpA,true,{},{})
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
        first = await built(fpA,cksrc,cktgt,false)
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
    await section("the compiler fingerprint is taken when knrd loads, so a compiler that", async function ()
    {
    })
    await section("changes on disk later does not pass for the one that is running", async function ()
    {
        files = await knrd.fingerprintFiles()
        probe = slash.path(slash.dir(files[0]),'zz_fingerprint_probe.js')
        loaded = await knrd.compilerFingerprint()
        was = await knrd.stale()
        calm = await knrd.compilerMoved()
        try
        {
            await nfs.write(probe,'// probe\n')
            disk = await knrd.fingerprint()
            after = await knrd.compilerFingerprint()
            still = await knrd.stale()
            moved = await knrd.compilerMoved()
        }
        finally
        {
            await nfs.remove(probe)
        }
        compare(loaded.length,40)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb25yYWQvdGVzdC9rbnJkLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNPLFdBQUE7O09BQ1MsVUFBTjtPQUFVLFlBQVY7OztBQUVWLG9CQUFVOzs0Q0FBd0M7OztBQUNsRCxtQkFBVTs7cUNBQWlDOzs7QUFFM0MsbUJBQVM7Ozs7SUFFTCxPQUFPLEtBQUssV0FBVyxTQUFTLEtBQUssU0FBUztJQUM5QyxNQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsU0FBUzt5RUFDcUI7O0FBRWxFLE9BQU87QUFFUCxPQUFPLE1BQU0sS0FBSyxLQUFNO0FBQ3hCLE9BQU8sTUFBTSxLQUFLLEtBQU07O0FBRXhCLGVBQUs7O1dBQVEsTUFBTSxLQUFLLEtBQU07OztBQUM5QixlQUFLOztXQUFRLE1BQU0sS0FBSyxLQUFNOzs7QUFFOUIseUJBQVM7Ozs7SUFFTCxjQUFVLElBQUksT0FBTztZQUNyQixRQUFRLE9BQU87OztBQUVuQixvQkFBVTs7V0FBSyxNQUFNLFNBQVMsRUFBRyxRQUFROztBQUV6QyxXQUFhLFNBQVMsUUFBUSxHQUFHO0FBQ2pDLGFBQWEsU0FBUyxRQUFRLEdBQUc7QUFDakMsYUFBYSxTQUFTLFFBQVEsR0FBRztBQUVqQyxjQUFjLE9BQU87O0FBRXJCLGtCQUFRLEtBQUk7O1dBQVEsSUFBSSxNQUFNLEdBQUcsS0FBSzs7QUFFdEMsT0FBUSxPQUFPLEtBQUssTUFBTTtBQUMxQixRQUFROztBQUVSOztVQUVNLElBQUksT0FBTztVQUNYLElBQUksTUFBTztVQUNYLElBQUksTUFBTztVQUNYLElBQUksTUFBTyxHQUFHLGFBQWE7VUFFM0IsTUFBTSxVQUFVO1VBQ2hCLE1BQU0sV0FBVztVQUNqQixNQUFNLFVBQVU7aUJBQ2hCLE1BQU0sYUFBYTs7Ozs7O2dCQU1qQixLQUFLLFlBQVksY0FBZSxNQUFROzs7O2dCQUl4QyxLQUFLLFlBQVksc0JBQXVCLE1BQVE7Ozs7Z0JBSWhELEtBQUssWUFBWSxTQUFVLE1BQVEsR0FBRzs7OztnQkFJdEMsS0FBSyxZQUFZLFFBQVEsR0FBRyxjQUFlLE1BQVMsR0FBRzs7OztnQkFJdkQsS0FBSyxZQUFZLE9BQU8scUJBQXNCLEdBQUcsU0FBWSxHQUFHOzs7O2dCQUloRSxLQUFLLFlBQVksWUFBYSxHQUFHLFNBQVcsR0FBRzs7OztnQkFJL0MsS0FBSyxZQUFZLE9BQU8sR0FBRyxjQUFlLEdBQUcsU0FBWSxHQUFHOzs7O2dCQUk1RCxLQUFLLFlBQVksMERBQTJELE1BQVE7Ozs7UUFJcEYsTUFBTTtnQkFDTixLQUFLLFlBQVksSUFBSyxNQUFROzs7Ozs7OztjQU01QjtRQUNGLGFBQVMsS0FBSyxVQUFVLEtBQUs7Z0JBRTdCLEtBQUssT0FBVTs7OztjQUliO2NBQ0EsSUFBSSxNQUFNLEdBQUcsVUFBVyxRQUFRLEdBQUc7Y0FDbkMsS0FBSyxVQUFVLEtBQUs7dUJBRXRCLE9BQU8sR0FBRyxtQkFBYTs7OztjQUlyQjtjQUNBLElBQUksTUFBTSxHQUFHLFVBQVcsT0FBTztjQUMvQixLQUFLLFVBQVUsS0FBSzt1QkFFdEIsT0FBTyxHQUFHLG1CQUFhOzs7O2NBSXJCO1FBQ0YsYUFBUyxLQUFLLFVBQVUsS0FBSztnQkFFN0IsS0FBSyxLQUFLLFFBQVUsR0FBRyxlQUFlLEdBQUc7Ozs7Y0FJdkM7Y0FDQSxLQUFLLFVBQVUsS0FBSzt1QkFFdEIsT0FBTyxHQUFHLG9CQUFjOzs7O2NBSXRCO2NBQ0EsS0FBSyxVQUFVLEtBQUs7dUJBRXRCLE9BQU8sR0FBRyxvQkFBYzs7OztjQUl0QjtjQUNBLEtBQUssVUFBVSxLQUFLO1FBQ3RCLGdCQUFZLEtBQUssVUFBVSxLQUFLO2dCQUVoQzs7OztRQUlBLGdCQUFZLEtBQUssV0FBVyxNQUFNLEtBQUssS0FBSyxZQUFZO2dCQUV4RDs7OztjQUlFO2NBQ0EsS0FBSyxVQUFVLEtBQUs7UUFFdEIsT0FBTyxNQUFNLEtBQUssS0FBSyxZQUFZO2NBQ2pDLElBQUksTUFBTSxHQUFHLFlBQWEsUUFBUSxRQUFRO2NBQzFDLEtBQUssVUFBVSxLQUFLO3VCQUV0QixPQUFPLEdBQUcscUJBQWU7Ozs7Y0FJdkI7Y0FDQSxLQUFLLFVBQVUsS0FBSztjQUVwQixJQUFJLE1BQU0sR0FBRyxhQUFjLFFBQVEsUUFBUTtjQUMzQyxLQUFLLFVBQVUsS0FBSzt1QkFFdEIsT0FBTyxHQUFHLHNCQUFnQjs7OztBQUVsQyxRQUFRLE1BQU0sS0FBSyxLQUFNO0FBRXpCLFNBQVMsTUFBTSxLQUFLLE1BQU87QUFDM0IsU0FBUyxNQUFNLEtBQUssTUFBTztBQUUzQixVQUFVLE1BQU0sS0FBSyxNQUFPO0FBQzVCLFVBQVUsTUFBTSxLQUFLLE1BQU87QUFFNUIsU0FBUyxNQUFNLEtBQUssTUFBTztBQUUzQixTQUFTO0FBQ1QsU0FBUztBQUNULFVBQVU7QUFDVixVQUFVO0FBRVYsTUFBTTtBQUNOLE1BQU07QUFFTjtBQUNBLE1BQU0sS0FBSyxJQUFJLFdBQVUsS0FBSyxLQUFLO0FBQ25DLE1BQU0sS0FBSyxJQUFJLFlBQVcsS0FBSyxLQUFLO0FBRXBDO0FBQ0EsTUFBTSxLQUFLLElBQUksV0FBVSxLQUFLLEtBQUs7QUFDbkMsTUFBTSxLQUFLLElBQUksWUFBVyxLQUFLLEtBQUs7QUFFcEM7QUFDQSxLQUFLLEtBQUssSUFBSSxXQUFVO0FBRXhCO0FBQ0EsT0FBTyxLQUFLLElBQUksV0FBVSxNQUFNLEtBQUssSUFBSTtBQUV6QztBQUNBLE9BQU8sS0FBSyxJQUFJLFdBQVUsTUFBTSxLQUFLLElBQUk7O0FBRXpDOztVQUVNLElBQUksT0FBTztVQUNYLElBQUksTUFBTztVQUNYLElBQUksTUFBTyxPQUFPO1VBQ2xCLElBQUksTUFBTyxPQUFPO1VBQ2xCLElBQUksTUFBTyxRQUFRO1VBQ25CLElBQUksTUFBTyxRQUFRO2lCQUNuQixJQUFJLE9BQU87OztBQUVqQix3QkFBUSxJQUFHLE1BQUssTUFBSzs7OztJQUVqQixhQUFTLEtBQUssVUFBVTtJQUN4QixXQUFPLEtBQUssVUFBVSxPQUFRLEtBQU0sR0FBSSxLQUFNLEtBQU0sS0FBTTtZQUV2RCxHQUFJLEdBQUksWUFBUyxLQUFLLFVBQVU7OztBQUV2Qyx5QkFBUzs7VUFFSDtVQUNBLEtBQUssVUFBVSxPQUFRLEtBQU0sR0FBSSxLQUFNLE1BQU8sTUFBTztpQkFFbkQsS0FBSyxVQUFVOzs7Ozs7Y0FNYjtRQUNGLGNBQVUsS0FBSyxVQUFVLE9BQVEsS0FBTSxJQUFLLEtBQU0sTUFBTztRQUN6RCxhQUFTLEtBQUssVUFBVTtnQkFFeEIsTUFBZTtnQkFDZixLQUFLLEtBQVU7Z0JBQ2YsS0FBSyxPQUFVO2dCQUNmLEtBQUssT0FBTyxLQUFLLElBQUksU0FBVSxLQUFLLEtBQUs7Z0JBQ3pDLEtBQUssT0FBTyxLQUFLLElBQUksU0FBVSxLQUFLLEtBQUs7Ozs7dUJBSXpDLEtBQUssVUFBVSxNQUFNLEtBQUssTUFBTSxvQkFBZTs7OztjQUk3QztjQUVBLElBQUksTUFBTSxPQUFRO1FBQ3BCLGlCQUFhLEtBQUssVUFBVTtjQUUxQixJQUFJLE1BQU0sT0FBUTtRQUNwQixnQkFBYSxLQUFLLFVBQVU7Z0JBRTVCLEtBQUssT0FBTyxVQUFZO2dCQUN4QixLQUFLLE9BQU8sU0FBWTtnQkFDeEIsS0FBSyxPQUFPLFFBQVMsSUFBSyxNQUFROzs7O1FBSWxDLGFBQVMsT0FBTztnQkFFaEIsS0FBSyxPQUFPLEtBQU0sSUFBSyxNQUFTO2dCQUNoQyxLQUFLLE9BQU8sS0FBTSxJQUFLLE1BQVM7Z0JBQ2hDLEtBQUssT0FBTyxLQUFNLElBQUssT0FBUztnQkFDaEMsS0FBSyxPQUFPLEtBQU8sSUFBSyxNQUFTO2dCQUNqQyxLQUFLLFVBQWEsSUFBSyxNQUFTOzs7O1FBTWhDLGFBQVMsT0FBTzt1QkFFaEIsS0FBSyxVQUFVLEtBQU0sT0FBUSxPQUFRLGdCQUFXOzs7O1FBSWhELGFBQVMsT0FBTzt1QkFFaEIsS0FBSyxVQUFVLEtBQU0sT0FBUSxPQUFRLG1CQUFjOzs7O1FBSW5ELGFBQVMsT0FBTztjQUNkLElBQUksTUFBTSxPQUFRO3VCQUVwQixLQUFLLFVBQVUsS0FBTSxPQUFRLE9BQVEsZ0JBQVc7Ozs7UUFJaEQsYUFBUyxPQUFPO2NBQ2QsSUFBSSxPQUFPO3VCQUViLEtBQUssVUFBVSxLQUFNLE9BQVEsT0FBUSxnQkFBVzs7Ozt1QkFJaEQsS0FBSyxVQUFVLEtBQU0sT0FBUSxPQUFRLGdCQUFXOzs7O1FBSWhELGNBQVUsTUFBTSxJQUFLLE1BQU8sTUFBTztRQUNuQyxlQUFXLElBQUksS0FBSztRQUNwQixtQkFBZSxLQUFLLFVBQVUsT0FBUSxNQUFNLE1BQU8sSUFBSztRQUN4RCxnQkFBWSxJQUFJLEtBQUs7Z0JBRXJCLFdBQWM7Z0JBQ2QsUUFBYzs7OztjQUlaLE1BQU0sSUFBSyxNQUFPLE1BQU87UUFDM0IsY0FBVSxNQUFNLElBQUssTUFBTyxNQUFPO2dCQUVuQyxNQUFNLEdBQWM7Z0JBQ3BCLE1BQU0sTUFBTSxLQUFROzs7O2NBSWxCLE1BQU0sSUFBSyxNQUFPLE1BQU87UUFDM0IsZUFBVyxNQUFNLElBQUssS0FBTSxNQUFPO2dCQUVuQyxPQUFPLEdBQU07Z0JBQ2IsT0FBTyxNQUFNLE9BQU8sS0FBSyxJQUFJLFNBQVcsS0FBSyxLQUFLLElBQUk7Z0JBQ3RELE9BQU8sTUFBTSxPQUFPLEtBQUssSUFBSSxTQUFVLEtBQUssS0FBSzs7OztjQUkvQyxNQUFNLElBQUssTUFBTyxNQUFPO2NBQ3pCLE1BQU0sSUFBSyxLQUFNLE1BQU87UUFDMUIsY0FBVSxNQUFNLElBQUssTUFBTyxNQUFPO2dCQUVuQyxNQUFNLEdBQU07Z0JBQ1osTUFBTSxNQUFNLEtBQVE7Z0JBQ3BCLE1BQU0sTUFBTSxPQUFPLEtBQUssSUFBSSxTQUFXLEtBQUssS0FBSzs7Ozs7OztjQUsvQyxNQUFNLElBQUssTUFBTyxNQUFPO2NBQ3pCLE1BQU0sSUFBSyxLQUFNLE1BQU87Y0FDeEIsTUFBTSxJQUFLLE1BQU8sTUFBTztRQUMzQixjQUFVLE1BQU0sSUFBSyxNQUFPLE1BQU87Z0JBRW5DLE1BQU0sR0FBTTtnQkFDWixNQUFNLE1BQU0sS0FBUTs7Ozs7Ozs7OztRQU1wQixjQUFVLE1BQU0sSUFBSyxNQUFPLE1BQU87UUFDbkMsZUFBVyxNQUFNLElBQUssS0FBTSxNQUFPO1FBQ25DLGNBQVUsTUFBTSxJQUFLLE1BQU8sTUFBTztRQUNuQyxjQUFVLE1BQU0sSUFBSyxNQUFPLE1BQU87UUFDbkMsYUFBUyxNQUFNLElBQUssT0FBUSxPQUFRO2dCQUVwQyxLQUFLLEdBQU07Z0JBQ1gsS0FBSyxNQUFNLE9BQU8sS0FBSyxJQUFJLFNBQVcsTUFBTSxLQUFLLElBQUk7Z0JBQ3JELEtBQUssTUFBTSxPQUFPLEtBQUssSUFBSSxVQUFXLE1BQU0sS0FBSyxJQUFJO2dCQUNyRCxLQUFLLE1BQU0sT0FBTyxLQUFLLElBQUksU0FBVyxNQUFNLEtBQUssSUFBSTtnQkFDckQsS0FBSyxNQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVcsTUFBTSxLQUFLLElBQUk7Ozs7Y0FJbkQ7Y0FDQSxJQUFJLE1BQU0sT0FBUTtRQUNwQixhQUFTLEtBQUssVUFBVTtRQUN4QixpQkFBYSxLQUFLLFVBQVUsT0FBUSxLQUFNLElBQUssS0FBTSxNQUFPO1FBQzVELGVBQVcsS0FBSyxVQUFVO2dCQUUxQixTQUFZO2dCQUNaLE9BQU8sS0FBUTtnQkFDZixPQUFPLE9BQU8sS0FBSyxJQUFJLFNBQVcsS0FBSyxLQUFLOzs7O1FBSTVDLGNBQVUsS0FBSztRQUNmLGNBQVUsS0FBSztnQkFFZixVQUFTLE1BQVM7Z0JBQ2xCLE1BQU0sT0FBVTtnQkFFaEIsVUFBUyxLQUFLLEtBQUssSUFBTzs7Ozs7OztRQUsxQixjQUFXLEtBQUs7UUFDaEIsUUFBUyxNQUFNLEtBQUssTUFBTSxJQUFJLE1BQU0sSUFBSztRQUN6QyxlQUFXLEtBQUs7UUFDaEIsWUFBVyxLQUFLO1FBQ2hCLGFBQVcsS0FBSzs7O2tCQUdWLElBQUksTUFBTSxNQUFPO1lBQ25CLGFBQVUsS0FBSztZQUNmLGNBQVUsS0FBSztZQUNmLGNBQVUsS0FBSztZQUNmLGNBQVUsS0FBSzs7OztrQkFFYixJQUFJLE9BQU87O2dCQUVqQixPQUFPLE9BQVU7Z0JBQ2pCLFNBQVEsT0FBUztnQkFDakIsTUFBaUI7Z0JBQ2pCLE1BQWlCOzs7O2dCQUlqQixLQUFpQjtnQkFDakIsTUFBaUI7dUJBQ2pCLEtBQUssd0JBQW1COzs7O1FBSXhCLGNBQVUsS0FBSztnQkFFZixNQUFNLFNBQVMsRUFBSTtnQkFDbkIsTUFBTSxpQkFBUTs7bUJBQU0sRUFBRSxTQUFTO1dBQVUsT0FBUzs7OztnQkFJbEQsS0FBSyxZQUFZLFNBQVMsZ0JBQWtCOzs7O2dCQUk1QyxLQUFLLEtBQUssU0FBUSxLQUFLLEtBQUssS0FBUTtnQkFDcEMsS0FBSyxLQUFLLFNBQVEsS0FBSyxLQUFLLEtBQVE7Z0JBQ3BDLEtBQUssS0FBSyxJQUFJLE9BQVUifQ==
//# sourceURL=../../../kode/konrad/test/knrd.kode
