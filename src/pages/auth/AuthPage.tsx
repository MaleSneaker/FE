import Login from "./login/Login";
import Register from "./register/Register";

export default function AuthPage() {
  return (
    <div className="max-w-default default:mx-auto mx-8 grid grid-cols-2 gap-[5%] pt-[5%]">
      <Login />
      <Register />
    </div>
  );
}
