import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import  UserProfile  from './UserProfile';
import './Dashboard.css'

function Dashboard() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const [formState, setFormState] = useState({
    nickname: "",
    avatar: "",
    bio: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get("https://smart-demo1.ue.r.appspot.com/api/user-data", {
            params: {email: user.email},
          });
          setUserData(response.data);
          setFormState({
            nickname: response.data.nickname || "",
            avatar: response.data.avatar || "",
            bio: response.data.bio || "",
          });
        } catch (error) {
          setError(error.response ? error.response.data.message : "An error occurred");
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setFormState((prev) => ({...prev, [name]: value}));
  };

  const handleUpdateSubmit = async (event) => {
  event.preventDefault();
  setUpdateMessage("");
  try {
    const response = await axios.patch("https://smart-demo1.ue.r.appspot.com/api/update-user", {
      email: user.email,
      ...formState,
    });
    setUpdateMessage(response.data.message);
    const updatedResponse = await axios.get("https://smart-demo1.ue.r.appspot.com/api/user-data", {
      params: {email: user.email},
    });
    setUserData(updatedResponse.data);
  } catch (error) {
    setUpdateMessage(error.response);
  }
  };
  const handleSignUpClick = () => {
    loginWithRedirect({ screen_hint: 'signup' });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return(
      <>
      <div className='dash-back'>
        <h1>Sign Up to securely store your notes</h1>
        <div className='buton'>
          <button className='btn_sign' onClick={handleSignUpClick}>Sign Up</button>
        </div>
        <div className='persuation'>
          Scan and save your notes to review them at your own time. <br></br>Get ready for study questions that will enhance your learning.
        </div>  
       </div>
      </>
  );
  }

  return (
    isAuthenticated && (
      <UserProfile
        userData={userData}
        formState={formState}
        handleInputChange={handleInputChange}
        handleUpdateSubmit={handleUpdateSubmit}
        updateMessage={updateMessage}
      />
    )
  );
}

export default Dashboard;