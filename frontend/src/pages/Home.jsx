const Home = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Creative Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Creatives</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
      </div>
    </div>
  )
}

export default Home
