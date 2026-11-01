var toExport = {}
import kode from "../kode.js"

toExport["commonDir"] = async function ()
{
    await section("one directory is its own root", async function ()
    {
        compare(kode.commonDir(['/r/a.kode','/r/b.kode']),'/r')
    })
    await section("the shared directory, not the shared prefix", async function ()
    {
        compare(kode.commonDir(['/r/kode/a.kode','/r/kol/b.kode']),'/r')
    })
    await section("a single file is its own root", async function ()
    {
        compare(kode.commonDir(['/r/a.kode']),'/r')
    })
    await section("nothing in common falls back to the filesystem root", async function ()
    {
        compare(kode.commonDir(['/r/a.kode','/s/b.kode']),'/')
    })
    await section("no files at all", async function ()
    {
        compare(kode.commonDir([]),'/')
    })
}
toExport["commonDir"]._section_ = true
toExport["outPath"] = async function ()
{
    await section("a flat list stays flat", async function ()
    {
        compare(kode.outPath('/r/a.kode','/out','/r'),'/out/a.js')
    })
    await section("a nested file stays nested", async function ()
    {
        compare(kode.outPath('/r/test/b.kode','/out','/r'),'/out/test/b.js')
    })
    await section("two levels deep", async function ()
    {
        compare(kode.outPath('/r/a/b/c.kode','/out','/r'),'/out/a/b/c.js')
    })
    await section("the extension is swapped, whatever it was", async function ()
    {
        compare(kode.outPath('/r/test/c.noon','/out','/r'),'/out/test/c.js')
    })
    await section("a file outside the root keeps its name", async function ()
    {
        compare(kode.outPath('/s/b.kode','/out','/r'),'/out/b.js')
    })
    await section("a file whose name starts with the root is not the root", async function ()
    {
        compare(kode.outPath('/rb.kode','/out','/r'),'/out/rb.js')
    })
}
toExport["outPath"]._section_ = true
toExport["the root the bootstrap would pick"] = async function ()
{
    await section("the compiler and its tests share one", async function ()
    {
        compare(kode.commonDir(['kode/kode/parse.kode','kode/kode/test/error.kode']),'kode/kode')
    })
    await section("the compiler on its own", async function ()
    {
        compare(kode.commonDir(['kode/kode/parse.kode','kode/kode/lexer.kode']),'kode/kode')
    })
}
toExport["the root the bootstrap would pick"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0ZGlyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9vdXRkaXIua29kZSJdLCJtYXBwaW5ncyI6IjtPQVVPLFdBQUE7Ozs7OztnQkFNQyxLQUFLLFdBQVcsWUFBWSxjQUFnQjs7OztnQkFJNUMsS0FBSyxXQUFXLGlCQUFpQixrQkFBb0I7Ozs7Z0JBSXJELEtBQUssV0FBVyxjQUFnQjs7OztnQkFJaEMsS0FBSyxXQUFXLFlBQVksY0FBZ0I7Ozs7Z0JBSTVDLEtBQUssY0FBZ0I7Ozs7Ozs7O2dCQU1yQixLQUFLLFFBQVEsWUFBWSxPQUFPLE1BQVE7Ozs7Z0JBSXhDLEtBQUssUUFBUSxpQkFBaUIsT0FBTyxNQUFROzs7O2dCQUk3QyxLQUFLLFFBQVEsZ0JBQWdCLE9BQU8sTUFBUTs7OztnQkFJNUMsS0FBSyxRQUFRLGlCQUFpQixPQUFPLE1BQVE7Ozs7Z0JBSTdDLEtBQUssUUFBUSxZQUFZLE9BQU8sTUFBUTs7OztnQkFJeEMsS0FBSyxRQUFRLFdBQVcsT0FBTyxNQUFROzs7Ozs7OztnQkFNdkMsS0FBSyxXQUFXLHVCQUF1Qiw4QkFBZ0M7Ozs7Z0JBSXZFLEtBQUssV0FBVyx1QkFBdUIseUJBQTJCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/outdir.kode
