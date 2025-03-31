import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import dayjs from "dayjs";

const vegetables = [
  "Tomatoes", "Potatoes", "Carrots", "Onions", "Spinach", "Broccoli", "Cabbage", "Peppers", "Cucumbers", "Eggplants"
];

const generateSalesData = () => {
  const startDate = dayjs().subtract(5, "year");
  const endDate = dayjs();
  let data = [];

  for (let i = 0; i < endDate.diff(startDate, "day"); i++) {
    const date = startDate.add(i, "day").format("YYYY-MM-DD");
    let totalSales = 0;
    let veggieSales = {};

    vegetables.forEach((veg) => {
      const sales = Math.floor(Math.random() * 5000) + 1000;
      veggieSales[veg] = sales;
      totalSales += sales;
    });

    data.push({ date, totalSales, ...veggieSales });
  }
  return data;
};

export default function ReportPage() {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("YTD");
  const [chartType, setChartType] = useState("Line");
  const [startDate, setStartDate] = useState(dayjs().startOf("year"));
  const [endDate, setEndDate] = useState(dayjs());

  useEffect(() => {
    const data = generateSalesData();
    setSalesData(data);
    filterData("YTD", data);
  }, []);

  const filterData = (range, data = salesData) => {
    let start;
    if (range === "WTD") start = dayjs().startOf("week");
    else if (range === "MTD") start = dayjs().startOf("month");
    else start = dayjs().startOf("year");

    setStartDate(start);
    setEndDate(dayjs());
    setFilteredData(data.filter((d) => dayjs(d.date).isAfter(start.subtract(1, "day"))));
    setTimeFrame(range);
  };

  const handleDateChange = (e, type) => {
    const newDate = dayjs(e.target.value);
    if (type === "start") setStartDate(newDate);
    else setEndDate(newDate);

    setFilteredData(salesData.filter((d) => dayjs(d.date).isAfter(startDate.subtract(1, "day")) && dayjs(d.date).isBefore(endDate.add(1, "day"))));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6">📊 Sales Report</h1>

        <div className="flex justify-center space-x-4 mb-6">
          {["WTD", "MTD", "YTD"].map((range) => (
            <button
              key={range}
              className={`px-4 py-2 rounded-lg ${timeFrame === range ? "bg-blue-500 text-white" : "bg-gray-300"}`}
              onClick={() => filterData(range)}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <input type="date" value={startDate.format("YYYY-MM-DD")} onChange={(e) => handleDateChange(e, "start")} className="p-2 border rounded" />
          <input type="date" value={endDate.format("YYYY-MM-DD")} onChange={(e) => handleDateChange(e, "end")} className="p-2 border rounded" />
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {["Line", "Bar", "Area"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg ${chartType === type ? "bg-green-500 text-white" : "bg-gray-300"}`}
              onClick={() => setChartType(type)}
            >
              {type} Chart
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4">📈 Sales Trend</h2>
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "Line" && (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={15} angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 25 }} />
                {vegetables.map((veg, idx) => <Line key={veg} type="monotone" dataKey={veg} stroke={`hsl(${idx * 30}, 70%, 50%)`} />)}
              </LineChart>
            )}
            {chartType === "Bar" && (
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 40 }} />
                {vegetables.map((veg, idx) => <Bar key={veg} dataKey={veg} fill={`hsl(${idx * 30}, 70%, 50%)`} />)}
              </BarChart>
            )}
            {chartType === "Area" && (
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 40 }} />
                {vegetables.map((veg, idx) => <Area key={veg} type="monotone" dataKey={veg} fill={`hsl(${idx * 30}, 70%, 50%)`} stroke={`hsl(${idx * 30}, 70%, 40%)`} />)}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}