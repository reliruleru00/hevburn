import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import StyleChecker from 'components/styleChecker/StyleChecker';
import HeaderNav from 'components/HeaderNav';
import 'assets/styles/checker.css';

const StyleCheckerPage = () => {
  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  return (
    <>
      <HeaderNav />
      <StyleChecker />
    </>
  );
};

export default StyleCheckerPage;