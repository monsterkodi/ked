var toExport = {}
var afterDirish, afterHand, afterKept, afterStray, away, bad, dirs, dirText, fromCwd, gone1, goneJsText, goneNoText, hereText, isFile, jdir, jp, kdir, kp, mapHereText, mapped, nothing, nowhere, opt, relAway, root, stamped, strayText, write

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
opt = {srcDir:kdir}
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
    section("a hand written file is not a candidate however empty it is", function ()
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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb25yYWQvdGVzdC9rbnJkLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQXVCQTs7NENBQWtEOzs7QUFFbEQ7Ozs7SUFFSSxPQUFPLEtBQUssV0FBVyxTQUFTLEtBQUssU0FBUztJQUM5QyxNQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsU0FBUzt5RUFDcUI7O0FBTWxFLE9BQU87QUFFUCxPQUFPLE1BQU0sS0FBSyxLQUFNO0FBQ3hCLE9BQU8sTUFBTSxLQUFLLEtBQU07O0FBRXhCOztXQUFhLE1BQU0sS0FBSyxLQUFNOzs7QUFDOUI7O1dBQWEsTUFBTSxLQUFLLEtBQU07OztBQUs5Qjs7OztJQUVJLGNBQVUsSUFBSSxPQUFPO1lBQ3JCLFFBQVEsT0FBTzs7O0FBTW5COztXQUFlLE1BQU0sU0FBUyxFQUFHLFFBQVE7O0FBRXpDLFdBQWEsU0FBUyxRQUFRLEdBQUc7QUFDakMsYUFBYSxTQUFTLFFBQVEsR0FBRztBQUNqQyxhQUFhLFNBQVMsUUFBUSxHQUFHO0FBS2pDLGNBQWMsT0FBTzs7QUFFckI7O1dBQW9CLElBQUksTUFBTSxHQUFHLEtBQUs7O01BRXBDLElBQUksT0FBTztNQUNYLElBQUksTUFBTztNQUNYLElBQUksTUFBTztNQUNYLElBQUksTUFBTyxHQUFHLGFBQWE7TUFHM0IsTUFBTSxVQUFVO01BR2hCLE1BQU0sV0FBVztNQUdqQixNQUFNLFVBQVU7TUFHaEIsTUFBTSxhQUFhO0FBRXJCLE9BQVEsT0FBTztBQUNmLFFBQVE7QUFFUixjQUFVLEtBQUssVUFBVSxLQUFLO0FBRTlCLGtCQUFjLE9BQU8sR0FBRztBQUN4QixrQkFBYyxPQUFPLEdBQUc7QUFHeEIsZ0JBQVksS0FBSyxVQUFVLEtBQUs7QUFHaEMsZ0JBQVksS0FBSyxXQUFXLE1BQU0sS0FBSyxLQUFLLFlBQVk7QUFLeEQsT0FBVyxNQUFNLEtBQUssS0FBSyxZQUFZO0FBQ3ZDLFVBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7TUFDbEIsSUFBSSxNQUFNLEdBQUcsWUFBWTtNQUN6QixLQUFLLFVBQVUsS0FBSztBQUN0QixtQkFBZSxPQUFPLEdBQUc7QUFHekIsVUFBVSxTQUFTLFFBQVE7TUFDekIsSUFBSSxNQUFNLEdBQUcsYUFBYTtNQUMxQixLQUFLLFVBQVUsS0FBSztBQUN0QixvQkFBZ0IsT0FBTyxHQUFHOzs7OztnQkFNbEIsS0FBSyxZQUFZLGNBQWUsTUFBUTs7OztnQkFJeEMsS0FBSyxZQUFZLHNCQUF1QixNQUFROzs7O2dCQVNoRCxLQUFLLFlBQVksU0FBVSxNQUFRLEdBQUc7Ozs7Z0JBT3RDLEtBQUssWUFBWSxZQUFhLEdBQUcsU0FBVyxHQUFHOzs7O2dCQUkvQyxLQUFLLFlBQVksMERBQTJELE1BQVE7Ozs7UUFJcEYsTUFBTTtnQkFDTixLQUFLLFlBQVksSUFBSyxNQUFROzs7Ozs7OztnQkFNOUIsTUFBTSxPQUFVOzs7O2dCQUloQixNQUFNLEtBQUssUUFBVSxHQUFHLGVBQWUsR0FBRzs7OztnQkFJMUMsVUFBYTs7OztnQkFJYixVQUFhOzs7O2dCQUliOzs7O2dCQUlBOzs7O2dCQUlBLFdBQWM7Ozs7Z0JBSWQsWUFBZSJ9
//# sourceURL=file://kode/konrad/test/knrd.kode
