import { signInWithGoogle } from "./actions";
import GoogleButton from "../assets/google-button.png";

export default function SignInWithGoogleButton() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit" className="w-full active:scale-95 bg-white hover:bg-gray-200 text-black gap-5 font-bold py-2 rounded-xl transition-colors shadow-lg shadow-[#4A86A8]/30 flex items-center justify-center gap-2 border border-gray-300">
        <img src={GoogleButton.src} alt="Google" className="size-9 hover:shadow-lg" />
        <span>Sign in with Google</span>
      </button>
    </form>
  );
}