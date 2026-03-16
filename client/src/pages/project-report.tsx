import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Code2, Palette, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";
import bgImage from "@assets/generated_images/deep_emerald_green_and_gold_abstract_3d_background.png";

export default function ProjectReport() {
  const features = [
    {
      title: "Humanized AI Interaction",
      description: "Context-aware response engine simulating empathetic therapeutic conversations with variable pacing and emotional reflection.",
      icon: <Sparkles className="w-5 h-5 text-primary" />,
    },
    {
      title: "Multi-Modal Input System",
      description: "Supports text, voice (speech-to-text), camera simulation, and file attachments for comprehensive user expression.",
      icon: <Zap className="w-5 h-5 text-primary" />,
    },
    {
      title: "Immersive Design System",
      description: "'Old Money' aesthetic using Deep Emerald & Antique Gold, featuring glassmorphism and 3D assets for a calming sanctuary feel.",
      icon: <Palette className="w-5 h-5 text-primary" />,
    },
    {
      title: "Privacy-First Architecture",
      description: "Frontend-focused prototype designed with user privacy in mind (simulated local processing).",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
    },
  ];

  const techStack = [
    "React 18", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Vite", "Lucide Icons", "Wouter Routing"
  ];

  return (
    <div className="min-h-screen w-full relative bg-background text-foreground font-sans selection:bg-primary/30 overflow-y-auto">
       {/* Background Layer */}
       <div className="fixed inset-0 z-0">
        <img 
            src={bgImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Link href="/">
            <button className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Therapy Session
            </button>
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wider uppercase mb-4">
                    Project Report
                </div>
                <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
                    Serenity AI <span className="text-muted-foreground font-light italic">Platform Overview</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    A next-generation mental wellness interface combining therapeutic AI logic with high-fidelity immersive design.
                </p>
            </div>

            {/* Core Features Grid */}
            <section>
                <h2 className="text-2xl font-display text-primary mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" /> Core Capabilities
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="bg-white/5 rounded-2xl p-8 border border-white/5">
                <h2 className="text-2xl font-display text-primary mb-6 flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Technical Architecture
                </h2>
                <div className="flex flex-wrap gap-3">
                    {techStack.map((tech, idx) => (
                        <span key={idx} className="px-4 py-2 rounded-lg bg-background/50 border border-white/10 text-sm text-muted-foreground font-mono">
                            {tech}
                        </span>
                    ))}
                </div>
            </section>

            {/* Design System Showcase */}
            <section>
                <h2 className="text-2xl font-display text-primary mb-6 flex items-center gap-2">
                    <Palette className="w-6 h-6" /> Design System
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-[#0e1c16] border border-white/10 shadow-lg flex items-end p-3">
                            <span className="text-xs font-mono text-white/50">Deep Emerald (Background)</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-[#ccb066] border border-white/10 shadow-lg flex items-end p-3">
                            <span className="text-xs font-mono text-black/50">Antique Gold (Primary)</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-[#f5f1e6] border border-white/10 shadow-lg flex items-end p-3">
                            <span className="text-xs font-mono text-black/50">Cream (Text)</span>
                        </div>
                    </div>
                </div>
            </section>

             {/* Footer */}
             <footer className="pt-12 border-t border-white/10 text-center text-muted-foreground text-sm">
                <p>Generated automatically by Serenity AI Development Team</p>
                <p className="text-xs opacity-50 mt-2">© 2024 Serenity Platform. All Rights Reserved.</p>
             </footer>
        </motion.div>
      </div>
    </div>
  );
}
