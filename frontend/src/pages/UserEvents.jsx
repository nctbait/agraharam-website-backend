import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';


const availableEvents = [
    {
        id: 1,
        title: 'Tech Talk: Future of AI',
        description: 'Join us for an insightful discussion on the latest advancements in artificial intelligence.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjw_7XUOweicmniHJE4jfcBnwvVm4vO6sdhWHr3RdFUe1P1hO1eNjwCiXnkQq8njWTqht3m1fvE8zRAro4egqwi2pqjvwDTw7eY0p_SSTx4NNLVyCzBOnbs3XEUS0Sn63s9k9i7iKQVaugj34F4YnLGBwFS_DQW8Ng7yAmFyp2Nfr6pTWqCGdZ_G0WkG2QiBcdHQkvSQZmRTWwNvWlvMwVcdxnIJWA9eErEzmfW_g8Q-ap8NbkjHSYZoe2ndBVZWI_wLKW6CJQ8gY'
    },
    {
        id: 2,
        title: 'Book Club Meeting',
        description: "Discuss 'The Secret Garden' by Frances Hodgson Burnett with fellow book lovers.",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMyIkY5BwSdYeM2uI0sdmoImLsrnUNY1vU5obgyxCtRm75Rm3GxO4WNL9Th5T8kCBQm10i07g70n-EyD-mr_sPtkCLLV4H-KvZLOidBEnZQjNksE5CnVy_ga1OL60qfA3INYREVFj9iDceWUvkjLR5sn4RazsQk9PzdPiocdV96ljyutFBA3xegQV1gmBfIzcyoEXm-a908AA1cJFQXZdN72mHXWlIBPd0RZe5BvqGe-kxCytsBlCGRLX6WeFZzN3YAx2cv6zId8w'
    }
];

const registeredEvents = [
    {
        id: 3,
        title: 'Community Charity Run',
        description: 'Participate in our annual charity run to support local causes.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC48zCuDVHIGra4GebQolr2h5hPMwNqPnOPPDfdKgQ-uv9ioXcnDC2s1ep1fCtLRqFCctiDrN3rMOm9YOAy-Y_paJHhRLSlKzG4FyJDZ25nyviRhgwNpLSMDgHmRQWEaLzMG39Pu6ASTpG0obVZ_5M-CPmv7L-ZoSJhVfSCg_9MQAc6U_piUUuJbiPeSzI0Vd7rLzJXTfeNq0HGvoUzL7yg62dTha3XuvbSXVT-BCmr6H6PxRCvb89CqK_OD-4o996moFsYAK9HplQ'
    }
];

const attendedEvents = [
    {
        id: 4,
        title: 'Community Picnic',
        description: 'Enjoy a fun-filled day with your community members. Activities include games, food, and music.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy4QjffVuPm9KkeU2EofCeYT3tesAm_1WKIALGofdXbVR4zcNlQwcnPCkbsTfp8LWCEaoemhsJYG6x9rM3UdslXqxG-PZZu75WxJbfpljgVyaiawf5Hojj7MhyTaZrmJF20uL7vqH1DuxwlX_jYnQqE88r3ja_T1H5dK7on67AJLIM-aG_7gjlREGuCKfn39vvcr8GkyWqtCr--xzk6ynSfq4vMbqvVTO3lSCfAgdEYnLA-F_BE4SBeoPnihY_DajqywvFPuGFJ5o'
    }
];

export default function UserEvents() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const handleEventReg = (eventId) => {
        navigate(`/event-registration/${eventId}`);
      };

    return (
        <>
            <Navbar />
            <div className="flex">

                <Sidebar isOpen={sidebarOpen} showDashboardLink={true} />
                <div className="flex-1 p-6 space-y-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                        className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {sidebarOpen ? (
                            <ArrowLeftIcon className="h-5 w-5" />
                        ) : (
                            <Bars3Icon className="h-5 w-5" />
                        )}
                    </button>

                    <h1 className="text-2xl font-bold mb-6">Events</h1>

                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Available Events</h2>
                        <div className="flex flex-col gap-4">
                            {availableEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-xl bg-white shadow-sm p-4"
                                >
                                    <div className="flex flex-col gap-1 flex-[2_2_0px]">
                                        <p className="text-base font-bold text-[#101418]">{event.title}</p>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => handleEventReg(event.id)}
                                                className="rounded-full h-10 px-4 bg-[#eaedf1] text-[#101418] text-sm font-bold"
                                            >
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="w-full md:w-64 bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: `url(${event.image})` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </section>


                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Registered Events</h2>
                        <div className="flex flex-col gap-4">
                            {registeredEvents.map(event => (
                                <div key={event.id} className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-xl bg-white shadow-sm p-4">
                                    <div className="flex flex-col gap-1 flex-[2_2_0px]">
                                        <p className="text-base font-bold text-[#101418]">{event.title}</p>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                    <div
                                        className="w-full md:w-64 bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: `url(${event.image})` }}
                                    ></div>
                                </div>
                            ))}
                            <div className="flex flex-wrap gap-2 justify-end">
                                <button className="rounded-full h-10 px-4 bg-[#eaedf1] text-[#101418] text-sm font-bold">
                                    View/Edit Registration
                                </button>
                                <button className="rounded-full h-10 px-4 bg-[#dce7f3] text-[#101418] text-sm font-bold">
                                    Cancel Registration
                                </button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Events Attended</h2>
                        <div className="flex flex-col gap-4">
                            {attendedEvents.map(event => (
                                <div key={event.id} className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-xl bg-white shadow-sm p-4">
                                    <div className="flex flex-col gap-1 flex-[2_2_0px]">
                                        <p className="text-base font-bold text-[#101418]">{event.title}</p>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                    <div
                                        className="w-full md:w-64 bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: `url(${event.image})` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}
