/**
 * Created by danny on 15/01/16.
 */

import React from 'react';
import Utils from '../battlelog/utils.jsx';
import Markdown from './markdown.jsx';
import moment from 'moment';

class Post extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            text: '',
            loadingFinished: false
        };
    }

    componentDidMount()
    {
        Utils.getGistContentWithId(this.props.gistId, function(err,data){
            if(err)
            {
                this.setState({
                    text: err.error
                });
                return;
            }

            this.setState({
                loadingFinished: true,
                text: data
            });

        }.bind(this));
    }

    render()
    {
        return (
            <div className="post">
                <header>
                    <h2 className="post-title">
                        <a href={ this.props.slug }>{this.props.title}</a>
                    </h2>
                    <small className="date">{ moment(this.props.date).format('ll') } </small>
                    in
                    <span className="tags">
                        {
                            this.props.tags.map(function(t,i){
                                return <span key={i} className="label label-default">{t}</span>
                            })
                        }
                    </span>
                </header>
                
                <span className="loading"></span>
                
                {
                    this.state.loadingFinished ? 
                            <Markdown text={ this.state.text } />
                        :
                            <span className="loading"></span>
                }
            </div>
        );
    }
}

export default Post;
