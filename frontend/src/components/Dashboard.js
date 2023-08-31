// frontend/src/components/Dashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Grid, Typography, Alert } from '@mui/material';
import ChatRoomList from './ChatRoomList';
import SendContactRequestForm from './SendContactRequestForm';
import PendingContactRequestsList from './PendingContactRequestsList';
import CreateGroupConversation from './CreateGroupConversation';
import { useTranslation } from 'react-i18next';
import log from '../utils/logger';
import { ContactListWithFullDetails } from './ContactListWithFullDetails';
import { fetchCurrentUser } from '../redux/actions';

const Dashboard = () => {
    // Using react-i18next for translations
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Extracting relevant pieces of the state
    const { loading, user, error, isLoggedIn } = useSelector((state) => state.user);

    // Fetch current user details if logged in
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isLoggedIn]);

    // Show a loader while the request is in progress
    if (loading) return <CircularProgress />;

    // Handle error by showing an alert and logging it
    if (error) {
        log.error(`GET_CURRENT_USER Error: ${error}`);
        return <Alert severity="error">{t('An error occurred')}</Alert>;
    }

    // Handle case when user data is unavailable
    if (!user) {
        return <div>No user at all...</div>;
    }

    // Render the main dashboard layout
    return (
        <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h2">{t('dashboard')}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h3">
                    {t('welcome')}, {user.username}!
                </Typography>
            </Grid>
            <Grid item>
                <PendingContactRequestsList userId={user.id} />
            </Grid>
            <Grid item>
                <CreateGroupConversation userEmail={user.email} />
            </Grid>
            <Grid item>
                <SendContactRequestForm />
            </Grid>
            <Grid item>
                <ChatRoomList />
            </Grid>
            <Grid item>
                <ContactListWithFullDetails />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
