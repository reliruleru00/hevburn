import React from 'react';
import HeaderNav from 'components/HeaderNav';

const CharaMgmtPage = () => {
  return (
    <>
      <HeaderNav />
      <iframe
        src={`${process.env.PUBLIC_URL}/chara_mgmt.html`}
        title="レガシーページ"
        style={{ width: '100%', height: 'calc(100svh - 60px)', border: 'none' }}
      />
    </>
  );
};

export default CharaMgmtPage;