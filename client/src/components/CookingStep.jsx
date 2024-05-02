import React, { useState } from 'react';
import PhotoUploader from "./PhotoUploader"
import axios from 'axios';

function AddStepForm({ stepNumber, stepDescription, setStepDescription }) {
   const [uploadedFile, setUploadedFile] = useState(null);

   const handleUpload = async (formData) => {
      try {
         const response = await axios.post('/api/upload', formData);
         if (response.status === 200) {
            const filePath = response.data.filePath;
            console.log('Фотография успешно загружена:', filePath);
            setUploadedFile(filePath);
         } else {
            console.error('Ошибка при загрузке фотографии:', response.statusText);
         }
      } catch (error) {
         console.error('Ошибка при отправке запроса на загрузку фотографии:', error);
      }
   };

   return (
      <div>
         <div>Номер шага: {stepNumber}</div>
         <PhotoUploader onUpload={handleUpload} />
         <textarea
            cols="30" rows="10"
            type="text"
            placeholder="Описание шага"
            value={stepDescription}
            onChange={(e) => setStepDescription(e.target.value)}
         />
      </div>
   );
}

export default AddStepForm;
