import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Modal, Spinner } from 'react-bootstrap';

const ProductForm = () => {
    // Instantiate the product with id, name and price
    const [product, setProduct] = useState({id:null, name:'', price:''});
    // Grab id from params, if it exists
    const { id } = useParams();
    // Keep track of errors and messages
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    // Fetch product data when id is available
    useEffect(() => {
        if(id){
            axios.get(`http://127.0.0.1:5000/products/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error=> setErrorMessage(error.message));
        }
    }, [id]);

    // Function to validate form (name and price are required)
    const validateForm = () => {
        let errors = {};
        if (!product.name) errors.name = 'Product name is required.';
        if (!product.price || parseFloat(product.price)<=0) errors.price = 'Price must be a positive number.';
        setErrors(errors);
        return Object.keys(errors).length===0;
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent automatic page refresh
        if (!validateForm()) return; // Validate form
        setSubmitting(true); // Set state to submitting
        try{
            // Create new product or update existing product
            let productData = {
                name: product.name,
                price: parseFloat(product.price)
            }
            if(id){
                const response = await axios.put(`http://127.0.0.1:5000/products/${product.id}`, productData);
                setSuccessMessage(response.data.message);

            }else{
                const response = await axios.post(`http://127.0.0.1:5000/products/`, productData);
                setSuccessMessage(response.data.message);
            }
            // Show success
            setShowSuccessModal(true);
        }catch(error){
            console.error("Error submitting form:", error.response);
            setErrorMessage(error.response);
        }finally{
            setSubmitting(false);
        }
    };

    // Handle changes to the form
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]:value
        }));
    };

    // Function to close the success modal
    const closeModal = () => {
        setShowSuccessModal(false);
        setProduct({name:'', price:''});
        navigate('/products/');
    };

    return (
        <Container className="bg-light shadow-sm border-info mt-5 p-5">
            {isSubmitting && <Alert variant="info">Submitting product data...</Alert>}
            {errorMessage && <Alert variant="danger">Error submitting product data {errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <h1 className="text-center">{id? 'Edit': 'Add'} Product</h1>
                <Form.Group className="mb-3">
                    <Form.Label>Product Name:</Form.Label>
                    <Form.Control type="text" name="name" value={product.name} onChange={handleChange} isInvalid={!!errors.name}/>
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Price:</Form.Label>
                    <Form.Control type="number" name="price" step="0.01" value={product.price} onChange={handleChange} isInvalid={!!errors.price}/>
                    <Form.Control.Feedback type="invalid">
                        {errors.price}
                    </Form.Control.Feedback>                
                    </Form.Group>
                <Form.Group className="text-center">
                    <Button variant="info" className="mt-3" type="submit" disabled={isSubmitting}>{isSubmitting? <Spinner as="span" animation="border" size="sm"/>:'Submit'}</Button>
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
}

export default ProductForm;