/**
 * Created by danny on 15/01/16.
 */

import React from 'react';

class Footer extends React.Component
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
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <small>Copyright &copy; Danny Calleri 2016</small>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
