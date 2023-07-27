// frontend/src/index.js
import '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import {ApolloProvider} from '@apollo/client';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import apolloClient from './utils/apolloClient';
import theme from './utils/theme'; // Import your custom MUI theme file
import {I18nextProvider} from "react-i18next";
import i18n from './utils/i18n';
import logger from './utils/logger'; // I've imported the logger here

const root = document.getElementById('root');

if (root) {
    ReactDOM.createRoot(root).render(<ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
            <I18nextProvider i18n={i18n}>
                <App/>
            </I18nextProvider>
        </ApolloProvider>
    </ThemeProvider>);
} else {
    // Instead of using console.error, I've used our custom logger to handle the error message
    // console.error('Error: Root element not found.'); // I've commented out the old console.error statement
    logger.error('Error: Root element not found.'); // Here's where I replaced console.error with logger.error
}
