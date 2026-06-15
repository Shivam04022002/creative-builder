const Navbar = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
            U
          </div>
          <span className="text-sm font-medium text-gray-700">User</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
