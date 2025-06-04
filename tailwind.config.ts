
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'switzer': ['Switzer', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'roboto': ['Roboto', 'sans-serif'],
				'open-sans': ['Open Sans', 'sans-serif'],
				'lato': ['Lato', 'sans-serif'],
				'montserrat': ['Montserrat', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
				'source-sans': ['Source Sans Pro', 'sans-serif'],
				'nunito': ['Nunito', 'sans-serif'],
				'raleway': ['Raleway', 'sans-serif'],
				'ubuntu': ['Ubuntu', 'sans-serif'],
				'playfair': ['Playfair Display', 'serif'],
				'merriweather': ['Merriweather', 'serif'],
			},
			fontSize: {
				'brand-xs': 'var(--font-xs)',
				'brand-sm': 'var(--font-sm)',
				'brand-base': 'var(--font-base)',
				'brand-md': 'var(--font-md)',
				'brand-lg': 'var(--font-lg)',
				'brand-xl': 'var(--font-xl)',
			},
			spacing: {
				'brand-0': 'var(--space-0)',
				'brand-1': 'var(--space-1)',
				'brand-2': 'var(--space-2)',
				'brand-3': 'var(--space-3)',
				'brand-4': 'var(--space-4)',
				'brand-6': 'var(--space-6)',
				'brand-8': 'var(--space-8)',
			},
			borderRadius: {
				'brand-sm': 'var(--radius-1)',
				'brand': 'var(--radius-2)',
				'brand-md': 'var(--radius-3)',
				'brand-lg': 'var(--radius-4)',
				'brand-xl': 'var(--radius-5)',
				'brand-card': 'var(--radius-card)',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				brand: {
					bg: 'var(--color-bg)',
					fg: 'var(--color-fg)',
					primary: {
						500: 'var(--color-primary-500)',
						600: 'var(--color-primary-600)',
					},
					secondary: {
						100: 'var(--color-secondary-100)',
						200: 'var(--color-secondary-200)',
					},
					border: 'var(--color-border)',
					muted: 'var(--color-muted)',
				},
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
