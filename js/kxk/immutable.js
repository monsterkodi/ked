var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var addImmutabilityTag, addPropertyTo, arraySet, arraySetIn, asDeepMutable, asMutableArray, asMutableObject, asObject, banProperty, flatMap, getIn, getInPath, immutabilityTag, Immutable, immutableEmptyArray, immutableEmptyObject, ImmutableError, instantiateEmptyObject, isBlobObject, isEqual, isError, isFileObject, isImmutable, isMergableObject, isObject, isPromise, makeImmutable, makeImmutableArray, makeImmutableObject, makeMethodReturnImmutable, merge, mutatingArrayMethods, mutatingObjectMethods, objectReplace, objectSet, objectSetIn, quickCopy, toStatic, toStaticObjectOrArray, update, updateIn, without


isObject = function (obj)
{
    return (obj !== null) && (typeof(obj) === 'object') && (!Array.isArray(obj))
}

isFileObject = function (obj)
{
    return (typeof(File) !== 'undefined') && (obj instanceof File)
}

isBlobObject = function (obj)
{
    return (typeof(Blob) !== 'undefined') && (obj instanceof Blob)
}

isPromise = function (obj)
{
    return (typeof(obj) === 'object') && typeof(obj.then) === 'function'
}

isError = function (obj)
{
    return obj instanceof Error
}

instantiateEmptyObject = function (obj)
{
    var prototype

    if (prototype = Object.getPrototypeOf(obj))
    {
        return Object.create(prototype)
    }
    else
    {
        return {}
    }
}

addPropertyTo = function (target, methodName, value)
{
    return Object.defineProperty(target,methodName,{enumerable:false,configurable:false,writable:false,value:value})
}

banProperty = function (target, methodName)
{
    return addPropertyTo(target,methodName,function ()
    {
        throw new ImmutableError(`The ${methodName} method cannot be invoked on an Immutable data structure.`)
    })
}
immutabilityTag = "__immutable__"

addImmutabilityTag = function (target)
{
    return addPropertyTo(target,immutabilityTag,true)
}

isImmutable = function (target)
{
    if (typeof(target) === "object")
    {
        return target === null || Boolean(Object.getOwnPropertyDescriptor(target,immutabilityTag))
    }
    else
    {
        return true
    }
}

isEqual = function (a, b)
{
    return a === b || (a !== a && b !== b)
}

isMergableObject = function (target)
{
    return (target !== null) && typeof(target) === "object" && (!Array.isArray(target))
}
mutatingObjectMethods = ["setPrototypeOf"]
mutatingArrayMethods = mutatingObjectMethods.concat(['push','pop','sort','splice','shift','unshift','reverse'])

ImmutableError = function (message)
{
    this.name = 'ImmutableError'
    this.message = message
    return this.stack = (new Error()).stack
}
ImmutableError.prototype = new Error()
ImmutableError.prototype.constructor = Error

makeImmutable = function (obj, bannedMethods)
{
    var banned

    addImmutabilityTag(obj)
    var list = _k_.list(bannedMethods)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        banned = list[_a_]
        banProperty(obj,banned)
    }
    Object.freeze(obj)
    return obj
}

makeImmutableObject = function (obj)
{
    addPropertyTo(obj,"merge",merge)
    addPropertyTo(obj,"replace",objectReplace)
    addPropertyTo(obj,"without",without)
    addPropertyTo(obj,"asMutable",asMutableObject)
    addPropertyTo(obj,"set",objectSet)
    addPropertyTo(obj,"setIn",objectSetIn)
    addPropertyTo(obj,"update",update)
    addPropertyTo(obj,"updateIn",updateIn)
    addPropertyTo(obj,"getIn",getIn)
    return makeImmutable(obj,mutatingObjectMethods)
}

