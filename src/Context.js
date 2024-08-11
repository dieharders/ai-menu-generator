import React, { useState, useRef } from "react";

export const Context = React.createContext();

export const Provider = (props) => {
  const queryParameters = new URLSearchParams(window.location.search);
  // State vals
  const [items, setItems] = useState({}); // purchase items
  const [menuId, setMenuId] = useState(queryParameters.get("id"));
  const [geminiAPIKey, setGeminiAPIKey] = useState("");
  const [openaiAPIKey, setOpenaiAPIKey] = useState("");
  const [fileInputValue, setFileInputValue] = useState([]);
  const loadingText = useRef(null);
  const [menuData, setMenuData] = useState({});

  const updateItem = (type, index, count) => {
    const key = `${type.toLowerCase()}-${index}`;
    const value = Number.isNaN(Number(count)) ? 0 : Number(count);
    const amount = Math.max(0, value);

    setItems({ ...items, [key]: Number(amount) });
  };

  return (
    <Context.Provider
      value={{
        purchases: [items, updateItem],
        geminiAPIKey,
        setGeminiAPIKey,
        openaiAPIKey,
        setOpenaiAPIKey,
        fileInputValue,
        setFileInputValue,
        loadingText,
        menuId,
        setMenuId,
        menuData,
        setMenuData,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
