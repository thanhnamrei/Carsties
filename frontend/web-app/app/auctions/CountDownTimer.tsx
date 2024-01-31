'use client'
import React from 'react'
import Countdown from 'react-countdown';


type Props = {
    autionEnd: string
}

const renderer = ({ days,hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <div>Finished</div>;
    } else {
      // Render a countdown
      return <span suppressHydrationWarning={true}>{days}:{hours}:{minutes}:{seconds}</span>;
    }
  };

export default function CountDownTimer({autionEnd}: Props) {
  return (
   <div>
     <Countdown date={autionEnd} renderer={renderer}/>
   </div>
  );
}
