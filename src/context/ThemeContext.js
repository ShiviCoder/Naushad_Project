import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("Light"); // "Light" or "Dark"

  const themes = {
    Light: {
      background: "#fff",
      textPrimary: "#000",
      textSecondary: "#111",
      card: "#9387870A",
      primary: "#42BA86",
      secondary: "#3b82f6",
      white  :'#fff',
      subtext : '#00000075'
    },
    Dark: {
      background: "#121212",
      textPrimary: "#fff",
      textSecondary: "#ccc",
      card: "#464343ff",
      primary: "#42BA86",
      secondary: "#3b82f6",
      dark : '#111',
      subtext : '#fff'
    },
  };

  const toggleTheme = (value) => {
    setThemeName(value);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);