/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/react";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { BarLoader } from "react-spinners";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  
  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  // Fetch for Saving/Unsaving a Job
  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  // Handle Save/Unsave Action
  const handleSaveJob = async () => {
    await fnSavedJob(
      { alreadySaved: saved },
      {
        user_id: user.id,
        job_id: job.id,
      }
    );
    // Refresh the list after action
    onJobAction();
  };

  // Handle Delete Action
  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  
  useEffect(() => {
    if (savedJob !== undefined) {
      setSaved(savedJob?.length > 0);
    }
  }, [savedJob]);

  return (
    <Card className="flex flex-col border border-slate-800 bg-slate-950/50">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      
      <CardHeader>
        
        <CardTitle className="flex justify-between items-center font-bold text-xl text-white w-full">
          <span>{job.title}</span>
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={20}
              className="text-red-500 cursor-pointer hover:scale-110 transition-transform ml-2"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-center">
          {job.company && (
            <img 
              src={job.company.logo_url} 
              className="h-7 object-contain" 
              alt={job.company.name} 
            />
          )}
          <div className="flex gap-1 items-center text-slate-400 text-sm">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        
        <hr className="border-slate-800" />
        
        <p className="text-sm text-slate-300 leading-relaxed">
          {job.description 
            ? `${job.description.split(".")[0]}.` 
            : "No job description provided."}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full font-semibold">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-12 border-slate-700 hover:bg-slate-900"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" className="text-red-500" />
            ) : (
              <Heart size={20} className="text-slate-400" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;