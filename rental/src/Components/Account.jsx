import React, { useState } from "react";
import "../css/Account.css";
import { useAuth } from "../Components/admin/AuthProvider";
import { User, CreditCard, BellIcon } from "lucide-react";

function Account() {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tenantInfo, setTenantInfo] = useState({
    username: "JohnDoe",
    name: "John Doe",
    apartmentNumber: "305",
    moveInDate: "2023-06-15",
    leaseEndDate: "2024-06-15",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  });

  const [balances, setBalances] = useState({
    rentBalance: 1500,
    notifications: 5
  });

  const [editableInfo, setEditableInfo] = useState({
    name: tenantInfo.name,
    email: tenantInfo.email,
    phone: tenantInfo.phone,
    moveInDate: tenantInfo.moveInDate,
    leaseEndDate: tenantInfo.leaseEndDate,
  });

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo({ ...editableInfo, [name]: value });
  };

  const saveDetails = () => {
    setTenantInfo((prev) => ({ ...prev, ...editableInfo }));
    setIsEditing(false);
  };

  return (
    <div className="account-page-container">
      <div className="profile-section">
        <div className="profile-picture-container">
          <input 
            type="file" 
            id="profile-picture-upload" 
            accept="image/*" 
            onChange={handleProfilePictureChange}
            className="profile-picture-input"
          />
          <label htmlFor="profile-picture-upload" className="profile-picture-label">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                <User size={80} />
                <span>Upload Photo</span>
              </div>
            )}
          </label>
        </div>
        <h2 className="account-title">{tenantInfo.name}</h2>
      </div>

      <div className="balance-cards-container">
        <div className="balance-card rent-balance">
          <CreditCard />
          <div className="balance-details">
            <h3>Rent Balance</h3>
            <p>Ksh: {user?.userdata?.balance}</p>
          </div>
        </div>
        <div className="balance-card rent-balance">
          <BellIcon />
          <div className="balance-details">
            <h3>Notifications</h3>
            <p>{balances.notifications }</p>
          </div>
        </div>
      </div>

      <div className="account-details-card">
        <div className="detail-item">
          <span className="label">Username:</span>
          <span className="value">{tenantInfo.username}</span>
        </div>
        <div className="detail-item">
          <span className="label">Name:</span>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editableInfo.name}
              onChange={handleChange}
            />
          ) : (
            <span className="value">{tenantInfo.name}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="label">Apartment Number:</span>
          <span className="value">{tenantInfo.apartmentNumber}</span>
        </div>
        <div className="detail-item">
          <span className="label">Email:</span>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editableInfo.email}
              onChange={handleChange}
            />
          ) : (
            <span className="value">{tenantInfo.email}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="label">Phone:</span>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={editableInfo.phone}
              onChange={handleChange}
            />
          ) : (
            <span className="value">{tenantInfo.phone}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="label">Move-in Date:</span>
          {isEditing ? (
            <input
              type="date"
              name="moveInDate"
              value={editableInfo.moveInDate}
              onChange={handleChange}
            />
          ) : (
            <span className="value">{tenantInfo.moveInDate}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="label">Lease End Date:</span>
          {isEditing ? (
            <input
              type="date"
              name="leaseEndDate"
              value={editableInfo.leaseEndDate}
              onChange={handleChange}
            />
          ) : (
            <span className="value">{tenantInfo.leaseEndDate}</span>
          )}
        </div>
        <div className="button-container">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={saveDetails}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;