import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import Lamp from '../assets/lamp.json';
import { Button } from '@material-tailwind/react';
import {motion} from 'framer-motion'
import axios from 'axios';
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    { localStorage.getItem('email') ? null : navigate('/login') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const [isOn, setIsOn] = useState(false);

  const lottieRef = useRef(null);
 
  useEffect(() => {

    const fetchData = async () => {
      try {
        const datas = await axios.get(`${import.meta.env.VITE_API_URL}/status`);

        if (datas.data.status === 'on') {
          setIsOn(true);
        } else if(datas.data.status === 'off') {
          setIsOn(false);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  },[isOn])

  const handleButtonClick = async() => {
  
    try {
      
      const sendData = await axios.post(`${import.meta.env.VITE_API_URL}/update` , {status: isOn ? 'off' : 'on'});
      if (!sendData){
        throw new Error('Gagal menyimpan data ke database');  
      }
     
      setIsOn((prev) => !prev);
    } catch (error) {
      console.error(error.message); 
    }
    
  };

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setDirection(isOn ? 1 : -1);
      lottieRef.current.play();
    }
  }, [isOn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{ duration: 2, delay: 1 }} className='text-xl font-bold transition-all duration-100 delay-75'>
        {isOn ? 'Smart Lamp is On' : 'Smart Lamp is Off'}
      </motion.div>
      <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{ duration: 1, delay: 0.7 }}>
        <Lottie 
          lottieRef={lottieRef}
          animationData={Lamp} 
          loop={false} 
          className="w-75" 
        />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 100}} animate={{ opacity: 1, y: 0}} transition={{ duration: 1, delay: 0.5 }} >
        <Button
          variant="outlined"
          color={isOn ? 'green' : 'red'}
          className="w-20 h-20 mt-8 rounded-full shadow-xl" 
          onClick={handleButtonClick}
        >
          {isOn ? 'On' : 'Off'}
        </Button>
      </motion.div>
      
    </div>
  );
}

export default Home;
