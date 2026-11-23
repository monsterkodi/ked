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
            result.push(...iteratorResult)
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

update = function (property, updater, ...restArgs)
{
    var initialVal

    initialVal = this[property]
    return Immutable.set(this,property,updater.call(initialVal,initialVal,...restArgs))
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

updateIn = function (path, updater, ...restArgs)
{
    var initialVal

    initialVal = getInPath(this,path)
    return Immutable.setIn(this,path,updater.call(initialVal,initialVal,...restArgs))
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
