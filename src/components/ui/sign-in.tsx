import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

export interface SignInLayoutProps {
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  children: React.ReactNode;
}

// --- SUB-COMPONENTS ---

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div
    className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 max-w-xs opacity-0 translate-y-4 scale-95"
    style={{
      animation: `testimonialIn 0.7s ${delay} cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    }}
  >
    <div className="flex items-center gap-3 mb-2">
      <img src={testimonial.avatarSrc} alt={testimonial.name} className="w-9 h-9 rounded-full object-cover" />
      <div>
        <p className="text-white text-sm font-semibold leading-tight">{testimonial.name}</p>
        <p className="text-white/50 text-xs">{testimonial.handle}</p>
      </div>
    </div>
    <p className="text-white/70 text-sm leading-relaxed">{testimonial.text}</p>
  </div>
);

// --- MAIN LAYOUT COMPONENT ---

export const SignInLayout: React.FC<SignInLayoutProps> = ({
  heroImageSrc,
  testimonials = [],
  children,
}) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left column: form area */}
      <div className="flex flex-1 flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-24 py-8 relative z-10">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative w-full max-w-md mx-auto">
          {children}
        </div>
      </div>

      {/* Right column: hero image + testimonials (hidden on mobile) */}
      {heroImageSrc && (
        <div
          className="hidden lg:flex relative w-[55%] items-end justify-center p-8 overflow-hidden opacity-0"
          style={{
            animation: 'slideRightIn 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity: 0,
            filter: 'blur(4px)',
            transform: 'translateX(30px)',
          }}
        >
          <img
            src={heroImageSrc}
            alt="Travel destination"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />

          {testimonials.length > 0 && (
            <div className="relative z-10 flex flex-col gap-4 mb-8 max-w-md">
              <TestimonialCard testimonial={testimonials[0]} delay="0.5s" />
              {testimonials[1] && <TestimonialCard testimonial={testimonials[1]} delay="0.7s" />}
              {testimonials[2] && <TestimonialCard testimonial={testimonials[2]} delay="0.9s" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- GOOGLE SIGN-IN BUTTON ---

export const GoogleSignInButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({
  onClick,
  disabled,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-card hover:border-border disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <GoogleIcon />
    Continue with Google
  </button>
);

// --- DIVIDER ---

export const OrDivider = () => (
  <div className="flex items-center gap-4 my-6">
    <div className="h-px flex-1 bg-border/50" />
    <span className="text-xs text-muted-foreground uppercase tracking-wider">Or continue with</span>
    <div className="h-px flex-1 bg-border/50" />
  </div>
);

// --- GLASS INPUT WRAPPER ---

export const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-0.5 transition-all focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
    {children}
  </div>
);

export { GoogleIcon };
