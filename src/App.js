import { Provider } from "./Context";
import Home from "./components/Home";
import { MenuPage } from "./components/MenuPage";
import Background from "./components/BackgroundSVG";
import styles from "./App.module.scss";

export default function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const menuId = queryParameters.get("id");

  return (
    <Provider className={styles}>
      <Background />
      {menuId ? <MenuPage /> : <Home />}
    </Provider>
  );
}
