
import MainLayout from '@/layouts/MainLayout';
import AppointmentForm from '@/components/AppointmentForm';

const Appointments = () => {
  return (
    <MainLayout>
      <section className="pt-32 pb-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Book an Appointment
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Schedule Your Visit
            </h1>
            <p className="text-lg text-gray-700">
              Book an appointment with our healthcare professionals quickly and easily.
              Choose between in-person visits or virtual consultations.
            </p>
          </div>
          
          <AppointmentForm />
        </div>
      </section>
    </MainLayout>
  );
};

export default Appointments;
