import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiUserGroup,
  HiCalendar,
  HiAcademicCap,
  HiHeart,
  HiGlobe,
  HiBookOpen,
  HiLightningBolt,
  HiSun,
  HiChevronLeft,
  HiChevronRight,
  HiArrowRight,
  HiStar,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function StatCard({ icon: Icon, label, value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const target = parseInt(value.replace(/,/g, ''));
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 text-center"
    >
      <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
        <Icon className="w-7 h-7 text-green-600 dark:text-green-400" />
      </div>
      <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
        {count.toLocaleString()}+
      </div>
      <div className="text-gray-500 dark:text-gray-400 font-medium">{label}</div>
      {suffix && (
        <div className="text-sm text-green-600 dark:text-green-400 mt-1">{suffix}</div>
      )}
    </motion.div>
  );
}

function TestimonialCard({ name, role, text, rating }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700 min-w-0 sm:min-w-[320px] md:min-w-[400px]">
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <HiStar
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">{text}</p>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{role}</div>
        </div>
      </div>
    </div>
  );
}

function ProgramCard({ icon: Icon, title, description, link }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
    >
      <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
        <Icon className="w-7 h-7 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{description}</p>
      <Link
        to={link}
        className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:underline"
      >
        Learn More <HiArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </motion.div>
  );
}

function EventCard({ event }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-shadow"
    >
      <div className="h-40 bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center">
        <HiCalendar className="w-12 h-12 text-white/60" />
      </div>
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <HiCalendar className="w-4 h-4 mr-1" />
          {event.date}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
        <Link
          to={`/events`}
          className="inline-flex items-center text-green-600 dark:text-green-400 font-medium text-sm hover:underline"
        >
          View Details <HiArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
}

const programsData = [
  {
    icon: HiHeart,
    title: 'Community Outreach',
    description:
      'Reaching underserved communities with essential resources, awareness programs, and support services to bridge gaps and foster inclusive growth.',
    link: '/programs',
  },
  {
    icon: HiBookOpen,
    title: 'Education for All',
    description:
      'Providing quality education, scholarships, and learning resources to children and adults, ensuring no one is left behind in the pursuit of knowledge.',
    link: '/programs',
  },
  {
    icon: HiSun,
    title: 'Health & Sanitation',
    description:
      'Organizing health camps, sanitation drives, and awareness campaigns to promote physical well-being and environmental hygiene in local communities.',
    link: '/programs',
  },
  {
    icon: HiGlobe,
    title: 'Environmental Conservation',
    description:
      'Driving tree plantation drives, waste management initiatives, and sustainability education to protect our planet for future generations.',
    link: '/programs',
  },
];

const eventsData = [
  {
    title: 'Annual Health Camp 2025',
    date: 'April 15, 2025',
    description: 'Free health checkups, consultations, and medicine distribution for underprivileged communities.',
  },
  {
    title: 'Tree Plantation Drive',
    date: 'May 5, 2025',
    description: 'Join us in planting 10,000 trees across the city to combat climate change and restore green cover.',
  },
  {
    title: 'Education Fair',
    date: 'June 20, 2025',
    description: 'An interactive fair connecting students with scholarship opportunities and educational resources.',
  },
];

const testimonials = [
  {
    name: 'Anita Sharma',
    role: 'Volunteer since 2022',
    rating: 5,
    text: 'Volunteering with NayePankh has been the most rewarding experience of my life. The impact we create together in communities is truly inspiring.',
  },
  {
    name: 'Rahul Verma',
    role: 'Intern 2024',
    rating: 5,
    text: 'The internship program gave me hands-on experience in grassroots development. I learned more here than in any classroom setting.',
  },
  {
    name: 'Priya Patel',
    role: 'Community Volunteer',
    rating: 4,
    text: 'Being part of the health initiatives has allowed me to give back to my community in meaningful ways. Every event touches lives.',
  },
  {
    name: 'Vikram Singh',
    role: 'Education Volunteer',
    rating: 5,
    text: 'Teaching underprivileged children through NayePankh programs has opened my eyes to the power of education. Truly transformative.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const scrollTestimonial = (dir) => {
    setTestimonialIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  const handleCTAClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };



  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
            >
              Empowering Communities,{' '}
              <span className="text-green-200">Transforming Lives</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed max-w-2xl"
            >
              NayePankh Foundation is dedicated to creating sustainable change through
              community-driven programs, education, healthcare, and environmental
              initiatives. Join us in building a better tomorrow.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => handleCTAClick('/volunteer/register')}
                className="px-8 py-3.5 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
              >
                Join as Volunteer
              </button>
              <button
                onClick={() => handleCTAClick('/internship/apply')}
                className="px-8 py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-colors border-2 border-green-400 shadow-lg"
              >
                Apply for Internship
              </button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <StatCard icon={HiUserGroup} label="Active Volunteers" value="2500" />
            <StatCard icon={HiCalendar} label="Events Organized" value="500" />
            <StatCard icon={HiAcademicCap} label="Interns Trained" value="350" />
            <StatCard icon={HiHeart} label="Communities Reached" value="120" suffix="Villages & Towns" />
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our <span className="text-green-600">Mission</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                At NayePankh Foundation, we believe in the power of collective action.
                What started as a small group of passionate individuals has grown into a
                movement of thousands dedicated to uplifting communities through
                education, healthcare, environmental sustainability, and skill
                development.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
              >
                Learn More About Us <HiArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <HiHeart className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-green-800 dark:text-green-300 font-semibold text-lg">
                    Since 2020
                  </p>
                  <p className="text-green-700 dark:text-green-400">Making a Difference</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Our <span className="text-green-600">Programs</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Comprehensive initiatives designed to create lasting impact across multiple dimensions of community well-being.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {programsData.map((prog) => (
              <ProgramCard key={prog.title} {...prog} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Upcoming <span className="text-green-600">Events</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Join us in making a difference. Participate in our upcoming events and activities.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {eventsData.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              View All Events <HiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              What Our <span className="text-green-600">Volunteers</span> Say
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400"
            >
              Real stories from the people who make our mission possible.
            </motion.p>
          </motion.div>
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
              >
                <TestimonialCard {...testimonials[testimonialIndex]} />
              </motion.div>
            </div>
            <button
              onClick={() => scrollTestimonial(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <HiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => scrollTestimonial(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <HiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === testimonialIndex
                    ? 'bg-green-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-extrabold mb-4"
            >
              Ready to Make a Difference?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-green-100 mb-8 max-w-2xl mx-auto"
            >
              Whether you want to volunteer your time, apply for an internship, or
              partner with us, there are countless ways to contribute to the cause.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleCTAClick('/volunteer/register')}
                className="px-8 py-3.5 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
              >
                Get Started Today
              </button>
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-colors border-2 border-green-400"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
