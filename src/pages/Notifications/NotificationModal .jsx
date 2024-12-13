import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NotificationModel = ({ show, handleClose, handleChange, handleSave, notificationData, editingNotification }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingNotification ? 'Edit Notification' : 'Add New Notification'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={notificationData.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={notificationData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </Form.Group>
          <Form.Group controlId="formUrl">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              name="url"
              value={notificationData.url}
              onChange={handleChange}
              placeholder="Enter URL"
            />
          </Form.Group>
          <Form.Group controlId="formImageUrl">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={notificationData.imageUrl}
              onChange={handleChange}
              placeholder="Enter Image URL"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {editingNotification ? 'Update Notification' : 'Add Notification'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModel;
