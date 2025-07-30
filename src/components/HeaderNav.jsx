import React, { useState } from 'react';
import titleLogo from '../assets/img/title_log.png'; // ロゴ画像へのパスを適宜修正

const linkList = [
  { url: '/#/damage', title: 'ダメージ計算ツール' },
  { url: '/#/simulator', title: 'SP/ODシミュレータ' },
  { url: '/#/checker', title: 'スタイル所持率チェッカー' },
  { url: '/#/artslist', title: 'アーツデッキ画像生成' },
  { url: '/#/management', title: 'キャラ管理ツール' },
  { url: '', title: 'このサイトについて' },
];

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="header">
      <div className="hamburger">
        <img className="logo" src={titleLogo} alt="タイトルロゴ" />

        <p className="btn-gNav" onClick={toggleNav}>
          <span></span>
          <span></span>
          <span></span>
        </p>

        <nav className={`gNav ${isOpen ? 'open' : ''}`}>
          <ul className="gNav-menu">
            {linkList.map((link, index) => (
              <li key={index}>
                <a className="header_link" href={link.url}>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HeaderNav;
