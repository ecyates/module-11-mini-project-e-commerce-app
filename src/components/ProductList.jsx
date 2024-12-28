import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Modal, ListGroup, Alert, Row, Col } from 'react-bootstrap';

const ProductList = () => {
    // List of Products
    const [products, setProducts] = useState([]);
    // Keep track of errors and messages
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    // Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    // On load, fetch products
    useEffect(()=> {
        fetchProducts();
    }, []);

    // Function to fetch products from database
    async function fetchProducts () {
        try {
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
        } catch(error){
            console.error('Error fetching data: ', error);
            setError('Error fetching data: ', error);
        }
    } 

    // Function to delete product
    const deleteProduct = async (id) => {
        try{
            const response = await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            setShowDeleteModal(true);
            setMessage(response.data.message);
        }catch(error){
            console.error('Error deleting product: ', error);
            setError('Error deleting product: ', error);
        }
    }

    // Function to close the successful delete modal and reset
    const closeModal = () => {
        setShowDeleteModal(false);
        setMessage('');
        fetchProducts();
    }

    return (
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
                <h1 className="mt-5 mb-3 text-center">Products</h1>
                <Row>
                    <Col>
                        <ListGroup>
                            {products.length===0?(
                                <p>No products available.</p>
                            ):(
                                products.map(product=>(
                                <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                                    <div className="lead">{product.name} (ID: {product.id}) - Price: {product.price}</div>
                                    <div>
                                        <Button className="me-2" variant="info" size="sm" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => deleteProduct(product.id)}>Delete</Button>
                                    </div>
                                </ListGroup.Item>
                            )))}
                        </ListGroup>
                    </Col>  
                </Row>

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
    );
}

export default ProductList;