import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Card } from 'react-bootstrap';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0); // New state to store total customers count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    axios
      .get('http://localhost:5050/api/customers')
      .then((response) => {
        setCustomers(response.data); // Assuming the data is in the response body
        setTotalCustomers(response.data.length); // Set total customers count
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Debugging the error
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Customers</h1>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Customers</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Customers</h1>
      <p>Manage your Customers here.</p>

      {/* Box to display total number of customers */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Total Customers: {totalCustomers}</h5>
        </Card.Body>
      </Card>

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
    </div>
  );
};

export default Customers;
