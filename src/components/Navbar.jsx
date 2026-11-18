import { useNavigate } from "react-router-dom";

import StudioHeader from "../pages/Home/studio/StudioHeader";

import "../pages/Home/studio/studio.css";

/* Inner pages share the floating studio header. */
function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="dv-home dv-bar-only">
      <StudioHeader mode="pages" onStart={() => navigate("/contact")} />
    </div>
  );
}

export default Navbar;