makeImmutableArray = function (array)
{
    var i

    addPropertyTo(array,"flatMap",flatMap)
    addPropertyTo(array,"asObject",asObject)
    addPropertyTo(array,"asMutable",asMutableArray)
    addPropertyTo(array,"set",arraySet)
    addPropertyTo(array,"setIn",arraySetIn)
    addPropertyTo(array,"update",update)
    addPropertyTo(array,"updateIn",updateIn)
    addPropertyTo(array,"getIn",getIn)
    for (i = 0; i < array.length; i++)
    {
        array[i] = Immutable(array[i])
    }
    return makeImmutable(array,mutatingArrayMethods)
}

Immutable = function (obj, options, stackRemaining)
{
    var key, prototype, theClone

    if (isImmutable(obj) || isFileObject(obj) || isBlobObject(obj) || isError(obj))
    {
        return obj
    }
    else if (isPromise(obj))
    {
        return obj.then(Immutable)
    }
    else if (Array.isArray(obj))
    {
        return makeImmutableArray(obj.slice())
    }
    else
    {
        prototype = options && options.prototype
        theClone = {}
        if (prototype && (prototype !== Object.prototype))
        {
            theClone = Object.create(prototype)
        }
        if (stackRemaining === null)
        {
            stackRemaining = 64
        }
        if (stackRemaining <= 0)
        {
            throw new ImmutableError("object either contains recursion or is nested too deep!")
        }
        stackRemaining -= 1
        for (key in obj)
        {
            if (Object.getOwnPropertyDescriptor(obj,key))
            {
                theClone[key] = Immutable(obj[key],undefined,stackRemaining)
            }
        }
        return makeImmutableObject(theClone)
    }
}

makeMethodReturnImmutable = function (obj, methodName)
{
    var currentMethod

    currentMethod = obj[methodName]
    return addPropertyTo(obj,methodName,function ()
    {
        return Immutable(currentMethod.apply(obj,arguments))
    })
}

arraySet = function (idx, value, config)
{
    var deep, mutable

    deep = config && config.deep
    if (this[idx])
    {
        if (deep && this[idx] !== value && isMergableObject(value) && isMergableObject(this[idx]))
        {
            value = Immutable.merge(this[idx],value,{deep:true,mode:'replace'})
        }
        if (isEqual(this[idx],value))
        {
            return this
        }
    }
    mutable = asMutableArray.call(this)
    mutable[idx] = Immutable(value)
    return makeImmutableArray(mutable)
}
immutableEmptyArray = Immutable([])

arraySetIn = function (pth, value, config)
{
    var head, mutable, newValue, nextHead, tail, thisHead

    head = pth[0]
    if (pth.length === 1)
    {
        return arraySet.call(this,head,value,config)
    }
    else
    {
        tail = pth.slice(1)
        thisHead = this[head]
        newValue
        if (typeof(thisHead) === "object" && thisHead !== null)
        {
            newValue = Immutable.setIn(thisHead,tail,value)
        }
        else
        {
            nextHead = tail[0]
            if ((nextHead !== '' && isFinite(nextHead)))
            {
                newValue = arraySetIn.call(immutableEmptyArray,tail,value)
            }
            else
            {
                newValue = objectSetIn.call(immutableEmptyObject,tail,value)
            }
        }
        if (this[head] && thisHead === newValue)
        {
            return this
        }
        mutable = asMutableArray.call(this)
        mutable[head] = newValue
        return makeImmutableArray(mutable)
    }
}

flatMap = function (iterator)
{
    var index, iteratorResult, result

    if (arguments.length === 0)
    {
        return this
    }
    result = []
    for (index = 0; index < this.length; index++)
    {
        iteratorResult = iterator(this[index],index,this)
        if (Array.isArray(iteratorResult))
        {
            result.push.apply(result,iteratorResult)
        }
        else
        {
            result.push(iteratorResult)
        }
    }
    return makeImmutableArray(result)
}

