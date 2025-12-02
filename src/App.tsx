
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Mission from '@/pages/Mission';
import Appointments from '@/pages/Appointments';
import Consultation from '@/pages/Consultation';
import DigitalRecords from '@/pages/DigitalRecords';
import Map from '@/pages/Map';
import NotFound from '@/pages/NotFound';
import '@/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/digital-records" element={<DigitalRecords />} />
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
