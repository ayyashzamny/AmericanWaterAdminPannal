import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotificationModel from './NotificationModal ';
import SendNotificationModel from './SendNotificationModal';
import SendAllNotificationModal from './SendAllModel';
import axios from 'axios';

const Notifications = () => {
  const [showModal, setShowModal] = useState(false);
  const [sendNotificationModal, setSendNotificationModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationData, setNotificationData] = useState({
    title: '',
    description: '',
    url: '',
    imageUrl: '',
  });
  const [sendNotificationData, setSendNotificationData] = useState({
    customerId: '',
    notificationId: '',
  });

  // Retrieve the token (Assuming it's in localStorage)
  const token = localStorage.getItem('authToken');

  // Axios instance with Authorization header
  const axiosInstance = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
    },
  });

  useEffect(() => {
    // Fetch notifications on component mount
    axiosInstance.get('http://localhost:5050/api/notifications')
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch notifications',
          text: 'There was an issue fetching the notifications. Please try again.',
        });
      });
  }, []);

  const handleClose = () => {
    setNotificationData({
      title: '',
      description: '',
      url: '',
      imageUrl: '',
    });
    setShowModal(false);
    setEditingNotification(false);
    setCurrentNotification(null);
  };

  const handleShow = () => setShowModal(true);

  const handleSendNotificationClose = () => setSendNotificationModal(false);
  const handleSendNotificationShow = () => setSendNotificationModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotificationData({ ...notificationData, [name]: value });
  };

  const handleSave = () => {
    const { title, description, url, imageUrl } = notificationData;

    // Add new notification or update existing one
    if (editingNotification && currentNotification) {
      // Update the notification
      axiosInstance.put(`http://localhost:5050/api/notifications/${currentNotification.id}`, { title, description, url, imageUrl })
        .then((response) => {
          const updatedNotifications = notifications.map((notification) =>
            notification.id === currentNotification.id ? { ...notification, ...notificationData } : notification
          );
          setNotifications(updatedNotifications);
          Swal.fire({
            icon: 'success',
            title: 'Notification Updated!',
            showConfirmButton: false,
            timer: 1500,
          });
          handleClose();
        })
        .catch((error) => {
          console.error('Error updating notification:', error);
          Swal.fire({
            icon: 'error',
            title: 'Failed to Update Notification',
            text: 'There was an issue updating the notification. Please try again.',
          });
        });
    } else {
      // Add new notification
      axiosInstance.post('http://localhost:5050/api/notifications', { title, description, url, imageUrl })
        .then((response) => {
          setNotifications([...notifications, response.data]);
          Swal.fire({
            icon: 'success',
            title: 'Notification Added!',
            showConfirmButton: false,
            timer: 1500,
          });
          handleClose();
        })
        .catch((error) => {
          console.error('Error adding notification:', error);
          Swal.fire({
            icon: 'error',
            title: 'Failed to Add Notification',
            text: 'There was an issue adding the notification. Please try again.',
          });
        });
    }
  };

  const handleEditNotification = (id) => {
    const notification = notifications.find((n) => n.id === id);
    setCurrentNotification(notification);
    setNotificationData(notification);
    setEditingNotification(true);
    handleShow();
  };

  const handleDeleteNotification = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance.delete(`http://localhost:5050/api/notifications/${id}`)
          .then((response) => {
            setNotifications(notifications.filter((notification) => notification.id !== id));
            Swal.fire({ // Alert the user
              icon: 'success',
              title: 'Deleted!',
              text: 'The notification has been deleted.',
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => { // Handle error
            console.error('Error deleting notification:', error);
            Swal.fire({
              icon: 'error',
              title: 'Failed to Delete Notification',
              text: 'There was an issue deleting the notification. Please try again.',
            });
          });
      }
    });
  };

  const handleSendNotification = () => { // Send notification to a specific user
    const { customerId, notificationId } = sendNotificationData;

    if (!customerId || !notificationId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please provide both CustomerId and NotificationId',
      });
      return;
    }

    axiosInstance.post(`http://20.244.30.170/api/FirebasePushNotifications/sendToUser`, null, {
      params: {
        CustomerId: customerId,
        NotificationId: notificationId,
      },
    })
      .then((response) => {
        if (response.data && response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Notification Sent!',
            text: 'The notification has been successfully sent.',
          });
          handleSendNotificationClose();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to Send Notification',
            text: 'There was an issue sending the notification. Please try again.',
          });
        }
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Send Notification',
          text: 'There was an issue sending the notification. Please check your connection and try again.',
        });
        handleSendNotificationClose();
      });
  };

  const handleSendNotificationChange = (e) => {
    const { name, value } = e.target;
    setSendNotificationData({ ...sendNotificationData, [name]: value });
  };

  return (
    <div>
      <h1 className="mb-4">Notifications</h1>
      <p >Manage your Notifications here.</p>
      <Button variant="primary" onClick={handleShow} className="me-3">
        Add New Notification
      </Button>
      <Button variant="secondary" onClick={handleSendNotificationShow} className="me-3">
        Send Notification
      </Button>
      <Button variant="dark" onClick={handleSendNotificationShow}>
        Send Notification ALL
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Notification ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Image URL</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td>{notification.id}</td>
              <td>{notification.title}</td>
              <td>{notification.description}</td>
              <td>
                {/* Displaying image */}
                {notification.imageUrl ? (
                  <img
                    src={notification.imageUrl}
                    alt={notification.title}
                    style={{ width: '100px', height: 'auto' }} // Adjust image size if needed
                  />
                ) : (
                  'No image available'
                )}
              </td>
              <td>
                {/* Make the URL clickable */}
                {notification.url ? (
                  <a href={notification.url} target="_blank" rel="noopener noreferrer">
                    Visit Link
                  </a>
                ) : (
                  'No link available'
                )}
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteNotification(notification.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <NotificationModel
        show={showModal}
        handleClose={handleClose}
        handleChange={handleChange}
        handleSave={handleSave}
        notificationData={notificationData}
        editingNotification={editingNotification}
      />

      <SendNotificationModel
        show={sendNotificationModal}
        handleClose={handleSendNotificationClose}
        handleSendNotification={handleSendNotification}
        handleSendNotificationChange={handleSendNotificationChange}
        sendNotificationData={sendNotificationData}
      />
    </div>
  );
};

export default Notifications;
