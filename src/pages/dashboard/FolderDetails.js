import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './FolderDetails.css';

function FolderDetails() {
  const { folderName } = useParams(); 
  const { user } = useAuth0();
  const [folder, setFolder] = useState([]); 
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate('/dashboard');
}
  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await fetch(`https://smart-demo1.ue.r.appspot.com/api/get-folder?email=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        const selectedFolder = data.find(folder => folder.name === folderName);
        setFolder(selectedFolder ? selectedFolder.items : []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchFolder();
    }
  }, [user, folderName]);

  const deleteGeneratedItem = async (folderName, itemIndex) => {
    try {
      const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/delete-generate", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          folderName,
          itemIndex
        })
      });
      if (response.ok) {
        setMessage("Generated item deleted");
        setFolder(prevContents => prevContents.filter((_, index) => index !== itemIndex));
      } else {
        setMessage("Something went wrong with deleting the item");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="folder-details-page">
      <h1>Contents of {folderName}</h1>
      <div className="folder-contents">
        {folder.length > 0 ? (
          folder.map((item, index) => (
            <div key={index} className="folder-item-details">
              <h4>Generation #{index + 1}</h4>
              <button onClick={() => deleteGeneratedItem(folderName, index)}>Delete</button>
              <div className="context_text_folder">
                <h2>Generated Text:</h2>
                <p>{item.generatedText}</p>
              </div>
              <div className="feedback-section">
                <div className="feedback-item">
                  <h2>Feedback:</h2>
                  <p>{item.feedback}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='no_items'>
            <p className='empty'>No items found in this folder.</p>
            <button onClick={handleDashboard} className='back_to_dash'>Dashboard</button>
          </div>
        )}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FolderDetails;