without = function (remove)
{
    var key, keysToRemoveArray, result

    if (typeof(remove) === "undefined" && arguments.length === 0)
    {
        return this
    }
    if (typeof(remove) !== "function")
    {
        keysToRemoveArray = (Array.isArray(remove) ? remove.slice() : Array.prototype.slice.call(arguments))
        keysToRemoveArray.forEach(function (el, idx, arr)
        {
            if (typeof(el) === "number")
            {
                return arr[idx] = el.toString()
            }
        })
        remove = function (val, key)
        {
            return keysToRemoveArray.indexOf(key) !== -1
        }
    }
    result = instantiateEmptyObject(this)
    for (key in this)
    {
        if (this.hasOwnProperty(key) && remove(this[key],key) === false)
        {
            result[key] = this[key]
        }
    }
    return makeImmutableObject(result)
}

asMutableArray = function (opts)
{
    var i, result

    result = []
    for (i = 0; i < this.length; i++)
    {
        result.push(asDeepMutable(this[i]))
    }
    return result
}

asObject = function (iterator)
{
    var index, key, length, pair, result, value

    if (typeof(iterator) !== "function")
    {
        iterator = function (value)
        {
            return value
        }
    }
    result = {}
    length = this.length
    for (index = 0; index < length; index++)
    {
        pair = iterator(this[index],index,this)
        key = pair[0]
        value = pair[1]
        result[key] = value
    }
    return makeImmutableObject(result)
}

asDeepMutable = function (obj)
{
    if (!obj || (typeof(obj) !== 'object') || !Object.getOwnPropertyDescriptor(obj,immutabilityTag))
    {
        return obj
    }
    return Immutable.asMutable(obj)
}

quickCopy = function (src, dest)
{
    var key

    for (key in src)
    {
        if (Object.getOwnPropertyDescriptor(src,key))
        {
            dest[key] = src[key]
        }
    }
    return dest
}

merge = function (other, config)
{
    var addToResult, clearDroppedKeys, deep, index, key, merger, mode, otherFromArray, receivedArray, result

    if (arguments.length === 0)
    {
        return this
    }
    if ((other === null) || (typeof(other) !== "object"))
    {
        throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not " + JSON.stringify(other))
    }
    receivedArray = Array.isArray(other)
    deep = (config != null ? config.deep : undefined)
    mode = (config != null ? config.mode : undefined) || 'merge'
    merger = (config != null ? config.merger : undefined)
    result = undefined
    addToResult = function (currentObj, otherObj, key)
    {
        var currentValue, immutableValue, mergerResult, newValue

        immutableValue = Immutable(otherObj[key])
        mergerResult = merger && merger(currentObj[key],immutableValue,config)
        currentValue = currentObj[key]
        if ((result !== undefined) || (mergerResult !== undefined) || (!currentObj.hasOwnProperty(key)) || (!isEqual(immutableValue,currentValue)))
        {
            if (mergerResult !== undefined)
            {
                newValue = mergerResult
            }
            else if (deep && isMergableObject(currentValue) && isMergableObject(immutableValue))
            {
                newValue = Immutable.merge(currentValue,immutableValue,config)
            }
            else
            {
                newValue = immutableValue
            }
            if ((!isEqual(currentValue,newValue)) || (!currentObj.hasOwnProperty(key)))
            {
                if (result === undefined)
                {
                    result = quickCopy(currentObj,instantiateEmptyObject(currentObj))
                }
                result[key] = newValue
            }
        }
        return null
    }
    clearDroppedKeys = function (currentObj, otherObj)
    {
        var key

        for (key in currentObj)
        {
            if (!otherObj.hasOwnProperty(key))
            {
                if (result === undefined)
                {
                    result = quickCopy(currentObj,instantiateEmptyObject(currentObj))
                }
                delete result[key]
            }
        }
    }
    if (!receivedArray)
    {
        for (key in other)
        {
            if (Object.getOwnPropertyDescriptor(other,key))
            {
                addToResult(this,other,key)
            }
        }
        if (mode === 'replace')
        {
            clearDroppedKeys(this,other)
        }
    }
    else
    {
        for (index = 0; index < other.length; index++)
        {
            otherFromArray = other[index]
            for (key in otherFromArray)
            {
                if (otherFromArray.hasOwnProperty(key))
                {
                    addToResult(((result !== undefined ? result : this)),otherFromArray,key)
                }
            }
        }
    }
    if (result === undefined)
    {
        return this
    }
    else
    {
        return makeImmutableObject(result)
    }
}

