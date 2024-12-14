import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import PromotionModal from "./PromotionModal";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [show, setShow] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [promotionData, setPromotionData] = useState({
    Title: "",
    Description: "",
    StartDate: "",
    EndDate: "",
    ImagePath: "", // This will hold a file reference for uploading
  });

  // Modal Handlers
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setEditingPromotion(false);
    setPromotionData({
      Title: "",
      Description: "",
      StartDate: "",
      EndDate: "",
      ImagePath: "",
    });
  };

  // Fetch promotions on component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve authToken from localStorage
      const response = await axios.get("http://localhost:5050/api/promotions", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setPromotions(response.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  // Format date to a readable string (e.g., "MM/DD/YYYY")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle input change in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionData({ ...promotionData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPromotionData({ ...promotionData, [name]: files[0] });
  };

  // Edit promotion
  const handleEditPromotion = (id) => {
    const promotion = promotions.find((p) => p.id === id);
    if (promotion) {
      setCurrentPromotion(promotion);  // Store the selected promotion in the state
      setPromotionData({
        Title: promotion.Title,
        Description: promotion.Description,
        StartDate: promotion.StartDate,
        EndDate: promotion.EndDate,
        ImagePath: promotion.ImagePath,  // Keep the existing image path for editing
      });
      setEditingPromotion(true);  // Set the editing state to true
      handleShow();  // Show the modal
    }
  };

  // Save promotion (Create or Update)
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("Title", promotionData.Title);
    formData.append("Description", promotionData.Description);
    formData.append("StartDate", new Date(promotionData.StartDate).toISOString().split('T')[0]); // Ensure proper date format
    formData.append("EndDate", new Date(promotionData.EndDate).toISOString().split('T')[0]); // Same for EndDate
    if (promotionData.ImagePath) {
      formData.append("ImagePath", promotionData.ImagePath); // Append the file if provided
    }

    try {
      const token = localStorage.getItem("authToken"); // Retrieve authToken from localStorage
      let response;
      if (editingPromotion) {
        // Update promotion if editing
        response = await axios.put(
          `http://localhost:5050/api/promotions/${currentPromotion.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Promotion Updated!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Create new promotion
        response = await axios.post(
          "http://localhost:5050/api/promotions",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Promotion Added!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      console.log("Promotion saved successfully", response.data);
      handleClose();
      fetchPromotions();
    } catch (error) {
      console.error("Error saving promotion:", error.response ? error.response.data : error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error saving the promotion.",
      });
    }
  };

  // Delete promotion
  const handleDeletePromotion = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("authToken"); // Retrieve authToken from localStorage
          await axios.delete(`http://localhost:5050/api/promotions/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          });
          Swal.fire({
            icon: "success",
            title: "Promotion Deleted!",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchPromotions();
        } catch (error) {
          console.error("Error deleting promotion:", error);
        }
      }
    });
  };

  return (
    <div className="page">
      <h1>Promotions</h1>
      <p>Manage your Promotions here.</p>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add Promotion
      </Button>

      {/* Promotions Table */}
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
              <td>{promotion.Title || "N/A"}</td>
              <td>{promotion.Description || "N/A"}</td>
              <td>{formatDate(promotion.StartDate) || "N/A"}</td>
              <td>{formatDate(promotion.EndDate) || "N/A"}</td>
              <td>
                <img
                  src={`${promotion.ImagePath}`}
                  alt="Promotion"
                  style={{ width: "200px", height: "auto", marginBottom: "10px" }}
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeletePromotion(promotion.Id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Promotion Modal */}
      <PromotionModal
        show={show}
        handleClose={handleClose}
        promotionData={promotionData}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSave={handleSave}
        editingPromotion={editingPromotion}
      />
    </div>
  );
};

export default Promotions;
