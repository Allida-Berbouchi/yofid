import React from 'react';
import './CardProgress.css';

function CardProgress({ title, subtitle, progress, mastery }) {
  return (
    <div className='card-container'>
      {/* Title */}
      <p className='title'>{title}</p>
      
      {/* Subtitle - bold */}
      <p className='subtitle'><b>{subtitle}</b></p>
      
      {/* Line from mastery - changes length by mastery percentage */}
      <div className='line-container'>
        <div 
          className='mastery-line' 
          style={{ width: `${mastery}%` }}
        ></div>
      </div>
      <div className='mm'>
        <p>{mastery}% mastery</p>
        <p style={{color: "green"}}>{progress}</p>
      </div>
    </div>
  );
}

export default CardProgress;