import React from 'react'
import DataComponent from './components/DataComponent';
import AddDishForm from './components/CreateOrder';
import ShowOrders from './components/ShowOrders';


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