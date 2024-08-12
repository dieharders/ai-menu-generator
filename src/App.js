import { Provider } from "./Context";
import Home from "./components/Home";
import MenuPageForWeb from "./components/MenuPageForWeb";
import MenuPageForPrint from "./components/MenuPageForPrint";
import Background from "./components/BackgroundSVG";
import styles from "./App.module.scss";

export default function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const isPrint = queryParameters.get("print") === "true";
  const menuId = queryParameters.get("id");

  return (
    <Provider className={styles}>
      <Background />
      {menuId && isPrint && <MenuPageForPrint />}
      {menuId && !isPrint && <MenuPageForWeb />}
      {!menuId && <Home />}
    </Provider>
  );
}
