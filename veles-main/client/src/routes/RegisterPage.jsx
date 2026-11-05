import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[70dvh] overflow-x-hidden px-2 py-8">
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default RegisterPage;
