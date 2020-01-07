import React from 'react';
import WebCam from 'react-webcam';
import './style.css';

interface CameraProps {
  onDocumentTaken: (picture: File) => void;
  onDocumentClear: () => void;
  onBack: () => void;
}

interface CameraState {
  picture: string;
  state: 'OPEN' | 'PICTURE_TAKEN';
}

function base64ImageToBlob(str: string): File {
  // extract content type and base64 payload from original string
  const pos = str.indexOf(';base64,');
  const type = str.substring(5, pos);
  const b64 = str.substr(pos + 8);

  // decode base64
  const imageContent = atob(b64);

  // create an ArrayBuffer and a view (as unsigned 8-bit)
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);

  // fill the view, using the decoded base64
  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  return new File([buffer], 'screenshot.jpeg', {type});
}

/* tslint:disable:no-empty */
export default class Camera extends React.Component<CameraProps, CameraState> {
  webCamRef: any;
  state = {
    picture: '',
    state: 'OPEN'
  } as CameraState;

  render() {
    const {picture, state} = this.state;
    const {onDocumentTaken, onDocumentClear, onBack} = this.props;
    const videoConstraints = {
      facingMode: 'user',
      height: 490,
      width: 490
    };
    const noop = () => {};
    return (
      <div className="camera">
        {state === 'OPEN' && (
          <div>
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
            <div className="camera__buttons">
              <span className="btn-back" onClick={onBack}>
                Back
              </span>
              <span
                className="btn btn--stroke btn-sm"
                onClick={() => {
                  const newPicture = this.webCamRef.getScreenshot();
                  this.setState({picture: newPicture, state: 'PICTURE_TAKEN'});
                  onDocumentTaken(base64ImageToBlob(newPicture));
                }}
              >
                Take photo
              </span>
            </div>
          </div>
        )}
        {state === 'PICTURE_TAKEN' && (
          <div>
            <span
              className="camera__clear-icon"
              onClick={() => {
                this.setState({picture: '', state: 'OPEN'});
                onDocumentClear();
              }}
            >
              <img src={`${process.env.PUBLIC_URL}/images/icon_times.png`} />
            </span>
            <img className="camera__captured-image" src={picture} />
          </div>
        )}
      </div>
    );
  }
}
