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
    <div className="relative h-80 w-full">
      <div className="absolute bottom-0 right-0">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full">
              <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent>
            <SpeedDialAction className="relative">
              <Link to="/">              
                <HomeIcon className="h-5 w-5" />
                <Typography {...labelProps} >Home</Typography>
              </Link>
            </SpeedDialAction>
            <SpeedDialAction className="relative">
              <Link to ="/schedule">              
                <ClockIcon className="h-5 w-5" />
                <Typography {...labelProps} >Schedule</Typography>
              </Link>
            </SpeedDialAction>
            <SpeedDialAction className="relative">
              <Link to="/consumption">              
                <PresentationChartLineIcon className="h-5 w-5" />
                <Typography {...labelProps} >Consumption</Typography>
              </Link>
            </SpeedDialAction>
          </SpeedDialContent>
        </SpeedDial>
      </div>
    </div>
  );
}