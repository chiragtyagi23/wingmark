import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import StatsBar from '../components/StatsBar';
import About from '../components/About';
import Services from '../components/Services';
import Locations from '../components/Locations';
import WhyChoose from '../components/WhyChoose';
import Investor from '../components/Investor';
import Team from '../components/Team';
import ContactCTA from '../components/ContactCTA';
import Contact from '../components/Contact';

function HomePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const [statsCountStarted, setStatsCountStarted] = useState(false);

  useEffect(() => {
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsCountStarted) {
          setStatsCountStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(statsBar);
    return () => observer.disconnect();
  }, [statsCountStarted]);

  useEffect(() => {
    if (!statsCountStarted) return;

    let startTimestamp = null;
    const duration = 1800;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 30));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [statsCountStarted]);

  return (
    <>
      <Hero />
      <Ticker />
      <StatsBar count={count} />
      <About />
      <Services />
      <Locations />
      <WhyChoose />
      <Investor />
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
