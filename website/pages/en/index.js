/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo" img_src={imgUrl('rustsim.svg')}>
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || '';
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('rustsim.svg')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
              <Button href="https://discourse.nphysics.org">User forum</Button>
              <Button href="https://github.com/rustsim">View on Github</Button>
              <Button href="https://discord.gg/vt9DJSW">Join us on Discord</Button>
            {/*<Button href={docUrl('doc1.html', language)}>Example Link</Button>*/}
            {/*<Button href={docUrl('doc2.html', language)}>Example Link 2</Button>*/}
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} className={props.className} />
  </Container>
);

const Features = () => (
  <Block background="light" layout="twoColumn"  className="feature">
    {[
        {
            content: 'Expressive traits hierarchy from the most simple simple algebraic entities (like magmas) to more complex ones (like transformation groups).' +
                     '<br/><img src="/img/wasm.svg" title="Compatible with WebAssembly." height="30px"/><span class="space"><img src="/img/no_std.svg" title="Can work without std." height="30px"/>' +
                     '<p><a class="button" href="https://docs.rs/alga">API Doc</a>' +
                     '<span class="space"></span><a class="button" href="https://github.com/rustsim/alga">GitHub</a></p>',
            image: imgUrl('alga.svg'),
            imageLink: 'https://docs.rs/alga',
            imageAlign: 'top',
            title: '**[alga](https://docs.rs/alga)** − Abstract Algebra'
        },
        {
            content: 'Efficient vector and matrix operations and decompositions.' +
                     ' Broad range of transformations like quaternions, isometries, similarities, etc.' +
                     '<br/><img src="/img/wasm.svg" title="Compatible with WebAssembly." height="30px"/><span class="space"><img src="/img/no_std.svg" title="Can work without std." height="30px"/>' +
                     '<p><a class="button" href="https://nalgebra.org">User Guide</a>' +
                     '<span class="space"></span><a class="button" href="https://nalgebra.org/rustdoc/nalgebra">API Doc</a>' +
                     '<span class="space"></span><a class="button" href="https://github.com/rustsim/nalgebra">GitHub</a></p>',
            image: 'https://www.nalgebra.org/img/logo_nalgebra.svg',
            imageLink: 'https://www.nalgebra.org',
            imageAlign: 'top',
            title: '**[nalgebra](https://nalgebra.org)** − Linear Algebra'
        },
        {
            content: 'Efficient distance measures, interference tests, contact points computation, ray-casting, time-of-impact computation, etc.' +
                     ' in both 2D and 3D.' +
                    '<br/><img src="/img/wasm.svg" title="Compatible with WebAssembly." height="30px"/>' +
                    '<p><a class="button" href="https://ncollide.org">User Guide</a>' +
                     '<span class="space"></span><a class="button" href="https://ncollide.org/rustdoc/ncollide2d">2D API Doc</a>' +
                     '<span class="space"></span><a class="button" href="https://ncollide.org/rustdoc/ncollide3d">3D API Doc</a>' +
                     '<span class="space"></span><a class="button" href="https://github.com/rustsim/ncollide">GitHub</a></p>',
            image: imgUrl('logo_ncollide.svg'),
            imageLink: 'https://www.ncollide.org',
            imageAlign: 'top',
            title: '**[ncollide](https://ncollide.org)** − Collision Detection'
        },
        {
            content: 'Real-time physics engines for both 2D and 3D applications like video games, robotics, or animation.' +
                     ' Implements rigid-body as well as multibody simulations.' +
                '<br/><img src="/img/wasm.svg" title="Compatible with WebAssembly." height="30px"/>' +
                '<p><a class="button" href="https://nphysics.org">User Guide</a>' +
                '<span class="space"></span><a class="button" href="https://nphysics.org/rustdoc/nphysics2d">2D API Doc</a>' +
                '<span class="space"></span><a class="button" href="https://nphysics.org/rustdoc/nphysics3d">3D API Doc</a>' +
                '<span class="space"></span><a class="button" href="https://github.com/rustsim/nphysics">GitHub</a></p>',
        image: 'https://www.nphysics.org/img/logo_nphysics_full.svg',
            imageLink: 'https://www.nphysics.org',
            imageAlign: 'top',
            title: '**[nphysics](https://nphysics.org)** − Physics Simulation'
        }
    ]}
  </Block>
);

const LearnHow = () => (
  <Block background="light">
    {[
      {
        content: 'Talk about learning how to use this',
        image: imgUrl('rustsim.svg'),
        imageAlign: 'right',
        title: 'Learn How',
      },
    ]}
  </Block>
);

const TryOut = () => (
  <Block id="try">
    {[
      {
        content: 'Talk about trying this out',
        image: imgUrl('rustsim.svg'),
        imageAlign: 'left',
        title: 'Try it Out',
      },
    ]}
  </Block>
);

const Description = () => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('rustsim.svg'),
        imageAlign: 'right',
        title: 'Description',
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }

  const showcase = siteConfig.users.filter(user => user.pinned).map(user => (
    <a href={user.infoLink} key={user.infoLink}>
      <img src={user.image} alt={user.caption} title={user.caption} />
    </a>
  ));

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>Who is Using This?</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          {/*<LearnHow />*/}
          {/*<TryOut />*/}
          {/*<Description />*/}
          {/*<Showcase language={language} />*/}
        </div>
      </div>
    );
  }
}

module.exports = Index;
