"use client"

import { useState } from "react"
import Link from "next/link"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">
            Ruikun Wang
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link href="/#about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/#projects" className="hover:text-blue-600">
            Projects
          </Link>
          <Link href="/#contact" className="hover:text-blue-600">
            Contact
          </Link>
          <Link href={"/blog"} className="hover:text-blue-600">
            Blog
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link
                href="/#about"
                className="hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/#projects"
                className="hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href={"/blog"}
                className="hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
