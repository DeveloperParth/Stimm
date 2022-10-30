import React, { useEffect, useState } from "react";
import { getStats } from "../../Services/Services";
import Stats from "./Dashboard/Stats";

function DashBoard() {
  const [stats, setStats] = useState();
  const fetchStats = async () => {
    const { data } = await getStats();
    setStats(data.stats);
  };
  useEffect(() => {
    fetchStats();
  }, []);

  return <>{stats && <Stats data={stats} />}</>;
}

export default DashBoard;