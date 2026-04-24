import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  
  const recruiterId = job?.recruiter_id?.toString().replace(/['"]+/g, "").trim();
  const isRecruiter = recruiterId === user?.id;

  return (
    <div className="flex flex-col gap-8 mt-5 px-4 sm:px-0">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 text-slate-400">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2 text-slate-400">
          <Briefcase /> {job?.applications?.length || 0} Applicants
        </div>
        <div className="flex gap-2 font-bold">
          {job?.isOpen ? (
            <span className="flex gap-2 text-green-500">
              <DoorOpen /> Open
            </span>
          ) : (
            <span className="flex gap-2 text-red-500">
              <DoorClosed /> Closed
            </span>
          )}
        </div>
      </div>

      {/* HIRING STATUS DROPDOWN SECTION */}
      {isRecruiter && (
        <div className="flex flex-col gap-3">
          <Select
            onValueChange={handleStatusChange}
            value={job?.isOpen ? "open" : "closed"}
          >
            <SelectTrigger
              className={`w-full text-white font-bold transition-all duration-300 ${
                job?.isOpen 
                  ? "bg-green-700 hover:bg-green-800 border-green-600" 
                  : "bg-red-700 hover:bg-red-800 border-red-600"
              }`}
            >
              <SelectValue>
                Hiring Status: {job?.isOpen ? "Open" : "Closed"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem
                value="open"
                className="text-green-500 font-bold focus:bg-green-950 focus:text-green-400 cursor-pointer"
              >
                Open (Hiring Started)
              </SelectItem>
              <SelectItem
                value="closed"
                className="text-red-500 font-bold focus:bg-red-950 focus:text-red-400 cursor-pointer"
              >
                Closed (Hiring Stopped)
              </SelectItem>
            </SelectContent>
          </Select>
          {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
        <p className="sm:text-lg text-slate-200">{job?.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
        <div data-color-mode="dark" className="rounded-lg overflow-hidden">
          <MDEditor.Markdown
            source={job?.requirements}
            className="bg-transparent sm:text-lg text-slate-300"
          />
        </div>
      </div>

      {/* RENDER APPLY DRAWER ONLY FOR CANDIDATES */}
      {!isRecruiter && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user?.id)}
        />
      )}

      {/* RENDER APPLICATIONS LIST ONLY FOR RECRUITER */}
      {isRecruiter && job?.applications?.length > 0 && (
        <div className="flex flex-col gap-4 mt-10">
          <h2 className="font-bold text-2xl border-b border-slate-700 pb-2">
            Applications Received
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {job?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;