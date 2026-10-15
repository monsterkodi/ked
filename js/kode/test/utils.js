var kdd, kde

import kode from "../kode.js"


kde = function ()
{
    return new kode({header:false})
}

kdd = function ()
{
    return new kode({header:false,debug:true,verbose:true})
}
export default {
    ast:function (c, p)
    {
        return kde().astr(c,false)
    },
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
    kc:function (c, f)
    {
        var k
    
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
        return k
    },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L3V0aWxzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBVUE7O2VBQWEsTUFBSyxPQUFPOzs7QUFDekI7O2VBQWEsTUFBSyxPQUFPLE1BQU0sTUFBTSxLQUFLLFFBQVE7OztJQUk5Qzs7ZUFBWSxNQUFNLEtBQUssRUFBRTs7SUFFekI7Ozs7bUJBRVEsTUFBTSxLQUFLOztlQUNUOztZQUNGLFlBQUk7WUFDSixZQUFJOzs7SUFFWjs7OztRQUNJLElBQUksTUFBTSxRQUFRLEVBQUU7WUFDakIsRUFBRSxXQUFXOztZQUE2QixJQUFJLFFBQUUsRUFBRSxRQUFRLFFBQU07O1lBQ2hFLEVBQUUsV0FBVzs7WUFBNkIsSUFBSSxRQUFFLEVBQUUsUUFBUSxRQUFNOztZQUNoRSxFQUFFLFdBQVc7O1lBQTZCLElBQUksUUFBRSxFQUFFLFFBQVEsUUFBTTs7ZUFDbkU7O0lBRUo7Ozs7UUFDSSxJQUFJLE1BQU0sUUFBUSxFQUFFO1lBQ2pCLEVBQUUsV0FBVzs7WUFBNkIsSUFBSSxRQUFFLEVBQUUsUUFBUSxRQUFNOztZQUNoRSxFQUFFLFdBQVc7O1lBQTZCLElBQUksUUFBRSxFQUFFLFFBQVEsUUFBTTs7WUFDaEUsRUFBRSxXQUFXOztZQUE2QixJQUFJLFFBQUUsRUFBRSxRQUFRLFFBQU07O2VBQ25FOztJQUVKOzs7O1lBR1EsTUFBTSxRQUFRLEVBQUU7bUJBQ2Q7O2VBQ0E7O21CQUNBIn0=
//# sourceURL=file://kode/kode/test/utils.kode
