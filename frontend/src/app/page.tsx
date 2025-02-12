import Image from "next/image";
import profilePic from '../../public/profile.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin  } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { CSSProperties } from "react";

const background_shape_css:CSSProperties  = {
  position: "absolute",
  top: "0",
  height: "calc(100vh + 65px)",
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
      <div className="container mx-auto px-4 flex flex-col-reverse items-center md:flex-row md:justify-between">

        <div className="text-left md:max-w-md">
          <span className="md:text-lg inline-block">I'm</span>
          <h3 className="text-4xl font-bold mb-4 md:text-6xl md:w-52">
            Ruikun Wang
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            A passionate Software Engineer and Backend Developer with some interest in IoT devices.
          </p>

          <div className="space-x-4">
            <Link href={"https://linkedin.com/u/"} className="text-4xl py-2 px-2 rounded" style={{'color': "#0A66C2"}}>
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
              alt="Tom Anderson"
              layout="fill"
              objectFit="cover" 
              className="rounded-full"
              priority          
            />
          </div>
        </div>
      </div>

      <div id="about" className="py-16">
        <h3 className="text-3xl font-bold mb-4">About Me</h3>
        <p className="text-gray-700 mb-4">
          I'm a software engineer with experience in Next.js, React,
          and back-end technologies...
        </p>
      </div>

      <div id="projects" className="py-16">
        <h3 className="text-3xl font-bold mb-4">Projects</h3>
        {/* ...列出项目卡片 */}
      </div>

      <div id="contact" className="py-16">
        <h3 className="text-3xl font-bold mb-4">Get In Touch</h3>
        {/* ...表单 */}
      </div>
    </section>
  )
}
