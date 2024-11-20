import React from 'react';
import { SectionWrapper } from '../hoc';

const Contact = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="contact-container rounded-[2px] shadow-card" style={styles.contactContainer}>
      <div className={`bg-tertiary rounded-[20px] py-5 min-h-[280px] flex justify-start items-start flex-col ${!isMobile ? 'px-12' : ''}`}>
        <h2 className={`contact-title text-white font-bold mb-4 ${!isMobile ? 'text-center text-[24px]' : 'text-[20px] px-12'}`} style={{ ...styles.contactTitle, textAlign: 'center' }}>Contact Me</h2>
        <p className="contact-info text-white text-[15px] mb-2" style={{ ...styles.contactInfo, marginLeft: '20px' }}>Name: Moclaw Nguyen</p>
        <p className="contact-info text-white text-[15px] mb-2" style={{ ...styles.contactInfo, marginLeft: '20px' }}>Phone: +84 969715643</p>
        <p className="contact-info text-white text-[15px] mb-2" style={{ ...styles.contactInfo, marginLeft: '20px' }}>Email: <a href="mailto:thanhcong86.work@gmail.com" style={styles.contactLink}>thanhcong86.work@gmail.com</a></p>
        <p className="contact-info text-white text-[15px] mb-2" style={{ ...styles.contactInfo, marginLeft: '20px' }}>Location: Ho Chi Minh City, Viet Nam</p>
        <p className="contact-info text-white text-[15px] mb-4" style={{ ...styles.contactInfo, marginLeft: '20px' }}>Work Type: Remote, Hybrid</p>
        <p className="contact-info text-white text-[15px] mb-4" style={{ ...styles.contactInfo, marginLeft: '20px' }}>
          LinkedIn: <a href="https://www.linkedin.com/in/moclaw" target="_blank" rel="noopener noreferrer" className="contact-link text-blue-500 hover:underline" style={styles.contactLink}>moclaw</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  contactContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'var(--background-color)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--box-shadow)',
  },
  contactTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'var(--primary-color)',
    textAlign: 'center', // Center the title
  },
  contactInfo: {
    fontSize: '0.9375rem', // Reduced font size
    marginBottom: '0.5rem',
    color: 'var(--text-color)',
  },
  contactLink: {
    color: 'var(--link-color)',
    textDecoration: 'none',
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  '@media (max-width: 768px)': {
    contactContainer: {
      padding: '5px',
    },
    contactTitle: {
      fontSize: '1rem',
    },
    contactInfo: {
      fontSize: '0.875rem', // Reduced font size for responsive
    },
  },
};

export default SectionWrapper(Contact, 'contact');
