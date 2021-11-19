import React from "react"; //test

const Layout = ({children}) => {
  return (
    <>
      <h1>Header Make CHange</h1>
        {children}
      <footer>footer</footer>
    </>
  )
};

export default Layout;