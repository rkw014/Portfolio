"use client";
import { useAuth } from 'react-oidc-context';

const Auth = () => {
    const auth = useAuth();

    const signOutRedirect = () => {
        const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
        const logoutUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI ;
        const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        window.auth = auth;
        return (
            <div>
                <pre> Hello: {auth.user?.profile.email} </pre>
                {/* <pre> ID Token: {auth.user?.id_token} </pre>
                <pre> Access Token: {auth.user?.access_token} </pre>
                <pre> Refresh Token: {auth.user?.refresh_token} </pre> */}


                <button onClick={() => auth.removeUser()}>Sign out</button>
            </div>
        );
    }

    return (
        <div className='flex self-center place-self-center flex-col gap-1'>
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
            <button onClick={() => signOutRedirect()}>Sign out</button>
        </div>
    );
};

export default Auth;
