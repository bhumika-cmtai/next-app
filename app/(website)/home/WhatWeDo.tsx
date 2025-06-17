import { UserCheck, FilePlus2, Database, Headset } from 'lucide-react';

const WhatWeDo = () => {
    const servicesData = [
        {
            icon: UserCheck,
            title: 'PENDING KYC APPROVAL TASKS',
            description: 'Assist Financial Service Businesses In Verifying And Processing Pending Approval KYC (Know Your Customer) Documents. This Job Entails Document Accuracy Checks, Data Entry, And Simple Verification Procedures.',
        },
        {
            icon: FilePlus2,
            title: 'NEW ACCOUNT OPENING WORK',
            description: 'Assist Online Platforms Through Help In New Customer Onboarding. This Consists Of Application Details Filling, Document Verification, And Accuracy In Account Opening Procedures.',
        },
        {
            icon: Database,
            title: 'DATA MANAGEMENT & ENTRY WORK',
            description: 'Organize And Manage Valuable Business Data. Your Tasks Can Include Entering Data Into Databases, Filing Sorted Files, Maintaining Customer Records, And More—All From Home.',
        },
        {
            icon: Headset,
            title: 'CUSTOMER SUPPORT SERVICES',
            description: 'Work As A Support Executive From Home. Support Customers Through Chat, Phone, Or Email To Solve Their Issues, Walk Them Through Services, Or Assist In Account-Related Matters.',
        },
    ];
  return (
    // relative and z-10 places this content ON TOP of the blobs
    <section className="relative z-10 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-16">
          WHAT <span className="text-purple-400">WE DO</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {servicesData.map((service, index) => (
            <div 
              key={index}
              className="bg-gold-50 p-8 rounded-3xl border border-gold-200/60 shadow-lg text-center flex flex-col items-center transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="mb-6">
                <service.icon className="text-purple-500" size={48} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-4 h-12 flex items-center justify-center">
                {service.title}
              </h3>
              <p className="text-sm text-gray-subtitle leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhatWeDo