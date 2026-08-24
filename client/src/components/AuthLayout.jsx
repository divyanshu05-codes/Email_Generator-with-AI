import React from "react";

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-page">
            <div className="auth-background" />

            <div className="auth-content">
                <div className="auth-brand">
                    <div className="auth-logo">✉</div>
                    <div>
                        <h1>MailMind AI</h1>
                        <p>Smart Email Generator</p>
                    </div>
                </div>

                <div className="auth-card">
                    {(title || subtitle) && (
                        <div className="auth-header">
                            {title && <h2>{title}</h2>}
                            {subtitle && <p>{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>

                <div className="auth-footer">
                    © {new Date().getFullYear()} MailMind AI. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;