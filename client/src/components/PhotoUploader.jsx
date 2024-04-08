import React, { useState } from 'react';

function PhotoUploader({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      
      // Вызываем функцию onUpload с данными о загруженном файле
      onUpload(formData);
      
      // Сбрасываем выбранный файл
      setSelectedFile(null);
    } else {
      alert('Выберите файл для загрузки');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <br />
      <button type='button' onClick={handleUpload}>Загрузить</button>
    </div>
  );
}

export default PhotoUploader;
