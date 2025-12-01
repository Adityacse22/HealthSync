
import { ReactNode } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

const ServiceCard = ({ title, description, icon, className = '' }: ServiceCardProps) => {
  return (
    <div 
      className={`glass-card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-medical-200 ${className}`}
    >
      <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-xl text-medical-700 mb-5 transition-all duration-300 group-hover:bg-medical-200">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
