import { Card, Input, Button, Typography } from "@material-tailwind/react";
import Lottie from "lottie-react";
import Loginre from "../assets/loginre.json";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password
      });
      if (response.data) {
        localStorage.setItem('email', response.data.email);
        navigate('/');
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen align-middle">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute opacity-10"
      >
        <Lottie animationData={Loginre} />
      </motion.div>
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          <motion.p
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Sign In
          </motion.p>
        </Typography>
        <Typography color="gray" className="mt-1 text-sm font-normal">
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Nice to meet you! Welcome to Smart Lamp Web
          </motion.p>
        </Typography>
        <form className="flex flex-col max-w-screen-lg gap-6 mt-8 mb-2 w-80 sm:w-96">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input label="Email" onChange={(e) => setEmail(e.target.value)} type="email" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Input label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button variant="outlined" onClick={handleSubmit} loading={loading ? true : false} ripple className="mt-6" fullWidth>
              sign in
            </Button>
          </motion.div>
        </form>
      </Card>
    </div>
  );
}
