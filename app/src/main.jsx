/**
 * Created by danny on 13/01/16.
 */

// main.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from './app.jsx';
import Blog from './pages/blog.jsx';

ReactDOM.render((
    <Router history={ createBrowserHistory() }>
        <Route path="/" component={App}>
            <IndexRoute component={Blog} />
            {/*<Route path="*" component={NoMatch}/>*/}
        </Route>
    </Router>
), document.getElementById('app'));
