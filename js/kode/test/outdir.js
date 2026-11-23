var toExport = {}
import kode from "../kode.js"

toExport["commonDir"] = async function ()
{
    compare(kode.commonDir(['/r/a.kode','/r/b.kode']),'/r')
    compare(kode.commonDir(['/r/kode/a.kode','/r/kol/b.kode']),'/r')
    compare(kode.commonDir(['/r/a.kode']),'/r')
    compare(kode.commonDir(['/r/a.kode','/s/b.kode']),'/')
    compare(kode.commonDir([]),'/')
}
toExport["commonDir"]._section_ = true
toExport["outPath"] = async function ()
{
    compare(kode.outPath('/r/a.kode','/out','/r'),'/out/a.js')
    compare(kode.outPath('/r/test/b.kode','/out','/r'),'/out/test/b.js')
    compare(kode.outPath('/r/a/b/c.kode','/out','/r'),'/out/a/b/c.js')
    compare(kode.outPath('/r/test/c.noon','/out','/r'),'/out/test/c.js')
    compare(kode.outPath('/s/b.kode','/out','/r'),'/out/b.js')
    compare(kode.outPath('/rb.kode','/out','/r'),'/out/rb.js')
}
toExport["outPath"]._section_ = true
toExport["the root the bootstrap would pick"] = async function ()
{
    compare(kode.commonDir(['kode/kode/parse.kode','kode/kode/test/error.kode']),'kode/kode')
    compare(kode.commonDir(['kode/kode/parse.kode','kode/kode/lexer.kode']),'kode/kode')
}
toExport["the root the bootstrap would pick"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0ZGlyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9vdXRkaXIua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNPLFdBQUE7Ozs7SUFJcUQsUUFBcEQsS0FBSyxXQUFXLFlBQVksY0FBMEI7SUFDRixRQUFwRCxLQUFLLFdBQVcsaUJBQWlCLGtCQUFxQjtJQUNGLFFBQXBELEtBQUssV0FBVyxjQUFzQztJQUNGLFFBQXBELEtBQUssV0FBVyxZQUFZLGNBQTBCO0lBQ0YsUUFBcEQsS0FBSyxjQUFpRDs7Ozs7SUFJaEIsUUFBdEMsS0FBSyxRQUFRLFlBQVksT0FBTyxNQUFRO0lBQ0csUUFBM0MsS0FBSyxRQUFRLGlCQUFpQixPQUFPLE1BQVE7SUFDSCxRQUExQyxLQUFLLFFBQVEsZ0JBQWdCLE9BQU8sTUFBUTtJQUNELFFBQTNDLEtBQUssUUFBUSxpQkFBaUIsT0FBTyxNQUFRO0lBQ1AsUUFBdEMsS0FBSyxRQUFRLFlBQVksT0FBTyxNQUFRO0lBQ0gsUUFBckMsS0FBSyxRQUFRLFdBQVcsT0FBTyxNQUFROzs7OztJQUk4QixRQUFyRSxLQUFLLFdBQVcsdUJBQXVCLDhCQUFnQztJQUNQLFFBQWhFLEtBQUssV0FBVyx1QkFBdUIseUJBQTJCIn0=
//# sourceURL=../../../kode/kode/test/outdir.kode
