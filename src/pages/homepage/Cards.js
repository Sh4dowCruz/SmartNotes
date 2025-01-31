import React from "react";
import { Link } from 'react-router-dom';
import "./Cards.css"

export const Cards = ({
    imgSrc,
    imgAlt,
    CardTitle,
    CardDescription,
}) => {
    return ( 
        <div className="card_containerr">
            <div className="cardss">
                <img src={imgSrc} alt={imgAlt}/>
                <div className="card_contentt">
                    <h1>{CardTitle}</h1>
                    <p>{CardDescription}</p>
                    <Link to="/generate" className="buton">Generate</Link>
                </div>
            </div>
        </div>
    );
}