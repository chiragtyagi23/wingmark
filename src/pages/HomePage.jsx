import { useState } from 'react';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import Ticker from '../components/Ticker';
import About from '../components/About';
import Services from '../components/Services';
import Locations from '../components/Locations';
import WhyChoose from '../components/WhyChoose';
import Investor from '../components/Investor';
import News from '../components/News';
import Team from '../components/Team';
import ContactCTA from '../components/ContactCTA';
import Contact from '../components/Contact';

function HomePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <>
      <Hero />
      <StatsBar variant="hero" />
      <Ticker />
      <About />
      <Services />
      <Locations />
      <WhyChoose />
      <Investor />
      <News />
      <Team />
      <ContactCTA />
      <Contact
        formSubmitted={formSubmitted}
        onFormSubmit={() => setFormSubmitted(true)}
      />
    </>
  );
}

export default HomePage;
