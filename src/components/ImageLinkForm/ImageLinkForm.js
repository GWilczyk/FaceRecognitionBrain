import React from 'react';

import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className='f3'>
        {'This Magic Brain will detect faces in your pictures. Give it a try!'}
      </p>

      <div className='center'>
        <div className='form pa4 br3 shadow-5 center'>
          <input
            type='text'
            className='f4 w-70 pa2 center'
            onChange={onInputChange}
          />
          <button
            className='f4 w-30 grow link ph3 pv2 dib white bg-light-purple'
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
