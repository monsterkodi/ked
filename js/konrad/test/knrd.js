var toExport = {}
var absent, afterDirish, afterHand, afterKept, afterNo, afterStray, away, back, bad, before, cache, cjfile, cjfile2, cjtext, cjtext2, ckache, ckfile, ckfile2, cksrc, cktext, cktext2, cktgt, compiledNo, cur, dirs, dirText, fpA, fpB, fpOne, fpTwo, fromCwd, gone1, goneJsText, goneNoText, healed, healedOk, hereText, isFile, jdir, jp, junk, junkList, junkMap, kdir, kept, keptOk, kp, mapHereText, mapped, merged, mergedOk, more, noCache, nothing, nowhere, oneSrc, oneTgt, opt, otherKode, partial, relAway, root, srcMoved, stamped, stillA, stillB, strayText, tgtGone, tgtMoved, wholeBack, wholesale, write, wrote

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
await nfs.remove(root)
await nfs.mkdir(jdir)
await nfs.mkdir(kdir)
await nfs.write(kp('here.kode'),'x = 1\n')
await write('kept.js',hereText)
await write('stale.js',goneJsText)
await write('hand.js','export default {}\n')
await write('stale.json',goneNoText)
opt = {srcDir:kdir,quiet:true}
dirs = [jdir]
gone1 = await knrd.reconcile(dirs,opt)
afterKept = await isFile(jp('kept.js'))
afterHand = await isFile(jp('hand.js'))
nothing = await knrd.reconcile(dirs,opt)
nowhere = await knrd.reconcile([slash.path(root,'nowhere')],opt)
away = slash.path(root,'elsewhere','here.kode')
relAway = fromCwd(away)
strayText = stamped(relAway)
await nfs.write(jp('stray.js'),strayText)
await knrd.reconcile(dirs,opt)
afterStray = await isFile(jp('stray.js'))
dirText = stamped((fromCwd(kdir)))
await nfs.write(jp('dirish.js'),dirText)
await knrd.reconcile(dirs,opt)
afterDirish = await isFile(jp('dirish.js'))
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
    await section("and the sourcemap still works on its own", async function ()
    {
        compare(knrd.stampSource(mapHereText,jp('x.js')),kp('here.kode'))
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
        compare(gone1.length,2)
    })
    await section("and it is the right two", async function ()
    {
        compare(gone1.join(' '),`${jp('stale.js')} ${jp('stale.json')}`)
    })
    await section("a generated file whose source is still there stays", async function ()
    {
        compare(afterKept,true)
    })
    await section("a file nobody generated stays", async function ()
    {
        compare(afterHand,true)
    })
    await section("a second pass has nothing to do", async function ()
    {
        compare(nothing,[])
    })
    await section("a directory that is not there is not an error", async function ()
    {
        compare(nowhere,[])
    })
    await section("the source is resolved, not guessed", async function ()
    {
        compare(afterStray,true)
    })
    await section("a stamp naming a directory is not a source", async function ()
    {
        compare(afterDirish,true)
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
await nfs.remove(cache)
await nfs.mkdir(cache)
await nfs.write(ckfile,cktext)
await nfs.write(cjfile,cjtext)
await nfs.write(ckfile2,cktext2)
await nfs.write(cjfile2,cjtext2)
await nfs.remove(ckache)
wrote = await knrd.saveCache(ckache,null,fpA,true,cksrc,cktgt)
back = await knrd.loadCache(ckache)
absent = await knrd.loadCache(slash.path(cache,'nowhere'))
await nfs.write(ckache,'- not a cache at all\n')
junkList = await knrd.loadCache(ckache)
await nfs.write(ckache,'kode   not\n\tsource\n')
junkMap = await knrd.loadCache(ckache)
await nfs.remove(ckache)
await knrd.saveCache(ckache,null,fpA,true,cksrc,cktgt)
back = await knrd.loadCache(ckache)
cur = await knrd.isCurrent(back,ckfile,cjfile,cktext)
srcMoved = await knrd.isCurrent(back,ckfile,cjfile,'x = 2\n')
await nfs.write(cjfile,'var x = 2;\n')
tgtMoved = await knrd.isCurrent(back,ckfile,cjfile,cktext)
await nfs.write(cjfile,cjtext)
await nfs.remove(cjfile)
tgtGone = await knrd.isCurrent(back,ckfile,cjfile,cktext)
await nfs.write(cjfile,cjtext)
noCache = await knrd.isCurrent(null,ckfile,cjfile,cktext)
before = await nfs.read(ckache)
compiledNo = await knrd.saveCache(ckache,back,fpA,true,{},{})
afterNo = await nfs.read(ckache)
otherKode = await knrd.saveCache(ckache,back,fpB,true,cksrc,cktgt)
stillA = await knrd.loadCache(ckache)
more = {}
more[knrd.rel(ckfile)] = 'cccccccccccccccccccccccccccccccccccccccc'
mergedOk = await knrd.saveCache(ckache,back,fpA,true,more,cktgt)
merged = await knrd.loadCache(ckache)
wholesale = await knrd.saveCache(ckache,merged,fpB,true,cksrc,cktgt,true)
wholeBack = await knrd.loadCache(ckache)
partial = await knrd.saveCache(ckache,wholeBack,fpA,true,cksrc,cktgt,false)
stillB = await knrd.loadCache(ckache)
oneSrc = {}
oneSrc[knrd.rel(ckfile)] = cksrc[knrd.rel(ckfile)]
oneTgt = {}
oneTgt[knrd.rel(cjfile)] = cktgt[knrd.rel(cjfile)]
keptOk = await knrd.saveCache(ckache,stillB,fpB,true,oneSrc,oneTgt,true)
kept = await knrd.loadCache(ckache)
await nfs.write(ckache,'- not a cache at all\n')
junk = await knrd.loadCache(ckache)
healedOk = await knrd.saveCache(ckache,junk,fpA,true,cksrc,cktgt)
healed = await knrd.loadCache(ckache)
fpOne = await knrd.fingerprint()
fpTwo = await knrd.fingerprint()
toExport["cache"] = async function ()
{
    await section("it round trips through noon", async function ()
    {
        compare(wrote,true)
        compare(back.kode,fpA)
        compare(back.srcmap,true)
        compare(back.source[knrd.rel(ckfile)],knrd.hash(cktext))
        compare(back.target[knrd.rel(cjfile)],knrd.hash(cjtext))
    })
    await section("a file that is not there is not a cache", async function ()
    {
        compare(absent,null)
    })
    await section("rubbish that still parses is not a cache either", async function ()
    {
        compare(knrd.shaped(junkList),false)
        compare(knrd.shaped(junkMap),false)
        compare(knrd.usable(junkMap,fpA,true),false)
    })
    await section("the header is the compiler and the sourcemap, and it needs both", async function ()
    {
        compare(knrd.usable(back,fpA,true),true)
        compare(knrd.usable(back,fpB,true),false)
        compare(knrd.usable(back,fpA,false),false)
        compare(knrd.usable(null,fpA,true),false)
        compare(knrd.usable({},fpA,true),false)
    })
    await section("current means the source and what is on disk both still match", async function ()
    {
        compare(cur,true)
    })
    await section("a source that has moved is a miss", async function ()
    {
        compare(srcMoved,false)
    })
    await section("a target that has moved is a miss", async function ()
    {
        compare(tgtMoved,false)
    })
    await section("a target that is not there is a miss", async function ()
    {
        compare(tgtGone,false)
    })
    await section("and no cache at all is a miss", async function ()
    {
        compare(noCache,false)
    })
    await section("a build that compiled nothing writes nothing", async function ()
    {
        compare(compiledNo,false)
        compare(afterNo,before)
    })
    await section("a partial build does not write over a cache from another compiler", async function ()
    {
        compare(otherKode,false)
        compare(stillA.kode,fpA)
    })
    await section("and one that can, merges rather than replaces", async function ()
    {
        compare(mergedOk,true)
        compare(merged.source[knrd.rel(ckfile)],more[knrd.rel(ckfile)])
        compare(merged.target[knrd.rel(cjfile)],knrd.hash(cjtext))
    })
    await section("and a whole build can replace a cache from another compiler", async function ()
    {
        compare(wholesale,true)
        compare(wholeBack.kode,fpB)
        compare(wholeBack.source[knrd.rel(ckfile)],knrd.hash(cktext))
    })
    await section("but a partial one cannot, or the files it never looked at go on", async function ()
    {
    })
    await section("being marked current under a compiler they were never built with", async function ()
    {
        compare(partial,false)
        compare(stillB.kode,fpB)
    })
    await section("and a whole build adds to the cache rather than replacing it, or the", async function ()
    {
    })
    await section("files it did not compile lose their entry and the next build has to", async function ()
    {
    })
    await section("rebuild the tree to write them back", async function ()
    {
        compare(keptOk,true)
        compare(kept.source[knrd.rel(ckfile)],cksrc[knrd.rel(ckfile)])
        compare(kept.source[knrd.rel(ckfile2)],cksrc[knrd.rel(ckfile2)])
        compare(kept.target[knrd.rel(cjfile)],cktgt[knrd.rel(cjfile)])
        compare(kept.target[knrd.rel(cjfile2)],cktgt[knrd.rel(cjfile2)])
    })
    await section("but rubbish is replaced, or it would wedge the build for good", async function ()
    {
        compare(healedOk,true)
        compare(healed.kode,fpA)
        compare(healed.source[knrd.rel(ckfile)],knrd.hash(cktext))
    })
    await section("the fingerprint is a digest of the compiler, and it does not move", async function ()
    {
        compare(fpOne === fpTwo,true)
        compare(fpOne.length,40)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb25yYWQvdGVzdC9rbnJkLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQVdBOzs0Q0FBa0Q7OztBQUVsRDs7OztJQUVJLE9BQU8sS0FBSyxXQUFXLFNBQVMsS0FBSyxTQUFTO0lBQzlDLE1BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxTQUFTO3lFQUNxQjs7QUFFbEUsT0FBTztBQUVQLE9BQU8sTUFBTSxLQUFLLEtBQU07QUFDeEIsT0FBTyxNQUFNLEtBQUssS0FBTTs7QUFFeEI7O1dBQWEsTUFBTSxLQUFLLEtBQU07OztBQUM5Qjs7V0FBYSxNQUFNLEtBQUssS0FBTTs7O0FBRTlCOzs7O0lBRUksY0FBVSxJQUFJLE9BQU87WUFDckIsUUFBUSxPQUFPOzs7QUFFbkI7O1dBQWUsTUFBTSxTQUFTLEVBQUcsUUFBUTs7QUFFekMsV0FBYSxTQUFTLFFBQVEsR0FBRztBQUNqQyxhQUFhLFNBQVMsUUFBUSxHQUFHO0FBQ2pDLGFBQWEsU0FBUyxRQUFRLEdBQUc7QUFFakMsY0FBYyxPQUFPOztBQUVyQjs7V0FBb0IsSUFBSSxNQUFNLEdBQUcsS0FBSzs7TUFFcEMsSUFBSSxPQUFPO01BQ1gsSUFBSSxNQUFPO01BQ1gsSUFBSSxNQUFPO01BQ1gsSUFBSSxNQUFPLEdBQUcsYUFBYTtNQUUzQixNQUFNLFVBQVU7TUFDaEIsTUFBTSxXQUFXO01BQ2pCLE1BQU0sVUFBVTtNQUNoQixNQUFNLGFBQWE7QUFFckIsT0FBUSxPQUFPLEtBQUssTUFBTTtBQUMxQixRQUFRO0FBRVIsY0FBVSxLQUFLLFVBQVUsS0FBSztBQUU5QixrQkFBYyxPQUFPLEdBQUc7QUFDeEIsa0JBQWMsT0FBTyxHQUFHO0FBRXhCLGdCQUFZLEtBQUssVUFBVSxLQUFLO0FBQ2hDLGdCQUFZLEtBQUssV0FBVyxNQUFNLEtBQUssS0FBSyxZQUFZO0FBRXhELE9BQVcsTUFBTSxLQUFLLEtBQUssWUFBWTtBQUN2QyxVQUFXLFFBQVE7QUFDbkIsWUFB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
//# sourceURL=file://kode/konrad/test/knrd.kode
