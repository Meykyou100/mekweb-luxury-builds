import { Braces, Code2, Database, Figma, Globe2, Layers3, Palette, Server, Smartphone, Zap } from "lucide-react";

const technologies = [
  { icon: Code2, label: "React" },
  { icon: Braces, label: "JavaScript" },
  { icon: Layers3, label: "Tailwind" },
  { icon: Figma, label: "Figma" },
  { icon: Palette, label: "UI Design" },
  { icon: Smartphone, label: "Responsive" },
  { icon: Database, label: "CMS" },
  { icon: Server, label: "Hosting" },
  { icon: Globe2, label: "SEO" },
  { icon: Zap, label: "Speed" },
];

export const Technologies = () => {
  return (
    <section className="relative overflow-hidden bg-[#1d1d1b] py-10 text-white">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-transparent via-yellow-300/65 to-transparent" />
      <div className="container-luxe relative">
        <h2 className="mb-7 text-center font-sans text-3xl font-black uppercase tracking-tight text-yellow-300 sm:text-4xl">
          Technologies
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
          {technologies.map((tech, i) => (
            <div
              key={tech.label}
              data-reveal="scale"
              data-reveal-delay={i * 40}
              className="grid min-h-24 place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all duration-500 hover:-translate-y-1 hover:border-yellow-300/70 hover:bg-yellow-300 hover:text-black"
            >
              <tech.icon className="mb-2 h-7 w-7" />
              <span className="text-xs font-black uppercase tracking-wide">{tech.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
