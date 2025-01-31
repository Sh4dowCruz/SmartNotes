import React from 'react';
import './HomePage.css';
import MiddleSection from './MiddleSection';
import {Cards} from './Cards'
import scan from './scan.jpg'
import Quiz from './Quiz.jpg'
import review from './Review.JPG'

function HomePage() {
  window.scrollTo(0, 0);
  return (      //middle section goes here 
    <>
      <MiddleSection/>
      <div className='home-background'>
        <h1 className="Title_Cards">What can you do with your notes?</h1>
        <div className="cards">
          <Cards 
            imgSrc={scan}
            imgAlt='Card img'
            CardTitle='Summary'
            CardDescription='Scan your notes into summarized notes'
          />
          <Cards 
            imgSrc={Quiz}
            imgAlt='Card img'
            CardTitle='Quizzes'
            CardDescription='Scan your notes into interactive quizzes'
          />
          <Cards 
            imgSrc={review}
            imgAlt='Card img'
            CardTitle='Save notes'
            CardDescription='Save your notes and review them on your own'
          />
        </div>
      </div>
    </>
  );
}
export default HomePage;