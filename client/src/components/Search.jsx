import React from 'react'

function Search({searchValue}) {

   const handleInputSearchChange = (event) => {
      searchValue(event.target.value);
   }

   return (
      <div>
         <input type="text" placeholder="Search" value={null} onChange={handleInputSearchChange} />
      </div>
   )
}

export default Search