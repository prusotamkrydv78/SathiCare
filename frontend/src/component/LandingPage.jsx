import React from 'react';
import PublicLayout from './PublicLayout';
import HeroSection from './landing/HeroSection';
import StatsSection from './landing/StatsSection';
import FeaturesSection from './landing/FeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import WhyChooseSection from './landing/WhyChooseSection';
import TestimonialsSection from './landing/TestimonialsSection';
import FAQSection from './landing/FAQSection';
import CTASection from './landing/CTASection';

const LandingPage = () => {
    return (
        <PublicLayout>
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <WhyChooseSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                        opacity: 0;
                    }
                    50% {
                        transform: translateY(-20px);
                        opacity: 0.6;
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .delay-500 {
                    animation-delay: 0.5s;
                }
                .delay-700 {
                    animation-delay: 0.7s;
                }
            `}</style>
        </PublicLayout>
    );
};

export default LandingPage;
