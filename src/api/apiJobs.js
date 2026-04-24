import supabaseClient from "@/utils/supabase";

// 1. Fetch All Jobs (with Filters)
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) query = query.eq("location", location);
  if (company_id) query = query.eq("company_id", company_id);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }
  return data;
}

// 2. Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }
  return data;
}

// 3. Save / Unsave Job Logic
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // Agar pehle se saved hai toh seedha DELETE chalao
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id)
      .eq("user_id", saveData.user_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return null;
    }
    return data;
  } else {
    // Agar saved nahi hai toh INSERT chalao
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return null;
    }
    return data;
  }
}

// 4. Read Single Job Details
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url), applications:applications(*)")
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }
  return data;
}

// 5. Post New Job (ASLI FIX YAHAN HAI)
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error Creating Job:", error);
    throw new Error("Error Creating Job");
  }

  return data;
}

// 6. Get My Created Jobs (For Recruiters)
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching My Jobs:", error);
    return null;
  }
  return data;
}

// 7. Delete Job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return null;
  }
  return data;
}

// 8. Update Hiring Status (Open/Closed)
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen: !!isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }
  return data;
}