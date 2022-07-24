const isJson = (item) => {
    item = 
        typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) return true;

    return false;
}

const getResult = (type, result, statusCode, text, redirect) => {
    let message = '';
    if (!isJson(result)) {
        message = result;
        result = []
    }

    let count = 
        result.hasOwnProperty('modifiedCount') ?
            result.modifiedCount :
            (Array.isArray(result) ? result.length : 1);

    return {
        type: `${type}`,
        message: `${message}`,
        error: (type == 'error' ? `${text === undefined ? '' : text}` : ''),
        statusCode: statusCode,
        count: count,
        result: result,
        redirect: `${redirect === undefined ? '' : redirect}`
    };
}

const sendResponse = (result, res, statusCode) => {
    if(!res) return;

/*     console.log('result', result)
    console.log('statusCode', statusCode); */
    statusCode = (Number.isInteger(statusCode) ? statusCode : null);
/*     console.log('statusCode', statusCode);
    console.log('result.hasOwnProperty(statusCode)', result.hasOwnProperty('statusCode'));
    console.log('Number.isInteger(result.statusCode)', Number.isInteger(result.statusCode));
    console.log('result.statusCode', result.statusCode); */

    if(!statusCode) {
        statusCode = 200;
        if (result.hasOwnProperty('statusCode'))
            statusCode = (Number.isInteger(result.statusCode) ? result.statusCode : 200);
    } 
    //console.log('statusCode', statusCode, result)
    return res.status(statusCode).json(result);
}

const getResultError = (result, error) => {
    return getResult('error', result, 200, error)
}

const setKeyNotExists = (obj, nameKey, value) => {
    if (Array.isArray(obj))
        return obj.map(item => {
            if (!item.hasOwnProperty(nameKey)) 
                item[nameKey] = value;
            
            return item;
        });

    if (!obj.hasOwnProperty(nameKey)) 
        obj[nameKey] = value;
    
    return obj;
}

const deleteKey = (obj, nameKey) => {
/*     const myObject = {
        "employeeid": "160915848",
        "firstName": "tet",
        "lastName": "test",
        "email": "test@email.com",
        "country": "Brasil",
        "currentIndustry": "aaaaaaaaaaaaa",
        "password": "password",
        "currentOrganization": "test",
        "salary": "1234567"
    }; */
    let objCopy = obj;
    //console.log(objCopy, nameKey);
    objCopy[nameKey] = undefined;
    objCopy = JSON.parse(JSON.stringify(objCopy));
    //delete objCopy[nameKey];
    //console.log(objCopy);
    // OR delete myObject.currentIndustry;
     
    return objCopy;
}

module.exports = {
    deleteKey,
    isJson,
    getResult,
    getResultError,
    sendResponse,
    setKeyNotExists
}
