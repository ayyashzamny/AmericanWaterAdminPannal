import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const PromotionModal = ({
    show,
    handleClose,
    handleChange,
    handleSave,
    promotionData,
    editingPromotion,
}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            name="title"
                            value={promotionData.title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter description"
                            name="description"
                            value={promotionData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formStartDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="startDate"
                            value={promotionData.startDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEndDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="endDate"
                            value={promotionData.endDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image name or URL"
                            name="image"
                            value={promotionData.image}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    {editingPromotion ? 'Update Promotion' : 'Add Promotion'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PromotionModal;
