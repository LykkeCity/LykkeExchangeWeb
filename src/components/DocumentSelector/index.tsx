import {Dialog} from '@lykkecity/react-components';
import React from 'react';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import Camera from '../Camera';
import './style.css';

interface DocumentSelectorProps {
  analyticsService: any;
  fromCamera: boolean;
  fromLibrary?: boolean;
  rules: any;
  maxFileSize: number;
  accept: string[];
  rejectedImage?: string;
  onDocumentTaken: (document: File, from?: SelectorMode) => void;
  onDocumentClear: () => void;
}

export type SelectorMode = 'EMPTY' | 'REJECTED' | 'CAMERA' | 'LIBRARY';

interface DocumentSelectorState {
  libraryPictureSrc: string | ArrayBuffer;
  selectedMode: SelectorMode;
  showInvalidFileDialog: boolean;
}

/* tslint:disable:no-empty */
export class DocumentSelector extends React.Component<
  DocumentSelectorProps,
  DocumentSelectorState
> {
  uploadInputRef: any;
  cameraRef: any;
  state = {
    libraryPictureSrc: '',
    selectedMode: 'EMPTY' as SelectorMode,
    showInvalidFileDialog: false
  };

  componentDidMount(): void {
    if (this.props.rejectedImage) {
      this.setState({
        libraryPictureSrc: this.props.rejectedImage,
        selectedMode: 'REJECTED'
      });
    }
  }

  setMode(mode: SelectorMode) {
    this.setState({selectedMode: mode});
  }

  turnOffCamera() {
    if (this.state.selectedMode === 'CAMERA') {
      this.setMode('EMPTY');
    }
  }

  renderWebCamButton() {
    return (
      <div
        className="button"
        onClick={() => {
          this.setMode('CAMERA');
          this.props.analyticsService.track(AnalyticsEvent.Kyc.OpenCamera);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/images/cam_blue_icon.png`} />
        <span className="text">Take Photo</span>
      </div>
    );
  }

  renderLibraryButton() {
    const {onDocumentTaken, accept} = this.props;
    return (
      <div
        className="button"
        onClick={() => {
          this.uploadInputRef.click();
        }}
      >
        <input
          type="file"
          accept={accept.join(', ')}
          style={{display: 'none'}}
          ref={ref => {
            this.uploadInputRef = ref;
          }}
          onChange={(e: any) => {
            if (e.target.files.length === 0) {
              return;
            }
            this.setMode('LIBRARY');

            const file = e.target.files[0];
            const reader = new FileReader();
            const fileSizeInMb = file.size / 1024 / 1024;

            if (fileSizeInMb > this.props.maxFileSize) {
              this.setState({showInvalidFileDialog: true});
              return;
            }

            reader.readAsDataURL(file);
            reader.onload = () => {
              const libraryPictureSrc = reader.result as string;
              this.setState({libraryPictureSrc});
              onDocumentTaken(file, this.state.selectedMode);
            };
          }}
        />
        <img src={`${process.env.PUBLIC_URL}/images/library_icon.png`} />
        <span className="text">Upload from library</span>
      </div>
    );
  }

  renderCameraOrRules() {
    const {rules, onDocumentTaken, onDocumentClear} = this.props;
    const {selectedMode, libraryPictureSrc} = this.state;

    if (selectedMode === 'REJECTED') {
      return (
        <div className="document-selector__document">
          <span
            className="document-selector__clear-icon"
            onClick={() => {
              this.setState({selectedMode: 'EMPTY', libraryPictureSrc: ''});
              onDocumentClear();
            }}
          >
            <img src={`${process.env.PUBLIC_URL}/images/icon_times.png`} />
          </span>
          <embed
            src={libraryPictureSrc}
            className="document-selector__document-preview"
          />
        </div>
      );
    }

    if (selectedMode === 'CAMERA') {
      return (
        <Camera
          analyticsService={this.props.analyticsService}
          ref={ref => (this.cameraRef = ref)}
          onDocumentTaken={onDocumentTaken}
          onDocumentClear={onDocumentClear}
          onBack={() => {
            this.setState({selectedMode: 'EMPTY'});
            this.props.analyticsService.track(AnalyticsEvent.Kyc.CloseCamera);
            onDocumentClear();
          }}
        />
      );
    }

    if (selectedMode === 'LIBRARY' && libraryPictureSrc) {
      return (
        <div className="document-selector__document">
          <span
            className="document-selector__clear-icon"
            onClick={() => {
              onDocumentClear();
              this.setState({selectedMode: 'EMPTY', libraryPictureSrc: ''});
            }}
          >
            <img src={`${process.env.PUBLIC_URL}/images/icon_times.png`} />
          </span>
          <embed
            src={libraryPictureSrc}
            className="document-selector__document-preview"
          />
        </div>
      );
    }

    return (
      <div className="document-selector">
        <div className="document-selector__rules">{rules}</div>
      </div>
    );
  }

  renderButtonsContainer() {
    const {selectedMode, libraryPictureSrc} = this.state;
    const {fromCamera, fromLibrary} = this.props;
    if (selectedMode === 'CAMERA') {
      return null;
    }
    if (libraryPictureSrc) {
      return null;
    }
    if (selectedMode === 'LIBRARY' || selectedMode === 'EMPTY') {
      return (
        <div className="document-selector__buttons">
          {fromCamera && this.renderWebCamButton()}
          {fromLibrary && this.renderLibraryButton()}
        </div>
      );
    }

    return null;
  }

  renderInvalidFileDialog() {
    return (
      <Dialog
        visible={this.state.showInvalidFileDialog}
        onCancel={() => {}}
        onConfirm={() => {
          this.setState({showInvalidFileDialog: false});
        }}
        confirmButton={{text: 'Try Again'}}
        cancelButton={{text: ''}}
        title="Invalid file uploaded"
        description={
          <span>
            Uploaded file size should not exceed the {this.props.maxFileSize}MB.
          </span>
        }
      />
    );
  }

  render() {
    return (
      <div className="verification-page__card">
        {this.renderInvalidFileDialog()}
        {this.renderCameraOrRules()}
        {this.renderButtonsContainer()}
      </div>
    );
  }
}

export default DocumentSelector;
