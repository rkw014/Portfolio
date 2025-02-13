import Auth from "../components/Auth"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">© {new Date().getFullYear()} <b>Ruikun Wang's Blog</b> All Rights Reserved </p>
        <div className="space-x-4 text-sm mt-3 md:mt-0">
          <a href="mailto:wangrk197@gmail.com" className="hover:text-white">
            Email
          </a>
          <a href="https://linkedin.com/in/ruikun-wang-su" className="hover:text-white">
            LinkedIn
          </a>
          <a href="https://github.com/rkw014" className="hover:text-white">
            GitHub
          </a>
          <Auth/>
        </div>
      </div>
    </footer>
  )
}
