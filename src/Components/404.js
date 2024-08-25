import React, {Component} from 'react';
import PageNotFound from '../Images/readingtunic.jpg';
import {NavLink} from "react-router-dom";

class PageNotFoundError extends Component
{
    render()
    {
        return (
            <div>
                <img alt="404 tunic" src={PageNotFound}/>
                <h1>404 Page Non Trouvée !</h1>
                <h2>On dirait que vous êtes allé un peu trop loin dans vos aventures.</h2>
                <NavLink to="/">
                    Retour à la maison
                </NavLink>
            </div>
        );
    }
}

export default PageNotFoundError;
