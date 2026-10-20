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
    for (var _b_ = i = 0, _c_ = array.length; (_b_ <= _c_ ? i < array.length : i > array.length); (_b_ <= _c_ ? ++i : --i))
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
    for (var _d_ = index = 0, _e_ = this.length; (_d_ <= _e_ ? index < this.length : index > this.length); (_d_ <= _e_ ? ++index : --index))
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
    for (var _f_ = i = 0, _10_ = this.length; (_f_ <= _10_ ? i < this.length : i > this.length); (_f_ <= _10_ ? ++i : --i))
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
    for (var _11_ = index = 0, _12_ = length; (_11_ <= _12_ ? index < length : index > length); (_11_ <= _12_ ? ++index : --index))
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
        for (var _13_ = index = 0, _14_ = other.length; (_13_ <= _14_ ? index < other.length : index > other.length); (_13_ <= _14_ ? ++index : --index))
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

    for (var _15_ = i = 0, _16_ = path.length; (_15_ <= _16_ ? i < path.length : i > path.length); (_15_ <= _16_ ? ++i : --i))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1tdXRhYmxlLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9pbW11dGFibGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFXQTs7WUFBdUIsUUFBTyxVQUFXLE9BQU8sU0FBUSxlQUFtQixNQUFNLFFBQVE7OztBQUN6Rjs7WUFBdUIsT0FBTyxVQUFTLGlCQUFrQixlQUFlOzs7QUFDeEU7O1lBQXVCLE9BQU8sVUFBUyxpQkFBa0IsZUFBZTs7O0FBQ3hFOztZQUF1QixPQUFPLFNBQVEsYUFBYyxPQUFPLElBQUksVUFBUzs7O0FBQ3hFOztXQUFzQixlQUFlOzs7QUFFckM7Ozs7UUFFTyxZQUFZLE9BQU8sZUFBZTs7ZUFDakMsT0FBTyxPQUFPOzs7Ozs7OztBQUl0Qjs7V0FFSSxPQUFPLGVBQWUsT0FBUSxZQUMxQixXQUFZLE1BQ1osYUFBYyxNQUNkLFNBQVUsTUFDVixNQUFPOzs7QUFFZjs7V0FFSSxjQUFjLE9BQVE7O1FBQ2xCLFVBQVUsc0JBQXNCOzs7QUFFeEMsa0JBQWtCOztBQUVsQjs7V0FBK0IsY0FBYyxPQUFPLGdCQUFnQjs7O0FBRXBFOztRQUVPLE9BQU8sWUFBVzs7ZUFDakIsV0FBVSxRQUFRLFFBQVEsT0FBTyx5QkFBeUIsT0FBUTs7OztlQUlsRTs7OztBQUVSOztXQUFvQixNQUFLLE1BQU0sTUFBSyxLQUFNLE1BQUs7OztBQUUvQzs7WUFBOEIsV0FBVSxTQUFVLE9BQU8sWUFBVyxjQUFrQixNQUFNLFFBQVE7O0FBRXBHLHlCQUE2QjtBQUM3Qix1QkFBMkIsc0JBQXNCLFFBQ3pDLE9BQU8sTUFBTSxPQUFPLFNBQVMsUUFBUSxVQUFVOztBQUd2RDs7SUFFSSxLQUFDLE9BQU87SUFDUixLQUFDLFVBQVU7V0FDWCxLQUFDLGFBQWEsU0FBUzs7QUFFM0IsZUFBZSxnQkFBZ0I7QUFDL0IsZUFBZSxVQUFVLGNBQWM7O0FBRXZDOzs7O0lBRUksbUJBQW1CO3dCQUdMOzs7O1FBQ1YsWUFBWSxJQUFLOztJQUVyQixPQUFPLE9BQU87V0FDZDs7O0FBRUo7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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/immutable.kode
