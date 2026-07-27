import { RootStyle } from './styles';
export function LoaderWithLogo() {
  return <RootStyle className="loading-wrapper">
      <div className="logo">
        <img src="/static/logo/logo-svg.svg" alt="uko" />
      </div>

      <div className="loading-content" />
    </RootStyle>;
}