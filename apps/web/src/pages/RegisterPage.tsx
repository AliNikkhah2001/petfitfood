import { Navigate } from "react-router-dom";

/** Registration uses the same OTP flow as login, with name required. */
export default function RegisterPage() {
  return <Navigate to="/login?mode=register" replace />;
}
