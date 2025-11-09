import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { downloadJSONAsCSV } from "../utils/JsonToCsv";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ChevronDown,
    ChevronUp,
    Download,
} from "lucide-react";

export default function EventCard({ event, index, events, setEvents, members }) {
    const [expanded, setExpanded] = useState(null);
    const { token } = useAuth()
    const removeEvent = async (id) => {
        try {
            await fetch(`https://club-server-25gd.onrender.com/events/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(events.filter((e) => e._id !== id));
        } catch (error) {
            console.error("Error removing event:", error);
        }
    };

    const removeMemberFromEvent = async (eventId, memberId) => {
        try {
            // TODO
            // await fetch(
            //     `https://club-server-25gd.onrender.com/events/${eventId}/members/${memberId}`,
            //     { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            // );
            setEvents(
                events.map((e) =>
                    e._id === eventId
                        ? { ...e, members: e.members.filter((m) => m !== memberId) }
                        : e
                )
            );
        } catch (error) {
            console.error("Error removing member:", error);
        }
    };
    const isExpanded = expanded === index;
    const eventMembers =
        members?.length && event.members?.length
            ? event.members
                .map((memberId) => members.find((m) => m._id === memberId || m.id === memberId))
                .filter(Boolean)
            : [];

    return (
        <div className="border border-black rounded-2xl p-6 mb-6 shadow-sm hover:shadow-md transition-all bg-white text-black flex flex-col gap-2">
            <div>
                <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(event.date).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </span>
            </div>

            <p className="text-gray-700 mb-2">{event.description}</p>

            <div className="flex flex-col gap-1 text-sm text-gray-800 mb-2">
                <span className="flex items-center gap-1">
                    <MapPin size={16} /> {event.location}
                </span>
                <span className="flex items-center gap-1">
                    <Users size={16} /> {event.members.length}/{event.memberLimit}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={16} /> {event.activity}
                </span>
            </div>

            {/* Event actions */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => removeEvent(event._id)}
                    className="w-full py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all"
                >
                    Remove Event
                </button>

                {/* Dropdown Toggle */}
                <button
                    onClick={() => setExpanded(isExpanded ? null : index)}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-all"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={16} /> Hide Members
                        </>
                    ) : (
                        <>
                            <ChevronDown size={16} /> View Members
                        </>
                    )}
                </button>

                {/* Dropdown Content */}
                {isExpanded && (
                    <div className="mt-2 border-t border-black pt-2 flex flex-col gap-1">
                        {eventMembers.length > 0 ? (
                            <>
                                {eventMembers.map((m, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center text-sm border-b border-gray-200 pb-1"
                                    >
                                        <span>{m.username}</span>
                                        <button
                                            onClick={() => removeMemberFromEvent(event._id, m._id)}
                                            className="text-red-600 hover:text-red-800 text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => downloadJSONAsCSV(eventMembers, `${event.title}_members.csv`)} // Placeholder
                                    className="flex items-center justify-center gap-2 w-full mt-2 border border-black text-black py-1 rounded-md hover:bg-black hover:text-white transition-all"
                                >
                                    <Download size={16} /> Export Members
                                </button>
                            </>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No members joined yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};