/**
 * Created by danny on 15/01/16.
 */

import React from 'react';
import Utils from '../battlelog/utils.jsx';

class Blog extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        console.log(Utils.index);
        console.log(Utils.tags);
    }

    render()
    {
        return (
            <div id="main" className="container">
                <div className="row">
                    <div className="col-xs-12">
                        Blog posts
                    </div>
                </div>
            </div>
        );
    }
}

export default Blog;
