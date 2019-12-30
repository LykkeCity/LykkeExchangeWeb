import React from 'react';
import WebCam from 'react-webcam';
import './style.css';

interface CameraProps {
  onPictureTaken: (picture: string) => void;
  onPictureClear: () => void;
  onBack: () => void;
}

interface CameraState {
  picture: string;
}

/* tslint:disable:no-empty */
export default class Camera extends React.Component<CameraProps, CameraState> {
  webCamRef: any;
  state = {
    picture: ''
  };

  render() {
    const {picture} = this.state;
    const {onPictureTaken, onPictureClear, onBack} = this.props;
    const videoConstraints = {
      facingMode: 'user',
      height: 490,
      width: 490
    };
    const noop = () => {};
    return (
      <div className="camera">
        {!picture && (
          <div className="camera__wrapper">
            <WebCam
              ref={ref => {
                this.webCamRef = ref;
              }}
              audio={false}
              imageSmoothing={false}
              onUserMedia={noop}
              onUserMediaError={noop}
              screenshotQuality={1}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
        )}
        {picture && (
          <div>
            <span
              className="camera__clear-icon"
              onClick={() => {
                this.setState({picture: ''});
                onPictureClear();
              }}
            >
              <img src={`${process.env.PUBLIC_URL}/images/icon_times.png`} />
            </span>
            <img className="camera__captured-image" src={picture} />
          </div>
        )}
        <div className="camera__buttons">
          {!picture && (
            <span className="btn-back" onClick={onBack}>
              Back
            </span>
          )}
          {!picture && (
            <span
              className="btn btn--stroke btn-sm"
              onClick={() => {
                const newPicture = this.webCamRef.getScreenshot();
                this.setState({picture: newPicture});
                onPictureTaken(newPicture);
              }}
            >
              Take photo
            </span>
          )}
        </div>
      </div>
    );
  }
}
