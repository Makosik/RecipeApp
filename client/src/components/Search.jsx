import React, { useEffect, useRef, useState } from 'react';
import '../style/Search.css';

function Search({
   searchValue,
   setSearchValue,
   setSearchResult,
   resultSearching,
   setResultSearching,
   selectedDish,
   setSelectedDish,
   dishes
}) {
   const [block, setblock] = useState(false);
   const [active, setactive] = useState(false);

   const handleInputSearchChange = (event) => {
      setSearchValue(event.target.value);
   }

   const handleDeleteButton = () => {
      setSearchValue('');
   }

   const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
         event.target.blur();
         handleClickSearch();
      }
   };

   const handleClickSearch = () => {
      setResultSearching(searchValue);
      setblock(true)
      filterSearchDishes();
   }

   const filterSearchDishes = () => {
      if (searchValue.length > 0) {
         const filter = dishes.filter(dish => dish.dish_title.toLowerCase().includes(searchValue.toLowerCase()));
         setSearchResult(filter);
      }
   }

   const handleAddSelectedSearch = (obj) => {
      setResultSearching(obj.dish_title);
      setblock(true)
      setSearchResult([obj]);
      setSelectedDish([]);
      setSearchValue('');
   }

   const handleReturnDishes = () => {
      setSearchResult(dishes);
      setblock(false);
   }

   const handleFocus = () => {
      setactive(true)
   };

   const handleBlur = () => {
      const timerId = setTimeout(() => {
         setactive(false)
      }, 100);
      setTimeout(timerId);
   };

   const Ref = useRef(null);

   const handleClickOutside = (event) => {
      if (Ref.current && !Ref.current.contains(event.target)) {
         setactive(false)
      }
   };

   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [searchValue]);


   return (
      <div className="search-wrapper" ref={Ref}>
         <div className="search-container">
            <div className='inp-wrap-p'>Что сегодня хотите приготовить?</div>
            <div>
               <div className='inp-wrap'>
                  <input
                     className='input_search'
                     type="text"
                     placeholder="Search"
                     value={searchValue}
                     onChange={handleInputSearchChange}
                     onKeyPress={handleKeyPress}
                     onFocus={handleFocus}
                     onBlur={handleBlur}
                  />
                  <div className='icon-background' onClick={handleClickSearch}></div>
                  <button className="delete-button" onClick={handleDeleteButton}></button>
               </div>
               <div className="suggestions-container" style={{ display: active ? 'block' : "none" }}>
                  {selectedDish.map(item => (
                     <div className="suggestion-item" onClick={() => handleAddSelectedSearch(item)} key={item.dish_id}>
                        {item.dish_title}
                     </div>
                  ))}
               </div>
               <div className="search-results" style={{ display: block ? 'block' : 'none' }}>Результаты поиска: {resultSearching}</div>
            </div>
            
         </div>
   

         {block && <button className="return-button" onClick={handleReturnDishes}>Вернуться к рецептам</button>}
      </div>
   );
}

export default Search;
