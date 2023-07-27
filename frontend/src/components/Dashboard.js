// Path: frontend\src\components\dashboardUtils.js

import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Grid, CircularProgress, Alert } from '@mui/material';
import ChatList from "./ChatList";
import SendContactRequest from "./SendContactRequest";
import ContactRequests from "./ContactRequests";
import CreateGroupConversation from "./CreateGroupConversation";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";

import log from '../utils/logger'; // Imported the custom logger

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;

const Dashboard = ({ handleLogout }) => {
    const {t} = useTranslation();
    const { loading, error, data } = useQuery(GET_CURRENT_USER);

    if (loading) return <CircularProgress />;
    if (error) {
        log.error(`GET_CURRENT_USER Error: ${error.message}`); // Replaced console.error with custom logger
        return <Alert severity="error">GET_CURRENT_USER Error: {error.message}</Alert>; // Keep error message display
    }

    const { getCurrentUser } = data;

    return (
        <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h2">{t('dashboard')}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">{t('welcome')}, {getCurrentUser.email}!</Typography>
                <Typography variant="body1">{t('yourUserIdIs')}{getCurrentUser.id}</Typography>
            </Grid>
            <Grid item>
                <ContactRequests userId={getCurrentUser.id} />
            </Grid>
            <Grid item>
                <CreateGroupConversation userEmail={getCurrentUser.email} />
            </Grid>
            <Grid item>
                <SendContactRequest />
            </Grid>
            <Grid item>
                <ChatList />
            </Grid>
        </Grid>
    );
};

export default Dashboard;

// I replaced instances of console.error with our custom logger. The Alert component remains to handle user notifications in case of errors.
