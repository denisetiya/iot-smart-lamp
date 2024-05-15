import  { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"

export default function Consumption() {
  const navigate = useNavigate();
  useEffect(() => {
    { localStorage.getItem('email') ? null : navigate('/login') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/power-usage`
        );
        if (!response) {
          throw new Error("Gagal mengambil data");
        }
        setData(response.data.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const calculateTotalPowerInThreeHours = () => {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const dataInThreeHours = data.filter((item) => {
      const timestamp = new Date(item.timestamp);
      return timestamp >= threeHoursAgo && timestamp <= now;
    });

    const totalPowerInThreeHours = dataInThreeHours.reduce(
      (total, item) => total + item.current_mA,
      0
    );

    return totalPowerInThreeHours;
  };

  // Konfigurasi Chart
  const chartConfig = {
    type: "line",
    height: 240,
    series: [
      {
        name: "Power Usage",
        data: data.map((item) => item.current_mA),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: data.map((item) => {
          const date = new Date(item.timestamp);
          return date.getHours();
        }),
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <div>
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
                Consumption
              </motion.p>
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="max-w-sm font-normal"
            >
              <motion.p
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Daily consumption
              </motion.p>
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-0">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="body1">
              Total Power Usage in the Last 3 Hours:{" "}
              {calculateTotalPowerInThreeHours()} mA
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
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Consumption
              </motion.p>
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="max-w-sm font-normal"
            >
              <motion.p
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Monthly consumption
              </motion.p>
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-0">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Chart {...chartConfig} />
          </motion.div>
        </CardBody>
      </Card>
    </div>
  );
}
