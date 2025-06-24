import daunImg from '../assets/daun.jpg'; 

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Home Page!</h1>
      <img
        src={daunImg}
        alt="daun.jpg"
        style={{ width: 180, marginTop: 24 }}
      />
    </div>
  );
};

export default Home;
