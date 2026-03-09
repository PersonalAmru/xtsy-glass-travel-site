
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'sm': '640px',
				'md': '768px', 
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px',
				// Foldable device breakpoints
				'fold': '280px',
				'unfold': '360px',
				'tablet': '768px',
				'tablet-lg': '1024px'
			}
		},
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px', 
			'xl': '1280px',
			'2xl': '1536px',
			'fold': {'max': '320px'},
		},
		extend: {
			fontFamily: {
				'playfair': ['Playfair Display', 'serif'],
				'cormorant': ['Cormorant Garamond', 'serif'],
				'josefin': ['Josefin Sans', 'sans-serif'],
				'cardo': ['Cardo', 'serif'],
				'sans': ['"Glacial Indifference"', 'Josefin Sans', 'system-ui', 'sans-serif'],
				'serif': ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Brand extended palette
				brand: {
					DEFAULT: 'hsl(var(--primary))',
					secondary: 'hsl(var(--brand-secondary))',
					accent: 'hsl(var(--brand-accent))',
					gold: 'hsl(var(--brand-gold))',
					ember: 'hsl(var(--brand-ember))',
					copper: 'hsl(var(--brand-copper))',
					verified: 'hsl(var(--brand-verified))',
				},
				// Premium surface tokens
				surface: {
					elevated: 'hsl(var(--surface-elevated))',
					overlay: 'hsl(var(--surface-overlay))',
					highlight: 'hsl(var(--surface-highlight))',
				},
				whatsapp: 'hsl(var(--whatsapp))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'shimmer': {
					'100%': {
						transform: 'translateX(100%)'
					}
				},
			'fade-in': {
				'0%': { opacity: '0', transform: 'translateY(10px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'marquee-left': {
				'0%': { transform: 'translateX(0%)' },
				'100%': { transform: 'translateX(-33.333%)' }
			},
			'marquee-right': {
				'0%': { transform: 'translateX(-33.333%)' },
				'100%': { transform: 'translateX(0%)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'shimmer': 'shimmer 1.5s infinite',
			'fade-in': 'fade-in 0.3s ease-out',
			'marquee-left': 'marquee-left var(--marquee-duration, 60s) linear infinite',
			'marquee-right': 'marquee-right var(--marquee-duration, 60s) linear infinite'
		}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
