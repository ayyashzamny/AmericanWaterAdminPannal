import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Card, Row, Col, Form } from "react-bootstrap";

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusCounts, setStatusCounts] = useState({});
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {
        // Fetch requests and count the statuses
        const fetchRequests = async () => {
            try {
                const response = await axios.get("http://localhost:5050/api/requests");
                setRequests(response.data);
                setFilteredRequests(response.data);
                setLoading(false);

                // Define the statuses we want to count
                const statuses = [
                    "Recorded",
                    "Completed",
                    "Rejected",
                    "Forwarded To Marketing",
                    "Forwarded To Operation",
                ];

                // Count the number of requests for each status
                const counts = statuses.reduce((acc, status) => {
                    acc[status] = response.data.filter(
                        (request) => request.ReqStatusDesc === status
                    ).length;
                    return acc;
                }, {});

                setStatusCounts(counts);
            } catch (err) {
                console.error("Error fetching requests:", err);
                setError("Failed to fetch requests. Please try again later.");
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Function to apply colors based on status
    const getStatusColor = (status) => {
        switch (status) {
            case "Recorded":
                return "text-info font-weight-bold"; // Blue text, bold
            case "Completed":
                return "text-success font-weight-bold"; // Green text, bold
            case "Rejected":
                return "text-danger font-weight-bold"; // Red text, bold
            case "Forwarded To Marketing":
                return "text-warning font-weight-bold"; // Yellow text, bold
            case "Forwarded To Operation":
                return "text-primary font-weight-bold"; // Blue text, bold
            default:
                return "";
        }
    };

    // Function to handle status filter
    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        if (status === "") {
            setFilteredRequests(requests); // Show all requests if no status is selected
        } else {
            setFilteredRequests(
                requests.filter((request) => request.ReqStatusDesc === status)
            );
        }
    };

    // Function to handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    
        const filtered = requests.filter((request) => {
            const lowerQuery = e.target.value.toLowerCase();
    
            // Convert CusID to string before calling toLowerCase
            const cusID = String(request.CusID).toLowerCase();
            const customerCode = String(request.CustomerCode).toLowerCase();
            const branchCode = String(request.BranchCode).toLowerCase();
    
            return (
                cusID.includes(lowerQuery) ||
                customerCode.includes(lowerQuery) ||
                branchCode.includes(lowerQuery)
            );
        });
    
        setFilteredRequests(filtered);
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <div className="page">
            <h1>Requests</h1>
            <p>Manage your Requests here.</p>

            {/* Status Counts Summary */}
            <Row className="mb-4">
                <Col md={2}>
                    <Card
                        border="secondary"
                        className="shadow-sm"
                        onClick={() => handleStatusFilter("Recorded")}
                    >
                        <Card.Body className="text-center">
                            <h6 className="card-title mb-1">Recorded</h6>
                            <p className="card-text h5">
                                {statusCounts["Recorded"] || 0}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card
                        border="secondary"
                        className="shadow-sm"
                        onClick={() => handleStatusFilter("Completed")}
                    >
                        <Card.Body className="text-center">
                            <h6 className="card-title mb-1">Completed</h6>
                            <p className="card-text h5">
                                {statusCounts["Completed"] || 0}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card
                        border="secondary"
                        className="shadow-sm"
                        onClick={() => handleStatusFilter("Rejected")}
                    >
                        <Card.Body className="text-center">
                            <h6 className="card-title mb-1">Rejected</h6>
                            <p className="card-text h5">
                                {statusCounts["Rejected"] || 0}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card
                        border="secondary"
                        className="shadow-sm"
                        onClick={() => handleStatusFilter("Forwarded To Marketing")}
                    >
                        <Card.Body className="text-center">
                            <h6 className="card-title mb-1">Forwarded To Marketing</h6>
                            <p className="card-text h5">
                                {statusCounts["Forwarded To Marketing"] || 0}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card
                        border="secondary"
                        className="shadow-sm"
                        onClick={() => handleStatusFilter("Forwarded To Operation")}
                    >
                        <Card.Body className="text-center">
                            <h6 className="card-title mb-1">Forwarded To Operation</h6>
                            <p className="card-text h5">
                                {statusCounts["Forwarded To Operation"] || 0}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search Bar */}
            <Form.Group className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search by Customer ID, Customer Code, or Branch Code"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </Form.Group>

            <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Ticket No</th>
                            <th>Customer ID</th>
                            <th>Customer Code</th>
                            <th>Branch Code</th>
                            <th>Main Category</th>
                            <th>Sub Category</th>
                            <th>Sub Category 3</th>
                            <th>Request Body</th>
                            <th>Recorded Date</th>
                            <th>Status</th>
                            <th>Completed Date</th>
                            <th>Completed By</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request) => (
                            <tr key={request.TicketNo}>
                                <td>{request.TicketNo}</td>
                                <td>{request.CusID}</td>
                                <td>{request.CustomerCode}</td>
                                <td>{request.BranchCode}</td>
                                <td>{request.MCatDesc}</td>
                                <td>{request.SCatDesc}</td>
                                <td>{request.SCat3Desc}</td>
                                <td>{request.RequesBody}</td>
                                <td>{new Date(request.RecordedDate).toLocaleDateString('en-GB')}</td>
                                <td className={getStatusColor(request.ReqStatusDesc)}>
                                    <b>{request.ReqStatusDesc}</b>
                                </td>
                                <td>{new Date(request.CompletedDate).toLocaleDateString('en-GB')}</td>
                                <td>{request.CompletedBy}</td>
                                <td>{request.Remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Requests;
