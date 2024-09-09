import { GoogleLogin } from 'react-google-login'

const clientID = "819894863579-nlh5evpomia8q6h7mn1h2j5m1ocpetl7.apps.googleusercontent.com";

function Login() {

    const onSuccess = (res) => {
        console.log("Login Successful, Current User: ", res.profileObj)
    }

    const onFailure = (res) => {
        console.log("Login Failed. res: ", res)
    }
    return(
        <div id = "signInButton">
            <GoogleLogin
                clientID = {clientID}
                buttonText = "Login"
                onSuccess = {onSuccess}
                onFailure = {onFailure}
                cookiePolicy = {'single_host_origin'}
                isSignedIn = {true}
            />
        </div>
    )
}

export default Login