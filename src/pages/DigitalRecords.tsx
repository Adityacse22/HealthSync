
import MainLayout from "@/layouts/MainLayout";
import { FileText, Download, Lock, Share2, Calendar, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const DigitalRecords = () => {
  // Dummy data for demonstration
  const records = [
    {
      id: 1,
      title: "Annual Physical Examination",
      date: "March 15, 2023",
      doctor: "Dr. Sarah Johnson",
      type: "Examination",
      status: "Available"
    },
    {
      id: 2,
      title: "Blood Test Results",
      date: "February 3, 2023",
      doctor: "Dr. Michael Chen",
      type: "Lab Results",
      status: "Available"
    },
    {
      id: 3,
      title: "Vaccination Record - COVID-19",
      date: "January 20, 2023",
      doctor: "Dr. Lisa Wong",
      type: "Vaccination",
      status: "Available"
    },
    {
      id: 4,
      title: "Cardiology Consultation",
      date: "December 12, 2022",
      doctor: "Dr. Robert Carter",
      type: "Consultation",
      status: "Available"
    },
    {
      id: 5,
      title: "Prescription Renewal - Lisinopril",
      date: "November 30, 2022",
      doctor: "Dr. Sarah Johnson",
      type: "Prescription",
      status: "Active"
    }
  ];

  return (
    <MainLayout>
      <section className="pt-32 pb-16 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Medical Records
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Digital Health Records
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Securely access and manage your medical records, consultation summaries, prescriptions, and follow-up care instructions online.
            </p>
            <div className="bg-white p-4 rounded-xl shadow-lg inline-flex items-center border border-gray-200">
              <Lock className="h-5 w-5 text-medical-500 mr-3" />
              <span className="text-medical-800 font-medium">Your records are securely stored with blockchain technology</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FileText className="mr-2 text-medical-500" />
                Your Records
              </h2>
              <div className="flex gap-3">
                <button className="btn-secondary py-2 px-4 flex items-center">
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
                <button className="btn-primary py-2 px-4 flex items-center">
                  <Download size={16} className="mr-2" />
                  Download All
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-1">
              {records.map((record) => (
                <div 
                  key={record.id}
                  className="bg-white rounded-lg mb-1 p-4 border border-gray-100 hover:shadow-md hover:border-medical-100 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{record.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Calendar size={14} className="mr-1 text-medical-500" /> 
                          {record.date}
                        </span>
                        <span className="text-gray-600">Doctor: {record.doctor}</span>
                        <span className="inline-block px-2 py-0.5 bg-medical-100 text-medical-700 rounded text-xs font-medium">
                          {record.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                      <button className="py-1.5 px-3 bg-medical-50 text-medical-700 rounded hover:bg-medical-100 transition-colors duration-300 text-sm flex items-center">
                        <Share2 size={14} className="mr-1.5" />
                        Share
                      </button>
                      <button className="py-1.5 px-3 bg-medical-500 text-white rounded hover:bg-medical-600 transition-colors duration-300 text-sm flex items-center">
                        <Download size={14} className="mr-1.5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 border border-gray-200 rounded-xl bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About Digital Records</h3>
              <p className="text-gray-700 mb-4">
                Our Digital Records system provides you with secure, anytime access to your medical history, prescriptions, lab results, and more. All records are stored using advanced blockchain technology to ensure maximum security and privacy.
              </p>
              <p className="text-gray-700 mb-4">
                You can download, print, or securely share your records with other healthcare providers as needed. If you need assistance accessing your records, please contact our support team.
              </p>
              <div className="mt-6">
                <Link to="/consultation" className="btn-secondary py-2 px-4">
                  Return to Virtual Consultation
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DigitalRecords;
