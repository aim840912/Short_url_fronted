import React from "react";


function Header(props) {
  return (
    <header>
      <h1>React
      {props.isLogin ?
          <button
            className="header-item" onClick={props.onLogout}>Logout</button> :
          <button
            className="header-item" onClick={props.onLogout}>Login</button>}
      </h1>
    </header>
  );
}

export default Header;
