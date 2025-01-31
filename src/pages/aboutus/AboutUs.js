import React from 'react';
import './AboutUs.css';
import cats from './cats.jpg';
import lebron from './lebron.jpg';
import luffy from './luffy.jpg';

function AboutUs() {
  window.scrollTo(0, 0);
  return (
    <div className='aboutus'>
      <div className='hello_box'>
        <h1>Hello! <span className='wave'> 👋🏻</span> Meet the Team.</h1>
      </div>

      <div className='main_triple_box'>
        <div className='founder'>
          <img src={luffy} alt='Serin' className='founder-img'/>
          <h1>Serin</h1>
          <p className ='position'>Founder</p>
          <p className = 'founder-bio'>My name is Serin, a Hunter CS student who is obsessed with anime. I am hoping to graduate by end of this year. I don't know what else to say.</p>
        </div>
        <div className='founder'>
          <img src={cats} alt='Roger' className='founder-img'/>
          <h1>Roger</h1>
          <p className ='position'>Founder</p>
          <p className ='founder-bio'>My name is Roger. A computer science major, expecting to graduate by the end of spring 2025.</p>
        </div>
        <div className='founder'>
          <img src={lebron} alt='Brendan' className='founder-img'/>
          <h1>Brendan</h1>
          <p className ='position'>Founder</p>
          <p className ='founder-bio'>Hello, my name is Brendan. I am a Computer Science major at Hunter College. I am currently finishing my Bachelor's degree with plans of graduating by the end of 2024.</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
