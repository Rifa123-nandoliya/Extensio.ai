function Navbar() {
  return (
    <div className="flex items-center justify-between mb-8">

      <div>
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Generate AI-powered Chrome extensions
        </p>
      </div>

      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
        R
      </div>

    </div>
  );
}

export default Navbar;