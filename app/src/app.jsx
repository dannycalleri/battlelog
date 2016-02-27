/**
 * Created by danny on 15/01/16.
 */

import React from 'react';
import { Link } from 'react-router';
import Async from 'async';
import Utils from './battlelog/utils.jsx';

//
import Header from './layout/header.jsx';
import Footer from './layout/footer.jsx';
import Blog from './components/blog.jsx';

class App extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loadedDeps: false
        };
    }

    loadResources()
    {
        Async.parallel({
            index: function(cb){
                $.get("./blog/index.json")
                 .success(function(data){
                     cb(null, data);
                 })
                 .error(function(){
                     cb('error');
                 })
            },
            tags: function(cb){
                $.get("./blog/tags.json")
                 .success(function(data){
                     cb(null, data);
                 })
                 .error(function(){
                     cb('error');
                 })
            }
        }, function(err, data){
            if(err)
            {
                // trigger error
                return;
            }

            Utils.index = data.index;
            Utils.tags = data.tags;
            this.setState({ loadedDeps: true });
        }.bind(this));
    }

    componentDidMount()
    {
        this.loadResources();
    }

    render()
    {
        var content = <div>Loading!</div>;
        if(this.state.loadedDeps)
        {
            content = (
                <div>
                    <Header />
                        { this.props.children }
                    <Footer /> 
                </div>
            );
        }

        return (
            <div>
                { content }
            </div>
        );
    }
}

export default App;
