var OS


OS = (function ()
{
    function OS ()
    {}

    OS["loaded"] = false
    OS["platform"] = 'Darwin'
    OS["isMac"] = true
    OS["homedir"] = null
    return OS
})()

try
{
    ;(async function ()
    {
        import('os')
        .
        catch(function (e)
        {}).then(function (os)
        {
            if (os)
            {
                OS.homedir = os.homedir()
                OS.platform = os.platform()
                OS.isMac = OS.platform === 'Darwin'
                return OS.loaded = true
            }
            else
            {
                return OS.loaded = 'not available'
            }
        })
        return null
    })()
}
catch (err)
{
    console.error(err)
    OS.loaded = 'not available!'
    err
}
export default OS;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL29zLmtvZGUiXSwibWFwcGluZ3MiOiI7OztBQUNDLE1BQUQ7Ozs7O0lBRUksSUFBQyxXQUFVO0lBQ1gsSUFBQyxhQUFVO0lBQ1gsSUFBQyxVQUFVO0lBQ1gsSUFBQyxZQUFVO1dBTGQ7Ozs7Ozs7UUFVTyxPQUFPO1FBQUs7UUFBQyxnQkFBTztZQUFNLGVBQU07O2dCQUN6Qjs7Z0JBQ0MsR0FBRyxVQUFXLEdBQUc7Z0JBQ2pCLEdBQUcsV0FBVyxHQUFHO2dCQUNqQixHQUFHLFFBQVcsR0FBRyxhQUFZO3VCQUM3QixHQUFHLFNBQVc7Ozs7dUJBRWQsR0FBRyxTQUFXOzs7ZUFFdEI7OztPQUVGOztJQUNGLGNBQU07SUFDTixHQUFHLFNBQVM7SUFBaUI7O2VBRTFCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/os.kode
