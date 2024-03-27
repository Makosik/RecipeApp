import React from 'react'
import DataComponent from './components/DataComponent';
import AddDishForm from './components/CreateOrder';
import ShowOrders from './components/ShowOrders';
import Search from './components/Search';

function App() {
   return (
      <>
         <AddDishForm />
         <ShowOrders />
         <DataComponent />
      </>
   )
}

export default App