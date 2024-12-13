import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const SendNotificationModel = ({
  show,
  handleClose,
  handleSendNotification,
  handleSendNotificationChange,
  sendNotificationData,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send Notification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="customerId">
            <Form.Label>Customer ID</Form.Label>
            <Form.Control
              type="text"
              name="customerId"
              value={sendNotificationData.customerId}
              onChange={handleSendNotificationChange}
              placeholder="Enter Customer ID"
            />
          </Form.Group>

          <Form.Group controlId="notificationId" className="mt-3">
            <Form.Label>Notification ID</Form.Label>
            <Form.Control
              type="text"
              name="notificationId"
              value={sendNotificationData.notificationId}
              onChange={handleSendNotificationChange}
              placeholder="Enter Notification ID"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSendNotification}>
          Send Notification
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendNotificationModel;
