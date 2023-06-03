import React from "react";
import Logo from "./components/Logo";
import Mains from "./components/Mains";
import Extras from "./components/Extras";
import Total from "./components/Total";
import { Provider } from "./Context";
import { mains, sides, drinks } from "./data";

import "./styles.css";

export default function App() {
  return (
    <Provider>
      <div className="menu">
        <Logo />
        <Mains meals={mains} />
        <aside className="aside">
          <Extras type="Sides" items={sides} />
          <Extras type="Drinks" items={drinks} />
        </aside>
        <Total />
        {/* Add QR-Code and web link in place of Total */}
      </div>
    </Provider>
  );
}
