import React, { useState } from 'react';
import titleLogo from '../assets/img/title_log.png'; // ロゴ画像へのパスを適宜修正

const linkList = [
  { url: '.', title: 'ダメージ計算ツール' },
  { url: '#/spod_sim', title: 'SP/ODシミュレータ' },
  { url: 'style_checker', title: 'スタイル所持率チェッカー' },
  { url: 'arts_list', title: 'アーツデッキ画像生成' },
  { url: 'chara_mgmt', title: 'キャラ管理ツール' },
  { url: 'siteinfo', title: 'このサイトについて' },
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
