import PageHero from "../components/PageHero";
import footerbg from "../assets/bg/footerbg.jpg";
import "../styles/Login.css";

export default function Login() {
  return (
    <main className="loginPage">
      <PageHero title="LOG IN" bgImage={footerbg} />

      <section className="loginSection">
        <div className="loginInner">
          <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
            <label className="srOnly" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="loginInput"
              type="email"
              placeholder="Email"
              autoComplete="email"
            />

            <label className="srOnly" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="loginInput"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />

            <div className="loginActions">
              <button className="loginBtn" type="submit">
                LOG IN
              </button>
            </div>

            <p className="loginHint">This is a UI-only mockup.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
