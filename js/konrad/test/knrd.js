var toExport = {}
var absent, afterDirish, afterHand, afterKept, afterNo, afterStray, away, back, bad, before, cache, cjfile, cjtext, ckache, ckfile, cksrc, cktext, cktgt, compiledNo, cur, dirs, dirText, fpA, fpB, fpOne, fpTwo, fromCwd, gone1, goneJsText, goneNoText, healed, healedOk, hereText, isFile, jdir, jp, junk, junkList, junkMap, kdir, kp, mapHereText, mapped, merged, mergedOk, more, noCache, nothing, nowhere, opt, otherKode, relAway, root, srcMoved, stamped, stillA, strayText, tgtGone, tgtMoved, write, wrote

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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb25yYWQvdGVzdC9rbnJkLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQXNCQTs7NENBQWtEOzs7QUFFbEQ7Ozs7SUFFSSxPQUFPLEtBQUssV0FBVyxTQUFTLEtBQUssU0FBUztJQUM5QyxNQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsU0FBUzt5RUFDcUI7O0FBRWxFLE9BQU87QUFFUCxPQUFPLE1BQU0sS0FBSyxLQUFNO0FBQ3hCLE9BQU8sTUFBTSxLQUFLLEtBQU07O0FBRXhCOztXQUFhLE1BQU0sS0FBSyxLQUFNOzs7QUFDOUI7O1dBQWEsTUFBTSxLQUFLLEtBQU07OztBQUU5Qjs7OztJQUVJLGNBQVUsSUFBSSxPQUFPO1lBQ3JCLFFBQVEsT0FBTzs7O0FBRW5COztXQUFlLE1BQU0sU0FBUyxFQUFHLFFBQVE7O0FBRXpDLFdBQWEsU0FBUyxRQUFRLEdBQUc7QUFDakMsYUFBYSxTQUFTLFFBQVEsR0FBRztBQUNqQyxhQUFhLFNBQVMsUUFBUSxHQUFHO0FBRWpDLGNBQWMsT0FBTzs7QUFFckI7O1dBQW9CLElBQUksTUFBTSxHQUFHLEtBQUs7O01BRXBDLElBQUksT0FBTztNQUNYLElBQUksTUFBTztNQUNYLElBQUksTUFBTztNQUNYLElBQUksTUFBTyxHQUFHLGFBQWE7TUFFM0IsTUFBTSxVQUFVO01BQ2hCLE1BQU0sV0FBVztNQUNqQixNQUFNLFVBQVU7TUFDaEIsTUFBTSxhQUFhO0FBRXJCLE9BQVEsT0FBTyxLQUFLLE1BQU07QUFDMUIsUUFBUTtBQUVSLGNBQVUsS0FBSyxVQUFVLEtBQUs7QUFFOUIsa0JBQWMsT0FBTyxHQUFHO0FBQ3hCLGtCQUFjLE9BQU8sR0FBRztBQUV4QixnQkFBWSxLQUFLLFVBQVUsS0FBSztBQUNoQyxnQkFBWSxLQUFLLFdBQVcsTUFBTSxLQUFLLEtBQUssWUFBWTtBQUV4RCxPQUFXLE1BQU0sS0FBSyxLQUFLLFlBQVk7QUFDdkMsVUFBVyxRQUFRO0FBQ25CLFlBQVksUUFBUTtNQUNsQixJQUFJLE1BQU0sR0FBRyxZQUFZO01BQ3pCLEtBQUssVUFBVSxLQUFLO0FBQ3RCLG1CQUFlLE9BQU8sR0FBRztBQUV6QixVQUFVLFNBQVMsUUFBUTtNQUN6QixJQUFJLE1BQU0sR0FBRyxhQUFhO01BQzFCLEtBQUssVUFBVSxLQUFLO0FBQ3RCLG9CQUFnQixPQUFPLEdBQUc7Ozs7O2dCQU1sQixLQUFLLFlBQVksY0FBZSxNQUFROzs7O2dCQUl4QyxLQUFLLFlBQVksc0JBQXVCLE1BQVE7Ozs7Z0JBSWhELEtBQUssWUFBWSxTQUFVLE1BQVEsR0FBRzs7OztnQkFJdEMsS0FBSyxZQUFZLFlBQWEsR0FBRyxTQUFXLEdBQUc7Ozs7Z0JBSS9DLEtBQUssWUFBWSwwREFBMkQsTUFBUTs7OztRQUlwRixNQUFNO2dCQUNOLEtBQUssWUFBWSxJQUFLLE1BQVE7Ozs7Ozs7O2dCQU05QixNQUFNLE9BQVU7Ozs7Z0JBSWhCLE1BQU0sS0FBSyxRQUFVLEdBQUcsZUFBZSxHQUFHOzs7O2dCQUkxQyxVQUFhOzs7O2dCQUliLFVBQWE7Ozs7Z0JBSWI7Ozs7Z0JBSUE7Ozs7Z0JBSUEsV0FBYzs7OztnQkFJZCxZQUFlOzs7O0FBU3ZCLFFBQVEsTUFBTSxLQUFLLEtBQU07QUFFekIsU0FBUyxNQUFNLEtBQUssTUFBTztBQUMzQixTQUFTLE1BQU0sS0FBSyxNQUFPO0FBQzNCLFNBQVMsTUFBTSxLQUFLLE1BQU87QUFFM0IsU0FBUztBQUNULFNBQVM7QUFFVCxNQUFNO0FBQ04sTUFBTTtBQUVOO0FBQ0EsTUFBTSxLQUFLLElBQUksV0FBVSxLQUFLLEtBQUs7QUFFbkM7QUFDQSxNQUFNLEtBQUssSUFBSSxXQUFVLEtBQUssS0FBSztNQUVqQyxJQUFJLE9BQU87TUFDWCxJQUFJLE1BQU87TUFDWCxJQUFJLE1BQU8sT0FBTztNQUNsQixJQUFJLE1BQU8sT0FBTztNQUNsQixJQUFJLE9BQU87QUFJYixjQUFZLEtBQUssVUFBVSxPQUFRLEtBQU0sSUFBSyxLQUFNLE1BQU87QUFDM0QsYUFBWSxLQUFLLFVBQVU7QUFDM0IsZUFBWSxLQUFLLFVBQVUsTUFBTSxLQUFLLE1BQU07TUFLMUMsSUFBSSxNQUFNLE9BQVE7QUFDcEIsaUJBQWEsS0FBSyxVQUFVO01BRTFCLElBQUksTUFBTSxPQUFRO0FBQ3BCLGdCQUFhLEtBQUssVUFBVTtNQUUxQixJQUFJLE9BQU87TUFDWCxLQUFLLFVBQVUsT0FBUSxLQUFNLElBQUssS0FBTSxNQUFPO0FBQ2pELGFBQVMsS0FBSyxVQUFVO0FBSXhCLFlBQWEsS0FBSyxVQUFVLEtBQU0sT0FBUSxPQUFRO0FBQ2xELGlCQUFhLEtBQUssVUFBVSxLQUFNLE9BQVEsT0FBUTtNQUVoRCxJQUFJLE1BQU0sT0FBUTtBQUNwQixpQkFBYSxLQUFLLFVBQVUsS0FBTSxPQUFRLE9BQVE7TUFFaEQsSUFBSSxNQUFNLE9BQU87TUFDakIsSUFBSSxPQUFPO0FBQ2IsZ0JBQWEsS0FBSyxVQUFVLEtBQU0sT0FBUSxPQUFRO01BRWhELElBQUksTUFBTSxPQUFPO0FBQ25CLGdCQUFhLEtBQUssVUFBVSxLQUFPLE9BQVEsT0FBUTtBQUtuRCxlQUFlLElBQUksS0FBSztBQUN4QixtQkFBZSxLQUFLLFVBQVUsT0FBUSxLQUFNLElBQUs7QUFDakQsZ0JBQWUsSUFBSSxLQUFLO0FBRXhCLGtCQUFlLEtBQUssVUFBVSxPQUFRLEtBQU0sSUFBSyxLQUFNLE1BQU87QUFDOUQsZUFBZSxLQUFLLFVBQVU7QUFJOUI7QUFDQSxLQUFLLEtBQUssSUFBSSxXQUFVO0FBRXhCLGlCQUFhLEtBQUssVUFBVSxPQUFRLEtBQU0sSUFBSyxLQUFNLEtBQU07QUFDM0QsZUFBYSxLQUFLLFVBQVU7TUFLMUIsSUFBSSxNQUFNLE9BQVE7QUFDcEIsYUFBWSxLQUFLLFVBQVU7QUFDM0IsaUJBQWEsS0FBSyxVQUFVLE9BQVEsS0FBTSxJQUFLLEtBQU0sTUFBTztBQUM1RCxlQUFhLEtBQUssVUFBVTtBQUU1QixjQUFVLEtBQUs7QUFDZixjQUFVLEtBQUs7Ozs7O2dCQU1QLE1BQVU7Z0JBQ1YsS0FBSyxLQUFPO2dCQUNaLEtBQUssT0FBUztnQkFDZCxLQUFLLE9BQU8sS0FBSyxJQUFJLFNBQVUsS0FBSyxLQUFLO2dCQUN6QyxLQUFLLE9BQU8sS0FBSyxJQUFJLFNBQVUsS0FBSyxLQUFLOzs7O2dCQUl6QyxPQUFVOzs7O2dCQUlWLEtBQUssT0FBTyxVQUFZO2dCQUN4QixLQUFLLE9BQU8sU0FBWTtnQkFDeEIsS0FBSyxPQUFPLFFBQVMsSUFBSyxNQUFROzs7O2dCQUlsQyxLQUFLLE9BQU8sS0FBTSxJQUFLLE1BQVM7Z0JBQ2hDLEtBQUssT0FBTyxLQUFNLElBQUssTUFBUztnQkFDaEMsS0FBSyxPQUFPLEtBQU0sSUFBSyxPQUFTO2dCQUNoQyxLQUFLLE9BQU8sS0FBTyxJQUFLLE1BQVM7Z0JBQ2pDLEtBQUssVUFBYSxJQUFLLE1BQVM7Ozs7Z0JBSWhDLElBQU87Ozs7Z0JBSVAsU0FBWTs7OztnQkFJWixTQUFZOzs7O2dCQUlaLFFBQVc7Ozs7Z0JBSVgsUUFBVzs7OztnQkFJWCxXQUFjO2dCQUNkLFFBQWM7Ozs7Z0JBSWQsVUFBaUI7Z0JBQ2pCLE9BQU8sS0FBVTs7OztnQkFJakIsU0FBWTtnQkFDWixPQUFPLE9BQU8sS0FBSyxJQUFJLFNBQVcsS0FBSyxLQUFLLElBQUk7Z0JBQ2hELE9BQU8sT0FBTyxLQUFLLElBQUksU0FBVSxLQUFLLEtBQUs7Ozs7Z0JBSTNDLFNBQVk7Z0JBQ1osT0FBTyxLQUFRO2dCQUNmLE9BQU8sT0FBTyxLQUFLLElBQUksU0FBVyxLQUFLLEtBQUs7Ozs7Z0JBSTVDLFVBQVMsTUFBUztnQkFDbEIsTUFBTSxPQUFVOzs7O2dCQUloQixLQUFLLFlBQVksU0FBUyxnQkFBa0I7Ozs7Z0JBSTVDLEtBQUssS0FBSyxTQUFRLEtBQUssS0FBSyxLQUFRO2dCQUNwQyxLQUFLLEtBQUssU0FBUSxLQUFLLEtBQUssS0FBUTtnQkFDcEMsS0FBSyxLQUFLLElBQUksT0FBVSJ9
//# sourceURL=file://kode/konrad/test/knrd.kode
