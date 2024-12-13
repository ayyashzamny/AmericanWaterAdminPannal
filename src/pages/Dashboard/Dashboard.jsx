// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
 
const Dashboard = () => {
  // Mock data for testing
  const mockRequestsSummary = {
    Pending: 10,
    Approved: 25,
    Rejected: 5,
  };
 
  const mockCustomers = [
    { CusID: 1, RegedCustomerCode: 'CUST001', RegedBranchCode: 'BR001', RegedMobile: '1234567890', RegedNIC: 'NIC001' },
    { CusID: 2, RegedCustomerCode: 'CUST002', RegedBranchCode: 'BR002', RegedMobile: '0987654321', RegedNIC: 'NIC002' },
    { CusID: 3, RegedCustomerCode: 'CUST003', RegedBranchCode: 'BR003', RegedMobile: '1122334455', RegedNIC: 'NIC003' },
    { CusID: 4, RegedCustomerCode: 'CUST004', RegedBranchCode: 'BR004', RegedMobile: '2233445566', RegedNIC: 'NIC004' },
    { CusID: 5, RegedCustomerCode: 'CUST005', RegedBranchCode: 'BR005', RegedMobile: '3344556677', RegedNIC: 'NIC005' },
  ];
 
  const mockTotalCustomers = 50;
  const mockPromotionsCount = 8;
 
  const [requestsSummary, setRequestsSummary] = useState({});
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [promotionsCount, setPromotionsCount] = useState(0);
 
  useEffect(() => {
    // Simulating fetching data
    setRequestsSummary(mockRequestsSummary);
    setCustomers(mockCustomers);
    setTotalCustomers(mockTotalCustomers);
    setPromotionsCount(mockPromotionsCount);
  }, []);
 
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard.</p>
 
      {/* Row 1: Requests Summary */}
      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Requests</Card.Title>
              <Card.Text>{Object.values(requestsSummary).reduce((a, b) => a + b, 0)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {Object.keys(requestsSummary).map((status) => (
          <Col key={status}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>{status}</Card.Title>
                <Card.Text>{requestsSummary[status]}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
 
      {/* Row 2: Customers and Promotions */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Customers</Card.Title>
              <Card.Text>{totalCustomers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Promotions</Card.Title>
              <Card.Text>{promotionsCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
 
      {/* Row 3: Recent Customers */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Last 5 Customers</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Code</th>
                <th>Branch Code</th>
                <th>Mobile</th>
                <th>NIC</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.CusID}>
                  <td>{index + 1}</td>
                  <td>{customer.RegedCustomerCode}</td>
                  <td>{customer.RegedBranchCode}</td>
                  <td>{customer.RegedMobile}</td>
                  <td>{customer.RegedNIC}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};
 
export default Dashboard;