import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../hoc';
import { slideIn } from '../utils/motion';
import { styles } from '../styles';
import contactAPI from '../services/contactApi';

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await contactAPI.submitContact(form);
      
      if (response.success) {
        setMessage({ text: 'Thank you! Your message has been sent successfully.', type: 'success' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setMessage({ text: response.message || 'Failed to send message. Please try again.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-4 sm:gap-6 lg:gap-10 overflow-hidden px-2 sm:px-4">
      <motion.div
        variants={slideIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl"
      >
        <p className={`${styles.sectionSubText} text-sm sm:text-base`}>Get in touch</p>
        <h3 className={`${styles.sectionHeadText} text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 sm:mt-8 lg:mt-12 flex flex-col gap-4 sm:gap-6 lg:gap-8"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className="bg-tertiary py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium text-xs sm:text-sm lg:text-base"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              className="bg-tertiary py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium text-xs sm:text-sm lg:text-base"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Subject</span>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What's the subject?"
              className="bg-tertiary py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium text-xs sm:text-sm lg:text-base"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Your Message</span>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What you want to say?"
              className="bg-tertiary py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium resize-none text-xs sm:text-sm lg:text-base min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]"
              required
            />
          </label>

          {message.text && (
            <div className={`p-2 sm:p-3 lg:p-4 rounded-lg mb-1 sm:mb-2 lg:mb-4 text-xs sm:text-sm lg:text-base ${
              message.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="bg-tertiary py-2 sm:py-3 lg:py-3 px-4 sm:px-6 lg:px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-[#915EFF] transition-all duration-300 text-xs sm:text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[500px] sm:h-[450px] h-[400px]"
      >
        <div className="bg-tertiary rounded-[20px] p-3 sm:p-4 md:p-6 lg:p-8 min-h-full">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px]">Let's Connect</h3>
            <p className="text-secondary text-xs sm:text-sm lg:text-[14px] mt-1 sm:mt-2">
              Feel free to reach out for collaborations or just a friendly hello!
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#915EFF] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Email</p>
                <a href="mailto:thanhcong86.work@gmail.com" className="text-secondary text-xs sm:text-sm hover:text-white transition-colors break-all">
                  thanhcong86.work@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#915EFF] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Location</p>
                <p className="text-secondary text-xs sm:text-sm">Ho Chi Minh City, Vietnam</p>
              </div>
            </div>

            <div className="flex items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#915EFF] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Phone</p>
                <p className="text-secondary text-xs sm:text-sm">+84 969 715 643</p>
              </div>
            </div>

            <div className="flex items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#0077B5] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-xs sm:text-sm lg:text-base">LinkedIn</p>
                <a href="https://www.linkedin.com/in/moclaw" target="_blank" rel="noopener noreferrer" className="text-secondary text-xs sm:text-sm hover:text-white transition-colors break-all">
                  linkedin.com/in/moclaw
                </a>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6 border-t border-gray-600">
              <p className="text-white font-medium mb-2 text-xs sm:text-sm lg:text-base">Availability</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Remote</span>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Hybrid</span>
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">Full-time</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
