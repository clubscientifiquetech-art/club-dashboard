import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import { Plus } from "lucide-react";

export default function Events({ members }) {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("https://club-server-25gd.onrender.com/events");
                if (!res.ok) throw new Error("Failed to fetch events");
                const data = await res.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
        fetchEvents();
    }, []);

    const now = new Date();
    const upcoming = events.filter((e) => new Date(e.date) > now);
    const past = events.filter((e) => new Date(e.date) <= now);

    return (
        <div className="py-8 relative">
            {/* Add Event Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-10 right-10 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
            >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Event</span>
            </button>

            {/* Upcoming Events */}
            <section className="mb-12">
                <h1 className="text-3xl font-bold mb-6 border-b border-black pb-2">
                    Upcoming Events
                </h1>
                {upcoming.length > 0 ? (
                    upcoming
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((event, i) => <EventCard key={i} index={i} event={event} events={events} setEvents={setEvents} members={members} />)
                ) : (
                    <p className="text-gray-600 italic">No upcoming events.</p>
                )}
            </section>

            {/* Past Events */}
            <section>
                <h1 className="text-3xl font-bold mb-6 border-b border-black pb-2">
                    Past Events
                </h1>
                {past.length > 0 ? (
                    past
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((event, i) => <EventCard key={i} index={i} event={event} events={events} setEvents={setEvents} members={members} />)
                ) : (
                    <p className="text-gray-600 italic">No past events yet.</p>
                )}
            </section>

            {/* Modal */}
            {showModal && <EventModal setEvents={setEvents} setShowModal={setShowModal} />}
        </div>
    );
}
