// frontend\src\App.js
// import React from 'react';
import React, { useState } from 'react';
import {
    BrowserRouter,
    Route,
    Routes,
    Link
} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!document.cookie);

    const { t } = useTranslation();

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            <h1>{t('greeting')}</h1>
            <LanguageSwitcher />
            <BrowserRouter>
                {isLoggedIn ? (
                    <button onClick={handleLogout}>{t('Logout')}</button>
                ) : (
                    <>
                        <Link to="/login">
                            <button>{t('Login')}</button>
                        </Link>
                        <Link to="/signup">
                            <button>{t('Sign Up')}</button>
                        </Link>
                    </>
                )}
                <Routes>
                    <Route path="/signup" element={<Signup onLogin={() => setIsLoggedIn(true)} />} />
                    <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
                    <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
                    <Route path="/chat/:id" element={<ChatRoomViewer />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
