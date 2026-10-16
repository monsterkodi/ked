var toExport = {}
var afterDirish, afterHand, afterKept, afterStray, dirs, dirText, gone1, goneJsText, goneNoText, hereText, isFile, jdir, jp, kdir, kp, nothing, nowhere, opt, root, stamped, strayText, write

import knrd from "../knrd.js"

import nfs from "../../kxk/nfs.js"
import slash from "../../kxk/slash.js"


stamped = function (src)
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
hereText = stamped('../kode/here.kode')
goneJsText = stamped('../kode/gone.kode')
goneNoText = stamped('../kode/gone.noon')

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
strayText = stamped('../../kode/here.kode')
await nfs.write(jp('stray.js'),strayText)
await knrd.reconcile(dirs,opt)
afterStray = await isFile(jp('stray.js'))
dirText = stamped('../kode')
await nfs.write(jp('dirish.js'),dirText)
await knrd.reconcile(dirs,opt)
afterDirish = await isFile(jp('dirish.js'))
toExport["stampSource"] = function ()
{
    section("a file kode did not write has no source", function ()
    {
        compare(knrd.stampSource('var a = 1\n'),'')
    })
    section("a file kode wrote names its source, relative to itself", function ()
    {
        compare(knrd.stampSource(hereText),'../kode/here.kode')
    })
    section("a sourcemap that is not base64 is not a stamp", function ()
    {
        compare(knrd.stampSource('//# sourceMappingURL=data:application/json;base64,!!!\n'),'')
    })
    section("a map with no sources is not a stamp", function ()
    {
        compare(knrd.stampSource('//# sourceMappingURL=data:application/json;base64,eyJmb28iOiJiYXIifQ==\n'),'')
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
    section("the source is resolved against the file, not against cwd", function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25yZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb25yYWQvdGVzdC9rbnJkLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQWtCQTs7OztJQUVJLE9BQU8sS0FBSyxXQUFXLFNBQVMsS0FBSyxTQUFTO0lBQzlDLE1BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxTQUFTO3lFQUNxQjs7QUFNbEUsT0FBTztBQUVQLE9BQU8sTUFBTSxLQUFLLEtBQU07QUFDeEIsT0FBTyxNQUFNLEtBQUssS0FBTTs7QUFFeEI7O1dBQWEsTUFBTSxLQUFLLEtBQU07OztBQUM5Qjs7V0FBYSxNQUFNLEtBQUssS0FBTTs7O0FBSzlCOzs7O0lBRUksY0FBVSxJQUFJLE9BQU87WUFDckIsUUFBUSxPQUFPOztBQUVuQixXQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTs7QUFFckI7O1dBQW9CLElBQUksTUFBTSxHQUFHLEtBQUs7O01BRXBDLElBQUksT0FBTztNQUNYLElBQUksTUFBTztNQUNYLElBQUksTUFBTztNQUNYLElBQUksTUFBTyxHQUFHLGFBQWE7TUFHM0IsTUFBTSxVQUFVO01BR2hCLE1BQU0sV0FBVztNQUdqQixNQUFNLFVBQVU7TUFHaEIsTUFBTSxhQUFhO0FBRXJCLE9BQVEsT0FBTztBQUNmLFFBQVE7QUFFUixjQUFVLEtBQUssVUFBVSxLQUFLO0FBRTlCLGtCQUFjLE9BQU8sR0FBRztBQUN4QixrQkFBYyxPQUFPLEdBQUc7QUFHeEIsZ0JBQVksS0FBSyxVQUFVLEtBQUs7QUFHaEMsZ0JBQVksS0FBSyxXQUFXLE1BQU0sS0FBSyxLQUFLLFlBQVk7QUFNeEQsWUFBWSxRQUFRO01BQ2xCLElBQUksTUFBTSxHQUFHLFlBQVk7TUFDekIsS0FBSyxVQUFVLEtBQUs7QUFDdEIsbUJBQWUsT0FBTyxHQUFHO0FBR3pCLFVBQVUsUUFBUTtNQUNoQixJQUFJLE1BQU0sR0FBRyxhQUFhO01BQzFCLEtBQUssVUFBVSxLQUFLO0FBQ3RCLG9CQUFnQixPQUFPLEdBQUc7Ozs7O2dCQU1sQixLQUFLLFlBQVksZUFBaUI7Ozs7Z0JBSWxDLEtBQUssWUFBWSxVQUFZOzs7O2dCQUk3QixLQUFLLFlBQVksMkRBQTZEOzs7O2dCQUk5RSxLQUFLLFlBQVksNEVBQThFOzs7Ozs7OztnQkFNL0YsTUFBTSxPQUFVOzs7O2dCQUloQixNQUFNLEtBQUssUUFBVSxHQUFHLGVBQWUsR0FBRzs7OztnQkFJMUMsVUFBYTs7OztnQkFJYixVQUFhOzs7O2dCQUliOzs7O2dCQUlBOzs7O2dCQUlBLFdBQWM7Ozs7Z0JBSWQsWUFBZSJ9
//# sourceURL=file://kode/konrad/test/knrd.kode
