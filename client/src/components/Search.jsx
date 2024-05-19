import React, { useEffect, useRef } from 'react'
import '../style/Search.css'
function Search({ searchValue, setSearchValue, setIsblock, onKeyPress, setSelectedDish, handleFocus, handleBlur }) {

   const handleInputSearchChange = (event) => {
      setSearchValue(event.target.value);
   }

   const handleDeleteButton = () => {
      setSearchValue('');
   }

   const Ref = useRef(null);

  const handleClickOutside = (event) => {
    if (Ref.current && !Ref.current.contains(event.target)) {
      setSearchValue('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchValue]);

   return (
      <div className="search-container" >
         <input 
            ref={Ref}
            className='input_search'
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleInputSearchChange}
            onKeyPress={onKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
         />
         {<button className="delete-button" onClick={() => { handleDeleteButton()}}></button>}
      </div>
   )
}

export default Search