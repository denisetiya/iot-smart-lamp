import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";
import {
  PlusIcon,
  HomeIcon,
  ClockIcon,
  PresentationChartLineIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline"; 
import { Link } from "react-router-dom";


export default function Menu() {

  const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "hidden sm:flex absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal",
  };
  

  return (
    <div className={"relative w-full h-80"} >
      <div className="absolute bottom-0 right-0">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full">
              <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent>
            <SpeedDialAction className="relative">
              <Link to="/">              
                <HomeIcon className="w-5 h-5" />
                <Typography {...labelProps} >Home</Typography>
              </Link>
            </SpeedDialAction>
            <SpeedDialAction className="relative">
              <Link to ="/schedule">              
                <ClockIcon className="w-5 h-5" />
                <Typography {...labelProps} >Schedule</Typography>
              </Link>
            </SpeedDialAction>
            <SpeedDialAction className="relative">
              <Link to="/consumption">              
                <PresentationChartLineIcon className="w-5 h-5" />
                <Typography {...labelProps} >Consumption</Typography>
              </Link>
            </SpeedDialAction>
            <SpeedDialAction className="relative">
              <Link to="/About">              
                <ExclamationCircleIcon className="w-5 h-5" />
                <Typography {...labelProps} >About App</Typography>
              </Link>
            </SpeedDialAction>
          </SpeedDialContent>
        </SpeedDial>
      </div>
    </div>
  );
}