import React from 'react';
import './UserProfile.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { FolderCard } from './FolderCard';
import { Link } from 'react-router-dom';
import fol from './imageee.png'
import share from './ShareIcon.png'

function UserProfile({ userData, formState, handleInputChange, handleUpdateSubmit, updateMessage }) {
  const { user } = useAuth0();
  const [folders, setFolders] = useState([]);
  const [openFolder, setOpenFolder] = useState(null);
  const [newFolderName, setFolderName] = useState('');
  const [message, setMessage] = useState('');
  const [isProfilePublic, setProfile] = useState(false);
  const [userHandle, setUserHandle] = useState("");
  
  useEffect(() => {
    if (user) {
      getFolders();
    }
  }, [user]);

  useEffect(() => {
    const getProfilePrivacy = async () => {
      try {
        const response = await fetch(`https://smart-demo1.ue.r.appspot.com/api/check-privacy?email=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        setProfile(data.publicProfile);
      } catch (error) {
        console.error("ERror:", error);
      }
    };
    getProfilePrivacy();
  });

  const handleToggle = async () => {
    const newValue = !isProfilePublic;
    setProfile(newValue);

    try {
      const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/toggle-privacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: user.email,
          publicProfile: newValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile privacy");
      }
    } catch (error) {
      console.error("Error with privacy:", error);
    }
  };

  const getFolders = async() => {
    try {
      const response = await fetch(`https://smart-demo1.ue.r.appspot.com/api/get-folder?email=${encodeURIComponent(user.email)}`, {
        method: "GET",
      });
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const newFolder = async() => {
    try {
      const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/add-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          folderName: newFolderName
        })
      });

      if (response.ok) {
        setMessage("New folder added: " + newFolderName);
        setFolderName("");
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.log("error:", error);

    }
  };

  const deleteFolder = async (folderIndex) => {
    try {
      const response = await fetch(`https://smart-demo1.ue.r.appspot.com/api/delete-folder?email=${encodeURIComponent(user.email)}&folderIndex=${folderIndex}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setMessage("Folder deleted");
        setFolders(folders.filter((_, index) => index !== folderIndex));
      } else {
        console.error("failed to delete folder:");
      }
    } catch (error) {
      console.error("error deleting folder:", error);
    }
  };

  const getUserHandle = async() => {
    try {
      const response = await fetch(`https://smart-demo1.ue.r.appspot.com/api/user-data?email=${encodeURIComponent(user.email)}`, {
        params: {email: user.email},
      });
      const data = await response.json();
      setUserHandle(data.nickname);
      navigator.clipboard.writeText("https://smart-demo1.ue.r.appspot.com/user/" + data.nickname)
      alert("Link copied to clipboard");
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    
    <div className="edit-container">
        <div className="table-container">
        <div className='table-container1'>
        <div className="field-name">
          <label>Username:</label>
          <input
            type="text"
            name="nickname"
            value={formState.nickname}
            onChange={handleInputChange}
            placeholder="Username"
            className='input-field'
          />
        </div>
        <div className="field-avatar">
          <label>Avatar URL:</label>
          <input
            type="text"
            name="avatar"
            value={formState.avatar}
            onChange={handleInputChange}
            placeholder="Link"
            className='input-field'
          />
        </div>
        <div className="field-bio">
            <label>Bio:</label>
            <textarea
                name="bio"
                value={formState.bio}
                onChange={handleInputChange}
                placeholder="Enter Bio"
                className='input-fieldbio'
            />
        </div>
        <button onClick={handleUpdateSubmit} className='update-button'>Update</button>
        <button onClick={handleToggle} className={`privacy-button ${isProfilePublic ? 'public' : 'private'}`}>
          {isProfilePublic ? 'Public Profile' : 'Private Profile'}
        </button>
        </div>
        <div className='profile_share'>
          <button onClick={getUserHandle} className='share_button'>
            <img src={share} alt="share_prof" className='share_b'/>
          </button>
        </div>
        <div className='table-container2'>
          <div className="user-profile">
          <div className="user-header">
          <div className="user-info">
            {formState.avatar && <img src={formState.avatar} alt="Avatar" className="avatar-image"/>}
            <h3>Hello, {userData.nickname || "User!"} </h3>
            <p>{userData.email}</p>
          </div>
          <div className="user-bio">
            <p>{userData.bio || "Add a bio!"}</p>
          </div>
          </div>
          </div>
        </div>
        </div>
        <div className='folder-table'>
        <div className='add-folder'>
          <h2 className='folder-heading'>Add folder</h2>
          <div className='folder-input'>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className='input-field-folder'
            />
            <button onClick={newFolder} className ='confirm'>Confirm</button>
            {message && <p className = 'update-message'>{message}</p>}
          </div>
          </div>
        <div className='folders'>
        <h2 className="folder-heading">Folders:</h2>
        <div className="folders-container">
          {folders.map((folder, index) => (
          <div key={index} className='folder-item'>
            <div className='folder-header'>
              <button onClick={() => deleteFolder(index)} className='delete-folder'>Delete</button>
              <FolderCard
                folderSrc={fol}
                folderAlt='Folder Image'
                folderTitle={<p>{folder.name}</p>}
                folderLink={`/folder-details/${folder.name}`}
              />
            </div>
          </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;