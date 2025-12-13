function Topten({ data, className }) {
  const { language } = useLanguage();
  const [activePeriod, setActivePeriod] = useState("today");

  const safeData = {
    today: Array.isArray(data?.today) ? data.today : [],
    week: Array.isArray(data?.week) ? data.week : [],
    month: Array.isArray(data?.month) ? data.month : [],
  };

  const currentData = safeData[activePeriod];

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-white">Top 10</h1>

        <ul className="flex bg-[#1a1a1a] rounded-lg overflow-hidden">
          {["today", "week", "month"].map((period) => (
            <li
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`cursor-pointer px-4 py-1.5 text-sm ${
                activePeriod === period
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {period[0].toUpperCase() + period.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#1a1a1a] p-4 rounded-lg space-y-3">
        {currentData.length === 0 && (
          <p className="text-gray-400 text-sm">No data available</p>
        )}

        {currentData.map((item, index) => (
          <div key={item.id} className="flex gap-3 items-center">
            <span className="text-gray-500 font-bold">
              {String(index + 1).padStart(2, "0")}
            </span>

            <img
              src={item.poster}
              className="w-[55px] h-[70px] rounded-lg object-cover"
            />

            <div>
              <p className="text-white text-sm">
                {language === "EN" ? item.title : item.japanese_title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
