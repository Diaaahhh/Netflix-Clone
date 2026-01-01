import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import './Profile.css';

const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleProceedToUpdate = async () => {
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      navigate('/update-profile');
    } catch (error) {
      console.error('Password mismatch or error:', error);
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Information</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.displayName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Password:</strong> ********</p>

        <input
          type="password"
          placeholder="Enter your curent password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="update-btn" onClick={handleProceedToUpdate}>Update Profile</button>
      </div>
    </div>
  );
};

export default Profile;
