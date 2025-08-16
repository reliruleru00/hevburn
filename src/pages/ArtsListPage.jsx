import React from 'react';
import ArtsList from 'components/artsList/ArtsList';
import HeaderNav from 'components/HeaderNav';
import 'assets/styles/arts.css';
import { HeadProvider, Title, Meta } from 'react-head';

const ArtsListPage = () => {
  return (
    <>
      <HeadProvider>
        <div>
          <Title>アーツデッキ画像生成</Title>
          <Meta name="description" content="アーツデッキ画像生成" />
        </div>
      </HeadProvider>
      <HeaderNav />
      <ArtsList />
    </>
  );
};

export default ArtsListPage;