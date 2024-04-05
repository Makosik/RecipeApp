import React from 'react'

function Search({ searchValue, setSearchValue, setIsblock, onKeyPress, setSelectedDish, handleFocus, handleBlur }) {

   const handleInputSearchChange = (event) => {
      setSearchValue(event.target.value);
   }

   const handleDeleteButton = () => {
      setSearchValue([]);
   }

   const handleHiddenBlock = () => {
      setIsblock(false)
      setSelectedDish([]);
   }


   return (
      <div>
         <input style={{ width: "550px" }}
            type="text" placeholder="Search" value={searchValue}
            onChange={handleInputSearchChange}
            onKeyPress={onKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
         />
         {<button onClick={() => { handleDeleteButton(); handleHiddenBlock() }}>X</button>}
      </div>
   )
}

export default Search