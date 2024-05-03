import React, { useState } from 'react';

function CookingStep({ stepNumber, stepDescription, setStepDescription }) {

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
         <br /> 
      </div>
   );
}

export default CookingStep;
