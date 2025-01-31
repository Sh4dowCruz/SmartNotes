import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './User.css';

const User = () => {
  const { nickname } = useParams();
  const [userData, setUserData] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://smart-demo1.ue.r.appspot.com/api/user/${nickname}`);
        setFolders(response.data.folders)
        setUserData(response.data);
        setIsPrivate(response.data.publicProfile);
      } catch (error) {
        console.error(`Error fetching for ${nickname}:`, error);
      }
    };

    fetchData();
  }, [nickname]);

  const getFolders = async(email) => {
    try {
      const response = await fetch(`https://smart-demo1.ue.r.appspot.com/api/get-folder?email=${encodeURIComponent(email)}`, {
        method: "GET",
      });
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.log("Error:", error);
    }
  }

return (
  <div className='maindiv'>
    {isPrivate ? (
      <>
      <div className='table-container-user'>
      <div className="users-header-user">
        <div className="users-info-user">
          {userData.avatar && <img src={userData.avatar} alt={userData.nickname} className="avatar-image-user" />}
          <h3>Hello, I'm {userData.nickname}!</h3>
          <div className="user-bio-user">
          <p>{userData.bio}</p>
          </div>
        </div>
        </div>
        </div>
        <div className="folders-user">
        <h2 className="folder-heading-user">Folders:</h2>
        <div className="folders-container-user">
            {folders.map((folder, index) => (
              <div key={index}>
                <h2>{folder.name}</h2>
                <ul>
                  {folder.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {Object.keys(item).map((key, textIndex) => (
                        <p key={textIndex}> {item[key]} </p>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
        </div>
      </>
    ) : (
      <div className='private_body'>
        <div className='message'>
          <p>The user you have searched has their profile hidden.</p>
        </div>
      </div>
    )}
  </div>
);
}
export default User;