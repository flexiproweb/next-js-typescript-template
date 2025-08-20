"use client";

import { useState } from "react";
import Layout from "@/components/layouts/Layout";
import FormComponent from "@/components/FormComponent";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  BuildingOffice2Icon,
  TruckIcon,
  CpuChipIcon,
  MapPinIcon,
  ArrowUpIcon,
  SparklesIcon,
  GlobeAltIcon,
  CloudIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Intellinum-specific stats
  const stats = [
    {
      title: "Oracle Implementations",
      value: "125+",
      change: "+12%",
      trend: "up",
      icon: CpuChipIcon,
      color: "primary",
    },
    {
      title: "Global Offices",
      value: "5",
      change: "+100%",
      trend: "up",
      icon: GlobeAltIcon,
      color: "secondary",
    },
    {
      title: "Supply Chain Efficiency",
      value: "97%",
      change: "+8%",
      trend: "up",
      icon: TruckIcon,
      color: "tertiary",
    },
    {
      title: "Client Success Rate",
      value: "99.2%",
      change: "+2.1%",
      trend: "up",
      icon: ShieldCheckIcon,
      color: "primary",
    },
    {
      title: "Years of Excellence",
      value: "15+",
      change: "+5%",
      trend: "up",
      icon: BuildingOffice2Icon,
      color: "secondary",
    },
  ];

  const features = [
    {
      icon: CpuChipIcon,
      title: "Expert Oracle Mobility",
      description: "Unmatched expertise to customize your Oracle applications for business mobility with seamless integration and optimal performance.",
      color: "primary"
    },
    {
      icon: TruckIcon,
      title: "Streamlined Logistics",
      description: "Optimize your logistics workflow with tailored solutions that enhance efficiency and accuracy in your supply chain operations.",
      color: "secondary"
    },
    {
      icon: CloudIcon,
      title: "Innovative Supply Chain Tools",
      description: "Develop and deploy cutting-edge tools to future-proof your supply chain and succeed in the rapidly changing global market.",
      color: "tertiary"
    },
  ];

  const globalOffices = [
    { location: "Dallas, Texas", region: "North America" },
    { location: "Jakarta, Indonesia", region: "Asia Pacific" },
    { location: "Mumbai, India", region: "Asia Pacific" },
    { location: "Dubai, UAE", region: "Middle East" },
    { location: "Singapore", region: "Asia Pacific" },
  ];

  return (
    <Layout>
      {/* Main Content Container with Consistent Spacing */}
      <div className="space-y-24 lg:space-y-32">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden mt-8 mb-16"
        >
          <div className="glass-card p-8 lg:p-16 mx-4 lg:mx-8 shadow-2xl m-2">
            {/* Floating Elements */}
            <div className="absolute top-8 right-8 w-40 h-40 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl float-element"></div>
            <div className="absolute bottom-8 left-8 w-48 h-48 bg-gradient-to-r from-secondary-500/20 to-tertiary-500/20 rounded-full blur-3xl float-element" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 text-center max-w-5xl mx-auto py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-10"
              >
                <span className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold border border-primary-200 dark:border-primary-700/50 shadow-lg">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Oracle's Preferred Partner
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-secondary font-bold mb-8 text-gray-900 dark:text-white leading-tight"
              >
                Welcome to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                    Intellinum
                  </span>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-primary-300/30 to-secondary-300/30 rounded-2xl blur-lg -z-10"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-tertiary"
              >
                Intellinum is the premier choice for your Oracle mobility and logistics implementation needs.
                As Oracle's preferred partner, our team brings unparalleled expertise with a global presence
                spanning Dallas, Texas, Indonesia, India, and Dubai.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 text-lg h-auto bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium rounded-xl hover:from-primary-700 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 group"
                >
                  <span className="flex items-center">
                    Discover Our Solutions
                    <ArrowUpIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 focus-outline text-lg">
                  View Global Offices
                </button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="my-20"
        >
          <div className="mx-4 lg:mx-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-secondary font-bold text-gray-900 dark:text-white mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Delivering excellence across global markets with measurable results
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-8 hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${stat.color === 'primary'
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : stat.color === 'secondary'
                        ? 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400'
                        : 'bg-tertiary-100 dark:bg-tertiary-900/20 text-tertiary-600 dark:text-tertiary-400'
                      } group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-semibold text-green-600 dark:text-green-400">
                      <ArrowUpIcon className="w-4 h-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 font-tertiary uppercase tracking-wider">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white font-secondary">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Mission Statement Section */}
        <motion.section
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="my-20"
        >
          <div className="glass-card p-12 lg:p-20 mx-4 lg:mx-8 shadow-2xl">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold border border-primary-200 dark:border-primary-700/50">
                  Our Vision
                </span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-secondary font-bold mb-8 text-gray-900 dark:text-white">
                Our Mission
              </h2>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-tertiary">
                At Intellinum, our mission is to innovate supply chain technology by developing market-leading
                tools that enhance efficiency, accuracy, and agility in operations. We aim to empower organizations
                with seamless, responsive, and resilient supply chains to help them succeed in the rapidly
                changing global market.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Feature Cards Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="my-20"
        >
          <div className="mx-4 lg:mx-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-secondary font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Intellinum
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive solutions that transform your business operations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                  className="holo-card group hover:scale-105 transition-all duration-500 transform p-10"
                >
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${feature.color === 'primary'
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                    : feature.color === 'secondary'
                      ? 'bg-gradient-to-br from-secondary-500 to-secondary-600'
                      : 'bg-gradient-to-br from-tertiary-500 to-tertiary-600'
                    } group-hover:shadow-2xl transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-secondary font-bold text-gray-900 dark:text-white mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Global Presence Section */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="my-20"
        >
          <div className="glass-card p-12 lg:p-16 mx-4 lg:mx-8 shadow-2xl">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-6"
              >
                <span className="inline-block px-6 py-2 bg-gradient-to-r from-secondary-100 to-tertiary-100 dark:from-secondary-900/30 dark:to-tertiary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-semibold border border-secondary-200 dark:border-secondary-700/50">
                  Worldwide Reach
                </span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-secondary font-bold mb-6 text-gray-900 dark:text-white">
                Global Presence
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Strategically positioned worldwide to serve your business needs with local expertise and global standards
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {globalOffices.map((office, index) => (
                <motion.div
                  key={office.location}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <MapPinIcon className="w-16 h-16 mx-auto mb-6 text-secondary-500 drop-shadow-lg" />
                  <h4 className="font-bold text-gray-900 dark:text-white font-tertiary text-lg mb-2">
                    {office.location}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {office.region}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Form Component Section */}
        <section className="my-20">
          <div className="mx-4 lg:mx-8">
            <FormComponent />
          </div>
        </section>

        {/* Data Table Section */}
        <section className="my-20">
          <div className="mx-4 lg:mx-8">
            <DataTable />
          </div>
        </section>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="🚀 Intellinum Solutions"
          size="lg"
        >
          <div className="space-y-8 p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <SparklesIcon className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-3xl font-secondary font-bold text-gray-900 dark:text-white mb-6">
                Transform Your Supply Chain
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto mb-8 text-lg">
                Unlock the full potential of your Oracle investments with our expertise in mobility
                and logistics implementation solutions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {['Oracle Mobility', 'Supply Chain', 'Global Support'].map((feature, index) => (
                <div key={feature} className="text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${index === 0
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : index === 1
                      ? 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400'
                      : 'bg-tertiary-100 dark:bg-tertiary-900/20 text-tertiary-600 dark:text-tertiary-400'
                    }`}>
                    <SparklesIcon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{feature}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-6 pt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 focus-outline font-medium"
              >
                Learn More Later
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-medium rounded-xl hover:from-primary-700 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </Modal>

        {/* Footer Section */}
        <section className="mt-32">
          <Footer />
        </section>

      </div>
    </Layout>
  );
}
