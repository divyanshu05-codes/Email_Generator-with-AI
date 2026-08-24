import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailGenerator from "./pages/EmailGenerator";
import ReplyGenerator from "./pages/ReplyGenerator";
import History from "./pages/History";
import EmailDetails from "./pages/EmailDetails";
import ReplyHistory from "./pages/ReplyHistory";
import Settings from "./pages/Settings";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>

                <Routes>

                    {/* PUBLIC */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />


                    {/* PROTECTED */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<MainLayout />}>

                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/generate"
                                element={<EmailGenerator />}
                            />

                            <Route
                                path="/generate/:id"
                                element={<EmailGenerator />}
                            />

                            <Route
                                path="/reply"
                                element={<ReplyGenerator />}
                            />

                            <Route
                                path="/history"
                                element={<History />}
                            />

                            <Route
                                path="/history/:id"
                                element={<EmailDetails />}
                            />

                            <Route
                                path="/reply-history"
                                element={<ReplyHistory />}
                            />

                            <Route
                                path="/settings"
                                element={<Settings />}
                            />

                        </Route>

                    </Route>


                    {/* DEFAULT */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>

            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;