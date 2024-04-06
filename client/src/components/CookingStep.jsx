import React, { useState } from 'react';

function AddStepForm({ onAddStep }) {
  const [stepNumber, setStepNumber] = useState(1);
  const [stepDescription, setStepDescription] = useState('');

  const handleAddStep = () => {

    const newStep = {
      step_number: stepNumber,
      step_description: stepDescription
    };

    onAddStep(newStep);

    setStepNumber(stepNumber + 1);
    setStepDescription('');
  };

  return (
    <div>
      <div>Номер шага: {stepNumber}</div>
      <textarea
        cols="30" rows="10"
        type="text"
        placeholder="Описание шага"
        value={stepDescription}
        onChange={(e) => setStepDescription(e.target.value)}
      />
      <button type='button' onClick={handleAddStep}>Добавить шаг</button>
    </div>
  );
}

export default AddStepForm;
