import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import Home from './pages/Home.jsx';
import PostList from './pages/PostList.jsx';
import PostDetails from './pages/PostDetails.jsx';
import './App.css';

const items = [
  {
    key: '/',
    label: 'HOME',
  },
  {
    key: '/posts',
    label: 'POST LIST',
  }
];

const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Tabs
      activeKey={location.pathname.startsWith('/posts/') ? '/posts' : location.pathname}
      onChange={(key) => navigate(key)}
      items={items}
      centered
      style={{ marginBottom: 24 }}
    />
  );
};

function App() {
  return (
    <BrowserRouter>
    <div className="card">
      <NavigationTabs />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/posts' element={<PostList />} />
        <Route path='/posts/:postId' element={<PostDetails />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
