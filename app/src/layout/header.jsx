/**
 * Created by danny on 15/01/16.
 */

import React from 'react';

class Header extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {

    }

    render()
    {
        return (
            <header>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>Battlelog <small>A ReactJS blog powered by GitHub gists</small></h1>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
