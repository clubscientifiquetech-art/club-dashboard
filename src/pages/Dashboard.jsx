import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Members from "../layouts/Members";
import Events from "../layouts/Events";
import Gallery from "../layouts/Gallery";

const layouts = [Members, Events, Gallery];

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [active, setActive] = useState(0);
  const { token } = useAuth()
  const ActiveLayout = layouts[active];


  // Fetch members from API
  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch("https://club-server-25gd.onrender.com/members", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }

    fetchMembers();
  }, [token]);

  // Conditionally set props based on active layout
  const layoutProps =
    active === 0
      ? { members, setMembers } // Members layout
      : active === 1
        ? { members } // Events layout
        : {}; // Gallery layout

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7] px-6 sm:px-12 md:px-24 lg:px-48 py-12">
      <h1 className="text-4xl my-4 text-center md:text-start">Admin Dashboard</h1>
      <p className="text-center md:text-start">
        Manage members, events, and gallery collections
      </p>
      <NavBar active={active} setActive={setActive} />
      <ActiveLayout {...layoutProps} />
    </div>
  );
}
