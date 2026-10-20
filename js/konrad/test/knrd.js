var toExport = {}
var afterNo, away, back, bad, before, built, cache, cached, cjfile, cjfile2, cjtext, cjtext2, ckache, ckfile, ckfile2, cksrc, cktext, cktext2, cktgt, compiledNo, dirs, first, fpA, fpB, fpOne, fpTwo, fromCwd, gone, goneJsText, goneNoText, healed, healedOk, hereText, isFile, jdir, jp, junk, junkList, junkMap, kdir, kept, kp, mapHereText, mapped, merged, more, nothing, nowhere, oneSrc, oneTgt, opt, other, root, setup, setupCache, stamped, still, whole, write, wrote

import knrd from "../knrd.js"

import nfs from "../../kxk/nfs.js"
import slash from "../../kxk/slash.js"


stamped = function (src)
{
    return `var a\n\n//# sourceURL=file://${src}\n`
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb25yYWQvdGVzdC9rbnJkLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQVdBOzs0Q0FBa0Q7OztBQUVsRDs7OztJQUVJLE9BQU8sS0FBSyxXQUFXLFNBQVMsS0FBSyxTQUFTO0lBQzlDLE1BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxTQUFTO3lFQUNxQjs7QUFFbEUsT0FBTztBQUVQLE9BQU8sTUFBTSxLQUFLLEtBQU07QUFDeEIsT0FBTyxNQUFNLEtBQUssS0FBTTs7QUFFeEI7O1dBQWEsTUFBTSxLQUFLLEtBQU07OztBQUM5Qjs7V0FBYSxNQUFNLEtBQUssS0FBTTs7O0FBRTlCOzs7O0lBRUksY0FBVSxJQUFJLE9BQU87WUFDckIsUUFBUSxPQUFPOzs7QUFFbkI7O1dBQWUsTUFBTSxTQUFTLEVBQUcsUUFBUTs7QUFFekMsV0FBYSxTQUFTLFFBQVEsR0FBRztBQUNqQyxhQUFhLFNBQVMsUUFBUSxHQUFHO0FBQ2pDLGFBQWEsU0FBUyxRQUFRLEdBQUc7QUFFakMsY0FBYyxPQUFPOztBQUVyQjs7V0FBb0IsSUFBSSxNQUFNLEdBQUcsS0FBSzs7QUFFdEMsT0FBUSxPQUFPLEtBQUssTUFBTTtBQUMxQixRQUFROztBQU1SOztVQUVNLElBQUksT0FBTztVQUNYLElBQUksTUFBTztVQUNYLElBQUksTUFBTztVQUNYLElBQUksTUFBTyxHQUFHLGFBQWE7VUFFM0IsTUFBTSxVQUFVO1VBQ2hCLE1BQU0sV0FBVztVQUNqQixNQUFNLFVBQVU7aUJBQ2hCLE1BQU0sYUFBYTs7Ozs7O2dCQU1qQixLQUFLLFlBQVksY0FBZSxNQUFROzs7O2dCQUl4QyxLQUFLLFlBQVksc0JBQXVCLE1BQVE7Ozs7Z0JBSWhELEtBQUssWUFBWSxTQUFVLE1BQVEsR0FBRzs7OztnQkFRdEMsS0FBSyxZQUFZLFFBQVEsR0FBRyxjQUFlLE1BQVMsR0FBRzs7OztnQkFJdkQsS0FBSyxZQUFZLFlBQWEsR0FBRyxTQUFXLEdBQUc7Ozs7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
//# sourceURL=file:///home/kodi/s/ked/kode/konrad/test/knrd.kode
