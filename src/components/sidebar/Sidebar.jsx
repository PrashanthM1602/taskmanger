import React, { useState } from 'react';
import {
  NavigateNext,
  Menu,
  Checklist,
  CalendarViewMonthOutlined,
  StickyNote2,
  Logout
} from '@mui/icons-material';
import './sidebar.scss';
import { useNavigate, Link } from 'react-router-dom';

// ✅ IMPORT MODALS
import AiToolsModal from "../AiToolsModal";
import PdfAssistantModal from "../PdfAssistantModal";

const Sidebar = () => {
  const navigate = useNavigate();

  const [openAI, setOpenAI] = useState(false);
  const [openAssistant, setOpenAssistant] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className='sidebar'>

      {/* 🔝 TOP */}
      <div className="top">
        <div className="menu">
          <span className="menu-title">Menu</span>
          <Menu />
        </div>

        <button onClick={() => setOpenAI(true)}>
          🤖 AI Tools
        </button>
      </div>

      {/* 📋 CENTER */}
      <div className="center">
        <ul>
          <p className="title">TASKS</p>

          <Link to='/home'>
            <li>
              <NavigateNext className='icon' />
              <span>Upcoming</span>
            </li>
          </Link>

          <Link to='/day'>
            <li>
              <Checklist className='icon' />
              <span>Today</span>
            </li>
          </Link>

          <Link to='/Calendar'>
            <li>
              <CalendarViewMonthOutlined />
              <span>Calendar</span>
            </li>
          </Link>

          <Link to='/Sticky'>
            <li>
              <StickyNote2 className='icon' />
              <span>Sticky Wall</span>
            </li>
          </Link>
        </ul>
      </div>

      {/* 🔻 LOGOUT */}
      <div className="button">
        <ul>
          <li onClick={handleLogout}>
            <Logout className='icon' />
            <span>Sign out</span>
          </li>
        </ul>
      </div>

      {/* ========================= */}
      {/* 🤖 AI TOOLS MODAL */}
      {/* ========================= */}
      {openAI && (
        <AiToolsModal
          onClose={() => setOpenAI(false)}
          openAssistant={() => setOpenAssistant(true)}
        />
      )}

      {/* ========================= */}
      {/* 🧠 ASSISTANT MODAL */}
      {/* ========================= */}
      {openAssistant && (
        <PdfAssistantModal
          onClose={() => setOpenAssistant(false)}
        />
      )}

    </div>
  );
};

export default Sidebar;