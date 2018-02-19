import React from 'react';
import { Link } from 'react-router-dom';

/*******************************************************************************
  <Header /> Component
*******************************************************************************/

class Header extends React.Component {
    render() {
      const { selectedModel, clearData } = this.props;

      const buildLink = (thisModel, label) => {
        return (
          <li>
            <span className={`nav__link ${selectedModel === thisModel ? "nav__link--selected" : ""}`}>
              <Link to={"/" + thisModel} onClick={clearData}>
                <span>{label}</span>
              </Link>
            </span>
          </li>
        )
      }

      return (
        <header>
          <div className="header__content">
            <nav>
              <ul>
                {buildLink("machine-comprehension", "Question Answering System")}
                </ul>
            </nav>
            <h1 className="header__content__logo">
              <a href="http://nsfcbl.org/" target="_blank" rel="noopener noreferrer">
              <img src = "assets/cbl_logo_full.png"/>
                <span className="u-hidden">Li lab</span>
              </a>
            </h1>
          </div>
        </header>
      );
    }
  }

export default Header;
