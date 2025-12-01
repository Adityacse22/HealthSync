
import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type AppointmentType = 'in-person' | 'virtual';
type DoctorSpecialty = 'general' | 'cardiology' | 'neurology' | 'pediatrics' | 'dermatology';

interface Doctor {
  id: number;
  name: string;
  specialty: DoctorSpecialty;
  available: boolean;
  image: string;
}

interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

const AppointmentForm = () => {
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('in-person');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Dummy data for doctors
  const doctors: Doctor[] = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'general', available: true, image: '/doctor1.png' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'cardiology', available: true, image: '/doctor2.png' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'neurology', available: true, image: '/doctor3.png' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'pediatrics', available: false, image: '/doctor4.png' },
    { id: 5, name: 'Dr. Aisha Patel', specialty: 'dermatology', available: true, image: '/doctor5.png' }
  ];

  // Dummy time slots
  const timeSlots: TimeSlot[] = [
    { id: 1, time: '9:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: true },
    { id: 3, time: '11:00 AM', available: false },
    { id: 4, time: '1:00 PM', available: true },
    { id: 5, time: '2:00 PM', available: true },
    { id: 6, time: '3:00 PM', available: false },
    { id: 7, time: '4:00 PM', available: true },
    { id: 8, time: '5:00 PM', available: true }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDoctorSelection = (doctorId: number) => {
    setSelectedDoctor(doctorId);
  };

  const handleTimeSelection = (timeId: number) => {
    setSelectedTime(timeId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit the form
      console.log('Appointment booked!', {
        type: appointmentType,
        date: selectedDate,
        doctor: selectedDoctor ? doctors.find(d => d.id === selectedDoctor) : null,
        time: selectedTime ? timeSlots.find(t => t.id === selectedTime) : null,
        patient: formData
      });
      
      // Show success message
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
        duration: 5000,
      });
      
      setSubmitted(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getSpecialtyName = (specialty: DoctorSpecialty) => {
    switch (specialty) {
      case 'general': return 'General Practice';
      case 'cardiology': return 'Cardiology';
      case 'neurology': return 'Neurology';
      case 'pediatrics': return 'Pediatrics';
      case 'dermatology': return 'Dermatology';
      default: return specialty;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock calendar component - in a real app, use a proper date picker
  const renderCalendar = () => {
    const today = new Date();
    const nextWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date;
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {nextWeek.map((date, i) => (
          <button
            key={i}
            type="button"
            className={`p-2 rounded-lg text-center transition-all ${
              selectedDate && date.toDateString() === selectedDate.toDateString()
                ? 'bg-medical-500 text-white'
                : 'bg-white hover:bg-medical-50 border border-gray-200'
            }`}
            onClick={() => handleDateSelection(date)}
          >
            <div className="text-xs font-medium">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-lg font-semibold">
              {date.getDate()}
            </div>
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 max-w-3xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been scheduled successfully. You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Appointment Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-medical-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{formatDate(selectedDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-medical-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-800">
                    {selectedTime ? timeSlots.find(t => t.id === selectedTime)?.time : 'Not selected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 text-medical-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-800">
                    {selectedDoctor ? doctors.find(d => d.id === selectedDoctor)?.name : 'Not selected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 text-medical-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Appointment Type</p>
                  <p className="font-medium text-gray-800 capitalize">{appointmentType}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn-primary"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setSelectedDate(null);
                setSelectedDoctor(null);
                setSelectedTime(null);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  reason: '',
                });
              }}
            >
              Book Another Appointment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => window.print()}
            >
              Print Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Appointment</h2>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div 
            key={stepNumber} 
            className="flex flex-col items-center relative"
          >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= stepNumber 
                ? 'bg-medical-500 text-white' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {stepNumber}
            </div>
            
            <span className={`text-xs mt-2 font-medium transition-colors ${
              step >= stepNumber ? 'text-medical-700' : 'text-gray-400'
            }`}>
              {stepNumber === 1 && 'Type'}
              {stepNumber === 2 && 'Date & Doctor'}
              {stepNumber === 3 && 'Time'}
              {stepNumber === 4 && 'Details'}
            </span>
            
            {stepNumber < 4 && (
              <div className={`absolute top-5 left-full w-full h-0.5 -ml-2 transition-colors ${
                step > stepNumber ? 'bg-medical-500' : 'bg-gray-200'
              }`} style={{ width: 'calc(100% - 2.5rem)' }}></div>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Appointment Type */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Select Appointment Type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                className={`text-left p-4 rounded-xl border transition-all ${
                  appointmentType === 'in-person'
                    ? 'border-medical-500 ring-2 ring-medical-500/20 bg-medical-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => setAppointmentType('in-person')}
              >
                <div className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    appointmentType === 'in-person' ? 'bg-medical-100 text-medical-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">In-Person Visit</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Visit one of our locations for a face-to-face consultation with our healthcare professionals.
                    </p>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                className={`text-left p-4 rounded-xl border transition-all ${
                  appointmentType === 'virtual'
                    ? 'border-medical-500 ring-2 ring-medical-500/20 bg-medical-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => setAppointmentType('virtual')}
              >
                <div className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    appointmentType === 'virtual' ? 'bg-medical-100 text-medical-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Virtual Consultation</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Connect with our doctors from the comfort of your home through our secure video platform.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Date and Doctor Selection */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Select Date</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-2">
                {renderCalendar()}
              </div>
              <p className="text-sm text-gray-500">
                {selectedDate 
                  ? `Selected: ${formatDate(selectedDate)}` 
                  : 'Please select a preferred date for your appointment'}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Select Doctor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map(doctor => (
                  <button
                    key={doctor.id}
                    type="button"
                    disabled={!doctor.available}
                    className={`flex items-center p-3 rounded-lg border transition-all ${
                      !doctor.available 
                        ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50' 
                        : selectedDoctor === doctor.id
                          ? 'border-medical-500 ring-2 ring-medical-500/20 bg-medical-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => doctor.available && handleDoctorSelection(doctor.id)}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0 mr-3">
                      {/* This would be an actual image in a real app */}
                      <div className="h-full w-full rounded-full flex items-center justify-center text-gray-500">
                        <User size={24} />
                      </div>
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                      <p className="text-xs text-gray-600">{getSpecialtyName(doctor.specialty)}</p>
                    </div>
                    {!doctor.available && (
                      <span className="ml-auto text-xs font-medium text-red-500">
                        Unavailable
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Select Time Slot</h3>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-center transition-all ${
                      !slot.available 
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200' 
                        : selectedTime === slot.id
                          ? 'bg-medical-500 text-white'
                          : 'bg-white hover:bg-medical-50 border border-gray-200'
                    }`}
                    onClick={() => slot.available && handleTimeSelection(slot.id)}
                  >
                    <Clock size={16} className={`mx-auto mb-1 ${selectedTime === slot.id ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium">{slot.time}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <Calendar size={18} className="mr-2" />
                Appointment Summary
              </h4>
              <div className="text-sm text-blue-700">
                <p><span className="font-medium">Type:</span> {appointmentType === 'in-person' ? 'In-Person Visit' : 'Virtual Consultation'}</p>
                <p><span className="font-medium">Date:</span> {formatDate(selectedDate)}</p>
                <p>
                  <span className="font-medium">Doctor:</span> {selectedDoctor 
                    ? doctors.find(d => d.id === selectedDoctor)?.name 
                    : 'Not selected'}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {selectedTime 
                    ? timeSlots.find(t => t.id === selectedTime)?.time 
                    : 'Not selected'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Patient Details */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {appointmentType === 'in-person' && (
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required={appointmentType === 'in-person'}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500"
                      placeholder="123 Main St, Anytown"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit
              </label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  value={formData.reason}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Appointment Summary</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><span className="font-medium">Type:</span> {appointmentType === 'in-person' ? 'In-Person Visit' : 'Virtual Consultation'}</p>
                <p><span className="font-medium">Date:</span> {formatDate(selectedDate)}</p>
                <p>
                  <span className="font-medium">Doctor:</span> {selectedDoctor 
                    ? doctors.find(d => d.id === selectedDoctor)?.name 
                    : 'Not selected'}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {selectedTime 
                    ? timeSlots.find(t => t.id === selectedTime)?.time 
                    : 'Not selected'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrevStep}
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
          
          <button
            type="submit"
            className="btn-primary"
            disabled={
              (step === 2 && (!selectedDate || !selectedDoctor)) ||
              (step === 3 && !selectedTime)
            }
          >
            {step < 4 ? 'Continue' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
