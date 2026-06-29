import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="relative mb-8 flex h-12 items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
      >
        <ArrowLeft size={22} />
      </button>
    </header>
  );
}

export default Header;
