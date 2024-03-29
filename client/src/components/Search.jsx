import React from 'react'

function Search({ searchValue, setSearchValue }) {

   const handleInputSearchChange = (event) => {
      setSearchValue(event.target.value);
   }

   return (
      <div>
         <input type="text" placeholder="Search" value={searchValue} onChange={handleInputSearchChange} />
      </div>
   )
}

export default Search