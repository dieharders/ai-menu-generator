import React, { useState, useRef } from "react";

export const Context = React.createContext();

export const Provider = (props) => {
  const queryParameters = new URLSearchParams(window.location.search);
  // State vals
  const availableLanguages = useRef([]);
  const [storedImages, setStoredImages] = useState([]); // track what images are persisted on disk
  const [menuId, setMenuId] = useState(queryParameters.get("id"));
  const geminiAPIKeyRef = useRef("");
  const openaiAPIKeyRef = useRef("");
  const [fileInputValue, setFileInputValue] = useState([]);
  const loadingText = useRef(null);
  const [menuData, setMenuData] = useState({});

  return (
    <Context.Provider
      value={{
        geminiAPIKeyRef,
        openaiAPIKeyRef,
        fileInputValue,
        setFileInputValue,
        loadingText,
        menuId,
        setMenuId,
        menuData,
        setMenuData,
        storedImages,
        setStoredImages,
        availableLanguages,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
