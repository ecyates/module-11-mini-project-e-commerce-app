import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const CustomerForm = () => {
    // Instantiate the customer
    const [customer, setCustomer] = useState({id:null, name:'', email:'', phone:'', username:'', password:''});
    // Edit Customer will provide an ID
    const { id } = useParams();
    // Capture Errors and Messages
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage ] = useState('');
    // Submitting State
    const [isSubmitting, setSubmitting] = useState(false);
    // Display Success Modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    // Retrieve the customer information from database if id is available
    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/customers/${id}`)
                .then(response => {
                    setCustomer({
                        id: response.data[0].id,
                        name: response.data[0].name,
                        email: response.data[0].email,
                        phone: response.data[0].phone,
                        username: response.data[0].account?.username || '',
                        password: response.data[0].account?.password || ''
                    });
                })
                .catch(error =>{
                    console.error("Error fetching customer data:", error.message);
                    setErrorMessage(error.message);
                });
        }}, [id]);
    
    // Validate the form 
    const validateForm = () => {
        let errors = {};
        if (!customer.name) errors.name = 'Customer name is required.';
        if (!customer.email) errors.email = 'Customer email is required.';
        if (!customer.phone || !/^\d{3}-\d{3}-\d{4}$/.test(customer.phone)) {
            errors.phone = 'Customer phone is required and must be ###-###-####.';
        }
        if (!id) {
            if (!customer.username) errors.username = 'Username is required.';
            if (!customer.password) errors.password = 'Password is required.';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
        
    // Handle a form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page refresh
        if (!validateForm()) return; // Validate the form
        setSubmitting(true); // Set the state to submitting
        try{
            // Put/Post the Customer Info
            if(id){
                let customerData = {
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone
                };
                const response = await axios.put(`http://127.0.0.1:5000/customers/${id}`, customerData);
                setSuccessMessage(response.data.message);
            }else{
                let customerData = {
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone, 
                    account: {
                        username: customer.username, 
                        password: customer.password
                    }
                };
                const response = await axios.post(`http://127.0.0.1:5000/customers/`, customerData, {headers:{'Content-Type': 'application/json'}});
                setSuccessMessage(response.data.message);
            }
            setShowSuccessModal(true);
        }catch(error){
            console.error("Error submitting form:", error.message);
            setErrorMessage(error.message);
        }finally{
            setSubmitting(false); 
        }
    };

    // Update the Customer values with every change to the form
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCustomer(prevCustomer => ({
            ...prevCustomer,
            [name]: value
        }));
    };

    // Function to close the success modal and reset
    const closeModal = () => {
        setShowSuccessModal(false);
        setCustomer({ id: null, name: '', email: '', phone: '', username: '', password: '' });
        navigate('/customers/');
    };

    return (
        <Container className="bg-light shadow-sm border-info mt-5 p-5">
            {isSubmitting && <Alert variant="info">Submitting customer data...</Alert>}
            {errorMessage && <Alert variant="danger">Error submitting customer data {errorMessage}</Alert>}

            <h1 className="text-center">{id? 'Edit':'Add New'} Customer</h1>
            <Form onSubmit={handleSubmit}>
                {id?null:
                (<><Form.Group controlId="usernameFormGroup" className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" name="username" value={customer.username} onChange={handleChange} />
                    {errors.username && <div style={{color:'red'}}>{errors.username}</div>}
                </Form.Group>
                <Form.Group controlId="passwordFormGroup" className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" name="password" value={customer.password} onChange={handleChange} />
                    {errors.password && <div style={{color:'red'}}>{errors.password}</div>}
                </Form.Group></>)}
                
                <Form.Group controlId="nameFormGroup" className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" name="name" value={customer.name} onChange={handleChange} />
                    {errors.name && <div style={{color:'red'}}>{errors.name}</div>}
                </Form.Group>
                <Form.Group controlId="emailFormGroup" className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" name="email" value={customer.email} onChange={handleChange} />
                    {errors.email && <div style={{color:'red'}}>{errors.email}</div>}
                </Form.Group>
                <Form.Group controlId="phoneFormGroup" className="mb-3">
                    <Form.Label>Phone:</Form.Label>
                    <Form.Control type="tel" name="phone" value={customer.phone} onChange={handleChange}  />
                    {errors.phone && <div style={{color:'red'}}>{errors.phone}</div>}
                </Form.Group>
                <Form.Group className="text-center">
                    <Button variant="info" className="mt-3" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </Form.Group>
            </Form>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                <Modal.Body>
                    {successMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
};

export default CustomerForm;