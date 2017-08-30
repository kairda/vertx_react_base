
export const SET_LOGIN_INFO = 'SET_LOGIN_INFO';

export const NOT_LOGGED_IN = "not logged in";

export function getSetLoginInfoAction(isLoggedIn,loginInfo) {
    return { type: SET_LOGIN_INFO, isLoggedIn : isLoggedIn, loginInfo: loginInfo }
}


function handleLoginResult(actions,err,res) {
    // console.log("We got an answer " + JSON.stringify(err) + " " + JSON.stringify(res));
    if (res && res !== 'undefined' && res.body && res.body !== 'undefined' && res.body.isLoggedIn) {
        actions.dispatch(getSetLoginInfoAction(true,JSON.stringify(res.body.user)));
        // then we create a web-Socket-Connection ...
        actions.doWebSocketConnection('ws/counter?token=' + res.body.sessionid);

    } else {
        actions.doCloseWebSocketConnection();
        actions.dispatch(getSetLoginInfoAction(false,NOT_LOGGED_IN));
    }

}
// This function is called only once at the very beginning of the
// life-cycle.
// it checkts, if we are already logged in somewhere else (through a
// still valid session, for example.
// if there is a valid session, then a websocket connection is
// established.
export function doCheckLogin(actions) {

    actions.doServerCall('/api/isLoggedIn',
        (err,res) => { handleLoginResult(actions, err,res); } );
}

// tries to login with the given credentials
export function doTryLogin(actions,loginInfo, username,password) {
    console.log("doTryLogin called with loginInfo " + JSON.stringify(loginInfo));

    if (isLoggedIn(loginInfo)) {
        console.log("Do not retry a login while we are still logged in ");
        return;
    }
    // we only try to login, if we are not already logged in ...
    actions.doServerPostCall("/api/login" , { username : username , password : password },
        (err,res) => { handleLoginResult(actions, err,res); } );
}

export function doLogout(actions,loginInfo) {
    if (!isLoggedIn(loginInfo)) {
        console.log("Do not accept a logout, if not logged in in the first place " + loginInfo);
        return;
    }
    actions.doServerCall("/api/logout" ,
        (err,res) => { handleLoginResult(actions, err,res); } );

}

export function isLoggedIn(loginInfo) {
    var isLoggedInRet = (loginInfo !== NOT_LOGGED_IN );
    console.log("isLoggedIn for " + loginInfo + " returns " + isLoggedInRet);
    return isLoggedInRet;
}