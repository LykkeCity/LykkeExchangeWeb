import {GoogleAnalytics} from '@lykkex/lykke.js';

class AnalyticsService {
  private googleAnalyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

  init = () => {
    if (this.googleAnalyticsId) {
      GoogleAnalytics.setup(this.googleAnalyticsId);
    }
  };

  pageview = (path: string) => {
    if (this.googleAnalyticsId) {
      GoogleAnalytics.pageview(path);
    }
  };
}

export default new AnalyticsService();
