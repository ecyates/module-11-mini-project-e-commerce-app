import './AppStyles.css';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetails from './components/CustomerDetails';
import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import OrderForm from './components/OrderForm';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
      <div className='app-container'>
        <NavigationBar/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/add-customer/' element={<CustomerForm/>} />
            <Route path='/edit-customer/:id' element={<CustomerForm/>} />
            <Route path='/customers/' element={<CustomerList/>}/>
            <Route path='/products/' element={<ProductList/>}/>
            <Route path='/add-product/' element={<ProductForm/>}/>
            <Route path='/edit-product/:id' element={<ProductForm/>}/>
            <Route path='/view-customer/:id' element={<CustomerDetails/>}/>
            <Route path='/add-order/' element={<OrderForm/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
      </div>
  )
}

export default App;