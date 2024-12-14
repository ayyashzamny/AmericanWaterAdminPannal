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
        const fetchRequests = async () => {
            const authToken = localStorage.getItem("authToken"); // Retrieve the token

            try {
                const response = await axios.get("http://localhost:5050/api/requests", {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Set the Bearer token
                    },
                });

                setRequests(response.data);
                setFilteredRequests(response.data);
                setLoading(false);

                const statuses = [
                    "Recorded",
                    "Completed",
                    "Rejected",
                    "Forwarded To Marketing",
                    "Forwarded To Operation",
                ];

                // Count the requests by their statuses
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

    const getStatusColor = (status) => {
        switch (status) {
            case "Recorded":
                return "text-info font-weight-bold";
            case "Completed":
                return "text-success font-weight-bold";
            case "Rejected":
                return "text-danger font-weight-bold";
            case "Forwarded To Marketing":
                return "text-warning font-weight-bold";
            case "Forwarded To Operation":
                return "text-primary font-weight-bold";
            default:
                return "";
        }
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        if (status === "") {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(
                requests.filter((request) => request.ReqStatusDesc === status)
            );
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);

        const filtered = requests.filter((request) => {
            const lowerQuery = e.target.value.toLowerCase();
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
                {["Recorded", "Completed", "Rejected", "Forwarded To Marketing", "Forwarded To Operation"].map((status) => (
                    <Col md={2} key={status}>
                        <Card
                            border="secondary"
                            className="shadow-sm"
                            onClick={() => handleStatusFilter(status)}
                        >
                            <Card.Body className="text-center">
                                <h6 className="card-title mb-1">{status}</h6>
                                <p className="card-text h5">{statusCounts[status] || 0}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
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

            {/* Requests Table */}
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
                                <td>
                                    {request.CompletedDate
                                        ? new Date(request.CompletedDate).toLocaleDateString("en-GB")
                                        : "-"}
                                </td>
                                <td>{request.CompletedBy || "-"}</td>
                                <td>{request.Remarks || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Requests;
