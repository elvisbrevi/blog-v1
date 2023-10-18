import './about.css';
import SocialLinks from '../../components/socials-links/social-links';

const AboutPage = () => {
  return (
    <div class="container-fluid">
      <div class="row">
        <div class="col" />
        <div class="col-lg-8 col-sm-12">
        <div className="about-container">
            <h1 className="about-title">About Me:</h1>
            <p>My name is Elvis Brevi. I am a Fullstack developer. I cherish my family time with my wife and 
            our two daughters. One of my greatest passions is expressing my creativity through programming. 
            Throughout my career, I have worked in almost every technical area of IT: backend, frontend, mobile, 
            games, desktop, cloud, and some devops tasks. I have also programmed in PHP, C#, Visual Basic, 
            Javascript, Typescript, Java, Python... I have extensive knowledge and am now seeking deep expertise 
            with Rust.</p>

            <p>I have created this personal wiki as my "second brain". I often explore technologies or ideas and 
            note them down here as a way to remember and share my learnings and thoughts.</p>

            <h1 className="about-title">Work:</h1>
            <p>Currently, I work in the Development department of a ministry in the Chilean government. 
            Before that, I had the opportunity to work at a prominent news outlet 
            called <a href="https://www.biobiochile.cl/" target="_blank">Biobío Chile</a>, 
            the <a href="https://www.uss.cl/" target="_blank">San Sebastián University</a>, 
            banking entities like <a href="https://www.bancoestado.cl/" target="_blank">Banco Estado</a> and <a href="https://banco.santander.cl/" target="_blank">Santander Consumer</a>
            , <a href="https://www.ecofor.cl/" target="_blank">Ecofor</a>, 
            and an innovative manufacturing company called <a href="https://www.teknip.cl/web/?lang=en" target="_blank">Teknip</a>.</p>

            <h1 className="about-title">Contact:</h1>
            <p>Don't hesitate to get in touch with me!</p>
            <p>Twitter/X: <a href="https://twitter.com/elvisbrevi" target="_blank">https://twitter.com/elvisbrevi</a></p>
            <p>LinkedIn: <a href="https://www.linkedin.com/in/elvisbrevi" target="_blank">https://www.linkedin.com/in/elvisbrevi</a></p>
            <p>GitHub: <a href="https://github.com/elvisbrevi" target="_blank">https://github.com/elvisbrevi</a></p>
        </div>
        </div>
        <div class="col" />
      </div>
    </div>
    
  );
};

export default AboutPage;
