import Header from "@/components/header"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">

      {/* Background */}
      <div className="grid-background absolute inset-0 -z-10"></div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4">
        <Header />
        <Outlet />
      </main>

      {/* Footer */}
      <div className="p-10 text-center bg-gray-800 mt-auto">
        © 2026 Aditya Ranjan. All rights reserved.
      </div>

    </div>
  )
}

export default AppLayout

