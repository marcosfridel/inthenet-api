//npm i jsonwebtoken
const jwt = require('jsonwebtoken')

const json = require('./json')

const userLib = require('../lib/user')
const loginLib = require('../lib/login')

const getToken = (req) => {
    let token = req.headers['authorization'];
    token = (token && token.split(' ').length) > 1 ? token.split(' ')[1] : null;
    if(!token) token = req.header(process.env.AUTH_TOKEN_KEY_HEADER);

    return token
}

const verify = (req, res, next) => {
    // Obtenemos el token del header del request
    let token = req.headers['authorization'];
    /*
    console.log(req.headers);
    console.log(token); 
    */
    token = (token && token.split(' ').length) > 1 ? token.split(' ')[1] : null;
    if(!token) token = req.header(process.env.AUTH_TOKEN_KEY_HEADER);
/*     if(!token) token = req.params[process.env.AUTH_TOKEN_KEY_HEADER];
    if(!token) token = req.query[process.env.AUTH_TOKEN_KEY_HEADER];
    if(!token) token = req.body[process.env.AUTH_TOKEN_KEY_HEADER]; 
 */

    //console.log('token', token)
    // Validamos si no hay token
    if(!token) 
        return res.status(401).json(
            json.getResult(
                'error',
                'Acceso denegado. Token no válido.'
            )
        );

    try {
        //console.log(token);
        // Verificamos el token usando la dependencia de jwt y el método .verify
        //const verified = jwt.verify(token, config.token.tokenSecret);
        // si el token es correcto nos devolvera los datos que pusimos en el token
        req.user = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        //console.log(req.user);
        // next() indica que el req paso la prueba y continue su camino
        next();
    } catch (error){
        return res.status(400).json(
            json.getResult(
                'error',
                'Token no válido. Acceso denegado.'
            )
        )
    }
}

const getTokenJwt = async (user) => {
    let userCheck = {}

/*     console.log({
        "loginprovider": user.provider,
        "loginid": user.id
    }); */
    
    switch(user.provider){
        case 'local':
            userCheck = await userLib.list(
                {
                    "loginprovider": user.provider,
                    "_id": user.id
                }
            )

            if(userCheck.result.length != 0) {
                userCheck.result = userCheck.result[0]
            } 
            break;

        case 'facebook':

/*             console.log({
                "firstname": user._json.first_name,
                "lastname": user._json.last_name,
                "loginprovider": user.provider,
                "loginid": user.id
            }); */
            
            userCheck = await userLib.list(
                {
                    "loginprovider": user.provider,
                    "loginid": user.id
                }
            )
            //console.log('userCheck list ', userCheck, user.id)

            //console.log('auth result fb 1', userCheck, userCheck.type, userCheck.result.length)
            if(userCheck.result.length == 0) {
                userCheck = await userLib.insert({
                    "firstname": user._json.first_name,
                    "lastname": user._json.last_name,
                    "loginprovider": user.provider,
                    "loginid": user.id
                })
                
                //console.log('result fb 2', userCheck)
            } else {
                userCheck.result = userCheck.result[0]
            } 
            break;

        case 'google':

            console.log({
                "firstname": user.name.givenName,
                "lastname": user.name.familyName,
                "loginprovider": user.provider,
                "loginid": user.id,
                "email": ( user.emails.length != 0 ? user.emails[0].value : '')
            });
            
            userCheck = await userLib.list(
                {
                    "loginprovider": user.provider,
                    "loginid": user.id
                }
            )

            //console.log('auth result fb 1', userCheck, userCheck.type, userCheck.result.length)
            if(userCheck.result.length == 0) {
                userCheck = await userLib.insert({
                    "firstname": user.name.givenName,
                    "lastname": user.name.familyName,
                    "loginprovider": user.provider,
                    "loginid": user.id,
                    "email": ( user.emails.length != 0 ? user.emails[0].value : '')
                })
                
                //console.log('result fb 2', userCheck)
            } else {
                userCheck.result = userCheck.result[0]
            } 
            break;

        case 'instagram':
    
            console.log({
                "firstname": user._json.first_name,
                "lastname": user._json.last_name,
                "loginprovider": user.provider,
                "loginid": user.id
            });
            
            userCheck = await userLib.list(
                {
                    "loginprovider": user.provider,
                    "loginid": user.id
                }
            )

            //console.log('auth result fb 1', userCheck, userCheck.type, userCheck.result.length)
            if(userCheck.result.length == 0) {
                userCheck = await userLib.insert({
                    "firstname": user._json.first_name,
                    "lastname": user._json.last_name,
                    "loginprovider": user.provider,
                    "loginid": user.id
                })
                
                //console.log('result fb 2', userCheck)
            } else {
                userCheck.result = userCheck.result[0]
            } 
            break;
    }
    /*  */
    userCheck = userCheck.result;

    if(!userCheck){
        return{
            type: "error",
            details: 'Credenciales de solicitud de token no válidos.'
            };
    }  

    const userId = userCheck._id.toString()
    
    //console.log('jwt sign')
    const token = jwt.sign(
        {
            user: userId,
        }, 
        process.env.AUTH_TOKEN_SECRET,
        { 
            expiresIn: process.env.AUTH_TOKEN_EXPIRE 
        }
    )    

    let login = await loginLib.get({
        userid2: userId
        }
    );
    
    if(login.result.length == 0) {
        login = await loginLib.insert(
            { 
                userid2: userId
            }
        )
    }
    
    const dateLoginEnd = (new Date()).setHours((new Date()).getHours() + 24);
    await loginLib.update(
        { "userid2" : userId },
        { 
            token: token,
            dateloginend: dateLoginEnd,
            statuscod: 0
        }
    )

    return {
        type: "success",
        keyHeader: process.env.AUTH_TOKEN_KEY_HEADER,
        token: {
            token
        },
        user: { ...userCheck.result, token: token }
    };
}

/* const create = (req, callback) => {
    let obj = {};
    if(req.header("apiKey")) {
        obj["apiKey"] = req.header("apiKey");
        if(req.header("context")) obj["context"] = req.header("context");
        if(req.header("user")) obj["user"] = req.header("user");
    };
    if(!obj["apiKey"] && req.params["apiKey"]) obj = req.params;
    if(!obj["apiKey"] && req.query["apiKey"]) obj = req.query;
    if(!obj["apiKey"] && req.body["apiKey"]) obj = req.body;  
    
    if(!obj["apiKey"]){
        callback({
            type: "error",
            details: 'Credenciales de solicitud de token no válidos.'
        }, 401);
        return;
    }  
    
    let { context, user, apiKey} = obj;
    
    const token = jwt.sign({
        context: context,
        user: user,
        apiKey: apiKey        
        }, 
        process.env.AUTH_TOKEN_SECRET,
        { expiresIn: process.env.AUTH_TOKEN_EXPIRE }
    )

    callback({
        type: "ok",
        keyHeader: process.env.AUTH_TOKEN_KEY_HEADER,
        token: {
            token
        },
        message: 'Bienvenido'
    }, 200);
} */

module.exports = {
    //create,
    getToken,
    getTokenJwt,
    verify
}