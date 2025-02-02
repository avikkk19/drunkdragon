import React,{ useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jgrecgjbgunbtlxacqhk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncmVjZ2piZ3VuYnRseGFjcWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTg2ODcsImV4cCI6MjA1Mjg3NDY4N30.YfNHkLsaRzuNdhPxS2h3LwsH74028rRTvjS45BxF1uo"
); // Replace with your Supabase credentials

const FileDownloadComponent = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch files from Supabase storage
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase.storage
          .from("walls") // Replace with your Supabase bucket name
          .list(""); // Adjust folder path if needed

        if (error) throw error;
        setFiles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Handle file download
  const handleDownload = async (fileName) => {
    try {
      const { signedURL, error } = await supabase.storage
        .from("walls")
        .getPublicUrl(fileName); // Get the public URL of the file

      if (error) throw error;

      const link = document.createElement("a");
      link.href = signedURL;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (loading) return <div>Loading files...</div>;

  return (
    <div className="relative w-auto h-auto p-4">
      <h2>Download Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <span>{file.name}</span>
            <button onClick={() => handleDownload(file.name)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDownloadComponent;
