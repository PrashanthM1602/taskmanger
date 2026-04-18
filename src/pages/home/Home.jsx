import React from "react";
import "./home.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import Today from "../../components/today/Today";
import Tomorrow from "../../components/tommarow/Tommarow";
import Week from "../../components/week/Week";

import { useQuery } from "@apollo/client/react";
import { GET_ANALYTICS } from "../../graphql/analyticsQueries";
import { GET_TASKS } from "../../graphql/taskQueries";

const Home = () => {
  // 🔥 ANALYTICS
  const { data, loading } = useQuery(GET_ANALYTICS);

  // 🔥 TASK REFRESH
  const { refetch } = useQuery(GET_TASKS);

  return (
    <div className="home">
      {/* 🔥 SIDEBAR */}
      <Sidebar refetchTasks={refetch} />

      <div className="homeContainer">

        {/* ========================= */}
        {/* 🚀 ANALYTICS */}
        {/* ========================= */}
        {!loading && data && (
          <div className="analytics-container">

            <div className="analytics-card">
              <h4>🚀 Productivity Score</h4>
              <h2>
                {data.productivityAnalytics.productivityScore.toFixed(1)}%
              </h2>
            </div>

            <div className="analytics-card">
              <h4>✅ On-Time Rate</h4>
              <h2>
                {data.productivityAnalytics.onTimeRate.toFixed(1)}%
              </h2>
            </div>

            <div className="analytics-card">
              <h4>⏳ Avg Completion</h4>
              <h2>
                {data.productivityAnalytics.averageCompletionTimeHours.toFixed(1)} hrs
              </h2>
            </div>

            <div className="analytics-card">
              <h4>⚠ Delay %</h4>
              <h2>
                {data.productivityAnalytics.delayPercentage.toFixed(1)}%
              </h2>
            </div>

          </div>
        )}

        {/* ========================= */}
        {/* 📋 HEADER */}
        {/* ========================= */}
        <div className="upcoming-title">
          <p>Upcoming</p>
          {/* <span>12</span> */}
        </div>

        {/* ========================= */}
        {/* 📅 TODAY (FULL WIDTH) */}
        {/* ========================= */}
        <div className="home-top">
          <Today />
        </div>

        {/* ========================= */}
        {/* 📊 TOMORROW + WEEK */}
        {/* ========================= */}
        <div className="home-bottom">

          <div className="home-left">
            <Tomorrow />
          </div>

          <div className="home-right">
            <Week />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;