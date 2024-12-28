import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Modal, Spinner, Table } from 'react-bootstrap';

const OrderForm = () => {
    // Instantiate order, date is defaulted to today's date
    const [order, setOrder] = useState({date:getDate(), customer_id:null, products:[]});
    // Lists of all products and customers
    const [allProducts, setAllProducts] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    // Keep track of the order total
    const [total, setTotal] = useState(null);
    // Error and success messages
    const [errors, setErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    // Fetch customers and products on load
    useEffect(() => {    
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/customers');
                setAllCustomers(response.data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
    
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/products');
                setAllProducts(response.data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
    
        fetchCustomers();
        fetchProducts();

    }, []);

    // When a product is added to the order, recalculate the order total
    useEffect(() => {
        const newTotal = order.products.reduce((sum, product) => {
            const item = allProducts.find(p => p.id === product.id);
            const price = parseFloat(item.price.replace("$",""));
            return sum + (price) * (product.quantity);
        }, 0);
        setTotal(newTotal);
    }, [order.products, allProducts]);
    
    // Validate the form
    const validateForm = () => {
        let errors = {};
        if (!order.date) errors.date = 'Date is required.';
        if (!order.customer_id) errors.customerId = 'Customer is required.';
        if (order.products.length===0) errors.products = 'Please add at least one product.';
        setErrors(errors);
        return Object.keys(errors).length===0;
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page refresh 
        if (!validateForm()) return; // Validate form
        setSubmitting(true); // Set submitting to true
        try{ // Create the new order
            let orderData = {
                date: order.date,
                customer_id: parseInt(order.customer_id),
                products: order.products
            }
            console.log("Submitting: ", orderData);
            const response = await axios.post(`http://127.0.0.1:5000/orders/`, orderData);
            setSuccessMessage(response.data.message);
            setShowSuccessModal(true);
        }catch(error){
            console.error("Error submitting form:", error.response);
            setErrorMessage(error.response);
        }finally{
            setSubmitting(false);
        }
    };

    // Update the order information whenever there's a change in the form
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (name === 'customer_id') {
            setOrder(prev => ({ ...prev, customer_id: value }));
        } else if (name === 'date') {
            setOrder(prev => ({ ...prev, date: value }));
        }
    };
    
    // Update the product whenever the quantity is updated
    const handleProductChange = (productId, quantity) => {
        setOrder(prev => {
            const updatedProducts = [...prev.products];
            const productIndex = updatedProducts.findIndex(p => p.id === productId);
    
            if (productIndex !== -1) {
                // Update existing product quantity
                updatedProducts[productIndex].quantity = parseInt(quantity) || 0;
            } else {
                // Add new product with quantity if it doesn't exist
                updatedProducts.push({ id: productId, quantity: parseInt(quantity) || 0 });
            }
    
            return { ...prev, products: updatedProducts };
        });
    };
    
    // Function to get today's date
    function getDate() {
        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2,'0');
        const day = today.getDate().toString().padStart(2,'0');
        return `${year}-${month}-${day}`;
    }
    
    // Function to close the success modal and reset variables
    const closeModal = () => {
        setShowSuccessModal(false);
        setOrder({id: null, date:'', customer_id:null, products:[]});
        setTotal(null);
        setAllCustomers([]);
        setAllProducts([]);
        navigate('/customers/');
    };

    return (
        <Container className="bg-light shadow-sm border-info mt-5 p-5">
            {isSubmitting && <Alert variant="info">Submitting order data...</Alert>}
            {errorMessage && <Alert variant="danger">Error submitting order data {errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <h1 className="text-center">New Order</h1>
                <Form.Group className="mb-3">
                    <Form.Label>Order Date:</Form.Label>
                    <Form.Control variant="mb-3" type="date" name="date" value={order.date || getDate()} onChange={handleChange} isInvalid={!!errors.date}/>
                    <Form.Control.Feedback type="invalid">
                        {errors.date}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Customer:</Form.Label>
                    <Form.Select name="customer_id" value={order.customer_id || ''} onChange={handleChange} isInvalid={!!errors.customerId}>
                        <option value="">Select a customer</option>
                        {allCustomers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.customerId}
                    </Form.Control.Feedback>                
                </Form.Group>
                {/* Table displaying the products Qty, Name, and Price */}
                <Form.Group className="mb-3">
                    <Form.Label>Products:</Form.Label>
                    <Form.Control.Feedback type="invalid">
                        {errors.products}
                    </Form.Control.Feedback>
                    <Table>
                        <thead>
                            <tr>
                                <th>Qty</th>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProducts.map(product => {
                                const orderProduct = order.products.find(p => p.id === product.id);
                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={orderProduct?.quantity || 0}
                                                min="0"
                                                onChange={(e) => handleProductChange(product.id, e.target.value)}
                                                isInvalid={!!errors.products}
                                            />
                                        </td>
                                        <td>
                                            <Form.Label>{product.name}</Form.Label>
                                        </td>
                                        <td>
                                            <Form.Label>{product.price}</Form.Label>
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <th colSpan={2}>Total</th>
                                <td>${total?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Form.Group>
                <Form.Group className="text-center">
                <Button variant="info" className="mt-3" type="submit" disabled={isSubmitting}>{isSubmitting? 
                    <Spinner as="span" animation="border" size="sm"/>:'Submit'}</Button>
                </Form.Group>
            </Form>

            {/* Success Modal  */}
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
}

export default OrderForm;