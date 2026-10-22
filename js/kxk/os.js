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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL29zLmtvZGUiXSwibWFwcGluZ3MiOiJBQVFBLE1BQU07O29CQUVTOztzQkFDQTs7bUJBQ0E7O3FCQUNBOzs7Ozs7O1FBS1AsT0FBTztRQUFLO1FBQUMsZ0JBQU87WUFBTSxlQUFNOztnQkFDekI7O2dCQUNDLEdBQUcsVUFBVyxHQUFHO2dCQUNqQixHQUFHLFdBQVcsR0FBRztnQkFDakIsR0FBRyxRQUFXLEdBQUcsYUFBWTt1QkFDN0IsR0FBRyxTQUFXOzs7O3VCQUVkLEdBQUcsU0FBVzs7O2VBRXRCOzs7T0FFRjs7SUFDRixjQUFNO0lBQ04sR0FBRyxTQUFTO0lBQWlCOztlQUUxQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/os.kode
