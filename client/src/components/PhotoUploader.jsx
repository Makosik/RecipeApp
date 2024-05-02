// PhotoUploader.js
import React, { useState } from 'react';

function PhotoUploader({ onUpload }) {
   const [selectedFile, setSelectedFile] = useState(null);

   const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
   };

   const handleUpload = () => {
      if (selectedFile) {
         console.log('выбираем файл')
         const formData = new FormData();
         formData.append('photo', selectedFile);
         onUpload(formData);
         setSelectedFile(null);
      } else {
         alert('Выберите файл для загрузки');
      }
   };

   return (
      <div>
         <input
            type="file"
            accept='image/*,.png,.img,.gif,.web,'
            onChange={handleFileChange} />
         <br />
         <button type='button' onClick={handleUpload}>Загрузить</button>
      </div>
   );
}

export default PhotoUploader;
