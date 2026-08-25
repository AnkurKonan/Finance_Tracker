import { Link } from "react-router-dom";

function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  return (
    <nav
      className="
      bg-slate-900
      text-white
      px-6
      py-4
      flex
      justify-between
      "
    >
      <h1
        className="
        font-bold
        text-xl
        "
      >
        Finance Tracker
      </h1>

      <div
        className="
        flex
        gap-4
        "
      >
        <Link to="/dashboard">Dashboard</Link>

        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
