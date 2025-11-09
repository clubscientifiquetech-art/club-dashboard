import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ToolBar from "../components/ToolBar";
import MembersTable from "../components/MembersTable";
import { downloadJSONAsCSV } from "../utils/JsonToCsv";

export default function Members({ members, setMembers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(undefined);
  const { token } = useAuth();

  const verifyMember = async (id) => {
    try {
      const res = await fetch(
        `https://club-server-25gd.onrender.com/members/verify/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // if your API requires auth
          },
        }
      );
      if (!res.ok) throw new Error("Failed to verify member");

      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member._id === id ? { ...member, verified: true } : member
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeMember = async (id) => {
    try {
      const res = await fetch(
        `https://club-server-25gd.onrender.com/members/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // if required
          },
        }
      );
      if (!res.ok) throw new Error("Failed to remove member");

      // remove from local state after successful deletion
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const download = () => downloadJSONAsCSV(members, "members.csv");

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-sm border border-[#e5e7eb]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1f2937]">
          Members Management
        </h1>
        <p className="text-sm text-[#6b7280]">Manage and verify club members</p>
      </div>

      <ToolBar
        setSearchQuery={setSearchQuery}
        verifiedFilter={verifiedFilter}
        setVerifiedFilter={setVerifiedFilter}
        download={download}
      />
      <MembersTable
        members={members.filter((m) => {
          const matchesSearch = m.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesVerified =
            verifiedFilter === undefined ? true : m.verified === verifiedFilter;
          return matchesSearch && matchesVerified;
        })}
        verifyMember={verifyMember}
        removeMember={removeMember}
      />
    </div>
  );
}