objectReplace = function (value, config)
{
    var deep

    deep = config && config.deep
    if (arguments.length === 0)
    {
        return this
    }
    if (value === null || typeof(value) !== "object")
    {
        throw new TypeError("Immutable#replace can only be invoked with objects or arrays, not " + JSON.stringify(value))
    }
    return Immutable.merge(this,value,{deep:deep,mode:'replace'})
}
immutableEmptyObject = Immutable({})

objectSetIn = function (path, value, config)
{
    var head, mutable, newValue, tail, thisHead

    if ((!Array.isArray(path)) || (path.length === 0))
    {
        throw new TypeError("The first argument to Immutable#setIn must be an array containing at least one \"key\" string.")
    }
    head = path[0]
    if (path.length === 1)
    {
        return objectSet.call(this,head,value,config)
    }
    tail = path.slice(1)
    newValue = undefined
    thisHead = this[head]
    if (this.hasOwnProperty(head) && (typeof(thisHead) === "object") && (thisHead !== null))
    {
        newValue = Immutable.setIn(thisHead,tail,value)
    }
    else
    {
        newValue = objectSetIn.call(immutableEmptyObject,tail,value)
    }
    if (this.hasOwnProperty(head) && (thisHead === newValue))
    {
        return this
    }
    mutable = quickCopy(this,instantiateEmptyObject(this))
    mutable[head] = newValue
    return makeImmutableObject(mutable)
}

objectSet = function (property, value, config)
{
    var deep, mutable

    deep = config && config.deep
    if (this.hasOwnProperty(property))
    {
        if (deep && (this[property] !== value) && isMergableObject(value) && isMergableObject(this[property]))
        {
            value = Immutable.merge(this[property],value,{deep:true,mode:'replace'})
        }
        if (isEqual(this[property],value))
        {
            return this
        }
    }
    mutable = quickCopy(this,instantiateEmptyObject(this))
    mutable[property] = Immutable(value)
    return makeImmutableObject(mutable)
}

update = function (property, updater)
{
    var initialVal, restArgs

    restArgs = Array.prototype.slice.call(arguments,2)
    initialVal = this[property]
    return Immutable.set(this,property,updater.apply(initialVal,[initialVal].concat(restArgs)))
}

getInPath = function (obj, path)
{
    var i

    for (i = 0; i < path.length; i++)
    {
        obj = obj[path[i]]
        if (obj === null)
        {
            break
        }
    }
    return ((i === path.length) ? obj : undefined)
}

updateIn = function (path, updater)
{
    var initialVal, restArgs

    restArgs = Array.prototype.slice.call(arguments,2)
    initialVal = getInPath(this,path)
    return Immutable.setIn(this,path,updater.apply(initialVal,[initialVal].concat(restArgs)))
}

getIn = function (path, defaultValue)
{
    var value

    value = getInPath(this,path)
    if (value === undefined)
    {
        return defaultValue
    }
    else
    {
        return value
    }
}

asMutableObject = function (opts)
{
    var key, result

    result = instantiateEmptyObject(this)
    for (key in this)
    {
        if (this.hasOwnProperty(key))
        {
            result[key] = asDeepMutable(this[key])
        }
    }
    return result
}

toStatic = function (fn)
{
    var staticWrapper

    staticWrapper = function ()
    {
        var args, self

        args = [].slice.call(arguments)
        self = args.shift()
        return fn.apply(self,args)
    }
    return staticWrapper
}

