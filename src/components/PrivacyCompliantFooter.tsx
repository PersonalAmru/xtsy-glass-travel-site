import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EU-compliant footer with privacy policy and legal links
 * No tracking, no cookies, privacy-first design
 */
export const PrivacyCompliantFooter: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">XTSY</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Experience Northeast India's beauty with sustainable, authentic hospitality.
            </p>
            <p className="text-sm text-muted-foreground">
              Privacy-first, GDPR compliant. No tracking, no cookies unless necessary.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/data-subject-rights" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Your Data Rights (GDPR)
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:privacy@xtsy.in" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Privacy Officer
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>WhatsApp: +91 88373 17070</li>
              <li>Email: hello@xtsy.in</li>
              <li>Privacy: privacy@xtsy.in</li>
              <li>Shillong, Meghalaya, India</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} XTSY. Privacy-compliant hospitality. 
            <span className="ml-2">🇪🇺 GDPR Compliant</span>
          </p>
        </div>
      </div>
    </footer>
  );
};