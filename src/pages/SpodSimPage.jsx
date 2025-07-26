import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import StyleListProvider from 'components/StyleListProvider';
import SpOdSimulation from 'components/spodSim/SpodSimulation';
import HeaderNav from 'components/HeaderNav';
import 'assets/styles/simulator.css';

const SpodSimPage = () => {
  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  return (
    <>
      <HeaderNav />
      <StyleListProvider>
        <SpOdSimulation />
      </StyleListProvider>
    </>
  );
};

export default SpodSimPage;