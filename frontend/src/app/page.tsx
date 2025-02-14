import Image from "next/image";
import profilePic from '../../public/profile.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin  } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { CSSProperties } from "react";
import ContactForm from "@/components/ContactForm";

const background_shape_css:CSSProperties  = {
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

export default function Home() {
  return (
    <section>
      <div style={background_shape_css}/>
      <div className="container mx-auto px-4 py-10 flex flex-col-reverse items-center md:flex-row md:justify-between">

        <div className="text-left md:max-w-md">
          <span className="md:text-lg inline-block">I'm</span>
          <h3 className="text-4xl font-bold mb-4 md:text-6xl md:w-52">
            Ruikun Wang
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            A passionate Software Engineer and Backend Developer with some interest in IoT devices.
          </p>

          <div className="space-x-4">
            <Link href={"https://linkedin.com/in/ruikun-wang-su"} className="text-4xl py-2 px-2 rounded" style={{'color': "#0A66C2"}}>
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
            <Link href="https://github.com/rkw014" className="text-4xl py-2 px-2 text-black rounded">
              <FontAwesomeIcon icon={faGithub} />
            </Link>
            <Link href={"mailto:wangrk197@gmail.com"}className="text-4xl py-2 px-2 text-black rounded">
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

      <div id="about" className="py-10 px-10 my-6 bg-neutral-100 rounded-3xl">
        <h3 className="text-3xl font-bold mb-4">About Me</h3>
        <p className="text-gray-700 mb-4">
          Hi! My name is Ruikun Wang, and I earned my Master's degree in Computer Science from Syracuse University in May 2024. I have a range of interest in programming languages and enjoy using them to solve problems and automate tasks. My primary focus is on developing robust, efficient microservice backends and personal tools.
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
        <Link href={'#'} className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-xl">Download CV</Link>
      </div>

      <div id="projects" className="py-10 px-10 my-6 bg-neutral-100 rounded-3xl">
        <h3 className="text-3xl font-bold mb-4">Projects</h3>
        {/* ...列出项目卡片 */}
      </div>

      <div id="contact" className="py-10 px-10 my-6 bg-neutral-100 rounded-3xl">
        <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
        <ContactForm />
      </div>
    </section>
  )
}
