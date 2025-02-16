import Image from "next/image";
import profilePic from '../../public/profile.jpg';
import polyglotbotPic from '../../public/polyglotbot.png';
import gcodePic from '../../public/gcode.png';
import portfolioPic from '../../public/portfolio.png';
import questionmarkPic from '../../public/question_mark.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { CSSProperties } from "react";
import ContactForm from "@/components/ContactForm";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/types/Project";

const background_shape_css: CSSProperties = {
  position: "absolute",
  top: "0",
  height: "calc(100vh - 65px)",
  left: "0",
  right: "0",
  backgroundColor: "#fef5eb",
  WebkitClipPath: "polygon(100% 0, 0 0, 0 100%, 100% 62%)",
  clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 62%)",
  zIndex: -2,
}

const section_css: CSSProperties = {
  backgroundColor: "#fbfaf9",
}

// temporary
export default function Home() {

  const projects: Project[] = [
    {
      id: "1df7b473-13b0-47d0-b75b-3d684ccd684b",
      title: "GCode Codepad",
      year: "Jan 2022 - Present",
      imgUrl: gcodePic,
      description: "A scalable Spring Boot microservice backend for an online collaborative code editor with integrated video calling.",
      content: "",
      category: "Full Stack",
      link: "https://github.com/GCode-codepad/backend",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "321c3619-0802-44a5-bda8-75a6372ce206",
      title: "Portfolio and Blog System",
      year: "Dec 2024 - Present",
      imgUrl: portfolioPic,
      description: "A single-page application (SPA) personal blog with Cognito, Spring Boot, S3, and a WYSIWYG editor.",
      content: "",
      link: "https://github.com/rkw014/Portfolio",
      category: "Full Stack",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "af34462f-f3ca-4f81-91ee-0a34a9547f2d",
      title: "PolyglotBot",
      year: "March 2024 - April 2024",
      imgUrl: polyglotbotPic,
      description: "A psersonalized English chat tutor with OpenAI. Augmented with AWS ECS, K8s, Kafka, Circuit Breaker ...",
      content: "",
      link: "github.com/PolyglotBot-Alpha/PolyglotBot",
      category: "Full Stack",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3af35181-6de5-4418-b4ad-086f6af858c1",
      title: "More to Come...",
      year: "...",
      imgUrl: questionmarkPic,
      description: "Awesom Project beeing made",
      content: "",
      link: "#",
      category: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <section>
      <div style={background_shape_css} />
      <div className="container mx-auto px-4 py-10 flex flex-col-reverse items-center md:flex-row md:justify-between drop-shadow-[10px_14px_15px_rgba(0,0,0,0.25)]">

        <div className="text-left md:max-w-md">
          <span className="md:text-lg inline-block">I&apos;m</span>
          <h3 className="text-4xl font-bold mb-4 md:text-6xl md:w-52">
            Ruikun Wang
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            A passionate Software Engineer and Backend Developer with some interest in IoT devices.
          </p>

          <div className="space-x-4">
            <Link href={"https://linkedin.com/in/ruikun-wang-su"} className="text-4xl py-2 px-2 rounded" style={{ 'color': "#0A66C2" }}>
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
            <Link href="https://github.com/rkw014" className="text-4xl py-2 px-2 text-black rounded">
              <FontAwesomeIcon icon={faGithub} />
            </Link>
            <Link href={"mailto:wangrk197@gmail.com"} className="text-4xl py-2 px-2 text-black rounded">
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:ml-8 md:mr-10 flex justify-center">
          <div className="relative w-80 h-80">
            <Image
              src={profilePic}
              alt="Ruikun Wang"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              priority
            />
          </div>
        </div>
      </div>

      <div id="about" className="py-10 px-10 my-6 rounded-3xl shadow-lg" style={section_css}>
        <h3 className="text-3xl font-bold mb-4">About Me</h3>
        <p className="text-gray-700 mb-4">
          Hi! My name is Ruikun Wang, and I earned my Master&apos;s degree in Computer Science from Syracuse University in May 2024. I have a range of interest in programming languages and enjoy using them to solve problems and automate tasks. My primary focus is on developing robust, efficient microservice backends and personal tools.
        </p>
        <p className="text-gray-700 mb-4">
          I have built backend systems using Spring Boot and FastAPI within a microservices architecture, leveraging AWS, Docker, and Kubernetes to ensure scalability and usability. I also have experience in React-based frontend development, integrating AWS Cognito and JWT tokens for secure authentication.
        </p>
        <p className="text-gray-700 mb-4">
          Beyond web application development, I enjoy playing with microcontrollers like the ESP32 to create personal gadgets using MicroPython or ESP-IDF.
        </p>
        <p className="text-gray-700 mb-4">
          My passion for computer science began in the fifth grade and has grown through coursework and hands-on projects. Continually exploring new technologies is a core part of my personal philosophy.
        </p>
        <Link href={'#'} target="_blank" className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-xl">Download CV</Link>
      </div>

      <div id="projects" className="py-10 px-10 my-6 rounded-3xl shadow-lg" style={section_css}>
        <h3 className="text-3xl font-bold mb-4">Projects</h3>
        <div className="overflow-x-auto py-6">
          <div className="flex space-x-6 px-4 snap-x snap-mandatory">
            {projects.map((project) => (
              <Link 
                href={project.link} 
                target={project.link === "#"? undefined: "_blank"} 
                key={project.id} 
                className="flex-shrink-0 w-80">
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div id="contact" className="py-10 px-10 my-6 rounded-3xl shadow-lg" style={section_css}>
        <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
        <ContactForm />
      </div>
    </section>
  )
}
