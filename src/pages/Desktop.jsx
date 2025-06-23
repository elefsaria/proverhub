import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Desktop = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) navigate('/');
  }, []);

  const icons = [
    { name: 'QuickMath', path: '/quickmath', icon: '➕' },
    { name: 'CatClicker', path: '/catclicker', icon: '😺' },
    { name: 'Flappy', path: '/flappy', icon: '🏁' },
    { name: 'Mario', path: '/mario', icon: '⏱️' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
  ];

  return (
    <div className="desktop">
      <div className="desktop-icons">
        {icons.map((app, idx) => (
          <div key={idx} className="icon" onClick={() => navigate(app.path)}>
            <div className="icon-img">{app.icon}</div>
            <span>{app.name}</span>
          </div>
        ))}
      </div>
      <img
        src="/logo-energi.png"
        alt="logo"
        className="logo-energy"
      />
      <div className="dock">
        <span>👤 {username}</span>
        <a href="https://x.com/succinct" target="_blank">🧑‍💼 Profile X</a>
        <a href="https://discord.com/invite/succinct" target="_blank">💬 Join Discord</a>
      </div>
    </div>
  );
};

export default Desktop;
