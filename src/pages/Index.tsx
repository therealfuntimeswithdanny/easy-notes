import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { NotesApp } from '@/components/NotesApp';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Cloud, Lock, Database, Server, Palette } from 'lucide-react';

const features = [
	{
		icon: <CheckCircle className="h-6 w-6 text-primary" />,
		title: 'Minimal & Fast',
		desc: 'Distraction-free markdown editor for quick note-taking.',
	},
	{
		icon: <Cloud className="h-6 w-6 text-primary" />,
		title: 'Cloud Sync',
		desc: 'Access your notes anywhere, anytime, on any device.',
	},
	{
		icon: <Lock className="h-6 w-6 text-primary" />,
		title: 'Private & Secure',
		desc: 'Your notes are safe and only accessible by you.',
	},
];

const databaseInfo = [
	{
		icon: <Database className="h-6 w-6 text-primary" />,
		title: 'Powered by Supabase',
		desc: 'Reliable relational database ensures your notes are stored safely with lightning-fast access.',
	},
];

const hostingInfo = [
	{
		icon: <Server className="h-6 w-6 text-primary" />,
		title: 'Hosted on Vercel',
		desc: 'Deployed on Vercel’s global edge network for fast, scalable, and secure access worldwide.',
	},
];

const colorThemes = [
	{ name: 'Green', image: 'https://public-danielmorrisey-com.danielmorrisey.com/easy-note/IMG_2347.jpeg' },
	{ name: 'Red', image: 'https://public-danielmorrisey-com.danielmorrisey.com/easy-note/IMG_2346.png' },
	{ name: 'Blue', image: 'https://public-danielmorrisey-com.danielmorrisey.com/easy-note/IMG_2345.png' },
	{ name: 'Purple', image: 'https://public-danielmorrisey-com.danielmorrisey.com/easy-note/IMG_2348.png' },
	{ name: 'Orange', image: 'https://public-danielmorrisey-com.danielmorrisey.com/easy-note/IMG_2349.png' },
];

const Index = () => {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex flex-col bg-gradient-subtle">
				{/* Hero Section */}
				<header className="flex-1 flex flex-col justify-center items-center py-24 px-4">
					<h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-primary bg-clip-text drop-shadow">
						Easy Notes
					</h1>

					<p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl text-center">
						Your minimal markdown note-taking companion. Write, organize, and sync
						your thoughts seamlessly.
					</p>
					<Button
						onClick={() => navigate('/auth')}
						size="lg"
						className="px-8 py-4 text-lg font-semibold shadow-md"
					>
						Get Started Free
					</Button>
				</header>

				{/* Features Section */}
				<section className="py-12 px-4 bg-card shadow-soft rounded-t-3xl max-w-3xl mx-auto w-full">
					<div className="flex flex-col sm:flex-row justify-center gap-8">
						{features.map((f, i) => (
							<div
								key={i}
								className="flex flex-col items-center text-center gap-2 flex-1"
							>
								<div className="mb-2">{f.icon}</div>
								<h3 className="font-semibold text-lg">{f.title}</h3>
								<p className="text-muted-foreground text-sm">{f.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* Database Section */}
				<section className="py-12 px-4 bg-background max-w-3xl mx-auto w-full">
					<div className="flex flex-col sm:flex-row justify-center gap-8">
						{databaseInfo.map((d, i) => (
							<div
								key={i}
								className="flex flex-col items-center text-center gap-2 flex-1"
							>
								<div className="mb-2">{d.icon}</div>
								<h3 className="font-semibold text-lg">{d.title}</h3>
								<p className="text-muted-foreground text-sm">{d.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* Hosting Section */}
				<section className="py-12 px-4 bg-card shadow-soft max-w-3xl mx-auto w-full rounded-b-3xl">
					<div className="flex flex-col sm:flex-row justify-center gap-8">
						{hostingInfo.map((h, i) => (
							<div
								key={i}
								className="flex flex-col items-center text-center gap-2 flex-1"
							>
								<div className="mb-2">{h.icon}</div>
								<h3 className="font-semibold text-lg">{h.title}</h3>
								<p className="text-muted-foreground text-sm">{h.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* Color Themes Section */}
				<section className="py-12 px-4 bg-background max-w-5xl mx-auto w-full">
					<div className="flex flex-col items-center mb-8">
						<Palette className="h-8 w-8 text-primary mb-2" />
						<h2 className="text-2xl font-bold">Choose Your Theme</h2>
						<p className="text-muted-foreground text-sm text-center max-w-md">
							Personalize your notes with color themes that match your style.
						</p>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
						{colorThemes.map((theme, i) => (
							<div key={i} className="flex flex-col items-center text-center">
								<div className="w-24 h-40 rounded-xl shadow-md border overflow-hidden bg-card">
									<img
										src={theme.image}
										alt={`${theme.name} Theme`}
										className="w-full h-full object-cover"
									/>
								</div>
								<p className="mt-2 text-sm font-medium">{theme.name}</p>
							</div>
						))}
					</div>
				</section>

				{/* Footer */}
				<footer className="py-6 text-center text-xs text-muted-foreground">
					&copy; {new Date().getFullYear()} Easy Notes. All rights reserved.
				</footer>
			</div>
		);
	}

	return <NotesApp />;
};

export default Index;
