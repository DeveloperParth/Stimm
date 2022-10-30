import React, { useEffect, useState } from "react";
import { getReports } from "../../../Services/Services";
import Reports from "./Reports";
function ReportsPage() {
  const [reports, setReports] = useState(null);
  const fetchReports = async () => {
    const { data } = await getReports();
    setReports(data.reports);
  };
  useEffect(() => {
    fetchReports();
  }, []);

  return <>{reports && <Reports data={reports} setData={setReports} />}</>;
}

export default ReportsPage;
