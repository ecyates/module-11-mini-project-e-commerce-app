import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col, Table, ListGroupItem, ListGroup, Modal } from 'react-bootstrap';

const CustomerDetails = () => {
    // Instantiate the Customer
    const [customer, setCustomer] = useState({
        id: null,
        name: '',
        email: '', 
        phone: '',
        username: '',
        password: ''
    });
    // List of Orders
    const [customerOrders, setCustomerOrders] = useState([]);
    // Capture error message
    const [ errorMessage, setErrorMessage ] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // Capture success message
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch customer details
    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/customers/${id}`)
                .then(response => {
                    setCustomer({
                        name: response.data[0].name,
                        email: response.data[0].email,
                        phone: response.data[0].phone,
                        username: response.data[0].account?.username || '',
                        password: response.data[0].account?.password || ''
                    });
                })
                .catch(error => {
                    console.error("Error fetching customer:", error.message);
                    setErrorMessage("Error fetching customer: ", error.message);
                });
        }
    }, [id]);

    // Fetch customer orders when username is available
    useEffect(() => {
        if (customer.username) {
            axios.get(`http://127.0.0.1:5000/orders/by-customer?username=${customer.username}`)
                .then(response => {
                    console.log(response.data);
                    setCustomerOrders(response.data);
                })
                .catch(error => {
                    console.error("Error fetching orders:", error.message);
                    setErrorMessage("Error fetching orders: ", error.message);
                });
    }}, [customer.username]);

    // Function to cancel an order
    const cancelOrder = async (id) => {
        try{
            const response = await axios.delete(`http://127.0.0.1:5000/orders/${id}`);
            console.log(response);
            setShowDeleteModal(true);
            setMessage(response.data.message);
        }catch(error){
            console.error('Error deleting customer: ', error.message);
            setErrorMessage('Error deleting customer: ', error.message);
        }
    };

    // Function to close the success modal
    const closeModal = () => {
        setShowDeleteModal(false);
        setMessage('');
        setErrorMessage('');
        window.location.reload();
    };

    return (
        <Container id='customer-detail'>
            <Card className="mt-3 p-5 bg-light">
                <h1 className="text-center p-3">Customer Details</h1>

                {/* Customer Details */}
                {errorMessage ? (
                    <div className="text-danger">{errorMessage}</div>
                ) : customer.name ? (
                    <>
                        <Card.Body>
                            <Card.Title><h2 className="text-center mb-3">{customer.name}</h2></Card.Title>
                            <ListGroup>
                                <ListGroupItem action variant="info"><b>Username:</b> {customer.username}</ListGroupItem>
                                <ListGroupItem action variant="info"><b>Email:</b> {customer.email}</ListGroupItem>
                                <ListGroupItem action variant="info"><b>Phone:</b> {customer.phone}</ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    </>
                ) : (
                    <h1>Loading customer details...</h1>
                )}

                {/* Customer Orders */}
                {errorMessage ? (
                    <div className="text-danger">{errorMessage}</div>
                ) : customerOrders.length > 0 ? (
                    <>
                        <Card.Title className="text-center"><h2>Orders</h2></Card.Title>
                        <Row>
                            {customerOrders.map(order => (
                                <Col xs="6" key={order.order_id}>
                                    <Card className="mb-3 bg-info shadow-sm cardHover">
                                        <Card.Body>
                                            <Card.Title className="text-center">Order ID: {order.order_id}</Card.Title>
                                            <Card.Text><b>Date:</b> {order.date}</Card.Text>
                                            <Card.Text><b>Products:</b></Card.Text> 
                                            {order.products.length > 0 ? (
                                                <>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>Price</th>
                                                            <th>Qty</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.products.map(product => (
                                                            <tr key={product.product_id}>
                                                                <td>{product.product_id}</td>
                                                                <td>{product.product_name}</td>
                                                                <td>{product.price}</td>
                                                                <td>{product.quantity}</td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <th colspan="2">Order Total:</th>
                                                            <td colspan="2" className="text-end">{order.order_total}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <div className="text-center m-3">
                                                            <Button variant="secondary" type="button" onClick={()=>cancelOrder(order.order_id)}>Cancel Order</Button>
                                                </div>
                                                </>
                                            ) : (
                                                <div>No products currently in this order.</div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <div>This customer has no orders.</div>
                )}
                <Button className="btn btn-info mt-3" onClick={() => navigate(`/edit-customer/${id}`)}>Edit Customer Details</Button>  
                <Button className="btn btn-secondary mt-3" onClick={() => navigate('/customers/')}>Back to All Customers</Button>  
            </Card>

            {/* Successful Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeModal()}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
};

export default CustomerDetails;
