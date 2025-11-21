import { useDispatch } from "react-redux";
import { loginUser } from "../feature/auth/authAPI";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../app/store";



export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent) => {
    console.log("Login form submitted");
    e.preventDefault();

    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    try {
      // dispatch login
      await dispatch(loginUser(email, password));

      // after successful login → redirect
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
