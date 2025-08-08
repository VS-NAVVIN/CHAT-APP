const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        {/* Fixed-size 3x3 grid */}
        <div
          className="grid grid-cols-3 gap-3 mb-8 mx-auto"
          style={{ width: "264px" }}
          >

          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-20 h-20 rounded-2xl bg-violet-400 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  ); 
};

export default AuthImagePattern;