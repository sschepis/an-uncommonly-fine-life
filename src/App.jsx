import React from 'react';
import { useState, useEffect } from 'react';

import './App.css';
import './Starfield.css';

import * as theBook from './book.js';

import { Parallax } from "react-parallax";

const ParallaxContainer = ({ children }) => (
  <div className="parallax-container">
    {children}
  </div>
);

const StarfieldBackground = ({ children }) => (<div id="starfield">
  <div id='stars'></div>
  <div id='stars2'></div>
  <div id='stars3'></div>
  <script src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
  {children}
</div>);

const ParallaxPanel = ({ image, overImageContent, content }) => (
  <div>
    <Parallax
      bgImage={image}
      bgImageAlt="parallax-image"
      strength={400}
      style={{ height: '600px' }}
    >
      <div className="content over-image">{overImageContent}</div>
    </Parallax>
    <div className="plain-content"><div className="plain-content-text">{content}</div></div>
  </div>
);

const ParallaxCoverPanel = ({ content }) => (
  <div class="cover">
    <Parallax
      strength={200}
      style={{ height: '600px' }}
    >
      <div className="content over-image">{content}</div>
    </Parallax>
  </div>
)

const ParallaxSectionTOC = ({ section }) => {
  const sectionChapters = Object.values(section);
  return sectionChapters.map((chapter, chn) => {
    const pages = chapter.pages.map((page, index) => (
      <div class="page"><a href={"#page_" + chn + '_' + index}>{index+1}</a></div>
    ))
    return (<div className="toc">
      <h2>{chapter.title}</h2>
      <div className="pages">{pages}</div>
    </div>)
  })
}

const ParallaxNewsletterSignupPanel = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  return (
    <div className="newsletter-signup">
      <h2>Sign up for the newsletter</h2>
      <p>Get notified when new content is added</p>
      <form class="form" onSubmit={onSubmit}>
        <input class="form-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input class="form-input" type="checkbox" />Daily inspirational quote<br />
        <input class="form-input submit" type="submit" value="Submit" />
      </form>
    </div>
  )
}

// show a timeline control at the bottom of the screen. the timeline control shows the pages in the book as tick marks that can be clicked on to jump to that page
// the current page is highlighted in the timeline control
const BookTimeline = ({ part, page }) => {
  let pageCounter = 0;
  return (
    <div className="timeline">
      {Object.keys(part).map((chapter, chn) => {
        const chapterObject = part[chapter];
        const chapterPages = chapterObject.pages.map((page, i) => (<>
          <a name={"page_" + chn + '_' + i}></a>
          <div className={"page " + (pageCounter === page ? "current" : "")} onClick={() => { window.location.hash = "#page_" + chn + '_' + i }}>{pageCounter++}</div>
        </>))
        return (<>
          {chapterPages}
        </>
        )
      })}

    </div>
  );
};

const App = () => {
  const [book, setBook] = useState({});
  const [chapter, setChapter] = useState(0);
  const [page, setPage] = useState(0);
  useEffect(() => {
    setBook(theBook.default)
  }, [theBook]);
  let pageCounter = 0;
  return (
    Object.keys(book).map((part) => (
      <ParallaxContainer>
        <BookTimeline part={book[part]} page={page} />
        <ParallaxCoverPanel content={<>
          <StarfieldBackground children={<>
            <h1>An Uncommonly Fine Life</h1>
            <h2>How to be happy in any world</h2>
            <h3>by <a href="https://www.linkedin.com/in/sebastianschepis/">Sebastian Schepis</a></h3>
          </>} />
        </>} />
        <ParallaxSectionTOC section={book[part]} />
        {Object.keys(book[part]).map((chapter, chn) => {

          const imgGroup = Math.floor(Math.random() * 4) + 1;
          const chapterObject = book[part][chapter];
          const chapterPages = chapterObject.pages.map((page, i) => (<>
            <a name={"page_" + chn + '_' + i}></a>
            <ParallaxPanel
              image={'https://media.githubusercontent.com/media/sschepis/an-uncommonly-fine-life/main/public/' + imgGroup + "/" + pageCounter++ + ".png"}
              overImageContent={i === 0 && <h1>{book[part][chapter].title}</h1>}
              content={<StarfieldBackground children={<> <p>{page.content.replace(/\n/g, '<br />')}</p> </>} />}
            />
          </>))
          return (<>
            {chapterPages}
          </>

          )
        })}
        <ParallaxNewsletterSignupPanel onSubmit={(e) => {
          e.preventDefault();
          console.log("submitting email: " + e.target[0].value);
        }} />
      </ParallaxContainer>))
  );
}
export default App;