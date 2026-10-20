var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var codemsg, errmsg, kc, kdd, kde

import kode from "../kode.js"


kde = function ()
{
    return new kode({header:false})
}

kdd = function ()
{
    return new kode({header:false,debug:true,verbose:true})
}

kc = function (c, f)
{
    var i, k

    k = kde().compile(c,f)
    if (k.startsWith('// monsterkodi/kode'))
    {
        k = k.slice(k.indexOf('\n') + 2)
    }
    if (k.startsWith('var _k_'))
    {
        k = k.slice(k.indexOf('\n') + 2)
    }
    if (k.startsWith('var '))
    {
        k = k.slice(k.indexOf('\n') + 2)
    }
    i = k.indexOf('\n//# source')
    if (i >= 0)
    {
        k = k.slice(0,i)
    }
    return k
}

errmsg = function (c)
{
    try
    {
        kc(c,'err.kode')
        return ''
    }
    catch (err)
    {
        return String(err)
    }
}

codemsg = function (code, msg)
{
    var m

    m = errmsg(code)
    if (_k_.in(msg,m))
    {
        return compare(true,true)
    }
    else
    {
        return compare(msg,m)
    }
}
export default {
    ast:function (c, p)
    {
        return kde().astr(c,false)
    },
    errmsg:errmsg,
    codemsg:codemsg,
    ke:function (c)
    {
        try
        {
            return kde().eval(c)
        }
        catch (err)
        {
            console.log(c)
            console.log(err)
        }
    },
    kc:kc,
    kd:function (c, f)
    {
        var k
    
        k = kdd().compile(c,f)
        if (k.startsWith('// monsterkodi/kode'))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        if (k.startsWith('var _k_'))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        if (k.startsWith('var '))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        return k
    },
    kf:function (c, f)
    {
        try
        {
            kde().compile(c,f)
            return false
        }
        catch (err)
        {
            return true
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L3V0aWxzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFVQTs7ZUFBYSxNQUFLLE9BQU87OztBQUN6Qjs7ZUFBYSxNQUFLLE9BQU8sTUFBTSxNQUFNLEtBQUssUUFBUTs7O0FBQ2xEOzs7O0lBRUksSUFBSSxNQUFNLFFBQVEsRUFBRTtRQUNqQixFQUFFLFdBQVc7O1FBQTZCLElBQUksUUFBRSxFQUFFLFFBQVEsUUFBTTs7UUFDaEUsRUFBRSxXQUFXOztRQUE2QixJQUFJLFFBQUUsRUFBRSxRQUFRLFFBQU07O1FBQ2hFLEVBQUUsV0FBVzs7UUFBNkIsSUFBSSxRQUFFLEVBQUUsUUFBUSxRQUFNOztJQUVuRSxJQUFJLEVBQUUsUUFBUTtRQUNYLEtBQUs7O1FBQU8sSUFBSSxFQUFFLE1BQU0sRUFBRzs7V0FFOUI7OztBQUVKOzs7O1FBR1EsR0FBRyxFQUFFO2VBQ0w7O1dBQ0U7O2VBQ0YsT0FBTzs7OztBQUVmOzs7O0lBRUksSUFBSSxPQUFPO2VBQ1IsSUFBTzs7dUJBQ04sS0FBTzs7Ozt1QkFFUCxJQUFNOzs7O0lBSVY7O2VBQVksTUFBTSxLQUFLLEVBQUU7O0lBRXpCLE9BQVM7SUFDVCxRQUFTO0lBRVQ7Ozs7bUJBRVEsTUFBTSxLQUFLOztlQUNUOztZQUNGLFlBQUk7WUFDSixZQUFJOzs7SUFFWixHQUFJO0lBRUo7Ozs7UUFDSSxJQUFJLE1BQU0sUUFBUSxFQUFFO1lBQ2pCLEVBQUUsV0FBVzs7WUFBNkIsSUFBSSxRQUFFLEVBQUUsUUFBUSxRQUFNOztZQUNoRSxFQUFFLFdBQVc7O1lBQTZCLElBQUksUUFBRSxFQUFFLFFBQVEsUUFBTTs7WUFDaEUsRUFBRSxXQUFXOztZQUE2QixJQUFJLFFBQUUsRUFBRSxRQUFRLFFBQU07O2VBQ25FOztJQUVKOzs7O1lBR1EsTUFBTSxRQUFRLEVBQUU7bUJBQ2Q7O2VBQ0E7O21CQUNBIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/utils.kode
