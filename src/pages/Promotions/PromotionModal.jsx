import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PromotionModal = ({
  show,
  handleClose,
  promotionData,
  handleChange,
  handleSave,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update the promotionData with the selected file
      handleChange({ target: { name: "ImagePath", value: file } });
    }
  };

  const handleStartDateChange = (e) => {
    // Set the start date first
    handleChange(e);

    // After selecting start date, update the end date min value
    const startDate = e.target.value;
    const endDateInput = document.getElementsByName("EndDate")[0];
    endDateInput.setAttribute("min", startDate);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Promotion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="Title"
              value={promotionData.Title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="Description"
              value={promotionData.Description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formStartDate" className="mt-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="StartDate"
              value={formatDate(promotionData.StartDate)}
              onChange={handleStartDateChange} // Use the new handler for start date
            />
          </Form.Group>

          <Form.Group controlId="formEndDate" className="mt-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="EndDate"
              value={formatDate(promotionData.EndDate)}
              onChange={handleChange}
              min={formatDate(promotionData.StartDate)} // Ensure min is updated dynamically
            />
          </Form.Group>

          <Form.Group controlId="formImagePath" className="mt-3">
            <Form.Label>Image Path</Form.Label>
            <Form.Control
              type="file"
              name="ImagePath"
              onChange={handleFileChange} // Handle file input change
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PromotionModal;
