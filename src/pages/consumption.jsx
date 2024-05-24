import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
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
export default function Consumption() {
  const navigate = useNavigate();

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
            powerUsageResponse.data.data._sum.current_mA || 0
          );
        }

        if (
          dailyPowerUsageResponse &&
          dailyPowerUsageResponse.data &&
          dailyPowerUsageResponse.data.data
        ) {
          setDailyData(dailyPowerUsageResponse.data.data);
        }

        if (
          monthlyPowerUsageResponse &&
          monthlyPowerUsageResponse.data &&
          monthlyPowerUsageResponse.data.data
        ) {
          setMonthlyData(monthlyPowerUsageResponse.data.data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const dailyChartData =
    dailyData.length > 0
      ? dailyData.map((item) => ({
          x: new Date(item.timestamp).toLocaleDateString(),
          y: item.totalPowerUsage,
        }))
      : [];

      

 
  const monthlyChartData =
    monthlyData.length > 0
      ? monthlyData.map((item) => ({
          x: new Date(item.timestamp).toLocaleDateString(),
          y: item.totalPowerUsage,
        }))
      : [];

      const dailyChartConfig = {
        series: [
          {
            name: "Daily Power Usage",
            data: dailyChartData,
          },
        ],
        options: {
          chart: {
            type: "line",
            height: 350,
            toolbar: {
              show: false,
            },
          },
          title: {
            text: "Konsumsi Daya Harian",
            align: "left",
          },
          xaxis: {
            type: "category",
            categories: dailyChartData.map((item) => {
              // Parse the timestamp string and extract the hour and minute
              const timestamp = new Date(item.x);
              const hour = timestamp.getHours().toString().padStart(2, '0');
              const minute = timestamp.getMinutes().toString().padStart(2, '0');
              return `${hour}:${minute}`;
            }),
          },
          yaxis: {
            title: {
              text: "Total Power Usage (mA)",
            },
          },
          tooltip: {
            x: {
              format: "HH:mm",
            },
          },
        },
      };
      
      

  const monthlyChartConfig = {
    series: [
      {
        name: "Monthly Power Usage",
        data: monthlyChartData,
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      title: {
        text: "Konsumsi Daya Bulanan",
        align: "left",
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: "MMM yyyy",
        },
      },
      yaxis: {
        title: {
          text: "Total Power Usage (mA)",
        },
      },
      tooltip: {
        x: {
          format: "MMM yyyy",
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
    <div className="flex flex-col gap-4 mx-2 ">
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
              Total Power Use Today: {currentPowerUsage} mA
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
          ) : dailyChartData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Chart
                options={dailyChartConfig.options}
                series={dailyChartConfig.series}
                type="line"
                height={350}
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
          ) : monthlyChartData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Chart
                options={monthlyChartConfig.options}
                series={monthlyChartConfig.series}
                type="line"
                height={350}
              />
            </motion.div>
          ) : (
            <Typography variant="paragraph">No data is available.</Typography>
          )}
        </CardBody>
      </Card>
      <div className="mt-20">
        
      </div>
    </div>
  );
}
