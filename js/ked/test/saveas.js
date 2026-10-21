var toExport = {}
var dir, h, idx, saved, v

import fs from "fs"
import os from "os"
import path from "path"

import kxk from "../../kxk.js"
let post = kxk.post
let sleep = kxk.sleep

import harness from "../util/harness.js"

import saveas from "../view/colmns/saveas.js"

dir = fs.mkdtempSync(path.join(os.tmpdir(),'ked-saveas-'))
fs.writeFileSync(path.join(dir,'one.txt'),'one')
fs.writeFileSync(path.join(dir,'two.txt'),'two')
fs.mkdirSync(path.join(dir,'sub'))
saved = null
post.on('file.saveas',function (path)
{
    return saved = path
})
toExport["saveas"] = async function ()
{
    await section("the field is there and it has the focus", async function ()
    {
        h = new harness
        v = new saveas(h.screen)
        await v.open(dir,'one.txt')
        compare(v.input.visible(),true)
        compare(v.input.hasFocus(),true)
        compare(v.input.current(),'one.txt')
    })
    await section("the list is not filtered", async function ()
    {
        h = new harness
        v = new saveas(h.screen)
        await v.open(dir,'')
        h.focus(v.input)
        h.type(v,'one')
        compare(v.input.current(),'one')
        compare(v.choices.numFiltered(),4)
    })
    await section("the tree puts the name of the file it is on into the field", async function ()
    {
        h = new harness
        v = new saveas(h.screen)
        await v.open(dir,'')
        h.focus(v.input)
        idx = v.choices.items.findIndex(function (i)
        {
            return i.file === 'two.txt'
        })
        v.choices.select(idx)
        compare(v.input.current(),'two.txt')
    })
    await section("a name that is typed is the name of the user", async function ()
    {
        h = new harness
        v = new saveas(h.screen)
        await v.open(dir,'')
        h.focus(v.input)
        h.type(v,'mine')
        h.key(v,'down')
        compare(v.input.current(),'mine')
    })
    await section("the file is written where the field says", async function ()
    {
        h = new harness
        v = new saveas(h.screen)
        await v.open(dir,'')
        h.focus(v.input)
        h.type(v,'mine.txt')
        saved = null
        h.key(v,'return')
        compare(saved,path.join(dir,'mine.txt'))
    })
    await section("a name that is a path is a path", async function ()
    {
        h = new harness
        v = new saveas(h.screen)
        await v.open(dir,'')
        h.focus(v.input)
        h.type(v,'sub/mine.txt')
        compare(v.targetPath('sub/mine.txt'),path.join(dir,'sub','mine.txt'))
        compare(v.targetPath('/tmp/mine.txt'),'/tmp/mine.txt')
    })
    await section("the dialog is gone when it is done", async function ()
    {
        h = new harness
        v = new saveas(h.screen)
        await v.open(dir,'')
        h.focus(v.input)
        h.type(v,'mine.txt')
        h.key(v,'return')
        compare(v.hidden(),true)
    })
}
toExport["saveas"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3NhdmVhcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxNQUFNLEdBQUcsWUFBWSxLQUFLLEtBQUssR0FBRyxTQUFVO0FBRTVDLEdBQUcsY0FBYyxLQUFLLEtBQUssSUFBSyxXQUFZO0FBQzVDLEdBQUcsY0FBYyxLQUFLLEtBQUssSUFBSyxXQUFZO0FBQzVDLEdBQUcsVUFBVSxLQUFLLEtBQUssSUFBSztBQUk1QixRQUFRO0FBRVIsS0FBSyxHQUFHOztXQUF3QixRQUFROzs7Ozs7UUFNaEMsUUFBUTtRQUNSLFFBQVEsT0FBTyxFQUFFO2NBRWYsRUFBRSxLQUFLLElBQUs7Z0JBRWQsRUFBRSxNQUFNLFVBQVk7Z0JBQ3BCLEVBQUUsTUFBTSxXQUFhO2dCQUNyQixFQUFFLE1BQU0sVUFBWTs7OztRQUlwQixRQUFRO1FBQ1IsUUFBUSxPQUFPLEVBQUU7Y0FFZixFQUFFLEtBQUssSUFBSztRQUVkLEVBQUUsTUFBTSxFQUFFO1FBQ1YsRUFBRSxLQUFLLEVBQUU7Z0JBRVQsRUFBRSxNQUFNLFVBQVk7Z0JBQ3BCLEVBQUUsUUFBUSxjQUFnQjs7OztRQUkxQixRQUFRO1FBQ1IsUUFBUSxPQUFPLEVBQUU7Y0FFZixFQUFFLEtBQUssSUFBSztRQUVkLEVBQUUsTUFBTSxFQUFFO1FBRVYsTUFBTSxFQUFFLFFBQVEsTUFBTTs7bUJBQWlCLEVBQUUsU0FBUTs7UUFDakQsRUFBRSxRQUFRLE9BQU87Z0JBRWpCLEVBQUUsTUFBTSxVQUFZOzs7O1FBSXBCLFFBQVE7UUFDUixRQUFRLE9BQU8sRUFBRTtjQUVmLEVBQUUsS0FBSyxJQUFLO1FBRWQsRUFBRSxNQUFNLEVBQUU7UUFDVixFQUFFLEtBQUssRUFBRTtRQUVULEVBQUUsSUFBSSxFQUFFO2dCQUVSLEVBQUUsTUFBTSxVQUFZOzs7O1FBSXBCLFFBQVE7UUFDUixRQUFRLE9BQU8sRUFBRTtjQUVmLEVBQUUsS0FBSyxJQUFLO1FBRWQsRUFBRSxNQUFNLEVBQUU7UUFDVixFQUFFLEtBQUssRUFBRTtRQUVULFFBQVE7UUFFUixFQUFFLElBQUksRUFBRTtnQkFFUixNQUFRLEtBQUssS0FBSyxJQUFLOzs7O1FBSXZCLFFBQVE7UUFDUixRQUFRLE9BQU8sRUFBRTtjQUVmLEVBQUUsS0FBSyxJQUFLO1FBRWQsRUFBRSxNQUFNLEVBQUU7UUFDVixFQUFFLEtBQUssRUFBRTtnQkFFVCxFQUFFLFdBQVcsZ0JBQWlCLEtBQUssS0FBSyxJQUFLLE1BQU87Z0JBQ3BELEVBQUUsV0FBVyxpQkFBa0I7Ozs7UUFJL0IsUUFBUTtRQUNSLFFBQVEsT0FBTyxFQUFFO2NBRWYsRUFBRSxLQUFLLElBQUs7UUFFZCxFQUFFLE1BQU0sRUFBRTtRQUNWLEVBQUUsS0FBSyxFQUFFO1FBRVQsRUFBRSxJQUFJLEVBQUU7Z0JBRVIsRUFBRSxTQUFXIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/saveas.kode
