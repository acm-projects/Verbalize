import { login, signup } from "./actions";
import Login from "../components/Login";
import SignInWithGoogleButton from "./signInWithGoogleButton";

export default function LoginPage() {
  return (
    <div>
      <Login />
    </div>
  );
}