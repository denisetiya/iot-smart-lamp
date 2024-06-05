import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Loading from "../assets/loading.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Consumption() {
  const navigate = useNavigate();
  const voltage = 220; // Assuming a fixed voltage of 220V

  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentPowerUsage, setCurrentPowerUsage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const powerUsageResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/power-usage`
        );
        const dailyPowerUsageResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/daily-power-usage`
        );
        const monthlyPowerUsageResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/monthly-power-usage`
        );

        if (
          powerUsageResponse &&
          powerUsageResponse.data &&
          powerUsageResponse.data.data
        ) {
          setCurrentPowerUsage(
            (powerUsageResponse.data.data._sum.current_mA || 0) * voltage / 1000
          );
        }

        if (
          dailyPowerUsageResponse &&
          dailyPowerUsageResponse.data &&
          dailyPowerUsageResponse.data.data
        ) {
          setDailyData(dailyPowerUsageResponse.data.data.map(item => ({
            ...item,
            totalPowerUsage: item.totalPowerUsage * voltage / 1000
          })));
        }

        if (
          monthlyPowerUsageResponse &&
          monthlyPowerUsageResponse.data &&
          monthlyPowerUsageResponse.data.data
        ) {
          setMonthlyData(monthlyPowerUsageResponse.data.data.map(item => ({
            ...item,
            totalPowerUsage: item.totalPowerUsage * voltage / 1000
          })));
        }
      
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDateTime = (timestamp) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleString('id-ID', options);
  };

  const formatMonth = (timestamp) => {
    const options = { month: 'short', year: 'numeric' };
    return new Date(timestamp).toLocaleDateString('id-ID', options);
  };

  const formatHour = (timestamp) => {
    const options = { hour: '2-digit' };
    return new Date(timestamp).toLocaleTimeString('id-ID', options);
  };

  const groupDailyData = (data) => {
    const groupedData = [];
    let currentGroup = null;

    data.forEach((item) => {
      const date = new Date(item.timestamp);
      const hour = date.getHours();

      if (!currentGroup || (hour % 4 === 0 && hour !== currentGroup.hour)) {
        if (currentGroup) {
          groupedData.push(currentGroup);
        }
        currentGroup = {
          hour: hour,
          totalPowerUsage: 0,
          timestamp: item.timestamp,
        };
      }

      currentGroup.totalPowerUsage += item.totalPowerUsage;
    });

    if (currentGroup) {
      groupedData.push(currentGroup);
    }

    return groupedData;
  };

  const groupedDailyData = groupDailyData(dailyData);

  const dailyChartData = {
    labels: groupedDailyData.map((item) => formatHour(item.timestamp)),
    datasets: [
      {
        label: "Daily Power Usage",
        data: groupedDailyData.map((item) => item.totalPowerUsage),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const groupMonthlyData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const month = formatMonth(item.timestamp);
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += item.totalPowerUsage;
      return acc;
    }, {});

    return Object.keys(groupedData).map((month) => ({
      month,
      totalPowerUsage: groupedData[month],
    }));
  };

  const groupedMonthlyData = groupMonthlyData(monthlyData);

  const monthlyChartData = {
    labels: groupedMonthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Power Usage",
        data: groupedMonthlyData.map((item) => item.totalPowerUsage),
        fill: false,
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Power Usage",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} W`;
          },
          title: function (context) {
            const timestamp = dailyData[context[0].dataIndex].timestamp;
            return formatDateTime(timestamp);
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Date, Month, Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Power Usage (W)",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={Loading} loop={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mx-2">
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
        >
          <div>
            <Typography variant="h6" color="blue-gray">
              <motion.p
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Current power use
              </motion.p>
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 py-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="paragraph">
              Total Power Use Today: {currentPowerUsage} W
            </Typography>
          </motion.div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
        >
          <div>
            <Typography variant="h6" color="blue-gray">
              <motion.p
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Daily power consumption
              </motion.p>
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 py-10">
          {loading ? (
            <Typography variant="paragraph">Loading...</Typography>
          ) : dailyData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Line
                data={dailyChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: "Konsumsi Daya Harian",
                    },
                  },
                }}
              />
            </motion.div>
          ) : (
            <Typography variant="paragraph">No data is available.</Typography>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
        >
          <div>
            <Typography variant="h6" color="blue-gray">
              <motion.p
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Monthly power consumption
              </motion.p>
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-10">
          {loading ? (
            <Typography variant="paragraph">Loading...</Typography>
          ) : monthlyData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Line
                data={monthlyChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: "Konsumsi Daya Bulanan",
                    },
                  },
                }}
              />
            </motion.div>
          ) : (
            <Typography variant="paragraph">No data is available.</Typography>
          )}
        </CardBody>
      </Card>
      <div className="mt-20"></div>
    </div>
  );
}
