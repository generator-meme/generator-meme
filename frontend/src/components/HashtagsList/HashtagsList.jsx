import React from 'react';
import "./HashtagsList.css";

function HashtagsList({ hashtags, isHidden }) {
  return (
    <ul className={`meme__hashtags ${isHidden? "meme__hashtags_type_hidden" : "meme__hashtags_type_main"}`}>
      {hashtags.map((hashtag, index) => {
        return <li className="meme__hashtag" key={index}>#{hashtag}</li>
      })}
    </ul>
  )
};

export default HashtagsList;