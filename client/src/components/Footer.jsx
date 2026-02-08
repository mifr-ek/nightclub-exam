import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import footerbg from "../assets/bg/footerbg.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faSnapchatGhost,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const API_URL = "http://localhost:4000/blogposts";

function getSnippet(post) {
  const raw = post?.content ?? post?.text ?? post?.title ?? "";
  return String(raw).trim().slice(0, 56);
}

function getImg(post) {
  return post?.asset?.url || "";
}

export default function Footer() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Bad response");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        if (!alive) return;

        setPosts(arr.slice(0, 2));
      } catch {
        if (!alive) return;
        setPosts([]);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const addressText = "Kompgangstræde 278, 1265 København K";

  const mapsUrl = useMemo(() => {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(addressText)
    );
  }, [addressText]);

  return (
    <footer className="footer" style={{ backgroundImage: `url(${footerbg})` }}>
      <div className="footerOverlay" />

      <div className="footerInner">
        <div className="footerCol footerColLeft">
          <Link to="/" className="footerLogoLink" aria-label="Go to homepage">
            <h2 className="footerLogo">
              NIGHT<span>CLUB</span>
            </h2>
          </Link>

          <p className="footerTagline">HAVE A GOOD TIME</p>

          <h4 className="footerHeading">LOCATION</h4>

          <a
            className="footerAddressLink"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Kompgangstræde 278
            <br />
            1265 København K
          </a>

          <h4 className="footerHeading footerHeadingSpaced">OPENING HOURS</h4>
          <p className="footerLine">WED - THU 10:30 PM TO 3 AM</p>
          <p className="footerLine">SAT - SUN 11 PM TO 5 AM</p>
        </div>

        <div className="footerCol footerColMid">
          <h4 className="footerHeading">RECENT POSTS</h4>

          <div className="footerPostList">
            {posts.map((post) => {
              const img = getImg(post);

              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="footerPostLink"
                >
                  <div className="footerPost">
                    <div className="footerThumb">
                      {img ? <img src={img} alt="" /> : null}
                    </div>

                    <div className="footerPostText">
                      <p className="footerPostSnippet">{getSnippet(post)}...</p>
                      <span className="footerPostDate">April 17, 2018</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="footerCol footerColRight">
          <h4 className="footerHeading">RECENT TWEETS</h4>

          <div className="footerTweet">
            <a
              className="footerTweetLink"
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
            >
              <span className="tweetIconWrap" aria-hidden="true">
                <FontAwesomeIcon icon={faTwitter} />
              </span>
              It is a long established fact that a reader will be distracted...
            </a>
            <span className="tweetTime">5 hours ago</span>
          </div>

          <div className="footerTweet footerTweetSpaced">
            <a
              className="footerTweetLink"
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
            >
              <span className="tweetIconWrap" aria-hidden="true">
                <FontAwesomeIcon icon={faTwitter} />
              </span>
              It is a long established fact that a reader will be distracted...
            </a>
            <span className="tweetTime">5 hours ago</span>
          </div>
        </div>
      </div>

      <div className="footerSocialCenter" aria-label="Social links">
        <div className="footerSocialTitle">Stay Connected With Us</div>

        <div className="footerSocialIcons">
          <a
            className="footerSocialIcon"
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            title="Facebook"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>

          <a
            className="footerSocialIcon"
            href="https://snapchat.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Snapchat"
            title="Snapchat"
          >
            <FontAwesomeIcon icon={faSnapchatGhost} />
          </a>

          <a
            className="footerSocialIcon"
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>

      <div className="footerBottom">
        <span className="footerBottomText">
          Night Club PSD Template - All Rights Reserved
        </span>

        <span className="footerBottomText">Copyright © NightClub</span>
      </div>
    </footer>
  );
}
