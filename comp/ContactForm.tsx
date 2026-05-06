"use client";
import { apiContactForm } from '@/apis/user';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
    domain: string;
}

const ContactForm = ({ domain }: Props) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !number.trim() || !email.trim() || !message.trim()) {
            toast.error('All fields are required.', { autoClose: 2000 });
            return;
        }

        setLoading(true);

        try {
            const res = await apiContactForm(domain, name, number, email, message);

            if (res?.status == 200) {
                toast.success('Your message has been sent!', { autoClose: 2000 });
                setName('');
                setNumber('');
                setEmail('');
                setMessage('');
            } else {
                toast.error('Something went wrong. Try again!', { autoClose: 2000 });
            }
        } catch (error) {
            toast.error('Failed to send message. Please try again later.', { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden group">
            {/* Subtle Top Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1a1612] via-[#FF5F1F] to-[#1a1612] opacity-80" />
            
            <h2 className="text-3xl font-black text-[#1a1612] mb-2 tracking-tight uppercase">Get In Touch</h2>
            <p className="text-gray-400 mb-10 font-medium text-sm tracking-wide">We&apos;d love to hear from you. Please fill out this form.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group/field">
                    <label className="block text-[10px] font-black text-[#1a1612] uppercase tracking-[0.2em] mb-2 ml-5">Your Name</label>
                    <input
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full px-7 py-4 bg-[#fcfcfc] border border-gray-100 rounded-full focus:ring-4 focus:ring-[#FF5F1F]/5 focus:border-[#FF5F1F] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 text-[#1a1612] font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group/field">
                        <label className="block text-[10px] font-black text-[#1a1612] uppercase tracking-[0.2em] mb-2 ml-5">Phone Number</label>
                        <input
                            type="text"
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-7 py-4 bg-[#fcfcfc] border border-gray-100 rounded-full focus:ring-4 focus:ring-[#FF5F1F]/5 focus:border-[#FF5F1F] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 text-[#1a1612] font-medium"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>
                    <div className="group/field">
                        <label className="block text-[10px] font-black text-[#1a1612] uppercase tracking-[0.2em] mb-2 ml-5">Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full px-7 py-4 bg-[#fcfcfc] border border-gray-100 rounded-full focus:ring-4 focus:ring-[#FF5F1F]/5 focus:border-[#FF5F1F] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 text-[#1a1612] font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="group/field">
                    <label className="block text-[10px] font-black text-[#1a1612] uppercase tracking-[0.2em] mb-2 ml-5">Your Message</label>
                    <textarea
                        placeholder="How can we help you?"
                        rows={5}
                        className="w-full px-8 py-6 bg-[#fcfcfc] border border-gray-100 rounded-[2.5rem] focus:ring-4 focus:ring-[#FF5F1F]/5 focus:border-[#FF5F1F] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 text-[#1a1612] font-medium resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group/btn relative w-full md:w-auto overflow-hidden bg-[#1a1612] text-white font-black px-14 py-4 rounded-full transition-all duration-500 hover:shadow-[0_15px_30px_-10px_rgba(255,95,31,0.4)] active:scale-95 disabled:opacity-70"
                    >
                        {/* Hover Background Slide Effect */}
                        <div className="absolute inset-0 w-0 bg-[#FF5F1F] transition-all duration-500 ease-out group-hover/btn:w-full" />
                        
                        <span className="relative z-10 uppercase tracking-widest text-xs">
                            {loading ? 'Sending...' : 'Send Message'}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;