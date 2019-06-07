import React from 'react';
import ReactDOM from 'react-dom';
import {HttpLink, InMemoryCache, ApolloClient} from 'apollo-client-preset';
import {WebSocketLink} from 'apollo-link-ws';
import {ApolloLink, split} from 'apollo-link';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';
import {getMainDefinition} from 'apollo-utilities';
import App from './App';
import {ApolloProvider} from 'react-apollo';

const AUTH_TOKEN = 'liquid_table';

const tempAdminAccess = {
    'x-hasura-admin-secret' : 'liquidtable'
};

const isDevelopment =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

console.log('isDevelopment', isDevelopment);

const errorLink = onError(({graphQLErrors}) => {
    if (graphQLErrors) graphQLErrors.map(({message}) => console.log(message))
});

const httpLink = ApolloLink.from([
    errorLink,
    new HttpLink({
        uri: process.env.REACT_APP_HOST,
    }),
]);

const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    const tokenValue = localStorage.getItem(AUTH_TOKEN);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: tokenValue ? `Bearer ${tokenValue}` : '',
            // This is just temporary
            ...tempAdminAccess
        },
    }
});

// authenticated httplink
const httpLinkAuth = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_WEBSOCKET_HOST,
    options: {
        reconnect: true,
        connectionParams: {
            authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            // This is just temporary
            headers : {
                ...tempAdminAccess
            }
        },
    },
});

const link = split(
    // split based on operation type
    ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLinkAuth,
);

// apollo client setup
const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    onError: e => {
        console.log('Apollo error', e)
    },
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>,
    document.getElementById('root'),
);
