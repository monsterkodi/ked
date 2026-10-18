var toExport = {}
var absent, afterDirish, afterHand, afterKept, afterNo, afterStray, away, back, bad, before, cache, cjfile, cjtext, ckache, ckfile, cksrc, cktext, cktgt, compiledNo, cur, dirs, dirText, fpA, fpB, fpOne, fpTwo, fromCwd, gone1, goneJsText, goneNoText, healed, healedOk, hereText, isFile, jdir, jp, junk, junkList, junkMap, kdir, kp, mapHereText, mapped, merged, mergedOk, more, noCache, nothing, nowhere, opt, otherKode, partial, relAway, root, srcMoved, stamped, stillA, stillB, strayText, tgtGone, tgtMoved, wholeBack, wholesale, write, wrote

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
toExport["stampSource"] = function ()
{
    section("a file kode did not write has no source", function ()
    {
        compare(knrd.stampSource('var a = 1\n',jdir),'')
    })
    section("a hand written file is not a candidate", function ()
    {
        compare(knrd.stampSource('export default {}\n',jdir),'')
    })
    section("the sourceURL is enough on its own", function ()
    {
        compare(knrd.stampSource(hereText,jdir),kp('here.kode'))
    })
    section("and the sourcemap still works on its own", function ()
    {
        compare(knrd.stampSource(mapHereText,jp('x.js')),kp('here.kode'))
    })
    section("a sourcemap that is not base64 is not a stamp", function ()
    {
        compare(knrd.stampSource('//# sourceMappingURL=data:application/json;base64,!!!\n',jdir),'')
    })
    section("a map with no sources is not a stamp", function ()
    {
        bad = '//# sourceMappingURL=data:application/json;base64,eyJmb28iOiJiYXIifQ==\n'
        compare(knrd.stampSource(bad,jdir),'')
    })
}
toExport["stampSource"]._section_ = true
toExport["reconcile"] = function ()
{
    section("what has lost its source goes, and only that", function ()
    {
        compare(gone1.length,2)
    })
    section("and it is the right two", function ()
    {
        compare(gone1.join(' '),`${jp('stale.js')} ${jp('stale.json')}`)
    })
    section("a generated file whose source is still there stays", function ()
    {
        compare(afterKept,true)
    })
    section("a file nobody generated stays", function ()
    {
        compare(afterHand,true)
    })
    section("a second pass has nothing to do", function ()
    {
        compare(nothing,[])
    })
    section("a directory that is not there is not an error", function ()
    {
        compare(nowhere,[])
    })
    section("the source is resolved, not guessed", function ()
    {
        compare(afterStray,true)
    })
    section("a stamp naming a directory is not a source", function ()
    {
        compare(afterDirish,true)
    })
}
toExport["reconcile"]._section_ = true
cache = slash.path(root,'cache')
ckfile = slash.path(cache,'x.kode')
cjfile = slash.path(cache,'x.js')
ckache = slash.path(cache,'.kkache')
cktext = 'x = 1\n'
cjtext = 'var x = 1;\n'
fpA = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
fpB = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
cksrc = {}
cksrc[knrd.rel(ckfile)] = knrd.hash(cktext)
cktgt = {}
cktgt[knrd.rel(cjfile)] = knrd.hash(cjtext)
await nfs.remove(cache)
await nfs.mkdir(cache)
await nfs.write(ckfile,cktext)
await nfs.write(cjfile,cjtext)
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
await nfs.write(ckache,'- not a cache at all\n')
junk = await knrd.loadCache(ckache)
healedOk = await knrd.saveCache(ckache,junk,fpA,true,cksrc,cktgt)
healed = await knrd.loadCache(ckache)
fpOne = await knrd.fingerprint()
fpTwo = await knrd.fingerprint()
toExport["cache"] = function ()
{
    section("it round trips through noon", function ()
    {
        compare(wrote,true)
        compare(back.kode,fpA)
        compare(back.srcmap,true)
        compare(back.source[knrd.rel(ckfile)],knrd.hash(cktext))
        compare(back.target[knrd.rel(cjfile)],knrd.hash(cjtext))
    })
    section("a file that is not there is not a cache", function ()
    {
        compare(absent,null)
    })
    section("rubbish that still parses is not a cache either", function ()
    {
        compare(knrd.shaped(junkList),false)
        compare(knrd.shaped(junkMap),false)
        compare(knrd.usable(junkMap,fpA,true),false)
    })
    section("the header is the compiler and the sourcemap, and it needs both", function ()
    {
        compare(knrd.usable(back,fpA,true),true)
        compare(knrd.usable(back,fpB,true),false)
        compare(knrd.usable(back,fpA,false),false)
        compare(knrd.usable(null,fpA,true),false)
        compare(knrd.usable({},fpA,true),false)
    })
    section("current means the source and what is on disk both still match", function ()
    {
        compare(cur,true)
    })
    section("a source that has moved is a miss", function ()
    {
        compare(srcMoved,false)
    })
    section("a target that has moved is a miss", function ()
    {
        compare(tgtMoved,false)
    })
    section("a target that is not there is a miss", function ()
    {
        compare(tgtGone,false)
    })
    section("and no cache at all is a miss", function ()
    {
        compare(noCache,false)
    })
    section("a build that compiled nothing writes nothing", function ()
    {
        compare(compiledNo,false)
        compare(afterNo,before)
    })
    section("a partial build does not write over a cache from another compiler", function ()
    {
        compare(otherKode,false)
        compare(stillA.kode,fpA)
    })
    section("and one that can, merges rather than replaces", function ()
    {
        compare(mergedOk,true)
        compare(merged.source[knrd.rel(ckfile)],more[knrd.rel(ckfile)])
        compare(merged.target[knrd.rel(cjfile)],knrd.hash(cjtext))
    })
    section("and a whole build can replace a cache from another compiler", function ()
    {
        compare(wholesale,true)
        compare(wholeBack.kode,fpB)
        compare(wholeBack.source[knrd.rel(ckfile)],knrd.hash(cktext))
    })
    section("but a partial one cannot, or the files it never looked at go on", function ()
    {
    })
    section("being marked current under a compiler they were never built with", function ()
    {
        compare(partial,false)
        compare(stillB.kode,fpB)
    })
    section("but rubbish is replaced, or it would wedge the build for good", function ()
    {
        compare(healedOk,true)
        compare(healed.kode,fpA)
        compare(healed.source[knrd.rel(ckfile)],knrd.hash(cktext))
    })
    section("the fingerprint is a digest of the compiler, and it does not move", function ()
    {
        compare(fpOne === fpTwo,true)
        compare(fpOne.length,40)
    })
    section("the cache lives beside the sources it describes", function ()
    {
        compare(knrd.cachePath().endsWith('kode/.kkache'),true)
    })
    section("hashing is hashing", function ()
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
