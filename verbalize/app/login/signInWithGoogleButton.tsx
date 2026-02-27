import { signInWithGoogle } from "./actions";

export default function SignInWithGoogleButton() {
  return (
    <form action={signInWithGoogle}>
      <button
        type="submit"
        className="w-full border border-gray-400 rounded-md py-2 px-4 hover:bg-gray-100"
      >
        Login with Google
      </button>
    </form>
  );
}