import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase';
import {
  EmailAuthProvider,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setDisplayName(firebaseUser.displayName || '');
        setEmail(firebaseUser.email || '');
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!user || !currentPassword) {
      alert('User not loaded or current password missing.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Only update if something changed
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (newPassword.trim() !== '') {
        await updatePassword(user, newPassword);
      }

      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Update failed:', error.code, error.message);

      let msg = 'Error updating profile. Please check your inputs.';
      if (error.code === 'auth/wrong-password') {
        msg = 'Incorrect current password.';
      } else if (error.code === 'auth/requires-recent-login') {
        msg = 'Please log out and log back in to perform this action.';
      }

      alert(msg);
    }
  };

  if (loading) {
    return <div className="update-container">Loading user...</div>;
  }

  return (
    <div className="update-container">
      <h2>Update Profile</h2>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="New Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="New Email"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
      />
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter Current Password to Confirm"
      />
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
};

export default UpdateProfile;
