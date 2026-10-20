var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke
let kf = utils.kf

toExport["return"] = async function ()
{
    compare(kc('-> return 1'),`(function ()
{
    return 1
})`)
    compare(kc('f = -> 1'),`
f = function ()
{
    return 1
}`)
    compare(kc('f = -> ⮐ 2'),`
f = function ()
{
    return 2
}`)
    compare(kc('f = -> if true ➜ 4 else 5'),`
f = function ()
{
    if (true)
    {
        return 4
    }
    else
    {
        return 5
    }
}`)
    compare(kc('f = -> if true ➜ 4 else ⮐ 5'),`
f = function ()
{
    if (true)
    {
        return 4
    }
    else
    {
        return 5
    }
}`)
    compare(kc(`f = -> 
    if true 
        ⮐ 4 
    else ⮐ 5`),`
f = function ()
{
    if (true)
    {
        return 4
    }
    else
    {
        return 5
    }
}`)
    compare(kc(`f = -> 
    switch a
        '1' ➜ ⮐ 4 
        '2' ➜ ⮐ 5 `),`
f = function ()
{
    switch (a)
    {
        case '1':
            return 4

        case '2':
            return 5

    }

}`)
}
toExport["return"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9yZXR1cm4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7WUFZSSxHQUFJLGVBQW1COzs7O1lBT3ZCLEdBQUksWUFBbUI7Ozs7O1lBUXZCLEdBQUksY0FBcUI7Ozs7O1lBUXpCLEdBQUksNkJBQW9DOzs7Ozs7Ozs7Ozs7WUFleEMsR0FBSSwrQkFBc0M7Ozs7Ozs7Ozs7OztZQWUxQyxHQUFJOzs7ZUFJbUI7Ozs7Ozs7Ozs7OztZQWV2QixHQUFJOzs7cUJBS00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/return.kode
