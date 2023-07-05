import { Parallax } from 'react-parallax';
import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import './App.css';
import nbook from './book.js';
import lerp from 'lerp'; // you can use any tweening library. Here, I am using lerp

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

// Styles are tweened based on the parent's scrollY
const tweenStyles = (start, end, ratio) => {
  const keys = new Set([...Object.keys(start), ...Object.keys(end)]);
  let styles = {};
  keys.forEach((key) => {
    const startValue = start[key] || 0;
    const endValue = end[key] || 0;
    styles[key] = lerp(startValue, endValue, ratio);
  });
  return styles;
};

const ParallaxScene = ({ id, maxScrollY, elements, initialScrollY = 0, height, width }) => {
    const [scrollY, setScrollY] = useState(initialScrollY);

    useEffect(() => {
        const onScroll = () => {
            const newScrollY = Math.min(window.scrollY, maxScrollY);
            setScrollY(newScrollY);
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [maxScrollY]);

    return (
        <div id={id} style={{ height, width, position: 'relative', overflow: 'hidden' }}>
            {elements.map((Element, index)=>React.cloneElement(Element, { scrollY }))}
        </div>
    );
};

const ParallaxSceneElement = ({ parentId, startStyle, endStyle, scrollY, children }) => {
    const getStyle = () => {
        const parent = document.getElementById(parentId);
        if (!parent) {
            return startStyle;
        }
        const ratio = scrollY / parent.scrollHeight;
        return tweenStyles(startStyle, endStyle, ratio);
    };

    return <div style={getStyle()}>{children}</div>;
};



const ParallaxContainer = ({ children, id }) => (
    <div id={id}>
        {children}
    </div>
);

const ParallaxPanel = ({ image, overImageContent, content, height = '600px', id }) => (
    <div className="parallax-animation-panel" id={id}>
        <Parallax
            bgImage={image}
            bgImageAlt="parallax-image"
            strength={200}
            className="parallax-scene" // Add class here to control the size of image
            style={{ height }} // Set the height of the Parallax component
        >
            <div className="content parallax-animation-panel-element" dangerouslySetInnerHTML={{
                __html:overImageContent && overImageContent.replace ? overImageContent.replace(/\n/g, '<br>').replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>'):''
            }}></div>
        </Parallax>
        <div className="parallax-content" dangerouslySetInnerHTML={{
            // \n to <br> and <p> to <div>
            __html:content && content.replace ? content.replace(/\n/g, '<br>').replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>'):''
        }}></div>
    </div>
);

const ParallaxPart = ({ title, chapters, id }) => (
    <div className="parallax-animation-panel parallax-part" id={id}>
        <h1>{title}</h1>
        {chapters}
    </div>
);

const ParallaxChapter = ({ title, pages, id }) => (
    <div className="parallax-animation-panel parallax-chapter" id={id}>
        <a name={slugify(title)}></a>
        <h2>{title}</h2>
        {pages}
    </div>
);

const ParallaxTOC = ({ title, id, key, chapters }) => {
    return (
        <div className="parallax-toc" id={id} key={key}>
            <h1>{title}</h1>
            <ul className="toc">
                {chapters.map((chapter, index) => (
                    <li key={index}>
                        <Link to={slugify(chapter.title)} smooth={true} duration={500}>
                            {chapter.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
/* ParallaxTOC styles


*/
const ParallaxBookCover = ({ title, author, image, height = '600px', animationTimings = [
    { start: 0, end: 0.5, style: { opacity: 1 } },
    { start: 0.5, end: 1, style: { opacity: 0 } }
] }) => {
    const [scrollY, setScrollY] = useState(0);
    const [style, setStyle] = useState(animationTimings[0].style);

    useEffect(() => {
        const onScroll = () => {
            const newScrollY = Math.min(window.scrollY, 1000);
            setScrollY(newScrollY);
            const newStyle = animationTimings.reduce((prev, curr) => {
                if (newScrollY >= curr.start * 1000 && newScrollY <= curr.end * 1000) {
                    return curr.style;
                }
                return prev;
            }, {});
            setStyle(newStyle);
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [animationTimings]);

    return (
        <div className="parallax-book-cover" id="book-cover">
            <Parallax
                bgImage={image}
                bgImageAlt="Book-cover-image"
                strength={200}
                className="parallax-book-scene" // Add class here to control the size of image
                style={{ height }} // Set the height of the Parallax component
            >
                <div className="content parallax-book-cover-element" style={style}>
                    <h1>{title}</h1>
                    <h2>{author}</h2>
                </div>
            </Parallax>
        </div>
    );
}

const ParallaxNewsletterSignupPanel = ({ id, image, height = '600px' }) => (
    <div className="parallax-newsletter-signup" id={id}>
        <Parallax
            bgImage={image}
            bgImageAlt="Newsletter-signup-image"
            strength={200}
            className="parallax-scene" // Add class here to control the size of image
            style={{ height }} // Set the height of the Parallax component
        >
            <div className="content parallax-newsletter-signup-element">
                <form>
                    <h2>Signup for our Newsletter</h2>
                    <input type="email" name="email" placeholder="Enter your email" required />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </Parallax>
    </div>
);

const ParallaxNavigator = ({ panels, id }) => (
    <div id={id} className="parallax-navigator">
        <Link to="book-cover" smooth={true} duration={500}>
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
            </svg>
        </Link>
        <Link to="book-cover" smooth={true} duration={500}>
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
            </svg>
        </Link>
        <Link to="book-cover" smooth={true} duration={500}>
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
            </svg>
        </Link>
        <Link to="book-cover" smooth={true} duration={500}>
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
            </svg>
        </Link>
        {panels.map((panel, index) => (
            <Link key={index} to={panel} smooth={true} duration={500}>
                {index + 1}
            </Link>
        ))}
    </div>
);

const ParallaxNavigation = ({ panels, id }) => {
    const [open, setOpen] = useState(false);
    return (
        <div id={id} className={`hamburger-menu ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
            <div className="hamburger">
                <div></div>
                <div></div>
                <div></div>
            </div>
            {open && (
                <div className="menu-items">
                    {panels.map((panel, index) => (
                        <Link key={index} to={panel} smooth={true} duration={500}>
                            {index + 1}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

const listStyle = {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    position: 'fixed',
    height: '100%',
    width: '200px',
  };
  
  const itemStyle = {
    padding: '10px',
    borderBottom: '1px solid #444',
  };
  
  const linkStyle = {
    textDecoration: 'none',
    color: '#fff',
    display: 'block',
  };

  class StarfieldBackground extends Component {
    children = [];
    constructor(props) {
        super(props);
        this.state = {
            stars: this.createStars()
        };
        this.moveStars = this.moveStars.bind(this);
        this.children = props.children;
    }
    createStars = () => {
        let stars = [];
        for (let i = 0; i < 1000; i++) {
            const style = {
                left: Math.random() * (window.innerWidth - 0) + 0,
                top: Math.random() * (window.innerHeight * 16) + 0,
            };
            stars.push(<div className="star" style={style} key={i}></div>);
        }
        return stars;
    }
    moveStars = () => {
        this.setState(prevState => ({
            stars: prevState.stars.map(star => {
            if (star.props.style.top < 0) {
                const newStyle = {
                ...star.props.style,
                top: window.innerHeight + 1
                };
                return React.cloneElement(star, {style: newStyle});
            }
            return star;
            })
        }));
    }
    componentDidMount() {
        this.intervalId = setInterval(this.moveStars, 2000); // every 2 seconds
    }
    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
    render() {
        return (<>
            <div className="starfield">
                {this.state.stars}
            </div>
            {this.children}
            </>
        )
    }
}



// The IDs used by the parallax panels for navigation.
const panelIds = ['first', 'second', 'third', 'animated', 'scene'];

// Keep track the scroll position and set it in state so the component updates when scrolling
const useScroll = () => {
    const [scrollPosition, setScrollPosition] = useState(window.pageYOffset);
    useEffect(() => {
        window.addEventListener('scroll', () => setScrollPosition(window.pageYOffset));
        return () => window.removeEventListener('scroll', setScrollPosition(window.pageYOffset));
    }, []);
    return scrollPosition;
}

const ParallaxBook = ({ book }) =>{

    let partNumber = 1;
    let chapterNumber = 1;
    let pageNumber = 1;

    let chapterIds = Object.values(book).map(part => {
        return Object.values(part).map(chapter => {
            return 'chapter' + chapterNumber++;
        });
    });

    const outputElements = (children) => {
        const output = [];
        {children.forEach((item, ki) => {
            const itemType = item.type;
            delete item.type;
            const partNum = partNumber++;
            switch (itemType) {
                case 'part':
                    const chapters = Object.values(item);
                    let chapterComponents = [(<ParallaxTOC
                        title={'Part ' + partNum}
                        id={'toc' + partNum}
                        key={'toc' + partNum}
                        chapters={chapters}
                    />),...outputElements(chapters.map((ch,i) => {
                        ch.type = 'chapter';
                        return ch;
                    }))]

                    output.push (
                    <ParallaxPart 
                        title={item.title}
                        id={'part' + partNum}
                        key={'part' + partNum}
                        chapters={chapterComponents}
                    />
                    );
                case 'chapter':
                    if(!item.pages) return null;
                    const itemPages = item.pages;
                    const chapterNum = chapterNumber++;
                    output.push (
                    <ParallaxChapter 
                        title={item.title}
                        id={'chapter' + chapterNum}
                        key={'chapter' + chapterNum}
                        pages={outputElements(itemPages.map(page => {
                            page.type = 'page';
                            return page;
                        }))}
                    />
                    );
                case 'page':
                    const page = item;
                    let pageNum = pageNumber++;
                    const imgGroup = Math.floor(Math.random() * 5) + 1;
                    if(pageNum > 141) {
                        pageNum -= 30;
                    }
                    // get a random number between 0 and 4
                    output.push (
                        <ParallaxPanel
                            id={pageNum}
                            key={pageNum}
                            content={page.content}
                            image={'https://media.githubusercontent.com/media/sschepis/an-uncommonly-fine-life/main/public/' + imgGroup + "/" + pageNum + '.png'}
                            overImageContent={page.overImageContent}
                        />
                    );
                default:
                    break;
            }
        })}
        return output;
    }


    const parts = Object.values(book);
    // return(        <ParallaxScene
    //     id="main-scene"
    //     maxScrollY={5000}
    //     height="100vh"
    //     width="100vw"
    //     elements={[
    //         <ParallaxSceneElement
    //             key={1}
    //             parentId="main-scene"
    //             startStyle={{ top: 0, left: 0 }}
    //             endStyle={{ top: 500, left: 100 }}
    //         >
    //             <img src="https://media.githubusercontent.com/media/sschepis/an-uncommonly-fine-life/main/public/1/1.png" alt="scene object 1" />
    //         </ParallaxSceneElement>,
    //         <ParallaxSceneElement
    //             key={2}
    //             parentId="main-scene"
    //             startStyle={{ top: 100, right: 0 }}
    //             endStyle={{ top: 600, right: 150 }}
    //         >
    //             <img src="https://media.githubusercontent.com/media/sschepis/an-uncommonly-fine-life/main/public/1/2.png" alt="scene object 2" />
    //         </ParallaxSceneElement>,
    //         <ParallaxSceneElement
    //             key={3}
    //             parentId="main-scene"
    //             startStyle={{ bottom: 0, left: 50 }}
    //             endStyle={{ bottom: 250, left: 0 }}
    //         >
    //             <img src="https://media.githubusercontent.com/media/sschepis/an-uncommonly-fine-life/main/public/1/3.png" alt="scene object 3" />
    //         </ParallaxSceneElement>
    //     ]}
    // /> 

    const imgGroup = Math.floor(Math.random() * 5) + 1;
    let pageNum = 1;

    return (  <StarfieldBackground children={
    <ParallaxContainer id="parallax-container">
        <ParallaxBookCover
            title="An Uncommonly Fine Life"
            author="by Sebastian Schepis"
            image="https://media.githubusercontent.com/media/sschepis/an-uncommonly-fine-life/main/public/cover.png"
            height="100vh"
        />
        <ParallaxNavigation panels={chapterIds} id="parallax-navigation" />
        <ParallaxNavigator panels={chapterIds} containerId="parallax-container" id='navigator' />
        {outputElements(parts.map(part => {
            part.type = 'part';
            return part;
        }))}
        <ParallaxNewsletterSignupPanel
            id="newsletter-signup"
            image={'https://media.githubusercontent.com/media/sschepis/an-uncommonly-fine-life/main/public/' + imgGroup + "/" + pageNum + '.png'}
            height="600px"
        />
    </ParallaxContainer>} />
); }

const parts = Object.values(nbook);
parts.forEach(part => {
    const chapters = Object.values(part);
    chapters.forEach(chapter => {
        const pages = chapter.pages;
        pages.forEach(page => {
            if(!page.type) page.type = 'page';
        });
    });
});

const ExampleParallaxContainer = () => (<ParallaxBook book={nbook} />);

export default ExampleParallaxContainer;


//


/*

*/
