import React from "react";
import { Link } from 'react-router-dom';
import './FolderCard.css'

export const FolderCard = ({
    folderSrc,
    folderAlt,
    folderTitle,
    folderLink,
}) => {
    return ( 
    <div className="folder-card-container">
        <Link to={folderLink} className="folder-card-link">
        <div className="folder-card">
            <img src={folderSrc} alt={folderAlt}/>
            <div className="folder-card-contentt"> 
            </div>
            <div className="btonn">{folderTitle}</div>
        </div>
        </Link>
    </div>
    );
}
