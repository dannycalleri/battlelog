/**
 * Created by danny on 15/01/16.
 */

import React from 'react';
import Utils from '../battlelog/utils.jsx';
import Marked from 'marked';

class Markdown extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            text: ''
        };
    }

    updateMarkdown()
    {
        this.setState({
            text: Marked(this.props.text)
        });
    }

    componentWillUpdate()
    {
        this.updateMarkdown();
    }

    componentDidMount()
    {
        this.updateMarkdown();
    }

    render()
    {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.text}} />
        );
    }
}

export default Markdown;
