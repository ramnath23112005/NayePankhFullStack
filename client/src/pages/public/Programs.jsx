import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiHeart,
  HiBookOpen,
  HiSun,
  HiGlobe,
  HiLightningBolt,
  HiUserGroup,
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

const programs = [
  {
    icon: HiHeart,
    title: 'Community Outreach',
    tagline: 'Building bridges, strengthening communities',
    description:
      'Our Community Outreach program focuses on reaching marginalized and underprivileged communities with essential resources, awareness campaigns, and support services. We conduct regular visits, distribute necessities, organize legal aid camps, and provide counseling services to ensure that no community is left behind in the journey toward development.',
    impacts: [
      { label: 'Communities Reached', value: '120+' },
      { label: 'Families Supported', value: '15,000+' },
      { label: 'Awareness Camps', value: '200+' },
    ],
  },
  {
    icon: HiBookOpen,
    title: 'Education for All',
    tagline: 'Empowering minds, shaping futures',
    description:
      'Education is the most powerful tool for change. Our Education for All program provides scholarships, after-school tutoring, digital literacy classes, and learning resources to children and adults alike. We run learning centers in underserved areas and partner with schools to ensure every child has access to quality education.',
    impacts: [
      { label: 'Students Enrolled', value: '5,000+' },
      { label: 'Scholarships Awarded', value: '1,200+' },
      { label: 'Learning Centers', value: '25' },
    ],
  },
  {
    icon: HiSun,
    title: 'Health & Sanitation',
    tagline: 'Healthy communities, brighter tomorrow',
    description:
      'We organize free health checkup camps, distribute hygiene kits, conduct sanitation drives, and run awareness programs on preventive healthcare. Our mobile health units reach remote areas, and we partner with local clinics to provide follow-up care. Mental health support and nutrition programs are also key components of this initiative.',
    impacts: [
      { label: 'Health Camps', value: '150+' },
      { label: 'Patients Treated', value: '25,000+' },
      { label: 'Sanitation Drives', value: '80+' },
    ],
  },
  {
    icon: HiGlobe,
    title: 'Environmental Conservation',
    tagline: 'Protecting nature, securing the future',
    description:
      'Through tree plantation drives, waste management initiatives, water conservation projects, and environmental education, we work to protect our planet. Our "Green Schools" program teaches children about sustainability, while our community clean-up drives engage thousands of volunteers in keeping neighborhoods clean and green.',
    impacts: [
      { label: 'Trees Planted', value: '50,000+' },
      { label: 'Clean-up Drives', value: '120+' },
      { label: 'Schools Engaged', value: '60+' },
    ],
  },
  {
    icon: HiLightningBolt,
    title: 'Skill Development',
    tagline: 'Unlocking potential, creating opportunities',
    description:
      'Our Skill Development program offers vocational training in tailoring, computer literacy, electrician work, beautician skills, and more. We partner with industry experts to provide certification courses and job placement assistance, empowering individuals with the skills they need to secure sustainable livelihoods.',
    impacts: [
      { label: 'Individuals Trained', value: '3,000+' },
      { label: 'Vocational Courses', value: '12' },
      { label: 'Job Placements', value: '800+' },
    ],
  },
  {
    icon: HiUserGroup,
    title: 'Women Empowerment',
    tagline: 'Empowering women, strengthening society',
    description:
      'We run self-help groups, leadership workshops, financial literacy programs, and legal awareness camps specifically for women. Our initiatives help women gain confidence, develop entrepreneurial skills, and become active participants in their communities. We also provide a safe space for women to share experiences and seek support.',
    impacts: [
      { label: 'Women Benefited', value: '8,000+' },
      { label: 'Self-Help Groups', value: '100+' },
      { label: 'Workshops Conducted', value: '250+' },
    ],
  },
];

export default function Programs() {
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
              Our <span className="text-green-200">Programs</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive initiatives designed to create sustainable impact across
              education, health, environment, livelihoods, and community development.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                    <program.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {program.title}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-3 italic">
                    {program.tagline}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {program.description}
                  </p>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                      Impact Stats
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {program.impacts.map((impact) => (
                        <div key={impact.label} className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {impact.value}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{impact.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Want to <span className="text-green-600">Contribute?</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Your time, skills, and resources can help us scale these programs and reach
              more communities. Join us as a volunteer or intern.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link
                to="/volunteer/register"
                className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                Become a Volunteer
              </Link>
              <Link
                to="/internship/apply"
                className="px-8 py-3.5 border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 font-semibold rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                Apply for Internship
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
