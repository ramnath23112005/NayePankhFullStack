import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiHeart,
  HiEye,
  HiBookOpen,
  HiUsers,
  HiGlobe,
  HiLightningBolt,
  HiShieldCheck,
  HiHand,
  HiAcademicCap,
  HiArrowRight,
} from 'react-icons/hi';

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

const teamMembers = [
  { name: 'Dr. Arjun Mehta', role: 'Founder & Chairman', desc: 'Social entrepreneur with 20+ years in community development.' },
  { name: 'Sneha Kapoor', role: 'Executive Director', desc: 'Leading operations and strategic growth initiatives.' },
  { name: 'Rohan Desai', role: 'Programs Head', desc: 'Designing impactful programs for underserved communities.' },
  { name: 'Neha Gupta', role: 'Finance & Admin', desc: 'Ensuring transparency and efficient resource management.' },
  { name: 'Amit Sharma', role: 'Communications Lead', desc: 'Amplifying our voice through strategic storytelling.' },
  { name: 'Priya Nair', role: 'Volunteer Coordinator', desc: 'Building and nurturing our volunteer community.' },
];

const valuesData = [
  { icon: HiHeart, title: 'Compassion', desc: 'We lead with empathy and understanding in all our interactions.' },
  { icon: HiShieldCheck, title: 'Integrity', desc: 'Transparency and accountability are the foundations of our work.' },
  { icon: HiUsers, title: 'Collaboration', desc: 'We believe in the power of partnerships and collective action.' },
  { icon: HiLightningBolt, title: 'Innovation', desc: 'Creative solutions drive sustainable and scalable impact.' },
  { icon: HiGlobe, title: 'Inclusivity', desc: 'Every voice matters. We embrace diversity in all its forms.' },
  { icon: HiAcademicCap, title: 'Empowerment', desc: 'We equip communities with tools to build their own futures.' },
];

const stats = [
  { label: 'Years of Service', value: '5+' },
  { label: 'Active Volunteers', value: '2,500+' },
  { label: 'Communities Served', value: '120+' },
  { label: 'Projects Completed', value: '300+' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-extrabold mb-4"
            >
              About <span className="text-green-200">NayePankh</span> Foundation
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed"
            >
              We are a grassroots NGO committed to empowering communities through
              sustainable development, education, healthcare, and environmental
              stewardship.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-8 md:p-10 border border-green-100 dark:border-green-800/30"
            >
              <div className="inline-flex p-3 bg-green-200 dark:bg-green-700/40 rounded-xl mb-4">
                <HiEye className="w-7 h-7 text-green-700 dark:text-green-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To uplift underserved communities by providing access to quality
                education, healthcare, skill development, and environmental
                sustainability programs, fostering self-reliance and lasting
                positive change.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-8 md:p-10 border border-green-100 dark:border-green-800/30"
            >
              <div className="inline-flex p-3 bg-green-200 dark:bg-green-700/40 rounded-xl mb-4">
                <HiLightningBolt className="w-7 h-7 text-green-700 dark:text-green-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                A world where every individual has equal opportunities to thrive,
                communities are self-sustaining, and collective compassion drives
                a just, equitable, and environmentally conscious society.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our <span className="text-green-600">Story</span>
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  NayePankh Foundation was born in 2020 when a group of like-minded
                  individuals came together with a shared vision — to bridge the gap
                  between privilege and need. What started as small community drives
                  in a single neighborhood soon grew into a registered non-profit
                  organization.
                </p>
                <p>
                  The name "NayePankh" translates to "New Wings" — symbolizing our
                  belief that every individual, given the right opportunities, can soar
                  to new heights. Over the years, we have expanded our reach to over
                  120 communities, touching thousands of lives through education,
                  health, and environmental initiatives.
                </p>
                <p>
                  Today, with a dedicated team, thousands of volunteers, and
                  meaningful partnerships, we continue to grow, innovate, and
                  create lasting change — one community at a time.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800/40 dark:to-green-700/30 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <HiHeart className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-green-800 dark:text-green-300 font-bold text-2xl">2020</div>
                  <div className="text-green-700 dark:text-green-400 font-medium">Founded with Purpose</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
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
              Our <span className="text-green-600">Impact</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Numbers that reflect our commitment and the lives we've touched.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
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
              Meet Our <span className="text-green-600">Team</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Passionate individuals working tirelessly to drive our mission forward.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                  {member.name.split(' ').map((n) => n.charAt(0)).join('')}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">{member.role}</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{member.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
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
              Our <span className="text-green-600">Core Values</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            >
              The principles that guide every decision, action, and initiative we undertake.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {valuesData.map((val) => (
              <motion.div
                key={val.title}
                variants={fadeUp}
                className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <val.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{val.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-extrabold mb-4"
            >
              Want to Be Part of Our Story?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-green-100 mb-8"
            >
              Join us in our journey to create a better world. Every contribution counts.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link
                to="/volunteer/register"
                className="px-8 py-3.5 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
              >
                Join as Volunteer
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-colors border-2 border-green-400"
              >
                Contact Us <HiArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
