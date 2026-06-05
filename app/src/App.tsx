import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormProvider } from '@/store/formStore';
import { WelcomePage } from '@/pages/WelcomePage';
import { WizardPage } from '@/pages/WizardPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { SuccessPage } from '@/pages/SuccessPage';

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/step/:stepNumber" element={<WizardPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;
