import {Amplitude, EventModel, GoogleAnalytics} from '@lykkex/lykke.js';

class AnalyticsService {
  private googleAnalyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
  private amplitudeId = process.env.REACT_APP_AMPLITUDE_ID;

  init = () => {
    if (this.googleAnalyticsId) {
      GoogleAnalytics.setup(this.googleAnalyticsId);
    }
    if (this.amplitudeId) {
      Amplitude.setup(this.amplitudeId);
    }
  };

  pageview = (path: string) => {
    if (this.googleAnalyticsId) {
      GoogleAnalytics.pageview(path);
    }
  };

  track = (event: EventModel) => {
    if (this.amplitudeId) {
      Amplitude.track(event);
    }
  };

  identify = (traits: object) => {
    if (this.amplitudeId) {
      Amplitude.identify(traits);
    }
  };
}

export default new AnalyticsService();