toStaticObjectOrArray = function (fnObject, fnArray)
{
    var staticWrapper

    staticWrapper = function ()
    {
        var args, self

        args = [].slice.call(arguments)
        self = args.shift()
        if (Array.isArray(self))
        {
            return fnArray.apply(self,args)
        }
        else
        {
            return fnObject.apply(self,args)
        }
    }
    return staticWrapper
}
Immutable.from = Immutable
Immutable.isImmutable = isImmutable
Immutable.ImmutableError = ImmutableError
Immutable.merge = toStatic(merge)
Immutable.replace = toStatic(objectReplace)
Immutable.without = toStatic(without)
Immutable.asMutable = toStaticObjectOrArray(asMutableObject,asMutableArray)
Immutable.set = toStaticObjectOrArray(objectSet,arraySet)
Immutable.setIn = toStaticObjectOrArray(objectSetIn,arraySetIn)
Immutable.update = toStatic(update)
Immutable.updateIn = toStatic(updateIn)
Immutable.getIn = toStatic(getIn)
Immutable.flatMap = toStatic(flatMap)
Immutable.asObject = toStatic(asObject)
Object.freeze(Immutable)
export default Immutable;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1tdXRhYmxlLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9pbW11dGFibGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFNQSxxQkFBZTs7WUFBUSxRQUFPLFVBQVcsT0FBTyxTQUFRLGVBQW1CLE1BQU0sUUFBUTs7O0FBQ3pGLHlCQUFlOztZQUFRLE9BQU8sVUFBUyxpQkFBa0IsZUFBZTs7O0FBQ3hFLHlCQUFlOztZQUFRLE9BQU8sVUFBUyxpQkFBa0IsZUFBZTs7O0FBQ3hFLHNCQUFlOztZQUFRLE9BQU8sU0FBUSxhQUFjLE9BQU8sSUFBSSxVQUFTOzs7QUFDeEUsb0JBQWU7O1dBQU8sZUFBZTs7O0FBRXJDLG1DQUF5Qjs7OztRQUVsQixZQUFZLE9BQU8sZUFBZTs7ZUFDakMsT0FBTyxPQUFPOzs7Ozs7OztBQUl0QiwwQkFBZ0IsUUFBTyxZQUFXOztXQUU5QixPQUFPLGVBQWUsT0FBUSxZQUMxQixXQUFZLE1BQ1osYUFBYyxNQUNkLFNBQVUsTUFDVixNQUFPOzs7QUFFZix3QkFBYyxRQUFPOztXQUVqQixjQUFjLE9BQVE7O1FBQ2xCLFVBQVUsc0JBQXNCOzs7QUFFeEMsa0JBQWtCOztBQUVsQiwrQkFBcUI7O1dBQVUsY0FBYyxPQUFPLGdCQUFnQjs7O0FBRXBFLHdCQUFjOztRQUVQLE9BQU8sWUFBVzs7ZUFDakIsV0FBVSxRQUFRLFFBQVEsT0FBTyx5QkFBeUIsT0FBUTs7OztlQUlsRTs7OztBQUVSLG9CQUFXLEdBQUc7O1dBQU0sTUFBSyxNQUFNLE1BQUssS0FBTSxNQUFLOzs7QUFFL0MsNkJBQW1COztZQUFXLFdBQVUsU0FBVSxPQUFPLFlBQVcsY0FBa0IsTUFBTSxRQUFROztBQUVwRyx5QkFBNkI7QUFDN0IsdUJBQTJCLHNCQUFzQixRQUN6QyxPQUFPLE1BQU0sT0FBTyxTQUFTLFFBQVEsVUFBVTs7QUFHdkQsMkJBQWlCOztJQUViLEtBQUMsT0FBTztJQUNSLEtBQUMsVUFBVTtXQUNYLEtBQUMsYUFBYSxTQUFTOztBQUUzQixlQUFlLGdCQUFn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
//# sourceURL=../../kode/kxk/immutable.kode
