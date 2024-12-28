# Module 11 - Mini-Project - React E-commerce Web Application
Author: Elizabeth Yates

**Author's Note**: Please find the code for the backend at the following location: https://github.com/ecyates/module-6-mini-project-e-commerce-api.

## Project Requirements
To successfully build an e-commerce management app with the following features.

### 1. Customer and CustomerAccount Management

#### List of Customers (CustomerList.sx)
A component that displays all the customers' names with the following features: 
- View Customer Details button (takes you to CustomerDetails.jsx)
- Edit button (takes you to CustomerForm.jsx)
- Delete button (deletes the customer from the database)

This component includes a modal when a customer is successfully deleted. 

#### Create Customer Form (CustomerForm.sx)
A form component to capture and submit essential customer information, including username, password, name, email, and phone number.
This component includes a modal when a customer is successfully added. 

#### Update Customer Form (CustomerForm.sx)
A form component that allows users to update customer details, including the name, email, and phone number.
This component includes a modal when a customer is successfully updated. 

#### View Customer Details (CustomerDetails.sx)
A component to show the username, name, email, phone number of the customer, as well as a list of each order made by that customer. 

### 2. Product Catalog

#### List of Products (ProductList.jsx)
A component to display a list of all available products in the e-commerce platform, providing essential product information like id, name, and price. 

It allows the following features: 
- Edit button (takes you to ProductForm.jsx)
- Delete button (deletes the product from the database)

This component includes a modal when a product is successfully deleted. 

#### Create Product Form (ProductForm.jsx)
A form component to capture and submit essential product information, including name and price.
This component includes a modal when a product is successfully added. 

#### Update Product Form (ProductForm.jsx)
A form component that allows users to update product details, including the product name and price.
This component includes a modal when a product is successfully updated. 

### 3. Order Processing

#### Place Order Form (OrderForm.jsx)
A form component for customers to place new orders, specifying the products they wish to purchase and providing essential order details. 
Each order captures the order date and the associated customer.

#### Order History (CustomerDetails.jsx)
The order details are displayed in the customer detail page, including the date, associate products, and **order total**. 
It also allows the ability to **cancel the order**. 

### 4. Other Components

#### Home.jsx
Welcoming the users, the home page gives a brief description of the functionality of the e-commerce management app and provides paths to browse the customers, products and place an order. 

#### NavigationBar.jsx
The navigation bar provides links to the Home Page, Customer Form, Customer List, Product Form, Product List and Order Form. 
 
 #### NotFound.jsx
 The not found page appears whenever the user navigates to an unknown page and provides a link back home. 

### 5. Other Features
- Integration of React-Bootstrap
- Implementation of React Router in App.jsx




*This code can be found in this repository:*
*https://github.com/ecyates/module-10-mini-project-api-integration.git*

*The backend code can be found in this repository:*
*https://github.com/ecyates/module-6-mini-project-e-commerce-api*