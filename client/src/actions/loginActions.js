
export const SET_LOGIN_INFO = 'SET_LOGIN_INFO';

export function getSetLoginInfoAction(loginInfo) {
    return { type: SET_LOGIN_INFO, loginInfo: loginInfo }
}

export function doCheckLogin(actions) {

    actions.doServerCall('/api/isLoggedIn',
        (err,res) => {
            // console.log("We got an answer " + JSON.stringify(err) + " " + JSON.stringify(res));
            if (res.body !== 'undefined' && res.body.isLoggedIn) {
                actions.dispatch(getSetLoginInfoAction(res.body.user));

                // then we create a web-Socket-Connection ...
                actions.doWebSocketConnection('ws/counter?token=1234567');

            } else {
                actions.doCloseWebSocketConnection();
                actions.dispatch(getSetLoginInfoAction("not logged in"));
            }

            }
        )
}

export function doTryLogin(actions,username,password) {
    actions.doServerPostCall("/api/login" , { username : username , password : password },
        (err,res) => {
            console.log("Got err " + JSON.stringify(err));
            console.log("Got result " + JSON.stringify(res));

            if (res.body !== 'undefined' && res.body.isLoggedIn) {
                actions.dispatch(getSetLoginInfoAction(res.body.user));

                // then we create a web-Socket-Connection ...
                actions.doWebSocketConnection('ws/counter?token=1234567');

            }
        });

}

export function doLogout(actions) {
    actions.doServerCall("/api/logout" ,
        (err,res) => {
            console.log("Got err " + JSON.stringify(err));
            console.log("Got result " + JSON.stringify(res));

            if (res.body !== 'undefined' && res.body.isLoggedIn) {
                actions.dispatch(getSetLoginInfoAction(res.body.user));

                // then we create a web-Socket-Connection ...
                actions.doWebSocketConnection('ws/counter?token=1234567');
            }

            else {
                actions.doCloseWebSocketConnection();
                actions.dispatch(getSetLoginInfoAction("not logged in"));
            }


    });

}

