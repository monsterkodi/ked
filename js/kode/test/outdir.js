var toExport = {}
import kode from "../kode.js"

toExport["commonDir"] = function ()
{
    section("one directory is its own root", function ()
    {
        compare(kode.commonDir(['/r/a.kode','/r/b.kode']),'/r')
    })
    section("the shared directory, not the shared prefix", function ()
    {
        compare(kode.commonDir(['/r/kode/a.kode','/r/kol/b.kode']),'/r')
    })
    section("a single file is its own root", function ()
    {
        compare(kode.commonDir(['/r/a.kode']),'/r')
    })
    section("nothing in common falls back to the filesystem root", function ()
    {
        compare(kode.commonDir(['/r/a.kode','/s/b.kode']),'/')
    })
    section("no files at all", function ()
    {
        compare(kode.commonDir([]),'/')
    })
}
toExport["commonDir"]._section_ = true
toExport["outPath"] = function ()
{
    section("a flat list stays flat", function ()
    {
        compare(kode.outPath('/r/a.kode','/out','/r'),'/out/a.js')
    })
    section("a nested file stays nested", function ()
    {
        compare(kode.outPath('/r/test/b.kode','/out','/r'),'/out/test/b.js')
    })
    section("two levels deep", function ()
    {
        compare(kode.outPath('/r/a/b/c.kode','/out','/r'),'/out/a/b/c.js')
    })
    section("the extension is swapped, whatever it was", function ()
    {
        compare(kode.outPath('/r/test/c.noon','/out','/r'),'/out/test/c.js')
    })
    section("a file outside the root keeps its name", function ()
    {
        compare(kode.outPath('/s/b.kode','/out','/r'),'/out/b.js')
    })
    section("a file whose name starts with the root is not the root", function ()
    {
        compare(kode.outPath('/rb.kode','/out','/r'),'/out/rb.js')
    })
}
toExport["outPath"]._section_ = true
toExport["the root the bootstrap would pick"] = function ()
{
    section("the compiler and its tests share one", function ()
    {
        compare(kode.commonDir(['kode/kode/parse.kode','kode/kode/test/error.kode']),'kode/kode')
    })
    section("the compiler on its own", function ()
    {
        compare(kode.commonDir(['kode/kode/parse.kode','kode/kode/lexer.kode']),'kode/kode')
    })
}
toExport["the root the bootstrap would pick"]._section_ = true
toExport._test_ = true
export default toExport

//# sourceURL=file://kode/kode/test/outdir.kode
