class OS
{
    static loaded = false

    static platform = 'Darwin'

    static isMac = true

    static homedir = null
}

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL29zLmtvZGUiXSwibWFwcGluZ3MiOiI7O29CQVVlOztzQkFDQTs7bUJBQ0E7O3FCQUNBOzs7Ozs7O1FBS1AsT0FBTztRQUFLO1FBQUM7WUFBYTs7Z0JBQ25COztnQkFDQyxHQUFHLFVBQVcsR0FBRztnQkFDakIsR0FBRyxXQUFXLEdBQUc7Z0JBQ2pCLEdBQUcsUUFBVyxHQUFHLGFBQVk7dUJBQzdCLEdBQUcsU0FBVzs7Ozt1QkFFZCxHQUFHLFNBQVc7OztlQUV0Qjs7O09BRUY7O0lBQ0YsY0FBTTtJQUNOLEdBQUcsU0FBUztJQUFpQjs7ZUFFMUIifQ==
//# sourceURL=file://kode/kxk/os.kode
