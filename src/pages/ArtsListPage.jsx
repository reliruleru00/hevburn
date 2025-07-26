import React from 'react';
import ArtsList from 'components/artsList/ArtsList';
import HeaderNav from 'components/HeaderNav';
import 'assets/styles/arts.css';

const ArtsListPage = () => {
  return (
    <>
      <HeaderNav />
      <ArtsList />
    </>
  );
};

export default ArtsListPage;