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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0ZGlyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9vdXRkaXIua29kZSJdLCJtYXBwaW5ncyI6IjtPQWdCTyxXQUFBOzs7Ozs7Z0JBTUMsS0FBSyxXQUFXLFlBQVksY0FBZ0I7Ozs7Z0JBSTVDLEtBQUssV0FBVyxpQkFBaUIsa0JBQW9COzs7O2dCQUlyRCxLQUFLLFdBQVcsY0FBZ0I7Ozs7Z0JBSWhDLEtBQUssV0FBVyxZQUFZLGNBQWdCOzs7O2dCQUk1QyxLQUFLLGNBQWdCOzs7Ozs7OztnQkFNckIsS0FBSyxRQUFRLFlBQVksT0FBTyxNQUFROzs7O2dCQUl4QyxLQUFLLFFBQVEsaUJBQWlCLE9BQU8sTUFBUTs7OztnQkFJN0MsS0FBSyxRQUFRLGdCQUFnQixPQUFPLE1BQVE7Ozs7Z0JBSTVDLEtBQUssUUFBUSxpQkFBaUIsT0FBTyxNQUFROzs7O2dCQUk3QyxLQUFLLFFBQVEsWUFBWSxPQUFPLE1BQVE7Ozs7Z0JBSXhDLEtBQUssUUFBUSxXQUFXLE9BQU8sTUFBUTs7Ozs7Ozs7Z0JBTXZDLEtBQUssV0FBVyx1QkFBdUIsOEJBQWdDOzs7O2dCQUl2RSxLQUFLLFdBQVcsdUJBQXVCLHlCQUEyQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/outdir.kode
