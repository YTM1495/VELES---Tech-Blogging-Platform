import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[70dvh] overflow-x-hidden px-2 py-8">
      <SignIn signUpUrl="/register"/>
    </div>
  );
};

export default LoginPage;
