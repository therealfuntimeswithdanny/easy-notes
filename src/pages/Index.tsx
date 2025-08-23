import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { NotesApp } from '@/components/NotesApp';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Cloud, Lock } from 'lucide-react';

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
					<h1 className="text-5xl sm:text-6xl   /* responsive font sizes */ Font-extrabold         /* bold headline */ mb-4                   /* spacing below */ bg-gradient-primary    /* gradient text * bg-clip-text text-transparent drop-shadow            /* subtle text shadow */">
					 QuillPad Notes
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
								<p className="text-muted-foreground text-sm">
									{f.desc}
								</p>
							</div>
						))}
					</div>
				</section>
				{/* Footer */}
				<footer className="py-6 text-center text-xs text-muted-foreground">
					&copy; {new Date().getFullYear()} QuillPad Notes. All rights reserved.
				</footer>
			</div>
		);
	}

	return <NotesApp />;
};

export default Index;