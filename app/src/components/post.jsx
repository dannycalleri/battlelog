/**
 * Created by danny on 15/01/16.
 */

import React from 'react';
import Utils from '../battlelog/utils.jsx';
import Markdown from './markdown.jsx';

class Post extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            text: ''
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
                text: data
            });

        }.bind(this));
    }

    render()
    {
        return (
            <div>
                <Markdown text={ this.state.text } />
            </div>
        );
    }
}

export default Post;
