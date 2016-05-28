/**
 * Created by danny on 15/01/16.
 */

import React from 'react';
import Utils from '../battlelog/utils.jsx';
import Post from '../components/post.jsx';

class Blog extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            posts: []
        };
        
        this.getPosts = this.getPosts.bind(this);
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
    
    getPosts(n)
    {
        var posts = this.state.posts;
        n = typeof n !== "undefined" ? n : posts.length;
        posts.slice(0,n);
        
        return posts.map(function(p,i){
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
        });
    }

    render()
    {
        return (
            <div id="main" className="container">
                <div className="row">
                    <div className="col-xs-12">
                        { this.getPosts() }
                    </div>
                </div>
            </div>
        );
    }
}

export default Blog;
