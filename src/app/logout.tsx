import { Redirect } from "expo-router";

// Cognito's sign out redirects to proyectosmodulares://logout. The browser session catches it,
// but on Android the deep link also reaches the router, so it lands here and goes to the login.
export default function LogoutRedirect() {
    return <Redirect href="/login" />;
}
