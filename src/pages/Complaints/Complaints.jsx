import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from "react-bootstrap"; // Import Row and Col here

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]); // Added state for filtered complaints
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    Resolved: 0,
    'In Progress': 0,
    Rejected: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState(""); // Added state for selected status

  // Fetch complaints data
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/complaints'); // Replace with your API endpoint
        const complaintsData = response.data;
        setComplaints(complaintsData); // Assuming API returns an array of complaints
        setFilteredRequests(complaintsData); // Set filteredRequests to all complaints initially
        updateStatusCounts(complaintsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load complaints data.',
        });
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Update status counts
  const updateStatusCounts = (complaintsData) => {
    const counts = {
      Pending: 0,
      Resolved: 0,
      'In Progress': 0,
      Rejected: 0,
    };
    complaintsData.forEach((complaint) => {
      if (counts[complaint.Status] !== undefined) {
        counts[complaint.Status] += 1;
      }
    });
    setStatusCounts(counts);
  };

  // Function to handle status filter
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === "") {
      setFilteredRequests(complaints); // Show all requests if no status is selected
    } else {
      setFilteredRequests(
        complaints.filter((request) => request.Status === status)
      );
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5050/api/complaints/status/${complaintId}`,
        {
          Status: newStatus, // Send only the new status
        }
      );

      // Update status in the state without refetching data
      const updatedComplaints = complaints.map((complaint) =>
        complaint.Id === complaintId ? { ...complaint, Status: newStatus } : complaint
      );
      setComplaints(updatedComplaints);
      updateStatusCounts(updatedComplaints);

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Complaint status has been updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update complaint status.',
      });
    }
  };

  return (
    <div className="page">
      <h1 className="mb-4">Complaints</h1>
      <p>Manage your Complaints here.</p>

      <Row className="mb-4">
        <Col md={3}>
          <Card
            border="secondary"
            className="shadow-sm"
            onClick={() => handleStatusFilter("Pending")}
          >
            <Card.Body className="text-center">
              <h6 className="card-title mb-1">Pending</h6>
              <p className="card-text h5">
                {statusCounts.Pending || 0}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            border="secondary"
            className="shadow-sm"
            onClick={() => handleStatusFilter("Resolved")}
          >
            <Card.Body className="text-center">
              <h6 className="card-title mb-1">Resolved</h6>
              <p className="card-text h5">
                {statusCounts.Resolved || 0}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            border="secondary"
            className="shadow-sm"
            onClick={() => handleStatusFilter("In Progress")}
          >
            <Card.Body className="text-center">
              <h6 className="card-title mb-1">In Progress</h6>
              <p className="card-text h5">
                {statusCounts["In Progress"] || 0}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            border="secondary"
            className="shadow-sm"
            onClick={() => handleStatusFilter("Rejected")}
          >
            <Card.Body className="text-center">
              <h6 className="card-title mb-1">Rejected</h6>
              <p className="card-text h5">
                {statusCounts.Rejected || 0}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <p>Loading complaints...</p>
      ) : filteredRequests.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Main Category</th>
              <th>Sub Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Resolved At</th>
              <th>Created At</th>
              <th>Assigned To</th>
              <th>Remarks</th>
              <th>Customer Code</th>
              <th>Branch Code</th>
              <th>Resolved By</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((complaint) => (
              <tr key={complaint.Id}>
                <td>{complaint.Id}</td>
                <td>{complaint.MainCategory}</td>
                <td>{complaint.SubCategory}</td>
                <td>{complaint.Description}</td>
                <td>
                  <Form.Control
                    as="select"
                    value={complaint.Status}
                    onChange={(e) => handleStatusChange(complaint.Id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Control>
                </td>
                <td>{complaint.ResolvedAt ? new Date(complaint.ResolvedAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                <td>{new Date(complaint.CreatedAt).toLocaleDateString('en-GB')}</td>
                <td>{complaint.AssignedToAdminId}</td>
                <td>{complaint.Remarks}</td>
                <td>{complaint.Customer_code}</td>
                <td>{complaint.Branch_code}</td>
                <td>{complaint.ResolvedBy}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
};

export default Complaints;
