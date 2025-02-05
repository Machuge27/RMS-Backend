import React, { useEffect, useState } from "react";
import "../css/admin/Dashboard.css";
import Greeting from "../Components/boxes/Greeting";
import api from "../Api";
import Calendar from "../Components/boxes/Calendar"; // Reuse CalendarSection
import { useAuth } from "../Components/admin/AuthProvider";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [tenantData, setTenantData] = useState({});
  const [events, setEvents] = useState([
    { id: 1, title: "Rent Due", date: "2024-02-01", type: "payment" },
    { id: 2, title: "Maintenance Inspection", date: "2024-02-15", type: "maintenance" },
    {
      id: 2,
      title: 'Monthly meeting',
      date: '2024-02-15',
      type: 'meeting'
    },
  ]);

  

  const getNextMonthDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 11);
    return nextMonth.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const res = await api.get("/api/tenant/data/");
        const data = res.data;
        setUser((prev) => ({ ...prev, userdata: data }));
        setTenantData(data);
        console.log("Tenant data:", data);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      }
    };

    fetchTenantData();
  }, [setUser]);

  return (
    <div style={{ width: "90%" }}>
      <Greeting />
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <div className="card">
            <h3>Outstanding Balance for this month</h3>
            <p>Ksh: {user?.userdata?.balance}</p>
          </div>
          <div className="card">
            <h3>Upcoming Due Date</h3>
            <p>{getNextMonthDate()}</p>
          </div>
        </div>

        {/* Include Calendar and Events Section */}
        <Calendar events={events} />
      </div>
    </div>
  );
};

export default Dashboard;
