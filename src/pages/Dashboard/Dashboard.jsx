import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import CountUp from 'react-countup';

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [promotionsCount, setPromotionsCount] = useState(0);
  const [complaintsSummary, setComplaintsSummary] = useState({});
  const [requestsSummary, setRequestsSummary] = useState({});

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    fetchPromotions();
    fetchCustomers();
    fetchComplaints();
    fetchRequests();
  }, []);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/customers', axiosConfig);
      setTotalCustomers(response.data.length);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/promotions', axiosConfig);
      setPromotionsCount(response.data.length);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/complaints', axiosConfig);
      const summary = {
        Pending: response.data.filter((c) => c.Status === 'Pending').length,
        Resolved: response.data.filter((c) => c.Status === 'Resolved').length,
        'In Progress': response.data.filter((c) => c.Status === 'In Progress').length,
        Rejected: response.data.filter((c) => c.Status === 'Rejected').length,
      };
      setComplaintsSummary(summary);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/requests', axiosConfig);
      const summary = {
        Recorded: response.data.filter((r) => r.ReqStatusDesc === 'Recorded').length,
        Completed: response.data.filter((r) => r.ReqStatusDesc === 'Completed').length,
        Rejected: response.data.filter((r) => r.ReqStatusDesc === 'Rejected').length,
        'Forwarded to Marketing': response.data.filter((r) => r.ReqStatusDesc === 'Forwarded To Marketing').length,
        'Forwarded to Operations': response.data.filter((r) => r.ReqStatusDesc === 'Forwarded To Operation').length,
      };
      setRequestsSummary(summary);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Dashboard</h3>

      {/* Main Row */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="p-3">
            <Card.Title>Total Customers</Card.Title>
            <Card.Text className="display-6">
              <CountUp end={totalCustomers} duration={2} />
            </Card.Text>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="p-3">
            <Card.Title>Total Promotions</Card.Title>
            <Card.Text className="display-6">
              <CountUp end={promotionsCount} duration={2} />
            </Card.Text>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card className="p-3">
            <Card.Title>Pending Complaints</Card.Title>
            <Card.Text className="display-6">
              <CountUp end={complaintsSummary.Pending || 0} duration={2} />
            </Card.Text>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="p-3">
            <Card.Title>New Requests</Card.Title>
            <Card.Text className="display-6">
              <CountUp end={requestsSummary.Recorded || 0} duration={2} />
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
