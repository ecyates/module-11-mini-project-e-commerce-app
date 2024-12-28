import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';

function HomePage() {
    return (
        <Container className="text-center rounded mt-5">
            <Row>
                <Col>
                    <h1>Welcome to Our E-Commerce Management Platform!</h1>
                    <p className="lead">
                        Effortlessly manage customers, explore products, and place orders—all in one place.
                    </p>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={{ span: 8, offset: 2 }}>
                    <h3 className="mb-3">Key Features:</h3>
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Customer Management:</strong> View and manage customer information with ease.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Product Browsing:</strong> Explore our extensive product catalog.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Order Management:</strong> Create and track customer orders seamlessly.
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col>
                    <Button variant="info" href="/customers/" className="m-2">
                        Manage Customers
                    </Button>
                    <Button variant="secondary" href="/products/" className="m-2">
                        Browse Products
                    </Button>
                    <Button variant="primary" href="/add-order/" className="m-2">
                        Place Orders
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
