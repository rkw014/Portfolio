"use client";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "../../config/authConfig.js";


export default function AuthWrapper({children}) {
    return (
    <AuthProvider {...cognitoAuthConfig}>
        {children}
    </AuthProvider>
    );
}