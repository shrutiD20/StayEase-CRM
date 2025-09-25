import { LightningElement, api, wire } from 'lwc';
import getPropertyAnalytics from '@salesforce/apex/HostAnalyticsController.getPropertyAnalytics';

export default class HostAnalyticsDashboard extends LightningElement {
    @api recordId; // Host User ID
    properties = [];

    @wire(getPropertyAnalytics, { hostId: '$recordId' })
    wiredAnalytics({ error, data }) {
        if (data) {
            this.properties = data.map(item => ({
                propertyId: item.propertyId,
                totalRent: item.totalRent
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.properties = [];
        }
    }
}