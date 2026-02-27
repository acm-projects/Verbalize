import { login, signup } from "./actions";
import SignInWithGoogleButton from "./signInWithGoogleButton";

export default function LoginPage() {
  return (
    <div>

      {/* Form 1: Email/password */}
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />

        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>

      {/* Form 2: Google login (separate form) */}
      <SignInWithGoogleButton />

    </div>
  );
}