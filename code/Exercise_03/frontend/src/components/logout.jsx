import { GoogleLogout } from '@leecheuk/react-google-login';

// with reference to https://www.youtube.com/watch?v=HtJKUQXmtok&t=172s

const clientId = "819894863579-nlh5evpomia8q6h7mn1h2j5m1ocpetl7.apps.googleusercontent.com";

function Logout() {

    const onSuccess = () => {
        console.log("Logout Successful");
    }

    return (
        <div id = "signOutButton">
        <GoogleLogout
            clientId = {clientId}
            buttonText = {"Logout"}
            onLogoutSuccess = {onSuccess}
            />
        </div>
    )

}

export default Logout;