import styled from 'styled-components';
import { Player } from "@lottiefiles/react-lottie-player";
import loadingSymbol from '@assets/loading-symbol.json';

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => (props.theme === 'dark' ? '#232323' : '#fff')};
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ScreenLoading = ({ speed = 1, size = 150 }) => {
  return (
    <LoadingWrapper>
      <div className="loading-inner">
        <Player autoplay speed={1} loop src={loadingSymbol} style={{ width: size }} />
      </div>
    </LoadingWrapper>
  );
};

const InnerLoading = ({ speed = 1.7, size = 100 }) => {
  return (
    <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="loading-inner">
        <Player autoplay speed={1} loop src={loadingSymbol} style={{ width: size }} />
      </div>
    </div>
  );
};

const CenterLoading = ({ speed = 1.5, size = 150, opacity = 1 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        background: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      <div className="loading-inner">
        <Player autoplay speed={1} loop src={loadingSymbol} style={{ width: size }} />
      </div>
    </div>
  );
};

const Loading = () => <></>;

Loading.Screen = ScreenLoading;
Loading.Inner = InnerLoading;
Loading.Center = CenterLoading;

export default Loading;
