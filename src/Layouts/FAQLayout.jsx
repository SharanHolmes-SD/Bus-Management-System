import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function FAQLayout() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const faqRefs = useRef([]);

  const faqs = [
    {
      id: 1,
      question: "How do I book a bus seat online?",
      answer: "To book a bus seat online, visit our website or mobile app, enter your departure and destination cities, select your travel date, choose your preferred bus and seat, and complete the payment process. You'll receive a confirmation email and e-ticket after booking."
    },
    {
      id: 2,
      question: "Can I select my preferred seat?",
      answer: "Yes, you can select your preferred seat during the booking process. Our seat map displays available seats, allowing you to choose based on your preference (window, aisle, front, back, etc.). Seats marked in red are already booked."
    },
    {
      id: 3,
      question: "What is the cancellation policy for bus tickets?",
      answer: "Our cancellation policy varies depending on how far in advance you cancel. Generally, cancellations made 48+ hours before departure receive 90% refund, 24-48 hours receive 75% refund, and less than 24 hours receive 50% refund. No refunds are issued after the bus has departed."
    },
    {
      id: 4,
      question: "How early should I arrive before bus departure?",
      answer: "We recommend arriving at least 30 minutes before the scheduled departure time. This allows sufficient time for check-in, luggage loading, and boarding. During peak travel seasons, consider arriving 45-60 minutes early."
    },
    {
      id: 5,
      question: "Are there any baggage allowance restrictions?",
      answer: "Each passenger is allowed one piece of luggage (up to 20kg) to be stored in the cargo area, plus one small carry-on bag. Additional or overweight luggage may incur extra charges. Please check specific route policies as they may vary."
    },
    {
      id: 6,
      question: "Can I modify my booking after confirmation?",
      answer: "Yes, you can modify your booking up to 6 hours before departure, subject to seat availability. Changes may incur a small fee. To modify, log into your account, find your booking, and select the 'Modify Booking' option."
    },
    {
      id: 7,
      question: "Do children need separate tickets?",
      answer: "Children above 5 years require a separate ticket. Children under 5 years may travel on a parent's lap without a ticket, but we recommend booking a separate seat for safety and comfort on longer journeys."
    },
    {
      id: 8,
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards (Visa, MasterCard, American Express), digital wallets (Apple Pay, Google Pay), and bank transfers for online bookings. Cash payments are only accepted for in-person bookings at our terminals."
    }
  ];

  // Initialize GSAP animations on component mount
  useEffect(() => {
    // Initial animations
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from(contentRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out"
    });

    // Stagger animation for FAQ items
    gsap.from(faqRefs.current, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      delay: 0.5,
      ease: "power2.out"
    });
  }, []);

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  // Animation for expanding/collapsing FAQ answers
  useEffect(() => {
    if (activeQuestion !== null) {
      const activeElement = document.querySelector(`.answer-${activeQuestion}`);
      if (activeElement) {
        gsap.fromTo(activeElement, 
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    }
  }, [activeQuestion]);

  return (
    // Using transparent background instead of bg-gray-100
    <div className="min-h-screen mt-10 py-12 px-4 font-poppins">
      <div className="w-full mx-auto">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6" ref={headerRef}>
            <h1 className="text-3xl font-bold text-white text-center">Bus Seat Booking: Frequently Asked Questions</h1>
          </div>
          
          <div className="p-6" ref={contentRef}>
            <p className="text-gray-600 mb-8">
              Find answers to the most common questions about our bus seat booking process. 
              If you can't find what you're looking for, please contact our customer support.
            </p>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  ref={el => faqRefs.current[index] = el}
                >
                  <button
                    className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleQuestion(faq.id)}
                  >
                    <span className="font-medium text-lg text-gray-800">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${activeQuestion === faq.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    className={`answer-${faq.id} overflow-hidden`} 
                    style={{ height: activeQuestion === faq.id ? 'auto' : 0, opacity: activeQuestion === faq.id ? 1 : 0 }}
                  >
                    <div className="p-4 bg-white border-t border-gray-200">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQLayout;