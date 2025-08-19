
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
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
			'xs': '475px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px', 
			'xl': '1280px',
			'2xl': '1536px',
			// Mobile specific
			'mobile': {'max': '639px'},
			'tablet': {'min': '640px', 'max': '1023px'},
			'desktop': {'min': '1024px'},
			// Foldable devices
			'fold': {'max': '320px'},
			'fold-open': {'min': '321px', 'max': '540px'},
			// iPhone specific
			'iphone-se': {'raw': '(max-width: 375px)'},
			'iphone': {'raw': '(max-width: 428px)'},
			// Android foldables
			'galaxy-fold': {'raw': '(max-width: 280px)'},
			'galaxy-fold-open': {'raw': '(min-width: 281px) and (max-width: 653px)'}
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
