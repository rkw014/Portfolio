"use client"; // 客户端组件

import { useAuth } from "react-oidc-context";

const LoginButton = () => {
    const auth = useAuth();

    return <button onClick={() => auth.signinRedirect()}>Sign in</button>;
};

export default LoginButton;
