import React from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import MentorDashboard from "../components/MentorDashboard";
import StudentDashboard from "../components/StudentDashboard";

const Dashboard = ({ ...props }) => {
  const user = useSelector((state) => state.user);
  return (
    <Layout detailedNav={true} className={"overflow-hidden"}>
      {/* 
        If the profile is not complete then there will be a step by step process to complete profile
      */}
      {user.userDetails.userType === "MENTOR" ? (
        <MentorDashboard />
      ) : (
        <StudentDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;
