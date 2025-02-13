"use client";
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';

const Auth = () => {
    const auth = useAuth();
    const [posted, setPosted] = useState(false);

    const signOutRedirect = () => {
        auth.removeUser()
        const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
        const logoutUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI;
        const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    if (auth.isLoading) {
        return <div></div>;
    }

    if (auth.error) {
        return <div>Auth error... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        let user_exist = localStorage.getItem(auth.user?.profile.sub);
        if (!user_exist && !posted) {
            setPosted(true);
            const sendUserInfo = async () => {
                try {
                    const resp = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${auth.user?.id_token}`
                        },
                        "body": JSON.stringify(auth.user?.profile),
                    });

                    const txt = await resp.text();
                    if(!resp.ok){ 
                        if(resp.status !== 500){
                            console.error("Backend failed: ", txt)
                        }
                    }
                    console.log(resp);
                    if(txt === 'OK'){
                        localStorage.setItem(auth.user?.profile.sub, '1');
                    }
                }catch(e){
                    console.error("Error:", e);
                }
            };
            sendUserInfo();
        }
            // <pre> Hello: {auth.user?.profile.email} </pre>
            // <pre> ID Token: {auth.user?.id_token} </pre>
            // <pre> Access Token: {auth.user?.access_token} </pre>
            // <pre> Refresh Token: {auth.user?.refresh_token} </pre>
        return (
            <button onClick={() => signOutRedirect()}>Sign out</button>
        );
    }

    return (
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
    );
};

export default Auth;
