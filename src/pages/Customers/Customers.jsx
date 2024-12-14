import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Card, Form } from 'react-bootstrap';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]); // For search results
  const [totalCustomers, setTotalCustomers] = useState(0); // New state to store total customers count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // Add your token here or retrieve it from local storage or context
  const token = localStorage.getItem('authToken'); // Replace with your actual token

  useEffect(() => {
    // Fetch data from API
    axios
      .get('http://localhost:5050/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the headers
        },
      })
      .then((response) => {
        setCustomers(response.data); // Assuming the data is in the response body
        setFilteredCustomers(response.data); // Initialize filtered data
        setTotalCustomers(response.data.length); // Set total customers count
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Debugging the error
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [token]); // Use token as dependency to re-fetch data if token changes

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = customers.filter((customer) => {
      return (
        (customer.RegedCustomerCode && customer.RegedCustomerCode.toLowerCase().includes(value)) ||
        (customer.RegedBranchCode && customer.RegedBranchCode.toLowerCase().includes(value)) ||
        (customer.RegedMobile && typeof customer.RegedMobile === 'string' && customer.RegedMobile.toLowerCase().includes(value)) ||
        (customer.RegedNIC && customer.RegedNIC.toLowerCase().includes(value))
      );
    });
    setFilteredCustomers(filtered);
  };

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

      {/* Search bar */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Customer Code, Branch Code, Mobile, or NIC"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>

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
          {filteredCustomers.map((customer, index) => (
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
