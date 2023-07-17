// frontend\src\App.js

import React, { useState } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(document.cookie.includes('your_token_name'));

    const { t } = useTranslation();

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            <BrowserRouter>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            {t('greeting')}
                        </Typography>
                        <LanguageSwitcher />
                        {isLoggedIn ? (
                            <Button color="inherit" onClick={handleLogout}>{t('Logout')}</Button>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    {t('Login')}
                                </Button>
                                <Button color="inherit" component={Link} to="/signup">
                                    {t('Sign Up')}
                                </Button>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
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
