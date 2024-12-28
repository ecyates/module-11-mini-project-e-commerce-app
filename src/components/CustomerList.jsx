import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Container, Modal, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useState, useEffect} from 'react';

const CustomerList = () => {
    // List of Customers
    const [customers, setCustomers] = useState([]);
    // Capture Errors and Messages
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    // Fetch Customers On Load
    useEffect(()=> {
        fetchCustomers();
    }, []);

    // Fetch Customer Data from Database
    async function fetchCustomers() {
        try {
            const response = await axios.get('http://127.0.0.1:5000/customers');
            setCustomers(response.data);
        } catch(error){
            console.error('Error fetching data: ', error);
            setError('Error fetching data: ', error);
        }
    } 

    // Function to delete customer
    const deleteCustomer = async (id) => {
        try{
            const response = await axios.delete(`http://127.0.0.1:5000/customers/${id}`);
            setShowDeleteModal(true);
            setMessage(response.data.message);
        }catch(error){
            console.error('Error deleting customer: ', error);
            setError('Error deleting customer: ', error);
        }
    };

    // Function to close delete modal and reset
    const closeModal = () => {
        setShowDeleteModal(false);
        setMessage('');
        fetchCustomers();
    };

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            <h1 className="mt-5 mb-3 text-center">Customers</h1>
            <ListGroup>
                {customers.map(customer=>(
                    <ListGroupItem key={customer.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                        <div className="lead">{customer.name}</div>
                        <div>
                        <Button className="me-2" variant="secondary" size="sm" onClick={()=>navigate(`/view-customer/${customer.id}`)}>View Customer Details</Button>
                        <Button className="me-2" variant="info" size="sm" onClick={() => navigate(`/edit-customer/${customer.id}`)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={()=>deleteCustomer(customer.id)}>Delete</Button>
                        </div></ListGroupItem>
                ))}
            </ListGroup>

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
}

export default CustomerList;