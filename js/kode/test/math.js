var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["math"] = async function ()
{
    compare(ke("2 * 2"),4)
    compare(ke("2 + 2"),4)
    compare(ke("2 ** 2"),4)
}
toExport["math"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvbWF0aC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBWUksR0FBRyxTQUFXO1lBQ2QsR0FBRyxTQUFXO1lBQ2QsR0FBRyxVQUFXIn0=
//# sourceURL=file://kode/kode/test/math.kode
