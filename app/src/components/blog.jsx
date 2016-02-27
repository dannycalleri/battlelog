/**
 * Created by danny on 15/01/16.
 */

import React from 'react';
import Utils from '../battlelog/utils.jsx';
import Post from './post.jsx';

class Blog extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            posts: []
        };
    }

    componentDidMount()
    {
        console.log(Utils.index);
        console.log(Utils.tags);

        var posts = [];
        for(var post in Utils.index)
        {
            var p = {};
            p.slug = post;
            for(var prop in Utils.index[post])
            {
                p[prop] = Utils.index[post][prop];
            }

            posts.push(p);
        }

        this.setState({
            posts: posts
        });
    }

    render()
    {
        return (
            <div id="main" className="container">
                <div className="row">
                    <div className="col-xs-12">
                        {
                            this.state.posts.map(function(p,i){
                                return (
                                    <Post
                                        key={i}
                                        gistId={ p.id }
                                        date={ p.date }
                                        tags={ p.tags }
                                        title={ p.title }
                                        slug={ p.slug }
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Blog;
