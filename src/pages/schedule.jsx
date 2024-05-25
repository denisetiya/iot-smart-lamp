import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import Clock from "../assets/clock.json";
import { Input, Button } from "@material-tailwind/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom"

function Schedule() {
  const navigate = useNavigate();
  useEffect(() => {
    { localStorage.getItem('email') ? null : navigate('/login') }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const lottieRef = useRef();
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');

  useEffect(() => {
    if(localStorage.getItem('time1') && localStorage.getItem('time2')) {
      setTime1(localStorage.getItem('time1'));
      setTime2(localStorage.getItem('time2'));
    }
    if (lottieRef.current) {
      const animation = lottieRef.current;
      const totalFrames = animation.getDuration(true);
      const middleFrame = Math.floor(totalFrames / 2);
      const middleTime =
        (middleFrame / totalFrames) * animation.getDuration(false) * 1000;
      const stopAnimation = () => {
        animation.goToAndStop(middleFrame, true);
      };

      const timer = setTimeout(stopAnimation, middleTime);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = async (e) => {

    localStorage.setItem('time1', time1);
    localStorage.setItem('time2', time2);
    e.preventDefault();
    try {
      const sendData = await axios.post(`${import.meta.env.VITE_API_URL}/schedule`, {
        time1 : time1,
        time2 : time2
      });
      if (!sendData){
        throw new Error('Gagal set Schedule');  
      }
    } catch (error) {
      console.error(error.message);
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.p
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-xl font-bold"
      >
        Schedule
      </motion.p>

      <Lottie
        lottieRef={lottieRef}
        animationData={Clock}
        loop={false}
        className="w-80"
      />

      <div className="flex flex-col gap-4 ">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Input type="time" value={time1} label="trun on time"  onChange={(e) => setTime1(e.target.value)}/>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Input type="time" value={time2} label="trun off time" onChange={(e) => setTime2(e.target.value)} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button variant="outlined" onClick={handleSave} ripple className="w-full" >Save</Button>
        </motion.div>
      </div>
    </div>
  );
}

export default Schedule;
