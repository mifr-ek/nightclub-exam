import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/WelcomeSection.css";
import "../styles/EventsSection.css";
import "../styles/NightClubTrack.css";
import "../styles/Hero.css";
import Navbar from "../components/Navbar";
import EventsSlider from "../components/EventsSlider";
import NightClubTrack from "../components/NightClubTrack";
import LatestVideo from "../components/LatestVideo";
import NightClubGallery from "../components/NightClubGallery";
import Testimonials from "../components/Testimonials";
import RecentBlog from "../components/RecentBlog";
import Newsletter from "../components/Newsletter";
import logoSvg from "../assets/icon/Logo.svg";

export default function Home() {
  const heroBg = useMemo(() => {
    const images = ["/assets/header_bg_1.jpg", "/assets/header_bg_2.jpg"];
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  const heroRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (!heroRef.current) return;
      const bottom = heroRef.current.getBoundingClientRect().bottom;
      setStuck(bottom <= 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <section
        ref={heroRef}
        className="hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero__shade" />

        <div className="hero__center">
          <div className="hero__brand">
            <img
              className="heroLogoImg logoFoldIn"
              src={logoSvg}
              alt="Night Club"
            />

            <p className="heroTagline taglineDropIn">HAVE A GOOD TIME</p>

            <img
              src="/assets/bottom_line.png"
              alt=""
              className="heroBottomLine"
            />
          </div>
        </div>

        <Navbar variant="hero" stuck={stuck} />
      </section>

      <section className="welcomeSection">
        <h2 className="welcomeHeadline">WELCOME TO NIGHT CLUB</h2>

        <img
          src="/assets/bottom_line2.png"
          alt=""
          className="welcomeBottomLine"
        />

        <div className="welcomeGrid">
          <div className="welcomeCard">
            <img src="/assets/thumb1.jpg" alt="Night Club" />
            <div className="welcomeOverlay">
              <div className="welcomeBorders" />
              <div className="welcomeText">Night Club</div>
            </div>
          </div>

          <div className="welcomeCard">
            <img src="/assets/reastaurant_1.jpg" alt="Restaurant" />
            <div className="welcomeOverlay">
              <div className="welcomeBorders" />
              <div className="welcomeText">Restaurant</div>
            </div>
          </div>

          <div className="welcomeCard">
            <img src="/assets/thumb2.jpg" alt="Bar" />
            <div className="welcomeOverlay">
              <div className="welcomeBorders" />
              <div className="welcomeText">Bar</div>
            </div>
          </div>
        </div>
      </section>

      <EventsSlider />
      <NightClubGallery />
      <NightClubTrack />
      <LatestVideo />
      <Testimonials />
      <RecentBlog />
      <Newsletter />
    </div>
  );
}
