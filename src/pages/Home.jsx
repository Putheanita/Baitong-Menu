import { useHomeController } from "../controllers/useHomeController";
import HomeView from "../views/home/HomeView";
import "./Home.css";

/**
 * Home Page (Controller Container)
 * 
 * Separates Controller Logic from View Presentation:
 * - Controller (filtering, search, category calculation, modals): src/controllers/useHomeController.js
 * - Views (header, categories chips, cards grid, footer): src/views/home/
 */
function Home(props) {
  const controller = useHomeController(props);

  return <HomeView {...props} {...controller} />;
}

export default Home;