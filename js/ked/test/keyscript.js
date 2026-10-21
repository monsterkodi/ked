var toExport = {}
import keyscript from "../util/keyscript.js"

toExport["keyscript"] = async function ()
{
    await section("a word that names a key", async function ()
    {
        compare(keyscript.bytes('down'),'\x1b[B')
        compare(keyscript.bytes('up'),'\x1b[A')
        compare(keyscript.bytes('left'),'\x1b[D')
        compare(keyscript.bytes('right'),'\x1b[C')
        compare(keyscript.bytes('return'),'\r')
        compare(keyscript.bytes('space'),' ')
        compare(keyscript.bytes('esc'),'\x1b[27u')
    })
    await section("a word that names nothing is the characters it is made of", async function ()
    {
        compare(keyscript.bytes('ab'),'ab')
        compare(keyscript.bytes('a'),'a')
    })
    await section("a word can have modifiers", async function ()
    {
        compare(keyscript.bytes('cmd+o'),'\x1b[111;9u')
        compare(keyscript.bytes('ctrl+s'),'\x1b[115;5u')
        compare(keyscript.bytes('alt+r'),'\x1b[114;3u')
        compare(keyscript.bytes('shift+cmd+s'),'\x1b[115;10u')
        compare(keyscript.bytes('cmd+down'),'\x1b[1;9B')
        compare(keyscript.bytes('cmd+tab'),'\x1b[9;9u')
    })
    await section("a word that is not a modifier is not a combination", async function ()
    {
        compare(keyscript.bytes('cmd+foo'),'cmd+foo')
        compare(keyscript.bytes('o+'),'o+')
    })
    await section("an escape sequence is a sequence already", async function ()
    {
        compare(keyscript.bytes('\x1b[B'),'\x1b[B')
    })
    await section("a script is the words of it", async function ()
    {
        compare(keyscript.script('cmd+o down'),'\x1b[111;9u\x1b[B')
        compare(keyscript.script('a b'),'ab')
        compare(keyscript.script('  '),'')
    })
    await section("the steps of a script are the words of it, one by one", async function ()
    {
        compare(keyscript.steps('cmd+o down'),[['cmd+o','\x1b[111;9u'],['down','\x1b[B']])
        compare(keyscript.steps('ab'),[['ab','ab']])
        compare(keyscript.steps(''),[])
    })
}
toExport["keyscript"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5c2NyaXB0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2tleXNjcmlwdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O2dCQWNRLFVBQVUsTUFBTSxRQUFTO2dCQUN6QixVQUFVLE1BQU0sTUFBTztnQkFDdkIsVUFBVSxNQUFNLFFBQVM7Z0JBQ3pCLFVBQVUsTUFBTSxTQUFVO2dCQUMxQixVQUFVLE1BQU0sVUFBVztnQkFDM0IsVUFBVSxNQUFNLFNBQVU7Z0JBQzFCLFVBQVUsTUFBTSxPQUFROzs7O2dCQUl4QixVQUFVLE1BQU0sTUFBTztnQkFDdkIsVUFBVSxNQUFNLEtBQU07Ozs7Z0JBSXRCLFVBQVUsTUFBTSxTQUFVO2dCQUMxQixVQUFVLE1BQU0sVUFBVztnQkFDM0IsVUFBVSxNQUFNLFNBQVU7Z0JBQzFCLFVBQVUsTUFBTSxlQUFnQjtnQkFDaEMsVUFBVSxNQUFNLFlBQWE7Z0JBQzdCLFVBQVUsTUFBTSxXQUFZOzs7O2dCQUk1QixVQUFVLE1BQU0sV0FBWTtnQkFDNUIsVUFBVSxNQUFNLE1BQU87Ozs7Z0JBSXZCLFVBQVUsTUFBTSxVQUFXOzs7O2dCQUkzQixVQUFVLE9BQU8sY0FBZTtnQkFDaEMsVUFBVSxPQUFPLE9BQVE7Z0JBQ3pCLFVBQVUsT0FBTyxNQUFPOzs7O2dCQUl4QixVQUFVLE1BQU0sZ0JBQWlCLFFBQVEsZ0JBQWdCLE9BQU87Z0JBQ2hFLFVBQVUsTUFBTSxRQUFTLEtBQUs7Z0JBQzlCLFVBQVUsTUFBTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/keyscript.kode
