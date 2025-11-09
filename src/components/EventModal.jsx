import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

export default function EventModal({ setEvents, setShowModal }) {
    const [newEvent, setNewEvent] = useState({
        activity: "Échecs",
        title: "",
        description: "",
        date: "",
        location: "",
    });
    const { token } = useAuth()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("https://club-server-25gd.onrender.com/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newEvent),
            });

            if (!res.ok) throw new Error("Failed to create event");
            const data = await res.json();
            setEvents((prev) => [...prev, data]);
            setShowModal(false);
            setNewEvent({
                activity: "Échecs",
                title: "",
                description: "",
                date: "",
                location: "",
                memberLimit: "",
            });
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md relative">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-3 right-3 text-gray-700 hover:text-black"
                >
                    <X size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-6 border-b border-black pb-2">
                    Create New Event
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold">Activity</label>
                        <select
                            name="activity"
                            value={newEvent.activity}
                            onChange={handleChange}
                            className="w-full border border-black rounded-md p-2"
                        >
                            <option>Échecs</option>
                            <option>Robotique</option>
                            <option>Prix du meilleur TIPE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Title</label>
                        <input
                            name="title"
                            value={newEvent.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-black rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={newEvent.description}
                            onChange={handleChange}
                            required
                            className="w-full border border-black rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Date</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={newEvent.date}
                            onChange={handleChange}
                            required
                            className="w-full border border-black rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Location</label>
                        <input
                            name="location"
                            value={newEvent.location}
                            onChange={handleChange}
                            required
                            className="w-full border border-black rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Member Limit</label>
                        <input
                            type="number"
                            name="memberLimit"
                            value={newEvent.memberLimit}
                            onChange={handleChange}
                            required
                            className="w-full border border-black rounded-md p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all"
                    >
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    )
}