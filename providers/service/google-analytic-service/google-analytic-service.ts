import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Injectable()
export class GoogleAnalyticService {

  constructor(private googleAnalytics: GoogleAnalytics) {
  }

  public register() {
      this.googleAnalytics.startTrackerWithId('UA-123160521-1')
      .then(() => {
        console.log('Google analytics is ready now for mobile-app');
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  public trackView(name:string) {
    this.googleAnalytics.trackView(name)
    .then(() => {
      console.log('Tracking view'+ name);
    })
    .catch(e => console.log('Error tracking page', e));
}
}
