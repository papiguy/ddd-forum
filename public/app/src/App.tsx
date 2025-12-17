
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.sass';
import IndexPage from './pages';
import DiscussionPage from './pages/discussion';
import CommentPage from './pages/comment';
import LoginPage from './pages/login';
import JoinPage from './pages/join';
import AuthenticatedRoute from './shared/infra/router/AuthenticatedRoute';
import SubmitPage from './pages/submit';
import MemberPage from './pages/member';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/discuss/:slug" element={<DiscussionPage />} />
        <Route path="/comment/:commentId" element={<CommentPage />} />
        <Route path="/member/:username" element={<MemberPage />} />
        <Route path="/submit" element={<AuthenticatedRoute><SubmitPage /></AuthenticatedRoute>} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

