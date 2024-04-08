import React, { useState } from 'react';
import PhotoUploader from "./PhotoUploader"
function AddStepForm({ stepNumber, stepDescription, setStepDescription}) {
   
   const handleUpload = (formData) => {
      // Отправка formData на сервер
      console.log('Фотография загружена:', formData);
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
