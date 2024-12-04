import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import PromotionModal from './PromotionModal';

const Promotions = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: 'Holiday Sale',
      description: 'Discounts on all items!',
      startDate: '2024-12-01',
      endDate: '2024-12-25',
      image: 'holiday-sale.jpg',
    },
  ]);
  const [promotionData, setPromotionData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    image: '',
  });

  const handleClose = () => {
    setShowModal(false);
    setEditingPromotion(false);
    setCurrentPromotion(null);
    setPromotionData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      image: '',
    });
  };

  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionData({ ...promotionData, [name]: value });
  };

  const handleSave = () => {
    if (editingPromotion && currentPromotion) {
      const updatedPromotions = promotions.map((promotion) =>
        promotion.id === currentPromotion.id
          ? { ...promotion, ...promotionData }
          : promotion
      );
      setPromotions(updatedPromotions);
    } else {
      const newId = promotions.length + 1;
      setPromotions([...promotions, { id: newId, ...promotionData }]);
    }

    Swal.fire({
      icon: 'success',
      title: editingPromotion ? 'Promotion Updated!' : 'Promotion Added!',
      showConfirmButton: false,
      timer: 1500,
    });

    handleClose();
  };

  const handleEditPromotion = (id) => {
    const promotion = promotions.find((p) => p.id === id);
    setCurrentPromotion(promotion);
    setPromotionData(promotion);
    setEditingPromotion(true);
    handleShow();
  };

  const handleDeletePromotion = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setPromotions(promotions.filter((promotion) => promotion.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The promotion has been deleted.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <div className="page">
      <h1>Promotions</h1>
      <Button variant="primary" className="mb-3" onClick={handleShow}>
        Add New
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion, index) => (
            <tr key={promotion.id}>
              <td>{index + 1}</td>
              <td>{promotion.title}</td>
              <td>{promotion.description}</td>
              <td>{promotion.startDate}</td>
              <td>{promotion.endDate}</td>
              <td>{promotion.image}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEditPromotion(promotion.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePromotion(promotion.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PromotionModal
        show={showModal}
        handleClose={handleClose}
        handleChange={handleChange}
        handleSave={handleSave}
        promotionData={promotionData}
        editingPromotion={editingPromotion}
      />
    </div>
  );
};

export default Promotions;
